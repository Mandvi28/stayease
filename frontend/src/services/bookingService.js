import api from './api';

export const createBooking = (payload) => api.post('/bookings', payload).then((r) => r.data.data);
export const getMyBookings = () => api.get('/bookings/my').then((r) => r.data.data);
export const getHostBookings = () => api.get('/bookings/host').then((r) => r.data.data);
export const cancelBooking = (id) => api.put(`/bookings/${id}/cancel`).then((r) => r.data.data);
