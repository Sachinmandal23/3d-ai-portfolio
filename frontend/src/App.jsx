import { useRef, useState, useEffect, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, MeshWobbleMaterial, Environment, Torus, Box, Cylinder, Points, PointMaterial } from '@react-three/drei';
import emailjs from '@emailjs/browser';
import { motion, AnimatePresence } from 'framer-motion';
import * as random from 'maath/random/dist/maath-random.esm';
import TechBubbles from './TechBubbles';
import Terminal from './Terminal';

// 1. Digital Data Stream Particles Background
function FloatingParticles({ darkMode }) {
  const ref = useRef();
  const sphere = useMemo(() => random.inSphere(new Float32Array(5000), { radius: 6 }), []);
  
  useFrame((state, delta) => {
    ref.current.rotation.x -= delta / 15;
    ref.current.rotation.y -= delta / 20;
    const { x, y } = state.pointer;
    ref.current.rotation.y += (x * 0.4 - ref.current.rotation.y) * 0.05;
    ref.current.rotation.x += (-y * 0.4 - ref.current.rotation.x) * 0.05;
  });

  return (
    <group rotation={[0, 0, Math.PI / 4]}>
      <Points ref={ref} positions={sphere} stride={3} frustumCulled={false}>
        <PointMaterial transparent color={darkMode ? "#00ffcc" : "#0d9488"} size={0.035} sizeAttenuation={true} depthWrite={false} opacity={0.75} />
      </Points>
    </group>
  );
}

// 2. Responsive 3D Sci-Fi / Code Elements Scene
function SciFi3DScene({ darkMode }) {
  const serverRef = useRef();
  const dataCoreRef = useRef();
  const networkRingRef = useRef();

  useFrame((state) => {
    const t = state.clock.getElapsedTime();
    serverRef.current.rotation.y = t * 0.6;
    serverRef.current.rotation.x = Math.sin(t * 0.5) * 0.2;

    dataCoreRef.current.rotation.y = -t * 0.8;
    dataCoreRef.current.rotation.z = t * 0.4;

    networkRingRef.current.rotation.x = t * 0.4;
    networkRingRef.current.rotation.y = t * 0.5;

    const { x, y } = state.pointer;
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 900;
    const factor = isMobile ? 0.35 : 1;

    serverRef.current.position.x = (3.5 * factor) + x * 1.5;
    serverRef.current.position.y = (isMobile ? 1.5 : 2) + y * 1;

    dataCoreRef.current.position.x = (-3.5 * factor) + x * 1.2;
    dataCoreRef.current.position.y = (isMobile ? -1.5 : -2) + y * 1.2;

    networkRingRef.current.position.x = (2.5 * factor) + x * 1;
    networkRingRef.current.position.y = (isMobile ? -2.2 : -2.5) + y * 1;
  });

  const materialColor = darkMode ? "#00ffcc" : "#0d9488";
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 900;
  const scaleSize = isMobile ? 0.6 : 1;

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 5, 5]} intensity={2.5} />
      <pointLight position={[-5, -5, -5]} intensity={1.5} />
      
      <Float speed={4} rotationIntensity={2} floatIntensity={3}>
        <group ref={serverRef} position={[3.5, 2, -1]} scale={[scaleSize, scaleSize, scaleSize]}>
          <Cylinder args={[0.8, 0.8, 1.8, 16]}>
            <meshStandardMaterial color={materialColor} wireframe={true} emissive={materialColor} emissiveIntensity={0.8} />
          </Cylinder>
        </group>
      </Float>

      <Float speed={3.5} rotationIntensity={2.5} floatIntensity={2.5}>
        <Box ref={dataCoreRef} args={[1.2, 1.2, 1.2]} position={[-3.5, -2, -1]} scale={[scaleSize, scaleSize, scaleSize]}>
          <MeshWobbleMaterial color={materialColor} factor={0.4} speed={2} roughness={0.1} metalness={0.8} />
        </Box>
      </Float>

      <Float speed={4.5} rotationIntensity={2.2} floatIntensity={3.5}>
        <Torus ref={networkRingRef} args={[1.3, 0.2, 16, 50]} position={[2.5, -2.5, -1.5]} scale={[scaleSize, scaleSize, scaleSize]}>
          <meshStandardMaterial color={darkMode ? "#3b82f6" : "#0284c7"} wireframe={true} />
        </Torus>
      </Float>
    </>
  );
}

