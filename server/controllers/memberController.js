// // src/controllers/memberController.js
// import Member from '../models/Member.js';
// import FamilyRelationship from '../models/FamilyRelationship.js';
// import Family from '../models/Family.js';
// import { io } from '../server.js';
// import cloudinary from '../config/cloudinary.js';
// import Notification from '../models/Notification.js';
// import Counter from '../models/Counter.js';

// export const getMembers = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search } = req.query;
//     const skip = (page - 1) * limit;

//     let query = {};
//     if (search) {
//       query = {
//         $or: [
//           { name: { $regex: search, $options: 'i' } },
//           { phone: { $regex: search, $options: 'i' } },
//           { email: { $regex: search, $options: 'i' } },
//           { familyNumber: { $regex: search, $options: 'i' } },
//           { familyLine: { $regex: search, $options: 'i' } },
//           { citizenshipNumber: { $regex: search, $options: 'i' } },
//         ],
//       };
//     }

//     const [members, total] = await Promise.all([
//       Member.find(query)
//         .populate('family', 'familyName familyNumber')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Member.countDocuments(query),
//     ]);

//     res.json({
//       data: members,
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

// // export const getMemberById = async (req, res) => {
// //   try {
// //     const member = await Member.findById(req.params.id)
// //       .populate('family', 'familyName familyNumber clan')
// //       .populate(
// //         'father mother husband wife spouse grandfather grandmother guardian fatherInLaw motherInLaw',
// //         'name photo'
// //       )
// //       .populate(
// //         'sons daughters elderBrothers youngerBrothers elderSisters youngerSisters grandsons granddaughters sonInLaw daughterInLaw',
// //         'name photo'
// //       );

// //     if (!member) {
// //       return res.status(404).json({ message: 'Member not found' });
// //     }

// //     // Get all relationships
// //     const relationships = await FamilyRelationship.find({
// //       $or: [
// //         { member: member._id },
// //         { relatedMember: member._id },
// //       ],
// //       isActive: true,
// //     }).populate('member relatedMember');

// //     res.json({
// //       ...member.toObject(),
// //       relationships,
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };

// // Get member by ID with proper image URL formatting
// export const getMemberById = async (req, res) => {
//   try {
//     const member = await Member.findById(req.params.id)
//       .populate('family', 'familyName familyNumber clan')
//       .populate(
//         'father mother husband wife spouse grandfather grandmother guardian fatherInLaw motherInLaw',
//         'name photo'
//       )
//       .populate(
//         'sons daughters elderBrothers youngerBrothers elderSisters youngerSisters grandsons granddaughters sonInLaw daughterInLaw',
//         'name photo'
//       );

//     if (!member) {
//       return res.status(404).json({ message: 'Member not found' });
//     }

//     const memberObj = member.toObject();
    
//     // Ensure photo URLs are properly formatted
//     const photoFields = ['photo', 'citizenshipFront', 'citizenshipBack', 'nationalIdFront', 'passportPhoto', 'drivingLicensePhoto'];
//     photoFields.forEach(field => {
//       if (memberObj[field]) {
//         // If URL doesn't start with http, it might be a Cloudinary path
//         if (!memberObj[field].startsWith('http')) {
//           // Check if it's a Cloudinary URL format
//           if (memberObj[field].includes('cloudinary')) {
//             memberObj[field] = memberObj[field];
//           } else {
//             // Default fallback - might need to construct full URL
//             memberObj[field] = memberObj[field];
//           }
//         }
//       }
//     });

//     const relationships = await FamilyRelationship.find({
//       $or: [
//         { member: member._id },
//         { relatedMember: member._id },
//       ],
//       isActive: true,
//     }).populate('member relatedMember');

//     res.json({
//       ...memberObj,
//       relationships,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // export const createMember = async (req, res) => {
// //   try {
// //     const files = req.files || {};

// //     const memberData = {
// //       ...req.body,

// //       photo: files.photo?.[0]?.path || null,
// //       citizenshipFront: files.citizenshipFront?.[0]?.path || null,
// //       citizenshipBack: files.citizenshipBack?.[0]?.path || null,
// //       nationalIdFront: files.nationalIdFront?.[0]?.path || null,
// //       passportPhoto: files.passportPhoto?.[0]?.path || null,
// //       drivingLicensePhoto: files.drivingLicensePhoto?.[0]?.path || null,

// //       createdBy: req.user?._id || null,
// //       updatedBy: req.user?._id || null,
// //     };
// //     // const memberData = {
// //     //   ...req.body,
// //     //   photo: req.file?.path || null,
// //     //   createdBy: req.user?._id || null,
// //     //   updatedBy: req.user?._id || null,
// //     // };

// //     // If family reference provided, update family member count
// //     if (memberData.family) {
// //       await Family.findByIdAndUpdate(memberData.family, {
// //         $inc: { totalMembers: 1 },
// //       });
// //     }

// //     const member = new Member(memberData);
// //     await member.save();

// //     // Synchronize relationships for created member
// //     await synchronizeRelationships(member);

// //     // Create notification
// //     const notification = new Notification({
// //       type: 'member_added',
// //       title: 'New Member Added',
// //       message: `${member.name} has been added to the system.`,
// //       data: { memberId: member._id },
// //       createdBy: req.user?._id || null,
// //     });
// //     await notification.save();

// //     io.emit('member:created', member);
// //     io.emit('notification:new', notification);

// //     res.status(201).json(member);
// //   } catch (error) {
// //   console.log("============== ERROR ==============");
// //   console.log(error);
// //   console.log("message:", error.message);
// //   console.log("name:", error.name);
// //   console.log("code:", error.code);
// //   console.log("stack:", error.stack);
// //   console.log("body:", req.body);
// //   console.log("files:", req.files);

// //   return res.status(400).json({
// //     success: false,
// //     message: error.message || "Unknown Error",
// //     error,
// //   });
// // }
// // };


// export const createMember = async (req, res) => {
//   try {
//     const files = req.files || {};

//     // Get auto-increment member number
//     const counter = await Counter.findByIdAndUpdate(
//       'memberNumber',
//       { $inc: { seq: 1 } },
//       { new: true, upsert: true }
//     );

//     const memberData = {
//       ...req.body,
//       memberNumber: `M-${String(counter.seq).padStart(6, '0')}`, // Format: M-000001
//       photo: files.photo?.[0]?.path || null,
//       citizenshipFront: files.citizenshipFront?.[0]?.path || null,
//       citizenshipBack: files.citizenshipBack?.[0]?.path || null,
//       nationalIdFront: files.nationalIdFront?.[0]?.path || null,
//       passportPhoto: files.passportPhoto?.[0]?.path || null,
//       drivingLicensePhoto: files.drivingLicensePhoto?.[0]?.path || null,
//       createdBy: req.user?._id || null,
//       updatedBy: req.user?._id || null,
//     };

//     if (memberData.family) {
//       await Family.findByIdAndUpdate(memberData.family, {
//         $inc: { totalMembers: 1 },
//       });
//     }

//     const member = new Member(memberData);
//     await member.save();

//     await synchronizeRelationships(member);

//     const notification = new Notification({
//       type: 'member_added',
//       title: 'New Member Added',
//       message: `${member.name} (${member.memberNumber}) has been added to the system.`,
//       data: { memberId: member._id },
//       createdBy: req.user?._id || null,
//     });
//     await notification.save();

//     io.emit('member:created', member);
//     io.emit('notification:new', notification);

//     res.status(201).json(member);
//   } catch (error) {
//     console.log("============== ERROR ==============");
//     console.log(error);
//     console.log("message:", error.message);

//     return res.status(400).json({
//       success: false,
//       message: error.message || "Unknown Error",
//       error,
//     });
//   }
// };

// // export const updateMember = async (req, res) => {
// //   try {
// //     const member = await Member.findById(req.params.id);
// //     if (!member) {
// //       return res.status(404).json({ message: 'Member not found' });
// //     }

