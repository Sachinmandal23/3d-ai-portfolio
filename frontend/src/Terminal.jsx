import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export default function Terminal({ darkMode, isOpen, onClose }) {
  const [input, setInput] = useState('');
  const [logs, setLogs] = useState([
    { text: "System Online...", type: "system" },
    { text: "Type 'help' for commands.", type: "info" }
  ]);
  const terminalEndRef = useRef(null);

  useEffect(() => {
    if (isOpen) terminalEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs, isOpen]);

  const handleCommand = () => {
    if (!input.trim()) return;
    const cmd = input.trim().toLowerCase();
    let response = "";
    switch (cmd) {
      case 'help': response = "Available: skills, projects, contact, clear"; break;
      case 'skills': response = "Java, Spring Boot, React, SQL, Python, Kafka"; break;
      case 'projects': response = "Leave Management, Netflix AI, Resume Optimizer"; break;
      case 'contact': response = "sachinm30k@gmail.com | +91-6203941012"; break;
      case 'clear': setLogs([]); setInput(''); return;
      default: response = `Command '${cmd}' not found. Type 'help'.`;
    }
    setLogs(prev => [...prev, { text: `$ ${input}`, type: 'user' }, { text: response, type: 'output' }]);
    setInput('');
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        style={{
          position: 'fixed',
          // बिल्कुल Talk to AI बॉक्स की तरह फिक्स किया गया है:
          bottom: '20px',
          right: '20px',
          width: '90vw',
          maxWidth: '340px',
          height: '360px',
          backgroundColor: darkMode ? 'rgba(12, 12, 18, 0.95)' : 'rgba(255, 255, 255, 0.95)',
          backdropFilter: 'blur(20px)',
          border: `1px solid ${darkMode ? '#00ffcc' : '#0d9488'}`,
          borderRadius: '12px',
          zIndex: 1000,
          display: 'flex',
          flexDirection: 'column',
          boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.2)',
          overflow: 'hidden'
        }}
      >
        {/* Header */}
        <div style={{ padding: '12px 15px', borderBottom: `1px solid ${darkMode ? 'rgba(0, 255, 204, 0.25)' : '#cbd5e1'}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center', backgroundColor: darkMode ? '#151522' : '#e2e8f0' }}>
          <strong style={{ color: darkMode ? '#00ffcc' : '#0d9488', fontSize: '0.9rem', fontFamily: 'monospace' }}>Terminal ~ bash</strong>
          <button onClick={onClose} style={{ background: 'none', border: 'none', color: darkMode ? '#fff' : '#000', cursor: 'pointer', fontSize: '1.1rem', fontWeight: 'bold' }}>✖</button>
        </div>

        {/* Logs Body */}
        <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px', fontFamily: 'monospace', fontSize: '0.85rem', color: darkMode ? '#00ffcc' : '#0d9488' }}>
          {logs.map((log, i) => (
            <div key={i} style={{ wordBreak: 'break-word' }}>
              {log.text}
            </div>
          ))}
          <div ref={terminalEndRef} />
        </div>

        {/* Input & Send Bar */}
        <div style={{ padding: '10px 12px', borderTop: `1px solid ${darkMode ? 'rgba(0, 255, 204, 0.25)' : '#cbd5e1'}`, display: 'flex', backgroundColor: darkMode ? '#020205' : '#f8fafc' }}>
          <input 
            value={input} 
            onChange={(e) => setInput(e.target.value)} 
            onKeyDown={(e) => e.key === 'Enter' && handleCommand()}
            placeholder="type command..." 
            style={{ flex: 1, padding: '8px', backgroundColor: darkMode ? '#0a0a0f' : '#fff', border: `1px solid ${darkMode ? '#00ffcc' : '#0d9488'}`, color: darkMode ? '#fff' : '#111827', outline: 'none', borderRadius: '5px', fontSize: '0.9rem', fontFamily: 'monospace' }} 
          />
          <button 
            onClick={handleCommand} 
            style={{ marginLeft: '8px', backgroundColor: darkMode ? '#00ffcc' : '#0d9488', color: darkMode ? '#000' : '#fff', border: 'none', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold', borderRadius: '5px', fontSize: '0.9rem' }}
          >
            Send
          </button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}