const express = require("express");
const {
  createBooking,
  getMyBookings,
  getHostBookings,
  cancelBooking,
} = require("../controllers/bookingController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.post("/", protect, createBooking);
router.get("/my", protect, getMyBookings);
router.get("/host", protect, authorize("host", "admin"), getHostBookings);
router.put("/:id/cancel", protect, cancelBooking);

module.exports = router;
