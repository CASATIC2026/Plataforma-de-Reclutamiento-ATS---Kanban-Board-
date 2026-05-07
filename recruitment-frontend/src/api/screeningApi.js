import API from './axiosInstance';

export const getScreeningQuestions = (vacanteId) =>
  API.get(`/vacantes/${vacanteId}/screening-questions`);

export const createScreeningQuestion = (vacanteId, data) =>
  API.post(`/vacantes/${vacanteId}/screening-questions`, data);

export const updateScreeningQuestion = (vacanteId, id, data) =>
  API.put(`/vacantes/${vacanteId}/screening-questions/${id}`, data);

export const deleteScreeningQuestion = (vacanteId, id) =>
  API.delete(`/vacantes/${vacanteId}/screening-questions/${id}`);
