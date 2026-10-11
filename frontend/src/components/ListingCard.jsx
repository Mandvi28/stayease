import { Link } from "react-router-dom";
import { Heart, Users } from "lucide-react";
import ImageCarousel from "./ImageCarousel.jsx";
import StarRating from "./StarRating.jsx";
import { formatCurrency } from "../utils/format.js";

const ListingCard = ({ listing, isWishlisted, onToggleWishlist }) => {
  return (
    <div className="group flex flex-col">
      <Link to={`/listings/${listing._id}`} className="block">
        <div className="relative">
          <ImageCarousel images={listing.images} className="aspect-[4/3] w-full rounded-xl" />
          {onToggleWishlist && (
            <button
              type="button"
              onClick={(e) => {
                e.preventDefault();
                onToggleWishlist(listing._id);
              }}
              aria-label={isWishlisted ? "Remove from wishlist" : "Save to wishlist"}
              className="absolute right-3 top-3 rounded-full bg-white/90 p-2 shadow transition hover:scale-105"
            >
              <Heart
                size={16}
                className={isWishlisted ? "fill-sand-500 text-sand-500" : "text-ink-600"}
              />
            </button>
          )}
        </div>
      </Link>
      <Link to={`/listings/${listing._id}`} className="mt-3 flex flex-col gap-0.5">
        <div className="flex items-start justify-between gap-2">
          <h3 className="line-clamp-1 font-medium text-ink-800">{listing.title}</h3>
          <StarRating rating={listing.averageRating} />
        </div>
        <p className="text-sm text-ink-500">
          {listing.city}, {listing.country}
        </p>
        <p className="text-sm text-ink-500">{listing.propertyType}</p>
        <div className="mt-1 flex items-center justify-between">
          <p className="text-sm text-ink-800">
            <span className="font-semibold">{formatCurrency(listing.pricePerNight)}</span> / night
          </p>
          <span className="flex items-center gap-1 text-xs text-ink-400">
            <Users size={13} /> {listing.maxGuests}
          </span>
        </div>
      </Link>
    </div>
  );
};

export default ListingCard;
