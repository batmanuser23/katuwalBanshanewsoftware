// // src/components/FamilyTreeView.jsx - UPDATED with Nepali labels

// import { useState, useMemo } from 'react';
// import { FaUser, FaHeart, FaTree, FaUsers, FaGenderless } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';

// // Nepali relationship labels
// const RELATIONSHIP_LABELS = {
//   'spouse': 'श्रीमान/श्रीमती',
//   'husband': 'श्रीमान',
//   'wife': 'श्रीमती',
//   'father': 'बुवा',
//   'mother': 'आमा',
//   'son': 'छोरा',
//   'daughter': 'छोरी',
//   'grandfather': 'हजुरबा',
//   'grandmother': 'हजुरआमा',
//   'grandson': 'नाति',
//   'granddaughter': 'नातिनी',
//   'brother': 'दाजु/भाइ',
//   'sister': 'दिदी/बहिनी',
//   'elderBrother': 'दाजु',
//   'youngerBrother': 'भाइ',
//   'elderSister': 'दिदी',
//   'youngerSister': 'बहिनी',
//   'member': 'सदस्य',
//   'lineage_head': 'घरमुली',
//   'lineage_member': 'सदस्य',
//   'family_head': 'घरमुली',
//   'child': 'सन्तान',
//   'parent': 'आमा/बुवा',
//   'sibling': 'दाजु/भाइ/दिदी/बहिनी',
//   'grandparent': 'हजुरबा/हजुरआमा',
//   'grandchild': 'नाति/नातिनी',
//   'other': 'अन्य'
// };

// const FamilyTreeView = ({ members, layout = 'horizontal', onMemberClick, familyId }) => {
//   const [expandedNodes, setExpandedNodes] = useState(new Set());
//   const [selectedNode, setSelectedNode] = useState(null);

//   // Get Nepali relationship label
//   const getNepaliLabel = (relationship) => {
//     if (!relationship) return 'सदस्य';
//     const label = RELATIONSHIP_LABELS[relationship];
//     return label || relationship.charAt(0).toUpperCase() + relationship.slice(1);
//   };

//   // Get gender symbol
//   const getGenderSymbol = (gender) => {
//     if (gender === 'male') return '♂';
//     if (gender === 'female') return '♀';
//     return '⚥';
//   };

//   // Build tree structure from flat members list
//   const treeData = useMemo(() => {
//     if (!members || members.length === 0) return null;

//     // Create member map
//     const memberMap = {};
//     members.forEach(m => {
//       memberMap[m._id] = { 
//         ...m, 
//         children: [], 
//         spouses: [],
//         parents: [],
//         level: 0
//       };
//     });

//     // Build relationships
//     members.forEach(m => {
//       const memberId = m._id;
      
//       // Father relationship
//       if (m.father) {
//         const fatherId = typeof m.father === 'object' ? m.father._id : m.father;
//         if (fatherId && memberMap[fatherId]) {
//           if (!memberMap[fatherId].children.includes(memberId)) {
//             memberMap[fatherId].children.push(memberId);
//           }
//           if (!memberMap[memberId].parents.includes(fatherId)) {
//             memberMap[memberId].parents.push(fatherId);
//           }
//         }
//       }
      
//       // Mother relationship
//       if (m.mother) {
//         const motherId = typeof m.mother === 'object' ? m.mother._id : m.mother;
//         if (motherId && memberMap[motherId]) {
//           if (!memberMap[motherId].children.includes(memberId)) {
//             memberMap[motherId].children.push(memberId);
//           }
//           if (!memberMap[memberId].parents.includes(motherId)) {
//             memberMap[memberId].parents.push(motherId);
//           }
//         }
//       }

//       // Spouse relationship
//       if (m.spouse) {
//         const spouseId = typeof m.spouse === 'object' ? m.spouse._id : m.spouse;
//         if (spouseId && memberMap[spouseId]) {
//           if (!memberMap[memberId].spouses.includes(spouseId)) {
//             memberMap[memberId].spouses.push(spouseId);
//           }
//           if (!memberMap[spouseId].spouses.includes(memberId)) {
//             memberMap[spouseId].spouses.push(memberId);
//           }
//         }
//       }

//       // Grandfather
//       if (m.grandfather) {
//         const grandId = typeof m.grandfather === 'object' ? m.grandfather._id : m.grandfather;
//         if (grandId && memberMap[grandId]) {
//           if (!memberMap[memberId].parents.includes(grandId)) {
//             memberMap[memberId].parents.push(grandId);
//           }
//         }
//       }

//       // Grandmother
//       if (m.grandmother) {
//         const grandId = typeof m.grandmother === 'object' ? m.grandmother._id : m.grandmother;
//         if (grandId && memberMap[grandId]) {
//           if (!memberMap[memberId].parents.includes(grandId)) {
//             memberMap[memberId].parents.push(grandId);
//           }
//         }
//       }
//     });

//     // Find root nodes (members with no parents)
//     let roots = Object.values(memberMap).filter(m => m.parents.length === 0);
    
//     // If no roots found, use members with lowest generation
//     if (roots.length === 0) {
//       const minGen = Math.min(...Object.values(memberMap).map(m => m.generation || 99));
//       roots = Object.values(memberMap).filter(m => (m.generation || 99) === minGen);
//     }

//     // If still no roots, use all members
//     if (roots.length === 0) {
//       roots = Object.values(memberMap);
//     }

//     return { rootIds: roots.map(r => r._id), memberMap };
//   }, [members]);

//   // Toggle node expansion
//   const toggleNode = (nodeId, e) => {
//     e.stopPropagation();
//     setExpandedNodes(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(nodeId)) {
//         newSet.delete(nodeId);
//       } else {
//         newSet.add(nodeId);
//       }
//       return newSet;
//     });
//   };

//   // Render a single member node
//   const renderMemberNode = (memberId, memberMap, level = 0, isHorizontal = true) => {
//     const member = memberMap[memberId];
//     if (!member) return null;

//     const hasChildren = member.children && member.children.length > 0;
//     const isExpanded = expandedNodes.has(memberId);
//     const hasSpouse = member.spouses && member.spouses.length > 0;
//     const isSelected = selectedNode === memberId;

//     // Get relationship label in Nepali
//     const relationshipLabel = member.lineageRole === 'lineage_head' ? 'घरमुली' : 
//                              member.relationship ? getNepaliLabel(member.relationship) : 'सदस्य';

//     return (
//       <div 
//         key={memberId} 
//         className={`flex ${isHorizontal ? 'flex-col items-center' : 'flex-row items-center'} relative`}
//         style={{ 
//           margin: isHorizontal ? '0 10px' : '10px 0',
//         }}
//       >
//         {/* Spouse connection line */}
//         {hasSpouse && (
//           <div className={`${isHorizontal ? 'absolute -top-4 left-1/2' : 'absolute -left-4 top-1/2'} 
//             w-8 h-0.5 bg-pink-300 border-t-2 border-dashed border-pink-300`} />
//         )}

//         {/* Member Card */}
//         <motion.div
//           initial={{ opacity: 0, scale: 0.8 }}
//           animate={{ opacity: 1, scale: 1 }}
//           transition={{ duration: 0.3, delay: level * 0.05 }}
//           className="relative"
//         >
//           <div 
//             className={`
//               bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 
//               border-2 ${member.isAlive !== false ? 'border-green-200 hover:border-green-400' : 'border-gray-300 hover:border-gray-400'}
//               cursor-pointer min-w-[120px] max-w-[160px]
//               ${isHorizontal ? 'mx-1' : 'my-1'}
//               ${isSelected ? 'ring-2 ring-green-500 ring-offset-2' : ''}
//             `}
//             onClick={() => {
//               setSelectedNode(memberId);
//               onMemberClick?.(member);
//             }}
//           >
//             <div className="p-3">
//               {/* Photo */}
//               <div className="w-14 h-14 mx-auto rounded-full overflow-hidden border-2 border-gray-200 mb-1.5 bg-gray-100">
//                 {member.photo ? (
//                   <img 
//                     src={member.photo} 
//                     alt={member.name}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.src = '/default-avatar.png';
//                     }}
//                   />
//                 ) : (
//                   <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
//                     <FaUser className="text-green-600 text-xl" />
//                   </div>
//                 )}
//               </div>

//               {/* Name */}
//               <div className="text-center">
//                 <p className="font-semibold text-sm text-gray-800 truncate" title={member.name}>
//                   {member.name}
//                 </p>
//                 {member.memberNumber && (
//                   <p className="text-xs text-green-600 font-mono">
//                     {member.memberNumber}
//                   </p>
//                 )}
//                 {member.generation && (
//                   <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
//                     पुस्ता {member.generation}
//                   </span>
//                 )}
//               </div>

//               {/* Relationship badge in Nepali */}
//               <div className="flex items-center justify-center mt-1">
//                 <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
//                   {relationshipLabel}
//                 </span>
//               </div>

//               {/* Gender indicator */}
//               <div className="flex items-center justify-center mt-0.5">
//                 <span className="text-xs text-gray-400">
//                   {getGenderSymbol(member.gender)}
//                 </span>
//               </div>

//               {/* Spouse indicator */}
//               {hasSpouse && (
//                 <div className="flex items-center justify-center mt-1 gap-1">
//                   <FaHeart className="text-red-400 text-[10px]" />
//                   <span className="text-[10px] text-gray-400">श्रीमान/श्रीमती</span>
//                 </div>
//               )}
//             </div>

//             {/* Expand/Collapse button */}
//             {hasChildren && (
//               <button
//                 onClick={(e) => toggleNode(memberId, e)}
//                 className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 
//                   bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center 
//                   shadow-md hover:bg-green-600 transition-colors text-sm z-10"
//               >
//                 {isExpanded ? '−' : '+'}
//               </button>
//             )}
//           </div>
//         </motion.div>

//         {/* Spouse nodes */}
//         {hasSpouse && isExpanded && (
//           <div className={`flex ${isHorizontal ? 'flex-row gap-2' : 'flex-col gap-2'} mt-2`}>
//             {member.spouses.map(spouseId => {
//               if (spouseId === memberId) return null;
//               return renderMemberNode(spouseId, memberMap, level + 1, isHorizontal);
//             })}
//           </div>
//         )}

//         {/* Children */}
//         {hasChildren && isExpanded && (
//           <div className={`
//             flex flex-wrap justify-center gap-4 mt-4 pt-4 relative
//             ${isHorizontal ? 'flex-row' : 'flex-col'}
//           `}>
//             {/* Connecting line from parent to children */}
//             <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-gray-300 -mt-4" />
            
//             <div className="flex flex-wrap justify-center gap-4">
//               {member.children.map(childId => {
//                 return renderMemberNode(childId, memberMap, level + 1, isHorizontal);
//               })}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Render the entire tree
//   const renderTree = () => {
//     if (!treeData || !treeData.rootIds || treeData.rootIds.length === 0) {
//       return (
//         <div className="text-center py-12">
//           <FaTree className="text-4xl text-gray-300 mx-auto mb-3" />
//           <p className="text-gray-500">पारिवारिक वृक्ष संरचना फेला परेन</p>
//           <p className="text-sm text-gray-400">पारिवारिक वृक्ष निर्माण गर्न सम्बन्धहरू थप्नुहोस्</p>
//         </div>
//       );
//     }

//     const isHorizontal = layout === 'horizontal';

//     return (
//       <div className={`flex ${isHorizontal ? 'flex-row flex-wrap justify-center gap-8' : 'flex-col items-center'} w-full min-h-[400px] p-4`}>
//         {treeData.rootIds.map((rootId, index) => (
//           <div key={rootId} className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'} items-start gap-4`}>
//             {renderMemberNode(rootId, treeData.memberMap, 0, isHorizontal)}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   if (!members || members.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <FaUsers className="text-4xl text-gray-300 mx-auto mb-3" />
//         <p className="text-gray-500">यस परिवारमा कुनै सदस्य छैनन्</p>
//         <p className="text-sm text-gray-400">पारिवारिक वृक्ष निर्माण गर्न सदस्यहरू थप्नुहोस्</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full overflow-auto">
//       <div className="text-sm text-gray-500 mb-2 text-center">
//         <span className="bg-gray-100 px-3 py-1 rounded-full">
//           कुल {members.length} सदस्यहरू
//         </span>
//       </div>
//       {renderTree()}
//     </div>
//   );
// };

// export default FamilyTreeView;


// // src/components/FamilyTreeView.jsx - UPDATED WITH NEW CARD DESIGN

// import { useState, useMemo } from 'react';
// import { FaUser, FaHeart, FaTree, FaUsers, FaGenderless, FaCamera } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';

// // Nepali relationship labels
// const RELATIONSHIP_LABELS = {
//   'spouse': 'श्रीमान/श्रीमती',
//   'husband': 'श्रीमान',
//   'wife': 'श्रीमती',
//   'father': 'बुबा',
//   'mother': 'आमा',
//   'son': 'छोरा',
//   'daughter': 'छोरी',
//   'grandfather': 'हजुरबा',
//   'grandmother': 'हजुरआमा',
//   'grandson': 'नाति',
//   'granddaughter': 'नातिनी',
//   'brother': 'दाजु/भाइ',
//   'sister': 'दिदी/बहिनी',
//   'elderBrother': 'दाजु',
//   'youngerBrother': 'भाइ',
//   'elderSister': 'दिदी',
//   'youngerSister': 'बहिनी',
//   'member': 'सदस्य',
//   'lineage_head': 'घरमुली',
//   'lineage_member': 'सदस्य',
//   'family_head': 'घरमुली',
//   'child': 'सन्तान',
//   'parent': 'आमा/बुवा',
//   'sibling': 'दाजु/भाइ/दिदी/बहिनी',
//   'grandparent': 'हजुरबा/हजुरआमा',
//   'grandchild': 'नाति/नातिनी',
//   'other': 'अन्य'
// };

// const FamilyTreeView = ({ members, layout = 'horizontal', onMemberClick, familyId, showPhotos = true }) => {
//   const [expandedNodes, setExpandedNodes] = useState(new Set());
//   const [selectedNode, setSelectedNode] = useState(null);

//   // Get Nepali relationship label
//   const getNepaliLabel = (relationship) => {
//     if (!relationship) return 'सदस्य';
//     const label = RELATIONSHIP_LABELS[relationship];
//     return label || relationship.charAt(0).toUpperCase() + relationship.slice(1);
//   };

//   // Get gender symbol
//   const getGenderSymbol = (gender) => {
//     if (gender === 'male') return '♂';
//     if (gender === 'female') return '♀';
//     return '⚥';
//   };

//   // Build tree structure from flat members list
//   const treeData = useMemo(() => {
//     if (!members || members.length === 0) return null;

//     const memberMap = {};
//     members.forEach(m => {
//       memberMap[m._id] = { 
//         ...m, 
//         children: [], 
//         spouses: [],
//         parents: [],
//         level: 0
//       };
//     });

//     // Build relationships
//     members.forEach(m => {
//       const memberId = m._id;
      
//       if (m.father) {
//         const fatherId = typeof m.father === 'object' ? m.father._id : m.father;
//         if (fatherId && memberMap[fatherId]) {
//           if (!memberMap[fatherId].children.includes(memberId)) {
//             memberMap[fatherId].children.push(memberId);
//           }
//           if (!memberMap[memberId].parents.includes(fatherId)) {
//             memberMap[memberId].parents.push(fatherId);
//           }
//         }
//       }
      
//       if (m.mother) {
//         const motherId = typeof m.mother === 'object' ? m.mother._id : m.mother;
//         if (motherId && memberMap[motherId]) {
//           if (!memberMap[motherId].children.includes(memberId)) {
//             memberMap[motherId].children.push(memberId);
//           }
//           if (!memberMap[memberId].parents.includes(motherId)) {
//             memberMap[memberId].parents.push(motherId);
//           }
//         }
//       }

//       if (m.spouse) {
//         const spouseId = typeof m.spouse === 'object' ? m.spouse._id : m.spouse;
//         if (spouseId && memberMap[spouseId]) {
//           if (!memberMap[memberId].spouses.includes(spouseId)) {
//             memberMap[memberId].spouses.push(spouseId);
//           }
//           if (!memberMap[spouseId].spouses.includes(memberId)) {
//             memberMap[spouseId].spouses.push(memberId);
//           }
//         }
//       }
//     });

//     let roots = Object.values(memberMap).filter(m => m.parents.length === 0);
    
//     if (roots.length === 0) {
//       const minGen = Math.min(...Object.values(memberMap).map(m => m.generation || 99));
//       roots = Object.values(memberMap).filter(m => (m.generation || 99) === minGen);
//     }

//     if (roots.length === 0) {
//       roots = Object.values(memberMap);
//     }

//     return { rootIds: roots.map(r => r._id), memberMap };
//   }, [members]);

//   // Toggle node expansion
//   const toggleNode = (nodeId, e) => {
//     e.stopPropagation();
//     setExpandedNodes(prev => {
//       const newSet = new Set(prev);
//       if (newSet.has(nodeId)) {
//         newSet.delete(nodeId);
//       } else {
//         newSet.add(nodeId);
//       }
//       return newSet;
//     });
//   };

//   // ⭐ UPDATED: Render member card with new design (per reference image)
//   const renderMemberCard = (member, relationshipLabel = 'सदस्य', isSpouse = false) => {
//     if (!member) return null;

//     const isDeceased = !member.isAlive;
//     const hasPhoto = member.photo && member.photo.trim() !== '';
//     const genderIcon = member.gender === 'male' ? '👨' : member.gender === 'female' ? '👩' : '👤';

//     return (
//       <div 
//         className={`
//           bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 
//           border-2 ${isDeceased ? 'border-gray-300' : isSpouse ? 'border-pink-300' : 'border-green-200'}
//           ${hasPhoto ? 'w-52' : 'w-48'}
//           hover:border-green-400
//           ${isSpouse ? 'bg-pink-50/80' : ''}
//           cursor-pointer
//         `}
//         onClick={() => {
//           setSelectedNode(member._id);
//           onMemberClick?.(member);
//         }}
//       >
//         {/* Photo Section */}
//         <div className="relative">
//           {hasPhoto ? (
//             <img 
//               src={member.photo} 
//               alt={member.name}
//               className="w-full h-36 object-cover rounded-t-xl"
//               onError={(e) => {
//                 e.target.src = '/default-avatar.png';
//               }}
//             />
//           ) : (
//             <div className={`
//               w-full h-36 flex items-center justify-center rounded-t-xl
//               ${isDeceased ? 'bg-gray-200' : isSpouse ? 'bg-pink-100' : 'bg-gradient-to-br from-green-100 to-emerald-100'}
//             `}>
//               <div className="text-center">
//                 <FaUser className={`text-5xl ${isDeceased ? 'text-gray-400' : 'text-green-400'} mx-auto`} />
//                 <span className="text-xs text-gray-500 mt-1 block">फोटो छैन</span>
//               </div>
//             </div>
//           )}
          
