const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");

// POST: create one or multiple listings
router.post("/", async (req, res) => {
  try {
    const payload = req.body;

    if (Array.isArray(payload)) {
      // Insert multiple listings
      const docs = await Listing.insertMany(payload);
      return res.status(201).json({ success: true, count: docs.length, listings: docs });
    } else {
      // Insert single listing
      const listing = new Listing(payload);
      await listing.save();
      return res.status(201).json({ success: true, listing });
    }
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// GET: fetch all listings
router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find();
    return res.status(200).json({ success: true, count: listings.length, listings });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE: delete listing by ID
router.delete("/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const deletedListing = await Listing.findByIdAndDelete(id);

    if (!deletedListing) {
      return res.status(404).json({ success: false, message: "Listing not found" });
    }

    return res.status(200).json({ success: true, message: "Listing deleted successfully" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
