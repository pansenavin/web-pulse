import React, { useState, useEffect } from 'react';
import Navbar from '../navbar/Navbar';
import { Link } from "react-router-dom";
import { useNotification } from '../Notification/Notification';
import './Listing.css';

const Listing = () => {

  const [websites, setWebsites] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteId, setDeleteId] = useState(null); // ID of website to delete
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchWebsites();
  }, []);

  const fetchWebsites = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/websites/list", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setWebsites(data);
      } else {
        const errData = await response.json();
        console.error("Fetch failed:", errData);
        if (response.status === 401) {
          showNotification("Session expired. Please login again.", "error");
        }
      }
    } catch (error) {
      console.error("Error fetching websites:", error);
      showNotification("Failed to connect to backend server.", "error");
    }

  };

  const togglePause = async (id) => {
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/websites/toggle-pause/${id}`, {
        method: "PATCH",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.ok) {
        fetchWebsites();
        setOpenMenuId(null);
      } else {
        showNotification("Failed to update status", "error");
      }
    } catch (error) {
      console.error("Toggle pause error:", error);
      showNotification("Error toggling status", "error");
    }
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    
    try {
      const response = await fetch(`http://127.0.0.1:5000/api/websites/${deleteId}`, {
        method: "DELETE",
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });

      if (response.ok) {
        showNotification("Website deleted successfully", "info");
        setDeleteId(null);
        fetchWebsites();
      } else {
        const errData = await response.json();
        showNotification(errData.message || "Failed to delete website", "error");
        setDeleteId(null); // Close even on fail to avoid getting stuck
      }
    } catch (error) {
      showNotification("Error deleting website", "error");
      setDeleteId(null);
    }
  };

  const deleteWebsite = (id) => {
    setDeleteId(id);
    setOpenMenuId(null);
  };

  const toggleMenu = (id) => {
    setOpenMenuId(prev => (prev === id ? null : id));
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the click is not inside a menu container, close the open menu
      if (!event.target.closest('.menu-container')) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredMonitors = websites.filter((monitor) => {
    const matchesSearch = monitor.url.toLowerCase().includes(searchTerm.toLowerCase()) ||
      monitor.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === '' || monitor.last_status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const stats = {
    up: websites.filter(w => w.last_status === 'up').length,
    down: websites.filter(w => w.last_status === 'down').length,
    paused: websites.filter(w => w.is_paused).length
  };


  return (
    <>
      <Navbar />
      <div className="wrapper">
        <div className="dashboard top-gap">
          <main className="main-content">
            <header className="page-header">
              <h1>Website Listing</h1>
            </header>
            <header className="dashboard-header">
              <div className="controls-with-status">
                <div className="controls">
                  <input
                    type="text"
                    placeholder="Search by URL, Name..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <select
                    className="filter-select"
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="">All</option>
                    <option value="up">Up</option>
                    <option value="down">Down</option>
                  </select>
                  <Link to="/monitor" className="add-button">+ Add Website</Link>
                </div>
                <div className="status-widget">
                  <div className="status-header">
                    <div className="status-circle">⬆</div>
                    <h3>Current Status</h3>
                  </div>
                  <p>{stats.up} Up, {stats.down} Down, {stats.paused} Paused</p>

                </div>
              </div>
            </header>


            <section className="monitor-list">
              {filteredMonitors.length === 0 ? (
                <div className="no-data">
                  <h3>No websites found</h3>
                  <p>Click "+ Add Website" to start monitoring.</p>
                </div>
              ) : (
                filteredMonitors.map((monitor) => (
                  <div className={`monitor-card ${monitor.is_paused ? 'paused-opacity' : ''}`} key={monitor.id}>
                    {/* ... rest of the card content ... */}
                    <div className="monitor-info name-url-combined">
                      <div className={`status-dot ${monitor.is_paused ? 'paused' : monitor.last_status}`}></div>
                      <div className="text-info">
                        <Link to={`/webDetail/${monitor.id}`} style={{ textDecoration: 'none', color: 'inherit' }}>
                          <strong>{monitor.name}</strong>
                        </Link>
                        <span className="url-text-inline">{monitor.url}</span>
                      </div>
                    </div>
                    <p className="status-text">
                      {monitor.is_paused ? 'Paused' : (monitor.last_status === 'up' ? 'Up' : 'Down')}
                      {monitor.last_check_time && <small> - Checked {new Date(monitor.last_check_time).toLocaleTimeString()}</small>}
                    </p>

                    <div className='time-set'>
                      <span>{monitor.interval_minutes} min</span>
                    </div>
                    <div className="monitor-meta">
                      <div className="uptime-bar">
                        <div className="uptime-fill"
                          style={{
                            width: `${monitor.uptime_pct}%`,
                            backgroundColor: monitor.last_status === 'up' ? '#00ff88' : (monitor.last_status === 'down' ? 'red' : '#999')
                          }}
                        ></div>
                      </div>
                      <span>{monitor.uptime_pct}%</span>
                    </div>

                    <div className="menu-container">
                      <button className="menu-button" onClick={() => toggleMenu(monitor.id)}>
                        &#8942;
                      </button>
                      {openMenuId === monitor.id && (
                        <div className="menu-dropdown">
                          <div className="menu-item" onClick={() => togglePause(monitor.id)}>
                            {monitor.is_paused ? 'Resume' : 'Pause'}
                          </div>
                          <div className="menu-item"><Link to={`/monitor/edit/${monitor.id}`} style={{ color: 'inherit', textDecoration: 'none' }}>Edit</Link></div>
                          <div className="menu-item delete" onClick={() => deleteWebsite(monitor.id)}>Delete</div>
                        </div>
                      )}
                    </div>
                  </div>
                ))
              )}


            </section>
          </main>
        </div>
      </div>
      {/* Custom Delete Confirmation Modal */}
      {deleteId && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-icon">⚠️</div>
            <h2>Delete Website?</h2>
            <p>This action cannot be undone. Are you sure you want to remove <b>{websites.find(w => w.id === deleteId)?.name}</b>?</p>
            <div className="modal-actions">
              <button className="confirm-btn" onClick={confirmDelete}>Yes, Delete</button>
              <button className="cancel-btn" onClick={() => setDeleteId(null)}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default Listing;
