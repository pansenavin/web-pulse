import React from 'react';
import Navbar from '../navbar/Navbar';
import { Link } from "react-router-dom";
import './WebDetails.css';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const WebsiteCard = ({ site }) => {
  return (
    <div className="website-card">
      <h2 className="website-title">{site.name}</h2>
      <p className="website-url">{site.url}</p>
      <div className="website-details">
        <p>Status: <span className="status">{site.status}</span></p>
        <p>Last Check: {site.lastCheck}</p>
        <p>Uptime 24h: {site.uptime['24h']}</p>
        <p>Uptime 7d: {site.uptime['7d']}</p>
        <p>Uptime 30d: {site.uptime['30d']}</p>
        <p>Response Time: <span className="response-time">{site.responseTime}</span></p>
      </div>
    </div>
  );
};

const ResponseChart = () => {
  const data = [
    { time: '12:00', response: 220 },
    { time: '12:05', response: 215 },
    { time: '12:10', response: 210 },
    { time: '12:15', response: 221 },
    { time: '12:20', response: 218 },
  ];

  return (
    <div className="chart-container">
      <h2 className="chart-title">Response Time (Last Hour)</h2>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="response" stroke="#38bdf8" strokeWidth={2} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

function WebDetail() {
  return (
    <>
      <Navbar />
      <div className="wrapper">
        <div className="dashboard-container top-gap">

            <div className="website-header">
                <div className="website-title">
                    <span className="green-dot">🟢</span>
                    <h2>YouTube</h2>
                    <a className='atag' href="https://www.youtube.com/" target="_blank" rel="noreferrer">www.youtube.com/</a>
                </div>
                <div className="website-actions">
                    <button>Pause</button>
                    <button>Edit</button>
                </div>
            </div>

            <div className="status-info">
                <div className="status-card">
                    <h4 className='inpadding'>Current Status</h4>
                    <p className="green inpadding">Up</p>
                    <span className='inpadding'>Currently up for 0h 8m 26s</span>
                </div>
                <div className="status-card">
                    <h4 className='inpadding'>Last Check</h4>
                    <p className='inpadding'>Coming soon</p>
                    <span className='inpadding'>Checked every 5 minutes</span>
                </div>
            </div>

            <div className="uptime-stats">
                <div className="uptime-card">
                    <h4>Last 24 hours</h4>
                    <div className="bar full"></div>
                    <p>0 incidents, 0m down</p>
                </div>
                <div className="uptime-card">
                    <h4>Last 7 days</h4>
                    <p className="green inpadding">100%</p>
                </div>
                <div className="uptime-card">
                    <h4>Last 30 days</h4>
                    <p className="green inpadding">100%</p>
                </div>
            </div>
             <ResponseChart />
            <div className="response-time">
               
              <div className="stats">
                <p><strong>Average:</strong> 221 ms</p>
                <p><strong>Minimum:</strong> 221 ms</p>
                <p><strong>Maximum:</strong> 221 ms</p>
              </div>
            </div>
        </div>
       </div>
    </>
  );
}

export default WebDetail;
