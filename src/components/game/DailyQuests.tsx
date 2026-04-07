import { motion } from "motion/react";
import { Card } from "../ui/Card";
import { ProgressBar } from "./ProgressBar";
import { CheckCircle2, Trophy, Zap, BookOpen, Flame, Star } from "lucide-react";
import { useUserStore } from "../../store/useUserStore";
import { useTranslation } from "react-i18next";
import { cn } from "../../lib/utils";

export const DailyQuests = () => {
  const { user } = useUserStore();
  const { t } = useTranslation();

  if (!user || !user.dailyQuests) return null;

  return (
    <Card className="p-6 bg-white dark:bg-slate-900 border-b-8 border-slate-200 dark:border-slate-800 transition-colors">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-black flex items-center gap-2 dark:text-white">
          <Trophy className="w-6 h-6 text-brand-yellow" />
          {t('dashboard.daily_quests')}
        </h3>
      </div>

      <div className="space-y-6">
        {user.dailyQuests.map((quest) => (
          <div key={quest.id} className="space-y-2">
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <div className={cn(
                  "p-2 rounded-xl",
                  quest.type === 'xp' ? "bg-yellow-100 text-yellow-600" :
                  quest.type === 'lesson' ? "bg-blue-100 text-blue-600" :
                  "bg-orange-100 text-orange-600"
                )}>
                  {quest.type === 'xp' && <Zap className="w-4 h-4" />}
                  {quest.type === 'lesson' && <BookOpen className="w-4 h-4" />}
                  {quest.type === 'streak' && <Flame className="w-4 h-4" />}
                </div>
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  {quest.titleKey ? t(quest.titleKey) : quest.title}
                </span>
              </div>
              {quest.completed ? (
                <CheckCircle2 className="w-6 h-6 text-green-500" />
              ) : (
                <span className="text-sm font-black text-slate-400">{quest.current}/{quest.target}</span>
              )}
            </div>
            <ProgressBar 
              progress={(quest.current / quest.target) * 100} 
              color={quest.completed ? "bg-green-500" : "bg-brand-blue"} 
            />
            {quest.completed && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-xs font-black text-green-600 dark:text-green-500 flex items-center gap-1"
              >
                <Star className="w-3 h-3 fill-current" />
                {t('quests.xp_reward', { xp: quest.xpReward })}
              </motion.div>
            )}
          </div>
        ))}
      </div>
    </Card>
  );
};

