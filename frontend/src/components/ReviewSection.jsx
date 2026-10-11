import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Star } from 'lucide-react';
import { getListingReviews, createReview } from '../services/reviewService';
import { getMyBookings } from '../services/bookingService';
import { useAuth } from '../context/AuthContext';
import RatingStars from './RatingStars';

const ReviewSection = ({ listingId }) => {
  const { user } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [eligibleBooking, setEligibleBooking] = useState(null);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const loadReviews = () => {
    getListingReviews(listingId).then(setReviews).catch(() => {});
  };

  useEffect(() => {
    loadReviews();
  }, [listingId]);

  useEffect(() => {
    if (!user) return;
    getMyBookings()
      .then((bookings) => {
        const today = new Date();
        const already = new Set(); // reviews already fetched separately
        const candidate = bookings.find(
          (b) =>
            b.listing?._id === listingId &&
            b.status !== 'cancelled' &&
            new Date(b.checkIn) <= today
        );
        setEligibleBooking(candidate || null);
      })
      .catch(() => {});
  }, [user, listingId]);

  const alreadyReviewed = eligibleBooking && reviews.some((r) => r.user?._id === user?._id);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!eligibleBooking) return;
    if (!comment.trim()) return toast.error('Add a few words about your stay');

    setSubmitting(true);
    try {
      await createReview(listingId, { rating, comment, bookingId: eligibleBooking._id });
      toast.success('Review posted');
      setComment('');
      loadReviews();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <div className="mb-4 flex items-center gap-3">
        <h2 className="font-display text-xl text-pine-900">Reviews</h2>
        {reviews.length > 0 && <RatingStars rating={reviews.reduce((s, r) => s + r.rating, 0) / reviews.length} count={reviews.length} />}
      </div>

      {eligibleBooking && !alreadyReviewed && (
        <form onSubmit={handleSubmit} className="mb-6 card-surface p-4">
          <p className="mb-2 text-sm font-medium text-pine-700">Rate your stay</p>
          <div className="mb-3 flex gap-1">
            {[1, 2, 3, 4, 5].map((n) => (
              <button type="button" key={n} onClick={() => setRating(n)}>
                <Star
                  size={22}
                  className={n <= rating ? 'fill-amber-500 text-amber-500' : 'text-pine-200'}
                />
              </button>
            ))}
          </div>
          <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Share details of your stay…"
            className="input-field mb-3 min-h-[90px]"
          />
          <button type="submit" disabled={submitting} className="btn-primary">
            {submitting ? 'Posting…' : 'Post review'}
          </button>
        </form>
      )}

      {reviews.length === 0 ? (
        <p className="text-sm text-pine-400">No reviews yet - be the first to stay and share your thoughts.</p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {reviews.map((review) => (
            <div key={review._id} className="card-surface p-4">
              <div className="mb-1 flex items-center justify-between">
                <p className="font-medium text-pine-900">{review.user?.name || 'Guest'}</p>
                <RatingStars rating={review.rating} showValue={false} />
              </div>
              <p className="text-xs text-pine-300">
                {new Date(review.createdAt).toLocaleDateString()}
              </p>
              <p className="mt-2 text-sm text-pine-600">{review.comment}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewSection;
