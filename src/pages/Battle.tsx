import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import { useUserStore } from "../store/useUserStore";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Mascot } from "../components/ui/Mascot";
import { QuizCard } from "../components/game/QuizCard";
import { Trophy, Users, Loader2, Sparkles, X, User as UserIcon } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { playSound } from "../utils/sounds";
import { cn } from "../lib/utils";
import { doc, updateDoc, increment } from "firebase/firestore";
import { db } from "../firebase";
import { useTranslation } from "react-i18next";

const socket = io();

export const Battle = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const navigate = useNavigate();
  const [status, setStatus] = useState<'idle' | 'searching' | 'battle' | 'finished'>('idle');
  const [opponent, setOpponent] = useState<string | null>(null);
  const [battleId, setBattleId] = useState<string | null>(null);
  const [questions, setQuestions] = useState<any[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [scores, setScores] = useState<Record<string, number>>({});
  const [xpAwarded, setXpAwarded] = useState(false);

  useEffect(() => {
    if (!user) return;

    socket.on("battle-found", ({ battleId, opponent, questions }) => {
      setBattleId(battleId);
      setOpponent(opponent);
      setQuestions(questions);
      setStatus('battle');
      playSound('levelUp');
    });

    socket.on(`score-update-${battleId}`, (newScores) => {
      setScores(newScores);
    });

    return () => {
      socket.off("battle-found");
      if (battleId) socket.off(`score-update-${battleId}`);
    };
  }, [user, battleId]);

  useEffect(() => {
    if (status === 'finished' && !xpAwarded && user) {
      const myScore = scores[user.uid] || 0;
      const opponentId = Object.keys(scores).find(id => id !== user.uid);
      const opponentScore = opponentId ? scores[opponentId] : 0;
      
      // Award XP based on performance and victory
      const victoryBonus = myScore > opponentScore ? 200 : 50;
      const totalXp = myScore + victoryBonus;

      const awardXp = async () => {
        try {
          await updateDoc(doc(db, "users", user.uid), {
            xp: increment(totalXp),
            level: Math.floor((user.xp + totalXp) / 1000) + 1
          });
          setXpAwarded(true);
        } catch (error) {
          console.error("Error awarding XP:", error);
        }
      };

      awardXp();
    }
  }, [status, xpAwarded, user, scores]);

  const startSearch = () => {
    if (!user) return;
    setStatus('searching');
    socket.emit("join-queue", { userId: user.uid, username: user.username });
  };

  const handleAnswer = (isCorrect: boolean) => {
    if (!battleId || !user) return;
    socket.emit("submit-battle-answer", { battleId, userId: user.uid, isCorrect });
    
    if (currentStep < questions.length - 1) {
      setTimeout(() => setCurrentStep(s => s + 1), 1500);
    } else {
      setTimeout(() => setStatus('finished'), 1500);
    }
  };

  const currentStep = currentQuestion;
  const setCurrentStep = setCurrentQuestion;

  if (status === 'idle') {
    return (
      <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center text-center space-y-12">
        <Mascot size="lg" expression="excited" speechBubble={t('battle.mascot_ready')} />
        <div className="space-y-4">
          <h1 className="text-6xl font-black">{t('battle.title')}</h1>
          <p className="text-2xl text-slate-500 font-medium max-w-xl">
            {t('battle.subtitle')}
          </p>
        </div>
        <Button size="lg" className="px-12 py-8 text-2xl rounded-[2rem]" onClick={startSearch}>
          <Users className="w-8 h-8" />
          {t('battle.find_btn')}
        </Button>
      </div>
    );
  }

  if (status === 'searching') {
    return (
      <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center text-center space-y-12">
        <div className="relative">
          <Mascot size="lg" expression="thinking" />
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
            className="absolute -top-4 -right-4"
          >
            <Loader2 className="w-12 h-12 text-brand-blue" />
          </motion.div>
        </div>
        <div className="space-y-4">
          <h2 className="text-4xl font-black">{t('battle.searching')}</h2>
          <p className="text-xl text-slate-500">{t('battle.searching_subtitle')}</p>
        </div>
        <Button variant="outline" size="lg" onClick={() => setStatus('idle')}>
          {t('battle.cancel_btn')}
        </Button>
      </div>
    );
  }

  if (status === 'battle') {
    return (
      <div className="container mx-auto px-6 py-12 space-y-12">
        <header className="flex items-center justify-between bg-white p-6 rounded-3xl shadow-xl border-2 border-slate-100">
          <div className="flex items-center gap-4">
            <div className="bg-brand-blue p-3 rounded-2xl text-white">
              <UserIcon className="w-6 h-6" />
            </div>
            <div>
              <div className="font-black text-lg">{user?.username}</div>
              <div className="text-brand-blue font-bold">{scores[user?.uid || ''] || 0} XP</div>
            </div>
          </div>
          
          <div className="bg-slate-100 px-6 py-2 rounded-full font-black text-slate-400 text-xl">{t('battle.vs')}</div>

          <div className="flex items-center gap-4 text-right">
            <div>
              <div className="font-black text-lg">{opponent}</div>
              <div className="text-brand-purple font-bold">{scores[Object.keys(scores).find(id => id !== user?.uid) || ''] || 0} XP</div>
            </div>
            <div className="bg-brand-purple p-3 rounded-2xl text-white">
              <UserIcon className="w-6 h-6" />
            </div>
          </div>
        </header>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStep}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -50 }}
          >
            <QuizCard 
              stage={{
                ...questions[currentStep],
                interactionType: questions[currentStep].interactionType || "multiple-choice",
                question: questions[currentStep].prompt || questions[currentStep].question,
                type: questions[currentStep].type || "logic"
              }}
              onCorrect={() => handleAnswer(true)}
              onIncorrect={() => handleAnswer(false)}
            />
          </motion.div>
        </AnimatePresence>
      </div>
    );
  }

  if (status === 'finished') {
    const myScore = scores[user?.uid || ''] || 0;
    const opponentId = Object.keys(scores).find(id => id !== user?.uid);
    const opponentScore = opponentId ? scores[opponentId] : 0;
    const isWinner = myScore > opponentScore;

    return (
      <div className="container mx-auto px-6 py-20 flex flex-col items-center justify-center text-center space-y-12">
        <Mascot size="lg" expression={isWinner ? "excited" : "sad"} />
        <div className="space-y-4">
          <h1 className="text-6xl font-black">{isWinner ? t('battle.victory') : t('battle.good_game')}</h1>
          <p className="text-2xl text-slate-500">
            {isWinner ? t('battle.defeated', { opponent }) : t('battle.faster', { opponent })}
          </p>
        </div>

        <div className="grid grid-cols-2 gap-8 w-full max-w-2xl">
          <Card className={cn("p-8 border-b-8", isWinner ? "border-green-500" : "border-slate-200")}>
            <div className="text-sm font-bold text-slate-400 uppercase mb-2">{t('battle.your_score')}</div>
            <div className="text-5xl font-black">{myScore}</div>
          </Card>
          <Card className={cn("p-8 border-b-8", !isWinner ? "border-green-500" : "border-slate-200")}>
            <div className="text-sm font-bold text-slate-400 uppercase mb-2">{t('battle.opponent_score', { opponent })}</div>
            <div className="text-5xl font-black">{opponentScore}</div>
          </Card>
        </div>

        <Button size="lg" className="px-12 py-6 text-xl" onClick={() => navigate('/dashboard')}>
          {t('battle.back_btn')}
        </Button>
      </div>
    );
  }

  return null;
};