function App() {
  const [darkMode, setDarkMode] = useState(true);
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [isTerminalOpen, setIsTerminalOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  
  const [projects, setProjects] = useState([
    {
      title: "Employee Leave Management System",
      description: "A web-based leave management system for employees and HR administrators with role-based access control.",
      challenge: "Implemented secure session handling and role-based access control (RBAC) to ensure unauthorized privilege escalation is prevented.",
      githubUrl: "https://github.com/Sachinmandal23/Employee-Leave-Management-System",
      techStack: ["PHP", "MySQL", "HTML5", "CSS3"]
    },
    {
      title: "Netflix Clone - AI Integrated",
      description: "A responsive Netflix UI clone integrated with dynamic rendering and smooth asynchronous UI updates.",
      challenge: "Optimized media rendering pipeline and component state management for a seamless, buffer-free streaming user experience.",
      githubUrl: "https://github.com/Sachinmandal23/Netflix-Clone-Al-main",
      techStack: ["JavaScript", "HTML5", "CSS3", "Netlify"]
    },
    {
      title: "Resume Optimizer",
      description: "A Python-based utility designed to parse text, analyze ATS compliance, and score resumes against target Job Descriptions.",
      challenge: "Integrated NLP text similarity algorithms using spaCy to accurately extract key entity vectors and compute precise keyword matching scores.",
      githubUrl: "https://github.com/Sachinmandal23/Resume_Optimizer",
      techStack: ["Python", "Streamlit", "Spacy", "PyPDF2"]
    }
  ]);

  const [isAiLoading, setIsAiLoading] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2500);
    return () => clearTimeout(timer);
  }, []);
  
  const [roleText, setRoleText] = useState('');
  const roles = ["Backend Developer", "Full-Stack Developer", "Java & Spring Boot Enthusiast"];
  const [roleIndex, setRoleIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);

  const chatEndRef = useRef(null);

  useEffect(() => {
    const currentRole = roles[roleIndex];
    const timeout = setTimeout(() => {
      if (charIndex < currentRole.length) {
        setRoleText(prev => prev + currentRole[charIndex]);
        setCharIndex(prev => prev + 1);
      } else {
        setTimeout(() => {
          setRoleText('');
          setCharIndex(0);
          setRoleIndex((prev) => (prev + 1) % roles.length);
        }, 2000);
      }
    }, 100);
    return () => clearTimeout(timeout);
  }, [charIndex, roleIndex]);

  const [messages, setMessages] = useState([{ text: "Hello! Ask me about my projects!", sender: 'ai' }]);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isAiLoading]);

  const handleSendMessage = async () => {
    if (!inputValue.trim() || isAiLoading) return;
    const userMessage = inputValue;
    setMessages(prev => [...prev, { text: userMessage, sender: 'user' }]);
    setInputValue('');
    setIsAiLoading(true);

    try {
      const response = await fetch(`http://localhost:8080/api/chat?message=${encodeURIComponent(userMessage)}`);
      const data = await response.text();
      setMessages(prev => [...prev, { text: data, sender: 'ai' }]);
    } catch (error) {
      setMessages(prev => [...prev, { text: "Backend server is not running.", sender: 'ai' }]);
    } finally {
      setIsAiLoading(false);
    }
  };

  const sendEmail = (e) => {
    e.preventDefault();
    emailjs.sendForm('service_btqp0ko', 'template_i1z7518', e.target, 'm3tLt0yRldelU5F23')
      .then(() => {
        alert("Message sent successfully! 👍");
        e.target.reset();
      }, (error) => {
        alert("Something went wrong: " + error.text);
      });
  };

  // Smart Search Handler
  const handleSmartSearch = (query) => {
    setSearchQuery(query);
    const q = query.toLowerCase().trim();
    if (!q) return;

    if (q.includes('cert') || q.includes('achieve') || q.includes('award') || q.includes('quiz')) {
      document.getElementById('certificates')?.scrollIntoView({ behavior: 'smooth' });
    } else if (q.includes('educat') || q.includes('college') || q.includes('mca') || q.includes('degree') || q.includes('uni')) {
      document.getElementById('education')?.scrollIntoView({ behavior: 'smooth' });
    } else if (q.includes('experi') || q.includes('intern') || q.includes('job') || q.includes('jpmorgan')) {
      document.getElementById('experience')?.scrollIntoView({ behavior: 'smooth' });
    } else if (q.includes('core') || q.includes('dsa') || q.includes('oop') || q.includes('sql') || q.includes('design')) {
      document.getElementById('cscore')?.scrollIntoView({ behavior: 'smooth' });
    } else if (q.includes('tech') || q.includes('skill') || q.includes('java') || q.includes('spring') || q.includes('kafka')) {
      document.getElementById('tech')?.scrollIntoView({ behavior: 'smooth' });
    } else if (q.includes('contact') || q.includes('email') || q.includes('phone') || q.includes('message')) {
      document.getElementById('contact')?.scrollIntoView({ behavior: 'smooth' });
    } else {
      document.getElementById('work')?.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const filteredProjects = projects.filter(proj => 
    proj.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proj.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
    proj.techStack.some(tech => tech.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const theme = {
    bg: darkMode ? '#020205' : '#f8fafc',
    text: darkMode ? '#ffffff' : '#111827',
    cardBg: darkMode ? 'rgba(12, 12, 18, 0.85)' : 'rgba(255, 255, 255, 0.95)',
    cardText: darkMode ? '#cbd5e1' : '#4b5563',
    border: darkMode ? 'rgba(0, 255, 204, 0.25)' : '#cbd5e1',
    navBg: darkMode ? 'rgba(2, 2, 5, 0.95)' : 'rgba(248, 250, 252, 0.95)',
    terminalBg: darkMode ? 'rgba(10, 10, 20, 0.95)' : '#ffffff',
    terminalText: darkMode ? '#00ffcc' : '#0d9488'
  };

  return (
    <div style={{ width: '100%', minHeight: '100vh', backgroundColor: theme.bg, color: theme.text, fontFamily: 'sans-serif', transition: 'background-color 0.5s, color 0.5s', overflowX: 'hidden' }}>
      
      {/* Terminal Component Render */}
      <Terminal darkMode={darkMode} isOpen={isTerminalOpen} onClose={() => setIsTerminalOpen(false)} />

      {/* Preloader */}
      <AnimatePresence>
        {isLoading && (
          <motion.div
            initial={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 1.05 }}
            transition={{ duration: 0.8, ease: "easeInOut" }}
            style={{
              position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh',
              backgroundColor: '#020205', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 9999,
            }}
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0, y: -30 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              style={{
                width: '90%', maxWidth: '420px', backgroundColor: theme.terminalBg,
                border: '1px solid rgba(0, 255, 204, 0.6)', borderRadius: '14px', overflow: 'hidden',
                boxShadow: '0 0 50px rgba(0, 255, 204, 0.3)'
              }}
            >
              <div style={{ backgroundColor: '#1a1a2e', padding: '12px 18px', display: 'flex', alignItems: 'center', gap: '8px', borderBottom: '1px solid rgba(0, 255, 204, 0.2)' }}>
                <span style={{ width: '10px', height: '10px', backgroundColor: '#ff5f56', borderRadius: '50%', display: 'inline-block' }}></span>
                <span style={{ width: '10px', height: '10px', backgroundColor: '#ffbd2e', borderRadius: '50%', display: 'inline-block' }}></span>
                <span style={{ width: '10px', height: '10px', backgroundColor: '#27c93f', borderRadius: '50%', display: 'inline-block' }}></span>
                <span style={{ color: '#888', fontSize: '0.85rem', marginLeft: '10px', fontFamily: 'monospace' }}>sachin@backend-core ~ boot</span>
              </div>
              <div style={{ padding: '20px', fontFamily: 'monospace', fontSize: '0.9rem', color: '#00ffcc', lineHeight: '1.6' }}>
                <p style={{ margin: '0 0 8px 0', color: '#888' }}>// System Boot Initialized...</p>
                <p style={{ margin: '0 0 8px 0' }}>&gt; const dev = &#123;</p>
                <p style={{ margin: '0 0 8px 0', paddingLeft: '15px' }}>name: "Sachin Kumar Mandal",</p>
                <p style={{ margin: '0 0 8px 0', paddingLeft: '15px' }}>role: "Software Engineering Fresher",</p>
                <p style={{ margin: '0 0 8px 0', paddingLeft: '15px' }}>status: "Ready for SDE Roles 🚀"</p>
                <p style={{ margin: '0 0 8px 0' }}>&#125;;</p>
                <p style={{ margin: 0, color: '#27c93f' }}>&gt; Execution Successful [200 OK]</p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Navbar */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
        style={{ position: 'fixed', top: 0, width: '100%', padding: '12px 5%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', zIndex: 1000, backgroundColor: theme.navBg, backdropFilter: 'blur(16px)', boxSizing: 'border-box', borderBottom: `1px solid ${theme.border}` }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <div style={{ color: darkMode ? '#00ffcc' : '#0d9488', fontWeight: 'bold', fontSize: '1.1rem', cursor: 'pointer' }} onClick={() => window.scrollTo({top: 0, behavior: 'smooth'})}>Sachin.dev</div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '5px', backgroundColor: darkMode ? 'rgba(0, 255, 204, 0.1)' : 'rgba(13, 148, 136, 0.1)', padding: '3px 8px', borderRadius: '20px', border: `1px solid ${darkMode ? 'rgba(0, 255, 204, 0.3)' : 'rgba(13, 148, 136, 0.3)'}` }}>
            <span style={{ width: '6px', height: '6px', backgroundColor: '#27c93f', borderRadius: '50%', display: 'inline-block', boxShadow: '0 0 6px #27c93f' }}></span>
            <span style={{ fontSize: '0.65rem', color: darkMode ? '#00ffcc' : '#0d9488', fontWeight: '600' }}>ONLINE</span>
          </div>
        </div>

        {/* Desktop Navigation & Smart Search Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }} className="desktop-nav">
          <input 
            type="text" 
            placeholder="🔍 Search sections or projects..." 
            value={searchQuery}
            onChange={(e) => handleSmartSearch(e.target.value)}
            style={{ 
              padding: '6px 12px', 
              borderRadius: '20px', 
              border: `1px solid ${darkMode ? '#00ffcc' : '#0d9488'}`, 
              background: darkMode ? 'rgba(0,0,0,0.3)' : '#fff', 
              color: theme.text,
              fontSize: '0.8rem',
              outline: 'none',
              width: '200px'
            }} 
          />
          {['Work', 'Experience', 'CS Core', 'Tech', 'Education', 'Certificates', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '')}`} style={{ color: theme.text, textDecoration: 'none', fontSize: '0.85rem', fontWeight: '500' }}>{item}</a>
          ))}
          <button onClick={() => setIsTerminalOpen(true)} style={{ padding: '5px 12px', borderRadius: '20px', border: `1px solid ${darkMode ? '#00ffcc' : '#0d9488'}`, background: darkMode ? 'rgba(0,255,204,0.1)' : 'rgba(13,148,136,0.1)', color: theme.text, cursor: 'pointer', fontWeight: 'bold', fontSize: '0.80rem' }}>
            💻 Terminal
          </button>
          <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '5px 12px', borderRadius: '20px', border: `1px solid ${darkMode ? '#00ffcc' : '#0d9488'}`, background: darkMode ? 'rgba(0,255,204,0.1)' : 'rgba(13,148,136,0.1)', color: theme.text, cursor: 'pointer', fontWeight: 'bold', fontSize: '0.80rem' }}>
            {darkMode ? '☀️ Light' : '🌙 Dark'}
          </button>
        </div>

        {/* Mobile Navbar Controls */}
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }} className="mobile-toggle">
          <button onClick={() => setIsTerminalOpen(true)} style={{ padding: '5px 10px', borderRadius: '15px', border: `1px solid ${darkMode ? '#00ffcc' : '#0d9488'}`, background: darkMode ? 'rgba(0,255,204,0.1)' : 'rgba(13,148,136,0.1)', color: theme.text, cursor: 'pointer', fontSize: '0.75rem' }}>
            💻
          </button>
          <button onClick={() => setDarkMode(!darkMode)} style={{ padding: '5px 10px', borderRadius: '15px', border: `1px solid ${darkMode ? '#00ffcc' : '#0d9488'}`, background: darkMode ? 'rgba(0,255,204,0.1)' : 'rgba(13,148,136,0.1)', color: theme.text, cursor: 'pointer', fontSize: '0.75rem' }}>
            {darkMode ? '☀️' : '🌙'}
          </button>
          <button onClick={() => setMenuOpen(!menuOpen)} style={{ background: 'none', border: 'none', color: theme.text, fontSize: '1.5rem', cursor: 'pointer', padding: '0 5px' }}>
            {menuOpen ? '✕' : '☰'}
          </button>
        </div>
      </motion.nav>

      {/* Mobile Menu Dropdown with Smart Search */}
      {menuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -15 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ position: 'fixed', top: '60px', left: 0, width: '100%', backgroundColor: theme.navBg, backdropFilter: 'blur(20px)', borderBottom: `1px solid ${theme.border}`, padding: '20px 25px', zIndex: 999, display: 'flex', flexDirection: 'column', gap: '15px', boxSizing: 'border-box', boxShadow: '0 10px 30px rgba(0,0,0,0.3)' }}
        >
          <input 
            type="text" 
            placeholder="🔍 Search sections or projects..." 
            value={searchQuery}
            onChange={(e) => {
              handleSmartSearch(e.target.value);
              setMenuOpen(false);
            }}
            style={{ 
              padding: '8px 12px', 
              borderRadius: '20px', 
              border: `1px solid ${darkMode ? '#00ffcc' : '#0d9488'}`, 
              background: darkMode ? 'rgba(0,0,0,0.3)' : '#fff', 
              color: theme.text,
              fontSize: '0.9rem',
              outline: 'none',
              width: '100%',
              boxSizing: 'border-box'
            }} 
          />
          {['Work', 'Experience', 'CS Core', 'Tech', 'Education', 'Certificates', 'Contact'].map(item => (
            <a key={item} href={`#${item.toLowerCase().replace(' ', '')}`} onClick={() => setMenuOpen(false)} style={{ color: theme.text, textDecoration: 'none', fontSize: '1.05rem', fontWeight: '600', borderBottom: `1px solid ${theme.border}`, paddingBottom: '8px' }}>{item}</a>
          ))}
        </motion.div>
      )}

      {/* 3D Canvas Background */}
      <div style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', zIndex: 0, pointerEvents: 'none' }}>
        <Canvas camera={{ position: [0, 0, 7], fov: 55 }}>
          <Environment preset="city" />
          <FloatingParticles darkMode={darkMode} />
          <SciFi3DScene darkMode={darkMode} />
        </Canvas>
      </div>

      {/* Main Website Content */}
      <div style={{ position: 'relative', zIndex: 2, padding: '110px 5% 50px 5%', boxSizing: 'border-box' }}>
        
        {/* Hero / About Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          style={{ minHeight: '85vh', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
        >
          <div style={{ maxWidth: '800px' }}>
            <p style={{ color: darkMode ? '#00ffcc' : '#0d9488', letterSpacing: '2px', fontWeight: 'bold', marginBottom: '5px', fontSize: '0.85rem' }}>HELLO WORLD, I AM</p>
            <h1 style={{ fontSize: 'clamp(2.2rem, 5vw, 4.2rem)', margin: '5px 0', lineHeight: '1.1', color: theme.text, letterSpacing: '-0.03em' }}>Sachin Kumar Mandal</h1>
            
            <div style={{ minHeight: '40px', display: 'flex', alignItems: 'center', margin: '10px 0' }}>
              <h2 style={{ color: theme.cardText, fontSize: 'clamp(1.1rem, 3vw, 1.6rem)', margin: 0 }}>
                {roleText}<span style={{ borderRight: `2px solid ${darkMode ? '#00ffcc' : '#0d9488'}`, animation: 'blink 1s infinite', marginLeft: '2px' }}></span>
              </h2>
            </div>

            <p style={{ color: theme.cardText, fontSize: '1.05rem', maxWidth: '720px', marginTop: '15px', lineHeight: '1.7' }}>
              A passionate <strong>Full-Stack & Backend Engineer</strong> dedicated to building high-performance, scalable distributed systems. My approach combines robust architectural design using <strong>Java, Spring Boot, and Kafka</strong> with clean, responsive user interfaces. I focus on writing production-ready code that solves real-world engineering bottlenecks.
            </p>

            <div style={{ display: 'flex', gap: '15px', marginTop: '25px', flexWrap: 'wrap' }}>
              <button onClick={() => setIsChatOpen(true)} style={{ padding: '12px 22px', backgroundColor: darkMode ? '#00ffcc' : '#0d9488', color: darkMode ? '#000' : '#fff', border: 'none', borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer', boxShadow: darkMode ? '0 0 20px rgba(0,255,204,0.4)' : 'none' }}>Talk to AI 🤖</button>
              <button onClick={() => setIsTerminalOpen(true)} style={{ padding: '12px 22px', backgroundColor: 'transparent', color: darkMode ? '#00ffcc' : '#0d9488', border: `2px solid ${darkMode ? '#00ffcc' : '#0d9488'}`, borderRadius: '6px', fontWeight: 'bold', cursor: 'pointer' }}>Open Terminal 💻</button>
              <motion.a 
                href="/sachin_Mandal_Resume.pdf" 
                download="Sachin_Mandal_Resume.pdf"
                whileHover={{ scale: 1.05 }}
                animate={{ scale: [1, 1.03, 1] }}
                transition={{ repeat: Infinity, duration: 2 }}
                style={{ padding: '12px 22px', backgroundColor: 'transparent', color: darkMode ? '#00ffcc' : '#0d9488', border: `2px solid ${darkMode ? '#00ffcc' : '#0d9488'}`, borderRadius: '6px', fontWeight: 'bold', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}
              >
                Download Resume 📄
              </motion.a>
            </div>
          </div>

          {/* Elite Stats Ribbon */}
          <div style={{ 
            display: 'grid', 
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
            gap: '15px', 
            marginTop: '50px',
            padding: '20px',
            backgroundColor: theme.cardBg,
            border: `1px solid ${theme.border}`,
            borderRadius: '16px',
            backdropFilter: 'blur(20px)',
            boxShadow: '0 10px 30px rgba(0, 0, 0, 0.05)'
          }}>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: darkMode ? '#00ffcc' : '#0d9488', fontSize: '1.4rem', margin: '0 0 5px 0' }}>10/10</h3>
              <p style={{ color: theme.cardText, fontSize: '0.8rem', margin: 0 }}>Live Coding Score (Superset)</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: darkMode ? '#00ffcc' : '#0d9488', fontSize: '1.4rem', margin: '0 0 5px 0' }}>5,25,000+</h3>
              <p style={{ color: theme.cardText, fontSize: '0.8rem', margin: 0 }}>Global Competitors (QuizOff)</p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <h3 style={{ color: darkMode ? '#00ffcc' : '#0d9488', fontSize: '1.4rem', margin: '0 0 5px 0' }}>JPMorgan & Deloitte</h3>
              <p style={{ color: theme.cardText, fontSize: '0.8rem', margin: 0 }}>Tech Job Simulations</p>
            </div>
          </div>
        </motion.div>

        {/* System Status Stream Ticker */}
        <div style={{ margin: '35px 0 20px 0', padding: '12px 0', backgroundColor: darkMode ? 'rgba(0, 255, 204, 0.04)' : 'rgba(13, 148, 136, 0.06)', borderTop: `1px solid ${darkMode ? 'rgba(0, 255, 204, 0.2)' : 'rgba(13, 148, 136, 0.2)'}`, borderBottom: `1px solid ${darkMode ? 'rgba(0, 255, 204, 0.2)' : 'rgba(13, 148, 136, 0.2)'}`, overflow: 'hidden', whiteSpace: 'nowrap' }}>
          <div style={{ display: 'inline-block', animation: 'marquee 22s linear infinite', color: darkMode ? '#00ffcc' : '#0d9488', fontSize: '0.8rem', fontWeight: 'bold', letterSpacing: '2px', fontFamily: 'monospace', opacity: 0.9 }}>
            ⚡ [KAFKA BROKER: ACTIVE] &nbsp;&bull;&nbsp; [SPRING BOOT 3.0: RUNNING] &nbsp;&bull;&nbsp; [DATABASE: H2 / SQL CONNECTED] &nbsp;&bull;&nbsp; [REST API: 200 OK] &nbsp;&bull;&nbsp; [DISTRIBUTED ARCHITECTURE READY] &nbsp;&bull;&nbsp; 
            ⚡ [KAFKA BROKER: ACTIVE] &nbsp;&bull;&nbsp; [SPRING BOOT 3.0: RUNNING] &nbsp;&bull;&nbsp; [DATABASE: H2 / SQL CONNECTED] &nbsp;&bull;&nbsp; [REST API: 200 OK] &nbsp;&bull;&nbsp; [DISTRIBUTED ARCHITECTURE READY] &nbsp;&bull;&nbsp;
          </div>
        </div>

        {/* 1. My Work Section (With Professional Challenge Highlights) */}
        <motion.div 
          id="work" 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ paddingBottom: '80px', paddingTop: '30px', scrollMarginTop: '100px' }}
        >
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: theme.text, borderBottom: `2px solid ${darkMode ? '#00ffcc' : '#0d9488'}`, display: 'inline-block', marginBottom: '30px' }}>Featured Projects</h2>
          
          {filteredProjects.length === 0 ? (
            <p style={{ color: theme.cardText, fontSize: '1rem', fontStyle: 'italic' }}>No projects found matching "{searchQuery}"</p>
          ) : (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '25px' }}>
              {filteredProjects.map((proj, index) => (
                <motion.div 
                  key={index} 
                  whileHover={{ scale: 1.03, y: -6, borderColor: darkMode ? '#00ffcc' : '#0d9488', boxShadow: darkMode ? '0 15px 30px rgba(0, 255, 204, 0.25)' : '0 10px 20px rgba(0, 0, 0, 0.1)' }}
                  whileTap={{ scale: 0.98 }}
                  transition={{ duration: 0.3, type: "spring", stiffness: 300 }}
                  style={{ backgroundColor: theme.cardBg, backdropFilter: 'blur(20px)', border: `1px solid ${theme.border}`, padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
                >
                  <div>
                    <h3 style={{ color: theme.text, fontSize: '1.3rem', marginBottom: '10px' }}>{proj.title}</h3>
                    <p style={{ color: theme.cardText, margin: '10px 0', lineHeight: '1.5', fontSize: '0.92rem' }}>{proj.description}</p>
                    
                    {/* Professional Architectural Challenge Solved */}
                    <div style={{ 
                      backgroundColor: darkMode ? 'rgba(0, 255, 204, 0.05)' : 'rgba(13, 148, 136, 0.05)', 
                      borderLeft: `3px solid ${darkMode ? '#00ffcc' : '#0d9488'}`, 
                      padding: '10px 12px', 
                      margin: '12px 0', 
                      borderRadius: '0 6px 6px 0',
                      fontSize: '0.85rem',
                      color: theme.text,
                      lineHeight: '1.4'
                    }}>
                      <strong style={{ color: darkMode ? '#00ffcc' : '#0d9488', display: 'block', marginBottom: '3px' }}>💡 Key Engineering Challenge:</strong>
                      {proj.challenge}
                    </div>
                    
                    {/* Tech Stack Badges */}
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', margin: '15px 0 10px 0' }}>
                      {proj.techStack && proj.techStack.map((tech, i) => (
                        <span key={i} style={{ 
                          fontSize: '0.7rem', 
                          padding: '3px 8px', 
                          borderRadius: '4px', 
                          backgroundColor: darkMode ? 'rgba(0, 255, 204, 0.1)' : 'rgba(13, 148, 136, 0.1)', 
                          color: darkMode ? '#00ffcc' : '#0d9488',
                          border: `1px solid ${darkMode ? 'rgba(0, 255, 204, 0.3)' : 'rgba(13, 148, 136, 0.3)'}`,
                          fontWeight: '600'
                        }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div style={{ marginTop: '15px' }}>
                    <a href={proj.githubUrl} target="_blank" rel="noopener noreferrer" style={{ color: darkMode ? '#000' : '#fff', backgroundColor: darkMode ? '#00ffcc' : '#0d9488', padding: '8px 16px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', display: 'inline-block', fontSize: '0.85rem' }}>GitHub Repo ↗</a>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </motion.div>

        {/* 2. Experience Section */}
        <motion.div 
          id="experience" 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ paddingBottom: '80px', maxWidth: '900px', scrollMarginTop: '100px' }}
        >
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: theme.text, borderBottom: `2px solid ${darkMode ? '#00ffcc' : '#0d9488'}`, display: 'inline-block', marginBottom: '35px' }}>Experience & Internships</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            <motion.div 
              whileHover={{ scale: 1.01, borderColor: darkMode ? '#00ffcc' : '#0d9488', boxShadow: darkMode ? '0 15px 30px rgba(0, 255, 204, 0.25)' : '0 10px 20px rgba(0,0,0,0.15)' }}
              transition={{ duration: 0.3 }}
              style={{ backgroundColor: theme.cardBg, backdropFilter: 'blur(20px)', border: `1px solid ${theme.border}`, padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ color: theme.text, fontSize: '1.3rem', margin: 0 }}>Software Engineering Virtual Experience</h3>
                <span style={{ backgroundColor: darkMode ? 'rgba(0, 255, 204, 0.1)' : 'rgba(13, 148, 136, 0.1)', color: darkMode ? '#00ffcc' : '#0d9488', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', border: `1px solid ${darkMode ? '#00ffcc' : '#0d9488'}` }}>Nov 2025 - Jan 2026</span>
              </div>
              <p style={{ color: darkMode ? '#00ffcc' : '#0d9488', fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>JPMorgan Chase & Co.</p>
              <p style={{ color: theme.cardText, lineHeight: '1.5', fontSize: '0.95rem', margin: 0 }}>Executed practical software engineering simulations focusing on financial data processing pipelines, interface integration, and backend code refactoring.</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.01, borderColor: darkMode ? '#00ffcc' : '#0d9488', boxShadow: darkMode ? '0 15px 30px rgba(0, 255, 204, 0.25)' : '0 10px 20px rgba(0,0,0,0.15)' }}
              transition={{ duration: 0.3 }}
              style={{ backgroundColor: theme.cardBg, backdropFilter: 'blur(20px)', border: `1px solid ${theme.border}`, padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '10px', cursor: 'pointer' }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '10px' }}>
                <h3 style={{ color: theme.text, fontSize: '1.3rem', margin: 0 }}>Full Stack Web Development Intern</h3>
                <span style={{ backgroundColor: darkMode ? 'rgba(0, 255, 204, 0.1)' : 'rgba(13, 148, 136, 0.1)', color: darkMode ? '#00ffcc' : '#0d9488', padding: '4px 12px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', border: `1px solid ${darkMode ? '#00ffcc' : '#0d9488'}` }}>Sep 2023 - Oct 2023</span>
              </div>
              <p style={{ color: darkMode ? '#00ffcc' : '#0d9488', fontSize: '1rem', fontWeight: 'bold', margin: 0 }}>The Website Makers</p>
              <p style={{ color: theme.cardText, lineHeight: '1.5', fontSize: '0.95rem', margin: 0 }}>Developed responsive user-facing web interfaces and built clean integration modules linking frontend components with backend database endpoints.</p>
            </motion.div>

          </div>
        </motion.div>

        {/* Computer Science Core Competencies */}
        <motion.div 
          id="cscore" 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ paddingBottom: '80px', scrollMarginTop: '100px' }}
        >
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: theme.text, borderBottom: `2px solid ${darkMode ? '#00ffcc' : '#0d9488'}`, display: 'inline-block', marginBottom: '30px' }}>Computer Science Core</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            {[
              { title: "Data Structures & Algorithms", desc: "Rigorous analytical problem-solving foundation optimized for time-space complexity and core algorithmic efficiency." },
              { title: "Object-Oriented Programming", desc: "Strict adherence to SOLID principles, design patterns, encapsulation, polymorphism, and maintainable Java codebases." },
              { title: "Database Management Systems", desc: "Advanced SQL query optimization, transaction isolation levels, indexing strategies, and relational schema normalization." },
              { title: "System Design & Architecture", desc: "Designing scalable distributed systems, event-driven microservices communication pipelines, and resilient Kafka messaging ecosystems." }
            ].map((cs, idx) => (
              <motion.div 
                key={idx}
                whileHover={{ scale: 1.04, y: -6, borderColor: darkMode ? '#00ffcc' : '#0d9488', boxShadow: darkMode ? '0 15px 30px rgba(0, 255, 204, 0.25)' : '0 10px 20px rgba(0,0,0,0.15)' }}
                transition={{ duration: 0.3 }}
                style={{ backgroundColor: theme.cardBg, backdropFilter: 'blur(20px)', border: `1px solid ${theme.border}`, padding: '24px', borderRadius: '16px', cursor: 'pointer' }}
              >
                <h3 style={{ color: darkMode ? '#00ffcc' : '#0d9488', fontSize: '1.2rem', marginBottom: '10px' }}>{cs.title}</h3>
                <p style={{ color: theme.cardText, fontSize: '0.92rem', lineHeight: '1.5' }}>{cs.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 3. Tech Stack Bubbles Section */}
        <motion.div 
          id="tech"
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ paddingBottom: '80px', scrollMarginTop: '100px' }}
        >
          <TechBubbles darkMode={darkMode} />
        </motion.div>

        {/* 4. Education Section */}
        <motion.div 
          id="education" 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ paddingBottom: '80px', scrollMarginTop: '100px' }}
        >
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: theme.text, borderBottom: `2px solid ${darkMode ? '#00ffcc' : '#0d9488'}`, display: 'inline-block', marginBottom: '30px' }}>Education</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '20px' }}>
            
            <motion.div 
              whileHover={{ scale: 1.03, y: -5, borderColor: darkMode ? '#00ffcc' : '#0d9488', boxShadow: darkMode ? '0 15px 30px rgba(0, 255, 204, 0.25)' : '0 10px 20px rgba(0,0,0,0.15)' }} 
              transition={{ duration: 0.3 }} 
              style={{ backgroundColor: theme.cardBg, backdropFilter: 'blur(20px)', border: `1px solid ${theme.border}`, padding: '24px', borderRadius: '15px', cursor: 'pointer' }}
            >
              <span style={{ color: darkMode ? '#00ffcc' : '#0d9488', fontSize: '0.85rem', fontWeight: 'bold' }}>2024 - 2026</span>
              <h3 style={{ color: theme.text, margin: '8px 0 4px 0', fontSize: '1.2rem' }}>Master of Computer Applications (MCA)</h3>
              <p style={{ color: darkMode ? '#00ffcc' : '#0d9488', fontSize: '0.9rem' }}>Postgraduate Degree</p>
              <p style={{ color: theme.cardText, margin: '12px 0', fontSize: '0.9rem' }}>Advanced specialization in computing theory, software engineering paradigms, and scalable architecture.</p>
            </motion.div>

            <motion.div 
              whileHover={{ scale: 1.03, y: -5, borderColor: darkMode ? '#00ffcc' : '#0d9488', boxShadow: darkMode ? '0 15px 30px rgba(0, 255, 204, 0.25)' : '0 10px 20px rgba(0,0,0,0.15)' }} 
              transition={{ duration: 0.3 }} 
              style={{ backgroundColor: theme.cardBg, backdropFilter: 'blur(20px)', border: `1px solid ${theme.border}`, padding: '24px', borderRadius: '15px', cursor: 'pointer' }}
            >
              <span style={{ color: darkMode ? '#00ffcc' : '#0d9488', fontSize: '0.85rem', fontWeight: 'bold' }}>Graduated July 2024</span>
              <h3 style={{ color: theme.text, margin: '8px 0 4px 0', fontSize: '1.2rem' }}>B.Sc. in Information Technology</h3>
              <p style={{ color: darkMode ? '#00ffcc' : '#0d9488', fontSize: '0.9rem' }}>Dr. Shyama Prasad Mukherjee University (CGPA: 7.71)</p>
              <p style={{ color: theme.cardText, margin: '12px 0', fontSize: '0.9rem' }}>Solid grounding in core computer science subjects, database administration, and application development.</p>
            </motion.div>

          </div>
        </motion.div>

        {/* 5. Certificates & Achievements Section */}
        <motion.div 
          id="certificates" 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ paddingBottom: '80px', scrollMarginTop: '100px' }}
        >
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: theme.text, borderBottom: `2px solid ${darkMode ? '#00ffcc' : '#0d9488'}`, display: 'inline-block', marginBottom: '20px' }}>Certificates & Achievements</h2>
          <p style={{ color: theme.cardText, fontSize: '0.9rem', marginBottom: '25px' }}>Swipe or scroll horizontally to explore certifications ➔</p>
          
          <div style={{ display: 'flex', gap: '20px', overflowX: 'auto', paddingBottom: '15px', scrollBehavior: 'smooth', WebkitOverflowScrolling: 'touch' }} className="cert-slider">
            {[
              { icon: "🏆", date: "14 Jan 2026", title: "Tech Eloquence Assessment", desc: "Superset Launchpad (Score: 89/126). Secured a perfect score of 10/10 in Live Coding.", link: "https://drive.google.com/file/d/107RBG7TiyfdlsxexgPMx067QHHQp0JRk/view?usp=drive_link" },
              { icon: "💡", date: "19 July 2026", title: "QuizOff 2026: AI Quiz", desc: "CampusCrew & Unstop. Competed globally alongside 5,25,000+ students in India's largest AI quiz event.", link: "https://drive.google.com/file/d/1alXGECy6UmU24sy7LJK8R9Hrsj-yW2Ut/view?usp=drive_link" },
              { icon: "💼", date: "Jan 2026", title: "Software Engineering Simulation", desc: "JPMorgan Chase & Co. Completed practical tasks including Kafka Integration, H2, and REST APIs.", link: "https://drive.google.com/file/d/1EPjJuTzAx_qyJXk8z_zxZ-4edKELK35a/view?usp=drive_link" },
              { icon: "⚡", date: "Jan 2026", title: "Technology Job Simulation", desc: "Deloitte. Successfully executed practical assignments focused on software development.", link: "https://drive.google.com/file/d/1DobcvjAXKL83GACaBlHeXlSEiqSIWic-/view?usp=drive_link" },
              { icon: "☁️", date: "Jan 2026", title: "SAP Build & Fiori Courses", desc: "SAP Learning. Completed beginner & intermediate modules covering Cloud App Development.", link: "https://drive.google.com/file/d/1pDlj3ALqoYEpcM5Pq_fSwQa1u2Y2dbqs/view?usp=drive_link" }
            ].map((cert, index) => (
              <motion.div 
                key={index}
                whileHover={{ scale: 1.03, y: -6, borderColor: darkMode ? '#00ffcc' : '#0d9488', boxShadow: darkMode ? '0 15px 30px rgba(0, 255, 204, 0.25)' : '0 10px 20px rgba(0,0,0,0.15)' }}
                transition={{ duration: 0.3 }}
                style={{ minWidth: '280px', maxWidth: '320px', flex: '0 0 auto', backgroundColor: theme.cardBg, backdropFilter: 'blur(20px)', border: `1px solid ${theme.border}`, padding: '24px', borderRadius: '16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer' }}
              >
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span style={{ fontSize: '1.8rem' }}>{cert.icon}</span>
                    <span style={{ backgroundColor: darkMode ? 'rgba(0, 255, 204, 0.1)' : 'rgba(13, 148, 136, 0.1)', color: darkMode ? '#00ffcc' : '#0d9488', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold', border: `1px solid ${darkMode ? '#00ffcc' : '#0d9488'}` }}>{cert.date}</span>
                  </div>
                  <h3 style={{ color: theme.text, fontSize: '1.15rem', marginBottom: '8px' }}>{cert.title}</h3>
                  <p style={{ color: theme.cardText, fontSize: '0.88rem', lineHeight: '1.5', marginBottom: '20px' }}>{cert.desc}</p>
                </div>
                <a href={cert.link} target="_blank" rel="noopener noreferrer" style={{ color: darkMode ? '#000' : '#fff', backgroundColor: darkMode ? '#00ffcc' : '#0d9488', padding: '8px 14px', borderRadius: '6px', textDecoration: 'none', fontWeight: 'bold', textAlign: 'center', fontSize: '0.85rem' }}>View Certificate ↗</a>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* 6. Contact Form Section */}
        <motion.div 
          id="contact" 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          style={{ paddingBottom: '40px', scrollMarginTop: '100px' }}
        >
          <h2 style={{ fontSize: 'clamp(1.8rem, 4vw, 3rem)', color: theme.text, marginBottom: '15px' }}>Contact Me</h2>
          <p style={{ fontSize: '1.05rem', color: theme.cardText, marginBottom: '20px' }}>Let's build something great together!</p>
          
          <form onSubmit={sendEmail} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px', width: '100%' }}>
            <input name="from_name" placeholder="Your Name" required style={{ padding: '12px', backgroundColor: theme.cardBg, backdropFilter: 'blur(20px)', color: theme.text, border: `1px solid ${theme.border}`, borderRadius: '8px', outline: 'none', fontSize: '0.95rem' }} />
            <input name="from_email" type="email" placeholder="Your Email" required style={{ padding: '12px', backgroundColor: theme.cardBg, backdropFilter: 'blur(20px)', color: theme.text, border: `1px solid ${theme.border}`, borderRadius: '8px', outline: 'none', fontSize: '0.95rem' }} />
            <textarea name="message" placeholder="Your Message" required style={{ padding: '12px', height: '110px', backgroundColor: theme.cardBg, backdropFilter: 'blur(20px)', color: theme.text, border: `1px solid ${theme.border}`, borderRadius: '8px', outline: 'none', fontSize: '0.95rem' }} />
            <button type="submit" style={{ padding: '12px', backgroundColor: darkMode ? '#00ffcc' : '#0d9488', color: darkMode ? '#000' : '#fff', border: 'none', borderRadius: '8px', fontWeight: 'bold', cursor: 'pointer', fontSize: '0.95rem' }}>Send Message 🚀</button>
          </form>

          {/* Fixed Contact Info Colors */}
          <div style={{ marginTop: '20px', color: darkMode ? '#ffffff' : '#111827', fontSize: '0.95rem', display: 'flex', flexDirection: 'column', gap: '8px', fontWeight: '500' }}>
            <p style={{ margin: 0 }}>📧 Email: <a href="mailto:sachinm30k@gmail.com" style={{ color: darkMode ? '#00ffcc' : '#0d9488', textDecoration: 'none', fontWeight: 'bold' }}>sachinm30k@gmail.com</a></p>
            <p style={{ margin: 0 }}>📱 Phone: <a href="tel:+916203941012" style={{ color: darkMode ? '#00ffcc' : '#0d9488', textDecoration: 'none', fontWeight: 'bold' }}>+91-6203941012</a></p>
          </div>
        </motion.div>
      </div>

      {/* Footer */}
      <footer style={{ position: 'relative', zIndex: 2, padding: '30px 5%', textAlign: 'center', borderTop: `1px solid ${theme.border}`, color: theme.cardText, fontSize: '0.85rem' }}>
        <div style={{ marginBottom: '12px', display: 'flex', justifyContent: 'center', gap: '20px' }}>
          <a href="https://github.com/Sachinmandal23" target="_blank" rel="noopener noreferrer" style={{ color: darkMode ? '#00ffcc' : '#0d9488', textDecoration: 'none', fontWeight: 'bold' }}>GitHub ↗</a>
          <a href="https://linkedin.com/in/sachinmandal30" target="_blank" rel="noopener noreferrer" style={{ color: darkMode ? '#00ffcc' : '#0d9488', textDecoration: 'none', fontWeight: 'bold' }}>LinkedIn ↗</a>
        </div>
        <p>© 2026 Sachin Kumar Mandal. Built with React & Java Spring Boot.</p>
      </footer>

      {/* Chat Window */}
      {isChatOpen && (
        <motion.div 
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          style={{ position: 'fixed', bottom: '20px', right: '20px', width: '90vw', maxWidth: '340px', height: '420px', backgroundColor: theme.cardBg, backdropFilter: 'blur(20px)', border: `1px solid ${darkMode ? '#00ffcc' : '#0d9488'}`, borderRadius: '12px', zIndex: 1000, display: 'flex', flexDirection: 'column', boxShadow: '0px 0px 30px rgba(0, 0, 0, 0.15)' }}
        >
          <div style={{ padding: '12px 15px', borderBottom: `1px solid ${theme.border}`, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <strong style={{ color: darkMode ? '#00ffcc' : '#0d9488' }}>AI Assistant</strong>
            <button onClick={() => setIsChatOpen(false)} style={{ background: 'none', border: 'none', color: theme.text, cursor: 'pointer', fontSize: '1.2rem' }}>✖</button>
          </div>
          <div style={{ flex: 1, padding: '12px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {messages.map((msg, i) => (
              <div key={i} style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: msg.sender === 'user' ? (darkMode ? '#00ffcc' : '#0d9488') : (darkMode ? '#222' : '#e2e8f0'), color: msg.sender === 'user' ? (darkMode ? '#000' : '#fff') : theme.text, maxWidth: '85%', alignSelf: msg.sender === 'user' ? 'flex-end' : 'flex-start', fontSize: '0.9rem' }}>
                {msg.text}
              </div>
            ))}
            {isAiLoading && (
              <div style={{ padding: '8px 12px', borderRadius: '8px', backgroundColor: darkMode ? '#222' : '#e2e8f0', color: darkMode ? '#00ffcc' : '#0d9488', maxWidth: '85%', alignSelf: 'flex-start', fontStyle: 'italic', fontSize: '0.9rem' }}>
                AI is typing...
              </div>
            )}
            <div ref={chatEndRef} />
          </div>
          <div style={{ padding: '8px 10px', borderTop: `1px solid ${theme.border}`, display: 'flex' }}>
            <input value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()} placeholder="Ask anything..." style={{ flex: 1, padding: '8px', backgroundColor: theme.bg, border: `1px solid ${theme.border}`, color: theme.text, outline: 'none', borderRadius: '5px', fontSize: '0.9rem' }} />
            <button onClick={handleSendMessage} disabled={isAiLoading} style={{ marginLeft: '8px', backgroundColor: darkMode ? '#00ffcc' : '#0d9488', color: darkMode ? '#000' : '#fff', border: 'none', padding: '8px 12px', cursor: 'pointer', fontWeight: 'bold', borderRadius: '5px', opacity: isAiLoading ? 0.6 : 1, fontSize: '0.9rem' }}>Send</button>
          </div>
        </motion.div>
      )}

      {/* Styles & Media Queries */}
      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-50%); }
        }
        .cert-slider::-webkit-scrollbar {
          height: 6px;
        }
        .cert-slider::-webkit-scrollbar-thumb {
          background: ${darkMode ? '#00ffcc' : '#0d9488'};
          border-radius: 10px;
        }
        @media (max-width: 900px) {
          .desktop-nav { display: none !important; }
          .mobile-toggle { display: flex !important; }
        }
        @media (min-width: 901px) {
          .mobile-toggle { display: none !important; }
        }
      `}</style>
    </div>
  );
}

export default App;