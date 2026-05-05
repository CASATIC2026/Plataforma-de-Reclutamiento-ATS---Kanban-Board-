import API from './axiosInstance';

export const getAuditLogs = (params = {}) => API.get('/audit', { params });
