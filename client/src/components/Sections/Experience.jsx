import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Briefcase, GraduationCap, ChevronDown, ChevronUp, Calendar, Loader2 } from 'lucide-react';

const fallbackExperiences = [
  {
    id: 1,
    type: 'work',
    role: 'Full Stack Developer',
    company: 'Velo Tech Solutions',
    duration: '2025 - Present',
    description: [
      'Design and maintain scalable React applications, utilizing React 19 and modern Vite bundling configurations.',
      'Develop PostgreSQL database schemas and write optimized SQL queries for Express API servers.',
      'Implement Docker containers for local staging and automate CI/CD pipeline deployments.'
    ]
  },
  {
    id: 2,
    type: 'work',
    role: 'Frontend Developer Intern',
    company: 'Apex Code Studio',
    duration: '2023 - 2024',
    description: [
      'Developed responsive landing pages and interactive data dashboard widgets for client applications.',
      'Refactored legacy design files into highly reusable Tailwind CSS classes, increasing page performance.',
      'Collaborated with design teams in Figma to translate mockups directly into pixel-perfect React components.'
    ]
  },
  {
    id: 3,
    type: 'education',
    role: 'B.S. Computer Science',
    company: 'State Tech University',
    duration: '2020 - 2024',
    description: [
      'Graduated with Honors. Specialized in Software Engineering and Database Design systems.',
      'President of the Student Web Development club; mentored 30+ juniors in JavaScript frameworks.',
      'Won 2nd place in the annual university Hackathon with a real-time collaborative map application.'
    ]
  }
];

export default function Experience() {
  const [experiences, setExperiences] = useState(fallbackExperiences);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('http://localhost:5000/api/experience')
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch experiences API');
        return res.json();
      })
      .then((data) => {
        if (Array.isArray(data) && data.length > 0) {
          setExperiences(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.warn('Experience endpoint failed, serving local fallback data:', err.message);
        setLoading(false);
      });
  }, []);

  // Track expanded cards
  const [expandedIds, setExpandedIds] = useState({ 1: true }); // Default first open

  const toggleExpand = (id) => {
    setExpandedIds((prev) => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  return (
    <section id="experience" className="py-20 border-t border-border-subtle w-full flex flex-col gap-12 text-left">
      {/* Title */}
      <div className="space-y-3">
        <h2 className="text-3xl font-display font-extrabold text-text-primary">
          Work & <span className="text-gradient">Education</span>
        </h2>
        <div className="h-1 w-12 bg-accent-primary rounded-full" />
      </div>

      {/* Timeline Tree Wrapper */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-secondary select-none">
          <Loader2 className="w-8 h-8 animate-spin text-accent-primary" />
          <p className="text-sm font-semibold">Synchronizing timeline from API...</p>
        </div>
      ) : (
        <div className="relative border-l border-border-subtle ml-4 sm:ml-8 pl-8 sm:pl-10 space-y-12 max-w-4xl">
          {experiences.map((exp, idx) => {
            const isExpanded = !!expandedIds[exp.id];
            return (
              <motion.div
                key={exp.id}
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.6, delay: idx * 0.15 }}
                className="relative"
              >
                {/* Timeline Icon Anchor Node */}
                <div className="absolute -left-[45px] sm:-left-[53px] top-1.5 w-8 h-8 sm:w-10 sm:h-10 rounded-full bg-bg-card border-2 border-accent-primary flex items-center justify-center shadow-md z-10 text-accent-primary">
                  {exp.type === 'work' ? (
                    <Briefcase className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <GraduationCap className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </div>

                {/* Experience Card */}
                <div
                  onClick={() => toggleExpand(exp.id)}
                  className={`glass-panel p-5 sm:p-6 rounded-2xl border transition-all duration-300 shadow-md hover:shadow-lg cursor-pointer ${
                    isExpanded ? 'border-accent-border/40' : 'border-border-subtle hover:border-accent-primary/50'
                  }`}
                >
                  {/* Header Information */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3 border-b border-border-subtle/40">
                    <div>
                      <h3 className="text-lg sm:text-xl font-display font-extrabold text-text-primary">
                        {exp.role}
                      </h3>
                      <p className="text-sm font-semibold text-accent-primary font-sans">
                        {exp.company}
                      </p>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs sm:text-sm font-medium text-text-secondary font-mono bg-bg-site/60 border border-border-subtle py-1 px-3 rounded-full w-fit">
                      <Calendar className="w-3.5 h-3.5" />
                      {exp.duration}
                    </div>
                  </div>

                  {/* Collapsible Achievement Details */}
                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3, ease: 'easeInOut' }}
                        className="overflow-hidden"
                      >
                        <ul className="list-disc pl-5 pt-4 space-y-2.5 text-text-secondary font-sans text-sm sm:text-base leading-relaxed">
                          {exp.description.map((bullet, bIdx) => (
                            <li key={bIdx} className="marker:text-accent-primary pl-1">
                              {bullet}
                            </li>
                          ))}
                        </ul>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {/* Toggle Expansion Bar */}
                  <div className="flex justify-center pt-3 mt-3 border-t border-border-subtle/30 text-text-secondary hover:text-accent-primary transition-colors text-xs font-semibold gap-1 items-center">
                    <span>{isExpanded ? 'Collapse Details' : 'Expand Details'}</span>
                    {isExpanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      )}
    </section>
  );
}
