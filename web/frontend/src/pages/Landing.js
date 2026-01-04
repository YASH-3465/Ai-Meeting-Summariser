import React, { useRef } from "react";
import { motion, useScroll, useTransform, useSpring } from "framer-motion";

export default function Landing() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  // Parallax and Scroll effects from your original code
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  
  // High-end smooth scaling for the 3D mockup
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

      {/* HERO SECTION (Original Branding) */}
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

        {/* --- HANDSOME BLUE BOT & DETAILED WORKSPACE (New Component) --- */}
        <motion.div 
          className="dashboard-preview"
          style={{ scale: mockupScale }}
        >
          {/* THE HANDSOME BLUE BOT */}
          <div className="bot-anchor">
            <motion.div 
              className="handsome-bot"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <motion.div 
                className="bot-halo"
                animate={{ rotate: 360, opacity: [0.2, 0.5, 0.2] }}
                transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
              />
              
              <div className="bot-head-blue">
                <div className="glass-visor">
                  <div className="visor-glow" />
                  <div className="handsome-eyes">
                    <motion.div className="h-eye" animate={{ scaleX: [1, 1.2, 1] }} />
                    <motion.div className="h-eye" animate={{ scaleX: [1, 1.2, 1] }} />
                  </div>
                </div>
              </div>

              <motion.div className="floating-hand left" animate={{ y: [-5, 5, -5] }} transition={{ duration: 3, repeat: Infinity }}>🤟</motion.div>
              <motion.div className="floating-hand right" animate={{ y: [5, -5, 5] }} transition={{ duration: 3, repeat: Infinity }}>✨</motion.div>

              <motion.div className="bot-status-bubble">"Ready to Analyze!" </motion.div>
            </motion.div>
          </div>

          {/* DETAILED SCREEN MOCKUP */}
          <div className="mockup-frame">
            <div className="mockup-header">
              <div className="window-controls"><span/><span/><span/></div>
              <div className="address-bar">meetwise_v4.2.ai</div>
            </div>
            
            <div className="mockup-body">
              <div className="mockup-sidebar">
                <div className="side-icon-active" />
                <div className="side-icon" /><div className="side-icon" />
                <div className="side-spacer" />
                <div className="side-profile" />
              </div>

              <div className="mockup-main">
                <div className="main-top-bar">
                  <div className="breadcrumb">Workspace / Project MeetWise / <span>Sync.mp4</span></div>
                  <div className="user-stack">
                    <div className="u-circle" style={{ background: "#00d2ff" }}>Y</div>
                    <div className="u-circle" style={{ background: "#9d50bb" }}>T</div>
                    <div className="u-circle" style={{ background: "#3a7bd5" }}>V</div>
                  </div>
                </div>

                <div className="workspace-grid">
                  <div className="feed-panel">
                    <div className="panel-head">Live Transcription</div>
                    <div className="feed-scroll">
                      <div className="feed-row">
                        <span className="timestamp">12:01</span>
                        <p><strong>Yashwanth:</strong> Core pipeline is ready for deployment.</p>
                      </div>
                      <div className="feed-row active">
                        <span className="timestamp">12:02</span>
                        <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ repeat: Infinity, duration: 2 }}>
                          <strong>Tanushree:</strong> Finalizing the API bridges...
                        </motion.p>
                      </div>
                    </div>
                  </div>

                  <div className="intel-panel">
                    <div className="panel-head">AI Intelligence</div>
                    <div className="summary-skeleton">
                      <div className="skel-title" />
                      <div className="skel-line" />
                      <div className="skel-line" />
                      <div className="skel-line short" />
                    </div>
                    <div className="action-tags">
                      <div className="tag">Action Item</div>
                      <div className="tag">Deadline</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* BENTO GRID (With New Animated SVG Icons) */}
      <section className="info-section">
        <div className="section-label">Features</div>
        <h2 className="section-title">Everything you need to scale.</h2>
        <div className="bento-grid">
          <FeatureCard title="Multilingual Intelligence" desc="Automatically transcribe and translate meetings across multiple languages into clear English insights." iconType="neural" size="large" />
          <FeatureCard title="Action Item Extraction" desc="Identify responsibilities, deadlines, and next steps without manual effort." iconType="task" />
          <FeatureCard title="Enterprise-Ready Architecture" desc="Built using FastAPI, React, and modular AI pipelines for scalability." iconType="global" />
          <FeatureCard title="Intelligent Summarization" desc="Generate concise, meaningful summaries that preserve key decisions and discussions." iconType="secure" size="wide" />
        </div>
      </section>
    </div>
  );
}

