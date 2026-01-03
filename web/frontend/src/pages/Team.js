import React, { useState } from "react";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform } from "framer-motion";

const members = [
  { 
    name: "Vishwas",
    role: "Testing & UI Designer",
    bio: "Handled testing, evaluation, and validation of AI outputs. , model comparison, and Mastermind behind the MeetWise aesthetic. Specialized in creating the glassmorphic interface that defines the user experience.",
    skills: [
      "Testing",
      "AI Evaluation",
      "Research Documentation",
      "Model Analysis"
    ],
    color: "#3a7bd5",
    linkedin: "https://www.linkedin.com/in/vishwas-link"
  },
  { 
    name: "Yashwanth",
    role: "Team Lead, AI Pipeline & Frontend",
    bio: "Designed and implemented the core AI meeting intelligence pipeline including speech transcription, multilingual translation, summarization, and action-item extraction. Also developed the interactive frontend experience connecting the AI engine with users.",
    skills: [
      "Python",
      "Whisper ASR",
      "NLP",
      "FastAPI",
      "React",
      "Framer Motion"
    ],
    color: "#00d2ff",
    linkedin: "https://www.linkedin.com/in/yashwanth-goud-543298366/"
  },
   { 
    name: "Tanushree",
    role: "Backend & AI Pipeline Engineer",
    bio: "Responsible for backend architecture and half of the AI pipeline implementation. Built FastAPI services, integrated AI models with backend workflows, and ensured stable data flow between the frontend and AI engine.",
    skills: [
      "FastAPI",
      "Python",
      "API Design",
      "AI Integration",
      "System Architecture"
    ],
    color: "#9d50bb",
    linkedin: "https://www.linkedin.com/in/tanushree-link"
  }
  
];


