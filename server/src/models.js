const fs = require('fs');
const path = require('path');
const { DatabaseSync } = require('node:sqlite');
const { defaultProjects, defaultExperiences } = require('./defaultData');

const DATA_DIR = process.env.SQLITE_DATA_DIR || path.join(__dirname, '..', 'data');
const DB_PATH = process.env.SQLITE_DB_PATH || path.join(DATA_DIR, 'portfolio.sqlite');

fs.mkdirSync(path.dirname(DB_PATH), { recursive: true });

const db = new DatabaseSync(DB_PATH);
db.exec('PRAGMA journal_mode = WAL');
db.exec('PRAGMA foreign_keys = ON');

const toJson = (value) => JSON.stringify(Array.isArray(value) ? value : []);

const fromJson = (value, fallback = []) => {
  if (!value) return fallback;
  try {
    const parsed = JSON.parse(value);
    return Array.isArray(parsed) ? parsed : fallback;
  } catch {
    return fallback;
  }
};

function normalizeImage(image, index) {
  if (typeof image === 'string') {
    return { title: `Screenshot ${index + 1}`, src: image };
  }

  return {
    title: image?.title || `Screenshot ${index + 1}`,
    src: image?.src || image?.url || '',
    gradient: image?.gradient || ''
  };
}

function normalizeProject(project) {
  return {
    id: Number(project.id),
    title: project.title || '',
    category: project.category || '',
    description: project.description || '',
    fullDescription: project.fullDescription || '',
    tags: Array.isArray(project.tags) ? project.tags : [],
    features: Array.isArray(project.features) ? project.features : [],
    challenges: project.challenges || '',
    images: Array.isArray(project.images) ? project.images.map(normalizeImage) : [],
    demoUrl: project.demoUrl || '',
    sourceUrl: project.sourceUrl || ''
  };
}

function rowToProject(row) {
  return normalizeProject({
    ...row,
    tags: fromJson(row.tags),
    features: fromJson(row.features),
    images: fromJson(row.images)
  });
}

function rowToExperience(row) {
  return {
    id: Number(row.id),
    type: row.type || 'work',
    role: row.role || '',
    company: row.company || '',
    duration: row.duration || '',
    description: fromJson(row.description)
  };
}

function rowToMessage(row) {
  return {
    id: Number(row.id),
    _id: String(row.id),
    name: row.name || '',
    email: row.email || '',
    message: row.message || '',
    createdAt: row.createdAt
  };
}

