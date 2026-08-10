// src/components/FamilyCard.jsx
import React from 'react';
import { FaHome, FaUsers, FaTree, FaLock, FaUnlock, FaEye } from 'react-icons/fa';
import { motion } from 'framer-motion';
import Button from './Button';

const FamilyCard = ({ 
  family, 
  memberCount, 
  generationCount, 
  onViewTree, 
  onViewDetails, 
  onClose, 
  onReopen,
  isAdmin = false,
  className = '' 
}) => {
  const isClosed = family.status === 'closed';

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`bg-white rounded-2xl border ${isClosed ? 'border-gray-300' : 'border-green-200'} 
        shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}
    >
      <div className="p-5">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className={`w-12 h-12 rounded-xl ${isClosed ? 'bg-gray-100' : 'bg-gradient-to-r from-green-100 to-emerald-100'} 
              flex items-center justify-center flex-shrink-0`}>
              {family.familyPhoto ? (
                <img 
                  src={family.familyPhoto} 
                  alt={family.familyName}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <FaHome className={`${isClosed ? 'text-gray-400' : 'text-green-600'} text-2xl`} />
              )}
            </div>
            <div>
              <h3 className="font-semibold text-gray-800 text-lg">
                {family.familyName || 'Unnamed Family'}
              </h3>
              <div className="flex items-center gap-2 text-sm text-gray-500">
                <span>House No. {family.house?.houseNumber || 'N/A'}</span>
                <span>•</span>
                <span>Family No. {family.familyNumber}</span>
              </div>
            </div>
          </div>
          
          {/* Status Badge */}
          <div className="flex items-center gap-2">
            {isClosed ? (
              <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium flex items-center gap-1">
                <FaLock className="text-xs" />
                CLOSED
              </span>
            ) : (
              <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
                <FaUnlock className="text-xs" />
                OPEN
              </span>
            )}
          </div>
        </div>

        {/* Vansha/Generation */}
        {family.vanshaGenerationNumber && (
          <div className="mt-2 text-sm">
            <span className="text-gray-500">Vansha/Generation: </span>
            <span className="font-medium text-gray-800">{family.vanshaGenerationNumber}</span>
          </div>
        )}

        {/* Family Head */}
        {family.familyHead && (
          <div className="mt-1 text-sm">
            <span className="text-gray-500">Head: </span>
            <span className="font-medium text-gray-800">
              {typeof family.familyHead === 'object' ? family.familyHead.name : family.familyHead}
            </span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <FaUsers className="text-blue-500 text-sm" />
            <span className="text-sm font-medium text-gray-700">{memberCount || 0} Members</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaTree className="text-green-500 text-sm" />
            <span className="text-sm font-medium text-gray-700">{generationCount || 0} Generations</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
          <Button
            variant="primary"
            size="sm"
            onClick={onViewTree}
            className="flex-1 min-w-[100px]"
          >
            <FaTree className="mr-1.5 text-xs" />
            View Tree
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="flex-1 min-w-[100px]"
          >
            <FaEye className="mr-1.5 text-xs" />
            Details
          </Button>

          {isAdmin && isClosed && (
            <Button
              variant="success"
              size="sm"
              onClick={onReopen}
              className="flex-1 min-w-[100px]"
            >
              <FaUnlock className="mr-1.5 text-xs" />
              Open for Edit
            </Button>
          )}

          {isAdmin && !isClosed && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="flex-1 min-w-[100px]"
            >
              <FaLock className="mr-1.5 text-xs" />
              Close Family
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FamilyCard;