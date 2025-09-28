const mongoose = require("mongoose");

// Enums
const PROPERTY_TYPES = ["Apartment", "House", "Villa", "Guesthouse", "Private Room", "Shared Room", "Other"];
const ROOM_TYPES = ["Entire Place", "Private Room", "Shared Room"];
const CANCELLATION_POLICIES = ["flexible", "moderate", "strict", "super_strict", "no_refund"];

const locationSchema = new mongoose.Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
}, { _id: false });

const addressSchema = new mongoose.Schema({
  line1: String,
  line2: String,
  city: String,
  state: String,
  country: String,
  postalCode: String,
}, { _id: false });

const roomSchema = new mongoose.Schema({
  title: { type: String, required: true, trim: true, index: true },
  description: { type: String, trim: true },
  propertyType: { type: String, enum: PROPERTY_TYPES, default: "Apartment" },
  roomType: { type: String, enum: ROOM_TYPES, default: "Entire Place" },
  location: { type: locationSchema, required: true },
  address: { type: addressSchema },
  guests: { type: Number, default: 1 },
  beds: { type: Number, default: 1 },
  bedrooms: { type: Number, default: 1 },
  bathrooms: { type: Number, default: 1 },
  amenities: [{ type: String }], // e.g., ["Wifi","Kitchen","Washer"]
  rules: [{ type: String }], // house rules
  price: { type: Number, required: true },
  minNights: { type: Number, default: 1 },
  maxNights: { type: Number, default: 30 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  isGuestFavorite: { type: Boolean, default: false }, 
  beds: { type: Number },
  images: [{ type: String }],
  // availability: {
  //   blocks: [availabilityBlockSchema] 
  // },
  cancellationPolicy: { type: String, enum: CANCELLATION_POLICIES, default: "moderate" },
  verified: { type: Boolean, default: false },
  published: { type: Boolean, default: true },
}, { timestamps: true });

module.exports = mongoose.model("Room", roomSchema);
module.exports.PROPERTY_TYPES = PROPERTY_TYPES;
module.exports.ROOM_TYPES = ROOM_TYPES;
module.exports.CANCELLATION_POLICIES = CANCELLATION_POLICIES;
