import "../Pages/Room/Room.scss";
import { FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { PiTrophyBold } from "react-icons/pi";

const RoomCard = ({ room }) => {
  return (
    <div className="room-card">
      <div className="room-image">
        <img src={room.image} alt={room.title} />

        {/* Top-left label */}
        <div className="label">
          <PiTrophyBold className="icon" />
          Guest favourite
        </div>

        {/* Top-right heart */}
        <button className="heart-btn">
          <FaHeart />
        </button>

        {/* Arrows */}
        <button className="arrow left">
          <FaChevronLeft />
        </button>
        <button className="arrow right">
          <FaChevronRight />
        </button>
      </div>

      <div className="room-info">
        <h3>{room.title}  ★ {room.rating}</h3>
        <p>Stay with {room.host}</p>
        <p> ({room.reviews})</p>
        <p className="price">₹{room.price.toLocaleString()} for 5 nights</p>
      </div>
    </div>
  );
};

export default RoomCard;
