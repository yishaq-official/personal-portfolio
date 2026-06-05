const mongoose = require('mongoose');

// Project Schema
const ProjectSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  title: { type: String, required: true },
  category: { type: String, required: true },
  description: { type: String, required: true },
  fullDescription: { type: String },
  tags: [{ type: String }],
  features: [{ type: String }],
  challenges: { type: String },
  images: [
    {
      title: { type: String },
      gradient: { type: String }
    }
  ],
  demoUrl: { type: String },
  sourceUrl: { type: String }
});

// Experience Schema
const ExperienceSchema = new mongoose.Schema({
  id: { type: Number, required: true, unique: true },
  type: { type: String, required: true }, // 'work' or 'education'
  role: { type: String, required: true },
  company: { type: String, required: true },
  duration: { type: String, required: true },
  description: [{ type: String }]
});

// Contact Message Schema
const MessageSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true },
  message: { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});

const Project = mongoose.model('Project', ProjectSchema);
const Experience = mongoose.model('Experience', ExperienceSchema);
const Message = mongoose.model('Message', MessageSchema);

module.exports = {
  Project,
  Experience,
  Message
};
