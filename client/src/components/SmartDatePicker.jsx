// src/components/SmartDatePicker.jsx - NEW
// Supports both English (AD) typing and Nepali (BS) typing with auto-conversion

import React, { useState, useEffect, useRef } from 'react';
import { FaCalendar, FaTimes, FaCheck } from 'react-icons/fa';
import {
  adToBs,
  bsToAd,
  parseDateString,
  formatAdAsBsNepali,
  NEPALI_MONTHS,
  getDaysInNepaliMonth,
} from '../utils/nepaliDateConverter';

const SmartDatePicker = ({
  label,
  name,
  value,
  onChange,
  required = false,
  error,
  className = '',
  placeholder = 'YYYY-MM-DD वा Nepali मिति',
}) => {
  const [inputValue, setInputValue] = useState('');
  const [mode, setMode] = useState('ad'); // 'ad' or 'bs'
  const [showCalendar, setShowCalendar] = useState(false);
  const [bsYear, setBsYear] = useState(() => adToBs(new Date())?.year || 2080);
  const [bsMonth, setBsMonth] = useState(() => adToBs(new Date())?.month || 1);
  const containerRef = useRef(null);

  // Sync input value with prop
  useEffect(() => {
    if (value) {
      if (typeof value === 'string') {
        setInputValue(value);
      } else if (value instanceof Date) {
        const bs = adToBs(value);
        if (bs) {
          setInputValue(bs.formatted);
          setBsYear(bs.year);
          setBsMonth(bs.month);
        }
      }
    } else {
      setInputValue('');
    }
  }, [value]);

  // Close calendar on outside click
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowCalendar(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (e) => {
    const val = e.target.value;
    setInputValue(val);

    // Try to parse and convert
    const parsed = parseDateString(val);
    if (parsed) {
      if (parsed.type === 'AD') {
        const adDate = new Date(parsed.year, parsed.month - 1, parsed.day);
        const bs = adToBs(adDate);
        if (bs) {
          onChange(name, bs.formatted);
        }
      } else if (parsed.type === 'BS') {
        onChange(name, `${parsed.year}-${String(parsed.month).padStart(2, '0')}-${String(parsed.day).padStart(2, '0')}`);
      }
    } else if (!val.trim()) {
      onChange(name, '');
    }
  };

  const handleAdDateSelect = (adDateStr) => {
    const adDate = new Date(adDateStr);
    const bs = adToBs(adDate);
    if (bs) {
      setInputValue(bs.formatted);
      setBsYear(bs.year);
      setBsMonth(bs.month);
      onChange(name, bs.formatted);
    }
    setShowCalendar(false);
  };

  const handleBsDateSelect = (year, month, day) => {
    const formatted = `${year}-${String(month).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    setInputValue(formatted);
    onChange(name, formatted);
    setShowCalendar(false);
  };

  const renderBsCalendar = () => {
    const daysInMonth = getDaysInNepaliMonth(bsYear, bsMonth);
    const days = [];
    for (let d = 1; d <= daysInMonth; d++) {
      days.push(d);
    }

    return (
      <div className="p-3">
        {/* Year/Month selector */}
        <div className="flex items-center justify-between mb-3">
          <button
            type="button"
            onClick={() => {
              if (bsMonth === 1) {
                setBsMonth(12);
                setBsYear(bsYear - 1);
              } else {
                setBsMonth(bsMonth - 1);
              }
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            ◀
          </button>
          <div className="flex items-center gap-2">
            <select
              value={bsYear}
              onChange={(e) => setBsYear(parseInt(e.target.value, 10))}
              className="text-sm border rounded px-1 py-0.5"
            >
              {Array.from({ length: 91 }, (_, i) => 2000 + i).map((y) => (
                <option key={y} value={y}>{y}</option>
              ))}
            </select>
            <select
              value={bsMonth}
              onChange={(e) => setBsMonth(parseInt(e.target.value, 10))}
              className="text-sm border rounded px-1 py-0.5"
            >
              {NEPALI_MONTHS.map((m, i) => (
                <option key={i} value={i + 1}>{m}</option>
              ))}
            </select>
          </div>
          <button
            type="button"
            onClick={() => {
              if (bsMonth === 12) {
                setBsMonth(1);
                setBsYear(bsYear + 1);
              } else {
                setBsMonth(bsMonth + 1);
              }
            }}
            className="p-1 hover:bg-gray-100 rounded"
          >
            ▶
          </button>
        </div>

        {/* Days grid */}
        <div className="grid grid-cols-7 gap-1">
          {days.map((d) => (
            <button
              key={d}
              type="button"
              onClick={() => handleBsDateSelect(bsYear, bsMonth, d)}
              className="p-1.5 text-xs hover:bg-green-100 rounded transition-colors"
            >
              {d}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const renderAdCalendar = () => {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();

    const days = [];
    for (let i = 0; i < firstDay; i++) days.push(null);
    for (let d = 1; d <= daysInMonth; d++) days.push(d);

    return (
      <div className="p-3">
        <div className="text-center text-sm font-medium mb-2">
          {today.toLocaleString('default', { month: 'long' })} {year}
        </div>
        <div className="grid grid-cols-7 gap-1">
          {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => (
            <div key={i} className="text-center text-xs text-gray-400">{d}</div>
          ))}
          {days.map((d, i) => (
            <button
              key={i}
              type="button"
              disabled={!d}
              onClick={() => d && handleAdDateSelect(`${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`)}
              className={`p-1.5 text-xs rounded transition-colors ${
                d ? 'hover:bg-green-100' : ''
              }`}
            >
              {d || ''}
            </button>
          ))}
        </div>
      </div>
    );
  };

  const displayNepali = value ? formatAdAsBsNepali(value) : '';

  return (
    <div className={`relative ${className}`} ref={containerRef}>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
          <FaCalendar className="h-4 w-4" />
        </div>
        <input
          type="text"
          value={inputValue}
          onChange={handleInputChange}
          onFocus={() => setShowCalendar(true)}
          placeholder={placeholder}
          className={`
            w-full px-3 py-2.5 rounded-lg border-2 transition-all duration-200
            pl-9 pr-10
            ${showCalendar ? 'border-green-500 shadow-md ring-2 ring-green-200' : 'border-gray-200 hover:border-gray-300'}
            ${error ? 'border-red-500 ring-2 ring-red-200' : ''}
            focus:outline-none
          `}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {inputValue && (
            <button
              type="button"
              onClick={() => {
                setInputValue('');
                onChange(name, '');
              }}
              className="p-0.5 hover:bg-gray-100 rounded-full"
            >
              <FaTimes className="h-3 w-3 text-gray-400" />
            </button>
          )}
        </div>
      </div>

      {/* Nepali preview */}
      {displayNepali && (
        <p className="mt-0.5 text-xs text-green-600">
          नेपाली: {displayNepali}
        </p>
      )}

      {/* Mode toggle */}
      <div className="flex gap-1 mt-1">
        <button
          type="button"
          onClick={() => setMode('ad')}
          className={`text-[10px] px-2 py-0.5 rounded ${
            mode === 'ad' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          English (AD)
        </button>
        <button
          type="button"
          onClick={() => setMode('bs')}
          className={`text-[10px] px-2 py-0.5 rounded ${
            mode === 'bs' ? 'bg-green-500 text-white' : 'bg-gray-100 text-gray-600'
          }`}
        >
          नेपाली (BS)
        </button>
      </div>

      {/* Calendar popup */}
      {showCalendar && (
        <div className="absolute z-50 w-64 mt-1 bg-white rounded-lg border border-gray-200 shadow-lg">
          {mode === 'bs' ? renderBsCalendar() : renderAdCalendar()}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default SmartDatePicker;