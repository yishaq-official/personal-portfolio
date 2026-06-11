import { motion, AnimatePresence } from 'framer-motion';
import { X, Sun, Moon, Eye, EyeOff, LayoutGrid, Sparkles } from 'lucide-react';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function SettingsPanel({ isOpen, onClose, onOpenAdmin }) {
  const {
    theme,
    accent,
    showCursor,
    showParticles,
    toggleTheme,
    changeAccent,
    toggleCursor,
    toggleParticles,
  } = useTheme();

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Dark Overlay Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.4 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black z-[1000] cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed top-0 right-0 w-80 h-full bg-bg-card border-l border-border-subtle backdrop-blur-xl shadow-2xl z-[1001] p-6 flex flex-col justify-between"
          >
            <div>
              {/* Header */}
              <div className="flex items-center justify-between pb-6 border-b border-border-subtle">
                <h2 className="text-xl font-display font-extrabold text-gradient flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-accent-primary" />
                  Customization
                </h2>
                <button
                  onClick={onClose}
                  className="p-1.5 rounded-lg hover:bg-border-subtle transition-colors duration-200 cursor-pointer text-text-secondary hover:text-text-primary"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Options */}
              <div className="py-6 space-y-6">
                {/* Theme Selector (Desktop only) */}
                <div className="hidden md:block space-y-3">
                  <h3 className="text-xs font-semibold uppercase text-text-secondary tracking-wider">
                    Interface Theme
                  </h3>
                  <div className="grid grid-cols-2 gap-2">
                    <button
                      onClick={() => theme === 'dark' && toggleTheme()}
                      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border font-medium text-sm transition-all duration-200 cursor-pointer ${
                        theme === 'light'
                          ? 'bg-accent-primary text-white border-accent-primary shadow-md'
                          : 'bg-transparent text-text-secondary border-border-subtle hover:border-text-secondary'
                      }`}
                    >
                      <Sun className="w-4 h-4" />
                      Light
                    </button>
                    <button
                      onClick={() => theme === 'light' && toggleTheme()}
                      className={`flex items-center justify-center gap-2 py-2.5 px-4 rounded-xl border font-medium text-sm transition-all duration-200 cursor-pointer ${
                        theme === 'dark'
                          ? 'bg-accent-primary text-white border-accent-primary shadow-md'
                          : 'bg-transparent text-text-secondary border-border-subtle hover:border-text-secondary'
                      }`}
                    >
                      <Moon className="w-4 h-4" />
                      Dark
                    </button>
                  </div>
                </div>

                {/* Accent Color Palette */}
                <div className="space-y-3">
                  <h3 className="text-xs font-semibold uppercase text-text-secondary tracking-wider">
                    Accent Color Palette
                  </h3>
                  <div className="flex justify-between items-center gap-2 p-3 bg-bg-site/50 border border-border-subtle rounded-2xl">
                    {['violet', 'indigo', 'emerald', 'rose', 'amber'].map((color) => (
                      <button
                        key={color}
                        onClick={() => changeAccent(color)}
                        style={{
                          backgroundColor:
                            color === 'violet' ? '#8b5cf6' :
                            color === 'indigo' ? '#4f46e5' :
                            color === 'emerald' ? '#059669' :
                            color === 'rose' ? '#e11d48' : '#d97706'
                        }}
                        className={`w-9 h-9 rounded-full cursor-pointer transition-all duration-200 relative ${
                          accent === color
                            ? 'ring-4 ring-offset-2 ring-accent-primary scale-110 shadow-lg'
                            : 'hover:scale-105 opacity-80 hover:opacity-100'
                        }`}
                        title={color}
                      />
                    ))}
                  </div>
                </div>

                {/* Toggles */}
                <div className="space-y-4 pt-4 border-t border-border-subtle">
                  {/* Custom Cursor Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-accent-glow border border-border-subtle">
                        {showCursor ? (
                          <Eye className="w-4 h-4 text-accent-primary" />
                        ) : (
                          <EyeOff className="w-4 h-4 text-text-secondary" />
                        )}
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          Custom Cursor
                        </p>
                        <p className="text-xs text-text-secondary">
                          Follower ring & effects
                        </p>
                      </div>
                    </div>
                    {/* Toggle Switch */}
                    <button
                      onClick={toggleCursor}
                      className={`w-11 h-6 rounded-full cursor-pointer p-0.5 transition-colors duration-200 ${
                        showCursor ? 'bg-accent-primary' : 'bg-border-subtle'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          showCursor ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  {/* Particle Grid Toggle */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="p-2 rounded-xl bg-accent-glow border border-border-subtle">
                        <LayoutGrid
                          className={`w-4 h-4 ${
                            showParticles ? 'text-accent-primary' : 'text-text-secondary'
                          }`}
                        />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-text-primary">
                          Background Grid
                        </p>
                        <p className="text-xs text-text-secondary">
                          Moving grid overlay lines
                        </p>
                      </div>
                    </div>
                    {/* Toggle Switch */}
                    <button
                      onClick={toggleParticles}
                      className={`w-11 h-6 rounded-full cursor-pointer p-0.5 transition-colors duration-200 ${
                        showParticles ? 'bg-accent-primary' : 'bg-border-subtle'
                      }`}
                    >
                      <div
                        className={`w-5 h-5 rounded-full bg-white shadow-sm transition-transform duration-200 ${
                          showParticles ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>

                {/* Admin Portal Button */}
                <div className="pt-4 border-t border-border-subtle">
                  <button
                    onClick={() => {
                      onClose();
                      onOpenAdmin();
                    }}
                    className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-bg-site/60 hover:bg-accent-glow text-text-primary border border-border-subtle hover:border-accent-primary/30 rounded-xl text-xs font-semibold shadow-sm transition-all duration-200 cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5 text-accent-primary animate-pulse" />
                    Manage System (Admin)
                  </button>
                </div>
              </div>
            </div>

            {/* Panel Footer */}
            <div className="pt-6 border-t border-border-subtle text-center">
              <p className="text-xs text-text-secondary">
                Designed with ♥ in React & Tailwind v4
              </p>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
