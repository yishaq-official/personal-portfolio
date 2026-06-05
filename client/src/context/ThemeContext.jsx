import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Retrieve initial values from localStorage or default
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('portfolio-theme');
    if (stored) return stored;
    // Fallback to system preference
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [accent, setAccent] = useState(() => {
    return localStorage.getItem('portfolio-accent') || 'violet';
  });

  // Apply theme class and data-accent attribute to html element
  useEffect(() => {
    const root = document.documentElement;
    
    // Manage dark mode class
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    
    // Manage accent color attribute
    root.setAttribute('data-accent', accent);
    localStorage.setItem('portfolio-accent', accent);
  }, [accent]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const changeAccent = (newAccent) => {
    const validAccents = ['violet', 'indigo', 'emerald', 'rose', 'amber'];
    if (validAccents.includes(newAccent)) {
      setAccent(newAccent);
    }
  };

  return (
    <ThemeContext.Provider value={{ theme, accent, toggleTheme, changeAccent }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
}
