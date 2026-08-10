// // src/controllers/familyController.js
// import Family from '../models/Family.js';
// import Member from '../models/Member.js';
// import { io } from '../server.js';
// import cloudinary from '../config/cloudinary.js';
// import Notification from '../models/Notification.js';

// export const getFamilies = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search } = req.query;
//     const skip = (page - 1) * limit;

//     let query = {};
//     if (search) {
//       query = {
//         $or: [
//           { familyName: { $regex: search, $options: 'i' } },
//           { familyNumber: { $regex: search, $options: 'i' } },
//           { clan: { $regex: search, $options: 'i' } },
//         ],
//       };
//     }

//     const [families, total] = await Promise.all([
//       Family.find(query)
//         .populate('headOfFamily', 'name photo')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Family.countDocuments(query),
//     ]);

//     res.json({
//       data: families,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
 
// };

// // src/controllers/familyController.js - Add getFamilyTreeByFamily function
// // src/controllers/familyController.js - Enhanced getFamilyTreeByFamily
// export const getFamilyTreeByFamily = async (req, res) => {
//   try {
//     const { familyId } = req.params;
    
//     const family = await Family.findById(familyId);
//     if (!family) {
//       return res.status(404).json({ message: 'Family not found' });
//     }

//     // Get all members in this family with proper population
//     const members = await Member.find({ family: familyId })
//       .populate({
//         path: 'father',
//         select: 'name photo memberNumber familyNumber generation'
//       })
//       .populate({
//         path: 'mother',
//         select: 'name photo memberNumber familyNumber generation'
//       })
//       .populate({
//         path: 'spouse',
//         select: 'name photo memberNumber familyNumber generation'
//       })
//       .populate({
//         path: 'grandfather',
//         select: 'name photo memberNumber familyNumber generation'
//       })
//       .populate({
//         path: 'grandmother',
//         select: 'name photo memberNumber familyNumber generation'
//       })
//       .populate({
//         path: 'guardian',
//         select: 'name photo memberNumber familyNumber generation'
//       })
//       .lean();

//     // Add family info to each member
//     const enrichedMembers = members.map(m => ({
//       ...m,
//       familyName: family.familyName,
//       familyNumber: family.familyNumber,
//     }));

//     res.status(200).json({
//       success: true,
//       count: members.length,
//       data: enrichedMembers,
//     });
//   } catch (error) {
//     console.error("Family Tree Error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const getFamilyById = async (req, res) => {
//   try {
//     const family = await Family.findById(req.params.id)
//       .populate('headOfFamily', 'name photo phone email');

//     if (!family) {
//       return res.status(404).json({ message: 'Family not found' });
//     }

//     // Get all members in this family
//     const members = await Member.find({ family: family._id })
//       .select('name photo gender dob isAlive relation')
//       .limit(100);

//     res.json({
//       ...family.toObject(),
//       members,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const createFamily = async (req, res) => {
//   try {
//     const familyData = {
//       ...req.body,
//       familyPhoto: req.file?.path || null,
//       createdBy: req.user?._id || null,
//       updatedBy: req.user?._id || null,
//     };

//     const family = new Family(familyData);
//     await family.save();

//     // Create notification
//     const notification = new Notification({
//       type: 'family_added',
//       title: 'New Family Added',
//       message: `Family "${family.familyName}" has been added to the system.`,
//       data: { familyId: family._id },
//       createdBy: req.user?._id || null,
//     });
//     await notification.save();

//     // Emit socket event
//     io.emit('family:created', family);
//     io.emit('notification:new', notification);

//     res.status(201).json(family);
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({ message: 'Family number already exists' });
//     }
//     res.status(400).json({ message: error.message });
//   }
// };



// export const updateFamily = async (req, res) => {
//   try {
//     const family = await Family.findById(req.params.id);
//     if (!family) {
//       return res.status(404).json({ message: 'Family not found' });
//     }

//     // Delete old photo if new one uploaded
//     if (req.file && family.familyPhoto) {
//       const publicId = family.familyPhoto.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId);
//     }

//     const updatedFamily = await Family.findByIdAndUpdate(
//       req.params.id,
//       {
//         ...req.body,
//         familyPhoto: req.file?.path || family.familyPhoto,
//         updatedBy: req.user?._id || null,
//       },
//       { new: true, runValidators: true }
//     );

