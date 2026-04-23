// Mock mode: usando datos simulados en lugar del backend
import { mockPostulacionesApi } from './mockData';

// Cambiar a false y descomentar las lineas con API real cuando el backend este disponible
const USE_MOCK = true;

// import API from './axiosInstance';
// export const getPostulaciones = () => API.get('/postulaciones');
// export const getPostulacionesByVacante = (vacanteId) => API.get(`/postulaciones/vacante/${vacanteId}`);
// export const createPostulacion = (formData) => API.post('/postulaciones', formData);
// export const updateEstado = (id, estado) => API.patch(`/postulaciones/${id}/estado`, { estado });
// export const updateNotas = (id, notas) => API.patch(`/postulaciones/${id}/notas`, { notas });
// export const fetchCvBlob = (id) => API.get(`/postulaciones/${id}/cv`, { responseType: 'blob' });
// export const deletePostulacion = (id) => API.delete(`/postulaciones/${id}`);

export const getPostulaciones = () => {
  if (USE_MOCK) return mockPostulacionesApi.getAll();
  // return API.get('/postulaciones');
};

export const getPostulacionesByVacante = (vacanteId) => {
  if (USE_MOCK) return mockPostulacionesApi.getByVacante(vacanteId);
  // return API.get(`/postulaciones/vacante/${vacanteId}`);
};

export const createPostulacion = (formData) => {
  if (USE_MOCK) return mockPostulacionesApi.create(formData);
  // return API.post('/postulaciones', formData);
};

export const updateEstado = (id, estado) => {
  if (USE_MOCK) return mockPostulacionesApi.updateEstado(id, estado);
  // return API.patch(`/postulaciones/${id}/estado`, { estado });
};

export const updateNotas = (id, notas) => {
  if (USE_MOCK) return mockPostulacionesApi.updateNotas(id, notas);
  // return API.patch(`/postulaciones/${id}/notas`, { notas });
};

export const getCvUrl = (id) => `/api/postulaciones/${id}/cv`;

export const fetchCvBlob = (id) => {
  if (USE_MOCK) {
    // Simular blob vacio para mock
    return Promise.resolve({ data: new Blob(['CV Mock Data'], { type: 'application/pdf' }) });
  }
  // return API.get(`/postulaciones/${id}/cv`, { responseType: 'blob' });
};

export const deletePostulacion = (id) => {
  if (USE_MOCK) return mockPostulacionesApi.delete(id);
  // return API.delete(`/postulaciones/${id}`);
};
