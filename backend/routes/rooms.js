const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

// POST: Create one or multiple rooms
router.post("/", async (req, res) => {
  try {
    const payload = req.body;

    if (Array.isArray(payload)) {
      const docs = await Room.insertMany(payload);
      return res.status(201).json({ success: true, count: docs.length, rooms: docs });
    } else {
      const room = new Room(payload);
      await room.save();
      return res.status(201).json({ success: true, room });
    }
  } catch (err) {
    return res.status(400).json({ success: false, error: err.message });
  }
});

// GET: All rooms
router.get("/", async (req, res) => {
  try {
    const rooms = await Room.find();
    return res.status(200).json({ success: true, count: rooms.length, rooms });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

// DELETE: All rooms (use carefully in development)
router.delete("/", async (req, res) => {
  try {
    await Room.deleteMany({});
    return res.status(200).json({ success: true, message: "All rooms deleted" });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
