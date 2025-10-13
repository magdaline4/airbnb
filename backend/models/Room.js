const mongoose = require("mongoose");

// ✅ Allowed property types
const PROPERTY_TYPES = [
  "House",
  "Flat",
  "Guest house",
  "Hotel",
  "Apartment",
  "Hostel",
  "Villa",
  "Cabin",
  "Condo",
  "Townhouse",
  "Loft",
  "Others",
];


// ✅ Allowed room types
const ROOM_TYPES = ["Entire home", "Private Room", "Shared Room"];

// ✅ Allowed amenities
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

// ✅ Allowed cancellation policies
const CANCELLATION_POLICIES = [
  "flexible",
  "moderate",
  "strict",
  "super_strict",
  "no_refund",
];

// ✅ Location Schema
const locationSchema = new mongoose.Schema(
  {
    lat: { type: Number, required: true },
    lng: { type: Number, required: true },
  },
  { _id: false }
);

// ✅ Address Schema
const addressSchema = new mongoose.Schema(
  {
    street: { type: String, required: true },
    city: { type: String, required: true },
    state: { type: String, required: true },
    country: { type: String, required: true },
    postalCode: { type: String, required: true },
  },
  { _id: false }
);

// ✅ Host Info Schema
const hostSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    profilePhoto: { type: String }, // URL of the host photo
    bio: { type: String, maxlength: 300 },
    responseRate: { type: Number, default: 100 }, // percentage
    responseTime: { type: String, default: "within an hour" },
    hostSince: { type: Date, default: Date.now },
    contactInfo: {
      email: { type: String },
      phone: { type: String },
    },
  },
  { _id: false }
);

// ✅ Main Room (Listing) Schema
const roomSchema = new mongoose.Schema(
  {
    host: { type: hostSchema, required: true }, // ✅ Host details

    // Listing Info
    title: { type: String, required: true, trim: true, index: true },
    description: { type: String, trim: true },

    // Property Details
    propertyType: { type: String, enum: PROPERTY_TYPES, required: true },
    roomType: { type: String, enum: ROOM_TYPES, required: true },
    type: { type: String, trim: true },

    // Location & Address
    location: { type: locationSchema, required: true },
    address: { type: addressSchema, required: true },

    // Room details
    guests: { type: Number, default: 1 },
    beds: { type: Number, default: 1 },
    bedrooms: { type: Number, default: 1 },
    bathrooms: { type: Number, default: 1 },

    // Amenities & Rules
    amenities: [{ type: String, enum: AMENITIES }],
    rules: [{ type: String }],

    // Pricing
    price: { type: Number, required: true },
    minNights: { type: Number, default: 1 },
    maxNights: { type: Number, default: 30 },

    // Reviews & Ratings
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isGuestFavorite: { type: Boolean, default: false },

    // Media
    images: [{ type: String }],

    // Policies
    cancellationPolicy: {
      type: String,
      enum: CANCELLATION_POLICIES,
      default: "moderate",
    },
    checkIn: { type: String, default: "14:00" },
    checkOut: { type: String, default: "11:00" },

    // Admin/Host controls
    verified: { type: Boolean, default: false },
    published: { type: Boolean, default: true },
  },
  { timestamps: true }
);

// ✅ Create Model
const RoomModel = mongoose.model("Room", roomSchema);

// ✅ Export enums for frontend form usage
RoomModel.PROPERTY_TYPES = PROPERTY_TYPES;
RoomModel.ROOM_TYPES = ROOM_TYPES;
RoomModel.AMENITIES = AMENITIES;
RoomModel.CANCELLATION_POLICIES = CANCELLATION_POLICIES;

module.exports = RoomModel;
