import React from 'react';
import Layout from './components/Layout/Layout.jsx';
import Hero from './components/Sections/Hero.jsx';
import About from './components/Sections/About.jsx';
import Experience from './components/Sections/Experience.jsx';
import Terminal from './components/CLI/Terminal.jsx';
import Projects from './components/Sections/Projects.jsx';

function App() {
  return (
    <Layout>
      <div className="flex flex-col space-y-12">
        {/* Hero Section */}
        <Hero />

        {/* About Section */}
        <About />

        {/* Experience Section */}
        <Experience />

        {/* Projects Gallery Section */}
        <Projects />

        <section id="contact" className="w-full max-w-4xl py-16 border-t border-border-subtle text-left">
          <h2 className="text-3xl font-display font-bold text-text-primary mb-4">Get in Touch</h2>
          <p className="text-text-secondary leading-relaxed">
            Validating input contact forms with status feedback animations will reside here.
          </p>
        </section>

        {/* Terminal CLI Section */}
        <Terminal />
      </div>
    </Layout>
  );
}

export default App;
