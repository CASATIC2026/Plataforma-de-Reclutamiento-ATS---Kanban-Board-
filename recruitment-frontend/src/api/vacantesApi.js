import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

export const getVacantes = () => API.get('/vacantes');

export const getVacanteById = (id) => API.get(`/vacantes/${id}`);

export const createVacante = (data) => API.post('/vacantes', data);

export const updateVacante = (id, data) => API.put(`/vacantes/${id}`, data);

export const deleteVacante = (id) => API.delete(`/vacantes/${id}`);