// New FeatureCard with Premium Animated Icons
function FeatureCard({ title, desc, iconType, size = "" }) {
  const icons = {
    neural: (
      <svg viewBox="0 0 24 24" fill="none" className="animated-svg">
        <motion.path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#00d2ff" strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2 }} />
      </svg>
    ),
    task: (
      <svg viewBox="0 0 24 24" fill="none" className="animated-svg">
        <motion.rect x="3" y="3" width="18" height="18" rx="2" stroke="#9d50bb" strokeWidth="1.5" whileInView={{ scale: [1, 1.1, 1] }} transition={{ repeat: Infinity, duration: 3 }} />
        <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    global: (
      <svg viewBox="0 0 24 24" fill="none" className="animated-svg">
        <motion.circle cx="12" cy="12" r="10" stroke="#3a7bd5" strokeWidth="1.5" animate={{ rotate: 360 }} transition={{ duration: 5, repeat: Infinity, ease: "linear" }} />
      </svg>
    ),
    secure: (
      <svg viewBox="0 0 24 24" fill="none" className="animated-svg">
        <motion.path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#00ff88" strokeWidth="1.5" animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity }} />
      </svg>
    )
  };

  return (
    <motion.div className={`feature-card ${size}`} whileHover={{ y: -15 }}>
      <div className="feature-icon-wrapper">{icons[iconType]}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
      <div className="card-shine" />
      <div className="feature-glow" />
    </motion.div>
  );
}

const landingCSS = `
  @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=JetBrains+Mono&display=swap');

  .landing-root { background: #020202; color: #fff; font-family: 'Plus Jakarta Sans', sans-serif; overflow-x: hidden; }
  .aura-container { position: fixed; inset: 0; z-index: 0; pointer-events: none; }
  .aura-blob { position: absolute; width: 600px; height: 600px; border-radius: 50%; filter: blur(150px); opacity: 0.15; }
  .blue { background: #00d2ff; top: -100px; left: -100px; }
  .purple { background: #9d50bb; bottom: -100px; right: -100px; }
  .grid-overlay { position: absolute; inset: 0; background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); background-size: 30px 30px; }
  
  .hero-section { position: relative; z-index: 10; display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 180px 20px 0; text-align: center; }
  .hero-badge { background: rgba(0,210,255,0.1); border: 1px solid rgba(0,210,255,0.2); padding: 8px 18px; border-radius: 100px; color: #00d2ff; font-size: 0.8rem; font-weight: 700; }
  .hero-content h1 { font-size: clamp(3.5rem, 8vw, 6rem); font-weight: 800; line-height: 1; margin: 25px 0; letter-spacing: -2px; }
  .hero-content h1 span { color: #00d2ff; }
  .hero-content p { color: #888; max-width: 550px; font-size: 1.1rem; margin-bottom: 40px; }
  
  .btn-primary { background: #fff; color: #000; padding: 16px 36px; border-radius: 14px; font-weight: 800; border: none; cursor: pointer; transition: 0.3s; }
  .btn-primary:hover { box-shadow: 0 0 30px rgba(255,255,255,0.3); transform: translateY(-3px); }
  .btn-secondary { background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); padding: 16px 36px; border-radius: 14px; color: #fff; cursor: pointer; }

  /* HANDSOME BLUE BOT STYLES */
  .bot-anchor { position: absolute; top: 12%; right: 8%; z-index: 1000; }
  .handsome-bot { position: relative; width: 90px; height: 110px; display: flex; flex-direction: column; align-items: center; }
  .bot-halo { position: absolute; top: -10px; width: 110px; height: 40px; border: 2px solid #00d2ff; border-radius: 50%; box-shadow: 0 0 15px #00d2ff; }
  .bot-head-blue { width: 80px; height: 75px; background: linear-gradient(135deg, #007aff, #00d2ff); border-radius: 24px; display: flex; align-items: center; justify-content: center; box-shadow: 0 15px 35px rgba(0,122,255,0.4); border: 2px solid rgba(255,255,255,0.1); }
  .glass-visor { width: 80%; height: 50%; background: rgba(0,0,0,0.6); border-radius: 12px; position: relative; overflow: hidden; display: flex; align-items: center; justify-content: space-around; }
  .visor-glow { position: absolute; top: 0; left: -100%; width: 50%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.2), transparent); animation: sweep 3s infinite; }
  @keyframes sweep { 100% { left: 200%; } }
  .handsome-eyes { display: flex; gap: 10px; }
  .h-eye { width: 8px; height: 4px; background: #00ffcc; border-radius: 10px; box-shadow: 0 0 8px #00ffcc; }
  .floating-hand { position: absolute; font-size: 1.2rem; top: 60px; }
  .floating-hand.left { left: -30px; }
  .floating-hand.right { right: -30px; }
  .bot-status-bubble { position: absolute; top: -60px; left: 70px; background: #fff; color: #000; padding: 10px 15px; border-radius: 18px 18px 18px 0; font-weight: 800; font-size: 0.7rem; white-space: nowrap; box-shadow: 0 10px 20px rgba(0,0,0,0.3); }

  /* MOCKUP UI STYLES */
  .dashboard-preview { margin-top: 100px; width: 100%; max-width: 1050px; perspective: 2000px; position: relative; }
  .mockup-frame { background: #080808; border: 1px solid #1a1a1a; border-radius: 24px 24px 0 0; box-shadow: 0 50px 100px rgba(0,0,0,0.9); transform: rotateX(10deg); overflow: hidden; text-align: left; }
  .mockup-header { background: #111; padding: 12px 25px; display: flex; align-items: center; gap: 20px; border-bottom: 1px solid #1a1a1a; }
  .window-controls { display: flex; gap: 8px; }
  .window-controls span { width: 10px; height: 10px; border-radius: 50%; background: #333; }
  .address-bar { background: #050505; border: 1px solid #1a1a1a; border-radius: 8px; padding: 4px 15px; color: #444; font-size: 0.7rem; flex: 1; font-family: 'JetBrains Mono'; }
  .mockup-body { display: flex; height: 500px; }
  .mockup-sidebar { width: 60px; background: #0a0a0a; border-right: 1px solid #1a1a1a; display: flex; flex-direction: column; align-items: center; padding: 20px 0; gap: 20px; }
  .side-icon-active { width: 24px; height: 24px; background: #00d2ff; border-radius: 6px; box-shadow: 0 0 10px #00d2ff; }
  .side-icon { width: 24px; height: 24px; background: #1a1a1a; border-radius: 6px; }
  .side-spacer { flex: 1; }
  .side-profile { width: 28px; height: 28px; background: #333; border-radius: 50%; }
  .mockup-main { flex: 1; padding: 30px; display: flex; flex-direction: column; gap: 25px; }
  .main-top-bar { display: flex; justify-content: space-between; align-items: center; }
  .breadcrumb { font-size: 0.75rem; color: #444; }
  .user-stack { display: flex; }
  .u-circle { width: 24px; height: 24px; border-radius: 50%; border: 2px solid #080808; margin-left: -8px; font-size: 0.6rem; display: flex; align-items: center; justify-content: center; font-weight: 800; color: #000; }
  .workspace-grid { display: grid; grid-template-columns: 1.5fr 1fr; gap: 20px; flex: 1; }
  .panel-head { font-size: 0.65rem; color: #555; text-transform: uppercase; font-weight: 800; letter-spacing: 1px; margin-bottom: 15px; }
  .feed-panel { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 20px; padding: 20px; }
  .feed-row { font-size: 0.8rem; margin-bottom: 15px; display: flex; gap: 15px; color: #666; }
  .feed-row.active { color: #fff; background: rgba(0,210,255,0.05); padding: 10px; border-radius: 10px; }
  .timestamp { font-family: 'JetBrains Mono'; font-size: 0.7rem; color: #333; }
  .intel-panel { background: rgba(0,210,255,0.03); border: 1px solid rgba(0,210,255,0.1); border-radius: 20px; padding: 20px; }
  .skel-title { height: 12px; background: #1a1a1a; border-radius: 4px; width: 60%; margin-bottom: 15px; }
  .skel-line { height: 8px; background: #111; border-radius: 4px; width: 100%; margin-bottom: 8px; }
  .skel-line.short { width: 40%; }
  .action-tags { display: flex; gap: 10px; margin-top: 20px; }
  .tag { background: rgba(0,210,255,0.1); color: #00d2ff; padding: 4px 10px; border-radius: 6px; font-size: 0.6rem; font-weight: 800; }

  /* BENTO FEATURE CARD STYLES */
  .info-section { padding: 150px 5%; max-width: 1200px; margin: 0 auto; text-align: left; }
  .section-label { color: #00d2ff; letter-spacing: 3px; font-size: 0.8rem; text-transform: uppercase; margin-bottom: 20px; }
  .section-title { font-size: 3.5rem; font-weight: 800; margin-bottom: 60px; }
  .bento-grid { display: grid; grid-template-columns: repeat(3, 1fr); grid-auto-rows: 280px; gap: 24px; }
  .feature-card { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.06); border-radius: 35px; padding: 40px; position: relative; overflow: hidden; display: flex; flex-direction: column; justify-content: flex-end; backdrop-filter: blur(10px); }
  .large { grid-row: span 2; }
  .wide { grid-column: span 2; }
  .feature-icon-wrapper { width: 60px; height: 60px; margin-bottom: 20px; background: rgba(255, 255, 255, 0.05); border-radius: 16px; display: flex; align-items: center; justify-content: center; transition: 0.3s; border: 1px solid rgba(255,255,255,0.1); }
  .feature-card:hover .feature-icon-wrapper { border-color: #00d2ff; box-shadow: 0 0 15px rgba(0, 210, 255, 0.2); transform: rotate(-5deg); }
  .animated-svg { width: 35px; height: 35px; }
  .feature-card h3 { font-size: 1.4rem; font-weight: 700; margin-bottom: 12px; }
  .feature-card p { color: #666; line-height: 1.5; font-size: 0.95rem; }
  .feature-glow { position: absolute; inset: 0; background: radial-gradient(circle at top right, rgba(0,210,255,0.1), transparent); opacity: 0; transition: 0.5s; pointer-events: none; }
  .feature-card:hover .feature-glow { opacity: 1; }
  .card-shine { position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,0.05), transparent); transition: 0.5s; pointer-events: none; }
  .feature-card:hover .card-shine { left: 100%; }

  @media (max-width: 900px) {
    .bento-grid { grid-template-columns: 1fr; grid-auto-rows: auto; }
    .wide, .large { grid-column: span 1; grid-row: span 1; }
    .hero-content h1 { font-size: 3rem; }
  }
`;