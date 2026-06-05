import React, { useState, useEffect } from 'react';
import { Menu, X, Settings, Sun, Moon } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function Header({ onOpenSettings }) {
  const { theme, toggleTheme } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Monitor scroll for progress indicator & adding background blur
  useEffect(() => {
    const handleScroll = () => {
      // Background scroll check
      if (window.scrollY > 20) {
        setScrolled(true);
      } else {
        setScrolled(false);
      }

      // Scroll progress percentage
      const totalScroll = document.documentElement.scrollHeight - window.innerHeight;
      if (totalScroll > 0) {
        const progress = (window.scrollY / totalScroll) * 100;
        setScrollProgress(progress);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', href: '#home' },
    { name: 'About', href: '#about' },
    { name: 'Experience', href: '#experience' },
    { name: 'Projects', href: '#projects' },
    { name: 'Contact', href: '#contact' },
    { name: 'Terminal', href: '#terminal' },
  ];

  const handleLinkClick = (e, href) => {
    e.preventDefault();
    setMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  return (
    <header
      className={`sticky top-0 left-0 right-0 z-50 transition-all duration-300 ${
        scrolled
          ? 'bg-bg-card/85 backdrop-blur-md border-b border-border-subtle py-3 shadow-sm'
          : 'bg-transparent py-5'
      }`}
    >
      {/* Scroll Progress Bar */}
      <div
        className="absolute top-0 left-0 h-[3px] bg-gradient-to-r from-accent-primary to-accent-secondary transition-all duration-75"
        style={{ width: `${scrollProgress}%` }}
      />

      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        {/* Logo/Name */}
        <a
          href="#home"
          onClick={(e) => handleLinkClick(e, '#home')}
          className="text-xl font-display font-extrabold tracking-tight text-text-primary hover:opacity-85 transition-opacity"
        >
          Dev<span className="text-gradient">Portfolio</span>
        </a>

        {/* Desktop Navigation Links */}
        <nav className="hidden md:flex items-center space-x-8">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-sm font-medium text-text-secondary hover:text-accent-primary transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </nav>

        {/* Utility Actions */}
        <div className="flex items-center space-x-3">
          {/* Quick theme switcher */}
          <button
            onClick={toggleTheme}
            className="p-2 rounded-xl hover:bg-border-subtle transition-all duration-200 cursor-pointer text-text-secondary hover:text-text-primary"
            title={`Switch to ${theme === 'light' ? 'Dark' : 'Light'} Mode`}
          >
            {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
          </button>

          {/* Configuration menu button */}
          <button
            onClick={onOpenSettings}
            className="p-2 rounded-xl hover:bg-border-subtle transition-all duration-200 cursor-pointer text-text-secondary hover:text-text-primary"
            title="Customization Settings"
          >
            <Settings className="w-5 h-5 hover:rotate-45 transition-transform duration-300" />
          </button>

          {/* Mobile hamburger menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 rounded-xl hover:bg-border-subtle transition-all duration-200 cursor-pointer md:hidden text-text-secondary hover:text-text-primary"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Dropdown Menu */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 glass-panel border-b border-border-subtle p-6 animate-fade-in shadow-xl flex flex-col space-y-4">
          {navLinks.map((link) => (
            <a
              key={link.name}
              href={link.href}
              onClick={(e) => handleLinkClick(e, link.href)}
              className="text-base font-semibold text-text-primary py-2 hover:text-accent-primary transition-colors duration-200"
            >
              {link.name}
            </a>
          ))}
        </div>
      )}
    </header>
  );
}
