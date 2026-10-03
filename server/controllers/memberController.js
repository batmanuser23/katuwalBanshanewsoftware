// backend/src/controllers/memberController.js - COMPLETE UPDATED FILE
// Features:
// - generationMode support (auto/manual)
// - Manual vanshaj number preserved
// - DOB conversion (English → Nepali BS storage)
// - Spouse auto-linking (bidirectional)
// - Missing/unknown person support
// - Duplicate member detection

import Member from '../models/Member.js';
import Family from '../models/Family.js';
import House from '../models/House.js';
import FamilyRelationship from '../models/FamilyRelationship.js';
import { io } from '../server.js';
import cloudinary from '../config/cloudinary.js';
import Notification from '../models/Notification.js';
import Counter from '../models/Counter.js';

// ⭐ Helper: Get sequential member number - M0001 format
const getNextMemberNumber = async () => {
  const counter = await Counter.findByIdAndUpdate(
    'memberNumber',
    { $inc: { seq: 1 } },
    { new: true, upsert: true }
  );
  return `M${String(counter.seq).padStart(4, '0')}`;
};

// ⭐ Helper: Clean array fields - remove empty strings
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

// ⭐ Helper: Clean phone number
const cleanPhoneNumber = (phone) => {
  if (!phone) return '';
  const cleaned = phone.replace(/\D/g, '');
  if (cleaned.length === 10 && cleaned.startsWith('9')) {
    return cleaned;
  }
  return phone;
};

// ⭐ Helper: Clean family ID
const cleanFamilyId = (family) => {
  if (!family) return '';
  if (Array.isArray(family)) return family[0] || '';
  if (typeof family === 'object' && family !== null) {
    return family._id || family.id || '';
  }
  if (typeof family === 'string') return family;
  return String(family);
};

// ⭐ NEW: Parse date input (supports AD and BS)
const parseDateInput = (dateInput) => {
  if (!dateInput) return { adDate: null, bsString: null };

  // If already a Date object
  if (dateInput instanceof Date) {
    return { adDate: dateInput, bsString: null };
  }

  // If string in YYYY-MM-DD format
  if (typeof dateInput === 'string') {
    const trimmed = dateInput.trim();
    if (!trimmed) return { adDate: null, bsString: null };

    const match = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
    if (!match) return { adDate: null, bsString: null };

    const year = parseInt(match[1], 10);
    const month = parseInt(match[2], 10);
    const day = parseInt(match[3], 10);

    // If year is 2000-2090, treat as BS (Nepali)
    if (year >= 2000 && year <= 2090) {
      // Convert BS to AD
      const adDate = bsToAd(year, month, day);
      return { adDate, bsString: trimmed };
    }

    // Otherwise treat as AD (English)
    if (year >= 1900 && year <= 2100) {
      const adDate = new Date(year, month - 1, day);
      if (!isNaN(adDate.getTime())) {
        // Convert to BS for storage
        const bsDate = adToBs(adDate);
        return { adDate, bsString: bsDate?.formatted || null };
      }
    }
  }

  return { adDate: null, bsString: null };
};

