import React, { useEffect, useState } from "react";
import "../Pages/Room/Room.scss";
import { FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";

const RoomCard = ({ room = {} }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);

  // Normalize images: support room.images (array), room.image (string or array)
  const images = (() => {
    if (Array.isArray(room.images)) return room.images;
    if (Array.isArray(room.image)) return room.image;
    if (typeof room.image === "string") return [room.image];
    return [];
  })();

  // Reset index when room changes
  useEffect(() => {
    setCurrentImage(0);
  }, [room]);

  // Debugging helper — check console to confirm images are seen by the component
  useEffect(() => {
    console.log("RoomCard — images:", images);
  }, [images]);

  const handlePrev = (e) => {
    e?.stopPropagation();
    if (!images.length) return;
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    if (!images.length) return;
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleDotClick = (idx, e) => {
    e?.stopPropagation();
    setCurrentImage(idx);
  };

  // graceful fallback
  if (!images.length) {
    return (
      <div className="room-card">
        <div className="room-image placeholder">
          <img
            src="https://via.placeholder.com/600x400?text=No+Image"
            alt="No image available"
          />
        </div>
        <div className="room-info">
          <h3>{room.title || "Untitled"}</h3>
          <p>{room.host}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="room-card">
      <div className="room-image" role="presentation" aria-label={room.title || "Room image"}>
        <img
          src={images[currentImage]}
          alt={`${room.title || "Room"} — photo ${currentImage + 1}`}
          onError={(e) => {
            // show placeholder if image fails
            e.currentTarget.src = "https://via.placeholder.com/600x400?text=Image+not+found";
          }}
        />

        <div className="label">Guest favourite</div>

        <button
          className={`heart-btn ${liked ? "liked" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            setLiked((s) => !s);
          }}
          aria-label="Toggle favourite"
        >
          <FaHeart />
        </button>

        {images.length > 1 && (
          <>
            {/* big clickable left/right zones */}
            <div className="hover-zone left-zone" onClick={handlePrev} />
            <div className="hover-zone right-zone" onClick={handleNext} />

            {/* visible arrow buttons (higher z-index than hover zones) */}
            <button className="arrow left" onClick={handlePrev} aria-label="Previous image">
              <FaChevronLeft />
            </button>
            <button className="arrow right" onClick={handleNext} aria-label="Next image">
              <FaChevronRight />
            </button>

            {/* dots */}
            <div className="dots" aria-hidden="true">
              {images.map((_, i) => (
                <button
                  key={i}
                  className={`dot ${i === currentImage ? "active" : ""}`}
                  onClick={(e) => handleDotClick(i, e)}
                  aria-label={`Show photo ${i + 1}`}
                />
              ))}
            </div>
          </>
        )}
      </div>

      <div className="room-info">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>{room.title}</h3>
          <h2>★ {room.rating} ({room.reviews})</h2>
        </div>
        <p>Stay with {room.host}</p>
        <p className="price">
          ₹{room.price?.toLocaleString?.() || room.price} <span>for {room.nights || 1} nights</span>
        </p>
      </div>
    </div>
  );
};

export default RoomCard;
