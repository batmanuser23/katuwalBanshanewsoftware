// import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';

// const familySchema = new mongoose.Schema(
//   {
//     uuid: {
//       type: String,
//       default: uuidv4,
//       unique: true,
//       index: true,
//     },
//     familyName: {
//       type: String,
//       required: true,
//       trim: true,
//       index: true,
//     },
//     familyNumber: {
//       type: String,
//       required: true,
//       trim: true,
//       index: true,
//     },
//     house: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'House',
//       required: true,
//       index: true,
//     },
//     vanshaGenerationNumber: {
//       type: String,
//       trim: true,
//       index: true,
//     },
//     familyHead: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Member',
//       index: true,
//     },
//     clan: {
//       type: String,
//       trim: true,
//     },
//     origin: {
//       type: String,
//       trim: true,
//     },
//     currentAddress: {
//       type: String,
//       trim: true,
//     },
//     headOfFamily: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Member',
//     },
//     totalMembers: {
//       type: Number,
//       default: 0,
//     },
//     totalGenerations: {
//       type: Number,
//       default: 0,
//     },
//     familyPhoto: {
//       type: String,
//       default: null,
//     },
//     description: {
//       type: String,
//       trim: true,
//     },
//     status: {
//       type: String,
//       enum: ['open', 'closed'],
//       default: 'open',
//     },
//     closedAt: {
//       type: Date,
//       default: null,
//     },
//     closedReason: {
//       type: String,
//       trim: true,
//     },
//     reopenedAt: {
//       type: Date,
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Compound index for house + familyNumber uniqueness
// familySchema.index({ house: 1, familyNumber: 1 }, { unique: true });

// // Indexes for performance
// familySchema.index({ familyName: 'text' });
// familySchema.index({ status: 1 });
// familySchema.index({ clan: 1 });

// // Virtual populate: Family -> Members
// familySchema.virtual('members', {
//   ref: 'Member',
//   localField: '_id',
//   foreignField: 'family',
// });

// familySchema.set('toJSON', { virtuals: true });
// familySchema.set('toObject', { virtuals: true });

// // Pre-save hook for auto-generating familyNumber within house
// familySchema.pre('save', async function () {
//   if (this.isNew && !this.familyNumber) {
//     const lastFamily = await this.constructor
//       .findOne({ house: this.house })
//       .sort({ familyNumber: -1 });

//     const lastNumber = lastFamily ? parseInt(lastFamily.familyNumber, 10) : 0;
//     this.familyNumber = String(lastNumber + 1);
//   }
// });

// export default mongoose.model('Family', familySchema);
// models/Family.js - FIXED (familyNumber not required)

// import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';

// const familySchema = new mongoose.Schema(
//   {
//     uuid: {
//       type: String,
//       default: uuidv4,
//       unique: true,
//       index: true,
//     },
//     familyName: {
//       type: String,
//       required: true,
//       trim: true,
//       index: true,
//     },
//     familyNumber: {
//       type: String,
//       // ⭐ REMOVED: required: true - auto-generated in pre-save
//       trim: true,
//       index: true,
//     },
//     house: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'House',
//       required: true,
//       index: true,
//     },
//     vanshaGenerationNumber: {
//       type: String,
//       trim: true,
//       index: true,
//     },
//     familyHead: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Member',
//       index: true,
//     },
//     clan: {
//       type: String,
//       trim: true,
//     },
//     origin: {
//       type: String,
//       trim: true,
//     },
//     currentAddress: {
//       type: String,
//       trim: true,
//     },
//     headOfFamily: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Member',
//     },
//     totalMembers: {
//       type: Number,
//       default: 0,
//     },
//     totalGenerations: {
//       type: Number,
//       default: 0,
//     },
//     familyPhoto: {
//       type: String,
//       default: null,
//     },
//     description: {
//       type: String,
//       trim: true,
//     },
//     status: {
//       type: String,
//       enum: ['open', 'closed'],
//       default: 'open',
//     },
//     closedAt: {
//       type: Date,
//       default: null,
//     },
//     closedReason: {
//       type: String,
//       trim: true,
//     },
//     reopenedAt: {
//       type: Date,
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Compound index for house + familyNumber uniqueness
// familySchema.index({ house: 1, familyNumber: 1 }, { unique: true });

