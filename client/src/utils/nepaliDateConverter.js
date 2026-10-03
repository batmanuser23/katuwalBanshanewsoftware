// src/utils/nepaliDateConverter.js - NEW
// English (Gregorian) ↔ Nepali (Bikram Sambat) date conversion
// Uses the standard Nepali calendar data

// Nepali month names
export const NEPALI_MONTHS = [
  'बैशाख', 'जेठ', 'असार', 'साउन', 'भदौ', 'असोज',
  'कात्तिक', 'मंसिर', 'पुष', 'माघ', 'फाल्गुन', 'चैत'
];

export const NEPALI_MONTHS_EN = [
  'Baisakh', 'Jestha', 'Ashadh', 'Shrawan', 'Bhadra', 'Ashwin',
  'Kartik', 'Mangsir', 'Poush', 'Magh', 'Falgun', 'Chaitra'
];

// Days in each Nepali month for years 2000-2090 BS
// Format: [year, [days in each month]]
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

// Reference date: 2000/01/01 BS = 1943/04/14 AD
const BS_START_YEAR = 2000;
const AD_START_DATE = new Date(1943, 3, 14); // April 14, 1943

// Get days in a Nepali month
export const getDaysInNepaliMonth = (year, month) => {
  const yearData = NEPALI_CALENDAR_DATA[year];
  if (!yearData) return 30;
  return yearData[month - 1] || 30;
};

// Convert AD date to BS date
export const adToBs = (adDate) => {
  if (!adDate) return null;
  
  const date = adDate instanceof Date ? adDate : new Date(adDate);
  if (isNaN(date.getTime())) return null;

  let totalDays = Math.floor((date - AD_START_DATE) / (1000 * 60 * 60 * 24));
  if (totalDays < 0) return null;

  let bsYear = BS_START_YEAR;
  let bsMonth = 1;
  let bsDay = 1;

  while (totalDays > 0) {
    const daysInMonth = getDaysInNepaliMonth(bsYear, bsMonth);
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

// Convert BS date to AD date
export const bsToAd = (bsYear, bsMonth, bsDay) => {
  if (!bsYear || !bsMonth || !bsDay) return null;

  let totalDays = 0;
  for (let y = BS_START_YEAR; y < bsYear; y++) {
    const yearData = NEPALI_CALENDAR_DATA[y];
    if (yearData) {
      totalDays += yearData.reduce((a, b) => a + b, 0);
    }
  }

  for (let m = 1; m < bsMonth; m++) {
    totalDays += getDaysInNepaliMonth(bsYear, m);
  }

  totalDays += bsDay - 1;

  const adDate = new Date(AD_START_DATE);
  adDate.setDate(adDate.getDate() + totalDays);

  return adDate;
};

// Parse a date string (supports both AD and BS formats)
export const parseDateString = (dateStr) => {
  if (!dateStr || typeof dateStr !== 'string') return null;
  
  const trimmed = dateStr.trim();
  if (!trimmed) return null;

  // Try YYYY-MM-DD or YYYY/MM/DD
  const match = trimmed.match(/^(\d{4})[-/](\d{1,2})[-/](\d{1,2})$/);
  if (!match) return null;

  const [, yearStr, monthStr, dayStr] = match;
  const year = parseInt(yearStr, 10);
  const month = parseInt(monthStr, 10);
  const day = parseInt(dayStr, 10);

  if (isNaN(year) || isNaN(month) || isNaN(day)) return null;
  if (month < 1 || month > 12) return null;
  if (day < 1 || day > 31) return null;

  // If year >= 2000 and <= 2090, treat as BS
  if (year >= 2000 && year <= 2090) {
    return { type: 'BS', year, month, day };
  }

  // If year >= 1943 and <= 2040, treat as AD
  if (year >= 1943 && year <= 2040) {
    return { type: 'AD', year, month, day };
  }

  return null;
};

// Convert any date input to AD Date object
export const toAdDate = (input) => {
  if (!input) return null;

  // If already a Date
  if (input instanceof Date) {
    return isNaN(input.getTime()) ? null : input;
  }

  // If object with year/month/day
  if (typeof input === 'object' && input.year && input.month && input.day) {
    if (input.type === 'BS') {
      return bsToAd(input.year, input.month, input.day);
    }
    return new Date(input.year, input.month - 1, input.day);
  }

  // If string
  if (typeof input === 'string') {
    const parsed = parseDateString(input);
    if (!parsed) return null;
    
    if (parsed.type === 'BS') {
      return bsToAd(parsed.year, parsed.month, parsed.day);
    }
    return new Date(parsed.year, parsed.month - 1, parsed.day);
  }

  return null;
};

// Format AD date as BS string
export const formatAdAsBs = (adDate) => {
  const bs = adToBs(adDate);
  return bs ? bs.formatted : '';
};

// Format AD date as Nepali BS string
export const formatAdAsBsNepali = (adDate) => {
  const bs = adToBs(adDate);
  return bs ? bs.formattedNepali : '';
};

// Validate if a date string is a valid date
export const isValidDateString = (dateStr) => {
  return parseDateString(dateStr) !== null;
};

export default {
  NEPALI_MONTHS,
  NEPALI_MONTHS_EN,
  getDaysInNepaliMonth,
  adToBs,
  bsToAd,
  parseDateString,
  toAdDate,
  formatAdAsBs,
  formatAdAsBsNepali,
  isValidDateString,
};