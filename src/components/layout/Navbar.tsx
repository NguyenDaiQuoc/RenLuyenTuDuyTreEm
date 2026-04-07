import { Link, useNavigate } from 'react-router-dom';
import { auth } from '../../firebase';
import { signOut } from 'firebase/auth';
import { useUserStore } from '../../store/useUserStore';
import { Button } from '../ui/Button';
import { Brain, LogOut, Trophy, LayoutDashboard, Sparkles, Zap, Heart, Activity } from 'lucide-react';
import { ThemeToggle } from '../ui/ThemeToggle';
import { LanguageSwitcher } from '../ui/LanguageSwitcher';
import { getXPForNextLevel } from '../../utils/progression';
import { useTranslation } from 'react-i18next';
import { motion } from 'motion/react';
import { cn } from '../../lib/utils';

export const Navbar = () => {
  const { user } = useUserStore();
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleLogout = async () => {
    await signOut(auth);
    navigate('/');
  };

  const xpToNext = user ? getXPForNextLevel(user.level) : 100;
  const progress = user ? (user.xp / xpToNext) * 100 : 0;

  return (
    <nav className="glass sticky top-0 z-50 px-6 py-4 flex items-center justify-between mx-4 mt-4 rounded-3xl bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 transition-colors">
      <div className="flex items-center gap-8">
        <Link to="/dashboard" className="flex items-center gap-2 group">
          <div className="bg-brand-blue p-2 rounded-xl group-hover:rotate-12 transition-transform shadow-lg shadow-brand-blue/20">
            <Brain className="text-white w-6 h-6" />
          </div>
          <span className="text-2xl font-display font-black bg-gradient-to-r from-brand-blue to-brand-purple bg-clip-text text-transparent hidden sm:block">
            BrainyKids
          </span>
        </Link>

        <div className="hidden lg:flex items-center gap-6">
          <Link to="/dashboard" className="font-display font-bold text-slate-500 dark:text-slate-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors flex items-center gap-2">
            <LayoutDashboard className="w-5 h-5" />
            {t('nav.dashboard')}
          </Link>
          <Link to="/leaderboard" className="font-display font-bold text-slate-500 dark:text-slate-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors flex items-center gap-2">
            <Trophy className="w-5 h-5" />
            {t('nav.leaderboard')}
          </Link>
          <Link to="/analytics" className="font-display font-bold text-slate-500 dark:text-slate-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors flex items-center gap-2">
            <Activity className="w-5 h-5" />
            {t('nav.analytics', { defaultValue: 'Analytics' })}
          </Link>
          <Link to="/battle" className="font-display font-bold text-slate-500 dark:text-slate-400 hover:text-brand-blue dark:hover:text-brand-blue transition-colors flex items-center gap-2">
            <Zap className="w-5 h-5" />
            {t('nav.battle')}
          </Link>
          <Link to="/premium" className="font-display font-bold text-brand-purple hover:text-brand-purple/80 transition-colors flex items-center gap-2">
            <Sparkles className="w-5 h-5" />
            {t('nav.premium', { defaultValue: 'Premium' })}
          </Link>
        </div>
      </div>

      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden md:flex items-center gap-4">
          {/* Hearts */}
          <Link to="/premium" className="flex items-center gap-2 bg-red-50 dark:bg-red-900/20 px-3 py-1.5 rounded-2xl border-2 border-red-100 dark:border-red-900/30 hover:scale-105 transition-transform">
            <Heart className={cn("w-5 h-5 text-red-500", user?.hearts && user.hearts > 0 ? "fill-red-500" : "")} />
            <span className="font-display font-black text-red-600 dark:text-red-500 text-sm">
              {user?.isPremium ? "∞" : user?.hearts}
            </span>
          </Link>

          <div className="flex flex-col items-end gap-1">
            <div className="flex items-center gap-2">
              <span className="text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider">
                {t('common.level')} {user?.level}
              </span>
              <div className="w-32 h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
                <motion.div 
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  className="h-full bg-gradient-to-r from-brand-blue to-brand-purple"
                />
              </div>
            </div>
            <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
              {user?.xp} / {xpToNext} XP
            </span>
          </div>
          
          <div className="flex items-center gap-2 bg-yellow-100 dark:bg-yellow-900/20 px-3 py-1.5 rounded-2xl border-2 border-yellow-200 dark:border-yellow-900/30">
            <Trophy className="w-4 h-4 text-yellow-600 dark:text-yellow-500" />
            <span className="font-display font-black text-yellow-700 dark:text-yellow-500 text-sm">{user?.xp}</span>
          </div>
        </div>

        <div className="flex items-center gap-2 md:gap-3">
          <LanguageSwitcher />
          <ThemeToggle />
          <div className="h-8 w-px bg-slate-200 dark:bg-slate-800 mx-1 hidden sm:block" />
          <div className="flex items-center gap-3">
            <img 
              src={user?.avatar} 
              alt="Avatar" 
              className="w-10 h-10 rounded-2xl border-2 border-brand-blue shadow-lg shadow-brand-blue/10"
            />
            <Button variant="ghost" size="sm" onClick={handleLogout} className="text-slate-500 hover:text-red-500 dark:text-slate-400 dark:hover:text-red-400">
              <LogOut className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </nav>
  );
};
