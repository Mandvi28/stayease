import api from './api';

export const getStats = () => api.get('/admin/stats').then((r) => r.data.data);
export const getAllUsers = () => api.get('/admin/users').then((r) => r.data.data);
export const getAllListingsAdmin = () => api.get('/admin/listings').then((r) => r.data.data);
export const removeListingAdmin = (id) => api.delete(`/admin/listings/${id}`).then((r) => r.data);
export const getAllBookingsAdmin = () => api.get('/admin/bookings').then((r) => r.data.data);
