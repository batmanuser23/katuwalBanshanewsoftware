// src/components/NepaliDatePickerComponent.jsx - COMPLETE UPDATED
// Features:
// - Manual typing support (both AD and BS dates)
// - Automatic English (AD) → Nepali (BS) conversion
// - Calendar picker
// - Validation
// - Mobile-friendly
// - Not clipped by parent containers

import React, { useState, useEffect, useRef, useMemo } from 'react';
import { FaCalendarAlt, FaChevronLeft, FaChevronRight, FaTimes, FaGlobe } from 'react-icons/fa';
import {
  NEPALI_MONTHS,
  NEPALI_MONTHS_EN,
  getDaysInNepaliMonth,
  adToBs,
  bsToAd,
  parseDateString,
} from '../utils/nepaliDateConverter';

const NepaliDatePickerComponent = ({
  label,
  name,
  value,
  onChange,
  required = false,
  error,
  placeholder = 'मिति छान्नुहोस् वा टाइप गर्नुहोस्',
  className = '',
  disabled = false,
  showAdInput = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputMode, setInputMode] = useState('BS'); // 'BS' or 'AD'
  const [viewYear, setViewYear] = useState(2081);
  const [viewMonth, setViewMonth] = useState(1);
  const [parseError, setParseError] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // ============================================================
  // Parse initial value into BS date
  // ============================================================
  const bsValue = useMemo(() => {
    if (!value) return null;

    // Try to parse as BS string first (YYYY-MM-DD with year 2000-2090)
    if (typeof value === 'string') {
      const parsed = parseDateString(value);
      if (parsed) {
        if (parsed.type === 'BS') {
          return { year: parsed.year, month: parsed.month, day: parsed.day };
        }
        // AD date - convert to BS
        const adDate = new Date(parsed.year, parsed.month - 1, parsed.day);
        return adToBs(adDate);
      }
    }

    // If Date object - convert to BS
    if (value instanceof Date) {
      return adToBs(value);
    }

    return null;
  }, [value]);

  // ============================================================
  // Sync view year/month with value
  // ============================================================
  useEffect(() => {
    if (bsValue) {
      setViewYear(bsValue.year);
      setViewMonth(bsValue.month);
      setInputValue(bsValue.formatted);
    }
  }, [bsValue]);

  // ============================================================
  // Close on outside click
  // ============================================================
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // ============================================================
  // Build calendar grid
  // ============================================================
  const calendarDays = useMemo(() => {
    const daysInMonth = getDaysInNepaliMonth(viewYear, viewMonth);
    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }
    return days;
  }, [viewYear, viewMonth]);

  // ============================================================
  // Navigation
  // ============================================================
  const goToPrevMonth = () => {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear(viewYear - 1);
    } else {
      setViewMonth(viewMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear(viewYear + 1);
    } else {
      setViewMonth(viewMonth + 1);
    }
  };

  // ============================================================
  // Handle date selection from calendar
  // ============================================================
  const handleDateSelect = (day) => {
    const bsDate = { year: viewYear, month: viewMonth, day };
    const formatted = `${viewYear}-${String(viewMonth).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    
    setInputValue(formatted);
    setParseError('');
    setIsOpen(false);

    if (onChange) {
      onChange(name, formatted);
    }
  };

  // ============================================================
  // Handle manual input change
  // ============================================================
  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);
    setParseError('');

    // Try to parse as user types
    if (!val.trim()) {
      if (onChange) onChange(name, '');
      return;
    }

    // Only validate on complete dates
    const parsed = parseDateString(val);
    if (parsed) {
      // If BS date
      if (parsed.type === 'BS') {
        // Validate BS date
        const maxDay = getDaysInNepaliMonth(parsed.year, parsed.month);
        if (parsed.day > maxDay) {
          setParseError(`यो महिनामा ${maxDay} दिन मात्र छ`);
          return;
        }
        if (onChange) onChange(name, parsed.year + '-' + String(parsed.month).padStart(2, '0') + '-' + String(parsed.day).padStart(2, '0'));
        setViewYear(parsed.year);
        setViewMonth(parsed.month);
      } else {
        // AD date - convert to BS
        const adDate = new Date(parsed.year, parsed.month - 1, parsed.day);
        if (!isNaN(adDate.getTime())) {
          const bsDate = adToBs(adDate);
          if (bsDate) {
            setViewYear(bsDate.year);
            setViewMonth(bsDate.month);
            if (onChange) onChange(name, bsDate.formatted);
          }
        }
      }
    }
  };

  // ============================================================
  // Handle blur - validate final value
  // ============================================================
  const handleBlur = () => {
    if (!inputValue.trim()) return;

    const parsed = parseDateString(inputValue);
    if (!parsed) {
      setParseError('अवैध मिति ढाँचा। YYYY-MM-DD प्रयोग गर्नुहोस्');
      return;
    }

    if (parsed.type === 'BS') {
      const maxDay = getDaysInNepaliMonth(parsed.year, parsed.month);
      if (parsed.day > maxDay) {
        setParseError(`यो महिनामा ${maxDay} दिन मात्र छ`);
        return;
      }
      setParseError('');
      if (onChange) onChange(name, parsed.year + '-' + String(parsed.month).padStart(2, '0') + '-' + String(parsed.day).padStart(2, '0'));
    } else {
      const adDate = new Date(parsed.year, parsed.month - 1, parsed.day);
      if (isNaN(adDate.getTime())) {
        setParseError('अवैध अंग्रेजी मिति');
        return;
      }
      const bsDate = adToBs(adDate);
      if (bsDate) {
        setParseError('');
        if (onChange) onChange(name, bsDate.formatted);
      }
    }
  };

  // ============================================================
  // Handle key down
  // ============================================================
  const handleKeyDown = (e) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
    if (e.key === 'Enter') {
      e.preventDefault();
      handleBlur();
      setIsOpen(false);
    }
  };

  // ============================================================
  // Clear value
  // ============================================================
  const clearValue = (e) => {
    e.stopPropagation();
    setInputValue('');
    setParseError('');
    if (onChange) onChange(name, '');
  };

  // ============================================================
  // Toggle input mode (BS/AD)
  // ============================================================
  const toggleInputMode = () => {
    setInputMode(prev => prev === 'BS' ? 'AD' : 'BS');
    setInputValue('');
    setParseError('');
  };

  // ============================================================
  // Get display placeholder based on mode
  // ============================================================
  const getPlaceholder = () => {
    if (inputMode === 'AD') {
      return 'YYYY-MM-DD (English)';
    }
    return placeholder;
  };

  // ============================================================
  // RENDER
  // ============================================================
  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      {label && (
        <label className="block text-xs font-medium text-gray-700 mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        {/* Calendar icon */}
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
          <FaCalendarAlt className="h-4 w-4" />
        </div>

        {/* Input */}
        <input
          ref={inputRef}
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          onFocus={() => setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={getPlaceholder()}
          disabled={disabled}
          className={`
            w-full px-3 py-2.5 rounded-lg border-2 transition-all duration-200
            pl-9 pr-20
            ${isOpen ? 'border-green-500 shadow-md ring-2 ring-green-200' : 'border-gray-200 hover:border-gray-300'}
            ${error || parseError ? 'border-red-500 ring-2 ring-red-200' : ''}
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : ''}
            focus:outline-none
          `}
        />

        {/* Right side buttons */}
        <div className="absolute right-2 top-1/2 transform -translate-y-1/2 flex items-center gap-0.5">
          {/* AD/BS toggle */}
          {showAdInput && (
            <button
              type="button"
              onClick={toggleInputMode}
              className={`
                px-1.5 py-0.5 text-[9px] font-bold rounded transition-colors
                ${inputMode === 'AD' 
                  ? 'bg-blue-100 text-blue-700' 
                  : 'bg-green-100 text-green-700'}
                hover:opacity-80
              `}
              title={inputMode === 'AD' ? 'Switch to Nepali date' : 'Switch to English date'}
            >
              {inputMode}
            </button>
          )}

          {/* Clear */}
          {inputValue && (
            <button
              type="button"
              onClick={clearValue}
              className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
            >
              <FaTimes className="h-3 w-3 text-gray-400 hover:text-gray-600" />
            </button>
          )}
        </div>
      </div>

      {/* Error messages */}
      {(error || parseError) && (
        <p className="mt-1 text-xs text-red-500">{error || parseError}</p>
      )}

      {/* Help text */}
      {!error && !parseError && (
        <p className="mt-0.5 text-[10px] text-gray-400">
          {inputMode === 'AD' 
            ? 'अंग्रेजी मिति टाइप गर्नुहोस् (स्वत: नेपालीमा रूपान्तरण हुनेछ)'
            : 'नेपाली मिति टाइप गर्नुहोस् वा क्यालेन्डरबाट छान्नुहोस्'}
        </p>
      )}

      {/* Calendar Dropdown */}
      {isOpen && !disabled && (
        <div className="absolute z-50 mt-1 bg-white rounded-lg border border-gray-200 shadow-xl overflow-hidden"
             style={{ minWidth: '280px', maxWidth: '320px' }}>
          
          {/* Header */}
          <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-2 border-b border-green-100">
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={goToPrevMonth}
                className="p-1.5 hover:bg-white/80 rounded-lg transition-colors"
              >
                <FaChevronLeft className="h-3 w-3 text-green-600" />
              </button>
              
              <div className="text-center">
                <div className="text-sm font-semibold text-green-800">
                  {NEPALI_MONTHS[viewMonth - 1]} {viewYear}
                </div>
                <div className="text-[10px] text-gray-500">
                  {NEPALI_MONTHS_EN[viewMonth - 1]}
                </div>
              </div>
              
              <button
                type="button"
                onClick={goToNextMonth}
                className="p-1.5 hover:bg-white/80 rounded-lg transition-colors"
              >
                <FaChevronRight className="h-3 w-3 text-green-600" />
              </button>
            </div>
          </div>

          {/* Day of week headers */}
          <div className="grid grid-cols-7 gap-0.5 p-1.5 border-b border-gray-100">
            {['आ', 'सो', 'मं', 'बु', 'बि', 'शु', 'श'].map((day, i) => (
              <div
                key={i}
                className={`text-center text-[10px] font-medium py-1 ${
                  i === 6 ? 'text-red-500' : 'text-gray-500'
                }`}
              >
                {day}
              </div>
            ))}
          </div>

          {/* Calendar days */}
          <div className="grid grid-cols-7 gap-0.5 p-1.5 max-h-56 overflow-y-auto">
            {calendarDays.map((day) => {
              const isSelected =
                bsValue &&
                bsValue.year === viewYear &&
                bsValue.month === viewMonth &&
                bsValue.day === day;

              return (
                <button
                  key={day}
                  type="button"
                  onClick={() => handleDateSelect(day)}
                  className={`
                    aspect-square text-xs rounded-lg transition-all
                    ${isSelected
                      ? 'bg-green-500 text-white font-semibold shadow-md'
                      : 'hover:bg-green-50 text-gray-700'}
                  `}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Footer */}
          <div className="p-1.5 border-t border-gray-100 bg-gray-50 flex justify-between items-center">
            <button
              type="button"
              onClick={() => {
                const today = new Date();
                const todayBs = adToBs(today);
                if (todayBs) {
                  setViewYear(todayBs.year);
                  setViewMonth(todayBs.month);
                  handleDateSelect(todayBs.day);
                }
              }}
              className="text-xs text-green-600 hover:text-green-700 font-medium"
            >
              आज
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              className="text-xs text-gray-500 hover:text-gray-700"
            >
              बन्द गर्नुहोस्
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default NepaliDatePickerComponent;