// scripts/fixGenerations.js - RUN THIS ONCE

import mongoose from 'mongoose';
import Member from '../models/Member.js';
import dotenv from 'dotenv';

dotenv.config();

const fixGenerations = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('🔗 Connected to MongoDB');

    const members = await Member.find().populate('father mother spouse');
    console.log(`📊 Total members: ${members.length}`);

    let updated = 0;

    for (const member of members) {
      let correctGeneration = member.generation || 1;

      // If father exists, generation = father.generation + 1
      if (member.father && member.father.generation) {
        correctGeneration = member.father.generation + 1;
      }
      // If mother exists, generation = mother.generation + 1
      else if (member.mother && member.mother.generation) {
        correctGeneration = member.mother.generation + 1;
      }
      // If spouse exists, same generation
      else if (member.spouse && member.spouse.generation) {
        correctGeneration = member.spouse.generation;
      }
      // Based on relationship
      else if (member.relationship) {
        const relationshipMap = {
          'हजुरबा': 0,
          'हजुरआमा': 0,
          'बुबा': 1,
          'आमा': 1,
          'छोरा': 2,
          'छोरी': 2,
          'नाति': 3,
          'नातिनी': 3,
          'पनाति': 4,
          'पनातिनी': 4,
        };
        if (relationshipMap[member.relationship] !== undefined) {
          correctGeneration = relationshipMap[member.relationship];
        }
      }

      if (member.generation !== correctGeneration) {
        console.log(`📝 ${member.name} (${member.memberNumber}): ${member.generation} → ${correctGeneration}`);
        member.generation = correctGeneration;
        await member.save();
        updated++;
      }
    }

    console.log(`✅ Updated ${updated} members`);

    // Second pass: Update spouses to match
    const spouses = await Member.find({ spouse: { $exists: true, $ne: null } });
    for (const member of spouses) {
      const spouse = await Member.findById(member.spouse);
      if (spouse && spouse.generation !== member.generation) {
        console.log(`💑 Syncing spouse generation: ${member.name} ↔ ${spouse.name}`);
        spouse.generation = member.generation;
        await spouse.save();
      }
    }

    console.log('✅ Generation fix complete');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error);
    process.exit(1);
  }
};

fixGenerations();