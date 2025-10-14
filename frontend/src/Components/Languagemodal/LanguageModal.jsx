import React from "react";
import "./LanguageModal.css";
import i18n from "../../i18n/i18n";

const languages = [
  { code: "en", name: "English" },
  { code: "hi", name: "हिन्दी (Hindi)" },
  { code: "ta", name: "தமிழ் (Tamil)" },
  { code: "kn", name: "ಕನ್ನಡ (Kannada)" },
  { code: "mr", name: "मराठी (Marathi)" },
];

export default function LanguageModal({ onClose }) {
  const changeLanguage = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem("language", code);
    onClose(); // close modal
  };

  return (
    <div className="language-modal">
      <div className="language-modal-content">
        <h2>Choose a language</h2>
        <ul>
          {languages.map((lang) => (
            <li key={lang.code} onClick={() => changeLanguage(lang.code)}>
              {lang.name}
            </li>
          ))}
        </ul>
        <button onClick={onClose}>Close</button>
      </div>
    </div>
  );
}
