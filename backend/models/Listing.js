const mongoose = require("mongoose");

const listingSchema = new mongoose.Schema(
  {
    title: { type: String, required: [true, "Title is required"], trim: true },
    description: { type: String, required: [true, "Description is required"] },
    images: [
      {
        url: { type: String, required: true },
        publicId: { type: String, default: "" },
      },
    ],
    pricePerNight: { type: Number, required: [true, "Price is required"], min: 0 },
    address: { type: String, required: [true, "Address is required"] },
    city: { type: String, required: [true, "City is required"], trim: true },
    country: { type: String, required: [true, "Country is required"], trim: true },
    propertyType: {
      type: String,
      enum: ["Apartment", "House", "Villa", "Cabin", "Cottage", "Loft", "Farmstay"],
      required: true,
    },
    bedrooms: { type: Number, required: true, min: 0 },
    bathrooms: { type: Number, required: true, min: 0 },
    maxGuests: { type: Number, required: true, min: 1 },
    amenities: [{ type: String }],
    host: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    averageRating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

listingSchema.index({ city: "text", country: "text", title: "text" });

module.exports = mongoose.model("Listing", listingSchema);
