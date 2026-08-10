// import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';

// const memberSchema = new mongoose.Schema({
//   uuid: {
//     type: String,
//     default: uuidv4,
//     unique: true,
//     index: true,
//   },
//   // Basic Information
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//     index: true,
//   },
//   familyLine: {
//     type: String,
//     trim: true,
//   },
//   familyNumber: {
//     type: String,
//     trim: true,
//     index: true,
//   },
//   rollNumber: {
//     type: String,
//     trim: true,
//   },
//   generation: {
//     type: Number,
//     default: 1,
//   },
//   genealogyPageNumber: {
//     type: String,
//     trim: true,
//   },
//   relation: {
//     type: String,
//     enum: ['member', 'spouse', 'child', 'parent', 'sibling', 'grandparent', 'grandchild', 'other'],
//     default: 'member',
//   },
  
//   // Personal Details
//   gender: {
//     type: String,
//     enum: ['male', 'female', 'other'],
//     required: true,
//   },
//   dob: {
//     type: Date,
//   },
//   birthPlace: {
//     type: String,
//     trim: true,
//   },
//   bloodGroup: {
//     type: String,
//     enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],
//     default: 'unknown',
//   },
//   education: {
//     type: String,
//     trim: true,
//   },
//   occupation: {
//     type: String,
//     trim: true,
//   },
//   phone: {
//     type: String,
//     sparse: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     sparse: true,
//     trim: true,
//     lowercase: true,
//   },
//   citizenshipNumber: {
//     type: String,
//     trim: true,
//   },
//   maritalStatus: {
//     type: String,
//     enum: ['single', 'married', 'divorced', 'widowed', 'other'],
//     default: 'single',
//   },
  
//   // Address
//   currentAddress: {
//     type: String,
//     trim: true,
//   },
//   permanentAddress: {
//     type: String,
//     trim: true,
//   },
  
//   // Life Status
//   isAlive: {
//     type: Boolean,
//     default: true,
//   },
//   dod: {
//     type: Date,
//   },
  
//   // Family Relationships (Reference IDs)
//   father: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   mother: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   husband: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   wife: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   sons: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   daughters: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   elderBrothers: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   youngerBrothers: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   elderSisters: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   youngerSisters: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   grandfather: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   grandmother: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   grandsons: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   granddaughters: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   fatherInLaw: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   motherInLaw: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   sonInLaw: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   daughterInLaw: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
  
//   // Family Reference
//   family: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Family',
//   },
  
//   // Media
//   photo: {
//     type: String,
//     default: null,
//   },
  
//   // Biography
//   biography: {
//     type: String,
//     trim: true,
//   },
//   notes: {
//     type: String,
//     trim: true,
//   },
  
//   // Metadata
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     default: null,
//   },
//   updatedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     default: null,
//   },
// }, {
//   timestamps: true,
// });

// // Indexes for performance
// memberSchema.index({ name: 'text' });
// memberSchema.index({ familyNumber: 1 });
// memberSchema.index({ rollNumber: 1 });
// memberSchema.index({ phone: 1 });
// memberSchema.index({ email: 1 });
// memberSchema.index({ generation: 1 });
// memberSchema.index({ isAlive: 1 });
// memberSchema.index({ gender: 1 });
// memberSchema.index({ family: 1 });

// // Virtual for full name with title
// memberSchema.virtual('fullName').get(function() {
//   return this.name;
// });

// // Virtual for age
// memberSchema.virtual('age').get(function() {
//   if (!this.dob) return null;
//   const age = new Date().getFullYear() - this.dob.getFullYear();
//   return age;
// });

// // Ensure virtuals are included in JSON output
// memberSchema.set('toJSON', { virtuals: true });
// memberSchema.set('toObject', { virtuals: true });

// export default mongoose.model('Member', memberSchema);


// models/Member.js - Add these fields to existing schema
// import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';

// const memberSchema = new mongoose.Schema({
//   // ... existing fields ...

//   // NEW FIELDS TO ADD:
  
//   // Personal Information
//   placeOfBirth: {
//     type: String,
//     trim: true,
//   },
//   religion: {
//     type: String,
//     trim: true,
//   },
//   casteEthnicity: {
//     type: String,
//     trim: true,
//   },
//   nationality: {
//     type: String,
//     default: 'Nepali',
//     trim: true,
//   },
  
//   // Contact Information
//   alternatePhone: {
//     type: String,
//     trim: true,
//   },
  
//   // Address Information
//   houseNumber: {
//     type: String,
//     trim: true,
//   },
//   wardNumber: {
//     type: String,
//     trim: true,
//   },
//   toleVillage: {
//     type: String,
//     trim: true,
//   },
//   municipality: {
//     type: String,
//     trim: true,
//   },
//   district: {
//     type: String,
//     trim: true,
//   },
//   province: {
//     type: String,
//     trim: true,
//   },
//   country: {
//     type: String,
//     default: 'Nepal',
//     trim: true,
//   },
//   postalCode: {
//     type: String,
//     trim: true,
//   },
  
//   // Family Information
//   grandfather: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   grandmother: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   spouse: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   guardian: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   familyContact: {
//     type: String,
//     trim: true,
//   },
  
//   // Identification
//   citizenshipIssueDate: {
//     type: Date,
//   },
//   citizenshipIssueDistrict: {
//     type: String,
//     trim: true,
//   },
//   citizenshipFront: {
//     type: String,
//     default: null,
//   },
//   citizenshipBack: {
//     type: String,
//     default: null,
//   },
//   nationalIdNumber: {
//     type: String,
//     trim: true,
//   },
//   nationalIdIssueDate: {
//     type: Date,
//   },
//   nationalIdFront: {
//     type: String,
//     default: null,
//   },
  
//   // Passport
//   passportNumber: {
//     type: String,
//     trim: true,
//   },
//   passportIssueDate: {
//     type: Date,
//   },
//   passportExpiryDate: {
//     type: Date,
//   },
//   passportPhoto: {
//     type: String,
//     default: null,
//   },
  
//   // Driving License
//   drivingLicenseNumber: {
//     type: String,
//     trim: true,
//   },
//   drivingLicenseCategory: {
//     type: String,
//     trim: true,
//   },
//   drivingLicenseIssueDate: {
//     type: Date,
//   },
//   drivingLicenseExpiryDate: {
//     type: Date,
//   },
//   drivingLicensePhoto: {
//     type: String,
//     default: null,
//   },
  
