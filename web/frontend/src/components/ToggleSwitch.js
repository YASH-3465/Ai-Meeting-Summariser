import React from "react";
import { motion } from "framer-motion";
import "./ToggleSwitch.css";

export default function ToggleSwitch({ label, checked, onChange }) {
  return (
    <div className="mw-toggle-wrapper">
      {label && <span className="mw-toggle-label">{label}</span>}

      <div
        className={`mw-toggle-track ${checked ? "is-active" : ""}`}
        onClick={(e) => {
          e.stopPropagation();
          onChange(!checked);
        }}
      >
        <motion.div
          className="mw-toggle-knob"
          initial={false}
          animate={{
            x: checked ? 20 : 0,
          }}
          transition={{
            type: "spring",
            stiffness: 500,
            damping: 30,
            mass: 0.8,
          }}
        />
      </div>
    </div>
  );
}