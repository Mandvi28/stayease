const User = require("../models/User");
const Listing = require("../models/Listing");
const Booking = require("../models/Booking");

// @desc    High-level platform stats
// @route   GET /api/admin/stats
const getStats = async (req, res, next) => {
  try {
    const [totalUsers, totalHosts, totalListings, totalBookings] = await Promise.all([
      User.countDocuments({ role: { $ne: "admin" } }),
      User.countDocuments({ role: "host" }),
      Listing.countDocuments(),
      Booking.countDocuments(),
    ]);

    res.json({ totalUsers, totalHosts, totalListings, totalBookings });
  } catch (error) {
    next(error);
  }
};

// @desc    List all users
// @route   GET /api/admin/users
const getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find().sort({ createdAt: -1 });
    res.json({ users });
  } catch (error) {
    next(error);
  }
};

// @desc    List all listings (including inactive)
// @route   GET /api/admin/listings
const getAllListings = async (req, res, next) => {
  try {
    const listings = await Listing.find().populate("host", "name email").sort({ createdAt: -1 });
    res.json({ listings });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a listing
// @route   DELETE /api/admin/listings/:id
const removeListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }
    await listing.deleteOne();
    res.json({ message: "Listing removed by admin" });
  } catch (error) {
    next(error);
  }
};

// @desc    List all bookings
// @route   GET /api/admin/bookings
const getAllBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find()
      .populate("listing", "title city country")
      .populate("guest", "name email")
      .sort({ createdAt: -1 });
    res.json({ bookings });
  } catch (error) {
    next(error);
  }
};

module.exports = { getStats, getAllUsers, getAllListings, removeListing, getAllBookings };
