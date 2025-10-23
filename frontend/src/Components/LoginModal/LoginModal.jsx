import React, { useState, useEffect, useCallback } from "react";
import "./ModalStyles.scss";

// Country data with codes
const countries = [
  { code: "+91", name: "India" },
  { code: "+1", name: "United States" },
  { code: "+44", name: "United Kingdom" },
  { code: "+61", name: "Australia" },
  { code: "+33", name: "France" },
  { code: "+49", name: "Germany" },
  { code: "+81", name: "Japan" },
  { code: "+86", name: "China" },
  { code: "+55", name: "Brazil" },
  { code: "+34", name: "Spain" },
];

// SVG icons as components
const GoogleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#4285F4"
      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
    />
    <path
      fill="#34A853"
      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
    />
    <path
      fill="#FBBC05"
      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
    />
    <path
      fill="#EA4335"
      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
    />
  </svg>
);

const AppleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#000000"
      d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"
    />
  </svg>
);

const EmailIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#000000"
      d="M20 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"
    />
  </svg>
);

const FacebookIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24">
    <path
      fill="#1877F2"
      d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"
    />
  </svg>
);

// Close Icon Component
const CloseIcon = () => (
  <svg
    className="close-button-svg"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="presentation"
    focusable="false"
  >
    <path d="m6 6 20 20" stroke="currentColor" strokeWidth="3"></path>
    <path d="m26 6-20 20" stroke="currentColor" strokeWidth="3"></path>
  </svg>
);

// Dropdown Arrow Component
const DropdownArrow = () => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 32 32"
    xmlns="http://www.w3.org/2000/svg"
    aria-hidden="true"
    role="presentation"
    focusable="false"
    style={{
      display: "block",
      fill: "none",
      stroke: "currentColor",
      strokeWidth: 4,
      overflow: "visible",
    }}
  >
    <path fill="none" d="M28 12 16.7 23.3a1 1 0 0 1-1.4 0L4 12"></path>
  </svg>
);

// SocialButton component
const SocialButton = ({ text, className, onClick, icon }) => {
  return (
    <button className={`social-button ${className}`} onClick={onClick}>
      {icon}
      <span>{text}</span>
    </button>
  );
};

function LoginModal({ isOpen, onClose }) {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [phoneInputValue, setPhoneInputValue] = useState("");
  const [isPhoneFocused, setIsPhoneFocused] = useState(false);
  // Handle escape key press
  const handleEscape = useCallback(
    (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    },
    [onClose]
  );

  // Handle body scroll and event listeners
  useEffect(() => {
    if (isOpen) {
      document.addEventListener("keydown", handleEscape);
      document.body.style.overflow = "hidden";
    } else {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    }

    return () => {
      document.removeEventListener("keydown", handleEscape);
      document.body.style.overflow = "unset";
    };
  }, [isOpen, handleEscape]);

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    const fullPhoneNumber = `${selectedCountry.code}${phoneInputValue}`;
    console.log("Phone number:", fullPhoneNumber);
    // Add your login logic here
  };

  // Prevent modal close when clicking inside content
  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  // Handle phone input change
  const handlePhoneInputChange = (e) => {
    let value = e.target.value;

    // Always start with the selected country code
    if (!value.startsWith(selectedCountry.code)) {
      value = selectedCountry.code + " " + value.replace(/\D/g, "");
    }

    // Extract digits after the country code
    const digits = value.replace(selectedCountry.code, "").replace(/\D/g, "");
    setPhoneInputValue(digits);
  };

  // Handle focus and blur
  const handlePhoneInputFocus = () => {
    // If empty, show country code only
    if (!phoneInputValue) {
      setPhoneInputValue("");
    }
    setIsPhoneFocused(true);
  };

  const handlePhoneInputBlur = () => {
    setIsPhoneFocused(false);
  };

  const handleCountrySelect = (e) => {
    const selectedCode = e.target.value;
    const country =
      countries.find((c) => c.code === selectedCode) || countries[0];

    setSelectedCountry(country);
    setPhoneInputValue("");
    document.getElementById("phone-input")?.focus(); // optional usability enhancement
  };

  // Display value in input
  const displayPhoneValue = `${selectedCountry.code}${
    phoneInputValue ? " " + phoneInputValue : ""
  }`;

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleContentClick}>
        {/* Header */}
        <div className="modal-header">
          <button className="close-button" onClick={onClose} aria-label="Close">
            <CloseIcon />
          </button>
          <div className="modal-title">Log in or sign up</div>

          <div className="line-separator"></div>
        </div>

        {/* Body */}
        <div className="modal-body">
          <h2 className="welcome-title">Welcome to Airbnb</h2>

          <form onSubmit={handleSubmit}>
            {/* Country/Region - Select input */}
            <div className="input-group">
              <div className="select-wrapper">
                {/*<label htmlFor="country-select" className="input-label">
                  Country/Region
                </label>*/}
                <select
                  id="country-select"
                  value={selectedCountry.code}
                  onChange={handleCountrySelect}
                  className="country-select"
                  required
                >
                  {countries.map((country) => (
                    <option key={country.code} value={country.code}>
                      {country.name} ({country.code})
                    </option>
                  ))}
                </select>
                <span className="select-arrow">
                  <DropdownArrow />
                </span>
              </div>
            </div>

            {/* Phone Number */}
            <div className="input-group">
              {/*<label htmlFor="phone-input" className="input-label">
                Phone number
              </label>*/}
              <input
                id="phone-input"
                type="tel"
                value={displayPhoneValue}
                onChange={handlePhoneInputChange}
                onFocus={handlePhoneInputFocus}
                onBlur={handlePhoneInputBlur}
                placeholder="Phone number"
                className="phone-input"
                required
              />
            </div>

            {/* Privacy Text */}
            <p className="privacy-text">
              We'll call or text you to confirm your number. Standard message
              and data rates apply.
              <br />
              <a href="#" className="privacy-link">
                Privacy Policy
              </a>
            </p>

            <button type="submit" className="continue-button">
              Continue
            </button>
          </form>

          {/* OR Divider */}
          <div className="or-divider">
            <span>or</span>
          </div>

          {/* Social Login Buttons */}
          <div className="social-buttons-container">
            <SocialButton
              text="Continue with Google"
              className="google-button"
              icon={<GoogleIcon />}
              onClick={() => console.log("Google login clicked")}
            />
            <SocialButton
              text="Continue with Apple"
              className="apple-button"
              icon={<AppleIcon />}
              onClick={() => console.log("Apple login clicked")}
            />
            <SocialButton
              text="Continue with email"
              className="email-button"
              icon={<EmailIcon />}
              onClick={() => console.log("Email login clicked")}
            />
            <SocialButton
              text="Continue with Facebook"
              className="facebook-button"
              icon={<FacebookIcon />}
              onClick={() => console.log("Facebook login clicked")}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
