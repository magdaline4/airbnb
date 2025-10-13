import React, { useState } from "react";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import "./HostOnboardingPage.scss";
import { 
  FaHome, 
  FaBed, 
  FaBath, 
  FaWifi, 
  FaDollarSign, 
  FaCalendarAlt, 
  FaCheck,
  FaUtensils,
  FaCar,
  FaSwimmingPool,
  FaTv,
  FaWind,
  FaFire,
  FaUmbrellaBeach,
  FaCoffee,
  FaShower,
  FaSnowflake,
  FaHotTub,
  FaDumbbell
} from "react-icons/fa";
import { 
  MdPhotoCamera, 
  MdLocationOn, 
  MdKeyboardArrowLeft, 
  MdKeyboardArrowRight,
  MdOutlineHouseSiding,
  MdApartment,
  MdHouse,
  MdVilla,
  MdCabin,
  MdBusiness
} from "react-icons/md";
import { DateRange } from "react-date-range";
import "react-date-range/dist/styles.css";
import "react-date-range/dist/theme/default.css";
import { toast } from "react-toastify";
import { roomService } from "../../services/roomService";

const PROPERTY_TYPES = [
  "House", "Flat", "Guest house", "Hotel", "Apartment", 
  "Hostel", "villa", "cabin", "condo", "Townhouse", "Loft", "Others"
];

const ROOM_TYPES = ["Entire home", "Private Room", "Shared Room"];

const AMENITIES_MAPPING = {
  "Wifi": { icon: <FaWifi />, label: "Wifi" },
  "Air conditioning": { icon: <FaSnowflake />, label: "Air conditioning" },
  "Pool": { icon: <FaSwimmingPool />, label: "Pool" },
  "Dryer": { icon: <FaShower />, label: "Dryer" },
  "Heating": { icon: <FaFire />, label: "Heating" },
  "Workspace": { icon: <MdBusiness />, label: "Workspace" },
  "Essentials": { icon: <FaCoffee />, label: "Essentials" },
  "Kitchen": { icon: <FaUtensils />, label: "Kitchen" },
  "Washing machine": { icon: <FaShower />, label: "Washing machine" },
  "TV": { icon: <FaTv />, label: "TV" },
  "Hair dryer": { icon: <FaWind />, label: "Hair dryer" },
  "Iron": { icon: <FaWind />, label: "Iron" },
  "Features": { icon: <FaUmbrellaBeach />, label: "Features" },
  "Hot tub": { icon: <FaHotTub />, label: "Hot tub" },
  "Free parking": { icon: <FaCar />, label: "Free parking" },
  "EV charger": { icon: <FaCar />, label: "EV charger" },
  "Cot": { icon: <FaBed />, label: "Cot" },
  "King bed": { icon: <FaBed />, label: "King bed" },
  "Gym": { icon: <FaDumbbell />, label: "Gym" },
  "BBQ grill": { icon: <FaUtensils />, label: "BBQ grill" },
  "Breakfast": { icon: <FaCoffee />, label: "Breakfast" }
};

const CANCELLATION_POLICIES = [
  "flexible",
  "moderate",
  "strict",
  "super_strict",
  "no_refund"
];

