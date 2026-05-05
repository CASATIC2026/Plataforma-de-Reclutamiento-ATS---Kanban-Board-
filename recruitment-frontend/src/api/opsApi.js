import API from './axiosInstance';

export const getDeployments = () => API.get('/ops/deployments');
export const triggerDeploy = () => API.post('/ops/deploy');
export const rollback = (id) => API.post(`/ops/rollback/${id}`);
