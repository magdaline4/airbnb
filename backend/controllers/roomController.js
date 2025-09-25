const Room = require("../models/Room");

// Create one or multiple rooms
exports.createRoom = async (req, res) => {
  try {
    const payload = req.body;

    if (Array.isArray(payload)) {
      // Multiple insert
      const rooms = await Room.insertMany(payload, { ordered: false });
      return res.status(201).json({ success: true, count: rooms.length, rooms });
    } else {
      // Single insert
      const room = new Room(payload);
      await room.save();
      return res.status(201).json({ success: true, room });
    }
  } catch (error) {
    return res.status(400).json({ success: false, error: error.message });
  }
};
