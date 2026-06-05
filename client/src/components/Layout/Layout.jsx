import { useState } from 'react';
import Header from './Header.jsx';
import Footer from './Footer.jsx';
import SettingsPanel from './SettingsPanel.jsx';
import CustomCursor from '../Common/CustomCursor.jsx';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function Layout({ children, onOpenAdmin }) {
  const { showParticles } = useTheme();
  const [settingsOpen, setSettingsOpen] = useState(false);

  return (
    <div className="relative min-h-screen flex flex-col bg-bg-site text-text-primary transition-colors duration-300 overflow-x-hidden">
      {/* Custom Mouse Follower */}
      <CustomCursor />

      <div className="app-atmosphere" />

      {/* Moving background mesh overlay */}
      {showParticles && (
        <div className="absolute inset-0 mesh-grid opacity-20 pointer-events-none z-0" />
      )}

      {/* Navigation Header */}
      <Header onOpenSettings={() => setSettingsOpen(true)} />

      {/* Main Content Area */}
      <main className="flex-grow relative z-10 w-full max-w-7xl mx-auto px-6">
        {children}
      </main>

      {/* Customization Settings Sidebar */}
      <SettingsPanel isOpen={settingsOpen} onClose={() => setSettingsOpen(false)} onOpenAdmin={onOpenAdmin} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