//     // Create notification
//     const notification = new Notification({
//       type: 'family_updated',
//       title: 'Family Updated',
//       message: `Family "${updatedFamily.familyName}" has been updated.`,
//       data: { familyId: updatedFamily._id },
//       createdBy: req.user?._id || null,
//     });
//     await notification.save();

//     io.emit('family:updated', updatedFamily);
//     io.emit('notification:new', notification);

//     res.json(updatedFamily);
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({ message: 'Family number already exists' });
//     }
//     res.status(400).json({ message: error.message });
//   }
// };

// export const deleteFamily = async (req, res) => {
//   try {
//     const family = await Family.findById(req.params.id);
//     if (!family) {
//       return res.status(404).json({ message: 'Family not found' });
//     }

//     // Check if family has members
//     const memberCount = await Member.countDocuments({ family: family._id });
//     if (memberCount > 0) {
//       return res.status(400).json({ 
//         message: 'Cannot delete family with members. Transfer members first.' 
//       });
//     }

//     // Delete photo from Cloudinary
//     if (family.familyPhoto) {
//       const publicId = family.familyPhoto.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId);
//     }

//     await family.deleteOne();

//     io.emit('family:deleted', { id: req.params.id });

//     res.json({ message: 'Family deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getFamilyStats = async (req, res) => {
//   try {
//     const [totalFamilies, memberStats] = await Promise.all([
//       Family.countDocuments(),
//       Member.aggregate([
//         {
//           $group: {
//             _id: '$family',
//             count: { $sum: 1 },
//           },
//         },
//       ]),
//     ]);

//     const familiesWithMembers = memberStats.length;

//     res.json({
//       totalFamilies,
//       familiesWithMembers,
//       averageMembersPerFamily: totalFamilies > 0 ? 
//         Math.round(memberStats.reduce((acc, curr) => acc + curr.count, 0) / totalFamilies) : 0,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// import Family from '../models/Family.js';
// import Member from '../models/Member.js';
// import { io } from '../server.js';
// import cloudinary from '../config/cloudinary.js';
// import Notification from '../models/Notification.js';

// export const getFamilies = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search } = req.query;
//     const skip = (page - 1) * limit;

//     let query = {};
//     if (search) {
//       query = {
//         $or: [
//           { familyName: { $regex: search, $options: 'i' } },
//           { familyNumber: { $regex: search, $options: 'i' } },
//           { clan: { $regex: search, $options: 'i' } },
//         ],
//       };
//     }

//     const [families, total] = await Promise.all([
//       Family.find(query)
//         .populate('headOfFamily', 'name photo')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Family.countDocuments(query),
//     ]);

//     res.json({
//       data: families,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getFamilyTreeByFamily = async (req, res) => {
//   try {
//     const { familyId } = req.params;
    
//     const family = await Family.findById(familyId);
//     if (!family) {
//       return res.status(404).json({ message: 'Family not found' });
//     }

//     // Get all members in this family with proper population
//     const members = await Member.find({ family: familyId })
//       .populate({
//         path: 'father',
//         select: 'name photo memberNumber familyNumber generation'
//       })
//       .populate({
//         path: 'mother',
//         select: 'name photo memberNumber familyNumber generation'
//       })
//       .populate({
//         path: 'spouse',
//         select: 'name photo memberNumber familyNumber generation'
//       })
//       .populate({
//         path: 'grandfather',
//         select: 'name photo memberNumber familyNumber generation'
//       })
//       .populate({
//         path: 'grandmother',
//         select: 'name photo memberNumber familyNumber generation'
//       })
//       .populate({
//         path: 'guardian',
//         select: 'name photo memberNumber familyNumber generation'
//       })
//       .populate({
//         path: 'sons daughters grandsons granddaughters',
//         select: 'name photo memberNumber familyNumber generation'
//       })
//       .lean();

//     // Add family info to each member
//     const enrichedMembers = members.map(m => ({
//       ...m,
//       familyName: family.familyName,
//       familyNumber: family.familyNumber,
//     }));

//     res.status(200).json({
//       success: true,
//       count: members.length,
//       data: enrichedMembers,
//     });
//   } catch (error) {
//     console.error("Family Tree Error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// export const getFamilyById = async (req, res) => {
//   try {
//     const family = await Family.findById(req.params.id)
//       .populate('headOfFamily', 'name photo phone email');

//     if (!family) {
//       return res.status(404).json({ message: 'Family not found' });
//     }

