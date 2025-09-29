// backend/routes/rooms.js
const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

// POST - create room(s)
router.post("/", async (req, res) => {
  try {
    const payload = req.body;
    if (Array.isArray(payload)) {
      const docs = await Room.insertMany(payload);
      return res.status(201).json({ success: true, count: docs.length, rooms: docs });
    } else {
      const room = new Room(payload);
      const saved = await room.save();
      return res.status(201).json({ success: true, room: saved });
    }
  } catch (err) {
    console.error("POST /rooms error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET - list rooms with optional pagination
router.get("/", async (req, res) => {
  try {
    // parse query params with defaults
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

    // fetch paginated results + total count in parallel
    const [rooms, total] = await Promise.all([
      Room.find().skip(skip).limit(limit),
      Room.countDocuments(),
    ]);

    return res.status(200).json({
      success: true,
      count: rooms.length,
      total,
      page,
      limit,
      rooms,
    });
  } catch (err) {
    console.error("GET /rooms error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
