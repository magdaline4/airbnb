// controllers/amenityItemController.js
const AmenityItem = require('../models/AmenityItem.js');
const Amenity = require('../models/Amenity.js');
const mongoose = require('mongoose');

// @desc    Get all amenity items
// @route   GET /api/amenitiesitem/items
// @access  Public
exports.getAmenityItems = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, amenities_Id } = req.query;

    let query = {};
    
    if (amenities_Id && mongoose.Types.ObjectId.isValid(amenities_Id)) {
      query.amenities_Id = new mongoose.Types.ObjectId(amenities_Id);
    }
    
    if (search) {
      query.item = { $regex: search, $options: 'i' };
    }

    const items = await AmenityItem.find(query)
      .populate('amenities_Id', 'name title _id')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ item: 1 });

    const total = await AmenityItem.countDocuments(query);

    res.status(200).json({
      success: true,
      count: items.length,
      total,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / limit)
      },
      data: items
    });
  } catch (error) {
    console.error('Error fetching amenity items:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching amenity items'
    });
  }
};

// @desc    Get single amenity item by ID
// @route   GET /api/amenitiesitem/items/:id
// @access  Public
exports.getAmenityItemById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amenity item ID'
      });
    }

    const item = await AmenityItem.findById(id).populate('amenities_Id', 'name title _id');

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Amenity item not found'
      });
    }

    res.status(200).json({
      success: true,
      data: item
    });
  } catch (error) {
    console.error('Error fetching amenity item:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching amenity item'
    });
  }
};

// @desc    Get amenity items by category
// @route   GET /api/amenitiesitem/items/category/:amenities_Id
// @access  Public
exports.getAmenityItemsByCategory = async (req, res) => {
  try {
    const { amenities_Id } = req.params;

    if (!mongoose.Types.ObjectId.isValid(amenities_Id)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid amenity category ID'
      });
    }

    const amenity = await Amenity.findById(amenities_Id);
    if (!amenity) {
      return res.status(404).json({
        success: false,
        message: 'Amenity category not found'
      });
    }

    const items = await AmenityItem.find({ amenities_Id })
      .populate('amenities_Id', 'name title _id')
      .sort({ item: 1 });

    res.status(200).json({
      success: true,
      category: {
        _id: amenity._id,
        name: amenity.name,
        title: amenity.title
      },
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error fetching amenity items by category:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching amenity items by category'
    });
  }
};

// @desc    Create amenity item(s) - single or bulk
// @route   POST /api/amenitiesitem
// @access  Private/Admin
exports.createAmenityItem = async (req, res) => {
  try {
    const payload = req.body;

    if (!payload) {
      return res.status(400).json({ 
        success: false, 
        message: "Item(s) data is required" 
      });
    }

    // Check if it's bulk create (has 'items' array) or single create
    if (payload.items && Array.isArray(payload.items)) {
      // Bulk create
      return await this.createBulkAmenityItems(req, res);
    }

    // Single create - ensure payload is always an array for easier handling
    const itemsArray = Array.isArray(payload) ? payload : [payload];

    const itemsToInsert = [];

    for (const obj of itemsArray) {
      const { item, amenities_Id, images } = obj;

      // Validate required fields
      if (!item || !amenities_Id) {
        return res.status(400).json({ 
          success: false, 
          message: "Each item must have 'item' and 'amenities_Id'" 
        });
      }

      // Validate ObjectId
      if (!mongoose.Types.ObjectId.isValid(amenities_Id)) {
        return res.status(400).json({ 
          success: false, 
          message: `Invalid Amenity ID for item "${item}"` 
        });
      }

      // Check if Amenity exists
      const amenity = await Amenity.findById(amenities_Id);
      if (!amenity) {
        return res.status(404).json({ 
          success: false, 
          message: `Amenity not found for item "${item}"` 
        });
      }

      // Check for duplicate item in the same amenity
      const existing = await AmenityItem.findOne({
        item: { $regex: `^${item}$`, $options: 'i' },
        amenities_Id
      });

      if (existing) {
        return res.status(400).json({ 
          success: false, 
          message: `Item "${item}" already exists in this Amenity` 
        });
      }

      itemsToInsert.push({ 
        item: item.trim(), 
        amenities_Id, 
        images: images || '' 
      });
    }

    // Insert all items
    const createdItems = await AmenityItem.insertMany(itemsToInsert);

    // Populate the created items with amenity details
    await AmenityItem.populate(createdItems, { 
      path: 'amenities_Id', 
      select: 'name title _id' 
    });

    res.status(201).json({ 
      success: true, 
      data: createdItems, 
      message: `${createdItems.length} Amenity Item(s) created successfully` 
    });

  } catch (error) {
    console.error('Error creating amenity item:', error);
    res.status(500).json({ 
      success: false, 
      message: error.message 
    });
  }
};

// @desc    Create multiple amenity items (bulk)
// @route   POST /api/amenitiesitem/bulk
// @access  Private/Admin
exports.createBulkAmenityItems = async (req, res) => {
  try {
    const { items } = req.body;

    if (!Array.isArray(items) || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Items array is required and cannot be empty'
      });
    }

    const itemsToInsert = [];

    for (const obj of items) {
      const { item, amenities_Id, images } = obj;

      if (!item || !amenities_Id) {
        return res.status(400).json({ 
          success: false, 
          message: "Each item must have 'item' and 'amenities_Id'" 
        });
      }

      if (!mongoose.Types.ObjectId.isValid(amenities_Id)) {
        return res.status(400).json({ 
          success: false, 
          message: `Invalid Amenity ID for item "${item}"` 
        });
      }

      const amenity = await Amenity.findById(amenities_Id);
      if (!amenity) {
        return res.status(404).json({ 
          success: false, 
          message: `Amenity not found for item "${item}"` 
        });
      }

      const existing = await AmenityItem.findOne({
        item: { $regex: `^${item}$`, $options: 'i' },
        amenities_Id
      });

      if (existing) {
        return res.status(400).json({ 
          success: false, 
          message: `Item "${item}" already exists in this Amenity` 
        });
      }

      itemsToInsert.push({ 
        item: item.trim(), 
        amenities_Id, 
        images: images || '' 
      });
    }

    const createdItems = await AmenityItem.insertMany(itemsToInsert);
    
    await AmenityItem.populate(createdItems, { 
      path: 'amenities_Id', 
      select: 'name title _id' 
    });

    res.status(201).json({
      success: true,
      message: `${createdItems.length} amenity items created successfully`,
      data: createdItems
    });
  } catch (error) {
    console.error('Error bulk creating amenity items:', error);
    res.status(500).json({
      success: false,
      message: 'Server error bulk creating amenity items'
    });
  }
};

// @desc    Search amenity items
// @route   GET /api/amenitiesitem/items/search
// @access  Public
exports.searchAmenityItems = async (req, res) => {
  try {
    const { q, amenities_Id } = req.query;

    if (!q) {
      return res.status(400).json({
        success: false,
        message: 'Search query is required'
      });
    }

    let query = {
      item: { $regex: q, $options: 'i' }
    };

    if (amenities_Id && mongoose.Types.ObjectId.isValid(amenities_Id)) {
      query.amenities_Id = new mongoose.Types.ObjectId(amenities_Id);
    }

    const items = await AmenityItem.find(query)
      .populate('amenities_Id', 'name title _id')
      .limit(20)
      .sort({ item: 1 });

    res.status(200).json({
      success: true,
      count: items.length,
      data: items
    });
  } catch (error) {
    console.error('Error searching amenity items:', error);
    res.status(500).json({
      success: false,
      message: 'Server error searching amenity items'
    });
  }
};