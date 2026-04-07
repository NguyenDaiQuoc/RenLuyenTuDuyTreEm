import { motion } from "motion/react";
import { Card } from "../components/ui/Card";
import { useUserStore } from "../store/useUserStore";
import { Link } from "react-router-dom";
import { Calculator, FlaskConical, Leaf, Trophy, ArrowRight, Star, Sparkles, Rocket } from "lucide-react";
import { Button } from "../components/ui/Button";

const SUBJECTS = [
  {
    id: 'math',
    name: 'Math',
    icon: <Calculator className="w-12 h-12" />,
    description: 'Numbers, shapes, and logic puzzles!',
    color: 'bg-blue-500',
    lightColor: 'bg-blue-100',
    textColor: 'text-blue-600',
  },
  {
    id: 'science',
    name: 'Natural Science',
    icon: <FlaskConical className="w-12 h-12" />,
    description: 'Experiments, animals, and how things work!',
    color: 'bg-green-500',
    lightColor: 'bg-green-100',
    textColor: 'text-green-600',
  },
  {
    id: 'logic',
    name: 'Logical Thinking',
    icon: <Sparkles className="w-12 h-12" />,
    description: 'Puzzles, patterns, and brain games!',
    color: 'bg-purple-500',
    lightColor: 'bg-purple-100',
    textColor: 'text-purple-600',
  }
];

import { useTranslation } from "react-i18next";
import { getXPForNextLevel } from "../utils/progression";
import { collection, query, getDocs, where } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { useState, useEffect } from "react";

import { DailyQuests } from "../components/game/DailyQuests";
import { PetCard } from "../components/game/PetCard";
import { Flame } from "lucide-react";

