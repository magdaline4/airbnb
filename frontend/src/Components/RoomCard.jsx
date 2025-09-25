import "../Pages/Room/Room.scss";
import { FaHeart, FaChevronLeft, FaChevronRight } from "react-icons/fa";
import { PiTrophyBold } from "react-icons/pi";

const RoomCard = ({ room }) => {
  return (
    <div className="room-card">
      <div className="room-image">
        <img src={room.image} alt={room.title} />

        {/* Top-left label */}
        <div className="label">Guest favourite</div>
        <button className="heart-btn">
          <svg
            viewBox="0 0 32 32"
            width={48}
            height={48}
            xmlns="http://www.w3.org/2000/svg"
            aria-hidden="true"
            role="presentation"
            focusable="false"
          >
            <path
              d="m15.9998 28.6668c7.1667-4.8847 14.3334-10.8844 14.3334-18.1088 0-1.84951-.6993-3.69794-2.0988-5.10877-1.3996-1.4098-3.2332-2.11573-5.0679-2.11573-1.8336 0-3.6683.70593-5.0668 2.11573l-2.0999 2.11677-2.0988-2.11677c-1.3995-1.4098-3.2332-2.11573-5.06783-2.11573-1.83364 0-3.66831.70593-5.06683 2.11573-1.39955 1.41083-2.09984 3.25926-2.09984 5.10877 0 7.2244 7.16667 13.2241 14.3333 18.1088z"
              fill="#000"
              stroke="#fff"
              strokeWidth={1.6}
              strokeLinejoin="round"
              strokeLinecap="round"
            />
          </svg>
        </button>

        {/* Arrows */}
        <div>
        <div className="hover-zone left-zone"></div>
        <div className="hover-zone right-zone"></div>
        <button className="arrow left">
          <FaChevronLeft />
        </button>
        <button className="arrow right">
          <FaChevronRight />
        </button>
        </div>
      </div>

      <div className="room-info">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <h3>{room.title}</h3>{" "}
          <h2>
            {" "}
            ★ {room.rating}({room.reviews})
          </h2>
        </div>
        <p>Stay with {room.host}</p>

        <p className="price">
          ₹{room.price.toLocaleString()} <span>for 5 nights</span>{" "}
        </p>
      </div>
    </div>
  );
};

export default RoomCard;
