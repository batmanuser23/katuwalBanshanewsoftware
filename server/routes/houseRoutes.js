// routes/houseRoutes.js
import express from 'express';
import {
  getHouses,
  getHouseById,
  createHouse,
  updateHouse,
  deleteHouse,
  getNextHouseNumber,
  getHouseStats,
} from '../controllers/houseController.js';
import { rateLimit } from '../middlewares/rateLimit.js';

const router = express.Router();

// Apply rate limiting
router.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 100 }));

// GET routes
router.get('/', getHouses);
router.get('/stats', getHouseStats);
router.get('/next-number', getNextHouseNumber);
router.get('/:id', getHouseById);

// POST routes
router.post('/', createHouse);

// PUT routes
router.put('/:id', updateHouse);

// DELETE routes
router.delete('/:id', deleteHouse);

export default router;