//   // Documents
//   birthCertificate: {
//     type: String,
//     trim: true,
//   },
//   marriageCertificate: {
//     type: String,
//     trim: true,
//   },
//   deathCertificate: {
//     type: String,
//     trim: true,
//   },
//   panCard: {
//     type: String,
//     trim: true,
//   },
//   voterId: {
//     type: String,
//     trim: true,
//   },
  
//   // Additional Information
//   specialRemarks: {
//     type: String,
//     trim: true,
//   },
//   medicalNotes: {
//     type: String,
//     trim: true,
//   },
//   disabilityInfo: {
//     type: String,
//     trim: true,
//   },
  
//   // Status
//   status: {
//     type: String,
//     enum: ['active', 'inactive', 'deceased'],
//     default: 'active',
//   },
//   verificationStatus: {
//     type: String,
//     enum: ['verified', 'pending', 'rejected'],
//     default: 'pending',
//   },
// });

// export default mongoose.model('Member', memberSchema);












































// models/Member.js - ADD THESE MISSING FIELDS to your existing schema
// import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';

// const memberSchema = new mongoose.Schema({
//   uuid: {
//     type: String,
//     default: uuidv4,
//     unique: true,
//     index: true,
//   },
//   // Basic Information
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//     index: true,
//   },
//   familyLine: {
//     type: String,
//     trim: true,
//   },
//   familyNumber: {
//     type: String,
//     trim: true,
//     // index: true,
//   },
//   rollNumber: {
//     type: String,
//     trim: true,
//   },
//   generation: {
//     type: Number,
//     default: 1,
//   },
//   genealogyPageNumber: {
//     type: String,
//     trim: true,
//   },
//   relationship: {
//     type: String,
//     enum: ['member', 'child', 'parent', 'sibling', 'grandparent', 'grandchild', 'other'],
//     default: 'member',
//   },

//   // models/Member.js - Add this field
// memberNumber: {
//   type: String,
//   unique: true,
//   sparse: true,
//   trim: true,
// },
  
//   // Personal Details
//   gender: {
//     type: String,
//     enum: ['male', 'female', 'other'],
//     required: true,
//   },
//   dob: {
//     type: Date,
//   },
//   placeOfBirth: {
//     type: String,
//     trim: true,
//   },
//   bloodGroup: {
//     type: String,
//     enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],
//     default: 'unknown',
//   },
//   education: {
//     type: String,
//     trim: true,
//   },
//   occupation: {
//     type: String,
//     trim: true,
//   },
//   phone: {
//     type: String,
//     sparse: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     sparse: true,
//     trim: true,
//     lowercase: true,
//   },
//   citizenshipNumber: {
//     type: String,
//     trim: true,
//   },
//   maritalStatus: {
//     type: String,
//     enum: ['single', 'married', 'divorced', 'widowed', 'other'],
//     default: 'single',
//   },
  
//   // Address
//   currentAddress: {
//     type: String,
//     trim: true,
//   },
//   permanentAddress: {
//     type: String,
//     trim: true,
//   },
  
//   // ============ NEW FIELDS TO ADD ============
  
//   // Personal Information (Additional)
//   // placeOfBirth: {
//   //   type: String,
//   //   trim: true,
//   // },
//   religion: {
//     type: String,
//     trim: true,
//   },
//   casteEthnicity: {
//     type: String,
//     trim: true,
//   },
//   nationality: {
//     type: String,
//     default: 'Nepali',
//     trim: true,
//   },
  
//   // Contact Information (Additional)
//   alternatePhone: {
//     type: String,
//     trim: true,
//   },
  
//   // Address Information (Detailed)
//   houseNumber: {
//     type: String,
//     trim: true,
//   },
//   wardNumber: {
//     type: String,
//     trim: true,
//   },
//   toleVillage: {
//     type: String,
//     trim: true,
//   },
//   municipality: {
//     type: String,
//     trim: true,
//   },
//   district: {
//     type: String,
//     trim: true,
//   },
//   province: {
//     type: String,
//     trim: true,
//   },
//   country: {
//     type: String,
//     default: 'Nepal',
//     trim: true,
//   },
//   postalCode: {
//     type: String,
//     trim: true,
//   },
  
//   // Family Information (Additional References)
//     family: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Family',
//     index: true,
//   },
//   father: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//     index: true,
//   },
//   mother: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//     index: true,
//   },
//   grandfather: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   grandmother: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   spouse: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//     index: true,
//   },
//   guardian: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   // grandfather: {
//   //   type: mongoose.Schema.Types.ObjectId,
//   //   ref: 'Member',
//   // },
//   // grandmother: {
//   //   type: mongoose.Schema.Types.ObjectId,
//   //   ref: 'Member',
//   // },
//   // spouse: {
//   //   type: mongoose.Schema.Types.ObjectId,
//   //   ref: 'Member',
//   // },
//   // guardian: {
//   //   type: mongoose.Schema.Types.ObjectId,
//   //   ref: 'Member',
//   // },
//   // familyContact: {
//   //   type: String,
//   //   trim: true,
//   // },
  
//   // Identification (Additional)
//   citizenshipIssueDate: {
//     type: Date,
//   },
//   citizenshipIssueDistrict: {
//     type: String,
//     trim: true,
//   },
//   citizenshipFront: {
//     type: String,
//     default: null,
//   },
//   citizenshipBack: {
//     type: String,
//     default: null,
//   },
//   nationalIdNumber: {
//     type: String,
//     trim: true,
//   },
//   nationalIdIssueDate: {
//     type: Date,
//   },
//   nationalIdFront: {
//     type: String,
//     default: null,
//   },
  
//   // Passport
//   passportNumber: {
//     type: String,
//     trim: true,
//   },
//   passportIssueDate: {
//     type: Date,
//   },
//   passportExpiryDate: {
//     type: Date,
//   },
//   passportPhoto: {
//     type: String,
//     default: null,
//   },
  
//   // Driving License
//   drivingLicenseNumber: {
//     type: String,
//     trim: true,
//   },
//   drivingLicenseCategory: {
//     type: String,
//     trim: true,
//   },
//   drivingLicenseIssueDate: {
//     type: Date,
//   },
//   drivingLicenseExpiryDate: {
//     type: Date,
//   },
//   drivingLicensePhoto: {
//     type: String,
//     default: null,
//   },
  
