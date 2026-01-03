import React from "react";
import { motion } from "framer-motion";

export default function About() {
  return (
    <div className="about-root">
      <style>{aboutCSS}</style>

      {/* BACKGROUND DECO */}
      <div className="about-glow-top" />
      <div className="about-grid" />

      <div className="about-container">
        {/* HERO SECTION */}
        <motion.section 
          className="about-hero"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="about-badge">The Mission</span>
          <h1>Redefining <span>Communication</span></h1>
          <p>
            MeetWise is more than just a transcription tool. It is an AI-powered 
            multilingual intelligence layer designed to bridge the gap between 
            spoken conversation and structured productivity.
          </p>
        </motion.section>

        {/* CORE PILLARS SECTION */}
        <div className="pillars-grid">
  <PillarCard 
    index={0}
    title="Research & Engineering Focus" 
    items={[
      { 
        t: "Robust Speech Transcription", 
        d: "Evaluating and fine-tuning Whisper models for real-world meetings with noise, accents, and overlapping speech." 
      },
      { 
        t: "Multilingual Processing", 
        d: "Automatic translation of non-English meetings into English for unified downstream analysis." 
      },
      { 
        t: "Meeting Summarization", 
        d: "Hierarchical and abstractive summarization techniques to preserve key decisions and context." 
      },
      { 
        t: "Action & Deadline Extraction", 
        d: "Rule-based and linguistic NLP methods to accurately identify tasks, owners, and timelines." 
      }
    ]}
    icon="🔬"
  />

  <PillarCard 
    index={1}
    title="Future Enhancements" 
    items={[
      { 
        t: "Calendar Integration", 
        d: "Automatic creation of calendar events and reminders from extracted action items." 
      },
      { 
        t: "User Authentication", 
        d: "Role-based access control and secure user management for team collaboration." 
      },
      { 
        t: "Scalable Deployment", 
        d: "Cloud-based processing pipelines for handling large volumes of meetings efficiently." 
      },
      { 
        t: "Insight Analytics", 
        d: "Visual dashboards to analyze meeting frequency, action completion, and productivity trends." 
      }
    ]}
    icon="💡"
  />
</div>

        {/* TECH STACK VISUAL */}
        <motion.div 
          className="tech-stack-section"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          <h3>Our Tech Stack</h3>
          <div className="stack-bubbles">
            {["React", "Framer Motion", "OpenAI Whisper", "LLMs", "Node.js", "Python"].map((tech, i) => (
              <motion.span 
                key={tech}
                className="tech-bubble"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
              >
                {tech}
              </motion.span>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}

function PillarCard({ title, items, icon, index }) {
  return (
    <motion.div 
      className="pillar-card"
      initial={{ opacity: 0, x: index === 0 ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
      viewport={{ once: true }}
    >
      <div className="pillar-header">
        <span className="pillar-icon">{icon}</span>
        <h3>{title}</h3>
      </div>
      <div className="pillar-list">
        {items.map((item, i) => (
          <div key={i} className="pillar-item">
            <div className="pillar-dot" />
            <div className="pillar-content">
              <strong>{item.t}</strong>
              <p>{item.d}</p>
            </div>
          </div>
        ))}
      </div>
    </motion.div>
  );
}

const aboutCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');

  .about-root {
    background-color: #030303;
    color: #fff;
    min-height: 100vh;
    font-family: 'Plus Jakarta Sans', sans-serif;
    position: relative;
    padding: 120px 20px;
    overflow: hidden;
  }

  .about-container {
    max-width: 1100px;
    margin: 0 auto;
    position: relative;
    z-index: 2;
  }

  .about-glow-top {
    position: absolute; top: -10%; left: 50%;
    width: 60%; height: 40%;
    background: radial-gradient(circle, rgba(0, 198, 255, 0.15), transparent 70%);
    filter: blur(100px);
    transform: translateX(-50%);
  }

  .about-grid {
    position: absolute; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), 
                      linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px);
    background-size: 50px 50px;
    mask-image: linear-gradient(to bottom, black, transparent);
    z-index: 1;
  }

  /* HERO */
  .about-hero { text-align: center; margin-bottom: 100px; }
  .about-badge { color: #00d2ff; text-transform: uppercase; letter-spacing: 4px; font-size: 0.8rem; font-weight: 700; }
  .about-hero h1 { font-size: clamp(2.5rem, 6vw, 4rem); font-weight: 800; margin: 20px 0; }
  .about-hero h1 span { color: #00d2ff; }
  .about-hero p { max-width: 700px; margin: 0 auto; color: #888; font-size: 1.2rem; line-height: 1.7; }

  /* PILLARS */
  .pillars-grid {
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
    gap: 40px;
    margin-bottom: 100px;
  }

  .pillar-card {
    background: rgba(255, 255, 255, 0.02);
    border: 1px solid rgba(255, 255, 255, 0.08);
    border-radius: 40px;
    padding: 50px;
    backdrop-filter: blur(20px);
  }

  .pillar-header { display: flex; align-items: center; gap: 15px; margin-bottom: 40px; }
  .pillar-icon { font-size: 2rem; }
  .pillar-header h3 { font-size: 1.8rem; font-weight: 700; margin: 0; }

  .pillar-list { display: flex; flex-direction: column; gap: 30px; }
  .pillar-item { display: flex; gap: 20px; }
  .pillar-dot { width: 8px; height: 8px; background: #00d2ff; border-radius: 50%; margin-top: 8px; flex-shrink: 0; box-shadow: 0 0 10px #00d2ff; }
  .pillar-content strong { display: block; font-size: 1.1rem; margin-bottom: 5px; }
  .pillar-content p { color: #666; margin: 0; font-size: 0.95rem; line-height: 1.5; }

  /* TECH STACK */
  .tech-stack-section { text-align: center; }
  .tech-stack-section h3 { font-size: 1.5rem; margin-bottom: 40px; color: #444; text-transform: uppercase; letter-spacing: 2px; }
  .stack-bubbles { display: flex; flex-wrap: wrap; justify-content: center; gap: 15px; }
  .tech-bubble {
    background: rgba(255, 255, 255, 0.05);
    padding: 12px 24px;
    border-radius: 100px;
    border: 1px solid rgba(255, 255, 255, 0.1);
    font-size: 0.9rem;
    font-weight: 600;
    transition: 0.3s;
  }
  .tech-bubble:hover { background: #fff; color: #000; transform: scale(1.1); }

  @media (max-width: 900px) {
    .pillars-grid { grid-template-columns: 1fr; }
    .pillar-card { padding: 30px; }
  }
`;