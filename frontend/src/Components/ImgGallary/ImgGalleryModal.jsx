import React, { useState, useEffect } from "react";
import { X, ChevronLeft, ChevronRight, Share, Heart } from "lucide-react";
import axios from "axios";
import { useParams } from "react-router-dom";
import "./ImgGalleryModal.scss";

 const PhotoGalleryModal = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState("Room Photos");
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);
  const [photos, setPhotos] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const { id } = useParams();
  const roomId = id;
  const API_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    if (isOpen && roomId) {
      fetchRoomImages();
    } else if (isOpen && !roomId) {
      setError("Room ID is missing. Cannot load images.");
    }
  }, [isOpen, roomId]);

  const fetchRoomImages = async () => {
    if (!roomId) {
      setError("Room ID is required");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const res = await axios.get(`${API_URL}/api/rooms?limit=100`);
      const transformedPhotos = transformApiResponse(res.data);
      setPhotos(transformedPhotos);

      const categories = Object.keys(transformedPhotos);
      if (categories.length > 0) {
        setSelectedCategory(categories[0]);
      }
    } catch (err) {
      setError(`Failed to load room images: ${err.message}`);
      setPhotos({});
    } finally {
      setLoading(false);
    }
  };

  const transformApiResponse = (apiData) => {
    if (apiData.rooms && Array.isArray(apiData.rooms)) {
      const targetRoom = apiData.rooms.find((room) => room._id === roomId);
      if (targetRoom) {
        const roomImages = extractImagesFromRoom(targetRoom);
        if (roomImages.length > 0) {
          const roomName = targetRoom.title || "Room Photos";
          return {
            [roomName]: roomImages,
          };
        } else {
          setError("This room has no images available");
        }
      } else {
        setError(`Room with ID "${roomId}" not found.`);
      }
    }
    return {};
  };

  const extractImagesFromRoom = (room) => {
    const images = [];
    if (room.images && Array.isArray(room.images)) {
      room.images.forEach((imageUrl, imgIndex) => {
        if (typeof imageUrl === "string" && imageUrl) {
          images.push({
            id: `${room._id}-img-${imgIndex}`,
            url: imageUrl,
            alt: room.title || `Room image ${imgIndex + 1}`,
          });
        }
      });
    }
    return images;
  };

  const categories = Object.keys(photos);

  const openLightbox = (index, category) => {
    setSelectedCategory(category);
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => setSelectedImageIndex(null);

  const navigateImage = (direction) => {
    const currentPhotos = photos[selectedCategory];
    if (selectedImageIndex === null || !currentPhotos) return;

    const newIndex =
      direction === "next"
        ? (selectedImageIndex + 1) % currentPhotos.length
        : (selectedImageIndex - 1 + currentPhotos.length) %
          currentPhotos.length;
    setSelectedImageIndex(newIndex);
  };

  if (!isOpen) return null;

  return (
    <div className="gallery-modal">
      {/* ===== Top Nav  ===== */}
      <div className="gallery-top-nav">
        <div className="nav-left">
          <ChevronLeft size={20} className="back-icon" onClick={onClose} />
        </div>
        <div className="nav-right">
          <div className="nav-item">
            <Share size={18} />
            <span>Share</span>
          </div>
          <div className="nav-item">
            <Heart size={18} />
            <span>Save</span>
          </div>
        </div>
      </div>

      {/* ===== Main Content ===== */}
      {!loading && !error && categories.length > 0 && (
        <div className="photo-sections">
           <h2>Photo tour</h2>
          {categories.map((cat) => (
            <div key={cat} id={cat} className="photo-section">
              <h3>{cat}</h3>
              <div className="photo-grid">
                {photos[cat]?.map((photo, i) => (
                  <div
                    key={photo.id}
                    className="photo-item"
                    onClick={() => openLightbox(i, cat)}
                  >
                    <img
                      src={photo.url}
                      alt={photo.alt || cat}
                      onError={(e) => {
                        e.target.style.display = "none";
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {!loading && !error && categories.length === 0 && (
        <div className="no-photos">
          <p>No photos available for room ID: {roomId}</p>
          <button onClick={fetchRoomImages}>Retry Load</button>
        </div>
      )}

      {selectedImageIndex !== null && photos[selectedCategory] && (
        <div className="lightbox" onClick={closeLightbox}>
          <button className="lightbox-close" onClick={closeLightbox}>
            <X size={32} />
          </button>
          <button
            className="lightbox-nav prev"
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("prev");
            }}
          >
            <ChevronLeft size={40} />
          </button>
          <div className="lightbox-content" onClick={(e) => e.stopPropagation()}>
            <img
              src={photos[selectedCategory][selectedImageIndex].url}
              alt={
                photos[selectedCategory][selectedImageIndex].alt ||
                selectedCategory
              }
            />
            <p className="caption">
              {selectedCategory} — {selectedImageIndex + 1} /{" "}
              {photos[selectedCategory].length}
            </p>
          </div>
          <button
            className="lightbox-nav next"
            onClick={(e) => {
              e.stopPropagation();
              navigateImage("next");
            }}
          >
            <ChevronRight size={40} />
          </button>
        </div>
      )}
    </div>
  );
};

export default PhotoGalleryModal;
