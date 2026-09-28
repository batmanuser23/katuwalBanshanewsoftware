// controllers/memberController.js - COMPLETE FIXED FILE (rollNumber removed, bidirectional spouse sync)

import Member from '../models/Member.js';
import Family from '../models/Family.js';
import House from '../models/House.js';
import FamilyRelationship from '../models/FamilyRelationship.js';
import { io } from '../server.js';
import cloudinary from '../config/cloudinary.js';
import Notification from '../models/Notification.js';
import Counter from '../models/Counter.js';

// ⭐ UPDATED: Helper function to get sequential member number - M0001 format
const getNextMemberNumber = async () => {
  const counter = await Counter.findByIdAndUpdate(
    'memberNumber',
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  // Format: M0001, M0002, M0003, etc.
  return `M${String(counter.seq).padStart(4, '0')}`;
};

// Helper to clean array fields - REMOVE EMPTY STRINGS
const cleanArrayFields = (body) => {
  const arrayFields = [
    'sons', 'daughters', 'elderBrothers', 'youngerBrothers',
    'elderSisters', 'youngerSisters', 'grandsons', 'granddaughters',
    'sonInLaw', 'daughterInLaw'
  ];
  
  const cleaned = { ...body };
  arrayFields.forEach(field => {
    if (cleaned[field] !== undefined) {
      if (Array.isArray(cleaned[field])) {
        // Filter out empty strings, null, undefined, and invalid ObjectIds
        cleaned[field] = cleaned[field]
          .filter(id => id && typeof id === 'string' && id.trim() !== '')
          .map(id => id.trim());
      } else if (typeof cleaned[field] === 'string' && cleaned[field].trim() === '') {
        cleaned[field] = [];
      }
    }
  });
  return cleaned;
};

// Helper to clean phone number
const cleanPhoneNumber = (phone) => {
  if (!phone) return '';
  // Remove any non-digit characters
  const cleaned = phone.replace(/\D/g, '');
  // If it's a valid Nepali phone number (10 digits starting with 9)
  if (cleaned.length === 10 && cleaned.startsWith('9')) {
    return cleaned;
  }
  return phone; // Return original if not matching
};

// Helper to clean family ID - ensures we get a single string ID
const cleanFamilyId = (family) => {
  if (!family) return '';
  
  // If it's an array, take the first element
  if (Array.isArray(family)) {
    return family[0] || '';
  }
  
  // If it's an object with _id, extract it
  if (typeof family === 'object' && family !== null) {
    return family._id || family.id || '';
  }
  
  // If it's a string, return as is
  if (typeof family === 'string') {
    return family;
  }
  
  return String(family);
};

// ⭐ UPDATED: getMembers - removed rollNumber from search
export const getMembers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, gender, status, generation, verificationStatus, family, district, province, house } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { surname: { $regex: search, $options: 'i' } },
          { memberNumber: { $regex: search, $options: 'i' } },
          { vanshaGenerationNumber: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { familyNumber: { $regex: search, $options: 'i' } },
          { citizenshipNumber: { $regex: search, $options: 'i' } },
          { houseNumber: { $regex: search, $options: 'i' } },
        ],
      };
    }

    if (gender) query.gender = gender;
    if (status) query.status = status;
    if (generation) query.generation = parseInt(generation);
    if (verificationStatus) query.verificationStatus = verificationStatus;
    if (family) query.family = family;
    if (district) query.district = district;
    if (province) query.province = province;

    if (house) {
      const familiesInHouse = await Family.find({ house }).distinct('_id');
      query.family = { $in: familiesInHouse };
    }

    const [members, total] = await Promise.all([
      Member.find(query)
        .populate('family', 'familyName familyNumber vanshaGenerationNumber')
        .populate('father mother spouse', 'name photo memberNumber')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Member.countDocuments(query),
    ]);

    res.json({
      data: members,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('getMembers Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
      .populate('family', 'familyName familyNumber vanshaGenerationNumber clan')
      .populate(
        'father mother husband wife spouse grandfather grandmother guardian fatherInLaw motherInLaw',
        'name photo memberNumber'
      )
      .populate(
        'sons daughters elderBrothers youngerBrothers elderSisters youngerSisters grandsons granddaughters sonInLaw daughterInLaw',
        'name photo memberNumber'
      );

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const memberObj = member.toObject();
    
    const photoFields = ['photo', 'citizenshipFront', 'citizenshipBack', 'nationalIdFront', 'passportPhoto', 'drivingLicensePhoto'];
    photoFields.forEach(field => {
      if (memberObj[field]) {
        if (!memberObj[field].startsWith('http')) {
          if (memberObj[field].includes('cloudinary')) {
            memberObj[field] = memberObj[field];
          }
        }
      }
    });

    const relationships = await FamilyRelationship.find({
      $or: [
        { member: member._id },
        { relatedMember: member._id },
      ],
      isActive: true,
    }).populate('member relatedMember');

    res.json({
      ...memberObj,
      relationships,
    });
  } catch (error) {
    console.error('getMemberById Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ⭐ UPDATED: createMember - removed rollNumber, added duplicate spouse check
export const createMember = async (req, res) => {
  try {
    const files = req.files || {};

    // Clean up body data - ensure family is a single string
    const body = { ...req.body };
    
    // Clean the family ID
    const familyId = cleanFamilyId(body.family);
    console.log('📝 Creating member with family ID:', familyId);
    
    if (!familyId) {
      console.error('❌ No family ID provided');
      return res.status(400).json({
        success: false,
        message: 'Family is required. Please select a family.',
      });
    }

    // Check if family exists
    const family = await Family.findById(familyId);
    if (!family) {
      console.error('❌ Family not found:', familyId);
      return res.status(404).json({
        success: false,
        message: 'Family not found. Please select a valid family.',
      });
    }

    // Check if family is closed
    if (family.status === 'closed') {
      return res.status(403).json({
        success: false,
        message: 'Family is closed. Please reopen to add members.'
      });
    }

    // Set the clean family ID
    body.family = familyId;

    // Clean phone number
    if (body.phone) {
      body.phone = cleanPhoneNumber(body.phone);
    }

    // ✅ ADD: Duplicate spouse check
    if (body.spouse) {
      const spouseId = body.spouse;
      const existingSpouse = await Member.findOne({
        _id: spouseId,
        spouse: { $exists: true, $ne: null }
      });
      
      if (existingSpouse && String(existingSpouse.spouse) !== String(body._id)) {
        return res.status(400).json({
          success: false,
          message: 'This person is already married to someone else. Remove existing spouse first.'
        });
      }
    }

    // Clean array fields
    const cleanedBody = cleanArrayFields(body);

    // ⭐ UPDATED: Generate member number in M0001 format (no rollNumber)
    const memberNumber = await getNextMemberNumber();

    const memberData = {
      ...cleanedBody,
      memberNumber, // M0001, M0002, etc.
      vanshaGenerationNumber: family.vanshaGenerationNumber || null,
      family: familyId,
      photo: files.photo?.[0]?.path || null,
      citizenshipFront: files.citizenshipFront?.[0]?.path || null,
      citizenshipBack: files.citizenshipBack?.[0]?.path || null,
      nationalIdFront: files.nationalIdFront?.[0]?.path || null,
      passportPhoto: files.passportPhoto?.[0]?.path || null,
      drivingLicensePhoto: files.drivingLicensePhoto?.[0]?.path || null,
      createdBy: req.user?._id || null,
      updatedBy: req.user?._id || null,
    };

    // Remove undefined values
    Object.keys(memberData).forEach(key => {
      if (memberData[key] === undefined) {
        delete memberData[key];
      }
    });

    // Update family total members count
    await Family.findByIdAndUpdate(familyId, {
      $inc: { totalMembers: 1 },
    });

    const member = new Member(memberData);
    await member.save();

    // Populate the member before sending response
    const populatedMember = await Member.findById(member._id)
      .populate('family', 'familyName familyNumber vanshaGenerationNumber');

    // ✅ CRITICAL: Synchronize relationships (bidirectional)
    await synchronizeRelationships(member);

    const notification = new Notification({
      type: 'member_added',
      title: 'New Member Added',
      message: `${member.name} (${member.memberNumber}) has been added to family ${family.familyName}.`,
      data: { memberId: member._id },
      createdBy: req.user?._id || null,
    });
    await notification.save();

    io.emit('member:created', populatedMember);
    io.emit('notification:new', notification);

    res.status(201).json(populatedMember);
  } catch (error) {
    console.error("❌ Create Member Error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Unknown Error",
      errors: error.errors || null,
    });
  }
};

// ⭐ UPDATED: updateMember - removed rollNumber, added duplicate spouse check
export const updateMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Clean the family ID if provided
    const body = { ...req.body };
    if (body.family) {
      const familyId = cleanFamilyId(body.family);
      if (familyId) {
        // Check if family exists
        const family = await Family.findById(familyId);
        if (!family) {
          return res.status(404).json({
            success: false,
            message: 'Family not found. Please select a valid family.',
          });
        }
        // Check if family is closed
        if (family.status === 'closed') {
          return res.status(403).json({
            success: false,
            message: 'Family is closed. Please reopen to update members.'
          });
        }
        body.family = familyId;
      }
    }

    // Check if current family is closed
    const currentFamily = await Family.findById(member.family);
    if (currentFamily && currentFamily.status === 'closed') {
      return res.status(403).json({
        success: false,
        message: 'Family is closed. Please reopen to update members.'
      });
    }

    const files = req.files || {};

    // Clean phone number
    if (body.phone) {
      body.phone = cleanPhoneNumber(body.phone);
    }

    // ✅ ADD: Duplicate spouse check for update
    if (body.spouse && body.spouse !== member.spouse?.toString()) {
      const spouseId = body.spouse;
      const existingSpouse = await Member.findOne({
        _id: spouseId,
        spouse: { $exists: true, $ne: null }
      });
      
      if (existingSpouse && String(existingSpouse.spouse) !== String(member._id)) {
        return res.status(400).json({
          success: false,
          message: 'This person is already married to someone else. Remove existing spouse first.'
        });
      }
    }

    // Clean array fields
    const cleanedBody = cleanArrayFields(body);

    // Delete old Cloudinary images if new ones are uploaded
    const photoFields = ['photo', 'citizenshipFront', 'citizenshipBack', 'nationalIdFront', 'passportPhoto', 'drivingLicensePhoto'];
    for (const field of photoFields) {
      if (files[field]?.[0]?.path && member[field]) {
        const publicId = member[field].split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
    }

    const updateData = {
      ...cleanedBody,
      photo: files.photo?.[0]?.path || member.photo,
      citizenshipFront: files.citizenshipFront?.[0]?.path || member.citizenshipFront,
      citizenshipBack: files.citizenshipBack?.[0]?.path || member.citizenshipBack,
      nationalIdFront: files.nationalIdFront?.[0]?.path || member.nationalIdFront,
      passportPhoto: files.passportPhoto?.[0]?.path || member.passportPhoto,
      drivingLicensePhoto: files.drivingLicensePhoto?.[0]?.path || member.drivingLicensePhoto,
      updatedBy: req.user?._id || null,
    };

    // Remove undefined values
    Object.keys(updateData).forEach(key => {
      if (updateData[key] === undefined) {
        delete updateData[key];
      }
    });

    // Ensure array fields are properly set
    const arrayFields = [
      'sons', 'daughters', 'elderBrothers', 'youngerBrothers',
      'elderSisters', 'youngerSisters', 'grandsons', 'granddaughters',
      'sonInLaw', 'daughterInLaw'
    ];
    
    arrayFields.forEach(field => {
      if (updateData[field] !== undefined) {
        if (!Array.isArray(updateData[field])) {
          updateData[field] = [];
        }
        // Filter out any invalid values
        updateData[field] = updateData[field]
          .filter(id => id && typeof id === 'string' && id.trim() !== '' && id.trim().length === 24)
          .map(id => id.trim());
      }
    });

    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
        returnDocument: 'after',
      }
    ).populate('family', 'familyName familyNumber vanshaGenerationNumber');

    // ✅ CRITICAL: Synchronize relationships (bidirectional)
    await synchronizeRelationships(updatedMember, member);

    const notification = new Notification({
      type: "member_updated",
      title: "Member Updated",
      message: `${updatedMember.name}'s profile has been updated.`,
      data: {
        memberId: updatedMember._id,
      },
      createdBy: req.user?._id || null,
    });

    await notification.save();

    io.emit("member:updated", updatedMember);
    io.emit("notification:new", notification);

    res.json(updatedMember);
  } catch (error) {
    console.error("❌ Update Member Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: "Duplicate entry",
      });
    }

    res.status(400).json({
      success: false,
      message: error.message,
    });
  }
};

