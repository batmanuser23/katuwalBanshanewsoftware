// models/House.js - FIXED (houseNumber not required - auto-generated)

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const houseSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
    index: true,
  },
  houseNumber: {
    type: String,
    // ⭐ REMOVED: required: true - auto-generated in pre-save
    unique: true,
    trim: true,
    index: true,
  },
  houseName: {
    type: String,
    trim: true,
  },
  address: {
    type: String,
    trim: true,
  },
  wardNumber: {
    type: String,
    trim: true,
  },
  toleVillage: {
    type: String,
    trim: true,
  },
  municipality: {
    type: String,
    trim: true,
  },
  district: {
    type: String,
    trim: true,
  },
  province: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    default: 'Nepal',
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  status: {
    type: String,
    enum: ['active', 'inactive'],
    default: 'active',
  },
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  updatedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
}, {
  timestamps: true,
});

// Indexes
houseSchema.index({ houseNumber: 1 });
houseSchema.index({ district: 1 });
houseSchema.index({ province: 1 });

// Virtual: families in this house
houseSchema.virtual('families', {
  ref: 'Family',
  localField: '_id',
  foreignField: 'house',
});

houseSchema.set('toJSON', { virtuals: true });
houseSchema.set('toObject', { virtuals: true });

// ⭐ FIXED: Pre-save hook for auto-generating houseNumber
houseSchema.pre('save', async function() {
  if (this.isNew && !this.houseNumber) {
    const lastHouse = await this.constructor.findOne().sort({ houseNumber: -1 });
    const lastNumber = lastHouse ? parseInt(lastHouse.houseNumber) : 0;
    this.houseNumber = String(lastNumber + 1);
    console.log(`🏠 Auto-generated houseNumber: ${this.houseNumber}`);
  }
});

export default mongoose.model('House', houseSchema);