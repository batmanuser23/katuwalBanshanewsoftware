// // src/components/FamilyCard.jsx - COMPLETE FIXED FILE

// import React, { useState } from 'react';
// import { FaHome, FaUsers, FaTree, FaLock, FaUnlock, FaEye, FaChevronDown, FaChevronUp, FaUser } from 'react-icons/fa';
// import { motion, AnimatePresence } from 'framer-motion';
// import Button from './Button';

// const FamilyCard = ({ 
//   family, 
//   memberCount, 
//   generationCount, 
//   onViewTree, 
//   onViewDetails, 
//   onClose, 
//   onReopen,
//   members = [],
//   isAdmin = false,
//   className = '' 
// }) => {
//   const isClosed = family.status === 'closed';
//   const [expanded, setExpanded] = useState(false);

//   // Get family head name
//   const getFamilyHeadName = () => {
//     if (!family.familyHead) return 'N/A';
//     if (typeof family.familyHead === 'object') {
//       return family.familyHead.name || 'N/A';
//     }
//     return family.familyHead;
//   };

//   // Get member relationship label in Nepali
//   const getRelationshipLabel = (relationship) => {
//     const labels = {
//       'member': 'सदस्य',
//       'spouse': 'श्रीमान/श्रीमती',
//       'child': 'सन्तान',
//       'parent': 'आमा/बुवा',
//       'sibling': 'दाजु/भाइ/दिदी/बहिनी',
//       'grandparent': 'हजुरबा/हजुरआमा',
//       'grandchild': 'नाति/नातिनी',
//       'other': 'अन्य'
//     };
//     return labels[relationship] || relationship || 'सदस्य';
//   };

//   // Get status badge
//   const getStatusBadge = () => {
//     if (isClosed) {
//       return (
//         <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium flex items-center gap-1">
//           <FaLock className="text-xs" />
//           बन्द
//         </span>
//       );
//     }
//     return (
//       <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
//         <FaUnlock className="text-xs" />
//         खुला
//       </span>
//     );
//   };

//   return (
//     <motion.div
//       whileHover={{ y: -4 }}
//       className={`bg-white rounded-2xl border ${isClosed ? 'border-gray-300' : 'border-green-200'} 
//         shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}
//     >
//       <div className="p-5">
//         <div className="flex items-start justify-between">
//           <div className="flex items-center gap-3">
//             <div className={`w-12 h-12 rounded-xl ${isClosed ? 'bg-gray-100' : 'bg-gradient-to-r from-green-100 to-emerald-100'} 
//               flex items-center justify-center flex-shrink-0`}>
//               {family.familyPhoto ? (
//                 <img 
//                   src={family.familyPhoto} 
//                   alt={family.familyName}
//                   className="w-full h-full object-cover rounded-xl"
//                 />
//               ) : (
//                 <FaHome className={`${isClosed ? 'text-gray-400' : 'text-green-600'} text-2xl`} />
//               )}
//             </div>
//             <div>
//               <h3 className="font-semibold text-gray-800 text-lg">
//                 {family.familyName || 'Unnamed Family'}
//               </h3>
//               <div className="flex items-center gap-2 text-sm text-gray-500">
//                 <span>घर नम्बर: {family.house?.houseNumber || 'N/A'}</span>
//                 <span>•</span>
//                 <span>वंश नम्बर: {family.familyNumber}</span>
//               </div>
//             </div>
//           </div>
          
//           {getStatusBadge()}
//         </div>

//         {/* Vansha/Generation */}
//         {family.vanshaGenerationNumber && (
//           <div className="mt-2 text-sm">
//             <span className="text-gray-500">वंश/पुस्ता: </span>
//             <span className="font-medium text-gray-800">{family.vanshaGenerationNumber}</span>
//           </div>
//         )}

//         {/* Family Head */}
//         {family.familyHead && (
//           <div className="mt-1 text-sm">
//             <span className="text-gray-500">घरमुली: </span>
//             <span className="font-medium text-gray-800">{getFamilyHeadName()}</span>
//           </div>
//         )}

//         {/* Stats */}
//         <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
//           <div className="flex items-center gap-1.5">
//             <FaUsers className="text-blue-500 text-sm" />
//             <span className="text-sm font-medium text-gray-700">{memberCount || 0} सदस्यहरू</span>
//           </div>
//           <div className="flex items-center gap-1.5">
//             <FaTree className="text-green-500 text-sm" />
//             <span className="text-sm font-medium text-gray-700">{generationCount || 0} पुस्ताहरू</span>
//           </div>
//         </div>

