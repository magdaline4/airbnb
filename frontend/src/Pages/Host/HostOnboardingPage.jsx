import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import "./HostOnboardingPage.scss";
import { FaHome, FaBed, FaBath, FaWifi, FaCar, FaUtensils, FaSwimmingPool, FaCamera, FaMapMarkerAlt, FaDollarSign, FaCalendarAlt, FaCheck } from "react-icons/fa";
import { MdKeyboardArrowRight, MdKeyboardArrowLeft, MdPhotoCamera, MdLocationOn } from "react-icons/md";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";



const HostOnboardingPage = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [hostData, setHostData] = useState({
    // Step 1: Welcome
    hostType: "",
    
    // Step 2: Property Type
    propertyType: "",
    propertyCategory: "",
    
    // Step 3: Location
    address: "",
    city: "",
    state: "",
    zipCode: "",
    country: "",
    coordinates: null,
    
    // Step 4: Basics
    bedrooms: 0,
    bathrooms: 0,
    guests: 0,
    beds: 0,
    
    // Step 5: Amenities
    amenities: [],
    
    // Step 6: Photos
    photos: [],
    
    // Step 7: Title & Description
    title: "",
    description: "",
    
    // Step 8: Pricing
    basePrice: 0,
    currency: "USD",
    
    // Step 9: Availability
    availability: { startDate: null, endDate: null },
    minStay: "1",
    maxStay: "No limit",
    showCalendar: false,
    
    // Step 10: Review
    isReady: false
  });

  const totalSteps = 10;
  const progress = (currentStep / totalSteps) * 100;

  const handleInputChange = (field, value) => {
    setHostData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleArrayToggle = (field, value) => {
    setHostData(prev => ({
      ...prev,
      [field]: prev[field].includes(value) 
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  const handleNextStep = () => {
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmitListing = async () => {
    try {
      console.log("Submitting listing:", hostData);
      alert("Congratulations! Your listing has been published!");
      navigate("/host/dashboard");
    } catch (err) {
      console.error("Listing submission failed:", err);
      alert("Failed to publish listing. Please try again.");
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1: return hostData.hostType !== "";
      case 2: return hostData.propertyType !== "" && hostData.propertyCategory !== "";
      case 3: return hostData.address && hostData.city && hostData.country;
      case 4: return hostData.bedrooms > 0 && hostData.bathrooms > 0 && hostData.guests > 0;
      case 5: return hostData.amenities.length > 0;
      case 6: return hostData.photos.length > 0;
      case 7: return hostData.title && hostData.description;
      case 8: return hostData.basePrice > 0;
      case 9: return Object.keys(hostData.availability).length > 0;
      case 10: return hostData.isReady;
      default: return false;
    }
  };

  return (
    <>
      <Navbar />
      <div className="host-onboarding-page">
        <div className="onboarding-container">
          {/* Progress Bar */}
          <div className="progress-section">
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%` }}></div>
            </div>
            <div className="progress-text">
              Step {currentStep} of {totalSteps}
            </div>
          </div>

          <div className="onboarding-content">
            {/* Left Side - Steps */}
            <div className="steps-sidebar">
              {[
                { step: 1, title: "Welcome", icon: <FaHome /> },
                { step: 2, title: "Property type", icon: <FaBed /> },
                { step: 3, title: "Location", icon: <MdLocationOn /> },
                { step: 4, title: "Basics", icon: <FaBath /> },
                { step: 5, title: "Amenities", icon: <FaWifi /> },
                { step: 6, title: "Photos", icon: <MdPhotoCamera /> },
                { step: 7, title: "Title", icon: <FaCamera /> },
                { step: 8, title: "Pricing", icon: <FaDollarSign /> },
                { step: 9, title: "Availability", icon: <FaCalendarAlt /> },
                { step: 10, title: "Review", icon: <FaCheck /> }
              ].map(({ step, title, icon }) => (
                <div 
                  key={step} 
                  className={`step-item ${currentStep === step ? "active" : ""} ${currentStep > step ? "completed" : ""}`}
                >
                  <div className="step-icon">{icon}</div>
                  <span>{title}</span>
                </div>
              ))}
            </div>

            {/* Right Side - Content */}
            <div className="content-area">
              {/* Step 1: Welcome */}
              {currentStep === 1 && (
                <div className="step-content">
                  <h1>Welcome to Airbnb</h1>
                  <p className="step-description">
                    Let's get started listing your space. You can share any kind of space.
                  </p>
                  
                  <div className="welcome-options">
                    <div 
                      className={`option-card ${hostData.hostType === "individual" ? "selected" : ""}`}
                      onClick={() => handleInputChange("hostType", "individual")}
                    >
                      <div className="option-icon">
                        <FaHome />
                      </div>
                      <div className="option-content">
                        <h3>Individual host</h3>
                        <p>List a home, apartment, or room</p>
                      </div>
                    </div>
                    
                    <div 
                      className={`option-card ${hostData.hostType === "business" ? "selected" : ""}`}
                      onClick={() => handleInputChange("hostType", "business")}
                    >
                      <div className="option-icon">
                        <FaBed />
                      </div>
                      <div className="option-content">
                        <h3>Business host</h3>
                        <p>List multiple properties or a hotel</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Property Type */}
              {currentStep === 2 && (
                <div className="step-content">
                  <h1>What kind of place are you listing?</h1>
                  
                  <div className="property-types">
                    <div 
                      className={`property-card ${hostData.propertyType === "entire" ? "selected" : ""}`}
                      onClick={() => handleInputChange("propertyType", "entire")}
                    >
                      <h3>Entire place</h3>
                      <p>Guests have the whole place to themselves</p>
                    </div>
                    
                    <div 
                      className={`property-card ${hostData.propertyType === "private" ? "selected" : ""}`}
                      onClick={() => handleInputChange("propertyType", "private")}
                    >
                      <h3>Private room</h3>
                      <p>Guests have their own room in a home, plus access to shared spaces</p>
                    </div>
                    
                    <div 
                      className={`property-card ${hostData.propertyType === "shared" ? "selected" : ""}`}
                      onClick={() => handleInputChange("propertyType", "shared")}
                    >
                      <h3>Shared room</h3>
                      <p>Guests sleep in a room or common area that may be shared with you or others</p>
                    </div>
                  </div>

                  <div className="property-categories">
                    <h3>What type of property is this?</h3>
                    <div className="category-grid">
                      {["House", "Apartment", "Guesthouse", "Hotel", "Hostel", "Villa", "Cabin", "Condo", "Townhouse", "Loft", "Other"].map(category => (
                        <button
                          key={category}
                          className={`category-btn ${hostData.propertyCategory === category ? "selected" : ""}`}
                          onClick={() => handleInputChange("propertyCategory", category)}
                        >
                          {category}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Location */}
              {currentStep === 3 && (
                <div className="step-content">
                  <h1>Where's your place located?</h1>
                  
                  <div className="location-form">
                    <div className="form-group">
                      <label>Address</label>
                      <input
                        type="text"
                        placeholder="Enter your address"
                        value={hostData.address}
                        onChange={(e) => handleInputChange("address", e.target.value)}
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>City</label>
                        <input
                          type="text"
                          placeholder="City"
                          value={hostData.city}
                          onChange={(e) => handleInputChange("city", e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>State/Province</label>
                        <input
                          type="text"
                          placeholder="State"
                          value={hostData.state}
                          onChange={(e) => handleInputChange("state", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>ZIP/Postal code</label>
                        <input
                          type="text"
                          placeholder="ZIP code"
                          value={hostData.zipCode}
                          onChange={(e) => handleInputChange("zipCode", e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Country</label>
                        <select
                          value={hostData.country}
                          onChange={(e) => handleInputChange("country", e.target.value)}
                        >
                          <option value="">Select country</option>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="AU">Australia</option>
                          <option value="IN">India</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Basics */}
              {currentStep === 4 && (
                <div className="step-content">
                  <h1>Share some basics about your place</h1>
                  
                  <div className="basics-form">
                    <div className="counter-group">
                      <label>How many guests can your place accommodate?</label>
                      <div className="counter">
                        <button onClick={() => handleInputChange("guests", Math.max(1, hostData.guests - 1))}>-</button>
                        <span>{hostData.guests}</span>
                        <button onClick={() => handleInputChange("guests", hostData.guests + 1)}>+</button>
                      </div>
                    </div>
                    
                    <div className="counter-group">
                      <label>How many bedrooms can guests use?</label>
                      <div className="counter">
                        <button onClick={() => handleInputChange("bedrooms", Math.max(0, hostData.bedrooms - 1))}>-</button>
                        <span>{hostData.bedrooms}</span>
                        <button onClick={() => handleInputChange("bedrooms", hostData.bedrooms + 1)}>+</button>
                      </div>
                    </div>
                    
                    <div className="counter-group">
                      <label>How many bathrooms can guests use?</label>
                      <div className="counter">
                        <button onClick={() => handleInputChange("bathrooms", Math.max(0, hostData.bathrooms - 1))}>-</button>
                        <span>{hostData.bathrooms}</span>
                        <button onClick={() => handleInputChange("bathrooms", hostData.bathrooms + 1)}>+</button>
                      </div>
                    </div>
                    
                    <div className="counter-group">
                      <label>How many beds can guests use?</label>
                      <div className="counter">
                        <button onClick={() => handleInputChange("beds", Math.max(1, hostData.beds - 1))}>-</button>
                        <span>{hostData.beds}</span>
                        <button onClick={() => handleInputChange("beds", hostData.beds + 1)}>+</button>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 5: Amenities */}
              {currentStep === 5 && (
                <div className="step-content">
                  <h1>Tell guests what your place has to offer</h1>
                  
                  <div className="amenities-grid">
                    {[
                      { id: "wifi", name: "Wifi", icon: <FaWifi /> },
                      { id: "kitchen", name: "Kitchen", icon: <FaUtensils /> },
                      { id: "parking", name: "Free parking", icon: <FaCar /> },
                      { id: "pool", name: "Pool", icon: <FaSwimmingPool /> },
                      { id: "ac", name: "Air conditioning", icon: <FaBed /> },
                      { id: "heating", name: "Heating", icon: <FaBed /> },
                      { id: "tv", name: "TV", icon: <FaBed /> },
                      { id: "washer", name: "Washer", icon: <FaBed /> },
                      { id: "dryer", name: "Dryer", icon: <FaBed /> },
                      { id: "hot_tub", name: "Hot tub", icon: <FaBed /> },
                      { id: "gym", name: "Gym", icon: <FaBed /> },
                      { id: "workspace", name: "Dedicated workspace", icon: <FaBed /> }
                    ].map(amenity => (
                      <div
                        key={amenity.id}
                        className={`amenity-item ${hostData.amenities.includes(amenity.id) ? "selected" : ""}`}
                        onClick={() => handleArrayToggle("amenities", amenity.id)}
                      >
                        <div className="amenity-icon">{amenity.icon}</div>
                        <span>{amenity.name}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 6: Photos */}
             {/* Step 6: Photos */}
{currentStep === 6 && (
  <div className="step-content">
    <h1>Add some photos of your place</h1>
    <p>You'll need 5 photos to get started. You can add more or make changes later.</p>
    
    <div className="photo-upload-area">
      <div className="upload-zone">
        <MdPhotoCamera className="upload-icon" />
        <h3>Drag your photos here</h3>
        <p>Choose at least 5 photos</p>

        {/* Hidden file input */}
        <input
          type="file"
          accept="image/*"
          multiple
          id="photoInput"
          style={{ display: "none" }}
          onChange={(e) => {
            const files = Array.from(e.target.files);
            const fileURLs = files.map(file => URL.createObjectURL(file));
            setHostData(prev => ({
              ...prev,
              photos: [...prev.photos, ...fileURLs]
            }));
          }}
        />

        <button
          className="upload-button"
          onClick={() => document.getElementById("photoInput").click()}
        >
          Upload from your device
        </button>
      </div>

      {/* Photo Preview Section */}
      {hostData.photos.length > 0 && (
        <div className="uploaded-photos">
          <h3>Uploaded photos ({hostData.photos.length})</h3>
          <div className="photo-grid">
            {hostData.photos.map((photo, index) => (
              <div key={index} className="photo-preview">
                <img src={photo} alt={`Upload ${index + 1}`} />
                <button
                  className="remove-photo"
                  onClick={() =>
                    setHostData(prev => ({
                      ...prev,
                      photos: prev.photos.filter((_, i) => i !== index)
                    }))
                  }
                >
                  ×
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  </div>
)}


              {/* Step 7: Title & Description */}
              {currentStep === 7 && (
                <div className="step-content">
                  <h1>Now, let's give your place a title</h1>
                  <p>Short titles work best. Have fun with it—you can always change it later.</p>
                  
                  <div className="title-form">
                    <textarea
                      placeholder="Write your title here..."
                      value={hostData.title}
                      onChange={(e) => handleInputChange("title", e.target.value)}
                      maxLength="50"
                      rows="2"
                    />
                    <div className="character-count">{hostData.title.length}/50</div>
                  </div>
                  
                  <h2>Create your description</h2>
                  <p>Share what makes your place special.</p>
                  
                  <div className="description-form">
                    <textarea
                      placeholder="Write your description here..."
                      value={hostData.description}
                      onChange={(e) => handleInputChange("description", e.target.value)}
                      maxLength="500"
                      rows="6"
                    />
                    <div className="character-count">{hostData.description.length}/500</div>
                  </div>
                </div>
              )}

              {/* Step 8: Pricing */}
              {currentStep === 8 && (
                <div className="step-content">
                  <h1>Now, set your price</h1>
                  <p>You can change it anytime.</p>
                  
                  <div className="pricing-form">
                    <div className="price-input">
                      <label>Base price</label>
                      <div className="price-field">
                        <span className="currency">$</span>
                        <input
                          type="number"
                          placeholder="0"
                          value={hostData.basePrice}
                          onChange={(e) => handleInputChange("basePrice", parseInt(e.target.value) || 0)}
                        />
                        <span className="period">USD per night</span>
                      </div>
                    </div>
                    
                    <div className="pricing-tips">
                      <h3>Pricing tips</h3>
                      <ul>
                        <li>Set a competitive price to attract more bookings</li>
                        <li>Consider seasonal pricing</li>
                        <li>You can adjust your price anytime</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 9: Availability */}
              {currentStep === 9 && (
  <div className="step-content">
    <h1>Set your availability</h1>
    <p>Choose when your place is available for guests.</p>

    <div className="availability-form">
      {/* 🗓️ Date Picker Trigger */}
      <div className="date-picker-trigger">
        <label htmlFor="availability">Select dates</label>

        <div
          className="date-input"
          onClick={() =>
            setHostData((prev) => ({
              ...prev,
              showCalendar: !prev.showCalendar,
            }))
          }
        >
          <FaCalendarAlt className="calendar-icon" />
          <span>
            {hostData.availability?.startDate && hostData.availability?.endDate
              ? `${new Date(
                  hostData.availability.startDate
                ).toLocaleDateString()} - ${new Date(
                  hostData.availability.endDate
                ).toLocaleDateString()}`
              : "Select your available dates"}
          </span>
        </div>

        {/* 📅 Popup Calendar */}
        {hostData.showCalendar && (
          <div className="calendar-popup">
            <DateRange
              editableDateInputs={true}
              onChange={(item) => {
                const { startDate, endDate } = item.selection;
                setHostData((prev) => ({
                  ...prev,
                  availability: { startDate, endDate },
                }));
              }}
              moveRangeOnFirstSelection={false}
              ranges={[
                {
                  startDate:
                    hostData.availability?.startDate || new Date(),
                  endDate: hostData.availability?.endDate || new Date(),
                  key: "selection",
                },
              ]}
              minDate={new Date()}
            />
            <button
              className="close-calendar"
              onClick={() =>
                setHostData((prev) => ({
                  ...prev,
                  showCalendar: false,
                }))
              }
            >
              Done
            </button>
          </div>
        )}
      </div>

      {/* ⚙️ Availability Settings */}
      <div className="availability-settings">
        <h3>Stay duration</h3>

        <div className="setting-item">
          <label>Minimum stay</label>
          <select
            value={hostData.minStay || "1"}
            onChange={(e) =>
              handleInputChange("minStay", e.target.value)
            }
          >
            <option value="1">1 night</option>
            <option value="2">2 nights</option>
            <option value="3">3 nights</option>
            <option value="7">1 week</option>
          </select>
        </div>

        <div className="setting-item">
          <label>Maximum stay</label>
          <select
            value={hostData.maxStay || "No limit"}
            onChange={(e) =>
              handleInputChange("maxStay", e.target.value)
            }
          >
            <option value="No limit">No limit</option>
            <option value="7">7 nights</option>
            <option value="14">14 nights</option>
            <option value="28">28 nights</option>
          </select>
        </div>
      </div>
    </div>
  </div>
)}
              {/* Step 10: Review */}
              {currentStep === 10 && (
                <div className="step-content">
                  <h1>Review your listing</h1>
                  
                  <div className="review-summary">
                    <div className="summary-section">
                      <h3>Property details</h3>
                      <p><strong>Type:</strong> {hostData.propertyType} - {hostData.propertyCategory}</p>
                      <p><strong>Location:</strong> {hostData.address}, {hostData.city}</p>
                      <p><strong>Guests:</strong> {hostData.guests} • <strong>Bedrooms:</strong> {hostData.bedrooms} • <strong>Bathrooms:</strong> {hostData.bathrooms}</p>
                    </div>
                    
                    <div className="summary-section">
                      <h3>Amenities</h3>
                      <p>{hostData.amenities.join(", ")}</p>
                    </div>
                    
                    <div className="summary-section">
                      <h3>Pricing</h3>
                      <p><strong>Base price:</strong> ${hostData.basePrice} per night</p>
                    </div>
                    
                    <div className="agreement-section">
                      <label className="agreement-checkbox">
                        <input
                          type="checkbox"
                          checked={hostData.isReady}
                          onChange={(e) => handleInputChange("isReady", e.target.checked)}
                        />
                        <span>I agree to Airbnb's Terms of Service and Privacy Policy</span>
                      </label>
                    </div>
                  </div>
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="step-navigation">
                <button 
                  onClick={handlePrevStep} 
                  className="nav-button prev"
                  disabled={currentStep === 1}
                >
                  <MdKeyboardArrowLeft />
                  Back
                </button>
                
                {currentStep < totalSteps ? (
                  <button 
                    onClick={handleNextStep} 
                    className="nav-button next"
                    disabled={!isStepValid()}
                  >
                    Next
                    <MdKeyboardArrowRight />
                  </button>
                ) : (
                  <button 
                    onClick={handleSubmitListing} 
                    className="nav-button submit"
                    disabled={!isStepValid()}
                  >
                    Publish listing
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default HostOnboardingPage;
