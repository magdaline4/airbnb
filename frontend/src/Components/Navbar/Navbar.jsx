import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.scss";
import { FaGlobe, FaBars, FaSearch } from "react-icons/fa";
import { MdFilterList } from "react-icons/md";
import FiltersModal from "../FiltersModal/FiltersModal";

// Default icons
import HomeImg from "../../assets/Images/home.avif";
import ExperImg from "../../assets/Images/experience.avif";
import ServeImg from "../../assets/Images/service.avif";

// New icons after video
import NewHomeImg from "../../assets/Images/Homeopen.avif";
import NewExperImg from "../../assets/Images/experinenceopen.avif";
import NewServeImg from "../../assets/Images/servieceopen.avif";

// Videos
import HomeVideo from "../../assets/videos/house-selected.webm";
import ExperVideo from "../../assets/videos/balloon-selected.webm";
import ServeVideo from "../../assets/videos/consierge-selected.webm";

// Constants
const NAV_ITEMS = {
  HOME: {
    key: 'home',
    label: 'Homes',
    path: '/',
    defaultImg: HomeImg,
    activeImg: NewHomeImg,
    video: HomeVideo
  },
  EXPERIENCES: {
    key: 'experiences',
    label: 'Experiences',
    path: '/experiences',
    defaultImg: ExperImg,
    activeImg: NewExperImg,
    video: ExperVideo
  },
  SERVICES: {
    key: 'services',
    label: 'Services',
    path: '/services',
    defaultImg: ServeImg,
    activeImg: NewServeImg,
    video: ServeVideo
  }
};

const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [active, setActive] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [showFilterButton, setShowFilterButton] = useState(false);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Set filter button based on current page
  useEffect(() => {
    if (location.pathname === '/rooms') {
      setShowFilterButton(true);
    } else {
      setShowFilterButton(false);
    }
  }, [location.pathname]);

  const handleNavClick = (item) => {
    setActive(item.key);
    setPlaying(item.key);
    navigate(item.path);
  };

  const handleMenuToggle = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleFilterClick = () => {
    setIsFilterOpen(true);
  };

  // Search functionality - toggles filter button state
  const handleSearchClick = () => {
    setShowFilterButton(prev => !prev);
    navigate("/rooms");
  };

  // Room search functionality - toggles filter button state
  const handleRoomSearchClick = () => {
    setShowFilterButton(prev => !prev);
    navigate("/rooms");
  };

  const handleHostClick = () => {
    navigate("/host/onboarding");
    setIsMenuOpen(false);
  };

  // Check if current page is home
  const isHomePage = location.pathname === '/';

  // Helper function to render icon based on state
  const renderIcon = (item) => {
    if (playing === item.key) {
      return (
        <video
          autoPlay
          muted
          loop
          onEnded={() => setPlaying(null)}
          style={{ width: '24px', height: '24px' }}
        >
          <source src={item.video} type="video/webm" />
        </video>
      );
    }
    
    return (
      <img
        src={active === item.key ? item.activeImg : item.defaultImg}
        alt={`${item.label} icon`}
        style={{ width: '24px', height: '24px' }}
      />
    );
  };

  // Helper function to check if path is active
  const isActivePath = (path) => {
    if (path === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        {/* Logo */}
        <div className="logo-section">
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg"
            alt="Airbnb"
            className="logo"
          />
        </div>

        {/* Navigation Items */}
        <div className="nav-items">
          {Object.values(NAV_ITEMS).map((item) => (
            <button
              key={item.key}
              className={`nav-item ${isActivePath(item.path) ? 'active' : ''}`}
              onClick={() => handleNavClick(item)}
              onMouseEnter={() => setActive(item.key)}
              onMouseLeave={() => setActive(null)}
              type="button"
              aria-label={`Navigate to ${item.label}`}
            >
              {renderIcon(item)}
              <span className="nav-label">{item.label}</span>
            </button>
          ))}
        </div>

        {/* Right Side Actions */}
        <div className="right-actions">
          {/* Language Selector */}
          <div className="language-wrapper">
            <button
              className="language-btn"
              type="button"
              aria-label="Select language"
            >
              <FaGlobe aria-hidden="true" />
            </button>
          </div>

          {/* User Menu */}
          <div className="menu-wrapper">
            <button
              className="icon-btn"
              type="button"
              onClick={handleMenuToggle}
              aria-label="Open user menu"
              aria-expanded={isMenuOpen}
            >
              <FaBars aria-hidden="true" />
            </button>

            {isMenuOpen && (
              <div className="dropdown" role="menu" aria-label="User menu">
                <ul>
                  <li role="menuitem">
                    <span className="icon">👤</span>
                    <div>
                      <div className="bold">Sign up</div>
                      <div className="small">Create an account</div>
                    </div>
                  </li>
                  <li role="menuitem">
                    <span className="icon">🔑</span>
                    <div>
                      <div className="bold">Log in</div>
                      <div className="small">Access your account</div>
                    </div>
                  </li>
                  <hr />
                  <li role="menuitem" onClick={handleHostClick} style={{ cursor: 'pointer' }}>
                    <span className="icon">🏠</span>
                    <div className="bold">Host your home</div>
                  </li>
                  <li role="menuitem">
                    <span className="icon">🎯</span>
                    <div className="bold">Host an experience</div>
                  </li>
                  <li role="menuitem">
                    <span className="icon">🆘</span>
                    <div className="bold">Help</div>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Filter Button */}
        {showFilterButton && (
          <div className="filter-section">
            <button
              className="filter-btn"
              onClick={handleFilterClick}
              type="button"
              aria-label="Open filters"
            >
              <MdFilterList />
              <span>Filters</span>
            </button>
          </div>
        )}
      </nav>

      {/* Search Box - Only show on home page */}
      {isHomePage && (
        <div className="search-box" onClick={handleRoomSearchClick}>
          <div className="search-item">
            <span className="search-label">Where</span>
            <span className="search-placeholder">Search destinations</span>
          </div>
          <div className="search-item">
            <span className="search-label">Check in</span>
            <span className="search-placeholder">Add dates</span>
          </div>
          <div className="search-item">
            <span className="search-label">Check out</span>
            <span className="search-placeholder">Add dates</span>
          </div>
          <div className="search-item">
            <span className="search-label">Who</span>
            <span className="search-placeholder">Add guests</span>
          </div>
          <button className="search-btn" type="button">
            <FaSearch />
          </button>
        </div>
      )}

      {/* Filters Popup */}
      <FiltersModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </div>
  );
};

export default Navbar;