// //     // If new photo uploaded, delete old photo from Cloudinary
// //     if (req.file && member.photo) {
// //       const publicId = member.photo.split('/').pop().split('.')[0];
// //       await cloudinary.uploader.destroy(publicId);
// //     }

// //     const updatedMember = await Member.findByIdAndUpdate(
// //       req.params.id,
// //       {
// //         ...req.body,
// //         photo: req.file?.path || member.photo,
// //         updatedBy: req.user?._id || null,
// //       },
// //       { new: true, runValidators: true }
// //     );

// //     // Create notification
// //     const notification = new Notification({
// //       type: 'member_updated',
// //       title: 'Member Updated',
// //       message: `${updatedMember.name}'s profile has been updated.`,
// //       data: { memberId: updatedMember._id },
// //       createdBy: req.user?._id || null,
// //     });
// //     await notification.save();

// //     io.emit('member:updated', updatedMember);
// //     io.emit('notification:new', notification);

// //     res.json(updatedMember);
// //   } catch (error) {
// //     if (error.code === 11000) {
// //       return res.status(400).json({ message: 'Duplicate entry found' });
// //     }
// //     res.status(400).json({ message: error.message });
// //   }
// // };

// export const updateMember = async (req, res) => {
//   try {
//     const member = await Member.findById(req.params.id);

//     if (!member) {
//       return res.status(404).json({
//         message: "Member not found",
//       });
//     }

//     const files = req.files || {};

//     // Delete old Cloudinary images if new ones are uploaded
//     if (files.photo?.[0]?.path && member.photo) {
//       const publicId = member.photo.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId);
//     }
//     if (files.citizenshipFront?.[0]?.path && member.citizenshipFront) {
//       const publicId = member.citizenshipFront.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId);
//     }
//     if (files.citizenshipBack?.[0]?.path && member.citizenshipBack) {
//       const publicId = member.citizenshipBack.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId);
//     }
//     if (files.nationalIdFront?.[0]?.path && member.nationalIdFront) {
//       const publicId = member.nationalIdFront.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId);
//     }
//     if (files.passportPhoto?.[0]?.path && member.passportPhoto) {
//       const publicId = member.passportPhoto.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId);
//     }
//     if (files.drivingLicensePhoto?.[0]?.path && member.drivingLicensePhoto) {
//       const publicId = member.drivingLicensePhoto.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId);
//     }

//     const updateData = {
//       ...req.body,

//       photo:
//         files.photo?.[0]?.path || member.photo,

//       citizenshipFront:
//         files.citizenshipFront?.[0]?.path ||
//         member.citizenshipFront,

//       citizenshipBack:
//         files.citizenshipBack?.[0]?.path ||
//         member.citizenshipBack,

//       nationalIdFront:
//         files.nationalIdFront?.[0]?.path ||
//         member.nationalIdFront,

//       passportPhoto:
//         files.passportPhoto?.[0]?.path ||
//         member.passportPhoto,

//       drivingLicensePhoto:
//         files.drivingLicensePhoto?.[0]?.path ||
//         member.drivingLicensePhoto,

//       updatedBy: req.user?._id || null,
//     };

//     const updatedMember = await Member.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     // Synchronize relationships for updated member
//     await synchronizeRelationships(updatedMember, member);

//     const notification = new Notification({
//       type: "member_updated",
//       title: "Member Updated",
//       message: `${updatedMember.name}'s profile has been updated.`,
//       data: {
//         memberId: updatedMember._id,
//       },
//       createdBy: req.user?._id || null,
//     });

//     await notification.save();

//     io.emit("member:updated", updatedMember);
//     io.emit("notification:new", notification);

//     res.json(updatedMember);
//   } catch (error) {
//     console.error(error);

//     if (error.code === 11000) {
//       return res.status(400).json({
//         message: "Duplicate entry",
//       });
//     }

//     res.status(400).json({
//       message: error.message,
//     });
//   }
// };

// export const deleteMember = async (req, res) => {
//   try {
//     const member = await Member.findById(req.params.id);
//     if (!member) {
//       return res.status(404).json({ message: 'Member not found' });
//     }

//     // Delete photo from Cloudinary if exists
//     if (member.photo) {
//       const publicId = member.photo.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId);
//     }

//     // Delete all document images from Cloudinary
//     if (member.citizenshipFront) {
//       const publicId = member.citizenshipFront.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId);
//     }
//     if (member.citizenshipBack) {
//       const publicId = member.citizenshipBack.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId);
//     }
//     if (member.nationalIdFront) {
//       const publicId = member.nationalIdFront.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId);
//     }
//     if (member.passportPhoto) {
//       const publicId = member.passportPhoto.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId);
//     }
//     if (member.drivingLicensePhoto) {
//       const publicId = member.drivingLicensePhoto.split('/').pop().split('.')[0];
//       await cloudinary.uploader.destroy(publicId);
//     }

//     // Remove member from bidirectional relationships
//     await removeFromRelationships(member);

//     // Update family member count
//     if (member.family) {
//       await Family.findByIdAndUpdate(member.family, {
//         $inc: { totalMembers: -1 },
//       });
//     }

//     // Delete all relationships
//     await FamilyRelationship.deleteMany({
//       $or: [
//         { member: member._id },
//         { relatedMember: member._id },
//       ],
//     });

//     await Member.findByIdAndDelete(req.params.id);

//     // Create notification
//     const notification = new Notification({
//       type: 'member_deleted',
//       title: 'Member Deleted',
//       message: `${member.name} has been removed from the system.`,
//       data: { memberId: req.params.id },
//       createdBy: req.user?._id || null,
//     });
//     await notification.save();

//     io.emit('member:deleted', { id: req.params.id });
//     io.emit('notification:new', notification);

//     res.json({ message: 'Member deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const searchMembers = async (req, res) => {
//   try {
//     const { query } = req.query;
//     if (!query) {
//       return res.status(400).json({ message: 'Search query is required' });
//     }

//     const members = await Member.find({
//       $text: { $search: query },
//     })
//     .populate('family', 'familyName familyNumber')
//     .sort({ score: { $meta: 'textScore' } })
//     .limit(20);

//     res.json(members);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getMembersByFamily = async (req, res) => {
//   try {
//     const { familyId } = req.params;
    
//     const family = await Family.findById(familyId);
//     if (!family) {
//       return res.status(404).json({ message: 'Family not found' });
//     }

//     const members = await Member.find({ family: familyId })
//       .select('name photo gender dob isAlive relationship generation')
//       .sort({ name: 1 });

//     res.json({
//       family: {
//         id: family._id,
//         name: family.familyName,
//         number: family.familyNumber,
//       },
//       total: members.length,
//       data: members,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getMemberStats = async (req, res) => {
//   try {
//     const [total, byGender, byStatus, byGeneration] = await Promise.all([
//       Member.countDocuments(),
//       Member.aggregate([
//         { $group: { _id: '$gender', count: { $sum: 1 } } },
//       ]),
//       Member.aggregate([
//         { $group: { _id: '$isAlive', count: { $sum: 1 } } },
//       ]),
//       Member.aggregate([
//         { $group: { _id: '$generation', count: { $sum: 1 } } },
//         { $sort: { _id: 1 } },
//       ]),
//     ]);

//     res.json({
//       total,
//       byGender: byGender.reduce((acc, curr) => {
//         acc[curr._id || 'unknown'] = curr.count;
//         return acc;
//       }, {}),
//       byStatus: byStatus.reduce((acc, curr) => {
//         acc[curr._id ? 'living' : 'deceased'] = curr.count;
//         return acc;
//       }, {}),
//       byGeneration: byGeneration.map(g => ({
//         generation: g._id || 'unknown',
//         count: g.count,
//       })),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Helper function to synchronize relationships
// const synchronizeRelationships = async (member, oldMember = null) => {
//   const memberId = member._id;

