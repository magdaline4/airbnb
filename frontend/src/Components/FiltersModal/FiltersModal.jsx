import React, { useState, useEffect } from "react";
import "./FiltersModal.scss";
import {
  FaHotel, FaTimes, FaChevronDown, FaChevronUp, FaBuilding, FaHome, FaBolt,
  FaSearch, FaDog, FaWifi, FaSwimmer, FaLaptop, FaUtensils, FaDumbbell, FaTv,
  FaCar, FaChargingStation, FaBed, FaHotTub, FaFire, FaSmoking, FaWind, FaTshirt, FaBath, FaUmbrellaBeach
} from "react-icons/fa";
import { GiAlarmClock, GiBarbecue, GiBowlOfRice, GiComb, GiHouse, GiTimeTrap, GiWashingMachine } from "react-icons/gi";

const FiltersModal = ({ isOpen, onClose, filters, setFilters }) => {
  if (!isOpen) return null;

  // Use the filters from props instead of local state
  const [minPrice, setMinPrice] = useState(filters.minPrice || 30000);
  const [maxPrice, setMaxPrice] = useState(filters.maxPrice || 50000);
  
  const [bedrooms, setBedrooms] = useState(filters.bedrooms || 1);
  const [beds, setBeds] = useState(filters.beds || 1);
  const [bathrooms, setBathrooms] = useState(filters.bathrooms || 1);
  const [selectedFilters, setSelectedFilters] = useState(filters.amenities || []);

  // Accordion
  const [expanded, setExpanded] = useState(null);

  // Update local state when filters prop changes
  useEffect(() => {
    if (filters) {
      setMinPrice(filters.minPrice || 500);
      setMaxPrice(filters.maxPrice || 2000);
      setBedrooms(filters.bedrooms || 1);
      setBeds(filters.beds || 1);
      setBathrooms(filters.bathrooms || 1);
      setSelectedFilters(filters.amenities || []);
    }
  }, [filters]);

  const toggleSection = (section) => setExpanded(expanded === section ? null : section);

  const toggleFilter = (filterName) => {
    setSelectedFilters(prev => 
      prev.includes(filterName)
        ? prev.filter(f => f !== filterName)
        : [...prev, filterName]
    );
  };

  const handleClearAll = () => {
    setSelectedFilters([]);
    setMinPrice(500);
    setMaxPrice(2000);
    setBedrooms(1);
    setBeds(1);
    setBathrooms(1);
  };

  const handleShowResults = () => {
    setFilters({
      minPrice,
      maxPrice,
      bedrooms,
      beds,
      bathrooms,
      amenities: selectedFilters,
    });
    onClose();
  };

  const histogramData = Array.from({ length: 40 }, () => Math.floor(Math.random() * 100));

  return (
    <div className="filters-overlay">
      <div className="filters-modal">
        {/* Header */}
        <div className="filters-header">
          <h3>Filters</h3>
          <button className="close-btn" onClick={onClose}><FaTimes /></button>
        </div>

        {/* Selected Filters */}
        {selectedFilters.length > 0 && (
          <div className="selected-filters">
            {selectedFilters.map((f, idx) => (
              <div key={idx} className="selected-item" onClick={() => toggleFilter(f)}>
                {f} ×
              </div>
            ))}
          </div>
        )}

        {/* Recommended */}
        <div className="section">
          <h4>Recommended for you</h4>
          <div className="recommended">
            {[
              { name: "Washing machine", icon: <GiWashingMachine size={32} /> },
              { name: "TV", icon: <FaTv size={32} /> },
              { name: "Free parking", icon: <FaCar size={32} /> },
              { name: "Air conditioning", icon: <FaWind size={32} /> },
            ].map(item => (
              <div
                key={item.name}
                className={`item ${selectedFilters.includes(item.name) ? "selected" : ""}`}
                onClick={() => toggleFilter(item.name)}
              >
                {item.icon}
                <span>{item.name}</span>
              </div>
            ))}
          </div>
        </div>

        <hr />

        {/* Type of place */}
        <div className="section">
          <h4>Type of place</h4>
          <div className="type-buttons">
            <button className="active">Any type</button>
            <button>Room</button>
            <button>Entire home</button>
          </div>
        </div>

        <hr />

        {/* Price Range */}
        <div className="section price-section">
          <h4>Price range</h4>
          <p className="sub-text">Trip price, includes all fees</p>
          <div className="price-range">
            <div className="histogram">
              {histogramData.map((h, i) => {
                const barMin = (i / histogramData.length) * 50000;
                const barMax = ((i + 1) / histogramData.length) * 50000;
                const isActive = barMin >= minPrice && barMax <= maxPrice;
                return <div key={i} className={`bar ${isActive ? "active" : ""}`} style={{ height: `${h}%` }} />;
              })}
            </div>
<div className="slider-container">
  <input 
    type="range" 
    min="10000"     // Match your room price range
    max="50000"     
    step="1000"     
    value={minPrice} 
    onChange={e => setMinPrice(Math.min(Number(e.target.value), maxPrice - 1000))} 
  />
  <input 
    type="range" 
    min="10000"     // Match your room price range  
    max="50000"     
    step="1000"     
    value={maxPrice} 
    onChange={e => setMaxPrice(Math.max(Number(e.target.value), minPrice + 1000))} 
  />
</div>
            <div className="price-values">
              <div className="price-box"><span>Minimum</span><strong>₹{minPrice}</strong></div>
              <div className="price-box"><span>Maximum</span><strong>₹{maxPrice}+</strong></div>
            </div>
          </div>
        </div>

        <hr />

        {/* Rooms & Beds */}
        <div className="section">
          <h4>Rooms and beds</h4>
          {[
            { label: "Bedrooms", value: bedrooms, set: setBedrooms },
            { label: "Beds", value: beds, set: setBeds },
            { label: "Bathrooms", value: bathrooms, set: setBathrooms }
          ].map(item => (
            <div key={item.label} className="counter">
              <span>{item.label}</span>
              <div className="controls">
                <button onClick={() => item.set(Math.max(1, item.value - 1))}>−</button>
                <span>{item.value}</span>
                <button onClick={() => item.set(item.value + 1)}>+</button>
              </div>
            </div>
          ))}
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
                  <button onClick={() => toggleFilter("Wifi")} className={selectedFilters.includes("Wifi") ? "selected" : ""}><FaWifi /> Wifi</button>
                  <button onClick={() => toggleFilter("Air conditioning")} className={selectedFilters.includes("Air conditioning") ? "selected" : ""}><FaWind /> Air conditioning</button>
                  <button onClick={() => toggleFilter("Pool")} className={selectedFilters.includes("Pool") ? "selected" : ""}><FaSwimmer /> Pool</button>
                  <button onClick={() => toggleFilter("Dryer")} className={selectedFilters.includes("Dryer") ? "selected" : ""}><FaTshirt /> Dryer</button>
                  <button onClick={() => toggleFilter("Heating")} className={selectedFilters.includes("Heating") ? "selected" : ""}><FaBath /> Heating</button>
                  <button onClick={() => toggleFilter("Workspace")} className={selectedFilters.includes("Workspace") ? "selected" : ""}><FaLaptop /> Workspace</button>
                </div>
              </div>
              <p className="toggle-amenities" onClick={() => setExpanded(null)}>Show less <FaChevronUp /></p>
            </div>
          ) : (
            <div className="amenities">
              <button onClick={() => toggleFilter("Wifi")} className={selectedFilters.includes("Wifi") ? "selected" : ""}><FaWifi /> Wifi</button>
              <button onClick={() => toggleFilter("Gym")} className={selectedFilters.includes("Gym") ? "selected" : ""}><FaDumbbell /> Gym</button>
              <button onClick={() => toggleFilter("Pool")} className={selectedFilters.includes("Pool") ? "selected" : ""}><FaSwimmer /> Pool</button>
              <button onClick={() => toggleFilter("Workspace")} className={selectedFilters.includes("Workspace") ? "selected" : ""}><FaLaptop /> Dedicated Workspace</button>
              <button onClick={() => toggleFilter("Beachfront")} className={selectedFilters.includes("Beachfront") ? "selected" : ""}><FaUmbrellaBeach /> Beachfront</button>
              <p className="toggle-amenities" onClick={() => setExpanded("amenities")}>Show more <FaChevronDown /></p>
            </div>
          )}
        </div>

        <hr />

        {/* Booking Options */}
        <div className="section">
          <h4>Booking options</h4>
          <div className="booking-options">
            <button onClick={() => toggleFilter("Instant Book")} className={selectedFilters.includes("Instant Book") ? "selected" : ""}><FaBolt /> Instant Book</button>
            <button onClick={() => toggleFilter("Self check-in")} className={selectedFilters.includes("Self check-in") ? "selected" : ""}><FaSearch /> Self check-in</button>
            <button onClick={() => toggleFilter("Allows pets")} className={selectedFilters.includes("Allows pets") ? "selected" : ""}><FaDog /> Allows pets</button>
          </div>
        </div>

        <hr />

        {/* Footer */}
        <div className="filters-footer">
          <button className="clear-btn" onClick={handleClearAll}>Clear all</button>
          <button className="show-btn" onClick={handleShowResults}>
            Show results
          </button>
        </div>
      </div>
    </div>
  );
};

export default FiltersModal;