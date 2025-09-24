const express = require("express");
const router = express.Router();
const { createListing } = require("../controllers/listingController");

router.post("/", createListing);  // POST -> add data

module.exports = router;
