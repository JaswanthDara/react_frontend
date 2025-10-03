import React from "react";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHelmetSafety } from "@fortawesome/free-solid-svg-icons";

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Left Section */}
        <div className="footer-section footer-about">
          <h3>
            <FontAwesomeIcon icon={faHelmetSafety} className="footer-icon" />{" "}
            Site Safety Monitor
          </h3>
          <p>
            A Construction Site Safety Management System for monitoring incidents, managing
            equipment, tracking hazards, and ensuring workplace safety compliance.
          </p>
        </div>

        {/* Center Section  */}
        <div className="footer-section footer-links">
          <h4>Quick Links</h4>
          <ul>
            <li><Link to="/incidents">Incidents</Link></li>
            <li><Link to="/equipment">Equipment</Link></li>
            <li><Link to="/hazards">Hazards</Link></li>
            <li><Link to="/gearlogs">Gear Logs</Link></li>
            <li><Link to="/tasks">Tasks</Link></li>
            <li><Link to="/profile">Profile</Link></li>
          </ul>
        </div>

        {/* Right Section  */}
        <div className="footer-section footer-contact">
          <h4>Contact Us</h4>
          <p>Email: <a href="mailto:support@safety-system.com">support@safety-system.com</a></p>
          <p>Phone: +1 (555) 123-4567</p>
          <p>Address: 123 Safety Ave, Workplace City</p>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="footer-bottom">
        <p>© {new Date().getFullYear()} Site Safety Monitor. All rights reserved.</p>
      </div>
    </footer>
  );
};

export default Footer;
