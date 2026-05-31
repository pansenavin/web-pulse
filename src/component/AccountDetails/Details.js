import React, { useState, useEffect } from "react";
import "./Details.css";
import Navbar from '../navbar/Navbar';
import { useNavigate, Link } from "react-router-dom";
import { useNotification } from "../Notification/Notification";


function AccountDetails() {
  const [userData, setUserData] = useState({ name: "", email: "", dial_code: "+91", mobile: "" });
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const { showNotification } = useNotification();

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const response = await fetch("http://127.0.0.1:5000/api/userauth/profile", {
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        }
      });
      if (response.ok) {
        const data = await response.json();
        setUserData({
          name: data.name,
          email: data.email,
          dial_code: data.dial_code || "+91",
          mobile: data.mobile || ""
        });
      } else {
        const err = await response.json();
        showNotification(`Failed to fetch Profile: ${err.message || "Unknown error"}`, "error");
      }

      setLoading(false);
    } catch (error) {
      console.error("Fetch profile error:", error);
      showNotification("Network Error: Could not reach the server.", "error");
      setLoading(false);
    }
  };


  const handleSave = async () => {
    if (userData.mobile && userData.mobile.length !== 10) {
      showNotification("Mobile number must be exactly 10 digits.", "error");
      return;
    }
    
    try {
      const payload = {
        name: userData.name,
        dial_code: userData.dial_code,
        mobile: userData.mobile
      };

      const response = await fetch("http://127.0.0.1:5000/api/userauth/profile", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        },
        body: JSON.stringify(payload)
      });
      if (response.ok) {
        showNotification("Profile updated successfully!", "success");
        setIsEditing(false);
      } else {
        showNotification("Failed to update profile.", "error");
      }
    } catch (error) {
      showNotification("Network Error: Failed to update profile.", "error");
    }
  };

  if (loading) return <div className="loading-state">Loading Profile...</div>;

  return (
    <>
      <Navbar />
      <div className="wrapper">
        <div className="page-wrapper top-gap">
          <div className="account-container">
            <h2>Account Details</h2>
            <div className="card">
              <div className="form-group">
                <label>Full Name</label>
                {isEditing ? (
                  <input
                    type="text"
                    placeholder="Enter your full name"
                    value={userData.name}
                    onChange={(e) => setUserData({ ...userData, name: e.target.value })}
                  />
                ) : (
                  <div className="info-display">{userData.name}</div>
                )}
              </div>

              <div className="form-group">
                <label>E-mail Address</label>
                <div className="info-display readonly">{userData.email}</div>
              </div>

              <div className="form-group">
                <label>Mobile No.</label>
                {isEditing ? (
                  <div className="mobile-group">
                    <select
                      value={userData.dial_code}
                      onChange={(e) => setUserData({ ...userData, dial_code: e.target.value })}
                    >
                      <option value="+1">+1</option>
                      <option value="+44">+44</option>
                      <option value="+91">+91</option>
                    </select>
                    <input
                      type="text"
                      placeholder="Enter 10-digit mobile"
                      value={userData.mobile}
                      onChange={(e) => {
                        const val = e.target.value.replace(/\D/g, ""); // Only numbers
                        if (val.length <= 10) {
                          setUserData({ ...userData, mobile: val });
                        }
                      }}
                    />
                  </div>
                ) : (
                  <div className="info-display">
                    {userData.mobile ? `${userData.dial_code} ${userData.mobile}` : "Not Set"}
                  </div>
                )}
              </div>


              <div className="button-group" style={{ marginTop: '20px' }}>
                {isEditing ? (
                  <>
                    <button className="save-btn" onClick={handleSave}>
                      Save changes
                    </button>
                    <button className="cancel-btn" onClick={() => setIsEditing(false)} style={{ marginLeft: '10px', padding: '10px 20px', backgroundColor: '#666', color: '#white', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
                      Cancel
                    </button>
                  </>
                ) : (
                  <button className="edit-trigger-btn" onClick={() => setIsEditing(true)} style={{ padding: '10px 20px', backgroundColor: '#4CAF50', color: 'white', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>
                    Edit Profile
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
export default AccountDetails;