export const Dashboard = () => {
  const { user } = useUserStore();
  const { t } = useTranslation();
  const [subjectProgress, setSubjectProgress] = useState<Record<string, number>>({});

  useEffect(() => {
    const fetchAllProgress = async () => {
      if (!user) return;
      const progressMap: Record<string, number> = {};
      
      for (const subject of SUBJECTS) {
        const path = `users/${user.uid}/progress`;
        try {
          const q = query(collection(db, path), where('subjectId', '==', subject.id), where('completed', '==', true));
          const snapshot = await getDocs(q);
          progressMap[subject.id] = snapshot.size;
        } catch (error) {
          console.error(`Error fetching progress for ${subject.id}:`, error);
        }
      }
      setSubjectProgress(progressMap);
    };

    fetchAllProgress();
  }, [user]);

  const xpToNext = user ? getXPForNextLevel(user.level) : 100;
  const progress = user ? (user.xp / xpToNext) * 100 : 0;

  return (
    <div className="container mx-auto px-6 py-12 space-y-12">
      {/* Welcome Header */}
      <header className="flex flex-col md:flex-row items-center gap-8 justify-between">
        <div className="space-y-2 text-center md:text-left">
          <h1 className="text-5xl font-black dark:text-white transition-colors">
            {t('dashboard.welcome', { name: user?.username })} 👋
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 font-medium">
            {t('dashboard.welcome_subtitle', { defaultValue: 'What do you want to learn today?' })}
          </p>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
          <Card className="px-8 py-4 flex items-center gap-4 border-2 border-yellow-200 dark:border-yellow-900/30 bg-white dark:bg-slate-900 transition-colors">
            <div className="bg-yellow-100 dark:bg-yellow-900/20 p-2 rounded-xl">
              <Trophy className="text-yellow-600 dark:text-yellow-500 w-8 h-8" />
            </div>
            <div>
              <div className="text-2xl font-black text-yellow-700 dark:text-yellow-500">{user?.xp}</div>
              <div className="text-xs font-bold text-yellow-600 dark:text-yellow-600/70 uppercase tracking-wider">{t('common.xp')}</div>
            </div>
          </Card>
          
          <Card className="px-8 py-4 flex flex-col justify-center gap-2 border-2 border-brand-blue/20 bg-white dark:bg-slate-900 transition-colors min-w-[200px]">
            <div className="flex items-center justify-between">
              <span className="text-xs font-black text-brand-blue uppercase tracking-wider">{t('common.level')} {user?.level}</span>
              <span className="text-[10px] font-bold text-slate-400">{user?.xp} / {xpToNext}</span>
            </div>
            <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
              <motion.div 
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                className="h-full bg-gradient-to-r from-brand-blue to-brand-purple"
              />
            </div>
            <div className="text-[10px] font-bold text-slate-400 text-center">
              {t('dashboard.xp_needed', { xp: xpToNext - (user?.xp || 0), level: (user?.level || 0) + 1 })}
            </div>
          </Card>
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-12">
          {/* Subjects Grid */}
          <div className="space-y-6">
            <h2 className="text-3xl font-black dark:text-white transition-colors">{t('dashboard.subjects')}</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {SUBJECTS.map((subject, index) => (
                <Link key={subject.id} to={`/subject/${subject.id}`}>
                  <Card 
                    delay={index * 0.1}
                    className="h-full group cursor-pointer overflow-hidden relative bg-white dark:bg-slate-900 dark:border-slate-800 transition-colors"
                  >
                    <div className={`${subject.lightColor} dark:bg-opacity-10 ${subject.textColor} w-24 h-24 rounded-3xl flex items-center justify-center mb-8 group-hover:scale-110 transition-transform duration-500`}>
                      {subject.icon}
                    </div>
                    <h2 className="text-3xl font-black mb-4 dark:text-white">{t(`subjects.${subject.id}.name`, { defaultValue: subject.name })}</h2>
                    <p className="text-slate-600 dark:text-slate-400 text-lg mb-8 leading-relaxed">
                      {t(`subjects.${subject.id}.desc`, { defaultValue: subject.description })}
                    </p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2 font-display font-bold text-lg group-hover:gap-4 transition-all">
                        <span className={subject.textColor}>{t('common.explore')}</span>
                        <ArrowRight className={subject.textColor} />
                      </div>
                      <div className="flex items-center gap-1 text-yellow-500 font-black">
                        <Star className="w-5 h-5 fill-current" />
                        <span>{subjectProgress[subject.id] || 0}/300</span>
                      </div>
                    </div>
                    
                    <div className={`absolute -bottom-12 -right-12 w-32 h-32 ${subject.color} opacity-5 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700`} />
                  </Card>
                </Link>
              ))}
            </div>
          </div>

          {/* Creative Lab & Battle Banners */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <Link to="/creative-lab">
              <Card className="bg-gradient-to-r from-brand-yellow to-orange-500 p-8 text-white h-full flex flex-col justify-between gap-6 overflow-hidden relative cursor-pointer group">
                <div className="space-y-4 relative z-10">
                  <h2 className="text-3xl font-black">{t('dashboard.creative_lab_title')}</h2>
                  <p className="text-lg opacity-90">
                    {t('dashboard.creative_lab_desc')}
                  </p>
                  <Button variant="outline" className="bg-white/20 border-white/40 text-white hover:bg-white/30">
                    {t('common.enter')}
                  </Button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              </Card>
            </Link>

            <Link to="/battle">
              <Card className="bg-gradient-to-r from-red-500 to-brand-purple p-8 text-white h-full flex flex-col justify-between gap-6 overflow-hidden relative cursor-pointer group">
                <div className="space-y-4 relative z-10">
                  <h2 className="text-3xl font-black">{t('dashboard.battle_title')}</h2>
                  <p className="text-lg opacity-90">
                    {t('dashboard.battle_desc')}
                  </p>
                  <Button variant="outline" className="bg-white/20 border-white/40 text-white hover:bg-white/30">
                    {t('common.find_match')}
                  </Button>
                </div>
                <div className="absolute top-0 right-0 w-64 h-64 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              </Card>
            </Link>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-8">
          <PetCard />
          <DailyQuests />
          
          <Card className="p-8 bg-gradient-to-br from-brand-purple to-purple-600 text-white border-none shadow-xl shadow-purple-200 dark:shadow-none overflow-hidden relative">
            <div className="relative z-10">
              <h3 className="text-2xl font-black mb-4">{t('dashboard.streak_title')}</h3>
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-white/20 p-4 rounded-3xl">
                  <Flame className="w-10 h-10" />
                </div>
                <div>
                  <div className="text-4xl font-black">{user?.streak || 0} {t('dashboard.days')}</div>
                  <div className="text-white/80 font-bold">{t('dashboard.keep_it_up')}</div>
                </div>
              </div>
              <Button variant="secondary" className="w-full bg-white text-brand-purple hover:bg-slate-50 border-none py-6 text-lg">
                {t('dashboard.view_leaderboard')}
              </Button>
            </div>
            <div className="absolute -bottom-12 -right-12 w-48 h-48 bg-white/10 rounded-full blur-3xl" />
          </Card>

          {/* Weekly Challenge Banner */}
          <Card className="bg-gradient-to-r from-brand-blue to-brand-purple p-8 text-white flex flex-col gap-6 overflow-hidden relative">
            <div className="space-y-4 relative z-10">
              <h2 className="text-2xl font-black">{t('dashboard.weekly_challenge_title')}</h2>
              <p className="text-sm opacity-90 leading-relaxed">
                {t('dashboard.weekly_challenge_desc')}
              </p>
              <Button variant="outline" className="bg-white/20 border-white/40 text-white hover:bg-white/30 w-full">
                {t('dashboard.view_challenge')}
              </Button>
            </div>
            <div className="absolute -bottom-8 -right-8 opacity-20">
              <Rocket className="w-32 h-32 text-white animate-bounce" />
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};
