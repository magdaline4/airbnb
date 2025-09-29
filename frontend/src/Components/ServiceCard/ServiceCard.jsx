import React from "react";
import { CiHeart } from "react-icons/ci";
import "../../Pages/services/Service.scss";


const ServiceCard = ({ service }) => {
  return (
    <div className="service-card">
      <div className="image-wrapper">
        <img src={service.image} alt={service.title} />
        <span className="favorite">
          <CiHeart />
        </span>
      </div>
      <div className="card-info">
        <h4>{service.title}</h4>
        <p>{service.subtitle}</p>
        <span className="price">{service.price}</span>
      </div>
    </div>
  );
};

export default ServiceCard;