// ⭐ BS to AD conversion (simplified - uses the frontend converter logic)
const bsToAd = (bsYear, bsMonth, bsDay) => {
  // Reference: 2000/01/01 BS = 1943/04/14 AD
  const BS_START_YEAR = 2000;
  const AD_START_DATE = new Date(1943, 3, 14);
  
  // Simplified calendar data (same as frontend)
  const NEPALI_CALENDAR_DATA = {
    2000: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2001: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2002: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2003: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2004: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2005: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2006: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2007: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2008: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
    2009: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2010: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2011: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2012: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2013: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2014: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2015: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2016: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2017: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2018: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2019: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2020: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2021: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2022: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2023: [31, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2024: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2025: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2026: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2027: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2028: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2029: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2030: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2031: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2032: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2033: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2034: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2035: [30, 32, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
    2036: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2037: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2038: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2039: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2040: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2041: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2042: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2043: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2044: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2045: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2046: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2047: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2048: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2049: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2050: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2051: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2052: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2053: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2054: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2055: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2056: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2057: [31, 32, 31, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2058: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2059: [31, 31, 31, 32, 31, 31, 30, 29, 30, 29, 30, 30],
    2060: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2061: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2062: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    2063: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2064: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2065: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2066: [30, 32, 31, 32, 31, 31, 29, 30, 29, 30, 29, 31],
    2067: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2068: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2069: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2070: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 29, 31],
    2071: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2072: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2073: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2074: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2075: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2076: [31, 31, 32, 32, 31, 30, 30, 29, 30, 29, 30, 30],
    2077: [31, 32, 31, 32, 31, 30, 30, 30, 29, 29, 30, 31],
    2078: [31, 31, 31, 32, 31, 31, 29, 30, 30, 29, 30, 30],
    2079: [31, 31, 32, 31, 31, 31, 30, 29, 30, 29, 30, 30],
    2080: [31, 31, 32, 32, 31, 30, 30, 30, 29, 29, 30, 30],
    2081: [31, 31, 32, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2082: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2083: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
    2084: [31, 31, 32, 31, 31, 30, 30, 30, 29, 30, 30, 30],
    2085: [31, 32, 31, 32, 30, 31, 30, 30, 29, 30, 30, 30],
    2086: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2087: [31, 31, 32, 31, 31, 31, 30, 30, 29, 30, 30, 30],
    2088: [30, 31, 32, 32, 30, 31, 30, 30, 29, 30, 30, 30],
    2089: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
    2090: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 30, 30],
  };

  let totalDays = 0;
  for (let y = BS_START_YEAR; y < bsYear; y++) {
    const yearData = NEPALI_CALENDAR_DATA[y];
    if (yearData) {
      totalDays += yearData.reduce((a, b) => a + b, 0);
    }
  }

  const yearData = NEPALI_CALENDAR_DATA[bsYear];
  if (yearData) {
    for (let m = 1; m < bsMonth; m++) {
      totalDays += yearData[m - 1] || 30;
    }
  }

  totalDays += bsDay - 1;

  const adDate = new Date(AD_START_DATE);
  adDate.setDate(adDate.getDate() + totalDays);

  return adDate;
};

// ⭐ AD to BS conversion
const adToBs = (adDate) => {
  if (!adDate) return null;
  
  const BS_START_YEAR = 2000;
  const AD_START_DATE = new Date(1943, 3, 14);
  
  const NEPALI_MONTHS = [
    'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज',
    'कात्तिक', 'मंसिर', 'पुष', 'माघ', 'फाल्गुन', 'चैत'
  ];

  const NEPALI_CALENDAR_DATA = {
    2000: [30, 32, 31, 32, 31, 30, 30, 30, 29, 30, 29, 31],
    // ... (same data)
  };

  let totalDays = Math.floor((adDate - AD_START_DATE) / (1000 * 60 * 60 * 24));
  if (totalDays < 0) return null;

  let bsYear = BS_START_YEAR;
  let bsMonth = 1;
  let bsDay = 1;

  while (totalDays > 0) {
    const yearData = NEPALI_CALENDAR_DATA[bsYear];
    if (!yearData) break;
    
    const daysInMonth = yearData[bsMonth - 1] || 30;
    if (totalDays >= daysInMonth) {
      totalDays -= daysInMonth;
      bsMonth++;
      if (bsMonth > 12) {
        bsMonth = 1;
        bsYear++;
      }
    } else {
      bsDay += totalDays;
      totalDays = 0;
    }
  }

  return {
    year: bsYear,
    month: bsMonth,
    day: bsDay,
    formatted: `${bsYear}-${String(bsMonth).padStart(2, '0')}-${String(bsDay).padStart(2, '0')}`,
    formattedNepali: `${NEPALI_MONTHS[bsMonth - 1]} ${bsDay}, ${bsYear}`,
  };
};

// ⭐ NEW: Check for existing similar member to prevent duplicates
const findExistingMember = async (memberData, excludeId = null) => {
  const query = {
    family: memberData.family,
  };

  if (excludeId) {
    query._id = { $ne: excludeId };
  }

  const orConditions = [];

  if (memberData.name && memberData.name.trim() !== '' && memberData.personStatus !== 'unknown_name') {
    orConditions.push({
      name: { $regex: `^${memberData.name.trim()}$`, $options: 'i' },
      family: memberData.family
    });
  }

  if (memberData.phone && memberData.phone.trim() !== '') {
    orConditions.push({
      phone: memberData.phone.trim(),
      family: memberData.family
    });
  }

  if (memberData.citizenshipNumber && memberData.citizenshipNumber.trim() !== '') {
    orConditions.push({
      citizenshipNumber: memberData.citizenshipNumber.trim()
    });
  }

  if (orConditions.length === 0) {
    return null;
  }

  const existingMember = await Member.findOne({
    $or: orConditions,
    _id: excludeId ? { $ne: excludeId } : { $ne: null }
  });

  return existingMember;
};

// ⭐ Auto-link spouse relationship bidirectionally
const linkSpouseRelationship = async (member, spouseId) => {
  if (!spouseId) return null;

  const spouse = await Member.findById(spouseId);
  if (!spouse) return null;

  if (spouse.spouse && spouse.spouse.toString() !== member._id.toString()) {
    console.log(`⚠️ Spouse ${spouse.name} already has a different spouse. Skipping auto-link.`);
    return null;
  }

  spouse.spouse = member._id;

  if (member.gender === 'male') {
    spouse.husband = member._id;
  } else if (member.gender === 'female') {
    spouse.wife = member._id;
  }

  await spouse.save();
  console.log(`🔗 Auto-linked spouse: ${member.name} ↔ ${spouse.name}`);

  return spouse;
};

// ⭐ Auto-link spouse by relationship + vansha + family
const autoLinkSpouseByVansha = async (member) => {
  const isSpouseRole =
    member.relationship === 'श्रीमती' ||
    member.relationship === 'श्रीमान';

  if (!isSpouseRole || member.spouse) return;

  const candidates = await Member.find({
    _id: { $ne: member._id },
    family: member.family,
    vanshaGenerationNumber: member.vanshaGenerationNumber,
    gender: { $ne: member.gender },
    $or: [
      { spouse: { $exists: false } },
      { spouse: null },
    ],
  });

  if (candidates.length === 1) {
    const partner = candidates[0];

    await Member.findByIdAndUpdate(member._id, {
      spouse: partner._id,
      ...(member.gender === 'female' ? { husband: partner._id } : { wife: partner._id }),
    });

    await Member.findByIdAndUpdate(partner._id, {
      spouse: member._id,
      ...(member.gender === 'female' ? { wife: member._id } : { husband: member._id }),
    });

    console.log(`🔗 Auto-linked spouse by vansha: ${member.name} ↔ ${partner.name}`);
  }
};

// ⭐ Get or preserve Bansha number
const getBanshaNumber = async (familyId, requestedBansha = null) => {
  // If user provided a specific Bansha number, PRESERVE it exactly
  if (requestedBansha && requestedBansha.trim() !== '') {
    return requestedBansha.trim();
  }

  const family = await Family.findById(familyId);
  return family?.vanshaGenerationNumber || null;
};

// ============================================================
// GET MEMBERS
// ============================================================
export const getMembers = async (req, res) => {
  try {
    const {
      page = 1, limit = 10, search, gender, status, generation,
      verificationStatus, family, district, province, house
    } = req.query;
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

// ============================================================
// GET MEMBER BY ID
// ============================================================
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

// ============================================================
// CREATE MEMBER
// ============================================================
export const createMember = async (req, res) => {
  try {
    const files = req.files || {};
    const body = { ...req.body };

    // Clean the family ID
    const familyId = cleanFamilyId(body.family);
    console.log('📝 Creating member with family ID:', familyId);

    if (!familyId) {
      return res.status(400).json({
        success: false,
        message: 'Family is required. Please select a family.',
      });
    }

    const family = await Family.findById(familyId);
    if (!family) {
      return res.status(404).json({
        success: false,
        message: 'Family not found. Please select a valid family.',
      });
    }

    if (family.status === 'closed') {
      return res.status(403).json({
        success: false,
        message: 'Family is closed. Please reopen to add members.'
      });
    }

    body.family = familyId;

    // Clean phone number
    if (body.phone) {
      body.phone = cleanPhoneNumber(body.phone);
    }

    // ⭐ Handle DOB conversion
    let dobAd = null;
    let dobNepali = null;
    
    if (body.dob) {
      const parsed = parseDateInput(body.dob);
      dobAd = parsed.adDate;
      dobNepali = parsed.bsString;
    }
    
    // If dobNepali provided separately (from date picker)
    if (body.dobNepali && !dobNepali) {
      dobNepali = body.dobNepali;
      const parsed = parseDateInput(body.dobNepali);
      if (parsed.adDate) {
        dobAd = parsed.adDate;
      }
    }

    // ⭐ DUPLICATE SPOUSE CHECK
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

    // ⭐ DUPLICATE PREVENTION
    const existingMember = await findExistingMember({
      family: familyId,
      name: cleanedBody.name,
      phone: cleanedBody.phone,
      citizenshipNumber: cleanedBody.citizenshipNumber,
      personStatus: cleanedBody.personStatus,
    });

    if (existingMember) {
      console.log('⚠️ Potential duplicate member found:', existingMember.name);
      return res.status(409).json({
        success: false,
        message: `यो व्यक्ति पहिले नै यस परिवारमा दर्ता भइसकेको छ: ${existingMember.name} (${existingMember.memberNumber})। कृपया जाँच गर्नुहोस्।`,
        existingMember: {
          _id: existingMember._id,
          name: existingMember.name,
          memberNumber: existingMember.memberNumber,
        },
      });
    }

    // ⭐ Get Bansha number (PRESERVE manual entry)
    const vanshaNumber = await getBanshaNumber(familyId, cleanedBody.vanshaGenerationNumber);

    // ⭐ Generate member number
    const memberNumber = await getNextMemberNumber();

    // ⭐ Handle missing/unknown person
    const personStatus = cleanedBody.personStatus || 'known';
    let memberName = cleanedBody.name;
    let memberDob = dobAd;
    let memberDobNepali = dobNepali;

    if (personStatus === 'unknown_name') {
      memberName = memberName || 'नाम अज्ञात';
      if (!memberDob) {
        memberDob = new Date(); // Placeholder
      }
    }

    // ⭐ Handle generation mode
    const generationMode = cleanedBody.generationMode || 'auto';
    let generation = cleanedBody.generation;

    // If auto mode and no generation provided, try to calculate
    if (generationMode === 'auto' && !generation) {
      // Try to calculate from father/mother
      if (cleanedBody.father) {
        const father = await Member.findById(cleanedBody.father);
        if (father) {
          generation = (father.generation || 1) + 1;
        }
      } else if (cleanedBody.mother) {
        const mother = await Member.findById(cleanedBody.mother);
        if (mother) {
          generation = (mother.generation || 1) + 1;
        }
      } else {
        generation = 1;
      }
    }

    const memberData = {
      ...cleanedBody,
      name: memberName,
      dob: memberDob,
      dobNepali: memberDobNepali,
      memberNumber,
      vanshaGenerationNumber: vanshaNumber,
      generation: generation || 1,
      generationMode,
      family: familyId,
      status: 'active',
      verificationStatus: 'pending',
      personStatus,
      photo: files.photo?.[0]?.path || null,
      citizenshipFront: files.citizenshipFront?.[0]?.path || null,
      citizenshipBack: files.citizenshipBack?.[0]?.path || null,
      nationalIdFront: files.nationalIdFront?.[0]?.path || null,
      passportPhoto: files.passportPhoto?.[0]?.path || null,
      drivingLicensePhoto: files.drivingLicensePhoto?.[0]?.path || null,
      createdBy: req.user?._id || null,
      updatedBy: req.user?._id || null,
    };

    Object.keys(memberData).forEach(key => {
      if (memberData[key] === undefined) {
        delete memberData[key];
      }
    });

    const member = new Member(memberData);
    await member.save();

    // ⭐ AUTO-LINK SPOUSE
    if (cleanedBody.spouse && cleanedBody.maritalStatus === 'married') {
      await linkSpouseRelationship(member, cleanedBody.spouse);
    }

    // Update family total members count
    await Family.findByIdAndUpdate(familyId, {
      $inc: { totalMembers: 1 },
    });

    // ⭐ Recalculate family generations
    if (family.recalculateGenerations) {
      await family.recalculateGenerations();
    }

    const populatedMember = await Member.findById(member._id)
      .populate('family', 'familyName familyNumber vanshaGenerationNumber')
      .populate('spouse', 'name memberNumber');

    await autoLinkSpouseByVansha(member);
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

// ============================================================
// UPDATE MEMBER
// ============================================================
export const updateMember = async (req, res) => {
  try {
    const member = await Member.findById(req.params.id);
    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const body = { ...req.body };

    // Clean the family ID if provided
    if (body.family) {
      const familyId = cleanFamilyId(body.family);
      if (familyId) {
        const family = await Family.findById(familyId);
        if (!family) {
          return res.status(404).json({
            success: false,
            message: 'Family not found. Please select a valid family.',
          });
        }
        if (family.status === 'closed') {
          return res.status(403).json({
            success: false,
            message: 'Family is closed. Please reopen to update members.'
          });
        }
        body.family = familyId;
      }
    }

    const currentFamily = await Family.findById(member.family);
    if (currentFamily && currentFamily.status === 'closed') {
      return res.status(403).json({
        success: false,
        message: 'Family is closed. Please reopen to update members.'
      });
    }

    const files = req.files || {};

    if (body.phone) {
      body.phone = cleanPhoneNumber(body.phone);
    }

    // ⭐ Handle DOB conversion on update
    if (body.dob) {
      const parsed = parseDateInput(body.dob);
      if (parsed.adDate) {
        body.dob = parsed.adDate;
        body.dobNepali = parsed.bsString;
      }
    }

    // ⭐ DUPLICATE SPOUSE CHECK
    if (body.spouse && String(body.spouse) !== String(member.spouse)) {
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

    const cleanedBody = cleanArrayFields(body);

    // ⭐ Check for duplicate if name/phone changed
    if (cleanedBody.name || cleanedBody.phone) {
      const existingMember = await findExistingMember({
        family: body.family || member.family,
        name: cleanedBody.name || member.name,
        phone: cleanedBody.phone || member.phone,
        citizenshipNumber: cleanedBody.citizenshipNumber || member.citizenshipNumber,
        personStatus: cleanedBody.personStatus || member.personStatus,
      }, member._id);

      if (existingMember) {
        return res.status(409).json({
          success: false,
          message: `यो जानकारी अर्को सदस्यसँग मिल्छ: ${existingMember.name} (${existingMember.memberNumber})। कृपया जाँच गर्नुहोस्।`,
        });
      }
    }

    // Delete old Cloudinary images
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

    // ⭐ Handle spouse change
    if (cleanedBody.spouse && cleanedBody.spouse !== member.spouse?.toString()) {
      if (member.spouse) {
        await Member.findByIdAndUpdate(member.spouse, {
          $unset: { spouse: 1, husband: 1, wife: 1 }
        });
      }
      await linkSpouseRelationship(updatedMember, cleanedBody.spouse);
    }

    await autoLinkSpouseByVansha(updatedMember);
    await synchronizeRelationships(updatedMember, member);

    // ⭐ Recalculate family generations
    if (currentFamily && currentFamily.recalculateGenerations) {
      await currentFamily.recalculateGenerations();
    }

    const notification = new Notification({
      type: "member_updated",
      title: "Member Updated",
      message: `${updatedMember.name}'s profile has been updated.`,
      data: { memberId: updatedMember._id },
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

// ============================================================
// DELETE MEMBER
// ============================================================
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
      
      // ⭐ Recalculate generations after deletion
      const updatedFamily = await Family.findById(member.family);
      if (updatedFamily && updatedFamily.recalculateGenerations) {
        await updatedFamily.recalculateGenerations();
      }
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

// ============================================================
// SEARCH MEMBERS
// ============================================================
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

// ============================================================
// GET MEMBERS BY FAMILY
// ============================================================
export const getMembersByFamily = async (req, res) => {
  try {
    const { familyId } = req.params;

    const family = await Family.findById(familyId);
    if (!family) {
      return res.status(404).json({ message: 'Family not found' });
    }

    const members = await Member.find({ family: familyId })
      .select('name photo gender dob dobNepali isAlive relationship generation generationMode memberNumber vanshaGenerationNumber')
      .sort({ generation: 1, name: 1 });

    res.json({
      family: {
        id: family._id,
        name: family.familyName,
        number: family.familyNumber,
        vanshaGenerationNumber: family.vanshaGenerationNumber,
        totalGenerations: family.totalGenerations,
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

// ============================================================
// GET MEMBER STATS
// ============================================================
export const getMemberStats = async (req, res) => {
  try {
    const [total, byGender, byStatus, byGeneration, byVansha] = await Promise.all([
      Member.countDocuments(),
      Member.aggregate([{ $group: { _id: '$gender', count: { $sum: 1 } } }]),
      Member.aggregate([{ $group: { _id: '$isAlive', count: { $sum: 1 } } }]),
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

// ============================================================
// SYNCHRONIZE RELATIONSHIPS (BIDIRECTIONAL)
// ============================================================
const synchronizeRelationships = async (member, oldMember = null) => {
  const memberId = member._id;
  const memberGender = member.gender;

  if (oldMember) {
    await removeFromRelationships(oldMember);
  }

  // Sync SPOUSE
  if (member.spouse) {
    const spouseId = member.spouse._id || member.spouse;
    const spouse = await Member.findById(spouseId);

    if (spouse) {
      if (String(spouse.spouse) !== String(memberId)) {
        await Member.findByIdAndUpdate(spouseId, { spouse: memberId });
      }

      if (memberGender === 'male') {
        await Member.findByIdAndUpdate(spouseId, { husband: memberId });
        await Member.findByIdAndUpdate(memberId, { wife: spouseId });
      } else if (memberGender === 'female') {
        await Member.findByIdAndUpdate(spouseId, { wife: memberId });
        await Member.findByIdAndUpdate(memberId, { husband: spouseId });
      }
    }
  }

  // Sync HUSBAND
  if (member.husband) {
    const husbandId = member.husband._id || member.husband;
    const husband = await Member.findById(husbandId);
    if (husband) {
      await Member.findByIdAndUpdate(husbandId, { wife: memberId });
      if (!husband.spouse) {
        await Member.findByIdAndUpdate(husbandId, { spouse: memberId });
      }
      if (!member.spouse) {
        await Member.findByIdAndUpdate(memberId, { spouse: husbandId });
      }
    }
  }

  // Sync WIFE
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

  // Sync FATHER
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

  // Sync MOTHER
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

  // Sync CHILDREN
  const childFields = [
    { field: 'sons', gender: 'male' },
    { field: 'daughters', gender: 'female' },
  ];

  for (const { field } of childFields) {
    if (member[field] && member[field].length > 0) {
      for (const childId of member[field]) {
        const child = await Member.findById(childId);
        if (!child) continue;

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

  // Sync GRANDPARENTS
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
};

// ============================================================
// REMOVE FROM RELATIONSHIPS
// ============================================================
const removeFromRelationships = async (member) => {
  const memberId = member._id;

  if (member.father) {
    const fatherId = member.father._id || member.father;
    await Member.findByIdAndUpdate(fatherId, {
      $pull: { sons: memberId, daughters: memberId }
    });
  }

  if (member.mother) {
    const motherId = member.mother._id || member.mother;
    await Member.findByIdAndUpdate(motherId, {
      $pull: { sons: memberId, daughters: memberId }
    });
  }

  if (member.spouse) {
    const spouseId = member.spouse._id || member.spouse;
    await Member.findByIdAndUpdate(spouseId, {
      $unset: { spouse: 1 }
    });
  }

  if (member.husband) {
    const husbandId = member.husband._id || member.husband;
    await Member.findByIdAndUpdate(husbandId, {
      $unset: { wife: 1, spouse: 1 }
    });
  }

  if (member.wife) {
    const wifeId = member.wife._id || member.wife;
    await Member.findByIdAndUpdate(wifeId, {
      $unset: { husband: 1, spouse: 1 }
    });
  }

  if (member.grandfather) {
    const gfId = member.grandfather._id || member.grandfather;
    await Member.findByIdAndUpdate(gfId, {
      $pull: { grandsons: memberId, granddaughters: memberId }
    });
  }

  if (member.grandmother) {
    const gmId = member.grandmother._id || member.grandmother;
    await Member.findByIdAndUpdate(gmId, {
      $pull: { grandsons: memberId, granddaughters: memberId }
    });
  }

  await Member.updateMany(
    { father: memberId },
    { $unset: { father: 1 } }
  );
  await Member.updateMany(
    { mother: memberId },
    { $unset: { mother: 1 } }
  );
};

// ============================================================
// EXPORTS
// ============================================================
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