// // Indexes for performance
// familySchema.index({ familyName: 'text' });
// familySchema.index({ status: 1 });
// familySchema.index({ clan: 1 });

// // Virtual populate: Family -> Members
// familySchema.virtual('members', {
//   ref: 'Member',
//   localField: '_id',
//   foreignField: 'family',
// });

// familySchema.set('toJSON', { virtuals: true });
// familySchema.set('toObject', { virtuals: true });

// // ⭐ FIXED: Pre-save hook for auto-generating familyNumber within house
// familySchema.pre('save', async function() {
//   if (this.isNew && !this.familyNumber) {
//     const lastFamily = await this.constructor
//       .findOne({ house: this.house })
//       .sort({ familyNumber: -1 });

//     const lastNumber = lastFamily ? parseInt(lastFamily.familyNumber, 10) : 0;
//     this.familyNumber = String(lastNumber + 1);
//     console.log(`📝 Auto-generated familyNumber: ${this.familyNumber} for house: ${this.house}`);
//   }
// });

// export default mongoose.model('Family', familySchema);




// // models/Family.js - UPDATED VERSION

// import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';

// const familySchema = new mongoose.Schema(
//   {
//     uuid: {
//       type: String,
//       default: uuidv4,
//       unique: true,
//       index: true,
//     },
//     familyName: {
//       type: String,
//       required: true,
//       trim: true,
//       index: true,
//     },
//     familyNumber: {
//       type: String,
//       trim: true,
//       index: true,
//     },
//     // ⭐ NEW: House Identifier - S1, S2, S3, etc.
//     houseIdentifier: {
//       type: String,
//       trim: true,
//       index: true,
//     },
//     house: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'House',
//       required: true,
//       index: true,
//     },
//     vanshaGenerationNumber: {
//       type: String,
//       trim: true,
//       index: true,
//     },
//     familyHead: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Member',
//       index: true,
//     },
//     clan: {
//       type: String,
//       trim: true,
//     },
//     origin: {
//       type: String,
//       trim: true,
//     },
//     currentAddress: {
//       type: String,
//       trim: true,
//     },
//     headOfFamily: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: 'Member',
//     },
//     totalMembers: {
//       type: Number,
//       default: 0,
//     },
//     totalGenerations: {
//       type: Number,
//       default: 0,
//     },
//     familyPhoto: {
//       type: String,
//       default: null,
//     },
//     description: {
//       type: String,
//       trim: true,
//     },
//     status: {
//       type: String,
//       enum: ['open', 'closed'],
//       default: 'open',
//     },
//     closedAt: {
//       type: Date,
//       default: null,
//     },
//     closedReason: {
//       type: String,
//       trim: true,
//     },
//     reopenedAt: {
//       type: Date,
//       default: null,
//     },
//   },
//   {
//     timestamps: true,
//   }
// );

// // Compound index for house + familyNumber uniqueness
// familySchema.index({ house: 1, familyNumber: 1 }, { unique: true });

// // Indexes for performance
// familySchema.index({ familyName: 'text' });
// familySchema.index({ status: 1 });
// familySchema.index({ clan: 1 });
// familySchema.index({ houseIdentifier: 1 });

// // Virtual populate: Family -> Members
// familySchema.virtual('members', {
//   ref: 'Member',
//   localField: '_id',
//   foreignField: 'family',
// });

// familySchema.set('toJSON', { virtuals: true });
// familySchema.set('toObject', { virtuals: true });

// // ⭐ UPDATED: Pre-save hook for auto-generating familyNumber and houseIdentifier
// familySchema.pre('save', async function() {
//   if (this.isNew) {
//     // Auto-generate familyNumber
//     if (!this.familyNumber) {
//       const lastFamily = await this.constructor
//         .findOne({ house: this.house })
//         .sort({ familyNumber: -1 });

//       const lastNumber = lastFamily ? parseInt(lastFamily.familyNumber, 10) : 0;
//       this.familyNumber = String(lastNumber + 1);
//       console.log(`📝 Auto-generated familyNumber: ${this.familyNumber} for house: ${this.house}`);
//     }