//           {/* Relationship Badge */}
//           <div className="absolute top-2 left-2">
//             <span className={`
//               text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm
//               ${isSpouse ? 'bg-pink-500/90 text-white' : 'bg-white/90 text-gray-700'}
//             `}>
//               {relationshipLabel}
//             </span>
//           </div>
          
//           {/* Deceased Badge */}
//           {isDeceased && (
//             <div className="absolute top-2 right-2">
//               <span className="text-[10px] font-medium bg-red-500/90 text-white px-2 py-0.5 rounded-full shadow-sm">
//                 ✝ मृत
//               </span>
//             </div>
//           )}
//         </div>
        
//         {/* Content Section */}
//         <div className="p-3 space-y-1">
//           <p className="font-semibold text-sm text-gray-800 truncate" title={member.name}>
//             {member.name}
//           </p>
          
//           {member.surname && (
//             <p className="text-[10px] text-gray-500 truncate">{member.surname}</p>
//           )}
          
//           {/* Bansha Number */}
//           {member.vanshaGenerationNumber && (
//             <p className="text-[10px] text-gray-600">
//               वंश नं: {member.vanshaGenerationNumber}
//             </p>
//           )}
          
//           {/* Family Number */}
//           {member.familyNumber && (
//             <p className="text-[10px] text-gray-600">
//               परिवार नं: {member.familyNumber}
//             </p>
//           )}
          
//           {/* Member ID */}
//           {member.memberNumber && (
//             <p className="text-[10px] font-mono text-green-600">
//               ID: {member.memberNumber}
//             </p>
//           )}
          
//           {/* Date of Birth */}
//           {member.dob && (
//             <p className="text-[9px] text-gray-400">
//               जन्म: {new Date(member.dob).toLocaleDateString('ne-NP')}
//             </p>
//           )}
          
//           {/* Date of Death */}
//           {isDeceased && member.dod && (
//             <p className="text-[9px] text-red-400">
//               मृत्यु: {new Date(member.dod).toLocaleDateString('ne-NP')}
//             </p>
//           )}
          
//           {/* Spouse indicator */}
//           {member.spouse && !isSpouse && (
//             <div className="flex items-center gap-1 mt-1">
//               <FaHeart className="text-red-400 text-[8px]" />
//               <span className="text-[8px] text-gray-400">विवाहित</span>
//             </div>
//           )}
//         </div>
        
//         {/* Expand/Collapse button for children */}
//         {member.children && member.children.length > 0 && (
//           <button
//             onClick={(e) => toggleNode(member._id, e)}
//             className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 
//               bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center 
//               shadow-md hover:bg-green-600 transition-colors text-[10px] z-10"
//           >
//             {expandedNodes.has(member._id) ? '−' : '+'}
//           </button>
//         )}
//       </div>
//     );
//   };

//   // ⭐ UPDATED: Render family node with proper spouse handling
//   const renderFamilyNode = (memberId, memberMap, level = 0, isHorizontal = true) => {
//     const member = memberMap[memberId];
//     if (!member) return null;

//     const hasChildren = member.children && member.children.length > 0;
//     const isExpanded = expandedNodes.has(memberId);
//     const hasSpouse = member.spouses && member.spouses.length > 0;
    
//     // Get relationship label
//     let relationshipLabel = member.lineageRole === 'lineage_head' ? 'घरमुली' : 
//                            member.relationship ? getNepaliLabel(member.relationship) : 'सदस्य';
    
//     // If this member is a spouse, override label
//     const isSpouse = member.spouses && member.spouses.length > 0 && 
//                      member.parents.length === 0 && 
//                      member.children.length === 0;

//     return (
//       <div 
//         key={memberId} 
//         className={`flex ${isHorizontal ? 'flex-col items-center' : 'flex-row items-center'} relative`}
//       >
//         {/* Spouse connection */}
//         {hasSpouse && (
//           <div className={`${isHorizontal ? 'absolute -top-4 left-1/2' : 'absolute -left-4 top-1/2'} 
//             w-8 h-0.5 bg-pink-300 border-t-2 border-dashed border-pink-300`} />
//         )}

//         {/* Main Member Card */}
//         {renderMemberCard(member, relationshipLabel, isSpouse)}

//         {/* Spouse side-by-side */}
//         {hasSpouse && isExpanded && (
//           <div className={`flex ${isHorizontal ? 'flex-row gap-2 mt-2' : 'flex-col gap-2 ml-2'}`}>
//             {member.spouses.map(spouseId => {
//               if (spouseId === memberId) return null;
//               const spouse = memberMap[spouseId];
//               if (!spouse) return null;
//               return renderMemberCard(spouse, 'श्रीमती', true);
//             })}
//           </div>
//         )}

//         {/* Children */}
//         {hasChildren && isExpanded && (
//           <div className={`
//             flex flex-wrap justify-center gap-4 mt-4 pt-4 relative
//             ${isHorizontal ? 'flex-row' : 'flex-col'}
//           `}>
//             {/* Connecting line */}
//             <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-green-300 -mt-4" />
            
//             <div className="flex flex-wrap justify-center gap-4">
//               {member.children.map(childId => {
//                 return renderFamilyNode(childId, memberMap, level + 1, isHorizontal);
//               })}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Render the entire tree
//   const renderTree = () => {
//     if (!treeData || !treeData.rootIds || treeData.rootIds.length === 0) {
//       return (
//         <div className="text-center py-12">
//           <FaTree className="text-4xl text-gray-300 mx-auto mb-3" />
//           <p className="text-gray-500">पारिवारिक वृक्ष संरचना फेला परेन</p>
//           <p className="text-sm text-gray-400">पारिवारिक वृक्ष निर्माण गर्न सम्बन्धहरू थप्नुहोस्</p>
//         </div>
//       );
//     }

//     const isHorizontal = layout === 'horizontal';

//     return (
//       <div className={`flex ${isHorizontal ? 'flex-row flex-wrap justify-center gap-8' : 'flex-col items-center'} w-full min-h-[400px] p-4`}>
//         {treeData.rootIds.map((rootId, index) => (
//           <div key={rootId} className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'} items-start gap-4`}>
//             {renderFamilyNode(rootId, treeData.memberMap, 0, isHorizontal)}
//           </div>
//         ))}
//       </div>
//     );
//   };

//   if (!members || members.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <FaUsers className="text-4xl text-gray-300 mx-auto mb-3" />
//         <p className="text-gray-500">यस परिवारमा कुनै सदस्य छैनन्</p>
//         <p className="text-sm text-gray-400">पारिवारिक वृक्ष निर्माण गर्न सदस्यहरू थप्नुहोस्</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full overflow-auto">
//       <div className="text-sm text-gray-500 mb-2 text-center">
//         <span className="bg-gray-100 px-3 py-1 rounded-full">
//           कुल {members.length} सदस्यहरू
//         </span>
//       </div>
//       {renderTree()}
//     </div>
//   );
// };

// export default FamilyTreeView;





// src/components/FamilyTreeView.jsx - FINAL MERGED PRODUCTION VERSION
// = COMPLETE.txt's recursion safety + MERGED.txt's rich display

import { useState, useMemo, useCallback } from 'react';
import { FaUser, FaHeart, FaTree, FaUsers } from 'react-icons/fa';

/* ============================================================
   NEPALI RELATIONSHIP LABELS (extended set)
   ============================================================ */
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
  parent: 'आमा/बुबा',
  sibling: 'दाजु/भाइ/दिदी/बहिनी',
  grandparent: 'हजुरबा/हजुरआमा',
  grandchild: 'नाति/नातिनी',
  other: 'अन्य',
};

