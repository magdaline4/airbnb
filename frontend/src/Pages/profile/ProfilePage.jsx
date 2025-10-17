import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import "./ProfilePage.scss";
import { 
  FaUser,
  FaMapMarkerAlt,
  FaUsers,
  FaCheckCircle,
  FaEdit,
  FaStar
} from "react-icons/fa";

const ProfilePage = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState("about");

  const profileData = {
    name: "Sugan",
    role: "Guest",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    stats: {
      trips: 2,
      reviews: 2,
      yearsOnAirbnb: 8
    },
    isIdentityVerified: true
  };

  const reviews = [
    {
      id: 1,
      reviewerName: "Deepak",
      reviewerAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face",
      date: "August 2024",
      text: "Easy Going and polite."
    },
    {
      id: 2,
      reviewerName: "Sripriya",
      reviewerAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=100&h=100&fit=crop&crop=face",
      location: "Thoraipakkam, India",
      date: "June 2024",
      text: "He kept the room neat and clean and followedthe house rules .. he s friendly too happy to host you .."
    }
  ];

  const navigationItems = [
    {
      id: "about",
      label: "About me",
      icon: <FaUser />,
      active: activeSection === "about"
    },
    {
      id: "trips",
      label: "Past trips",
      icon: <FaMapMarkerAlt />,
      active: activeSection === "trips"
    },
    {
      id: "connections",
      label: "Connections",
      icon: <FaUsers />,
      active: activeSection === "connections"
    }
  ];

  const renderAboutSection = () => (
    <div className="about-section">
      <div className="section-header">
        <h2>About me</h2>
        <button className="edit-button" onClick={() => navigate('/profile/edit')}>
          <FaEdit />
          Edit
        </button>
      </div>

      <div className="profile-card">
        <div className="profile-avatar">
          <img src={profileData.avatar} alt={profileData.name} />
          {profileData.isIdentityVerified && (
            <div className="verified-badge">
              <FaCheckCircle />
            </div>
          )}
        </div>
        
        <div className="profile-info">
          <h3 className="profile-name">{profileData.name}</h3>
          <p className="profile-role">{profileData.role}</p>
        </div>

        <div className="profile-stats">
          <div className="stat-item">
            <span className="stat-number">{profileData.stats.trips}</span>
            <span className="stat-label">Trips</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{profileData.stats.reviews}</span>
            <span className="stat-label">Reviews</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">{profileData.stats.yearsOnAirbnb}</span>
            <span className="stat-label">Years on Airbnb</span>
          </div>
        </div>
      </div>

      {profileData.isIdentityVerified && (
        <div className="identity-verified">
          <FaCheckCircle className="check-icon" />
          <span>Identity verified</span>
        </div>
      )}

      <div className="reviews-section">
        <h2>My reviews</h2>
        
        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="reviewer-avatar">
                <img src={review.reviewerAvatar} alt={review.reviewerName} />
              </div>
              
              <div className="review-content">
                <div className="reviewer-info">
                  <h4 className="reviewer-name">{review.reviewerName}</h4>
                  <div className="review-meta">
                    {review.location && (
                      <span className="review-location">{review.location}</span>
                    )}
                    <span className="review-date">{review.date}</span>
                  </div>
                </div>
                
                <p className="review-text">{review.text}</p>
              </div>
            </div>
          ))}
        </div>

        <button className="show-all-reviews-button">
          Show all {reviews.length} reviews
        </button>
      </div>
    </div>
  );

  const renderTripsSection = () => (
    <div className="trips-section">
      <h2>Past trips</h2>
      <p>Your past trips will appear here.</p>
    </div>
  );

  const renderConnectionsSection = () => (
    <div className="connections-section">
      <h2>Connections</h2>
      <p>Your connections will appear here.</p>
    </div>
  );

  const renderMainContent = () => {
    switch (activeSection) {
      case "about":
        return renderAboutSection();
      case "trips":
        return renderTripsSection();
      case "connections":
        return renderConnectionsSection();
      default:
        return renderAboutSection();
    }
  };

  return (
    <>
      <Navbar />
      <div className="profile-page">
        <div className="profile-container">
          <div className="profile-layout">
            {/* Left Sidebar */}
            <div className="profile-sidebar">
              <h1 className="sidebar-title">Profile</h1>
              
              <nav className="sidebar-navigation">
                {navigationItems.map((item) => (
                  <button
                    key={item.id}
                    className={`nav-item ${item.active ? 'active' : ''}`}
                    onClick={() => setActiveSection(item.id)}
                  >
                    <div className="nav-icon">{item.icon}</div>
                    <span className="nav-label">{item.label}</span>
                  </button>
                ))}
              </nav>
            </div>

            {/* Main Content */}
            <div className="profile-main-content">
              {renderMainContent()}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default ProfilePage;