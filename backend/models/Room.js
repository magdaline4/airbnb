const mongoose = require("mongoose");

const locationSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
}, { _id: false });

const roomSchema = new mongoose.Schema({
  title: { type: String, required: true },
  type: { type: String, required: true },
  location: { type: locationSchema, required: true },
  price: { type: Number, required: true },
  nights: { type: Number, required: true },
  rating: { type: Number, required: true },
  reviewCount: { type: Number, required: true },
  isGuestFavorite: { type: Boolean, default: false },
  beds: { type: Number },
  checkIn: { type: String },
  checkOut: { type: String },
  images: [{ type: String }]
}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);
