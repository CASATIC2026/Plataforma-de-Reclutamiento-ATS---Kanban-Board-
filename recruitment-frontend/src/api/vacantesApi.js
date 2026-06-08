import API from './axiosInstance';

export const getVacantes = (params = {}) => {
  const query = new URLSearchParams();
  if (params.companyId) query.append('companyId', params.companyId);
  const qs = query.toString();
  return API.get(`/vacantes${qs ? `?${qs}` : ''}`);
};

export const getVacanteById = (id) => API.get(`/vacantes/${id}`);

export const createVacante = (data, params = {}) => {
  const query = new URLSearchParams();
  if (params.companyId) query.append('companyId', params.companyId);
  const qs = query.toString();
  return API.post(`/vacantes${qs ? `?${qs}` : ''}`, data);
};

export const updateVacante = (id, data) => API.put(`/vacantes/${id}`, data);

export const deleteVacante = (id) => API.delete(`/vacantes/${id}`);