export default function Team() {
  const [selected, setSelected] = useState(null);

  return (
    <div style={s.page}>
      <style>{teamCSS}</style>
      
      {/* Dynamic Background Glow */}
      <motion.div 
        className="dynamic-bg" 
        animate={{ 
          background: selected 
            ? `radial-gradient(circle at 80% 50%, ${selected.color}33, transparent 70%)` 
            : `radial-gradient(circle at 50% 50%, rgba(58, 123, 213, 0.1) 0%, transparent 70%)` 
        }}
      />

      <div className="team-container">
        <header className="team-header">
          <motion.span layout className="team-badge">Meet the Crew</motion.span>
          <motion.h1 layout>Project <span>Team</span></motion.h1>
        </header>

        <motion.div layout className="layout-engine">
          {/* MAIN GRID */}
          <motion.div layout className={`team-grid ${selected ? 'focused' : ''}`}>
            {members.map((m) => (
              <TeamCard 
                key={m.name} 
                member={m} 
                isSelected={selected?.name === m.name}
                onClick={() => setSelected(selected?.name === m.name ? null : m)}
              />
            ))}
          </motion.div>

          {/* ELEGANT DETAIL DRAWER */}
          <AnimatePresence>
            {selected && (
              <motion.div 
                className="detail-drawer"
                initial={{ x: 100, opacity: 0, filter: "blur(10px)" }}
                animate={{ x: 0, opacity: 1, filter: "blur(0px)" }}
                exit={{ x: 100, opacity: 0, filter: "blur(10px)" }}
                transition={{ type: "spring", damping: 25, stiffness: 120 }}
              >
                <div className="drawer-inner">
                  <div className="drawer-header">
                    <div className="role-chip" style={{ background: selected.color }}>{selected.role}</div>
                    <button onClick={() => setSelected(null)}>✕</button>
                  </div>
                  
                  <motion.h2 
                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.1 }}
                  >
                    {selected.name}
                  </motion.h2>

                  <motion.p 
                    className="bio"

                    initial={{ y: 20, opacity: 0 }} 
                    animate={{ y: 0, opacity: 1 }} 
                    transition={{ delay: 0.2 }}
                  >
                    {selected.bio}
                  </motion.p>
                  <a
  href={selected.linkedin}
  target="_blank"
  rel="noopener noreferrer"
  style={{
    display: "inline-block",
    marginBottom: "30px",
    color: selected.color,
    fontWeight: 700,
    textDecoration: "none"
  }}
>
  View LinkedIn →
</a>


                  <div className="skills-row">
                    {selected.skills.map((s, i) => (
                      <motion.span 
                        key={s}
                        initial={{ scale: 0 }} 
                        animate={{ scale: 1 }} 
                        transition={{ delay: 0.3 + (i * 0.05) }}
                        className="skill-pill"
                      >
                        {s}
                      </motion.span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </div>
    </div>
  );
}

function TeamCard({ member, isSelected, onClick }) {
  // Smooth 3D tilt effect logic
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x);
  const mouseYSpring = useSpring(y);
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["10deg", "-10deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-10deg", "10deg"]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  return (
    <motion.div
      layout
      className={`card-wrapper ${isSelected ? 'active' : ''}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => { x.set(0); y.set(0); }}
      onClick={onClick}
      style={{ rotateX: isSelected ? 0 : rotateX, rotateY: isSelected ? 0 : rotateY, perspective: 1000 }}
    >
      <motion.div className="card-glass">
        <div className="avatar" style={{ boxShadow: `0 0 20px ${member.color}44` }}>
          {member.name.charAt(0)}
          <div className="avatar-glow" style={{ background: member.color }} />
        </div>
        <h3>{member.name}</h3>
        <p>{member.role}</p>
      </motion.div>
    </motion.div>
  );
}

const s = {
  page: {
    backgroundColor: "#020202",
    color: "#fff",
    minHeight: "100vh",
    padding: "100px 20px",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
    overflow: "hidden"
  }
};

const teamCSS = `
  .dynamic-bg {
    position: fixed; inset: 0; z-index: 0;
    transition: background 1s ease;
  }

  .team-container { max-width: 1300px; margin: 0 auto; position: relative; z-index: 1; }
  
  .team-header { text-align: center; margin-bottom: 80px; }
  .team-badge { color: #888; letter-spacing: 5px; text-transform: uppercase; font-size: 0.7rem; }
  .team-header h1 { font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; margin-top: 15px; }
  .team-header h1 span { color: #00d2ff; }

  .layout-engine { display: flex; gap: 30px; align-items: flex-start; }

  .team-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 30px;
    flex: 1;
    transition: all 0.8s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .team-grid.focused { grid-template-columns: repeat(1, 280px); }

  .card-wrapper { cursor: pointer; position: relative; }
  
  .card-glass {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.07);
    border-radius: 40px;
    padding: 50px 30px;
    text-align: center;
    backdrop-filter: blur(20px);
    transition: border 0.4s ease;
  }

  .card-wrapper.active .card-glass { border-color: #00d2ff; background: rgba(0, 210, 255, 0.05); }

  .avatar {
    width: 100px; height: 100px; border-radius: 35px;
    background: #111; margin: 0 auto 25px;
    display: flex; align-items: center; justify-content: center;
    font-size: 2.5rem; font-weight: 800; position: relative;
  }

  .avatar-glow {
    position: absolute; inset: 0; border-radius: inherit;
    filter: blur(20px); opacity: 0.3; z-index: -1;
  }

  .detail-drawer {
    flex: 1;
    background: rgba(255, 255, 255, 0.03);
    border: 1px solid rgba(255, 255, 255, 0.1);
    border-radius: 50px;
    padding: 60px;
    min-height: 500px;
    backdrop-filter: blur(40px);
  }

  .drawer-header { display: flex; justify-content: space-between; margin-bottom: 30px; }
  .role-chip { padding: 6px 16px; border-radius: 100px; font-size: 0.75rem; font-weight: 700; text-transform: uppercase; color: #000; }
  .drawer-header button { background: none; border: none; color: #555; cursor: pointer; font-size: 1.2rem; }

  .detail-drawer h2 { font-size: 3.5rem; margin-bottom: 20px; font-weight: 800; }
  .bio { font-size: 1.2rem; line-height: 1.8; color: #aaa; margin-bottom: 40px; }

  .skills-row { display: flex; flex-wrap: wrap; gap: 12px; }
  .skill-pill { background: rgba(255,255,255,0.05); padding: 8px 20px; border-radius: 100px; font-size: 0.9rem; border: 1px solid rgba(255,255,255,0.1); }

  @media (max-width: 1000px) {
    .layout-engine { flex-direction: column; }
    .team-grid.focused { grid-template-columns: repeat(3, 1fr); max-width: 100%; }
    .detail-drawer { width: 100%; }
  }
`;