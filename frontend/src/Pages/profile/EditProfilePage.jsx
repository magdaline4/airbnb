import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import "./EditProfilePage.scss";
import { 
  FaUser,
  FaMapMarkerAlt,
  FaUsers,
  FaCheckCircle,
  FaEdit,
  FaGraduationCap,
  FaBriefcase,
  FaGlobe,
  FaPaw,
  FaBirthdayCake,
  FaLightbulb,
  FaWrench,
  FaClock,
  FaMusic,
  FaBook,
  FaHeart,
  FaLanguage,
  FaHome,
  FaCamera,
  FaBuilding
} from "react-icons/fa";

const EditProfilePage = () => {
  const navigate = useNavigate();
  const [profileData, setProfileData] = useState({
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    aboutMe: "",
    showWhereIveBeen: false
  });

  const profileFields = [
    { id: "school", label: "Where I went to school", icon: <FaGraduationCap /> },
    { id: "work", label: "My work", icon: <FaBriefcase /> },
    { id: "wantToGo", label: "Where I've always wanted to go", icon: <FaGlobe /> },
    { id: "pets", label: "Pets", icon: <FaPaw /> },
    { id: "decade", label: "Decade I was born", icon: <FaBirthdayCake /> },
    { id: "funFact", label: "My fun fact", icon: <FaLightbulb /> },
    { id: "uselessSkill", label: "My most useless skill", icon: <FaWrench /> },
    { id: "timeSpent", label: "I spend too much time", icon: <FaClock /> },
    { id: "favoriteSong", label: "My favourite song in secondary school", icon: <FaMusic /> },
    { id: "biographyTitle", label: "My biography title would be", icon: <FaBook /> },
    { id: "obsessedWith", label: "I'm obsessed with", icon: <FaHeart /> },
    { id: "languages", label: "Languages I speak", icon: <FaLanguage /> },
    { id: "whereLive", label: "Where I live", icon: <FaHome /> }
  ];

  const travelStamps = [
    {
      id: 1,
      location: "Chennai District",
      country: "IN",
      city: "Chennai, India",
      trips: 2,
      icon: <FaBuilding />
    }
  ];

  const handleInputChange = (field, value) => {
    setProfileData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleToggleChange = (field) => {
    setProfileData(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  return (
    <>
      <Navbar />
      <div className="edit-profile-page">
        <div className="edit-profile-container">
          <div className="edit-profile-layout">
            {/* Left Side - Profile Picture */}
            <div className="profile-picture-section">
              <div className="profile-avatar">
                <img src={profileData.avatar} alt="Profile" />
              </div>
              <button className="edit-photo-button">
                <FaCamera />
                Edit
              </button>
            </div>

            {/* Right Side - Main Content */}
            <div className="edit-profile-main-content">
              <div className="profile-header">
                <h1>My profile</h1>
                <p>
                  Hosts and guests can see your profile and it may appear across Airbnb to help us build trust in our community.{" "}
                  <span className="learn-more-link">Learn more</span>
                </p>
              </div>

              {/* Profile Fields */}
              <div className="profile-fields">
                {profileFields.map((field) => (
                  <div key={field.id} className="profile-field">
                    <div className="field-icon">{field.icon}</div>
                    <span className="field-label">{field.label}</span>
                  </div>
                ))}
              </div>

              {/* About Me Section */}
              <div className="about-me-section">
                <h2>About me</h2>
                <div className="about-me-textarea">
                  <textarea
                    value={profileData.aboutMe}
                    onChange={(e) => handleInputChange('aboutMe', e.target.value)}
                    placeholder="Write something fun and punchy."
                    rows="4"
                  />
                  <span className="add-intro-link">Add intro</span>
                </div>
              </div>

              {/* Where I've been Section */}
              <div className="where-ive-been-section">
                <div className="section-header">
                  <h2>Where I've been</h2>
                  <div className="toggle-container">
                    <span className="toggle-label">Pick the stamps you want other people to see on your profile.</span>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={profileData.showWhereIveBeen}
                        onChange={() => handleToggleChange('showWhereIveBeen')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                </div>

                <div className="travel-stamps">
                  {travelStamps.map((stamp) => (
                    <div key={stamp.id} className="travel-stamp">
                      <div className="stamp-header">
                        <span className="stamp-location">{stamp.location}</span>
                        <div className="stamp-icon">{stamp.icon}</div>
                      </div>
                      <div className="stamp-country">{stamp.country}</div>
                      <div className="stamp-details">
                        <div className="stamp-city">{stamp.city}</div>
                        <div className="stamp-trips">{stamp.trips} trips</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Done Button */}
              <div className="profile-actions">
                <button className="done-button" onClick={() => navigate('/profile')}>Done</button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default EditProfilePage;
