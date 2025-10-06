const mongoose = require('mongoose');

const amenityItemSchema = new mongoose.Schema({
  amenities_Id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Amenity',
    required: true
  },
  item: {
    type: String,
    required: true
  },
  images: {
    type: String, // store image URL or file path
    default: ''   // optional default
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('AmenityItem', amenityItemSchema);
