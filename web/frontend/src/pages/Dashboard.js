
import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ToggleSwitch from "../components/ToggleSwitch";
import AIAssistant from "../components/AIAssistant";

export default function Dashboard() {
const navigate = useNavigate();
const [fileName, setFileName] = useState("");
const [stage, setStage] = useState("idle"); // idle | processing | done
const [result, setResult] = useState(null);
const [translate, setTranslate] = useState(false);
const [notify, setNotify] = useState(false);
const [isSpeaking, setIsSpeaking] = useState(false);
const speechRef = useRef(null);


const [isSelectingFile, setIsSelectingFile] = useState(false);

const speakSummary = () => {
  if (!result?.summary) return;

  window.speechSynthesis.cancel();

  const utterance = new SpeechSynthesisUtterance(result.summary);
  utterance.lang = "en-US";
  utterance.rate = 0.95;
  utterance.pitch = 1.05;
  utterance.volume = 1;

  utterance.onstart = () => setIsSpeaking(true);
  utterance.onend = () => setIsSpeaking(false);
  utterance.onerror = () => setIsSpeaking(false);

  speechRef.current = utterance;
  window.speechSynthesis.speak(utterance);
};

const stopSpeaking = () => {
  window.speechSynthesis.cancel();
  setIsSpeaking(false);
};




const fileInputRef = useRef(null);


// Add this ref near your other refs (e.g., under fileInputRef)
  const uploadLockRef = useRef(false);

  const triggerUpload = () => {
    // 1. PREVENT DOUBLE CLICKS: If the lock is already true, stop here.
    if (uploadLockRef.current) return;
    
    uploadLockRef.current = true; // Activate lock
    setIsSelectingFile(true);     // Trigger Bot Animation

    // 2. Wait 800ms for the bot to show the "I'm ready" message
    setTimeout(() => {
        if(fileInputRef.current) {
            // Reset the value so the same file can be selected again if needed
            fileInputRef.current.value = null; 
            fileInputRef.current.click();
        }
        
        // 3. Release the lock shortly after opening the window
        // This allows the user to click again if they cancel the dialog
        setTimeout(() => {
            uploadLockRef.current = false;
        }, 1000); 

    }, 800); 
  };

const handleFileSelect = (e) => {
  const selectedFile = e.target.files[0];
  if (!selectedFile) return;

  setFileName(selectedFile.name);
  setStage("processing"); 
  sendToBackend(selectedFile);
};


const sendToBackend = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  formData.append("translate", translate);
  formData.append("notify", notify);
  try {
    const response = await fetch("http://127.0.0.1:8000/api/process", {
  method: "POST",
  body: formData,
});



    if (!response.ok) {
      throw new Error("Backend error");
    }

   const data = await response.json();
setResult(data);
setStage("results");

  } catch (error) {
  console.error("UPLOAD ERROR:", error);
  alert("Failed to process meeting. Check console & backend logs.");
}



};

  return (
    <div className="dash-root">
      <style>{dashStyles}</style>
      
      {/* BACKGROUND ELEMENTS */}
      <div className="bg-grid-overlay" />
      <div className="ambient-glow" />

      <div className="dash-content-wrapper">
        
  
 {/* --- PLACE THE NEW BOT HERE --- */}
       <AIAssistant 
        stage={stage} 
        translate={translate} 
        notify={notify} 
        fileName={fileName}
        actionCount={result?.actions?.length || 0}
        isSpeaking={isSpeaking}
        isSelectingFile={isSelectingFile} // <--- ADD THIS PROP
      />
        {/* HEADER SECTION */}
        <header className="dash-header">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1>Upload Your<span> Meeting</span></h1>
            <p>Supported formats: MP3, WAV, MP4
</p>
          </motion.div>
          
          <div className="engine-status">
            <span className="status-dot" />
            AI Core: v4.2 Active
          </div>
        </header>

        {/* MAIN INTERACTIVE AREA */}
        <div className="main-grid">
          
          <AnimatePresence mode="wait">
            {stage === "idle" ? (
              <motion.div 
                key="idle"
                className="upload-main-card"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                onClick={triggerUpload}
                whileHover={{ borderColor: "rgba(0, 210, 255, 0.5)", y: -5 }}
              >
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileSelect} 
                  style={{ display: "none" }} 
                />
                <div className="upload-icon-container">
                  <div className="pulse-circle" />
                  <span className="icon">↑</span>
                </div>
                <h2>Start New Analysis</h2>
                <p>Click anywhere to upload audio or video</p>
                <div className="supported-formats">MP3 • WAV • MP4 • MOV</div>
      <div
  style={{
    marginTop: "30px",
    display: "flex",
    justifyContent: "center",
    gap: "30px"
  }}
  onClick={(e) => e.stopPropagation()}
>
  <ToggleSwitch
    label="Translate"
    checked={translate}
    onChange={setTranslate}
  />

  <ToggleSwitch
    label="Notify"
    checked={notify}
    onChange={setNotify}
  />
</div>


              </motion.div>
            ) : (
              <motion.div 
                key="active"
                className="active-analysis-container"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
              >
                {/* TOP FILE INFO */}
                <div className="file-strip">
                  <div className="file-meta">
                    <span className="tag">PROCESSING</span>
                    <h3>{fileName}</h3>
                  </div>
                  <div className="stage-indicator">
                    {stage === "processing" ? "Neural Mapping..." : "Analysis Ready"}
                  </div>
                </div>

                <div className="results-layout">
                  {/* LEFT: TRANSCRIPT */}
                  <div className="glass-panel transcript-box">
                    <div className="panel-label">Live Transcription</div>
                    <div className="scrolling-text">
  {stage === "processing" && (
    <>
      <p>Reading audio file…</p>
      <p>Transcribing speech…</p>
      <p>Analyzing language…</p>
      <p>Generating summary…</p>
      <div className="loader-dots"><span>.</span><span>.</span><span>.</span></div>
    </>
  )}

{stage === "results" && result && (
  <>
    <p className="highlight">{result.summary}</p>

    <div style={{ marginTop: "20px", display: "flex", gap: "15px" }}>
      {!isSpeaking ? (
        <button className="voice-btn" onClick={speakSummary}>
          🔊 Play AI Summary
        </button>
      ) : (
        <button className="voice-btn stop" onClick={stopSpeaking}>
          ⏹ Stop Voice
        </button>
      )}
    </div>
  </>
)}

</div>

                  </div>

                  {/* RIGHT: INSIGHTS */}
                  <div className="insights-stack">
                    <div className="glass-panel stat-card">
                      <div className="panel-label">Translation</div>
                      <div className="lang-pair">ES <span>→</span> EN</div>
                    </div>
                    
                   <div className="glass-panel actions-card">
  <div className="panel-label">Action Items</div>
  <div className="action-list">

    {stage === "processing" && <div className="skeleton-line" />}

    {stage === "results" && result && result.actions.length === 0 && (
      <p style={{ color: "#666" }}>No action items detected.</p>
    )}

    {stage === "results" && result && result.actions.map((a, i) => (
      <div className="action-row" key={i}>
        ✓ {a.action}
        {a.deadline && <span style={{ color: "#00d2ff" }}> — {a.deadline}</span>}
      </div>
    ))}

  </div>
</div>

                  </div>
                </div>
                
                {stage === "results" && (
                  <motion.button 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="reset-btn"
                    onClick={() => setStage("idle")}
                  >
                    Analyze Another Meeting
                  </motion.button>
                )}
              </motion.div>
            )}
          </AnimatePresence>

        </div>
      </div>
    </div>
    
  );
}

