import React, { useState, useEffect } from 'react';
import '../Add_website/AddWebsite.css';

import { useNavigate, useParams } from "react-router-dom";
import Navbar from '../navbar/Navbar';
import { useNotification } from '../Notification/Notification';

function EditWebsite() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { showNotification } = useNotification();

  const [url, setUrl] = useState('');
  const [name, setName] = useState('');
  const [email1, setEmail1] = useState('');
  const [email2, setEmail2] = useState('');
  const [email3, setEmail3] = useState('');
  const [interval, setInterval] = useState(1); // Default to 5m index
  const [loading, setLoading] = useState(true);

  const intervalLabels = ["1 minute", "5 minutes", "30 minutes", "1 hour", "12 hours", "24 hours"];
  const shortLabels = ["1m", "5m", "30m", "1h", "12h", "24h"];
  const intervalMap = [1, 5, 30, 60, 720, 1440];

  useEffect(() => {
    fetchWebsiteData();
  }, [id]);

  const fetchWebsiteData = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/websites/${id}`, {
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      if (response.ok) {
        const data = await response.json();
        
        setName(data.name);
        setUrl(data.url);
        
        // Pre-fill emails from DB, or fallback to user email if first one is empty
        const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
        setEmail1(data.email1 || storedUser.email || '');
        setEmail2(data.email2 || '');
        setEmail3(data.email3 || '');

        const index = intervalMap.indexOf(data.interval_minutes);
        if (index !== -1) setInterval(index);

        setLoading(false);
      } else {
        const err = await response.json();
        showNotification(`Error (${response.status}): ${err.message || "Failed to fetch data"}`, "error");
        navigate("/listing");
      }

    } catch (error) {
      console.error("Fetch error:", error);
      showNotification("Network error: Cannot reach server.", "error");
      navigate("/listing");
    }

  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!name.trim() || !url.trim() || (!email1.trim() && !email2.trim() && !email3.trim())) {
      showNotification("Please fill in the website name, URL, and at least one email address.", "error");
      return;
    }

    const intervalMinutes = intervalMap[interval];

    try {
      const response = await fetch(`http://127.0.0.1:5000/api/websites/${id}`, {
        method: "PUT",

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

      if (response.ok) {
        showNotification("Website updated successfully!", "success");
        navigate("/listing");
      } else {
        const data = await response.json();
        showNotification(data.message || "Failed to update website.", "error");
      }
    } catch (error) {
      console.error("Update error:", error);
      showNotification("Server error.", "error");
    }
  };

  if (loading) return <div className="loading-state">Loading...</div>;

  return (
    <>
      <Navbar />
      <div className="wrapper">
        <div className="dashboard top-gap">
          <main className="main-content">
            <form className="addweb-form" onSubmit={handleSubmit}>
              <h2>Edit Website</h2>
              <div className="card">

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

                <button type="submit" className="create-btn">Update Website</button>
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

export default EditWebsite;
