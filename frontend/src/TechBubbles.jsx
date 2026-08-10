import React, { useState, useMemo } from 'react';
import { motion } from 'framer-motion';

const skills = [
  { name: "Java", color: "#f89820", category: "Backend" },
  { name: "Spring Boot", color: "#6db33f", category: "Backend" },
  { name: "React.js", color: "#61dbfb", category: "Frontend" },
  { name: "SQL / Databases", color: "#00ffcc", category: "Backend" },
  { name: "Python", color: "#ffd43b", category: "Backend" },
  { name: "JavaScript", color: "#f7df1e", category: "Frontend" },
  { name: "Apache Kafka", color: "#e11d48", category: "Backend" },
  { name: "Node.js", color: "#68a063", category: "Backend" },
  { name: "Docker", color: "#2496ed", category: "Tools" },
  { name: "Git & GitHub", color: "#f05032", category: "Tools" }
];

export default function TechBubbles({ darkMode }) {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const categories = ["All", "Backend", "Frontend", "Tools"];

  const filteredSkills = useMemo(() => {
    if (selectedCategory === "All") return skills;
    return skills.filter(skill => skill.category === selectedCategory);
  }, [selectedCategory]);

  return (
    <div style={{ width: '100%', padding: '60px 20px', textAlign: 'center', position: 'relative' }}>
      <h2 style={{ 
        color: darkMode ? '#fff' : '#111827', 
        marginBottom: '25px', 
        fontSize: 'clamp(1.8rem, 4vw, 3rem)', 
        borderBottom: `2px solid ${darkMode ? '#00ffcc' : '#0d9488'}`, 
        display: 'inline-block',
        transition: 'color 0.5s'
      }}>
        Interactive Tech Stack
      </h2>

      {/* Filter Buttons */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '10px', marginBottom: '35px', flexWrap: 'wrap' }}>
        {categories.map(cat => (
          <button
            key={cat}
            onClick={() => setSelectedCategory(cat)}
            style={{
              padding: '8px 18px',
              borderRadius: '20px',
              border: `1px solid ${selectedCategory === cat ? (darkMode ? '#00ffcc' : '#0d9488') : (darkMode ? 'rgba(255,255,255,0.2)' : '#cbd5e1')}`,
              backgroundColor: selectedCategory === cat ? (darkMode ? 'rgba(0, 255, 204, 0.15)' : 'rgba(13, 148, 136, 0.15)') : 'transparent',
              color: selectedCategory === cat ? (darkMode ? '#00ffcc' : '#0d9488') : (darkMode ? '#9ca3af' : '#4b5563'),
              fontWeight: 'bold',
              cursor: 'pointer',
              fontSize: '0.85rem',
              transition: 'all 0.3s ease'
            }}
          >
            {cat}
          </button>
        ))}
      </div>
      
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        gap: '20px', 
        maxWidth: '1000px', 
        margin: '0 auto' 
      }}>
        {filteredSkills.map((skill, index) => (
          <motion.div
            key={skill.name}
            layout
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1, y: [0, -10, 0] }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ 
              y: { duration: 3 + (index % 3), repeat: Infinity, ease: "easeInOut", delay: index * 0.1 },
              layout: { duration: 0.3 }
            }}
            whileHover={{ scale: 1.08, y: -6, boxShadow: `0 15px 30px ${skill.color}44`, borderColor: skill.color }}
            style={{
              backgroundColor: darkMode ? 'rgba(12, 12, 18, 0.85)' : 'rgba(255, 255, 255, 0.95)',
              border: darkMode ? '1px solid rgba(0, 255, 204, 0.3)' : '1px solid #cbd5e1',
              color: darkMode ? '#fff' : '#1f2937',
              padding: '18px 24px',
              borderRadius: '16px',
              fontSize: '1.05rem',
              fontWeight: 'bold',
              cursor: 'pointer',
              boxShadow: darkMode ? '0 8px 30px rgba(0, 0, 0, 0.5)' : '0 8px 20px rgba(0, 0, 0, 0.08)',
              backdropFilter: 'blur(10px)',
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              transition: 'background-color 0.5s, color 0.5s, border-color 0.3s ease'
            }}
          >
            <span style={{ 
              width: '12px', 
              height: '12px', 
              backgroundColor: skill.color, 
              borderRadius: '50%', 
              display: 'inline-block',
              boxShadow: `0 0 10px ${skill.color}`
            }}></span>
            {skill.name}
          </motion.div>
        ))}
      </div>
    </div>
  );
}