import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ProjectModal from './ProjectModal.jsx';
import { FolderGit2, ArrowUpRight, Loader2 } from 'lucide-react';
import { apiUrl } from '../../lib/api.js';

const fallbackProjects = [
  {
    id: 1,
    title: 'Dev Shell Terminal',
    category: 'CLI',
    description: 'A mock web terminal mimicking interactive Linux shell command consoles with command history buffers.',
    fullDescription: 'An advanced terminal emulation toolkit for web pages. Built to provide a CLI style portfolio interface, complete with command history traversal, custom script parsing, and direct website layout styling command overrides.',
    tags: ['React', 'TypeScript', 'Node.js', 'Tailwind'],
    features: ['Unix-like parsing architecture.', 'History traversers via Up/Down arrow keys.', 'Custom theme & accent style changers.'],
    challenges: 'Managing the continuous keyboard focus loops across various DOM clicks. Solved by binding focus managers to the outer component click wrapper.',
    images: [
      { title: 'CLI Dashboard', gradient: 'from-violet-500 to-indigo-600' },
      { title: 'Command List Output', gradient: 'from-emerald-500 to-teal-600' }
    ]
  },
  {
    id: 2,
    title: 'Cloud Metrics Panel',
    category: 'Frontend',
    description: 'Sleek dark-mode dashboard displaying server performance statistics and colorful canvas metrics.',
    fullDescription: 'A real-time metrics telemetry dashboard containing glassmorphic details, responsive grids, and interactive canvas graphics. Features live animations and customized layout widget rearrangement states.',
    tags: ['React', 'Vite', 'Tailwind CSS', 'Framer Motion'],
    features: ['Real-time animations.', 'Glassmorphic card panels.', 'Grid responsiveness indicators.'],
    challenges: 'Preventing excessive HMR and re-rendering calculations on canvas statistics logs. Resolved utilizing standard reference values and memoized components.',
    images: [
      { title: 'Metrics Screen', gradient: 'from-blue-500 to-indigo-600' },
      { title: 'Widget Configurator', gradient: 'from-rose-500 to-pink-600' }
    ]
  },
  {
    id: 3,
    title: 'REST GraphQL Engine',
    category: 'Backend',
    description: 'High performance API server integrating Express frameworks, GraphQL endpoints, and Postgres databases.',
    fullDescription: 'A backend server template offering pre-configured databases schema builders, automated authentication models, and unified REST and GraphQL endpoint routes.',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'Docker'],
    features: ['GraphQL API structures.', 'Postgres database connection pools.', 'Containerized Docker settings.'],
    challenges: 'Handling concurrent request pools during heavy database table updates. Solved by optimizing indexing metrics and loading connection pool limits.',
    images: [
      { title: 'API Gateway Logs', gradient: 'from-amber-500 to-orange-600' },
      { title: 'Schema Model Graph', gradient: 'from-teal-500 to-emerald-600' }
    ]
  },
  {
    id: 4,
    title: 'Agile Kanban Board',
    category: 'Fullstack',
    description: 'Task management dashboard with real-time drag-and-drop actions and collaborative sync properties.',
    fullDescription: 'A kanban project manager web application. Built to coordinate developer issues, status cards, and tasks. Integrates drag-and-drop event animations and live synchronization.',
    tags: ['React', 'Node.js', 'PostgreSQL', 'Tailwind'],
    features: ['Drag & Drop card list handlers.', 'Collab status synchronizations.', 'Priority status logs.'],
    challenges: 'Designing smooth drag operations that sync with local databases updates instantly. Solved utilizing optimistic UI state changes.',
    images: [
      { title: 'Board Workspace', gradient: 'from-pink-500 to-rose-600' },
      { title: 'Detail Card Editor', gradient: 'from-emerald-500 to-teal-600' }
    ]
  }
];

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All');
  const [selectedProject, setSelectedProject] = useState(null);
  const [projects, setProjects] = useState(fallbackProjects);
  const [loading, setLoading] = useState(true);

  const filters = ['All', 'Frontend', 'Backend', 'Fullstack', 'CLI'];

  useEffect(() => {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 3000);

    fetch(apiUrl('/api/projects'), { signal: controller.signal })
      .then((res) => {
        if (!res.ok) throw new Error('Failed to fetch projects API');
        return res.json();
      })
      .then((data) => {
        clearTimeout(timeoutId);
        if (Array.isArray(data) && data.length > 0) {
          setProjects(data);
        }
        setLoading(false);
      })
      .catch((err) => {
        clearTimeout(timeoutId);
        if (err.name !== 'AbortError') {
          console.warn('Projects endpoint failed, serving local fallback data:', err.message);
        }
        setLoading(false);
      });

    return () => {
      clearTimeout(timeoutId);
      controller.abort();
    };
  }, []);

  // Filtering Logic
  const filteredProjects = activeFilter === 'All'
    ? projects
    : projects.filter(p => p.category.toLowerCase() === activeFilter.toLowerCase());

  return (
    <section id="projects" className="py-20 border-t border-border-subtle w-full flex flex-col gap-12 text-left">
      {/* Title */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div className="space-y-3">
          <h2 className="text-3xl font-display font-extrabold text-text-primary">
            Selected <span className="text-gradient">Projects</span>
          </h2>
          <div className="h-1 w-12 bg-accent-primary rounded-full" />
        </div>

        {/* Filter Navigation */}
        <div className="glass-panel flex flex-wrap gap-1.5 p-1.5 rounded-2xl w-fit">
          {filters.map((filter) => (
            <button
              key={filter}
              onClick={() => setActiveFilter(filter)}
              className={`px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-200 cursor-pointer ${
                activeFilter === filter
                  ? 'bg-accent-primary text-white shadow-md'
                  : 'text-text-secondary hover:text-text-primary hover:bg-border-subtle/30'
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      {/* Projects Cards Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-secondary select-none">
          <Loader2 className="w-8 h-8 animate-spin text-accent-primary" />
          <p className="text-sm font-semibold">Synchronizing projects from API...</p>
        </div>
      ) : (
        <motion.div
          layout
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project) => {
              const previewImage = project.images?.[0];
              const previewGradient = previewImage?.gradient || 'from-violet-500 to-indigo-600';

              return (
                <motion.div
                  layout
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.4 }}
                  onClick={() => setSelectedProject(project)}
                  className="group premium-card glass-panel border border-border-subtle rounded-2xl flex flex-col justify-between h-[380px] cursor-pointer relative overflow-hidden"
                >
                  <div className={`h-28 ${previewImage?.src ? 'bg-bg-site' : `bg-gradient-to-br ${previewGradient}`} relative overflow-hidden`}>
                    {previewImage?.src && (
                      <img
                        src={previewImage.src}
                        alt={previewImage.title || `${project.title} screenshot`}
                        className="absolute inset-0 w-full h-full object-cover"
                      />
                    )}
                    <div className="absolute inset-0 bg-black/20" />
                    <div className="absolute inset-x-0 bottom-0 h-px bg-white/30" />
                    <div className="absolute left-5 bottom-4 flex items-center gap-2 text-white">
                      <div className="p-2 rounded-xl bg-white/15 border border-white/20 backdrop-blur">
                        <FolderGit2 className="w-5 h-5" />
                      </div>
                      <span className="text-[10px] font-extrabold uppercase tracking-wider bg-white/15 border border-white/20 py-1 px-2.5 rounded-full backdrop-blur">
                        {project.category}
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col flex-grow justify-between p-6">
                    <div className="space-y-3">
                      <h3 className="text-xl font-display font-extrabold text-text-primary group-hover:text-accent-primary transition-colors flex items-center gap-1.5">
                        {project.title}
                        <ArrowUpRight className="w-4 h-4 opacity-0 group-hover:opacity-100 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-all duration-300 text-accent-primary" />
                      </h3>
                      <p className="text-text-secondary text-sm font-sans leading-relaxed line-clamp-4">
                        {project.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1.5 pt-5 mt-5 border-t border-border-subtle/40">
                      {project.tags.slice(0, 4).map((tag) => (
                        <span
                          key={tag}
                          className="px-2.5 py-1 bg-bg-site/80 border border-border-subtle text-text-secondary text-[10px] font-semibold rounded-md uppercase tracking-wider"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}

      {/* Render detailed details modal popup */}
      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
