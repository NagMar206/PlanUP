import React from "react";
import "../Style/Footer.css";

function Footer() {
  return (
    <footer className="footer">
      <div className="footer-content">
        <div className="footer-section-container">
          <div className="footer-section contact">
            <p>📧 <a href="mailto:info@planup.hu">info@planup.hu</a></p>
          </div>
          
        </div>
      </div>
      
      <div className="footer-bottom">
        <p>&copy; {new Date().getFullYear()} PlanUp. Minden jog fenntartva.</p>
      </div>
    </footer>
  );
}

export default Footer;