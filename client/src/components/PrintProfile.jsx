// src/components/PrintProfile.jsx - NEW COMPONENT

import React from 'react';
import { formatDate } from '../utils/formatters';

const PrintProfile = ({ member, onClose }) => {
  if (!member) return null;

  const hasValue = (value) => {
    if (value === undefined || value === null) return false;
    if (typeof value === 'string') return value.trim().length > 0;
    return true;
  };

  const renderField = (label, value) => {
    if (!hasValue(value)) return null;
    return (
      <div className="flex py-1 border-b border-gray-100">
        <span className="w-40 text-sm text-gray-600 font-medium">{label}:</span>
        <span className="text-sm text-gray-900">{typeof value === 'object' && value.name ? value.name : value}</span>
      </div>
    );
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white">
      <div className="text-center mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Member Profile</h1>
        <p className="text-sm text-gray-500">Printed on {new Date().toLocaleDateString()}</p>
      </div>

      {/* Header */}
      <div className="flex items-center gap-4 mb-6 pb-4 border-b-2 border-gray-200">
        <img
          src={member.photo || '/default-avatar.png'}
          alt={member.name}
          className="w-24 h-24 rounded-full object-cover border-2 border-gray-300"
          onError={(e) => { e.target.src = '/default-avatar.png'; }}
        />
        <div>
          <h2 className="text-xl font-bold text-gray-900">{member.name} {member.surname}</h2>
          <p className="text-sm text-gray-600">Member #{member.memberNumber}</p>
          <div className="flex gap-2 mt-1">
            <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs">
              {member.isAlive ? 'Living' : 'Deceased'}
            </span>
            {member.verificationStatus && (
              <span className={`px-2 py-0.5 rounded-full text-xs ${
                member.verificationStatus === 'verified' ? 'bg-green-100 text-green-800' :
                member.verificationStatus === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                'bg-red-100 text-red-800'
              }`}>
                {member.verificationStatus.charAt(0).toUpperCase() + member.verificationStatus.slice(1)}
              </span>
            )}
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">Personal Information</h3>
        <div className="grid grid-cols-2 gap-1">
          {renderField('Date of Birth', formatDate(member.dob))}
          {!member.isAlive && member.dod && renderField('Date of Death', formatDate(member.dod))}
          {renderField('Gender', member.gender)}
          {renderField('Place of Birth', member.placeOfBirth)}
          {renderField('Blood Group', member.bloodGroup)}
          {renderField('Marital Status', member.maritalStatus)}
          {renderField('Occupation', member.occupation)}
          {renderField('Education', member.education)}
          {renderField('Religion', member.religion)}
          {renderField('Caste/Ethnicity', member.casteEthnicity)}
          {renderField('Nationality', member.nationality)}
        </div>
      </div>

      {/* Contact Information */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">Contact Information</h3>
        <div className="grid grid-cols-2 gap-1">
          {renderField('Mobile Number', member.phone)}
          {renderField('Alternate Mobile', member.alternatePhone)}
          {renderField('Email', member.email)}
        </div>
      </div>

      {/* Address Information */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">Address Information</h3>
        <div className="grid grid-cols-2 gap-1">
          {renderField('House Number', member.houseNumber)}
          {renderField('Ward Number', member.wardNumber)}
          {renderField('Tole/Village', member.toleVillage)}
          {renderField('Municipality', member.municipality)}
          {renderField('District', member.district)}
          {renderField('Province', member.province)}
          {renderField('Country', member.country)}
          {renderField('Current Address', member.currentAddress)}
          {renderField('Permanent Address', member.permanentAddress)}
          {renderField('Postal Code', member.postalCode)}
        </div>
      </div>

      {/* Family Information */}
      <div className="mb-4">
        <h3 className="text-lg font-semibold text-gray-800 mb-2 border-b border-gray-200 pb-1">Family Information</h3>
        <div className="grid grid-cols-2 gap-1">
          {renderField('Family', member.family?.familyName)}
          {renderField('Family Number', member.familyNumber)}
          {renderField('Roll Number', member.rollNumber)}
          {renderField('Generation', member.generation)}
          {renderField('Vansha No.', member.vanshaGenerationNumber)}
          {renderField('Relationship', member.relationship)}
          {renderField('Father', member.father?.name)}
          {renderField('Mother', member.mother?.name)}
          {renderField('Grandfather', member.grandfather?.name)}
          {renderField('Grandmother', member.grandmother?.name)}
          {renderField('Spouse', member.spouse?.name)}
          {renderField('Guardian', member.guardian?.name)}
        </div>
      </div>

      {/* Footer */}
      <div className="text-center text-xs text-gray-400 border-t border-gray-200 pt-4 mt-4">
        <p>Generated by Family Genealogy System • {new Date().toLocaleString()}</p>
      </div>

      <div className="text-center mt-4">
        <button
          onClick={() => window.print()}
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          🖨️ Print / Save as PDF
        </button>
        <button
          onClick={onClose}
          className="ml-2 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default PrintProfile;