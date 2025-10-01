import React, { useState } from "react";
import "./FiltersModal.scss";
import { FaHotel, FaTimes ,FaChevronDown, FaChevronUp, FaBuilding } from "react-icons/fa";
import {
  FaUmbrellaBeach,
  FaBolt,
  FaSearch,
  FaDog,
  FaHome,
} from "react-icons/fa";
import { 
  FaWifi, FaSwimmer, FaLaptop, FaUtensils, FaDumbbell, FaTv, FaCar, FaChargingStation, 
  FaBed, FaHotTub, FaFire, FaSmoking, FaWind, FaTshirt, FaBath
} from "react-icons/fa";
import { GiAlarmClock, GiBarbecue, GiBowlOfRice, GiComb, GiHouse, GiTimeTrap, GiWashingMachine } from "react-icons/gi";

const FiltersModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  // ✅ State for selected filters
  const [selectedFilters, setSelectedFilters] = useState([]);

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

  // ✅ Toggle filter selection
  const toggleFilter = (filter) => {
    setSelectedFilters((prev) =>
      prev.includes(filter) ? prev.filter((f) => f !== filter) : [...prev, filter]
    );
  };

  // ✅ Clear all filters
  const clearAll = () => {
    setSelectedFilters([]);
    setMinPrice(500);
    setMaxPrice(2000);
    setBedrooms(1);
    setBeds(1);
    setBathrooms(1);
  };

  // ✅ Apply filters
  const applyFilters = () => {
    console.log("Applied Filters:", selectedFilters);
    alert("Filters applied:\n" + (selectedFilters.length ? selectedFilters.join(", ") : "No filters selected"));
  };

  const histogramData = [
    20, 10, 70, 30, 60, 90, 50, 80, 40, 70, 30, 60, 85, 45, 20, 70, 90, 50, 40,
    60, 30, 80, 55, 40, 70, 30, 20, 60, 75, 90, 40, 30, 70, 60, 50, 80, 30, 60,
    90, 40,
  ];

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

        {/* ✅ Selected Filters Summary */}
        {selectedFilters.length > 0 && (
          <div className="selected-filters">
            <h4>Selected </h4>
            <div className="selected-tags">
              {selectedFilters.map((filter, i) => (
                <span key={i} className="tag">
                  {filter} <button onClick={() => toggleFilter(filter)}>×</button>
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Recommended for you */}
        <div className="section">
          <h4>Recommended for you</h4>
          <div className="recommended">
            <div className="item" onClick={() => toggleFilter("Washing machine")}>
              <img src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-recommended-filters/original/075ae1dc-92de-4410-8aa4-642ec5fe4868.png" alt="washing"/>
              <span>Washing machine</span>
            </div>
            <div className="item" onClick={() => toggleFilter("TV")}>
              <img src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-recommended-filters/original/b702d0fd-3b23-49b6-a6c8-65d743771368.png" alt="tv"/>
              <span>TV</span>
            </div>
            <div className="item" onClick={() => toggleFilter("Free parking")}>
              <img src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-recommended-filters/original/8336ae3d-9381-4c82-bad9-e7730f04ef4e.png" alt="parking"/>
              <span>Free parking</span>
            </div>
            <div className="item" onClick={() => toggleFilter("Air conditioning")}>
              <img src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-recommended-filters/original/bd215e32-ec6d-483e-b39b-7da4a2a6a312.png" alt="ac"/>
              <span>Air conditioning</span>
            </div>
          </div>
        </div>
        <hr />

        {/* Type of place */}
        <div className="section">
          <h4>Type of place</h4>
          <div className="type-buttons">
            <button onClick={() => toggleFilter("Any type")}>Any type</button>
            <button onClick={() => toggleFilter("Room")}>Room</button>
            <button onClick={() => toggleFilter("Entire home")}>Entire home</button>
          </div>
        </div>
        <hr />

        {/* Price Range */}
        <div className="section price-section">
          <h4>Price range</h4>
          <p className="sub-text">Trip price, includes all fees</p>

          <div className="price-range">
            {/* Histogram */}
            <div className="histogram">
              {histogramData.map((h, i) => {
                const barMin = (i / histogramData.length) * 50000;
                const barMax = ((i + 1) / histogramData.length) * 50000;
                const isActive = barMin >= minPrice && barMax <= maxPrice;
                return (
                  <div key={i} className={`bar ${isActive ? "active" : ""}`} style={{ height: `${h}%` }}/>
                );
              })}
            </div>

            {/* Dual sliders */}
            <div className="slider-container">
              <input type="range" min="0" max="50000" step="500" value={minPrice}
                onChange={(e) => setMinPrice(Math.min(Number(e.target.value), maxPrice - 1000))}
              />
              <input type="range" min="0" max="50000" step="500" value={maxPrice}
                onChange={(e) => setMaxPrice(Math.max(Number(e.target.value), minPrice + 1000))}
              />
            </div>

            {/* Price values */}
            <div className="price-values">
              <div className="price-box">
                <span>Minimum</span>
                <strong>₹{minPrice}</strong>
              </div>
              <div className="price-box">
                <span>Maximum</span>
                <strong>₹{maxPrice}+</strong>
              </div>
            </div>
          </div>
        </div>
        <hr />

        {/* Rooms & Beds */}
        <div className="section">
          <h4>Rooms and beds</h4>
          <div className="counter">
            <span>Bedrooms</span>
            <div className="controls">
              <button onClick={() => setBedrooms(Math.max(0, bedrooms - 1))}>−</button>
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
              <button onClick={() => setBathrooms(Math.max(0, bathrooms - 1))}>−</button>
              <span>{bathrooms}</span>
              <button onClick={() => setBathrooms(bathrooms + 1)}>+</button>
            </div>
          </div>
        </div>
        <hr />

        {/* Amenities */}
        <div className="section">
          <h4>Amenities</h4>
          {expanded === "amenities" ? (
            <div className="amenities-full">
              <div className="amenity-group">
                <h5>Popular</h5>
                <div className="amenity-buttons">
                  <button onClick={() => toggleFilter("Wifi")}><FaWifi /> Wifi</button>
                  <button onClick={() => toggleFilter("Air conditioning")}><FaWind /> Air conditioning</button>
                  <button onClick={() => toggleFilter("Pool")}><FaSwimmer /> Pool</button>
                  <button onClick={() => toggleFilter("Dryer")}><FaTshirt /> Dryer</button>
                  <button onClick={() => toggleFilter("Heating")}><FaBath /> Heating</button>
                  <button onClick={() => toggleFilter("Workspace")}><FaLaptop /> Workspace</button>
                </div>
              </div>
              <div className="amenity-group">
                <h5>Essentials</h5>
                <div className="amenity-buttons">
                  <button onClick={() => toggleFilter("Kitchen")}><FaUtensils /> Kitchen</button>
                  <button onClick={() => toggleFilter("Washing machine")}><GiWashingMachine /> Washing machine</button>
                  <button onClick={() => toggleFilter("TV")}><FaTv /> TV</button>
                  <button onClick={() => toggleFilter("Hair dryer")}><GiComb/> Hair dryer</button>
                  <button onClick={() => toggleFilter("Iron")}><FaBath /> Iron</button>
                </div>
              </div>

              
      <div className="amenity-group">
        <h5>Features</h5>
        <div className="amenity-buttons">
          <button onClick={() => toggleFilter("Hot tub")}><FaHotTub /> Hot tub</button>
          <button onClick={() => toggleFilter("Free parking")}><FaCar /> Free parking</button>
          <button onClick={() => toggleFilter("EV charger")}><FaChargingStation /> EV charger</button>
          <button onClick={() => toggleFilter(" Cot")}><FaBed /> Cot</button>
          <button onClick={() => toggleFilter("King bed")}><FaBed /> King bed</button>
          <button onClick={() => toggleFilter("Gym")}> <FaDumbbell /> Gym</button>
          <button onClick={() => toggleFilter("BBQ grill")}><GiBarbecue /> BBQ grill</button>
          <button onClick={() => toggleFilter("Breakfast")}> <GiBowlOfRice/> Breakfast</button>
          <button onClick={() => toggleFilter("Indoor fireplace")}><FaFire /> Indoor fireplace</button>
          <button onClick={() => toggleFilter("Smoking allowed")}><FaSmoking /> Smoking allowed</button>
        </div>
      </div>

      <div className="amenity-group">
        <h5>Safety</h5>
        <div className="amenity-buttons">
          <button onClick={() => toggleFilter("Smoke alarm")}><GiAlarmClock/> Smoke alarm</button>
          <button onClick={() => toggleFilter("Carbon monoxide alarm")}><GiTimeTrap/> Carbon monoxide alarm</button>
        </div>
      </div>

              <p className="toggle-amenities" onClick={() => setExpanded(null)}>
                Show less <FaChevronUp className="arrow" />
              </p>
            </div>
          ) : (
            <div className="amenities">
              <button onClick={() => toggleFilter("Wifi")}><FaWifi /> Wifi</button>
              <button onClick={() => toggleFilter("Gym")}><FaDumbbell /> Gym</button>
              <button onClick={() => toggleFilter("Pool")}><FaSwimmer /> Pool</button>
              <button onClick={() => toggleFilter("Workspace")}><FaLaptop /> Workspace</button>
              <button onClick={() => toggleFilter("Beachfront")}><FaUmbrellaBeach /> Beachfront</button>
              <button onClick={() => toggleFilter("Kitchen")}><FaUtensils /> Kitchen</button>
              <p className="toggle-amenities" onClick={() => setExpanded("amenities")}>
                Show more <FaChevronDown className="arrow" />
              </p>
            </div>
          )}
        </div>
        <hr />

        {/* Booking Options */}
        <div className="section">
          <h4>Booking options</h4>
          <div className="booking-options">
            <button onClick={() => toggleFilter("Instant Book")}><FaBolt /> Instant Book</button>
            <button onClick={() => toggleFilter("Self check-in")}><FaSearch /> Self check-in</button>
            <button onClick={() => toggleFilter("Allows pets")}><FaDog /> Allows pets</button>
          </div>
        </div>
        

{/* Accordion Wrapper */}
<div className="accordion">
  {/* Property type */}
  <div className={`accordion-item ${expanded === "property" ? "open" : ""}`}>
    <button className="accordion-header" onClick={() => toggleSection("property")}>
      <span>Property type</span>
      <span>{expanded === "property" ? <FaChevronUp /> : <FaChevronDown />}</span>
    </button>
    {expanded === "property" && (
      <div className="accordion-body property-options">
        <button onClick={() => toggleFilter("House")}><FaHome /> House</button>
        <button onClick={() => toggleFilter("Flat")}><FaBuilding /> Flat</button>
        <button onClick={() => toggleFilter("Guest house")}><GiHouse /> Guest house</button>
        <button onClick={() => toggleFilter("Hotel")}><FaHotel /> Hotel</button>
      </div>
    )}
  </div>

  {/* Accessibility */}
  <div className={`accordion-item ${expanded === "accessibility" ? "open" : ""}`}>
    <button className="accordion-header" onClick={() => toggleSection("accessibility")}>
      <span>Accessibility features</span>
      <span>{expanded === "accessibility" ? <FaChevronUp /> : <FaChevronDown />}</span>
    </button>
    {expanded === "accessibility" && (
      <div className="accordion-body accessibility-options">
        <label>
          <input type="checkbox" onChange={() => toggleFilter("Step-free access")} />
          Step-free access
        </label>
        <label>
          <input type="checkbox" onChange={() => toggleFilter("Disabled parking spot")} />
          Disabled parking spot
        </label>
        <label>
          <input type="checkbox" onChange={() => toggleFilter("Guest entrance wider than 32 inches")} />
          Guest entrance wider than 32 inches (81 centimetres)
        </label>

        <h5>Bedroom</h5>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Step-free bedroom access")} /> Step-free bedroom access
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter(" Bedroom entrance wider than 32 inches (81 centimetres) ")} /> Bedroom entrance wider than 32
                  inches (81 centimetres)
                </label>

        <h5>Bathroom</h5>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Step-free bathroom access")} /> Step-free bathroom access
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Bathroom entrance wider than 32  inches (81 centimetres) ")} /> Bathroom entrance wider than 32
                  inches (81 centimetres)
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Toilet grab bar")} /> Toilet grab bar
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Shower grab bar")} /> Shower grab bar
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Step-free shower")} /> Step-free shower
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Shower or bath chair")} /> Shower or bath chair
                </label>

            <h5>Adaptive equipment</h5>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter(" Ceiling or mobile hoist")} /> Ceiling or mobile hoist
                </label>

      </div>
    )}
  </div>

  {/* Host language */}
  <div className={`accordion-item ${expanded === "language" ? "open" : ""}`}>
    <button className="accordion-header" onClick={() => toggleSection("language")}>
      <span>Host language</span>
      <span>{expanded === "language" ? <FaChevronUp /> : <FaChevronDown />}</span>
    </button>
    {expanded === "language" && (
      <div className="accordion-body language-options">

        <label>
                  <input type="checkbox" onChange={() => toggleFilter("Chinese (Simplified)")} /> Chinese (Simplified)
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("English")} /> English
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("German")} /> German
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Japanese")} /> Japanese
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Russian")} /> Russian
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter(" Spanish")} /> Spanish
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Arabic")} /> Arabic
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter(" Danish")} /> Danish
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Dutch")} /> Dutch
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Hindi")} /> Hindi
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Hungarian")} /> Hungarian
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Indonesian")} />Indonesian
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Malay")} /> Malay
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Norwegian")} /> Norwegian
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Swedish")} /> Swedish
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Thai")} /> Thai
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Bengali")} /> Bengali
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Gujarati")} /> Gujarati
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Kannada")} /> Kannada
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Punjabi")} /> Punjabi
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Swahili")} /> Swahili
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Tamil")} /> Tamil
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Telugu")} /> Telugu
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Urdu")} /> Urdu
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Vietnamese")} />
                  Vietnamese
                </label>
                <label>
                  <input type="checkbox" onChange={() => toggleFilter("Sign Language")} /> Sign Language
                </label>

      </div>
    )}
  </div>
</div>


        {/* Footer */}
        <div className="filters-footer">
          <button className="clear-btn" onClick={clearAll}>Clear all</button>
          <button className="show-btn" onClick={applyFilters}>Show 1,000+ places</button>
        </div>
      </div>
    </div>
  );
};

export default FiltersModal;
