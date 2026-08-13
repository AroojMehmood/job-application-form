import { useState, useEffect } from "react";
import axios from "axios";
import StatCard from "./StatCard";
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const API_BASE_URL = "http://localhost:5000";

const FILTERS = [
  { key: "all", label: "All Time" },
  { key: "7days", label: "Last 7 Days" },
  { key: "thisMonth", label: "This Month" },
  { key: "lastMonth", label: "Last Month" },
];

const GENDER_COLORS = {
  Male: "#2c4a52",
  Female: "#c084fc",
  Other: "#4a9b8e",
};

function Dashboard() {
  const [stats, setStats] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeFilter, setActiveFilter] = useState("all");

  const getDateRange = (filter) => {
    const now = new Date();
    let from = null;
    let to = null;

    if (filter === "7days") {
      from = new Date();
      from.setDate(now.getDate() - 7);
    } else if (filter === "thisMonth") {
      from = new Date(now.getFullYear(), now.getMonth(), 1);
    } else if (filter === "lastMonth") {
      from = new Date(now.getFullYear(), now.getMonth() - 1, 1);
      to = new Date(now.getFullYear(), now.getMonth(), 0);
    }

    return {
      from: from ? from.toISOString().split("T")[0] : undefined,
      to: to ? to.toISOString().split("T")[0] : undefined,
    };
  };

  useEffect(() => {
    const fetchStats = async () => {
      setIsLoading(true);
      setError(null);

      try {
        const { from, to } = getDateRange(activeFilter);
        const params = {};
        if (from) params.from = from;
        if (to) params.to = to;

        const response = await axios.get(`${API_BASE_URL}/api/applications/stats`, {
          params,
        });

        setStats(response.data.data);
      } catch (err) {
        console.error("Error fetching dashboard stats:", err);
        setError("Failed to load dashboard data.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStats();
  }, [activeFilter]);

  const filterBar = (
    <div className="dashboard-filters">
      {FILTERS.map((f) => (
        <button
          key={f.key}
          className={activeFilter === f.key ? "filter-btn active" : "filter-btn"}
          onClick={() => setActiveFilter(f.key)}
        >
          {f.label}
        </button>
      ))}
    </div>
  );

  // Body content decide karo based on state
  let body;
  if (isLoading) {
    body = <div className="dashboard-message">Loading dashboard...</div>;
  } else if (error) {
    body = <div className="dashboard-message dashboard-error">{error}</div>;
  } else if (!stats || stats.total === 0) {
    body = <div className="dashboard-message">No application data available yet.</div>;
 } else {
    const experienced = stats.total - stats.freshers;

    body = (
      <>
        <div className="stat-cards-grid">
          <StatCard label="Total Applications" value={stats.total} accentColor="#2c4a52" />
          <StatCard label="Freshers" value={stats.freshers} accentColor="#4a9b8e" />
          <StatCard label="Experienced" value={experienced} accentColor="#c084fc" />
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Applications by Experience Level</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.byExperience}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e4e7" />
              <XAxis dataKey="name" tick={{ fontSize: 12, fill: "#2c4a52" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#2c4a52" }} />
              <Tooltip />
              <Bar dataKey="value" fill="#2c4a52" radius={[6, 6, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <h2 className="chart-title">Applications by Gender</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={stats.byGender}
                dataKey="value"
                nameKey="name"
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
              >
                {stats.byGender.map((entry) => (
                  <Cell key={entry.name} fill={GENDER_COLORS[entry.name] || "#aaa"} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </div>

<div className="chart-card">
          <h2 className="chart-title">Submissions Over Time</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.byDate}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e5e4e7" />
              <XAxis dataKey="date" tick={{ fontSize: 12, fill: "#2c4a52" }} />
              <YAxis allowDecimals={false} tick={{ fontSize: 12, fill: "#2c4a52" }} />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="count"
                stroke="#2c4a52"
                strokeWidth={2}
                dot={{ r: 4, fill: "#2c4a52" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
        
      </>
    );
  }
  return (
    <div className="dashboard-container">
      <h1>Application Dashboard</h1>
      {filterBar}
      {body}
    </div>
  );
}

export default Dashboard;