//   // Documents (Additional)
//   birthCertificate: {
//     type: String,
//     trim: true,
//   },
//   marriageCertificate: {
//     type: String,
//     trim: true,
//   },
//   deathCertificate: {
//     type: String,
//     trim: true,
//   },
//   panCard: {
//     type: String,
//     trim: true,
//   },
//   voterId: {
//     type: String,
//     trim: true,
//   },
  
//   // Additional Information
//   specialRemarks: {
//     type: String,
//     trim: true,
//   },
//   medicalNotes: {
//     type: String,
//     trim: true,
//   },
//   disabilityInfo: {
//     type: String,
//     trim: true,
//   },
  
//   // Status
//   status: {
//     type: String,
//     enum: ['active', 'inactive', 'deceased'],
//     default: 'active',
//   },
//   verificationStatus: {
//     type: String,
//     enum: ['verified', 'pending', 'rejected'],
//     default: 'pending',
//   },
  
//   // ============ END NEW FIELDS ============
  
//   // Life Status
//   isAlive: {
//     type: Boolean,
//     default: true,
//   },
//   dod: {
//     type: Date,
//   },
  
//   // Family Relationships (Reference IDs) - Already existing
//   father: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   mother: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   husband: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   wife: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   sons: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   daughters: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   elderBrothers: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   youngerBrothers: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   elderSisters: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   youngerSisters: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   grandsons: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   granddaughters: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   fatherInLaw: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   motherInLaw: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   sonInLaw: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   daughterInLaw: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
  
//   // Family Reference
//   family: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Family',
//   },
  
//   // Media
//   photo: {
//     type: String,
//     default: null,
//   },
  
//   // Biography
//   biography: {
//     type: String,
//     trim: true,
//   },
//   notes: {
//     type: String,
//     trim: true,
//   },
  
//   // Metadata
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     default: null,
//   },
//   updatedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     default: null,
//   },
// }, {
//   timestamps: true,
// });

// // Indexes for performance
// memberSchema.index({ name: 'text' });
// memberSchema.index({ familyNumber: 1 });
// memberSchema.index({ rollNumber: 1 });
// memberSchema.index({ phone: 1 });
// memberSchema.index({ email: 1 });
// memberSchema.index({ generation: 1 });
// memberSchema.index({ isAlive: 1 });
// memberSchema.index({ gender: 1 });
// memberSchema.index({ family: 1 });

// // ============ NEW INDEXES ============
// memberSchema.index({ status: 1 });
// memberSchema.index({ verificationStatus: 1 });
// memberSchema.index({ district: 1 });
// memberSchema.index({ province: 1 });
// memberSchema.index({ citizenshipNumber: 1 });
// // ============ END NEW INDEXES ============

// // Virtual for full name with title
// memberSchema.virtual('fullName').get(function() {
//   return this.name;
// });

// // Virtual for age
// memberSchema.virtual('age').get(function() {
//   if (!this.dob) return null;
//   const age = new Date().getFullYear() - this.dob.getFullYear();
//   return age;
// });

// // Ensure virtuals are included in JSON output
// memberSchema.set('toJSON', { virtuals: true });
// memberSchema.set('toObject', { virtuals: true });

// export default mongoose.model('Member', memberSchema);




// // models/Member.js - UPDATED
// import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';

// const memberSchema = new mongoose.Schema({
//   uuid: {
//     type: String,
//     default: uuidv4,
//     unique: true,
//     index: true,
//   },
//   // Basic Information
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//     index: true,
//   },
//   surname: {
//     type: String,
//     trim: true,
//   },
//   familyLine: {
//     type: String,
//     trim: true,
//   },
  
//   // NEW: Roll Number - unique per member
//   rollNumber: {
//     type: String,
//     unique: true,
//     sparse: true,
//     trim: true,
//     index: true,
//   },
  
//   // NEW: Vansha/Generation Number (denormalized from Family)
//   vanshaGenerationNumber: {
//     type: String,
//     trim: true,
//     index: true,
//   },
  
//   generation: {
//     type: Number,
//     default: 1,
//   },
//   genealogyPageNumber: {
//     type: String,
//     trim: true,
//   },
//   relationship: {
//     type: String,
//     enum: ['member', 'child', 'parent', 'sibling', 'grandparent', 'grandchild', 'other', 'spouse'],
//     default: 'member',
//   },
  
//   // NEW: Parent relationship type
//   parentRelationshipType: {
//     type: String,
//     enum: ['biological', 'adoptive', 'step', 'guardian', 'other'],
//     default: 'biological',
//   },
  
//   // NEW: Child birth order
//   childBirthOrder: {
//     type: Number,
//     default: null,
//   },
  
//   // NEW: Lineage role
//   lineageRole: {
//     type: String,
//     enum: ['lineage_head', 'lineage_member', 'spouse', 'other'],
//     default: 'lineage_member',
//   },

//   // Auto-generated member number
//   memberNumber: {
//     type: String,
//     unique: true,
//     sparse: true,
//     trim: true,
//   },
  
//   // Personal Details
//   gender: {
//     type: String,
//     enum: ['male', 'female', 'other'],
//     required: true,
//   },
//   dob: {
//     type: Date,
//     required: true,
//   },
//   placeOfBirth: {
//     type: String,
//     trim: true,
//   },
//   bloodGroup: {
//     type: String,
//     enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],
//     default: 'unknown',
//   },
//   education: {
//     type: String,
//     trim: true,
//   },
//   occupation: {
//     type: String,
//     trim: true,
//   },
//   phone: {
//     type: String,
//     sparse: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     sparse: true,
//     trim: true,
//     lowercase: true,
//   },
//   citizenshipNumber: {
//     type: String,
//     trim: true,
//   },
//   maritalStatus: {
//     type: String,
//     enum: ['single', 'married', 'divorced', 'widowed', 'other'],
//     default: 'single',
//   },
  
//   // Address
//   currentAddress: {
//     type: String,
//     trim: true,
//   },
//   permanentAddress: {
//     type: String,
//     trim: true,
//   },
  
