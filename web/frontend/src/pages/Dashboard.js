import React, { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Dashboard() {
const navigate = useNavigate();
const [fileName, setFileName] = useState("");
const [stage, setStage] = useState("idle"); // idle | processing | done
const [result, setResult] = useState(null);
const [translate, setTranslate] = useState(false);
const [notify, setNotify] = useState(false);


const fileInputRef = useRef(null);


 const triggerUpload = () => {
  fileInputRef.current.click();
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
        
        {/* HEADER SECTION */}
        <header className="dash-header">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1>Intelligence <span>Terminal</span></h1>
            <p>Upload your meeting to begin neural extraction</p>
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
                <div style={{ marginTop: "30px", display: "flex", justifyContent: "center", gap: "30px" }}>

  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
    <input
      type="checkbox"
      checked={translate}
      onChange={() => setTranslate(!translate)}
    />
    <span>Translate to English</span>
  </label>

  <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer" }}>
    <input
      type="checkbox"
      checked={notify}
      onChange={() => setNotify(!notify)}
    />
    <span>Email Notification</span>
  </label>

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
    <p className="highlight">{result.summary}</p>
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