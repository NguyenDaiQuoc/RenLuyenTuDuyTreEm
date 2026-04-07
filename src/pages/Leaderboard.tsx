import { useState, useEffect } from "react";
import { motion } from "motion/react";
import { Card } from "../components/ui/Card";
import { useUserStore } from "../store/useUserStore";
import { Trophy, Medal, Crown, Loader2 } from "lucide-react";
import { cn } from "../lib/utils";
import { collection, query, orderBy, limit, onSnapshot } from "firebase/firestore";
import { db } from "../firebase";
import { UserProfile } from "../types";
import { useTranslation } from "react-i18next";

export const Leaderboard = () => {
  const { t } = useTranslation();
  const { user } = useUserStore();
  const [leaders, setLeaders] = useState<UserProfile[]>([]);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState<number | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, "users"),
      orderBy("xp", "desc"),
      limit(20)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const users = snapshot.docs.map(doc => doc.data() as UserProfile);
      setLeaders(users);
      
      if (user) {
        const rank = users.findIndex(u => u.uid === user.uid);
        if (rank !== -1) setUserRank(rank + 1);
      }
      
      setLoading(false);
    }, (error) => {
      console.error("Error fetching leaderboard:", error);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <Loader2 className="w-12 h-12 text-brand-blue animate-spin" />
      </div>
    );
  }

  const top3 = leaders.slice(0, 3);
  const others = leaders.slice(3);

  return (
    <div className="container mx-auto px-6 py-12 space-y-12">
      <header className="text-center space-y-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-yellow-100 w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-yellow-100"
        >
          <Trophy className="text-yellow-600 w-12 h-12" />
        </motion.div>
        <h1 className="text-5xl font-black">{t('leaderboard.title')}</h1>
        <p className="text-xl text-slate-500 font-medium">{t('leaderboard.subtitle')}</p>
      </header>

      {/* Top 3 Podium */}
      <div className="flex flex-col md:flex-row items-end justify-center gap-8 pt-12">
        {/* 2nd Place */}
        {top3[1] && (
          <PodiumItem 
            user={top3[1]} 
            rank={2} 
            height="h-48" 
            color="bg-slate-200" 
            icon={<Medal className="text-slate-500" />}
          />
        )}
        {/* 1st Place */}
        {top3[0] && (
          <PodiumItem 
            user={top3[0]} 
            rank={1} 
            height="h-64" 
            color="bg-yellow-400" 
            icon={<Crown className="text-yellow-700 w-12 h-12" />}
          />
        )}
        {/* 3rd Place */}
        {top3[2] && (
          <PodiumItem 
            user={top3[2]} 
            rank={3} 
            height="h-40" 
            color="bg-orange-200" 
            icon={<Medal className="text-orange-600" />}
          />
        )}
      </div>

      {/* List View */}
      <div className="max-w-3xl mx-auto space-y-4">
        {others.map((player, index) => (
          <motion.div
            key={player.uid}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Card className={cn(
              "flex items-center justify-between p-6 hover:translate-x-2 transition-transform",
              player.uid === user?.uid && "border-brand-blue border-2"
            )}>
              <div className="flex items-center gap-6">
                <span className="text-2xl font-black text-slate-300 w-8">#{index + 4}</span>
                <img src={player.avatar} alt={player.username} className="w-16 h-16 rounded-2xl border-2 border-slate-100" />
                <div>
                  <h3 className="text-xl font-bold">{player.username} {player.uid === user?.uid && t('leaderboard.you')}</h3>
                  <div className="flex items-center gap-2 text-slate-400 text-sm font-bold">
                    <span>{t('leaderboard.level')} {player.level}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black text-brand-blue">{player.xp}</div>
                <div className="text-xs font-bold text-slate-400 uppercase">{t('leaderboard.xp')}</div>
              </div>
            </Card>
          </motion.div>
        ))}

        {/* Current User Rank if not in top 20 */}
        {user && !userRank && (
          <Card className="bg-brand-blue text-white p-6 mt-12 border-4 border-blue-400 shadow-2xl shadow-blue-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-6">
                <span className="text-2xl font-black opacity-50 w-8">?</span>
                <img src={user.avatar} alt={user.username} className="w-16 h-16 rounded-2xl border-2 border-white/20" />
                <div>
                  <h3 className="text-xl font-bold">{user.username} {t('leaderboard.you')}</h3>
                  <div className="flex items-center gap-2 opacity-70 text-sm font-bold">
                    <span>{t('leaderboard.level')} {user.level}</span>
                  </div>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-black">{user.xp}</div>
                <div className="text-xs font-bold opacity-70 uppercase">{t('leaderboard.xp')}</div>
              </div>
            </div>
          </Card>
        )}
      </div>
    </div>
  );
};

const PodiumItem = ({ user, rank, height, color, icon }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    animate={{ opacity: 1, y: 0 }}
    className="flex flex-col items-center gap-4 w-40"
  >
    <div className="relative">
      <img src={user.avatar} alt={user.username} className="w-24 h-24 rounded-[2rem] border-4 border-white shadow-xl" />
      <div className={cn("absolute -top-6 left-1/2 -translate-x-1/2", rank === 1 && "scale-125")}>
        {icon}
      </div>
    </div>
    <div className="text-center">
      <h3 className="font-black text-lg truncate w-full">{user.username}</h3>
      <p className="text-brand-blue font-bold">{user.xp} XP</p>
    </div>
    <div className={cn("w-full rounded-t-[2rem] flex flex-col items-center justify-center shadow-lg", color, height)}>
      <span className="text-5xl font-black opacity-30">#{rank}</span>
    </div>
  </motion.div>
);
