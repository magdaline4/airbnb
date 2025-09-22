import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.scss";
import ListingCard from "../../Components/ListingCard"; 

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("/src/api/listings.json") 
      .then((res) => {
        setListings(res.data.listings || []);
      })
      .catch((err) => {
        console.error("Error fetching data:", err);
        setError(err);
      })
      .finally(() => setLoading(false));
  }, []);

  const groupedListings = Array.isArray(listings)
    ? listings.reduce((groups, item) => {
        if (!groups[item.location]) groups[item.location] = [];
        groups[item.location].push(item);
        return groups;
      }, {})
    : {};

  const sectionTitles = {
    Bengaluru: "Popular homes in Bengaluru >",
    Chennai: "Available in Puducherry this weekend >",
    Pune: "Stay in Hyderabad >",
    SouthGoa: "Available next month in South Goa >",
    Dindigul: "Homes in Dindigul >",
    Nilgiris: "Available in The Nilgiris this weekend >",
    NorthGoa: "Places to stay in North Goa >",
    Thiruvananthapuran: "Check out homes in Thiruvananthapuran >",
    Coimbatore: "Popular homes in Coimbatore >",
  };

  const scrollLeft = (id) => {
    document.getElementById(id)?.scrollBy({ left: -300, behavior: "smooth" });
  };

  const scrollRight = (id) => {
    document.getElementById(id)?.scrollBy({ left: 300, behavior: "smooth" });
  };

  if (loading) return <p>Loading listings...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <div className="listings-page">
      {Object.keys(groupedListings).map((location) => (
        <section key={location} className="listings-section">
          <div className="title-btn">
            <h2 className="section-title">
              {sectionTitles[location] || `Homes in ${location}`}
            </h2>
            <div className="btn">
              <button
                className="arrow-button left"
                onClick={() => scrollLeft(location)}
              >
                
              </button>
              <button
                className="arrow-button right"
                onClick={() => scrollRight(location)}
              >
                
              </button>
            </div>
          </div>

          <div
            className="listings-grid"
            id={location}
            style={{ display: "flex", overflowX: "auto", gap: "1rem" }}
          >
            {groupedListings[location].map((home, index) => (
              <ListingCard
                key={home.id || `${location}-${index}`}
                home={home}
              />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
};

export default HomePage;
