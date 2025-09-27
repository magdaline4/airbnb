import React, { useEffect, useState } from "react";
import axios from "axios";
import ServiceCard from "../../Components/ServiceCard/ServiceCard";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import "./Service.scss";

const ServicePage = () => {
  const [services, setServices] = useState({}); // Grouped by category
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/public/api/services.json") // your JSON endpoint or local file in public folder
      .then((res) => {
        setServices(res.data); // { chefs: [], training: [], massage: [] }
        setLoading(false);
      })
      .catch((err) => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <p>Loading services...</p>;
  if (error) return <p>Error: {error}</p>;

  return (
    <>
      <Navbar />
      
      <div className="service-page">
        {Object.keys(services).map((category) => (
          <div className="category-section" key={category}>
            <h2>{category.charAt(0).toUpperCase() + category.slice(1)}</h2>
            <div className="cards-wrapper">
              {services[category].map((service) => (
                <ServiceCard key={service.id} service={service} />
              ))}
            </div>
          </div>
        ))}
      </div>
      
      <Footer />
    </>
  );
};

export default ServicePage;