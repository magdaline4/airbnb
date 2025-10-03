const express = require("express");
const router = express.Router();
const Listing = require("../models/Listing");

// POST: create one or multiple listings
router.post("/", async (req, res) => {
  
  try {
    const payload = req.body;

    if (Array.isArray(payload)) {
      // Insert multiple
      const docs = await Listing.insertMany(payload);
      return res.status(201).json({ success: true, count: docs.length, listings: docs });
    } else {
      // Insert single
      const listing = new Listing(payload); 
      await listing.save();
      return res.status(201).json({ success: true, listing });
    }
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});


router.get("/", async (req, res) => {
  try {
    const listings = await Listing.find(); // fetch all
    return res.status(200).json({ success: true, count: listings.length, listings });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});
const { createListing, getListings } = require("../controllers/listingController");

router.post("/", createListing);
router.get("/", getListings);

module.exports = router;
