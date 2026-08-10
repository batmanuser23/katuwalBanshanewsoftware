// // // src/api/members.js
// // import axios from './axios';

// // export const getMembers = async (params = {}) => {
// //   const { data } = await axios.get('/members', { params });
// //   return data;
// // };

// // export const getMemberById = async (id) => {
// //   const { data } = await axios.get(`/members/${id}`);
// //   return data;
// // };

// // export const createMember = async (formData) => {
// //   const { data } = await axios.post('/members', formData, {
// //     headers: { 'Content-Type': 'multipart/form-data' },
// //   });
// //   return data;
// // };

// // export const updateMember = async (id, formData) => {
// //   const { data } = await axios.put(`/members/${id}`, formData, {
// //     headers: { 'Content-Type': 'multipart/form-data' },
// //   });
// //   return data;
// // };

// // export const deleteMember = async (id) => {
// //   const { data } = await axios.delete(`/members/${id}`);
// //   return data;
// // };

// // export const searchMembers = async (query) => {
// //   const { data } = await axios.get('/members/search', { params: { query } });
// //   return data;
// // };

// // export const getMemberStats = async () => {
// //   const { data } = await axios.get('/members/stats');
// //   return data;
// // };

// // export const getMembersByFamily = async (familyId) => {
// //   const { data } = await axios.get(`/members/family/${familyId}`);
// //   return data;
// // };



// // src/api/members.js
// import axios from 'axios';

// const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// export const getMembers = async (params) => {
//   const { data } = await axios.get(`${API_URL}/members`, { params });
//   return data;
// };

// export const getMemberById = async (id) => {
//   const { data } = await axios.get(`${API_URL}/members/${id}`);
//   return data;
// };

// export const createMember = async (formData) => {
//   const { data } = await axios.post(`${API_URL}/members`, formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
//   return data;
// };

// export const updateMember = async (id, formData) => {
//   const { data } = await axios.put(`${API_URL}/members/${id}`, formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
//   return data;
// };

// export const deleteMember = async (id) => {
//   const { data } = await axios.delete(`${API_URL}/members/${id}`);
//   return data;
// };

// export const getMemberStats = async () => {
//   const { data } = await axios.get(`${API_URL}/members/stats`);
//   return data;
// };

// export const getMembersByFamily = async (familyId) => {
//   const { data } = await axios.get(`${API_URL}/members/family/${familyId}`);
//   return data;
// };

// export const exportMembers = async (params) => {
//   const { data } = await axios.get(`${API_URL}/members/export`, { 
//     params,
//     responseType: 'blob',
//   });
//   return data;
// };
// src/api/members.js
// import axios from './axios';

// export const getMembers = async (params = {}) => {
//   const { data } = await axios.get('/members', { params });
//   return data;
// };

// export const getMemberById = async (id) => {
//   const { data } = await axios.get(`/members/${id}`);
//   return data;
// };

// export const createMember = async (formData) => {
//   const { data } = await axios.post('/members', formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
//   return data;
// };

// export const updateMember = async (id, formData) => {
//   const { data } = await axios.put(`/members/${id}`, formData, {
//     headers: { 'Content-Type': 'multipart/form-data' },
//   });
//   return data;
// };

// export const deleteMember = async (id) => {
//   const { data } = await axios.delete(`/members/${id}`);
//   return data;
// };

// export const searchMembers = async (query) => {
//   const { data } = await axios.get('/members/search', { params: { query } });
//   return data;
// };

// export const getMemberStats = async () => {
//   const { data } = await axios.get('/members/stats');
//   return data;
// };

// export const getMembersByFamily = async (familyId) => {
//   const { data } = await axios.get(`/members/family/${familyId}`);
//   return data;
// };

// export const exportMembers = async (params) => {
//   const { data } = await axios.get('/members/export', { 
//     params,
//     responseType: 'blob',
//   });
//   return data;
// };

// src/api/members.js - COMPLETE UPDATED FILE
import axios from './axios';

export const getMembers = async (params = {}) => {
  const { data } = await axios.get('/members', { params });
  return data;
};

export const getMemberById = async (id) => {
  const { data } = await axios.get(`/members/${id}`);
  return data;
};

export const createMember = async (formData) => {
  const { data } = await axios.post('/members', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const updateMember = async (id, formData) => {
  const { data } = await axios.put(`/members/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return data;
};

export const deleteMember = async (id) => {
  const { data } = await axios.delete(`/members/${id}`);
  return data;
};

export const searchMembers = async (query) => {
  const { data } = await axios.get('/members/search', { params: { query } });
  return data;
};

export const getMemberStats = async () => {
  const { data } = await axios.get('/members/stats');
  return data;
};

export const getMembersByFamily = async (familyId) => {
  const { data } = await axios.get(`/members/family/${familyId}`);
  return data;
};

export const exportMembers = async (params) => {
  const { data } = await axios.get('/members/export', { 
    params,
    responseType: 'blob',
  });
  return data;
};

// NEW: Export all members with full details
export const exportAllMembers = async (params = {}) => {
  const response = await axios.get('/reports/export/members', {
    params,
    responseType: 'blob',
  });
  return response.data;
};

// NEW: Export family tree
export const exportFamilyTree = async (params = {}) => {
  const response = await axios.get('/reports/export/family-tree', {
    params,
  });
  return response.data;
};

// NEW: Get next roll number (for reference)
export const getNextRollNumber = async () => {
  const { data } = await axios.get('/members/next-roll-number');
  return data;
};