//   // If oldMember exists, remove old references
//   if (oldMember) {
//     await removeFromRelationships(oldMember);
//   }

//   // Map of relationship fields to their reverse fields
//   const relationshipMap = {
//     father: { reverseField: 'sons', reverseCondition: (m) => m.gender === 'male' ? 'sons' : 'daughters' },
//     mother: { reverseField: 'sons', reverseCondition: (m) => m.gender === 'male' ? 'sons' : 'daughters' },
//     husband: { reverseField: 'wife' },
//     wife: { reverseField: 'husband' },
//     spouse: { reverseField: 'spouse' },
//     grandfather: { reverseField: 'grandsons', reverseCondition: (m) => m.gender === 'male' ? 'grandsons' : 'granddaughters' },
//     grandmother: { reverseField: 'grandsons', reverseCondition: (m) => m.gender === 'male' ? 'grandsons' : 'granddaughters' },
//     guardian: { reverseField: 'guardian' },
//   };

//   // Process each relationship field
//   for (const [field, config] of Object.entries(relationshipMap)) {
//     if (member[field]) {
//       const relatedMember = await Member.findById(member[field]);
//       if (relatedMember) {
//         // Determine which reverse field to update
//         let reverseField = config.reverseField;
//         if (config.reverseCondition) {
//           reverseField = config.reverseCondition(member);
//         }

//         // Add this member to the related member's reverse field
//         const update = {};
//         if (Array.isArray(relatedMember[reverseField])) {
//           update[reverseField] = [...new Set([...relatedMember[reverseField], memberId])];
//         } else {
//           update[reverseField] = memberId;
//         }

//         await Member.findByIdAndUpdate(relatedMember._id, update);
//       }
//     }
//   }
// };

// // Helper function to remove member from bidirectional relationships
// const removeFromRelationships = async (member) => {
//   const memberId = member._id;

//   // Remove from father's children
//   if (member.father) {
//     await Member.findByIdAndUpdate(member.father, {
//       $pull: {
//         sons: memberId,
//         daughters: memberId
//       }
//     });
//   }

//   // Remove from mother's children
//   if (member.mother) {
//     await Member.findByIdAndUpdate(member.mother, {
//       $pull: {
//         sons: memberId,
//         daughters: memberId
//       }
//     });
//   }

//   // Remove from husband/wife
//   if (member.husband) {
//     await Member.findByIdAndUpdate(member.husband, {
//       $unset: { wife: 1 }
//     });
//   }
//   if (member.wife) {
//     await Member.findByIdAndUpdate(member.wife, {
//       $unset: { husband: 1 }
//     });
//   }

//   // Remove from spouse
//   if (member.spouse) {
//     await Member.findByIdAndUpdate(member.spouse, {
//       $unset: { spouse: 1 }
//     });
//   }

//   // Remove from grandfather/grandmother
//   if (member.grandfather) {
//     await Member.findByIdAndUpdate(member.grandfather, {
//       $pull: {
//         grandsons: memberId,
//         granddaughters: memberId
//       }
//     });
//   }
//   if (member.grandmother) {
//     await Member.findByIdAndUpdate(member.grandmother, {
//       $pull: {
//         grandsons: memberId,
//         granddaughters: memberId
//       }
//     });
//   }

//   // Remove from guardian
//   if (member.guardian) {
//     await Member.findByIdAndUpdate(member.guardian, {
//       $unset: { guardian: 1 }
//     });
//   }

//   // Remove from elder/younger brothers and sisters
//   const brotherFields = ['elderBrothers', 'youngerBrothers'];
//   const sisterFields = ['elderSisters', 'youngerSisters'];

//   for (const field of brotherFields) {
//     if (member[field] && Array.isArray(member[field])) {
//       for (const brotherId of member[field]) {
//         await Member.findByIdAndUpdate(brotherId, {
//           $pull: {
//             elderBrothers: memberId,
//             youngerBrothers: memberId
//           }
//         });
//       }
//     }
//   }

//   for (const field of sisterFields) {
//     if (member[field] && Array.isArray(member[field])) {
//       for (const sisterId of member[field]) {
//         await Member.findByIdAndUpdate(sisterId, {
//           $pull: {
//             elderSisters: memberId,
//             youngerSisters: memberId
//           }
//         });
//       }
//     }
//   }

//   // Remove from in-laws
//   const inLawFields = ['fatherInLaw', 'motherInLaw', 'sonInLaw', 'daughterInLaw'];
//   for (const field of inLawFields) {
//     if (member[field]) {
//       await Member.findByIdAndUpdate(member[field], {
//         $pull: {
//           [field]: memberId
//         }
//       });
//     }
//   }
// };






















































// controllers/memberController.js - UPDATED with fix for array fields

import Member from '../models/Member.js';
import Family from '../models/Family.js';
import House from '../models/House.js';
import FamilyRelationship from '../models/FamilyRelationship.js';
import { io } from '../server.js';
import cloudinary from '../config/cloudinary.js';
import Notification from '../models/Notification.js';
import Counter from '../models/Counter.js';

// Helper function to get sequential member number
const getNextMemberNumber = async () => {
  const counter = await Counter.findByIdAndUpdate(
    'memberNumber',
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `MEM-${String(counter.seq).padStart(6, '0')}`;
};

export const getMembers = async (req, res) => {
  try {
    const { page = 1, limit = 10, search, gender, status, generation, verificationStatus, family, district, province, house } = req.query;
    const skip = (page - 1) * limit;

    let query = {};
    
    // Build search query
    if (search) {
      query = {
        $or: [
          { name: { $regex: search, $options: 'i' } },
          { surname: { $regex: search, $options: 'i' } },
          { memberNumber: { $regex: search, $options: 'i' } },
          { rollNumber: { $regex: search, $options: 'i' } },
          { vanshaGenerationNumber: { $regex: search, $options: 'i' } },
          { phone: { $regex: search, $options: 'i' } },
          { email: { $regex: search, $options: 'i' } },
          { familyNumber: { $regex: search, $options: 'i' } },
          { citizenshipNumber: { $regex: search, $options: 'i' } },
        ],
      };
    }

    // Apply filters
    if (gender) query.gender = gender;
    if (status) query.status = status;
    if (generation) query.generation = parseInt(generation);
    if (verificationStatus) query.verificationStatus = verificationStatus;
    if (family) query.family = family;
    if (district) query.district = district;
    if (province) query.province = province;

    // If house filter is provided, get all families in that house
    if (house) {
      const familiesInHouse = await Family.find({ house }).distinct('_id');
      query.family = { $in: familiesInHouse };
    }

    const [members, total] = await Promise.all([
      Member.find(query)
        .populate('family', 'familyName familyNumber vanshaGenerationNumber')
        .populate('father mother spouse', 'name photo memberNumber rollNumber')
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
    res.status(500).json({ message: error.message });
  }
};

export const getMemberById = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id)
      .populate('family', 'familyName familyNumber vanshaGenerationNumber clan')
      .populate(
        'father mother husband wife spouse grandfather grandmother guardian fatherInLaw motherInLaw',
        'name photo memberNumber rollNumber'
      )
      .populate(
        'sons daughters elderBrothers youngerBrothers elderSisters youngerSisters grandsons granddaughters sonInLaw daughterInLaw',
        'name photo memberNumber rollNumber'
      );

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const memberObj = member.toObject();
    
    // Ensure photo URLs are properly formatted
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
    res.status(500).json({ message: error.message });
  }
};

