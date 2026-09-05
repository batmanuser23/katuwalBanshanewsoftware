// // src/api/families.js
// import axios from './axios';

// export const getFamilies = async (params = {}) => {
//   const { data } = await axios.get('/family', { params });
//   return data;
// };



// // NEW: Get family tree for a specific family
// export const getFamilyTreeByFamily = async (familyId) => {
//   const { data } = await axios.get(`/family/${familyId}/tree`);
//   return data;
// };

// export const getFamilyById = async (id) => {
//   const { data } = await axios.get(`/family/${id}`);
//   return data;
// };

// export const createFamily = async (formData) => {
//   const { data } = await axios.post('/family', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
//   return data;
// };

// export const updateFamily = async (id, formData) => {
//   const { data } = await axios.put(`/family/${id}`, formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
//   return data;
// };

// export const deleteFamily = async (id) => {
//   const { data } = await axios.delete(`/family/${id}`);
//   return data;
// };

// export const getFamilyStats = async () => {
//   const { data } = await axios.get('/family/stats');
//   return data;
// };

// import axios from './axios';

// export const getFamilies = async (params = {}) => {
//   const { data } = await axios.get('/family', { params });
//   return data;
// };

// // Get family tree for a specific family
// export const getFamilyTreeByFamily = async (familyId) => {
//   const { data } = await axios.get(`/family/${familyId}/tree`);
//   return data;
// };

// export const getFamilyById = async (id) => {
//   const { data } = await axios.get(`/family/${id}`);
//   return data;
// };

// export const createFamily = async (formData) => {
//   const { data } = await axios.post('/family', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
//   return data;
// };

// export const updateFamily = async (id, formData) => {
//   const { data } = await axios.put(`/family/${id}`, formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
//   return data;
// };

// export const deleteFamily = async (id) => {
//   const { data } = await axios.delete(`/family/${id}`);
//   return data;
// };

// export const getFamilyStats = async () => {
//   const { data } = await axios.get('/family/stats');
//   return data;
// };

// src/api/families.js - UPDATED
import api from './axios';

export const getFamilies = async (params = {}) => {
  const response = await api.get('/families', { params });
  return response.data;
};

export const getFamilyById = async (id) => {
  const response = await api.get(`/families/${id}`);
  return response.data;
};

export const getFamilyTreeByFamily = async (familyId) => {
  const response = await api.get(`/families/${familyId}/tree`);
  return response.data;
};

export const createFamily = async (data) => {
  const response = await api.post('/families', data);
  return response.data;
};

export const updateFamily = async (id, data) => {
  const response = await api.put(`/families/${id}`, data);
  return response.data;
};

export const deleteFamily = async (id) => {
  const response = await api.delete(`/families/${id}`);
  return response.data;
};

// NEW: Close family
export const closeFamily = async (id, reason) => {
  const response = await api.post(`/families/${id}/close`, { reason });
  return response.data;
};

// NEW: Reopen family
export const reopenFamily = async (id) => {
  const response = await api.post(`/families/${id}/reopen`);
  return response.data;
};

// NEW: Get next family number for a house
export const getNextFamilyNumber = async (houseId) => {
  const response = await api.get(`/families/next-number/${houseId}`);
  return response.data;
};

// NEW: Get next vansha number for a family
export const getNextVanshaNumber = async (familyId) => {
  const response = await api.get(`/families/next-vansha/${familyId}`);
  return response.data;
};


export const getFamilyBanshaNumbers = async (familyId) => {
  const response = await api.get(`/families/${familyId}/bansha-numbers`);
  return response.data;
};