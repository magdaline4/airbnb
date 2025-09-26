import React, { useState } from "react";
import "../Pages/Room/FiltersModal.scss";
import { FaHotel, FaTimes ,FaChevronDown, FaChevronUp ,} from "react-icons/fa";
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

  const histogramData = [
  20, 10, 70, 30, 60, 90, 50, 80, 40, 70,
  30, 60, 85, 45, 20, 70, 90, 50, 40, 60,
  30, 80, 55, 40, 70, 30, 20, 60, 75, 90,
  40, 30, 70, 60, 50, 80, 30, 60, 90, 40,
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

    

        {/* Recommended for you */}
        <div className="section">
          <h4>Recommended for you</h4>
          <div className="recommended">
            <div className="item">
              <img
                src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-recommended-filters/original/075ae1dc-92de-4410-8aa4-642ec5fe4868.png"
                alt="washing"
              />
              <span>Washing machine</span>
            </div>
            <div className="item">
              <img src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-recommended-filters/original/b702d0fd-3b23-49b6-a6c8-65d743771368.png" alt="tv" />
              <span>TV</span>
            </div>
            <div className="item">
              <img src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-recommended-filters/original/8336ae3d-9381-4c82-bad9-e7730f04ef4e.png" alt="parking" />
              <span>Free parking</span>
            </div>
            <div className="item">
              <img
                src="https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-recommended-filters/original/bd215e32-ec6d-483e-b39b-7da4a2a6a312.png"
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
          <div
            key={i}
            className={`bar ${isActive ? "active" : ""}`}
            style={{ height: `${h}%` }}
          />
        );
      })}
    </div>

    {/* Dual sliders */}
    <div className="slider-container">
      <input
        type="range"
        min="0"
        max="50000"
        step="500"
        value={minPrice}
        onChange={(e) =>
          setMinPrice(Math.min(Number(e.target.value), maxPrice - 1000))
        }
      />
      <input
        type="range"
        min="0"
        max="50000"
        step="500"
        value={maxPrice}
        onChange={(e) =>
          setMaxPrice(Math.max(Number(e.target.value), minPrice + 1000))
        }
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

  {/* Conditionally render based on expanded state */}
  {expanded === "amenities" ? (
    <div className="amenities-full">
      <div className="amenity-group">
        <h5>Popular</h5>
        <div className="amenity-buttons">
          <button><FaWifi /> Wifi</button>
          <button><FaWind /> Air conditioning</button>
          <button><FaSwimmer /> Pool</button>
          <button><FaTshirt /> Dryer</button>
          <button><FaBath /> Heating</button>
          <button><FaLaptop /> Workspace</button>
        </div>
      </div>

      <div className="amenity-group">
        <h5>Essentials</h5>
        <div className="amenity-buttons">
          <button><FaUtensils /> Kitchen</button>
          <button><GiWashingMachine /> Washing machine</button>
          <button><FaTv /> TV</button>
          <button> <GiComb/> Hair dryer</button>
          <button><FaBath /> Iron</button>
        </div>
      </div>

      <div className="amenity-group">
        <h5>Features</h5>
        <div className="amenity-buttons">
          <button><FaHotTub /> Hot tub</button>
          <button><FaCar /> Free parking</button>
          <button><FaChargingStation /> EV charger</button>
          <button><FaBed /> Cot</button>
          <button><FaBed /> King bed</button>
          <button><FaDumbbell /> Gym</button>
          <button><GiBarbecue /> BBQ grill</button>
          <button> <GiBowlOfRice/> Breakfast</button>
          <button><FaFire /> Indoor fireplace</button>
          <button><FaSmoking /> Smoking allowed</button>
        </div>
      </div>

      <div className="amenity-group">
        <h5>Safety</h5>
        <div className="amenity-buttons">
          <button><GiAlarmClock/> Smoke alarm</button>
          <button><GiTimeTrap/> Carbon monoxide alarm</button>
        </div>
      </div>

      <p
        className="toggle-amenities"
        onClick={() => setExpanded(null)}
      >
        Show less <FaChevronUp className="arrow" /> 
      </p>
    </div>
  ) : (
    <div className="amenities">
      <button><FaWifi /> Wifi</button>
      <button><FaDumbbell /> Gym</button>
      <button><FaSwimmer /> Pool</button>
      <button><FaLaptop />Didicated Workspace</button>
      <button><FaUmbrellaBeach /> Beachfront</button>
      <button><FaUtensils /> Kitchen</button>
      <p
        className="toggle-amenities"
        onClick={() => setExpanded("amenities")}
      >
        Show more  <FaChevronDown className="arrow" />
      </p>
    </div>
  )}
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
              <img src="https://i.etsystatic.com/25032573/r/il/c16171/2528485574/il_fullxfull.2528485574_i4eh.jpg" alt="Guest favourite" />
              <div>
                <h5>Guest favourite</h5>
                <p>The most loved homes on Airbnb</p>
              </div>
            </div>
            <div className="option-card">
              <img src="https://cdn1.iconfinder.com/data/icons/restaurant-138/512/Food_Delivery_delivery_food_service_catering_restaurant-512.png" alt="Luxe" />
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
  <div className={`accordion-item ${expanded === "property" ? "open" : ""}`}>
    <button
      className="accordion-header"
      onClick={() => toggleSection("property")}
    >
      <span>Property type</span>
      <span>{expanded === "property" ? <FaChevronUp /> : <FaChevronDown /> }</span>
    </button>
    {expanded === "property" && (
      <div className="accordion-body property-options">
        <button> <FaHome/> House</button>
        <button> Flat</button>
        <button> <GiHouse/> Guest house</button>
        <button> <FaHotel/> Hotel</button>
      </div>
    )}
  </div>

  {/* Accessibility */}
  <div className={`accordion-item ${expanded === "accessibility" ? "open" : ""}`}>
    <button
      className="accordion-header"
      onClick={() => toggleSection("accessibility")}
    >
      <span>Accessibility features</span>
      <span>{expanded === "accessibility" ?  <FaChevronUp /> : <FaChevronDown />}</span>
    </button>
    {expanded === "accessibility" && (
      <div className="accordion-body accessibility-options">
        <h5>Guest entrance and parking</h5>
        <label><input type="checkbox" /> Step-free access</label>
        <label><input type="checkbox" /> Disabled parking spot</label>
        <label><input type="checkbox" /> Guest entrance wider than 32 inches (81 centimetres)</label>

        <h5>Bedroom</h5>
        <label><input type="checkbox" /> Step-free bedroom access</label>
        <label><input type="checkbox" /> Bedroom entrance wider than 32 inches (81 centimetres)</label>

        <h5>Bathroom</h5>
        <label><input type="checkbox" /> Step-free bathroom access</label>
        <label><input type="checkbox" /> Bathroom entrance wider than 32 inches (81 centimetres)</label>
        <label><input type="checkbox" /> Toilet grab bar</label>
        <label><input type="checkbox" /> Shower grab bar</label>
        <label><input type="checkbox" /> Step-free shower</label>
        <label><input type="checkbox" /> Shower or bath chair</label>

        <h5>Adaptive equipment</h5>
        <label><input type="checkbox" /> Ceiling or mobile hoist</label>
      </div>
    )}
  </div>

  {/* Host language */}
  <div className={`accordion-item ${expanded === "language" ? "open" : ""}`}>
    <button
      className="accordion-header"
      onClick={() => toggleSection("language")}
    >
      <span>Host language</span>
      <span>{expanded === "language" ?  <FaChevronUp /> : <FaChevronDown />}</span>
    </button>
    {expanded === "language" && (
      <div className="accordion-body language-options">
        <label><input type="checkbox" /> Chinese (Simplified)</label>
        <label><input type="checkbox" /> English</label>
        <label><input type="checkbox" /> German</label>
        <label><input type="checkbox" /> Japanese </label>
        <label><input type="checkbox" /> Russian </label>
        <label><input type="checkbox" /> Spanish </label>
        <label><input type="checkbox" /> Arabic </label>
        <label><input type="checkbox" /> Danish </label>
        <label><input type="checkbox" /> Dutch </label>
        <label><input type="checkbox" /> Hindi </label>
        <label><input type="checkbox" /> Hungarian </label>
        <label><input type="checkbox" />Indonesian </label>
        <label><input type="checkbox" />Malay </label>
        <label><input type="checkbox" /> Norwegian </label>
        <label><input type="checkbox" /> Swedish </label>
        <label><input type="checkbox" />Thai </label>
        <label><input type="checkbox" /> Bengali </label>
        <label><input type="checkbox" /> Gujarati </label> 
        <label><input type="checkbox" /> Kannada </label>
        <label><input type="checkbox" />Punjabi </label>
        <label><input type="checkbox" /> Swahili </label>
        <label><input type="checkbox" />Tamil </label>
        <label><input type="checkbox" /> Telugu </label>
        <label><input type="checkbox" /> Urdu</label>
        <label><input type="checkbox" />Vietnamese </label> 
        <label><input type="checkbox" /> Sign Language</label>
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
