const express = require("express");
const router = express.Router();
const roomController = require("../controllers/roomController");
const asyncHandler = require("../utils/asyncHandler");
const Room = require("../models/Room");

// Bulk delete (delete all rooms)
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

// Create room(s)
router.post("/", roomController.createRoom);

// Static / specific routes — IMPORTANT: keep these before the '/:id' param route
router.get("/filterapi", roomController.getAllRooms);
router.get("/test-filters", roomController.testFilters);

// Migration route — add address to existing rooms
// Use POST when you want to send options in body (defaultCity, defaultState, etc.)
router.post("/migrate/address", roomController.addAddressToExistingRooms);

// Search & filters
router.get("/search", roomController.searchRooms);
router.get("/", roomController.getAllRooms);

// Parameterized routes (leave these last)
router.get("/:id", roomController.getRoomById);
router.put("/:id", roomController.updateRoom);
router.delete("/:id", roomController.deleteRoom);

module.exports = router;
