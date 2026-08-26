// // // src/api/reports.js
// // import axios from './axios';

// // export const generateGenealogyReport = async (params = {}) => {
// //   const { data } = await axios.get('/reports/genealogy', { 
// //     params, 
// //     responseType: 'blob' 
// //   });
// //   return data;
// // };

// // export const generateFamilyReport = async (params = {}) => {
// //   const { data } = await axios.get('/reports/family', { 
// //     params, 
// //     responseType: 'blob' 
// //   });
// //   return data;
// // };

// // export const generateAllFamiliesReport = async (params = {}) => {
// //   const { data } = await axios.get('/reports/all-families', { 
// //     params, 
// //     responseType: 'blob' 
// //   });
// //   return data;
// // };

// // export const generateMemberReport = async (params = {}) => {
// //   const { data } = await axios.get('/reports/members', { 
// //     params, 
// //     responseType: 'blob' 
// //   });
// //   return data;
// // };

// // export const generateGenerationReport = async (params = {}) => {
// //   const { data } = await axios.get('/reports/generation', { 
// //     params, 
// //     responseType: 'blob' 
// //   });
// //   return data;
// // };

// // export const generateDonationReport = async (params = {}) => {
// //   const { data } = await axios.get('/reports/donation', { 
// //     params, 
// //     responseType: 'blob' 
// //   });
// //   return data;
// // };

// // export const generateDemographicReport = async (params = {}) => {
// //   const { data } = await axios.get('/reports/demographic', { 
// //     params, 
// //     responseType: 'blob' 
// //   });
// //   return data;
// // };

// // src/api/reports.js - UPDATED
// import api from './axios';

// export const generateFamilyReport = async (params) => {
//   const response = await api.get('/reports/family', { 
//     params,
//     responseType: 'blob' 
//   });
//   return response.data;
// };

// export const generateAllFamiliesReport = async (params) => {
//   const response = await api.get('/reports/all-families', { 
//     params,
//     responseType: 'blob' 
//   });
//   return response.data;
// };

// export const generateMemberReport = async (params) => {
//   const response = await api.get('/reports/members', { 
//     params,
//     responseType: 'blob' 
//   });
//   return response.data;
// };

// export const generateGenerationReport = async (params) => {
//   const response = await api.get('/reports/generation', { 
//     params,
//     responseType: 'blob' 
//   });
//   return response.data;
// };

// export const generateDonationReport = async (params) => {
//   const response = await api.get('/reports/donation', { 
//     params,
//     responseType: 'blob' 
//   });
//   return response.data;
// };

// export const generateDemographicReport = async (params) => {
//   const response = await api.get('/reports/demographic', { 
//     params,
//     responseType: 'blob' 
//   });
//   return response.data;
// };

// export const generateGenealogyReport = async (params) => {
//   const response = await api.get('/reports/genealogy', { 
//     params,
//     responseType: 'blob' 
//   });
//   return response.data;
// };

// // NEW: Export all members
// export const exportAllMembers = async (params) => {
//   const response = await api.get('/reports/export/members', { 
//     params,
//     responseType: 'blob' 
//   });
//   return response.data;
// };

// // NEW: Export family tree
// export const exportFamilyTree = async (params) => {
//   const response = await api.get('/reports/export/family-tree', { 
//     params 
//   });
//   return response.data;
// };


// src/api/reports.js - UPDATED
import axios from './axios';

export const generateFamilyReport = async (params) => {
  const response = await axios.get('/reports/family', { 
    params,
    responseType: 'blob' 
  });
  return response.data;
};

export const generateAllFamiliesReport = async (params) => {
  const response = await axios.get('/reports/all-families', { 
    params,
    responseType: 'blob' 
  });
  return response.data;
};

export const generateMemberReport = async (params) => {
  const response = await axios.get('/reports/members', { 
    params,
    responseType: 'blob' 
  });
  return response.data;
};

export const generateGenerationReport = async (params) => {
  const response = await axios.get('/reports/generation', { 
    params,
    responseType: 'blob' 
  });
  return response.data;
};

export const generateDonationReport = async (params) => {
  const response = await axios.get('/reports/donation', { 
    params,
    responseType: 'blob' 
  });
  return response.data;
};

export const generateDemographicReport = async (params) => {
  const response = await axios.get('/reports/demographic', { 
    params,
    responseType: 'blob' 
  });
  return response.data;
};

export const generateGenealogyReport = async (params) => {
  const response = await axios.get('/reports/genealogy', { 
    params,
    responseType: 'blob' 
  });
  return response.data;
};

export const exportAllMembers = async (params) => {
  const response = await axios.get('/reports/export/members', { 
    params,
    responseType: 'blob' 
  });
  return response.data;
};

export const exportFamilyTree = async (params) => {
  const response = await axios.get('/reports/export/family-tree', { 
    params,
    responseType: 'blob' 
  });
  return response.data;
};