import React, { useState } from "react";
import './Register.css';
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNotification } from "../../component/Notification/Notification";

function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [dialCode, setDialCode] = useState("+91");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e) => {
    e.preventDefault();

    if (!name || !email || !mobile || !password || !confirmPassword) {
      showNotification("Please fill in all the fields.", "error");
      return;
    }

    if (password !== confirmPassword) {
      showNotification("Passwords do not match.", "error");
      return;
    }

    if (mobile.length !== 10) {
      showNotification("Mobile number must be exactly 10 digits.", "error");
      return;
    }

    setLoading(true);
    try {
      const response = await fetch("http://localhost:5000/api/userauth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password, mobile, dial_code: dialCode })
      });
      const data = await response.json();

      if (response.ok) {
        showNotification("Registration successful! Please log in.", "success");
        navigate("/login");
      } else {
        showNotification(data.message || "Registration failed. Please try again.", "error");
      }
    } catch (error) {
      console.error("Registration error:", error);
      showNotification("Server error. Ensure backend is running.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="status">
        <div className="dot"></div>
        <span className="brand-name">Web Pulse</span>
      </div>

      <div className="register-container">
        <h2>Register</h2>
        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Full Name"
            required
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <div className="mobile-group">
            <select
              value={dialCode}
              onChange={(e) => setDialCode(e.target.value)}
            >
              <option value="+1">+1</option>
              <option value="+44">+44</option>
              <option value="+91">+91</option>
            </select>
            <input
              type="tel"
              placeholder="Mobile Number"
              required
              value={mobile}
              onChange={(e) => {
                const val = e.target.value.replace(/\D/g, "");
                if (val.length <= 10) setMobile(val);
              }}
            />
          </div>

          {/* Password Field with Toggle */}
          <div className="password-wrapper">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span
              className="toggle-password"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <div className="password-wrapper">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Confirm Password"
              required
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <span
              className="toggle-password"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            >
              {showConfirmPassword ? <FaEye /> : <FaEyeSlash />}
            </span>
          </div>

          <button type="submit">Register</button>
        </form>

        <p className="ptop-margin">Already have an account?</p>
        <Link to="/login" className="login-btn">Login</Link>
      </div>
    </>
  );
}

export default Register;
