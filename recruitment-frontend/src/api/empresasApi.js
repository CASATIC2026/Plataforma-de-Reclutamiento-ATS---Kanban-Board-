import API from './axiosInstance';

export const getEmpresas = () => API.get('/empresas');
export const getEmpresaById = (id) => API.get(`/empresas/${id}`);
export const createEmpresa = (data) => API.post('/empresas', data);
export const updateEmpresa = (id, data) => API.put(`/empresas/${id}`, data);
export const disableEmpresa = (id) => API.delete(`/empresas/${id}`);
