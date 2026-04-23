import API from './axiosInstance';

export const getUsuarios = () => API.get('/usuarios');

export const changeUsuarioRol = (id, rol) =>
  API.patch(`/usuarios/${id}/rol`, { rol });

export const deleteUsuario = (id) => API.delete(`/usuarios/${id}`);
