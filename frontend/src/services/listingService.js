import api from './api';

export const getListings = (params) => api.get('/listings', { params }).then((r) => r.data);
export const getListingById = (id) => api.get(`/listings/${id}`).then((r) => r.data.data);
export const createListing = (payload) => api.post('/listings', payload).then((r) => r.data.data);
export const updateListing = (id, payload) =>
  api.put(`/listings/${id}`, payload).then((r) => r.data.data);
export const deleteListing = (id) => api.delete(`/listings/${id}`).then((r) => r.data);
export const getMyListings = () => api.get('/listings/host/mine').then((r) => r.data.data);
export const checkAvailability = (id, params) =>
  api.get(`/listings/${id}/availability`, { params }).then((r) => r.data.available);
export const uploadImages = (files) => {
  const formData = new FormData();
  files.forEach((file) => formData.append('images', file));
  return api
    .post('/uploads', formData, { headers: { 'Content-Type': 'multipart/form-data' } })
    .then((r) => r.data.data);
};
