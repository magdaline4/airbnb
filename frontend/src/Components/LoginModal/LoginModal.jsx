import React, { useEffect, useCallback } from 'react';
// Assuming you'll use a single CSS file for modal styles, adjust the path as needed
import './ModalStyles.css'; 

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

// Reusable component for the social buttons
const SocialButton = ({ icon, text, className, onClick }) => (
    <button className="social-button" onClick={onClick}>
        <span className={`social-icon ${className}`}>{icon}</span>
        {text}
    </button>
);


function LoginModal({ isOpen, onClose }) {
    // Memoized callback for handling the Escape key press
    const handleEscape = useCallback((event) => {
        if (event.key === 'Escape') {
            onClose();
        }
    }, [onClose]);

    // Effect to add/remove the Escape key listener and body scroll lock
    useEffect(() => {
        if (isOpen) {
            document.addEventListener('keydown', handleEscape);
            document.body.style.overflow = 'hidden'; // Lock background scroll
        } else {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset'; // Restore background scroll
        }
        
        // Cleanup function
        return () => {
            document.removeEventListener('keydown', handleEscape);
            document.body.style.overflow = 'unset'; 
        };
    }, [isOpen, handleEscape]);

    if (!isOpen) {
        return null; // Don't render anything if the modal is closed
    }

    // Prevents the modal from closing when clicking inside the content box
    const handleContentClick = (e) => {
        e.stopPropagation();
    };

    return (
        // The overlay element, handles closing when clicking outside
        <div className="modal-overlay" onClick={onClose}>
            {/* The modal content box */}
            <div 
                className="modal-content" 
                onClick={handleContentClick}
            >
                {/* Modal Header */}
                <div className="modal-header">
                    <button className="close-button" onClick={onClose} aria-label="Close dialog">
                        <CloseIcon />
                    </button>
                    <div className="modal-title">Log in or sign up</div>
                </div>

                {/* Modal Body (Form content) */}
                <div className="modal-body">
                    <h2>Welcome to Airbnb</h2>

                    {/* Country/Region Input */}
                    <div className="input-group country-region-group">
                        <label htmlFor="country">Country/Region</label>
                        <select id="country" defaultValue="IN">
                            <option value="IN">India (+91)</option>
                            <option value="US">United States (+1)</option>
                        </select>
                    </div>

                    {/* Phone Number Input */}
                    <div className="input-group">
                        <label htmlFor="phone">Phone number</label>
                        <input type="tel" id="phone" placeholder="" />
                    </div>

                    {/* Privacy Text */}
                    <p className="privacy-text">
                        We'll call or text you to confirm your number. Standard message and data rates apply.
                        <a href="#">Privacy Policy</a>
                    </p>

                    {/* Continue Button */}
                    <button className="continue-button">Continue</button>

                    {/* OR Divider */}
                    <div className="or-divider">or</div>

                    {/* Social/Other Login Buttons */}
                    <SocialButton icon="G" text="Continue with Google" className="google-icon" onClick={() => console.log('Google login clicked')} />
                    <SocialButton icon="" text="Continue with Apple" className="apple-icon" onClick={() => console.log('Apple login clicked')} />
                    <SocialButton icon="✉" text="Continue with email" className="email-icon" onClick={() => console.log('Email login clicked')} />
                </div>
            </div>
        </div>
    );
}

export default LoginModal;