import React, { useRef } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const steps = [
  {
    title: "Media Ingestion",
    desc: "Audio or video files are securely uploaded and prepared for processing.",
    icon: "🔉",
    color: "#00d2ff",
  },
  {
    title: "Speech Recognition",
    desc: "Powered by OpenAI's Whisper. Converts multilingual audio into timestamped text with 99% accuracy.",
    icon: "🎙️",
    color: "#9d50bb",
  },
  {
    title: "Language Translation (Optional)",
    desc: "Non-English meetings are translated into English for consistent analysis.",
    icon: "🌐",
    color: "#3a7bd5",
  },
  {
    title: "Text Summarization",
    desc: "Large Language Models distill hours of conversation into high-level executive summaries.",
    icon: "📝",
    color: "#00f2fe",
  },
  {
    title: "Action & Deadline Extraction",
    desc: "Rule-based and linguistic analysis identifies tasks, responsibilities, and timelines.",
    icon: "✅",
    color: "#4facfe",
  },
];

export default function ProcessMeeting() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start center", "end center"],
  });

  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100,
    damping: 30,
    restDelta: 0.001,
  });

  return (
    <div ref={containerRef} style={s.page}>
      <style>{customCSS}</style>

      {/* BACKGROUND DECORATION */}
      <div className="bg-glow" />

      {/* HEADER SECTION */}
      <motion.div 
        className="header-container"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        <span className="badge">AI Pipeline</span>
        <h1 className="main-title">The Flow Behind <br/><span>MeetWise</span></h1>
        <p className="subtitle">From raw audio to actionable insights in five sophisticated steps.</p>
      </motion.div>

      {/* TIMELINE SECTION */}
      <div className="timeline-section">
        <div className="line-container">
          <div className="line-bg" />
          <motion.div className="line-fill" style={{ scaleY, originY: 0 }} />
        </div>

        <div className="cards-stack">
          {steps.map((step, i) => (
            <ProcessStep key={i} step={step} index={i} />
          ))}
        </div>
      </div>

      {/* FOOTER CTA */}
      <motion.div 
        className="footer-cta"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
      >
        <div className="ready-card">
          <h2>Ready to transform your meetings?</h2>
          <button className="cta-btn">Launch Dashboard</button>
        </div>
      </motion.div>
    </div>
  );
}

function ProcessStep({ step, index }) {
  const isEven = index % 2 === 0;

  return (
    <motion.div 
      className={`step-wrapper ${isEven ? "left" : "right"}`}
      initial={{ opacity: 0, x: isEven ? -100 : 100 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 0.7, type: "spring", bounce: 0.3 }}
    >
      {/* THE CARD */}
      <motion.div 
        className="glass-card"
        whileHover={{ y: -10, scale: 1.02 }}
      >
        <div className="icon-box" style={{ background: step.color }}>
          {step.icon}
        </div>
        <div className="content">
          <span className="step-count">Step 0{index + 1}</span>
          <h3>{step.title}</h3>
          <p>{step.desc}</p>
        </div>
        <div className="card-overlay" style={{ background: `radial-gradient(circle at top right, ${step.color}22, transparent)` }} />
      </motion.div>

      {/* DOT ON THE LINE */}
      <div className="line-dot" />
    </motion.div>
  );
}

// STYLES 
const s = {
  page: {
    backgroundColor: "#030303",
    color: "#fff",
    minHeight: "100vh",
    padding: "120px 20px",
    fontFamily: "'Inter', sans-serif",
    position: "relative",
    overflowX: "hidden"
  }
};

const customCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;600;800&display=swap');

  .bg-glow {
    position: fixed;
    top: 0; left: 50%;
    width: 100vw; height: 100vh;
    background: radial-gradient(circle at 50% -20%, #1a2a6c, #b21f1f00, #fdbb2d00);
    transform: translateX(-50%);
    pointer-events: none;
    z-index: 0;
  }

  .header-container {
    text-align: center;
    max-width: 800px;
    margin: 0 auto 120px;
    position: relative;
    z-index: 1;
  }

  .badge {
    background: rgba(255,255,255,0.05);
    padding: 8px 16px;
    border-radius: 100px;
    border: 1px solid rgba(255,255,255,0.1);
    font-size: 0.8rem;
    letter-spacing: 2px;
    text-transform: uppercase;
    color: #00d2ff;
  }

  .main-title {
    font-size: 4rem;
    font-weight: 800;
    margin-top: 20px;
    line-height: 1.1;
  }

  .main-title span {
    background: linear-gradient(90deg, #00d2ff, #3a7bd5);
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
  }

  .subtitle {
    font-size: 1.2rem;
    color: #888;
    margin-top: 20px;
  }

  .timeline-section {
    position: relative;
    max-width: 1100px;
    margin: 0 auto;
  }

  .line-container {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    height: 100%;
    width: 4px;
  }

  .line-bg {
    height: 100%;
    width: 100%;
    background: rgba(255,255,255,0.05);
    border-radius: 10px;
  }

  .line-fill {
    position: absolute;
    top: 0; width: 100%;
    background: linear-gradient(to bottom, #00d2ff, #9d50bb);
    box-shadow: 0 0 20px #00d2ff;
    border-radius: 10px;
  }

  .cards-stack {
    display: flex;
    flex-direction: column;
    gap: 80px;
  }

  .step-wrapper {
    display: flex;
    width: 100%;
    position: relative;
  }

  .step-wrapper.left { justify-content: flex-start; padding-right: 50%; }
  .step-wrapper.right { justify-content: flex-end; padding-left: 50%; }

  .glass-card {
    width: 90%;
    background: rgba(255,255,255,0.02);
    backdrop-filter: blur(15px);
    border: 1px solid rgba(255,255,255,0.08);
    border-radius: 32px;
    padding: 40px;
    display: flex;
    gap: 24px;
    position: relative;
    overflow: hidden;
    z-index: 2;
  }

  .icon-box {
    width: 64px; height: 64px;
    min-width: 64px;
    border-radius: 20px;
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 2rem;
    box-shadow: 0 10px 30px rgba(0,0,0,0.3);
  }

  .step-count {
    color: #555;
    font-weight: 800;
    font-size: 0.8rem;
    text-transform: uppercase;
  }

  .content h3 {
    font-size: 1.8rem;
    margin: 8px 0;
  }

  .content p {
    color: #aaa;
    line-height: 1.6;
  }

  .line-dot {
    position: absolute;
    left: 50%;
    top: 50%;
    transform: translate(-50%, -50%);
    width: 16px; height: 16px;
    background: #00d2ff;
    border: 4px solid #030303;
    border-radius: 50%;
    z-index: 10;
    box-shadow: 0 0 15px #00d2ff;
  }

  .footer-cta {
    margin-top: 150px;
    text-align: center;
  }

  .ready-card {
    background: linear-gradient(135deg, rgba(0,210,255,0.1), rgba(58,123,213,0.1));
    border: 1px solid rgba(0,210,255,0.2);
    padding: 60px;
    border-radius: 40px;
    max-width: 800px;
    margin: 0 auto;
  }

  .cta-btn {
    margin-top: 30px;
    padding: 16px 40px;
    border-radius: 100px;
    border: none;
    background: #fff;
    color: #000;
    font-weight: 700;
    font-size: 1.1rem;
    cursor: pointer;
    transition: 0.3s;
  }

  .cta-btn:hover {
    transform: scale(1.05);
    box-shadow: 0 0 30px rgba(255,255,255,0.2);
  }

  @media (max-width: 850px) {
    .step-wrapper.left, .step-wrapper.right {
      padding: 0 0 0 60px;
      justify-content: flex-start;
    }
    .line-container, .line-dot {
      left: 20px;
      transform: none;
    }
    .main-title { font-size: 2.5rem; }
    .glass-card { padding: 25px; flex-direction: column; }
  }
`;