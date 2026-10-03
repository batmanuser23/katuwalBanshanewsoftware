// src/components/FamilyTreeView.jsx - COMPLETE UPDATED VERSION
// Features:
// - Proper spouse pairing (bidirectional, no duplicates)
// - Auto-pair spouses by relationship + vansha + family
// - Daughter photo hiding in tree
// - Expand/Collapse controls
// - Proper relationship connector lines
// - No empty/duplicate nodes
// - Missing/deceased badges
// - Vansha number preserved as-is (not recalculated)

import { useState, useMemo, useCallback } from 'react';
import { FaUser, FaHeart, FaTree, FaUsers } from 'react-icons/fa';
import { motion, AnimatePresence } from 'framer-motion';

// ============================================================
// NEPALI RELATIONSHIP LABELS
// ============================================================
const RELATIONSHIP_LABELS = {
  spouse: 'श्रीमान/श्रीमती',
  husband: 'श्रीमान',
  wife: 'श्रीमती',
  father: 'बुबा',
  mother: 'आमा',
  son: 'छोरा',
  daughter: 'छोरी',
  grandfather: 'हजुरबा',
  grandmother: 'हजुरआमा',
  grandson: 'नाति',
  granddaughter: 'नातिनी',
  brother: 'दाजु/भाइ',
  sister: 'दिदी/बहिनी',
  elderBrother: 'दाजु',
  youngerBrother: 'भाइ',
  elderSister: 'दिदी',
  youngerSister: 'बहिनी',
  member: 'सदस्य',
  lineage_head: 'घरमुली',
  lineage_member: 'सदस्य',
  family_head: 'घरमुली',
  child: 'सन्तान',
  parent: 'आमा/बुवा',
  sibling: 'दाजु/भाइ/दिदी/बहिनी',
  grandparent: 'हजुरबा/हजुरआमा',
  grandchild: 'नाति/नातिनी',
  other: 'अन्य',

  पुर्खा: 'पुर्खा',
  हजुरबा: 'हजुरबा',
  हजुरआमा: 'हजुरआमा',
  बुवा: 'बुवा',
  आमा: 'आमा',
  दाजु: 'दाजु',
  भाइ: 'भाइ',
  दिदी: 'दिदी',
  बहिनी: 'बहिनी',
  छोरा: 'छोरा',
  छोरी: 'छोरी',
  नाति: 'नाति',
  नातिनी: 'नातिनी',
  श्रीमान्: 'श्रीमान्',
  श्रीमती: 'श्रीमती',
  श्रीमान: 'श्रीमान',
  बुहारी: 'बुहारी',
  ज्वाइँ: 'ज्वाइँ',
};

