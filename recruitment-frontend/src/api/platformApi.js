import API from './axiosInstance';

export const getPlatformOverview = () => API.get('/platform/overview');
