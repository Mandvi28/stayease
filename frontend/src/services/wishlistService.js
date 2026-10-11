import api from './api';

export const getWishlist = () => api.get('/wishlist').then((r) => r.data.data);
export const addToWishlist = (listingId) =>
  api.post(`/wishlist/${listingId}`).then((r) => r.data);
export const removeFromWishlist = (listingId) =>
  api.delete(`/wishlist/${listingId}`).then((r) => r.data);
