
import React, { useState, useRef,useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import ToggleSwitch from "../components/ToggleSwitch";
import AIAssistant from "../components/AIAssistant";
import HeroShaderBackground from "./HeroShaderBackground";
import ProcessingLoader from "../components/ProcessingLoader";



const processingSteps = [
  "Reading audio file…",
  "Transcribing speech…",
  "Analyzing language…",
  "Generating summary…",
  "Extracting action items…"
];


export default function Dashboard() {
const navigate = useNavigate();
const [fileName, setFileName] = useState("");
const [stage, setStage] = useState("idle"); // idle | processing | done
const [result, setResult] = useState(null);
const [translate, setTranslate] = useState(false);
const [notify, setNotify] = useState(false);
const [isSpeaking, setIsSpeaking] = useState(false);
const speechRef = useRef(null);
//const [eta, setEta] = useState(45); // seconds (soft estimate)
const [isSelectingFile, setIsSelectingFile] = useState(false);
const [eta, setEta] = useState(32);
const [processingPhase, setProcessingPhase] = useState("transcribing");
const phaseIndexRef = useRef(0);
const phaseStartRef = useRef(null);
const processingStartedRef =useRef(false)


const dynamicProcessingLabel = (() => {
  switch (processingPhase) {
    case "transcribing":
      return "Transcribing audio…";
    case "summarizing":
      return "Generating summary…";
    case "extracting":
      return "Extracting action items…";
    default:
      return "Analyzing meeting…";
  }
})();


const estimateProcessingTime = (meetingMinutes) => {
  // Based on real measured pipeline timings (CPU)
  const whisperTime = meetingMinutes * 20; // sec
  const nlpBuffer = 12;                     // sec (summary + actions)
  return Math.round(whisperTime + nlpBuffer);
};




useEffect(() => {
  const savedJobId = localStorage.getItem("meetwise_job_id");

  // 🔥 Cold start rule:
  // Only resume if a job was IN PROGRESS
  if (!savedJobId) {
    localStorage.removeItem("meetwise_last_result");
    setResult(null);
    setStage("idle");
    return;
  }

  // 🔹 Verify job with backend
  fetch(`http://127.0.0.1:8000/api/status/${savedJobId}`)
    .then(res => res.json())
    .then(data => {
      if (data.status === "processing") {
        setStage("processing");
        pollJobStatus(savedJobId);
      } else {
        // 🔥 Job is stale or completed → reset UI
        localStorage.removeItem("meetwise_job_id");
        localStorage.removeItem("meetwise_last_result");
        setResult(null);
        setStage("idle");
      }
    })
    .catch(() => {
      localStorage.removeItem("meetwise_job_id");
      localStorage.removeItem("meetwise_last_result");
      setResult(null);
      setStage("idle");
    });
}, []);



useEffect(() => {
  if (stage !== "processing") {
    processingStartedRef.current = false;
    return;
  }

  // 🔒 Prevent restarting phases on re-render
  if (processingStartedRef.current) return;
  processingStartedRef.current = true;

  const phases = [
    { name: "transcribing", duration: 18 },
    { name: "summarizing", duration: 10 },
    { name: "extracting", duration: 9 }
  ];

  phaseIndexRef.current = 0;
  phaseStartRef.current = Date.now();

  setProcessingPhase(phases[0].name);
  setEta(phases.reduce((a, b) => a + b.duration, 0));

  const interval = setInterval(() => {
    const elapsed = Math.floor(
      (Date.now() - phaseStartRef.current) / 1000
    );

    const current = phases[phaseIndexRef.current];

    let remaining =
      phases
        .slice(phaseIndexRef.current)
        .reduce((a, b) => a + b.duration, 0) - elapsed;

    if (remaining <= 6) remaining = Math.max(4, remaining + 1);
    setEta(remaining);

    if (
      phaseIndexRef.current < phases.length - 1 &&
      elapsed >= current.duration
    ) {
      phaseIndexRef.current += 1;
      phaseStartRef.current = Date.now();
      setProcessingPhase(phases[phaseIndexRef.current].name);
    }
  }, 1200);

  return () => clearInterval(interval);
}, [stage]);


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

  const roughMeetingMinutes = 2; // 🔧 adjust later dynamically
  const estimatedSeconds = estimateProcessingTime(roughMeetingMinutes);

  const selectedFile = e.target.files[0];
  if (!selectedFile) return;

  // 🔥 CLEAR PREVIOUS RUN COMPLETELY
  setResult(null);
  setStage("processing");

  setEta(estimatedSeconds);

  processingStartedRef.current = false;
  setProcessingPhase("transcribing"); // ✅ RESET PHASE

  localStorage.removeItem("meetwise_last_result");
  localStorage.removeItem("meetwise_job_id");

  setFileName(selectedFile.name);
  sendToBackend(selectedFile);
};


const pollJobStatus = async (jobId) => {
  try {
    const res = await fetch(`http://127.0.0.1:8000/api/status/${jobId}`);
    if (!res.ok) return;

    const data = await res.json();

    if (data.status === "completed") {
      setEta(null);
      setResult(data.result);
      setStage("results");
      localStorage.setItem(
    "meetwise_last_result",
    JSON.stringify(data.result)
  );

      localStorage.removeItem("meetwise_job_id");

      return;
    }

    if (data.status === "failed") {
      alert("Processing failed");
      setStage("idle");
        localStorage.removeItem("meetwise_job_id");
  
      return;
    }

    // still processing → poll again
    setTimeout(() => pollJobStatus(jobId), 2000);

  } catch (err) {
    console.error("Polling error:", err);
  }
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

localStorage.setItem("meetwise_job_id", data.job_id);
setResult(null);
setStage("processing");
pollJobStatus(data.job_id);


  } catch (error) {
  console.error("UPLOAD ERROR:", error);
  alert("Failed to process meeting. Check console & backend logs.");
}



};

  return (
    <div className="dash-root">
      <style>{dashStyles}</style>
      
      <HeroShaderBackground />
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
        <section className="mw-pipeline-header">
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
                >
                  <span className="mw-badge">Dashboard</span>
                  <h1 className="mw-h1">Upload<br/><span>The Meeting</span></h1>
                </motion.div>
              </section>

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
                    <span className={`tag ${stage}`}>
                        {stage === "processing" ? "PROCESSING" : "COMPLETED"}
                    </span>

                    <h3>{fileName}</h3>
                  </div>
              <div className={`stage-indicator ${stage}`}>
  {stage === "processing" && "Analyzing meeting… please wait"}
  {stage === "results" && "Analysis completed successfully"}
</div>


                </div>

                <div className="results-layout">
                  {/* LEFT: TRANSCRIPT */}
                  <div className="glass-panel transcript-box">
                    <div className="panel-label">Live Transcription</div>
                    <div className="scrolling-text">
                    {stage === "processing" && (
  <ProcessingLoader
    label={dynamicProcessingLabel}
    eta={eta}
  />
)}



{stage === "results" && result?.summary && (
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
  <div className="panel-label">Language</div>

  {translate ? (
  <div className="lang-pair active-lang">
    Original → English
  </div>
) : (
  <div className="lang-pair inactive-lang">
    Original language only
  </div>
)}

</div>

                    
                   <div className="glass-panel actions-card">
  <div className="panel-label">Action Items</div>
  <div className="action-list">

    {stage === "processing" && <div className="skeleton-line" />}

    {stage === "results" &&
  (!result?.actions || result.actions.length === 0) && (
    <p style={{ color: "#666" }}>No action items detected.</p>
)}


    {stage === "results" &&
  result?.actions?.map((a, i) => (
    <div className="action-row" key={i}>
      ✓ {a.action}
      {a.deadline && (
        <span style={{ color: "#00d2ff" }}> — {a.deadline}</span>
      )}
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
    background:transparent !important;
    color: #fff;
    min-height: 100vh;
    padding-top: 100px; /* Space for Navbar */
    position: relative;
    font-family: 'Plus Jakarta Sans', sans-serif;
    z-index:1;
  }

 .bg-grid-overlay {
  position: fixed; 
  inset: 0;
  /* Use very faint lines - 0.02 opacity is key */
  background-image: linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), 
                    linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px);
  background-size: 50px 50px;
  z-index: -1; 
  pointer-events: none;
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

  .mw-pipeline-header { position: relative; z-index: 10; padding: 18px 24px 100px; text-align: center; }
  .mw-badge { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); padding: 8px 20px; border-radius: 100px; color: #00d2ff; font-size: 0.75rem; font-weight: 700; letter-spacing: 2px; text-transform: uppercase; }
  .mw-h1 { font-size: clamp(4rem, 8vw, 4.8rem); font-weight: 800; margin-top: 30px; line-height: 0.95; letter-spacing: -3px; }
  .mw-h1 span { background: linear-gradient(135deg, #fff 30%, #00d2ff 100%);margin-bottom: 30px; -webkit-background-clip: text; -webkit-text-fill-color: transparent; }

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
  display: none; /* Temporarily disable this to see if it's causing the brightness */
}

.active-lang {
  font-size: 1.8rem;
  font-weight: 800;
  color: #00d2ff;
}

.inactive-lang {
  font-size: 1.2rem;
  font-weight: 700;
  color: #888;
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
 .tag {
  padding: 6px 16px;
  border-radius: 999px;
  font-size: 0.7rem;
  font-weight: 800;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.dot-group {
  transform-origin: 50% 50%;
  animation: spin 1.6s linear infinite;
}

.dot-loader {
  animation: dash-spin 1.4s ease-in-out infinite;
}

@keyframes dash-spin {
  0% {
    stroke-dashoffset: 0;
    transform: rotate(0deg);
    transform-origin: 50% 50%;
  }
  50% {
    stroke-dashoffset: -120;
    transform: rotate(180deg);
  }
  100% {
    stroke-dashoffset: -240;
    transform: rotate(360deg);
  }
}

.dot-loader circle:last-child {
  animation: dash-move 1.4s ease-in-out infinite;
}

@keyframes dash-move {
  0% {
    stroke-dashoffset: 0;
  }
  100% {
    stroke-dashoffset: -240;
  }
}

/* ==== ADVANCED WINDOWS-STYLE LOADER ==== */

.loader-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 12px;
  min-height: 220px;
}

.modern-loader {
  width: 64px;
  height: 64px;
  animation: master-rotate 1.6s linear infinite;
}


.dot {
  fill: #0078d4;
   filter: drop-shadow(0 0 6px rgba(0, 120, 212, 0.6));
  opacity: 0.25;
  animation: pulse 1.4s ease-in-out infinite;
  transform-origin: 50px 50px; /* 🔒 axis lock */
}


.dot:nth-child(1)  { animation-delay: 0s; }
.dot:nth-child(2)  { animation-delay: 0.1s; }
.dot:nth-child(3)  { animation-delay: 0.2s; }
.dot:nth-child(4)  { animation-delay: 0.3s; }
.dot:nth-child(5)  { animation-delay: 0.4s; }
.dot:nth-child(6)  { animation-delay: 0.5s; }
.dot:nth-child(7)  { animation-delay: 0.6s; }
.dot:nth-child(8)  { animation-delay: 0.7s; }
.dot:nth-child(9)  { animation-delay: 0.8s; }
.dot:nth-child(10) { animation-delay: 0.9s; }
.dot:nth-child(11) { animation-delay: 1.0s; }
.dot:nth-child(12) { animation-delay: 1.1s; }

.processing-label {
  font-size: 0.95rem;
  font-weight: 600;
  color: #e0e0e0;
}

.eta-label {
  font-size: 0.8rem;
  color: #8fbce8;
}

@keyframes master-rotate {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes dot-fade {
  0%   { opacity: 0.15; }
  20%  { opacity: 0.9; }
  40%  { opacity: 0.15; }
  100% { opacity: 0.15; }
}


.tag.processing {
  background: linear-gradient(135deg, #ff9f1c, #ffbf69);
  color: #000;
  box-shadow: 0 0 15px rgba(255, 159, 28, 0.6);
  animation: pulseGlow 1.8s infinite;
}

.live-processing {
  display: flex;
  align-items: center;
  gap: 24px;
  margin-top: 20px;
}

.progress-ring {
  animation: spin 1.4s linear infinite;
}

@keyframes spin {
  from { transform: rotate(0deg); }
  to   { transform: rotate(360deg); }
}

.processing-text {
  display: flex;
  flex-direction: column;
  gap: 6px;
  font-size: 0.9rem;
}

.processing-text strong {
  color: #00d2ff;
  font-weight: 700;
}

.processing-text span {
  color: #777;
  font-size: 0.8rem;
}


.tag.results {
  background: linear-gradient(135deg, #00ffcc, #00d2ff);
  color: #000;
  box-shadow: 0 0 20px rgba(0, 210, 255, 0.8);
}

@keyframes pulse {
  0%, 100% {
    opacity: 0.25;
    r: 2.6;
  }
  50% {
    opacity: 1;
    r: 3.4;
  }
}

@keyframes pulseGlow {
  0% { box-shadow: 0 0 10px rgba(255,159,28,0.4); }
  50% { box-shadow: 0 0 22px rgba(255,159,28,0.9); }
  100% { box-shadow: 0 0 10px rgba(255,159,28,0.4); }
}

.stage-indicator {
  font-weight: 700;
  font-size: 0.95rem;
  opacity: 0.9;
}

.stage-indicator.processing {
  color: #ffbf69;
}

.stage-indicator.results {
  color: #00ffcc;
}


  .results-layout { display: grid; grid-template-columns: 1.5fr 1fr; gap: 24px; }
  .glass-panel { background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.05); border-radius: 30px; padding: 30px; backdrop-filter: blur(10px); }
  .panel-label { font-size: 0.7rem; color: #444; text-transform: uppercase; font-weight: 800; margin-bottom: 20px; letter-spacing: 1px; }

  .scrolling-text {
  max-height: 320px;
  overflow-y: auto;
  padding-right: 10px;
  color: #cfcfcf;
  line-height: 1.6;
  height:260px;
}

/* Nice scrollbar */
.scrolling-text::-webkit-scrollbar {
  width: 6px;
}
.scrolling-text::-webkit-scrollbar-thumb {
  background: rgba(0, 210, 255, 0.4);
  border-radius: 10px;
}

  .highlight {
  color: #ffffff;
  border-left: 3px solid #00d2ff;
  padding-left: 18px;
  margin: 10px 0 20px;
  font-size: 0.95rem;
}


  .insights-stack { display: flex; flex-direction: column; gap: 24px; }
  .lang-pair { font-size: 2rem; font-weight: 800; }
  .lang-pair span { color: #00d2ff; }



  .action-row {
  background: rgba(255,255,255,0.03);
  padding: 12px 16px;
  border-radius: 14px;
  margin-bottom: 10px;
  font-size: 0.9rem;
  border-left: 3px solid #00d2ff;
}


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