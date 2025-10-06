const express = require('express');
const router = express.Router();
const {
  getAmenityItems,
  getAmenityItemById,
  getAmenityItemsByCategory,
  createAmenityItem,
  createBulkAmenityItems,
  searchAmenityItems
} = require('../controllers/amenityItemController'); // Import from amenityItemController

// GET routes
router.get('/items', getAmenityItems);
router.get('/items/:id', getAmenityItemById);
router.get('/items/category/:amenities_Id', getAmenityItemsByCategory);
router.get('/items/search', searchAmenityItems);

// POST routes
router.post('/', createAmenityItem);
router.post('/bulk', createBulkAmenityItems);

module.exports = router;