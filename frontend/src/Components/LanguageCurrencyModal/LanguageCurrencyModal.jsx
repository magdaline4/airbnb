import React, { useState } from "react";
import "./LanguageCurrencyModal.css"; // Import the corresponding CSS file

// Mock Data based on the screenshot and Airbnb's structure
const suggestedLanguages = [
  { lang: "English", region: "United Kingdom" },
  { lang: "English", region: "United States" },
  { lang: "हिंदी", region: "भारत" },
  { lang: "ಕನ್ನಡ", region: "ಭಾರತ" },
  { lang: "मराठी", region: "भारत" },
];

const allLanguagesAndRegions = [
  { lang: "English", region: "India" },
  { lang: "Azərbaycan dili", region: "Azərbaycan" },
  { lang: "Bahasa Indonesia", region: "Indonesia" },
  { lang: "Bosanski", region: "Bosna i Hercegovina" },
  { lang: "Català", region: "Espanya" },
  { lang: "Čeština", region: "Česká republika" },
  { lang: "Crnogorski", region: "Crna Gora" },
  { lang: "Dansk", region: "Danmark" },
  { lang: "Deutsch", region: "Deutschland" },
  { lang: "Deutsch", region: "Österreich" },
  // ... more
];

const mockCurrencies = [
  "INR - Indian Rupee",
  "USD - US Dollar",
  "EUR - Euro",
  "GBP - Pound Sterling",
];

const LanguageCurrencyModal = ({ isVisible, onClose }) => {
  const [activeTab, setActiveTab] = useState("Language and region");
  const [isTranslationOn, setIsTranslationOn] = useState(true);
  const [selectedLanguage, setSelectedLanguage] = useState({
    lang: "English",
    region: "India",
  });
  const [selectedCurrency, setSelectedCurrency] =
    useState("INR - Indian Rupee");

  if (!isVisible) return null;

  const handleLanguageSelect = (langRegion) => {
    setSelectedLanguage(langRegion);
    // In a real application, you'd likely update the user context/settings here
  };

  const handleCurrencySelect = (currency) => {
    setSelectedCurrency(currency);
    // In a real application, you'd likely update the user context/settings here
  };

  const renderLanguageAndRegionTab = () => (
    <>
      <div className="modal-section translation-toggle-container">
        <div className="translation-info">
          <p className="translation-title">Translation 🔠</p>
          <p className="translation-desc">
            Automatically translate descriptions and reviews to English.
          </p>
        </div>
        <label className="switch">
          <input
            type="checkbox"
            checked={isTranslationOn}
            onChange={() => setIsTranslationOn(!isTranslationOn)}
          />
          <span className="slider round"></span>
        </label>
      </div>

      <div className="modal-section">
        <h3>Suggested languages and regions</h3>
        <div className="grid-container">
          {suggestedLanguages.map((item, index) => (
            <button
              key={index}
              className={`grid-item ${
                item.lang === selectedLanguage.lang &&
                item.region === selectedLanguage.region
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleLanguageSelect(item)}
            >
              <div className="lang">{item.lang}</div>
              <div className="region">{item.region}</div>
            </button>
          ))}
        </div>
      </div>

      <div className="modal-section">
        <h3>Choose a language and region</h3>
        <div className="grid-container">
          {allLanguagesAndRegions.map((item, index) => (
            <button
              key={index}
              className={`grid-item ${
                item.lang === selectedLanguage.lang &&
                item.region === selectedLanguage.region
                  ? "selected"
                  : ""
              }`}
              onClick={() => handleLanguageSelect(item)}
            >
              <div className="lang">{item.lang}</div>
              <div className="region">{item.region}</div>
            </button>
          ))}
        </div>
      </div>
    </>
  );

  const renderCurrencyTab = () => (
    <div className="modal-section">
      <h3>Choose a currency</h3>
      <div className="grid-container">
        {mockCurrencies.map((currency) => (
          <button
            key={currency}
            className={`grid-item currency-item ${
              currency === selectedCurrency ? "selected" : ""
            }`}
            onClick={() => handleCurrencySelect(currency)}
          >
            {currency}
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <button className="close-button" onClick={onClose}>
          &times;
        </button>

        <div className="modal-tabs">
          <button
            className={activeTab === "Language and region" ? "active" : ""}
            onClick={() => setActiveTab("Language and region")}
          >
            Language and region
          </button>
          <button
            className={activeTab === "Currency" ? "active" : ""}
            onClick={() => setActiveTab("Currency")}
          >
            Currency
          </button>
        </div>
        <hr className="tab-separator" />

        <div className="modal-body">
          {activeTab === "Language and region"
            ? renderLanguageAndRegionTab()
            : renderCurrencyTab()}
        </div>
      </div>
    </div>
  );
};

export default LanguageCurrencyModal;