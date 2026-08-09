import React from 'react';
import { motion } from 'framer-motion';

const skills = [
  { name: "Java", color: "#f89820" },
  { name: "Spring Boot", color: "#6db33f" },
  { name: "React.js", color: "#61dbfb" },
  { name: "SQL / Databases", color: "#00ffcc" },
  { name: "Python", color: "#ffd43b" },
  { name: "JavaScript", color: "#f7df1e" },
  { name: "Apache Kafka", color: "#e11d48" }, // Light mode ke liye thoda visible color
  { name: "Node.js", color: "#68a063" },
  { name: "Docker", color: "#2496ed" },
  { name: "Git & GitHub", color: "#f05032" }
];

export default function TechBubbles({ darkMode }) {
  return (
    <div style={{ width: '100%', padding: '60px 20px', textAlign: 'center', position: 'relative' }}>
      <h2 style={{ 
        color: darkMode ? '#fff' : '#111827', 
        marginBottom: '40px', 
        fontSize: 'clamp(2rem, 4vw, 3rem)', 
        borderBottom: `2px solid ${darkMode ? '#00ffcc' : '#0d9488'}`, 
        display: 'inline-block',
        transition: 'color 0.5s'
      }}>
        Interactive Tech Stack
      </h2>
      
      <div style={{ 
        display: 'flex', 
        flexWrap: 'wrap', 
        justifyContent: 'center', 
        gap: '20px', 
        maxWidth: '1000px', 
        margin: '0 auto' 
      }}>
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            initial={{ y: 0, scale: 1 }}
            animate={{ y: [0, -10, 0] }}
            transition={{ 
              duration: 3 + (index % 3), 
              repeat: Infinity, 
              ease: "easeInOut",
              delay: index * 0.15 
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