export const createMember = async (req, res) => {
  try {
    const files = req.files || {};

    // Check if family is closed
    if (req.body.family) {
      const family = await Family.findById(req.body.family);
      if (family && family.status === 'closed') {
        return res.status(403).json({
          message: 'Family is closed. Please reopen to add members.'
        });
      }
    }

    // Get auto-increment member number
    const memberNumber = await getNextMemberNumber();

    // Clean up array fields - remove empty strings
    const arrayFields = ['sons', 'daughters', 'elderBrothers', 'youngerBrothers', 'elderSisters', 'youngerSisters', 'grandsons', 'granddaughters', 'sonInLaw', 'daughterInLaw'];
    const cleanedBody = { ...req.body };
    arrayFields.forEach(field => {
      if (cleanedBody[field]) {
        if (Array.isArray(cleanedBody[field])) {
          cleanedBody[field] = cleanedBody[field].filter(id => id && id.trim() !== '');
        }
      }
    });

    // Get roll number from family
    const family = await Family.findById(req.body.family);
    const rollNumber = await getNextRollNumber();

    const memberData = {
      ...cleanedBody,
      memberNumber,
      rollNumber,
      vanshaGenerationNumber: family?.vanshaGenerationNumber || null,
      photo: files.photo?.[0]?.path || null,
      citizenshipFront: files.citizenshipFront?.[0]?.path || null,
      citizenshipBack: files.citizenshipBack?.[0]?.path || null,
      nationalIdFront: files.nationalIdFront?.[0]?.path || null,
      passportPhoto: files.passportPhoto?.[0]?.path || null,
      drivingLicensePhoto: files.drivingLicensePhoto?.[0]?.path || null,
      createdBy: req.user?._id || null,
      updatedBy: req.user?._id || null,
    };

    // If family reference provided, update family member count
    if (memberData.family) {
      await Family.findByIdAndUpdate(memberData.family, {
        $inc: { totalMembers: 1 },
      });
    }

    const member = new Member(memberData);
    await member.save();

    // Synchronize relationships for created member
    await synchronizeRelationships(member);

    // Create notification
    const notification = new Notification({
      type: 'member_added',
      title: 'New Member Added',
      message: `${member.name} (${member.memberNumber}) has been added to the system.`,
      data: { memberId: member._id },
      createdBy: req.user?._id || null,
    });
    await notification.save();

    io.emit('member:created', member);
    io.emit('notification:new', notification);

    res.status(201).json(member);
  } catch (error) {
    console.error("Create Member Error:", error);
    return res.status(400).json({
      success: false,
      message: error.message || "Unknown Error",
    });
  }
};

