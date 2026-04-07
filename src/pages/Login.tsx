import { motion } from "motion/react";
import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { signInWithPopup } from "firebase/auth";
import { auth, googleProvider } from "../firebase";
import { Brain, LogIn } from "lucide-react";
import { useTranslation } from "react-i18next";

export const Login = () => {
  const { t } = useTranslation();
  const handleGoogleLogin = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
    } catch (error) {
      console.error("Login failed:", error);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-brand-blue/10 via-white to-brand-purple/10 p-6">
      <Card className="max-w-md w-full p-12 text-center space-y-8">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className="bg-brand-blue w-24 h-24 rounded-[2rem] flex items-center justify-center mx-auto shadow-xl shadow-blue-200"
        >
          <Brain className="text-white w-12 h-12" />
        </motion.div>

        <div className="space-y-2">
          <h1 className="text-4xl font-black">{t('login.title')}</h1>
          <p className="text-slate-500 font-medium">{t('login.subtitle')}</p>
        </div>

        <Button 
          onClick={handleGoogleLogin} 
          size="lg" 
          className="w-full py-6 text-xl"
          variant="outline"
        >
          <img 
            src="https://www.gstatic.com/firebase/builtjs/src/resources/google-logo.svg" 
            alt="Google" 
            className="w-6 h-6"
          />
          {t('login.google_btn')}
        </Button>

        <p className="text-xs text-slate-400">
          {t('login.terms')}
        </p>
      </Card>
    </div>
  );
};
