import API from './axiosInstance';

export const getMisPostulaciones = () => API.get('/candidato/postulaciones');