export const deleteMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const family = await Family.findById(member.family);
    if (family && family.status === 'closed') {
      return res.status(403).json({
        message: 'Family is closed. Please reopen to delete members.'
      });
    }

    const photoFields = ['photo', 'citizenshipFront', 'citizenshipBack', 'nationalIdFront', 'passportPhoto', 'drivingLicensePhoto'];
    for (const field of photoFields) {
      if (member[field]) {
        const publicId = member[field].split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
    }

    await removeFromRelationships(member);

    if (member.family) {
      await Family.findByIdAndUpdate(member.family, {
        $inc: { totalMembers: -1 },
      });
    }

    await FamilyRelationship.deleteMany({
      $or: [
        { member: member._id },
        { relatedMember: member._id },
      ],
    });

    await Member.findByIdAndDelete(req.params.id);

    const notification = new Notification({
      type: 'member_deleted',
      title: 'Member Deleted',
      message: `${member.name} has been removed from the system.`,
      data: { memberId: req.params.id },
      createdBy: req.user?._id || null,
    });
    await notification.save();

    io.emit('member:deleted', { id: req.params.id });
    io.emit('notification:new', notification);

    res.json({ message: 'Member deleted successfully' });
  } catch (error) {
    console.error('deleteMember Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const searchMembers = async (req, res) => {
  try {
    const { query } = req.query;
    if (!query) {
      return res.status(400).json({ message: 'Search query is required' });
    }

    const members = await Member.find({
      $text: { $search: query },
    })
    .populate('family', 'familyName familyNumber')
    .sort({ score: { $meta: 'textScore' } })
    .limit(20);

    res.json(members);
  } catch (error) {
    console.error('searchMembers Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getMembersByFamily = async (req, res) => {
  try {
    const { familyId } = req.params;
    
    const family = await Family.findById(familyId);
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    const members = await Member.find({ family: familyId })
      .select('name photo gender dob isAlive relationship generation memberNumber vanshaGenerationNumber')
      .sort({ name: 1 });

    res.json({
      family: {
        id: family._id,
        name: family.familyName,
        number: family.familyNumber,
        vanshaGenerationNumber: family.vanshaGenerationNumber,
        status: family.status,
      },
      total: members.length,
      data: members,
    });
  } catch (error) {
    console.error('getMembersByFamily Error:', error);
    res.status(500).json({ message: error.message });
  }
};

export const getMemberStats = async (req, res) => {
  try {
    const [total, byGender, byStatus, byGeneration, byVansha] = await Promise.all([
      Member.countDocuments(),
      Member.aggregate([
        { $group: { _id: '$gender', count: { $sum: 1 } } },
      ]),
      Member.aggregate([
        { $group: { _id: '$isAlive', count: { $sum: 1 } } },
      ]),
      Member.aggregate([
        { $group: { _id: '$generation', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
      ]),
      Member.aggregate([
        { $group: { _id: '$vanshaGenerationNumber', count: { $sum: 1 } } },
        { $sort: { _id: 1 } },
        { $limit: 20 },
      ]),
    ]);

    res.json({
      total,
      byGender: byGender.reduce((acc, curr) => {
        acc[curr._id || 'unknown'] = curr.count;
        return acc;
      }, {}),
      byStatus: byStatus.reduce((acc, curr) => {
        acc[curr._id ? 'living' : 'deceased'] = curr.count;
        return acc;
      }, {}),
      byGeneration: byGeneration.map(g => ({
        generation: g._id || 'unknown',
        count: g.count,
      })),
      byVansha: byVansha.map(v => ({
        vansha: v._id || 'unknown',
        count: v.count,
      })),
    });
  } catch (error) {
    console.error('getMemberStats Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ✅ COMPLETE BIDIRECTIONAL RELATIONSHIP SYNC
const synchronizeRelationships = async (member, oldMember = null) => {
  const memberId = member._id;
  const memberGender = member.gender;

  // ✅ STEP 1: Remove old relationships if updating
  if (oldMember) {
    await removeFromRelationships(oldMember);
  }

  // ✅ STEP 2: Sync SPOUSE (bidirectional)
  // If this member has a spouse set
  if (member.spouse) {
    const spouseId = member.spouse._id || member.spouse;
    const spouse = await Member.findById(spouseId);
    
    if (spouse) {
      // Update spouse's spouse field to point back (if not already set)
      if (String(spouse.spouse) !== String(memberId)) {
        await Member.findByIdAndUpdate(spouseId, { spouse: memberId });
      }
      
      // Ensure gender-specific fields are also set
      if (memberGender === 'male') {
        await Member.findByIdAndUpdate(spouseId, { husband: memberId });
        await Member.findByIdAndUpdate(memberId, { wife: spouseId });
      } else if (memberGender === 'female') {
        await Member.findByIdAndUpdate(spouseId, { wife: memberId });
        await Member.findByIdAndUpdate(memberId, { husband: spouseId });
      }
    }
  }

  // ✅ STEP 3: Sync HUSBAND field (if set, ensure wife field on husband)
  if (member.husband) {
    const husbandId = member.husband._id || member.husband;
    const husband = await Member.findById(husbandId);
    if (husband) {
      await Member.findByIdAndUpdate(husbandId, { wife: memberId });
      // Also set spouse if not set
      if (!husband.spouse) {
        await Member.findByIdAndUpdate(husbandId, { spouse: memberId });
      }
      if (!member.spouse) {
        await Member.findByIdAndUpdate(memberId, { spouse: husbandId });
      }
    }
  }

  // ✅ STEP 4: Sync WIFE field (if set, ensure husband field on wife)
  if (member.wife) {
    const wifeId = member.wife._id || member.wife;
    const wife = await Member.findById(wifeId);
    if (wife) {
      await Member.findByIdAndUpdate(wifeId, { husband: memberId });
      if (!wife.spouse) {
        await Member.findByIdAndUpdate(wifeId, { spouse: memberId });
      }
      if (!member.spouse) {
        await Member.findByIdAndUpdate(memberId, { spouse: wifeId });
      }
    }
  }

  // ✅ STEP 5: Sync FATHER relationship
  if (member.father) {
    const fatherId = member.father._id || member.father;
    const father = await Member.findById(fatherId);
    if (father) {
      const childField = memberGender === 'male' ? 'sons' : 'daughters';
      if (!father[childField].map(String).includes(String(memberId))) {
        await Member.findByIdAndUpdate(fatherId, {
          $addToSet: { [childField]: memberId }
        });
      }
    }
  }

  // ✅ STEP 6: Sync MOTHER relationship
  if (member.mother) {
    const motherId = member.mother._id || member.mother;
    const mother = await Member.findById(motherId);
    if (mother) {
      const childField = memberGender === 'male' ? 'sons' : 'daughters';
      if (!mother[childField].map(String).includes(String(memberId))) {
        await Member.findByIdAndUpdate(motherId, {
          $addToSet: { [childField]: memberId }
        });
      }
    }
  }

  // ✅ STEP 7: Sync CHILDREN (sons/daughters) — bidirectional father/mother
  const childFields = [
    { field: 'sons', gender: 'male' },
    { field: 'daughters', gender: 'female' },
  ];

  for (const { field, gender } of childFields) {
    if (member[field] && member[field].length > 0) {
      for (const childId of member[field]) {
        const child = await Member.findById(childId);
        if (!child) continue;

        if (gender === 'male') {
          // If member is male, set as father; if female, set as mother
          if (memberGender === 'male') {
            if (String(child.father) !== String(memberId)) {
              await Member.findByIdAndUpdate(childId, { father: memberId });
            }
          } else if (memberGender === 'female') {
            if (String(child.mother) !== String(memberId)) {
              await Member.findByIdAndUpdate(childId, { mother: memberId });
            }
          }
        } else if (gender === 'female') {
          if (memberGender === 'male') {
            if (String(child.father) !== String(memberId)) {
              await Member.findByIdAndUpdate(childId, { father: memberId });
            }
          } else if (memberGender === 'female') {
            if (String(child.mother) !== String(memberId)) {
              await Member.findByIdAndUpdate(childId, { mother: memberId });
            }
          }
        }
      }
    }
  }

  // ✅ STEP 8: Sync GRANDFATHER/GRANDMOTHER
  if (member.grandfather) {
    const gfId = member.grandfather._id || member.grandfather;
    const childField = memberGender === 'male' ? 'grandsons' : 'granddaughters';
    await Member.findByIdAndUpdate(gfId, {
      $addToSet: { [childField]: memberId }
    });
  }

  if (member.grandmother) {
    const gmId = member.grandmother._id || member.grandmother;
    const childField = memberGender === 'male' ? 'grandsons' : 'granddaughters';
    await Member.findByIdAndUpdate(gmId, {
      $addToSet: { [childField]: memberId }
    });
  }

  // ✅ STEP 9: Sync GUARDIAN
  if (member.guardian) {
    const guardianId = member.guardian._id || member.guardian;
    // No reverse field for guardian — just ensure it's saved
  }
};

// ✅ COMPLETE RELATIONSHIP CLEANUP
const removeFromRelationships = async (member) => {
  const memberId = member._id;

  // Remove from father's children
  if (member.father) {
    const fatherId = member.father._id || member.father;
    await Member.findByIdAndUpdate(fatherId, {
      $pull: { sons: memberId, daughters: memberId }
    });
  }

  // Remove from mother's children
  if (member.mother) {
    const motherId = member.mother._id || member.mother;
    await Member.findByIdAndUpdate(motherId, {
      $pull: { sons: memberId, daughters: memberId }
    });
  }

  // Clear spouse on spouse
  if (member.spouse) {
    const spouseId = member.spouse._id || member.spouse;
    await Member.findByIdAndUpdate(spouseId, {
      $unset: { spouse: 1 }
    });
  }

  // Clear husband on husband
  if (member.husband) {
    const husbandId = member.husband._id || member.husband;
    await Member.findByIdAndUpdate(husbandId, {
      $unset: { wife: 1, spouse: 1 }
    });
  }

  // Clear wife on wife
  if (member.wife) {
    const wifeId = member.wife._id || member.wife;
    await Member.findByIdAndUpdate(wifeId, {
      $unset: { husband: 1, spouse: 1 }
    });
  }

  // Remove from grandfather's grandchildren
  if (member.grandfather) {
    const gfId = member.grandfather._id || member.grandfather;
    await Member.findByIdAndUpdate(gfId, {
      $pull: { grandsons: memberId, granddaughters: memberId }
    });
  }

  // Remove from grandmother's grandchildren
  if (member.grandmother) {
    const gmId = member.grandmother._id || member.grandmother;
    await Member.findByIdAndUpdate(gmId, {
      $pull: { grandsons: memberId, granddaughters: memberId }
    });
  }

  // Clear children's father/mother if they point to this member
  await Member.updateMany(
    { father: memberId },
    { $unset: { father: 1 } }
  );
  await Member.updateMany(
    { mother: memberId },
    { $unset: { mother: 1 } }
  );
};

export default {
  getMembers,
  getMemberById,
  createMember,
  updateMember,
  deleteMember,
  searchMembers,
  getMembersByFamily,
  getMemberStats,
};