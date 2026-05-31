// src/pages/ContactUs.js
import React, { useState } from 'react';
import Navbar from '../navbar/Navbar';
import { useNavigate } from 'react-router-dom';
import { useNotification } from "../Notification/Notification";
import './Contact.css';

const ContactUs = () => {
  const { showNotification } = useNotification();
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      showNotification("Please fill in all required fields marked with *", "error");
      return;
    }

    // Replace this with your backend API or form handler
    showNotification("Message submitted successfully!", "success");
    setFormData({ name: '', email: '', message: '' });
  };

  return (
    <>
      <Navbar />
      <div className="wrapper">
        <div className="dashboard top-gap">
          <div className="contact-container">
            <h2>Contact Us</h2>
            <p>Any questions or remarks? Just write us a message!</p>
            <form onSubmit={handleSubmit}>
              <input type="text" name="name" placeholder="Your Name *" required value={formData.name} onChange={handleChange} />

              <input type="email" name="email" placeholder="Your Email *" required value={formData.email} onChange={handleChange} />

              <textarea name="message" rows="5" placeholder="Your Message *" required value={formData.message} onChange={handleChange}></textarea>

              <button type="submit">Send Message</button>
            </form>

            <div className="contact-info">
              <p><strong>Email:</strong> support@webpulse.com</p>
              <p><strong>Phone:</strong> +91 9876543210</p>
              <p><strong>Address:</strong>  India</p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ContactUs;
