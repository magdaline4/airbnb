const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

// POST only — create one or multiple rooms
router.post("/", async (req, res) => {
   try {
      const payload = req.body;
  
      if (Array.isArray(payload)) {
        // Insert multiple
        const docs = await Room.insertMany(payload);
        return res.status(201).json({ success: true, count: docs.length, rooms: docs });
      } else {
        // Insert single
        const room = new Room(payload);
        await room.save();
        return res.status(201).json({ success: true, room });
      }
    } catch (err) {
      return res.status(400).json({ success: false, error: err.message });
    }
  });



// GET with pagination
router.get("/", async (req, res) => {
  try {
    // query params with defaults
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 9;

    const skip = (page - 1) * limit;

    const [rooms, total] = await Promise.all([
      Room.find().skip(skip).limit(limit),
      Room.countDocuments()
    ]);

    return res.status(200).json({
      success: true,
      page,
      totalPages: Math.ceil(total / limit),
      count: rooms.length,
      totalRooms: total,
      rooms,
    });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});


module.exports = router;
