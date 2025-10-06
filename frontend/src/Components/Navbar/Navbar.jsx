import React, { useState, useEffect, useContext } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Navbar.scss";
import { FaGlobe, FaBars, FaSearch } from "react-icons/fa";
import FiltersModal from "../FiltersModal/FiltersModal";
import { getFilterCount } from '../FiltersModal/filterUtils.js';
 
// Default icons
import HomeImg from "../../assets/Images/home.avif";
import ExperImg from "../../assets/Images/experience.avif";
import ServeImg from "../../assets/Images/service.avif";
 
// Active state icons
import NewHomeImg from "../../assets/Images/Homeopen.avif";
import NewExperImg from "../../assets/Images/experinenceopen.avif";
import NewServeImg from "../../assets/Images/servieceopen.avif";
 
// Videos
import HomeVideo from "../../assets/videos/house-selected.webm";
import ExperVideo from "../../assets/videos/balloon-selected.webm";
import ServeVideo from "../../assets/videos/consierge-selected.webm";
import { FiltersContext } from "../Context/FiltersContext.jsx";

// Constants
const LOGO_URL = "https://upload.wikimedia.org/wikipedia/commons/6/69/Airbnb_Logo_B%C3%A9lo.svg";
 
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

  // State declarations - ALL AT THE TOP
  const [active, setActive] = useState(null);
  const [playing, setPlaying] = useState(null);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [imageErrors, setImageErrors] = useState({});
  const [showFilterButton, setShowFilterButton] = useState(false); // ✅ FIXED: Added this state
  const [isFilterModalOpen, setIsFilterModalOpen] = useState(false);
  
  
  const {filters, setFilters}= useContext(FiltersContext)

  // Calculate the total count of active filters
  const filterCount = getFilterCount(filters);
    
  // Set filter button based on current page
  useEffect(() => {
    if (location.pathname === '/') {
      setShowFilterButton(false);
    } else {
      setShowFilterButton(true);
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
 
  // Search functionality - navigates to rooms page
  const handleSearchClick = () => {
    navigate("/rooms");
  };

  const handleHostClick = () => {
    navigate("/host/onboarding");
    setIsMenuOpen(false);
  };
 
  const handleLogoClick = () => {
    navigate('/');
  };
 
  const handleLanguageClick = () => {
    console.log('Language selector clicked');
  };
 
  const handleLogoError = () => {
    console.warn('Logo image failed to load');
  };
 
  // Handle image loading errors
  const handleImageError = (itemKey) => {
    setImageErrors(prev => ({ ...prev, [itemKey]: true }));
  };
 
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
          onError={() => setPlaying(null)}
        >
          <source src={item.video} type="video/webm" />
        </video>
      );
    }
 
    const imageSrc = active === item.key ? item.activeImg : item.defaultImg;
    const hasError = imageErrors[item.key];
 
    return (
      <img
        src={hasError ? item.defaultImg : imageSrc}
        alt={`${item.label} icon`}
        style={{ width: '24px', height: '24px' }}
        onError={() => handleImageError(item.key)}
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
 
  // Handle keyboard navigation
  const handleKeyDown = (event, action) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      action();
    }
  };
 
  return (
    <div className="navbar-wrapper">
      <nav className="navbar">
        {/* Logo */}
        <div className="logo-section">
          <img
            src={LOGO_URL}
            alt="Airbnb logo"
            className="logo"
            onClick={handleLogoClick}
            onError={handleLogoError}
            style={{ cursor: 'pointer' }}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => handleKeyDown(e, handleLogoClick)}
          />
        </div>
 
        {/* Show navigation items only on home page */}
        {!showFilterButton && (
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
        )}
 
        {/* Show search box and filters on rooms page */}
        {showFilterButton && (
          <div className="search-box-section">
            <div className="search-box">
              <div className="search-item">
                <span className="search-label">Anywhere</span>
              </div>
              <div className="search-item">
                <span className="search-label">Any week</span>
              </div>
              <div className="search-item noborder">
                <span className="search-label">Add guests</span>
              </div>
              <button className="search-btn" type="button">
                <FaSearch />
              </button>
            </div>
 
            <div className="filter-section">
              <button 
                className="filter-btn" 
                onClick={() => setIsFilterModalOpen(true)}
              >
                <svg 
                  viewBox="0 0 16 16" 
                  xmlns="http://www.w3.org/2000/svg" 
                  style={{ height: '14px', width: '14px' }}
                >
                  <path d="M5 8c1.306 0 2.418.835 2.83 2H14v2H7.829A3.001 3.001 0 1 1 5 8zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2zm6-8a3 3 0 1 1-2.829 4H2V4h6.171A3.001 3.001 0 0 1 11 2zm0 2a1 1 0 1 0 0 2 1 1 0 0 0 0-2z"></path>
                </svg>
                <span>Filters</span>
                {filterCount > 0 && (
                  <span className="filter-badge">{filterCount}</span>
                )}
              </button>
            </div>
          </div>
        )}
 
        {/* Right Side Actions */}
        <div className="right-actions">
          {/* Language Selector */}
          <div className="language-wrapper">
            <button
              className="language-btn"
              type="button"
              onClick={handleLanguageClick}
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
      </nav>
 
      {/* Search Box - Only show on home page */}
      {!showFilterButton && (
        <div className="search-box" onClick={handleSearchClick}>
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
 
      {/* Filters Modal - Single instance */}
      <FiltersModal
        isOpen={isFilterModalOpen}  
        onClose={() => setIsFilterModalOpen(false)}  
        filters={filters}
        setFilters={setFilters}
      />
    </div>
  );
};

export default Navbar;