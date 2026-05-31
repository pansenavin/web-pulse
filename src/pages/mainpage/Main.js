import React from 'react';
import Navbar from '../../component/navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import './Main.css';

import { FaCheckCircle } from 'react-icons/fa';

const HomePage = () => {
  const navigate = useNavigate();
  return (
    <>
      <div className="wrapper">
        <div className="dashboard-container top-gap">
          <div className="homepage">
            <nav className="navbar">
              <div className="logo">
                <img src="logo2.png" alt="Logo" className="logo-img" title="WebPulse" />
              </div>
              <div className="nav-links">
                {/* <a href="#features">Features</a>
                <a href="#status">Live Status</a>
                <a href="#pricing">Pricing</a> */}
                <a href="/login">Login</a>
                <a href="/register">Register</a>
              </div>
            </nav>

            <section className="hero">
              <div className="hero-text">
                <h1>Monitor Your Websites in Real-Time</h1>
                <p>Track uptime, response time & get instant alerts for your websites.</p>
                <button className="hero-button" onClick={() => navigate('/login')}>Get Started </button>
              </div>
            </section>

            <section id="features" className="features">
              <h2>Powerful Features</h2>
              <div className="features-grid">
                <div className="feature-card">
                  <FaCheckCircle className="icon" />
                  <h3>Uptime Monitoring</h3>
                  <p>Track your website's uptime 24/7 with accurate reporting.</p>
                </div>
                <div className="feature-card">
                  <FaCheckCircle className="icon" />
                  <h3>Instant Alerts</h3>
                  <p>Get notified instantly via Email when your site goes down.</p>
                </div>
                <div className="feature-card">
                  <FaCheckCircle className="icon" />
                  <h3>Response Time Charts</h3>
                  <p>Visualize how fast your site loads with graphs.</p>
                </div>
              </div>
            </section>
          </div>
          <div className="bottom-note">
            <p>© 2025 Website Monitoring Dashboard. All rights reserved.</p>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;
