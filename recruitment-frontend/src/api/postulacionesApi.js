import API from './axiosInstance';

export const getPostulaciones = () => API.get('/postulaciones');

export const getPostulacionesByVacante = (vacanteId) =>
  API.get(`/postulaciones/vacante/${vacanteId}`);

export const createPostulacion = (formData) =>
  API.post('/postulaciones', formData);

export const updateEstado = (id, estado) =>
  API.patch(`/postulaciones/${id}/estado`, { estado });

export const updateNotas = (id, notas) =>
  API.patch(`/postulaciones/${id}/notas`, { notas });

export const getCvUrl = (id) => `/api/postulaciones/${id}/cv`;

export const fetchCvBlob = (id) =>
  API.get(`/postulaciones/${id}/cv`, { responseType: 'blob' });

export const deletePostulacion = (id) => API.delete(`/postulaciones/${id}`);

export const createPostulacionStructured = (formData) =>
  API.post('/postulaciones', formData);