//   // Personal Information (Additional)
//   religion: {
//     type: String,
//     trim: true,
//   },
//   casteEthnicity: {
//     type: String,
//     trim: true,
//   },
//   nationality: {
//     type: String,
//     default: 'Nepali',
//     trim: true,
//   },
  
//   // Contact Information (Additional)
//   alternatePhone: {
//     type: String,
//     trim: true,
//   },
  
//   // Address Information (Detailed)
//   houseNumber: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   wardNumber: {
//     type: String,
//     trim: true,
//   },
//   toleVillage: {
//     type: String,
//     trim: true,
//   },
//   municipality: {
//     type: String,
//     trim: true,
//   },
//   district: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   province: {
//     type: String,
//     trim: true,
//   },
//   country: {
//     type: String,
//     default: 'Nepal',
//     trim: true,
//   },
//   postalCode: {
//     type: String,
//     trim: true,
//   },
  
//   // Family Information (References)
//   family: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Family',
//     index: true,
//   },
//   father: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//     index: true,
//   },
//   mother: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//     index: true,
//   },
//   grandfather: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//     index: true,
//   },
//   grandmother: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//     index: true,
//   },
//   spouse: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//     index: true,
//   },
//   guardian: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//     index: true,
//   },
//   familyContact: {
//     type: String,
//     trim: true,
//   },
  
//   // Identification
//   citizenshipIssueDate: {
//     type: Date,
//   },
//   citizenshipIssueDistrict: {
//     type: String,
//     trim: true,
//   },
//   citizenshipFront: {
//     type: String,
//     default: null,
//   },
//   citizenshipBack: {
//     type: String,
//     default: null,
//   },
//   nationalIdNumber: {
//     type: String,
//     trim: true,
//   },
//   nationalIdIssueDate: {
//     type: Date,
//   },
//   nationalIdFront: {
//     type: String,
//     default: null,
//   },
  
//   // Passport
//   passportNumber: {
//     type: String,
//     trim: true,
//   },
//   passportIssueDate: {
//     type: Date,
//   },
//   passportExpiryDate: {
//     type: Date,
//   },
//   passportPhoto: {
//     type: String,
//     default: null,
//   },
  
//   // Driving License
//   drivingLicenseNumber: {
//     type: String,
//     trim: true,
//   },
//   drivingLicenseCategory: {
//     type: String,
//     trim: true,
//   },
//   drivingLicenseIssueDate: {
//     type: Date,
//   },
//   drivingLicenseExpiryDate: {
//     type: Date,
//   },
//   drivingLicensePhoto: {
//     type: String,
//     default: null,
//   },
  
//   // Documents
//   birthCertificate: {
//     type: String,
//     trim: true,
//   },
//   marriageCertificate: {
//     type: String,
//     trim: true,
//   },
//   deathCertificate: {
//     type: String,
//     trim: true,
//   },
//   panCard: {
//     type: String,
//     trim: true,
//   },
//   voterId: {
//     type: String,
//     trim: true,
//   },
  
//   // Additional Information
//   biography: {
//     type: String,
//     trim: true,
//   },
//   notes: {
//     type: String,
//     trim: true,
//   },
//   specialRemarks: {
//     type: String,
//     trim: true,
//   },
//   medicalNotes: {
//     type: String,
//     trim: true,
//   },
//   disabilityInfo: {
//     type: String,
//     trim: true,
//   },
  
//   // Status
//   status: {
//     type: String,
//     enum: ['active', 'inactive', 'deceased'],
//     default: 'active',
//   },
//   verificationStatus: {
//     type: String,
//     enum: ['verified', 'pending', 'rejected'],
//     default: 'pending',
//   },
  
//   // Life Status
//   isAlive: {
//     type: Boolean,
//     default: true,
//   },
//   dod: {
//     type: Date,
//   },
  
//   // Family Relationships (Bidirectional)
//   husband: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   wife: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   sons: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   daughters: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   elderBrothers: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   youngerBrothers: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   elderSisters: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   youngerSisters: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   grandsons: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   granddaughters: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   fatherInLaw: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   motherInLaw: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   sonInLaw: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   daughterInLaw: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
  
//   // Media
//   photo: {
//     type: String,
//     default: null,
//   },
  
//   // Metadata
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     default: null,
//   },
//   updatedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     default: null,
//   },
// }, {
//   timestamps: true,
// });

// // Indexes for performance
// memberSchema.index({ name: 'text' });
// memberSchema.index({ memberNumber: 1 });
// memberSchema.index({ rollNumber: 1 });
// memberSchema.index({ vanshaGenerationNumber: 1 });
// memberSchema.index({ phone: 1 });
// memberSchema.index({ email: 1 });
// memberSchema.index({ generation: 1 });
// memberSchema.index({ isAlive: 1 });
// memberSchema.index({ gender: 1 });
// memberSchema.index({ family: 1 });
// memberSchema.index({ status: 1 });
// memberSchema.index({ verificationStatus: 1 });
// memberSchema.index({ district: 1 });
// memberSchema.index({ province: 1 });
// memberSchema.index({ citizenshipNumber: 1 });
// memberSchema.index({ surname: 1 });

// // Virtual for full name with title
// memberSchema.virtual('fullName').get(function() {
//   return this.surname ? `${this.name} ${this.surname}` : this.name;
// });

// // Virtual for age
// memberSchema.virtual('age').get(function() {
//   if (!this.dob) return null;
//   const age = new Date().getFullYear() - this.dob.getFullYear();
//   return age;
// });

// // Ensure virtuals are included in JSON output
// memberSchema.set('toJSON', { virtuals: true });
// memberSchema.set('toObject', { virtuals: true });

// // Pre-save hook for rollNumber auto-generation
// memberSchema.pre('save', async function() {
//   if (this.isNew && !this.rollNumber) {
//     const Counter = mongoose.model('Counter');
//     const counter = await Counter.findByIdAndUpdate(
//       'rollNumber',
//       { $inc: { seq: 1 } },
//       { new: true, upsert: true }
//     );
//     this.rollNumber = String(counter.seq);
//   }
//   // next();
// });

// export default mongoose.model('Member', memberSchema);

// models/Member.js - COMPLETE FIXED FILE

import mongoose from 'mongoose';
import { v4 as uuidv4 } from 'uuid';

