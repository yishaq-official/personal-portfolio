/* eslint-disable react-refresh/only-export-components */
import { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
  // Retrieve initial values from localStorage or defaults
  const [theme, setTheme] = useState(() => {
    const stored = localStorage.getItem('portfolio-theme');
    if (stored) return stored;
    if (window.matchMedia('(prefers-color-scheme: dark)').matches) {
      return 'dark';
    }
    return 'light';
  });

  const [accent, setAccent] = useState(() => {
    return localStorage.getItem('portfolio-accent') || 'violet';
  });

  const [showCursor, setShowCursor] = useState(() => {
    const stored = localStorage.getItem('portfolio-cursor');
    return stored === null ? true : stored === 'true';
  });

  const [showParticles, setShowParticles] = useState(() => {
    const stored = localStorage.getItem('portfolio-particles');
    return stored === null ? true : stored === 'true';
  });

  // Apply theme class and data-accent attribute to html element
  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') {
      root.classList.add('dark');
    } else {
      root.classList.remove('dark');
    }
    localStorage.setItem('portfolio-theme', theme);
  }, [theme]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-accent', accent);
    localStorage.setItem('portfolio-accent', accent);
  }, [accent]);

  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-custom-cursor', String(showCursor));
    localStorage.setItem('portfolio-cursor', String(showCursor));
  }, [showCursor]);

  useEffect(() => {
    localStorage.setItem('portfolio-particles', String(showParticles));
  }, [showParticles]);

  const toggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  const changeAccent = (newAccent) => {
    const validAccents = ['violet', 'indigo', 'emerald', 'rose', 'amber'];
    if (validAccents.includes(newAccent)) {
      setAccent(newAccent);
    }
  };

  const toggleCursor = () => {
    setShowCursor((prev) => !prev);
  };

  const toggleParticles = () => {
    setShowParticles((prev) => !prev);
  };

  return (
    <ThemeContext.Provider value={{
      theme,
      accent,
      showCursor,
      showParticles,
      toggleTheme,
      changeAccent,
      toggleCursor,
      toggleParticles
    }}>
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
