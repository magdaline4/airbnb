import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchAmenities } from "../../features/roomsSlice"; // Import from your roomSlice
import "./Amenties.scss";

export default function Amenties() {
  const dispatch = useDispatch();
  
  // Get amenities from Redux store
  const { amenities, amenitiesLoading, amenitiesError } = useSelector((state) => state.rooms);
  
  // Local state for UI
  const [showAll, setShowAll] = useState(false);

  // Fetch amenities when component mounts
  useEffect(() => {
    dispatch(fetchAmenities());
  }, [dispatch]);

  // Show only 8 amenities initially
  const visibleAmenities = amenities.slice(0, 8);

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

      <div className="amenities-grid">
        {visibleAmenities.map((item, idx) => {
          const img =
            typeof item.images === "string" && item.images.includes(",")
              ? item.images.split(",")[0]
              : item.images;
          return (
            <div key={item._id ?? idx} className="amenity-item">
              {img ? (
                <img src={img} alt={item.item} />
              ) : (
                <div style={{ width: 24, height: 24 }} />
              )}
              <span>{item.item}</span>
            </div>
          );
        })}
      </div>

      {amenities.length > 8 && (
        <button className="show-btn" onClick={() => setShowAll(true)}>
          Show all {amenities.length} amenities
        </button>
      )}

      {/* Popup */}
      {showAll && (
        <div className="popup-overlay">
          <div className="popup-content">
            <button className="close-btn" onClick={() => setShowAll(false)}>
              X
            </button>
            <h2>What this place offers</h2>
            <div className="popup-grid">
              {amenities.map((item, idx) => {
                const img =
                  typeof item.images === "string" &&
                  item.images.includes(",")
                    ? item.images.split(",")[0]
                    : item.images;
                return (
                  <div key={item._id ?? idx} className="amenity-item">
                    {img ? (
                      <img src={img} alt={item.item} />
                    ) : (
                      <div style={{ width: 20, height: 20 }} />
                    )}
                    <span>{item.item}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}