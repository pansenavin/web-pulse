import React, { useState } from "react";
import "./Navbar.css";
import { Link } from "react-router-dom";
import { useNotification } from "../Notification/Notification";

function Navbar() {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const { showNotification } = useNotification();

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    showNotification("Logged out successfully", "info");
    closeDropdown();
  };

  return (
    <>
      <nav className="navbar">
        <div className="logo">
          <Link to="/">
            <img src="/logo2.png" alt="Logo" className="logo-img" title="WebPulse" />
          </Link>
        </div>

        <ul className="nav-links">
          <li><Link to="/Dashboard">Dashboard</Link></li>
          <li><Link to="/listing">Website</Link></li>
          <li><Link to="/contact">Contact US</Link></li>
          <li className="profile-container">
            <i
              className="fas fa-user-circle profile-icon"
              onClick={toggleDropdown}
            ></i>
            {dropdownOpen && (
              <ul className="dropdown-menu" onMouseLeave={closeDropdown}>
                <li><Link to="/detail">Account Info</Link></li>
                <li><Link to="/login" onClick={handleLogout}>Log Out</Link></li>
              </ul>
            )}
          </li>
        </ul>
      </nav>
    </>
  );
}


export default Navbar;
