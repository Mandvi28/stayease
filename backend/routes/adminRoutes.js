const express = require("express");
const {
  getStats,
  getAllUsers,
  getAllListings,
  removeListing,
  getAllBookings,
} = require("../controllers/adminController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.use(protect, authorize("admin"));

router.get("/stats", getStats);
router.get("/users", getAllUsers);
router.get("/listings", getAllListings);
router.delete("/listings/:id", removeListing);
router.get("/bookings", getAllBookings);

module.exports = router;
