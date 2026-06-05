import React, { useState, useEffect } from 'react';
import { Github, Linkedin, Twitter, Mail, ArrowUp } from 'lucide-react';

export default function Footer() {
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    const checkScrollTop = () => {
      if (window.scrollY > 300) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };

    window.addEventListener('scroll', checkScrollTop);
    return () => window.removeEventListener('scroll', checkScrollTop);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const currentYear = new Date().getFullYear();

  const socialLinks = [
    { name: 'GitHub', href: 'https://github.com', icon: <Github className="w-5 h-5" /> },
    { name: 'LinkedIn', href: 'https://linkedin.com', icon: <Linkedin className="w-5 h-5" /> },
    { name: 'Twitter', href: 'https://twitter.com', icon: <Twitter className="w-5 h-5" /> },
    { name: 'Email', href: 'mailto:yishaq@example.com', icon: <Mail className="w-5 h-5" /> },
  ];

  return (
    <footer className="relative z-10 border-t border-border-subtle bg-bg-site py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Info */}
        <div className="text-center md:text-left space-y-2">
          <p className="text-sm text-text-secondary">
            &copy; {currentYear} DevPortfolio. All rights reserved.
          </p>
          <p className="text-xs text-text-secondary">
            Handcrafted with React 19, Tailwind v4 & Custom CSS variables.
          </p>
        </div>

        {/* Social Links */}
        <div className="flex items-center space-x-4">
          {socialLinks.map((social) => (
            <a
              key={social.name}
              href={social.href}
              target="_blank"
              rel="noopener noreferrer"
              className="p-2.5 rounded-xl border border-border-subtle hover:border-accent-primary bg-bg-card hover:bg-accent-glow text-text-secondary hover:text-accent-primary transition-all duration-300"
              title={social.name}
            >
              {social.icon}
            </a>
          ))}
        </div>
      </div>

      {/* Back to Top Button */}
      {showScrollTop && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-8 right-8 z-40 p-3 bg-accent-primary hover:bg-accent-secondary text-white rounded-xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-pointer"
          title="Back to Top"
        >
          <ArrowUp className="w-5 h-5" />
        </button>
      )}
    </footer>
  );
}
