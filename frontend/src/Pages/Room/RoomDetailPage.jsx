// RoomDetailPage.jsx
import React, { useEffect, useState, useRef } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { fetchRoomById, clearCurrentRoom } from "../../features/roomsSlice";
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
} from "react-icons/fa";
import { MdLocationOn, MdVerified } from "react-icons/md";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import Calendar from "../../Components/BookingCalendar/Calendar";
import "./RoomDetailPage.scss";

const RoomDetailPage = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  // safe selector guard — if state.rooms is undefined fallback to defaults
  const roomsState = useSelector((state) => state.rooms) || {};
  const { room = null, loading = false, error = null } = roomsState;

  // UI state
  const [currentImage, setCurrentImage] = useState(0);
  const [isSticky, setIsSticky] = useState(false);
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
  const [showServiceAnimalPopup, setShowServiceAnimalPopup] = useState(false);

  const sidebarRef = useRef(null);
  const contentRef = useRef(null);

  const maxGuests = room?.guests || 10;

  // Fetch room on mount and clear on unmount
  useEffect(() => {
    if (id) dispatch(fetchRoomById(id));
    return () => dispatch(clearCurrentRoom());
  }, [dispatch, id]);

  // Sticky sidebar
  useEffect(() => {
    const handleScroll = () => {
      if (!sidebarRef.current || !contentRef.current) return;
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

  // Guests counter
  const handleIncrement = (type) =>
    setGuestData((prev) => ({ ...prev, [type]: prev[type] + 1 }));
  const handleDecrement = (type) =>
    setGuestData((prev) => ({ ...prev, [type]: Math.max(0, prev[type] - 1) }));

  const getGuestDisplayText = () => {
    const { adults, children, infants, pets } = guestData;
    const total = adults + children;
    let text = `${total} guest${total !== 1 ? "s" : ""}`;
    if (infants) text += `, ${infants} infant${infants !== 1 ? "s" : ""}`;
    if (pets) text += `, ${pets} pet${pets !== 1 ? "s" : ""}`;
    return text;
  };

  // Close dropdown on outside click
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isGuestDropdownOpen && !event.target.closest(".guests-input-section")) {
        setIsGuestDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isGuestDropdownOpen]);

  // Normalize images (safe with room possibly null)
  const images = (() => {
    if (!room) return [];
    if (Array.isArray(room.images)) return room.images;
    if (Array.isArray(room.image)) return room.image;
    if (typeof room.image === "string") return [room.image];
    return [];
  })();

  useEffect(() => {
    // whenever room or images change, reset image index
    setCurrentImage(0);
  }, [room]);

  const handlePrevImage = (e) => {
    e?.stopPropagation();
    if (!images.length) return;
    setCurrentImage((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    e?.stopPropagation();
    if (!images.length) return;
    setCurrentImage((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleImageClick = (index) => setCurrentImage(index);

  // Booking calculations
  const calculateNights = () => {
    try {
      const nights = Math.ceil(
        (selectedDates.checkOut - selectedDates.checkIn) / (1000 * 3600 * 24)
      );
      return nights > 0 ? nights : 1;
    } catch {
      return 1;
    }
  };

  const calculateTotalPrice = () => (room?.price || 0) * calculateNights();

  const formatCurrency = (amount) => `₹${amount?.toLocaleString?.() || 0}`;

  // Date helpers (used by native date inputs)
  const formatDateForInput = (date) => {
    if (!date) return "";
    const d = new Date(date);
    return d.toISOString().split("T")[0];
  };
  const parseInputDate = (dateString) => new Date(dateString);

  // Map/location display guard (avoid rendering object directly)
  const renderLocationText = () => {
    if (!room?.location) return "Shenoy Nagar, Chennai";
    if (typeof room.location === "string") return room.location;
    if (typeof room.location === "object") {
      const { lat, lng } = room.location;
      if (lat !== undefined && lng !== undefined) return `Lat: ${lat}, Lng: ${lng}`;
      return JSON.stringify(room.location);
    }
    return String(room.location);
  };

  // Loading / error guards
  if (loading) return <><Navbar /><div className="loading">Loading room details...</div></>;
  if (error || !room) return <><Navbar /><div className="error"><h2>{error || "Room not found"}</h2></div></>;

  return (
    <>
      <Navbar />
      <div className="room-detail-page">
        {/* Image Gallery */}
        <div className="image-gallery">
          <div className="main-image-container">
            <img
              src={images[currentImage] || "https://via.placeholder.com/800x600"}
              alt={`${room.title || "Room"} - Image ${currentImage + 1}`}
            />
            {images.length > 1 && (
              <>
                <button className="image-nav prev" onClick={handlePrevImage}><FaChevronLeft /></button>
                <button className="image-nav next" onClick={handleNextImage}><FaChevronRight /></button>
                <div className="image-counter">{currentImage + 1}/{images.length}</div>
              </>
            )}
          </div>

          {images.length > 1 && (
            <div className="thumbnail-grid">
              {images.slice(0, 5).map((img, i) => (
                <div key={i} className={`thumbnail ${i === currentImage ? "active" : ""}`} onClick={() => handleImageClick(i)}>
                  <img src={img} alt={`Thumb ${i + 1}`} />
                </div>
              ))}
              {images.length > 5 && <div className="thumbnail show-all" onClick={() => { /* open modal if you want */ }}><span>+{images.length - 5} more</span></div>}
            </div>
          )}
        </div>

        {/* Main Content */}
        <div className="room-detail-content" ref={contentRef}>
          <div className="main-content">
            {/* Header */}
            <div className="room-header">
              <h1>{room.title}</h1>
              <p>{room.guests} guests · {room.bedrooms} bedrooms · {room.beds} beds · {room.bathrooms} bath</p>
              <div className="rating-section"><FaStar /> {room.rating} · {room.reviewCount} reviews</div>
            </div>

            {/* Host */}
            <div className="host-section">
              <div className="host-info">
                <img src={room.hostAvatar || "https://a0.muscache.com/im/pictures/user/User/original/ad72d705-4af6-4760-bd27-c7a3f2c5cb5f.jpeg?im_w=240"} alt="Host" />
                <div>
                  <h3>Hosted by {room.host}</h3>
                  <div className="verified"><MdVerified /> Identity verified</div>
                </div>
              </div>
            </div>

            {/* Description */}
            <div className="room-description">
              <h2>About this place</h2>
              <p>{room.description}</p>
            </div>

            {/* Amenities */}
            <div className="amenities-section">
              <h2>What this place offers</h2>
              <div className="amenities-grid">
                {(room.amenities?.length ? room.amenities : [
                  { icon: <FaWifi />, name: "WiFi" },
                  { icon: <FaCar />, name: "Parking" },
                  { icon: <FaUtensils />, name: "Kitchen" },
                  { icon: <FaSwimmingPool />, name: "Pool" },
                  { icon: <FaSnowflake />, name: "AC" },
                  { icon: <FaFire />, name: "Heating" },
                  { icon: <FaTv />, name: "TV" },
                  { icon: <FaPaw />, name: "Pets" },
                ]).map((a, i) => (
                  <div key={i} className="amenity-item">{a.icon} {a.name}</div>
                ))}
              </div>
            </div>

            {/* Calendar */}
            <Calendar onDateSelect={setSelectedDates} />

            {/* Reviews */}
            <div className="reviews-section">
              <h2>Reviews</h2>
              {[1, 2, 3].map((r) => (
                <div key={r} className="review-item">
                  <img src="https://www.rd.com/wp-content/uploads/2017/09/01-shutterstock_476340928-Irina-Bg.jpg" alt="Reviewer" />
                  <div><strong>Sarah M.</strong><p>March 2024</p></div>
                  <p>"Amazing stay!"</p>
                </div>
              ))}
            </div>

            {/* Location */}
            <div className="location-section">
              <h2>Where you'll be</h2>
              <div className="map-placeholder">
                <MdLocationOn /> {renderLocationText()}
              </div>
            </div>
          </div>

          {/* Booking Sidebar */}
          <div className={`booking-sidebar ${isSticky ? "sticky" : ""}`} ref={sidebarRef}>
            <div className="booking-card">
              <div className="price-section">
                <span>{formatCurrency(calculateTotalPrice())} for {calculateNights()} night{calculateNights() > 1 ? "s" : ""}</span>
              </div>

              <form className="booking-form" onSubmit={(e) => e.preventDefault()}>
                <div className="date-inputs">
                  <input
                    type="date"
                    value={formatDateForInput(selectedDates.checkIn)}
                    onChange={(e) => setSelectedDates({ ...selectedDates, checkIn: parseInputDate(e.target.value) })}
                  />
                  <input
                    type="date"
                    value={formatDateForInput(selectedDates.checkOut)}
                    onChange={(e) => setSelectedDates({ ...selectedDates, checkOut: parseInputDate(e.target.value) })}
                  />
                </div>

                {/* Guests */}
                <div className="guests-input-section">
                  <button type="button" onClick={() => setIsGuestDropdownOpen(!isGuestDropdownOpen)}>{getGuestDisplayText()}</button>
                  {isGuestDropdownOpen && (
                    <div className="guest-dropdown">
                      {["adults", "children", "infants", "pets"].map((type) => (
                        <div key={type} className="guest-option">
                          <span>{type.charAt(0).toUpperCase() + type.slice(1)}</span>
                          <button onClick={() => handleDecrement(type)} disabled={guestData[type] <= 0}>−</button>
                          <span>{guestData[type]}</span>
                          <button onClick={() => handleIncrement(type)}>+</button>
                        </div>
                      ))}
                      <span onClick={() => setIsGuestDropdownOpen(false)}>Close</span>
                    </div>
                  )}
                </div>

                <Link to="/booking"><button type="button">Reserve</button></Link>
                <p>You won't be charged yet</p>
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
