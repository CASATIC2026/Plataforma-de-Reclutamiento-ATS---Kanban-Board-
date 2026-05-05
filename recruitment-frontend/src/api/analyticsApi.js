import API from './axiosInstance';

export const getPipelineFunnel = (empresaId) =>
  API.get('/analytics/pipeline', { params: empresaId ? { empresaId } : {} });

export const getTimeToHire = (empresaId) =>
  API.get('/analytics/time-to-hire', { params: empresaId ? { empresaId } : {} });

export const getSources = (empresaId) =>
  API.get('/analytics/sources', { params: empresaId ? { empresaId } : {} });

export const getTeamActivity = (empresaId) =>
  API.get('/analytics/team', { params: empresaId ? { empresaId } : {} });
