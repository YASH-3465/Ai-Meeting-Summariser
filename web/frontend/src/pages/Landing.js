import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function Landing() {
  const containerRef = useRef(null);
  
  // Parallax and Scroll effects
  const { scrollYProgress } = useScroll();
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  
  // Fixed useSpring definition for smooth scaling
  const mockupScale = useSpring(useTransform(scrollYProgress, [0, 0.4], [1, 1.05]), {
    stiffness: 100,
    damping: 30
  });

  return (
    <div className="landing-root" ref={containerRef}>
      <style>{landingCSS}</style>

      {/* AMBIENT BACKGROUND */}
      <div className="aura-container">
        <motion.div style={{ y: y1 }} className="aura-blob blue" />
        <motion.div style={{ y: y2 }} className="aura-blob purple" />
        <div className="grid-overlay" />
      </div>

      {/* HERO SECTION */}
      <section className="hero-section">
        <motion.div 
          className="hero-content"
          style={{ opacity: heroOpacity }}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
        >
          <motion.span className="hero-badge">✦ AI Meeting Assistant</motion.span>
          <motion.h1>MeetWise<span>.</span></motion.h1>
          <motion.p>
            AI-Powered Multilingual Meeting Intelligence 
          </motion.p>
          <div className="hero-btns">
            <button className="btn-primary" onClick={() => window.location.href = "/dashboard"}>
              Get Started
            </button>
            <button className="btn-secondary">Watch Demo</button>
          </div>
        </motion.div>

        {/* MOCKUP WITH POPPING BOT ANIMATION */}
        <motion.div 
          className="dashboard-preview"
          style={{ scale: mockupScale }}
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.8, duration: 1 }}
        >
          <div className="mockup-frame">
            {/* THE FLOATING BOT */}
            <motion.div 
              className="ai-bot-entity"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="bot-head">
                <div className="bot-eye-left" />
                <div className="bot-eye-right" />
                <div className="bot-mouth" />
              </div>
              <div className="bot-ring" />
              
              {/* BOT CHAT BUBBLE */}
              <motion.div 
                className="bot-bubble"
                initial={{ opacity: 0, scale: 0.5, x: 20 }}
                animate={{ opacity: 1, scale: 1, x: 50 }}
                transition={{ delay: 2, duration: 0.5 }}
              >
                Summarizing Key Insights...
              </motion.div>
            </motion.div>

            <div className="mockup-header">
              <div className="dots"><span/><span/><span/></div>
              <div className="mockup-search">meetwise_intelligence_engine.ai</div>
            </div>
            
            <div className="mockup-body">
              <div className="mockup-sidebar">
                {[...Array(5)].map((_, i) => (
                  <div key={i} className="side-line" style={{ width: i === 0 ? '100%' : '60%' }} />
                ))}
              </div>
              
              <div className="mockup-main">
                <div className="meeting-ui">
                  <div className="meeting-header">
                    <div className="avatar-group">
                      <div className="avatar-small blue" />
                      <div className="avatar-small purple" />
                      <div className="avatar-small green" />
                    </div>
                    <span>Weekly Sync - 12:45 PM</span>
                  </div>
                  
                  <div className="transcript-area">
                    <div className="transcript-row">
                      <div className="t-avatar" />
                      <div className="t-skeleton" />
                    </div>
                    <div className="transcript-row reverse">
                      <div className="t-skeleton-short" />
                      <div className="t-avatar" />
                    </div>
                  </div>

                  <div className="ai-insight-panel">
                    <div className="insight-header">AI SUMMARY</div>
                    <motion.div 
                      className="insight-text"
                      initial={{ width: 0 }}
                      animate={{ width: "100%" }}
                      transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                    />
                    <motion.div 
                      className="insight-text"
                      initial={{ width: 0 }}
                      animate={{ width: "80%" }}
                      transition={{ duration: 1.5, delay: 0.5, repeat: Infinity, repeatDelay: 3.5 }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* BENTO GRID WITH IMPROVED ICONS */}
      <section className="info-section">
        <div className="section-label">Feautures</div>
        <h2 className="section-title">Everything you need to scale.</h2>
        <div className="bento-grid">
          <FeatureCard 
            title="Multilingual Understanding" 
            desc="Automatically transcribe and translate meetings across multiple languages into clear English insights." 
            iconType="neural" 
            size="large" 
          />
          <FeatureCard 
            title="Intelligent Summarization" 
            desc="Generate concise, meaningful summaries that preserve key decisions and discussions." 
            iconType="task" 
          />
          <FeatureCard 
            title="Action Item Extraction" 
            desc="Identify responsibilities, deadlines, and next steps without manual effort." 
            iconType="global" 
          />
          <FeatureCard 
            title="Enterprise-Ready Architecture" 
            desc="Built using FastAPI, React, and modular AI pipelines for scalability." 
            iconType="secure" 
            size="wide" 
          />
        </div>
      </section>
    </div>
  );
}

