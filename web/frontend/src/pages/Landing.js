import React, { useRef, useState, useEffect } from "react";
import { motion, useScroll, useTransform, useSpring, AnimatePresence } from "framer-motion";
import HeroShaderBackground from "./HeroShaderBackground";

export default function MeetWiseUltimate() {
  const containerRef = useRef(null);
  const { scrollYProgress } = useScroll();
  
  // Parallax and Scroll effects
  const y1 = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const y2 = useTransform(scrollYProgress, [0, 1], [0, -500]);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0]);
  
  // Dynamic Blur effect for Drifters based on scroll
  const drifterBlur = useTransform(scrollYProgress, [0.2, 0.5], ["blur(0px)", "blur(12px)"]);
  const drifterOpacity = useTransform(scrollYProgress, [0.2, 0.5], [0.35, 0.05]);

  const componentScale = useSpring(useTransform(scrollYProgress, [0, 0.4], [0.9, 1]), {
    stiffness: 100,
    damping: 30
  });

  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);
  
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleMouseMove = (e) => {
    if (!containerRef.current || isMobile) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&family=JetBrains+Mono&display=swap');
        <GlobalNeuralGrid />
        * {
          box-sizing: border-box;
          margin: 0;
          padding: 0;
          -webkit-tap-highlight-color: transparent;
        }

        body {
          overflow-x: hidden;
          background: #020202;
        }

        .landing-root { 
          background: #020202; 
          color: #fff; 
          font-family: 'Plus Jakarta Sans', sans-serif; 
          overflow-x: hidden; 
          min-height: 100vh;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
        }
        
        html { 
          scroll-behavior: smooth; 
        }
        
        /* Optimize rendering for animations */
        .aura-container, .mw-drifter, .feature-card, .pipeline-track, .pipeline-zone-box {
          transform: translateZ(0);
          backface-visibility: hidden;
          perspective: 1000px;
          will-change: transform, opacity, filter;
        }
        
        .aura-container { 
          position: fixed; 
          inset: 0; 
          z-index: 0; 
          pointer-events: none; 
          overflow: hidden; 
        }
        
        .aura-blob { 
          position: absolute; 
          width: 600px; 
          height: 600px; 
          border-radius: 50%; 
          filter: blur(150px); 
          opacity: 0.15; 
          will-change: transform;
        }
        
        .blue { background: #00d2ff; top: -100px; left: -100px; }
        .purple { background: #9d50bb; bottom: -100px; right: -100px; }
        
        .grid-overlay { 
          position: absolute; 
          inset: 0; 
          background-image: radial-gradient(rgba(255,255,255,0.05) 1px, transparent 1px); 
          background-size: 30px 30px; 
        }
        
        .noise-overlay { 
          position: absolute; 
          inset: 0; 
          background: url('https://grainy-gradients.vercel.app/noise.svg'); 
          opacity: 0.03; 
          mix-blend-mode: overlay; 
        }

        .mw-drifter { 
          position: fixed; 
          z-index: 1; 
          padding: 10px 20px; 
          border-radius: 12px; 
          border: 1px solid rgba(255, 255, 255, 0.12); 
          background: rgba(255, 255, 255, 0.05); 
          color: rgba(255, 255, 255, 0.35); 
          font-weight: 800; 
          font-size: 0.75rem; 
          text-transform: uppercase; 
          letter-spacing: 2px; 
          backdrop-filter: blur(4px); 
          pointer-events: none;
          will-change: transform, opacity, filter;
        }
        
        .d1 { top: 15%; right: 10%; animation: float 8s ease-in-out infinite alternate; }
        .d2 { bottom: 25%; left: 10%; animation: float 10s ease-in-out infinite alternate-reverse; }
        .d3 { top: 45%; left: 5%; animation: float 12s ease-in-out infinite alternate; }
        
        @keyframes float { 
          0% { transform: translateY(0) translateZ(0); } 
          100% { transform: translateY(20px) translateZ(0); } 
        }

        /* HERO SECTION - FIXED SPACING */
        .hero-section { 
          position: relative; 
          z-index: 10; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center; 
          padding: 40px 20px 40px; 
          text-align: center;
          min-height: 100vh;
          margin-bottom: 0; /* Remove margin to create proper spacing */
        }
        .hero-h1 span { 
        color: #00d2ff; 
        text-shadow: 0 0 30px rgba(0,210,255,0.8); /* Increased glow */
        }  
        
        @media (max-width: 768px) {
          .hero-section {
            padding: 100px 16px 40px;
            min-height: 100vh; /* Keep full height on mobile */
          }
        }
        
        .hero-badge { 
          background: rgba(0,210,255,0.1); 
          border: 1px solid rgba(0,210,255,0.2); 
          padding: 8px 18px; 
          border-radius: 100px; 
          color: #00d2ff; 
          font-size: 0.8rem; 
          font-weight: 700; 
          display: inline-block;
          margin-bottom: 30px; /* Added spacing */
        }
        
        .hero-h1 { 
          font-size: clamp(4rem, 10vw, 6rem); 
          font-weight: 800; 
          line-height: 1.1; 
          margin: 4px 0; /* Adjusted spacing */
          letter-spacing: -1.5px; 
          will-change: transform;
        }
        
        .hero-h1 span { 
          color: #00d2ff; 
          text-shadow: 0 0 20px rgba(0,210,255,0.5); 
        }
        
        .hero-content p { 
          color: #aaa; 
          max-width: 550px; 
          font-size: 1.1rem; 
          margin-bottom: 40px; 
          line-height: 1.6;
          margin-top: 20px; /* Added spacing */
        }
        
        .hero-btns { 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          gap: 20px;
          flex-wrap: wrap;
          margin-top: 40px; /* Increased spacing */
        }
          
        
        .btn-primary, .btn-secondary {
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          transform: translateZ(0);
          will-change: transform, box-shadow;
          min-width: 160px;
          font-size: 0.95rem;
        }
        
        .btn-primary { 
          background: #fff; 
          color: #000; 
          padding: 14px 32px; 
          border-radius: 12px; 
          font-weight: 700; 
          border: none; 
          cursor: pointer; 
          position: relative;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 210, 255, 0.2);
        }
        
        .btn-primary:hover { 
          transform: translateY(-3px);
          box-shadow: 0 8px 30px rgba(255, 255, 255, 0.3);
        }
        
        .btn-secondary { 
          background: rgba(255,255,255,0.05); 
          border: 1px solid rgba(255,255,255,0.15); 
          padding: 14px 32px; 
          border-radius: 12px; 
          color: #fff; 
          cursor: pointer; 
          font-weight: 600;
        }
        
        .btn-secondary:hover {
          background: rgba(255,255,255,0.1);
          border-color: rgba(255,255,255,0.25);
          transform: translateY(-3px);
        }

        /* PIPELINE SECTION - Added spacing to separate from hero */
        .pipeline-section {
          position: relative;
          padding-top: 100px; /* Added spacing between hero and workflow */
          margin-top: 100px; /* Additional spacing */
        }
        
        .pipeline-title-section { 
          position: relative; 
          z-index: 10; 
          padding: 80px 20px 30px; /* Increased top padding */
          margin: 0 auto; 
          text-align: center; 
          max-width: 1200px;
        }
        
        .pipeline-subtitle { 
          color: #aaa; 
          font-size: 1rem; 
          max-width: 600px; 
          margin: 15px auto 0; 
          line-height: 1.6;
        }

        /* PIPELINE COMPONENT */
        .pipeline-visual-container { 
          width: 100%; 
          max-width: 1200px; 
          margin: 40px auto 60px; 
          padding: 20px; 
          z-index: 10; 
          position: relative; 
        }
        
        .pipeline-track { 
          position: relative; 
          height: auto;
          min-height: 450px;
          background: rgba(255,255,255,0.02); 
          border: 1px solid rgba(255, 255, 255, 0.05); 
          border-radius: 30px; 
          display: flex; 
          align-items: center; 
          justify-content: space-around; 
          padding: 40px 20px;
          backdrop-filter: blur(20px); 
          overflow: visible;
          will-change: transform;
          transition: transform 0.3s ease-out;
          gap: 40px;
        }
        
        .track-spotlight { 
          position: absolute; 
          inset: 0; 
          pointer-events: none; 
          background: radial-gradient(600px circle at var(--x) var(--y), rgba(0,210,255,0.07), transparent 40%); 
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .pipeline-track:hover .track-spotlight {
          opacity: 1;
        }
        
        .pipeline-zone-box { 
        flex:1;
          width: 100%;
          max-width: 300px; 
          min-height: 350px;
          background: rgba(255,255,255,0.02); 
          border: 1px solid rgba(255,255,255,0.05); 
          border-radius: 24px; 
          padding: 25px; 
          display: flex; 
          flex-direction: column; 
          z-index: 1;
          transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, box-shadow;
        }
        
        .pipeline-zone-box:hover {
          transform: translateY(-5px);
          box-shadow: 0 15px 40px rgba(0, 210, 255, 0.15);
          border-color: rgba(0, 210, 255, 0.3);
        }
        
        .zone-header { 
          font-size: 0.7rem; 
          font-weight: 800; 
          color: #888; 
          text-transform: uppercase; 
          letter-spacing: 2px; 
          margin-bottom: 30px; 
        }
        
        .zone-inner {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 15px;
        }
        
        .multilingual-glitch-box { 
          display: flex; 
          gap: 20px; 
          font-size: 1.1rem; 
          font-weight: 700; 
          color: #666; 
          justify-content: center; 
          flex-wrap: wrap;
          margin-bottom: 20px;
        }
        
        .mini-wave-container { 
          display: flex; 
          gap: 4px; 
          align-items: center; 
          justify-content: center; 
          margin-top: auto;
          height: 40px;
        }
        
        .wave-bar { 
          width: 4px; 
          background: #00d2ff; 
          border-radius: 10px; 
          will-change: height;
        }
        
        /* CORE ANIMATIONS - FIXED: REMOVED PULSE RING & BETTER ALIGNMENT */
        .pipeline-core-container { 
          position: relative; 
          display: flex; 
          flex-direction: column; 
          align-items: center; 
          justify-content: center;
          gap: 15px; 
          z-index: 1;
          padding: 0 20px;
        }
        
        /* Removed core-pulse-ring class completely */
        
        .core-outer-ring { 
          width: 120px; 
          height: 120px; 
          border: 2px solid rgba(0,210,255,0.2); 
          border-radius: 50%; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          position: relative; 
          background: rgba(0,0,0,0.5); 
          z-index: 2;
          box-shadow: 0 0 30px rgba(0, 210, 255, 0.15),
                     inset 0 0 20px rgba(0, 210, 255, 0.1);
        }
        
        .core-inner-hub { 
          position: absolute; 
          inset: 10px; 
          border: 2px dashed rgba(0,210,255,0.3); 
          border-radius: 50%; 
          will-change: transform;
        }
        
        .hub-icon-svg { 
          width: 40px; 
          height: 40px; 
          filter: drop-shadow(0 0 15px #00d2ff); 
          will-change: transform;
          z-index: 3;
          position: relative;
        }
        
        .hub-label { 
          font-size: 0.75rem; 
          font-weight: 800; 
          color: #00d2ff; 
          letter-spacing: 3px;
          text-align: center;
          margin-top: 15px;
          text-shadow: 0 0 10px rgba(0, 210, 255, 0.5);
        }

        /* OUTPUT STACK */
        .output-stack {
          display: flex;
          flex-direction: column;
          gap: 18px;
          overflow: visible;
          min-height: 180px;
          flex:1;
        }
        
        .pill-insight { 
          background: rgba(255,255,255,0.03); 
          border: 1px solid rgba(255,255,255,0.08); 
          padding: 10px 14px; 
          border-radius: 12px; 
          display: flex; 
          align-items: center; 
          gap: 12px; 
          font-size: 0.8rem; 
          font-weight: 600; 
          color: #ccc; 
          transition: all 0.3s ease;
          will-change: transform, opacity;
          min-height: 50px;
          width: 100%;
          white-space: nowrap; 
          overflow: hidden;
          text-overflow: ellipsis;
          box-sizing: border-box;
        }
        
        .pill-insight:hover {
          transform: translateX(5px);
          border-color: rgba(0, 210, 255, 0.3);
          background: rgba(0, 210, 255, 0.05);
        }
        
        .p-dot { 
          width: 8px; 
          height: 8px; 
          border-radius: 50%; 
          flex-shrink: 0;
          transition: transform 0.3s ease;
        }
        
        .pill-insight:hover .p-dot {
          transform: scale(1.3);
        }
        
        .p-dot.blue { background: #00d2ff; } 
        .p-dot.green { background: #00ff88; } 
        .p-dot.red { background: #ff4d4d; } 
        .p-dot.yellow { background: #ffd700; }
        
        .pipeline-connector { 
          display: none;
        }

        /* BENTO CENTERED HEADER */
        .info-section { 
          position: relative; 
          z-index: 10; 
          padding: 120px 20px 80px; /* Increased top padding */
          max-width: 1200px; 
          margin: 0 auto; 
          text-align: center; 
        }
        
        .features-center-header { 
          margin-bottom: 60px; 
          position: relative; 
          display: inline-block; 
        }
        
        .section-label { 
          color: #00d2ff; 
          letter-spacing: 3px; 
          font-size: 0.75rem; 
          text-transform: uppercase; 
          font-weight: 800; 
          margin-bottom: 12px; 
          display: block; 
        }
        
        .section-title { 
          font-size: clamp(2.5rem, 6vw, 4rem); 
          font-weight: 800; 
          letter-spacing: -0.03em; 
          margin: 0; 
          will-change: transform;
          line-height: 1.2;
        }
        
        .section-title span { color: #00d2ff; }
        
        .header-glow-line { 
          width: 80px; 
          height: 3px; 
          background: #00d2ff; 
          margin: 20px auto 0; 
          border-radius: 20px; 
          box-shadow: 0 0 20px #00d2ff; 
          transition: width 0.3s ease;
        }
        
        .features-center-header:hover .header-glow-line {
          width: 120px;
        }

        .bento-grid { 
          display: grid; 
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); 
          gap: 24px; 
          margin-top: 40px; 
        }
        
        .feature-card { 
          background: rgba(255,255,255,0.02); 
          border: 1px solid rgba(255,255,255,0.06); 
          border-radius: 25px; 
          padding: 30px; 
          position: relative; 
          overflow: hidden; 
          display: flex; 
          flex-direction: column; 
          justify-content: flex-start; 
          text-align: left; 
          transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
          will-change: transform, box-shadow, border-color;
          min-height: 260px;
        }
        
        .feature-card:hover {
          transform: translateY(-8px);
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
          border-color: rgba(0, 210, 255, 0.2);
        }
        
        .card-hover-highlight { 
          position: absolute; 
          inset: 0; 
          pointer-events: none; 
          z-index: 0; 
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .feature-card:hover .card-hover-highlight {
          opacity: 1;
        }
        
        .large { 
          grid-row: span 2;
          min-height: 560px;
          justify-content: space-between;
        } 
        
        .wide { 
          grid-column: span 2;
        }
        
        /* FIXED: Feature card content spacing */
        .feature-icon-wrapper { 
          width: 48px; 
          height: 48px; 
          margin-bottom: 20px; 
          background: rgba(255, 255, 255, 0.05); 
          border-radius: 12px; 
          display: flex; 
          align-items: center; 
          justify-content: center; 
          border: 1px solid rgba(255,255,255,0.1); 
          position: relative; 
          z-index: 1; 
          transition: all 0.3s ease;
        }
        
        .feature-card:hover .feature-icon-wrapper {
          transform: scale(1.1);
          border-color: rgba(0, 210, 255, 0.3);
          background: rgba(0, 210, 255, 0.1);
        }
        
        .feature-card h3 { 
          font-size: 1.4rem; 
          font-weight: 700; 
          margin-bottom: 15px; 
          position: relative; 
          z-index: 1; 
          transition: color 0.3s ease;
          line-height: 1.3;
        }
        
        .feature-card:hover h3 {
          color: #00d2ff;
        }
        
        .feature-card p { 
          color: #aaa; 
          line-height: 1.6; 
          font-size: 0.95rem; 
          position: relative; 
          z-index: 1; 
          transition: color 0.3s ease;
          margin-top: 0;
        }
        
        /* FIXED: Large card specific spacing */
        .feature-card.large h3 {
          margin-bottom: 20px;
          font-size: 1.6rem;
        }
        
        .feature-card.large p {
          font-size: 1rem;
          line-height: 1.7;
          margin-bottom: 20px;
        }
        
        .feature-card.large .feature-icon-wrapper {
          margin-bottom: 30px;
          width: 56px;
          height: 56px;
        }
        
        .feature-card.large .animated-svg {
          width: 28px;
          height: 28px;
        }
        
        .animated-svg { 
          width: 24px; 
          height: 24px; 
          will-change: transform, stroke-dashoffset;
        }

        /* Mobile Responsive Styles */
        @media (max-width: 1024px) {
          .pipeline-track {
            gap: 30px;
            padding: 30px;
          }
         .pipeline-zone-box { 
  width: 100%;
  /* Increased from 280px to 300px to give the text more breathing room */
  max-width: 300px; 
  /* Changed from a fixed min-height to auto so it grows with the pills */
  min-height: auto; 
  background: rgba(255,255,255,0.02); 
  border: 1px solid rgba(255,255,255,0.05); 
  border-radius: 24px; 
  padding: 24px; 
  display: flex; 
  flex-direction: column; 
  justify-content: flex-start;
  z-index: 1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  /* This prevents any child from visually leaking */
  overflow: hidden; 
}
          .wide {
            grid-column: span 1;
          }
          
          .feature-card.large .feature-icon-wrapper {
            width: 52px;
            height: 52px;
          }
          
          .feature-card.large .animated-svg {
            width: 26px;
            height: 26px;
          }
        }
        
        @media (max-width: 768px) {
          .mw-drifter {
            display: none;
          }
          
          .hero-h1 {
            font-size: 2.8rem;
            margin: 20px 0 15px;
          }
          
          .hero-content p {
            font-size: 1rem;
            padding: 0 10px;
          }
          
          .hero-btns {
            flex-direction: column;
            gap: 15px;
            width: 100%;
            max-width: 300px;
          }
          
          .btn-primary, .btn-secondary {
            width: 100%;
            padding: 16px 24px;
            font-size: 0.95rem;
          }
          /* Ensure the root doesn't block the background */
/* Update these specific sections in your <style> tag */

body {
  overflow-x: hidden;
  /* Move the gradient here so it's the absolute bottom layer */
  background: radial-gradient(circle at 50% 50%, #030d12 0%, #020202 100%);
}

.landing-root { 
  /* Crucial: Must be transparent to see the shader and body gradient */
  background: transparent !important; 
  color: #fff; 
  font-family: 'Plus Jakarta Sans', sans-serif; 
  position: relative;
  z-index: 1;
}

.aura-container { 
  position: fixed; 
  inset: 0; 
  /* z-index must be higher than the shader (-2) but lower than content (10) */
  z-index: 0; 
  pointer-events: none; 
}

.mw-drifter { 
  position: fixed; 
  /* This ensures they stay on top of the shader but behind the text */
  z-index: 5; 
  padding: 10px 20px; 
  /* ... rest of your drifter styles ... */
}

/* Ensure sections don't have their own backgrounds */
.hero-section, .pipeline-section, .info-section {
  background: transparent !important;
}
          
          .pipeline-track {
            flex-direction: column;
            gap: 40px;
            padding: 30px 20px;
            border-radius: 25px;
            min-height: auto;
          }
          
          .pipeline-zone-box {
            max-width: 100%;
            width: 100%;
            min-height: 250px;
          }
          
          .pipeline-core-container {
            margin: 20px 0;
            order: 1;
            padding: 20px;
          }
          
          .core-outer-ring {
            width: 100px;
            height: 100px;
          }
          
          .hub-icon-svg {
            width: 32px;
            height: 32px;
          }
          
          .bento-grid {
            grid-template-columns: 1fr;
            gap: 20px;
            padding: 0 10px;
          }
          
          .wide, .large {
            grid-column: span 1;
            grid-row: span 1;
            min-height: 280px;
            justify-content: flex-start;
          }
          
          .feature-card {
            min-height: 240px;
            padding: 25px;
          }
          
          .feature-card.large {
            min-height: 280px;
          }
          
          .feature-card.large h3 {
            font-size: 1.4rem;
            margin-bottom: 15px;
          }
          
          .feature-card.large p {
            font-size: 0.95rem;
          }
          
          .feature-card.large .feature-icon-wrapper {
            width: 48px;
            height: 48px;
            margin-bottom: 20px;
          }
          
          .section-title {
            font-size: 2.2rem;
            padding: 0 20px;
          }
          
          .pipeline-subtitle {
            padding: 0 20px;
            font-size: 0.95rem;
          }
          
          .aura-blob {
            width: 400px;
            height: 400px;
          }
          
          .output-stack {
  display: flex;
  flex-direction: column;
  /* Tightened the gap slightly to ensure they all fit vertically */
  gap: 10px; 
  width: 100%;
  height: 100%;
  /* Ensures pills are centered within the box padding */
  justify-content: center;
  align-items: stretch;
}

.pill-insight { 
  background: rgba(255,255,255,0.03); 
  border: 1px solid rgba(255,255,255,0.08); 
  padding: 10px 14px; 
  border-radius: 12px; 
  display: flex; 
  align-items: center; 
  gap: 12px; 
  font-size: 0.8rem; 
  font-weight: 600; 
  color: #ccc; 
  /* CRITICAL: This ensures the pill never exceeds its parent width */
  width: 100%;
  box-sizing: border-box;
}
          
          .zone-header {
            margin-bottom: 20px;
          }
          
          /* Mobile spacing adjustments */
          .pipeline-section {
            padding-top: 60px;
            margin-top: 60px;
          }
          
          .pipeline-title-section {
            padding: 40px 20px 20px;
          }
          
          .hero-section {
            margin-bottom: 0;
          }
          
          .info-section {
            padding: 80px 20px 60px;
          }
        }
        
        @media (max-width: 480px) {
          .hero-h1 {
            font-size: 2.2rem;
          }
          
          .hero-section {
            padding: 80px 16px 30px;
          }
          
          .pipeline-title-section {
            padding: 30px 16px 15px;
          }
          
          .pipeline-subtitle {
            font-size: 0.9rem;
          }
          
          .info-section {
            padding: 60px 16px 40px;
          }
          
          .feature-card {
            padding: 20px;
            min-height: 220px;
          }
          
          .feature-card h3 {
            font-size: 1.2rem;
          }
          
          .feature-card.large h3 {
            font-size: 1.3rem;
          }
          
          .feature-icon-wrapper {
            width: 42px;
            height: 42px;
            margin-bottom: 15px;
          }
          
          .feature-card.large .feature-icon-wrapper {
            width: 44px;
            height: 44px;
          }
          
          .animated-svg {
            width: 20px;
            height: 20px;
          }
          
          .feature-card.large .animated-svg {
            width: 22px;
            height: 22px;
          }
          
          .btn-primary, .btn-secondary {
            padding: 14px 20px;
            font-size: 0.9rem;
          }
          
          .pill-insight {
            padding: 10px 12px;
            font-size: 0.75rem;
            min-height: 45px;
          }
          
          .p-dot {
            width: 6px;
            height: 6px;
          }
          
          .section-title {
            font-size: 1.8rem;
          }
          
          .core-outer-ring {
            width: 80px;
            height: 80px;
          }
          
          .hub-icon-svg {
            width: 28px;
            height: 28px;
          }
        }
        
        /* Performance optimizations */
        button, input, textarea {
          font-family: 'Plus Jakarta Sans', sans-serif;
        }
        
        /* Smooth scrolling */
        html {
          scroll-behavior: smooth;
        }
        
        /* Fix for mobile hover */
        @media (hover: none) {
          .feature-card:hover,
          .pipeline-zone-box:hover,
          .pill-insight:hover {
            transform: none;
          }
          
          .feature-card:hover .feature-icon-wrapper {
            transform: none;
          }
          
          .pill-insight:hover .p-dot {
            transform: none;
          }
        }
      `}</style>

      <div className="landing-root" ref={containerRef} onMouseMove={handleMouseMove}>
        {/* --- ADVANCED ATMOSPHERE SYSTEM --- */}
        <div className="aura-container">
          <motion.div style={{ y: y1 }} className="aura-blob blue" />
          <motion.div style={{ y: y2 }} className="aura-blob purple" />
          
          {/* Scroll-Reactive Drifters */}
          <motion.div style={{ filter: drifterBlur, opacity: drifterOpacity }} className="mw-drifter d1">Summary AI</motion.div>
          <motion.div style={{ filter: drifterBlur, opacity: drifterOpacity }} className="mw-drifter d2">English (US)</motion.div>
          <motion.div style={{ filter: drifterBlur, opacity: drifterOpacity }} className="mw-drifter d3">Action Item +</motion.div>
          
          <div className="grid-overlay" />
          <div className="noise-overlay" />
        </div>

        {/* HERO SECTION - Now properly spaced */}
        <section className="hero-section">
          <HeroShaderBackground />
          <motion.div 
            className="hero-content"
            style={{ opacity: heroOpacity }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.16, 1, 0.3, 1] }}
          >
            <motion.span className="hero-badge">✦ AI Meeting Assistant</motion.span>
            <motion.h1 className="hero-h1">MeetWise<span>.</span></motion.h1>
            <motion.p>
              AI-Powered Multilingual Meeting Intelligence 
            </motion.p>
            <div className="hero-btns">
              <motion.button 
                whileHover={{ scale: isMobile ? 1 : 1.05 }}
                whileTap={{ scale: 0.98 }}
                className="btn-primary" 
                onClick={() => window.location.href = "/dashboard"}
              >
                Get Started
              </motion.button>
              <motion.button 
                whileHover={{ backgroundColor: isMobile ? "rgba(255,255,255,0.05)" : "rgba(255,255,255,0.1)" }}
                whileTap={{ scale: 0.98 }}
                className="btn-secondary"
              >
                Watch Demo
              </motion.button>
            </div>
          </motion.div>
        </section>

        {/* --- PIPELINE SECTION - Now appears after scrolling --- */}
        <div className="pipeline-section">
          <div className="pipeline-title-section">
            <span className="section-label">Workflow</span>
            <h2 className="section-title">AI Processing Pipeline<span>.</span></h2>
            <p className="pipeline-subtitle">Real-time multilingual meeting intelligence workflow</p>
            <div className="header-glow-line" />
          </div>
          
          <motion.div className="pipeline-visual-container" style={{ scale: componentScale }}>
            <div className="pipeline-track" style={{ "--x": `${mousePos.x}px`, "--y": `${mousePos.y}px` }}>
              <div className="track-spotlight" />
              
              <div className="pipeline-zone-box">
                <div className="zone-header">Input Stream</div>
                <div className="zone-inner input-flex">
                  <div className="multilingual-glitch-box">
                    <motion.span animate={{ opacity: [0.2, 1, 0.2] }} transition={{ duration: 2, repeat: Infinity }}>नमस्ते</motion.span>
                    <motion.span animate={{ opacity: [1, 0.2, 1] }} transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}>Bonjour</motion.span>
                    <motion.span animate={{ opacity: [0.5, 1, 0.5] }} transition={{ duration: 2, repeat: Infinity, delay: 1 }}>你好</motion.span>
                  </div>
                  <div className="mini-wave-container">
                    {[...Array(8)].map((_, i) => (
                      <motion.div key={i} className="wave-bar" animate={{ height: [10, 30, 10] }} transition={{ repeat: Infinity, duration: 1, delay: i * 0.1 }} />
                    ))}
                  </div>
                </div>
              </div>

              <div className="pipeline-core-container">
                {/* Engine Visual Animations - FIXED: Removed pulse ring, better styling */}
                <div className="core-outer-ring">
                  <motion.div 
                    className="core-inner-hub" 
                    animate={{ rotate: 360 }} 
                    transition={{ duration: 15, repeat: Infinity, ease: "linear" }}
                  />
                  <motion.svg 
                    className="hub-icon-svg" 
                    viewBox="0 0 24 24" 
                    fill="none"
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
                  >
                    <motion.path d="M12 3L14.5 9.5L21 12L14.5 14.5L12 21L9.5 14.5L3 12L9.5 9.5L12 3Z" fill="#00d2ff" />
                  </motion.svg>
                </div>
                <div className="hub-label">ENGINE CORE</div>
              </div>

              <div className="pipeline-zone-box">
                <div className="zone-header">Intelligence</div>
                <div className="zone-inner output-stack">
                  <motion.div initial={{ x: 20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.2, type: "spring" }} className="pill-insight"><div className="p-dot red" /><span>Transcription</span></motion.div>
                  <motion.div initial={{ x: 20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.4, type: "spring" }} className="pill-insight"><div className="p-dot green" /><span>Summary</span></motion.div>
                  <motion.div initial={{ x: 20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.6, type: "spring" }} className="pill-insight"><div className="p-dot blue" /><span>Action Items</span></motion.div>
                  <motion.div initial={{ x: 20, opacity: 0 }} whileInView={{ x: 0, opacity: 1 }} transition={{ delay: 0.8, type: "spring" }} className="pill-insight"><div className="p-dot yellow" /><span>Email Notify</span></motion.div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* BENTO GRID */}
        <section className="info-section">
          <div className="features-center-header">
            <span className="section-label">Features</span>
            <h2 className="section-title">Everything you need to scale<span>.</span></h2>
            <div className="header-glow-line" />
          </div>
          
          <div className="bento-grid">
            <FeatureCard title="Multilingual Intelligence" desc="Automatically transcribe and translate meetings across multiple languages into clear English insights. Support for over 50 languages with real-time translation and cultural context preservation." iconType="neural" size="large" />
            <FeatureCard title="Action Item Extraction" desc="Identify responsibilities, deadlines, and next steps without manual effort. AI automatically detects action items and assigns them to participants." iconType="task" />
            <FeatureCard title="Enterprise-Ready Architecture" desc="Built using FastAPI, React, and modular AI pipelines for scalability. Supports thousands of concurrent meetings with enterprise-grade security." iconType="global" />
            <FeatureCard title="Intelligent Summarization" desc="Generate concise, meaningful summaries that preserve key decisions and discussions. Context-aware AI ensures nothing important is missed." iconType="secure" size="wide" />
          </div>
        </section>
      </div>
    </>
  );
}

function FeatureCard({ title, desc, iconType, size = "" }) {
  const cardRef = useRef(null);
  const [cardMousePos, setCardMousePos] = useState({ x: 0, y: 0 });
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  const handleCardMouseMove = (e) => {
    if (isMobile) return;
    const rect = cardRef.current.getBoundingClientRect();
    setCardMousePos({ x: e.clientX - rect.left, y: e.clientY - rect.top });
  };

  const icons = {
    neural: (
      <svg viewBox="0 0 24 24" fill="none" className="animated-svg">
        <motion.path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" stroke="#00d2ff" strokeWidth="1.5" initial={{ pathLength: 0 }} whileInView={{ pathLength: 1 }} transition={{ duration: 2 }} />
      </svg>
    ),
    task: (
      <svg viewBox="0 0 24 24" fill="none" className="animated-svg">
        <motion.rect x="3" y="3" width="18" height="18" rx="2" stroke="#9d50bb" strokeWidth="1.5" animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }} />
        <path d="M9 12l2 2 4-4" stroke="#fff" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ),
    global: (
      <svg viewBox="0 0 24 24" fill="none" className="animated-svg">
        <motion.circle cx="12" cy="12" r="10" stroke="#3a7bd5" strokeWidth="1.5" animate={{ rotate: 360 }} transition={{ duration: 12, repeat: Infinity, ease: "linear" }} />
      </svg>
    ),
    secure: (
      <svg viewBox="0 0 24 24" fill="none" className="animated-svg">
        <motion.path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" stroke="#00ff88" strokeWidth="1.5" animate={{ opacity: [0.6, 1, 0.6] }} transition={{ duration: 2, repeat: Infinity }} />
      </svg>
    )
  };

  return (
    <motion.div 
      ref={cardRef}
      onMouseMove={handleCardMouseMove}
      className={`feature-card ${size}`} 
      whileHover={{ y: isMobile ? 0 : -10 }}
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
    >
      <div className="card-hover-highlight" style={{ background: `radial-gradient(400px circle at ${cardMousePos.x}px ${cardMousePos.y}px, rgba(0, 210, 255, 0.08), transparent 40%)` }} />
      <div className="feature-icon-wrapper">{icons[iconType]}</div>
      <h3>{title}</h3>
      <p>{desc}</p>
    </motion.div>
  );
}