// Helper to get next roll number
const getNextRollNumber = async () => {
  const counter = await Counter.findByIdAndUpdate(
    'rollNumber',
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return String(counter.seq);
};

export const updateMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Check if family is closed
    const family = await Family.findById(member.family);
    if (family && family.status === 'closed') {
      return res.status(403).json({
        message: 'Family is closed. Please reopen to update members.'
      });
    }

    const files = req.files || {};

    // Delete old Cloudinary images if new ones are uploaded
    const photoFields = ['photo', 'citizenshipFront', 'citizenshipBack', 'nationalIdFront', 'passportPhoto', 'drivingLicensePhoto'];
    for (const field of photoFields) {
      if (files[field]?.[0]?.path && member[field]) {
        const publicId = member[field].split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
    }

    // Clean up array fields - remove empty strings and invalid ObjectIds
    const arrayFields = ['sons', 'daughters', 'elderBrothers', 'youngerBrothers', 'elderSisters', 'youngerSisters', 'grandsons', 'granddaughters', 'sonInLaw', 'daughterInLaw'];
    const cleanedBody = { ...req.body };
    arrayFields.forEach(field => {
      if (cleanedBody[field]) {
        if (Array.isArray(cleanedBody[field])) {
          // Filter out empty strings and invalid values
          cleanedBody[field] = cleanedBody[field]
            .filter(id => id && typeof id === 'string' && id.trim() !== '')
            .map(id => id.trim());
        } else if (typeof cleanedBody[field] === 'string' && cleanedBody[field].trim() === '') {
          // If it's an empty string, set to empty array
          cleanedBody[field] = [];
        }
      }
    });

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

    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      updateData,
      {
        new: true,
        runValidators: true,
        returnDocument: 'after',
      }
    );

    // Synchronize relationships for updated member
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
    console.error("Update Member Error:", error);

    if (error.code === 11000) {
      return res.status(400).json({
        message: "Duplicate entry",
      });
    }

    res.status(400).json({
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

    // Check if family is closed
    const family = await Family.findById(member.family);
    if (family && family.status === 'closed') {
      return res.status(403).json({
        message: 'Family is closed. Please reopen to delete members.'
      });
    }

    // Delete all images from Cloudinary
    const photoFields = ['photo', 'citizenshipFront', 'citizenshipBack', 'nationalIdFront', 'passportPhoto', 'drivingLicensePhoto'];
    for (const field of photoFields) {
      if (member[field]) {
        const publicId = member[field].split('/').pop().split('.')[0];
        await cloudinary.uploader.destroy(publicId).catch(() => {});
      }
    }

    // Remove member from bidirectional relationships
    await removeFromRelationships(member);

    // Update family member count
    if (member.family) {
      await Family.findByIdAndUpdate(member.family, {
        $inc: { totalMembers: -1 },
      });
    }

    // Delete all relationships
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
      .select('name photo gender dob isAlive relationship generation memberNumber rollNumber vanshaGenerationNumber')
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
    res.status(500).json({ message: error.message });
  }
};

// Helper function to synchronize relationships
const synchronizeRelationships = async (member, oldMember = null) => {
  const memberId = member._id;

  // If oldMember exists, remove old references
  if (oldMember) {
    await removeFromRelationships(oldMember);
  }

  // Map of relationship fields to their reverse fields
  const relationshipMap = {
    father: { reverseField: 'sons', reverseCondition: (m) => m.gender === 'male' ? 'sons' : 'daughters' },
    mother: { reverseField: 'sons', reverseCondition: (m) => m.gender === 'male' ? 'sons' : 'daughters' },
    husband: { reverseField: 'wife' },
    wife: { reverseField: 'husband' },
    spouse: { reverseField: 'spouse' },
    grandfather: { reverseField: 'grandsons', reverseCondition: (m) => m.gender === 'male' ? 'grandsons' : 'granddaughters' },
    grandmother: { reverseField: 'grandsons', reverseCondition: (m) => m.gender === 'male' ? 'grandsons' : 'granddaughters' },
    guardian: { reverseField: 'guardian' },
  };

  // Process each relationship field
  for (const [field, config] of Object.entries(relationshipMap)) {
    if (member[field]) {
      const relatedMember = await Member.findById(member[field]);
      if (relatedMember) {
        let reverseField = config.reverseField;
        if (config.reverseCondition) {
          reverseField = config.reverseCondition(member);
        }

        const update = {};
        if (Array.isArray(relatedMember[reverseField])) {
          update[reverseField] = [...new Set([...relatedMember[reverseField], memberId])];
        } else {
          update[reverseField] = memberId;
        }

        await Member.findByIdAndUpdate(relatedMember._id, update);
      }
    }
  }
};

// Helper function to remove member from bidirectional relationships
const removeFromRelationships = async (member) => {
  const memberId = member._id;

  // Remove from father's children
  if (member.father) {
    await Member.findByIdAndUpdate(member.father, {
      $pull: {
        sons: memberId,
        daughters: memberId
      }
    });
  }

  // Remove from mother's children
  if (member.mother) {
    await Member.findByIdAndUpdate(member.mother, {
      $pull: {
        sons: memberId,
        daughters: memberId
      }
    });
  }

  // Remove from husband/wife
  if (member.husband) {
    await Member.findByIdAndUpdate(member.husband, {
      $unset: { wife: 1 }
    });
  }
  if (member.wife) {
    await Member.findByIdAndUpdate(member.wife, {
      $unset: { husband: 1 }
    });
  }

  // Remove from spouse
  if (member.spouse) {
    await Member.findByIdAndUpdate(member.spouse, {
      $unset: { spouse: 1 }
    });
  }

  // Remove from grandfather/grandmother
  if (member.grandfather) {
    await Member.findByIdAndUpdate(member.grandfather, {
      $pull: {
        grandsons: memberId,
        granddaughters: memberId
      }
    });
  }
  if (member.grandmother) {
    await Member.findByIdAndUpdate(member.grandmother, {
      $pull: {
        grandsons: memberId,
        granddaughters: memberId
      }
    });
  }

  // Remove from guardian
  if (member.guardian) {
    await Member.findByIdAndUpdate(member.guardian, {
      $unset: { guardian: 1 }
    });
  }
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


// // controllers/memberController.js - UPDATED
// import Member from '../models/Member.js';
// import Family from '../models/Family.js';
// import House from '../models/House.js';
// import FamilyRelationship from '../models/FamilyRelationship.js';
// import { io } from '../server.js';
// import cloudinary from '../config/cloudinary.js';
// import Notification from '../models/Notification.js';
// import Counter from '../models/Counter.js';

// // Helper function to get sequential member number
// const getNextMemberNumber = async () => {
//   const counter = await Counter.findByIdAndUpdate(
//     'memberNumber',
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true }
//   );
//   return `MEM-${String(counter.seq).padStart(6, '0')}`;
// };

// export const getMembers = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search, gender, status, generation, verificationStatus, family, district, province, house } = req.query;
//     const skip = (page - 1) * limit;

//     let query = {};
    
//     // Build search query
//     if (search) {
//       query = {
//         $or: [
//           { name: { $regex: search, $options: 'i' } },
//           { surname: { $regex: search, $options: 'i' } },
//           { memberNumber: { $regex: search, $options: 'i' } },
//           { rollNumber: { $regex: search, $options: 'i' } },
//           { vanshaGenerationNumber: { $regex: search, $options: 'i' } },
//           { phone: { $regex: search, $options: 'i' } },
//           { email: { $regex: search, $options: 'i' } },
//           { familyNumber: { $regex: search, $options: 'i' } },
//           { citizenshipNumber: { $regex: search, $options: 'i' } },
//         ],
//       };
//     }

//     // Apply filters
//     if (gender) query.gender = gender;
//     if (status) query.status = status;
//     if (generation) query.generation = parseInt(generation);
//     if (verificationStatus) query.verificationStatus = verificationStatus;
//     if (family) query.family = family;
//     if (district) query.district = district;
//     if (province) query.province = province;

//     // If house filter is provided, get all families in that house
//     if (house) {
//       const familiesInHouse = await Family.find({ house }).distinct('_id');
//       query.family = { $in: familiesInHouse };
//     }

//     const [members, total] = await Promise.all([
//       Member.find(query)
//         .populate('family', 'familyName familyNumber vanshaGenerationNumber')
//         .populate('father mother spouse', 'name photo memberNumber rollNumber')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Member.countDocuments(query),
//     ]);

//     res.json({
//       data: members,
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

// export const getMemberById = async (req, res) => {
//   try {
//     const member = await Member.findById(req.params.id)
//       .populate('family', 'familyName familyNumber vanshaGenerationNumber clan')
//       .populate(
//         'father mother husband wife spouse grandfather grandmother guardian fatherInLaw motherInLaw',
//         'name photo memberNumber rollNumber'
//       )
//       .populate(
//         'sons daughters elderBrothers youngerBrothers elderSisters youngerSisters grandsons granddaughters sonInLaw daughterInLaw',
//         'name photo memberNumber rollNumber'
//       );

//     if (!member) {
//       return res.status(404).json({ message: 'Member not found' });
//     }

//     const memberObj = member.toObject();
    
//     // Ensure photo URLs are properly formatted
//     const photoFields = ['photo', 'citizenshipFront', 'citizenshipBack', 'nationalIdFront', 'passportPhoto', 'drivingLicensePhoto'];
//     photoFields.forEach(field => {
//       if (memberObj[field]) {
//         if (!memberObj[field].startsWith('http')) {
//           if (memberObj[field].includes('cloudinary')) {
//             memberObj[field] = memberObj[field];
//           }
//         }
//       }
//     });

//     const relationships = await FamilyRelationship.find({
//       $or: [
//         { member: member._id },
//         { relatedMember: member._id },
//       ],
//       isActive: true,
//     }).populate('member relatedMember');

//     res.json({
//       ...memberObj,
//       relationships,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const createMember = async (req, res) => {
//   try {
//     const files = req.files || {};

//     // Check if family is closed
//     if (req.body.family) {
//       const family = await Family.findById(req.body.family);
//       if (family && family.status === 'closed') {
//         return res.status(403).json({
//           message: 'Family is closed. Please reopen to add members.'
//         });
//       }
//     }

//     // Get auto-increment member number
//     const memberNumber = await getNextMemberNumber();

//     // Get roll number from family
//     const family = await Family.findById(req.body.family);
//     const rollNumber = await getNextRollNumber();

//     const memberData = {
//       ...req.body,
//       memberNumber,
//       rollNumber,
//       vanshaGenerationNumber: family?.vanshaGenerationNumber || null,
//       photo: files.photo?.[0]?.path || null,
//       citizenshipFront: files.citizenshipFront?.[0]?.path || null,
//       citizenshipBack: files.citizenshipBack?.[0]?.path || null,
//       nationalIdFront: files.nationalIdFront?.[0]?.path || null,
//       passportPhoto: files.passportPhoto?.[0]?.path || null,
//       drivingLicensePhoto: files.drivingLicensePhoto?.[0]?.path || null,
//       createdBy: req.user?._id || null,
//       updatedBy: req.user?._id || null,
//     };

//     // If family reference provided, update family member count
//     if (memberData.family) {
//       await Family.findByIdAndUpdate(memberData.family, {
//         $inc: { totalMembers: 1 },
//       });
//     }

//     const member = new Member(memberData);
//     await member.save();

//     // Synchronize relationships for created member
//     await synchronizeRelationships(member);

//     // Create notification
//     const notification = new Notification({
//       type: 'member_added',
//       title: 'New Member Added',
//       message: `${member.name} (${member.memberNumber}) has been added to the system.`,
//       data: { memberId: member._id },
//       createdBy: req.user?._id || null,
//     });
//     await notification.save();

//     io.emit('member:created', member);
//     io.emit('notification:new', notification);

//     res.status(201).json(member);
//   } catch (error) {
//     console.error("Create Member Error:", error);
//     return res.status(400).json({
//       success: false,
//       message: error.message || "Unknown Error",
//     });
//   }
// };

// // Helper to get next roll number
// const getNextRollNumber = async () => {
//   const counter = await Counter.findByIdAndUpdate(
//     'rollNumber',
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true }
//   );
//   return String(counter.seq);
// };

// export const updateMember = async (req, res) => {
//   try {
//     const member = await Member.findById(req.params.id);
//     if (!member) {
//       return res.status(404).json({ message: 'Member not found' });
//     }

//     // Check if family is closed
//     const family = await Family.findById(member.family);
//     if (family && family.status === 'closed') {
//       return res.status(403).json({
//         message: 'Family is closed. Please reopen to update members.'
//       });
//     }

//     const files = req.files || {};

//     // Delete old Cloudinary images if new ones are uploaded
//     const photoFields = ['photo', 'citizenshipFront', 'citizenshipBack', 'nationalIdFront', 'passportPhoto', 'drivingLicensePhoto'];
//     for (const field of photoFields) {
//       if (files[field]?.[0]?.path && member[field]) {
//         const publicId = member[field].split('/').pop().split('.')[0];
//         await cloudinary.uploader.destroy(publicId).catch(() => {});
//       }
//     }

