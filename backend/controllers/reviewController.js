const Review = require("../models/Review");
const Booking = require("../models/Booking");
const Listing = require("../models/Listing");

const recalculateListingRating = async (listingId) => {
  const stats = await Review.aggregate([
    { $match: { listing: listingId } },
    { $group: { _id: "$listing", avgRating: { $avg: "$rating" }, count: { $sum: 1 } } },
  ]);

  const averageRating = stats.length ? Math.round(stats[0].avgRating * 10) / 10 : 0;
  const reviewCount = stats.length ? stats[0].count : 0;

  await Listing.findByIdAndUpdate(listingId, { averageRating, reviewCount });
};

// @desc    Get reviews for a listing
// @route   GET /api/listings/:id/reviews
const getListingReviews = async (req, res, next) => {
  try {
    const reviews = await Review.find({ listing: req.params.id })
      .populate("user", "name profileImage")
      .sort({ createdAt: -1 });
    res.json({ reviews });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a review - only for a listing the user has actually booked
// @route   POST /api/listings/:id/reviews
const createReview = async (req, res, next) => {
  try {
    const { rating, comment, bookingId } = req.body;
    const listingId = req.params.id;

    if (!rating || !comment || !bookingId) {
      return res.status(400).json({ message: "rating, comment and bookingId are required" });
    }

    const booking = await Booking.findOne({
      _id: bookingId,
      listing: listingId,
      guest: req.user._id,
    });

    if (!booking) {
      return res.status(403).json({ message: "You can only review listings you have booked" });
    }

    if (new Date(booking.checkIn) > new Date()) {
      return res.status(400).json({ message: "You can review a stay only after your check-in date" });
    }

    const existing = await Review.findOne({ booking: bookingId, user: req.user._id, listing: listingId });
    if (existing) {
      return res.status(400).json({ message: "You have already reviewed this booking" });
    }

    const review = await Review.create({
      listing: listingId,
      user: req.user._id,
      booking: bookingId,
      rating,
      comment,
    });

    await recalculateListingRating(review.listing);

    const populated = await review.populate("user", "name profileImage");
    res.status(201).json({ review: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a review (author or admin)
// @route   DELETE /api/reviews/:id
const deleteReview = async (req, res, next) => {
  try {
    const review = await Review.findById(req.params.id);
    if (!review) {
      return res.status(404).json({ message: "Review not found" });
    }

    const isAuthor = review.user.toString() === req.user._id.toString();
    if (!isAuthor && req.user.role !== "admin") {
      return res.status(403).json({ message: "You do not have permission to delete this review" });
    }

    const listingId = review.listing;
    await review.deleteOne();
    await recalculateListingRating(listingId);

    res.json({ message: "Review deleted successfully" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getListingReviews, createReview, deleteReview };
