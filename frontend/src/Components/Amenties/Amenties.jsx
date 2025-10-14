import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAllAmenities } from "../../features/roomsSlice";
import "./Amenties.scss";

export default function Amenties() {
  const dispatch = useDispatch();
  
  // Get amenities from Redux store
  const { amenities, amenitiesLoading, amenitiesError } = useSelector((state) => state.rooms);
  
  // Local state for UI
  const [showPopup, setShowPopup] = useState(false);

  // Fetch ALL amenities when component mounts
  useEffect(() => {
    dispatch(fetchAllAmenities());
  }, [dispatch]);

  // Group amenities by category
  const groupedAmenities = amenities.reduce((acc, amenity) => {
    const category = amenity.amenities_Id?.title || "Other";
    if (!acc[category]) {
      acc[category] = [];
    }
    acc[category].push(amenity);
    return acc;
  }, {});

  // Show only 8 amenities initially on the main page
  const mainAmenities = amenities.slice(0, 10);

  // Show loading state
  if (amenitiesLoading) {
    return (
      <div className="amenities-section">
        <h2>What this place offers</h2>
        <div className="loading-amenities">Loading amenities...</div>
      </div>
    );
  }

  // Show error state
  if (amenitiesError) {
    return (
      <div className="amenities-section">
        <h2>What this place offers</h2>
        <div className="error-amenities">Unable to load amenities</div>
      </div>
    );
  }

  // Show empty state
  if (!amenities.length) {
    return (
      <div className="amenities-section">
        <h2>What this place offers</h2>
        <div className="no-amenities">No amenities listed</div>
      </div>
    );
  }

  return (
    <div className="amenities-section">
      <h2>What this place offers</h2>

      {/* Main amenities grid - shows first 8 amenities */}
      <div className="amenities-grid">
        {mainAmenities.map((item, idx) => {
          const img = getImageUrl(item.images);
          return (
            <div key={item._id ?? idx} className="amenity-item">
              {img ? (
                <img src={img} alt={item.item} />
              ) : (
                <div className="placeholder-icon" />
              )}
              <span>{item.item}</span>
            </div>
          );
        })}
      </div>

      {/* Show all amenities button */}
      {amenities.length > 8 && (
        <button 
          className="show-all-btn" 
          onClick={() => setShowPopup(true)}
        >
          Show all {amenities.length} amenities
        </button>
      )}

      {/* Popup Modal */}
      {showPopup && (
        <div className="amenities-popup-overlay">
          <div className="amenities-popup">
            {/* Header */}
            <button 
                className="close-btn"
                onClick={() => setShowPopup(false)}
              >
                ✕
              </button>
            

            {/* Content */}
            <div className="popup-contents">
              <div className="popup-header">
              <h2>What this place offers</h2>
            </div>
              {Object.entries(groupedAmenities).map(([category, items]) => (
                <div key={category} className="amenity-category">
                  <h3 className="category-title">{category}</h3>
                  <div className="category-items">
                    {items.map((item, idx) => {
                      const img = getImageUrl(item.images);
                      return (
                        <div key={item._id ?? idx} className="popup-amenity-item">
                          {img && (
                            <img src={img} alt={item.item} className="amenity-icon" />
                          )}
                          <span className="amenity-name">{item.item}</span>
                        </div>
                      );
                    })}
                  </div>
                  {/* Divider between categories */}
                  {Object.keys(groupedAmenities).indexOf(category) < 
                   Object.keys(groupedAmenities).length - 1 && (
                    <hr className="category-divider" />
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// Helper function to get image URL
function getImageUrl(images) {
  if (!images) return null;
  
  if (typeof images === 'string' && images.includes(',')) {
    return images.split(',')[0];
  }
  
  return images;
}