const defaultProjects = [
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

const defaultExperiences = [
  {
    id: 1,
    type: 'work',
    role: 'Full Stack Developer',
    company: 'Self',
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
    company: 'Codveda technologies',
    duration: '2025',
    description: [
      'Developed responsive landing pages and interactive data dashboard widgets for client applications.',
      'Refactored legacy design files into highly reusable Tailwind CSS classes, increasing page performance.',
      'Collaborated with design teams in Figma to translate mockups directly into pixel-perfect React components.'
    ]
  },
  {
    id: 3,
    type: 'education',
    role: 'B.S. Software Engineering',
    company: 'Debre Berhan University',
    duration: '2023/24 - 2027/28',
    description: [
      'Specialized in Software Engineering and Database Design systems.',
      'Build scalable and AI integrated software solutions.',
      'Real world projects in different fields like AI, desktop app development, and scalable web development.'
    ]
  }
];

module.exports = {
  defaultProjects,
  defaultExperiences
};
