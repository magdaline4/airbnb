import React, { useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { fetchRooms, setPage } from "../../features/roomsSlice";
import RoomCard from "../../Components/RoomCard/RoomCard";
import Pagination from "../../Components/Pagination/Pagination";
import Navbar from "../../Components/Navbar/Navbar";
import Footer from "../../Components/Footer/Footer";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import "./Room.scss";

const RoomPage = () => {
  const dispatch = useDispatch();

  const filters = useSelector((state) => state.filters);
  const { rooms, totalPages, totalRooms, currentPage, loading } = useSelector(
    (state) => state.rooms
  );

  const roomsPerPage = 9;

  useEffect(() => {
    dispatch(fetchRooms({ filters, currentPage, roomsPerPage }));
  }, [dispatch, filters, currentPage]);

  return (
    <>
      <Navbar />
      <div className="room-page">
        <div className="room-list">
          <div className="room-header">
            <p>
              {loading
                ? "Loading..."
                : totalRooms > 0
                ? `Over ${totalRooms} homes${
                    filters.amenities?.length ? " matching your filters" : ""
                  }`
                : "No homes found"}
            </p>
            <div className="fees-info">
              <span className="tag-icon">🏷️</span>
              <span>Prices include all fees</span>
            </div>
          </div>

          {loading ? (
            <div className="loading-state">
              <p>Loading rooms...</p>
            </div>
          ) : (
            <>
              <div className="room-grid">
                {rooms.length > 0 ? (
                  rooms.map((room) => <RoomCard key={room._id} room={room} />)
                ) : (
                  <div className="no-rooms-found">
                    <h3>No rooms found</h3>
                    <p>Try adjusting your filters to see more results</p>
                  </div>
                )}
              </div>

              {rooms.length > 0 && totalPages > 1 && (
                <Pagination
                  currentPage={currentPage}
                  totalPages={totalPages}
                  onPageChange={(page) => dispatch(setPage(page))}
                />
              )}
            </>
          )}
        </div>

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
      
       <Footer/>
    </>
  );
};

export default RoomPage;