const HostOnboardingPage = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10;
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploadingPhotos, setIsUploadingPhotos] = useState(false);
  const [showCalendar, setShowCalendar] = useState(false);

  const [hostData, setHostData] = useState({
    hostType: "",
    propertyType: "",
    roomType: "",
    address: { street: "", city: "", state: "", country: "", postalCode: "" },
    location: { lat: 0, lng: 0 },
    guests: 1,
    bedrooms: 1,
    bathrooms: 1,
    beds: 1,
    amenities: [],
    images: [],
    title: "",
    description: "",
    price: 0,
    minNights: 1,
    maxNights: 30,
    checkIn: "14:00",
    checkOut: "11:00",
    availability: { startDate: new Date(), endDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000) },
    cancellationPolicy: "moderate",
    published: true
  });

  const progress = (currentStep / totalSteps) * 100;

  // Simulate geocoding
  const geocodeAddress = async (address) => {
    return {
      lat: Math.random() * 180 - 90,
      lng: Math.random() * 360 - 180
    };
  };

  const handleInputChange = (field, value) => {
    if (field.includes('.')) {
      const [parent, child] = field.split('.');
      setHostData(prev => ({
        ...prev,
        [parent]: {
          ...prev[parent],
          [child]: value
        }
      }));
    } else {
      setHostData(prev => ({
        ...prev,
        [field]: value
      }));
    }
  };

  const handleArrayToggle = (field, value) => {
    setHostData(prev => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter(item => item !== value)
        : [...prev[field], value]
    }));
  };

  // Compress image function
  const compressImage = (file, maxWidth = 800, maxHeight = 600, quality = 0.7) => {
    return new Promise((resolve) => {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        let width = img.width;
        let height = img.height;

        // Calculate new dimensions while maintaining aspect ratio
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round((height * maxWidth) / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round((width * maxHeight) / height);
            height = maxHeight;
          }
        }

        canvas.width = width;
        canvas.height = height;

        // Draw and compress image
        ctx.drawImage(img, 0, 0, width, height);
        const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
        
        resolve(compressedDataUrl);
      };

      img.src = URL.createObjectURL(file);
    });
  };

  const handlePhotoUpload = async (files) => {
    setIsUploadingPhotos(true);
    try {
      // Convert and compress each file to base64
      const compressedImages = await Promise.all(
        files.map(async (file) => {
          // Validate file type
          if (!file.type.startsWith('image/')) {
            throw new Error(`File ${file.name} is not an image`);
          }
          
          // Validate file size (max 2MB to avoid large payloads)
          if (file.size > 2 * 1024 * 1024) {
            throw new Error(`File ${file.name} is too large. Maximum size is 2MB`);
          }
          
          // Compress image before converting to base64
          const compressedImage = await compressImage(file, 800, 600, 0.6); // More compression
          return compressedImage;
        })
      );
      
      setHostData(prev => ({
        ...prev,
        images: [...prev.images, ...compressedImages]
      }));
      
      toast.success(`${files.length} photos uploaded successfully!`);
    } catch (error) {
      console.error('Photo upload error:', error);
      toast.error(error.message || "Failed to upload photos");
    } finally {
      setIsUploadingPhotos(false);
    }
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return hostData.hostType !== "";
      case 2:
        return hostData.propertyType !== "" && hostData.roomType !== "";
      case 3:
        return hostData.address.street && hostData.address.city && 
               hostData.address.state && hostData.address.country && 
               hostData.address.postalCode;
      case 4:
        return hostData.guests > 0 && hostData.beds > 0;
      case 5:
        return true;
      case 6:
        return hostData.images.length >= 1;
      case 7:
        return hostData.title.length >= 10 && hostData.description.length >= 50;
      case 8:
        return hostData.price > 0;
      case 9:
        return hostData.availability.startDate && hostData.availability.endDate;
      case 10:
        return true;
      default:
        return false;
    }
  };

  const handleNextStep = async () => {
    if (currentStep === 3 && hostData.address.street) {
      try {
        const coordinates = await geocodeAddress(hostData.address.street);
        setHostData(prev => ({ ...prev, location: coordinates }));
      } catch (error) {
        console.error("Geocoding failed:", error);
      }
    }
    
    if (currentStep < totalSteps) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const debugValues = () => {
    console.log("🔍 DEBUG - Property Type:", {
      value: hostData.propertyType,
      length: hostData.propertyType?.length,
      charCodes: hostData.propertyType?.split('').map(c => c.charCodeAt(0))
    });
    console.log("🔍 DEBUG - Room Type:", {
      value: hostData.roomType,
      length: hostData.roomType?.length,
      charCodes: hostData.roomType?.split('').map(c => c.charCodeAt(0))
    });
  };

  const handleSubmitListing = async () => {
    setIsSubmitting(true);
    try {
      // Debug the values before submission
      debugValues();

      // Use only uploaded images - no default images
      if (hostData.images.length === 0) {
        throw new Error("Please upload at least one photo");
      }

      // Check if base64 images are too large and optimize if needed
      const optimizedImages = hostData.images.map(image => {
        // If base64 string is too long, compress further
        if (image.length > 500000) { // ~500KB threshold
          console.warn('Large base64 image detected, consider recompressing');
          // You could add additional compression logic here if needed
        }
        return image;
      });

      // Limit to 5 images max to avoid payload size issues
      const finalImages = optimizedImages.slice(0, 5);

      // Calculate payload size
      const testPayload = {
        ...hostData,
        images: finalImages
      };
      const payloadSize = JSON.stringify(testPayload).length;
      console.log('📦 Payload size:', (payloadSize / 1024).toFixed(2), 'KB');

      if (payloadSize > 5000000) { // 5MB threshold
        toast.warning('Large data size detected. Consider reducing image count or size.');
      }

      const listingData = {
        title: (hostData.title || "Beautiful Property").trim(),
        description: (hostData.description || "A wonderful place to stay").trim(),
        propertyType: hostData.propertyType?.trim(),
        roomType: hostData.roomType?.trim(),
        type: hostData.propertyType?.trim(),
        location: {
          lat: hostData.location.lat || 40.7128,
          lng: hostData.location.lng || -74.0060
        },
        address: {
          street: (hostData.address.street || "123 Main Street").trim(),
          city: (hostData.address.city || "New York").trim(),
          state: (hostData.address.state || "NY").trim(),
          country: (hostData.address.country || "US").trim(),
          postalCode: (hostData.address.postalCode || "10001").trim()
        },
        guests: Number(hostData.guests) || 2,
        beds: Number(hostData.beds) || 1,
        bedrooms: Number(hostData.bedrooms) || 1,
        bathrooms: Number(hostData.bathrooms) || 1,
        amenities: hostData.amenities.length > 0 ? hostData.amenities.map(a => a.trim()) : ["Wifi"],
        price: Number(hostData.price) || 99,
        minNights: Number(hostData.minNights) || 1,
        maxNights: Number(hostData.maxNights) || 30,
        rating: 0,
        reviewCount: 0,
        isGuestFavorite: false,
        images: finalImages, // Only uploaded images
        cancellationPolicy: hostData.cancellationPolicy || "moderate",
        checkIn: hostData.checkIn || "14:00",
        checkOut: hostData.checkOut || "11:00",
        verified: false,
        published: true
      };

      console.log("🎯 FINAL SUBMISSION DATA:", {
        propertyType: `"${listingData.propertyType}"`,
        roomType: `"${listingData.roomType}"`,
        imagesCount: listingData.images.length,
        firstImageSize: listingData.images[0]?.length
      });

      // Validate required fields
      if (!listingData.propertyType || !listingData.roomType) {
        throw new Error("Please select both property type and room type");
      }

      // Test with hardcoded enum values first
      const testData = {
        ...listingData,
        propertyType: "House", // Hardcoded for testing
        roomType: "Entire home" // Hardcoded for testing
      };

      console.log("🧪 TESTING WITH HARCODED VALUES:", testData.propertyType, testData.roomType);

      const result = await roomService.createRoom(testData);
      
      toast.success('🎉 Listing published successfully!');
      
      setTimeout(() => {
        window.location.href = `/rooms/${result._id}`;
      }, 2000);

    } catch (error) {
      console.error('❌ Error submitting listing:', error);
      console.error('❌ Error response:', error.response?.data);
      
      if (error.response?.data?.message) {
        const errorMessage = error.response.data.message;
        if (errorMessage.includes('enum')) {
          toast.error('Enum validation failed. Please check the console for details.');
          console.log("🔧 SUGGESTION: Try these exact values:");
          console.log("Property Types:", PROPERTY_TYPES);
          console.log("Room Types:", ROOM_TYPES);
        } else if (errorMessage.includes('payload') || errorMessage.includes('large')) {
          toast.error('Data too large. Please reduce image size or count and try again.');
        } else {
          toast.error(`Validation Error: ${errorMessage}`);
        }
      } else if (error.code === 'ERR_NETWORK') {
        toast.error('Network error. Please check your connection.');
      } else if (error.message) {
        toast.error(error.message);
      } else {
        toast.error('Failed to publish listing. Please try again.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const getPropertyIcon = (type) => {
    const icons = {
      "House": <MdHouse />,
      "Flat": <MdApartment />,
      "Apartment": <MdApartment />,
      "villa": <MdVilla />,
      "cabin": <MdCabin />,
      "condo": <MdOutlineHouseSiding />,
      "Townhouse": <MdOutlineHouseSiding />,
      "Loft": <MdBusiness />,
      "Guest house": <MdHouse />,
      "Hotel": <MdBusiness />,
      "Hostel": <MdBusiness />,
      "Others": <MdHouse />
    };
    return icons[type] || <MdHouse />;
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
            {/* Steps Sidebar */}
            <div className="steps-sidebar">
              {[
                { step: 1, title: "Welcome", icon: <FaHome /> },
                { step: 2, title: "Property Type", icon: <MdHouse /> },
                { step: 3, title: "Location", icon: <MdLocationOn /> },
                { step: 4, title: "Basics", icon: <FaBed /> },
                { step: 5, title: "Amenities", icon: <FaWifi /> },
                { step: 6, title: "Photos", icon: <MdPhotoCamera /> },
                { step: 7, title: "Details", icon: <FaHome /> },
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
                  {currentStep > step && <FaCheck className="check-icon" />}
                </div>
              ))}
            </div>

            {/* Content Area */}
            <div className="content-area">
              {/* Step 1: Welcome */}
              {currentStep === 1 && (
                <div className="step-content">
                  <h1>Welcome to Airbnb Hosting</h1>
                  <p className="step-description">
                    Let's create your listing together. Share your space and start earning.
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
                        <h3>Individual Host</h3>
                        <p>List your home, apartment, or spare room</p>
                      </div>
                    </div>
                    
                    <div 
                      className={`option-card ${hostData.hostType === "professional" ? "selected" : ""}`}
                      onClick={() => handleInputChange("hostType", "professional")}
                    >
                      <div className="option-icon">
                        <MdBusiness />
                      </div>
                      <div className="option-content">
                        <h3>Professional Host</h3>
                        <p>Manage multiple properties or hospitality business</p>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Property Type with enhanced debugging */}
              {currentStep === 2 && (
                <div className="step-content">
                  <h1>What type of property are you listing?</h1>
                  
                  {/* Enhanced debug info */}
                  <div style={{background: '#fff3cd', padding: '10px', marginBottom: '20px', borderRadius: '5px', fontSize: '12px'}}>
                    <strong>🔍 DEBUG INFO:</strong><br/>
                    Selected Property Type: <code>"{hostData.propertyType}"</code> (Length: {hostData.propertyType?.length})<br/>
                    Selected Room Type: <code>"{hostData.roomType}"</code> (Length: {hostData.roomType?.length})<br/>
                    <button 
                      onClick={debugValues}
                      style={{marginTop: '5px', padding: '2px 8px', fontSize: '10px'}}
                    >
                      Show Character Codes
                    </button>
                  </div>
                  
                  <div className="property-types-section">
                    <h3>What kind of space will guests have?</h3>
                    <div className="room-type-options">
                      {ROOM_TYPES.map(type => (
                        <div
                          key={type}
                          className={`room-type-card ${hostData.roomType === type ? "selected" : ""}`}
                          onClick={() => {
                            console.log("Setting roomType to:", `"${type}"`, "Length:", type.length);
                            handleInputChange("roomType", type);
                          }}
                        >
                          <h4>{type}</h4>
                          <p>
                            {type === "Entire home" && "Guests have the entire place to themselves"}
                            {type === "Private Room" && "Guests have their own private room"}
                            {type === "Shared Room" && "Guests share the space with others"}
                          </p>
                        </div>
                      ))}
                    </div>

                    <h3>What type of property is this?</h3>
                    <div className="property-grid">
                      {PROPERTY_TYPES.map(type => (
                        <div
                          key={type}
                          className={`property-card ${hostData.propertyType === type ? "selected" : ""}`}
                          onClick={() => {
                            console.log("Setting propertyType to:", `"${type}"`, "Length:", type.length);
                            handleInputChange("propertyType", type);
                          }}
                        >
                          <div className="property-icon">
                            {getPropertyIcon(type)}
                          </div>
                          <span>{type}</span>
                        </div>
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
                      <label>Street Address</label>
                      <input
                        type="text"
                        placeholder="Enter your full address"
                        value={hostData.address.street}
                        onChange={(e) => handleInputChange("address.street", e.target.value)}
                      />
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>City</label>
                        <input
                          type="text"
                          placeholder="City"
                          value={hostData.address.city}
                          onChange={(e) => handleInputChange("address.city", e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>State/Province</label>
                        <input
                          type="text"
                          placeholder="State"
                          value={hostData.address.state}
                          onChange={(e) => handleInputChange("address.state", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="form-row">
                      <div className="form-group">
                        <label>ZIP/Postal Code</label>
                        <input
                          type="text"
                          placeholder="ZIP code"
                          value={hostData.address.postalCode}
                          onChange={(e) => handleInputChange("address.postalCode", e.target.value)}
                        />
                      </div>
                      
                      <div className="form-group">
                        <label>Country</label>
                        <select
                          value={hostData.address.country}
                          onChange={(e) => handleInputChange("address.country", e.target.value)}
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
                  
                  <div className="basics-grid">
                    <div className="counter-group">
                      <div className="counter-label">
                        <FaBed />
                        <span>Guests</span>
                      </div>
                      <div className="counter">
                        <button onClick={() => handleInputChange("guests", Math.max(1, hostData.guests - 1))}>-</button>
                        <span>{hostData.guests}</span>
                        <button onClick={() => handleInputChange("guests", hostData.guests + 1)}>+</button>
                      </div>
                    </div>
                    
                    <div className="counter-group">
                      <div className="counter-label">
                        <MdHouse />
                        <span>Bedrooms</span>
                      </div>
                      <div className="counter">
                        <button onClick={() => handleInputChange("bedrooms", Math.max(0, hostData.bedrooms - 1))}>-</button>
                        <span>{hostData.bedrooms}</span>
                        <button onClick={() => handleInputChange("bedrooms", hostData.bedrooms + 1)}>+</button>
                      </div>
                    </div>
                    
                    <div className="counter-group">
                      <div className="counter-label">
                        <FaBath />
                        <span>Bathrooms</span>
                      </div>
                      <div className="counter">
                        <button onClick={() => handleInputChange("bathrooms", Math.max(0, hostData.bathrooms - 1))}>-</button>
                        <span>{hostData.bathrooms}</span>
                        <button onClick={() => handleInputChange("bathrooms", hostData.bathrooms + 1)}>+</button>
                      </div>
                    </div>
                    
                    <div className="counter-group">
                      <div className="counter-label">
                        <FaBed />
                        <span>Beds</span>
                      </div>
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
                  <h1>What amenities do you offer?</h1>
                  <p>Select all that apply to your space</p>
                  
                  <div className="amenities-grid">
                    {Object.entries(AMENITIES_MAPPING).map(([key, amenity]) => (
                      <div
                        key={key}
                        className={`amenity-item ${hostData.amenities.includes(key) ? "selected" : ""}`}
                        onClick={() => handleArrayToggle("amenities", key)}
                      >
                        <div className="amenity-icon">{amenity.icon}</div>
                        <span>{amenity.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Step 6: Photos - Updated for real uploads */}
              {currentStep === 6 && (
                <div className="step-content">
                  <h1>Add photos of your space</h1>
                  <p>Great photos help guests imagine their stay. Add at least 1 photo to get started. Images will be compressed to reduce size.</p>
                  
                  <div className="photo-upload-area">
                    <div className="upload-zone">
                      <MdPhotoCamera className="upload-icon" />
                      <h3>Upload your photos</h3>
                      <p>JPG, PNG up to 2MB each (will be compressed)</p>

                      <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        id="photoInput"
                        style={{ display: "none" }}
                        onChange={async (e) => {
                          const files = Array.from(e.target.files || []);
                          if (files.length > 0) {
                            await handlePhotoUpload(files);
                          }
                          e.target.value = '';
                        }}
                      />

                      <button
                        className="upload-button"
                        onClick={() => document.getElementById("photoInput").click()}
                        disabled={isUploadingPhotos}
                      >
                        {isUploadingPhotos ? "Compressing..." : "Choose Photos"}
                      </button>
                    </div>

                    {hostData.images.length > 0 && (
                      <div className="uploaded-photos">
                        <h3>Your Photos ({hostData.images.length})</h3>
                        <div className="photo-grid">
                          {hostData.images.map((photo, index) => (
                            <div key={index} className="photo-preview">
                              <img 
                                src={photo} 
                                alt={`Upload ${index + 1}`} 
                                onError={(e) => {
                                  console.error('Image load error:', e);
                                  e.target.style.display = 'none';
                                }}
                              />
                              <button
                                className="remove-photo"
                                onClick={() =>
                                  setHostData(prev => ({
                                    ...prev,
                                    images: prev.images.filter((_, i) => i !== index)
                                  }))
                                }
                              >
                                ×
                              </button>
                            </div>
                          ))}
                        </div>
                        {hostData.images.length < 5 && (
                          <p className="photo-warning">⚠️ Add at least 5 photos for best results</p>
                        )}
                        <p className="photo-info">ℹ️ Images are compressed to reduce file size</p>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Step 7: Title & Description */}
              {currentStep === 7 && (
                <div className="step-content">
                  <h1>Create your listing details</h1>
                  
                  <div className="details-form">
                    <div className="form-group">
                      <label>Listing Title</label>
                      <p className="input-help">Catch guests' attention with a great title</p>
                      <textarea
                        placeholder="e.g., 'Cozy apartment with city views'"
                        value={hostData.title}
                        onChange={(e) => handleInputChange("title", e.target.value)}
                        maxLength="100"
                        rows="2"
                      />
                      <div className="character-count">{hostData.title.length}/100</div>
                    </div>
                    
                    <div className="form-group">
                      <label>Description</label>
                      <p className="input-help">Share what makes your place special</p>
                      <textarea
                        placeholder="Describe your space, location, and what makes it unique..."
                        value={hostData.description}
                        onChange={(e) => handleInputChange("description", e.target.value)}
                        maxLength="1000"
                        rows="6"
                      />
                      <div className="character-count">{hostData.description.length}/1000</div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 8: Pricing */}
              {currentStep === 8 && (
                <div className="step-content">
                  <h1>Set your nightly price</h1>
                  <p>You can adjust your price anytime based on demand</p>
                  
                  <div className="pricing-form">
                    <div className="price-input-group">
                      <label>Base price per night</label>
                      <div className="price-field">
                        <span className="currency">$</span>
                        <input
                          type="number"
                          placeholder="0"
                          min="0"
                          value={hostData.price}
                          onChange={(e) => handleInputChange("price", parseInt(e.target.value) || 0)}
                        />
                        <span className="period">USD / night</span>
                      </div>
                    </div>
                    
                    <div className="pricing-tips">
                      <h3>💡 Pricing Tips</h3>
                      <ul>
                        <li>Check similar listings in your area for competitive pricing</li>
                        <li>Consider seasonal demand in your location</li>
                        <li>Higher prices for unique amenities or premium locations</li>
                        <li>You can offer discounts for longer stays</li>
                      </ul>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 9: Availability */}
              {currentStep === 9 && (
                <div className="step-content">
                  <h1>Set your availability</h1>
                  <p>Choose when guests can book your space</p>

                  <div className="availability-form">
                    <div className="calendar-section">
                      <label>Select Available Dates</label>
                      <div 
                        className="date-input-trigger"
                        onClick={() => setShowCalendar(!showCalendar)}
                      >
                        <FaCalendarAlt className="calendar-icon" />
                        <span>
                          {hostData.availability.startDate && hostData.availability.endDate
                            ? `${hostData.availability.startDate.toLocaleDateString()} - ${hostData.availability.endDate.toLocaleDateString()}`
                            : "Select available dates"}
                        </span>
                      </div>

                      {showCalendar && (
                        <div className="calendar-popup">
                          <DateRange
                            editableDateInputs={true}
                            onChange={(item) => {
                              const { startDate, endDate } = item.selection;
                              setHostData(prev => ({
                                ...prev,
                                availability: { startDate, endDate }
                              }));
                            }}
                            moveRangeOnFirstSelection={false}
                            ranges={[{
                              startDate: hostData.availability.startDate,
                              endDate: hostData.availability.endDate,
                              key: 'selection'
                            }]}
                            minDate={new Date()}
                          />
                          <button 
                            className="close-calendar"
                            onClick={() => setShowCalendar(false)}
                          >
                            Done
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="availability-settings">
                      <div className="form-group">
                        <label>Check-in Time</label>
                        <select
                          value={hostData.checkIn}
                          onChange={(e) => handleInputChange("checkIn", e.target.value)}
                        >
                          {Array.from({length: 24}, (_, i) => {
                            const hour = i.toString().padStart(2, '0');
                            return `${hour}:00`;
                          }).map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-group">
                        <label>Check-out Time</label>
                        <select
                          value={hostData.checkOut}
                          onChange={(e) => handleInputChange("checkOut", e.target.value)}
                        >
                          {Array.from({length: 24}, (_, i) => {
                            const hour = i.toString().padStart(2, '0');
                            return `${hour}:00`;
                          }).map(time => (
                            <option key={time} value={time}>{time}</option>
                          ))}
                        </select>
                      </div>

                      <div className="form-row">
                        <div className="form-group">
                          <label>Minimum Stay (nights)</label>
                          <select
                            value={hostData.minNights}
                            onChange={(e) => handleInputChange("minNights", parseInt(e.target.value))}
                          >
                            <option value="1">1 night</option>
                            <option value="2">2 nights</option>
                            <option value="3">3 nights</option>
                            <option value="4">4 nights</option>
                            <option value="5">5 nights</option>
                            <option value="7">7 nights</option>
                          </select>
                        </div>

                        <div className="form-group">
                          <label>Maximum Stay (nights)</label>
                          <select
                            value={hostData.maxNights}
                            onChange={(e) => handleInputChange("maxNights", parseInt(e.target.value))}
                          >
                            <option value="7">7 nights</option>
                            <option value="14">14 nights</option>
                            <option value="21">21 nights</option>
                            <option value="28">28 nights</option>
                            <option value="30">30 nights</option>
                          </select>
                        </div>
                      </div>

                      <div className="form-group">
                        <label>Cancellation Policy</label>
                        <select
                          value={hostData.cancellationPolicy}
                          onChange={(e) => handleInputChange("cancellationPolicy", e.target.value)}
                        >
                          {CANCELLATION_POLICIES.map(policy => (
                            <option key={policy} value={policy}>
                              {policy.charAt(0).toUpperCase() + policy.slice(1).replace('_', ' ')}
                            </option>
                          ))}
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
                  <p>Make sure everything looks perfect before publishing</p>
                  
                  <div className="review-summary">
                    <div className="summary-card">
                      <h3>📍 Property Details</h3>
                      <div className="summary-content">
                        <p><strong>Type:</strong> {hostData.propertyType} • {hostData.roomType}</p>
                        <p><strong>Location:</strong> {hostData.address.street}, {hostData.address.city}</p>
                        <p><strong>Capacity:</strong> {hostData.guests} guests • {hostData.bedrooms} bedrooms • {hostData.bathrooms} bathrooms • {hostData.beds} beds</p>
                      </div>
                    </div>
                    
                    <div className="summary-card">
                      <h3>⭐ Amenities</h3>
                      <div className="amenities-summary">
                        {hostData.amenities.length > 0 ? (
                          <div className="amenities-tags">
                            {hostData.amenities.map(amenity => (
                              <span key={amenity} className="amenity-tag">
                                {AMENITIES_MAPPING[amenity]?.icon}
                                {AMENITIES_MAPPING[amenity]?.label}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <p>No amenities selected</p>
                        )}
                      </div>
                    </div>

                    <div className="summary-card">
                      <h3>💰 Pricing</h3>
                      <div className="summary-content">
                        <p><strong>Base price:</strong> ${hostData.price} per night</p>
                      </div>
                    </div>

                    <div className="summary-card">
                      <h3>📅 Availability</h3>
                      <div className="summary-content">
                        <p><strong>Check-in:</strong> {hostData.checkIn}</p>
                        <p><strong>Check-out:</strong> {hostData.checkOut}</p>
                        <p><strong>Minimum stay:</strong> {hostData.minNights} nights</p>
                        <p><strong>Maximum stay:</strong> {hostData.maxNights} nights</p>
                        <p><strong>Cancellation:</strong> {hostData.cancellationPolicy}</p>
                      </div>
                    </div>

                    <div className="summary-card">
                      <h3>📸 Photos</h3>
                      <div className="summary-content">
                        <p><strong>Number of photos:</strong> {hostData.images.length}</p>
                        {hostData.images.length > 0 && (
                          <div className="review-photos">
                            {hostData.images.slice(0, 3).map((photo, index) => (
                              <img key={index} src={photo} alt={`Preview ${index + 1}`} />
                            ))}
                            {hostData.images.length > 3 && (
                              <div className="more-photos">+{hostData.images.length - 3} more</div>
                            )}
                          </div>
                        )}
                      </div>
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
                    disabled={!isStepValid() || isSubmitting}
                  >
                    {isSubmitting ? "Publishing..." : "Publish Listing"}
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