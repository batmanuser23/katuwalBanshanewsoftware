// backend/src/controllers/familyController.js - COMPLETE UPDATED FILE
// Features:
// - totalGenerations calculated from actual tree
// - Manual vanshaj number preservation
// - Family head supports ObjectId OR manual text
// - Duplicate family prevention
// - Race condition safe family number generation

import Family from '../models/Family.js';
import House from '../models/House.js';
import Member from '../models/Member.js';
import { io } from '../server.js';
import cloudinary from '../config/cloudinary.js';
import Notification from '../models/Notification.js';

// ============================================================
// GET FAMILIES
// ============================================================
export const getFamilies = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, house } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    if (search) {
      query = {
        $or: [
          { familyName: { $regex: search, $options: 'i' } },
          { familyNumber: { $regex: search, $options: 'i' } },
          { clan: { $regex: search, $options: 'i' } },
          { vanshaGenerationNumber: { $regex: search, $options: 'i' } },
        ],
      };
    }
    if (house) {
      query.house = house;
    }

    const [families, total] = await Promise.all([
      Family.find(query)
        .populate('house', 'houseNumber houseName')
        .populate('familyHead', 'name photo memberNumber')
        .populate('headOfFamily', 'name photo memberNumber')
        .sort({ house: 1, familyNumber: 1 })
        .skip(skip)
        .limit(parseInt(limit)),
      Family.countDocuments(query),
    ]);

    // ⭐ Get member counts and CALCULATE total generations from actual data
    const familiesWithCounts = await Promise.all(
      families.map(async (family) => {
        const memberCount = await Member.countDocuments({ family: family._id });
        
        // ⭐ Calculate totalGenerations from actual member data
        const members = await Member.find({ family: family._id })
          .select('generation generationMode')
          .lean();
        
        let totalGenerations = 0;
        if (members.length > 0) {
          // Use maximum effective generation
          totalGenerations = Math.max(...members.map(m => m.generation || 1));
        }
        
        return {
          ...family.toObject(),
          memberCount,
          totalGenerations,
        };
      })
    );

    res.json({
      data: familiesWithCounts,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error('getFamilies Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================================
// LINEAGE TREE BUILDER (with spouse deduplication)
// ============================================================
const buildLineageTree = (members, family) => {
  if (!members || members.length === 0) return [];

  const memberMap = {};

  // Create map of all members
  members.forEach((m) => {
    memberMap[m._id.toString()] = {
      ...m,
      children: [],
      spouses: [],
      parents: [],
      level: 0,
      isLineageSource: true,
    };
  });

  // Build relationships with lineage logic
  members.forEach((m) => {
    const memberId = m._id.toString();
    const member = memberMap[memberId];
    if (!member) return;

    // Spouse relationship (bidirectional, DEDUPLICATED)
    if (m.spouse) {
      const spouseId =
        typeof m.spouse === 'object' ? m.spouse._id?.toString() : m.spouse?.toString();
      if (spouseId && memberMap[spouseId]) {
        // ⭐ Only add if not already present (deduplication)
        if (!member.spouses.includes(spouseId)) {
          member.spouses.push(spouseId);
        }
        if (!memberMap[spouseId].spouses.includes(memberId)) {
          memberMap[spouseId].spouses.push(memberId);
        }
      }
    }

    // Father relationship
    if (m.father) {
      const fatherId =
        typeof m.father === 'object' ? m.father._id?.toString() : m.father?.toString();
      if (fatherId && memberMap[fatherId]) {
        if (!memberMap[fatherId].children.includes(memberId)) {
          memberMap[fatherId].children.push(memberId);
        }
        if (!member.parents.includes(fatherId)) {
          member.parents.push(fatherId);
        }
        memberMap[fatherId].isLineageSource = true;
      }
    }

    // Mother relationship
    if (m.mother) {
      const motherId =
        typeof m.mother === 'object' ? m.mother._id?.toString() : m.mother?.toString();
      if (motherId && memberMap[motherId]) {
        if (!memberMap[motherId].children.includes(memberId)) {
          memberMap[motherId].children.push(memberId);
        }
        if (!member.parents.includes(motherId)) {
          member.parents.push(motherId);
        }
        memberMap[motherId].isLineageSource = true;
      }
    }

    // Grandfather
    if (m.grandfather) {
      const grandId =
        typeof m.grandfather === 'object'
          ? m.grandfather._id?.toString()
          : m.grandfather?.toString();
      if (grandId && memberMap[grandId]) {
        if (!member.parents.includes(grandId)) {
          member.parents.push(grandId);
        }
        memberMap[grandId].isLineageSource = true;
      }
    }

    // Grandmother
    if (m.grandmother) {
      const grandId =
        typeof m.grandmother === 'object'
          ? m.grandmother._id?.toString()
          : m.grandmother?.toString();
      if (grandId && memberMap[grandId]) {
        if (!member.parents.includes(grandId)) {
          member.parents.push(grandId);
        }
        memberMap[grandId].isLineageSource = true;
      }
    }
  });

  // ⭐ Identify spouses (married into family - NOT lineage source)
  Object.values(memberMap).forEach((member) => {
    const hasChildren = member.children && member.children.length > 0;
    const isParent = member.parents && member.parents.length > 0;

    if (member.spouses && member.spouses.length > 0 && !hasChildren && !isParent) {
      const spouseId = member.spouses[0];
      if (spouseId && memberMap[spouseId]) {
        const spouse = memberMap[spouseId];
        if (spouse.children && spouse.children.length > 0) {
          member.isLineageSource = false;
        }
      }
    }

    if (
      member.spouses &&
      member.spouses.length > 0 &&
      !hasChildren &&
      member.parents.length === 0
    ) {
      const spouseId = member.spouses[0];
      if (spouseId && memberMap[spouseId] && memberMap[spouseId].isLineageSource) {
        member.isLineageSource = false;
      }
    }
  });

  // Find root nodes
  let roots = Object.values(memberMap).filter((m) => m.parents.length === 0 && m.isLineageSource);

  if (roots.length === 0) {
    roots = Object.values(memberMap).filter((m) => m.parents.length === 0);
  }

  if (roots.length === 0) {
    const minGen = Math.min(...Object.values(memberMap).map((m) => m.generation || 99));
    roots = Object.values(memberMap).filter(
      (m) => (m.generation || 99) === minGen && m.isLineageSource
    );

    if (roots.length === 0) {
      roots = Object.values(memberMap).filter((m) => (m.generation || 99) === minGen);
    }
  }

  if (roots.length === 0) {
    roots = Object.values(memberMap);
  }

  return roots.map((root) => enrichLineageNode(root, memberMap, 0, new Set()));
};

// ============================================================
// HELPER: Enrich Lineage Node
// ============================================================
const enrichLineageNode = (node, memberMap, level = 0, visited = new Set()) => {
  const nodeId = node._id.toString();

  if (visited.has(nodeId)) {
    return { ...node, level, children: [], spouses: [] };
  }
  visited.add(nodeId);

  const enriched = {
    ...node,
    level,
    children: node.isLineageSource
      ? node.children
          .filter((id) => memberMap[id])
          .map((id) => enrichLineageNode(memberMap[id], memberMap, level + 1, new Set(visited)))
      : [],
    spouses: node.spouses
      .filter((id) => memberMap[id])
      .map((id) => {
        const spouse = memberMap[id];
        return {
          ...spouse,
          level,
          children: [],
          spouses: [],
          isLineageSource: false,
        };
      }),
  };

  if (!node.isLineageSource) {
    enriched.children = [];
  }

  return enriched;
};

// ============================================================
// GET FAMILY TREE BY FAMILY
// ============================================================
export const getFamilyTreeByFamily = async (req, res) => {
  try {
    const { familyId } = req.params;

    if (!familyId) {
      return res.status(400).json({
        success: false,
        message: 'Family ID is required',
      });
    }

    const family = await Family.findById(familyId).populate('house', 'houseNumber houseName');

    if (!family) {
      return res.status(404).json({
        success: false,
        message: 'Family not found',
      });
    }

    const members = await Member.find({ family: familyId })
      .populate({
        path: 'father',
        select: 'name photo memberNumber vanshaGenerationNumber generation gender isAlive',
      })
      .populate({
        path: 'mother',
        select: 'name photo memberNumber vanshaGenerationNumber generation gender isAlive',
      })
      .populate({
        path: 'spouse',
        select: 'name photo memberNumber vanshaGenerationNumber generation gender isAlive',
      })
      .populate({
        path: 'grandfather',
        select: 'name photo memberNumber vanshaGenerationNumber generation gender isAlive',
      })
      .populate({
        path: 'grandmother',
        select: 'name photo memberNumber vanshaGenerationNumber generation gender isAlive',
      })
      .populate({
        path: 'guardian',
        select: 'name photo memberNumber vanshaGenerationNumber generation gender isAlive',
      })
      .lean();

    const treeData = buildLineageTree(members, family);

    res.status(200).json({
      success: true,
      count: members.length,
      data: treeData,
      family: {
        id: family._id,
        name: family.familyName,
        number: family.familyNumber,
        vanshaGenerationNumber: family.vanshaGenerationNumber,
        totalGenerations: family.totalGenerations,
        status: family.status,
      },
    });
  } catch (error) {
    console.error('Family Tree Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// GET FAMILY BY ID
// ============================================================
export const getFamilyById = async (req, res) => {
  try {
    const family = await Family.findById(req.params.id)
      .populate('house', 'houseNumber houseName')
      .populate('familyHead', 'name photo memberNumber phone email')
      .populate('headOfFamily', 'name photo memberNumber phone email');

    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    const members = await Member.find({ family: family._id })
      .select(
        'name photo memberNumber vanshaGenerationNumber gender dob isAlive generation relationship'
      )
      .sort({ generation: 1, name: 1 })
      .limit(100);

    const memberCount = await Member.countDocuments({ family: family._id });
    
    // ⭐ Calculate totalGenerations from actual data
    const allMembers = await Member.find({ family: family._id })
      .select('generation')
      .lean();
    
    let totalGenerations = 0;
    if (allMembers.length > 0) {
      totalGenerations = Math.max(...allMembers.map(m => m.generation || 1));
    }

    res.json({
      ...family.toObject(),
      members,
      memberCount,
      totalGenerations,
    });
  } catch (error) {
    console.error('getFamilyById Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================================
// CREATE FAMILY
// ============================================================
export const createFamily = async (req, res) => {
  try {
    const familyData = {
      ...req.body,
      familyPhoto: req.file?.path || null,
    };

    // ⭐ STEP 1: Handle house creation/finding by houseNumber
    let house = null;

    if (familyData.houseNumber) {
      house = await House.findOne({ houseNumber: familyData.houseNumber });

      if (!house) {
        house = new House({
          houseNumber: familyData.houseNumber,
          houseName: familyData.houseName || '',
          address: familyData.currentAddress || '',
          district: familyData.district || '',
          province: familyData.province || '',
          country: 'Nepal',
          status: 'active',
        });
        await house.save();
        console.log(`🏠 New house created: ${house.houseNumber}`);
      }

      familyData.house = house._id;
      delete familyData.houseNumber;
      delete familyData.houseName;
    }

    if (!familyData.house) {
      return res.status(400).json({
        success: false,
        message: 'House is required. Please provide a house number.',
      });
    }

    const houseExists = await House.findById(familyData.house);
    if (!houseExists) {
      return res.status(400).json({
        success: false,
        message: 'House not found',
      });
    }

    // ⭐ STEP 2: DUPLICATE PREVENTION
    if (familyData.familyName && familyData.house) {
      const existingFamily = await Family.findOne({
        familyName: { $regex: `^${familyData.familyName.trim()}$`, $options: 'i' },
        house: familyData.house,
        status: 'open',
      });

      if (existingFamily) {
        return res.status(409).json({
          success: false,
          message: `यो परिवार पहिले नै यस घरमा दर्ता भइसकेको छ: ${existingFamily.familyName} (परिवार नं. ${existingFamily.familyNumber})। कृपया जाँच गर्नुहोस्।`,
          existingFamily: {
            _id: existingFamily._id,
            familyName: existingFamily.familyName,
            familyNumber: existingFamily.familyNumber,
          },
        });
      }
    }

    // ⭐ STEP 3: Handle family head (ObjectId OR manual name)
    if (familyData.familyHead) {
      // Check if it's a valid ObjectId
      if (familyData.familyHead.length === 24) {
        const member = await Member.findById(familyData.familyHead);
        if (!member) {
          // Not a valid member - treat as manual name
          familyData.familyHeadName = familyData.familyHead;
          familyData.familyHead = null;
        }
      } else {
        // Manual name entry
        familyData.familyHeadName = familyData.familyHead;
        familyData.familyHead = null;
      }
    }

    // ⭐ STEP 4: RETRY LOGIC for duplicate familyNumber
    let family;
    let retries = 5;
    while (retries > 0) {
      try {
        family = new Family(familyData);
        await family.save();
        break;
      } catch (err) {
        if (err.code === 11000 && err.keyPattern?.familyNumber) {
          const lastFamily = await Family.findOne({ house: familyData.house })
            .sort({ familyNumber: -1 })
            .lean();
          const lastNumber = lastFamily ? parseInt(lastFamily.familyNumber, 10) : 0;
          familyData.familyNumber = String(lastNumber + 1);
          retries--;
          console.log(`⚠️ Duplicate familyNumber, retrying with: ${familyData.familyNumber}`);
        } else {
          throw err;
        }
      }
    }

    if (!family) {
      return res.status(500).json({
        success: false,
        message: 'Failed to generate unique family number. Please retry.',
      });
    }

    // ⭐ STEP 5: Update house family count
    if (family.house) {
      await House.findByIdAndUpdate(family.house, {
        $inc: { familyCount: 1 },
      });
    }

    // ⭐ STEP 6: Create notification
    const notification = new Notification({
      type: 'family_added',
      title: 'New Family Added',
      message: `Family "${family.familyName}" has been added to the system.`,
      data: { familyId: family._id },
      createdBy: req.user?._id || null,
    });
    await notification.save();

    io.emit('family:created', family);
    io.emit('notification:new', notification);

    res.status(201).json(family);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'यो परिवार नम्बर यस घरमा पहिले नै अवस्थित छ। कृपया फरक नाम प्रयोग गर्नुहोस्।',
      });
    }
    console.error('createFamily Error:', error);
    res.status(400).json({ success: false, message: error.message });
  }
};

// ============================================================
// UPDATE FAMILY
// ============================================================
export const updateFamily = async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    if (family.status === 'closed') {
      return res.status(403).json({
        message: 'Family is closed and cannot be modified. Please reopen to edit.',
      });
    }

    const updateData = { ...req.body };

    // Handle house update by houseNumber
    if (updateData.houseNumber) {
      let house = await House.findOne({ houseNumber: updateData.houseNumber });

      if (!house) {
        house = new House({
          houseNumber: updateData.houseNumber,
          houseName: updateData.houseName || '',
          address: updateData.currentAddress || '',
          district: updateData.district || '',
          province: updateData.province || '',
          country: 'Nepal',
          status: 'active',
        });
        await house.save();
      }

      updateData.house = house._id;
      delete updateData.houseNumber;
      delete updateData.houseName;
    }

    // ⭐ Handle family head (ObjectId OR manual name)
    if (updateData.familyHead !== undefined) {
      if (updateData.familyHead && updateData.familyHead.length === 24) {
        const member = await Member.findById(updateData.familyHead);
        if (!member) {
          updateData.familyHeadName = updateData.familyHead;
          updateData.familyHead = null;
        }
      } else if (updateData.familyHead) {
        updateData.familyHeadName = updateData.familyHead;
        updateData.familyHead = null;
      }
    }

    // Handle old photo deletion
    if (req.file && family.familyPhoto) {
      const publicId = family.familyPhoto.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    const updatedFamily = await Family.findByIdAndUpdate(
      req.params.id,
      {
        ...updateData,
        familyPhoto: req.file?.path || family.familyPhoto,
      },
      { new: true, runValidators: true }
    );

    // ⭐ Recalculate generations
    if (updatedFamily.recalculateGenerations) {
      await updatedFamily.recalculateGenerations();
    }

    const notification = new Notification({
      type: 'family_updated',
      title: 'Family Updated',
      message: `Family "${updatedFamily.familyName}" has been updated.`,
      data: { familyId: updatedFamily._id },
      createdBy: req.user?._id || null,
    });
    await notification.save();

    io.emit('family:updated', updatedFamily);
    io.emit('notification:new', notification);

    res.json(updatedFamily);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Family number already exists in this house' });
    }
    console.error('updateFamily Error:', error);
    res.status(400).json({ message: error.message });
  }
};

// ============================================================
// DELETE FAMILY
// ============================================================
export const deleteFamily = async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    const memberCount = await Member.countDocuments({ family: family._id });
    if (memberCount > 0) {
      return res.status(400).json({
        message: 'Cannot delete family with members. Transfer members first.',
      });
    }

    if (family.familyPhoto) {
      const publicId = family.familyPhoto.split('/').pop().split('.')[0];
      await cloudinary.uploader.destroy(publicId).catch(() => {});
    }

    if (family.house) {
      await House.findByIdAndUpdate(family.house, {
        $inc: { familyCount: -1 },
      });
    }

    await family.deleteOne();

    io.emit('family:deleted', { id: req.params.id });

    res.json({ message: 'Family deleted successfully' });
  } catch (error) {
    console.error('deleteFamily Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================================
// CLOSE FAMILY
// ============================================================
export const closeFamily = async (req, res) => {
  try {
    const { id } = req.params;
    const { reason } = req.body;

    const family = await Family.findById(id);
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    if (family.status === 'closed') {
      return res.status(400).json({ message: 'Family is already closed' });
    }

    family.status = 'closed';
    family.closedAt = new Date();
    family.closedReason = reason || 'No reason provided';

    await family.save();

    const notification = new Notification({
      type: 'family_closed',
      title: 'Family Closed',
      message: `Family "${family.familyName}" has been closed.`,
      data: { familyId: family._id },
      createdBy: req.user?._id || null,
    });
    await notification.save();

    io.emit('family:closed', family);
    io.emit('notification:new', notification);

    res.json({
      message: 'Family closed successfully',
      family,
    });
  } catch (error) {
    console.error('closeFamily Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================================
// REOPEN FAMILY
// ============================================================
export const reopenFamily = async (req, res) => {
  try {
    const { id } = req.params;

    const family = await Family.findById(id);
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    if (family.status === 'open') {
      return res.status(400).json({ message: 'Family is already open' });
    }

    family.status = 'open';
    family.reopenedAt = new Date();

    await family.save();

    const notification = new Notification({
      type: 'family_reopened',
      title: 'Family Reopened',
      message: `Family "${family.familyName}" has been reopened.`,
      data: { familyId: family._id },
      createdBy: req.user?._id || null,
    });
    await notification.save();

    io.emit('family:reopened', family);
    io.emit('notification:new', notification);

    res.json({
      message: 'Family reopened successfully',
      family,
    });
  } catch (error) {
    console.error('reopenFamily Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================================
// GET NEXT FAMILY NUMBER
// ============================================================
export const getNextFamilyNumber = async (req, res) => {
  try {
    const { houseId } = req.params;

    const house = await House.findById(houseId);
    if (!house) {
      return res.status(404).json({ message: 'House not found' });
    }

    const lastFamily = await Family.findOne({ house: houseId }).sort({ familyNumber: -1 });

    const nextNumber = lastFamily ? parseInt(lastFamily.familyNumber, 10) + 1 : 1;

    res.json({
      houseId,
      houseNumber: house.houseNumber,
      nextFamilyNumber: String(nextNumber),
    });
  } catch (error) {
    console.error('getNextFamilyNumber Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================================
// GET FAMILY STATS
// ============================================================
export const getFamilyStats = async (req, res) => {
  try {
    const [totalFamilies, memberStats] = await Promise.all([
      Family.countDocuments(),
      Member.aggregate([
        {
          $group: {
            _id: '$family',
            count: { $sum: 1 },
          },
        },
      ]),
    ]);

    const familiesWithMembers = memberStats.length;

    res.json({
      totalFamilies,
      familiesWithMembers,
      averageMembersPerFamily:
        totalFamilies > 0
          ? Math.round(memberStats.reduce((acc, curr) => acc + curr.count, 0) / totalFamilies)
          : 0,
    });
  } catch (error) {
    console.error('getFamilyStats Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// ============================================================
// GET FAMILY BANSHA NUMBERS (with preservation)
// ============================================================
export const getFamilyBanshaNumbers = async (req, res) => {
  try {
    const { familyId } = req.params;

    if (!familyId) {
      return res.status(400).json({
        success: false,
        message: 'Family ID is required',
      });
    }

    const family = await Family.findById(familyId);
    if (!family) {
      return res.status(404).json({
        success: false,
        message: 'Family not found',
      });
    }

    const members = await Member.find({ family: familyId })
      .select('vanshaGenerationNumber')
      .lean();

    const banshaNumbers = [
      ...new Set(
        members
          .map((m) => m.vanshaGenerationNumber)
          .filter((num) => num && num.trim() !== '')
      ),
    ].sort((a, b) => {
      const numA = parseInt(a, 10);
      const numB = parseInt(b, 10);
      if (!isNaN(numA) && !isNaN(numB)) {
        return numA - numB;
      }
      return a.localeCompare(b);
    });

    // ⭐ Include family's default Bansha number
    if (
      family.vanshaGenerationNumber &&
      !banshaNumbers.includes(family.vanshaGenerationNumber)
    ) {
      banshaNumbers.push(family.vanshaGenerationNumber);
    }

    res.json({
      success: true,
      data: banshaNumbers,
      family: {
        id: family._id,
        name: family.familyName,
        number: family.familyNumber,
        houseIdentifier: family.houseIdentifier,
        defaultBansha: family.vanshaGenerationNumber,
      },
    });
  } catch (error) {
    console.error('getFamilyBanshaNumbers Error:', error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

// ============================================================
// EXPORTS
// ============================================================
export default {
  getFamilies,
  getFamilyById,
  getFamilyTreeByFamily,
  createFamily,
  updateFamily,
  deleteFamily,
  closeFamily,
  reopenFamily,
  getNextFamilyNumber,
  getFamilyStats,
  getFamilyBanshaNumbers,
};