import { useState } from 'react';
import { motion } from 'framer-motion';
import { Award, Briefcase, Code } from 'lucide-react';

export default function About() {
  const [activeTab, setActiveTab] = useState('Frontend');

  const stats = [
    { label: 'Years Experience', value: '3+', icon: <Award className="w-5 h-5 text-accent-primary" /> },
    { label: 'Projects Completed', value: '20+', icon: <Briefcase className="w-5 h-5 text-accent-primary" /> },
    { label: 'Contributions', value: '15+', icon: <Code className="w-5 h-5 text-accent-primary" /> },
  ];

  const skillsData = {
    Frontend: [
      { name: 'React (18/19)', level: 90 },
      { name: 'TypeScript / JavaScript', level: 85 },
      { name: 'Tailwind CSS (v3/v4)', level: 95 },
      { name: 'Next.js / Vite', level: 80 },
    ],
    Backend: [
      { name: 'Node.js / Express', level: 80 },
      { name: 'PostgreSQL / SQL', level: 75 },
      { name: 'REST & GraphQL APIs', level: 85 },
      { name: 'Python', level: 70 },
    ],
    Tools: [
      { name: 'Git / GitHub', level: 90 },
      { name: 'Docker / Containers', level: 70 },
      { name: 'Linux OS / Bash', level: 80 },
      { name: 'Figma / UI Design', level: 75 },
    ],
    Cloud: [
      { name: 'AWS (EC2, S3, Lambda)', level: 65 },
      { name: 'Docker & Docker Compose', level: 75 },
      { name: 'CI/CD Pipelines', level: 70 },
      { name: 'Nginx / Reverse Proxy', level: 68 },
    ]
  };

  return (
    <section id="about" className="py-20 border-t border-border-subtle w-full flex flex-col gap-12 text-left">
      {/* Title */}
      <div className="space-y-3">
        <h2 className="text-3xl font-display font-extrabold text-text-primary">
          About <span className="text-gradient">Me</span>
        </h2>
        <div className="h-1 w-12 bg-accent-primary rounded-full" />
      </div>

      <div className="flex flex-col lg:flex-row gap-12 lg:gap-16 items-start">
        {/* Left Column: Narrative & Stats Grid */}
        <div className="w-full lg:w-[45%] space-y-8">
          <p className="text-text-secondary leading-relaxed font-sans text-base sm:text-lg">
            I am a passionate developer with a strong foundation in frontend and backend technologies. I enjoy solving algorithmic challenges, crafting beautiful user experiences, and setting up scalable dev workflows.
          </p>
          <p className="text-text-secondary leading-relaxed font-sans text-base">
            My journey in software engineering is driven by continuous learning and sharing my knowledge with the developer community. When I'm not coding, I'm usually building mechanical keyboards, photographing landscapes, or refining my coffee brewing.
          </p>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 pt-4">
            {stats.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="premium-card glass-panel p-4 rounded-xl border border-border-subtle flex flex-col items-center justify-center text-center space-y-2"
              >
                <div className="p-2 rounded-xl bg-accent-glow">
                  {stat.icon}
                </div>
                <span className="text-2xl font-display font-extrabold text-text-primary">
                  {stat.value}
                </span>
                <span className="text-[10px] sm:text-xs font-semibold text-text-secondary uppercase tracking-wider leading-tight">
                  {stat.label}
                </span>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Right Column: Skills Panel */}
        <div className="w-full lg:w-[55%] hero-panel rounded-2xl border border-border-subtle p-6 sm:p-8 space-y-6 overflow-hidden">
          <div className="flex items-center justify-between border-b border-border-subtle pb-4">
            <h3 className="text-lg font-display font-bold text-text-primary flex items-center gap-2">
              <Code className="w-5 h-5 text-accent-primary" />
              Technical Skills
            </h3>
            
            {/* Category Tab selectors */}
            <div className="glass-panel flex space-x-1 p-1 rounded-xl">
              {Object.keys(skillsData).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 cursor-pointer ${
                    activeTab === cat
                      ? 'bg-accent-primary text-white shadow-md'
                      : 'text-text-secondary hover:text-text-primary hover:bg-border-subtle/40'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>

          {/* Active Skills List */}
          <div className="space-y-5">
            {skillsData[activeTab].map((skill, idx) => (
              <div key={skill.name} className="premium-card rounded-xl border border-border-subtle/50 bg-bg-site/35 p-4 space-y-2">
                <div className="flex justify-between items-center text-sm font-medium">
                  <span className="text-text-primary font-sans">{skill.name}</span>
                  <span className="text-accent-primary font-mono">{skill.level}%</span>
                </div>
                
                {/* Progress bar wrapper */}
                <div className="w-full h-2.5 bg-border-subtle/50 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    whileInView={{ width: `${skill.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut', delay: idx * 0.05 }}
                    className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full"
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
