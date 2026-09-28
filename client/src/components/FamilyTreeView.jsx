// src/components/FamilyTreeView.jsx - COMPLETE FIXED VERSION (no duplicate nodes)

import { useState, useMemo } from 'react';
import { FaUser, FaHeart, FaTree, FaUsers, FaGenderless, FaCamera } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Nepali relationship labels
const RELATIONSHIP_LABELS = {
  'spouse': 'श्रीमान/श्रीमती',
  'husband': 'श्रीमान',
  'wife': 'श्रीमती',
  'father': 'बुबा',
  'mother': 'आमा',
  'son': 'छोरा',
  'daughter': 'छोरी',
  'grandfather': 'हजुरबा',
  'grandmother': 'हजुरआमा',
  'grandson': 'नाति',
  'granddaughter': 'नातिनी',
  'brother': 'दाजु/भाइ',
  'sister': 'दिदी/बहिनी',
  'elderBrother': 'दाजु',
  'youngerBrother': 'भाइ',
  'elderSister': 'दिदी',
  'youngerSister': 'बहिनी',
  'member': 'सदस्य',
  'lineage_head': 'घरमुली',
  'lineage_member': 'सदस्य',
  'family_head': 'घरमुली',
  'child': 'सन्तान',
  'parent': 'आमा/बुवा',
  'sibling': 'दाजु/भाइ/दिदी/बहिनी',
  'grandparent': 'हजुरबा/हजुरआमा',
  'grandchild': 'नाति/नातिनी',
  'other': 'अन्य'
};

