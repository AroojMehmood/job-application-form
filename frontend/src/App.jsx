import { useState } from "react";
import JobApplicationForm from "./components/JobApplicationForm";
import Dashboard from "./components/Dashboard";
import "./App.css";

function App() {
  const [activeView, setActiveView] = useState("form"); // "form" | "dashboard"

  return (
    <div className="app">
      <div className="view-switcher">
        <button
          className={activeView === "form" ? "switch-btn active" : "switch-btn"}
          onClick={() => setActiveView("form")}
        >
          Application Form
        </button>
        <button
          className={activeView === "dashboard" ? "switch-btn active" : "switch-btn"}
          onClick={() => setActiveView("dashboard")}
        >
          Dashboard
        </button>
      </div>

      {activeView === "form" ? <JobApplicationForm /> : <Dashboard />}
    </div>
  );
}

export default App;