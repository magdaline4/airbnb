import React, { useState, useEffect } from "react";
import RoomCard from "../../Components/RoomCard";
import Pagination from "../../Components/Pagination";
import "../Room/Room.scss";
import axios from "axios";
import { MdFilterList } from "react-icons/md";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import FiltersModal from "../../Components/FiltersModal";  // ✅ import modal

const RoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [isFilterOpen, setIsFilterOpen] = useState(false); // ✅ state
  const roomsPerPage = 9;

  useEffect(() => {
    axios

      .get("http://localhost:5000/api/rooms")
      .then((res) => setRooms(res.data.rooms))
      .catch((err) => console.error("Error fetching rooms:", err));
  }, []);

  // Pagination logic
  const totalPages = Math.ceil(rooms.length / roomsPerPage);
  const startIndex = (currentPage - 1) * roomsPerPage;
  const currentRooms = rooms.slice(startIndex, startIndex + roomsPerPage);

  return (
    <>
      <Navbar />

      {/* ✅ Filter Button */}
      <button className="filter-btn" onClick={() => setIsFilterOpen(true)}>
        <MdFilterList /> Filters
      </button>

      <div className="room-page">
        <div className="room-list">
          {/* Header */}
          <div className="room-header">
            <p>Over 1,000 homes</p>
            <div className="fees-info">
              <span className="tag-icon">🏷️</span>
              <span>Prices include all fees</span>
            </div>
          </div>

          {/* Cards */}
          <div className="room-grid">
            {currentRooms.map((room) => (
              <RoomCard key={room.id} room={room} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>

        <div className="room-map">
          <MapContainer
            center={[13.0827, 80.2707]}
            zoom={11}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {currentRooms.map((room) => (
              <Marker
                key={room._idin}
                position={[13.0827, 80.2707]}
                
              >
                <Popup>₹{room.price.toLocaleString()}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <Footer />

      {/*  Filters Popup */}
      <FiltersModal isOpen={isFilterOpen} onClose={() => setIsFilterOpen(false)} />
    </>
  );
};

export default RoomPage;
