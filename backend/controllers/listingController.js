const Listing = require("../models/Listing");
const Booking = require("../models/Booking");

// @desc    Get listings with search + filters
// @route   GET /api/listings
const getListings = async (req, res, next) => {
  try {
    const {
      destination,
      checkIn,
      checkOut,
      guests,
      minPrice,
      maxPrice,
      propertyType,
      bedrooms,
      bathrooms,
      amenities,
      page = 1,
      limit = 12,
    } = req.query;

    const query = { isActive: true };

    if (destination) {
      const regex = new RegExp(destination, "i");
      query.$or = [{ city: regex }, { country: regex }, { title: regex }];
    }

    if (guests) query.maxGuests = { $gte: Number(guests) };
    if (bedrooms) query.bedrooms = { $gte: Number(bedrooms) };
    if (bathrooms) query.bathrooms = { $gte: Number(bathrooms) };
    if (propertyType) query.propertyType = propertyType;

    if (minPrice || maxPrice) {
      query.pricePerNight = {};
      if (minPrice) query.pricePerNight.$gte = Number(minPrice);
      if (maxPrice) query.pricePerNight.$lte = Number(maxPrice);
    }

    if (amenities) {
      const amenitiesArr = Array.isArray(amenities) ? amenities : amenities.split(",");
      query.amenities = { $all: amenitiesArr };
    }

    let listingIds = null;

    // If dates are provided, exclude listings that already have an overlapping booking
    if (checkIn && checkOut) {
      const start = new Date(checkIn);
      const end = new Date(checkOut);

      if (isNaN(start) || isNaN(end) || start >= end) {
        return res.status(400).json({ message: "Invalid check-in/check-out dates" });
      }

      const overlappingBookings = await Booking.find({
        status: "confirmed",
        checkIn: { $lt: end },
        checkOut: { $gt: start },
      }).select("listing");

      const bookedListingIds = overlappingBookings.map((b) => b.listing.toString());
      if (bookedListingIds.length) {
        query._id = { $nin: bookedListingIds };
      }
    }

    const pageNum = Math.max(Number(page), 1);
    const limitNum = Math.min(Math.max(Number(limit), 1), 50);
    const skip = (pageNum - 1) * limitNum;

    const [listings, total] = await Promise.all([
      Listing.find(query)
        .populate("host", "name profileImage")
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Listing.countDocuments(query),
    ]);

    res.json({
      listings,
      total,
      page: pageNum,
      pages: Math.ceil(total / limitNum),
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single listing
// @route   GET /api/listings/:id
const getListingById = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id).populate(
      "host",
      "name profileImage email createdAt"
    );

    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    res.json({ listing });
  } catch (error) {
    next(error);
  }
};

// @desc    Create listing (host only)
// @route   POST /api/listings
const createListing = async (req, res, next) => {
  try {
    const {
      title,
      description,
      pricePerNight,
      address,
      city,
      country,
      propertyType,
      bedrooms,
      bathrooms,
      maxGuests,
      amenities,
      images,
    } = req.body;

    if (!title || !description || !pricePerNight || !address || !city || !country || !propertyType) {
      return res.status(400).json({ message: "Missing required listing fields" });
    }

    const listing = await Listing.create({
      title,
      description,
      pricePerNight,
      address,
      city,
      country,
      propertyType,
      bedrooms: bedrooms || 1,
      bathrooms: bathrooms || 1,
      maxGuests: maxGuests || 1,
      amenities: amenities || [],
      images: images || [],
      host: req.user._id,
    });

    res.status(201).json({ listing });
  } catch (error) {
    next(error);
  }
};

// @desc    Update listing (owning host or admin only)
// @route   PUT /api/listings/:id
const updateListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const isOwner = listing.host.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "You do not have permission to edit this listing" });
    }

    const editableFields = [
      "title",
      "description",
      "pricePerNight",
      "address",
      "city",
      "country",
      "propertyType",
      "bedrooms",
      "bathrooms",
      "maxGuests",
      "amenities",
      "images",
      "isActive",
    ];

    editableFields.forEach((field) => {
      if (req.body[field] !== undefined) {
        listing[field] = req.body[field];
      }
    });

    await listing.save();
    res.json({ listing });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete listing (owning host or admin only)
// @route   DELETE /api/listings/:id
const deleteListing = async (req, res, next) => {
  try {
    const listing = await Listing.findById(req.params.id);
    if (!listing) {
      return res.status(404).json({ message: "Listing not found" });
    }

    const isOwner = listing.host.toString() === req.user._id.toString();
    if (!isOwner && req.user.role !== "admin") {
      return res.status(403).json({ message: "You do not have permission to delete this listing" });
    }

    await listing.deleteOne();
    res.json({ message: "Listing deleted successfully" });
  } catch (error) {
    next(error);
  }
};

// @desc    Get listings owned by the logged-in host
// @route   GET /api/listings/host/mine
const getMyListings = async (req, res, next) => {
  try {
    const listings = await Listing.find({ host: req.user._id }).sort({ createdAt: -1 });
    res.json({ listings });
  } catch (error) {
    next(error);
  }
};

// @desc    Check availability for a date range
// @route   GET /api/listings/:id/availability
const checkAvailability = async (req, res, next) => {
  try {
    const { checkIn, checkOut } = req.query;
    if (!checkIn || !checkOut) {
      return res.status(400).json({ message: "checkIn and checkOut are required" });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);

    if (isNaN(start) || isNaN(end) || start >= end) {
      return res.status(400).json({ message: "Invalid date range" });
    }

    const conflict = await Booking.findOne({
      listing: req.params.id,
      status: "confirmed",
      checkIn: { $lt: end },
      checkOut: { $gt: start },
    });

    res.json({ available: !conflict });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getListings,
  getListingById,
  createListing,
  updateListing,
  deleteListing,
  getMyListings,
  checkAvailability,
};
