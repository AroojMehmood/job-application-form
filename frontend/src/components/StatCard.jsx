function StatCard({ label, value, accentColor }) {
  return (
    <div className="stat-card" style={{ borderLeftColor: accentColor || "#2c4a52" }}>
      <p className="stat-card-label">{label}</p>
      <p className="stat-card-value">{value}</p>
    </div>
  );
}

export default StatCard;