// src/components/SpouseSelector.jsx - NEW
// Reusable spouse selector with search, existing member detection

import React, { useState, useMemo, useRef, useEffect } from 'react';
import { FaSearch, FaHeart, FaTimes, FaUserPlus, FaUser } from 'react-icons/fa';

const SpouseSelector = ({
  label = 'श्रीमान/श्रीमती',
  name = 'spouse',
  value,
  onChange,
  members = [],
  currentMemberId = null,
  currentGender = null,
  placeholder = 'श्रीमान/श्रीमती खोज्नुहोस्...',
  className = '',
  error,
  required = false,
  allowManualEntry = true,
  manualEntryLabel = 'नयाँ नाम प्रविष्ट गर्नुहोस्',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [manualName, setManualName] = useState('');
  const [mode, setMode] = useState('search'); // 'search' or 'manual'
  const dropdownRef = useRef(null);

  // Filter members by opposite gender
  const filteredMembers = useMemo(() => {
    if (!members || members.length === 0) return [];
    
    return members.filter((m) => {
      if (!m || !m._id) return false;
      // Exclude current member
      if (currentMemberId && String(m._id) === String(currentMemberId)) return false;
      // Exclude if already married to someone else (unless it's this member)
      if (m.spouse && String(m.spouse) !== String(currentMemberId)) {
        // Allow if spouse field is the current member
        const spouseId = typeof m.spouse === 'object' ? m.spouse._id : m.spouse;
        if (String(spouseId) !== String(currentMemberId)) return false;
      }
      // Filter by opposite gender if gender is known
      if (currentGender === 'male') return m.gender === 'female';
      if (currentGender === 'female') return m.gender === 'male';
      return true;
    });
  }, [members, currentMemberId, currentGender]);

  const searchedMembers = useMemo(() => {
    if (!searchTerm.trim()) return filteredMembers.slice(0, 30);
    const term = searchTerm.toLowerCase();
    return filteredMembers.filter((m) =>
      m.name?.toLowerCase().includes(term) ||
      m.memberNumber?.toLowerCase().includes(term) ||
      m.surname?.toLowerCase().includes(term)
    ).slice(0, 30);
  }, [filteredMembers, searchTerm]);

  const selectedMember = useMemo(() => {
    if (!value) return null;
    return members.find((m) => String(m._id) === String(value)) || null;
  }, [value, members]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (member) => {
    onChange(name, member._id);
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleClear = () => {
    onChange(name, '');
    setSearchTerm('');
    setManualName('');
  };

  const handleManualSubmit = () => {
    if (manualName.trim()) {
      // Pass manual name via a separate field
      onChange('wifeName', manualName.trim());
      setManualName('');
      setIsOpen(false);
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>

      {/* Selected member display */}
      {selectedMember ? (
        <div className="flex items-center gap-2 p-2 bg-pink-50 border-2 border-pink-200 rounded-lg">
          <div className="w-8 h-8 rounded-full overflow-hidden bg-pink-100 flex-shrink-0">
            {selectedMember.photo ? (
              <img src={selectedMember.photo} alt={selectedMember.name} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center">
                <FaUser className="text-pink-400 text-xs" />
              </div>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-gray-800 truncate">
              {selectedMember.name} {selectedMember.surname || ''}
            </p>
            <p className="text-xs text-gray-500">
              {selectedMember.memberNumber || 'N/A'}
            </p>
          </div>
          <button
            type="button"
            onClick={handleClear}
            className="p-1 hover:bg-pink-100 rounded-full"
          >
            <FaTimes className="h-3 w-3 text-pink-500" />
          </button>
        </div>
      ) : (
        <div className="relative">
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
            <FaHeart className="h-4 w-4" />
          </div>
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setIsOpen(true);
            }}
            onFocus={() => setIsOpen(true)}
            placeholder={placeholder}
            className={`
              w-full px-3 py-2.5 rounded-lg border-2 transition-all duration-200
              pl-9 pr-10
              ${isOpen ? 'border-pink-400 shadow-md ring-2 ring-pink-200' : 'border-gray-200 hover:border-gray-300'}
              ${error ? 'border-red-500 ring-2 ring-red-200' : ''}
              focus:outline-none
            `}
          />
        </div>
      )}

      {/* Dropdown */}
      {isOpen && !selectedMember && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-72 overflow-hidden">
          {/* Mode toggle */}
          {allowManualEntry && (
            <div className="flex border-b border-gray-100">
              <button
                type="button"
                onClick={() => setMode('search')}
                className={`flex-1 px-3 py-2 text-xs font-medium ${
                  mode === 'search' ? 'text-pink-600 bg-pink-50' : 'text-gray-500'
                }`}
              >
                <FaSearch className="inline mr-1" /> खोज्नुहोस्
              </button>
              <button
                type="button"
                onClick={() => setMode('manual')}
                className={`flex-1 px-3 py-2 text-xs font-medium ${
                  mode === 'manual' ? 'text-pink-600 bg-pink-50' : 'text-gray-500'
                }`}
              >
                <FaUserPlus className="inline mr-1" /> {manualEntryLabel}
              </button>
            </div>
          )}

          {mode === 'search' ? (
            <div className="overflow-y-auto max-h-56">
              {searchedMembers.length > 0 ? (
                searchedMembers.map((m) => (
                  <div
                    key={m._id}
                    onClick={() => handleSelect(m)}
                    className="px-3 py-2 hover:bg-pink-50 cursor-pointer flex items-center gap-2 transition-colors"
                  >
                    <div className="w-8 h-8 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      {m.photo ? (
                        <img src={m.photo} alt={m.name} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <FaUser className="text-gray-400 text-xs" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-gray-800 truncate">
                        {m.name} {m.surname || ''}
                      </p>
                      <p className="text-xs text-gray-500">{m.memberNumber || 'N/A'}</p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="px-3 py-3 text-center text-sm text-gray-500">
                  कुनै सदस्य फेला परेन
                </div>
              )}
            </div>
          ) : (
            <div className="p-3">
              <input
                type="text"
                value={manualName}
                onChange={(e) => setManualName(e.target.value)}
                placeholder="नयाँ श्रीमान/श्रीमतीको नाम"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-pink-400"
                autoFocus
              />
              <button
                type="button"
                onClick={handleManualSubmit}
                disabled={!manualName.trim()}
                className="mt-2 w-full py-1.5 bg-pink-500 text-white text-sm rounded-lg hover:bg-pink-600 disabled:opacity-50"
              >
                नाम थप्नुहोस्
              </button>
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default SpouseSelector;