//         {/* Toggle Members Button */}
//         {members && members.length > 0 && (
//           <button
//             onClick={() => setExpanded(!expanded)}
//             className="flex items-center gap-2 mt-3 text-sm text-green-600 hover:text-green-700 transition-colors"
//           >
//             {expanded ? <FaChevronUp /> : <FaChevronDown />}
//             {expanded ? 'सदस्यहरू लुकाउनुहोस्' : 'सदस्यहरू हेर्नुहोस्'}
//             <span className="text-xs text-gray-400">({members.length})</span>
//           </button>
//         )}

//         {/* Members List */}
//         <AnimatePresence>
//           {expanded && members && members.length > 0 && (
//             <motion.div
//               initial={{ opacity: 0, height: 0 }}
//               animate={{ opacity: 1, height: 'auto' }}
//               exit={{ opacity: 0, height: 0 }}
//               transition={{ duration: 0.3 }}
//               className="overflow-hidden"
//             >
//               <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5 max-h-48 overflow-y-auto">
//                 {members.map((member) => (
//                   <div key={member._id} className="flex items-center gap-2 text-sm py-1 px-2 hover:bg-gray-50 rounded-lg">
//                     <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
//                       {member.photo ? (
//                         <img 
//                           src={member.photo} 
//                           alt={member.name}
//                           className="w-full h-full object-cover"
//                           onError={(e) => { e.target.src = '/default-avatar.png'; }}
//                         />
//                       ) : (
//                         <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
//                           <FaUser className="text-green-600 text-xs" />
//                         </div>
//                       )}
//                     </div>
//                     <span className="font-medium text-gray-700 flex-1">{member.name}</span>
//                     <span className="text-xs text-gray-400">
//                       {member.lineageRole === 'lineage_head' ? 'घरमुली' : 
//                        getRelationshipLabel(member.relationship)}
//                     </span>
//                     {member.isAlive === false && (
//                       <span className="text-xs text-red-400">(मृत)</span>
//                     )}
//                   </div>
//                 ))}
//               </div>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* Actions */}
//         <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
//           <Button
//             variant="primary"
//             size="sm"
//             onClick={onViewTree}
//             className="flex-1 min-w-[100px]"
//           >
//             <FaTree className="mr-1.5 text-xs" />
//             वृक्ष हेर्नुहोस्
//           </Button>
          
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={onViewDetails}
//             className="flex-1 min-w-[100px]"
//           >
//             <FaEye className="mr-1.5 text-xs" />
//             विवरण
//           </Button>

//           {isAdmin && isClosed && (
//             <Button
//               variant="success"
//               size="sm"
//               onClick={onReopen}
//               className="flex-1 min-w-[100px]"
//             >
//               <FaUnlock className="mr-1.5 text-xs" />
//               पुन: खोल्नुहोस्
//             </Button>
//           )}

//           {isAdmin && !isClosed && (
//             <Button
//               variant="secondary"
//               size="sm"
//               onClick={onClose}
//               className="flex-1 min-w-[100px]"
//             >
//               <FaLock className="mr-1.5 text-xs" />
//               बन्द गर्नुहोस्
//             </Button>
//           )}
//         </div>
//       </div>
//     </motion.div>
//   );
// };

// export default FamilyCard;
// // // src/components/FamilyCard.jsx - UPDATED with members list

// // import React, { useState } from 'react';
// // import { FaHome, FaUsers, FaTree, FaLock, FaUnlock, FaEye, FaChevronDown, FaChevronUp, FaUser } from 'react-icons/fa';
// // import { motion, AnimatePresence } from 'framer-motion';
// // import Button from './Button';

// // const FamilyCard = ({ 
// //   family, 
// //   memberCount, 
// //   generationCount, 
// //   onViewTree, 
// //   onViewDetails, 
// //   onClose, 
// //   onReopen,
// //   members = [],
// //   isAdmin = false,
// //   className = '' 
// // }) => {
// //   const isClosed = family.status === 'closed';
// //   const [expanded, setExpanded] = useState(false);

