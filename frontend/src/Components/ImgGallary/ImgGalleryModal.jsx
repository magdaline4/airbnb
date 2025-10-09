import React, { useState } from "react";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import "./ImgGalleryModal.scss";

export const PhotoGalleryModal = ({ isOpen, onClose }) => {
  const [selectedCategory, setSelectedCategory] = useState("Living room");
  const [selectedImageIndex, setSelectedImageIndex] = useState(null);

  const photos = {
    "Living room": [
      { id: 1, url: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=1200" },
      { id: 2, url: "https://images.unsplash.com/photo-1567016432779-094069958ea5?w=1200" },
      { id: 3, url: "https://images.unsplash.com/photo-1600585154154-5c3c1c9c90f1?w=1200" },
      { id: 4, url: "https://images.unsplash.com/photo-1628744445777-57d20593d353?w=1200" },
    ],
    "Full kitchen": [
      { id: 5, url: "https://images.unsplash.com/photo-1556912173-46c336c7fd55?w=1200" },
      { id: 6, url: "https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1200" },
      { id: 7, url: "https://images.unsplash.com/photo-1628744446075-6fce6b1c4cc8?w=1200" },
    ],
    "Bedroom 1": [
      { id: 8, url: "https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?w=1200" },
      { id: 9, url: "https://images.unsplash.com/photo-1540518614846-7eded433c457?w=1200" },
    ],
    "Bedroom 2": [
      { id: 10, url: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1200" },
      { id: 11, url: "https://images.unsplash.com/photo-1615529328331-f8917597711f?w=1200" },
    ],
    "Full bathroom 1": [
      { id: 12, url: "https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?w=1200" },
      { id: 13, url: "https://images.unsplash.com/photo-1564540583246-934409427776?w=1200" },
    ],
    "Full bathroom 2": [
      { id: 14, url: "https://images.unsplash.com/photo-1603899122328-8a06a7e98e33?w=1200" },
      { id: 15, url: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=1200" },
    ],
    "Additional photos": [
      { id: 16, url: "https://images.unsplash.com/photo-1600607687644-c7171b42498b?w=1200" },
      { id: 17, url: "https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=1200" },
    ],
  };

  const categories = Object.keys(photos);

  const openLightbox = (index, category) => {
    setSelectedCategory(category);
    setSelectedImageIndex(index);
  };

  const closeLightbox = () => setSelectedImageIndex(null);

  const navigateImage = (direction) => {
    const currentPhotos = photos[selectedCategory];
    if (selectedImageIndex === null) return;
    const newIndex =
      direction === "next"
        ? (selectedImageIndex + 1) % currentPhotos.length
        : (selectedImageIndex - 1 + currentPhotos.length) % currentPhotos.length;
    setSelectedImageIndex(newIndex);
  };

  if (!isOpen) return null;

  return (
    <div className="gallery-modal">
      {/* Header */}
      <div className="gallery-header">
        <h2>Photo tour</h2>
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
      </div>

      {/* Thumbnails */}
      <div className="thumbnail-nav">
        {categories.map((cat) => (
          <div
            key={cat}
            className={`thumb-item ${
              selectedCategory === cat ? "active" : ""
            }`}
            onClick={() => setSelectedCategory(cat)}
          >
            <img src={photos[cat][0].url} alt={cat} />
            <p>{cat}</p>
          </div>
        ))}
      </div>

      {/* Sections */}
      <div className="photo-sections">
        {categories.map((cat) => (
          <div key={cat} id={cat} className="photo-section">
            <h3>{cat}</h3>
            <div className="photo-grid">
              {photos[cat].map((photo, i) => (
                <div
                  key={photo.id}
                  className="photo-item"
                  onClick={() => openLightbox(i, cat)}
                >
                  <img src={photo.url} alt={cat} />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>

      {/* Lightbox */}
      {selectedImageIndex !== null && (
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
              alt={selectedCategory}
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