//     const members = await Member.find({ family: family._id })
//       .select('name photo gender dob isAlive generation memberNumber relationship')
//       .limit(100);

//     res.json({
//       ...family.toObject(),
//       members,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const createFamily = async (req, res) => {
//   try {
//     const familyData = {
//       ...req.body,
//       familyPhoto: req.file?.path || null,
//       createdBy: req.user?._id || null,
//       updatedBy: req.user?._id || null,
//     };

//     const family = new Family(familyData);
//     await family.save();

//     const notification = new Notification({
//       type: 'family_added',
//       title: 'New Family Added',
//       message: `Family "${family.familyName}" has been added to the system.`,
//       data: { familyId: family._id },
//       createdBy: req.user?._id || null,
//     });
//     await notification.save();

//     io.emit('family:created', family);
//     io.emit('notification:new', notification);

//     res.status(201).json(family);
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({ message: 'Family number already exists' });
//     }
//     res.status(400).json({ message: error.message });
//   }
// };

// export const updateFamily = async (req, res) => {
//   try {
//     const family = await Family.findById(req.params.id);
//     if (!family) {
//       return res.status(404).json({ message: 'Family not found' });
//     }

//     if (req.file && family.familyPhoto) {
//       const publicId = family.familyPhoto.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId).catch(() => {});
//     }

//     const updatedFamily = await Family.findByIdAndUpdate(
//       req.params.id,
//       {
//         ...req.body,
//         familyPhoto: req.file?.path || family.familyPhoto,
//         updatedBy: req.user?._id || null,
//       },
//       { new: true, runValidators: true }
//     );

//     const notification = new Notification({
//       type: 'family_updated',
//       title: 'Family Updated',
//       message: `Family "${updatedFamily.familyName}" has been updated.`,
//       data: { familyId: updatedFamily._id },
//       createdBy: req.user?._id || null,
//     });
//     await notification.save();

//     io.emit('family:updated', updatedFamily);
//     io.emit('notification:new', notification);

//     res.json(updatedFamily);
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({ message: 'Family number already exists' });
//     }
//     res.status(400).json({ message: error.message });
//   }
// };

// export const deleteFamily = async (req, res) => {
//   try {
//     const family = await Family.findById(req.params.id);
//     if (!family) {
//       return res.status(404).json({ message: 'Family not found' });
//     }

//     const memberCount = await Member.countDocuments({ family: family._id });
//     if (memberCount > 0) {
//       return res.status(400).json({ 
//         message: 'Cannot delete family with members. Transfer members first.' 
//       });
//     }

//     if (family.familyPhoto) {
//       const publicId = family.familyPhoto.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId).catch(() => {});
//     }

//     await family.deleteOne();

//     io.emit('family:deleted', { id: req.params.id });

//     res.json({ message: 'Family deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getFamilyStats = async (req, res) => {
//   try {
//     const [totalFamilies, memberStats] = await Promise.all([
//       Family.countDocuments(),
//       Member.aggregate([
//         {
//           $group: {
//             _id: '$family',
//             count: { $sum: 1 },
//           },
//         },
//       ]),
//     ]);

//     const familiesWithMembers = memberStats.length;

