import api from './api';

export const getListingReviews = (listingId) =>
  api.get(`/listings/${listingId}/reviews`).then((r) => r.data.data);
export const createReview = (listingId, payload) =>
  api.post(`/listings/${listingId}/reviews`, payload).then((r) => r.data.data);
export const deleteReview = (id) => api.delete(`/reviews/${id}`).then((r) => r.data);
