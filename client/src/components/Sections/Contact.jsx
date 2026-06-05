import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Mail, MapPin, Copy, Check, Send, AlertCircle } from 'lucide-react';

export default function Contact() {
  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Copy Email Helper
  const handleCopyEmail = () => {
    navigator.clipboard.writeText('yishaq@example.com');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
    // Clear field-specific error as user types
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: '' }));
    }
  };

  // Validation Logic
  const validateForm = () => {
    const errs = {};
    if (!form.name.trim()) {
      errs.name = 'Name is required';
    } else if (form.name.trim().length < 2) {
      errs.name = 'Name must be at least 2 characters';
    }

    if (!form.email.trim()) {
      errs.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(form.email)) {
      errs.email = 'Please enter a valid email address';
    }

    if (!form.message.trim()) {
      errs.message = 'Message is required';
    } else if (form.message.trim().length < 10) {
      errs.message = 'Message must be at least 10 characters';
    }

    return errs;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    // Validation passes -> Post to Express Server
    setLoading(true);
    setErrors({});

    fetch('http://localhost:5000/api/contact', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(form),
    })
      .then((res) => {
        if (!res.ok) {
          return res.json().then((data) => {
            if (data.errors) throw data.errors;
            throw new Error('Server returned an error');
          });
        }
        return res.json();
      })
      .then(() => {
        setLoading(false);
        setSubmitted(true);
        setForm({ name: '', email: '', message: '' });

        // Dismiss success alert toast after 4s
        setTimeout(() => setSubmitted(false), 4000);
      })
      .catch((err) => {
        setLoading(false);
        if (typeof err === 'object' && err !== null) {
          setErrors(err);
        } else {
          setErrors({ submit: 'Message transmission failed. Please try again.' });
        }
      });
  };

  return (
    <section id="contact" className="py-20 border-t border-border-subtle w-full flex flex-col gap-12 text-left">
      {/* Title */}
      <div className="space-y-3">
        <h2 className="text-3xl font-display font-extrabold text-text-primary">
          Get In <span className="text-gradient">Touch</span>
        </h2>
        <div className="h-1 w-12 bg-accent-primary rounded-full" />
      </div>

      <div className="flex flex-col lg:flex-row gap-12 items-start">
        {/* Left Column: Direct info panel */}
        <div className="w-full lg:w-[40%] space-y-6">
          <p className="text-text-secondary leading-relaxed font-sans text-base sm:text-lg">
            I am currently open to new career opportunities, project collaborations, or community events. Let's build something awesome together!
          </p>

          <div className="space-y-4 pt-2">
            {/* Email item */}
            <div className="flex items-center gap-4 p-4 rounded-xl border border-border-subtle bg-bg-card/40 hover:border-accent-border/30 transition duration-300">
              <div className="p-3 rounded-xl bg-accent-glow text-accent-primary shrink-0">
                <Mail className="w-5 h-5" />
              </div>
              <div className="flex-grow min-w-0">
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Email Me</p>
                <p className="text-sm sm:text-base font-mono font-semibold text-text-primary truncate">yishaq@example.com</p>
              </div>
              <button
                onClick={handleCopyEmail}
                className="p-2 rounded-lg border border-border-subtle hover:border-text-secondary hover:bg-border-subtle/30 text-text-secondary hover:text-text-primary transition shrink-0 cursor-pointer"
                title="Copy email to clipboard"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Location item */}
            <div className="flex items-center gap-4 p-4 rounded-xl border border-border-subtle bg-bg-card/40">
              <div className="p-3 rounded-xl bg-accent-glow text-accent-primary shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div>
                <p className="text-xs font-semibold text-text-secondary uppercase tracking-wider">Location</p>
                <p className="text-sm sm:text-base font-semibold text-text-primary">Addis Ababa, Ethiopia</p>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column: Submission Form card */}
        <div className="w-full lg:w-[60%] glass-panel border border-border-subtle rounded-2xl p-6 sm:p-8 space-y-6">
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Name input */}
            <div className="relative pt-2 w-full">
              <input
                type="text"
                id="name"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full bg-bg-site/60 border border-border-subtle focus:border-accent-primary rounded-xl px-4 py-3 text-text-primary text-sm placeholder-transparent outline-none transition-all duration-200"
              />
              <label
                htmlFor="name"
                className="absolute left-4 top-5 text-xs sm:text-sm text-text-secondary transition-all duration-200 origin-[0] -translate-y-4.5 scale-75 transform select-none bg-bg-card px-1.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5 peer-focus:scale-75 peer-focus:text-accent-primary"
              >
                Your Name
              </label>
              {errors.name && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1 font-sans">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.name}
                </p>
              )}
            </div>

            {/* Email input */}
            <div className="relative pt-2 w-full">
              <input
                type="email"
                id="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder=" "
                className="peer w-full bg-bg-site/60 border border-border-subtle focus:border-accent-primary rounded-xl px-4 py-3 text-text-primary text-sm placeholder-transparent outline-none transition-all duration-200"
              />
              <label
                htmlFor="email"
                className="absolute left-4 top-5 text-xs sm:text-sm text-text-secondary transition-all duration-200 origin-[0] -translate-y-4.5 scale-75 transform select-none bg-bg-card px-1.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5 peer-focus:scale-75 peer-focus:text-accent-primary"
              >
                Your Email Address
              </label>
              {errors.email && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1 font-sans">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.email}
                </p>
              )}
            </div>

            {/* Message input */}
            <div className="relative pt-2 w-full">
              <textarea
                id="message"
                name="message"
                value={form.message}
                onChange={handleChange}
                rows="4"
                placeholder=" "
                className="peer w-full bg-bg-site/60 border border-border-subtle focus:border-accent-primary rounded-xl px-4 py-3 text-text-primary text-sm placeholder-transparent outline-none transition-all duration-200 resize-none"
              />
              <label
                htmlFor="message"
                className="absolute left-4 top-5 text-xs sm:text-sm text-text-secondary transition-all duration-200 origin-[0] -translate-y-4.5 scale-75 transform select-none bg-bg-card px-1.5 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:-translate-y-4.5 peer-focus:scale-75 peer-focus:text-accent-primary"
              >
                Your Message
              </label>
              {errors.message && (
                <p className="text-red-400 text-xs mt-1.5 flex items-center gap-1 font-sans">
                  <AlertCircle className="w-3.5 h-3.5" />
                  {errors.message}
                </p>
              )}
            </div>

            {/* Form actions and feedback alerts */}
            <div className="space-y-4 pt-1 select-none">
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 py-3 px-6 bg-accent-primary hover:bg-accent-secondary disabled:bg-border-subtle disabled:cursor-not-allowed text-white text-sm font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-300 cursor-pointer"
              >
                {loading ? (
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Message
                  </>
                )}
              </button>

              <AnimatePresence>
                {errors.submit && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-4 bg-red-500/10 border border-red-500/30 text-red-400 rounded-xl flex items-center gap-2.5 text-sm font-semibold"
                  >
                    <AlertCircle className="w-5 h-5 text-red-400 shrink-0" />
                    <span>{errors.submit}</span>
                  </motion.div>
                )}
                {submitted && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="p-4 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 rounded-xl flex items-center gap-2.5 text-sm font-semibold"
                  >
                    <Check className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Message sent successfully! I will get back to you shortly.</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
