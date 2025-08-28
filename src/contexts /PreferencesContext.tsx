

import React, { createContext, useContext, useState, useEffect } from 'react';

interface PreferencesContextType {
  currency: string;
  setCurrency: (currency: string) => void;
  darkMode: boolean;
  setDarkMode: (darkMode: boolean) => void;
  language: string;
  setLanguage: (language: string) => void;
  formatCurrency: (value: number) => string;
}

const PreferencesContext = createContext<PreferencesContextType | undefined>(undefined);

export const usePreferences = () => {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error('usePreferences must be used within a PreferencesProvider');
  }
  return context;
};

export const PreferencesProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [currency, setCurrency] = useState(() => {
    return localStorage.getItem('currency') || 'BRL';
  });
  
  const [darkMode, setDarkMode] = useState(() => {
    const saved = localStorage.getItem('darkMode');
    if (saved !== null) {
      return saved === 'true';
    }
    // Check system preference as fallback
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });
  
  const [language, setLanguage] = useState(() => {
    return localStorage.getItem('language') || 'pt-BR';
  });

  // Apply dark mode to document
  useEffect(() => {
    const root = document.documentElement;
    
    if (darkMode) {
      root.classList.add('dark');
      root.style.colorScheme = 'dark';
    } else {
      root.classList.remove('dark');
      root.style.colorScheme = 'light';
    }
    
    localStorage.setItem('darkMode', darkMode.toString());
  }, [darkMode]);

  // Save currency to localStorage
  useEffect(() => {
    localStorage.setItem('currency', currency);
  }, [currency]);

  // Save language to localStorage
  useEffect(() => {
    localStorage.setItem('language', language);
  }, [language]);

  // Listen for system theme changes
  useEffect(() => {
    const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if user hasn't manually set a preference
      const hasManualPreference = localStorage.getItem('darkMode') !== null;
      if (!hasManualPreference) {
        setDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener('change', handleChange);
    return () => mediaQuery.removeEventListener('change', handleChange);
  }, []);

  const formatCurrency = (value: number): string => {
    const formatters = {
      BRL: new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL'
      }),
      USD: new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD'
      }),
      EUR: new Intl.NumberFormat('de-DE', {
        style: 'currency',
        currency: 'EUR'
      })
    };

    const formatter = formatters[currency as keyof typeof formatters] || formatters.BRL;
    return formatter.format(value);
  };

  const value = {
    currency,
    setCurrency,
    darkMode,
    setDarkMode,
    language,
    setLanguage,
    formatCurrency
  };

  return (
    <PreferencesContext.Provider value={value}>
      {children}
    </PreferencesContext.Provider>
  );
};
