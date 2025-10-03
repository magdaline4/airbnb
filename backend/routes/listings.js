const express = require("express");
const router = express.Router();
const { createListing, getListings } = require("../controllers/listingController");

router.post("/", createListing);
router.get("/", getListings);

module.exports = router;
