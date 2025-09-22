import React from "react";
import "./Footer.scss";
import { FaFacebook, FaInstagram } from "react-icons/fa";
import { MdLanguage } from "react-icons/md" ;

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer__top">
        <h3>Inspiration for future getaways</h3>
        <div className="footer__columns">
          {/* Support */}
          <div className="footer__col">
            <h4>Support</h4>
            <ul>
              <li>Help Centre</li>
              <li>Get help with a safety issue</li>
              <li>AirCover</li>
              <li>Anti-discrimination</li>
              <li>Disability support</li>
              <li>Cancellation options</li>
              <li>Report neighbourhood concern</li>
            </ul>
          </div>

          {/* Hosting */}
          <div className="footer__col">
            <h4>Hosting</h4>
            <ul>
              <li>Airbnb your home</li>
              <li>Airbnb your experience</li>
              <li>Airbnb your service</li>
              <li>AirCover for Hosts</li>
              <li>Hosting resources</li>
              <li>Community forum</li>
              <li>Hosting responsibly</li>
              <li>Join a free Hosting class</li>
              <li>Find a co-host</li>
            </ul>
          </div>

          {/* Airbnb */}
          <div className="footer__col">
            <h4>Airbnb</h4>
            <ul>
              <li>2025 Summer Release</li>
              <li>Newsroom</li>
              <li>Careers</li>
              <li>Investors</li>
              <li>Airbnb.org emergency stays</li>
            </ul>
          </div>
        </div>
      </div>

      <div className="footer__bottom">
        <p>© 2025 Airbnb, Inc. · Privacy · Terms · Sitemap · Company details</p>

        <div className="footer__options">
          <span><MdLanguage /> English (IN)</span>
          <span>₹ INR</span>
          <a href="#"><FaFacebook /></a>
          <a href="#"><FaInstagram /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
