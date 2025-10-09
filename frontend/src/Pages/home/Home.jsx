import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchListings, changePage } from "../../features/listingsSlice";
import ListingCard from "../../Components/ListingCard/ListingCard";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import "./Home.scss";

const ITEMS_PER_PAGE = 7;

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

const HomePage = () => {
  const dispatch = useDispatch();
  const { listings, loading, error, pageIndexes } = useSelector(
    (state) => state.listings
  );

  useEffect(() => {
    dispatch(fetchListings());
  }, [dispatch]);

  if (loading) return <p>Loading listings...</p>;
  if (error) return <p>Error: {error}</p>;

  const groupedListings = listings.reduce((groups, item) => {
    if (!groups[item.location]) groups[item.location] = [];
    groups[item.location].push(item);
    return groups;
  }, {});

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
                    onClick={() =>
                      dispatch(
                        changePage({ location, direction: -1, itemsPerPage: ITEMS_PER_PAGE })
                      )
                    }
                    disabled={currentPage === 0}
                  />
                  <button
                    className="arrow-button right"
                    onClick={() =>
                      dispatch(
                        changePage({ location, direction: 1, itemsPerPage: ITEMS_PER_PAGE })
                      )
                    }
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
