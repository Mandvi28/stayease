// Populates MongoDB with demo users and listings for local testing.
// Run with: npm run seed   (from the backend/ folder)
// Destroy with: npm run seed:destroy
require("dotenv").config({ path: require("path").resolve(__dirname, "../.env") });
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const connectDB = require("../config/db");
const User = require("../models/User");
const Listing = require("../models/Listing");
const Booking = require("../models/Booking");
const Review = require("../models/Review");
const Wishlist = require("../models/Wishlist");

const placeholderImage = (seed) => ({
  url: `https://picsum.photos/seed/${seed}/1200/800`,
  publicId: "",
});

const run = async () => {
  await connectDB();

  if (process.argv.includes("-d")) {
    await Promise.all([
      User.deleteMany(),
      Listing.deleteMany(),
      Booking.deleteMany(),
      Review.deleteMany(),
      Wishlist.deleteMany(),
    ]);
    console.log("All StayEase data destroyed.");
    return process.exit(0);
  }

  await Promise.all([
    User.deleteMany(),
    Listing.deleteMany(),
    Booking.deleteMany(),
    Review.deleteMany(),
    Wishlist.deleteMany(),
  ]);

  const passwordHash = await bcrypt.hash("password123", 10);

  const [admin, hostAva, hostLiam, guestMaya, guestSam] = await User.create([
    { name: "Demo Admin", email: "admin@stayease.demo", password: passwordHash, role: "admin" },
    { name: "Ava Bennett", email: "ava.host@stayease.demo", password: passwordHash, role: "host" },
    { name: "Liam Torres", email: "liam.host@stayease.demo", password: passwordHash, role: "host" },
    { name: "Maya Chen", email: "maya.guest@stayease.demo", password: passwordHash, role: "guest" },
    { name: "Sam Okafor", email: "sam.guest@stayease.demo", password: passwordHash, role: "guest" },
  ]);

  const listingsData = [
    {
      title: "Sunlit Loft Near the Old Harbor",
      description:
        "A bright top-floor loft with exposed beams, a short walk from the harbor market. Great base for exploring the old town on foot.",
      pricePerNight: 82,
      address: "14 Harbor Lane",
      city: "Porto",
      country: "Portugal",
      propertyType: "Loft",
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      amenities: ["Wifi", "Kitchen", "Washer", "Self check-in"],
      host: hostAva._id,
      images: [placeholderImage("porto-loft-1"), placeholderImage("porto-loft-2")],
    },
    {
      title: "Modern Family Villa with Pool",
      description:
        "Spacious villa set in a quiet residential area, ten minutes from the beach. Private pool, garden, and a fully equipped kitchen for longer stays.",
      pricePerNight: 210,
      address: "8 Palm Grove Road",
      city: "Kochi",
      country: "India",
      propertyType: "Villa",
      bedrooms: 4,
      bathrooms: 3,
      maxGuests: 8,
      amenities: ["Wifi", "Pool", "Kitchen", "Parking", "Air conditioning"],
      host: hostAva._id,
      images: [placeholderImage("kochi-villa-1"), placeholderImage("kochi-villa-2")],
    },
    {
      title: "Cozy Mountain Cabin",
      description:
        "A wood-fired cabin tucked into the pines, twenty minutes from the ski lifts. Wake up to mountain views and quiet forest trails.",
      pricePerNight: 145,
      address: "22 Ridgeline Trail",
      city: "Aspen",
      country: "United States",
      propertyType: "Cabin",
      bedrooms: 2,
      bathrooms: 1,
      maxGuests: 4,
      amenities: ["Wifi", "Fireplace", "Kitchen", "Parking", "Heating"],
      host: hostLiam._id,
      images: [placeholderImage("aspen-cabin-1"), placeholderImage("aspen-cabin-2")],
    },
    {
      title: "Downtown Studio with Skyline View",
      description:
        "A compact, well-designed studio on the 18th floor with floor-to-ceiling windows. Steps from the subway and the financial district.",
      pricePerNight: 118,
      address: "500 5th Avenue",
      city: "New York",
      country: "United States",
      propertyType: "Apartment",
      bedrooms: 1,
      bathrooms: 1,
      maxGuests: 2,
      amenities: ["Wifi", "Elevator", "Gym access", "Air conditioning"],
      host: hostLiam._id,
      images: [placeholderImage("nyc-studio-1"), placeholderImage("nyc-studio-2")],
    },
    {
      title: "Whitewashed Cliffside Cottage",
      description:
        "A traditional cottage perched above the sea, with a private terrace for sunset views. A five-minute walk to the village square.",
      pricePerNight: 165,
      address: "3 Aegean Path",
      city: "Santorini",
      country: "Greece",
      propertyType: "Cottage",
      bedrooms: 2,
      bathrooms: 2,
      maxGuests: 4,
      amenities: ["Wifi", "Terrace", "Sea view", "Kitchen"],
      host: hostAva._id,
      images: [placeholderImage("santorini-cottage-1"), placeholderImage("santorini-cottage-2")],
    },
    {
      title: "Restored Farmhouse Retreat",
      description:
        "A quiet countryside farmstay surrounded by vineyards, with a wraparound porch and home-cooked breakfasts available on request.",
      pricePerNight: 96,
      address: "45 Vineyard Row",
      city: "Tuscany",
      country: "Italy",
      propertyType: "Farmstay",
      bedrooms: 3,
      bathrooms: 2,
      maxGuests: 6,
      amenities: ["Wifi", "Garden", "Parking", "Breakfast available"],
      host: hostLiam._id,
      images: [placeholderImage("tuscany-farm-1"), placeholderImage("tuscany-farm-2")],
    },
  ];

  const listings = await Listing.create(listingsData);

  // A sample past booking + review so the review flow has real data to show
  const pastCheckIn = new Date();
  pastCheckIn.setDate(pastCheckIn.getDate() - 20);
  const pastCheckOut = new Date();
  pastCheckOut.setDate(pastCheckOut.getDate() - 15);

  const pastBooking = await Booking.create({
    listing: listings[0]._id,
    guest: guestMaya._id,
    host: listings[0].host,
    checkIn: pastCheckIn,
    checkOut: pastCheckOut,
    guests: 2,
    nights: 5,
    pricePerNight: listings[0].pricePerNight,
    serviceFee: Math.round(listings[0].pricePerNight * 5 * 0.1),
    totalPrice: Math.round(listings[0].pricePerNight * 5 * 1.1),
    status: "completed",
  });

  await Review.create({
    listing: listings[0]._id,
    user: guestMaya._id,
    booking: pastBooking._id,
    rating: 5,
    comment: "Loved the location and the light in the mornings. Would stay again.",
  });

  await Listing.findByIdAndUpdate(listings[0]._id, { averageRating: 5, reviewCount: 1 });

  const upcomingCheckIn = new Date();
  upcomingCheckIn.setDate(upcomingCheckIn.getDate() + 10);
  const upcomingCheckOut = new Date();
  upcomingCheckOut.setDate(upcomingCheckOut.getDate() + 13);

  await Booking.create({
    listing: listings[2]._id,
    guest: guestSam._id,
    host: listings[2].host,
    checkIn: upcomingCheckIn,
    checkOut: upcomingCheckOut,
    guests: 3,
    nights: 3,
    pricePerNight: listings[2].pricePerNight,
    serviceFee: Math.round(listings[2].pricePerNight * 3 * 0.1),
    totalPrice: Math.round(listings[2].pricePerNight * 3 * 1.1),
    status: "confirmed",
  });

  await Wishlist.create({ user: guestMaya._id, listing: listings[4]._id });

  console.log("StayEase demo data seeded successfully.");
  console.log("Demo accounts (all use password: password123):");
  console.log(" - Admin: admin@stayease.demo");
  console.log(" - Host:  ava.host@stayease.demo");
  console.log(" - Host:  liam.host@stayease.demo");
  console.log(" - Guest: maya.guest@stayease.demo");
  console.log(" - Guest: sam.guest@stayease.demo");

  process.exit(0);
};

run().catch((err) => {
  console.error(err);
  process.exit(1);
});
