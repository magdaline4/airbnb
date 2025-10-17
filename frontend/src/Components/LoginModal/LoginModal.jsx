import React, { useEffect, useCallback, useState, useRef } from "react";
import "./ModalStyles.css";

// Reusable SVG for the close button
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
