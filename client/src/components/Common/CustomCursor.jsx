import React, { useEffect, useState } from 'react';
import { motion, useMotionValue, useSpring } from 'framer-motion';
import { useTheme } from '../../context/ThemeContext.jsx';

export default function CustomCursor() {
  const { showCursor } = useTheme();
  const [hovered, setHovered] = useState(false);
  const [hidden, setHidden] = useState(true);

  // Framer Motion motion values
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  // Smooth springs for lag/springy effect
  const springConfig = { damping: 30, stiffness: 300, mass: 0.5 };
  const cursorX = useSpring(mouseX, springConfig);
  const cursorY = useSpring(mouseY, springConfig);

  useEffect(() => {
    if (!showCursor) return;

    const moveCursor = (e) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);
      setHidden(false);
    };

    const handleMouseLeave = () => setHidden(true);
    const handleMouseEnter = () => setHidden(false);

    window.addEventListener('mousemove', moveCursor);
    document.addEventListener('mouseleave', handleMouseLeave);
    document.addEventListener('mouseenter', handleMouseEnter);

    // Clickable hover listener
    const addHoverListeners = () => {
      const clickables = document.querySelectorAll(
        'a, button, select, input, textarea, [role="button"], .cursor-pointer'
      );
      
      clickables.forEach((el) => {
        // Remove existing to avoid double binding
        el.removeEventListener('mouseenter', () => setHovered(true));
        el.removeEventListener('mouseleave', () => setHovered(false));
        
        el.addEventListener('mouseenter', () => setHovered(true));
        el.addEventListener('mouseleave', () => setHovered(false));
      });
    };

    // Set up MutationObserver to re-attach hover listeners on dynamic DOM changes
    const observer = new MutationObserver(addHoverListeners);
    observer.observe(document.body, { childList: true, subtree: true });

    addHoverListeners();

    return () => {
      window.removeEventListener('mousemove', moveCursor);
      document.removeEventListener('mouseleave', handleMouseLeave);
      document.removeEventListener('mouseenter', handleMouseEnter);
      observer.disconnect();
    };
  }, [showCursor, mouseX, mouseY]);

  if (!showCursor || hidden) return null;

  return (
    <>
      {/* Outer Ring */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          width: hovered ? 46 : 24,
          height: hovered ? 46 : 24,
          backgroundColor: hovered ? 'var(--accent-glow)' : 'rgba(0, 0, 0, 0)',
          borderColor: 'var(--accent-primary)',
          borderWidth: hovered ? '1px' : '2px',
        }}
        transition={{ type: 'tween', ease: 'backOut', duration: 0.2 }}
        className="fixed top-0 left-0 rounded-full pointer-events-none z-[9999] hidden md:block border-solid"
      />
      {/* Center Dot */}
      <motion.div
        style={{
          x: cursorX,
          y: cursorY,
          translateX: '-50%',
          translateY: '-50%',
        }}
        animate={{
          scale: hovered ? 0.3 : 1,
          backgroundColor: 'var(--accent-primary)',
        }}
        transition={{ type: 'tween', ease: 'linear', duration: 0.1 }}
        className="fixed top-0 left-0 w-2.5 h-2.5 rounded-full pointer-events-none z-[9999] hidden md:block"
      />
    </>
  );
}