// Improved FeatureCard with SVG Icons
function FeatureCard({ title, desc, iconType, size = "" }) {
  const icons = {
    neural: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 2a10 10 0 1 0 10 10A10 10 0 0 0 12 2zm0 18a8 8 0 1 1 8-8 8 8 0 0 1-8 8z" strokeOpacity="0.2"/>
        <path d="M12 6v6l4 2" strokeLinecap="round" strokeLinejoin="round"/>
        <circle cx="12" cy="12" r="3" fill="url(#grad1)"/>
        <defs>
          <linearGradient id="grad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#00d2ff" />
            <stop offset="100%" stopColor="#9d50bb" />
          </linearGradient>
        </defs>
      </svg>
    ),
    task: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <rect x="3" y="4" width="18" height="18" rx="2" strokeOpacity="0.3"/>
        <path d="M16 2v4M8 2v4M3 10h18" strokeLinecap="round"/>
        <path d="M9 16l2 2 4-4" stroke="#00d2ff" strokeLinecap="round" strokeLinejoin="round"/>
      </svg>
    ),
    global: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <circle cx="12" cy="12" r="10" strokeOpacity="0.3"/>
        <path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" stroke="#9d50bb"/>
      </svg>
    ),
    secure: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#00d2ff"/>
        <circle cx="12" cy="12" r="3" strokeOpacity="0.5"/>
      </svg>
    )
  };

  return (
    <motion.div className={`feature-card ${size}`} whileHover={{ y: -10 }} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
      <div className="feature-icon-wrapper">{icons[iconType]}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <div className="feature-glow" />
    </motion.div>
  );
}

const landingCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap');
  .landing-root { background-color: #030303; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }
  .aura-container { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .aura-blob { position: absolute; width: 600px; height: 600px; border-radius: 50%; filter: blur(120px); opacity: 0.12; }
  .blue { background: #00d2ff; top: -100px; left: -100px; }
  .purple { background: #9d50bb; bottom: -100px; right: -100px; }
  .grid-overlay { position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 40px 40px; }
  
  .hero-section { position: relative; z-index: 1; min-height: 100vh; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 150px 20px 0; text-align: center; }
  .hero-badge { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 8px 16px; border-radius: 100px; font-size: 0.8rem; color: #00d2ff; }
  .hero-content h1 { font-size: clamp(3.5rem, 10vw, 7rem); font-weight: 800; margin: 20px 0; line-height: 1; background: linear-gradient(to bottom, #fff, #888); -webkit-background-clip: text; -webkit-text-fill-color: transparent; }
  .hero-content h1 span { color: #00d2ff; -webkit-text-fill-color: initial; }
  .hero-content p { max-width: 600px; margin: 0 auto 40px; color: #888; font-size: 1.2rem; }
  .hero-btns { display: flex; gap: 20px; justify-content: center; }
  .btn-primary { background: #fff; color: #000; border: none; padding: 16px 36px; border-radius: 14px; font-weight: 700; cursor: pointer; }
  .btn-secondary { background: rgba(255,255,255,0.05); color: #fff; border: 1px solid rgba(255,255,255,0.1); padding: 16px 36px; border-radius: 14px; }

  /* BOT ANIMATION */
  .ai-bot-entity { position: absolute; top: 15%; right: 10%; width: 60px; height: 60px; z-index: 100; }
  .bot-head { width: 100%; height: 100%; background: #00d2ff; border-radius: 20px; position: relative; box-shadow: 0 0 30px #00d2ff; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .bot-eye-left, .bot-eye-right { width: 8px; height: 8px; background: #000; border-radius: 50%; animation: blink 4s infinite; }
  @keyframes blink { 0%, 90%, 100% { transform: scaleY(1); } 95% { transform: scaleY(0.1); } }
  .bot-ring { position: absolute; top: 50%; left: 50%; width: 120%; height: 120%; border: 2px solid #00d2ff; border-radius: 50%; transform: translate(-50%, -50%); animation: rotateRing 10s linear infinite; opacity: 0.3; }
  @keyframes rotateRing { from { transform: translate(-50%, -50%) rotate(0deg); } to { transform: translate(-50%, -50%) rotate(360deg); } }
  .bot-bubble { position: absolute; background: #fff; color: #000; padding: 12px 20px; border-radius: 15px 15px 15px 0; width: 200px; font-weight: 700; font-size: 0.8rem; box-shadow: 0 10px 30px rgba(0,0,0,0.5); }

  /* MOCKUP UI */
  .dashboard-preview { margin-top: 80px; width: 100%; max-width: 1000px; perspective: 2000px; }
  .mockup-frame { background: #0a0a0a; border: 1px solid #222; border-radius: 24px 24px 0 0; overflow: visible; box-shadow: 0 50px 100px rgba(0,0,0,0.8); transform: rotateX(20deg) rotateY(-5deg); position: relative; }
  .mockup-header { background: #111; padding: 15px 25px; display: flex; align-items: center; gap: 30px; border-bottom: 1px solid #222; }
  .mockup-body { height: 450px; display: flex; }
  .mockup-sidebar { width: 80px; background: #0d0d0d; border-right: 1px solid #222; padding: 20px; display: flex; flex-direction: column; gap: 15px; }
  .side-line { height: 6px; background: #1a1a1a; border-radius: 4px; }
  .mockup-main { flex: 1; padding: 40px; }

  /* INTERNAL UI */
  .meeting-ui { height: 100%; background: #000; border-radius: 20px; border: 1px solid #1a1a1a; padding: 25px; display: flex; flex-direction: column; gap: 20px; }
  .meeting-header { display: flex; justify-content: space-between; align-items: center; font-size: 0.8rem; color: #555; }
  .avatar-group { display: flex; }
  .avatar-small { width: 24px; height: 24px; border-radius: 50%; border: 2px solid #000; }
  .avatar-small.blue { background: #00d2ff; }
  .avatar-small.purple { background: #9d50bb; }
  .avatar-small.green { background: #00ff88; }
  .transcript-area { flex: 1; display: flex; flex-direction: column; gap: 15px; }
  .transcript-row { display: flex; align-items: center; gap: 12px; }
  .transcript-row.reverse { justify-content: flex-end; }
  .t-avatar { width: 30px; height: 30px; background: #1a1a1a; border-radius: 8px; }
  .t-skeleton { height: 12px; background: #1a1a1a; border-radius: 6px; width: 60%; }
  .t-skeleton-short { height: 12px; background: #1a1a1a; border-radius: 6px; width: 40%; }
  .ai-insight-panel { background: rgba(0, 210, 255, 0.05); border: 1px solid rgba(0, 210, 255, 0.1); padding: 20px; border-radius: 15px; }
  .insight-header { font-size: 0.7rem; font-weight: 800; color: #00d2ff; margin-bottom: 10px; }
  .insight-text { height: 8px; background: #00d2ff; border-radius: 4px; margin-bottom: 8px; opacity: 0.3; }

  /* BENTO FEATURES */
  .info-section { padding: 150px 5%; max-width: 1200px; margin: 0 auto; }
  .section-label { color: #00d2ff; text-transform: uppercase; letter-spacing: 3px; font-size: 0.8rem; margin-bottom: 20px; }
  .section-title { font-size: 3rem; font-weight: 800; margin-bottom: 60px; }
  .bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 250px; gap: 24px; }
  .feature-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.08); border-radius: 30px; padding: 40px; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; backdrop-filter: blur(10px); }
  .large { grid-row: span 2; }
  .wide { grid-column: span 2; }
  
  .feature-icon-wrapper { width: 50px; height: 50px; margin-bottom: 20px; background: rgba(255, 255, 255, 0.03); padding: 10px; border-radius: 12px; border: 1px solid rgba(255, 255, 255, 0.08); display: flex; align-items: center; justify-content: center; transition: 0.3s; }
  .feature-card:hover .feature-icon-wrapper { border-color: #00d2ff; box-shadow: 0 0 15px rgba(0, 210, 255, 0.2); transform: rotate(-5deg); }
  .feature-icon-wrapper svg { width: 100%; height: 100%; }
  .feature-card h3 { font-size: 1.4rem; font-weight: 700; margin-bottom: 12px; }
  .feature-card p { color: #666; line-height: 1.5; }
  .feature-glow { position: absolute; inset: 0; background: radial-gradient(circle at top right, rgba(0,210,255,0.05), transparent); opacity: 0; transition: 0.5s; }
  .feature-card:hover .feature-glow { opacity: 1; }
`;