const mongoose = require("mongoose");

const roomSchema = new mongoose.Schema({
    id: {type: Number, required: true },
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  nights: { type: Number, required: true },
  rating: { type: Number, required: true },
  reviewCount: { type: Number, default: 0 },
  beds: { type: Number, required: true },
  checkIn: { type: String },
  checkOut: { type: String },
  images: [{ type: String, required: true }],
  isGuestFavorite: { type: Boolean, default: false }
}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);