const FamilyTreeView = ({
  members,
  layout = 'horizontal',
  onMemberClick,
  familyId,
  showPhotos = true,
}) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set(['all']));
  const [selectedNode, setSelectedNode] = useState(null);

  const getNepaliLabel = useCallback((relationship) => {
    if (!relationship) return 'सदस्य';
    return RELATIONSHIP_LABELS[relationship] || relationship;
  }, []);

  // ============================================================
  // BUILD TREE DATA
  // ============================================================
  const treeData = useMemo(() => {
    if (!members || members.length === 0) return null;

    const memberMap = {};
    members.forEach((m) => {
      if (!m || !m._id) return;
      memberMap[m._id] = {
        ...m,
        childIds: [],
        parentIds: [],
        spouseId: null,
        spouses: [],
      };
    });

    // Parent-child links
    members.forEach((m) => {
      if (!m || !m._id) return;
      const memberId = m._id;

      if (m.father) {
        const fatherId = typeof m.father === 'object' ? m.father._id : m.father;
        if (fatherId && memberMap[fatherId]) {
          if (!memberMap[fatherId].childIds.includes(memberId)) {
            memberMap[fatherId].childIds.push(memberId);
          }
          if (!memberMap[memberId].parentIds.includes(fatherId)) {
            memberMap[memberId].parentIds.push(fatherId);
          }
        }
      }

      if (m.mother) {
        const motherId = typeof m.mother === 'object' ? m.mother._id : m.mother;
        if (motherId && memberMap[motherId]) {
          if (!memberMap[motherId].childIds.includes(memberId)) {
            memberMap[motherId].childIds.push(memberId);
          }
          if (!memberMap[memberId].parentIds.includes(motherId)) {
            memberMap[memberId].parentIds.push(motherId);
          }
        }
      }
    });

    // Spouse links (bidirectional, multiple sources)
    members.forEach((m) => {
      if (!m || !m._id) return;
      const memberId = m._id;

      if (m.spouse) {
        const spouseId = typeof m.spouse === 'object' ? m.spouse._id : m.spouse;
        if (spouseId && memberMap[spouseId]) {
          memberMap[memberId].spouseId = spouseId;
          memberMap[spouseId].spouseId = memberId;
          if (!memberMap[memberId].spouses.includes(spouseId)) {
            memberMap[memberId].spouses.push(spouseId);
          }
          if (!memberMap[spouseId].spouses.includes(memberId)) {
            memberMap[spouseId].spouses.push(memberId);
          }
        }
      }

      if (m.husband) {
        const husbandId = typeof m.husband === 'object' ? m.husband._id : m.husband;
        if (husbandId && memberMap[husbandId]) {
          memberMap[memberId].spouseId = husbandId;
          memberMap[husbandId].spouseId = memberId;
        }
      }

      if (m.wife) {
        const wifeId = typeof m.wife === 'object' ? m.wife._id : m.wife;
        if (wifeId && memberMap[wifeId]) {
          memberMap[memberId].spouseId = wifeId;
          memberMap[wifeId].spouseId = memberId;
        }
      }
    });

    // Auto-pair unlinked spouses by relationship + vansha + family
    members.forEach((m) => {
      if (!m || !m._id) return;
      if (memberMap[m._id].spouseId) return;

      const isSpouseRole =
        m.relationship === 'श्रीमती' ||
        m.relationship === 'श्रीमान';

      if (!isSpouseRole) return;

      const candidates = members.filter(
        (other) =>
          other._id !== m._id &&
          String(other.family) === String(m.family) &&
          other.gender !== m.gender &&
          other.vanshaGenerationNumber === m.vanshaGenerationNumber &&
          !memberMap[other._id]?.spouseId
      );

      if (candidates.length === 1) {
        const partnerId = candidates[0]._id;
        memberMap[m._id].spouseId = partnerId;
        memberMap[partnerId].spouseId = m._id;
      }
    });

    // Find roots (no parents)
    let roots = Object.values(memberMap).filter((m) => m.parentIds.length === 0);

    if (roots.length === 0) {
      const minGen = Math.min(...Object.values(memberMap).map((m) => m.generation || 99));
      roots = Object.values(memberMap).filter((m) => (m.generation || 99) === minGen);
    }

    if (roots.length === 0) {
      roots = Object.values(memberMap);
    }

    // Filter out spouse-role roots to avoid duplicate couple entries
    const rootIds = new Set(roots.map((r) => r._id));
    const filteredRoots = roots.filter((r) => {
      if (!r.spouseId) return true;
      if (rootIds.has(r.spouseId)) {
        const spouse = memberMap[r.spouseId];
        if (r.gender === 'male' && spouse.gender === 'female') return true;
        if (r.gender === 'female' && spouse.gender === 'male') return false;
        if (r.lineageRole === 'lineage_head') return true;
        if (spouse.lineageRole === 'lineage_head') return false;
        return r._id < r.spouseId;
      }
      return true;
    });

    return {
      rootIds: filteredRoots.map((r) => r._id),
      memberMap,
      total: members.length,
    };
  }, [members]);

  const toggleNode = useCallback((nodeId, e) => {
    if (e) e.stopPropagation();
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      if (next.has(nodeId)) next.delete(nodeId);
      else next.add(nodeId);
      return next;
    });
  }, []);

  // ============================================================
  // HELPERS: Detect daughter / wife / buhari
  // ============================================================
  const isDaughter = useCallback((member) => {
    if (!member) return false;
    const relationship = member.relationship || '';
    return relationship.includes('छोरी') || relationship === 'daughter';
  }, []);

  const isWifeOrBuhari = useCallback((member) => {
    if (!member) return false;
    const relationship = member.relationship || '';
    const lineageRole = member.lineageRole || '';
    return (
      relationship.includes('बुहारी') ||
      relationship.includes('श्रीमती') ||
      lineageRole === 'spouse' ||
      (member.gender === 'female' && member.spouses && member.spouses.length > 0)
    );
  }, []);

  // ============================================================
  // RENDER MEMBER CARD
  // ============================================================
  const renderMemberCard = (member, relationshipLabel = 'सदस्य', isSpouse = false) => {
    if (!member || !member._id) return null;

    const isDeceased = member.isAlive === false;
    const hasPhoto = member.photo && member.photo.trim() !== '';

    // Photo visibility: hide for daughters, show for wives/buhari
    const isDaughterNode = isDaughter(member);
    const shouldShowPhoto = showPhotos && hasPhoto && !isDaughterNode;

    return (
      <div
        className={`
          bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300
          border-2 w-44 cursor-pointer
          ${isDeceased ? 'border-gray-300' : isSpouse ? 'border-pink-300' : 'border-green-300'}
          hover:border-green-400
          ${isSpouse ? 'bg-pink-50/60' : ''}
        `}
        onClick={() => {
          setSelectedNode(member._id);
          onMemberClick?.(member);
        }}
      >
        <div className="relative">
          {shouldShowPhoto ? (
            <img
              src={member.photo}
              alt={member.name}
              className="w-full h-28 object-cover rounded-t-xl"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling?.classList.remove('hidden');
              }}
            />
          ) : null}

          <div
            className={`
              ${shouldShowPhoto ? 'hidden' : 'flex'}
              w-full h-28 items-center justify-center rounded-t-xl
              ${isDeceased ? 'bg-gray-200' : isSpouse ? 'bg-pink-100' : 'bg-gradient-to-br from-green-100 to-emerald-100'}
            `}
          >
            <div className="text-center">
              <FaUser className={`text-4xl ${isDeceased ? 'text-gray-400' : 'text-green-400'} mx-auto`} />
              <span className="text-[10px] text-gray-500 mt-1 block">
                {isDaughterNode ? 'छोरी' : 'फोटो छैन'}
              </span>
            </div>
          </div>

          <div className="absolute top-1.5 left-1.5">
            <span
              className={`
                text-[9px] font-medium px-1.5 py-0.5 rounded-full shadow-sm
                ${isSpouse ? 'bg-pink-500/90 text-white' : 'bg-white/90 text-gray-700'}
              `}
            >
              {relationshipLabel}
            </span>
          </div>

          {isDeceased && (
            <span className="absolute top-1.5 right-1.5 text-[9px] font-bold bg-red-500 text-white px-1.5 py-0.5 rounded-full">
              ✝ मृत
            </span>
          )}

          {member.personStatus === 'missing' && (
            <span className="absolute top-1.5 right-1.5 text-[9px] font-bold bg-orange-500 text-white px-1.5 py-0.5 rounded-full">
              हराएको
            </span>
          )}
        </div>

        <div className="p-2.5 space-y-0.5">
          <p className="font-semibold text-xs text-gray-800 truncate" title={member.name}>
            {member.name || 'नाम अज्ञात'}
          </p>

          {member.surname && (
            <p className="text-[9px] text-gray-500 truncate">{member.surname}</p>
          )}

          {member.vanshaGenerationNumber && (
            <p className="text-[9px] text-gray-600">वंशज: {member.vanshaGenerationNumber}</p>
          )}

          {member.familyNumber && (
            <p className="text-[9px] text-gray-600">परिवार: {member.familyNumber}</p>
          )}

          {member.memberNumber && (
            <p className="text-[9px] font-mono text-green-600">ID: {member.memberNumber}</p>
          )}

          {member.dob && (
            <p className="text-[8px] text-gray-400">
              जन्म: {new Date(member.dob).toLocaleDateString('ne-NP')}
            </p>
          )}

          {isDeceased && member.dod && (
            <p className="text-[8px] text-red-400">
              मृत्यु: {new Date(member.dod).toLocaleDateString('ne-NP')}
            </p>
          )}
        </div>
      </div>
    );
  };

  // ============================================================
  // RENDER NODE (recursive)
  // ============================================================
  const renderNode = (memberId, visited, level = 0) => {
    const member = treeData?.memberMap[memberId];
    if (!member) return null;
    if (visited.has(memberId)) return null;
    visited.add(memberId);

    let spouse = null;
    if (member.spouseId && !visited.has(member.spouseId)) {
      spouse = treeData.memberMap[member.spouseId];
      if (spouse) visited.add(spouse.spouseId);
    }

    const childIds = Array.from(new Set(member.childIds)).filter(
      (id) => !visited.has(id)
    );

    const hasChildren = childIds.length > 0;
    const isExpanded = expandedNodes.has(memberId) || expandedNodes.has('all');

    const relationshipLabel =
      member.lineageRole === 'lineage_head'
        ? 'घरमुली'
        : member.relationship
        ? getNepaliLabel(member.relationship)
        : 'सदस्य';

    return (
      <div key={memberId} className="flex flex-col items-center relative">
        <div className="flex items-center">
          {renderMemberCard(member, relationshipLabel, false)}

          {spouse && (
            <>
              <div className="flex flex-col items-center mx-1.5">
                <div className="w-8 h-0.5 bg-pink-400" />
                <span className="text-[8px] text-pink-500 mt-0.5 whitespace-nowrap">विवाह</span>
              </div>
              {renderMemberCard(spouse, 'श्रीमती', true)}
            </>
          )}
        </div>

        {hasChildren && isExpanded && (
          <div className="flex flex-col items-center mt-0">
            <div className="w-0.5 h-6 bg-green-500" />

            <div className="relative flex justify-center items-start gap-6 pt-0">
              {childIds.length > 1 && (
                <div
                  className="absolute top-0 h-0.5 bg-green-500"
                  style={{ left: '60px', right: '60px' }}
                />
              )}

              {childIds.map((childId) => {
                if (visited.has(childId)) return null;
                return (
                  <div key={childId} className="relative flex flex-col items-center">
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-0.5 h-6 bg-green-500" />
                    <div className="mt-6">
                      {renderNode(childId, visited, level + 1)}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}

        {hasChildren && !isExpanded && (
          <button
            onClick={(e) => toggleNode(memberId, e)}
            className="mt-2 text-xs text-green-500 hover:text-green-600 flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full transition-colors"
          >
            {childIds.length} सन्तान हेर्नुहोस्
          </button>
        )}
      </div>
    );
  };

  // ============================================================
  // RENDER TREE
  // ============================================================
  const renderTree = () => {
    if (!treeData || treeData.rootIds.length === 0) {
      return (
        <div className="text-center py-12">
          <FaTree className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">पारिवारिक वृक्ष संरचना फेला परेन</p>
          <p className="text-sm text-gray-400">
            पारिवारिक वृक्ष निर्माण गर्न सम्बन्धहरू थप्नुहोस्
          </p>
        </div>
      );
    }

    const globalVisited = new Set();

    return (
      <div className="flex flex-wrap justify-center gap-12 w-full p-6 min-h-[400px]">
        {treeData.rootIds.map((rootId) => {
          if (globalVisited.has(rootId)) return null;
          return (
            <div key={rootId} className="flex flex-col items-center">
              {renderNode(rootId, globalVisited, 0)}
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
        <p className="text-sm text-gray-400">
          पारिवारिक वृक्ष निर्माण गर्न सदस्यहरू थप्नुहोस्
        </p>
      </div>
    );
  }

  return (
    <div className="w-full overflow-auto">
      <div className="text-sm text-gray-500 mb-4 text-center">
        <span className="bg-gray-100 px-3 py-1 rounded-full">
          कुल {treeData?.total || members.length} सदस्यहरू
        </span>
      </div>
      {renderTree()}
    </div>
  );
};

export default FamilyTreeView;