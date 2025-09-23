import "../Pages/Room/Room.scss";

const RoomCard = ({ room }) => {
 return (
    <div className="room-card">
      <img src={room.image} alt={room.title} />
      <div className="room-info">
        <h3>{room.title}</h3>
        <p>Stay with {room.host}</p>
        <p>⭐ {room.rating} ({room.reviews})</p>
        <p className="price">₹{room.price.toLocaleString()} / 5 nights</p>
      </div>
    </div>
  );
};

export default RoomCard;
