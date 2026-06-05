import React from 'react';
import Layout from './components/Layout/Layout.jsx';

function App() {
  return (
    <Layout>
      {/* Temporary dummy page content to test scrolling & visual state toggling */}
      <div className="py-12 flex flex-col items-center justify-center space-y-16 min-h-[140vh]">
        
        {/* Hero Section Anchor */}
        <section id="home" className="w-full flex flex-col items-center justify-center text-center py-24">
          <h1 className="text-5xl md:text-7xl font-display font-extrabold text-gradient mb-6">
            John Doe
          </h1>
          <p className="text-lg md:text-xl text-text-secondary max-w-2xl font-sans leading-relaxed">
            A software developer crafting interactive interfaces and robust architectures.
          </p>
        </section>

        {/* Dummy sections to verify anchor clicks */}
        <section id="about" className="w-full max-w-4xl py-16 border-t border-border-subtle">
          <h2 className="text-3xl font-display font-bold text-text-primary mb-4">About Me</h2>
          <p className="text-text-secondary leading-relaxed">
            This is the about section. Scroll down or click the navigation header links to check how the viewport moves smoothly to other areas.
          </p>
        </section>

        <section id="experience" className="w-full max-w-4xl py-16 border-t border-border-subtle">
          <h2 className="text-3xl font-display font-bold text-text-primary mb-4">Work Experience</h2>
          <p className="text-text-secondary leading-relaxed">
            Timeline of employment and academic history will be built here in subsequent phases.
          </p>
        </section>

        <section id="projects" className="w-full max-w-4xl py-16 border-t border-border-subtle">
          <h2 className="text-3xl font-display font-bold text-text-primary mb-4">Selected Work</h2>
          <p className="text-text-secondary leading-relaxed">
            Filtered grids of code projects and custom visual overlays go here.
          </p>
        </section>

        <section id="contact" className="w-full max-w-4xl py-16 border-t border-border-subtle">
          <h2 className="text-3xl font-display font-bold text-text-primary mb-4">Get in Touch</h2>
          <p className="text-text-secondary leading-relaxed">
            Validating input contact forms with status feedback animations will reside here.
          </p>
        </section>

        <section id="terminal" className="w-full max-w-4xl py-16 border-t border-border-subtle">
          <h2 className="text-3xl font-display font-bold text-text-primary mb-4">Developer CLI</h2>
          <p className="text-text-secondary leading-relaxed">
            The interactive simulated terminal shell will be initialized in Phase 4.
          </p>
        </section>
      </div>
    </Layout>
  );
}

export default App;