function initDatabase() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS projects (
      id INTEGER PRIMARY KEY,
      title TEXT NOT NULL,
      category TEXT NOT NULL,
      description TEXT NOT NULL,
      fullDescription TEXT DEFAULT '',
      tags TEXT NOT NULL DEFAULT '[]',
      features TEXT NOT NULL DEFAULT '[]',
      challenges TEXT DEFAULT '',
      images TEXT NOT NULL DEFAULT '[]',
      demoUrl TEXT DEFAULT '',
      sourceUrl TEXT DEFAULT '',
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS experiences (
      id INTEGER PRIMARY KEY,
      type TEXT NOT NULL,
      role TEXT NOT NULL,
      company TEXT NOT NULL,
      duration TEXT NOT NULL,
      description TEXT NOT NULL DEFAULT '[]',
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
      updatedAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS messages (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT NOT NULL,
      message TEXT NOT NULL,
      createdAt TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
    );
  `);

  const projectsCount = db.prepare('SELECT COUNT(*) AS count FROM projects').get().count;
  if (projectsCount === 0) {
    defaultProjects.forEach((project) => createProject(project, project.id));
  }

  const experiencesCount = db.prepare('SELECT COUNT(*) AS count FROM experiences').get().count;
  if (experiencesCount === 0) {
    defaultExperiences.forEach((experience) => createExperience(experience, experience.id));
  } else {
    migrateOldDefaultExperiences();
  }
}

function migrateOldDefaultExperiences() {
  const current = listExperiences();
  const hasOriginalSeedData = current.some((experience) => (
    experience.id === 1
    && experience.company === 'Velo Tech Solutions'
  )) && current.some((experience) => (
    experience.id === 3
    && experience.company === 'State Tech University'
  ));

  if (!hasOriginalSeedData) return;

  defaultExperiences.forEach((experience) => {
    updateExperience(experience.id, experience);
  });
}

function listProjects() {
  return db.prepare('SELECT * FROM projects ORDER BY id ASC').all().map(rowToProject);
}

function getProject(id) {
  const row = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  return row ? rowToProject(row) : null;
}

function createProject(payload, fixedId = null) {
  const project = normalizeProject({ ...payload, id: fixedId || nextProjectId() });
  db.prepare(`
    INSERT INTO projects (
      id, title, category, description, fullDescription, tags, features,
      challenges, images, demoUrl, sourceUrl
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `).run(
    project.id,
    project.title,
    project.category,
    project.description,
    project.fullDescription,
    toJson(project.tags),
    toJson(project.features),
    project.challenges,
    toJson(project.images),
    project.demoUrl,
    project.sourceUrl
  );
  return getProject(project.id);
}

function updateProject(id, payload) {
  const current = getProject(id);
  if (!current) return null;

  const next = normalizeProject({ ...current, ...payload, id });
  db.prepare(`
    UPDATE projects
    SET title = ?, category = ?, description = ?, fullDescription = ?, tags = ?,
        features = ?, challenges = ?, images = ?, demoUrl = ?, sourceUrl = ?,
        updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    next.title,
    next.category,
    next.description,
    next.fullDescription,
    toJson(next.tags),
    toJson(next.features),
    next.challenges,
    toJson(next.images),
    next.demoUrl,
    next.sourceUrl,
    id
  );

  return getProject(id);
}

function deleteProject(id) {
  const result = db.prepare('DELETE FROM projects WHERE id = ?').run(id);
  return result.changes > 0;
}

function nextProjectId() {
  const row = db.prepare('SELECT COALESCE(MAX(id), 0) + 1 AS id FROM projects').get();
  return Number(row.id);
}

function listExperiences() {
  return db.prepare('SELECT * FROM experiences ORDER BY id ASC').all().map(rowToExperience);
}

function getExperience(id) {
  const row = db.prepare('SELECT * FROM experiences WHERE id = ?').get(id);
  return row ? rowToExperience(row) : null;
}

function createExperience(payload, fixedId = null) {
  const experience = {
    id: fixedId || nextExperienceId(),
    type: payload.type || 'work',
    role: payload.role || '',
    company: payload.company || '',
    duration: payload.duration || '',
    description: Array.isArray(payload.description) ? payload.description : []
  };

  db.prepare(`
    INSERT INTO experiences (id, type, role, company, duration, description)
    VALUES (?, ?, ?, ?, ?, ?)
  `).run(
    experience.id,
    experience.type,
    experience.role,
    experience.company,
    experience.duration,
    toJson(experience.description)
  );

  return getExperience(experience.id);
}

function updateExperience(id, payload) {
  const current = getExperience(id);
  if (!current) return null;

  const next = {
    ...current,
    ...payload,
    id,
    description: Array.isArray(payload.description) ? payload.description : current.description
  };

  db.prepare(`
    UPDATE experiences
    SET type = ?, role = ?, company = ?, duration = ?, description = ?, updatedAt = CURRENT_TIMESTAMP
    WHERE id = ?
  `).run(
    next.type,
    next.role,
    next.company,
    next.duration,
    toJson(next.description),
    id
  );

  return getExperience(id);
}

function deleteExperience(id) {
  const result = db.prepare('DELETE FROM experiences WHERE id = ?').run(id);
  return result.changes > 0;
}

function nextExperienceId() {
  const row = db.prepare('SELECT COALESCE(MAX(id), 0) + 1 AS id FROM experiences').get();
  return Number(row.id);
}

function createMessage(payload) {
  const createdAt = payload.createdAt || new Date().toISOString();
  const result = db.prepare(`
    INSERT INTO messages (name, email, message, createdAt)
    VALUES (?, ?, ?, ?)
  `).run(payload.name, payload.email, payload.message, createdAt);
  return getMessage(result.lastInsertRowid);
}

function getMessage(id) {
  const row = db.prepare('SELECT * FROM messages WHERE id = ?').get(id);
  return row ? rowToMessage(row) : null;
}

function listMessages() {
  return db.prepare('SELECT * FROM messages ORDER BY datetime(createdAt) DESC, id DESC').all().map(rowToMessage);
}

function deleteMessage(id) {
  const result = db.prepare('DELETE FROM messages WHERE id = ?').run(id);
  return result.changes > 0;
}

function exportAllData() {
  return {
    exportedAt: new Date().toISOString(),
    database: {
      type: 'sqlite',
      path: DB_PATH
    },
    projects: listProjects(),
    experiences: listExperiences(),
    messages: listMessages()
  };
}

function resetAndSeed() {
  db.exec('DELETE FROM messages; DELETE FROM projects; DELETE FROM experiences;');
  defaultProjects.forEach((project) => createProject(project, project.id));
  defaultExperiences.forEach((experience) => createExperience(experience, experience.id));
}

initDatabase();

module.exports = {
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
  exportAllData,
  resetAndSeed
};