const dashStyles = `
  .dash-root {
    background: #050505;
    color: #fff;
    min-height: 100vh;
    padding-top: 100px; /* Space for Navbar */
    position: relative;
    font-family: 'Plus Jakarta Sans', sans-serif;
  }

  .bg-grid-overlay {
    position: fixed; inset: 0;
    background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), 
                      linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
    background-size: 45px 45px;
  }

  .voice-btn {
  background: linear-gradient(135deg, #00d2ff, #007aff);
  border: none;
  color: #000;
  padding: 12px 22px;
  border-radius: 30px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.3s ease;
}

/* CONTAINER */
  .nano-bot-wrapper {
    position: fixed;
    bottom: 50px;
    right: 50px;
    z-index: 9999;
    display: flex;
    flex-direction: column;
    align-items: center;
    pointer-events: none; /* Wrapper allows clicks through */
    width: 100px; 
    height: 120px;
  }

  /* THOUGHT BUBBLE - MOVED UP */
  .cute-bubble {
    background: #fff;
    color: #333;
    padding: 12px 18px;
    border-radius: 20px;
    border-bottom-right-radius: 4px;
    font-size: 0.85rem;
    font-weight: 700;
    text-align: center;
    min-width: 160px;
    box-shadow: 0 5px 20px rgba(0,0,0,0.15);
    
    /* Position Change: */
    margin-bottom: 25px; /* Added more space */
    position: absolute;
    bottom: 100%; /* Sits completely above the container */
    
    white-space: normal; /* Allow text wrapping */
    pointer-events: auto;
    border: 2px solid #00d2ff; /* Cute border */
  }

  /* BODY ASSEMBLY - MAKE CLICKABLE */
  .nano-body {
    position: relative;
    width: 60px;
    height: 60px;
    cursor: pointer; /* Shows hand cursor */
    pointer-events: auto; /* IMPORTANT: Makes the bot clickable! */
    transition: transform 0.2s;
  }
  
  .nano-body:active {
    transform: scale(0.9); /* Click squeeze effect */
  }

  /* HEAD - Glossy White Sphere */
  .nano-head {
    width: 60px;
    height: 55px;
    background: radial-gradient(circle at 30% 30%, #ffffff, #d0efff);
    border-radius: 50%;
    position: relative;
    box-shadow: 
      inset 0 -5px 10px rgba(0, 150, 255, 0.2), 
      0 10px 20px rgba(0,0,0,0.2), 
      0 0 15px rgba(255,255,255, 0.5); 
    z-index: 2;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  /* FACE - Black Glass Screen */
  .face-screen {
    width: 45px;
    height: 35px;
    background: #111;
    border-radius: 18px;
    position: relative;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    box-shadow: inset 0 0 5px rgba(255,255,255,0.2);
  }

  /* EYES & EXPRESSIONS */
  .eyes-row { display: flex; gap: 8px; margin-bottom: 2px; }
  
  .nano-eye {
    width: 10px; height: 14px;
    background: #00d2ff;
    border-radius: 50%;
    box-shadow: 0 0 8px #00d2ff;
    transition: all 0.3s cubic-bezier(0.68, -0.55, 0.27, 1.55); 
  }

  .nano-eye.happy { height: 14px; border-radius: 50%; }
  .nano-eye.excited { height: 16px; width: 12px; background: #fff; box-shadow: 0 0 10px #fff; }
  .nano-eye.curious.left { height: 10px; }
  .nano-eye.curious.right { height: 16px; transform: translateY(-2px); }
  .nano-eye.love { background: #ff007a; box-shadow: 0 0 10px #ff007a; height: 12px; width: 12px; border-radius: 50%; animation: heartbeat 0.5s infinite; }
  .nano-eye.dizzy { height: 4px; width: 14px; border-radius: 2px; transform: rotate(45deg); }
  .nano-eye.dizzy.right { transform: rotate(-45deg); }
  .nano-eye.sleep { height: 2px; width: 14px; transform: translateY(4px); opacity: 0.7; }

  /* CHEEKS */
  .cheeks { position: absolute; bottom: 6px; width: 100%; display: flex; justify-content: space-between; padding: 0 8px; }
  .blush { width: 6px; height: 3px; background: #ff007a; border-radius: 50%; opacity: 0.6; filter: blur(1px); }

  /* HANDS */
  .nub-hand {
    position: absolute;
    width: 12px; height: 12px;
    background: #fff;
    border-radius: 50%;
    top: 35px;
    box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  .nub-hand.left { left: -8px; }
  .nub-hand.right { right: -8px; }

  /* ANTENNA */
  .antenna-bulb {
    position: absolute;
    top: -5px;
    width: 6px; height: 6px;
    background: #00d2ff;
    border-radius: 50%;
    box-shadow: 0 0 10px currentColor;
  }
  .nano-head::before {
    content: ''; position: absolute; top: -5px; width: 2px; height: 6px; background: #ccc;
  }

  /* GRAVITY RIPPLE */
  .gravity-ripple {
    position: absolute; bottom: -15px; left: 50%; transform: translateX(-50%);
    width: 30px; height: 6px;
    background: rgba(0, 210, 255, 0.4);
    border-radius: 50%;
    filter: blur(4px);
    animation: ripple 2s infinite;
  }
  @keyframes ripple { 0%, 100% { transform: translateX(-50%) scale(1); opacity: 0.5; } 50% { transform: translateX(-50%) scale(1.5); opacity: 0.2; } }

  @keyframes heartbeat { 0% { transform: scale(1); } 50% { transform: scale(1.2); } 100% { transform: scale(1); } }
.voice-btn:hover {
  transform: scale(1.05);
  box-shadow: 0 0 20px rgba(0, 210, 255, 0.6);
}

.voice-btn.stop {
  background: linear-gradient(135deg, #ff5f6d, #ffc371);
}


  .ambient-glow {
    position: fixed; top: 0; left: 50%; width: 50%; height: 50%;
    background: radial-gradient(circle, rgba(0, 198, 255, 0.08), transparent 70%);
    filter: blur(100px); transform: translateX(-50%);
  }

  .dash-content-wrapper {
    max-width: 1200px;
    margin: 0 auto;
    padding: 40px 20px;
    position: relative;
    z-index: 10;
  }

  .dash-header {
    display: flex; justify-content: space-between; align-items: flex-end;
    margin-bottom: 40px;
  }

  .dash-header h1 { font-size: 2.5rem; font-weight: 800; margin-bottom: 8px; }
  .dash-header h1 span { color: #00d2ff; }
  .dash-header p { color: #666; font-size: 1.1rem; }

  .engine-status {
    background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08);
    padding: 10px 20px; border-radius: 100px; font-size: 0.8rem;
    display: flex; align-items: center; gap: 10px; color: #888;
  }

  .status-dot { width: 8px; height: 8px; background: #00ff88; border-radius: 50%; box-shadow: 0 0 10px #00ff88; }

  /* UPLOAD CARD */
  .upload-main-card {
    background: rgba(255, 255, 255, 0.02);
    border: 2px dashed rgba(255, 255, 255, 0.1);
    border-radius: 40px;
    padding: 100px 40px;
    text-align: center;
    cursor: pointer;
    transition: 0.4s cubic-bezier(0.16, 1, 0.3, 1);
  }

  .upload-icon-container {
    width: 80px; height: 80px; background: rgba(0, 210, 255, 0.1);
    border-radius: 50%; display: flex; align-items: center; justify-content: center;
    margin: 0 auto 30px; position: relative;
  }

  .upload-icon-container .icon { font-size: 2rem; color: #00d2ff; }
  .pulse-circle { position: absolute; inset: 0; border: 2px solid #00d2ff; border-radius: 50%; animation: pulse-out 2s infinite; }

  @keyframes pulse-out { 0% { transform: scale(1); opacity: 0.5; } 100% { transform: scale(1.5); opacity: 0; } }

  .supported-formats { margin-top: 25px; color: #444; font-size: 0.8rem; letter-spacing: 2px; }

  /* RESULTS VIEW */
  .active-analysis-container { display: flex; flex-direction: column; gap: 24px; }
  .file-strip { 
    background: rgba(255,255,255,0.03); padding: 25px 35px; border-radius: 24px; 
    border: 1px solid rgba(255,255,255,0.06); display: flex; justify-content: space-between; align-items: center;
  }
  .file-tag { color: #00d2ff; font-weight: 800; font-size: 0.7rem; letter-spacing: 2px; }

  .results-layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; }
  .glass-panel { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 30px; padding: 30px; backdrop-filter: blur(10px); }
  .panel-label { font-size: 0.7rem; color: #444; text-transform: uppercase; font-weight: 800; margin-bottom: 20px; letter-spacing: 1px; }

  .scrolling-text { height: 200px; color: #888; overflow: hidden; }
  .highlight { color: #fff; border-left: 2px solid #00d2ff; padding-left: 15px; margin: 15px 0; }

  .insights-stack { display: flex; flex-direction: column; gap: 24px; }
  .lang-pair { font-size: 2rem; font-weight: 800; }
  .lang-pair span { color: #00d2ff; }

  .action-row { background: rgba(255,255,255,0.03); padding: 12px; border-radius: 12px; margin-bottom: 10px; font-size: 0.9rem; }

  .reset-btn {
    align-self: center; background: #fff; color: #000; border: none;
    padding: 16px 40px; border-radius: 100px; font-weight: 700; cursor: pointer;
    transition: 0.3s;
  }

  .reset-btn:hover { background: #00d2ff; transform: scale(1.05); }

  @media (max-width: 900px) {
    .results-layout { grid-template-columns: 1fr; }
    .dash-header { flex-direction: column; align-items: flex-start; gap: 20px; }
  }
`;
