import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, Copy, Check, ArrowRight } from 'lucide-react';

export default function Hero() {
  // 1. Typewriter Subtitles Effect
  const phrases = [
    "Full Stack Web Developer",
    "UI/UX Interface Builder",
    "Problem Solver & Tech Thinker"
  ];
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [typingSpeed, setTypingSpeed] = useState(100);

  useEffect(() => {
    let timer;
    const currentPhrase = phrases[phraseIndex];
    
    if (isDeleting) {
      timer = setTimeout(() => {
        setDisplayText(currentPhrase.substring(0, displayText.length - 1));
        setTypingSpeed(40); // Deletes faster
      }, typingSpeed);
    } else {
      timer = setTimeout(() => {
        setDisplayText(currentPhrase.substring(0, displayText.length + 1));
        setTypingSpeed(90);
      }, typingSpeed);
    }

    if (!isDeleting && displayText === currentPhrase) {
      timer = setTimeout(() => setIsDeleting(true), 1800); // Wait before delete
    } else if (isDeleting && displayText === '') {
      setIsDeleting(false);
      setPhraseIndex((prev) => (prev + 1) % phrases.length);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex, typingSpeed]);

  // 2. Interactive Code Panel Tabs State
  const [activeTab, setActiveTab] = useState('Bio.json');
  const [copied, setCopied] = useState(false);

  const rawCodeContent = {
    'Bio.json': `{
  "name": "Yishaq Damtew",
  "title": "Full Stack Engineer",
  "location": "Addis Ababa, Ethiopia",
  "experience": "3+ Years",
  "openToWork": true,
  "motto": "Build clean, solve complex."
}`,
    'Skills.js': `const developer = {
  languages: ["JS", "TS", "Python", "SQL"],
  frontend: ["React 19", "Vite", "Tailwind v4"],
  backend: ["Node", "PostgreSQL", "Docker"],
  learning: "Rust & WebAssembly"
};`,
    'Interests.yml': `interests:
  - building_accessible_apps
  - mechanical_keyboards
  - open_source_contribution
  - photography:
      type: landscape
      lens: 35mm prime
  - coffee_brewing:
      method: V60 pour_over`
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(rawCodeContent[activeTab]);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // Smooth scroll handler
  const handleScrollTo = (id) => {
    const element = document.querySelector(id);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
    }
  };

  return (
    <section
      id="home"
      className="relative w-full py-16 md:py-28 flex flex-col md:flex-row items-center justify-between gap-12"
    >
      {/* Left side: Tagline & CTAs */}
      <div className="w-full md:w-[50%] flex flex-col space-y-6 text-left">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1 bg-accent-glow border border-border-subtle rounded-full w-fit"
        >
          <Terminal className="w-4 h-4 text-accent-primary animate-pulse" />
          <span className="text-xs font-semibold text-accent-primary tracking-wider uppercase">
            Open to opportunities
          </span>
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-5xl lg:text-6xl font-display font-extrabold tracking-tight text-text-primary"
        >
          Hi, I'm <span className="text-gradient">Yishaq Damtew</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="h-8 text-lg sm:text-xl font-medium text-text-secondary"
        >
          <span>{displayText}</span>
          <span className="cli-cursor ml-1" />
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-text-secondary font-sans leading-relaxed text-base sm:text-lg max-w-lg"
        >
          I am a software engineer focused on building clean, accessible, and high-performance applications. I love transforming complex ideas into simple, elegant digital products.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-wrap gap-4 pt-4"
        >
          <button
            onClick={() => handleScrollTo('#projects')}
            className="flex items-center gap-2 py-3 px-6 bg-accent-primary hover:bg-accent-secondary text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group"
          >
            View My Projects
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
          <button
            onClick={() => handleScrollTo('#contact')}
            className="py-3 px-6 glass-panel text-text-primary font-semibold rounded-xl border border-border-subtle hover:border-text-secondary hover:bg-border-subtle/20 transition-all duration-300 cursor-pointer"
          >
            Contact Me
          </button>
        </motion.div>

        {/* Social Quick-Links */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.55 }}
          className="flex items-center gap-4 pt-2"
        >
          <span className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Find me on</span>
          <div className="flex items-center gap-2.5">
            <a
              href="https://github.com/yishaq"
              target="_blank"
              rel="noopener noreferrer"
              title="GitHub"
              className="p-2 rounded-xl border border-border-subtle hover:border-accent-primary bg-bg-card hover:bg-accent-glow text-text-secondary hover:text-accent-primary transition-all duration-200 group"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:scale-110 transition-transform">
                <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
                <path d="M9 18c-4.51 2-5-2-7-2" />
              </svg>
            </a>
            <a
              href="https://linkedin.com/in/yishaq"
              target="_blank"
              rel="noopener noreferrer"
              title="LinkedIn"
              className="p-2 rounded-xl border border-border-subtle hover:border-accent-primary bg-bg-card hover:bg-accent-glow text-text-secondary hover:text-accent-primary transition-all duration-200 group"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:scale-110 transition-transform">
                <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z" />
                <rect x="2" y="9" width="4" height="12" />
                <circle cx="4" cy="4" r="2" />
              </svg>
            </a>
            <a
              href="mailto:yishaq.damtew@gmail.com"
              title="Email"
              className="p-2 rounded-xl border border-border-subtle hover:border-accent-primary bg-bg-card hover:bg-accent-glow text-text-secondary hover:text-accent-primary transition-all duration-200 group"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-4 h-4 group-hover:scale-110 transition-transform">
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </svg>
            </a>
          </div>
        </motion.div>
      </div>

      {/* Right side: Mock Code Editor Panel */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="w-full md:w-[50%] max-w-lg glass-panel rounded-2xl border border-border-subtle shadow-2xl overflow-hidden flex flex-col h-96 relative z-10"
      >
        {/* Editor Toolbar Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-bg-site/60 border-b border-border-subtle">
          {/* OS Window Actions */}
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
          </div>

          {/* Editor Tabs List */}
          <div className="flex items-center space-x-1">
            {Object.keys(rawCodeContent).map((tabName) => (
              <button
                key={tabName}
                onClick={() => setActiveTab(tabName)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-medium transition-all duration-200 cursor-pointer ${
                  activeTab === tabName
                    ? 'bg-accent-glow text-accent-primary border border-accent-primary/30'
                    : 'text-text-secondary hover:text-text-primary hover:bg-border-subtle/30 border border-transparent'
                }`}
              >
                {tabName}
              </button>
            ))}
          </div>

          {/* Copy Button Action */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg border border-border-subtle hover:border-accent-primary bg-bg-site/40 text-text-secondary hover:text-accent-primary transition-all duration-200 cursor-pointer"
            title="Copy Code"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
          </button>
        </div>

        {/* Editor Code Panel Body */}
        <div className="flex-grow p-6 text-left overflow-y-auto bg-bg-card/45 select-text">
          {activeTab === 'Bio.json' && (
            <div className="font-mono text-sm leading-relaxed text-text-primary">
              <span className="text-gray-500 dark:text-gray-600">// Bio.json</span>
              <div>{"{"}</div>
              <div className="pl-5">
                <span className="text-accent-primary">"name"</span>: <span className="text-accent-secondary">"Yishaq Damtew"</span>,
              </div>
              <div className="pl-5">
                <span className="text-accent-primary">"title"</span>: <span className="text-accent-secondary">"Full Stack Engineer"</span>,
              </div>
              <div className="pl-5">
                <span className="text-accent-primary">"location"</span>: <span className="text-accent-secondary">"Addis Ababa, Ethiopia"</span>,
              </div>
              <div className="pl-5">
                <span className="text-accent-primary">"experience"</span>: <span className="text-accent-secondary">"3+ Years"</span>,
              </div>
              <div className="pl-5">
                <span className="text-accent-primary">"openToWork"</span>: <span className="text-amber-500 dark:text-amber-400">true</span>,
              </div>
              <div className="pl-5">
                <span className="text-accent-primary">"motto"</span>: <span className="text-accent-secondary">"Build clean, solve complex."</span>
              </div>
              <div>{"}"}</div>
            </div>
          )}

          {activeTab === 'Skills.js' && (
            <div className="font-mono text-sm leading-relaxed text-text-primary">
              <span className="text-gray-500 dark:text-gray-600">// Skills.js</span>
              <div>
                <span className="text-[#f43f5e] dark:text-[#fb7185]">const</span> <span className="text-accent-primary">developer</span> = {"{"}
              </div>
              <div className="pl-5">
                <span className="text-accent-secondary">languages</span>: [<span className="text-emerald-500">"JS"</span>, <span className="text-emerald-500">"TS"</span>, <span className="text-emerald-500">"Python"</span>, <span className="text-emerald-500">"SQL"</span>],
              </div>
              <div className="pl-5">
                <span className="text-accent-secondary">frontend</span>: [<span className="text-emerald-500">"React 19"</span>, <span className="text-emerald-500">"Vite"</span>, <span className="text-emerald-500">"Tailwind v4"</span>],
              </div>
              <div className="pl-5">
                <span className="text-accent-secondary">backend</span>: [<span className="text-emerald-500">"Node"</span>, <span className="text-emerald-500">"PostgreSQL"</span>, <span className="text-emerald-500">"Docker"</span>],
              </div>
              <div className="pl-5">
                <span className="text-accent-secondary">learning</span>: <span className="text-emerald-500">"Rust & WebAssembly"</span>
              </div>
              <div>{"};"}</div>
            </div>
          )}

          {activeTab === 'Interests.yml' && (
            <div className="font-mono text-sm leading-relaxed text-text-primary">
              <span className="text-gray-500 dark:text-gray-600"># Interests.yml</span>
              <div>
                <span className="text-accent-primary">interests</span>:
              </div>
              <div className="pl-5">
                - <span className="text-accent-secondary">building_accessible_apps</span>
              </div>
              <div className="pl-5">
                - <span className="text-accent-secondary">mechanical_keyboards</span>
              </div>
              <div className="pl-5">
                - <span className="text-accent-secondary">open_source_contribution</span>
              </div>
              <div className="pl-5">
                - <span className="text-accent-secondary">photography</span>:
              </div>
              <div className="pl-10">
                <span className="text-accent-primary">type</span>: <span className="text-accent-secondary">landscape</span>
              </div>
              <div className="pl-10">
                <span className="text-accent-primary">lens</span>: <span className="text-accent-secondary">35mm prime</span>
              </div>
              <div className="pl-5">
                - <span className="text-accent-secondary">coffee_brewing</span>:
              </div>
              <div className="pl-10">
                <span className="text-accent-primary">method</span>: <span className="text-accent-secondary">V60 pour_over</span>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </section>
  );
}
