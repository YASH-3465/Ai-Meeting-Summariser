import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";

const praiseQuotes = [
  "This UI is so clean! Who designed this? 😍",
  "I love the neon blue colors here. Very aesthetic! 💙",
  "The layout is perfect. Good job dev team! 👏",
  "Everything feels so smooth and modern. 🧈",
  "I'm living in a luxury dashboard! ✨",
  "Best. Interface. Ever. 🤩"
];

const idleThoughts = [
  "I wonder what we're analyzing today? 🤔",
  "Do you think I dream of electric sheep? 🐑",
  "I'm ready when you are, Captain! 🫡",
  " *whistles digitally* 🎵",
  "Don't worry, I'm keeping an eye on things. 👀"
];

// Added isSelectingFile to props
const AIAssistant = ({ stage, translate, notify, fileName, actionCount, isSpeaking, isSelectingFile }) => {
  const [thought, setThought] = useState("Initializing..."); 
  const [expression, setExpression] = useState("happy");
  const [isStationary, setIsStationary] = useState(false);
  
  const isMounted = useRef(false);

  // ----------------------------------------------------
  // 1. INITIAL PRAISE ON LOAD
  // ----------------------------------------------------
  useEffect(() => {
    const timer = setTimeout(() => {
        setExpression("love");
        setThought("Whoa… this UI looks clean 😍 You’ve built something really cool here.");
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  // ----------------------------------------------------
  // 2. PERIODIC RANDOM PRAISE (Every 15s)
  // ----------------------------------------------------
  useEffect(() => {
    const interval = setInterval(() => {
        if (stage === 'idle' && !isStationary && !isSpeaking && !isSelectingFile) {
            if (Math.random() > 0.4) {
                const randomPraise = praiseQuotes[Math.floor(Math.random() * praiseQuotes.length)];
                setExpression("happy");
                setThought(randomPraise);
            } else {
                const randomIdle = idleThoughts[Math.floor(Math.random() * idleThoughts.length)];
                setExpression("curious");
                setThought(randomIdle);
            }
        }
    }, 15000); 

    return () => clearInterval(interval);
  }, [stage, isStationary, isSpeaking, isSelectingFile]);

  // ----------------------------------------------------
  // 3. FILE SELECTION REACTION (New Feature)
  // ----------------------------------------------------
  useEffect(() => {
    if (isSelectingFile) {
        setExpression("excited"); // Excited/Alert face
        setThought("I think a task is coming... I should be ready! 🧐");
    }
  }, [isSelectingFile]);

  // ----------------------------------------------------
  // 4. GLOBAL CLICK LISTENER (Empty Space Detection)
  // ----------------------------------------------------
  useEffect(() => {
    const handleGlobalClick = (e) => {
      if (e.target.closest('.nano-bot-wrapper')) return; 

      const isInteractive = e.target.closest('button, input, a, .toggle-switch, .upload-main-card');

      if (!isInteractive) {
        setExpression("curious");
        setThought("You are clicking on a non-interaction place... trying to wake up the pixels? 🤭");
      }
    };

    window.addEventListener('click', handleGlobalClick);
    return () => window.removeEventListener('click', handleGlobalClick);
  }, [stage]);

  // ----------------------------------------------------
  // 5. TOGGLE & VOICE REACTIONS
  // ----------------------------------------------------
  useEffect(() => {
    if (isSpeaking) {
        setIsStationary(true);
        setExpression("excited");
        setThought("Whoa! Who is speaking?? Is that my inner voice?! 😲🔊");
    } else if (!isSpeaking && stage === 'results' && isMounted.current) {
        setExpression("happy");
        setThought("Okay, I'm done talking. That was intense! 😅");
    }
  }, [isSpeaking, stage]);

  useEffect(() => {
    if (!isMounted.current) { isMounted.current = true; return; }
    if (translate) {
        setExpression("excited");
        setThought("Hola? Bonjour? Multi-language mode activated! 🌍✨");
    } else {
        setExpression("happy");
        setThought("Back to standard English. Keeping it classic! 🎩");
    }
  }, [translate]);

  useEffect(() => {
    if (!isMounted.current) return;
    if (notify) {
        setExpression("love");
        setThought("I'll shoot you an email as soon as I'm done! 📨💨");
    } else {
        setExpression("sleep");
        setThought("Okay, no emails. I'll keep the secrets to myself. 🤫");
    }
  }, [notify]);

  // ----------------------------------------------------
  // 6. MOUSE TRACKING (REMOVED UPLOAD HOVER)
  // ----------------------------------------------------
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (stage !== 'idle' || isStationary || isSpeaking || isSelectingFile) return; 

      // Removed the upload-card hover check as requested.
      // Bot now only reacts to general idle state or random praise.
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [stage, isStationary, isSpeaking, isSelectingFile]);

  // ----------------------------------------------------
  // 7. STAGE REACTIONS & FILE
  // ----------------------------------------------------
  useEffect(() => {
    if (stage === "processing") {
      setIsStationary(false);
      setExpression("dizzy");
      setThought("Wheeee! Zooming through the data! 🏎️💨");
    } else if (stage === "results") {
      setIsStationary(true);
      setExpression(actionCount > 0 ? "love" : "sleep");
      setThought(actionCount > 0 
        ? "Wow! Look at all those tasks! 😍" 
        : "All clean! No tasks. Time for a nap? 😴");
    }
  }, [stage, actionCount]);

  useEffect(() => {
    if (fileName && stage === 'processing') {
         setThought(`Munching on ${fileName}... nom nom nom 🍪`);
    }
  }, [fileName, stage]);

  // ----------------------------------------------------
  // 8. CLICK HANDLER (Apology)
  // ----------------------------------------------------
  const handleBotClick = () => {
    if (stage === "processing" && !isStationary) {
        setIsStationary(true);
        setExpression("sleep");
        setThought("Ohh sorry for coming in middle! I'm gonna sit quiet and stay here. 🙈");
    } else {
        setExpression("love");
        setThought("Ticklish! Hehe 😄");
    }
  };

  // ----------------------------------------------------
  // 9. ANIMATION VARIANTS
  // ----------------------------------------------------
  const roamVariants = {
    idle: { 
      y: [0, -15, 0], 
      x: 0,
      rotate: [0, 5, -5, 0],
      transition: { 
        y: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        rotate: { duration: 4, repeat: Infinity, ease: "easeInOut" },
        x: { duration: 0.5 } 
      }
    },
    processing: {
      x: [0, -400, 300, -200, 0],
      y: [0, -300, -100, -500, 0], 
      rotate: [0, 360, -360, 0],
      scale: [1, 1.1, 0.9, 1],
      transition: { duration: 12, repeat: Infinity, ease: "easeInOut" }
    },
    stationary: {
      x: 0,
      rotate: 0,
      y: [0, -5, 0], 
      transition: {
        x: { type: "spring", stiffness: 60, damping: 20 },
        rotate: { duration: 0.5 },
        y: { duration: 3, repeat: Infinity, ease: "easeInOut" } 
      }
    }
  };

  const currentVariant = isStationary ? "stationary" : (stage === "processing" ? "processing" : "idle");

  return (
    <motion.div 
      className="nano-bot-wrapper"
      variants={roamVariants}
      animate={currentVariant}
    >
      <AnimatePresence mode="wait">
        <motion.div 
          key={thought}
          initial={{ opacity: 0, scale: 0, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0, y: 10 }}
          className="cute-bubble"
        >
          {thought}
        </motion.div>
      </AnimatePresence>

      <div className="nano-body" onClick={handleBotClick}>
        <motion.div className="nub-hand left" animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2, delay: 0.2 }} />
        <motion.div className="nub-hand right" animate={{ y: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 2 }} />

        <div className="nano-head">
          <div className="face-screen">
            <div className="eyes-row">
               <div className={`nano-eye left ${expression}`} />
               <div className={`nano-eye right ${expression}`} />
            </div>
            <div className="cheeks">
              <div className="blush" />
              <div className="blush" />
            </div>
          </div>
          <motion.div 
            className="antenna-bulb" 
            animate={{ backgroundColor: ["#00d2ff", "#ff007a", "#00d2ff"] }}
            transition={{ duration: 3, repeat: Infinity }}
          />
        </div>
        <div className="gravity-ripple" />
      </div>
    </motion.div>
  );
};

export default AIAssistant;