//     // ⭐ NEW: Auto-generate houseIdentifier (S1, S2, S3, etc.)
//     if (!this.houseIdentifier) {
//       const lastFamily = await this.constructor
//         .findOne()
//         .sort({ houseIdentifier: -1 });

//       let lastNumber = 0;
//       if (lastFamily && lastFamily.houseIdentifier) {
//         const match = lastFamily.houseIdentifier.match(/^S(\d+)$/);
//         if (match) {
//           lastNumber = parseInt(match[1], 10);
//         }
//       }
      
//       const nextNumber = lastNumber + 1;
//       this.houseIdentifier = `S${nextNumber}`;
//       console.log(`📝 Auto-generated houseIdentifier: ${this.houseIdentifier}`);
//     }
//   }
// });

// export default mongoose.model('Family', familySchema);






// models/Family.js - UPDATED WITH DUPLICATE PREVENTION

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
      trim: true,
      index: true,
    },
    // House Identifier - S1, S2, S3, etc.
    houseIdentifier: {
      type: String,
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
    // ⭐ NEW: Track separated family origin
    originalFamily: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Family',
      default: null,
    },
    isSeparated: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  }
);

// ⭐ CRITICAL: Compound unique index to prevent duplicate family numbers
familySchema.index({ house: 1, familyNumber: 1 }, { unique: true });
familySchema.index({ houseIdentifier: 1 }, { unique: true, sparse: true });

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

// ⭐ UPDATED: Pre-save hook with atomic counter for familyNumber
familySchema.pre('save', async function () {
  if (this.isNew) {
    // Get Counter model
    const Counter = mongoose.model('Counter');
    
    // Atomic increment for house-based family number
    const counterKey = `familyNumber_${this.house}`;
    const counter = await Counter.findByIdAndUpdate(
      counterKey,
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    
    // Only set if not already provided
    if (!this.familyNumber) {
      this.familyNumber = String(counter.seq);
      console.log(`📝 Auto-generated familyNumber: ${this.familyNumber} for house: ${this.house}`);
    }

    // Auto-generate houseIdentifier (S1, S2, S3, etc.) - global counter
    if (!this.houseIdentifier) {
      const globalCounter = await Counter.findByIdAndUpdate(
        'houseIdentifier',
        { $inc: { seq: 1 } },
        { new: true, upsert: true }
      );
      this.houseIdentifier = `S${globalCounter.seq}`;
      console.log(`📝 Auto-generated houseIdentifier: ${this.houseIdentifier}`);
    }
  }
});

// ⭐ NEW: Static method to safely create family with duplicate check
familySchema.statics.safeCreate = async function (familyData) {
  const maxRetries = 3;
  let lastError = null;

  for (let attempt = 0; attempt < maxRetries; attempt++) {
    try {
      // Check if family with same house+number already exists
      if (familyData.familyNumber && familyData.house) {
        const existing = await this.findOne({
          house: familyData.house,
          familyNumber: familyData.familyNumber,
        });
        if (existing) {
          // Auto-increment to next available number
          const lastFamily = await this.findOne({ house: familyData.house })
            .sort({ familyNumber: -1 });
          const nextNumber = lastFamily
            ? parseInt(lastFamily.familyNumber, 10) + 1
            : 1;
          familyData.familyNumber = String(nextNumber);
        }
      }

      const family = new this(familyData);
      await family.save();
      return family;
    } catch (error) {
      lastError = error;
      // If duplicate key error, retry with increment
      if (error.code === 11000) {
        console.log(`⚠️ Duplicate detected, retrying (attempt ${attempt + 1})`);
        // Get fresh next number
        const lastFamily = await this.findOne({ house: familyData.house })
          .sort({ familyNumber: -1 });
        const nextNumber = lastFamily
          ? parseInt(lastFamily.familyNumber, 10) + 1
          : 1;
        familyData.familyNumber = String(nextNumber);
        familyData.houseIdentifier = undefined; // Let it auto-generate
        continue;
      }
      throw error;
    }
  }

  throw lastError || new Error('Failed to create family after retries');
};

export default mongoose.model('Family', familySchema);