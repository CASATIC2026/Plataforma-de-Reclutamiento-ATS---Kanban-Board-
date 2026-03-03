import axios from 'axios';

const API = axios.create({
  baseURL: '/api',
});

export const getPostulaciones = () => API.get('/postulaciones');

export const getPostulacionesByVacante = (vacanteId) =>
  API.get(`/postulaciones/vacante/${vacanteId}`);

export const createPostulacion = (formData) =>
  API.post('/postulaciones', formData);

export const deletePostulacion = (id) => API.delete(`/postulaciones/${id}`);
