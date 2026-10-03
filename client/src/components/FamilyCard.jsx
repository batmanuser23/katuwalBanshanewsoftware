// src/components/FamilyCard.jsx - COMPLETE UPDATED
// Features:
// - Show totalGenerations (calculated)
// - Show family head (ObjectId or manual name)
// - Show vansha number
// - Edit button support

import React, { useState } from 'react';
import { 
  FaHome, FaUsers, FaTree, FaLock, FaUnlock, FaEye, 
  FaChevronDown, FaChevronUp, FaUser, FaEdit, FaUserTie 
} from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';
import Button from './Button';

const FamilyCard = ({ 
  family, 
  memberCount, 
  generationCount, 
  onViewTree, 
  onViewDetails, 
  onEdit,
  onClose, 
  onReopen,
  members = [],
  isAdmin = true,
  className = '' 
}) => {
  const isClosed = family.status === 'closed';
  const [expanded, setExpanded] = useState(false);

  // ============================================================
  // Get family head name (handles both ObjectId and manual text)
  // ============================================================
  const getFamilyHeadName = () => {
    // Priority 1: Populated familyHead object
    if (family.familyHead && typeof family.familyHead === 'object') {
      return family.familyHead.name || 'N/A';
    }
    
    // Priority 2: Manual familyHeadName
    if (family.familyHeadName) {
      return family.familyHeadName;
    }
    
    // Priority 3: String familyHead
    if (typeof family.familyHead === 'string') {
      return family.familyHead;
    }
    
    return 'N/A';
  };

  // ============================================================
  // Get relationship label in Nepali
  // ============================================================
  const getRelationshipLabel = (relationship) => {
    const labels = {
      'member': 'सदस्य',
      'spouse': 'श्रीमान/श्रीमती',
      'child': 'सन्तान',
      'parent': 'आमा/बुवा',
      'sibling': 'दाजु/भाइ/दिदी/बहिनी',
      'grandparent': 'हजुरबा/हजुरआमा',
      'grandchild': 'नाति/नातिनी',
      'other': 'अन्य'
    };
    return labels[relationship] || relationship || 'सदस्य';
  };

  // ============================================================
  // Calculate total generations from members if not provided
  // ============================================================
  const calculatedGenerations = React.useMemo(() => {
    if (generationCount !== undefined && generationCount !== null) {
      return generationCount;
    }
    
    if (family.totalGenerations !== undefined && family.totalGenerations !== null) {
      return family.totalGenerations;
    }
    
    // Calculate from members array
    if (members && members.length > 0) {
      const maxGen = Math.max(...members.map(m => m.generation || 1));
      return maxGen;
    }
    
    return 0;
  }, [generationCount, family.totalGenerations, members]);

  // ============================================================
  // Status badge
  // ============================================================
  const getStatusBadge = () => {
    if (isClosed) {
      return (
        <span className="px-2.5 py-1 bg-gray-100 text-gray-600 rounded-full text-[10px] font-medium flex items-center gap-1">
          <FaLock className="text-[9px]" />
          बन्द
        </span>
      );
    }
    return (
      <span className="px-2.5 py-1 bg-green-100 text-green-700 rounded-full text-[10px] font-medium flex items-center gap-1">
        <FaUnlock className="text-[9px]" />
        खुला
      </span>
    );
  };

  return (
    <motion.div
      whileHover={{ y: -4 }}
      className={`
        bg-white rounded-2xl border-2 
        ${isClosed ? 'border-gray-300' : 'border-green-200'} 
        shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden 
        ${className}
      `}
    >
      <div className="p-4">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3 flex-1 min-w-0">
            <div className={`
              w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0
              ${isClosed ? 'bg-gray-100' : 'bg-gradient-to-r from-green-100 to-emerald-100'}
            `}>
              {family.familyPhoto ? (
                <img 
                  src={family.familyPhoto} 
                  alt={family.familyName}
                  className="w-full h-full object-cover rounded-xl"
                />
              ) : (
                <FaHome className={`${isClosed ? 'text-gray-400' : 'text-green-600'} text-xl`} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-800 text-base truncate">
                {family.familyName || 'Unnamed Family'}
              </h3>
              <div className="flex items-center gap-1.5 text-xs text-gray-500 flex-wrap">
                <span>घर नं. {family.house?.houseNumber || 'N/A'}</span>
                <span>•</span>
                <span>परिवार नं. {family.familyNumber}</span>
              </div>
            </div>
          </div>
          
          <div className="flex-shrink-0 ml-2">
            {getStatusBadge()}
          </div>
        </div>

        {/* Info Grid */}
        <div className="mt-3 space-y-1">
          {/* Family Head */}
          <div className="flex items-center gap-2 text-sm">
            <FaUserTie className="text-amber-500 text-xs flex-shrink-0" />
            <span className="text-gray-500 text-xs">घरमुली:</span>
            <span className="font-medium text-gray-800 text-xs truncate">
              {getFamilyHeadName()}
            </span>
          </div>

          {/* Vansha Number */}
          {family.vanshaGenerationNumber && (
            <div className="flex items-center gap-2 text-sm">
              <FaTree className="text-green-500 text-xs flex-shrink-0" />
              <span className="text-gray-500 text-xs">वंशज नं.:</span>
              <span className="font-medium text-gray-800 text-xs">
                {family.vanshaGenerationNumber}
              </span>
            </div>
          )}
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <FaUsers className={`${isClosed ? 'text-gray-400' : 'text-blue-500'} text-xs`} />
            <span className={`text-xs font-medium ${isClosed ? 'text-gray-500' : 'text-gray-700'}`}>
              {memberCount || family.memberCount || 0} सदस्य
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaTree className={`${isClosed ? 'text-gray-400' : 'text-green-500'} text-xs`} />
            <span className={`text-xs font-medium ${isClosed ? 'text-gray-500' : 'text-gray-700'}`}>
              {calculatedGenerations} पुस्ता
            </span>
          </div>
          {family.clan && (
            <span className="text-[10px] bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
              {family.clan}
            </span>
          )}
        </div>

        {/* Toggle Members Button */}
        {members && members.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-1.5 mt-3 text-xs text-green-600 hover:text-green-700 transition-colors"
          >
            {expanded ? <FaChevronUp className="text-[9px]" /> : <FaChevronDown className="text-[9px]" />}
            {expanded ? 'सदस्यहरू लुकाउनुहोस्' : 'सदस्यहरू हेर्नुहोस्'}
            <span className="text-[10px] text-gray-400">({members.length})</span>
          </button>
        )}

        {/* Members List */}
        <AnimatePresence>
          {expanded && members && members.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="mt-2 pt-2 border-t border-gray-100 space-y-1 max-h-40 overflow-y-auto">
                {members.slice(0, 20).map((member) => (
                  <div 
                    key={member._id} 
                    className="flex items-center gap-2 text-xs py-1 px-2 hover:bg-gray-50 rounded-lg"
                  >
                    <div className="w-5 h-5 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      {member.photo ? (
                        <img 
                          src={member.photo} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = '/default-avatar.png'; }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                          <FaUser className="text-green-600 text-[8px]" />
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-gray-700 flex-1 truncate">
                      {member.name}
                    </span>
                    <span className="text-[10px] text-gray-400">
                      {member.lineageRole === 'lineage_head' ? 'घरमुली' : 
                       getRelationshipLabel(member.relationship)}
                    </span>
                    {member.isAlive === false && (
                      <span className="text-[10px] text-red-400">(मृत)</span>
                    )}
                  </div>
                ))}
                {members.length > 20 && (
                  <p className="text-[10px] text-gray-400 text-center pt-1">
                    र {members.length - 20} थप सदस्यहरू...
                  </p>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex flex-wrap gap-1.5 mt-3 pt-3 border-t border-gray-100">
          <Button
            variant="primary"
            size="sm"
            onClick={onViewTree}
            className="flex-1 min-w-[70px] text-xs"
          >
            <FaTree className="mr-1 text-[10px]" />
            वृक्ष
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="flex-1 min-w-[70px] text-xs"
          >
            <FaEye className="mr-1 text-[10px]" />
            विवरण
          </Button>

          {isAdmin && !isClosed && onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(family)}
              className="flex-1 min-w-[70px] text-xs"
            >
              <FaEdit className="mr-1 text-[10px]" />
              सम्पादन
            </Button>
          )}

          {isAdmin && isClosed && onReopen && (
            <Button
              variant="success"
              size="sm"
              onClick={onReopen}
              className="flex-1 min-w-[70px] text-xs"
            >
              <FaUnlock className="mr-1 text-[10px]" />
              पुन: खोल्नुहोस्
            </Button>
          )}

          {isAdmin && !isClosed && onClose && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="flex-1 min-w-[70px] text-xs"
            >
              <FaLock className="mr-1 text-[10px]" />
              बन्द
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FamilyCard;