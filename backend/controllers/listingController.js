const Listing = require("../models/Listing");

// Create single or multiple listings
exports.createListing = async (req, res) => {
  try {
    const payload = req.body;
    if (Array.isArray(payload)) {
      const docs = await Listing.insertMany(payload);
      return res.status(201).json({ success: true, count: docs.length, listings: docs });
    } else {
      const listing = new Listing(payload);
      await listing.save();
      return res.status(201).json({ success: true, listing });
    }
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
};

// Get all listings
exports.getListings = async (req, res) => {
  try {
    const listings = await Listing.find();
    return res.status(200).json({ success: true, count: listings.length, listings });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
};
