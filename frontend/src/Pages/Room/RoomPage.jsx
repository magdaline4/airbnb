import React, { useState, useEffect } from "react";
import RoomCard from "../../Components/RoomCard/RoomCard";
import Pagination from "../../Components/Pagination/Pagination";
import "./Room.scss";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";

const RoomPage = () => {
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const roomsPerPage = 9;

const API_URL = import.meta.env.VITE_API_URL;


  useEffect(() => {
    axios
      .get(`${API_URL}/api/rooms?page=${currentPage}&limit=${roomsPerPage}`)
      .then((res) => {
        setRooms(res.data.rooms);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error("Error fetching rooms:", err));
  }, [currentPage]);

  return (
    <>
      <Navbar />

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
            {rooms.map((room) => (
              <RoomCard key={room._id} room={room} />
            ))}
          </div>

          {/* Pagination */}
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            onPageChange={(page) => setCurrentPage(page)}
          />
        </div>

        {/* Map */}
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
            {rooms.map((room) => (
              <Marker key={room._id} position={[room.location.lat, room.location.lng]}>
                <Popup>₹{room.price.toLocaleString()}</Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RoomPage;