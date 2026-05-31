import React, { useState } from 'react';
import './AddWebsite.css';
import { useNavigate } from "react-router-dom";
import Navbar from '../navbar/Navbar';
import { useNotification } from '../Notification/Notification';

function AddWebsite() {
  const navigate = useNavigate();   // ✅ FIXED navigate issue
  const { showNotification } = useNotification();

  const [url, setUrl] = useState('');
  const [email1, setEmail1] = useState('');
  const [email2, setEmail2] = useState('');
  const [email3, setEmail3] = useState('');
  const [name, setName] = useState('');
  const [interval, setInterval] = useState(2);

  const intervalLabels = [
    "1 minute", "5 minutes", "30 minutes",
    "1 hour", "12 hours", "24 hours"
  ];

  const shortLabels = ["1m", "5m", "30m", "1h", "12h", "24h"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !url.trim() || !email1.trim()) {
      showNotification("Please fill in all required fields marked with *", "error");
      return;
    }

    // Mapping interval index to minutes
    const intervalMap = [1, 5, 30, 60, 720, 1440];
    const intervalMinutes = intervalMap[interval];

    try {
      const response = await fetch("http://127.0.0.1:5000/api/websites/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify({
          name,
          url,
          interval_minutes: intervalMinutes,
          email1,
          email2,
          email3
        })
      });

      const data = await response.json();

      if (response.ok) {
        showNotification("Website added successfully!", "success");
        navigate("/listing");
      } else {
        showNotification(data.message || "Failed to add website.", "error");
      }
    } catch (error) {
      console.error("Add website error:", error);
      showNotification("Server error. Please try again later.", "error");
    }
  };


  return (
    <>
      <Navbar />

      <div className="wrapper">
        <div className="dashboard top-gap">
          <h2>Add Websites</h2>
          <main className="main-content">

            <form className="addweb-form" onSubmit={handleSubmit}>

              <div className="form-group">
                <label>Website Name<span className="required-star">*</span> :</label>
                <input
                  type="text"
                  placeholder="Name of website"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Website URL<span className="required-star">*</span> :</label>
                <input
                  type="url"
                  placeholder="https://"
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>Notify me in Email :</label>
                <input
                  type="email"
                  placeholder="Enter your email 1*"
                  value={email1}
                  onChange={(e) => setEmail1(e.target.value)}
                  required
                />
                <input
                  type="email"
                  placeholder="Enter your email 2"
                  value={email2}
                  onChange={(e) => setEmail2(e.target.value)}
                />
                <input
                  type="email"
                  placeholder="Enter your email 3"
                  value={email3}
                  onChange={(e) => setEmail3(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label className="monitor-title">Website Monitor Interval</label>
                <div className="monitor-desc">
                  Your websites will be checked every <b>{intervalLabels[interval]}</b>.
                </div>

                <div className="slider-container">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    value={interval}
                    className="slider"
                    onChange={(e) => setInterval(parseInt(e.target.value))}
                  />
                </div>

                <div className="labels">
                  {shortLabels.map((label, idx) => (
                    <span key={idx}>{label}</span>
                  ))}
                </div>
              </div>

              <div className="button-group">
                <button
                  type="submit"
                  className="create-btn"
                >
                  Create
                </button>
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => navigate("/listing")}
                >
                  Cancel
                </button>
              </div>
            </form>

          </main>
        </div>
      </div>
    </>
  );
}

export default AddWebsite;
