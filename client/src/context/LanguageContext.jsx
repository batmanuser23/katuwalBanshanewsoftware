// src/context/LanguageContext.jsx
import React, { createContext, useState, useContext, useEffect } from 'react';
import { translations } from '../translations';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
  const [language, setLanguage] = useState(() => {
    const saved = localStorage.getItem('language');
    if (saved && ['en', 'ne'].includes(saved)) {
      return saved;
    }
    return 'en';
  });

  useEffect(() => {
    localStorage.setItem('language', language);
    document.documentElement.lang = language;
  }, [language]);

  const t = (key) => {
    if (!key) return key;
    
    const langData = translations[language];
    const fallbackData = translations.en;
    
    if (langData && langData[key] !== undefined && langData[key] !== '') {
      return langData[key];
    }
    
    if (fallbackData && fallbackData[key] !== undefined && fallbackData[key] !== '') {
      return fallbackData[key];
    }
    
    return key;
  };

  const changeLanguage = (lang) => {
    if (['en', 'ne'].includes(lang)) {
      setLanguage(lang);
      localStorage.setItem('language', lang);
    }
  };

  return (
    <LanguageContext.Provider value={{ language, setLanguage: changeLanguage, t }}>
      {children}
    </LanguageContext.Provider>
  );
};

export const useLanguage = () => {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within a LanguageProvider');
  }
  return context;
};

export default LanguageContext;