// //   // Get family head name
// //   const getFamilyHeadName = () => {
// //     if (!family.familyHead) return 'N/A';
// //     if (typeof family.familyHead === 'object') {
// //       return family.familyHead.name || 'N/A';
// //     }
// //     return family.familyHead;
// //   };

// //   // Get member relationship label in Nepali
// //   const getRelationshipLabel = (relationship) => {
// //     const labels = {
// //       'member': 'सदस्य',
// //       'spouse': 'श्रीमान/श्रीमती',
// //       'child': 'छोरा/छोरी',
// //       'parent': 'बुवा/आमा',
// //       'sibling': 'दाजु/भाइ/दिदी/बहिनी',
// //       'grandparent': 'हजुरबा/हजुरआमा',
// //       'grandchild': 'नाति/नातिनी',
// //       'other': 'अन्य'
// //     };
// //     return labels[relationship] || relationship || 'सदस्य';
// //   };

// //   // Get status badge
// //   const getStatusBadge = () => {
// //     if (isClosed) {
// //       return (
// //         <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium flex items-center gap-1">
// //           <FaLock className="text-xs" />
// //           CLOSED
// //         </span>
// //       );
// //     }
// //     return (
// //       <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
// //         <FaUnlock className="text-xs" />
// //         OPEN
// //       </span>
// //     );
// //   };

// //   return (
// //     <motion.div
// //       whileHover={{ y: -4 }}
// //       className={`bg-white rounded-2xl border ${isClosed ? 'border-gray-300' : 'border-green-200'} 
// //         shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden ${className}`}
// //     >
// //       <div className="p-5">
// //         <div className="flex items-start justify-between">
// //           <div className="flex items-center gap-3">
// //             <div className={`w-12 h-12 rounded-xl ${isClosed ? 'bg-gray-100' : 'bg-gradient-to-r from-green-100 to-emerald-100'} 
// //               flex items-center justify-center flex-shrink-0`}>
// //               {family.familyPhoto ? (
// //                 <img 
// //                   src={family.familyPhoto} 
// //                   alt={family.familyName}
// //                   className="w-full h-full object-cover rounded-xl"
// //                 />
// //               ) : (
// //                 <FaHome className={`${isClosed ? 'text-gray-400' : 'text-green-600'} text-2xl`} />
// //               )}
// //             </div>
// //             <div>
// //               <h3 className="font-semibold text-gray-800 text-lg">
// //                 {family.familyName || 'Unnamed Family'}
// //               </h3>
// //               <div className="flex items-center gap-2 text-sm text-gray-500">
// //                 <span>घर नम्बर: {family.house?.houseNumber || 'N/A'}</span>
// //                 <span>•</span>
// //                 <span>वंश नम्बर: {family.familyNumber}</span>
// //               </div>
// //             </div>
// //           </div>
          
// //           {getStatusBadge()}
// //         </div>

// //         {/* Vansha/Generation */}
// //         {family.vanshaGenerationNumber && (
// //           <div className="mt-2 text-sm">
// //             <span className="text-gray-500">वंश/पुस्ता: </span>
// //             <span className="font-medium text-gray-800">{family.vanshaGenerationNumber}</span>
// //           </div>
// //         )}

// //         {/* Family Head */}
// //         {family.familyHead && (
// //           <div className="mt-1 text-sm">
// //             <span className="text-gray-500">घरमुली: </span>
// //             <span className="font-medium text-gray-800">{getFamilyHeadName()}</span>
// //           </div>
// //         )}

// //         {/* Stats */}
// //         <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
// //           <div className="flex items-center gap-1.5">
// //             <FaUsers className="text-blue-500 text-sm" />
// //             <span className="text-sm font-medium text-gray-700">{memberCount || 0} Members</span>
// //           </div>
// //           <div className="flex items-center gap-1.5">
// //             <FaTree className="text-green-500 text-sm" />
// //             <span className="text-sm font-medium text-gray-700">{generationCount || 0} Generations</span>
// //           </div>
// //         </div>

// //         {/* Toggle Members Button */}
// //         {members && members.length > 0 && (
// //           <button
// //             onClick={() => setExpanded(!expanded)}
// //             className="flex items-center gap-2 mt-3 text-sm text-green-600 hover:text-green-700 transition-colors"
// //           >
// //             {expanded ? <FaChevronUp /> : <FaChevronDown />}
// //             {expanded ? 'सदस्यहरू लुकाउनुहोस्' : 'सदस्यहरू हेर्नुहोस्'}
// //           </button>
// //         )}

