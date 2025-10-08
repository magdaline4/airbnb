import React, { useEffect, useState } from "react";
import "../Pages/Room/Room.scss";
import { FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { useSelector, useDispatch } from "react-redux";
import { toggleLike } from "../redux/slices/favoriteSlice";

const RoomCard = ({ room = {} }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const dispatch = useDispatch();
  const likedRooms = useSelector((state) => state.favorites.likedRooms);
  const liked = likedRooms.includes(room.id);

  const images = (() => {
    if (Array.isArray(room.images)) return room.images;
    if (Array.isArray(room.image)) return room.image;
    if (typeof room.image === "string") return [room.image];
    return [];
  })();

  useEffect(() => {
    setCurrentImage(0);
  }, [room]);

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
            e.currentTarget.src = "https://via.placeholder.com/600x400?text=Image+not+found";
          }}
        />

        <div className="label">Guest favourite</div>

        <button
          className={`heart-btn ${liked ? "liked" : ""}`}
          onClick={(e) => {
            e.stopPropagation();
            dispatch(toggleLike(room.id));
          }}
          aria-label="Toggle favourite"
        >
          <FaHeart />
        </button>

        {images.length > 1 && (
          <>
            <div className="hover-zone left-zone" onClick={handlePrev} />
            <div className="hover-zone right-zone" onClick={handleNext} />

            <button className="arrow left" onClick={handlePrev} aria-label="Previous image">
              <FaChevronLeft />
            </button>
            <button className="arrow right" onClick={handleNext} aria-label="Next image">
              <FaChevronRight />
            </button>

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
          <h3>{room.type}</h3>
          <h2>★ {room.rating} ({room.reviewCount})</h2>
        </div>
        <p>Stay with {room.title}</p>
        <p>{room.beds} beds</p>
        <p>{room.checkIn} - {room.checkOut}</p>
        <p className="price">
          ₹{room.price?.toLocaleString?.() || room.price}{" "}
          <span>for {room.nights || 1} nights</span>
        </p>
      </div>
    </div>
  );
};

export default RoomCard;
