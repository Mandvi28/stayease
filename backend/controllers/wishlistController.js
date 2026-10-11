const Wishlist = require("../models/Wishlist");

// @desc    Get the logged-in user's wishlist
// @route   GET /api/wishlist
const getWishlist = async (req, res, next) => {
  try {
    const items = await Wishlist.find({ user: req.user._id }).populate({
      path: "listing",
      populate: { path: "host", select: "name" },
    });
    res.json({ wishlist: items.filter((i) => i.listing) });
  } catch (error) {
    next(error);
  }
};

// @desc    Add a listing to the wishlist
// @route   POST /api/wishlist/:listingId
const addToWishlist = async (req, res, next) => {
  try {
    const existing = await Wishlist.findOne({ user: req.user._id, listing: req.params.listingId });
    if (existing) {
      return res.status(400).json({ message: "Listing is already in your wishlist" });
    }

    const item = await Wishlist.create({ user: req.user._id, listing: req.params.listingId });
    res.status(201).json({ item });
  } catch (error) {
    next(error);
  }
};

// @desc    Remove a listing from the wishlist
// @route   DELETE /api/wishlist/:listingId
const removeFromWishlist = async (req, res, next) => {
  try {
    await Wishlist.findOneAndDelete({ user: req.user._id, listing: req.params.listingId });
    res.json({ message: "Removed from wishlist" });
  } catch (error) {
    next(error);
  }
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