// //         {/* Members List */}
// //         <AnimatePresence>
// //           {expanded && members && members.length > 0 && (
// //             <motion.div
// //               initial={{ opacity: 0, height: 0 }}
// //               animate={{ opacity: 1, height: 'auto' }}
// //               exit={{ opacity: 0, height: 0 }}
// //               transition={{ duration: 0.3 }}
// //               className="overflow-hidden"
// //             >
// //               <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5 max-h-48 overflow-y-auto">
// //                 {members.map((member) => (
// //                   <div key={member._id} className="flex items-center gap-2 text-sm py-1 px-2 hover:bg-gray-50 rounded-lg">
// //                     <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
// //                       {member.photo ? (
// //                         <img 
// //                           src={member.photo} 
// //                           alt={member.name}
// //                           className="w-full h-full object-cover"
// //                           onError={(e) => { e.target.src = '/default-avatar.png'; }}
// //                         />
// //                       ) : (
// //                         <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
// //                           <FaUser className="text-green-600 text-xs" />
// //                         </div>
// //                       )}
// //                     </div>
// //                     <span className="font-medium text-gray-700 flex-1">{member.name}</span>
// //                     <span className="text-xs text-gray-400">
// //                       {member.relationship ? getRelationshipLabel(member.relationship) : 'सदस्य'}
// //                     </span>
// //                     {member.isAlive === false && (
// //                       <span className="text-xs text-red-400">(मृत)</span>
// //                     )}
// //                   </div>
// //                 ))}
// //               </div>
// //             </motion.div>
// //           )}
// //         </AnimatePresence>

// //         {/* Actions */}
// //         <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
// //           <Button
// //             variant="primary"
// //             size="sm"
// //             onClick={onViewTree}
// //             className="flex-1 min-w-[100px]"
// //           >
// //             <FaTree className="mr-1.5 text-xs" />
// //             View Tree
// //           </Button>
          
// //           <Button
// //             variant="outline"
// //             size="sm"
// //             onClick={onViewDetails}
// //             className="flex-1 min-w-[100px]"
// //           >
// //             <FaEye className="mr-1.5 text-xs" />
// //             Details
// //           </Button>

// //           {isAdmin && isClosed && (
// //             <Button
// //               variant="success"
// //               size="sm"
// //               onClick={onReopen}
// //               className="flex-1 min-w-[100px]"
// //             >
// //               <FaUnlock className="mr-1.5 text-xs" />
// //               Open for Edit
// //             </Button>
// //           )}

// //           {isAdmin && !isClosed && (
// //             <Button
// //               variant="secondary"
// //               size="sm"
// //               onClick={onClose}
// //               className="flex-1 min-w-[100px]"
// //             >
// //               <FaLock className="mr-1.5 text-xs" />
// //               Close Family
// //             </Button>
// //           )}
// //         </div>
// //       </div>
// //     </motion.div>
// //   );
// // };

// // export default FamilyCard;

// src/components/FamilyCard.jsx - UPDATED with Edit button

