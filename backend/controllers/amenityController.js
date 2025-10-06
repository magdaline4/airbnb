const Amenity = require('../models/Amenity');

// GET all amenities
exports.getAmenities = async (req, res) => {
  try {
    const amenities = await Amenity.find({});
    res.status(200).json({ success: true, amenities });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// POST single or multiple amenities
exports.createAmenity = async (req, res) => {
  try {
    const payload = req.body;

    if (!payload || (Array.isArray(payload) && payload.length === 0)) {
      return res.status(400).json({ success: false, message: "Name is required" });
    }

    let inserted;
    if (Array.isArray(payload)) {
      inserted = await Amenity.insertMany(payload);
    } else {
      const amenity = new Amenity(payload);
      inserted = await amenity.save();
    }

    res.status(201).json({ success: true, inserted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// DELETE an amenity by ID
exports.deleteAmenity = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Amenity.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: "Amenity not found" });
    }

    res.status(200).json({ success: true, message: "Amenity deleted", deleted });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};
