// src/components/RelationshipSelector.jsx
import React, { useState, useEffect, useRef } from 'react';
import { FaSearch, FaUser, FaUsers, FaHeart, FaChild, FaUserFriends } from 'react-icons/fa';

const RelationshipSelector = ({
  label,
  name,
  value,
  onChange,
  members = [],
  relationshipType = 'all', // 'all', 'father', 'mother', 'spouse', 'children', 'guardian'
  required = false,
  placeholder = 'Search member...',
  className = '',
  error,
  disabled = false,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter members based on relationship type
  const getFilteredMembers = () => {
    let filtered = members;
    
    if (relationshipType === 'father') {
      filtered = members.filter(m => m.gender === 'male');
    } else if (relationshipType === 'mother') {
      filtered = members.filter(m => m.gender === 'female');
    } else if (relationshipType === 'spouse') {
      filtered = members.filter(m => m.gender !== 'other');
    } else if (relationshipType === 'children') {
      filtered = members.filter(m => m.generation && m.generation > 0);
    }

    if (searchTerm) {
      const search = searchTerm.toLowerCase();
      filtered = filtered.filter(m => 
        m.name?.toLowerCase().includes(search) ||
        m.memberNumber?.toLowerCase().includes(search) ||
        m.rollNumber?.toLowerCase().includes(search) ||
        m.surname?.toLowerCase().includes(search)
      );
    }

    return filtered;
  };

  const filteredMembers = getFilteredMembers();
  const selectedMember = members.find(m => m._id === value);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSelect = (member) => {
    onChange(name, member._id);
    setIsOpen(false);
    setSearchTerm('');
  };

  const clearSelection = (e) => {
    e.stopPropagation();
    onChange(name, '');
    setSearchTerm('');
  };

  const getRelationshipIcon = () => {
    switch (relationshipType) {
      case 'father':
      case 'mother':
        return <FaUserFriends className="h-4 w-4" />;
      case 'spouse':
        return <FaHeart className="h-4 w-4" />;
      case 'children':
        return <FaChild className="h-4 w-4" />;
      default:
        return <FaUsers className="h-4 w-4" />;
    }
  };

  return (
    <div className={`relative ${className}`} ref={dropdownRef}>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative">
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
          {getRelationshipIcon()}
        </div>
        <div
          className={`
            w-full px-3 py-2.5 rounded-lg border-2 transition-all duration-200 cursor-pointer
            pl-9
            ${isOpen ? 'border-green-500 shadow-md ring-2 ring-green-200' : 'border-gray-200 hover:border-gray-300'}
            ${error ? 'border-red-500 ring-2 ring-red-200' : ''}
            ${disabled ? 'bg-gray-50 cursor-not-allowed' : 'bg-white'}
          `}
          onClick={() => !disabled && setIsOpen(!isOpen)}
          ref={inputRef}
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 flex-1 min-w-0">
              {selectedMember && (
                <img
                  src={selectedMember.photo || '/default-avatar.png'}
                  alt={selectedMember.name}
                  className="w-6 h-6 rounded-full object-cover border border-gray-200 flex-shrink-0"
                  onError={(e) => { e.target.src = '/default-avatar.png'; }}
                />
              )}
              <span className={`truncate ${selectedMember ? 'text-gray-800' : 'text-gray-400'}`}>
                {selectedMember ? selectedMember.name : placeholder}
              </span>
              {selectedMember && selectedMember.memberNumber && (
                <span className="text-xs text-gray-400 flex-shrink-0">
                  #{selectedMember.memberNumber}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1 flex-shrink-0">
              {selectedMember && !disabled && (
                <button
                  onClick={clearSelection}
                  className="p-0.5 hover:bg-gray-100 rounded-full transition-colors"
                  type="button"
                >
                  <svg className="h-3.5 w-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              )}
              <svg className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </div>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-50 w-full mt-1 bg-white rounded-xl border border-gray-200 shadow-xl max-h-72 overflow-hidden">
            {/* Search input */}
            <div className="p-2 border-b border-gray-100">
              <div className="relative">
                <FaSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-3.5 w-3.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search members..."
                  className="w-full pl-9 pr-3 py-1.5 text-sm border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-200 focus:border-green-500"
                  onClick={(e) => e.stopPropagation()}
                  autoFocus
                />
              </div>
            </div>

            {/* Options */}
            <div className="overflow-y-auto max-h-48">
              {filteredMembers.length > 0 ? (
                filteredMembers.map((member) => (
                  <div
                    key={member._id}
                    className={`
                      flex items-center gap-3 px-3 py-2 cursor-pointer hover:bg-green-50 transition-colors
                      ${value === member._id ? 'bg-green-100' : ''}
                    `}
                    onClick={() => handleSelect(member)}
                  >
                    <img
                      src={member.photo || '/default-avatar.png'}
                      alt={member.name}
                      className="w-8 h-8 rounded-full object-cover border border-gray-200 flex-shrink-0"
                      onError={(e) => { e.target.src = '/default-avatar.png'; }}
                    />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-800 truncate">
                        {member.name}
                        {member.surname && ` ${member.surname}`}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        {member.memberNumber && <span>#{member.memberNumber}</span>}
                        {member.rollNumber && <span>• Roll {member.rollNumber}</span>}
                        {member.generation && <span>• Gen {member.generation}</span>}
                      </div>
                    </div>
                    {value === member._id && (
                      <span className="text-green-600 text-sm font-medium">✓</span>
                    )}
                  </div>
                ))
              ) : (
                <div className="px-3 py-4 text-center text-sm text-gray-500">
                  {searchTerm ? 'No members found' : 'No members available'}
                </div>
              )}
            </div>
          </div>
        )}
      </div>
      {error && <p className="mt-1 text-xs text-red-500">{error}</p>}
    </div>
  );
};

export default RelationshipSelector;