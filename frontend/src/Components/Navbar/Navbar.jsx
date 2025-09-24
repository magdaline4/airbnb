import React, { useState } from "react";
import "./Navbar.scss";
import { FaSearch, FaGlobe, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom"; 

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

const Navbar = () => {
  const [active, setActive] = useState(null);
  const [playing, setPlaying] = useState(null);
  const navigate = useNavigate(); // ✅ Hook for navigation

  const handleClick = (name) => {
    setActive(name);
    setPlaying(name);
  };

  const handleVideoEnd = (name) => {
    if (active === name) {
      setPlaying(null);
    }
  };

  const renderIcon = (name, defaultImg, newImg, videoSrc) => {
    if (playing === name) {
      return (
        <video
          src={videoSrc}
          autoPlay
          muted
          onEnded={() => handleVideoEnd(name)}
          className="icon-video"
        />
      );
    }

    if (active === name) {
      return <img src={newImg} alt={name} />;
    }

    return <img src={defaultImg} alt={name} />;
  };

  // ✅ When search icon is clicked
  const handleSearchClick = () => {
    navigate("/rooms");
  };

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
          <li onClick={() => handleClick("home")} className={active === "home" ? "active" : ""}>
            {renderIcon("home", HomeImg, NewHomeImg, HomeVideo)}
            <span>Homes</span>
          </li>

          <li onClick={() => handleClick("exper")} className={active === "exper" ? "active" : ""}>
            {renderIcon("exper", ExperImg, NewExperImg, ExperVideo)}
            <span>Experiences</span>
          </li>

          <li onClick={() => handleClick("serve")} className={active === "serve" ? "active" : ""}>
            {renderIcon("serve", ServeImg, NewServeImg, ServeVideo)}
            <span>Services</span>
          </li>
        </ul>

        <div className="navbar__right">
          <button className="host">Become a host</button>
          <button className="icon-btn" type="button" aria-label="Language">
            <FaGlobe />
          </button>
          <div className="menu-wrapper">
            <button className="icon-btn" type="button">
              <FaBars />
            </button>
          </div>
        </div>
      </nav>

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
        <button className="search-btn" type="button" onClick={handleSearchClick}>
          <FaSearch />
        </button>
      </div>
    </div>
  );
};

export default Navbar;
