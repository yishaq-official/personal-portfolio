import { useState, useEffect } from 'react';
import { Mail, ArrowUp } from 'lucide-react';

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
    {
      name: 'GitHub',
      href: 'https://github.com/yishaq-official',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
          <path d="M9 18c-4.51 2-5-2-7-2" />
        </svg>
      )
    },
    {
      name: 'LinkedIn',
      href: 'https://linkedin.com/in/yishaq-damtew-734108361',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5">
          <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
          <rect x="2" y="9" width="4" height="12" />
          <circle cx="4" cy="4" r="2" />
        </svg>
      )
    },
    { name: 'Email', href: 'mailto:yishaq.official@gmail.com', icon: <Mail className="w-5 h-5" /> },
  ];

  return (
    <footer className="relative z-10 border-t border-border-subtle bg-bg-site py-12 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-6">
        {/* Info */}
        <div className="text-center md:text-left space-y-2">
          <p className="text-sm text-text-secondary">
            &copy; {currentYear} yishaq.dev. All rights reserved.
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
