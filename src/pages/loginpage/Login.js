import React, { useState } from "react";
import './Login.css';
import { useNavigate, Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNotification } from "../../component/Notification/Notification";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();
  const { showNotification } = useNotification();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/userauth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password })
      });
      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("user", JSON.stringify(data.user));
        showNotification("Login successful!", "success");
        navigate("/listing");
      } else {
        showNotification(data.message || "Invalid credentials. Please try again.", "error");
      }
    } catch (error) {
      console.error("Login error:", error);
      showNotification("Oops! We couldn't connect to the server. Please try again later.", "error");
    }
  };

  return (
    <>

      <div className="status">
        <div className="dot"></div>
        Web Pulse
      </div>

      <div className="login-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

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

          <a 
            href="#" 
            className="forgot-password" 
            onClick={(e) => {
              e.preventDefault();
              showNotification("Forgot password feature is coming soon!", "info");
            }}
          >
            Forgot Password?
          </a>
          <button type="submit">Login</button>
        </form>

        <p className="ptop-margin">Don't have an account?</p>
        <Link to="/register" className="register-btn">Register</Link>
      </div>
    </>
  );
}

export default Login;
