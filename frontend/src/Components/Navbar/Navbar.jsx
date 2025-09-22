import React, { useState, useRef, useEffect } from "react";
import "./Navbar.scss";
import { FaSearch, FaGlobe, FaBars, FaQuestionCircle } from "react-icons/fa";

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  // Close when clicking outside or pressing Escape
  useEffect(() => {
    const handlePointerDown = (e) => {
      // composedPath covers shadow DOM / portals better than contains in some cases
      const path = e.composedPath ? e.composedPath() : (e.path || []);
      const clickedInside = menuRef.current && (menuRef.current.contains(e.target) || path.indexOf?.(menuRef.current) > -1);
      if (!clickedInside) setMenuOpen(false);
    };

    const handleKeyDown = (e) => {
      if (e.key === "Escape") setMenuOpen(false);
    };

    document.addEventListener("pointerdown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("pointerdown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const toggleMenu = () => setMenuOpen((v) => !v);

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        <div className="navbar__logo">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg"
            alt="logo"
          />
        </div>

        <ul className="navbar__menu">
          <li>
            <img src="https://img.icons8.com/ios-filled/30/000000/home.png" alt="Homes" />
            <span>Homes</span>
          </li>
          <li>
            <img src="https://img.icons8.com/emoji/30/000000/hot-air-balloon.png" alt="Experiences" />
            <span>Experiences</span>
            <span className="new">NEW</span>
          </li>
          <li className="active">
            <img src="https://img.icons8.com/ios/30/000000/service-bell.png" alt="Services" />
            <span>Services</span>
            <span className="new">NEW</span>
            <div className="underline"></div>
          </li>
        </ul>

        <div className="navbar__right">
          <span className="host">Become a host</span>
          <button className="icon-btn" type="button" aria-label="Language">
            <FaGlobe />
          </button>

          {/* menu wrapper must include button + dropdown so outside clicks detect correctly */}
          <div className="menu-wrapper" ref={menuRef}>
            <button
              className="icon-btn"
              type="button"
              aria-haspopup="true"
              aria-expanded={menuOpen}
              onClick={toggleMenu}
            >
              <FaBars />
            </button>

            {/* render conditionally for simpler CSS logic */}
            {menuOpen && (
              <div className="dropdown" role="menu" aria-label="User menu">
                <ul>
                  <li>
                    <FaQuestionCircle className="icon" />
                    <span>Help Centre</span>
                  </li>
                  <hr />
                  <li>
                    <div>
                      <p className="bold">Become a host</p>
                      <p className="small">It’s easy to start hosting and earn extra income.</p>
                    </div>
                  </li>
                  <hr />
                  <li>Refer a host</li>
                  <li>Find a co-host</li>
                  <li>Log in or sign up</li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </nav>

      {/* Search (unchanged) */}
      <div className="search-box">
        <div className="search-item">
          <p className="title">Where</p>
          <p className="subtitle">Search destinations</p>
        </div>
        <div className="divider"></div>
        <div className="search-item">
          <p className="title">Check in</p>
          <p className="subtitle">Add dates</p>
        </div>
        <div className="divider"></div>
        <div className="search-item">
          <p className="title">Check out</p>
          <p className="subtitle">Add dates</p>
        </div>
        <div className="divider"></div>
        <div className="search-item">
          <p className="title">Who</p>
          <p className="subtitle">Add guests</p>
        </div>
        <button className="search-btn" type="button"><FaSearch /></button>
      </div>
    </div>
  );
};

export default Navbar;
