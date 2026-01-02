import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Navbar from "./components/Navbar";

import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import ProcessMeeting from "./pages/ProcessMeeting";
import Team from "./pages/Team";
import About from "./pages/About";
import Result from "./pages/Result";


function App() {
  return (
    <Router>
      <Navbar />   {/* ✅ ALWAYS VISIBLE */}

      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/process" element={<ProcessMeeting />} />
        <Route path="/team" element={<Team />} />
        <Route path="/result" element={<Result />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  );
}

export default App;