//     res.json({
//       totalFamilies,
//       familiesWithMembers,
//       averageMembersPerFamily: totalFamilies > 0 ? 
//         Math.round(memberStats.reduce((acc, curr) => acc + curr.count, 0) / totalFamilies) : 0,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// src/controllers/familyController.js
import Family from '../models/Family.js';
import House from '../models/House.js';
import Member from '../models/Member.js';
import { io } from '../server.js';
import cloudinary from '../config/cloudinary.js';
import Notification from '../models/Notification.js';

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

    // Get member counts for each family
    const familiesWithCounts = await Promise.all(
      families.map(async (family) => {
        const memberCount = await Member.countDocuments({ family: family._id });
        const generations = await Member.distinct('generation', { family: family._id });
        return {
          ...family.toObject(),
          memberCount,
          generationCount: generations.length,
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

// LINEAGE TREE BUILDER - Core lineage logic
const buildLineageTree = (members, family) => {
  if (!members || members.length === 0) return [];

  const memberMap = {};
  const rootCandidates = [];

  // Create map of all members
  members.forEach((m) => {
    memberMap[m._id.toString()] = {
      ...m,
      children: [],
      spouses: [],
      parents: [],
      level: 0,
      isLineageSource: true, // Default true for all members
    };
  });

  // Build relationships with lineage logic
  members.forEach((m) => {
    const memberId = m._id.toString();
    const member = memberMap[memberId];
    if (!member) return;

    // Determine if this member is a spouse (not lineage source)
    if (m.spouse) {
      const spouseId =
        typeof m.spouse === 'object' ? m.spouse._id?.toString() : m.spouse?.toString();
      if (spouseId && memberMap[spouseId]) {
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

    // Grandfather relationship
    if (m.grandfather) {
      const grandId =
        typeof m.grandfather === 'object' ? m.grandfather._id?.toString() : m.grandfather?.toString();
      if (grandId && memberMap[grandId]) {
        if (!member.parents.includes(grandId)) {
          member.parents.push(grandId);
        }
        memberMap[grandId].isLineageSource = true;
      }
    }

    // Grandmother relationship
    if (m.grandmother) {
      const grandId =
        typeof m.grandmother === 'object' ? m.grandmother._id?.toString() : m.grandmother?.toString();
      if (grandId && memberMap[grandId]) {
        if (!member.parents.includes(grandId)) {
          member.parents.push(grandId);
        }
        memberMap[grandId].isLineageSource = true;
      }
    }
  });

  // Identify spouses (married into the family)
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

// Helper to enrich node with lineage-based children and spouses
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

    // Get all members in this family
    const members = await Member.find({ family: familyId })
      .populate({
        path: 'father',
        select:
          'name photo memberNumber rollNumber vanshaGenerationNumber generation gender isAlive',
      })
      .populate({
        path: 'mother',
        select:
          'name photo memberNumber rollNumber vanshaGenerationNumber generation gender isAlive',
      })
      .populate({
        path: 'spouse',
        select:
          'name photo memberNumber rollNumber vanshaGenerationNumber generation gender isAlive',
      })
      .populate({
        path: 'grandfather',
        select:
          'name photo memberNumber rollNumber vanshaGenerationNumber generation gender isAlive',
      })
      .populate({
        path: 'grandmother',
        select:
          'name photo memberNumber rollNumber vanshaGenerationNumber generation gender isAlive',
      })
      .populate({
        path: 'guardian',
        select:
          'name photo memberNumber rollNumber vanshaGenerationNumber generation gender isAlive',
      })
      .lean();

    // Build lineage-based tree
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
        'name photo memberNumber rollNumber vanshaGenerationNumber gender dob isAlive generation relationship'
      )
      .sort({ createdAt: -1 })
      .limit(100);

    const memberCount = await Member.countDocuments({ family: family._id });
    const generations = await Member.distinct('generation', { family: family._id });

    res.json({
      ...family.toObject(),
      members,
      memberCount,
      generationCount: generations.length,
    });
  } catch (error) {
    console.error('getFamilyById Error:', error);
    res.status(500).json({ message: error.message });
  }
};

// controllers/familyController.js - UPDATED createFamily with houseNumber handling

export const createFamily = async (req, res) => {
  try {
    const familyData = {
      ...req.body,
      familyPhoto: req.file?.path || null,
    };

    // ⭐ NEW: Handle house creation/finding by houseNumber
    let house = null;
    
    // Check if houseNumber is provided (from frontend)
    if (familyData.houseNumber) {
      // Try to find existing house by houseNumber
      house = await House.findOne({ houseNumber: familyData.houseNumber });
      
      if (!house) {
        // Create new house with the provided house number and name
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
      } else {
        console.log(`🏠 Existing house found: ${house.houseNumber}`);
      }
      
      // Set the house reference
      familyData.house = house._id;
      
      // Remove houseNumber and houseName from family data (they belong to house)
      delete familyData.houseNumber;
      delete familyData.houseName;
    }

    // Validate house exists
    if (!familyData.house) {
      return res.status(400).json({ 
        message: 'House is required. Please provide a house number.' 
      });
    }

    // Validate house exists in database
    const houseExists = await House.findById(familyData.house);
    if (!houseExists) {
      return res.status(400).json({ message: 'House not found' });
    }

    const family = new Family(familyData);
    await family.save();

    // Update house family count
    if (family.house) {
      await House.findByIdAndUpdate(family.house, {
        $inc: { familyCount: 1 },
      });
    }

    const notification = new Notification({
      type: 'family_added',
      title: 'New Family Added',
      message: `Family "${family.familyName}" has been added to the system.`,
      data: { familyId: family._id },
      createdBy: null,
    });
    await notification.save();

    io.emit('family:created', family);
    io.emit('notification:new', notification);

    res.status(201).json(family);
  } catch (error) {
    if (error.code === 11000) {
      return res.status(400).json({ message: 'Family number already exists in this house' });
    }
    console.error('createFamily Error:', error);
    res.status(400).json({ message: error.message });
  }
};

// controllers/familyController.js - UPDATED updateFamily with houseNumber handling

export const updateFamily = async (req, res) => {
  try {
    const family = await Family.findById(req.params.id);
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    // Check if family is closed
    if (family.status === 'closed') {
      return res.status(403).json({
        message: 'Family is closed and cannot be modified. Please reopen to edit.',
      });
    }

    const updateData = { ...req.body };

    // ⭐ NEW: Handle house update by houseNumber
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
        console.log(`🏠 New house created: ${house.houseNumber}`);
      }
      
      updateData.house = house._id;
      delete updateData.houseNumber;
      delete updateData.houseName;
    }

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

    const notification = new Notification({
      type: 'family_updated',
      title: 'Family Updated',
      message: `Family "${updatedFamily.familyName}" has been updated.`,
      data: { familyId: updatedFamily._id },
      createdBy: null,
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

    // Update house family count
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
      createdBy: null,
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
      createdBy: null,
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

export const getNextVanshaNumber = async (req, res) => {
  try {
    const { familyId } = req.params;

    const members = await Member.find({ family: familyId })
      .select('vanshaGenerationNumber')
      .lean();

    let maxNumber = 0;
    members.forEach((m) => {
      if (m.vanshaGenerationNumber) {
        const num = parseInt(m.vanshaGenerationNumber, 10);
        if (!isNaN(num) && num > maxNumber) {
          maxNumber = num;
        }
      }
    });

    const nextNumber = maxNumber + 1;

    res.json({
      familyId,
      nextVanshaNumber: String(nextNumber),
      suggestion: `Auto: ${nextNumber}`,
    });
  } catch (error) {
    console.error('getNextVanshaNumber Error:', error);
    res.status(500).json({ message: error.message });
  }
};

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





// //src/controllers/familyController.js
// import Family from '../models/Family.js';
// import Member from '../models/Member.js';
// import { io } from '../server.js';
// import cloudinary from '../config/cloudinary.js';
// import Notification from '../models/Notification.js';

// export const getFamilies = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search } = req.query;
//     const skip = (page - 1) * limit;

//     let query = {};
//     if (search) {
//       query = {
//         $or: [
//           { familyName: { $regex: search, $options: 'i' } },
//           { familyNumber: { $regex: search, $options: 'i' } },
//           { clan: { $regex: search, $options: 'i' } },
//         ],
//       };
//     }

//     const [families, total] = await Promise.all([
//       Family.find(query)
//         .populate('headOfFamily', 'name photo memberNumber')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Family.countDocuments(query),
//     ]);

//     res.json({
//       data: families,
//       pagination: {
//         page: parseInt(page),
//         limit: parseInt(limit),
//         total,
//         pages: Math.ceil(total / limit),
//       },
//     });
//   } catch (error) {
//     console.error('getFamilies Error:', error);
//     res.status(500).json({ message: error.message });
//   }
// };

// // FIXED: Get family tree with proper relationship building
// export const getFamilyTreeByFamily = async (req, res) => {
//   try {
//     const { familyId } = req.params;
    
//     if (!familyId) {
//       return res.status(400).json({ 
//         success: false, 
//         message: 'Family ID is required' 
//       });
//     }

//     const family = await Family.findById(familyId);
//     if (!family) {
//       return res.status(404).json({ 
//         success: false, 
//         message: 'Family not found' 
//       });
//     }

//     // Get all members in this family with full population
//     const members = await Member.find({ family: familyId })
//       .populate({
//         path: 'father',
//         select: 'name photo memberNumber familyNumber generation gender'
//       })
//       .populate({
//         path: 'mother',
//         select: 'name photo memberNumber familyNumber generation gender'
//       })
//       .populate({
//         path: 'spouse',
//         select: 'name photo memberNumber familyNumber generation gender'
//       })
//       .populate({
//         path: 'grandfather',
//         select: 'name photo memberNumber familyNumber generation gender'
//       })
//       .populate({
//         path: 'grandmother',
//         select: 'name photo memberNumber familyNumber generation gender'
//       })
//       .populate({
//         path: 'guardian',
//         select: 'name photo memberNumber familyNumber generation gender'
//       })
//       .populate({
//         path: 'sons daughters grandsons granddaughters',
//         select: 'name photo memberNumber familyNumber generation gender'
//       })
//       .lean();

//     // Build tree structure
//     const treeData = buildFamilyTree(members);

//     res.status(200).json({
//       success: true,
//       count: members.length,
//       data: treeData,
//       family: {
//         id: family._id,
//         name: family.familyName,
//         number: family.familyNumber,
//       }
//     });
//   } catch (error) {
//     console.error("Family Tree Error:", error);
//     res.status(500).json({
//       success: false,
//       message: error.message,
//     });
//   }
// };

// // Helper function to build family tree
// const buildFamilyTree = (members) => {
//   if (!members || members.length === 0) return [];

//   const memberMap = {};
  
//   // Create map of all members
//   members.forEach(m => {
//     memberMap[m._id.toString()] = {
//       ...m,
//       children: [],
//       spouses: [],
//       parents: [],
//       level: 0,
//     };
//   });

//   // Build relationships
//   members.forEach(m => {
//     const memberId = m._id.toString();
//     const member = memberMap[memberId];
//     if (!member) return;

//     // Father relationship
//     if (m.father) {
//       const fatherId = typeof m.father === 'object' ? m.father._id?.toString() : m.father?.toString();
//       if (fatherId && memberMap[fatherId]) {
//         if (!memberMap[fatherId].children.includes(memberId)) {
//           memberMap[fatherId].children.push(memberId);
//         }
//         if (!member.parents.includes(fatherId)) {
//           member.parents.push(fatherId);
//         }
//       }
//     }

//     // Mother relationship
//     if (m.mother) {
//       const motherId = typeof m.mother === 'object' ? m.mother._id?.toString() : m.mother?.toString();
//       if (motherId && memberMap[motherId]) {
//         if (!memberMap[motherId].children.includes(memberId)) {
//           memberMap[motherId].children.push(memberId);
//         }
//         if (!member.parents.includes(motherId)) {
//           member.parents.push(motherId);
//         }
//       }
//     }

//     // Spouse relationship
//     if (m.spouse) {
//       const spouseId = typeof m.spouse === 'object' ? m.spouse._id?.toString() : m.spouse?.toString();
//       if (spouseId && memberMap[spouseId]) {
//         if (!member.spouses.includes(spouseId)) {
//           member.spouses.push(spouseId);
//         }
//         if (!memberMap[spouseId].spouses.includes(memberId)) {
//           memberMap[spouseId].spouses.push(memberId);
//         }
//       }
//     }

//     // Grandfather relationship
//     if (m.grandfather) {
//       const grandId = typeof m.grandfather === 'object' ? m.grandfather._id?.toString() : m.grandfather?.toString();
//       if (grandId && memberMap[grandId]) {
//         if (!member.parents.includes(grandId)) {
//           member.parents.push(grandId);
//         }
//       }
//     }

//     // Grandmother relationship
//     if (m.grandmother) {
//       const grandId = typeof m.grandmother === 'object' ? m.grandmother._id?.toString() : m.grandmother?.toString();
//       if (grandId && memberMap[grandId]) {
//         if (!member.parents.includes(grandId)) {
//           member.parents.push(grandId);
//         }
//       }
//     }
//   });

//   // Find root nodes (members with no parents)
//   const roots = Object.values(memberMap).filter(m => m.parents.length === 0);

//   // If no roots found, use members with lowest generation
//   if (roots.length === 0) {
//     const minGen = Math.min(...Object.values(memberMap).map(m => m.generation || 99));
//     return Object.values(memberMap)
//       .filter(m => (m.generation || 99) === minGen)
//       .map(m => enrichNode(m, memberMap));
//   }

//   // Build tree recursively
//   return roots.map(root => enrichNode(root, memberMap));
// };

// // Helper to enrich node with children and spouses
// const enrichNode = (node, memberMap, level = 0) => {
//   const enriched = {
//     ...node,
//     level,
//     children: node.children
//       .filter(id => memberMap[id])
//       .map(id => enrichNode(memberMap[id], memberMap, level + 1)),
//     spouses: node.spouses
//       .filter(id => memberMap[id])
//       .map(id => enrichNode(memberMap[id], memberMap, level)),
//   };
//   return enriched;
// };

// export const getFamilyById = async (req, res) => {
//   try {
//     const family = await Family.findById(req.params.id)
//       .populate('headOfFamily', 'name photo memberNumber phone email');

//     if (!family) {
//       return res.status(404).json({ message: 'Family not found' });
//     }

//     const members = await Member.find({ family: family._id })
//       .select('name photo memberNumber gender dob isAlive generation relationship')
//       .sort({ createdAt: -1 })
//       .limit(100);

//     res.json({
//       ...family.toObject(),
//       members,
//     });
//   } catch (error) {
//     console.error('getFamilyById Error:', error);
//     res.status(500).json({ message: error.message });
//   }
// };

// export const createFamily = async (req, res) => {
//   try {
//     const familyData = {
//       ...req.body,
//       familyPhoto: req.file?.path || null,
//       createdBy: req.user?._id || null,
//       updatedBy: req.user?._id || null,
//     };

//     const family = new Family(familyData);
//     await family.save();

//     const notification = new Notification({
//       type: 'family_added',
//       title: 'New Family Added',
//       message: `Family "${family.familyName}" has been added to the system.`,
//       data: { familyId: family._id },
//       createdBy: req.user?._id || null,
//     });
//     await notification.save();

//     io.emit('family:created', family);
//     io.emit('notification:new', notification);

//     res.status(201).json(family);
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({ message: 'Family number already exists' });
//     }
//     console.error('createFamily Error:', error);
//     res.status(400).json({ message: error.message });
//   }
// };

// export const updateFamily = async (req, res) => {
//   try {
//     const family = await Family.findById(req.params.id);
//     if (!family) {
//       return res.status(404).json({ message: 'Family not found' });
//     }

//     if (req.file && family.familyPhoto) {
//       const publicId = family.familyPhoto.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId).catch(() => {});
//     }

//     const updatedFamily = await Family.findByIdAndUpdate(
//       req.params.id,
//       {
//         ...req.body,
//         familyPhoto: req.file?.path || family.familyPhoto,
//         updatedBy: req.user?._id || null,
//       },
//       { new: true, runValidators: true }
//     );

//     const notification = new Notification({
//       type: 'family_updated',
//       title: 'Family Updated',
//       message: `Family "${updatedFamily.familyName}" has been updated.`,
//       data: { familyId: updatedFamily._id },
//       createdBy: req.user?._id || null,
//     });
//     await notification.save();

//     io.emit('family:updated', updatedFamily);
//     io.emit('notification:new', notification);

//     res.json(updatedFamily);
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({ message: 'Family number already exists' });
//     }
//     console.error('updateFamily Error:', error);
//     res.status(400).json({ message: error.message });
//   }
// };

// export const deleteFamily = async (req, res) => {
//   try {
//     const family = await Family.findById(req.params.id);
//     if (!family) {
//       return res.status(404).json({ message: 'Family not found' });
//     }

//     const memberCount = await Member.countDocuments({ family: family._id });
//     if (memberCount > 0) {
//       return res.status(400).json({ 
//         message: 'Cannot delete family with members. Transfer members first.' 
//       });
//     }

//     if (family.familyPhoto) {
//       const publicId = family.familyPhoto.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId).catch(() => {});
//     }

//     await family.deleteOne();

//     io.emit('family:deleted', { id: req.params.id });

//     res.json({ message: 'Family deleted successfully' });
//   } catch (error) {
//     console.error('deleteFamily Error:', error);
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getFamilyStats = async (req, res) => {
//   try {
//     const [totalFamilies, memberStats] = await Promise.all([
//       Family.countDocuments(),
//       Member.aggregate([
//         {
//           $group: {
//             _id: '$family',
//             count: { $sum: 1 },
//           },
//         },
//       ]),
//     ]);

//     const familiesWithMembers = memberStats.length;

//     res.json({
//       totalFamilies,
//       familiesWithMembers,
//       averageMembersPerFamily: totalFamilies > 0 ? 
//         Math.round(memberStats.reduce((acc, curr) => acc + curr.count, 0) / totalFamilies) : 0,
//     });
//   } catch (error) {
//     console.error('getFamilyStats Error:', error);
//     res.status(500).json({ message: error.message });
//   }
// };
