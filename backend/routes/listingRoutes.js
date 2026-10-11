const express = require("express");
const {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
  checkAvailability,
} = require("../controllers/listingController");
const { getListingReviews, createReview } = require("../controllers/reviewController");
const { protect, authorize } = require("../middleware/auth");

const router = express.Router();

router.get("/", getListings);
router.get("/host/mine", protect, authorize("host", "admin"), getMyListings);
router.get("/:id", getListingById);
router.get("/:id/availability", checkAvailability);
router.post("/", protect, authorize("host", "admin"), createListing);
router.put("/:id", protect, authorize("host", "admin"), updateListing);
router.delete("/:id", protect, authorize("host", "admin"), deleteListing);

router.get("/:id/reviews", getListingReviews);
router.post("/:id/reviews", protect, createReview);

module.exports = router;
