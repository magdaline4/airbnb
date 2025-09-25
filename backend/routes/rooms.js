const express = require("express");
const router = express.Router();
const Room = require("../models/Room");

// POST only — create one or multiple rooms
router.post("/", async (req, res) => {
  try {
    const payload = req.body;

    if (Array.isArray(payload)) {
      // Insert many
      const docs = await Room.insertMany(payload, { ordered: false });
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



router.get("/", async (req, res) => {
  try {
    const listings = await Room.find(); // fetch all
    return res.status(200).json({ success: true, count: rooms.length, rooms });
  } catch (err) {
    return res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
