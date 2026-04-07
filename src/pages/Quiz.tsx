import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QuizCard } from "../components/game/QuizCard";
import { ProgressBar } from "../components/game/ProgressBar";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { motion, AnimatePresence } from "motion/react";
import { Trophy, Star, ArrowRight, Home, RefreshCcw, X, Heart, Loader2, Sparkles } from "lucide-react";
import { useUserStore } from "../store/useUserStore";
import { UserProfile, Stage, SubjectId } from "../types";
import { doc, updateDoc, setDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { Mascot } from "../components/ui/Mascot";
import { playSound } from "../utils/sounds";
import { cn } from "../lib/utils";
import { generateStage } from "../services/stageService";

import { useTranslation } from "react-i18next";
import { calculateXP, processXPUpdate, calculateStars } from "../utils/progression";

export const Quiz = () => {
  const { levelId } = useParams();
  const navigate = useNavigate();
  const { user, setUser, updateQuests, unlockLevel, consumeHeart, incrementExerciseCount, updatePetXP } = useUserStore();
  const { t } = useTranslation();

  const [stage, setStage] = useState<Stage | null>(null);
  const [loading, setLoading] = useState(true);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [hearts, setHearts] = useState(user?.hearts || 5);
  const [startTime] = useState(Date.now());
  const [mascotExpression, setMascotExpression] = useState<'happy' | 'thinking' | 'sad' | 'excited'>('happy');
  const [mascotSpeech, setMascotSpeech] = useState(t('quiz.mascot_start'));
  const [stars, setStars] = useState(0);
  const [outOfHearts, setOutOfHearts] = useState(false);
  const [limitReached, setLimitReached] = useState(false);

  useEffect(() => {
    const checkLimits = () => {
      if (!user) return;
      if (!user.isPremium) {
        if (user.hearts <= 0) {
          setOutOfHearts(true);
          setLoading(false);
          return false;
        }
        if (user.dailyExercisesCount >= 20) {
          setLimitReached(true);
          setLoading(false);
          return false;
        }
      }
      return true;
    };

    const fetchStage = async () => {
      if (!levelId) return;
      if (!checkLimits()) return;
      
      setLoading(true);
      const [subject, levelStr] = levelId.split('-');
      const level = parseInt(levelStr);
      const generatedStage = await generateStage(subject as SubjectId, level);
      setStage(generatedStage);
      setLoading(false);
    };
    fetchStage();
  }, [levelId, user]);

  const handleCorrect = () => {
    playSound('correct');
    setScore(1);
    setMascotExpression('excited');
    setMascotSpeech(t('quiz.mascot_correct'));
    incrementExerciseCount();
    updatePetXP(20);
    setTimeout(() => finishQuiz(1), 1500);
  };

  const handleIncorrect = () => {
    playSound('wrong');
    setScore(0);
    const success = consumeHeart();
    if (success) {
      setHearts(h => Math.max(0, h - 1));
    }
    setMascotExpression('sad');
    setMascotSpeech(t('quiz.mascot_wrong'));
    setTimeout(() => finishQuiz(0), 1500);
  };

  const finishQuiz = async (finalScore: number) => {
    playSound('levelUp');
    const finalStars = calculateStars(finalScore, 1);
    setStars(finalStars);
    setShowResult(true);
    
    if (!user || !stage) return;

    const timeTaken = (Date.now() - startTime) / 1000;
    const isPerfect = finalScore === 1;
    
    const xpEarned = calculateXP(stage.xpReward, {
      perfectScore: isPerfect,
      speedBonus: timeTaken < 30,
      streakBonus: user.streak > 1 ? user.streak : 0,
      firstWinOfDay: false 
    });

    const xpResult = processXPUpdate(user, xpEarned);
    
    const updatedProfile: UserProfile = {
      ...user,
      xp: xpResult.newXP,
      level: xpResult.newLevel,
      totalXP: xpResult.newTotalXP,
      lastActive: new Date().toISOString(),
      hearts: user.isPremium ? 999 : (finalScore === 0 ? user.hearts - 1 : user.hearts),
      dailyExercisesCount: user.dailyExercisesCount + 1,
      pet: {
        ...user.pet,
        xp: user.pet.xp + (finalScore > 0 ? 20 : 5)
      }
    };

    setUser(updatedProfile);
    updateQuests('xp', xpEarned);
    updateQuests('lesson', 1);

    // Send analytics event
    fetch('/api/analytics/event', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        userId: user.uid,
        type: finalScore > 0 ? 'lesson_complete' : 'quiz_fail',
        data: { subject: stage.subject, level: stage.level, score: finalScore }
      })
    });

    // Save progress to Firestore
    const userRef = doc(db, 'users', user.uid);
    try {
      await updateDoc(userRef, {
        xp: updatedProfile.xp,
        level: updatedProfile.level,
        totalXP: updatedProfile.totalXP,
        lastActive: updatedProfile.lastActive,
        dailyQuests: updatedProfile.dailyQuests,
        hearts: updatedProfile.hearts,
        dailyExercisesCount: updatedProfile.dailyExercisesCount,
        pet: updatedProfile.pet
      });
    } catch (error) {
      handleFirestoreError(error, OperationType.UPDATE, `users/${user.uid}`);
    }

    const progressPath = `users/${user.uid}/progress/${levelId!}`;
    const progressRef = doc(db, progressPath);
    try {
      await setDoc(progressRef, {
        levelId,
        subjectId: stage.subject,
        completed: finalScore > 0,
        stars: finalStars,
        bestScore: finalScore,
        unlocked: true
      }, { merge: true });
    } catch (error) {
      handleFirestoreError(error, OperationType.WRITE, progressPath);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <Loader2 className="w-12 h-12 text-brand-blue animate-spin" />
        <p className="text-xl font-bold text-slate-600">{t('quiz.generating')}</p>
      </div>
    );
  }

  if (outOfHearts) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-8">
        <Mascot expression="sad" speechBubble={t('quiz.out_of_hearts_mascot', { defaultValue: "Oh no! You're out of hearts. Come back tomorrow or get Premium for unlimited fun!" })} />
        <h2 className="text-4xl font-black text-slate-900 dark:text-white">{t('quiz.out_of_hearts_title', { defaultValue: "Out of Hearts!" })}</h2>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Button size="lg" onClick={() => navigate('/premium')} className="bg-brand-purple hover:bg-brand-purple/90 text-white py-8 text-xl rounded-3xl shadow-xl">
            <Sparkles className="w-6 h-6 mr-2" />
            {t('quiz.get_unlimited', { defaultValue: "Get Unlimited Hearts" })}
          </Button>
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="py-6 text-slate-500">
            {t('common.back_to_dashboard')}
          </Button>
        </div>
      </div>
    );
  }

  if (limitReached) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6 text-center space-y-8">
        <Mascot expression="thinking" speechBubble={t('quiz.limit_reached_mascot', { defaultValue: "You've reached your daily limit of 20 exercises. Great job learning today!" })} />
        <h2 className="text-4xl font-black text-slate-900 dark:text-white">{t('quiz.limit_reached_title', { defaultValue: "Daily Limit Reached" })}</h2>
        <div className="flex flex-col gap-4 w-full max-w-sm">
          <Button size="lg" onClick={() => navigate('/premium')} className="bg-brand-purple hover:bg-brand-purple/90 text-white py-8 text-xl rounded-3xl shadow-xl">
            <Sparkles className="w-6 h-6 mr-2" />
            {t('quiz.unlock_unlimited', { defaultValue: "Unlock Unlimited Exercises" })}
          </Button>
          <Button variant="ghost" onClick={() => navigate('/dashboard')} className="py-6 text-slate-500">
            {t('common.back_to_dashboard')}
          </Button>
        </div>
      </div>
    );
  }

  if (!stage) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-4">
        <p className="text-xl font-bold text-red-500">{t('quiz.error_loading')}</p>
        <Button onClick={() => navigate(-1)}>{t('common.back')}</Button>
      </div>
    );
  }

  if (showResult) {
    return (
      <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col items-center justify-center p-6 transition-colors">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="max-w-xl w-full text-center space-y-12"
        >
          <Mascot size="lg" expression="excited" speechBubble={t('quiz.result_mascot')} />
          
          <div className="space-y-4">
            <h2 className="text-6xl font-black text-slate-900 dark:text-white">{t('quiz.result_title')}</h2>
            <div className="flex justify-center gap-4 mt-4">
              {[1, 2, 3].map(s => (
                <motion.div
                  key={s}
                  initial={{ scale: 0 }}
                  animate={{ scale: s <= stars ? 1.2 : 1 }}
                  transition={{ delay: 0.5 + s * 0.2, type: 'spring' }}
                >
                  <Star className={cn("w-16 h-16", s <= stars ? "fill-yellow-400 text-yellow-400 drop-shadow-xl" : "text-slate-200 dark:text-slate-800")} />
                </motion.div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-6">
            <Card className="p-8 border-b-8 border-blue-200 dark:border-blue-900 bg-white dark:bg-slate-900 transition-colors">
              <div className="text-5xl font-black text-blue-600 dark:text-blue-500">{score}/1</div>
              <div className="text-sm font-bold text-blue-400 dark:text-blue-600 uppercase tracking-widest mt-2">{t('common.correct')}</div>
            </Card>
            <Card className="p-8 border-b-8 border-yellow-200 dark:border-yellow-900 bg-white dark:bg-slate-900 transition-colors">
              <div className="text-5xl font-black text-yellow-600 dark:text-yellow-500">+{stars * 50}</div>
              <div className="text-sm font-bold text-yellow-400 dark:text-yellow-600 uppercase tracking-widest mt-2">{t('common.xp')}</div>
            </Card>
          </div>

          <div className="flex flex-col gap-4">
            <Button size="lg" onClick={() => navigate('/dashboard')} className="w-full py-8 text-2xl rounded-[2rem]">
              <Home className="w-6 h-6" />
              {t('quiz.continue')}
            </Button>
            <Button variant="outline" onClick={() => window.location.reload()} className="w-full py-8 text-2xl rounded-[2rem] dark:border-slate-800 dark:text-white">
              <RefreshCcw className="w-6 h-6" />
              {t('quiz.play_again')}
            </Button>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 flex flex-col transition-colors">
      {/* Quiz Header */}
      <header className="px-6 py-8 flex items-center gap-8">
        <Button variant="ghost" size="sm" onClick={() => navigate(-1)} className="rounded-full w-12 h-12 p-0 dark:hover:bg-slate-900">
          <X className="w-8 h-8 text-slate-400" />
        </Button>
        
        <div className="flex-1">
          <ProgressBar progress={score ? 100 : 0} color="bg-brand-blue" />
        </div>

        <div className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-4 py-2 rounded-2xl">
          <Heart className="w-6 h-6 text-red-500 fill-red-500" />
          <span className="text-xl font-black text-red-600 dark:text-red-500">{hearts}</span>
        </div>
      </header>

      <div className="flex-1 container mx-auto px-6 py-12 flex flex-col lg:flex-row items-center justify-center gap-12">
        {/* Mascot Feedback */}
        <div className="hidden lg:block w-64">
          <Mascot expression={mascotExpression} speechBubble={mascotSpeech} />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={stage.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
            className="flex-1 max-w-2xl"
          >
            <QuizCard 
              stage={stage}
              onCorrect={handleCorrect}
              onIncorrect={handleIncorrect}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};