const memberSchema = new mongoose.Schema({
  uuid: {
    type: String,
    default: uuidv4,
    unique: true,
  },
  // Basic Information
  name: {
    type: String,
    required: true,
    trim: true,
  },
  surname: {
    type: String,
    trim: true,
  },
  familyLine: {
    type: String,
    trim: true,
  },
  
  rollNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  
  vanshaGenerationNumber: {
    type: String,
    trim: true,
  },
  
  generation: {
    type: Number,
    default: 1,
  },
  genealogyPageNumber: {
    type: String,
    trim: true,
  },
  relationship: {
    type: String,
    enum: ['member', 'child', 'parent', 'sibling', 'grandparent', 'grandchild', 'other', 'spouse'],
    default: 'member',
  },
  
  parentRelationshipType: {
    type: String,
    enum: ['biological', 'adoptive', 'step', 'guardian', 'other'],
    default: 'biological',
  },
  
  childBirthOrder: {
    type: Number,
    default: null,
  },
  
  lineageRole: {
    type: String,
    enum: ['lineage_head', 'lineage_member', 'spouse', 'other'],
    default: 'lineage_member',
  },

  memberNumber: {
    type: String,
    unique: true,
    sparse: true,
    trim: true,
  },
  
  // Personal Details
  gender: {
    type: String,
    enum: ['male', 'female', 'other'],
    required: true,
  },
  dob: {
    type: Date,
    required: true,
  },
  placeOfBirth: {
    type: String,
    trim: true,
  },
  bloodGroup: {
    type: String,
    enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],
    default: 'unknown',
  },
  education: {
    type: String,
    trim: true,
  },
  occupation: {
    type: String,
    trim: true,
  },
  phone: {
    type: String,
    sparse: true,
    trim: true,
  },
  email: {
    type: String,
    sparse: true,
    trim: true,
    lowercase: true,
  },
  citizenshipNumber: {
    type: String,
    trim: true,
  },
  maritalStatus: {
    type: String,
    enum: ['single', 'married', 'divorced', 'widowed', 'other'],
    default: 'single',
  },
  
  // Address
  currentAddress: {
    type: String,
    trim: true,
  },
  permanentAddress: {
    type: String,
    trim: true,
  },
  
  // Personal Information (Additional)
  religion: {
    type: String,
    trim: true,
  },
  casteEthnicity: {
    type: String,
    trim: true,
  },
  nationality: {
    type: String,
    default: 'Nepali',
    trim: true,
  },
  
  // Contact Information (Additional)
  alternatePhone: {
    type: String,
    trim: true,
  },
  
  // Address Information (Detailed)
  houseNumber: {
    type: String,
    required: true,
    trim: true,
  },
  wardNumber: {
    type: String,
    trim: true,
  },
  toleVillage: {
    type: String,
    trim: true,
  },
  municipality: {
    type: String,
    trim: true,
  },
  district: {
    type: String,
    required: true,
    trim: true,
  },
  province: {
    type: String,
    trim: true,
  },
  country: {
    type: String,
    default: 'Nepal',
    trim: true,
  },
  postalCode: {
    type: String,
    trim: true,
  },
  
  // Family Information (References)
  family: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Family',
  },
  father: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  mother: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  grandfather: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  grandmother: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  spouse: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  guardian: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  familyContact: {
    type: String,
    trim: true,
  },
  
  // Identification
  citizenshipIssueDate: {
    type: Date,
  },
  citizenshipIssueDistrict: {
    type: String,
    trim: true,
  },
  citizenshipFront: {
    type: String,
    default: null,
  },
  citizenshipBack: {
    type: String,
    default: null,
  },
  nationalIdNumber: {
    type: String,
    trim: true,
  },
  nationalIdIssueDate: {
    type: Date,
  },
  nationalIdFront: {
    type: String,
    default: null,
  },
  
  // Passport
  passportNumber: {
    type: String,
    trim: true,
  },
  passportIssueDate: {
    type: Date,
  },
  passportExpiryDate: {
    type: Date,
  },
  passportPhoto: {
    type: String,
    default: null,
  },
  
  // Driving License
  drivingLicenseNumber: {
    type: String,
    trim: true,
  },
  drivingLicenseCategory: {
    type: String,
    trim: true,
  },
  drivingLicenseIssueDate: {
    type: Date,
  },
  drivingLicenseExpiryDate: {
    type: Date,
  },
  drivingLicensePhoto: {
    type: String,
    default: null,
  },
  
  // Documents
  birthCertificate: {
    type: String,
    trim: true,
  },
  marriageCertificate: {
    type: String,
    trim: true,
  },
  deathCertificate: {
    type: String,
    trim: true,
  },
  panCard: {
    type: String,
    trim: true,
  },
  voterId: {
    type: String,
    trim: true,
  },
  
  // Additional Information
  biography: {
    type: String,
    trim: true,
  },
  notes: {
    type: String,
    trim: true,
  },
  specialRemarks: {
    type: String,
    trim: true,
  },
  medicalNotes: {
    type: String,
    trim: true,
  },
  disabilityInfo: {
    type: String,
    trim: true,
  },
  
  // Status
  status: {
    type: String,
    enum: ['active', 'inactive', 'deceased'],
    default: 'active',
  },
  verificationStatus: {
    type: String,
    enum: ['verified', 'pending', 'rejected'],
    default: 'pending',
  },
  
  // Life Status
  isAlive: {
    type: Boolean,
    default: true,
  },
  dod: {
    type: Date,
  },
  
  // Family Relationships (Bidirectional)
  husband: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  wife: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  sons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  }],
  daughters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  }],
  elderBrothers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  }],
  youngerBrothers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  }],
  elderSisters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  }],
  youngerSisters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  }],
  grandsons: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  }],
  granddaughters: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  }],
  fatherInLaw: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  motherInLaw: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  },
  sonInLaw: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  }],
  daughterInLaw: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
  }],
  
  // Media
  photo: {
    type: String,
    default: null,
  },
  
  // Metadata
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

// ========== SINGLE DEFINITION OF INDEXES ==========
// Define each index only ONCE to avoid duplicate warnings

// Text index for search
memberSchema.index({ name: 'text', surname: 'text', memberNumber: 'text', rollNumber: 'text', vanshaGenerationNumber: 'text', phone: 'text', email: 'text', citizenshipNumber: 'text' });

