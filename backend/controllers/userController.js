const User = require("../models/User");

// @desc    Get logged-in user's profile
// @route   GET /api/users/me
const getProfile = async (req, res, next) => {
  try {
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

// @desc    Update logged-in user's profile
// @route   PUT /api/users/me
const updateProfile = async (req, res, next) => {
  try {
    const { name, profileImage } = req.body;

    if (name) req.user.name = name;
    if (profileImage) req.user.profileImage = profileImage;

    await req.user.save();
    res.json({ user: req.user });
  } catch (error) {
    next(error);
  }
};

module.exports = { getProfile, updateProfile };