import React, { useState } from 'react';
import { FaHome, FaUsers, FaTree, FaLock, FaUnlock, FaEye, FaChevronDown, FaChevronUp, FaUser, FaEdit } from 'react-icons/fa';
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
  isAdmin = false,
  className = '' 
}) => {
  const isClosed = family.status === 'closed';
  const [expanded, setExpanded] = useState(false);

  // Get family head name
  const getFamilyHeadName = () => {
    if (!family.familyHead) return 'N/A';
    if (typeof family.familyHead === 'object') {
      return family.familyHead.name || 'N/A';
    }
    return family.familyHead;
  };

  // Get member relationship label in Nepali
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

  // Get status badge
  const getStatusBadge = () => {
    if (isClosed) {
      return (
        <span className="px-3 py-1 bg-gray-100 text-gray-600 rounded-full text-xs font-medium flex items-center gap-1">
          <FaLock className="text-xs" />
          बन्द
        </span>
      );
    }
    return (
      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center gap-1">
        <FaUnlock className="text-xs" />
        खुला
      </span>
    );
  };

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
                <span>घर नम्बर: {family.house?.houseNumber || 'N/A'}</span>
                <span>•</span>
                <span>वंश नम्बर: {family.familyNumber}</span>
              </div>
            </div>
          </div>
          
          {getStatusBadge()}
        </div>

        {/* Vansha/Generation */}
        {family.vanshaGenerationNumber && (
          <div className="mt-2 text-sm">
            <span className="text-gray-500">वंश/पुस्ता: </span>
            <span className="font-medium text-gray-800">{family.vanshaGenerationNumber}</span>
          </div>
        )}

        {/* Family Head */}
        {family.familyHead && (
          <div className="mt-1 text-sm">
            <span className="text-gray-500">घरमुली: </span>
            <span className="font-medium text-gray-800">{getFamilyHeadName()}</span>
          </div>
        )}

        {/* Stats */}
        <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1.5">
            <FaUsers className="text-blue-500 text-sm" />
            <span className="text-sm font-medium text-gray-700">{memberCount || 0} सदस्यहरू</span>
          </div>
          <div className="flex items-center gap-1.5">
            <FaTree className="text-green-500 text-sm" />
            <span className="text-sm font-medium text-gray-700">{generationCount || 0} पुस्ताहरू</span>
          </div>
        </div>

        {/* Toggle Members Button */}
        {members && members.length > 0 && (
          <button
            onClick={() => setExpanded(!expanded)}
            className="flex items-center gap-2 mt-3 text-sm text-green-600 hover:text-green-700 transition-colors"
          >
            {expanded ? <FaChevronUp /> : <FaChevronDown />}
            {expanded ? 'सदस्यहरू लुकाउनुहोस्' : 'सदस्यहरू हेर्नुहोस्'}
            <span className="text-xs text-gray-400">({members.length})</span>
          </button>
        )}

        {/* Members List */}
        <AnimatePresence>
          {expanded && members && members.length > 0 && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="mt-3 pt-3 border-t border-gray-100 space-y-1.5 max-h-48 overflow-y-auto">
                {members.map((member) => (
                  <div key={member._id} className="flex items-center gap-2 text-sm py-1 px-2 hover:bg-gray-50 rounded-lg">
                    <div className="w-6 h-6 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                      {member.photo ? (
                        <img 
                          src={member.photo} 
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => { e.target.src = '/default-avatar.png'; }}
                        />
                      ) : (
                        <div className="w-full h-full bg-gradient-to-br from-green-100 to-emerald-100 flex items-center justify-center">
                          <FaUser className="text-green-600 text-xs" />
                        </div>
                      )}
                    </div>
                    <span className="font-medium text-gray-700 flex-1">{member.name}</span>
                    <span className="text-xs text-gray-400">
                      {member.lineageRole === 'lineage_head' ? 'घरमुली' : 
                       getRelationshipLabel(member.relationship)}
                    </span>
                    {member.isAlive === false && (
                      <span className="text-xs text-red-400">(मृत)</span>
                    )}
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Actions */}
        <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-100">
          <Button
            variant="primary"
            size="sm"
            onClick={onViewTree}
            className="flex-1 min-w-[80px]"
          >
            <FaTree className="mr-1.5 text-xs" />
            वृक्ष
          </Button>
          
          <Button
            variant="outline"
            size="sm"
            onClick={onViewDetails}
            className="flex-1 min-w-[80px]"
          >
            <FaEye className="mr-1.5 text-xs" />
            विवरण
          </Button>

          {isAdmin && !isClosed && onEdit && (
            <Button
              variant="secondary"
              size="sm"
              onClick={() => onEdit(family)}
              className="flex-1 min-w-[80px]"
            >
              <FaEdit className="mr-1.5 text-xs" />
              सम्पादन
            </Button>
          )}

          {isAdmin && isClosed && (
            <Button
              variant="success"
              size="sm"
              onClick={onReopen}
              className="flex-1 min-w-[80px]"
            >
              <FaUnlock className="mr-1.5 text-xs" />
              पुन: खोल्नुहोस्
            </Button>
          )}

          {isAdmin && !isClosed && (
            <Button
              variant="secondary"
              size="sm"
              onClick={onClose}
              className="flex-1 min-w-[80px]"
            >
              <FaLock className="mr-1.5 text-xs" />
              बन्द गर्नुहोस्
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default FamilyCard;