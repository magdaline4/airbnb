import React, { useState } from "react";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";
import "./Imgcard.scss";

const ImageGallery = ({ images = [], room = {} }) => {
  const [currentImage, setCurrentImage] = useState(0);
  const [showAllPhotos, setShowAllPhotos] = useState(false);

  const handlePrevImage = () => {
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageClick = (index) => {
    setCurrentImage(index);
  };

  if (showAllPhotos) {
    return (
      <div className="full-gallery">
        <button className="close-btn" onClick={() => setShowAllPhotos(false)}>✕ Close</button>
        <div className="grid-gallery">
          {images.map((img, index) => (
            <img key={index} src={img} alt={`Photo ${index + 1}`} />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="image-gallery">
      <div className="main-image-container">
        <img
          src={images[currentImage] || "https://via.placeholder.com/800x600?text=No+Image"}
          alt={`${room.title} - Image ${currentImage + 1}`}
          className="main-image"
        />

        {images.length > 1 && (
          <>
            <button className="image-nav prev" onClick={handlePrevImage}>
              <FaChevronLeft />
            </button>
            <button className="image-nav next" onClick={handleNextImage}>
              <FaChevronRight />
            </button>
            <div className="image-counter">
              {currentImage + 1} / {images.length}
            </div>
          </>
        )}
      </div>

      {images.length > 1 && (
        <div className="thumbnail-grid">
          {images.slice(0, 5).map((img, index) => (
            <div
              key={index}
              className={`thumbnail ${index === currentImage ? "active" : ""}`}
              onClick={() => handleImageClick(index)}
            >
              <img src={img} alt={`Thumbnail ${index + 1}`} />
            </div>
          ))}

          {images.length > 5 && (
            <div className="thumbnail show-all" onClick={() => setShowAllPhotos(true)}>
              <span>Show all photos</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default ImageGallery;