//     const updateData = {
//       ...req.body,
//       photo: files.photo?.[0]?.path || member.photo,
//       citizenshipFront: files.citizenshipFront?.[0]?.path || member.citizenshipFront,
//       citizenshipBack: files.citizenshipBack?.[0]?.path || member.citizenshipBack,
//       nationalIdFront: files.nationalIdFront?.[0]?.path || member.nationalIdFront,
//       passportPhoto: files.passportPhoto?.[0]?.path || member.passportPhoto,
//       drivingLicensePhoto: files.drivingLicensePhoto?.[0]?.path || member.drivingLicensePhoto,
//       updatedBy: req.user?._id || null,
//     };

//     const updatedMember = await Member.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     // Synchronize relationships for updated member
//     await synchronizeRelationships(updatedMember, member);

//     const notification = new Notification({
//       type: "member_updated",
//       title: "Member Updated",
//       message: `${updatedMember.name}'s profile has been updated.`,
//       data: {
//         memberId: updatedMember._id,
//       },
//       createdBy: req.user?._id || null,
//     });

//     await notification.save();

//     io.emit("member:updated", updatedMember);
//     io.emit("notification:new", notification);

//     res.json(updatedMember);
//   } catch (error) {
//     console.error("Update Member Error:", error);

//     if (error.code === 11000) {
//       return res.status(400).json({
//         message: "Duplicate entry",
//       });
//     }

//     res.status(400).json({
//       message: error.message,
//     });
//   }
// };

// export const deleteMember = async (req, res) => {
//   try {
//     const member = await Member.findById(req.params.id);
//     if (!member) {
//       return res.status(404).json({ message: 'Member not found' });
//     }

//     // Check if family is closed
//     const family = await Family.findById(member.family);
//     if (family && family.status === 'closed') {
//       return res.status(403).json({
//         message: 'Family is closed. Please reopen to delete members.'
//       });
//     }

//     // Delete all images from Cloudinary
//     const photoFields = ['photo', 'citizenshipFront', 'citizenshipBack', 'nationalIdFront', 'passportPhoto', 'drivingLicensePhoto'];
//     for (const field of photoFields) {
//       if (member[field]) {
//         const publicId = member[field].split('/').pop().split('.')[0];
//         await cloudinary.uploader.destroy(publicId).catch(() => {});
//       }
//     }

//     // Remove member from bidirectional relationships
//     await removeFromRelationships(member);

//     // Update family member count
//     if (member.family) {
//       await Family.findByIdAndUpdate(member.family, {
//         $inc: { totalMembers: -1 },
//       });
//     }

//     // Delete all relationships
//     await FamilyRelationship.deleteMany({
//       $or: [
//         { member: member._id },
//         { relatedMember: member._id },
//       ],
//     });

//     await Member.findByIdAndDelete(req.params.id);

//     const notification = new Notification({
//       type: 'member_deleted',
//       title: 'Member Deleted',
//       message: `${member.name} has been removed from the system.`,
//       data: { memberId: req.params.id },
//       createdBy: req.user?._id || null,
//     });
//     await notification.save();

//     io.emit('member:deleted', { id: req.params.id });
//     io.emit('notification:new', notification);

//     res.json({ message: 'Member deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const searchMembers = async (req, res) => {
//   try {
//     const { query } = req.query;
//     if (!query) {
//       return res.status(400).json({ message: 'Search query is required' });
//     }

//     const members = await Member.find({
//       $text: { $search: query },
//     })
//     .populate('family', 'familyName familyNumber')
//     .sort({ score: { $meta: 'textScore' } })
//     .limit(20);

//     res.json(members);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getMembersByFamily = async (req, res) => {
//   try {
//     const { familyId } = req.params;
    
//     const family = await Family.findById(familyId);
//     if (!family) {
//       return res.status(404).json({ message: 'Family not found' });
//     }

//     const members = await Member.find({ family: familyId })
//       .select('name photo gender dob isAlive relationship generation memberNumber rollNumber vanshaGenerationNumber')
//       .sort({ name: 1 });

//     res.json({
//       family: {
//         id: family._id,
//         name: family.familyName,
//         number: family.familyNumber,
//         vanshaGenerationNumber: family.vanshaGenerationNumber,
//         status: family.status,
//       },
//       total: members.length,
//       data: members,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getMemberStats = async (req, res) => {
//   try {
//     const [total, byGender, byStatus, byGeneration, byVansha] = await Promise.all([
//       Member.countDocuments(),
//       Member.aggregate([
//         { $group: { _id: '$gender', count: { $sum: 1 } } },
//       ]),
//       Member.aggregate([
//         { $group: { _id: '$isAlive', count: { $sum: 1 } } },
//       ]),
//       Member.aggregate([
//         { $group: { _id: '$generation', count: { $sum: 1 } } },
//         { $sort: { _id: 1 } },
//       ]),
//       Member.aggregate([
//         { $group: { _id: '$vanshaGenerationNumber', count: { $sum: 1 } } },
//         { $sort: { _id: 1 } },
//         { $limit: 20 },
//       ]),
//     ]);

//     res.json({
//       total,
//       byGender: byGender.reduce((acc, curr) => {
//         acc[curr._id || 'unknown'] = curr.count;
//         return acc;
//       }, {}),
//       byStatus: byStatus.reduce((acc, curr) => {
//         acc[curr._id ? 'living' : 'deceased'] = curr.count;
//         return acc;
//       }, {}),
//       byGeneration: byGeneration.map(g => ({
//         generation: g._id || 'unknown',
//         count: g.count,
//       })),
//       byVansha: byVansha.map(v => ({
//         vansha: v._id || 'unknown',
//         count: v.count,
//       })),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Helper function to synchronize relationships
// const synchronizeRelationships = async (member, oldMember = null) => {
//   const memberId = member._id;

//   // If oldMember exists, remove old references
//   if (oldMember) {
//     await removeFromRelationships(oldMember);
//   }

//   // Map of relationship fields to their reverse fields
//   const relationshipMap = {
//     father: { reverseField: 'sons', reverseCondition: (m) => m.gender === 'male' ? 'sons' : 'daughters' },
//     mother: { reverseField: 'sons', reverseCondition: (m) => m.gender === 'male' ? 'sons' : 'daughters' },
//     husband: { reverseField: 'wife' },
//     wife: { reverseField: 'husband' },
//     spouse: { reverseField: 'spouse' },
//     grandfather: { reverseField: 'grandsons', reverseCondition: (m) => m.gender === 'male' ? 'grandsons' : 'granddaughters' },
//     grandmother: { reverseField: 'grandsons', reverseCondition: (m) => m.gender === 'male' ? 'grandsons' : 'granddaughters' },
//     guardian: { reverseField: 'guardian' },
//   };

//   // Process each relationship field
//   for (const [field, config] of Object.entries(relationshipMap)) {
//     if (member[field]) {
//       const relatedMember = await Member.findById(member[field]);
//       if (relatedMember) {
//         let reverseField = config.reverseField;
//         if (config.reverseCondition) {
//           reverseField = config.reverseCondition(member);
//         }

//         const update = {};
//         if (Array.isArray(relatedMember[reverseField])) {
//           update[reverseField] = [...new Set([...relatedMember[reverseField], memberId])];
//         } else {
//           update[reverseField] = memberId;
//         }

//         await Member.findByIdAndUpdate(relatedMember._id, update);
//       }
//     }
//   }
// };

// // Helper function to remove member from bidirectional relationships
// const removeFromRelationships = async (member) => {
//   const memberId = member._id;

//   // Remove from father's children
//   if (member.father) {
//     await Member.findByIdAndUpdate(member.father, {
//       $pull: {
//         sons: memberId,
//         daughters: memberId
//       }
//     });
//   }

//   // Remove from mother's children
//   if (member.mother) {
//     await Member.findByIdAndUpdate(member.mother, {
//       $pull: {
//         sons: memberId,
//         daughters: memberId
//       }
//     });
//   }

//   // Remove from husband/wife
//   if (member.husband) {
//     await Member.findByIdAndUpdate(member.husband, {
//       $unset: { wife: 1 }
//     });
//   }
//   if (member.wife) {
//     await Member.findByIdAndUpdate(member.wife, {
//       $unset: { husband: 1 }
//     });
//   }