const FamilyTreeView = ({ members, layout = 'horizontal', onMemberClick, familyId, showPhotos = true }) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);

  // Get Nepali relationship label
  const getNepaliLabel = (relationship) => {
    if (!relationship) return 'सदस्य';
    const label = RELATIONSHIP_LABELS[relationship];
    return label || relationship.charAt(0).toUpperCase() + relationship.slice(1);
  };

  // Get gender symbol
  const getGenderSymbol = (gender) => {
    if (gender === 'male') return '♂';
    if (gender === 'female') return '♀';
    return '⚥';
  };

  // Build tree structure from flat members list
  const treeData = useMemo(() => {
    if (!members || members.length === 0) return null;

    const memberMap = {};
    members.forEach(m => {
      memberMap[m._id] = { 
        ...m, 
        children: [], 
        spouses: [],
        parents: [],
        level: 0
      };
    });

    // Build relationships
    members.forEach(m => {
      const memberId = m._id;
      
      if (m.father) {
        const fatherId = typeof m.father === 'object' ? m.father._id : m.father;
        if (fatherId && memberMap[fatherId]) {
          if (!memberMap[fatherId].children.includes(memberId)) {
            memberMap[fatherId].children.push(memberId);
          }
          if (!memberMap[memberId].parents.includes(fatherId)) {
            memberMap[memberId].parents.push(fatherId);
          }
        }
      }
      
      if (m.mother) {
        const motherId = typeof m.mother === 'object' ? m.mother._id : m.mother;
        if (motherId && memberMap[motherId]) {
          if (!memberMap[motherId].children.includes(memberId)) {
            memberMap[motherId].children.push(memberId);
          }
          if (!memberMap[memberId].parents.includes(motherId)) {
            memberMap[memberId].parents.push(motherId);
          }
        }
      }

      if (m.spouse) {
        const spouseId = typeof m.spouse === 'object' ? m.spouse._id : m.spouse;
        if (spouseId && memberMap[spouseId]) {
          if (!memberMap[memberId].spouses.includes(spouseId)) {
            memberMap[memberId].spouses.push(spouseId);
          }
          if (!memberMap[spouseId].spouses.includes(memberId)) {
            memberMap[spouseId].spouses.push(memberId);
          }
        }
      }
    });

    let roots = Object.values(memberMap).filter(m => m.parents.length === 0);
    
    if (roots.length === 0) {
      const minGen = Math.min(...Object.values(memberMap).map(m => m.generation || 99));
      roots = Object.values(memberMap).filter(m => (m.generation || 99) === minGen);
    }

    if (roots.length === 0) {
      roots = Object.values(memberMap);
    }

    return { rootIds: roots.map(r => r._id), memberMap };
  }, [members]);

  // Toggle node expansion
  const toggleNode = (nodeId, e) => {
    e.stopPropagation();
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) {
        newSet.delete(nodeId);
      } else {
        newSet.add(nodeId);
      }
      return newSet;
    });
  };

  // ✅ UPDATED: Render member card with new design
  const renderMemberCard = (member, relationshipLabel = 'सदस्य', isSpouse = false) => {
    if (!member) return null;

    const isDeceased = !member.isAlive;
    const hasPhoto = member.photo && member.photo.trim() !== '';
    const genderIcon = member.gender === 'male' ? '👨' : member.gender === 'female' ? '👩' : '👤';

    return (
      <div 
        className={`
          bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 
          border-2 ${isDeceased ? 'border-gray-300' : isSpouse ? 'border-pink-300' : 'border-green-200'}
          ${hasPhoto ? 'w-52' : 'w-48'}
          hover:border-green-400
          ${isSpouse ? 'bg-pink-50/80' : ''}
          cursor-pointer
        `}
        onClick={() => {
          setSelectedNode(member._id);
          onMemberClick?.(member);
        }}
      >
        {/* Photo Section */}
        <div className="relative">
          {hasPhoto ? (
            <img 
              src={member.photo} 
              alt={member.name}
              className="w-full h-36 object-cover rounded-t-xl"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
          ) : (
            <div className={`
              w-full h-36 flex items-center justify-center rounded-t-xl
              ${isDeceased ? 'bg-gray-200' : isSpouse ? 'bg-pink-100' : 'bg-gradient-to-br from-green-100 to-emerald-100'}
            `}>
              <div className="text-center">
                <FaUser className={`text-5xl ${isDeceased ? 'text-gray-400' : 'text-green-400'} mx-auto`} />
                <span className="text-xs text-gray-500 mt-1 block">फोटो छैन</span>
              </div>
            </div>
          )}
          
          {/* Relationship Badge */}
          <div className="absolute top-2 left-2">
            <span className={`
              text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm
              ${isSpouse ? 'bg-pink-500/90 text-white' : 'bg-white/90 text-gray-700'}
            `}>
              {relationshipLabel}
            </span>
          </div>
          
          {/* Deceased Badge */}
          {isDeceased && (
            <div className="absolute top-2 right-2">
              <span className="text-[10px] font-medium bg-red-500/90 text-white px-2 py-0.5 rounded-full shadow-sm">
                ✝ मृत
              </span>
            </div>
          )}
        </div>
        
        {/* Content Section */}
        <div className="p-3 space-y-1">
          <p className="font-semibold text-sm text-gray-800 truncate" title={member.name}>
            {member.name}
          </p>
          
          {member.surname && (
            <p className="text-[10px] text-gray-500 truncate">{member.surname}</p>
          )}
          
          {/* Bansha Number */}
          {member.vanshaGenerationNumber && (
            <p className="text-[10px] text-gray-600">
              वंश नं: {member.vanshaGenerationNumber}
            </p>
          )}
          
          {/* Family Number */}
          {member.familyNumber && (
            <p className="text-[10px] text-gray-600">
              परिवार नं: {member.familyNumber}
            </p>
          )}
          
          {/* Member ID */}
          {member.memberNumber && (
            <p className="text-[10px] font-mono text-green-600">
              ID: {member.memberNumber}
            </p>
          )}
          
          {/* Date of Birth */}
          {member.dob && (
            <p className="text-[9px] text-gray-400">
              जन्म: {new Date(member.dob).toLocaleDateString('ne-NP')}
            </p>
          )}
          
          {/* Date of Death */}
          {isDeceased && member.dod && (
            <p className="text-[9px] text-red-400">
              मृत्यु: {new Date(member.dod).toLocaleDateString('ne-NP')}
            </p>
          )}
          
          {/* Spouse indicator */}
          {member.spouse && !isSpouse && (
            <div className="flex items-center gap-1 mt-1">
              <FaHeart className="text-red-400 text-[8px]" />
              <span className="text-[8px] text-gray-400">विवाहित</span>
            </div>
          )}
        </div>
        
        {/* Expand/Collapse button for children */}
        {member.children && member.children.length > 0 && (
          <button
            onClick={(e) => toggleNode(member._id, e)}
            className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 
              bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center 
              shadow-md hover:bg-green-600 transition-colors text-[10px] z-10"
          >
            {expandedNodes.has(member._id) ? '−' : '+'}
          </button>
        )}
      </div>
    );
  };

  // ✅ FIXED: Render family node with proper spouse handling (no duplicates)
  const renderFamilyNode = (memberId, memberMap, level = 0, visited = new Set()) => {
    const member = memberMap[memberId];
    if (!member) return null;

    // ✅ CRITICAL: Prevent circular/duplicate rendering
    if (visited.has(memberId)) {
      return null;
    }
    visited.add(memberId);

    const hasChildren = member.children && member.children.length > 0;
    const isExpanded = expandedNodes.has(memberId);
    const hasSpouse = member.spouses && member.spouses.length > 0;

    // Get relationship label
    let relationshipLabel = member.lineageRole === 'lineage_head' ? 'घरमुली' :
      member.relationship ? getNepaliLabel(member.relationship) : 'सदस्य';

    // ✅ Determine if this member is a spouse (married into family)
    const isSpouse = member.spouses && member.spouses.length > 0 &&
      member.parents.length === 0 &&
      member.children.length === 0;

    return (
      <div
        key={memberId}
        className="flex flex-col items-center relative"
      >
        {/* ✅ Husband + Wife SIDE BY SIDE (same horizontal line) */}
        <div className="flex items-center gap-3 relative">
          {/* Main Member Card */}
          <div className="relative">
            {renderMemberCard(member, relationshipLabel, isSpouse)}
          </div>

          {/* ✅ Spouse connectors + cards — ONLY if not already rendered */}
          {hasSpouse && isExpanded && (
            <>
              {member.spouses.map((spouseId) => {
                if (spouseId === memberId) return null;
                if (visited.has(spouseId)) return null;
                const spouse = memberMap[spouseId];
                if (!spouse) return null;

                visited.add(spouseId);

                return (
                  <React.Fragment key={spouseId}>
                    {/* Horizontal marriage connector */}
                    <div className="flex flex-col items-center px-1">
                      <div className="w-8 h-0.5 bg-pink-400"></div>
                      <span className="text-[8px] text-pink-500 mt-0.5 whitespace-nowrap">
                        विवाह
                      </span>
                    </div>
                    {/* Spouse Card */}
                    {renderMemberCard(spouse, 'श्रीमती', true)}
                  </React.Fragment>
                );
              })}
            </>
          )}
        </div>

        {/* ✅ Children — BELOW the spouse pair, connected from husband-wife center */}
        {hasChildren && isExpanded && (
          <div className="relative mt-2 w-full flex flex-col items-center">
            {/* Vertical line from spouse pair center */}
            <div className="w-0.5 h-5 bg-green-400"></div>

            {/* Children container */}
            <div className="relative pt-2">
              {/* Horizontal bridge line */}
              {member.children.length > 1 && (
                <div className="absolute top-0 left-[10%] right-[10%] h-0.5 bg-green-400" />
              )}

              {/* Children with equal spacing */}
              <div className={`
                flex justify-center items-start
                ${member.children.length <= 3 ? 'gap-8' :
                  member.children.length <= 5 ? 'gap-6' :
                  member.children.length <= 8 ? 'gap-4' : 'gap-3'}
              `}>
                {member.children.map((childId) => {
                  if (visited.has(childId)) return null;
                  return (
                    <div key={childId} className="relative flex flex-col items-center">
                      {/* Vertical line to each child */}
                      <div className="absolute -top-2 left-1/2 w-0.5 h-2 bg-green-400" />
                      {renderFamilyNode(childId, memberMap, level + 1, visited)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Collapsed children indicator */}
        {hasChildren && !isExpanded && (
          <button
            onClick={(e) => toggleNode(memberId, e)}
            className="mt-2 text-xs text-green-500 hover:text-green-600 flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full transition-colors"
          >
            <span>+</span>
            {member.children.length} सन्तान हेर्नुहोस्
          </button>
        )}
      </div>
    );
  };

  // ✅ FIXED: Render the entire tree with visited tracking
  const renderTree = () => {
    if (!treeData || !treeData.rootIds || treeData.rootIds.length === 0) {
      return (
        <div className="text-center py-12">
          <FaTree className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">पारिवारिक वृक्ष संरचना फेला परेन</p>
          <p className="text-sm text-gray-400">पारिवारिक वृक्ष निर्माण गर्न सम्बन्धहरू थप्नुहोस्</p>
        </div>
      );
    }

    // ✅ CRITICAL: Track visited across ALL roots to prevent duplicates
    const globalVisited = new Set();

    return (
      <div className="flex flex-wrap justify-center gap-8 w-full min-h-[400px] p-4">
        {treeData.rootIds.map((rootId) => {
          if (globalVisited.has(rootId)) return null;
          return (
            <div key={rootId} className="flex flex-col items-center">
              {renderFamilyNode(rootId, treeData.memberMap, 0, globalVisited)}
            </div>
          );
        })}
      </div>
    );
  };

  if (!members || members.length === 0) {
    return (
      <div className="text-center py-12">
        <FaUsers className="text-4xl text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">यस परिवारमा कुनै सदस्य छैनन्</p>
        <p className="text-sm text-gray-400">पारिवारिक वृक्ष निर्माण गर्न सदस्यहरू थप्नुहोस्</p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <div className="text-sm text-gray-500 mb-2 text-center">
        <span className="bg-gray-100 px-3 py-1 rounded-full">
          कुल {members.length} सदस्यहरू
        </span>
      </div>
      {renderTree()}
    </div>
  );
};

export default FamilyTreeView;