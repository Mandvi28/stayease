import api from './api';

export const updateProfile = (formData) =>
  api.put('/users/me', formData, { headers: { 'Content-Type': 'multipart/form-data' } }).then((r) => r.data);
export const becomeHost = () => api.put('/users/become-host').then((r) => r.data);
