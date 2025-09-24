import React, { useState } from "react";
import "../Pages/Room/FiltersModal.scss";
import { FaTimes } from "react-icons/fa";
import {
  FaWifi,
  FaDumbbell,
  FaSwimmer,
  FaLaptop,
  FaUmbrellaBeach,
  FaUtensils,
  FaBolt,
  FaSearch,
  FaDog,
} from "react-icons/fa";

const FiltersModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // State for price range
  const [minPrice, setMinPrice] = useState(500);
  const [maxPrice, setMaxPrice] = useState(2000);

  // State for rooms & beds
  const [bedrooms, setBedrooms] = useState(1);
  const [beds, setBeds] = useState(1);
  const [bathrooms, setBathrooms] = useState(1);

  // Accordion expand
  const [expanded, setExpanded] = useState(null);

  const toggleSection = (section) => {
    setExpanded(expanded === section ? null : section);
  };

  return (
    <div className="filters-overlay">
      <div className="filters-modal">
        {/* Header */}
        <div className="filters-header">
          <h3>Filters</h3>
          <button className="close-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>

        {/* Recommended for you */}
        <div className="section">
          <h4>Recommended for you</h4>
          <div className="recommended">
            <div className="item">
              <img
                src="https://img.icons8.com/ios/100/washing-machine.png"
                alt="washing"
              />
              <span>Washing machine</span>
            </div>
            <div className="item">
              <img src="https://img.icons8.com/ios/100/tv.png" alt="tv" />
              <span>TV</span>
            </div>
            <div className="item">
              <img src="https://img.icons8.com/ios/100/parking.png" alt="parking" />
              <span>Free parking</span>
            </div>
            <div className="item">
              <img
                src="https://img.icons8.com/ios/100/air-conditioner.png"
                alt="ac"
              />
              <span>Air conditioning</span>
            </div>
          </div>
        </div>

        {/* Type of place */}
        <div className="section">
          <h4>Type of place</h4>
          <div className="type-buttons">
            <button className="active">Any type</button>
            <button>Room</button>
            <button>Entire home</button>
          </div>
        </div>

        {/* Price Range */}
        <div className="section">
          <h4>Price range</h4>
          <p className="sub-text">Nightly prices before fees and taxes</p>

          <div className="price-range">
            {/* Histogram */}
            <div className="histogram">
              {Array.from({ length: 20 }).map((_, i) => (
                <div
                  key={i}
                  className="bar"
                  style={{ height: `${20 + Math.random() * 60}px` }}
                />
              ))}
            </div>

            {/* Dual sliders */}
            <div className="slider-container">
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={minPrice}
                onChange={(e) =>
                  setMinPrice(Math.min(Number(e.target.value), maxPrice - 100))
                }
              />
              <input
                type="range"
                min="0"
                max="5000"
                step="50"
                value={maxPrice}
                onChange={(e) =>
                  setMaxPrice(Math.max(Number(e.target.value), minPrice + 100))
                }
              />
            </div>

            <div className="price-values">
              <span className="price-box">₹{minPrice}</span>
              <span className="price-box">₹{maxPrice}</span>
            </div>
          </div>
        </div>

        {/* Rooms & Beds */}
        <div className="section">
          <h4>Rooms and beds</h4>

          <div className="counter">
            <span>Bedrooms</span>
            <div className="controls">
              <button onClick={() => setBedrooms(Math.max(0, bedrooms - 1))}>
                −
              </button>
              <span>{bedrooms}</span>
              <button onClick={() => setBedrooms(bedrooms + 1)}>+</button>
            </div>
          </div>

          <div className="counter">
            <span>Beds</span>
            <div className="controls">
              <button onClick={() => setBeds(Math.max(0, beds - 1))}>−</button>
              <span>{beds}</span>
              <button onClick={() => setBeds(beds + 1)}>+</button>
            </div>
          </div>

          <div className="counter">
            <span>Bathrooms</span>
            <div className="controls">
              <button onClick={() => setBathrooms(Math.max(0, bathrooms - 1))}>
                −
              </button>
              <span>{bathrooms}</span>
              <button onClick={() => setBathrooms(bathrooms + 1)}>+</button>
            </div>
          </div>
        </div>

        {/* Amenities */}
        <div className="section">
          <h4>Amenities</h4>
          <div className="amenities">
            <button>
              <FaWifi /> Wifi
            </button>
            <button>
              <FaDumbbell /> Gym
            </button>
            <button>
              <FaSwimmer /> Pool
            </button>
            <button>
              <FaLaptop /> Workspace
            </button>
            <button>
              <FaUmbrellaBeach /> Beachfront
            </button>
            <button>
              <FaUtensils /> Kitchen
            </button>
          </div>
          <p className="show-more">Show more</p>
        </div>

        {/* Booking Options */}
        <div className="section">
          <h4>Booking options</h4>
          <div className="booking-options">
            <button>
              <FaBolt /> Instant Book
            </button>
            <button>
              <FaSearch /> Self check-in
            </button>
            <button>
              <FaDog /> Allows pets
            </button>
          </div>
        </div>

        {/* Standout stays */}
        <div className="section standout">
          <h4>Standout stays</h4>
          <div className="standout-options">
            <div className="option-card">
              <img src="/icons/favorite.svg" alt="Guest favourite" />
              <div>
                <h5>Guest favourite</h5>
                <p>The most loved homes on Airbnb</p>
              </div>
            </div>
            <div className="option-card">
              <img src="/icons/luxe.svg" alt="Luxe" />
              <div>
                <h5>Luxe</h5>
                <p>Luxury homes with elevated design</p>
              </div>
            </div>
          </div>
        </div>

        {/* Accordion Sections */}
        <div className="accordion">
          {/* Property type */}
          <div
            className={`accordion-item ${
              expanded === "property" ? "open" : ""
            }`}
          >
            <button
              className="accordion-header"
              onClick={() => toggleSection("property")}
            >
              <span>Property type</span>
              <span>{expanded === "property" ? "−" : "+"}</span>
            </button>
            {expanded === "property" && (
              <div className="accordion-body">
                <label>
                  <input type="checkbox" /> Apartment
                </label>
                <label>
                  <input type="checkbox" /> Villa
                </label>
                <label>
                  <input type="checkbox" /> Cottage
                </label>
              </div>
            )}
          </div>

          {/* Accessibility */}
          <div
            className={`accordion-item ${
              expanded === "accessibility" ? "open" : ""
            }`}
          >
            <button
              className="accordion-header"
              onClick={() => toggleSection("accessibility")}
            >
              <span>Accessibility features</span>
              <span>{expanded === "accessibility" ? "−" : "+"}</span>
            </button>
            {expanded === "accessibility" && (
              <div className="accordion-body">
                <label>
                  <input type="checkbox" /> Wheelchair accessible
                </label>
                <label>
                  <input type="checkbox" /> Step-free entrance
                </label>
              </div>
            )}
          </div>

          {/* Host language */}
          <div
            className={`accordion-item ${
              expanded === "language" ? "open" : ""
            }`}
          >
            <button
              className="accordion-header"
              onClick={() => toggleSection("language")}
            >
              <span>Host language</span>
              <span>{expanded === "language" ? "−" : "+"}</span>
            </button>
            {expanded === "language" && (
              <div className="accordion-body">
                <label>
                  <input type="checkbox" /> English
                </label>
                <label>
                  <input type="checkbox" /> Hindi
                </label>
                <label>
                  <input type="checkbox" /> Tamil
                </label>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="filters-footer">
          <button className="clear-btn">Clear all</button>
          <button className="show-btn">Show 1,000+ places</button>
        </div>
      </div>
    </div>
  );
};

export default FiltersModal;
