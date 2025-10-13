const Room = require("../models/Room");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Create one or multiple rooms - UPDATED with address validation
exports.createRoom = asyncHandler(async (req, res, next) => {
  const payload = req.body;

  console.log('=== INCOMING ROOM CREATION ===');
  console.log('Room Type:', payload.roomType);
  console.log('Property Type:', payload.propertyType);
  console.log('Allowed Room Types:', ["Entire home", "Private Room", "Shared Room"]);
  console.log('Allowed Property Types:', [
    "House", "flat", "Guest house", "Hotel", "Apartment", 
    "Hostel", "villa", "cabin", "condo", "Townhouse", "Loft", "Others"
  ]);

  // Validate address for single room creation
  if (!Array.isArray(payload) && payload.address) {
    const { street, city, state, country, postalCode } = payload.address;
    if (!street || !city || !state || !country || !postalCode) {
      return next(new AppError("All address fields (street, city, state, country, postalCode) are required", 400));
    }
  }

  // Rest of your existing validation code...
});

// Get all rooms with pagination and filtering - UPDATED to include address
exports.getAllRooms = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { published: true };

  console.log("🔍 === BACKEND FILTER DEBUG ===");
  console.log("📥 Incoming query params:", req.query);

  // Price filter
  if (req.query.minPrice) {
    const minPriceVal = parseInt(req.query.minPrice);
    if (!isNaN(minPriceVal) && minPriceVal > 0) {
      filter.price = { ...(filter.price || {}), $gte: minPriceVal };
      console.log("💰 Min price filter:", minPriceVal);
    }
  }

  if (req.query.maxPrice) {
    const maxPriceVal = parseInt(req.query.maxPrice);
    if (!isNaN(maxPriceVal) && maxPriceVal > 0) {
      filter.price = { ...(filter.price || {}), $lte: maxPriceVal };
      console.log("💰 Max price filter:", maxPriceVal);
    }
  }

  // Room counts
  if (req.query.bedrooms) {
    const bedroomsVal = parseInt(req.query.bedrooms);
    if (!isNaN(bedroomsVal) && bedroomsVal > 0) {
      filter.bedrooms = { $gte: bedroomsVal };
      console.log("🛏️ Bedrooms filter:", bedroomsVal);
    }
  }

  if (req.query.beds) {
    const bedsVal = parseInt(req.query.beds);
    if (!isNaN(bedsVal) && bedsVal > 0) {
      filter.beds = { $gte: bedsVal };
      console.log("🛌 Beds filter:", bedsVal);
    }
  }

  if (req.query.bathrooms) {
    const bathroomsVal = parseInt(req.query.bathrooms);
    if (!isNaN(bathroomsVal) && bathroomsVal > 0) {
      filter.bathrooms = { $gte: bathroomsVal };
      console.log("🚽 Bathrooms filter:", bathroomsVal);
    }
  }

  // Location filter by city - NEW
  if (req.query.city) {
    filter["address.city"] = { $regex: req.query.city, $options: "i" };
    console.log("🏙️ City filter:", req.query.city);
  }

  // AMENITIES FILTER
  if (req.query.amenities) {
    try {
      let amenitiesArray;
      
      if (Array.isArray(req.query.amenities)) {
        amenitiesArray = req.query.amenities;
      } else {
        amenitiesArray = req.query.amenities.split(",");
      }
      
      const cleanAmenities = amenitiesArray
        .map(a => a.toString().trim())
        .filter(a => a.length > 0);
      
      if (cleanAmenities.length > 0) {
        filter.amenities = { $all: cleanAmenities };
        console.log("🏠 Amenities filter STRICTLY APPLIED:", cleanAmenities);
        console.log("🏠 Filter query:", JSON.stringify({ amenities: { $all: cleanAmenities } }));
      } else {
        console.log("🏠 Amenities filter: Clean array is empty, skipping");
      }
    } catch (error) {
      console.log("🏠 Error processing amenities:", error);
    }
  } else {
    console.log("🏠 No amenities filter provided");
  }

  console.log("📝 Final filter object:", JSON.stringify(filter, null, 2));

  const testQuery = await Room.find(filter);
  console.log("🧪 Direct query result count:", testQuery.length);

  const [rooms, total] = await Promise.all([
    Room.find(filter).skip(skip).limit(limit).sort({ createdAt: -1 }),
    Room.countDocuments(filter)
  ]);

  console.log("✅ === FILTER RESULTS ===");
  console.log(`📊 Rooms found: ${rooms.length}`);
  console.log(`📈 Total matching: ${total}`);
  
  if (rooms.length > 0) {
    console.log("📋 First 3 rooms with address and amenities:");
    rooms.slice(0, 3).forEach((room, index) => {
      console.log(`   ${index + 1}. ${room.title}`);
      console.log(`      Price: ₹${room.price}, City: ${room.address?.city}, Amenities: ${room.amenities?.join(', ')}`);
    });
  } else {
    console.log("📋 No rooms found with current filters");
  }

  const totalPages = Math.ceil(total / limit);

  res.status(200).json({
    success: true,
    count: rooms.length,
    total: total,
    page,
    limit,
    totalPages,
    rooms,
    message: "Rooms retrieved successfully"
  });
});

// Get room by ID - UPDATED to include address
exports.getRoomById = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) return next(new AppError("Room ID is required", 400));

  const room = await Room.findById(id);
  if (!room) return next(new AppError(`Room with ID ${id} does not exist`, 404));

  res.status(200).json({
    success: true,
    room,
    message: "Room by ID retrieved successfully"
  });
});

