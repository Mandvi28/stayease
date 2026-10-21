import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import toast from "react-hot-toast";
import { MapPin, Users, BedDouble, Bath, Heart, ImageOff } from "lucide-react";
import StarRating from "../components/StarRating.jsx";
import LoadingSpinner from "../components/LoadingSpinner.jsx";
import api from "../services/api.js";
import { useAuth } from "../context/AuthContext.jsx";
import { formatCurrency, formatDate, nightsBetween } from "../utils/format.js";
import ImageCarousel from "../components/ImageCarousel.jsx";

const ListingDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [listing, setListing] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [activeImage, setActiveImage] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);

  const [checkIn, setCheckIn] = useState("");
  const [checkOut, setCheckOut] = useState("");
  const [guests, setGuests] = useState(1);
  const [booking, setBooking] = useState(false);

  const [reviewForm, setReviewForm] = useState({ rating: 5, comment: "" });
  const [eligibleBookings, setEligibleBookings] = useState([]);
  const [submittingReview, setSubmittingReview] = useState(false);

  const todayStr = new Date().toISOString().split("T")[0];

  useEffect(() => {
    setLoading(true);
    Promise.all([api.get(`/listings/${id}`), api.get(`/listings/${id}/reviews`)])
      .then(([listingRes, reviewsRes]) => {
        setListing(listingRes.data.listing);
        setReviews(reviewsRes.data.reviews);
      })
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  useEffect(() => {
    if (!user) return;
    api
      .get("/wishlist")
      .then((res) => setIsWishlisted(res.data.wishlist.some((w) => w.listing._id === id)))
      .catch(() => {});
    api
      .get("/bookings/my")
      .then((res) => {
        const eligible = res.data.bookings.filter(
          (b) => b.listing._id === id && (b.status === "completed" || b.status === "confirmed")
        );
        setEligibleBookings(eligible);
      })
      .catch(() => {});
  }, [user, id]);

  const nights = useMemo(() => nightsBetween(checkIn, checkOut), [checkIn, checkOut]);
  const subtotal = listing ? nights * listing.pricePerNight : 0;
  const serviceFee = Math.round(subtotal * 0.1 * 100) / 100;
  const total = Math.round((subtotal + serviceFee) * 100) / 100;

  const toggleWishlist = async () => {
    if (!user) {
      toast.error("Log in to save listings");
      return;
    }
    try {
      if (isWishlisted) {
        await api.delete(`/wishlist/${id}`);
        setIsWishlisted(false);
      } else {
        await api.post(`/wishlist/${id}`);
        setIsWishlisted(true);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleBooking = async (e) => {
    e.preventDefault();
    if (!user) {
      toast.error("Log in to book this stay");
      navigate("/login");
      return;
    }
    if (!checkIn || !checkOut) {
      toast.error("Select your check-in and check-out dates");
      return;
    }
    setBooking(true);
    try {
      await api.post("/bookings", { listingId: id, checkIn, checkOut, guests });
      toast.success("Booking confirmed!");
      navigate("/trips");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setBooking(false);
    }
  };

  const handleReviewSubmit = async (e) => {
    e.preventDefault();
    if (!eligibleBookings.length) return;
    setSubmittingReview(true);
    try {
      const res = await api.post(`/listings/${id}/reviews`, {
        rating: Number(reviewForm.rating),
        comment: reviewForm.comment,
        bookingId: eligibleBookings[0]._id,
      });
      setReviews((prev) => [res.data.review, ...prev]);
      setReviewForm({ rating: 5, comment: "" });
      toast.success("Review posted");
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmittingReview(false);
    }
  };

  if (loading) return <LoadingSpinner label="Loading stay" />;
  if (error || !listing) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-16 text-center">
        <p className="text-ink-700">{error || "Listing not found"}</p>
        <Link to="/listings" className="btn-secondary mt-4 inline-flex">
          Back to listings
        </Link>
      </div>
    );
  }

  const images = listing.images?.length ? listing.images : [];

  return (
    <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-medium text-ink-800 sm:text-3xl">{listing.title}</h1>
          <div className="mt-1 flex flex-wrap items-center gap-3 text-sm text-ink-500">
            <StarRating rating={listing.averageRating} />
            <span>·</span>
            <span>{listing.reviewCount} reviews</span>
            <span>·</span>
            <span className="flex items-center gap-1">
              <MapPin size={14} /> {listing.city}, {listing.country}
            </span>
          </div>
        </div>
        <button
          type="button"
          onClick={toggleWishlist}
          className="btn-secondary shrink-0"
          aria-label="Toggle wishlist"
        >
          <Heart size={16} className={isWishlisted ? "fill-sand-500 text-sand-500" : ""} />
          {isWishlisted ? "Saved" : "Save"}
        </button>
      </div>







{/*
      <div className="mt-6 grid grid-cols-4 grid-rows-2 gap-2 overflow-hidden rounded-2xl">
        {images.length ? (
          images.slice(0, 5).map((img, idx) => (
            <button
              type="button"
              key={idx}
              onClick={() => setActiveImage(idx)}
              className={`${idx === 0 ? "col-span-2 row-span-2" : "col-span-1 row-span-1"} h-full w-full`}
            >
              <img src={img.url} alt="" className="h-full w-full min-h-[120px] object-cover" />
            </button>
          ))
        ) : (
          <div className="col-span-4 row-span-2 flex h-72 items-center justify-center bg-ink-100 text-ink-400">
            <ImageOff size={32} />
          </div>
        )}
      </div>
*/}

<ImageCarousel images={images} className="mt-6 aspect-[16/9] w-full rounded-2xl" />




      <div className="mt-10 grid grid-cols-1 gap-10 lg:grid-cols-3">
        <div className="lg:col-span-2">
          <div className="flex flex-wrap items-center gap-4 border-b border-ink-100 pb-6 text-sm text-ink-600">
            <span className="flex items-center gap-1.5">
              <Users size={16} /> {listing.maxGuests} guests
            </span>
            <span className="flex items-center gap-1.5">
              <BedDouble size={16} /> {listing.bedrooms} bedrooms
            </span>
            <span className="flex items-center gap-1.5">
              <Bath size={16} /> {listing.bathrooms} bathrooms
            </span>
            <span>{listing.propertyType}</span>
          </div>

          <div className="border-b border-ink-100 py-6">
            <p className="text-sm text-ink-500">Hosted by</p>
            <p className="mt-1 font-medium text-ink-800">{listing.host?.name}</p>
          </div>

          <div className="border-b border-ink-100 py-6">
            <h2 className="text-lg font-medium text-ink-800">About this place</h2>
            <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-ink-600">
              {listing.description}
            </p>
          </div>

          <div className="border-b border-ink-100 py-6">
            <h2 className="text-lg font-medium text-ink-800">What this place offers</h2>
            <div className="mt-3 grid grid-cols-2 gap-2 text-sm text-ink-600">
              {listing.amenities?.length ? (
                listing.amenities.map((a) => <span key={a}>• {a}</span>)
              ) : (
                <span className="text-ink-400">No amenities listed</span>
              )}
            </div>
          </div>

          <div className="py-6">
            <div className="flex items-center gap-2">
              <StarRating rating={listing.averageRating} size={18} />
              <h2 className="text-lg font-medium text-ink-800">
                {listing.reviewCount} review{listing.reviewCount === 1 ? "" : "s"}
              </h2>
            </div>

            {user && eligibleBookings.length > 0 && (
              <form onSubmit={handleReviewSubmit} className="mt-4 space-y-3 rounded-xl border border-ink-100 p-4">
                <p className="text-sm font-medium text-ink-700">Leave a review</p>
                <select
                  value={reviewForm.rating}
                  onChange={(e) => setReviewForm({ ...reviewForm, rating: e.target.value })}
                  className="input-field w-32"
                >
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>
                      {r} star{r === 1 ? "" : "s"}
                    </option>
                  ))}
                </select>
                <textarea
                  required
                  value={reviewForm.comment}
                  onChange={(e) => setReviewForm({ ...reviewForm, comment: e.target.value })}
                  placeholder="Share how your stay went"
                  className="input-field min-h-[80px]"
                />
                <button type="submit" disabled={submittingReview} className="btn-primary">
                  {submittingReview ? "Posting..." : "Post review"}
                </button>
              </form>
            )}

            <div className="mt-6 grid grid-cols-1 gap-6 sm:grid-cols-2">
              {reviews.length === 0 ? (
                <p className="text-sm text-ink-500">No reviews yet for this stay.</p>
              ) : (
                reviews.map((review) => (
                  <div key={review._id}>
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-ink-800">{review.user?.name}</p>
                      <span className="text-xs text-ink-400">{formatDate(review.createdAt)}</span>
                    </div>
                    <StarRating rating={review.rating} showValue={false} />
                    <p className="mt-1 text-sm text-ink-600">{review.comment}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        <div>
          <form onSubmit={handleBooking} className="card sticky top-24 p-5">
            <p className="text-lg">
              <span className="font-semibold">{formatCurrency(listing.pricePerNight)}</span>
              <span className="text-sm text-ink-500"> / night</span>
            </p>

            <div className="mt-4 grid grid-cols-2 gap-2 rounded-xl border border-ink-200">
              <div className="border-r border-ink-200 p-2.5">
                <label className="block text-[10px] font-medium uppercase text-ink-500">Check-in</label>
                <input
                  type="date"
                  required
                  min={todayStr}
                  value={checkIn}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
              <div className="p-2.5">
                <label className="block text-[10px] font-medium uppercase text-ink-500">Check-out</label>
                <input
                  type="date"
                  required
                  min={checkIn || todayStr}
                  value={checkOut}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
              <div className="col-span-2 border-t border-ink-200 p-2.5">
                <label className="block text-[10px] font-medium uppercase text-ink-500">Guests</label>
                <input
                  type="number"
                  min="1"
                  max={listing.maxGuests}
                  value={guests}
                  onChange={(e) => setGuests(Number(e.target.value))}
                  className="w-full bg-transparent text-sm focus:outline-none"
                />
              </div>
            </div>

            <button type="submit" disabled={booking} className="btn-primary mt-4 w-full">
              {booking ? "Booking..." : "Confirm booking"}
            </button>

            {nights > 0 && (
              <div className="mt-4 space-y-2 text-sm text-ink-600">
                <div className="flex justify-between">
                  <span>
                    {formatCurrency(listing.pricePerNight)} × {nights} night{nights > 1 ? "s" : ""}
                  </span>
                  <span>{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Service fee</span>
                  <span>{formatCurrency(serviceFee)}</span>
                </div>
                <div className="flex justify-between border-t border-ink-100 pt-2 font-medium text-ink-800">
                  <span>Total</span>
                  <span>{formatCurrency(total)}</span>
                </div>
              </div>
            )}
            <p className="mt-3 text-xs text-ink-400">
              You won't be charged yet — this is a demo booking flow with no real payment.
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ListingDetails;
