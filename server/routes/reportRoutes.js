// // // routes/reportRoutes.js
// // import express from 'express';
// // import {
// //   generateGenealogyReport,
// //   generateFamilyReport,
// //   generateAllFamiliesReport,
// //   generateMemberReport,
// //   generateGenerationReport,
// //   generateDonationReport,
// //   generateDemographicReport,
// //   generateQRReport,
// // } from '../controllers/reportController.js';

// // const router = express.Router();

// // // All report routes
// // router.get('/genealogy', generateGenealogyReport);
// // router.get('/family', generateFamilyReport);
// // router.get('/all-families', generateAllFamiliesReport);
// // router.get('/members', generateMemberReport);
// // router.get('/generation', generateGenerationReport);
// // router.get('/donation', generateDonationReport);
// // router.get('/demographic', generateDemographicReport);
// // router.get('/qr', generateQRReport);

// // export default router;

// // routes/reportRoutes.js - UPDATED
// import express from 'express';
// import {
//   generateGenealogyReport,
//   generateFamilyReport,
//   generateAllFamiliesReport,
//   generateMemberReport,
//   generateGenerationReport,
//   generateDonationReport,
//   generateDemographicReport,
//   generateQRReport,
//   exportAllMembers,
//   exportFamilyTree,
// } from '../controllers/reportController.js';

// const router = express.Router();

// // All report routes
// router.get('/genealogy', generateGenealogyReport);
// router.get('/family', generateFamilyReport);
// router.get('/all-families', generateAllFamiliesReport);
// router.get('/members', generateMemberReport);
// router.get('/generation', generateGenerationReport);
// router.get('/donation', generateDonationReport);
// router.get('/demographic', generateDemographicReport);
// router.get('/qr', generateQRReport);

// // NEW: Export routes
// router.get('/export/members', exportAllMembers);
// router.get('/export/family-tree', exportFamilyTree);

// export default router;


// backend/src/routes/reportRoutes.js - UPDATED
import express from 'express';
import {
  generateGenealogyReport,
  generateFamilyReport,
  generateAllFamiliesReport,
  generateMemberReport,
  generateGenerationReport,
  generateDonationReport,
  generateDemographicReport,
  generateQRReport,
  exportAllMembers,
  exportFamilyTree,
} from '../controllers/reportController.js';

const router = express.Router();

// All report routes
router.get('/genealogy', generateGenealogyReport);
router.get('/family', generateFamilyReport);
router.get('/all-families', generateAllFamiliesReport);
router.get('/members', generateMemberReport);
router.get('/generation', generateGenerationReport);
router.get('/donation', generateDonationReport);
router.get('/demographic', generateDemographicReport);
router.get('/qr', generateQRReport);

// Export routes
router.get('/export/members', exportAllMembers);
router.get('/export/family-tree', exportFamilyTree);

export default router;