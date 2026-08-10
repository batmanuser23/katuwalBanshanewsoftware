import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const familySchema = new mongoose.Schema(
  {
    uuid: {
      type: String,
      default: uuidv4,
      unique: true,
      index: true,
    },
    familyName: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    familyNumber: {
      type: String,
      required: true,
      trim: true,
      index: true,
    },
    house: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'House',
      required: true,
      index: true,
    },
    vanshaGenerationNumber: {
      type: String,
      trim: true,
      index: true,
    },
    familyHead: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
      index: true,
    },
    clan: {
      type: String,
      trim: true,
    },
    origin: {
      type: String,
      trim: true,
    },
    currentAddress: {
      type: String,
      trim: true,
    },
    headOfFamily: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Member',
    },
    totalMembers: {
      type: Number,
      default: 0,
    },
    totalGenerations: {
      type: Number,
      default: 0,
    },
    familyPhoto: {
      type: String,
      default: null,
    },
    description: {
      type: String,
      trim: true,
    },
    status: {
      type: String,
      enum: ['open', 'closed'],
      default: 'open',
    },
    closedAt: {
      type: Date,
      default: null,
    },
    closedReason: {
      type: String,
      trim: true,
    },
    reopenedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

// Compound index for house + familyNumber uniqueness
familySchema.index({ house: 1, familyNumber: 1 }, { unique: true });

// Indexes for performance
familySchema.index({ familyName: 'text' });
familySchema.index({ status: 1 });
familySchema.index({ clan: 1 });

// Virtual populate: Family -> Members
familySchema.virtual('members', {
  ref: 'Member',
  localField: '_id',
  foreignField: 'family',
});

familySchema.set('toJSON', { virtuals: true });
familySchema.set('toObject', { virtuals: true });

// Pre-save hook for auto-generating familyNumber within house
familySchema.pre('save', async function () {
  if (this.isNew && !this.familyNumber) {
    const lastFamily = await this.constructor
      .findOne({ house: this.house })
      .sort({ familyNumber: -1 });

    const lastNumber = lastFamily ? parseInt(lastFamily.familyNumber, 10) : 0;
    this.familyNumber = String(lastNumber + 1);
  }
});

export default mongoose.model('Family', familySchema);