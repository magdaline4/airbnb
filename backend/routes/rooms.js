// backend/routes/rooms.js
const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");

// POST - create room(s)
router.post("/", roomController.createRoom);

// GET - list all rooms with pagination and filtering
router.get("/", roomController.getAllRooms);

// GET - search rooms with advanced filtering
router.get("/search", roomController.searchRooms);

// GET - get room by ID
router.get("/:id", roomController.getRoomById);

// PUT - update room by ID
router.put("/:id", roomController.updateRoom);

// DELETE - delete room by ID
router.delete("/:id", roomController.deleteRoom);

module.exports = router;
