// backend/src/routes/donationRoutes.js - UPDATED
import express from 'express';
import {
  getDonations,
  getDonationById,
  createDonation,
  updateDonation,
  deleteDonation,
  getDonationStats,
  exportAllDonationsToExcel,
  exportDonationToExcel,
} from '../controllers/donationController.js';
import { validate, donationValidation } from '../middlewares/validation.js';

const router = express.Router();

// Specific routes FIRST
router.get('/', getDonations);
router.get('/stats', getDonationStats);

// Excel export routes
router.get('/export/all', exportAllDonationsToExcel);
router.get('/export/:id', exportDonationToExcel);

// Dynamic route LAST
router.get('/:id', getDonationById);

// Protected routes
router.post('/', validate(donationValidation), createDonation);
router.put('/:id', validate(donationValidation), updateDonation);
router.delete('/:id', deleteDonation);

export default router;