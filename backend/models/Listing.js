const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema({
  id: { type: Number, required: true },       // custom numeric id
  title: { type: String, required: true },
  location: { type: String, required: true },
  price: { type: Number, required: true },
  nights: { type: Number, required: true },
  rating: { type: Number, required: true },
  image: { type: String, required: true }
}, { timestamps: true });

module.exports = mongoose.model("Listing", listingSchema);
