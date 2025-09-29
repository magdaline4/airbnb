import React from "react";
import "../../Pages/home/Home.scss";
import { CiHeart } from "react-icons/ci";

const ListingCard = ({ home }) => {
  return (
    <div className="listing-card">
      {/* Badge */}
      <div className="card-overlay">
        <span className="badge">Guest favourite</span>
        
                  <CiHeart className="heart-icon" />
               
      </div>

      <img
        src={home.image || "https://via.placeholder.com/400x250"}
        alt={home.title || "Listing"}
      />

      <div className="listing-info">
        <h3>{home.title || "Untitled Home"}</h3>
        <p className="price">
          ₹{home.price.toLocaleString()} for {home.nights} nights
          ★ {home.rating}
        </p>
        
      </div>
    </div>
  );
};

export default ListingCard;
