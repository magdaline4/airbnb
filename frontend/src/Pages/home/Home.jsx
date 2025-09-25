import React, { useEffect, useState } from "react";
import axios from "axios";
import "./Home.scss";
import ListingCard from "../../Components/ListingCard";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

const ITEMS_PER_PAGE = 7;

const HomePage = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pageIndexes, setPageIndexes] = useState({}); // tracks current page per location

  useEffect(() => {
    axios
      .get("http://localhost:5000/api/listings")
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

  const changePage = (location, direction) => {
    setPageIndexes((prev) => {
      const currentPage = prev[location] || 0;
      const total = Math.ceil((groupedListings[location]?.length || 0) / ITEMS_PER_PAGE);
      const nextPage = currentPage + direction;

      if (nextPage < 0 || nextPage >= total) return prev;

      return {
        ...prev,
        [location]: nextPage,
      };
    });
  };

  if (loading) return <p>Loading listings...</p>;
  if (error) return <p>Error: {error.message}</p>;

  return (
    <>
      <Navbar />
      <div className="listings-page">
        {Object.keys(groupedListings).map((location) => {
          const allListings = groupedListings[location];
          const currentPage = pageIndexes[location] || 0;
          const start = currentPage * ITEMS_PER_PAGE;
          const visibleListings = allListings.slice(start, start + ITEMS_PER_PAGE);
          const totalPages = Math.ceil(allListings.length / ITEMS_PER_PAGE);

          return (
            <section key={location} className="listings-section">
              <div className="title-btn">
                <h2 className="section-title">
                  {sectionTitles[location] || `Homes in ${location}`}
                </h2>
                <div className="btn">
                  <button
                    className="arrow-button left"
                    onClick={() => changePage(location, -1)}
                    disabled={currentPage === 0}
                  />
                  <button
                    className="arrow-button right"
                    onClick={() => changePage(location, 1)}
                    disabled={currentPage === totalPages - 1}
                  />
                </div>
              </div>

              <div className="listings-grid">
                {visibleListings.map((home, index) => (
                  <ListingCard
                    key={home.id || `${location}-${index}`}
                    home={home}
                    className="listing-card"
                  />
                ))}
              </div>
            </section>
          );
        })}
      </div>
      <Footer />
    </>
  );
};

export default HomePage;
