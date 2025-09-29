import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import axios from "axios";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import "./BookingRequestPage.scss";
import { FaArrowLeft, FaCalendarAlt, FaUser, FaCreditCard, FaShieldAlt } from "react-icons/fa";

const BookingRequestPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const [room, setRoom] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 1,
    totalNights: 0,
    pricePerNight: 0,
    cleaningFee: 0,
    serviceFee: 0,
    taxes: 0,
    total: 0,
    message: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    paymentMethod: "credit_card"
  });

  useEffect(() => {
    const fetchRoomData = async () => {
      try {
        const response = await axios.get('/api/rooms.json');
        const roomData = response.data.find(r => r._id === id || r.id === id);
        
        if (roomData) {
          setRoom(roomData);
          // Calculate fees based on room price
          const basePrice = roomData.price || 100;
          setBookingData(prev => ({
            ...prev,
            pricePerNight: basePrice,
            cleaningFee: Math.round(basePrice * 0.15),
            serviceFee: Math.round(basePrice * 0.12),
            taxes: Math.round(basePrice * 0.08)
          }));
        } else {
          setError("Room not found");
        }
      } catch (err) {
        setError("Failed to load room data");
      } finally {
        setLoading(false);
      }
    };

    fetchRoomData();
  }, [id]);

  useEffect(() => {
    if (bookingData.checkIn && bookingData.checkOut) {
      const checkInDate = new Date(bookingData.checkIn);
      const checkOutDate = new Date(bookingData.checkOut);
      const nights = Math.ceil((checkOutDate - checkInDate) / (1000 * 60 * 60 * 24));
      
      if (nights > 0) {
        const subtotal = nights * bookingData.pricePerNight;
        const total = subtotal + bookingData.cleaningFee + bookingData.serviceFee + bookingData.taxes;
        
        setBookingData(prev => ({
          ...prev,
          totalNights: nights,
          total: total
        }));
      }
    }
  }, [bookingData.checkIn, bookingData.checkOut, bookingData.pricePerNight]);

  const handleInputChange = (field, value) => {
    setBookingData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
    }
  };

  const handlePrevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1);
    }
  };

  const handleSubmitBooking = async () => {
    try {
      // Simulate booking submission
      console.log("Submitting booking:", bookingData);
      
      // Here you would typically send the data to your backend
      // const response = await axios.post('/api/bookings', bookingData);
      
      // For now, just show success and redirect
      alert("Booking request submitted successfully!");
      navigate(`/rooms/${id}`);
    } catch (err) {
      console.error("Booking submission failed:", err);
      alert("Failed to submit booking request. Please try again.");
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      weekday: 'short', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="booking-loading">
          <div className="loading-spinner">Loading...</div>
        </div>
        <Footer />
      </>
    );
  }

  if (error || !room) {
    return (
      <>
        <Navbar />
        <div className="booking-error">
          <h2>Error</h2>
          <p>{error || "Room not found"}</p>
          <button onClick={() => navigate(-1)} className="back-button">
            Go Back
          </button>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div className="booking-request-page">
        <div className="booking-container">
          {/* Header */}
          <div className="booking-header">
            <button onClick={() => navigate(-1)} className="back-button">
              <FaArrowLeft />
            </button>
            <h1>Confirm and pay</h1>
          </div>

          <div className="booking-content">
            {/* Left Side - Booking Form */}
            <div className="booking-form-section">
              {/* Step 1: Trip Details */}
              {currentStep === 1 && (
                <div className="booking-step">
                  <h2>Your trip</h2>
                  
                  <div className="trip-details">
                    <div className="detail-item">
                      <label>Dates</label>
                      <div className="date-inputs">
                        <input
                          type="date"
                          value={bookingData.checkIn}
                          onChange={(e) => handleInputChange('checkIn', e.target.value)}
                          placeholder="Add date"
                        />
                        <input
                          type="date"
                          value={bookingData.checkOut}
                          onChange={(e) => handleInputChange('checkOut', e.target.value)}
                          placeholder="Add date"
                        />
                      </div>
                    </div>

                    <div className="detail-item">
                      <label>Guests</label>
                      <select
                        value={bookingData.guests}
                        onChange={(e) => handleInputChange('guests', parseInt(e.target.value))}
                      >
                        {Array.from({ length: 16 }, (_, i) => (
                          <option key={i + 1} value={i + 1}>
                            {i + 1} {i === 0 ? 'guest' : 'guests'}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>

                  <div className="step-actions">
                    <button onClick={handleNextStep} className="next-button" disabled={!bookingData.checkIn || !bookingData.checkOut}>
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Guest Information */}
              {currentStep === 2 && (
                <div className="booking-step">
                  <h2>Who's coming?</h2>
                  
                  <div className="guest-info">
                    <div className="info-grid">
                      <div className="input-group">
                        <label>First name</label>
                        <input
                          type="text"
                          value={bookingData.firstName}
                          onChange={(e) => handleInputChange('firstName', e.target.value)}
                          placeholder="Enter your first name"
                          required
                        />
                      </div>
                      
                      <div className="input-group">
                        <label>Last name</label>
                        <input
                          type="text"
                          value={bookingData.lastName}
                          onChange={(e) => handleInputChange('lastName', e.target.value)}
                          placeholder="Enter your last name"
                          required
                        />
                      </div>
                    </div>

                    <div className="input-group">
                      <label>Phone number</label>
                      <input
                        type="tel"
                        value={bookingData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                        placeholder="Enter your phone number"
                        required
                      />
                    </div>

                    <div className="input-group">
                      <label>Email address</label>
                      <input
                        type="email"
                        value={bookingData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        placeholder="Enter your email"
                        required
                      />
                    </div>
                  </div>

                  <div className="step-actions">
                    <button onClick={handlePrevStep} className="back-step-button">
                      Back
                    </button>
                    <button 
                      onClick={handleNextStep} 
                      className="next-button"
                      disabled={!bookingData.firstName || !bookingData.lastName || !bookingData.email || !bookingData.phone}
                    >
                      Continue
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Payment */}
              {currentStep === 3 && (
                <div className="booking-step">
                  <h2>Pay with</h2>
                  
                  <div className="payment-methods">
                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="credit_card"
                        checked={bookingData.paymentMethod === "credit_card"}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      />
                      <div className="payment-option-content">
                        <FaCreditCard className="payment-icon" />
                        <span>Credit or debit card</span>
                      </div>
                    </label>

                    <label className="payment-option">
                      <input
                        type="radio"
                        name="paymentMethod"
                        value="paypal"
                        checked={bookingData.paymentMethod === "paypal"}
                        onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                      />
                      <div className="payment-option-content">
                        <FaShieldAlt className="payment-icon" />
                        <span>PayPal</span>
                      </div>
                    </label>
                  </div>

                  {bookingData.paymentMethod === "credit_card" && (
                    <div className="card-details">
                      <div className="input-group">
                        <label>Card number</label>
                        <input
                          type="text"
                          placeholder="1234 5678 9012 3456"
                          maxLength="19"
                        />
                      </div>

                      <div className="card-grid">
                        <div className="input-group">
                          <label>Expiration</label>
                          <input
                            type="text"
                            placeholder="MM/YY"
                            maxLength="5"
                          />
                        </div>
                        <div className="input-group">
                          <label>CVV</label>
                          <input
                            type="text"
                            placeholder="123"
                            maxLength="3"
                          />
                        </div>
                      </div>

                      <div className="input-group">
                        <label>Country/Region</label>
                        <select>
                          <option value="US">United States</option>
                          <option value="CA">Canada</option>
                          <option value="GB">United Kingdom</option>
                          <option value="AU">Australia</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <div className="step-actions">
                    <button onClick={handlePrevStep} className="back-step-button">
                      Back
                    </button>
                    <button onClick={handleSubmitBooking} className="confirm-button">
                      Confirm and pay
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Right Side - Booking Summary */}
            <div className="booking-summary">
              <div className="summary-card">
                <div className="room-preview">
                  <img src={room.images?.[0] || "/placeholder-room.jpg"} alt={room.title} />
                  <div className="room-info">
                    <h3>{room.title}</h3>
                    <div className="room-rating">
                      <span className="star">★</span>
                      <span>{room.rating}</span>
                      <span className="review-count">({room.reviewCount} reviews)</span>
                    </div>
                  </div>
                </div>

                <div className="trip-summary">
                  <h3>Trip details</h3>
                  
                  {bookingData.checkIn && bookingData.checkOut && (
                    <div className="summary-item">
                      <div className="summary-label">Check-in</div>
                      <div className="summary-value">{formatDate(bookingData.checkIn)}</div>
                    </div>
                  )}
                  
                  {bookingData.checkIn && bookingData.checkOut && (
                    <div className="summary-item">
                      <div className="summary-label">Check-out</div>
                      <div className="summary-value">{formatDate(bookingData.checkOut)}</div>
                    </div>
                  )}
                  
                  {bookingData.totalNights > 0 && (
                    <div className="summary-item">
                      <div className="summary-label">Duration</div>
                      <div className="summary-value">{bookingData.totalNights} nights</div>
                    </div>
                  )}
                </div>

                <div className="price-breakdown">
                  <h3>Price details</h3>
                  
                  {bookingData.totalNights > 0 && (
                    <div className="price-item">
                      <span>${bookingData.pricePerNight} × {bookingData.totalNights} nights</span>
                      <span>${bookingData.pricePerNight * bookingData.totalNights}</span>
                    </div>
                  )}
                  
                  <div className="price-item">
                    <span>Cleaning fee</span>
                    <span>${bookingData.cleaningFee}</span>
                  </div>
                  
                  <div className="price-item">
                    <span>Service fee</span>
                    <span>${bookingData.serviceFee}</span>
                  </div>
                  
                  <div className="price-item">
                    <span>Taxes</span>
                    <span>${bookingData.taxes}</span>
                  </div>
                  
                  <div className="price-item total">
                    <span>Total (USD)</span>
                    <span>${bookingData.total}</span>
                  </div>
                </div>

                <div className="cancellation-policy">
                  <h4>Free cancellation before {formatDate(bookingData.checkIn)}</h4>
                  <p>Get a full refund if you cancel at least 24 hours before your check-in time.</p>
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

export default BookingRequestPage;
