import React, { useState, useEffect, useContext } from "react";
import RoomCard from "../../Components/RoomCard/RoomCard";
import Pagination from "../../Components/Pagination/Pagination";
import "./Room.scss";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { FiltersContext } from "../../Components/Context/FiltersContext.jsx";

const RoomPage = () => {
  const { filters } = useContext(FiltersContext);
  const [rooms, setRooms] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [totalRooms, setTotalRooms] = useState(0);
  const roomsPerPage = 9;

  // Use your deployed backend URL directly
const API_URL = import.meta.env.VITE_API_URL;

  // Fetch rooms whenever filters or page change
  useEffect(() => {
    const fetchRooms = async () => {
      setLoading(true);
      try {
        console.log("Fetching with filters:", filters);
        
        const params = new URLSearchParams({
          page: currentPage,
          limit: roomsPerPage,
        });

        // Always send all filters, let backend handle defaults
        params.append('minPrice', filters?.minPrice || 0);
        params.append('maxPrice', filters?.maxPrice || 50000);
        params.append('bedrooms', filters?.bedrooms || 1);
        params.append('beds', filters?.beds || 1);
        params.append('bathrooms', filters?.bathrooms || 1);
        
        if (filters?.amenities?.length > 0) {
          params.append('amenities', filters.amenities.join(","));
        }

        console.log("API URL:", `${API_URL}/api/rooms?${params.toString()}`);

        const res = await axios.get(`${API_URL}/api/rooms?${params.toString()}`);
        console.log("API Response:", res.data);
        
        // FIX: Use the correct field names from your backend response
        setRooms(res.data.rooms || []);
        setTotalPages(res.data.totalPages || 1);
        
        // Your backend returns 'totalRooms' not 'total'
        setTotalRooms(res.data.totalRooms || res.data.total || 0);
        
      } catch (err) {
        console.error("Error fetching rooms:", err);
        setRooms([]);
        setTotalPages(1);
        setTotalRooms(0);
      } finally {
        setLoading(false);
      }
    };

    fetchRooms();
  }, [filters, currentPage]);

  // Reset to first page if filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [filters]);


  // In your fetchRooms function - add more detailed logging
const fetchRooms = async () => {
  setLoading(true);
  try {
    console.log("=== FRONTEND FILTERS ===");
    console.log("Current filters:", filters);
    
    const params = new URLSearchParams({
      page: currentPage,
      limit: roomsPerPage,
    });

    // Send all filters
    params.append('minPrice', filters?.minPrice || 0);
    params.append('maxPrice', filters?.maxPrice || 50000);
    params.append('bedrooms', filters?.bedrooms || 1);
    params.append('beds', filters?.beds || 1);
    params.append('bathrooms', filters?.bathrooms || 1);
    
    if (filters?.amenities?.length > 0) {
      params.append('amenities', filters.amenities.join(","));
      console.log("Sending amenities:", filters.amenities);
    }

    const apiUrl = `${API_URL}/api/rooms?${params.toString()}`;
    console.log("Full API URL:", apiUrl);

    const res = await axios.get(apiUrl);
    console.log("=== BACKEND RESPONSE ===");
    console.log("Total rooms matching:", res.data.total);
    console.log("Rooms returned:", res.data.count);
    console.log("All rooms:", res.data.rooms?.map(r => ({
      id: r._id,
      title: r.title, 
      price: r.price,
      amenities: r.amenities
    })));
    
    setRooms(res.data.rooms || []);
    setTotalPages(res.data.totalPages || 1);
    setTotalRooms(res.data.total || 0);
    
  } catch (err) {
    console.error("Error fetching rooms:", err);
    setRooms([]);
    setTotalPages(1);
    setTotalRooms(0);
  } finally {
    setLoading(false);
  }
};

  return (
    <>
      <Navbar />

      <div className="room-page">
    
        <div className="room-list">
          {/* Header - FIXED: Now shows correct total count */}
          <div className="room-header">
            <p>
              {loading 
                ? "Loading..." 
                : totalRooms > 0 
                  ? `Over ${totalRooms} homes${filters.amenities?.length ? ' matching your filters' : ''}`
                  : "No homes found"
              }
            </p>
            <div className="fees-info">
              <span className="tag-icon">🏷️</span>
              <span>Prices include all fees</span>
            </div>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="loading-state">
              <p>Loading rooms...</p>
            </div>
          )}

          {/* Room Cards */}
          {!loading && (
            <>
              <div className="room-grid">
                {rooms.length > 0 ? (
                  rooms.map((room) => (
                    <RoomCard key={room._id} room={room} />
                  ))
                ) : (
                  <div className="no-rooms-found">
                    <h3>No rooms found</h3>
                    <p>Try adjusting your filters to see more results</p>
                  </div>
                )}
              </div>

              {/* Pagination */}
              {rooms.length > 0 && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => setCurrentPage(page)}
                />
              )}
            </>
          )}
        </div>

        {/* Map */}
        <div className="room-map">
          <MapContainer
            center={[13.0827, 80.2707]}
            zoom={8}
            scrollWheelZoom={false}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            />
            
            {rooms.map(
              (room) =>
                room.location && (
                  <Marker
                    key={room._id}
                    position={[room.location.lat, room.location.lng]}
                  >
                    <Popup>
                      <div>
                        <strong>₹{room.price?.toLocaleString()}</strong>
                        <br />
                        {room.title}
                      </div>
                    </Popup>
                  </Marker>
                )
            )}
          </MapContainer>
        </div>
      </div>

      <Footer />
    </>
  );
};

export default RoomPage;
