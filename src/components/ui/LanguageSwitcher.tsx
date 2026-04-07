import { useTranslation } from "react-i18next";
import { motion, AnimatePresence } from "motion/react";
import { Globe, ChevronDown } from "lucide-react";
import { useState } from "react";

const LANGUAGES = [
  { code: 'en', label: 'English', flag: '🇺🇸' },
  { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
  { code: 'ru', label: 'Русский', flag: '🇷🇺' },
];

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const currentLang = LANGUAGES.find(l => l.code === i18n.language) || LANGUAGES[0];

  return (
    <div className="relative">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 px-3 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 border-2 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition-colors"
      >
        <Globe className="w-4 h-4" />
        <span>{currentLang.flag}</span>
        <ChevronDown className={cn("w-4 h-4 transition-transform", isOpen && "rotate-180")} />
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            className="absolute top-full right-0 mt-2 w-40 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border-2 border-slate-100 dark:border-slate-800 overflow-hidden z-50"
          >
            {LANGUAGES.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  i18n.changeLanguage(lang.code);
                  setIsOpen(false);
                }}
                className={cn(
                  "w-full flex items-center gap-3 px-4 py-3 text-left hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors font-bold text-sm",
                  i18n.language === lang.code ? "text-brand-blue" : "text-slate-600 dark:text-slate-400"
                )}
              >
                <span>{lang.flag}</span>
                <span>{lang.label}</span>
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

import { cn } from "../../lib/utils";