// Update room by ID - UPDATED with address validation
exports.updateRoom = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  if (!id) return next(new AppError("Room ID is required", 400));

  // Validate address if provided
  if (updateData.address) {
    const { street, city, state, country, postalCode } = updateData.address;
    if (!street || !city || !state || !country || !postalCode) {
      return next(new AppError("All address fields (street, city, state, country, postalCode) are required", 400));
    }
  }

  delete updateData._id;
  delete updateData.createdAt;
  delete updateData.updatedAt;

  const room = await Room.findByIdAndUpdate(id, updateData, { new: true, runValidators: true });
  if (!room) return next(new AppError(`Room with ID ${id} does not exist`, 404));

  res.status(200).json({
    success: true,
    room,
    message: "Room updated successfully"
  });
});

// Delete room by ID
exports.deleteRoom = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  if (!id) return next(new AppError("Room ID is required", 400));

  const room = await Room.findByIdAndDelete(id);
  if (!room) return next(new AppError(`Room with ID ${id} does not exist`, 404));

  res.status(200).json({
    success: true,
    room,
    message: "Room deleted successfully"
  });
});

// Search rooms with advanced filtering - UPDATED with address search
exports.searchRooms = asyncHandler(async (req, res) => {
  const {
    location,
    city,
    minPrice,
    maxPrice,
    propertyType,
    roomType,
    minRating,
    guests,
    beds,
    bedrooms,
    bathrooms,
    amenities,
    page = 1,
    limit = 10
  } = req.query;

  const filter = { published: true };
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Location filter by coordinates
  if (location) {
    const [lat, lng] = location.split(',').map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      filter['location.lat'] = { $gte: lat - 0.1, $lte: lat + 0.1 };
      filter['location.lng'] = { $gte: lng - 0.1, $lte: lng + 0.1 };
    }
  }

  // City filter by address - NEW
  if (city) {
    filter["address.city"] = { $regex: city, $options: "i" };
  }

  // Price filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseInt(minPrice);
    if (maxPrice) filter.price.$lte = parseInt(maxPrice);
  }

  // Property & room type
  if (propertyType) filter.propertyType = propertyType;
  if (roomType) filter.roomType = roomType;

  // Rating
  if (minRating) filter.rating = { $gte: parseFloat(minRating) };

  // Capacity filters
  if (guests) filter.guests = { $gte: parseInt(guests) };
  if (beds) filter.beds = { $gte: parseInt(beds) };
  if (bedrooms) filter.bedrooms = { $gte: parseInt(bedrooms) };
  if (bathrooms) filter.bathrooms = { $gte: parseInt(bathrooms) };

  // Amenities
  if (amenities) {
    const amenitiesArray = Array.isArray(amenities) ? amenities : amenities.split(',');
    const cleanAmenities = amenitiesArray.map(a => a.trim()).filter(a => a.length > 0);
    if (cleanAmenities.length > 0) {
      filter.amenities = { $all: cleanAmenities };
    }
  }

  const [rooms, total] = await Promise.all([
    Room.find(filter).skip(skip).limit(parseInt(limit)).sort({ rating: -1, createdAt: -1 }),
    Room.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / parseInt(limit));

  res.status(200).json({
    success: true,
    count: rooms.length,
    total: total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages,
    rooms,
    message: "Search completed successfully"
  });
});

// Add address to existing rooms - NEW migration method
exports.addAddressToExistingRooms = asyncHandler(async (req, res, next) => {
  const { defaultCity = "Unknown City", defaultState = "Unknown State", defaultCountry = "Unknown Country" } = req.body;

  console.log("🔄 Starting address migration for existing rooms...");

  try {
    // Update rooms that don't have address field
    const result = await Room.updateMany(
      { 
        $or: [
          { address: { $exists: false } },
          { address: null }
        ]
      },
      {
        $set: {
          address: {
            street: "Address not specified",
            city: defaultCity,
            state: defaultState,
            country: defaultCountry,
            postalCode: "000000"
          }
        }
      }
    );

    console.log(`✅ Address migration completed: ${result.modifiedCount} rooms updated`);

    res.status(200).json({
      success: true,
      message: "Address migration completed successfully",
      result: {
        matched: result.matchedCount,
        modified: result.modifiedCount
      }
    });

  } catch (error) {
    console.error("❌ Address migration error:", error);
    return next(new AppError(`Address migration failed: ${error.message}`, 500));
  }
});

// Test endpoint for debugging - UPDATED with address
exports.testFilters = asyncHandler(async (req, res) => {
  const filter = { published: true };
  
  // Test with Pool amenity only
  filter.amenities = { $all: ["Pool"] };
  
  console.log("=== TEST FILTER DEBUG ===");
  console.log("Testing filter:", JSON.stringify(filter, null, 2));

  const rooms = await Room.find(filter);
  const total = await Room.countDocuments(filter);

  console.log("=== TEST RESULTS ===");
  console.log("Rooms found:", rooms.length);
  console.log("Total matching:", total);

  res.status(200).json({
    success: true,
    testFilter: { amenities: ["Pool"] },
    filterUsed: filter,
    roomsFound: rooms.length,
    totalMatching: total,
    rooms: rooms.map(r => ({ 
      id: r._id, 
      title: r.title, 
      price: r.price, 
      city: r.address?.city,
      amenities: r.amenities 
    }))
  });
});