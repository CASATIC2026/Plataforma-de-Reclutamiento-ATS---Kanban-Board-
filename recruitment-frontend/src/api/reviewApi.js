import API from './axiosInstance';

export const getPendingReviews = (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.vacanteId)    params.append('vacanteId', filters.vacanteId);
  if (filters.scoreMin != null) params.append('scoreMin', filters.scoreMin);
  if (filters.scoreMax != null) params.append('scoreMax', filters.scoreMax);
  if (filters.hoursLeftMin != null) params.append('hoursLeftMin', filters.hoursLeftMin);
  if (filters.hoursLeftMax != null) params.append('hoursLeftMax', filters.hoursLeftMax);
  const qs = params.toString();
  return API.get(`/review/pending${qs ? `?${qs}` : ''}`).then((r) => r.data);
};

export const approveApplication = (id) =>
  API.post(`/review/${id}/approve`);

export const rejectApplication = (id, reason) =>
  API.post(`/review/${id}/reject`, { reason });

export const bulkApprove = (ids) =>
  API.post('/review/bulk-approve', ids);

export const bulkReject = (ids, reason) =>
  API.post('/review/bulk-reject', { ids, reason });

export const getReviewStats = () =>
  API.get('/review/stats').then((r) => r.data);