// Single-field indexes
memberSchema.index({ memberNumber: 1 });
memberSchema.index({ rollNumber: 1 });
memberSchema.index({ vanshaGenerationNumber: 1 });
memberSchema.index({ phone: 1 });
memberSchema.index({ email: 1 });
memberSchema.index({ generation: 1 });
memberSchema.index({ isAlive: 1 });
memberSchema.index({ gender: 1 });
memberSchema.index({ family: 1 });
memberSchema.index({ status: 1 });
memberSchema.index({ verificationStatus: 1 });
memberSchema.index({ district: 1 });
memberSchema.index({ province: 1 });
memberSchema.index({ citizenshipNumber: 1 });
memberSchema.index({ surname: 1 });

// Compound indexes
memberSchema.index({ family: 1, generation: 1 });
memberSchema.index({ family: 1, isAlive: 1 });

// Virtual for full name
memberSchema.virtual('fullName').get(function() {
  return this.surname ? `${this.name} ${this.surname}` : this.name;
});

// Virtual for age
memberSchema.virtual('age').get(function() {
  if (!this.dob) return null;
  const age = new Date().getFullYear() - this.dob.getFullYear();
  return age;
});

// Ensure virtuals are included in JSON output
memberSchema.set('toJSON', { virtuals: true });
memberSchema.set('toObject', { virtuals: true });

// Pre-save hook for rollNumber auto-generation
memberSchema.pre('save', async function() {
  if (this.isNew && !this.rollNumber) {
    const Counter = mongoose.model('Counter');
    const counter = await Counter.findByIdAndUpdate(
      'rollNumber',
      { $inc: { seq: 1 } },
      { new: true, upsert: true }
    );
    this.rollNumber = String(counter.seq);
  }
});

export default mongoose.model('Member', memberSchema);

// models/Member.js - UPDATED with duplicate indexes removed

// import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';

// const memberSchema = new mongoose.Schema({
//   uuid: {
//     type: String,
//     default: uuidv4,
//     unique: true,
//     index: true,
//   },
//   // Basic Information
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//     index: true,
//   },
//   surname: {
//     type: String,
//     trim: true,
//   },
//   familyLine: {
//     type: String,
//     trim: true,
//   },
  
//   rollNumber: {
//     type: String,
//     unique: true,
//     sparse: true,
//     trim: true,
//     index: true,
//   },
  
//   vanshaGenerationNumber: {
//     type: String,
//     trim: true,
//     index: true,
//   },
  
//   generation: {
//     type: Number,
//     default: 1,
//   },
//   genealogyPageNumber: {
//     type: String,
//     trim: true,
//   },
//   relationship: {
//     type: String,
//     enum: ['member', 'child', 'parent', 'sibling', 'grandparent', 'grandchild', 'other', 'spouse'],
//     default: 'member',
//   },
  
//   parentRelationshipType: {
//     type: String,
//     enum: ['biological', 'adoptive', 'step', 'guardian', 'other'],
//     default: 'biological',
//   },
  
//   childBirthOrder: {
//     type: Number,
//     default: null,
//   },
  
//   lineageRole: {
//     type: String,
//     enum: ['lineage_head', 'lineage_member', 'spouse', 'other'],
//     default: 'lineage_member',
//   },

//   // Auto-generated member number
//   memberNumber: {
//     type: String,
//     unique: true,
//     sparse: true,
//     trim: true,
//     index: true,
//   },
  
//   // Personal Details
//   gender: {
//     type: String,
//     enum: ['male', 'female', 'other'],
//     required: true,
//   },
//   dob: {
//     type: Date,
//     required: true,
//   },
//   placeOfBirth: {
//     type: String,
//     trim: true,
//   },
//   bloodGroup: {
//     type: String,
//     enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],
//     default: 'unknown',
//   },
//   education: {
//     type: String,
//     trim: true,
//   },
//   occupation: {
//     type: String,
//     trim: true,
//   },
//   phone: {
//     type: String,
//     sparse: true,
//     trim: true,
//     index: true,
//   },
//   email: {
//     type: String,
//     sparse: true,
//     trim: true,
//     lowercase: true,
//     index: true,
//   },
//   citizenshipNumber: {
//     type: String,
//     trim: true,
//     index: true,
//   },
//   maritalStatus: {
//     type: String,
//     enum: ['single', 'married', 'divorced', 'widowed', 'other'],
//     default: 'single',
//   },
  
//   // Address
//   currentAddress: {
//     type: String,
//     trim: true,
//   },
//   permanentAddress: {
//     type: String,
//     trim: true,
//   },
  
//   // Personal Information (Additional)
//   religion: {
//     type: String,
//     trim: true,
//   },
//   casteEthnicity: {
//     type: String,
//     trim: true,
//   },
//   nationality: {
//     type: String,
//     default: 'Nepali',
//     trim: true,
//   },
  
//   // Contact Information (Additional)
//   alternatePhone: {
//     type: String,
//     trim: true,
//   },
  
//   // Address Information (Detailed)
//   houseNumber: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   wardNumber: {
//     type: String,
//     trim: true,
//   },
//   toleVillage: {
//     type: String,
//     trim: true,
//   },
//   municipality: {
//     type: String,
//     trim: true,
//   },
//   district: {
//     type: String,
//     required: true,
//     trim: true,
//     index: true,
//   },
//   province: {
//     type: String,
//     trim: true,
//     index: true,
//   },
//   country: {
//     type: String,
//     default: 'Nepal',
//     trim: true,
//   },
//   postalCode: {
//     type: String,
//     trim: true,
//   },
  
//   // Family Information (References)
//   family: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Family',
//     index: true,
//   },
//   father: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//     index: true,
//   },
//   mother: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//     index: true,
//   },
//   grandfather: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//     index: true,
//   },
//   grandmother: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//     index: true,
//   },
//   spouse: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//     index: true,
//   },
//   guardian: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//     index: true,
//   },
//   familyContact: {
//     type: String,
//     trim: true,
//   },
  
//   // Identification
//   citizenshipIssueDate: {
//     type: Date,
//   },
//   citizenshipIssueDistrict: {
//     type: String,
//     trim: true,
//   },
//   citizenshipFront: {
//     type: String,
//     default: null,
//   },
//   citizenshipBack: {
//     type: String,
//     default: null,
//   },
//   nationalIdNumber: {
//     type: String,
//     trim: true,
//   },
//   nationalIdIssueDate: {
//     type: Date,
//   },
//   nationalIdFront: {
//     type: String,
//     default: null,
//   },
  
