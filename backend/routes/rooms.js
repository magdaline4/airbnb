const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const asyncHandler = require("../utils/asyncHandler");
const Room = require("../models/Room");

// Bulk delete (delete all rooms) — optional, use with extreme caution
router.delete(
  "/",
  asyncHandler(async (req, res, next) => {
    const result = await Room.deleteMany({});
    return res.status(200).json({
      success: true,
      deletedCount: result.deletedCount,
      message: `Deleted ${result.deletedCount} rooms`
    });
  })
);

// POST — create room(s)
router.post("/", roomController.createRoom);

// GET — list all rooms
router.get("/", roomController.getAllRooms);

router.get("/filterapi", roomController.getAllRooms);


// GET — search
router.get("/search", roomController.searchRooms);

// GET by ID
router.get("/:id", roomController.getRoomById);

// PUT by ID
router.put("/:id", roomController.updateRoom);

// DELETE by ID
router.delete("/:id", roomController.deleteRoom);

// In your routes file
router.get("/test-filters", roomController.testFilters);

module.exports = router;
