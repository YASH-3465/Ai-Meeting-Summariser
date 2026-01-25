import React, { useRef, useState } from "react";
import { motion, useScroll, useSpring, useTransform } from "framer-motion";
import { useNavigate } from "react-router-dom";

const steps = [
  {
    title: "Media Ingestion",
    desc: "Proprietary secure tunnel for uploading high-fidelity audio/video streams with automated codec normalization.",
    icon: <path d="M12 2v20M17 7l-5-5-5 5M17 17l-5 5-5-5" />,
    color: "#00d2ff",
  },
  {
    title: "Neural Transcription",
    desc: "Powered by OpenAI's Whisper Large-v3. Multilingual diarization with sub-second latency and 99.2% accuracy.",
    icon: <path d="M12 1a3 3 0 0 0-3 3v8a3 3 0 0 0 6 0V4a3 3 0 0 0-3-3z M19 10v2a7 7 0 0 1-14 0v-2M12 19v4M8 23h8" />,
    color: "#9d50bb",
  },
  {
    title: "Semantic Mapping",
    desc: "Context-aware translation and normalization. Cross-references jargon and technical terminology in real-time.",
    icon: <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10zM12 2v20" />,
    color: "#3a7bd5",
  },
  {
    title: "Synthesized Logic",
    desc: "LLM-driven distillation. Preserves the nuance of decisions while removing conversational noise and filler.",
    icon: <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16zM12 22V12M12 12l8.7-5M12 12l-8.7-5" />,
    color: "#00f2fe",
  },
  {
    title: "Action Item Matrix",
    desc: "Entity recognition identifies owners, deadlines, and dependencies to generate automated project workflows.",
    icon: <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14M22 4L12 14.01l-3-3" />,
    color: "#4facfe",
  },
];

export default function ProcessMeeting() {
  const containerRef = useRef(null);
  const navigate = useNavigate();
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end end"],
  });

  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });
  const bgOpacity = useTransform(scrollYProgress, [0, 0.5, 1], [0.1, 0.2, 0.1]);

 const handleDownload = () => {
  const link = document.createElement("a");
  
  // Browsers automatically look into the 'public' folder when you use "/"
  link.href = "/meetwise-architecture.png"; 
  
  link.download = "MeetWise_System_Architecture.png";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};
  return (
    <div ref={containerRef} className="mw-pipeline-root">
      <style>{eliteCSS}</style>

      {/* --- ELITE ATMOSPHERE --- */}
      <div className="aura-container">
        <motion.div style={{ opacity: bgOpacity }} className="aura-blob" />
        <div className="grid-overlay" />
      </div>

      {/* --- HERO HEADER --- */}
      <section className="mw-pipeline-header">
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
        >
          <span className="mw-badge">WorkFlow Pipeline</span>
          <h1 className="mw-h1">The Intelligence Pipeline <br/><span>Powering MeetWise Insight</span></h1>
          <p className="mw-subtitle">How MeetWise transforms raw meetings into structured intelligence.</p>
        </motion.div>
      </section>

      {/* --- PIPELINE VISUALIZATION --- */}
      <div className="mw-timeline-viewport">
        <div className="mw-main-track">
          <div className="track-bg" />
          <motion.div className="track-fill" style={{ scaleY: pathLength }} />
        </div>

        <div className="mw-steps-container">
          {steps.map((step, idx) => (
            <ProcessStep key={idx} step={step} index={idx} />
          ))}
        </div>
      </div>

      {/* --- PERFORMANCE METRICS COMPONENT --- */}
      <section className="mw-metrics">
        <div className="metrics-grid">
            <MetricBox label="Inference Latency" value="140ms" />
            <MetricBox label="Language Support" value="95+" />
            <MetricBox label="Extraction Precision" value="99.2%" />
        </div>
      </section>

      {/* --- ELITE FOOTER --- */}
      <section className="mw-final-cta">
        <motion.div 
          className="cta-glass-card"
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 200 }}
        >
          <h2>System Infrastructure<span>.</span></h2>
          <p>Deep-dive into the technical stack and Whisper-v3 integration pipeline.</p>
          <button className="mw-download-btn" onClick={handleDownload}>
            <svg viewBox="0 0 24 24" width="20" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{marginRight: '12px'}}>
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M7 10l5 5 5-5M12 15V3" />
            </svg>
            Download Architecture Blueprint
          </button>
        </motion.div>
      </section>
    </div>
  );
}

function ProcessStep({ step, index }) {
  const isEven = index % 2 === 0;
  const [mPos, setMPos] = useState({ x: 0, y: 0 });

  return (
    <motion.div 
      className={`mw-step-row ${isEven ? "left" : "right"}`}
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
    >
      <div className="mw-card-wrapper">
        <motion.div 
          className="mw-step-card"
          onMouseMove={(e) => {
            const rect = e.currentTarget.getBoundingClientRect();
            setMPos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
          }}
          whileHover={{ y: -10 }}
        >
          <div className="mw-spotlight" style={{ background: `radial-gradient(400px circle at ${mPos.x}px ${mPos.y}px, ${step.color}15, transparent 80%)` }} />
          
          <div className="mw-card-top">
            <div className="mw-icon-frame" style={{ "--c": step.color }}>
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {step.icon}
              </svg>
            </div>
            <span className="mw-step-idx">Layer 0{index + 1}</span>
          </div>

          <div className="mw-card-body">
            <h3>{step.title}</h3>
            <p>{step.desc}</p>
          </div>

          <div className="mw-card-accent" style={{ background: step.color }} />
        </motion.div>
        
        <div className="mw-anchor-dot" style={{ "--c": step.color }} />
      </div>
    </motion.div>
  );
}

