import API from './axiosInstance';

export const getVacantes = () => API.get('/vacantes');

export const getVacanteById = (id) => API.get(`/vacantes/${id}`);

export const createVacante = (data) => API.post('/vacantes', data);

export const updateVacante = (id, data) => API.put(`/vacantes/${id}`, data);

export const deleteVacante = (id) => API.delete(`/vacantes/${id}`);
