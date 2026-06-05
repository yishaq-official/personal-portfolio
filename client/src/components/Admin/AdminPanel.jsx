import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Lock,
  Loader2,
  FolderKanban,
  CalendarDays,
  Inbox,
  LogOut,
  Plus,
  Trash2,
  Edit2,
  CheckCircle,
  AlertTriangle
} from 'lucide-react';
import { apiUrl } from '../../lib/api.js';

export default function AdminPanel({ isOpen, onClose }) {
  const [password, setPassword] = useState('');
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '');
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('adminToken'));
  const [authError, setAuthError] = useState('');
  const [authLoading, setAuthLoading] = useState(false);

  // Active Tab: 'projects' | 'timeline' | 'messages'
  const [activeTab, setActiveTab] = useState('projects');
  
  // Data lists
  const [projects, setProjects] = useState([]);
  const [experiences, setExperiences] = useState([]);
  const [messages, setMessages] = useState([]);
  
  // Loaders
  const [loadingData, setLoadingData] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [feedback, setFeedback] = useState({ type: '', text: '' });

  // Modal forms
  const [projectFormOpen, setProjectFormOpen] = useState(false);
  const [editingProject, setEditingProject] = useState(null); // null for "Add", project object for "Edit"
  const [projectForm, setProjectForm] = useState({
    title: '',
    category: '',
    description: '',
    fullDescription: '',
    tags: '',
    features: '',
    challenges: '',
    demoUrl: '',
    sourceUrl: '',
    imageSlides: ''
  });

  const [experienceFormOpen, setExperienceFormOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState(null); // null for "Add", exp object for "Edit"
  const [experienceForm, setExperienceForm] = useState({
    type: 'work',
    role: '',
    company: '',
    duration: '',
    description: ''
  });

  const showFeedback = (type, text) => {
    setFeedback({ type, text });
    setTimeout(() => setFeedback({ type: '', text: '' }), 4000);
  };

  // Login handler
  const handleLogin = (e) => {
    e.preventDefault();
    if (!password.trim()) return;
    setAuthLoading(true);
    setAuthError('');

    fetch(apiUrl('/api/auth/login'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password })
    })
      .then((res) => {
        if (!res.ok) throw new Error('Invalid administration password');
        return res.json();
      })
      .then((data) => {
        setToken(data.token);
        localStorage.setItem('adminToken', data.token);
        setIsAuthenticated(true);
        setAuthLoading(false);
        setPassword('');
      })
      .catch((err) => {
        setAuthError(err.message);
        setAuthLoading(false);
      });
  };

  // Logout handler
  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    setToken('');
    setIsAuthenticated(false);
    setProjects([]);
    setExperiences([]);
    setMessages([]);
  };

  // Fetch lists
  const fetchData = useCallback(async () => {
    setLoadingData(true);
    const headers = { 'Authorization': `Bearer ${token}` };

    try {
      if (activeTab === 'projects') {
        const res = await fetch(apiUrl('/api/projects'));
        const data = await res.json();
        setProjects(Array.isArray(data) ? data : []);
      } else if (activeTab === 'timeline') {
        const res = await fetch(apiUrl('/api/experience'));
        const data = await res.json();
        setExperiences(Array.isArray(data) ? data : []);
      } else if (activeTab === 'messages') {
        const res = await fetch(apiUrl('/api/admin/messages'), { headers });
        if (!res.ok) throw new Error(`Failed to retrieve messages (${res.status})`);
        const data = await res.json();
        setMessages(Array.isArray(data) ? data : []);
      }
    } catch (err) {
      console.error('Fetch error:', err.message);
      if (activeTab === 'messages' && err.message.includes('403')) {
        handleLogout();
      }
    } finally {
      setLoadingData(false);
    }
  }, [activeTab, token]);

  // Verify auth token on launch
  useEffect(() => {
    if (isOpen && isAuthenticated) {
      const timeoutId = window.setTimeout(() => {
        fetchData();
      }, 0);

      return () => window.clearTimeout(timeoutId);
    }

    return undefined;
  }, [isOpen, isAuthenticated, fetchData]);

  // Project CRUD Actions
  const handleOpenProjectForm = (proj = null) => {
    if (proj) {
      setEditingProject(proj);
      setProjectForm({
        title: proj.title || '',
        category: proj.category || '',
        description: proj.description || '',
        fullDescription: proj.fullDescription || '',
        tags: Array.isArray(proj.tags) ? proj.tags.join(', ') : '',
        features: Array.isArray(proj.features) ? proj.features.join('\n') : '',
        challenges: proj.challenges || '',
        demoUrl: proj.demoUrl || '',
        sourceUrl: proj.sourceUrl || '',
        imageSlides: Array.isArray(proj.images)
          ? proj.images.map(img => img.gradient || '').filter(Boolean).join(', ')
          : ''
      });
    } else {
      setEditingProject(null);
      setProjectForm({
        title: '',
        category: 'Fullstack',
        description: '',
        fullDescription: '',
        tags: '',
        features: '',
        challenges: '',
        demoUrl: '',
        sourceUrl: '',
        imageSlides: ''
      });
    }
    setProjectFormOpen(true);
  };

  const handleSaveProject = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    // Parse imageSlides: comma-separated gradient strings like "from-violet-500 to-indigo-600"
    const slideGradients = projectForm.imageSlides
      ? projectForm.imageSlides.split(',').map(g => g.trim()).filter(Boolean)
      : [];
    const images = slideGradients.length > 0
      ? slideGradients.map((gradient, i) => ({ title: `Preview ${i + 1}`, gradient }))
      : [{ title: 'Workspace Preview', gradient: 'from-violet-500 to-indigo-600' }];

    const payload = {
      ...projectForm,
      tags: projectForm.tags.split(',').map(t => t.trim()).filter(Boolean),
      features: projectForm.features.split('\n').map(f => f.trim()).filter(Boolean),
      images,
    };

    const url = editingProject 
      ? apiUrl(`/api/admin/projects/${editingProject.id}`)
      : apiUrl('/api/admin/projects');
    const method = editingProject ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save project records');
      showFeedback('success', `Project successfully ${editingProject ? 'updated' : 'created'}!`);
      setProjectFormOpen(false);
      fetchData();
    } catch (err) {
      showFeedback('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    if (!confirm('Are you sure you want to delete this project?')) return;
    setActionLoading(true);

    try {
      const res = await fetch(apiUrl(`/api/admin/projects/${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete project');
      showFeedback('success', 'Project successfully deleted!');
      fetchData();
    } catch (err) {
      showFeedback('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Experience CRUD Actions
  const handleOpenExperienceForm = (exp = null) => {
    if (exp) {
      setEditingExperience(exp);
      setExperienceForm({
        type: exp.type || 'work',
        role: exp.role || '',
        company: exp.company || '',
        duration: exp.duration || '',
        description: Array.isArray(exp.description) ? exp.description.join('\n') : ''
      });
    } else {
      setEditingExperience(null);
      setExperienceForm({
        type: 'work',
        role: '',
        company: '',
        duration: '',
        description: ''
      });
    }
    setExperienceFormOpen(true);
  };

  const handleSaveExperience = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    const payload = {
      ...experienceForm,
      description: experienceForm.description.split('\n').map(d => d.trim()).filter(Boolean)
    };

    const url = editingExperience
      ? apiUrl(`/api/admin/experience/${editingExperience.id}`)
      : apiUrl('/api/admin/experience');
    const method = editingExperience ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });
      if (!res.ok) throw new Error('Failed to save experience timeline');
      showFeedback('success', `Timeline item ${editingExperience ? 'updated' : 'created'}!`);
      setExperienceFormOpen(false);
      fetchData();
    } catch (err) {
      showFeedback('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  const handleDeleteExperience = async (id) => {
    if (!confirm('Are you sure you want to delete this timeline item?')) return;
    setActionLoading(true);

    try {
      const res = await fetch(apiUrl(`/api/admin/experience/${id}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete experience');
      showFeedback('success', 'Experience item successfully deleted!');
      fetchData();
    } catch (err) {
      showFeedback('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  // Message Actions
  const handleDeleteMessage = async (id, index) => {
    if (!confirm('Are you sure you want to clear this message?')) return;
    setActionLoading(true);

    // If memory mode, index is used. Otherwise Mongo ID
    const deleteId = id || index;

    try {
      const res = await fetch(apiUrl(`/api/admin/messages/${deleteId}`), {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!res.ok) throw new Error('Failed to delete message');
      showFeedback('success', 'Message cleared successfully!');
      fetchData();
    } catch (err) {
      showFeedback('error', err.message);
    } finally {
      setActionLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 backdrop-blur-md z-[2000]"
          />

          {/* Dialog Container */}
          <div className="fixed inset-0 flex items-center justify-center p-4 sm:p-6 z-[2001] pointer-events-none select-none">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: 'spring', damping: 25, stiffness: 220 }}
              className="w-full max-w-4xl max-h-[85vh] bg-bg-card border border-border-subtle rounded-3xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto select-text"
            >
              {/* Header */}
              <div className="flex items-center justify-between p-6 border-b border-border-subtle bg-bg-card/80 backdrop-blur-xl">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-2xl bg-accent-glow border border-accent-primary/20 text-accent-primary">
                    <Lock className="w-5 h-5" />
                  </div>
                  <div>
                    <h2 className="text-xl font-display font-extrabold text-text-primary">
                      System Management Panel
                    </h2>
                    <p className="text-xs text-text-secondary flex items-center gap-1.5 font-mono mt-0.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping inline-block" />
                      Status: {isAuthenticated ? 'Authenticated (Admin)' : 'Gatekeeper Lock'}
                    </p>
                  </div>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 rounded-xl hover:bg-border-subtle text-text-secondary hover:text-text-primary transition cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Toast Feedback popup */}
              <AnimatePresence>
                {feedback.text && (
                  <motion.div
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className={`mx-6 mt-4 p-3.5 rounded-xl border flex items-center gap-2.5 text-sm font-semibold select-none ${
                      feedback.type === 'success'
                        ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-400'
                        : 'bg-red-500/10 border-red-500/30 text-red-400'
                    }`}
                  >
                    {feedback.type === 'success' ? (
                      <CheckCircle className="w-5 h-5 shrink-0" />
                    ) : (
                      <AlertTriangle className="w-5 h-5 shrink-0" />
                    )}
                    <span>{feedback.text}</span>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Main Body */}
              <div className="flex-grow overflow-y-auto p-6 min-h-[300px]">
                {!isAuthenticated ? (
                  /* LOGIN GATE */
                  <form onSubmit={handleLogin} className="max-w-md mx-auto py-12 space-y-6">
                    <div className="text-center space-y-2 select-none">
                      <h3 className="text-lg font-bold text-text-primary">
                        Administrator Access Verification
                      </h3>
                      <p className="text-sm text-text-secondary leading-relaxed font-sans">
                        Please provide your secure system credentials to make changes to database items and configs.
                      </p>
                    </div>

                    <div className="space-y-4">
                      <div className="relative">
                        <input
                          type="password"
                          required
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter admin password"
                          className="w-full bg-bg-site/60 border border-border-subtle focus:border-accent-primary rounded-xl pl-11 pr-4 py-3 text-text-primary text-sm outline-none transition-all"
                        />
                        <Lock className="w-4 h-4 text-text-secondary absolute left-4 top-3.5" />
                      </div>

                      {authError && (
                        <p className="text-red-400 text-xs flex items-center gap-1 font-sans select-none">
                          <AlertTriangle className="w-4 h-4" />
                          {authError}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={authLoading}
                        className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-accent-primary hover:bg-accent-secondary disabled:bg-border-subtle disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-md transition-all cursor-pointer select-none"
                      >
                        {authLoading ? (
                          <Loader2 className="w-4 h-4 animate-spin" />
                        ) : (
                          'Unlock Dashboard'
                        )}
                      </button>
                    </div>
                  </form>
                ) : (
                  /* AUTHENTICATED SYSTEM DASHBOARD */
                  <div className="space-y-6">
                    {/* Navigation tabs */}
                    <div className="flex flex-wrap items-center justify-between gap-4 border-b border-border-subtle pb-4 select-none">
                      <div className="flex items-center bg-bg-site/60 p-1.5 rounded-2xl border border-border-subtle">
                        <button
                          onClick={() => setActiveTab('projects')}
                          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                            activeTab === 'projects'
                              ? 'bg-accent-primary text-white shadow-sm'
                              : 'text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          <FolderKanban className="w-4 h-4" />
                          Projects
                        </button>
                        <button
                          onClick={() => setActiveTab('timeline')}
                          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                            activeTab === 'timeline'
                              ? 'bg-accent-primary text-white shadow-sm'
                              : 'text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          <CalendarDays className="w-4 h-4" />
                          Timeline
                        </button>
                        <button
                          onClick={() => setActiveTab('messages')}
                          className={`flex items-center gap-2 py-2 px-4 rounded-xl text-xs sm:text-sm font-semibold transition cursor-pointer ${
                            activeTab === 'messages'
                              ? 'bg-accent-primary text-white shadow-sm'
                              : 'text-text-secondary hover:text-text-primary'
                          }`}
                        >
                          <Inbox className="w-4 h-4" />
                          Inbox
                        </button>
                      </div>

                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-1.5 py-2 px-4 border border-red-500/30 hover:bg-red-500/10 text-red-400 rounded-xl text-xs font-semibold transition cursor-pointer"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        Lock Console
                      </button>
                    </div>

                    {/* Loader */}
                    {loadingData ? (
                      <div className="flex flex-col items-center justify-center py-20 gap-3 text-text-secondary select-none">
                        <Loader2 className="w-7 h-7 animate-spin text-accent-primary" />
                        <p className="text-xs font-semibold font-mono">Querying portfolio data store...</p>
                      </div>
                    ) : (
                      /* TAB DETAILS */
                      <div>
                        {activeTab === 'projects' && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center select-none">
                              <h3 className="text-sm font-extrabold uppercase text-text-secondary tracking-wider">
                                Project Catalog
                              </h3>
                              <button
                                onClick={() => handleOpenProjectForm()}
                                className="flex items-center gap-1.5 py-2 px-4 bg-accent-glow hover:bg-accent-primary/20 text-accent-primary border border-accent-primary/30 rounded-xl text-xs font-semibold transition cursor-pointer"
                              >
                                <Plus className="w-4 h-4" />
                                Add Project
                              </button>
                            </div>

                            {projects.length === 0 ? (
                              <p className="text-sm text-text-secondary text-center py-10 font-sans select-none">No projects found in database.</p>
                            ) : (
                              <div className="grid gap-3">
                                {projects.map((proj) => (
                                  <div
                                    key={proj.id}
                                    className="p-4 rounded-2xl border border-border-subtle bg-bg-site/30 flex items-center justify-between gap-4 hover:border-text-secondary/30 transition"
                                  >
                                    <div>
                                      <h4 className="font-bold text-text-primary text-base">{proj.title}</h4>
                                      <div className="flex items-center gap-2 mt-1">
                                        <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-accent-glow border border-accent-primary/20 text-accent-primary uppercase tracking-wide">
                                          {proj.category}
                                        </span>
                                        <span className="text-xs text-text-secondary font-sans font-medium line-clamp-1 max-w-md">
                                          {proj.description}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 select-none">
                                      <button
                                        onClick={() => handleOpenProjectForm(proj)}
                                        className="p-2 rounded-lg hover:bg-border-subtle text-text-secondary hover:text-text-primary transition cursor-pointer"
                                        title="Edit Project"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteProject(proj.id)}
                                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition cursor-pointer"
                                        title="Delete Project"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {activeTab === 'timeline' && (
                          <div className="space-y-4">
                            <div className="flex justify-between items-center select-none">
                              <h3 className="text-sm font-extrabold uppercase text-text-secondary tracking-wider">
                                Career & Education Milestones
                              </h3>
                              <button
                                onClick={() => handleOpenExperienceForm()}
                                className="flex items-center gap-1.5 py-2 px-4 bg-accent-glow hover:bg-accent-primary/20 text-accent-primary border border-accent-primary/30 rounded-xl text-xs font-semibold transition cursor-pointer"
                              >
                                <Plus className="w-4 h-4" />
                                Add Milestone
                              </button>
                            </div>

                            {experiences.length === 0 ? (
                              <p className="text-sm text-text-secondary text-center py-10 font-sans select-none">No timeline items found in database.</p>
                            ) : (
                              <div className="grid gap-3">
                                {experiences.map((exp) => (
                                  <div
                                    key={exp.id}
                                    className="p-4 rounded-2xl border border-border-subtle bg-bg-site/30 flex items-center justify-between gap-4 hover:border-text-secondary/30 transition"
                                  >
                                    <div>
                                      <h4 className="font-bold text-text-primary text-base">{exp.role}</h4>
                                      <div className="flex flex-wrap items-center gap-2 mt-1">
                                        <span className="text-xs font-semibold px-2 py-0.5 rounded-md bg-accent-glow border border-accent-primary/20 text-accent-primary uppercase tracking-wide">
                                          {exp.type}
                                        </span>
                                        <span className="text-xs font-bold text-text-primary font-mono">{exp.company}</span>
                                        <span className="text-xs text-text-secondary font-mono">({exp.duration})</span>
                                      </div>
                                    </div>
                                    <div className="flex items-center gap-2 shrink-0 select-none">
                                      <button
                                        onClick={() => handleOpenExperienceForm(exp)}
                                        className="p-2 rounded-lg hover:bg-border-subtle text-text-secondary hover:text-text-primary transition cursor-pointer"
                                        title="Edit Milestone"
                                      >
                                        <Edit2 className="w-4 h-4" />
                                      </button>
                                      <button
                                        onClick={() => handleDeleteExperience(exp.id)}
                                        className="p-2 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition cursor-pointer"
                                        title="Delete Milestone"
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}

                        {activeTab === 'messages' && (
                          <div className="space-y-4">
                            <h3 className="text-sm font-extrabold uppercase text-text-secondary tracking-wider select-none">
                              Visitor Inquiries Inbox
                            </h3>

                            {messages.length === 0 ? (
                              <p className="text-sm text-text-secondary text-center py-10 font-sans select-none">No messages received yet.</p>
                            ) : (
                              <div className="grid gap-4">
                                {messages.map((msg, index) => (
                                  <div
                                    key={msg._id || index}
                                    className="p-4 sm:p-5 rounded-2xl border border-border-subtle bg-bg-site/30 space-y-3"
                                  >
                                    <div className="flex items-center justify-between gap-3 border-b border-border-subtle/40 pb-2.5">
                                      <div>
                                        <h4 className="font-extrabold text-text-primary text-sm sm:text-base">{msg.name}</h4>
                                        <a
                                          href={`mailto:${msg.email}`}
                                          className="text-xs font-mono text-accent-primary hover:underline"
                                        >
                                          {msg.email}
                                        </a>
                                      </div>
                                      <div className="flex items-center gap-2.5 shrink-0 select-none">
                                        <span className="text-[10px] sm:text-xs font-mono text-text-secondary bg-bg-site border border-border-subtle px-2 py-1 rounded-md">
                                          {new Date(msg.createdAt).toLocaleDateString()}
                                        </span>
                                        <button
                                          onClick={() => handleDeleteMessage(msg._id, index)}
                                          className="p-1.5 rounded-lg hover:bg-red-500/10 text-red-400 hover:text-red-300 transition cursor-pointer"
                                          title="Remove inquiry"
                                        >
                                          <Trash2 className="w-4 h-4" />
                                        </button>
                                      </div>
                                    </div>
                                    <p className="text-sm text-text-secondary font-sans leading-relaxed whitespace-pre-wrap">
                                      {msg.message}
                                    </p>
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </motion.div>
          </div>

          {/* PROJECT FORM MODAL WINDOW */}
          <AnimatePresence>
            {projectFormOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setProjectFormOpen(false)}
                  className="fixed inset-0 bg-black z-[2100] cursor-pointer"
                />
                <div className="fixed inset-0 flex items-center justify-center p-4 z-[2101] pointer-events-none select-none">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="w-full max-w-xl max-h-[80vh] bg-bg-card border border-border-subtle rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto select-text"
                  >
                    <div className="flex items-center justify-between p-5 border-b border-border-subtle">
                      <h3 className="text-base font-extrabold text-text-primary flex items-center gap-2 select-none">
                        <FolderKanban className="w-4.5 h-4.5 text-accent-primary" />
                        {editingProject ? `Edit Project: ${editingProject.title}` : 'Add New Portfolio Project'}
                      </h3>
                      <button
                        onClick={() => setProjectFormOpen(false)}
                        className="p-1.5 rounded-lg hover:bg-border-subtle text-text-secondary hover:text-text-primary cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveProject} className="flex-grow overflow-y-auto p-5 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5 select-none">Project Title</label>
                          <input
                            type="text"
                            required
                            value={projectForm.title}
                            onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                            className="w-full bg-bg-site/60 border border-border-subtle focus:border-accent-primary rounded-xl px-3 py-2 text-text-primary text-xs outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5 select-none">Category</label>
                          <select
                            value={projectForm.category}
                            onChange={(e) => setProjectForm({ ...projectForm, category: e.target.value })}
                            className="w-full bg-bg-site/60 border border-border-subtle focus:border-accent-primary rounded-xl px-3 py-2 text-text-primary text-xs outline-none transition cursor-pointer"
                          >
                            <option value="CLI">CLI</option>
                            <option value="Frontend">Frontend</option>
                            <option value="Backend">Backend</option>
                            <option value="Fullstack">Fullstack</option>
                          </select>
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5 select-none">Short Sub-heading / Summary</label>
                        <input
                          type="text"
                          required
                          value={projectForm.description}
                          onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                          className="w-full bg-bg-site/60 border border-border-subtle focus:border-accent-primary rounded-xl px-3 py-2 text-text-primary text-xs outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5 select-none">Full Description</label>
                        <textarea
                          rows="3"
                          value={projectForm.fullDescription}
                          onChange={(e) => setProjectForm({ ...projectForm, fullDescription: e.target.value })}
                          className="w-full bg-bg-site/60 border border-border-subtle focus:border-accent-primary rounded-xl px-3 py-2 text-text-primary text-xs outline-none transition resize-none"
                        />
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5 select-none">Live Demo Link</label>
                          <input
                            type="text"
                            value={projectForm.demoUrl}
                            onChange={(e) => setProjectForm({ ...projectForm, demoUrl: e.target.value })}
                            className="w-full bg-bg-site/60 border border-border-subtle focus:border-accent-primary rounded-xl px-3 py-2 text-text-primary text-xs outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5 select-none">Source Code Link</label>
                          <input
                            type="text"
                            value={projectForm.sourceUrl}
                            onChange={(e) => setProjectForm({ ...projectForm, sourceUrl: e.target.value })}
                            className="w-full bg-bg-site/60 border border-border-subtle focus:border-accent-primary rounded-xl px-3 py-2 text-text-primary text-xs outline-none transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5 select-none">Tags / Libraries (Comma separated)</label>
                        <input
                          type="text"
                          value={projectForm.tags}
                          onChange={(e) => setProjectForm({ ...projectForm, tags: e.target.value })}
                          placeholder="React, Node.js, Mongoose"
                          className="w-full bg-bg-site/60 border border-border-subtle focus:border-accent-primary rounded-xl px-3 py-2 text-text-primary text-xs outline-none transition"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5 select-none">Key Features (One feature per line)</label>
                        <textarea
                          rows="3"
                          value={projectForm.features}
                          onChange={(e) => setProjectForm({ ...projectForm, features: e.target.value })}
                          placeholder="Feature 1&#10;Feature 2"
                          className="w-full bg-bg-site/60 border border-border-subtle focus:border-accent-primary rounded-xl px-3 py-2 text-text-primary text-xs outline-none transition resize-none"
                        />
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5 select-none">Image Slides (Comma-separated gradients)</label>
                        <input
                          type="text"
                          value={projectForm.imageSlides}
                          onChange={(e) => setProjectForm({ ...projectForm, imageSlides: e.target.value })}
                          placeholder="from-violet-500 to-indigo-600, from-emerald-500 to-teal-600"
                          className="w-full bg-bg-site/60 border border-border-subtle focus:border-accent-primary rounded-xl px-3 py-2 text-text-primary text-xs outline-none transition"
                        />
                        <p className="text-[10px] text-text-secondary mt-1 font-mono">Each gradient creates one carousel slide. Leave blank for default.</p>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5 select-none">Challenges Encountered & Solutions</label>
                        <textarea
                          rows="2.5"
                          value={projectForm.challenges}
                          onChange={(e) => setProjectForm({ ...projectForm, challenges: e.target.value })}
                          className="w-full bg-bg-site/60 border border-border-subtle focus:border-accent-primary rounded-xl px-3 py-2 text-text-primary text-xs outline-none transition resize-none"
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2.5 select-none">
                        <button
                          type="button"
                          onClick={() => setProjectFormOpen(false)}
                          className="px-4 py-2 rounded-xl border border-border-subtle text-text-secondary hover:text-text-primary text-xs font-semibold transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="px-5 py-2 rounded-xl bg-accent-primary hover:bg-accent-secondary disabled:bg-border-subtle disabled:cursor-not-allowed text-white text-xs font-semibold transition cursor-pointer"
                        >
                          {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save Project'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>

          {/* EXPERIENCE FORM MODAL WINDOW */}
          <AnimatePresence>
            {experienceFormOpen && (
              <>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 0.4 }}
                  exit={{ opacity: 0 }}
                  onClick={() => setExperienceFormOpen(false)}
                  className="fixed inset-0 bg-black z-[2100] cursor-pointer"
                />
                <div className="fixed inset-0 flex items-center justify-center p-4 z-[2101] pointer-events-none select-none">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95, y: 15 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.95, y: 15 }}
                    className="w-full max-w-lg bg-bg-card border border-border-subtle rounded-2xl shadow-2xl overflow-hidden flex flex-col pointer-events-auto select-text"
                  >
                    <div className="flex items-center justify-between p-5 border-b border-border-subtle">
                      <h3 className="text-base font-extrabold text-text-primary flex items-center gap-2 select-none">
                        <CalendarDays className="w-4.5 h-4.5 text-accent-primary" />
                        {editingExperience ? 'Edit Timeline Milestone' : 'Add New Timeline Milestone'}
                      </h3>
                      <button
                        onClick={() => setExperienceFormOpen(false)}
                        className="p-1.5 rounded-lg hover:bg-border-subtle text-text-secondary hover:text-text-primary cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>

                    <form onSubmit={handleSaveExperience} className="p-5 space-y-4">
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5 select-none">Milestone Type</label>
                          <select
                            value={experienceForm.type}
                            onChange={(e) => setExperienceForm({ ...experienceForm, type: e.target.value })}
                            className="w-full bg-bg-site/60 border border-border-subtle focus:border-accent-primary rounded-xl px-3 py-2 text-text-primary text-xs outline-none transition cursor-pointer"
                          >
                            <option value="work">Work Experience</option>
                            <option value="education">Education</option>
                          </select>
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5 select-none">Role / Degree Title</label>
                          <input
                            type="text"
                            required
                            value={experienceForm.role}
                            onChange={(e) => setExperienceForm({ ...experienceForm, role: e.target.value })}
                            className="w-full bg-bg-site/60 border border-border-subtle focus:border-accent-primary rounded-xl px-3 py-2 text-text-primary text-xs outline-none transition"
                          />
                        </div>
                      </div>

                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5 select-none">Company / institution</label>
                          <input
                            type="text"
                            required
                            value={experienceForm.company}
                            onChange={(e) => setExperienceForm({ ...experienceForm, company: e.target.value })}
                            className="w-full bg-bg-site/60 border border-border-subtle focus:border-accent-primary rounded-xl px-3 py-2 text-text-primary text-xs outline-none transition"
                          />
                        </div>
                        <div>
                          <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5 select-none">Duration (e.g. 2025 - Present)</label>
                          <input
                            type="text"
                            required
                            value={experienceForm.duration}
                            onChange={(e) => setExperienceForm({ ...experienceForm, duration: e.target.value })}
                            className="w-full bg-bg-site/60 border border-border-subtle focus:border-accent-primary rounded-xl px-3 py-2 text-text-primary text-xs outline-none transition"
                          />
                        </div>
                      </div>

                      <div>
                        <label className="block text-xs font-semibold text-text-secondary uppercase mb-1.5 select-none">Description Bullets (One per line)</label>
                        <textarea
                          rows="4"
                          required
                          value={experienceForm.description}
                          onChange={(e) => setExperienceForm({ ...experienceForm, description: e.target.value })}
                          placeholder="Accomplished X utilizing Y.&#10;Mentored Z teammates."
                          className="w-full bg-bg-site/60 border border-border-subtle focus:border-accent-primary rounded-xl px-3 py-2 text-text-primary text-xs outline-none transition resize-none"
                        />
                      </div>

                      <div className="pt-2 flex justify-end gap-2.5 select-none">
                        <button
                          type="button"
                          onClick={() => setExperienceFormOpen(false)}
                          className="px-4 py-2 rounded-xl border border-border-subtle text-text-secondary hover:text-text-primary text-xs font-semibold transition cursor-pointer"
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          disabled={actionLoading}
                          className="px-5 py-2 rounded-xl bg-accent-primary hover:bg-accent-secondary disabled:bg-border-subtle disabled:cursor-not-allowed text-white text-xs font-semibold transition cursor-pointer"
                        >
                          {actionLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : 'Save Milestone'}
                        </button>
                      </div>
                    </form>
                  </motion.div>
                </div>
              </>
            )}
          </AnimatePresence>
        </>
      )}
    </AnimatePresence>
  );
}
