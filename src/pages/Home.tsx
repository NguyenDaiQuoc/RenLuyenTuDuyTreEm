import { motion } from "motion/react";
import { Button } from "../components/ui/Button";
import { Link } from "react-router-dom";
import { Brain, Star, Rocket, Sparkles, Play } from "lucide-react";
import { Mascot } from "../components/ui/Mascot";

import { useTranslation } from "react-i18next";

export const Home = () => {
  const { t } = useTranslation();

  return (
    <div className="min-h-screen bg-white dark:bg-slate-950 overflow-hidden font-display transition-colors">
      {/* Hero Section */}
      <section className="container mx-auto px-6 pt-20 pb-32 flex flex-col lg:flex-row items-center justify-between gap-12">
        <div className="flex-1 text-center lg:text-left space-y-8 max-w-2xl">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-900/20 text-brand-blue px-4 py-2 rounded-full font-bold text-sm"
          >
            <Sparkles className="w-4 h-4" />
            <span>{t('home.hero_badge')}</span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-6xl lg:text-8xl font-black leading-tight text-slate-900 dark:text-white"
          >
            {t('home.hero_title_1')} <span className="text-brand-blue">{t('home.hero_title_2')}</span>,<br />
            {t('home.hero_title_3')} <span className="text-brand-purple">{t('home.hero_title_4')}</span>.
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xl lg:text-2xl text-slate-500 dark:text-slate-400 leading-relaxed"
          >
            {t('home.hero_desc')}
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-col sm:flex-row gap-4"
          >
            <Link to="/login">
              <Button size="lg" className="w-full sm:w-auto text-xl px-12 py-8 rounded-[2rem] shadow-xl shadow-blue-200 dark:shadow-none">
                <Play className="w-6 h-6 fill-white" />
                {t('common.get_started')}
              </Button>
            </Link>
            <Link to="/login">
              <Button variant="outline" size="lg" className="w-full sm:w-auto text-xl px-12 py-8 rounded-[2rem] dark:border-slate-800 dark:text-white">
                {t('home.already_have_account')}
              </Button>
            </Link>
          </motion.div>
        </div>

        <div className="flex-1 relative">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="relative z-10"
          >
            <Mascot size="xl" expression="excited" speechBubble={t('home.mascot_speech')} />
          </motion.div>
          
          {/* Background Decorative Circles */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-blue-50 dark:bg-blue-900/10 rounded-full -z-10 blur-3xl opacity-50" />
          <div className="absolute top-0 right-0 w-32 h-32 bg-yellow-100 dark:bg-yellow-900/10 rounded-full -z-10 blur-2xl animate-pulse" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-100 dark:bg-purple-900/10 rounded-full -z-10 blur-2xl animate-bounce" />
        </div>
      </section>

      {/* Stats Section */}
      <section className="border-t border-slate-100 dark:border-slate-900 py-12">
        <div className="container mx-auto px-6 flex flex-wrap justify-center gap-12 lg:gap-24">
          <StatItem label={t('home.stat_explorers')} value="1M+" />
          <StatItem label={t('home.stat_completed')} value="50M+" />
          <StatItem label={t('home.stat_subjects')} value="10+" />
          <StatItem label={t('home.stat_rating')} value="4.9/5" />
        </div>
      </section>
    </div>
  );
};

const StatItem = ({ label, value }: { label: string, value: string }) => (
  <div className="text-center">
    <div className="text-4xl font-black text-slate-800 dark:text-white">{value}</div>
    <div className="text-sm font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">{label}</div>
  </div>
);
