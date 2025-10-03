const Room = require("../models/Room");
const asyncHandler = require("../utils/asyncHandler");
const AppError = require("../utils/AppError");

// Create one or multiple rooms
exports.createRoom = asyncHandler(async (req, res) => {
    const payload = req.body;

    if (Array.isArray(payload)) {
      // Multiple insert
      const rooms = await Room.insertMany(payload, { ordered: false });
      return res.status(201).json({ 
      success: true, 
      count: rooms.length, 
      rooms,
      message: `${rooms.length} rooms created successfully`
    });
    } else {
      // Single insert
      const room = new Room(payload);
    const savedRoom = await room.save();
    return res.status(201).json({ 
      success: true, 
      room: savedRoom,
      message: "Room created successfully"
    });
  }
});

// Get all rooms with pagination and filtering
exports.getAllRooms = asyncHandler(async (req, res) => {
  // Parse query parameters
  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 10;
  const skip = (page - 1) * limit;
  
  // Build filter object
  const filter = {};
  
  // Add filters based on query parameters
  if (req.query.propertyType) {
    filter.propertyType = req.query.propertyType;
  }
  if (req.query.roomType) {
    filter.roomType = req.query.roomType;
  }
  if (req.query.minPrice || req.query.maxPrice) {
    filter.price = {};
    if (req.query.minPrice) filter.price.$gte = parseInt(req.query.minPrice);
    if (req.query.maxPrice) filter.price.$lte = parseInt(req.query.maxPrice);
  }
  if (req.query.minRating) {
    filter.rating = { $gte: parseFloat(req.query.minRating) };
  }
  if (req.query.published !== undefined) {
    filter.published = req.query.published === 'true';
  }

  // Fetch paginated results and total count in parallel
  const [rooms, total] = await Promise.all([
    Room.find(filter)
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }),
    Room.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / limit);

  return res.status(200).json({
    success: true,
    count: rooms.length,
    total,
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
  
  if (!id) {
    return next(new AppError("Room ID is required", 400));
  }

  const room = await Room.findById(id);
  
  if (!room) {
    return next(new AppError(`Room with ID ${id} does not exist`, 404));
  }

  return res.status(200).json({
    success: true,
    room,
    message: "Room by ID retrieved successfully"
  });
});

// Update room by ID
exports.updateRoom = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  const updateData = req.body;
  
  if (!id) {
    return next(new AppError("Room ID is required", 400));
  }

  // Remove fields that shouldn't be updated directly
  delete updateData._id;
  delete updateData.createdAt;
  delete updateData.updatedAt;

  const room = await Room.findByIdAndUpdate(
    id,
    updateData,
    { 
      new: true, 
      runValidators: true 
    }
  );
  
  if (!room) {
    return next(new AppError(`Room with ID ${id} does not exist`, 404));
  }

  return res.status(200).json({
    success: true,
    room,
    message: "Room updated successfully"
  });
});

// Delete room by ID
exports.deleteRoom = asyncHandler(async (req, res, next) => {
  const { id } = req.params;
  
  if (!id) {
    return next(new AppError("Room ID is required", 400));
  }

  const room = await Room.findByIdAndDelete(id);
  
  if (!room) {
    return next(new AppError(`Room with ID ${id} does not exist`, 404));
  }

  return res.status(200).json({
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

  const filter = {};
  const skip = (parseInt(page) - 1) * parseInt(limit);

  // Location filter (if coordinates provided)
  if (location) {
    const [lat, lng] = location.split(',').map(Number);
    if (!isNaN(lat) && !isNaN(lng)) {
      filter['location.lat'] = { $gte: lat - 0.1, $lte: lat + 0.1 };
      filter['location.lng'] = { $gte: lng - 0.1, $lte: lng + 0.1 };
    }
  }

  // Price range filter
  if (minPrice || maxPrice) {
    filter.price = {};
    if (minPrice) filter.price.$gte = parseInt(minPrice);
    if (maxPrice) filter.price.$lte = parseInt(maxPrice);
  }

  // Property and room type filters
  if (propertyType) filter.propertyType = propertyType;
  if (roomType) filter.roomType = roomType;

  // Rating filter
  if (minRating) filter.rating = { $gte: parseFloat(minRating) };

  // Capacity filters
  if (guests) filter.guests = { $gte: parseInt(guests) };
  if (beds) filter.beds = { $gte: parseInt(beds) };
  if (bedrooms) filter.bedrooms = { $gte: parseInt(bedrooms) };
  if (bathrooms) filter.bathrooms = { $gte: parseInt(bathrooms) };

  // Amenities filter
  if (amenities) {
    const amenitiesArray = Array.isArray(amenities) ? amenities : amenities.split(',');
    filter.amenities = { $in: amenitiesArray };
  }

  // Only show published rooms
  filter.published = true;

  const [rooms, total] = await Promise.all([
    Room.find(filter)
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ rating: -1, createdAt: -1 }),
    Room.countDocuments(filter)
  ]);

  const totalPages = Math.ceil(total / parseInt(limit));

  return res.status(200).json({
    success: true,
    count: rooms.length,
    total,
    page: parseInt(page),
    limit: parseInt(limit),
    totalPages,
    rooms,
    message: "Search completed successfully"
  });
});
