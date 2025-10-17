import React, { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import "./BookingPage.scss";
import { 
  FaArrowLeft, 
  FaCalendarAlt, 
  FaUser, 
  FaCreditCard, 
  FaShieldAlt,
  FaMapMarkerAlt,
  FaStar,
  FaHeart,
  FaShare,
  FaWifi,
  FaParking,
  FaSwimmingPool,
  FaUtensils,
  FaDog,
  FaSmokingBan,
  FaCheckCircle,
  FaLock,
  FaChevronDown,
  FaChevronUp
} from "react-icons/fa";

const BookingPage = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentStep, setCurrentStep] = useState(1);
  const [expandedSteps, setExpandedSteps] = useState([1]);
  const [bookingData, setBookingData] = useState({
    checkIn: searchParams.get('checkIn') || "2025-11-04",
    checkOut: searchParams.get('checkOut') || "2025-11-07",
    guests: parseInt(searchParams.get('guests')) || 2,
    adults: 2,
    infants: 1,
    totalNights: 3,
    pricePerNight: 2434.13,
    taxes: 319.96,
    total: 7622.35,
    message: "",
    paymentMethod: "credit_card",
    cardNumber: "1234 5678 9012 3456",
    expiryDate: "",
    cvv: "",
    cardholderName: ""
  });

  // Mock property data - in real app, this would come from props or API
  const property = {
    id: "1",
    title: "beautiful home. Long rental prefered",
    location: "Downtown, New York",
    images: [
      "https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&h=600&fit=crop"
    ],
    rating: 4.8,
    reviewCount: 127,
    host: "Sarah",
    hostAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
    amenities: [
      { icon: <FaWifi />, name: "WiFi" },
      { icon: <FaParking />, name: "Free parking" },
      { icon: <FaSwimmingPool />, name: "Pool" },
      { icon: <FaUtensils />, name: "Kitchen" },
      { icon: <FaDog />, name: "Pet-friendly" }
    ],
    description: "Beautiful modern loft in the heart of downtown. Perfect for business travelers and tourists alike. Walking distance to major attractions, restaurants, and public transportation.",
    houseRules: [
      "No smoking",
      "No parties or events",
      "Check-in after 3:00 PM",
      "Check-out before 11:00 AM"
    ]
  };

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

  const toggleStep = (stepNumber) => {
    setExpandedSteps(prev => {
      if (prev.includes(stepNumber)) {
        return prev.filter(step => step !== stepNumber);
      } else {
        return [...prev, stepNumber];
      }
    });
  };

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      setExpandedSteps(prev => [...prev, currentStep + 1]);
    }
  };

  const handleSubmitBooking = async () => {
    try {
      console.log("Submitting booking:", bookingData);
      alert("Booking confirmed! You'll receive a confirmation email shortly.");
      navigate("/");
    } catch (err) {
      console.error("Booking submission failed:", err);
      alert("Failed to submit booking. Please try again.");
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

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <>
      <Navbar />
      <div className="booking-page">
        <div className="booking-container">
          {/* Header */}
          <div className="booking-header">
            <button onClick={() => navigate(-1)} className="back-button">
              <FaArrowLeft />
            </button>
            <h1>Request to book</h1>
          </div>

          <div className="booking-content">
            {/* Left Side - Booking Form */}
            <div className="booking-form-section">
              {/* Step 1: Add a payment method */}
              <div className="booking-step">
                <div 
                  className="step-header"
                  onClick={() => toggleStep(1)}
                >
                  <div className="step-title">
                    <span className="step-number">1</span>
                    <span className="step-text">Add a payment method</span>
                  </div>
                  {expandedSteps.includes(1) ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                
                {expandedSteps.includes(1) && (
                  <div className="step-content">
                    <div className="payment-methods">
                      <label className="payment-option">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="upi_qr"
                          checked={bookingData.paymentMethod === "upi_qr"}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        />
                        <div className="payment-option-content">
                          <div className="payment-logo upi-logo">UPI</div>
                          <span>UPI QR code</span>
                        </div>
                      </label>

                      <label className="payment-option">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="upi_id"
                          checked={bookingData.paymentMethod === "upi_id"}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        />
                        <div className="payment-option-content">
                          <div className="payment-logo upi-logo">UPI</div>
                          <span>UPI ID</span>
                        </div>
                      </label>

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
                          <div className="card-logos">
                            <span className="card-logo visa">VISA</span>
                            <span className="card-logo amex">AMEX</span>
                            <span className="card-logo rupay">RuPay</span>
                          </div>
                        </div>
                      </label>

                      <label className="payment-option">
                        <input
                          type="radio"
                          name="paymentMethod"
                          value="net_banking"
                          checked={bookingData.paymentMethod === "net_banking"}
                          onChange={(e) => handleInputChange('paymentMethod', e.target.value)}
                        />
                        <div className="payment-option-content">
                          <div className="payment-logo bank-logo">🏦</div>
                          <span>Net Banking</span>
                        </div>
                      </label>
                    </div>

                    {bookingData.paymentMethod === "credit_card" && (
                      <div className="card-details">
                        <div className="input-group">
                          <label>Card number</label>
                          <div className="input-with-icon">
                            <input
                              type="text"
                              value={bookingData.cardNumber}
                              onChange={(e) => handleInputChange('cardNumber', e.target.value)}
                              placeholder="1234 5678 9012 3456"
                              maxLength="19"
                            />
                            <FaLock className="input-icon" />
                          </div>
                        </div>

                        <div className="card-grid">
                          <div className="input-group">
                            <label>Expiration</label>
                            <input
                              type="text"
                              value={bookingData.expiryDate}
                              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
                              placeholder="MM/YY"
                              maxLength="5"
                            />
                          </div>
                          <div className="input-group">
                            <label>CVV</label>
                            <input
                              type="text"
                              value={bookingData.cvv}
                              onChange={(e) => handleInputChange('cvv', e.target.value)}
                              placeholder="3 digits"
                              maxLength="3"
                            />
                          </div>
                        </div>

                        <div className="input-group">
                          <label>Cardholder name</label>
                          <input
                            type="text"
                            value={bookingData.cardholderName}
                            onChange={(e) => handleInputChange('cardholderName', e.target.value)}
                            placeholder="Enter cardholder name"
                          />
                        </div>
                      </div>
                    )}

                    <div className="step-actions">
                      <button 
                        onClick={handleNextStep} 
                        className="next-button"
                      >
                        Next
                      </button>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 2: Write a message to the host */}
              <div className="booking-step">
                <div 
                  className="step-header"
                  onClick={() => toggleStep(2)}
                >
                  <div className="step-title">
                    <span className="step-number">2</span>
                    <span className="step-text">Write a message to the host</span>
                  </div>
                  {expandedSteps.includes(2) ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                
                {expandedSteps.includes(2) && (
                  <div className="step-content">
                    <div className="message-section">
                      <h3>2. Write a message to the host</h3>
                      <p className="instruction-text">
                        Before you can continue, let Sujit know a little about your trip and why their place is a good fit.
                      </p>
                      
                      <div className="host-info">
                        <div className="host-avatar">
                          <img src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face" alt="Sujit" />
                        </div>
                        <div className="host-details">
                          <div className="host-name">Sujit</div>
                          <div className="hosting-since">Hosting since 2025</div>
                        </div>
                      </div>
                      
                      <div className="message-input-group">
                        <textarea
                          value={bookingData.message}
                          onChange={(e) => handleInputChange('message', e.target.value)}
                          placeholder="Room is available on selected date please let me know"
                          rows="6"
                          className="message-textarea"
                        />
                      </div>
                      
                      <div className="message-actions">
                        <button onClick={handleNextStep} className="done-button">
                          Done
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Review your request */}
              <div className="booking-step">
                <div 
                  className="step-header"
                  onClick={() => toggleStep(3)}
                >
                  <div className="step-title">
                    <span className="step-number">3</span>
                    <span className="step-text">Review your request</span>
                  </div>
                  {expandedSteps.includes(3) ? <FaChevronUp /> : <FaChevronDown />}
                </div>
                
                {expandedSteps.includes(3) && (
                  <div className="step-content">
                    <div className="review-section">
                      <h3>3. Review your request</h3>
                      <p className="review-info">
                        The host has 24 hours to accept your request. You'll pay now, but get a full refund if the booking isn't confirmed.
                      </p>
                      
                      <div className="separator"></div>
                      
                      <p className="legal-agreement">
                        By selecting the button, I agree to the <span className="legal-link">booking terms</span> and updated <span className="legal-link">Terms of Service</span>. <span className="legal-link">View Privacy Policy</span>.
                      </p>
                      
                      <button onClick={handleSubmitBooking} className="request-to-book-button">
                        Request to book
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Side - Property Summary */}
            <div className="booking-summary">
              <div className="summary-card">
                <div className="property-preview">
                  <img src={property.images[0]} alt={property.title} />
                  <h3>{property.title}</h3>
                </div>

                <div className="cancellation-policy">
                  <div className="policy-header">
                    <span className="policy-icon">✓</span>
                    <span className="policy-text">Free cancellation</span>
                  </div>
                  <p className="policy-details">
                    Cancel before 3 Nov for a full refund. <span className="policy-link">Full policy</span>
                  </p>
                </div>

                <div className="booking-details">
                  <div className="detail-row">
                    <div className="detail-info">
                      <span className="detail-label">Dates</span>
                      <span className="detail-value">4-7 Nov 2025</span>
                    </div>
                    <button className="change-button">Change</button>
                  </div>
                  
                  <div className="detail-row">
                    <div className="detail-info">
                      <span className="detail-label">Guests</span>
                      <span className="detail-value">{bookingData.adults} adults, {bookingData.infants} infant</span>
                    </div>
                    <button className="change-button">Change</button>
                  </div>
                </div>

                <div className="price-breakdown">
                  <div className="price-item">
                    <span>{bookingData.totalNights} nights x ₹{bookingData.pricePerNight.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                    <span>₹{(bookingData.totalNights * bookingData.pricePerNight).toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                  </div>
                  
                  <div className="price-item">
                    <span>Taxes</span>
                    <span>₹{bookingData.taxes.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                  </div>
                  
                  <div className="price-item total">
                    <span>Total INR</span>
                    <span>₹{bookingData.total.toLocaleString('en-IN', {minimumFractionDigits: 2})}</span>
                  </div>
                  
                  <div className="price-breakdown-link">
                    <span>Price breakdown</span>
                  </div>
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

export default BookingPage;
