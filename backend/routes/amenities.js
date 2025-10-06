const express = require('express');
const router = express.Router();
const amenityController = require('../controllers/amenityController');

// GET all amenities
router.get('/', amenityController.getAmenities);

// POST single or multiple amenities
router.post('/', amenityController.createAmenity);

// DELETE an amenity by ID
router.delete('/:id', amenityController.deleteAmenity);

module.exports = router;