//   // Passport
//   passportNumber: {
//     type: String,
//     trim: true,
//   },
//   passportIssueDate: {
//     type: Date,
//   },
//   passportExpiryDate: {
//     type: Date,
//   },
//   passportPhoto: {
//     type: String,
//     default: null,
//   },
  
//   // Driving License
//   drivingLicenseNumber: {
//     type: String,
//     trim: true,
//   },
//   drivingLicenseCategory: {
//     type: String,
//     trim: true,
//   },
//   drivingLicenseIssueDate: {
//     type: Date,
//   },
//   drivingLicenseExpiryDate: {
//     type: Date,
//   },
//   drivingLicensePhoto: {
//     type: String,
//     default: null,
//   },
  
//   // Documents
//   birthCertificate: {
//     type: String,
//     trim: true,
//   },
//   marriageCertificate: {
//     type: String,
//     trim: true,
//   },
//   deathCertificate: {
//     type: String,
//     trim: true,
//   },
//   panCard: {
//     type: String,
//     trim: true,
//   },
//   voterId: {
//     type: String,
//     trim: true,
//   },
  
//   // Additional Information
//   biography: {
//     type: String,
//     trim: true,
//   },
//   notes: {
//     type: String,
//     trim: true,
//   },
//   specialRemarks: {
//     type: String,
//     trim: true,
//   },
//   medicalNotes: {
//     type: String,
//     trim: true,
//   },
//   disabilityInfo: {
//     type: String,
//     trim: true,
//   },
  
//   // Status
//   status: {
//     type: String,
//     enum: ['active', 'inactive', 'deceased'],
//     default: 'active',
//     index: true,
//   },
//   verificationStatus: {
//     type: String,
//     enum: ['verified', 'pending', 'rejected'],
//     default: 'pending',
//     index: true,
//   },
  
//   // Life Status
//   isAlive: {
//     type: Boolean,
//     default: true,
//     index: true,
//   },
//   dod: {
//     type: Date,
//   },
  
//   // Family Relationships (Bidirectional)
//   husband: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   wife: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   sons: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   daughters: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   elderBrothers: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   youngerBrothers: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   elderSisters: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   youngerSisters: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   grandsons: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   granddaughters: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   fatherInLaw: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   motherInLaw: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   sonInLaw: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   daughterInLaw: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
  
//   // Media
//   photo: {
//     type: String,
//     default: null,
//   },
  
//   // Metadata
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     default: null,
//   },
//   updatedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     default: null,
//   },
// }, {
//   timestamps: true,
// });

// // Indexes for performance - REMOVED DUPLICATES
// // Only define each index once
// memberSchema.index({ name: 'text' });
// memberSchema.index({ memberNumber: 1 });
// memberSchema.index({ rollNumber: 1 });
// memberSchema.index({ vanshaGenerationNumber: 1 });
// memberSchema.index({ phone: 1 });
// memberSchema.index({ email: 1 });
// memberSchema.index({ generation: 1 });
// memberSchema.index({ isAlive: 1 });
// memberSchema.index({ gender: 1 });
// memberSchema.index({ family: 1 });
// memberSchema.index({ status: 1 });
// memberSchema.index({ verificationStatus: 1 });
// memberSchema.index({ district: 1 });
// memberSchema.index({ province: 1 });
// memberSchema.index({ citizenshipNumber: 1 });
// memberSchema.index({ surname: 1 });

// // Virtual for full name with title
// memberSchema.virtual('fullName').get(function() {
//   return this.surname ? `${this.name} ${this.surname}` : this.name;
// });

// // Virtual for age
// memberSchema.virtual('age').get(function() {
//   if (!this.dob) return null;
//   const age = new Date().getFullYear() - this.dob.getFullYear();
//   return age;
// });

// // Ensure virtuals are included in JSON output
// memberSchema.set('toJSON', { virtuals: true });
// memberSchema.set('toObject', { virtuals: true });

// // Pre-save hook for rollNumber auto-generation
// memberSchema.pre('save', async function() {
//   if (this.isNew && !this.rollNumber) {
//     const Counter = mongoose.model('Counter');
//     const counter = await Counter.findByIdAndUpdate(
//       'rollNumber',
//       { $inc: { seq: 1 } },
//       { new: true, upsert: true }
//     );
//     this.rollNumber = String(counter.seq);
//   }
// });

// export default mongoose.model('Member', memberSchema);






// import mongoose from 'mongoose';
// import { v4 as uuidv4 } from 'uuid';

// const memberSchema = new mongoose.Schema({
//   uuid: {
//     type: String,
//     default: uuidv4,
//     unique: true,
//     index: true,
//   },
//   // Basic Information
//   name: {
//     type: String,
//     required: true,
//     trim: true,
//     index: true,
//   },
//   surname: {
//     type: String,
//     trim: true,
//   },
//   familyLine: {
//     type: String,
//     trim: true,
//   },
//   familyNumber: {
//     type: String,
//     trim: true,
//   },
//   rollNumber: {
//     type: String,
//     trim: true,
//   },
//   generation: {
//     type: Number,
//     default: 1,
//   },
//   genealogyPageNumber: {
//     type: String,
//     trim: true,
//   },
//   relationship: {
//     type: String,
//     enum: ['member', 'child', 'parent', 'sibling', 'grandparent', 'grandchild', 'other', 'spouse'],
//     default: 'member',
//   },

//   // Auto-generated member number
//   memberNumber: {
//     type: String,
//     unique: true,
//     sparse: true,
//     trim: true,
//   },
  
//   // Personal Details
//   gender: {
//     type: String,
//     enum: ['male', 'female', 'other'],
//     required: true,
//   },
//   dob: {
//     type: Date,
//     required: true,
//   },
//   placeOfBirth: {
//     type: String,
//     trim: true,
//   },
//   bloodGroup: {
//     type: String,
//     enum: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-', 'unknown'],
//     default: 'unknown',
//   },
//   education: {
//     type: String,
//     trim: true,
//   },
//   occupation: {
//     type: String,
//     trim: true,
//   },
//   phone: {
//     type: String,
//     sparse: true,
//     trim: true,
//   },
//   email: {
//     type: String,
//     sparse: true,
//     trim: true,
//     lowercase: true,
//   },
//   citizenshipNumber: {
//     type: String,
//     trim: true,
//   },
//   maritalStatus: {
//     type: String,
//     enum: ['single', 'married', 'divorced', 'widowed', 'other'],
//     default: 'single',
//   },
  
