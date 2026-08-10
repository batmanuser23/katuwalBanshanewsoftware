// src/components/FamilyTreeView.jsx - UPDATED with Nepali labels

import { useState, useMemo } from 'react';
import { FaUser, FaHeart, FaTree, FaUsers, FaGenderless } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// Nepali relationship labels
const RELATIONSHIP_LABELS = {
  'spouse': 'श्रीमान/श्रीमती',
  'husband': 'श्रीमान',
  'wife': 'श्रीमती',
  'father': 'बुवा',
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

const FamilyTreeView = ({ members, layout = 'horizontal', onMemberClick, familyId }) => {
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

    // Create member map
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
      
      // Father relationship
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
      
      // Mother relationship
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

      // Spouse relationship
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

      // Grandfather
      if (m.grandfather) {
        const grandId = typeof m.grandfather === 'object' ? m.grandfather._id : m.grandfather;
        if (grandId && memberMap[grandId]) {
          if (!memberMap[memberId].parents.includes(grandId)) {
            memberMap[memberId].parents.push(grandId);
          }
        }
      }

      // Grandmother
      if (m.grandmother) {
        const grandId = typeof m.grandmother === 'object' ? m.grandmother._id : m.grandmother;
        if (grandId && memberMap[grandId]) {
          if (!memberMap[memberId].parents.includes(grandId)) {
            memberMap[memberId].parents.push(grandId);
          }
        }
      }
    });

    // Find root nodes (members with no parents)
    let roots = Object.values(memberMap).filter(m => m.parents.length === 0);
    
    // If no roots found, use members with lowest generation
    if (roots.length === 0) {
      const minGen = Math.min(...Object.values(memberMap).map(m => m.generation || 99));
      roots = Object.values(memberMap).filter(m => (m.generation || 99) === minGen);
    }

    // If still no roots, use all members
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

  // Render a single member node
  const renderMemberNode = (memberId, memberMap, level = 0, isHorizontal = true) => {
    const member = memberMap[memberId];
    if (!member) return null;

    const hasChildren = member.children && member.children.length > 0;
    const isExpanded = expandedNodes.has(memberId);
    const hasSpouse = member.spouses && member.spouses.length > 0;
    const isSelected = selectedNode === memberId;

    // Get relationship label in Nepali
    const relationshipLabel = member.lineageRole === 'lineage_head' ? 'घरमुली' : 
                             member.relationship ? getNepaliLabel(member.relationship) : 'सदस्य';

    return (
      <div 
        key={memberId} 
        className={`flex ${isHorizontal ? 'flex-col items-center' : 'flex-row items-center'} relative`}
        style={{ 
          margin: isHorizontal ? '0 10px' : '10px 0',
        }}
      >
        {/* Spouse connection line */}
        {hasSpouse && (
          <div className={`${isHorizontal ? 'absolute -top-4 left-1/2' : 'absolute -left-4 top-1/2'} 
            w-8 h-0.5 bg-pink-300 border-t-2 border-dashed border-pink-300`} />
        )}

        {/* Member Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: level * 0.05 }}
          className="relative"
        >
          <div 
            className={`
              bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 
              border-2 ${member.isAlive !== false ? 'border-green-200 hover:border-green-400' : 'border-gray-300 hover:border-gray-400'}
              cursor-pointer min-w-[120px] max-w-[160px]
              ${isHorizontal ? 'mx-1' : 'my-1'}
              ${isSelected ? 'ring-2 ring-green-500 ring-offset-2' : ''}
            `}
            onClick={() => {
              setSelectedNode(memberId);
              onMemberClick?.(member);
            }}
          >
            <div className="p-3">
              {/* Photo */}
              <div className="w-14 h-14 mx-auto rounded-full overflow-hidden border-2 border-gray-200 mb-1.5 bg-gray-100">
                {member.photo ? (
                  <img 
                    src={member.photo} 
                    alt={member.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.src = '/default-avatar.png';
                    }}
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                    <FaUser className="text-green-600 text-xl" />
                  </div>
                )}
              </div>

              {/* Name */}
              <div className="text-center">
                <p className="font-semibold text-sm text-gray-800 truncate" title={member.name}>
                  {member.name}
                </p>
                {member.memberNumber && (
                  <p className="text-xs text-green-600 font-mono">
                    {member.memberNumber}
                  </p>
                )}
                {member.generation && (
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                    पुस्ता {member.generation}
                  </span>
                )}
              </div>

              {/* Relationship badge in Nepali */}
              <div className="flex items-center justify-center mt-1">
                <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
                  {relationshipLabel}
                </span>
              </div>

              {/* Gender indicator */}
              <div className="flex items-center justify-center mt-0.5">
                <span className="text-xs text-gray-400">
                  {getGenderSymbol(member.gender)}
                </span>
              </div>

              {/* Spouse indicator */}
              {hasSpouse && (
                <div className="flex items-center justify-center mt-1 gap-1">
                  <FaHeart className="text-red-400 text-[10px]" />
                  <span className="text-[10px] text-gray-400">श्रीमान/श्रीमती</span>
                </div>
              )}
            </div>

            {/* Expand/Collapse button */}
            {hasChildren && (
              <button
                onClick={(e) => toggleNode(memberId, e)}
                className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 
                  bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center 
                  shadow-md hover:bg-green-600 transition-colors text-sm z-10"
              >
                {isExpanded ? '−' : '+'}
              </button>
            )}
          </div>
        </motion.div>

        {/* Spouse nodes */}
        {hasSpouse && isExpanded && (
          <div className={`flex ${isHorizontal ? 'flex-row gap-2' : 'flex-col gap-2'} mt-2`}>
            {member.spouses.map(spouseId => {
              if (spouseId === memberId) return null;
              return renderMemberNode(spouseId, memberMap, level + 1, isHorizontal);
            })}
          </div>
        )}

        {/* Children */}
        {hasChildren && isExpanded && (
          <div className={`
            flex flex-wrap justify-center gap-4 mt-4 pt-4 relative
            ${isHorizontal ? 'flex-row' : 'flex-col'}
          `}>
            {/* Connecting line from parent to children */}
            <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-gray-300 -mt-4" />
            
            <div className="flex flex-wrap justify-center gap-4">
              {member.children.map(childId => {
                return renderMemberNode(childId, memberMap, level + 1, isHorizontal);
              })}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Render the entire tree
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

    const isHorizontal = layout === 'horizontal';

    return (
      <div className={`flex ${isHorizontal ? 'flex-row flex-wrap justify-center gap-8' : 'flex-col items-center'} w-full min-h-[400px] p-4`}>
        {treeData.rootIds.map((rootId, index) => (
          <div key={rootId} className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'} items-start gap-4`}>
            {renderMemberNode(rootId, treeData.memberMap, 0, isHorizontal)}
          </div>
        ))}
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