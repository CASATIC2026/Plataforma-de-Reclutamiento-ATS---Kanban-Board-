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

export const sendEmailNow = (id) =>
  API.post(`/postulaciones/${id}/send-email-now`);

export const cancelEmail = (id) =>
  API.post(`/postulaciones/${id}/cancel-email`);

export const restartEmailTimer = (id, minutes) =>
  API.post(`/postulaciones/${id}/restart-timer${minutes ? `?minutes=${minutes}` : ''}`);

export const getEmailLog = (id) =>
  API.get(`/postulaciones/${id}/email-log`).then((r) => r.data);
