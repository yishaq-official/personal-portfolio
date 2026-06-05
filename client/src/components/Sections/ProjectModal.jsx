import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ExternalLink, Code, ChevronLeft, ChevronRight, Check } from 'lucide-react';

export default function ProjectModal({ project, onClose }) {
  // Return null if modal is closed
  if (!project) return null;

  // Track image carousel index
  const [imgIdx, setImgIdx] = useState(0);

  // Close on Escape key press
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  const images = project.images || [
    { title: 'Landing Page Preview', gradient: 'from-violet-500 to-indigo-600' },
    { title: 'Dashboard Metrics', gradient: 'from-emerald-500 to-teal-600' },
    { title: 'Mobile Configurator', gradient: 'from-rose-500 to-pink-600' }
  ];

  const handleNext = (e) => {
    e.stopPropagation();
    setImgIdx((prev) => (prev + 1) % images.length);
  };

  const handlePrev = (e) => {
    e.stopPropagation();
    setImgIdx((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-[2000] flex items-center justify-center p-4">
        {/* Semi-transparent Backdrop overlay */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-md cursor-pointer"
        />

        {/* Modal Window Container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0, y: 15 }}
          animate={{ scale: 1, opacity: 1, y: 0 }}
          exit={{ scale: 0.95, opacity: 0, y: 15 }}
          transition={{ type: 'spring', damping: 25, stiffness: 280 }}
          className="w-full max-w-3xl max-h-[90vh] bg-bg-card border border-border-subtle rounded-3xl shadow-2xl overflow-hidden flex flex-col relative z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-border-subtle/40 bg-bg-site/30">
            <div>
              <h3 className="text-xl font-display font-extrabold text-text-primary">
                {project.title}
              </h3>
              <p className="text-xs font-semibold text-accent-primary uppercase tracking-wider">
                {project.category}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-border-subtle/50 text-text-secondary hover:text-text-primary transition-colors cursor-pointer"
              title="Close Modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Modal scrollable content body */}
          <div className="flex-grow overflow-y-auto p-6 sm:p-8 space-y-6 text-left">
            
            {/* Image Preview Carousel Box */}
            <div className="w-full h-48 sm:h-64 rounded-2xl overflow-hidden relative group bg-bg-site border border-border-subtle shadow-inner flex items-center justify-center">
              {/* Active Image representation using gradients (clean, fast, consistent fallback) */}
              <div className={`w-full h-full bg-gradient-to-br ${images[imgIdx].gradient || 'from-indigo-600 to-purple-700'} flex flex-col items-center justify-center p-6 text-center text-white relative`}>
                <div className="absolute inset-0 bg-black/20 pointer-events-none" />
                <h4 className="text-lg sm:text-2xl font-display font-extrabold tracking-tight relative z-10">
                  {images[imgIdx].title || project.title}
                </h4>
                <p className="text-xs text-white/80 font-mono mt-1 relative z-10">
                  Slide {imgIdx + 1} of {images.length}
                </p>
              </div>

              {/* Navigation Arrows */}
              <button
                onClick={handlePrev}
                className="absolute left-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white/90 transition duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
                title="Previous Image"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                className="absolute right-3 p-1.5 rounded-full bg-black/40 hover:bg-black/60 text-white/90 transition duration-200 opacity-0 group-hover:opacity-100 cursor-pointer"
                title="Next Image"
              >
                <ChevronRight className="w-5 h-5" />
              </button>

              {/* Dot Indicators */}
              <div className="absolute bottom-3 inset-x-0 flex justify-center space-x-1.5">
                {images.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={(e) => { e.stopPropagation(); setImgIdx(idx); }}
                    className={`w-2 h-2 rounded-full transition-all duration-200 cursor-pointer ${
                      imgIdx === idx ? 'bg-white scale-125' : 'bg-white/40'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Narrative description */}
            <div className="space-y-2">
              <h4 className="text-sm font-semibold uppercase text-text-secondary tracking-wider">
                Overview
              </h4>
              <p className="text-text-secondary font-sans leading-relaxed text-sm sm:text-base">
                {project.fullDescription || project.description}
              </p>
            </div>

            {/* Key Features & Challenges list */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
              {/* Features */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold uppercase text-text-secondary tracking-wider flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-500" />
                  Key Features
                </h4>
                <ul className="list-disc pl-5 text-sm text-text-secondary space-y-1.5">
                  {project.features ? (
                    project.features.map((feat, idx) => <li key={idx}>{feat}</li>)
                  ) : (
                    <>
                      <li>Clean UI elements built with custom CSS variables.</li>
                      <li>Highly responsive responsive grid layouts.</li>
                      <li>Smooth layout transitions and modal overlays.</li>
                    </>
                  )}
                </ul>
              </div>

              {/* Challenges & Solutions */}
              <div className="space-y-2">
                <h4 className="text-sm font-semibold uppercase text-text-secondary tracking-wider flex items-center gap-1.5">
                  <Code className="w-4 h-4 text-accent-primary" />
                  Challenges & Solutions
                </h4>
                <p className="text-sm text-text-secondary leading-relaxed font-sans pl-1">
                  {project.challenges || 'Optimizing layout filters and modal portal elements to run at 60fps on mobile viewports. Resolved using CSS hardware acceleration and dynamic triggers.'}
                </p>
              </div>
            </div>

            {/* Technology badges */}
            <div className="space-y-2 pt-2">
              <h4 className="text-sm font-semibold uppercase text-text-secondary tracking-wider">
                Technologies Used
              </h4>
              <div className="flex flex-wrap gap-2">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="px-3 py-1 bg-accent-glow border border-accent-border/20 text-accent-primary text-xs font-semibold rounded-full uppercase tracking-wider"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            </div>
          </div>

          {/* Action Links Footer */}
          <div className="px-6 py-4 bg-bg-site/30 border-t border-border-subtle/40 flex items-center justify-end gap-3 select-none">
            <a
              href={project.sourceUrl || 'https://github.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-2.5 px-5 glass-panel text-text-primary text-sm font-semibold rounded-xl border border-border-subtle hover:border-text-secondary hover:bg-border-subtle/20 transition-all duration-300"
            >
              <Code className="w-4 h-4" />
              Source Code
            </a>
            <a
              href={project.demoUrl || 'https://example.com'}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 py-2.5 px-5 bg-accent-primary hover:bg-accent-secondary text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300"
            >
              <ExternalLink className="w-4 h-4" />
              Live Demo
            </a>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
