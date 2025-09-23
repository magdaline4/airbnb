import React from "react";
import "./Footer.scss";
import { FaGlobe } from "react-icons/fa";
import { FaFacebookF, FaInstagram } from "react-icons/fa6";
import { FaXTwitter } from "react-icons/fa6";

const Footer = () => {
  return (
    <footer className="footer">
      {/* Top Links */}
      <div className="footer-top">
        <h3 className="footer-title">Inspiration for future getaways</h3>
        <div className="footer-columns">
          {/* Column 1 */}
          <div className="footer-column">
            <h4>Support</h4>
            <ul>
              <li><a href="#">Help Centre</a></li>
              <li><a href="#">Get help with a safety issue</a></li>
              <li><a href="#">AirCover</a></li>
              <li><a href="#">Anti-discrimination</a></li>
              <li><a href="#">Disability support</a></li>
              <li><a href="#">Cancellation options</a></li>
              <li><a href="#">Report neighbourhood concern</a></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div className="footer-column">
            <h4>Hosting</h4>
            <ul>
              <li><a href="#">Airbnb your home</a></li>
              <li><a href="#">Airbnb your experience</a></li>
              <li><a href="#">Airbnb your service</a></li>
              <li><a href="#">AirCover for Hosts</a></li>
              <li><a href="#">Hosting resources</a></li>
              <li><a href="#">Community forum</a></li>
              <li><a href="#">Hosting responsibly</a></li>
              <li><a href="#">Join a free Hosting class</a></li>
              <li><a href="#">Find a co-host</a></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="footer-column">
            <h4>Airbnb</h4>
            <ul>
              <li><a href="#">2025 Summer Release</a></li>
              <li><a href="#">Newsroom</a></li>
              <li><a href="#">Careers</a></li>
              <li><a href="#">Investors</a></li>
              <li><a href="#">Airbnb.org emergency stays</a></li>
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Section */}
      <div className="footer-bottom">
        <div className="footer-left">
          © 2025 Airbnb, Inc. · 
          <a href="#">Privacy</a> · 
          <a href="#">Terms</a> · 
          <a href="#">Sitemap</a> · 
          <a href="#">Company details</a>
        </div>
        <div className="footer-right">
          <div className="lang"><FaGlobe /> English (IN)</div>
          <div className="currency">₹ INR</div>
          <div className="social-icons">
            <a href="#"><FaFacebookF /></a>
            <a href="#"><FaXTwitter /></a>
            <a href="#"><FaInstagram /></a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