//   // Remove from spouse
//   if (member.spouse) {
//     await Member.findByIdAndUpdate(member.spouse, {
//       $unset: { spouse: 1 }
//     });
//   }

//   // Remove from grandfather/grandmother
//   if (member.grandfather) {
//     await Member.findByIdAndUpdate(member.grandfather, {
//       $pull: {
//         grandsons: memberId,
//         granddaughters: memberId
//       }
//     });
//   }
//   if (member.grandmother) {
//     await Member.findByIdAndUpdate(member.grandmother, {
//       $pull: {
//         grandsons: memberId,
//         granddaughters: memberId
//       }
//     });
//   }

//   // Remove from guardian
//   if (member.guardian) {
//     await Member.findByIdAndUpdate(member.guardian, {
//       $unset: { guardian: 1 }
//     });
//   }
// };

// export default {
//   getMembers,
//   getMemberById,
//   createMember,
//   updateMember,
//   deleteMember,
//   searchMembers,
//   getMembersByFamily,
//   getMemberStats,
// };



// // src/controllers/memberController.js

// import Member from '../models/Member.js';
// import FamilyRelationship from '../models/FamilyRelationship.js';
// import Family from '../models/Family.js';
// import { io } from '../server.js';
// import cloudinary from '../config/cloudinary.js';
// import Notification from '../models/Notification.js';
// import Counter from '../models/Counter.js';

// // Helper function to get sequential member number
// const getNextMemberNumber = async () => {
//   const counter = await Counter.findByIdAndUpdate(
//     'memberNumber',
//     { $inc: { seq: 1 } },
//     { new: true, upsert: true }
//   );
//   return `MEM-${String(counter.seq).padStart(6, '0')}`;
// };

// export const getMembers = async (req, res) => {
//   try {
//     const { page = 1, limit = 10, search, gender, status, generation, verificationStatus, family, district, province } = req.query;
//     const skip = (page - 1) * limit;

//     let query = {};
    
//     // Build search query
//     if (search) {
//       query = {
//         $or: [
//           { name: { $regex: search, $options: 'i' } },
//           { surname: { $regex: search, $options: 'i' } },
//           { memberNumber: { $regex: search, $options: 'i' } },
//           { phone: { $regex: search, $options: 'i' } },
//           { email: { $regex: search, $options: 'i' } },
//           { familyNumber: { $regex: search, $options: 'i' } },
//           { citizenshipNumber: { $regex: search, $options: 'i' } },
//         ],
//       };
//     }

//     // Apply filters
//     if (gender) query.gender = gender;
//     if (status) query.status = status;
//     if (generation) query.generation = parseInt(generation);
//     if (verificationStatus) query.verificationStatus = verificationStatus;
//     if (family) query.family = family;
//     if (district) query.district = district;
//     if (province) query.province = province;

//     const [members, total] = await Promise.all([
//       Member.find(query)
//         .populate('family', 'familyName familyNumber')
//         .populate('father mother spouse', 'name photo memberNumber')
//         .sort({ createdAt: -1 })
//         .skip(skip)
//         .limit(parseInt(limit)),
//       Member.countDocuments(query),
//     ]);

//     res.json({
//       data: members,
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

// export const getMemberById = async (req, res) => {
//   try {
//     const member = await Member.findById(req.params.id)
//       .populate('family', 'familyName familyNumber clan')
//       .populate(
//         'father mother husband wife spouse grandfather grandmother guardian fatherInLaw motherInLaw',
//         'name photo memberNumber'
//       )
//       .populate(
//         'sons daughters elderBrothers youngerBrothers elderSisters youngerSisters grandsons granddaughters sonInLaw daughterInLaw',
//         'name photo memberNumber'
//       );

//     if (!member) {
//       return res.status(404).json({ message: 'Member not found' });
//     }

//     const memberObj = member.toObject();
    
//     // Ensure photo URLs are properly formatted
//     const photoFields = ['photo', 'citizenshipFront', 'citizenshipBack', 'nationalIdFront', 'passportPhoto', 'drivingLicensePhoto'];
//     photoFields.forEach(field => {
//       if (memberObj[field]) {
//         if (!memberObj[field].startsWith('http')) {
//           if (memberObj[field].includes('cloudinary')) {
//             memberObj[field] = memberObj[field];
//           }
//         }
//       }
//     });

//     const relationships = await FamilyRelationship.find({
//       $or: [
//         { member: member._id },
//         { relatedMember: member._id },
//       ],
//       isActive: true,
//     }).populate('member relatedMember');

//     res.json({
//       ...memberObj,
//       relationships,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const createMember = async (req, res) => {
//   try {
//     const files = req.files || {};

//     // Get auto-increment member number
//     const memberNumber = await getNextMemberNumber();

//     const memberData = {
//       ...req.body,
//       memberNumber,
//       photo: files.photo?.[0]?.path || null,
//       citizenshipFront: files.citizenshipFront?.[0]?.path || null,
//       citizenshipBack: files.citizenshipBack?.[0]?.path || null,
//       nationalIdFront: files.nationalIdFront?.[0]?.path || null,
//       passportPhoto: files.passportPhoto?.[0]?.path || null,
//       drivingLicensePhoto: files.drivingLicensePhoto?.[0]?.path || null,
//       createdBy: req.user?._id || null,
//       updatedBy: req.user?._id || null,
//     };

//     // If family reference provided, update family member count
//     if (memberData.family) {
//       await Family.findByIdAndUpdate(memberData.family, {
//         $inc: { totalMembers: 1 },
//       });
//     }

//     const member = new Member(memberData);
//     await member.save();

//     // Synchronize relationships for created member
//     await synchronizeRelationships(member);

//     // Create notification
//     const notification = new Notification({
//       type: 'member_added',
//       title: 'New Member Added',
//       message: `${member.name} (${member.memberNumber}) has been added to the system.`,
//       data: { memberId: member._id },
//       createdBy: req.user?._id || null,
//     });
//     await notification.save();

//     io.emit('member:created', member);
//     io.emit('notification:new', notification);

//     res.status(201).json(member);
//   } catch (error) {
//     console.error("Create Member Error:", error);
//     return res.status(400).json({
//       success: false,
//       message: error.message || "Unknown Error",
//     });
//   }
// };

// export const updateMember = async (req, res) => {
//   try {
//     const member = await Member.findById(req.params.id);

//     if (!member) {
//       return res.status(404).json({
//         message: "Member not found",
//       });
//     }

//     const files = req.files || {};

//     // Delete old Cloudinary images if new ones are uploaded
//     const photoFields = ['photo', 'citizenshipFront', 'citizenshipBack', 'nationalIdFront', 'passportPhoto', 'drivingLicensePhoto'];
//     for (const field of photoFields) {
//       if (files[field]?.[0]?.path && member[field]) {
//         const publicId = member[field].split('/').pop().split('.')[0];
//         await cloudinary.uploader.destroy(publicId).catch(() => {});
//       }
//     }

//     const updateData = {
//       ...req.body,
//       photo: files.photo?.[0]?.path || member.photo,
//       citizenshipFront: files.citizenshipFront?.[0]?.path || member.citizenshipFront,
//       citizenshipBack: files.citizenshipBack?.[0]?.path || member.citizenshipBack,
//       nationalIdFront: files.nationalIdFront?.[0]?.path || member.nationalIdFront,
//       passportPhoto: files.passportPhoto?.[0]?.path || member.passportPhoto,
//       drivingLicensePhoto: files.drivingLicensePhoto?.[0]?.path || member.drivingLicensePhoto,
//       updatedBy: req.user?._id || null,
//     };

//     const updatedMember = await Member.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       {
//         new: true,
//         runValidators: true,
//       }
//     );

//     // Synchronize relationships for updated member
//     await synchronizeRelationships(updatedMember, member);

