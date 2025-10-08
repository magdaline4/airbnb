import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./Amenties.scss";

export default function RoomDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [amenities, setAmenities] = useState([]);
  const [showAll, setShowAll] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/rooms/${id}`);
        setRoom(res.data.room);
      } catch (err) {
        setError("Failed to load room details");
      } finally {
        setLoading(false);
      }
    };

    const fetchAmenities = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/amenitiesitem/items`);
        const payload = res?.data?.data ?? res?.data ?? [];
        setAmenities(Array.isArray(payload) ? payload : []);
      } catch (err) {
        console.error(err);
      }
    };

    if (id) fetchRoomDetails();
    fetchAmenities();
  }, [id]);

  if (loading) return <div>Loading...</div>;
  if (error || !room) return <div>{error}</div>;

  // Show only 8 amenities initially
  const visibleAmenities = amenities.slice(0, 8);

  return (
    <>
      <div className="room-detail-page">
        {/* Other room details above this... */}

        {/* Amenities Section */}
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
      </div>
    </>
  );
}
