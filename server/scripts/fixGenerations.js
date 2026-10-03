// backend/scripts/fixSpouseLinks.js
// Run once: node scripts/fixSpouseLinks.js

import mongoose from 'mongoose';
import dotenv from 'dotenv';
import Member from '../models/Member.js';

dotenv.config();

const fixSpouseLinks = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('✅ Connected to MongoDB\n');

    const unlinkedSpouses = await Member.find({
      relationship: { $in: ['श्रीमती', 'श्रीमान'] },
      $or: [
        { spouse: { $exists: false } },
        { spouse: null },
      ],
    });

    console.log(`🔍 Found ${unlinkedSpouses.length} unlinked spouse(s)\n`);

    for (const spouse of unlinkedSpouses) {
      console.log(`\n--- ${spouse.name} (${spouse.memberNumber}) ---`);
      console.log(`  Relationship: ${spouse.relationship}`);
      console.log(`  Vansha: ${spouse.vanshaGenerationNumber}`);
      console.log(`  Family: ${spouse.family}`);

      const candidates = await Member.find({
        _id: { $ne: spouse._id },
        family: spouse.family,
        vanshaGenerationNumber: spouse.vanshaGenerationNumber,
        gender: { $ne: spouse.gender },
        $or: [
          { spouse: { $exists: false } },
          { spouse: null },
        ],
      });

      if (candidates.length === 0) {
        console.log('  ⚠️ No candidate found.');
        continue;
      }

      if (candidates.length === 1) {
        const partner = candidates[0];
        console.log(`  ✅ Auto-linking with: ${partner.name} (${partner.memberNumber})`);

        await Member.findByIdAndUpdate(spouse._id, {
          spouse: partner._id,
          ...(spouse.gender === 'female' ? { husband: partner._id } : { wife: partner._id }),
        });

        await Member.findByIdAndUpdate(partner._id, {
          spouse: spouse._id,
          ...(spouse.gender === 'female' ? { wife: spouse._id } : { husband: spouse._id }),
        });

        console.log(`  ✅ Linked!`);
      } else {
        console.log(`  ⚠️ Multiple candidates — link manually:`);
        candidates.forEach((c, i) => {
          console.log(`    ${i + 1}. ${c.name} (${c.memberNumber}) - ${c.gender}`);
        });
      }
    }

    console.log('\n✅ Done!\n');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixSpouseLinks();