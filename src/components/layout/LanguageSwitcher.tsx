import React from 'react';
import { useTranslation } from 'react-i18next';
import { Globe } from 'lucide-react';
import { cn } from '../../lib/utils';

export const LanguageSwitcher = () => {
  const { i18n } = useTranslation();

  const languages = [
    { code: 'en', label: 'English', flag: '🇺🇸' },
    { code: 'vi', label: 'Tiếng Việt', flag: '🇻🇳' },
    { code: 'ru', label: 'Русский', flag: '🇷🇺' },
  ];

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('i18nextLng', lng);
  };

  return (
    <div className="flex items-center gap-2">
      <Globe className="w-4 h-4 text-gray-500" />
      <div className="flex gap-1">
        {languages.map((lang) => (
          <button
            key={lang.code}
            onClick={() => changeLanguage(lang.code)}
            className={cn(
              "px-2 py-1 text-xs font-medium rounded-md transition-colors",
              i18n.language === lang.code
                ? "bg-blue-100 text-blue-600"
                : "text-gray-600 hover:bg-gray-100"
            )}
          >
            <span className="mr-1">{lang.flag}</span>
            {lang.label}
          </button>
        ))}
      </div>
    </div>
  );
};
