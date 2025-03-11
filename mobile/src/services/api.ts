import axios from 'axios';
import { config } from '../config';

// Using the computer's local IP address for network access
const API_URL = 'http://192.168.50.218:5000/api';

const api = axios.create({
  baseURL: config.apiUrl,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const fieldService = {
  getFields: () => api.get('/fields'),
  getField: (id: number) => api.get(`/fields/${id}`),
  createField: (data: any) => api.post('/fields', data),
  getFieldActivities: (fieldId: number) => api.get(`/fields/${fieldId}/activities`),
  createActivity: (data: any) => api.post('/activities', data),
};
