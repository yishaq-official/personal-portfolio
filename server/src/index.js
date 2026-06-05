const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const { Project, Experience, Message } = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;

// Enable CORS and JSON body parser
app.use(cors({ origin: 'http://localhost:5173' }));
app.use(express.json());

// In-Memory Database Fallbacks
let isInMemoryMode = false;
const inMemoryMessages = [];

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
    company: 'Velo Tech Solutions',
    duration: '2025 - Present',
    description: [
      'Engineered responsive interface dashboards using React 19, custom CSS modules, and Tailwind v4 core tokens.',
      'Constructed scalable Node.js API servers optimizing database schema indexing and query routines.'
    ]
  },
  {
    id: 2,
    type: 'work',
    role: 'Frontend Intern',
    company: 'Apex Code Labs',
    duration: '2023 - 2024',
    description: [
      'Developed pixel-perfect interactive pages translating design files under strict speed benchmarks.',
      'Integrated external REST services and localized device state stores using standard React hooks.'
    ]
  },
  {
    id: 3,
    type: 'education',
    role: 'B.S. Computer Science',
    company: 'State Tech University',
    duration: '2020 - 2024',
    description: [
      'Graduated with honors focusing study tracks on software engineering practices, compiler design, and databases.',
      'Developed interactive multi-threaded networking tools for peer-to-peer file synchronization as a thesis project.'
    ]
  }
];

// MongoDB Connection attempt
const MONGO_URI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/portfolio';

mongoose
  .connect(MONGO_URI, { serverSelectionTimeoutMS: 2000 })
  .then(async () => {
    console.log('Successfully connected to MongoDB.');

    // Seed database if collections are empty
    try {
      const projectsCount = await Project.countDocuments();
      if (projectsCount === 0) {
        await Project.insertMany(defaultProjects);
        console.log('MongoDB: Seeded default projects.');
      }
      const expCount = await Experience.countDocuments();
      if (expCount === 0) {
        await Experience.insertMany(defaultExperiences);
        console.log('MongoDB: Seeded default experience timeline.');
      }
    } catch (err) {
      console.error('Error during automatic seed checking:', err.message);
    }
  })
  .catch((err) => {
    console.warn('\n==================================================================');
    console.warn('WARNING: Could not connect to MongoDB. Server running in InMemory Mode.');
    console.warn('Reason:', err.message);
    console.warn('Contact submissions will be stored in RAM, and static defaults served.');
    console.warn('==================================================================\n');
    isInMemoryMode = true;
  });

// API Routes

// 1. Get Projects
app.get('/api/projects', async (req, res) => {
  if (isInMemoryMode) {
    return res.json(defaultProjects);
  }
  try {
    const list = await Project.find().sort({ id: 1 });
    res.json(list.length > 0 ? list : defaultProjects);
  } catch (err) {
    res.status(500).json({ error: 'Database fetch failed', fallback: defaultProjects });
  }
});

// 2. Get Experiences
app.get('/api/experience', async (req, res) => {
  if (isInMemoryMode) {
    return res.json(defaultExperiences);
  }
  try {
    const list = await Experience.find().sort({ id: 1 });
    res.json(list.length > 0 ? list : defaultExperiences);
  } catch (err) {
    res.status(500).json({ error: 'Database fetch failed', fallback: defaultExperiences });
  }
});

// 3. Post Contact Message
app.post('/api/contact', async (req, res) => {
  const { name, email, message } = req.body;
  const errors = {};

  // Form validations
  if (!name || name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Please provide a valid email address';
  }
  if (!message || message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const messageData = { name, email, message, createdAt: new Date() };

  if (isInMemoryMode) {
    inMemoryMessages.push(messageData);
    console.log('InMemory Database: New message received:', messageData);
    return res.status(201).json({ success: true, mode: 'InMemory' });
  }

  try {
    const newMsg = new Message(messageData);
    await newMsg.save();
    console.log('MongoDB Database: New message saved successfully.');
    res.status(201).json({ success: true });
  } catch (err) {
    console.error('Failed to save message to MongoDB:', err.message);
    res.status(500).json({ error: 'Failed to record message.' });
  }
});

// Startup Listener
app.listen(PORT, () => {
  console.log(`Backend Server listening at http://localhost:${PORT}`);
});
