import React, { useState, useEffect, useCallback ,useRef} from "react";
// import "./ModalStyles.scss";
import"./ModalStyles.css"
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
    <path d="m6 6 20 20"></path>
    <path d="m26 6-20 20"></path>
  </svg>
);

// Back arrow SVG for the phone confirmation modal
const BackArrowIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
    <path
      d="M15 18L9 12L15 6"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

// Reusable component for the social buttons
const SocialButton = ({ icon, text, className, onClick }) => (
  <button className="social-button" onClick={onClick}>
    <span className={`social-icon ${className}`}>{icon}</span>
    {text}
  </button>
);

function LoginModal({ isOpen, onClose }) {
  const [showPhoneConfirm, setShowPhoneConfirm] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [verificationCode, setVerificationCode] = useState([
    "",
    "",
    "",
    "",
    "",
    "",
  ]);
  const inputRefs = useRef([]);

  // Reset states when modal closes
  useEffect(() => {
    if (!isOpen) {
      setShowPhoneConfirm(false);
      setPhoneNumber("");
      setVerificationCode(["", "", "", "", "", ""]);
    }
  }, [isOpen]);

  // Memoized callback for handling the Escape key press
  const handleEscape = useCallback(
    (event) => {
      if (event.key === "Escape") {
        if (showPhoneConfirm) {
          setShowPhoneConfirm(false);
        } else {
          onClose();
        }
      }
    },
    [onClose, showPhoneConfirm]
  );

  // Effect to add/remove the Escape key listener and body scroll lock
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

  // Effect to focus first input when phone confirmation modal opens
  useEffect(() => {
    if (showPhoneConfirm && inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, [showPhoneConfirm]);

  // Phone confirmation modal handlers
  const handleInputChange = (index, value) => {
    if (value.length > 1) {
      value = value[0];
    }

    if (!/^\d*$/.test(value)) {
      return;
    }

    const newCode = [...verificationCode];
    newCode[index] = value;
    setVerificationCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && !verificationCode[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").slice(0, 6).split("");
    const newCode = [...verificationCode];

    pastedData.forEach((char, index) => {
      if (/^\d$/.test(char) && index < 6) {
        newCode[index] = char;
      }
    });

    setVerificationCode(newCode);
    const lastFilledIndex = Math.min(pastedData.length, 5);
    inputRefs.current[lastFilledIndex]?.focus();
  };

  const handlePhoneContinue = () => {
    // Validate phone number and show confirmation modal
    if (phoneNumber.trim()) {
      setShowPhoneConfirm(true);
    }
  };

  const handleVerificationContinue = () => {
    const fullCode = verificationCode.join("");
    if (fullCode.length === 6) {
      console.log("Verification code:", fullCode);
      // Handle verification logic here
      // On successful verification, close both modals
      onClose();
      setShowPhoneConfirm(false);
    }
  };

  const handleBackToLogin = () => {
    setShowPhoneConfirm(false);
  };

  const isCodeComplete = verificationCode.every((digit) => digit !== "");

  if (!isOpen) {
    return null;
  }

  const handleContentClick = (e) => {
    e.stopPropagation();
  };

  // Render Phone Confirmation Modal
  if (showPhoneConfirm) {
    return (
      <div className="phone-confirm-overlay" onClick={onClose}>
        <div className="phone-confirm-content" onClick={handleContentClick}>
          <div className="phone-confirm-header">
            <button
              className="phone-confirm-back"
              onClick={handleBackToLogin}
              aria-label="Go back"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 32 32"
                aria-hidden="true"
                role="presentation"
                focusable="false"
                style={{
                  display: "block",
                  fill: "none",
                  height: "16px",
                  width: "16px",
                  stroke: "currentcolor",
                  strokeWidth: "3",
                  overflow: "visible",
                }}

                // style="display: block; fill: none; height: 16px; width: 16px; stroke: currentcolor; stroke-width: 3; overflow: visible;"
              >
                <g fill="none">
                  <path d="M4 16h26M15 28 3.7 16.7a1 1 0 0 1 0-1.4L15 4"></path>
                </g>
              </svg>
            </button>
            <div class="phone-confirm-title">Confirm your number</div>
          </div>

          <div class="phone-confirm-body">
            <p class="phone-confirm-instruction">
              Enter the code we've sent via SMS to +91 {phoneNumber}:
            </p>

            <div className="phone-confirm-code-container" onPaste={handlePaste}>
              {verificationCode.map((digit, index) => (
                <input
                  className="phone-confirm-input"
                  key={index}
                  ref={(el) => (inputRefs.current[index] = el)}
                  type="text"
                  inputMode="numeric"
                  placeholder="-"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleInputChange(index, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(index, e)}
                />
              ))}
            </div>
          </div>
          <div class="phone-confirm-actions">
            <button
              className="phone-confirm-option"
              onClick={handleBackToLogin}
            >
              Choose a different option
            </button>
            <button
              className={`phone-confirm-continue ${
                !isCodeComplete ? "disabled" : ""
              }`}
              onClick={handleVerificationContinue}
              disabled={!isCodeComplete}
            >
              Continue
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Render Main Login Modal
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={handleContentClick}>
        <div className="modal-header">
          <button
            className="close-button"
            onClick={onClose}
            aria-label="Close dialog"
          >
            <CloseIcon />
          </button>
          <div className="modal-title">Log in or sign up</div>
        </div>

        <div className="modal-body">
          <h2>Welcome to Airbnb</h2>

          <div className="input-group country-region-group">
            <label htmlFor="country">Country/Region</label>
            <select id="country" defaultValue="IN">
              <option value="IN">India (+91)</option>
              <option value="US">United States (+1)</option>
            </select>
          </div>

          <div className="input-group">
            <label htmlFor="phone">Phone number</label>
            <input
              type="tel"
              id="phone"
              placeholder="Enter your phone number"
              value={phoneNumber}
              onChange={(e) => setPhoneNumber(e.target.value)}
            />
          </div>

          <p className="privacy-text">
            We'll call or text you to confirm your number. Standard message and
            data rates apply.
            <a href="#">Privacy Policy</a>
          </p>

          {/* Continue Button - This triggers the phone confirmation modal */}
          <button
            className="continue-button"
            onClick={handlePhoneContinue}
            disabled={!phoneNumber.trim()}
          >
            Continue
          </button>

          <div className="or-divider">or</div>

          <SocialButton
            icon="G"
            text="Continue with Google"
            className="google-icon"
            onClick={() => console.log("Google login clicked")}
          />
          <SocialButton
            icon=""
            text="Continue with Apple"
            className="apple-icon"
            onClick={() => console.log("Apple login clicked")}
          />
          <SocialButton
            icon="✉"
            text="Continue with email"
            className="email-icon"
            onClick={() => console.log("Email login clicked")}
          />
        </div>
      </div>
    </div>
  );
}

export default LoginModal;
