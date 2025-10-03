import React, { useState, useEffect } from "react";
import "./FiltersModal.scss";
import { FaHotel, FaTimes ,FaChevronDown, FaChevronUp, FaBuilding } from "react-icons/fa";
import {
    FaHome, FaBolt,
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

  //ToggleFilter
  const toggleFilter = (filterName) => {
    setSelectedFilters(prev => 
      prev.includes(filterName)
        ? prev.filter(f => f !== filterName)
        : [...prev, filterName]
    );
  };

  //  Clear all filters

  const handleClearAll = () => {
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
            <h4>Selected</h4>
            <div className="selected-tags">
            {selectedFilters.map((f, idx) => (
              <span key={idx} className="tag">{f} 
              <button onClick={() => toggleFilter(f)}>
                 × </button>
              </span>
             
            ))}
            </div>
          </div>
        )}
 
        {/* Recommended */}
        <div className="section">
          <h4>Recommended for you</h4>
          <div className="recommended">
            {[
              { name: "Washing machine", img: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-recommended-filters/original/075ae1dc-92de-4410-8aa4-642ec5fe4868.png" },
              { name: "TV", img: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-recommended-filters/original/b702d0fd-3b23-49b6-a6c8-65d743771368.png"},
              { name: "Free parking",img: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-recommended-filters/original/8336ae3d-9381-4c82-bad9-e7730f04ef4e.png" },
              { name: "Air conditioning",img: "https://a0.muscache.com/im/pictures/airbnb-platform-assets/AirbnbPlatformAssets-recommended-filters/original/bd215e32-ec6d-483e-b39b-7da4a2a6a312.png" },
            ].map(item => (
              <div
                key={item.name}
                className={`item ${selectedFilters.includes(item.name) ? "selected" : ""}`}
                onClick={() => toggleFilter(item.name)}
              >
                <img src={item.img} alt={item.name}  />
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
            <button data-selected={selectedFilters.includes("Any type")} onClick={() => toggleFilter("Any type")}>Any type</button>
            <button data-selected={selectedFilters.includes("Room")} onClick={() => toggleFilter("Room")}>Room</button>
            <button data-selected={selectedFilters.includes("Entire home")} onClick={() => toggleFilter("Entire home")}>Entire home</button>
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

      <div className="amenity-group">
        <h5>Essentials</h5>
        <div className="amenity-buttons">
          <button onClick={() => toggleFilter("Kitchen")} className={selectedFilters.includes("Kitchen") ? "selected" : ""}><FaUtensils /> Kitchen</button>
          <button onClick={() => toggleFilter("Washing machine")} className={selectedFilters.includes("Washing machine") ? "selected" : ""}><GiWashingMachine /> Washing machine</button>
          <button onClick={() => toggleFilter("TV")} className={selectedFilters.includes("TV") ? "selected" : ""}><FaTv /> TV</button>
          <button onClick={() => toggleFilter("Hair dryer")} className={selectedFilters.includes("Hair dryer") ? "selected" : ""}><GiComb /> Hair dryer</button>
          <button onClick={() => toggleFilter("Iron")} className={selectedFilters.includes("Iron") ? "selected" : ""}><FaBath /> Iron</button>
        </div>
      </div>

      <div className="amenity-group">
        <h5>Features</h5>
        <div className="amenity-buttons">
          <button onClick={() => toggleFilter("Hot tub")} className={selectedFilters.includes("Hot tub") ? "selected" : ""}><FaHotTub /> Hot tub</button>
          <button onClick={() => toggleFilter("Free parking")} className={selectedFilters.includes("Free parking") ? "selected" : ""}><FaCar /> Free parking</button>
          <button onClick={() => toggleFilter("EV charger")} className={selectedFilters.includes("EV charger") ? "selected" : ""}><FaChargingStation /> EV charger</button>
          <button onClick={() => toggleFilter("Cot")} className={selectedFilters.includes("Cot") ? "selected" : ""}><FaBed /> Cot</button>
          <button onClick={() => toggleFilter("King bed")} className={selectedFilters.includes("King bed") ? "selected" : ""}><FaBed /> King bed</button>
          <button onClick={() => toggleFilter("Gym")} className={selectedFilters.includes("Gym") ? "selected" : ""}><FaDumbbell /> Gym</button>
          <button onClick={() => toggleFilter("BBQ grill")} className={selectedFilters.includes("BBQ grill") ? "selected" : ""}><GiBarbecue /> BBQ grill</button>
          <button onClick={() => toggleFilter("Breakfast")} className={selectedFilters.includes("Breakfast") ? "selected" : ""}><GiBowlOfRice/> Breakfast</button>
          <button onClick={() => toggleFilter("Indoor fireplace")} className={selectedFilters.includes("Indoor fireplace") ? "selected" : ""}><FaFire /> Indoor fireplace</button>
          <button onClick={() => toggleFilter("Smoking allowed")} className={selectedFilters.includes("Smoking allowed") ? "selected" : ""}><FaSmoking /> Smoking allowed</button>
        </div>
      </div>

      <div className="amenity-group">
        <h5>Safety</h5>
        <div className="amenity-buttons">
          <button onClick={() => toggleFilter("Smoke alarm")} className={selectedFilters.includes("Smoke alarm") ? "selected" : ""}><GiAlarmClock/> Smoke alarm</button>
          <button onClick={() => toggleFilter("Carbon monoxide alarm")} className={selectedFilters.includes("Carbon monoxide alarm") ? "selected" : ""}><GiTimeTrap/> Carbon monoxide alarm</button>
        </div>
      </div>

      <p className="toggle-amenities" onClick={() => setExpanded(null)}>
        Show less <FaChevronUp className="arrow" />
      </p>
    </div>
  ) : (
    <div className="amenities">
      <button onClick={() => toggleFilter("Wifi")} className={selectedFilters.includes("Wifi") ? "selected" : ""}><FaWifi /> Wifi</button>
      <button onClick={() => toggleFilter("Gym")} className={selectedFilters.includes("Gym") ? "selected" : ""}><FaDumbbell /> Gym</button>
      <button onClick={() => toggleFilter("Pool")} className={selectedFilters.includes("Pool") ? "selected" : ""}><FaSwimmer /> Pool</button>
      <button onClick={() => toggleFilter("Workspace")} className={selectedFilters.includes("Workspace") ? "selected" : ""}><FaLaptop /> Workspace</button>
      <button onClick={() => toggleFilter("Beachfront")} className={selectedFilters.includes("Beachfront") ? "selected" : ""}><FaUmbrellaBeach /> Beachfront</button>
      <button onClick={() => toggleFilter("Kitchen")} className={selectedFilters.includes("Kitchen") ? "selected" : ""}><FaUtensils /> Kitchen</button>
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

            <button onClick={() => toggleFilter("Instant Book")} className={selectedFilters.includes("Instant Book") ? "selected" : ""}><FaBolt /> Instant Book</button>
            <button onClick={() => toggleFilter("Self check-in")} className={selectedFilters.includes("Self check-in") ? "selected" : ""}><FaSearch /> Self check-in</button>
            <button onClick={() => toggleFilter("Allows pets")} className={selectedFilters.includes("Allows pets") ? "selected" : ""}><FaDog /> Allows pets</button>
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
 