//     const notification = new Notification({
//       type: "member_updated",
//       title: "Member Updated",
//       message: `${updatedMember.name}'s profile has been updated.`,
//       data: {
//         memberId: updatedMember._id,
//       },
//       createdBy: req.user?._id || null,
//     });

//     await notification.save();

//     io.emit("member:updated", updatedMember);
//     io.emit("notification:new", notification);

//     res.json(updatedMember);
//   } catch (error) {
//     console.error("Update Member Error:", error);

//     if (error.code === 11000) {
//       return res.status(400).json({
//         message: "Duplicate entry",
//       });
//     }

//     res.status(400).json({
//       message: error.message,
//     });
//   }
// };

// export const deleteMember = async (req, res) => {
//   try {
//     const member = await Member.findById(req.params.id);
//     if (!member) {
//       return res.status(404).json({ message: 'Member not found' });
//     }

//     // Delete all images from Cloudinary
//     const photoFields = ['photo', 'citizenshipFront', 'citizenshipBack', 'nationalIdFront', 'passportPhoto', 'drivingLicensePhoto'];
//     for (const field of photoFields) {
//       if (member[field]) {
//         const publicId = member[field].split('/').pop().split('.')[0];
//         await cloudinary.uploader.destroy(publicId).catch(() => {});
//       }
//     }

//     // Remove member from bidirectional relationships
//     await removeFromRelationships(member);

//     // Update family member count
//     if (member.family) {
//       await Family.findByIdAndUpdate(member.family, {
//         $inc: { totalMembers: -1 },
//       });
//     }

//     // Delete all relationships
//     await FamilyRelationship.deleteMany({
//       $or: [
//         { member: member._id },
//         { relatedMember: member._id },
//       ],
//     });

//     await Member.findByIdAndDelete(req.params.id);

//     const notification = new Notification({
//       type: 'member_deleted',
//       title: 'Member Deleted',
//       message: `${member.name} has been removed from the system.`,
//       data: { memberId: req.params.id },
//       createdBy: req.user?._id || null,
//     });
//     await notification.save();

//     io.emit('member:deleted', { id: req.params.id });
//     io.emit('notification:new', notification);

//     res.json({ message: 'Member deleted successfully' });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const searchMembers = async (req, res) => {
//   try {
//     const { query } = req.query;
//     if (!query) {
//       return res.status(400).json({ message: 'Search query is required' });
//     }

//     const members = await Member.find({
//       $text: { $search: query },
//     })
//     .populate('family', 'familyName familyNumber')
//     .sort({ score: { $meta: 'textScore' } })
//     .limit(20);

//     res.json(members);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getMembersByFamily = async (req, res) => {
//   try {
//     const { familyId } = req.params;
    
//     const family = await Family.findById(familyId);
//     if (!family) {
//       return res.status(404).json({ message: 'Family not found' });
//     }

//     const members = await Member.find({ family: familyId })
//       .select('name photo gender dob isAlive relationship generation memberNumber')
//       .sort({ name: 1 });

//     res.json({
//       family: {
//         id: family._id,
//         name: family.familyName,
//         number: family.familyNumber,
//       },
//       total: members.length,
//       data: members,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// export const getMemberStats = async (req, res) => {
//   try {
//     const [total, byGender, byStatus, byGeneration] = await Promise.all([
//       Member.countDocuments(),
//       Member.aggregate([
//         { $group: { _id: '$gender', count: { $sum: 1 } } },
//       ]),
//       Member.aggregate([
//         { $group: { _id: '$isAlive', count: { $sum: 1 } } },
//       ]),
//       Member.aggregate([
//         { $group: { _id: '$generation', count: { $sum: 1 } } },
//         { $sort: { _id: 1 } },
//       ]),
//     ]);

//     res.json({
//       total,
//       byGender: byGender.reduce((acc, curr) => {
//         acc[curr._id || 'unknown'] = curr.count;
//         return acc;
//       }, {}),
//       byStatus: byStatus.reduce((acc, curr) => {
//         acc[curr._id ? 'living' : 'deceased'] = curr.count;
//         return acc;
//       }, {}),
//       byGeneration: byGeneration.map(g => ({
//         generation: g._id || 'unknown',
//         count: g.count,
//       })),
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Helper function to synchronize relationships
// const synchronizeRelationships = async (member, oldMember = null) => {
//   const memberId = member._id;

//   // If oldMember exists, remove old references
//   if (oldMember) {
//     await removeFromRelationships(oldMember);
//   }

//   // Map of relationship fields to their reverse fields
//   const relationshipMap = {
//     father: { reverseField: 'sons', reverseCondition: (m) => m.gender === 'male' ? 'sons' : 'daughters' },
//     mother: { reverseField: 'sons', reverseCondition: (m) => m.gender === 'male' ? 'sons' : 'daughters' },
//     husband: { reverseField: 'wife' },
//     wife: { reverseField: 'husband' },
//     spouse: { reverseField: 'spouse' },
//     grandfather: { reverseField: 'grandsons', reverseCondition: (m) => m.gender === 'male' ? 'grandsons' : 'granddaughters' },
//     grandmother: { reverseField: 'grandsons', reverseCondition: (m) => m.gender === 'male' ? 'grandsons' : 'granddaughters' },
//     guardian: { reverseField: 'guardian' },
//   };

//   // Process each relationship field
//   for (const [field, config] of Object.entries(relationshipMap)) {
//     if (member[field]) {
//       const relatedMember = await Member.findById(member[field]);
//       if (relatedMember) {
//         let reverseField = config.reverseField;
//         if (config.reverseCondition) {
//           reverseField = config.reverseCondition(member);
//         }

//         const update = {};
//         if (Array.isArray(relatedMember[reverseField])) {
//           update[reverseField] = [...new Set([...relatedMember[reverseField], memberId])];
//         } else {
//           update[reverseField] = memberId;
//         }

//         await Member.findByIdAndUpdate(relatedMember._id, update);
//       }
//     }
//   }
// };

// // Helper function to remove member from bidirectional relationships
// const removeFromRelationships = async (member) => {
//   const memberId = member._id;

//   // Remove from father's children
//   if (member.father) {
//     await Member.findByIdAndUpdate(member.father, {
//       $pull: {
//         sons: memberId,
//         daughters: memberId
//       }
//     });
//   }

//   // Remove from mother's children
//   if (member.mother) {
//     await Member.findByIdAndUpdate(member.mother, {
//       $pull: {
//         sons: memberId,
//         daughters: memberId
//       }
//     });
//   }

//   // Remove from husband/wife
//   if (member.husband) {
//     await Member.findByIdAndUpdate(member.husband, {
//       $unset: { wife: 1 }
//     });
//   }
//   if (member.wife) {
//     await Member.findByIdAndUpdate(member.wife, {
//       $unset: { husband: 1 }
//     });
//   }

//   // Remove from spouse
//   if (member.spouse) {
//     await Member.findByIdAndUpdate(member.spouse, {
//       $unset: { spouse: 1 }
//     });
//   }

//   // Remove from grandfather/grandmother
//   if (member.grandfather) {
//     await Member.findByIdAndUpdate(member.grandfather, {
//       $pull: {
//         grandsons: memberId,
//         granddaughters: memberId
//       }
//     });
//   }
//   if (member.grandmother) {
//     await Member.findByIdAndUpdate(member.grandmother, {
//       $pull: {
//         grandsons: memberId,
//         granddaughters: memberId
//       }
//     });
//   }

//   // Remove from guardian
//   if (member.guardian) {
//     await Member.findByIdAndUpdate(member.guardian, {
//       $unset: { guardian: 1 }
//     });
//   }
// };

// export default {
//   getMembers,
//   getMemberById,
//   createMember,
//   updateMember,
//   deleteMember,
//   searchMembers,
//   getMembersByFamily,
//   getMemberStats,
// };