const Booking = require("../models/Booking");
const Listing = require("../models/Listing");

const SERVICE_FEE_RATE = 0.1; // 10% service fee, kept simple and transparent

const msPerNight = 1000 * 60 * 60 * 24;

// @desc    Create a booking - re-validates dates and availability server-side
// @route   POST /api/bookings
const createBooking = async (req, res, next) => {
  try {
    const { listingId, checkIn, checkOut, guests } = req.body;

    if (!listingId || !checkIn || !checkOut || !guests) {
      return res.status(400).json({ message: "listingId, checkIn, checkOut and guests are required" });
    }

    const start = new Date(checkIn);
    const end = new Date(checkOut);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (isNaN(start.getTime()) || isNaN(end.getTime())) {
      return res.status(400).json({ message: "Invalid check-in or check-out date" });
    }
    if (start < today) {
      return res.status(400).json({ message: "Check-in date cannot be in the past" });
    }
    if (start >= end) {
      return res.status(400).json({ message: "Check-out date must be after check-in date" });
    }

    const listing = await Listing.findById(listingId);
    if (!listing || !listing.isActive) {
      return res.status(404).json({ message: "Listing not found" });
    }

    if (Number(guests) > listing.maxGuests) {
      return res.status(400).json({
        message: `This listing accommodates a maximum of ${listing.maxGuests} guests`,
      });
    }

    if (listing.host.toString() === req.user._id.toString()) {
      return res.status(400).json({ message: "Hosts cannot book their own listing" });
    }

    // Authoritative double-booking check - never trust the frontend for this
    const conflict = await Booking.findOne({
      listing: listingId,
      status: "confirmed",
      checkIn: { $lt: end },
      checkOut: { $gt: start },
    });

    if (conflict) {
      return res.status(409).json({ message: "These dates are no longer available for this listing" });
    }

    const nights = Math.round((end.getTime() - start.getTime()) / msPerNight);
    const subtotal = nights * listing.pricePerNight;
    const serviceFee = Math.round(subtotal * SERVICE_FEE_RATE * 100) / 100;
    const totalPrice = Math.round((subtotal + serviceFee) * 100) / 100;

    const booking = await Booking.create({
      listing: listing._id,
      guest: req.user._id,
      host: listing.host,
      checkIn: start,
      checkOut: end,
      guests,
      nights,
      pricePerNight: listing.pricePerNight,
      serviceFee,
      totalPrice,
      status: "confirmed",
    });

    const populated = await booking.populate("listing", "title images city country");

    res.status(201).json({ booking: populated });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings made by the logged-in guest
// @route   GET /api/bookings/my
const getMyBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ guest: req.user._id })
      .populate("listing", "title images city country pricePerNight")
      .sort({ checkIn: -1 });

    // Auto-flag past confirmed bookings as completed for display purposes
    const now = new Date();
    const enriched = bookings.map((b) => {
      const obj = b.toObject();
      if (obj.status === "confirmed" && new Date(obj.checkOut) < now) {
        obj.status = "completed";
      }
      return obj;
    });

    res.json({ bookings: enriched });
  } catch (error) {
    next(error);
  }
};

// @desc    Get bookings for listings owned by the logged-in host
// @route   GET /api/bookings/host
const getHostBookings = async (req, res, next) => {
  try {
    const bookings = await Booking.find({ host: req.user._id })
      .populate("listing", "title images city country")
      .populate("guest", "name email")
      .sort({ checkIn: -1 });

    res.json({ bookings });
  } catch (error) {
    next(error);
  }
};

// @desc    Cancel a booking (guest who booked it, or the host, or admin)
// @route   PUT /api/bookings/:id/cancel
const cancelBooking = async (req, res, next) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) {
      return res.status(404).json({ message: "Booking not found" });
    }

    const isGuest = booking.guest.toString() === req.user._id.toString();
    const isHost = booking.host.toString() === req.user._id.toString();

    if (!isGuest && !isHost && req.user.role !== "admin") {
      return res.status(403).json({ message: "You do not have permission to cancel this booking" });
    }

    if (booking.status !== "confirmed") {
      return res.status(400).json({ message: `Booking is already ${booking.status}` });
    }

    if (new Date(booking.checkIn) < new Date()) {
      return res.status(400).json({ message: "Past or in-progress bookings cannot be cancelled" });
    }

    booking.status = "cancelled";
    await booking.save();

    res.json({ booking });
  } catch (error) {
    next(error);
  }
};

module.exports = { createBooking, getMyBookings, getHostBookings, cancelBooking };
