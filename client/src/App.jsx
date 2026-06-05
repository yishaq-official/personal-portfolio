import { useTheme } from './context/ThemeContext.jsx'

function App() {
  const { theme, accent, toggleTheme, changeAccent } = useTheme();

  return (
    <div className="min-h-screen flex flex-col items-center justify-center p-8 bg-bg-site text-text-primary transition-colors duration-300">
      {/* Moving background mesh effect to check visuals */}
      <div className="absolute inset-0 mesh-grid opacity-30 pointer-events-none"></div>

      <div className="glass-panel relative z-10 max-w-md w-full p-8 rounded-2xl shadow-xl flex flex-col items-center text-center space-y-6">
        <h1 className="text-3xl font-display font-extrabold text-gradient">
          Developer Portfolio
        </h1>
        
        <p className="text-text-secondary font-sans text-sm">
          Theme Context & Tailwind v4 Configured
        </p>

        <div className="w-full py-4 px-6 rounded-xl bg-accent-glow border border-border-subtle flex flex-col space-y-2">
          <p className="text-text-secondary font-sans text-sm flex justify-between">
            <span>Theme Mode:</span>
            <span className="font-semibold text-text-primary uppercase">{theme}</span>
          </p>
          <p className="text-text-secondary font-sans text-sm flex justify-between">
            <span>Accent Theme:</span>
            <span className="font-semibold text-accent-primary uppercase">{accent}</span>
          </p>
        </div>

        <button
          onClick={toggleTheme}
          className="w-full py-3 px-6 bg-accent-primary hover:bg-accent-secondary text-white font-semibold rounded-xl shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
        >
          Toggle {theme === 'light' ? 'Dark' : 'Light'} Mode
        </button>

        <div className="w-full pt-4 border-t border-border-subtle flex flex-col space-y-3">
          <p className="text-xs font-semibold text-text-secondary tracking-wider uppercase">
            Select Accent Theme
          </p>
          <div className="flex justify-center space-x-3">
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
                className={`w-8 h-8 rounded-full cursor-pointer transition-all duration-200 ${
                  accent === color ? 'ring-4 ring-offset-2 ring-accent-primary scale-110' : 'hover:scale-105'
                }`}
                title={color}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
