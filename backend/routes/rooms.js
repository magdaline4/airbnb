// backend/routes/rooms.js
const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

// POST - delete all rooms and insert new data
router.post("/", async (req, res) => {
  try {
    const payload = req.body;

    // Delete all existing rooms
    await Room.deleteMany({});

    // Insert new rooms (array or single object)
    let insertedRooms;
    if (Array.isArray(payload)) {
      insertedRooms = await Room.insertMany(payload);
    } else {
      const room = new Room(payload);
      insertedRooms = [await room.save()];
    }

    return res.status(201).json({
      success: true,
      message: "All existing rooms deleted and new rooms added.",
      count: insertedRooms.length,
      rooms: insertedRooms,
    });
  } catch (err) {
    console.error("POST /rooms error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

// GET - list rooms with optional pagination
router.get("/", async (req, res) => {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const skip = (page - 1) * limit;

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

// DELETE - delete all rooms
router.delete("/", async (req, res) => {
  try {
    const result = await Room.deleteMany({});
    return res.status(200).json({
      success: true,
      message: "All rooms deleted",
      deletedCount: result.deletedCount,
    });
  } catch (err) {
    console.error("DELETE /rooms error:", err);
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