//   // Address
//   currentAddress: {
//     type: String,
//     trim: true,
//   },
//   permanentAddress: {
//     type: String,
//     trim: true,
//   },
  
//   // Personal Information (Additional)
//   religion: {
//     type: String,
//     trim: true,
//   },
//   casteEthnicity: {
//     type: String,
//     trim: true,
//   },
//   nationality: {
//     type: String,
//     default: 'Nepali',
//     trim: true,
//   },
  
//   // Contact Information (Additional)
//   alternatePhone: {
//     type: String,
//     trim: true,
//   },
  
//   // Address Information (Detailed)
//   houseNumber: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   wardNumber: {
//     type: String,
//     trim: true,
//   },
//   toleVillage: {
//     type: String,
//     trim: true,
//   },
//   municipality: {
//     type: String,
//     trim: true,
//   },
//   district: {
//     type: String,
//     required: true,
//     trim: true,
//   },
//   province: {
//     type: String,
//     trim: true,
//   },
//   country: {
//     type: String,
//     default: 'Nepal',
//     trim: true,
//   },
//   postalCode: {
//     type: String,
//     trim: true,
//   },
  
//   // Family Information (References)
//   family: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Family',
//     index: true,
//   },
//   father: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//     index: true,
//   },
//   mother: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//     index: true,
//   },
//   grandfather: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//     index: true,
//   },
//   grandmother: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//     index: true,
//   },
//   spouse: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//     index: true,
//   },
//   guardian: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//     index: true,
//   },
//   familyContact: {
//     type: String,
//     trim: true,
//   },
  
//   // Identification
//   citizenshipIssueDate: {
//     type: Date,
//   },
//   citizenshipIssueDistrict: {
//     type: String,
//     trim: true,
//   },
//   citizenshipFront: {
//     type: String,
//     default: null,
//   },
//   citizenshipBack: {
//     type: String,
//     default: null,
//   },
//   nationalIdNumber: {
//     type: String,
//     trim: true,
//   },
//   nationalIdIssueDate: {
//     type: Date,
//   },
//   nationalIdFront: {
//     type: String,
//     default: null,
//   },
  
//   // Passport
//   passportNumber: {
//     type: String,
//     trim: true,
//   },
//   passportIssueDate: {
//     type: Date,
//   },
//   passportExpiryDate: {
//     type: Date,
//   },
//   passportPhoto: {
//     type: String,
//     default: null,
//   },
  
//   // Driving License
//   drivingLicenseNumber: {
//     type: String,
//     trim: true,
//   },
//   drivingLicenseCategory: {
//     type: String,
//     trim: true,
//   },
//   drivingLicenseIssueDate: {
//     type: Date,
//   },
//   drivingLicenseExpiryDate: {
//     type: Date,
//   },
//   drivingLicensePhoto: {
//     type: String,
//     default: null,
//   },
  
//   // Documents
//   birthCertificate: {
//     type: String,
//     trim: true,
//   },
//   marriageCertificate: {
//     type: String,
//     trim: true,
//   },
//   deathCertificate: {
//     type: String,
//     trim: true,
//   },
//   panCard: {
//     type: String,
//     trim: true,
//   },
//   voterId: {
//     type: String,
//     trim: true,
//   },
  
//   // Additional Information
//   biography: {
//     type: String,
//     trim: true,
//   },
//   notes: {
//     type: String,
//     trim: true,
//   },
//   specialRemarks: {
//     type: String,
//     trim: true,
//   },
//   medicalNotes: {
//     type: String,
//     trim: true,
//   },
//   disabilityInfo: {
//     type: String,
//     trim: true,
//   },
  
//   // Status
//   status: {
//     type: String,
//     enum: ['active', 'inactive', 'deceased'],
//     default: 'active',
//   },
//   verificationStatus: {
//     type: String,
//     enum: ['verified', 'pending', 'rejected'],
//     default: 'pending',
//   },
  
//   // Life Status
//   isAlive: {
//     type: Boolean,
//     default: true,
//   },
//   dod: {
//     type: Date,
//   },
  
//   // Family Relationships (Bidirectional)
//   husband: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   wife: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   sons: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   daughters: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   elderBrothers: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   youngerBrothers: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   elderSisters: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   youngerSisters: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   grandsons: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   granddaughters: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   fatherInLaw: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   motherInLaw: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   },
//   sonInLaw: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
//   daughterInLaw: [{
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Member',
//   }],
  
//   // Media
//   photo: {
//     type: String,
//     default: null,
//   },
  
//   // Metadata
//   createdBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     default: null,
//   },
//   updatedBy: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     default: null,
//   },
// }, {
//   timestamps: true,
// });

// // Indexes for performance
// memberSchema.index({ name: 'text' });
// memberSchema.index({ memberNumber: 1 });
// memberSchema.index({ familyNumber: 1 });
// memberSchema.index({ rollNumber: 1 });
// memberSchema.index({ phone: 1 });
// memberSchema.index({ email: 1 });
// memberSchema.index({ generation: 1 });
// memberSchema.index({ isAlive: 1 });
// memberSchema.index({ gender: 1 });
// memberSchema.index({ family: 1 });
// memberSchema.index({ status: 1 });
// memberSchema.index({ verificationStatus: 1 });
// memberSchema.index({ district: 1 });
// memberSchema.index({ province: 1 });
// memberSchema.index({ citizenshipNumber: 1 });
// memberSchema.index({ surname: 1 });

// // Virtual for full name with title
// memberSchema.virtual('fullName').get(function() {
//   return this.surname ? `${this.name} ${this.surname}` : this.name;
// });

// // Virtual for age
// memberSchema.virtual('age').get(function() {
//   if (!this.dob) return null;
//   const age = new Date().getFullYear() - this.dob.getFullYear();
//   return age;
// });

// // Ensure virtuals are included in JSON output
// memberSchema.set('toJSON', { virtuals: true });
// memberSchema.set('toObject', { virtuals: true });

// export default mongoose.model('Member', memberSchema);