const mongoose = require('mongoose');

const amenitySchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
  }
}, { timestamps: true });

const Amenity = mongoose.model('Amenity', amenitySchema);

module.exports = Amenity;
