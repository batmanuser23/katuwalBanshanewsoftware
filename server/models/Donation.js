// backend/src/models/Donation.js - UPDATED (purpose removed, paymentStatus added)
import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const donationSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  
  // Donor Information
  donorType: {
    type: String,
    enum: ['member', 'family', 'external'],
    default: 'external',
    required: true,
  },
  donorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    default: null,
  },
  donorName: {
    type: String,
    required: true,
    trim: true,
  },
  donorPhone: {
    type: String,
    trim: true,
  },
  donorEmail: {
    type: String,
    trim: true,
    lowercase: true,
  },
  
  // Donation Details
  amount: {
    type: Number,
    required: true,
    min: 0,
  },
  paymentMethod: {
    type: String,
    enum: ['qr', 'cash', 'bank_transfer', 'cheque'],
    default: 'cash',
    required: true,
  },
  category: {
    type: String,
    enum: ['general', 'temple', 'education', 'emergency', 'event', 'other'],
    default: 'general',
  },
  donationDate: {
    type: Date,
    default: Date.now,
  },
  receiptNumber: {
    type: String,
    unique: true,
    trim: true,
  },
  
  // QR Payment Specific Fields
  qrPaymentCompleted: {
    type: Boolean,
    default: false,
  },
  qrPaymentDate: {
    type: Date,
    default: null,
  },
  qrPaymentReference: {
    type: String,
    trim: true,
  },
  
  // Additional Information
  remarks: {
    type: String,
    trim: true,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  
  // Status - NEW
  paymentStatus: {
    type: String,
    enum: ['pending', 'paid', 'failed'],
    default: 'pending',
  },
  
  // Audit
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

// Indexes for performance
donationSchema.index({ donorName: 1 });
donationSchema.index({ donorPhone: 1 });
donationSchema.index({ amount: 1 });
donationSchema.index({ paymentMethod: 1 });
donationSchema.index({ donationDate: -1 });
donationSchema.index({ paymentStatus: 1 });
donationSchema.index({ receiptNumber: 1 });

export default mongoose.model('Donation', donationSchema);