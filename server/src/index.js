const express = require('express');
const cors = require('cors');
const {
  DB_PATH,
  listProjects,
  createProject,
  updateProject,
  deleteProject,
  listExperiences,
  createExperience,
  updateExperience,
  deleteExperience,
  createMessage,
  listMessages,
  deleteMessage,
  exportAllData
} = require('./models');

const app = express();
const PORT = process.env.PORT || 5000;
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'yishaq123';
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || 'yishaq-dev-token-9992384';
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '25mb' }));

const verifyAdmin = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader === `Bearer ${ADMIN_TOKEN}`) {
    return next();
  }
  res.status(403).json({ error: 'Access denied. Invalid credentials.' });
};

const toInt = (value) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isNaN(parsed) ? null : parsed;
};

const validateContact = ({ name, email, message }) => {
  const errors = {};

  if (!name || name.trim().length < 2) {
    errors.name = 'Name must be at least 2 characters';
  }
  if (!email || !/\S+@\S+\.\S+/.test(email)) {
    errors.email = 'Please provide a valid email address';
  }
  if (!message || message.trim().length < 10) {
    errors.message = 'Message must be at least 10 characters';
  }

  return errors;
};

app.get('/api/health', (req, res) => {
  res.json({ ok: true, database: 'sqlite', path: DB_PATH });
});

app.get('/api/projects', (req, res) => {
  res.json(listProjects());
});

app.get('/api/experience', (req, res) => {
  res.json(listExperiences());
});

app.post('/api/contact', (req, res) => {
  const { name, email, message } = req.body;
  const errors = validateContact({ name, email, message });

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  const saved = createMessage({
    name: name.trim(),
    email: email.trim(),
    message: message.trim()
  });

  res.status(201).json({ success: true, message: saved });
});

app.post('/api/auth/login', (req, res) => {
  const { password } = req.body;

  if (password === ADMIN_PASSWORD) {
    return res.json({ token: ADMIN_TOKEN });
  }

  res.status(401).json({ error: 'Invalid administrator password' });
});

app.get('/api/admin/export', verifyAdmin, (req, res) => {
  const backup = exportAllData();
  const stamp = new Date().toISOString().replace(/[:.]/g, '-');

  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Content-Disposition', `attachment; filename="portfolio-backup-${stamp}.json"`);
  res.json(backup);
});

app.post('/api/admin/projects', verifyAdmin, (req, res) => {
  const { title, category, description } = req.body;

  if (!title || !category || !description) {
    return res.status(400).json({ error: 'Title, category, and description are required.' });
  }

  const newProject = createProject(req.body);
  res.status(201).json(newProject);
});

app.put('/api/admin/projects/:id', verifyAdmin, (req, res) => {
  const projectId = toInt(req.params.id);
  if (!projectId) return res.status(400).json({ error: 'Invalid project ID.' });

  const updated = updateProject(projectId, req.body);
  if (!updated) return res.status(404).json({ error: 'Project not found' });

  res.json(updated);
});

app.delete('/api/admin/projects/:id', verifyAdmin, (req, res) => {
  const projectId = toInt(req.params.id);
  if (!projectId) return res.status(400).json({ error: 'Invalid project ID.' });

  if (!deleteProject(projectId)) {
    return res.status(404).json({ error: 'Project not found' });
  }

  res.json({ success: true });
});

app.post('/api/admin/experience', verifyAdmin, (req, res) => {
  const { type, role, company, duration } = req.body;

  if (!type || !role || !company || !duration) {
    return res.status(400).json({ error: 'Type, role, company, and duration are required.' });
  }

  const newExperience = createExperience(req.body);
  res.status(201).json(newExperience);
});

app.put('/api/admin/experience/:id', verifyAdmin, (req, res) => {
  const expId = toInt(req.params.id);
  if (!expId) return res.status(400).json({ error: 'Invalid experience ID.' });

  const updated = updateExperience(expId, req.body);
  if (!updated) return res.status(404).json({ error: 'Experience not found' });

  res.json(updated);
});

app.delete('/api/admin/experience/:id', verifyAdmin, (req, res) => {
  const expId = toInt(req.params.id);
  if (!expId) return res.status(400).json({ error: 'Invalid experience ID.' });

  if (!deleteExperience(expId)) {
    return res.status(404).json({ error: 'Experience not found' });
  }

  res.json({ success: true });
});

app.get('/api/admin/messages', verifyAdmin, (req, res) => {
  res.json(listMessages());
});

app.delete('/api/admin/messages/:id', verifyAdmin, (req, res) => {
  const msgId = toInt(req.params.id);
  if (!msgId) return res.status(400).json({ error: 'Invalid message ID.' });

  if (!deleteMessage(msgId)) {
    return res.status(404).json({ error: 'Message not found' });
  }

  res.json({ success: true });
});

app.listen(PORT, () => {
  console.log(`Backend Server listening at http://localhost:${PORT}`);
  console.log(`SQLite database: ${DB_PATH}`);
});
