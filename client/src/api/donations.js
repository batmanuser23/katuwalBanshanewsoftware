// src/api/donations.js - UPDATED
import axios from './axios';

export const getDonations = async (params = {}) => {
  const { data } = await axios.get('/donations', { params });
  return data;
};

export const getDonationById = async (id) => {
  const { data } = await axios.get(`/donations/${id}`);
  return data;
};

export const createDonation = async (donationData) => {
  const { data } = await axios.post('/donations', donationData);
  return data;
};

export const updateDonation = async (id, donationData) => {
  const { data } = await axios.put(`/donations/${id}`, donationData);
  return data;
};

export const deleteDonation = async (id) => {
  const { data } = await axios.delete(`/donations/${id}`);
  return data;
};

export const getDonationStats = async () => {
  const { data } = await axios.get('/donations/stats');
  return data;
};

export const exportAllDonations = async () => {
  const { data } = await axios.get('/donations/export/all', {
    responseType: 'blob',
  });
  return data;
};

export const exportDonation = async (id) => {
  const { data } = await axios.get(`/donations/export/${id}`, {
    responseType: 'blob',
  });
  return data;
};