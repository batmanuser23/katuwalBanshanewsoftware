// src/api/houses.js
import api from './axios';

export const getHouses = async (params = {}) => {
  const response = await api.get('/houses', { params });
  return response.data;
};

export const getHouseById = async (id) => {
  const response = await api.get(`/houses/${id}`);
  return response.data;
};

export const createHouse = async (data) => {
  const response = await api.post('/houses', data);
  return response.data;
};

export const updateHouse = async (id, data) => {
  const response = await api.put(`/houses/${id}`, data);
  return response.data;
};

export const deleteHouse = async (id) => {
  const response = await api.delete(`/houses/${id}`);
  return response.data;
};

export const getNextHouseNumber = async () => {
  const response = await api.get('/houses/next-number');
  return response.data;
};

export const getHouseStats = async () => {
  const response = await api.get('/houses/stats');
  return response.data;
};