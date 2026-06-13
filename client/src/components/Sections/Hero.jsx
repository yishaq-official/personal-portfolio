import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Terminal, ArrowRight, Sparkles, Layers3, Gauge, MapPin } from 'lucide-react';

const phrases = [
  'Full Stack Web Developer',
  'UI/UX Interface Builder',
  'Problem Solver & Tech Thinker'
];

const heroStats = [
  { label: 'Experience', value: '3+ yrs', icon: Gauge },
  { label: 'Projects', value: '20+', icon: Layers3 },
  { label: 'Base', value: 'Debre Birhan', icon: MapPin },
];

export default function Hero() {
  // 1. Typewriter Subtitles Effect
  const [phraseIndex, setPhraseIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentPhrase = phrases[phraseIndex];
    let timer;

    if (!isDeleting && displayText === currentPhrase) {
      timer = setTimeout(() => setIsDeleting(true), 1800); // Wait before delete
    } else if (isDeleting && displayText === '') {
      timer = setTimeout(() => {
        setIsDeleting(false);
        setPhraseIndex((prev) => (prev + 1) % phrases.length);
      }, 120);
    } else {
      timer = setTimeout(() => {
        setDisplayText((prev) => (
          isDeleting
            ? currentPhrase.substring(0, prev.length - 1)
            : currentPhrase.substring(0, prev.length + 1)
        ));
      }, isDeleting ? 40 : 90);
    }

    return () => clearTimeout(timer);
  }, [displayText, isDeleting, phraseIndex]);



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
  className="min-h-screen flex items-center justify-center px-6"
>
  <div className="max-w-2xl text-center">

    {/* Profile Image */}
    <img
      src="/avatar.jpg"
      alt="Yishaq Damtew"
      className="w-36 h-36 rounded-full object-cover mx-auto border-4 border-accent-primary/20 shadow-xl"
    />

    {/* Name */}
    <h1 className="mt-8 text-5xl md:text-6xl font-bold text-text-primary">
      Yishaq Damtew
    </h1>

    {/* Title */}
    <p className="mt-3 text-xl text-accent-primary font-medium">
      Full Stack Web Developer
    </p>

    {/* Small Description */}
    <p className="mt-6 text-text-secondary leading-relaxed max-w-xl mx-auto">
      I build modern web applications with efficiency, creativity and care.
    </p>

    {/* Buttons */}
    <div className="mt-10 flex justify-center gap-4 flex-wrap">
      <button
        onClick={() => handleScrollTo("#projects")}
        className="px-7 py-3 rounded-xl bg-accent-primary text-white font-medium"
      >
        View Projects
      </button>

      <button
        onClick={() => handleScrollTo("#contact")}
        className="px-7 py-3 rounded-xl border border-border-subtle"
      >
        Contact Me
      </button>
    </div>

    {/* Social Icons */}
    <div className="mt-10 flex justify-center gap-6">
      {/* GitHub */}
      {/* LinkedIn */}
      {/* Email */}
    </div>

  </div>
</section>
  );
}
