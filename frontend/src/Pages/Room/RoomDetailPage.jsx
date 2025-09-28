import React, { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import "./RoomDetailPage.scss";
import { FaHeart, FaShare, FaChevronLeft, FaChevronRight, FaStar, FaWifi, FaCar, FaUtensils, FaSwimmingPool, FaSnowflake, FaFire, FaTv, FaPaw, FaBed, FaBath, FaRuler } from "react-icons/fa";
import { MdLocationOn, MdVerified } from "react-icons/md";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

const RoomDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [liked, setLiked] = useState(false);
  const [showAllPhotos, setShowAllPhotos] = useState(false);
  const [isSticky, setIsSticky] = useState(false);
  const [sidebarHeight, setSidebarHeight] = useState(0);
  
  const sidebarRef = useRef(null);
  const contentRef = useRef(null);

  useEffect(() => {
    const fetchRoomDetails = async () => {
      try {
        // Fetch room by ID using the specific endpoint
        const response = await axios.get(`http://localhost:5000/api/rooms/${id}`);
        
        if (response.data.success && response.data.room) {
          setRoom(response.data.room);
        } else {
          setError("Room not found");
        }
      } catch (err) {
        console.error("Error fetching room details:", err);
        if (err.response?.status === 404) {
          setError("Room not found");
        } else if (err.response?.status === 400) {
          setError("Invalid room ID");
        } else {
          setError("Failed to load room details");
        }
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchRoomDetails();
    }
  }, [id]);

  // Sticky sidebar behavior
  useEffect(() => {
    const handleScroll = () => {
      if (!sidebarRef.current || !contentRef.current) return;

      const sidebar = sidebarRef.current;
      const content = contentRef.current;
      const scrollTop = window.pageYOffset;
      const contentTop = content.offsetTop;
      const contentHeight = content.offsetHeight;
      const sidebarHeight = sidebar.offsetHeight;
      const windowHeight = window.innerHeight;

      // Start sticky behavior when sidebar reaches top of viewport
      const shouldBeSticky = scrollTop > contentTop - 100;
      
      // Stop sticky when we reach the bottom of the content
      const contentBottom = contentTop + contentHeight;
      const shouldStopSticky = scrollTop + windowHeight > contentBottom + 100;

      setIsSticky(shouldBeSticky && !shouldStopSticky);
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleScroll);
    
    // Initial calculation
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [room]);

  const handlePrevImage = () => {
    if (!images.length) return;
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = () => {
    if (!images.length) return;
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageClick = (index) => {
    setCurrentImage(index);
  };

  const handleReserve = () => {
    navigate(`/rooms/${id}/book`);
  };

  // Normalize images similar to RoomCard
  const images = (() => {
    if (!room) return [];
    if (Array.isArray(room.images)) return room.images;
    if (Array.isArray(room.image)) return room.image;
    if (typeof room.image === "string") return [room.image];
    return [];
  })();

  // Mock amenities data (in real app, this would come from the API)
  const amenities = [
    { icon: <FaWifi />, name: "WiFi", category: "Essentials" },
    { icon: <FaCar />, name: "Free parking", category: "Essentials" },
    { icon: <FaUtensils />, name: "Kitchen", category: "Kitchen" },
    { icon: <FaSwimmingPool />, name: "Pool", category: "Facilities" },
    { icon: <FaSnowflake />, name: "Air conditioning", category: "Climate" },
    { icon: <FaFire />, name: "Heating", category: "Climate" },
    { icon: <FaTv />, name: "TV", category: "Entertainment" },
    { icon: <FaPaw />, name: "Pet friendly", category: "Safety" }
  ];

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="room-detail-loading">
          <div className="loading-spinner">Loading room details...</div>
        </div>
      </>
    );
  }

  if (error || !room) {
    return (
      <>
        <Navbar />
        <div className="room-detail-error">
          <h2>Room not found</h2>
          <p>{error || "The room you're looking for doesn't exist."}</p>
          <button onClick={() => navigate("/rooms")} className="back-button">
            Back to rooms
          </button>
        </div>
      </>
    );
  }

  return (
    <>
      <Navbar />
      
      <div className="room-detail-page">
        {/* Image Gallery */}
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
                  className={`thumbnail ${index === currentImage ? 'active' : ''}`}
                  onClick={() => handleImageClick(index)}
                >
                  <img src={img} alt={`Thumbnail ${index + 1}`} />
                </div>
              ))}
              {images.length > 5 && (
                <div className="thumbnail show-all" onClick={() => setShowAllPhotos(true)}>
                  <span>+{images.length - 5} more</span>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="room-detail-content" ref={contentRef}>
          <div className="main-content">
            {/* Header */}
            <div className="room-header">
              <div className="room-title-section">
                <h1>{room.title || "Beautiful Room"}</h1>
                <div className="room-meta">
                  <div className="rating-section">
                    <FaStar className="star-icon" />
                    <span className="rating">{room.rating || 4.8}</span>
                    <span className="review-count">({room.reviewCount || 24} reviews)</span>
                  </div>
                  <div className="location-section">
                    <MdLocationOn className="location-icon" />
                    <span>{room.type || "Shenoy Nagar, Chennai"}</span>
                  </div>
                </div>
              </div>
              
              <div className="action-buttons">
                <button className="share-btn">
                  <FaShare />
                  Share
                </button>
                <button 
                  className={`heart-btn ${liked ? 'liked' : ''}`}
                  onClick={() => setLiked(!liked)}
                >
                  <FaHeart />
                  Save
                </button>
              </div>
            </div>

            {/* Host Info */}
            <div className="host-section">
              <div className="host-info">
                <div className="host-avatar">
                  <img src="https://via.placeholder.com/56x56?text=Host" alt="Host" />
                </div>
                <div className="host-details">
                  <h3>Hosted by {room.host || "GoEarthy"}</h3>
                  <p>Joined in March 2020</p>
                  <div className="host-verification">
                    <MdVerified className="verified-icon" />
                    <span>Identity verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Room Features */}
            <div className="room-features">
              <div className="feature">
                <FaBed className="feature-icon" />
                <div>
                  <strong>{room.beds || 2} beds</strong>
                  <p>Comfortable sleeping arrangements</p>
                </div>
              </div>
              <div className="feature">
                <FaBath className="feature-icon" />
                <div>
                  <strong>{room.bathrooms || 1} bathrooms</strong>
                  <p>Clean and well-maintained</p>
                </div>
              </div>
              <div className="feature">
                <FaRuler className="feature-icon" />
                <div>
                  <strong>{room.guests || 1} guests</strong>
                  <p>Maximum occupancy</p>
                </div>
              </div>
              <div className="feature">
                <FaBed className="feature-icon" />
                <div>
                  <strong>{room.bedrooms || 1} bedrooms</strong>
                  <p>Private sleeping areas</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="room-description">
              <h2>About this place</h2>
              <p>
                {room.description || "Experience the perfect blend of comfort and style in this beautifully designed space. Located in the heart of the city, this room offers modern amenities and a cozy atmosphere. Perfect for both business and leisure travelers looking for a home away from home."}
              </p>
            </div>

            {/* Amenities */}
            <div className="amenities-section">
              <h2>What this place offers</h2>
              <div className="amenities-grid">
                {room.amenities && room.amenities.length > 0 ? (
                  room.amenities.map((amenity, index) => (
                    <div key={index} className="amenity-item">
                      <span>{amenity}</span>
                    </div>
                  ))
                ) : (
                  amenities.map((amenity, index) => (
                    <div key={index} className="amenity-item">
                      {amenity.icon}
                      <span>{amenity.name}</span>
                    </div>
                  ))
                )}
              </div>
              <button className="show-all-amenities">Show all amenities</button>
            </div>

            {/* Reviews Section */}
            <div className="reviews-section">
              <div className="reviews-header">
                <div className="reviews-summary">
                  <FaStar className="star-icon" />
                  <span className="overall-rating">{room.rating || 4.8}</span>
                  <span className="review-count">· {room.reviewCount || 24} reviews</span>
                </div>
              </div>
              
              <div className="reviews-grid">
                {[1, 2, 3].map((review) => (
                  <div key={review} className="review-item">
                    <div className="reviewer-info">
                      <img src="https://via.placeholder.com/40x40?text=User" alt="Reviewer" />
                      <div>
                        <strong>Sarah M.</strong>
                        <p>March 2024</p>
                      </div>
                    </div>
                    <p className="review-text">
                      "Amazing place to stay! The host was very responsive and the location was perfect. Would definitely recommend to others."
                    </p>
                  </div>
                ))}
              </div>
              
              <button className="show-all-reviews">Show all reviews</button>
            </div>

            {/* Location */}
            <div className="location-section">
              <h2>Where you'll be</h2>
              <div className="location-map">
                <div className="map-placeholder">
                  <MdLocationOn className="map-icon" />
                  <p>Map view</p>
                  <span>Shenoy Nagar, Chennai, Tamil Nadu</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div 
            className={`booking-sidebar ${isSticky ? 'sticky' : ''}`}
            ref={sidebarRef}
          >
            <div className="booking-card">
              <div className="price-section">
                <span className="price">₹{room.price?.toLocaleString?.() || room.price}</span>
                <span className="price-period">per night</span>
              </div>
              
              <div className="booking-form">
                <div className="date-inputs">
                  <div className="date-input">
                    <label>CHECK-IN</label>
                    <input type="date" />
                  </div>
                  <div className="date-input">
                    <label>CHECKOUT</label>
                    <input type="date" />
                  </div>
                </div>
                
                <div className="guests-input">
                  <label>GUESTS</label>
                  <select>
                    {Array.from({ length: room.guests || 4 }, (_, i) => (
                      <option key={i + 1} value={i + 1}>
                        {i + 1} {i === 0 ? 'guest' : 'guests'}
                      </option>
                    ))}
                  </select>
                </div>
                
                <button className="reserve-button" onClick={handleReserve}>Reserve</button>
                
                <p className="booking-note">You won't be charged yet</p>
              </div>
              
              <div className="price-breakdown">
                <div className="price-item">
                  <span>₹{room.price?.toLocaleString?.() || room.price} × {room.nights || 3} nights</span>
                  <span>₹{((room.price || 0) * (room.nights || 3))?.toLocaleString?.()}</span>
                </div>
                <div className="price-item">
                  <span>Cleaning fee</span>
                  <span>₹500</span>
                </div>
                <div className="price-item">
                  <span>Service fee</span>
                  <span>₹800</span>
                </div>
                <div className="price-item total">
                  <span>Total</span>
                  <span>₹{(((room.price || 0) * (room.nights || 3)) + 500 + 800)?.toLocaleString?.()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <Footer />
    </>
  );
};

export default RoomDetailPage;