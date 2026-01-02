import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import "./Navbar.css";

const navItems = [
  { name: "Home", path: "/" },
  { name: "Process", path: "/process" },
  { name: "Dashboard", path: "/dashboard" },
  { name: "Team", path: "/team" },
  { name: "About", path: "/about" },
];

export default function Navbar() {
  const navigate = useNavigate();
  const [hoveredPath, setHoveredPath] = useState(null);

  return (
    <motion.nav 
      className="navbar-wrapper"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
    >
      <div className="navbar-container">
        {/* LOGO with Magnetic Effect */}
        <motion.div 
          className="logo"
          whileHover={{ scale: 1.05, x: 5 }}
          onClick={() => navigate("/")}
        >
          MeetWise<span className="dot">.</span>
        </motion.div>

        {/* NAVIGATION LINKS */}
        <ul className="nav-list" onMouseLeave={() => setHoveredPath(null)}>
          {navItems.map((item) => (
            <li key={item.path} className="nav-li">
              <NavLink to={item.path} end className="nav-link">
                {({ isActive }) => (
                  <motion.div
                    className={`nav-text ${isActive ? "active-text" : ""}`}
                    onMouseEnter={() => setHoveredPath(item.path)}
                  >
                    {item.name}
                    
                    {/* Floating Hover Background */}
                    <AnimatePresence>
                      {hoveredPath === item.path && (
                        <motion.span
                          className="hover-pill"
                          layoutId="hover-pill"
                          initial={{ opacity: 0, scale: 0.9 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.9 }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Active Underline/Pill */}
                    {isActive && (
                      <motion.div 
                        className="active-indicator" 
                        layoutId="active-indicator"
                        transition={{ type: "spring", bounce: 0.25, duration: 0.5 }}
                      />
                    )}
                  </motion.div>
                )}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* PREMIUM CTA */}
        <motion.button
          className="nav-cta-premium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => navigate("/dashboard")}
        >
          <span>Get Started</span>
          <motion.div className="cta-glow" />
        </motion.button>
      </div>
    </motion.nav>
  );
}