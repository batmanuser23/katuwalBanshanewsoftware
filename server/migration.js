// migration.js - Run this script to add new fields
// This is a one-time migration script

import dotenv from 'dotenv';
import mongoose from 'mongoose';
import Family from './models/Family.js';
import Member from './models/Member.js';
import Counter from './models/Counter.js';

dotenv.config();

const migrate = async () => {
  try {
    // Check MongoDB URI
    if (!process.env.MONGODB_URI) {
      throw new Error('MONGODB_URI is not defined in .env file');
    }

    // Connect to database
    await mongoose.connect(process.env.MONGODB_URI);

    console.log('MongoDB connected successfully');

    // Add vanshaGenerationNumber to existing families
    await Family.updateMany(
      { vanshaGenerationNumber: { $exists: false } },
      { $set: { vanshaGenerationNumber: '1' } }
    );

    console.log('Family generation number migration completed');

    // Set status to 'open' for existing families
    await Family.updateMany(
      { status: { $exists: false } },
      { $set: { status: 'open' } }
    );

    console.log('Family status migration completed');

    // Add rollNumber to existing members
    const members = await Member.find({
      rollNumber: { $exists: false }
    });

    console.log(`Found ${members.length} members without roll number`);

    for (const member of members) {
      const counter = await Counter.findByIdAndUpdate(
        'rollNumber',
        { $inc: { seq: 1 } },
        {
          new: true,
          upsert: true
        }
      );

      member.rollNumber = String(counter.seq);

      await member.save();
    }

    console.log('Member roll number migration completed');

    console.log('Migration completed successfully');

    await mongoose.disconnect();

    process.exit(0);
  } catch (error) {
    console.error('Migration failed:', error);

    await mongoose.disconnect();

    process.exit(1);
  }
};

migrate();