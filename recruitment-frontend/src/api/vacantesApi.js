// Mock mode: usando datos simulados en lugar del backend
import { mockVacantesApi } from './mockData';

// Cambiar a false y descomentar las lineas con API real cuando el backend este disponible
const USE_MOCK = true;

// import API from './axiosInstance';
// export const getVacantes = () => API.get('/vacantes');
// export const getVacanteById = (id) => API.get(`/vacantes/${id}`);
// export const createVacante = (data) => API.post('/vacantes', data);
// export const updateVacante = (id, data) => API.put(`/vacantes/${id}`, data);
// export const deleteVacante = (id) => API.delete(`/vacantes/${id}`);

export const getVacantes = () => {
  if (USE_MOCK) return mockVacantesApi.getAll();
  // return API.get('/vacantes');
};

export const getVacanteById = (id) => {
  if (USE_MOCK) return mockVacantesApi.getById(id);
  // return API.get(`/vacantes/${id}`);
};

export const createVacante = (data) => {
  if (USE_MOCK) return mockVacantesApi.create(data);
  // return API.post('/vacantes', data);
};

export const updateVacante = (id, data) => {
  if (USE_MOCK) return mockVacantesApi.update(id, data);
  // return API.put(`/vacantes/${id}`, data);
};

export const deleteVacante = (id) => {
  if (USE_MOCK) return mockVacantesApi.delete(id);
  // return API.delete(`/vacantes/${id}`);
};
