const Room = require("../models/Room");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Create one or multiple rooms
exports.createRoom = asyncHandler(async (req, res) => {
  const payload = req.body;

  if (Array.isArray(payload)) {
    const rooms = await Room.insertMany(payload, { ordered: false });
    return res.status(201).json({
      success: true,
      count: rooms.length,
      rooms,
      message: `${rooms.length} rooms created successfully`
    });
  } else {
    const room = new Room(payload);
    const savedRoom = await room.save();
    return res.status(201).json({
      success: true,
      room: savedRoom,
      message: "Room created successfully"
    });
  }
});

// Get all rooms with pagination and filtering - COMPLETELY FIXED
exports.getAllRooms = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { published: true };

  console.log("🔍 === BACKEND FILTER DEBUG ===");
  console.log("📥 Incoming query params:", req.query);

  // Price filter - FIXED
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

  // Room counts - FIXED
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

  // AMENITIES FILTER - COMPLETELY FIXED
  if (req.query.amenities) {
    try {
      let amenitiesArray;
      
      if (Array.isArray(req.query.amenities)) {
        amenitiesArray = req.query.amenities;
      } else {
        amenitiesArray = req.query.amenities.split(",");
      }
      
      // Clean the amenities array
      const cleanAmenities = amenitiesArray
        .map(a => a.toString().trim())
        .filter(a => a.length > 0);
      
      if (cleanAmenities.length > 0) {
        // Use $all for strict matching (must have ALL selected amenities)
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

  // Test the query directly first
  console.log("🧪 Testing direct MongoDB query with filter...");
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
    console.log("📋 First 3 rooms with amenities:");
    rooms.slice(0, 3).forEach((room, index) => {
      console.log(`   ${index + 1}. ${room.title}`);
      console.log(`      Price: ₹${room.price}, Amenities: ${room.amenities?.join(', ')}`);
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

// Get room by ID
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

// Update room by ID
exports.updateRoom = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updateData = { ...req.body };
  if (!id) return next(new AppError("Room ID is required", 400));

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

// Search rooms with advanced filtering
exports.searchRooms = asyncHandler(async (req, res) => {
  const {
    location,
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

  // Location filter
  if (location) {
    const [lat, lng] = location.split(',').map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      filter['location.lat'] = { $gte: lat - 0.1, $lte: lat + 0.1 };
      filter['location.lng'] = { $gte: lng - 0.1, $lte: lng + 0.1 };
    }
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

  // Amenities - FIXED
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

// Test endpoint for debugging
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
      amenities: r.amenities 
    }))
  });
});