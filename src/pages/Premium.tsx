import { motion } from "motion/react";
import { Card } from "../components/ui/Card";
import { Button } from "../components/ui/Button";
import { Check, Sparkles, Heart, Zap, Trophy, ShieldCheck, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useUserStore } from "../store/useUserStore";
import { doc, updateDoc } from "firebase/firestore";
import { db, handleFirestoreError, OperationType } from "../firebase";
import { useTranslation } from "react-i18next";

export const Premium = () => {
  const navigate = useNavigate();
  const { user, setUser } = useUserStore();
  const { t } = useTranslation();

  const handleSubscribe = async (plan: 'monthly' | 'yearly') => {
    if (!user) return;
    
    try {
      const res = await fetch('/api/stripe/create-checkout', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ userId: user.uid, plan, email: user.email || "" })
      });
      const data = await res.json();
      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error(error);
    }
  };

  const features = [
    { icon: <Heart className="text-red-500" />, title: "Unlimited Hearts", desc: "Never stop learning, even if you make mistakes!" },
    { icon: <Zap className="text-yellow-500" />, title: "Unlimited AI Exercises", desc: "Generate as many fresh challenges as you want." },
    { icon: <Trophy className="text-brand-purple" />, title: "PvP Ranked Mode", desc: "Compete with friends and climb the global leaderboard." },
    { icon: <ShieldCheck className="text-green-500" />, title: "Parent Analytics", desc: "Detailed insights into your child's cognitive growth." },
    { icon: <Sparkles className="text-blue-500" />, title: "Exclusive Skins", desc: "Unlock unique avatars and pet appearances." }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 transition-colors py-12 px-6">
      <div className="max-w-4xl mx-auto space-y-12">
        <header className="flex items-center justify-between">
          <Button variant="ghost" onClick={() => navigate(-1)} className="rounded-full">
            <ArrowLeft className="w-6 h-6 mr-2" />
            {t('common.back')}
          </Button>
          <div className="flex items-center gap-2 bg-brand-purple/10 text-brand-purple px-4 py-2 rounded-full font-black">
            <Sparkles className="w-5 h-5" />
            PREMIUM
          </div>
        </header>

        <div className="text-center space-y-4">
          <h1 className="text-5xl font-black text-slate-900 dark:text-white">
            Unlock the Full <span className="text-brand-blue">Learning Engine</span>
          </h1>
          <p className="text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto">
            Give your child the best thinking development experience with unlimited access to all features.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            {features.map((f, i) => (
              <motion.div 
                key={i}
                initial={{ x: -20, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ delay: i * 0.1 }}
                className="flex gap-4 p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-800 shadow-sm"
              >
                <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800 h-fit">
                  {f.icon}
                </div>
                <div>
                  <h3 className="font-black text-lg text-slate-900 dark:text-white">{f.title}</h3>
                  <p className="text-slate-500 dark:text-slate-400">{f.desc}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="space-y-8">
            <Card className="p-8 border-4 border-brand-purple bg-white dark:bg-slate-900 shadow-2xl relative overflow-hidden">
              <div className="absolute top-0 right-0 w-32 h-32 bg-brand-purple/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2" />
              
              <div className="space-y-8 relative z-10">
                <div className="text-center">
                  <div className="text-slate-500 dark:text-slate-400 font-bold uppercase tracking-widest text-sm mb-2">Monthly Plan</div>
                  <div className="flex items-center justify-center gap-1">
                    <span className="text-4xl font-black text-slate-900 dark:text-white">$</span>
                    <span className="text-7xl font-black text-slate-900 dark:text-white">4.99</span>
                    <span className="text-slate-500 dark:text-slate-400 font-bold">/mo</span>
                  </div>
                </div>

                <ul className="space-y-4">
                  {["Unlimited everything", "7-day free trial", "Cancel anytime", "Ad-free experience"].map((item, i) => (
                    <li key={i} className="flex items-center gap-3 font-bold text-slate-700 dark:text-slate-300">
                      <div className="bg-green-100 dark:bg-green-900/30 p-1 rounded-full">
                        <Check className="w-4 h-4 text-green-600 dark:text-green-500" />
                      </div>
                      {item}
                    </li>
                  ))}
                </ul>

                <Button 
                  onClick={() => handleSubscribe('monthly')}
                  className="w-full py-8 text-2xl font-black bg-brand-purple hover:bg-brand-purple/90 text-white rounded-3xl shadow-xl shadow-purple-200 dark:shadow-none transition-all hover:scale-105"
                >
                  {user?.isPremium ? "Already Premium!" : "Start Free Trial"}
                </Button>
                
                <p className="text-center text-xs text-slate-400 font-medium">
                  Secure payment via Stripe.
                </p>
              </div>
            </Card>

            <Card className="p-6 bg-slate-100 dark:bg-slate-800 border-none flex items-center justify-between">
              <div>
                <div className="text-sm font-black text-slate-900 dark:text-white">Yearly Plan</div>
                <div className="text-xs text-slate-500">Save 20% with annual billing</div>
              </div>
              <div className="text-right">
                <div className="text-xl font-black text-slate-900 dark:text-white">$49.99/yr</div>
                <Button variant="ghost" size="sm" onClick={() => handleSubscribe('yearly')} className="text-brand-purple font-black">
                  Switch to Yearly
                </Button>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};
