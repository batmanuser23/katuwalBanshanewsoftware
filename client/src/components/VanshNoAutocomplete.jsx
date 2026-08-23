// src/components/VanshNoAutocomplete.jsx - NEW COMPONENT

import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaChevronDown, FaPlus, FaTimes } from 'react-icons/fa';
import { getMembers } from '../api/members';

const VanshNoAutocomplete = ({
  label,
  name,
  value,
  onChange,
  required = false,
  className = '',
  error,
  placeholder = 'खोज्नुहोस् वा नयाँ वंश नं. प्रविष्ट गर्नुहोस्',
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [existingVanshNos, setExistingVanshNos] = useState([]);
  const [filteredOptions, setFilteredOptions] = useState([]);
  const [loading, setLoading] = useState(false);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Fetch all existing Vansh Nos from database
  const fetchVanshNos = async () => {
    try {
      setLoading(true);
      const response = await getMembers({ limit: 10000 });
      const members = response.data || [];
      const vanshSet = new Set();
      
      members.forEach(member => {
        if (member.vanshaGenerationNumber && member.vanshaGenerationNumber.trim()) {
          vanshSet.add(member.vanshaGenerationNumber.trim());
        }
      });
      
      const sorted = Array.from(vanshSet).sort((a, b) => {
        const numA = parseInt(a, 10);
        const numB = parseInt(b, 10);
        if (!isNaN(numA) && !isNaN(numB)) return numA - numB;
        return a.localeCompare(b);
      });
      
      setExistingVanshNos(sorted);
    } catch (error) {
      console.error('Failed to fetch Vansh Nos:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVanshNos();
  }, []);

  useEffect(() => {
    if (searchTerm.trim()) {
      const filtered = existingVanshNos.filter(v => 
        v.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredOptions(filtered);
    } else {
      setFilteredOptions(existingVanshNos.slice(0, 20));
    }
  }, [searchTerm, existingVanshNos]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (selectedValue) => {
    setIsOpen(false);
    setSearchTerm(selectedValue);
    if (onChange) {
      onChange(name, selectedValue);
    }
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setSearchTerm(val);
    
    if (!val.trim()) {
      if (onChange) {
        onChange(name, '');
      }
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter') {
      const trimmed = searchTerm.trim();
      if (trimmed) {
        if (onChange) {
          onChange(name, trimmed);
        }
        setIsOpen(false);
      }
    }
    if (e.key === 'Escape') {
      setIsOpen(false);
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIsOpen(true);
    }
  };

  const handleFocus = () => {
    setIsOpen(true);
    if (!searchTerm) {
      setSearchTerm(value || '');
    }
  };

  const clearValue = (e) => {
    e.stopPropagation();
    setSearchTerm('');
    if (onChange) {
      onChange(name, '');
    }
  };

  const displayValue = value || searchTerm || '';
  const valueExists = existingVanshNos.includes(displayValue);

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
          <FaSearch className="h-4 w-4" />
        </div>
        <input
          ref={inputRef}
          type="text"
          value={displayValue}
          onChange={handleInputChange}
          onFocus={handleFocus}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className={`
            w-full px-3 py-2.5 rounded-lg border-2 transition-all duration-200
            pl-9 pr-10
            ${isOpen ? 'border-green-500 shadow-md ring-2 ring-green-200' : 'border-gray-200 hover:border-gray-300'}
            ${error ? 'border-red-500 ring-2 ring-red-200' : ''}
            focus:outline-none
          `}
        />
        <div className="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center gap-1">
          {displayValue && (
            <button
              onClick={clearValue}
              className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
              type="button"
            >
              <FaTimes className="h-3 w-3 text-gray-400 hover:text-gray-600" />
            </button>
          )}
          <FaChevronDown className={`h-3 w-3 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
        </div>
      </div>

      {/* Dropdown */}
      {isOpen && (
        <div className="absolute z-50 w-full mt-1 bg-white rounded-lg border border-gray-200 shadow-lg max-h-60 overflow-hidden">
          <div className="p-2 border-b border-gray-100 bg-gray-50">
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-500">
                {loading ? 'Loading...' : `${existingVanshNos.length} अवस्थित वंश नं.`}
              </span>
              {displayValue && !valueExists && (
                <button
                  onClick={() => {
                    const trimmed = displayValue.trim();
                    if (trimmed) {
                      if (onChange) {
                        onChange(name, trimmed);
                      }
                      setIsOpen(false);
                    }
                  }}
                  className="text-xs text-green-600 hover:text-green-700 font-medium flex items-center gap-1"
                >
                  <FaPlus className="h-2.5 w-2.5" />
                  प्रयोग गर्नुहोस् "{displayValue}"
                </button>
              )}
            </div>
          </div>

          <div className="overflow-y-auto max-h-48">
            {loading ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                Loading...
              </div>
            ) : filteredOptions.length > 0 ? (
              filteredOptions.map((vansh) => (
                <div
                  key={vansh}
                  className={`
                    px-3 py-2 text-sm cursor-pointer hover:bg-green-50 transition-colors flex items-center justify-between
                    ${displayValue === vansh ? 'bg-green-100 text-green-700 font-medium' : 'text-gray-700'}
                  `}
                  onClick={() => handleSelect(vansh)}
                >
                  <span>{vansh}</span>
                  {displayValue === vansh && (
                    <span className="text-xs text-green-600">✓ चयन गरियो</span>
                  )}
                </div>
              ))
            ) : searchTerm.trim() ? (
              <div className="px-3 py-3 text-center">
                <p className="text-sm text-gray-500">कुनै अवस्थित वंश नं. फेला परेन।</p>
                <button
                  onClick={() => {
                    const trimmed = searchTerm.trim();
                    if (trimmed) {
                      if (onChange) {
                        onChange(name, trimmed);
                      }
                      setIsOpen(false);
                    }
                  }}
                  className="mt-1 text-sm text-green-600 hover:text-green-700 font-medium flex items-center justify-center gap-1"
                >
                  <FaPlus className="h-3 w-3" />
                  नयाँ वंश नं. प्रयोग गर्नुहोस् "{searchTerm.trim()}"
                </button>
              </div>
            ) : (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                खोज्नुहोस् वा नयाँ वंश नं. प्रविष्ट गर्नुहोस्
              </div>
            )}
          </div>

          {displayValue && valueExists && (
            <div className="p-2 border-t border-gray-100 bg-gray-50">
              <span className="text-xs text-green-600">
                ✓ "{displayValue}" डाटाबेसमा अवस्थित छ
              </span>
            </div>
          )}
        </div>
      )}

      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
      
      {displayValue && !valueExists && displayValue.trim() && (
        <p className="mt-0.5 text-xs text-amber-500">
          ⚠️ "{displayValue}" अहिलेसम्म अवस्थित छैन। नयाँ वंश नं. को रूपमा थपिनेछ।
        </p>
      )}
    </div>
  );
};

export default VanshNoAutocomplete;