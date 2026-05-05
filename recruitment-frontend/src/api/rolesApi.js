import API from './axiosInstance';

export const getRoles = () => API.get('/roles');
export const createRol = (data) => API.post('/roles', data);
export const updateRolPermisos = (id, permisos) => API.patch(`/roles/${id}/permisos`, { permisos });
export const assignRol = (data) => API.post('/roles/assign', data);
