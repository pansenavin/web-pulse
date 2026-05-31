import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import './Dashboard.css';
import {
  PieChart,
  Pie,
  Cell,
  ResponsiveContainer,
  Tooltip,
} from 'recharts';

const ActivityFeed = ({ logs }) => {
  const getRelativeTime = (dateString) => {
    const now = new Date();
    const then = new Date(dateString);
    const diffInSeconds = Math.floor((now - then) / 1000);

    if (diffInSeconds < 60) return 'Just now';
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)} min ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    return then.toLocaleDateString();
  };

  return (
    <div className="overview-card">
      <h2>Recent Activity</h2>
      <div className="activity-list">
        {logs && logs.length > 0 ? (
          logs.map(item => (
            <div key={item.id} className="activity-item">
              <div className={`activity-icon ${item.status}`}></div>
              <div className="activity-text">
                Monitor <b>{item.website_name}</b> is <b>{item.status.toUpperCase()}</b> 
                {item.http_code && <span> (HTTP {item.http_code})</span>}
              </div>
              <div className="activity-time">{getRelativeTime(item.check_time)}</div>
            </div>
          ))
        ) : (
          <p style={{ textAlign: 'center', padding: '1rem', color: '#94a3b8' }}>No activity recorded yet.</p>
        )}
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [stats, setStats] = useState({ total: 0, up: 0, down: 0 });
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
    fetchActivity();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/websites/list", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (response.ok) {
        const data = await response.json();
        const upCount = data.filter(s => s.last_status === 'up').length;
        const downCount = data.filter(s => s.last_status === 'down').length;
        setStats({
          total: data.length,
          up: upCount,
          down: downCount
        });
      }
    } catch (err) {
      console.error(err);
    }
  };

  const fetchActivity = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/websites/logs/activity", {
        headers: { "Authorization": `Bearer ${localStorage.getItem("token")}` }
      });
      if (response.ok) {
        const data = await response.json();
        setLogs(data);
      }
      setLoading(false);
    } catch (err) {
      console.error(err);
      setLoading(false);
    }
  };

  const pieData = [
    { name: 'Operational', value: stats.up, color: '#10b981' },
    { name: 'Down', value: stats.down, color: '#ef4444' },
    { name: 'Other', value: stats.total - (stats.up + stats.down), color: '#6366f1' },
  ].filter(d => d.value > 0);

  return (
    <>
      <Navbar />
      <div className="wrapper">
        <div className="dashboard-container top-gap">
          <div className="dashboard-header">
            <h1 className="dashboard-heading">Dashboard</h1>
          </div>

          <div className="summary-cards">
            <div className="summary-card total">
              <h3>Total Monitors</h3>
              <p>{loading ? "..." : stats.total}</p>
            </div>
            <div className="summary-card up">
              <h3>OPERATIONAL</h3>
              <p>{loading ? "..." : stats.up}</p>
            </div>
            <div className="summary-card down">
              <h3>DOWN</h3>
              <p>{loading ? "..." : stats.down}</p>
            </div>
          </div>

          <div className="health-overview">
            <div className="overview-card">
              <h2>Service Health</h2>
              <ResponsiveContainer width="100%" height={250}>
                <PieChart>
                  <Pie
                    data={pieData}
                    innerRadius={60}
                    outerRadius={80}
                    paddingAngle={5}
                    dataKey="value"
                  >
                    {pieData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    contentStyle={{ backgroundColor: '#1e293b', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
                    itemStyle={{ color: '#f8fafc' }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div style={{ textAlign: 'center', color: '#94a3b8', fontSize: '0.9rem' }}>
                System Uptime Distribution
              </div>
            </div>

            <ActivityFeed logs={logs} />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;
