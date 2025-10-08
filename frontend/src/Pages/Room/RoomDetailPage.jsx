// RoomDetailPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import axios from "axios";
import "./RoomDetailPage.scss";
import {
  FaHeart,
  FaShare,
  FaChevronLeft,
  FaChevronRight,
  FaStar,
  FaWifi,
  FaCar,
  FaUtensils,
  FaSwimmingPool,
  FaSnowflake,
  FaFire,
  FaTv,
  FaPaw,
  FaBed,
  FaBath,
  FaRuler,
} from "react-icons/fa";
import { MdLocationOn, MdVerified } from "react-icons/md";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import Amenties from "../../Components/Amenties/Amenties";
import Calendar from "../../Components/BookingCalendar/Calendar";
import DatePicker from "../../Components/BookingCalendar/DatePicker";
import "../../Components/BookingCalendar/DatePicker.scss";
import { fetchRoomById, clearCurrentRoom } from "../../features/roomsSlice";

const RoomDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // Redux state
  const roomsState = useSelector((state) => state.rooms) || {};
  const { room = null, loading = false, error = null } = roomsState;

  // UI state
  const [currentImage, setCurrentImage] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
  const [showServiceAnimalPopup, setShowServiceAnimalPopup] = useState(false);

  // Guest dropdown state
  const [isGuestDropdownOpen, setIsGuestDropdownOpen] = useState(false);
  const [guestData, setGuestData] = useState({
    adults: 2,
    children: 0,
    infants: 1,
    pets: 0,
  });

  const [selectedDates, setSelectedDates] = useState({
    checkIn: new Date(),
    checkOut: new Date(Date.now() + 24 * 60 * 60 * 1000),
  });

  const sidebarRef = useRef(null);
  const contentRef = useRef(null);

  const API_URL = import.meta.env.VITE_API_URL;

  const maxGuests = room?.guests || 10;
  const totalGuests = guestData.adults + guestData.children;

  // Utility functions
  const formatDateForInput = (date) => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  const parseInputDate = (dateString) => {
    const [year, month, day] = dateString.split("-").map(Number);
    return new Date(year, month - 1, day);
  };

  const formatCurrency = (amount) => {
    if (typeof amount !== 'number') {
      amount = parseFloat(amount) || 0;
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const calculateNights = () => {
    if (!selectedDates.checkIn || !selectedDates.checkOut) return 0;
    
    const checkIn = new Date(selectedDates.checkIn);
    const checkOut = new Date(selectedDates.checkOut);
    const timeDiff = checkOut.getTime() - checkIn.getTime();
    const nights = Math.ceil(timeDiff / (1000 * 3600 * 24));
    
    return nights > 0 ? nights : 0;
  };

  const calculateTotalPrice = () => {
    const nights = calculateNights();
    const basePrice = room?.price || 0;
    const cleaningFee = 50;
    const serviceFee = 25;
    
    return (basePrice * nights) + cleaningFee + serviceFee;
  };

  const renderLocationText = () => {
    if (!room?.location) return "Location information not available";
    return typeof room.location === 'string' 
      ? room.location 
      : `${room.location.city || ''}, ${room.location.state || ''}, ${room.location.country || ''}`;
  };

  // Guest counter functions
  const handleIncrement = (type) => {
    setGuestData((prev) => ({
      ...prev,
      [type]: prev[type] + 1,
    }));
  };

  const handleDecrement = (type) => {
    setGuestData((prev) => ({
      ...prev,
      [type]: Math.max(0, prev[type] - 1),
    }));
  };

  const getGuestDisplayText = () => {
    const { adults, children, infants, pets } = guestData;
    const total = adults + children;

    let text = `${total} guest${total !== 1 ? "s" : ""}`;
    if (infants > 0) {
      text += `, ${infants} infant${infants !== 1 ? "s" : ""}`;
    }
    if (pets > 0) {
      text += `, ${pets} pet${pets !== 1 ? "s" : ""}`;
    }

    return text;
  };

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        isGuestDropdownOpen &&
        !event.target.closest(".guests-input-section")
      ) {
        setIsGuestDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isGuestDropdownOpen]);

  // Fetch room details using Redux
  useEffect(() => {
    if (id) {
      dispatch(fetchRoomById(id));
    }
    
    // Cleanup when component unmounts
    return () => {
      dispatch(clearCurrentRoom());
    };
  }, [id, dispatch]);

  // Sticky sidebar behavior
  useEffect(() => {
    const handleScroll = () => {
      if (!sidebarRef.current || !contentRef.current) return;

      const sidebar = sidebarRef.current;
      const content = contentRef.current;
      const scrollTop = window.pageYOffset;
      const contentTop = contentRef.current.offsetTop;
      const contentHeight = contentRef.current.offsetHeight;
      const windowHeight = window.innerHeight;

      const shouldBeSticky = scrollTop > contentTop - 100;
      const contentBottom = contentTop + contentHeight;
      const shouldStopSticky = scrollTop + windowHeight > contentBottom + 100;

      setIsSticky(shouldBeSticky && !shouldStopSticky);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleScroll);

    handleScroll();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
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

  const handleReserve = (e) => {
    e.preventDefault();
    console.log("Reserved:", selectedDates, guestData);
    // Add your reservation logic here
  };

  // Normalize images similar to RoomCard
  const images = (() => {
    if (!room) return [];
    if (Array.isArray(room.images)) return room.images;
    if (Array.isArray(room.image)) return room.image;
    if (typeof room.image === "string") return [room.image];
    return [];
  })();

  // Mock amenities data
  const amenities = [
    { icon: <FaWifi />, name: "WiFi", category: "Essentials" },
    { icon: <FaCar />, name: "Free parking", category: "Essentials" },
    { icon: <FaUtensils />, name: "Kitchen", category: "Kitchen" },
    { icon: <FaSwimmingPool />, name: "Pool", category: "Facilities" },
    { icon: <FaSnowflake />, name: "Air conditioning", category: "Climate" },
    { icon: <FaFire />, name: "Heating", category: "Climate" },
    { icon: <FaTv />, name: "TV", category: "Entertainment" },
    { icon: <FaPaw />, name: "Pet friendly", category: "Safety" },
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
          <div className="main-image">
            <img src={images[0]} alt="Main" />
          </div>

          <div className="side-images">
            {images.slice(1, 5).map((img, idx) => (
              <div key={idx} className="side-image">
                <img src={img} alt={`img-${idx}`} />
                {idx === 3 && (
                  <div className="overlay">
                    <button className="show-button"> Show all photos</button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Main Content */}
        <div className="room-detail-content" ref={contentRef}>
          <div className="main-content">
            {/* Header */}
            <div className="room-header">
              <div className="room-title-section">
                <h1>{room.title}</h1>
                <div className="room-meta">
                  <p>
                    {room.guests} guests · {room.bedrooms} bedrooms · {room.beds} beds · {room.bathrooms} bath
                  </p>
                  <div className="rating-section">
                    <FaStar className="star-icon" />
                    <span className="rating">{room.rating}</span>
                    <span className="review-count">· {room.reviewCount} reviews</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Host */}
            <div className="host-section">
              <div className="host-info">
                <div className="host-avatar">
                  <img
                    src={room.hostAvatar || "https://a0.muscache.com/im/pictures/user/User/original/ad72d705-4af6-4760-bd27-c7a3f2c5cb5f.jpeg?im_w=240"}
                    alt="Host"
                  />
                </div>
                <div className="host-details">
                  <h3>Hosted by {room.host}</h3>
                  <div className="host-verification">
                    <MdVerified className="verified-icon" />
                    <span>Identity verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Host Home Features */}
            <div className="host-home-section">
              <div className="host-home-detail">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  style={{
                    display: "block",
                    height: "31px",
                    width: "40px",
                    fill: "currentColor",
                  }}
                >
                  <path d="M24.33 1.67a2 2 0 0 1 2 1.85v24.81h3v2H2.67v-2h3V3.67a2 2 0 0 1 1.85-2h.15zm-4 2H7.67v24.66h12.66zm4 0h-2v24.66h2zm-7 11a1.33 1.33 0 1 1 0 2.66 1.33 1.33 0 0 1 0-2.66z"></path>
                </svg>
                <div className="host-home-details-content">
                  <p>Self check-in</p>
                  <p>You can check in with the building staff.</p>
                </div>
              </div>
              
              <div className="host-home-detail">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  style={{
                    display: "block",
                    height: "31px",
                    width: "40px",
                    fill: "currentColor",
                  }}
                >
                  <path d="M17 6a2 2 0 0 1 2 1.85v8.91l.24.24H24v-3h-3a1 1 0 0 1-.98-1.2l.03-.12 2-6a1 1 0 0 1 .83-.67L23 6h4a1 1 0 0 1 .9.58l.05.1 2 6a1 1 0 0 1-.83 1.31L29 14h-3v3h5a1 1 0 0 1 1 .88V30h-2v-3H20v3h-2v-3H2v3H0V19a3 3 0 0 1 1-2.24V8a2 2 0 0 1 1.85-2H3zm13 13H20v6h10zm-13-1H3a1 1 0 0 0-1 .88V25h16v-6a1 1 0 0 0-.77-.97l-.11-.02zm8 3a1 1 0 1 1 0 2 1 1 0 0 1 0-2zM17 8H3v8h2v-3a2 2 0 0 1 1.85-2H13a2 2 0 0 1 2 1.85V16h2zm-4 5H7v3h6zm13.28-5h-2.56l-1.33 4h5.22z"></path>
                </svg>
                <div className="host-home-details-content">
                  <p>Room in a villa</p>
                  <p>Your own room in a home, plus access to shared spaces.</p>
                </div>
              </div>
              
              <div className="host-home-detail">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 32 32"
                  aria-hidden="true"
                  role="presentation"
                  focusable="false"
                  style={{
                    display: "block",
                    height: "31px",
                    width: "40px",
                    fill: "currentColor",
                  }}
                >
                  <path d="M11.67 0v1.67h8.66V0h2v1.67h6a2 2 0 0 1 2 1.85v16.07a2 2 0 0 1-.46 1.28l-.12.13L21 29.75a2 2 0 0 1-1.24.58H6.67a5 5 0 0 1-5-4.78V3.67a2 2 0 0 1 1.85-2h6.15V0zm16.66 11.67H3.67v13.66a3 3 0 0 0 2.82 3h11.18v-5.66a5 5 0 0 1 4.78-5h5.88zm-.08 8h-5.58a3 3 0 0 0-3 2.82v5.76zm-18.58-16h-6v6h24.66v-6h-6v1.66h-2V3.67h-8.66v1.66h-2z"></path>
                </svg>
                <div className="host-home-details-content">
                  <p>Free cancellation for 24 hours</p>
                  <p>Get a full refund if you change your mind.</p>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="room-description">
              <h2>About this place</h2>
              <p>{room.description}</p>
            </div>

            {/* Amenities */}
            <Amenties />

            {/* Booking Calendar */}
            <Calendar onDateSelect={setSelectedDates} />

            {/* Reviews */}
            <div className="reviews-section">
              <div className="reviews-header">
                <div className="reviews-summary">
                  <FaStar className="star-icon" />
                  <span className="overall-rating">{room.rating}</span>
                  <span className="review-count">· {room.reviewCount} reviews</span>
                </div>
              </div>

              <div className="reviews-grid">
                {[1, 2, 3].map((review) => (
                  <div key={review} className="review-item">
                    <div className="reviewer-info">
                      <img
                        src="https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg"
                        alt="Reviewer"
                      />
                      <div>
                        <strong>Sarah M.</strong>
                        <p>March 2024</p>
                      </div>
                    </div>
                    <p className="review-text">
                      "Amazing place to stay! The host was very responsive and
                      the location was perfect. Would definitely recommend to
                      others."
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
                  <span>{renderLocationText()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div
            className={`booking-sidebar ${isSticky ? "sticky" : ""}`}
            ref={sidebarRef}
          >
            <div className="booking-card">
              {/* ✅ Price section with dynamic calculation */}
              <div className="price-section">
                {selectedDates.checkIn && selectedDates.checkOut ? (
                  // Show total price when dates are selected
                  <div className="price-display">
                    <span className="price">
                      {formatCurrency(calculateTotalPrice())}
                    </span>
                    <span className="price-details">
                      for {calculateNights()} night{calculateNights() !== 1 ? "s" : ""}
                    </span>
                  </div>
                ) : (
                  // Show per night price when no dates selected
                  <div className="price-display">
                    <span className="price">{formatCurrency(room?.price)}</span>
                    <span className="price-period"> per night</span>
                  </div>
                )}
              </div>

              {/* ✅ Booking form */}
              <form className="booking-form" onSubmit={handleReserve}>
                {/* DatePicker - Works with Calendar component via shared selectedDates state */}
                <DatePicker
                  checkIn={selectedDates.checkIn}
                  checkOut={selectedDates.checkOut}
                  onCheckInChange={(date) =>
                    setSelectedDates((prev) => ({ ...prev, checkIn: date }))
                  }
                  onCheckOutChange={(date) =>
                    setSelectedDates((prev) => ({ ...prev, checkOut: date }))
                  }
                />

                {/* Guests Input Section with Dropdown */}
                <div
                  className={`guests-input-section ${
                    isGuestDropdownOpen ? "dropdown-open" : ""
                  }`}
                >
                  <label htmlFor="guests-trigger">GUESTS</label>
                  <button
                    id="guests-trigger"
                    type="button"
                    className="guests-trigger"
                    onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}
                  >
                    {getGuestDisplayText()}
                  </button>

                  {/* Guest Dropdown */}
                  {isGuestDropdownOpen && (
                    <div className="guest-dropdown">
                      {/* Adults */}
                      <div className="guest-option">
                        <div className="guest-type-info">
                          <div className="guest-type-name">Adults</div>
                          <div className="guest-type-description">Age 13+</div>
                        </div>
                        <div className="guest-counter">
                          <button
                            className="counter-btn"
                            onClick={() => handleDecrement("adults")}
                            disabled={guestData.adults <= 0}
                          >
                            −
                          </button>
                          <span className="counter-value">
                            {guestData.adults}
                          </span>
                          <button
                            className="counter-btn"
                            onClick={() => handleIncrement("adults")}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Children */}
                      <div className="guest-option">
                        <div className="guest-type-info">
                          <div className="guest-type-name">Children</div>
                          <div className="guest-type-description">
                            Ages 2-12
                          </div>
                        </div>
                        <div className="guest-counter">
                          <button
                            className="counter-btn"
                            onClick={() => handleDecrement("children")}
                            disabled={guestData.children <= 0}
                          >
                            −
                          </button>
                          <span className="counter-value">
                            {guestData.children}
                          </span>
                          <button
                            className="counter-btn"
                            onClick={() => handleIncrement("children")}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Infants */}
                      <div className="guest-option">
                        <div className="guest-type-info">
                          <div className="guest-type-name">Infants</div>
                          <div className="guest-type-description">Under 2</div>
                        </div>
                        <div className="guest-counter">
                          <button
                            className="counter-btn"
                            onClick={() => handleDecrement("infants")}
                            disabled={guestData.infants <= 0}
                          >
                            −
                          </button>
                          <span className="counter-value">
                            {guestData.infants}
                          </span>
                          <button
                            className="counter-btn"
                            onClick={() => handleIncrement("infants")}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Pets */}
                      <div className="guest-option">
                        <div className="guest-type-info">
                          <div className="guest-type-name">Pets</div>
                          <span
                            className="guest-type-description clickable"
                            onClick={() => setShowServiceAnimalPopup(true)}
                          >
                            Bringing a service animal?
                          </span>
                        </div>
                        <div className="guest-counter">
                          <button
                            className="counter-btn"
                            onClick={() => handleDecrement("pets")}
                            disabled={guestData.pets <= 0}
                          >
                            −
                          </button>
                          <span className="counter-value">
                            {guestData.pets}
                          </span>
                          <button
                            className="counter-btn"
                            onClick={() => handleIncrement("pets")}
                          >
                            +
                          </button>
                        </div>
                      </div>

                      {/* Service Animal Popup - Minimal Version */}
                      {showServiceAnimalPopup && (
                        <div
                          className="popup-overlay"
                          onClick={() => setShowServiceAnimalPopup(false)}
                        >
                          <div
                            className="popup-content"
                            onClick={(e) => e.stopPropagation()}
                          >
                            {/* Close button in top-left corner */}
                            <div className="popup-header">
                              <button
                                className="popup-close"
                                onClick={() => setShowServiceAnimalPopup(false)}
                              >
                                &times;
                              </button>
                            </div>

                            {/* Scrollable content */}
                            <div className="popup-scrollable">
                              <div className="popup-body">
                                <img
                                  src="https://a0.muscache.com/pictures/adafb11b-41e9-49d3-908e-049dfd6934b6.jpg"
                                  alt="pet-img"
                                />
                                <h3>Service animals</h3>
                                <p className="popup-main-text">
                                  Service animals aren't pets, so there's no
                                  need to add them here.
                                </p>
                                <p className="popup-secondary-text">
                                  Travelling with an emotional support animal?
                                  Check out our{" "}
                                  <Link to="/accessibility">
                                    <span>accessibility policy.</span>
                                  </Link>
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Info Text */}
                      <div className="guest-dropdown-info">
                        <p>
                          This place has a maximum of {maxGuests} guests, not
                          including <br /> infants. If you're bringing more than
                          2 pets, please let <br /> your Host know.
                        </p>
                      </div>

                      {/* Close Text with Underline */}
                      <div className="guest-dropdown-footer">
                        <span
                          className="close-text"
                          onClick={() => setIsGuestDropdownOpen(false)}
                        >
                          Close
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Reserve Button */}
                <Link to="/booking">
                  <button type="button" className="reserve-button">
                    Reserve
                  </button>
                </Link>
                <p className="booking-note">You won't be charged yet</p>
              </form>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RoomDetailPage;