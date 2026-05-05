import API from './axiosInstance';

export const getFeatureFlags = () => API.get('/feature-flags');
export const toggleFeatureFlag = (id) => API.patch(`/feature-flags/${id}/toggle`);
