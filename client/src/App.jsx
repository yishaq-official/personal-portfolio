import React from 'react';
import Layout from './components/Layout/Layout.jsx';
import Hero from './components/Sections/Hero.jsx';
import About from './components/Sections/About.jsx';
import Experience from './components/Sections/Experience.jsx';
import Terminal from './components/CLI/Terminal.jsx';
import Projects from './components/Sections/Projects.jsx';
import Contact from './components/Sections/Contact.jsx';

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

        {/* Contact Form Section */}
        <Contact />

        {/* Terminal CLI Section */}
        <Terminal />
      </div>
    </Layout>
  );
}

export default App;
