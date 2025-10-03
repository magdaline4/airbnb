const mongoose = require("mongoose");

// ✅ Allowed property types based on your list
const PROPERTY_TYPES = [
  "House",
  "Flat",
  "Guest house",
  "Hotel",
];

// ✅ Allowed room types based on your list
const ROOM_TYPES = [
  "Any type Room",
  "Entire home",
];

// ✅ Allowed amenities based on your list
const AMENITIES = [
  "Wifi",
  "Air conditioning",
  "Pool",
  "Dryer",
  "Heating",
  "Workspace",
  "Essentials",
  "Kitchen",
  "Washing machine",
  "TV",
  "Hair dryer",
  "Iron",
  "Features",
  "Hot tub",
  "Free parking",
  "EV charger",
  "Cot",
  "King bed",
  "Gym",
  "BBQ grill",
  "Breakfast",
];

const CANCELLATION_POLICIES = [
  "flexible",
  "moderate",
  "strict",
  "super_strict",
  "no_refund",
];

const locationSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

const addressSchema = new mongoose.Schema(
  {
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  { _id: false }
);

const roomSchema = new mongoose.Schema(
  {
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, trim: true },

    // ✅ Updated enums
    propertyType: { type: String, enum: PROPERTY_TYPES, required: true },
    roomType: { type: String, enum: ROOM_TYPES, required: true },

    type: { type: String, trim: true },

    location: { type: locationSchema, required: true },
    address: { type: addressSchema, required: true },

    guests: { type: Number, default: 1 },
    beds: { type: Number, default: 1 },
    bedrooms: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },

    // ✅ Restrict amenities to your given list
    amenities: [{ type: String, enum: AMENITIES }],
    rules: [{ type: String }],

    price: { type: Number, required: true },
    minNights: { type: Number, default: 1 },
    maxNights: { type: Number, default: 30 },

    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isGuestFavorite: { type: Boolean, default: false },

    images: [{ type: String }],

    cancellationPolicy: {
      type: String,
      enum: CANCELLATION_POLICIES,
      default: "moderate",
    },

    checkIn: { type: String, default: "14:00" },
    checkOut: { type: String, default: "11:00" },

    verified: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

const RoomModel = mongoose.model("Room", roomSchema);

// Export enums so you can reuse them in frontend forms
RoomModel.PROPERTY_TYPES = PROPERTY_TYPES;
RoomModel.ROOM_TYPES = ROOM_TYPES;
RoomModel.AMENITIES = AMENITIES;
RoomModel.CANCELLATION_POLICIES = CANCELLATION_POLICIES;

module.exports = RoomModel;

