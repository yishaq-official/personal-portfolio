import React, { useState, useEffect, useRef } from 'react';
import { useTheme } from '../../context/ThemeContext.jsx';
import { Terminal as TerminalIcon, ShieldAlert } from 'lucide-react';

export default function Terminal({ onAdminTrigger }) {
  const { theme, toggleTheme, accent, changeAccent } = useTheme();
  const [inputVal, setInputVal] = useState('');
  
  // Terminal logs state: each log is { type: 'input' | 'output', text: string | JSX }
  const [logs, setLogs] = useState([
    { type: 'output', text: 'Welcome to Yishaq OS v1.0.0 (x86_64-pc-linux-gnu)' },
    { type: 'output', text: "Type 'help' to see the list of available commands." },
    { type: 'output', text: '' }
  ]);

  // History buffer state
  const [history, setHistory] = useState([]);
  const [historyPointer, setHistoryPointer] = useState(-1);

  const inputRef = useRef(null);
  const scrollRef = useRef(null);

  // Auto scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [logs]);

  // Handle clicking anywhere in terminal to focus input
  const handleTerminalClick = () => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  // Focus input on initial mount
  useEffect(() => {
    handleTerminalClick();
  }, []);

  const executeCommand = (cmdString) => {
    const trimmed = cmdString.trim();
    if (!trimmed) {
      setLogs((prev) => [...prev, { type: 'input', text: '' }]);
      return;
    }

    // Add to logs & history
    const nextLogs = [...logs, { type: 'input', text: trimmed }];
    const nextHistory = [...history, trimmed];
    setHistory(nextHistory);
    setHistoryPointer(nextHistory.length);

    const parts = trimmed.split(/\s+/);
    const cmd = parts[0].toLowerCase();
    const arg = parts[1] ? parts[1].toLowerCase() : '';

    let outputText = '';
    let isClear = false;

    switch (cmd) {
      case 'help':
        outputText = (
          <div className="space-y-1">
            <p className="text-accent-primary font-bold">Available commands:</p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-1 pl-2 text-xs sm:text-sm">
              <div><span className="text-accent-secondary font-semibold">about</span> - Background summary</div>
              <div><span className="text-accent-secondary font-semibold">skills</span> - Core skillset details</div>
              <div><span className="text-accent-secondary font-semibold">experience</span> - Job &amp; Education timeline</div>
              <div><span className="text-accent-secondary font-semibold">projects</span> - List all projects</div>
              <div><span className="text-accent-secondary font-semibold">contact</span> - direct links &amp; profiles</div>
              <div><span className="text-accent-secondary font-semibold">resume</span> - Download resume hint</div>
              <div><span className="text-accent-secondary font-semibold">theme [light/dark]</span> - Shift website theme</div>
              <div><span className="text-accent-secondary font-semibold">accent [color]</span> - Select new accent</div>
              <div><span className="text-accent-secondary font-semibold">clear</span> - Flush terminal screen</div>
              <div><span className="text-accent-secondary font-semibold">admin</span> - Access system management</div>
            </div>
          </div>
        );
        break;

      case 'about':
        outputText = 'Yishaq Damtew is a software engineer specialized in React 19, Node.js, and Postgres databases. He designs beautiful, fast, and accessible digital products from the ground up.';
        break;

      case 'skills':
        outputText = (
          <div className="font-mono space-y-1 text-xs sm:text-sm leading-relaxed">
            <p>=========================================</p>
            <p className="text-accent-primary font-bold">TECHNICAL SKILLSET:</p>
            <p>-----------------------------------------</p>
            <p><span className="text-accent-secondary">Frontend:</span>   React 19, TypeScript, Tailwind v4</p>
            <p><span className="text-accent-secondary">Backend:</span>    Node.js, Express, PostgreSQL</p>
            <p><span className="text-accent-secondary">DevOps:</span>     Git, Docker, Bash scripting</p>
            <p>=========================================</p>
          </div>
        );
        break;

      case 'experience':
        outputText = (
          <div className="space-y-1">
            <p><span className="text-accent-primary font-semibold">* Full Stack Developer</span> @ Velo Tech (2025-Present)</p>
            <p><span className="text-accent-primary font-semibold">* Frontend Intern</span> @ Apex Code (2023-2024)</p>
            <p><span className="text-accent-primary font-semibold">* B.S. Computer Science</span> @ State Tech Univ (2020-2024)</p>
          </div>
        );
        break;

      case 'contact':
        outputText = (
          <div className="space-y-1">
            <p><span className="text-accent-secondary">Email:</span>    yishaq.damtew@gmail.com</p>
            <p><span className="text-accent-secondary">GitHub:</span>   github.com/yishaq</p>
            <p><span className="text-accent-secondary">LinkedIn:</span> linkedin.com/in/yishaq</p>
          </div>
        );
        break;

      case 'projects':
        outputText = (
          <div className="space-y-1">
            <p className="text-accent-primary font-bold">Featured Projects:</p>
            <div className="pl-2 space-y-0.5 text-xs sm:text-sm">
              <p><span className="text-accent-secondary font-semibold">[01]</span> Dev Shell Terminal — CLI</p>
              <p><span className="text-accent-secondary font-semibold">[02]</span> Cloud Metrics Panel — Frontend</p>
              <p><span className="text-accent-secondary font-semibold">[03]</span> REST GraphQL Engine — Backend</p>
              <p><span className="text-accent-secondary font-semibold">[04]</span> Agile Kanban Board — Fullstack</p>
            </div>
            <p className="text-text-secondary text-xs pt-1">→ Scroll to #projects or click <span className="text-accent-primary cursor-pointer" onClick={() => { const el = document.querySelector('#projects'); if (el) el.scrollIntoView({ behavior: 'smooth' }); }}>Projects Section</span> to view details.</p>
          </div>
        );
        break;

      case 'resume':
        outputText = (
          <div className="space-y-1">
            <p className="text-accent-primary font-bold">Resume / CV:</p>
            <p className="text-text-secondary text-sm">Contact me directly to request the latest version:</p>
            <p><span className="text-accent-secondary">Email:</span> yishaq.damtew@gmail.com</p>
            <p className="text-text-secondary text-xs pt-1">Or visit the Contact section below to send a direct message.</p>
          </div>
        );
        break;

      case 'theme':
        if (arg === 'light' || arg === 'dark') {
          if (arg !== theme) {
            toggleTheme();
          }
          outputText = `Theme changed to: ${arg}`;
        } else {
          outputText = `Usage: theme [light|dark]. Current theme: ${theme}`;
        }
        break;

      case 'accent':
        const validAccents = ['violet', 'indigo', 'emerald', 'rose', 'amber'];
        if (validAccents.includes(arg)) {
          changeAccent(arg);
          outputText = `Accent color changed to: ${arg}`;
        } else {
          outputText = `Usage: accent [violet|indigo|emerald|rose|amber]. Current accent: ${accent}`;
        }
        break;

      case 'clear':
        isClear = true;
        break;

      case 'admin':
        outputText = 'Opening administrative authentication gate...';
        if (typeof onAdminTrigger === 'function') {
          setTimeout(() => onAdminTrigger(), 600);
        }
        break;

      default:
        outputText = `bash: command not found: ${cmd}. Type 'help' for suggestions.`;
    }

    if (isClear) {
      setLogs([]);
    } else {
      setLogs([...nextLogs, { type: 'output', text: outputText }]);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      executeCommand(inputVal);
      setInputVal('');
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const newPointer = historyPointer > 0 ? historyPointer - 1 : 0;
      setHistoryPointer(newPointer);
      setInputVal(history[newPointer]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (history.length === 0) return;
      const newPointer = historyPointer + 1;
      if (newPointer >= history.length) {
        setHistoryPointer(history.length);
        setInputVal('');
      } else {
        setHistoryPointer(newPointer);
        setInputVal(history[newPointer]);
      }
    }
  };

  return (
    <section id="terminal" className="py-20 border-t border-border-subtle w-full flex flex-col gap-12 text-left">
      {/* Title */}
      <div className="space-y-3">
        <h2 className="text-3xl font-display font-extrabold text-text-primary">
          Developer <span className="text-gradient">CLI</span>
        </h2>
        <div className="h-1 w-12 bg-accent-primary rounded-full" />
      </div>

      {/* Terminal Board Widget */}
      <div
        onClick={handleTerminalClick}
        className="w-full max-w-3xl mx-auto glass-panel border border-border-subtle rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[400px] cursor-text relative z-10"
      >
        {/* Terminal Header */}
        <div className="flex items-center justify-between px-4 py-3 bg-bg-site/60 border-b border-border-subtle select-none">
          <div className="flex items-center space-x-2">
            <span className="w-3 h-3 rounded-full bg-red-400" />
            <span className="w-3 h-3 rounded-full bg-yellow-400" />
            <span className="w-3 h-3 rounded-full bg-green-400" />
          </div>
          <span className="text-xs font-mono font-semibold text-text-secondary flex items-center gap-1.5">
            <TerminalIcon className="w-3.5 h-3.5 text-accent-primary" />
            guest@yishaq.dev:~
          </span>
          <div className="w-12" /> {/* Balancing spacing spacer */}
        </div>

        {/* Terminal Logging Screen */}
        <div
          ref={scrollRef}
          className="flex-grow p-6 overflow-y-auto space-y-3 font-mono text-sm leading-relaxed bg-bg-card/45 select-text"
        >
          {logs.map((log, idx) => (
            <div key={idx} className="whitespace-pre-wrap">
              {log.type === 'input' ? (
                <div className="flex">
                  <span className="text-accent-secondary mr-2">guest@yishaq.dev:~$</span>
                  <span className="text-text-primary">{log.text}</span>
                </div>
              ) : (
                <div className="text-text-secondary">{log.text}</div>
              )}
            </div>
          ))}

          {/* Prompt Entry Input Line */}
          <div className="flex items-center">
            <span className="text-accent-secondary mr-2 shrink-0">guest@yishaq.dev:~$</span>
            <input
              ref={inputRef}
              type="text"
              value={inputVal}
              onChange={(e) => setInputVal(e.target.value)}
              onKeyDown={handleKeyDown}
              className="flex-grow bg-transparent border-none outline-none text-text-primary caret-accent-primary select-text focus:ring-0 p-0 font-mono text-sm"
              autoComplete="off"
              autoCapitalize="none"
              spellCheck="false"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