const FamilyTreeView = ({
  members,
  layout = 'horizontal',
  onMemberClick,
  familyId,
  showPhotos = true,
  hideMarriedDaughterPhoto = true,
}) => {
  const [expandedNodes, setExpandedNodes] = useState(new Set());

  const getNepaliLabel = useCallback((relationship) => {
    if (!relationship) return 'सदस्य';
    return RELATIONSHIP_LABELS[relationship] || relationship;
  }, []);

  /* ============================================================
     MARRIED DAUGHTER DETECTION
     ============================================================ */
  const isMarriedDaughter = useCallback((member) => {
    if (member.gender !== 'female') return false;
    if (member.maritalStatus === 'married') return true;
    if (member.husband) return true;
    if (member.spouse) return true;
    return false;
  }, []);

  /* ============================================================
     BUILD TREE
     ============================================================ */
  const treeData = useMemo(() => {
    if (!members || members.length === 0) return null;

    const memberMap = {};
    members.forEach((m) => {
      memberMap[m._id] = {
        ...m,
        childIds: [],
        spouseIds: [],
        parentIds: [],
        isLineageSource: true,
      };
    });

    const spouseIdSet = new Set();

    /* ---- Helper: add bidirectional spouse ---- */
    const addSpouse = (aId, bId) => {
      if (!aId || !bId || aId === bId) return;
      if (!memberMap[aId] || !memberMap[bId]) return;
      if (!memberMap[aId].spouseIds.includes(bId)) memberMap[aId].spouseIds.push(bId);
      if (!memberMap[bId].spouseIds.includes(aId)) memberMap[bId].spouseIds.push(aId);
      spouseIdSet.add(aId);
      spouseIdSet.add(bId);
    };

    members.forEach((m) => {
      const memberId = m._id;

      // Father
      if (m.father) {
        const id = typeof m.father === 'object' ? m.father._id : m.father;
        if (id && memberMap[id] && id !== memberId) {
          if (!memberMap[id].childIds.includes(memberId)) memberMap[id].childIds.push(memberId);
          if (!memberMap[memberId].parentIds.includes(id)) memberMap[memberId].parentIds.push(id);
        }
      }

      // Mother
      if (m.mother) {
        const id = typeof m.mother === 'object' ? m.mother._id : m.mother;
        if (id && memberMap[id] && id !== memberId) {
          if (!memberMap[id].childIds.includes(memberId)) memberMap[id].childIds.push(memberId);
          if (!memberMap[memberId].parentIds.includes(id)) memberMap[memberId].parentIds.push(id);
        }
      }

      // Spouse
      if (m.spouse) {
        const id = typeof m.spouse === 'object' ? m.spouse._id : m.spouse;
        addSpouse(memberId, id);
      }

      // Husband
      if (m.husband) {
        const id = typeof m.husband === 'object' ? m.husband._id : m.husband;
        addSpouse(memberId, id);
      }

      // Wife (singular)
      if (m.wife) {
        const id = typeof m.wife === 'object' ? m.wife._id : m.wife;
        addSpouse(memberId, id);
      }

      // Multiple wives
      if (Array.isArray(m.wives)) {
        m.wives.forEach((w) => {
          const id = typeof w === 'object' ? w._id : w;
          addSpouse(memberId, id);
        });
      }
    });

    // Deduplicate all arrays
    Object.values(memberMap).forEach((m) => {
      m.childIds = [...new Set(m.childIds)];
      m.spouseIds = [...new Set(m.spouseIds)];
      m.parentIds = [...new Set(m.parentIds)];
    });

    /* ---- Determine lineage source (blood line vs married-in) ---- */
    Object.values(memberMap).forEach((m) => {
      if (m.parentIds.length > 0) {
        m.isLineageSource = true;
      } else if (m.childIds.length > 0) {
        m.isLineageSource = true;
      } else if (spouseIdSet.has(m._id)) {
        m.isLineageSource = false;
      } else {
        m.isLineageSource = true;
      }
    });

    /* ---- Find roots: lineage sources with no parents ---- */
    let roots = Object.values(memberMap).filter(
      (m) => m.parentIds.length === 0 && m.isLineageSource
    );

    // Fallback 1: any member with no parents
    if (roots.length === 0) {
      roots = Object.values(memberMap).filter((m) => m.parentIds.length === 0);
    }

    // Fallback 2: members with lowest generation
    if (roots.length === 0) {
      const minGen = Math.min(...Object.values(memberMap).map((m) => m.generation || 99));
      roots = Object.values(memberMap).filter((m) => (m.generation || 99) === minGen);
    }

    // Fallback 3: all members
    if (roots.length === 0) {
      roots = Object.values(memberMap);
    }

    // ⭐ Sort roots by generation ascending (oldest generation at top)
    roots.sort((a, b) => (a.generation || 1) - (b.generation || 1));

    return {
      rootIds: roots.map((r) => r._id),
      memberMap,
    };
  }, [members]);

  /* ============================================================
     TOGGLE
     ============================================================ */
  const toggleNode = useCallback((nodeId, e) => {
    e.stopPropagation();
    setExpandedNodes((prev) => {
      const next = new Set(prev);
      next.has(nodeId) ? next.delete(nodeId) : next.add(nodeId);
      return next;
    });
  }, []);

  /* ============================================================
     MEMBER CARD
     ============================================================ */
  const renderMemberCard = useCallback(
    (member, relationshipLabel = 'सदस्य', isSpouse = false, wifeIndex = -1) => {
      if (!member) return null;

      const isDeceased = !member.isAlive;
      const shouldHidePhoto = hideMarriedDaughterPhoto && isMarriedDaughter(member);
      const hasPhoto = member.photo && member.photo.trim() !== '' && !shouldHidePhoto;

      const wifeLabel =
        wifeIndex >= 0
          ? wifeIndex === 0
            ? 'श्रीमती'
            : `श्रीमती ${wifeIndex + 1}`
          : 'श्रीमती';

      return (
        <div
          key={member._id}
          className={`
            bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 
            border-2 ${isDeceased ? 'border-gray-300' : isSpouse ? 'border-pink-300' : 'border-green-200'}
            ${hasPhoto ? 'w-52' : 'w-44'}
            hover:border-green-400
            ${isSpouse ? 'bg-pink-50/80' : ''}
            cursor-pointer
          `}
          onClick={() => onMemberClick?.(member)}
        >
          {/* Photo section */}
          <div className="relative">
            {hasPhoto ? (
              <img
                src={member.photo}
                alt={member.name}
                className="w-full h-32 object-cover rounded-t-xl"
                onError={(e) => {
                  e.target.src = '/default-avatar.png';
                }}
              />
            ) : (
              <div
                className={`
                  w-full h-32 flex items-center justify-center rounded-t-xl
                  ${isDeceased ? 'bg-gray-200' : isSpouse ? 'bg-pink-100' : 'bg-gradient-to-br from-green-100 to-emerald-100'}
                `}
              >
                <div className="text-center">
                  <FaUser
                    className={`text-4xl ${isDeceased ? 'text-gray-400' : 'text-green-400'} mx-auto`}
                  />
                  {shouldHidePhoto && (
                    <span className="text-[10px] text-gray-500 mt-1 block">विवाहित छोरी</span>
                  )}
                </div>
              </div>
            )}

            {/* Relationship badge */}
            <div className="absolute top-2 left-2">
              <span
                className={`
                  text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm
                  ${isSpouse ? 'bg-pink-500/90 text-white' : 'bg-white/90 text-gray-700'}
                `}
              >
                {isSpouse ? wifeLabel : relationshipLabel}
              </span>
            </div>

            {/* Deceased badge */}
            {isDeceased && (
              <div className="absolute top-2 right-2">
                <span className="text-[10px] font-medium bg-red-500/90 text-white px-2 py-0.5 rounded-full shadow-sm">
                  ✝ मृत
                </span>
              </div>
            )}

            {/* Person status badge */}
            {member.personStatus && member.personStatus !== 'known' && (
              <div className="absolute bottom-2 right-2">
                <span className="text-[9px] font-medium bg-amber-500/90 text-white px-1.5 py-0.5 rounded-full">
                  {member.personStatus === 'missing'
                    ? 'हराएको'
                    : member.personStatus === 'name_unknown'
                    ? 'नाम अज्ञात'
                    : member.personStatus}
                </span>
              </div>
            )}
          </div>

          {/* Content section */}
          <div className="p-3 space-y-1">
            <p className="font-semibold text-sm text-gray-800 truncate" title={member.name}>
              {member.name}
            </p>

            {member.surname && (
              <p className="text-[10px] text-gray-500 truncate">{member.surname}</p>
            )}

            {member.vanshaGenerationNumber && (
              <p className="text-[10px] text-gray-600">
                वंश नं: {member.vanshaGenerationNumber}
              </p>
            )}

            {member.familyNumber && (
              <p className="text-[10px] text-gray-600">
                परिवार नं: {member.familyNumber}
              </p>
            )}

            {member.generation && (
              <p className="text-[10px] text-gray-600">पुस्ता: {member.generation}</p>
            )}

            {member.memberNumber && (
              <p className="text-[10px] font-mono text-green-600">ID: {member.memberNumber}</p>
            )}

            {member.dob && (
              <p className="text-[9px] text-gray-400">
                जन्म: {new Date(member.dob).toLocaleDateString('ne-NP')}
              </p>
            )}

            {isDeceased && member.dod && (
              <p className="text-[9px] text-red-400">
                मृत्यु: {new Date(member.dod).toLocaleDateString('ne-NP')}
              </p>
            )}

            {/* Spouse count indicator */}
            {member.spouseIds && member.spouseIds.length > 0 && !isSpouse && (
              <div className="flex items-center gap-1 mt-1">
                <FaHeart className="text-red-400 text-[8px]" />
                <span className="text-[8px] text-gray-400">
                  {member.spouseIds.length > 1
                    ? `${member.spouseIds.length} श्रीमती`
                    : 'विवाहित'}
                </span>
              </div>
            )}
          </div>

          {/* Expand button — only for lineage sources with children */}
          {member.childIds &&
            member.childIds.length > 0 &&
            member.isLineageSource !== false && (
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
    },
    [
      expandedNodes,
      hideMarriedDaughterPhoto,
      isMarriedDaughter,
      onMemberClick,
      toggleNode,
    ]
  );

  /* ============================================================
     FAMILY NODE (recursive with shared visited set)
     ============================================================ */
  const renderFamilyNode = useCallback(
    (memberId, memberMap, visitedSet, level = 0, isHorizontal = true) => {
      // Skip if already rendered
      if (visitedSet.has(memberId)) return null;
      visitedSet.add(memberId);

      const member = memberMap[memberId];
      if (!member) return null;

      const isExpanded = expandedNodes.has(memberId);
      const hasSpouses = member.spouseIds && member.spouseIds.length > 0;
      const hasChildren = member.childIds && member.childIds.length > 0;
      const isSpouse = member.isLineageSource === false;

      const relationshipLabel =
        member.lineageRole === 'lineage_head'
          ? 'घरमुली'
          : member.relationship
          ? getNepaliLabel(member.relationship)
          : 'सदस्य';

      // Filter visible spouses & children
      const visibleSpouses = (member.spouseIds || []).filter(
        (sid) => sid !== memberId && !visitedSet.has(sid) && memberMap[sid]
      );
      const visibleChildren = (member.childIds || []).filter(
        (cid) => !visitedSet.has(cid) && memberMap[cid]
      );

      return (
        <div
          key={memberId}
          className={`flex ${isHorizontal ? 'flex-col items-center' : 'flex-row items-center'} relative`}
        >
          {/* Main member card */}
          {renderMemberCard(member, relationshipLabel, isSpouse)}

          {/* Spouses — always visible (not gated by isExpanded) */}
          {hasSpouses && visibleSpouses.length > 0 && (
            <div
              className={`flex ${isHorizontal ? 'flex-row gap-2 mt-2' : 'flex-col gap-2 ml-2'} flex-wrap justify-center`}
            >
              {visibleSpouses.map((spouseId, index) => {
                if (visitedSet.has(spouseId)) return null;
                visitedSet.add(spouseId);

                const spouse = memberMap[spouseId];
                if (!spouse) return null;

                return (
                  <div key={spouseId} className="relative">
                    <div
                      className={`absolute ${
                        isHorizontal ? '-top-2 left-1/2 w-0.5 h-2' : '-left-2 top-1/2 h-0.5 w-2'
                      } bg-pink-300`}
                    />
                    {renderMemberCard(spouse, 'श्रीमती', true, index)}
                  </div>
                );
              })}
            </div>
          )}

          {/* Children — only for lineage sources, only when expanded */}
          {hasChildren &&
            visibleChildren.length > 0 &&
            isExpanded &&
            member.isLineageSource !== false && (
              <div
                className={`
                  flex flex-wrap justify-center gap-4 mt-4 pt-4 relative
                  ${isHorizontal ? 'flex-row' : 'flex-col'}
                `}
              >
                <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-green-300 -mt-4" />

                {visibleChildren.length > 1 && (
                  <div className="absolute top-0 left-[10%] right-[10%] h-0.5 bg-green-300" />
                )}

                <div className="flex flex-wrap justify-center gap-4">
                  {visibleChildren.map((childId) =>
                    renderFamilyNode(childId, memberMap, visitedSet, level + 1, isHorizontal)
                  )}
                </div>
              </div>
            )}
        </div>
      );
    },
    [expandedNodes, getNepaliLabel, renderMemberCard]
  );

  /* ============================================================
     RENDER TREE
     ============================================================ */
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

    // Fresh visited set per render pass
    const visitedSet = new Set();
    const isHorizontal = layout === 'horizontal';

    return (
      <div
        className={`flex ${
          isHorizontal ? 'flex-row flex-wrap justify-center gap-8' : 'flex-col items-center'
        } w-full min-h-[400px] p-4`}
      >
        {treeData.rootIds.map((rootId) => {
          if (visitedSet.has(rootId)) return null;
          return (
            <div
              key={rootId}
              className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'} items-start gap-4`}
            >
              {renderFamilyNode(rootId, treeData.memberMap, visitedSet, 0, isHorizontal)}
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



// // src/components/FamilyTreeView.jsx - MERGED & IMPROVED
// // = COMPLETE.txt's visitedSet safety + ULTIMATE.txt's rich display

// import { useState, useMemo, useCallback } from 'react';
// import { FaUser, FaHeart, FaTree, FaUsers } from 'react-icons/fa';

// /* ============================================================
//    NEPALI RELATIONSHIP LABELS (extended set)
//    ============================================================ */
// const RELATIONSHIP_LABELS = {
//   spouse: 'श्रीमान/श्रीमती',
//   husband: 'श्रीमान',
//   wife: 'श्रीमती',
//   father: 'बुबा',
//   mother: 'आमा',
//   son: 'छोरा',
//   daughter: 'छोरी',
//   grandfather: 'हजुरबा',
//   grandmother: 'हजुरआमा',
//   grandson: 'नाति',
//   granddaughter: 'नातिनी',
//   brother: 'दाजु/भाइ',
//   sister: 'दिदी/बहिनी',
//   elderBrother: 'दाजु',
//   youngerBrother: 'भाइ',
//   elderSister: 'दिदी',
//   youngerSister: 'बहिनी',
//   member: 'सदस्य',
//   lineage_head: 'घरमुली',
//   lineage_member: 'सदस्य',
//   family_head: 'घरमुली',
//   child: 'सन्तान',
//   parent: 'आमा/बुबा',
//   sibling: 'दाजु/भाइ/दिदी/बहिनी',
//   grandparent: 'हजुरबा/हजुरआमा',
//   grandchild: 'नाति/नातिनी',
//   other: 'अन्य',
// };

// const FamilyTreeView = ({
//   members,
//   layout = 'horizontal',
//   onMemberClick,
//   familyId,
//   showPhotos = true,
//   hideMarriedDaughterPhoto = true,
// }) => {
//   const [expandedNodes, setExpandedNodes] = useState(new Set());
//   const [selectedNode, setSelectedNode] = useState(null);

//   const getNepaliLabel = useCallback((relationship) => {
//     if (!relationship) return 'सदस्य';
//     return RELATIONSHIP_LABELS[relationship] || relationship;
//   }, []);

//   /* ============================================================
//      MARRIED DAUGHTER DETECTION
//      ============================================================ */
//   const isMarriedDaughter = useCallback((member) => {
//     if (member.gender !== 'female') return false;
//     if (member.maritalStatus === 'married') return true;
//     if (member.husband) return true;
//     if (member.spouse) return true;
//     return false;
//   }, []);

//   /* ============================================================
//      BUILD TREE (uses childIds/spouseIds/parentIds to avoid
//      clashing with Mongoose document array fields)
//      ============================================================ */
//   const treeData = useMemo(() => {
//     if (!members || members.length === 0) return null;

//     const memberMap = {};
//     members.forEach((m) => {
//       memberMap[m._id] = {
//         ...m,
//         childIds: [],
//         spouseIds: [],
//         parentIds: [],
//         isLineageSource: true,
//       };
//     });

//     const spouseIdSet = new Set();

//     /* ---- Add bidirectional spouse ---- */
//     const addSpouse = (aId, bId) => {
//       if (!aId || !bId || aId === bId) return;
//       if (!memberMap[aId] || !memberMap[bId]) return;
//       if (!memberMap[aId].spouseIds.includes(bId)) memberMap[aId].spouseIds.push(bId);
//       if (!memberMap[bId].spouseIds.includes(aId)) memberMap[bId].spouseIds.push(aId);
//       spouseIdSet.add(aId);
//       spouseIdSet.add(bId);
//     };

//     members.forEach((m) => {
//       const memberId = m._id;

//       // Father
//       if (m.father) {
//         const id = typeof m.father === 'object' ? m.father._id : m.father;
//         if (id && memberMap[id] && id !== memberId) {
//           if (!memberMap[id].childIds.includes(memberId)) memberMap[id].childIds.push(memberId);
//           if (!memberMap[memberId].parentIds.includes(id)) memberMap[memberId].parentIds.push(id);
//         }
//       }

//       // Mother
//       if (m.mother) {
//         const id = typeof m.mother === 'object' ? m.mother._id : m.mother;
//         if (id && memberMap[id] && id !== memberId) {
//           if (!memberMap[id].childIds.includes(memberId)) memberMap[id].childIds.push(memberId);
//           if (!memberMap[memberId].parentIds.includes(id)) memberMap[memberId].parentIds.push(id);
//         }
//       }

//       // Spouse
//       if (m.spouse) {
//         const id = typeof m.spouse === 'object' ? m.spouse._id : m.spouse;
//         addSpouse(memberId, id);
//       }

//       // Husband
//       if (m.husband) {
//         const id = typeof m.husband === 'object' ? m.husband._id : m.husband;
//         addSpouse(memberId, id);
//       }

//       // Wife (singular)
//       if (m.wife) {
//         const id = typeof m.wife === 'object' ? m.wife._id : m.wife;
//         addSpouse(memberId, id);
//       }

//       // Multiple wives
//       if (Array.isArray(m.wives)) {
//         m.wives.forEach((w) => {
//           const id = typeof w === 'object' ? w._id : w;
//           addSpouse(memberId, id);
//         });
//       }
//     });

//     // Deduplicate
//     Object.values(memberMap).forEach((m) => {
//       m.childIds = [...new Set(m.childIds)];
//       m.spouseIds = [...new Set(m.spouseIds)];
//       m.parentIds = [...new Set(m.parentIds)];
//     });

//     // Determine lineage source
//     Object.values(memberMap).forEach((m) => {
//       if (m.parentIds.length > 0) {
//         m.isLineageSource = true;
//       } else if (m.childIds.length > 0) {
//         m.isLineageSource = true;
//       } else if (spouseIdSet.has(m._id)) {
//         m.isLineageSource = false;
//       } else {
//         m.isLineageSource = true;
//       }
//     });

//     // Find roots
//     let roots = Object.values(memberMap).filter(
//       (m) => m.parentIds.length === 0 && m.isLineageSource
//     );

//     if (roots.length === 0) {
//       roots = Object.values(memberMap).filter((m) => m.parentIds.length === 0);
//     }
//     if (roots.length === 0) {
//       const minGen = Math.min(...Object.values(memberMap).map((m) => m.generation || 99));
//       roots = Object.values(memberMap).filter((m) => (m.generation || 99) === minGen);
//     }
//     if (roots.length === 0) roots = Object.values(memberMap);

//     return { rootIds: roots.map((r) => r._id), memberMap };
//   }, [members]);

//   /* ============================================================
//      TOGGLE
//      ============================================================ */
//   const toggleNode = useCallback((nodeId, e) => {
//     e.stopPropagation();
//     setExpandedNodes((prev) => {
//       const next = new Set(prev);
//       next.has(nodeId) ? next.delete(nodeId) : next.add(nodeId);
//       return next;
//     });
//   }, []);

//   /* ============================================================
//      MEMBER CARD
//      ============================================================ */
//   const renderMemberCard = useCallback(
//     (member, relationshipLabel = 'सदस्य', isSpouse = false, wifeIndex = -1) => {
//       if (!member) return null;

//       const isDeceased = !member.isAlive;
//       const shouldHidePhoto = hideMarriedDaughterPhoto && isMarriedDaughter(member);
//       const hasPhoto = member.photo && member.photo.trim() !== '' && !shouldHidePhoto;

//       const wifeLabel =
//         wifeIndex >= 0
//           ? wifeIndex === 0
//             ? 'श्रीमती'
//             : `श्रीमती ${wifeIndex + 1}`
//           : 'श्रीमती';

//       return (
//         <div
//           key={member._id}
//           className={`
//             bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 
//             border-2 ${isDeceased ? 'border-gray-300' : isSpouse ? 'border-pink-300' : 'border-green-200'}
//             ${hasPhoto ? 'w-52' : 'w-44'}
//             hover:border-green-400
//             ${isSpouse ? 'bg-pink-50/80' : ''}
//             cursor-pointer
//           `}
//           onClick={() => {
//             setSelectedNode(member._id);
//             onMemberClick?.(member);
//           }}
//         >
//           {/* Photo section */}
//           <div className="relative">
//             {hasPhoto ? (
//               <img
//                 src={member.photo}
//                 alt={member.name}
//                 className="w-full h-32 object-cover rounded-t-xl"
//                 onError={(e) => {
//                   e.target.src = '/default-avatar.png';
//                 }}
//               />
//             ) : (
//               <div
//                 className={`
//                   w-full h-32 flex items-center justify-center rounded-t-xl
//                   ${isDeceased ? 'bg-gray-200' : isSpouse ? 'bg-pink-100' : 'bg-gradient-to-br from-green-100 to-emerald-100'}
//                 `}
//               >
//                 <div className="text-center">
//                   <FaUser
//                     className={`text-4xl ${isDeceased ? 'text-gray-400' : 'text-green-400'} mx-auto`}
//                   />
//                   {shouldHidePhoto && (
//                     <span className="text-[10px] text-gray-500 mt-1 block">विवाहित छोरी</span>
//                   )}
//                 </div>
//               </div>
//             )}

//             {/* Relationship badge */}
//             <div className="absolute top-2 left-2">
//               <span
//                 className={`
//                   text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm
//                   ${isSpouse ? 'bg-pink-500/90 text-white' : 'bg-white/90 text-gray-700'}
//                 `}
//               >
//                 {isSpouse ? wifeLabel : relationshipLabel}
//               </span>
//             </div>

//             {/* Deceased badge */}
//             {isDeceased && (
//               <div className="absolute top-2 right-2">
//                 <span className="text-[10px] font-medium bg-red-500/90 text-white px-2 py-0.5 rounded-full shadow-sm">
//                   ✝ मृत
//                 </span>
//               </div>
//             )}

//             {/* Person status badge */}
//             {member.personStatus && member.personStatus !== 'known' && (
//               <div className="absolute bottom-2 right-2">
//                 <span className="text-[9px] font-medium bg-amber-500/90 text-white px-1.5 py-0.5 rounded-full">
//                   {member.personStatus === 'missing'
//                     ? 'हराएको'
//                     : member.personStatus === 'name_unknown'
//                     ? 'नाम अज्ञात'
//                     : member.personStatus}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Content section */}
//           <div className="p-3 space-y-1">
//             <p className="font-semibold text-sm text-gray-800 truncate" title={member.name}>
//               {member.name}
//             </p>

//             {member.surname && (
//               <p className="text-[10px] text-gray-500 truncate">{member.surname}</p>
//             )}

//             {member.vanshaGenerationNumber && (
//               <p className="text-[10px] text-gray-600">
//                 वंश नं: {member.vanshaGenerationNumber}
//               </p>
//             )}

//             {member.familyNumber && (
//               <p className="text-[10px] text-gray-600">
//                 परिवार नं: {member.familyNumber}
//               </p>
//             )}

//             {member.generation && (
//               <p className="text-[10px] text-gray-600">पुस्ता: {member.generation}</p>
//             )}

//             {member.memberNumber && (
//               <p className="text-[10px] font-mono text-green-600">ID: {member.memberNumber}</p>
//             )}

//             {member.dob && (
//               <p className="text-[9px] text-gray-400">
//                 जन्म: {new Date(member.dob).toLocaleDateString('ne-NP')}
//               </p>
//             )}

//             {isDeceased && member.dod && (
//               <p className="text-[9px] text-red-400">
//                 मृत्यु: {new Date(member.dod).toLocaleDateString('ne-NP')}
//               </p>
//             )}

//             {/* Spouse count indicator */}
//             {member.spouseIds && member.spouseIds.length > 0 && !isSpouse && (
//               <div className="flex items-center gap-1 mt-1">
//                 <FaHeart className="text-red-400 text-[8px]" />
//                 <span className="text-[8px] text-gray-400">
//                   {member.spouseIds.length > 1
//                     ? `${member.spouseIds.length} श्रीमती`
//                     : 'विवाहित'}
//                 </span>
//               </div>
//             )}
//           </div>

//           {/* Expand button — only for lineage sources with children */}
//           {member.childIds &&
//             member.childIds.length > 0 &&
//             member.isLineageSource !== false && (
//               <button
//                 onClick={(e) => toggleNode(member._id, e)}
//                 className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 
//                   bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center 
//                   shadow-md hover:bg-green-600 transition-colors text-[10px] z-10"
//               >
//                 {expandedNodes.has(member._id) ? '−' : '+'}
//               </button>
//             )}
//         </div>
//       );
//     },
//     [
//       expandedNodes,
//       hideMarriedDaughterPhoto,
//       isMarriedDaughter,
//       onMemberClick,
//       toggleNode,
//     ]
//   );

//   /* ============================================================
//      FAMILY NODE (recursive with shared visited set)
//      ============================================================ */
//   const renderFamilyNode = useCallback(
//     (memberId, memberMap, visitedSet, level = 0, isHorizontal = true) => {
//       // Skip if already rendered
//       if (visitedSet.has(memberId)) return null;
//       visitedSet.add(memberId);

//       const member = memberMap[memberId];
//       if (!member) return null;

//       const isExpanded = expandedNodes.has(memberId);
//       const hasSpouses = member.spouseIds && member.spouseIds.length > 0;
//       const hasChildren = member.childIds && member.childIds.length > 0;
//       const isSpouse = member.isLineageSource === false;

//       const relationshipLabel =
//         member.lineageRole === 'lineage_head'
//           ? 'घरमुली'
//           : member.relationship
//           ? getNepaliLabel(member.relationship)
//           : 'सदस्य';

//       // Filter visible spouses & children
//       const visibleSpouses = (member.spouseIds || []).filter(
//         (sid) => sid !== memberId && !visitedSet.has(sid) && memberMap[sid]
//       );
//       const visibleChildren = (member.childIds || []).filter(
//         (cid) => !visitedSet.has(cid) && memberMap[cid]
//       );

//       return (
//         <div
//           key={memberId}
//           className={`flex ${isHorizontal ? 'flex-col items-center' : 'flex-row items-center'} relative`}
//         >
//           {/* Main member card */}
//           {renderMemberCard(member, relationshipLabel, isSpouse)}

//           {/* Spouses — always visible (not gated by isExpanded) */}
//           {hasSpouses && visibleSpouses.length > 0 && (
//             <div
//               className={`flex ${isHorizontal ? 'flex-row gap-2 mt-2' : 'flex-col gap-2 ml-2'} flex-wrap justify-center`}
//             >
//               {visibleSpouses.map((spouseId, index) => {
//                 if (visitedSet.has(spouseId)) return null;
//                 visitedSet.add(spouseId);

//                 const spouse = memberMap[spouseId];
//                 if (!spouse) return null;

//                 return (
//                   <div key={spouseId} className="relative">
//                     <div
//                       className={`absolute ${
//                         isHorizontal ? '-top-2 left-1/2 w-0.5 h-2' : '-left-2 top-1/2 h-0.5 w-2'
//                       } bg-pink-300`}
//                     />
//                     {renderMemberCard(spouse, 'श्रीमती', true, index)}
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//           {/* Children — only for lineage sources, only when expanded */}
//           {hasChildren &&
//             visibleChildren.length > 0 &&
//             isExpanded &&
//             member.isLineageSource !== false && (
//               <div
//                 className={`
//                   flex flex-wrap justify-center gap-4 mt-4 pt-4 relative
//                   ${isHorizontal ? 'flex-row' : 'flex-col'}
//                 `}
//               >
//                 <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-green-300 -mt-4" />

//                 {visibleChildren.length > 1 && (
//                   <div className="absolute top-0 left-[10%] right-[10%] h-0.5 bg-green-300" />
//                 )}

//                 <div className="flex flex-wrap justify-center gap-4">
//                   {visibleChildren.map((childId) =>
//                     renderFamilyNode(childId, memberMap, visitedSet, level + 1, isHorizontal)
//                   )}
//                 </div>
//               </div>
//             )}
//         </div>
//       );
//     },
//     [expandedNodes, getNepaliLabel, renderMemberCard]
//   );

//   /* ============================================================
//      RENDER TREE
//      ============================================================ */
//   const renderTree = () => {
//     if (!treeData || !treeData.rootIds || treeData.rootIds.length === 0) {
//       return (
//         <div className="text-center py-12">
//           <FaTree className="text-4xl text-gray-300 mx-auto mb-3" />
//           <p className="text-gray-500">पारिवारिक वृक्ष संरचना फेला परेन</p>
//           <p className="text-sm text-gray-400">पारिवारिक वृक्ष निर्माण गर्न सम्बन्धहरू थप्नुहोस्</p>
//         </div>
//       );
//     }

//     // Fresh visited set per render pass
//     const visitedSet = new Set();
//     const isHorizontal = layout === 'horizontal';

//     return (
//       <div
//         className={`flex ${
//           isHorizontal ? 'flex-row flex-wrap justify-center gap-8' : 'flex-col items-center'
//         } w-full min-h-[400px] p-4`}
//       >
//         {treeData.rootIds.map((rootId) => {
//           if (visitedSet.has(rootId)) return null;
//           return (
//             <div
//               key={rootId}
//               className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'} items-start gap-4`}
//             >
//               {renderFamilyNode(rootId, treeData.memberMap, visitedSet, 0, isHorizontal)}
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   if (!members || members.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <FaUsers className="text-4xl text-gray-300 mx-auto mb-3" />
//         <p className="text-gray-500">यस परिवारमा कुनै सदस्य छैनन्</p>
//         <p className="text-sm text-gray-400">पारिवारिक वृक्ष निर्माण गर्न सदस्यहरू थप्नुहोस्</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full overflow-auto">
//       <div className="text-sm text-gray-500 mb-2 text-center">
//         <span className="bg-gray-100 px-3 py-1 rounded-full">
//           कुल {members.length} सदस्यहरू
//         </span>
//       </div>
//       {renderTree()}
//     </div>
//   );
// };

// export default FamilyTreeView;

// // src/components/FamilyTreeView.jsx - ULTIMATE MERGED VERSION
// // = COMPLETE.txt architecture + FINAL.txt display

// import { useState, useMemo, useCallback, useRef } from 'react';
// import { FaUser, FaHeart, FaTree, FaUsers } from 'react-icons/fa';

// /* ============================================================
//    NEPALI RELATIONSHIP LABELS (extended set)
//    ============================================================ */
// const RELATIONSHIP_LABELS = {
//   spouse: 'श्रीमान/श्रीमती',
//   husband: 'श्रीमान',
//   wife: 'श्रीमती',
//   father: 'बुबा',
//   mother: 'आमा',
//   son: 'छोरा',
//   daughter: 'छोरी',
//   grandfather: 'हजुरबा',
//   grandmother: 'हजुरआमा',
//   grandson: 'नाति',
//   granddaughter: 'नातिनी',
//   brother: 'दाजु/भाइ',
//   sister: 'दिदी/बहिनी',
//   elderBrother: 'दाजु',
//   youngerBrother: 'भाइ',
//   elderSister: 'दिदी',
//   youngerSister: 'बहिनी',
//   member: 'सदस्य',
//   lineage_head: 'घरमुली',
//   lineage_member: 'सदस्य',
//   family_head: 'घरमुली',
//   child: 'सन्तान',
//   parent: 'आमा/बुबा',
//   sibling: 'दाजु/भाइ/दिदी/बहिनी',
//   grandparent: 'हजुरबा/हजुरआमा',
//   grandchild: 'नाति/नातिनी',
//   other: 'अन्य',
// };

// const FamilyTreeView = ({
//   members,
//   layout = 'horizontal',
//   onMemberClick,
//   familyId,
//   showPhotos = true,
//   hideMarriedDaughterPhoto = true,
// }) => {
//   const [expandedNodes, setExpandedNodes] = useState(new Set());
//   const [selectedNode, setSelectedNode] = useState(null);

//   // Duplicate prevention ref
//   const renderedMemberIds = useRef(new Set());

//   const getNepaliLabel = useCallback((relationship) => {
//     if (!relationship) return 'सदस्य';
//     return RELATIONSHIP_LABELS[relationship] || relationship;
//   }, []);

//   /* ============================================================
//      MARRIED DAUGHTER DETECTION
//      ============================================================ */
//   const isMarriedDaughter = useCallback((member) => {
//     if (member.gender !== 'female') return false;
//     if (member.maritalStatus === 'married') return true;
//     if (member.husband) return true;
//     if (member.spouse) return true;
//     return false;
//   }, []);

//   /* ============================================================
//      BUILD TREE
//      ============================================================ */
//   const treeData = useMemo(() => {
//     if (!members || members.length === 0) return null;

//     const memberMap = {};
//     members.forEach((m) => {
//       memberMap[m._id] = {
//         ...m,
//         children: [],
//         spouses: [],
//         parents: [],
//         level: 0,
//         isLineageSource: true,
//       };
//     });

//     const spouseIds = new Set();

//     const addSpouse = (aId, bId) => {
//       if (!aId || !bId || aId === bId) return;
//       if (!memberMap[aId] || !memberMap[bId]) return;
//       if (!memberMap[aId].spouses.includes(bId)) memberMap[aId].spouses.push(bId);
//       if (!memberMap[bId].spouses.includes(aId)) memberMap[bId].spouses.push(aId);
//       spouseIds.add(bId);
//       spouseIds.add(aId);
//     };

//     members.forEach((m) => {
//       const memberId = m._id;

//       // Father
//       if (m.father) {
//         const id = typeof m.father === 'object' ? m.father._id : m.father;
//         if (id && memberMap[id]) {
//           if (!memberMap[id].children.includes(memberId)) memberMap[id].children.push(memberId);
//           if (!memberMap[memberId].parents.includes(id)) memberMap[memberId].parents.push(id);
//         }
//       }

//       // Mother
//       if (m.mother) {
//         const id = typeof m.mother === 'object' ? m.mother._id : m.mother;
//         if (id && memberMap[id]) {
//           if (!memberMap[id].children.includes(memberId)) memberMap[id].children.push(memberId);
//           if (!memberMap[memberId].parents.includes(id)) memberMap[memberId].parents.push(id);
//         }
//       }

//       // Spouse
//       if (m.spouse) {
//         const id = typeof m.spouse === 'object' ? m.spouse._id : m.spouse;
//         if (id) addSpouse(memberId, id);
//       }

//       // Husband
//       if (m.husband) {
//         const id = typeof m.husband === 'object' ? m.husband._id : m.husband;
//         if (id) addSpouse(memberId, id);
//       }

//       // Wife (singular)
//       if (m.wife) {
//         const id = typeof m.wife === 'object' ? m.wife._id : m.wife;
//         if (id) addSpouse(memberId, id);
//       }

//       // Multiple wives
//       if (Array.isArray(m.wives)) {
//         m.wives.forEach((w) => {
//           const id = typeof w === 'object' ? w._id : w;
//           if (id) addSpouse(memberId, id);
//         });
//       }
//     });

//     // Dedupe
//     Object.values(memberMap).forEach((m) => {
//       m.spouses = [...new Set(m.spouses)];
//       m.children = [...new Set(m.children)];
//       m.parents = [...new Set(m.parents)];
//     });

//     // Determine lineage source
//     Object.values(memberMap).forEach((m) => {
//       if (m.parents.length > 0) {
//         m.isLineageSource = true;
//       } else if (m.children.length > 0) {
//         m.isLineageSource = true;
//       } else if (spouseIds.has(m._id)) {
//         m.isLineageSource = false;
//       } else {
//         m.isLineageSource = true;
//       }
//     });

//     // Find roots
//     let roots = Object.values(memberMap).filter(
//       (m) => m.parents.length === 0 && m.isLineageSource
//     );

//     if (roots.length === 0) {
//       roots = Object.values(memberMap).filter((m) => m.parents.length === 0);
//     }
//     if (roots.length === 0) {
//       const minGen = Math.min(...Object.values(memberMap).map((m) => m.generation || 99));
//       roots = Object.values(memberMap).filter((m) => (m.generation || 99) === minGen);
//     }
//     if (roots.length === 0) roots = Object.values(memberMap);

//     return { rootIds: roots.map((r) => r._id), memberMap };
//   }, [members]);

//   /* ============================================================
//      TOGGLE
//      ============================================================ */
//   const toggleNode = useCallback((nodeId, e) => {
//     e.stopPropagation();
//     setExpandedNodes((prev) => {
//       const next = new Set(prev);
//       next.has(nodeId) ? next.delete(nodeId) : next.add(nodeId);
//       return next;
//     });
//   }, []);

//   /* ============================================================
//      MEMBER CARD
//      ============================================================ */
//   const renderMemberCard = useCallback(
//     (member, relationshipLabel = 'सदस्य', isSpouse = false, wifeIndex = -1) => {
//       if (!member) return null;

//       const isDeceased = !member.isAlive;
//       const shouldHidePhoto = hideMarriedDaughterPhoto && isMarriedDaughter(member);
//       const hasPhoto = member.photo && member.photo.trim() !== '' && !shouldHidePhoto;

//       const wifeLabel =
//         wifeIndex >= 0
//           ? wifeIndex === 0
//             ? 'श्रीमती'
//             : `श्रीमती ${wifeIndex + 1}`
//           : 'श्रीमती';

//       return (
//         <div
//           key={member._id}
//           className={`
//             bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 
//             border-2 ${isDeceased ? 'border-gray-300' : isSpouse ? 'border-pink-300' : 'border-green-200'}
//             ${hasPhoto ? 'w-52' : 'w-44'}
//             hover:border-green-400
//             ${isSpouse ? 'bg-pink-50/80' : ''}
//             cursor-pointer
//           `}
//           onClick={() => {
//             setSelectedNode(member._id);
//             onMemberClick?.(member);
//           }}
//         >
//           <div className="relative">
//             {hasPhoto ? (
//               <img
//                 src={member.photo}
//                 alt={member.name}
//                 className="w-full h-32 object-cover rounded-t-xl"
//                 onError={(e) => {
//                   e.target.src = '/default-avatar.png';
//                 }}
//               />
//             ) : (
//               <div
//                 className={`
//                   w-full h-32 flex items-center justify-center rounded-t-xl
//                   ${isDeceased ? 'bg-gray-200' : isSpouse ? 'bg-pink-100' : 'bg-gradient-to-br from-green-100 to-emerald-100'}
//                 `}
//               >
//                 <div className="text-center">
//                   <FaUser
//                     className={`text-4xl ${isDeceased ? 'text-gray-400' : 'text-green-400'} mx-auto`}
//                   />
//                   {shouldHidePhoto && (
//                     <span className="text-[10px] text-gray-500 mt-1 block">विवाहित छोरी</span>
//                   )}
//                 </div>
//               </div>
//             )}

//             <div className="absolute top-2 left-2">
//               <span
//                 className={`
//                   text-[10px] font-medium px-2 py-0.5 rounded-full shadow-sm
//                   ${isSpouse ? 'bg-pink-500/90 text-white' : 'bg-white/90 text-gray-700'}
//                 `}
//               >
//                 {isSpouse ? wifeLabel : relationshipLabel}
//               </span>
//             </div>

//             {isDeceased && (
//               <div className="absolute top-2 right-2">
//                 <span className="text-[10px] font-medium bg-red-500/90 text-white px-2 py-0.5 rounded-full shadow-sm">
//                   ✝ मृत
//                 </span>
//               </div>
//             )}

//             {member.personStatus && member.personStatus !== 'known' && (
//               <div className="absolute bottom-2 right-2">
//                 <span className="text-[9px] font-medium bg-amber-500/90 text-white px-1.5 py-0.5 rounded-full">
//                   {member.personStatus === 'missing'
//                     ? 'हराएको'
//                     : member.personStatus === 'name_unknown'
//                     ? 'नाम अज्ञात'
//                     : member.personStatus}
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="p-3 space-y-1">
//             <p className="font-semibold text-sm text-gray-800 truncate" title={member.name}>
//               {member.name}
//             </p>

//             {member.surname && (
//               <p className="text-[10px] text-gray-500 truncate">{member.surname}</p>
//             )}

//             {member.vanshaGenerationNumber && (
//               <p className="text-[10px] text-gray-600">
//                 वंश नं: {member.vanshaGenerationNumber}
//               </p>
//             )}

//             {member.familyNumber && (
//               <p className="text-[10px] text-gray-600">
//                 परिवार नं: {member.familyNumber}
//               </p>
//             )}

//             {member.generation && (
//               <p className="text-[10px] text-gray-600">पुस्ता: {member.generation}</p>
//             )}

//             {member.memberNumber && (
//               <p className="text-[10px] font-mono text-green-600">ID: {member.memberNumber}</p>
//             )}

//             {member.dob && (
//               <p className="text-[9px] text-gray-400">
//                 जन्म: {new Date(member.dob).toLocaleDateString('ne-NP')}
//               </p>
//             )}

//             {isDeceased && member.dod && (
//               <p className="text-[9px] text-red-400">
//                 मृत्यु: {new Date(member.dod).toLocaleDateString('ne-NP')}
//               </p>
//             )}

//             {member.spouses && member.spouses.length > 0 && !isSpouse && (
//               <div className="flex items-center gap-1 mt-1">
//                 <FaHeart className="text-red-400 text-[8px]" />
//                 <span className="text-[8px] text-gray-400">
//                   {member.spouses.length > 1
//                     ? `${member.spouses.length} श्रीमती`
//                     : 'विवाहित'}
//                 </span>
//               </div>
//             )}
//           </div>

//           {member.children && member.children.length > 0 && (
//             <button
//               onClick={(e) => toggleNode(member._id, e)}
//               className="absolute -bottom-2.5 left-1/2 transform -translate-x-1/2 
//                 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center 
//                 shadow-md hover:bg-green-600 transition-colors text-[10px] z-10"
//             >
//               {expandedNodes.has(member._id) ? '−' : '+'}
//             </button>
//           )}
//         </div>
//       );
//     },
//     [expandedNodes, hideMarriedDaughterPhoto, isMarriedDaughter, onMemberClick, toggleNode]
//   );

//   /* ============================================================
//      FAMILY NODE
//      ============================================================ */
//   const renderFamilyNode = useCallback(
//     (memberId, memberMap, level = 0, isHorizontal = true) => {
//       const member = memberMap[memberId];
//       if (!member) return null;

//       if (renderedMemberIds.current.has(memberId)) return null;
//       renderedMemberIds.current.add(memberId);

//       const hasChildren = member.children && member.children.length > 0;
//       const isExpanded = expandedNodes.has(memberId);
//       const hasSpouses = member.spouses && member.spouses.length > 0;

//       const relationshipLabel =
//         member.lineageRole === 'lineage_head'
//           ? 'घरमुली'
//           : member.relationship
//           ? getNepaliLabel(member.relationship)
//           : 'सदस्य';

//       const isSpouse = member.isLineageSource === false;

//       return (
//         <div
//           key={memberId}
//           className={`flex ${isHorizontal ? 'flex-col items-center' : 'flex-row items-center'} relative`}
//         >
//           {renderMemberCard(member, relationshipLabel, isSpouse)}

//           {hasSpouses && (
//             <div
//               className={`flex ${isHorizontal ? 'flex-row gap-2 mt-2' : 'flex-col gap-2 ml-2'} flex-wrap justify-center`}
//             >
//               {member.spouses.map((spouseId, index) => {
//                 if (spouseId === memberId) return null;
//                 if (renderedMemberIds.current.has(spouseId)) return null;

//                 const spouse = memberMap[spouseId];
//                 if (!spouse) return null;

//                 renderedMemberIds.current.add(spouseId);

//                 return (
//                   <div key={spouseId} className="relative">
//                     <div
//                       className={`absolute ${
//                         isHorizontal ? '-top-2 left-1/2 w-0.5 h-2' : '-left-2 top-1/2 h-0.5 w-2'
//                       } bg-pink-300`}
//                     />
//                     {renderMemberCard(spouse, 'श्रीमती', true, index)}
//                   </div>
//                 );
//               })}
//             </div>
//           )}

//           {hasChildren && isExpanded && (
//             <div
//               className={`
//                 flex flex-wrap justify-center gap-4 mt-4 pt-4 relative
//                 ${isHorizontal ? 'flex-row' : 'flex-col'}
//               `}
//             >
//               <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-green-300 -mt-4" />

//               {member.children.length > 1 && (
//                 <div className="absolute top-0 left-[10%] right-[10%] h-0.5 bg-green-300" />
//               )}

//               <div className="flex flex-wrap justify-center gap-4">
//                 {member.children.map((childId) => {
//                   if (renderedMemberIds.current.has(childId)) return null;
//                   return renderFamilyNode(childId, memberMap, level + 1, isHorizontal);
//                 })}
//               </div>
//             </div>
//           )}
//         </div>
//       );
//     },
//     [expandedNodes, getNepaliLabel, renderMemberCard]
//   );

//   /* ============================================================
//      RENDER TREE
//      ============================================================ */
//   const renderTree = () => {
//     renderedMemberIds.current = new Set();

//     if (!treeData || !treeData.rootIds || treeData.rootIds.length === 0) {
//       return (
//         <div className="text-center py-12">
//           <FaTree className="text-4xl text-gray-300 mx-auto mb-3" />
//           <p className="text-gray-500">पारिवारिक वृक्ष संरचना फेला परेन</p>
//           <p className="text-sm text-gray-400">पारिवारिक वृक्ष निर्माण गर्न सम्बन्धहरू थप्नुहोस्</p>
//         </div>
//       );
//     }

//     const isHorizontal = layout === 'horizontal';

//     return (
//       <div
//         className={`flex ${
//           isHorizontal ? 'flex-row flex-wrap justify-center gap-8' : 'flex-col items-center'
//         } w-full min-h-[400px] p-4`}
//       >
//         {treeData.rootIds.map((rootId) => {
//           if (renderedMemberIds.current.has(rootId)) return null;
//           return (
//             <div
//               key={rootId}
//               className={`flex ${isHorizontal ? 'flex-row' : 'flex-col'} items-start gap-4`}
//             >
//               {renderFamilyNode(rootId, treeData.memberMap, 0, isHorizontal)}
//             </div>
//           );
//         })}
//       </div>
//     );
//   };

//   if (!members || members.length === 0) {
//     return (
//       <div className="text-center py-12">
//         <FaUsers className="text-4xl text-gray-300 mx-auto mb-3" />
//         <p className="text-gray-500">यस परिवारमा कुनै सदस्य छैनन्</p>
//         <p className="text-sm text-gray-400">पारिवारिक वृक्ष निर्माण गर्न सदस्यहरू थप्नुहोस्</p>
//       </div>
//     );
//   }

//   return (
//     <div className="w-full overflow-auto">
//       <div className="text-sm text-gray-500 mb-2 text-center">
//         <span className="bg-gray-100 px-3 py-1 rounded-full">
//           कुल {members.length} सदस्यहरू
//         </span>
//       </div>
//       {renderTree()}
//     </div>
//   );
// };

// export default FamilyTreeView;