function MetricBox({ label, value }) {
    return (
        <motion.div className="metric-box" whileHover={{ y: -5 }}>
            <span className="m-label">{label}</span>
            <span className="m-value">{value}</span>
        </motion.div>
    );
}

const eliteCSS = `
  .mw-pipeline-root { background: #010101; color: #fff; font-family: 'Inter', sans-serif; overflow-x: hidden; }

  .aura-container { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .aura-blob { position: absolute; top: -10%; left: 50%; width: 100vw; height: 80vh; background: radial-gradient(circle, #3a7bd522 0%, transparent 70%); transform: translateX(-50%); }
  .grid-overlay { position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,0.03) 1px, transparent 1px); background-size: 40px 40px; }

  .mw-pipeline-header { position: relative; z-index: 10; padding: 180px 24px 100px; text-align: center; }
  .mw-badge { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 8px 20px; border-radius: 100px; color: #00d2ff; font-size: 0.75rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
  .mw-h1 { font-size: clamp(4rem, 8vw, 4.8rem); font-weight: 800; margin-top: 30px; line-height: 0.95; letter-spacing: -3px; }
  .mw-h1 span { background: linear-gradient(135deg, #fff 30%, #00d2ff 100%); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .mw-subtitle { color: #888; font-size: 1.2rem; max-width: 600px; margin: 30px auto 0; line-height: 1.5; }

  .mw-timeline-viewport { position: relative; max-width: 1200px; margin: 0 auto; padding: 100px 0; }
  .mw-main-track { position: absolute; left: 50%; transform: translateX(-50%); height: 100%; width: 2px; top: 0; }
  .track-bg { height: 100%; width: 100%; background: rgba(255,255,255,0.05); }
  .track-fill { position: absolute; top: 0; width: 100%; background: linear-gradient(to bottom, transparent, #00d2ff, #9d50bb); origin-y: 0; box-shadow: 0 0 20px #00d2ff66; }

  .mw-steps-container { display: flex; flex-direction: column; gap: 120px; }
  .mw-step-row { display: flex; width: 100%; }
  .mw-card-wrapper { width: 50%; position: relative; display: flex; align-items: center; }
  .left .mw-card-wrapper { justify-content: flex-end; padding-right: 80px; }
  .right .mw-card-wrapper { justify-content: flex-start; padding-left: 80px; align-self: flex-end; margin-left: 50%; }

  .mw-step-card { 
    width: 100%; max-width: 480px; background: rgba(255,255,255,0.01); border: 1px solid rgba(255,255,255,0.06); 
    border-radius: 32px; padding: 40px; position: relative; overflow: hidden; backdrop-filter: blur(20px);
  }
  .mw-spotlight { position: absolute; inset: 0; pointer-events: none; }
  .mw-card-top { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 30px; }
  .mw-icon-frame { width: 56px; height: 56px; border-radius: 14px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); display: flex; align-items: center; justify-content: center; color: var(--c); }
  .mw-step-idx { font-family: 'JetBrains Mono', monospace; font-size: 0.7rem; color: #555; font-weight: 800; letter-spacing: 2px; }
  .mw-card-body h3 { font-size: 1.8rem; font-weight: 700; margin-bottom: 15px; letter-spacing: -0.5px; }
  .mw-card-body p { color: #888; line-height: 1.6; }
  .mw-card-accent { position: absolute; bottom: 0; left: 0; height: 3px; width: 0; transition: width 0.6s cubic-bezier(0.16, 1, 0.3, 1); }
  .mw-step-card:hover .mw-card-accent { width: 100%; }

  .mw-anchor-dot { position: absolute; top: 50%; width: 12px; height: 12px; border-radius: 50%; background: #010101; border: 2px solid var(--c); z-index: 20; box-shadow: 0 0 15px var(--c); }
  .left .mw-anchor-dot { right: -6px; transform: translateY(-50%); }
  .right .mw-anchor-dot { left: -6px; transform: translateY(-50%); }

  .mw-metrics { padding: 100px 24px; max-width: 1200px; margin: 0 auto; }
  .metrics-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; }
  .metric-box { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 24px; padding: 40px; text-align: center; }
  .m-label { display: block; color: #555; text-transform: uppercase; letter-spacing: 2px; font-size: 0.7rem; font-weight: 800; }
  .m-value { display: block; font-size: 2.5rem; font-weight: 800; margin-top: 10px; color: #00d2ff; }

  .mw-final-cta { padding: 150px 24px; text-align: center; }
  .cta-glass-card { max-width: 900px; margin: 0 auto; background: #050505; border: 1px solid rgba(255,255,255,0.08); padding: 80px 40px; border-radius: 48px; }
  .cta-glass-card h2 { font-size: 3rem; font-weight: 800; letter-spacing: -2px; }
  .cta-glass-card h2 span { color: #00d2ff; }
  .cta-glass-card p { color: #666; margin: 20px 0 40px; font-size: 1.2rem; }

  .mw-download-btn { 
    background: #fff; color: #000; padding: 20px 45px; border-radius: 100px; 
    font-weight: 800; border: none; font-size: 1.1rem; cursor: pointer; 
    display: inline-flex; align-items: center; transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .mw-download-btn:hover { background: #00d2ff; transform: translateY(-5px); box-shadow: 0 15px 40px rgba(0,210,255,0.2); }

  @media (max-width: 1000px) {
    .mw-main-track { left: 30px; transform: none; }
    .mw-card-wrapper { width: 100%; padding-left: 70px !important; padding-right: 0 !important; }
    .right .mw-card-wrapper { margin-left: 0; }
    .mw-anchor-dot { left: -6px !important; }
    .metrics-grid { grid-template-columns: 1fr; }
  }
`;