// // src/pages/FamilyTree.jsx
// import { useState, useMemo } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { getFamilies, getFamilyTreeByFamily } from '../api/families';
// import { getMembers } from '../api/members';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaSearch, FaUsers, FaTree, FaHome, FaUser } from 'react-icons/fa';
// import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// import FamilyTreeView from '../components/FamilyTreeView';

// const FamilyTreePage = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedFamily, setSelectedFamily] = useState(null);
//   const [viewMode, setViewMode] = useState('grid'); // 'grid' | 'tree'
//   const navigate = useNavigate();

//   // Fetch all families
//   const { data: familiesData, isLoading: familiesLoading } = useQuery({
//     queryKey: ['families'],
//     queryFn: () => getFamilies({ limit: 1000 }),
//   });

//   // Fetch all members for tree generation
//   const { data: membersData, isLoading: membersLoading } = useQuery({
//     queryKey: ['members-tree'],
//     queryFn: () => getMembers({ limit: 10000 }),
//   });

//   // Get family tree data for selected family - ONLY ONE DECLARATION
//   const { data: treeData, isLoading: treeLoading } = useQuery({
//     queryKey: ['familyTree', selectedFamily?._id],
//     queryFn: () => getFamilyTreeByFamily(selectedFamily._id),
//     enabled: !!selectedFamily,
//   });

//   // Filter families by search
//   const filteredFamilies = useMemo(() => {
//     if (!familiesData?.data) return [];
//     if (!searchTerm) return familiesData.data;
    
//     const search = searchTerm.toLowerCase();
//     return familiesData.data.filter(family => 
//       family.familyName?.toLowerCase().includes(search) ||
//       family.familyNumber?.toLowerCase().includes(search) ||
//       family.clan?.toLowerCase().includes(search)
//     );
//   }, [familiesData, searchTerm]);

//   // Get members count per family
//   const getFamilyMemberCount = (familyId) => {
//     if (!membersData?.data) return 0;
//     return membersData.data.filter(m => m.family?._id === familyId || m.family === familyId).length;
//   };

//   const handleFamilyClick = (family) => {
//     setSelectedFamily(family);
//     setViewMode('tree');
//   };

//   const handleBackToGrid = () => {
//     setSelectedFamily(null);
//     setViewMode('grid');
//   };

//   const handleMemberClick = (member) => {
//     navigate(`/profile/${member._id}`);
//   };

//   // Render family card
//   const FamilyCard = ({ family }) => {
//     const memberCount = getFamilyMemberCount(family._id);
//     const headOfFamily = family.headOfFamily || {};

//     return (
//       <motion.div
//         whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }}
//         className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
//         onClick={() => handleFamilyClick(family)}
//       >
//         <div className="relative">
//           <div className="h-32 bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
//             <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
//               {family.familyPhoto ? (
//                 <img 
//                   src={family.familyPhoto} 
//                   alt={family.familyName}
//                   className="w-full h-full object-cover rounded-full"
//                 />
//               ) : (
//                 <FaHome className="text-white text-3xl" />
//               )}
//             </div>
//           </div>
          
//           {family.familyPhoto && (
//             <div className="absolute -bottom-10 left-4 w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg">
//               <img 
//                 src={family.familyPhoto} 
//                 alt={family.familyName}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           )}
//         </div>

//         <div className="pt-8 pb-4 px-4">
//           <h3 className="font-bold text-lg text-gray-800 truncate">
//             {family.familyName || 'Unnamed Family'}
//           </h3>
//           <p className="text-sm text-gray-500">
//             House No. {family.familyNumber || 'N/A'}
//           </p>
          
//           <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
//             <div className="flex items-center gap-1.5">
//               <FaUsers className="text-green-500 text-sm" />
//               <span className="text-sm font-medium text-gray-700">{memberCount} Members</span>
//             </div>
//             {family.clan && (
//               <div className="flex items-center gap-1.5">
//                 <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
//                   {family.clan}
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="mt-3">
//             <span className="text-xs text-green-600 font-medium flex items-center gap-1">
//               <FaTree className="text-xs" />
//               Open Tree
//             </span>
//           </div>
//         </div>
//       </motion.div>
//     );
//   };

//   // Loading state
//   if (familiesLoading || membersLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading families...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <FaTree className="text-green-500" />
//             Family Tree
//           </h1>
//           <p className="text-gray-600">Browse and explore family trees</p>
//         </div>
        
//         {viewMode === 'tree' && selectedFamily && (
//           <button
//             onClick={handleBackToGrid}
//             className="px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg text-sm font-medium transition-colors flex items-center gap-2"
//           >
//             <FaHome className="text-sm" />
//             Back to Families
//           </button>
//         )}
//       </div>

//       {viewMode === 'grid' ? (
//         <>
//           {/* Search Bar */}
//           <div className="relative max-w-md">
//             <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//             <input
//               type="text"
//               placeholder="Search Family by Name, Number, or Clan..."
//               value={searchTerm}
//               onChange={(e) => setSearchTerm(e.target.value)}
//               className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//             />
//           </div>

//           {/* Family Grid */}
//           {filteredFamilies.length === 0 ? (
//             <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
//               <FaHome className="text-4xl text-gray-300 mx-auto mb-3" />
//               <p className="text-gray-500">No families found</p>
//               <p className="text-sm text-gray-400">Try adjusting your search</p>
//             </div>
//           ) : (
//             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//               {filteredFamilies.map((family) => (
//                 <FamilyCard key={family._id} family={family} />
//               ))}
//             </div>
//           )}
//         </>
//       ) : (
//         // Tree View
//         selectedFamily && (
//           <div className="bg-white rounded-xl border border-gray-200 overflow-hidden">
//             <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-green-50 to-emerald-50">
//               <div className="flex items-center gap-4">
//                 <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-white shadow">
//                   {selectedFamily.familyPhoto ? (
//                     <img 
//                       src={selectedFamily.familyPhoto} 
//                       alt={selectedFamily.familyName}
//                       className="w-full h-full object-cover"
//                     />
//                   ) : (
//                     <div className="w-full h-full bg-green-200 flex items-center justify-center">
//                       <FaHome className="text-green-600" />
//                     </div>
//                   )}
//                 </div>
//                 <div>
//                   <h2 className="text-xl font-bold text-gray-800">
//                     {selectedFamily.familyName}
//                   </h2>
//                   <p className="text-sm text-gray-500">
//                     House No. {selectedFamily.familyNumber} • {getFamilyMemberCount(selectedFamily._id)} Members
//                   </p>
//                 </div>
//               </div>
//             </div>

//             <div className="p-6 min-h-[500px]">
//               {treeLoading ? (
//                 <div className="flex items-center justify-center h-64">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
//                 </div>
//               ) : (
//                 <FamilyTreeView 
//                   members={treeData?.data || []} 
//                   layout="horizontal"
//                   onMemberClick={handleMemberClick}
//                   familyId={selectedFamily._id}
//                 />
//               )}
//             </div>
//           </div>
//         )
//       )}
//     </div>
//   );
// };

// export default FamilyTreePage;


// src/pages/FamilyTreePage.jsx - COMPLETE UPDATED

// import React, { useState, useMemo, useRef } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { getFamilies, getFamilyTreeByFamily } from '../api/families';
// import { getMembers } from '../api/members';
// import { useNavigate } from 'react-router-dom';
// import { motion } from 'framer-motion';
// import { FaSearch, FaUsers, FaTree, FaHome, FaDownload, FaFileExcel, FaFilePdf, FaImage, FaPrint } from 'react-icons/fa';
// import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// import * as XLSX from 'xlsx';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import Modal from '../components/Modal';
// import Button from '../components/Button';
// import toast from 'react-hot-toast';

// const FamilyTreePage = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedFamily, setSelectedFamily] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [exporting, setExporting] = useState(false);
//   const [exportWithPhotos, setExportWithPhotos] = useState(true);
//   const treeRef = useRef(null);
//   const navigate = useNavigate();

//   // Fetch all families
//   const { data: familiesData, isLoading: familiesLoading } = useQuery({
//     queryKey: ['families'],
//     queryFn: () => getFamilies({ limit: 1000 }),
//   });

//   // Fetch all members for tree generation
//   const { data: membersData, isLoading: membersLoading } = useQuery({
//     queryKey: ['members-tree'],
//     queryFn: () => getMembers({ limit: 10000 }),
//   });

//   // Get family tree data for selected family
//   const { data: treeData, isLoading: treeLoading } = useQuery({
//     queryKey: ['familyTree', selectedFamily?._id],
//     queryFn: () => getFamilyTreeByFamily(selectedFamily._id),
//     enabled: !!selectedFamily,
//   });

//   // Filter families by search
//   const filteredFamilies = useMemo(() => {
//     if (!familiesData?.data) return [];
//     if (!searchTerm) return familiesData.data;
    
//     const search = searchTerm.toLowerCase();
//     return familiesData.data.filter(family => 
//       family.familyName?.toLowerCase().includes(search) ||
//       family.familyNumber?.toLowerCase().includes(search) ||
//       family.vanshaGenerationNumber?.toLowerCase().includes(search) ||
//       family.clan?.toLowerCase().includes(search)
//     );
//   }, [familiesData, searchTerm]);

//   // Get members count per family
//   const getFamilyMemberCount = (familyId) => {
//     if (!membersData?.data) return 0;
//     return membersData.data.filter(m => m.family?._id === familyId || m.family === familyId).length;
//   };

//   const handleFamilyClick = (family) => {
//     setSelectedFamily(family);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedFamily(null);
//   };

//   const handleMemberClick = (member) => {
//     navigate(`/profile/${member._id}`);
//   };

//   // ============ EXPORT FUNCTIONS ============

//   // Export to Excel
//   const exportToExcel = () => {
//     if (!treeData?.data) {
//       toast.error('कुनै डाटा छैन');
//       return;
//     }

//     setExporting(true);
//     try {
//       const flattenTree = (nodes, level = 0, parent = '') => {
//         let result = [];
//         nodes.forEach(node => {
//           result.push({
//             'पुस्ता': level,
//             'नाम': node.name,
//             'सम्बन्ध': node.relationship || 'सदस्य',
//             'वंश नं.': node.vanshaGenerationNumber || '',
//             'पुस्ता नं.': node.generation || '',
//             'रोल नं.': node.rollNumber || '',
//             'जन्म मिति': node.dob ? new Date(node.dob).toLocaleDateString('ne-NP') : '',
//             'मृत्यु मिति': node.dod ? new Date(node.dod).toLocaleDateString('ne-NP') : '',
//             'जीवित': node.isAlive ? 'हो' : 'होइन',
//             'फोटो': node.photo ? 'छ' : 'छैन',
//             'परिवार': node.family?.familyName || '',
//           });
//           if (node.children && node.children.length > 0) {
//             result = result.concat(flattenTree(node.children, level + 1, node.name));
//           }
//         });
//         return result;
//       };

//       const data = flattenTree(treeData.data);
//       const ws = XLSX.utils.json_to_sheet(data);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Family Tree');
      
//       // Auto column widths
//       const colWidths = [
//         { wch: 8 }, { wch: 20 }, { wch: 15 }, { wch: 12 },
//         { wch: 12 }, { wch: 12 }, { wch: 15 }, { wch: 15 },
//         { wch: 10 }, { wch: 10 }, { wch: 15 }
//       ];
//       ws['!cols'] = colWidths;

//       XLSX.writeFile(wb, `Family_Tree_${selectedFamily?.familyName || 'All'}_${new Date().toISOString().split('T')[0]}.xlsx`);
//       toast.success('Excel export successful!');
//     } catch (error) {
//       console.error('Export error:', error);
//       toast.error('Failed to export Excel');
//     } finally {
//       setExporting(false);
//     }
//   };

//   // Export to PDF
//   const exportToPDF = async () => {
//     if (!treeRef.current) {
//       toast.error('Tree not ready');
//       return;
//     }

//     setExporting(true);
//     try {
//       const canvas = await html2canvas(treeRef.current, {
//         scale: 2,
//         useCORS: true,
//         allowTaint: true,
//         backgroundColor: '#ffffff',
//         logging: false,
//       });
      
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF({
//         orientation: 'landscape',
//         unit: 'px',
//         format: [canvas.width * 0.75, canvas.height * 0.75],
//       });
      
//       pdf.addImage(imgData, 'PNG', 0, 0, canvas.width * 0.75, canvas.height * 0.75);
//       pdf.save(`Family_Tree_${selectedFamily?.familyName || 'All'}_${new Date().toISOString().split('T')[0]}.pdf`);
//       toast.success('PDF export successful!');
//     } catch (error) {
//       console.error('PDF export error:', error);
//       toast.error('Failed to export PDF');
//     } finally {
//       setExporting(false);
//     }
//   };

//   // Export to Image
//   const exportToImage = async () => {
//     if (!treeRef.current) {
//       toast.error('Tree not ready');
//       return;
//     }

//     setExporting(true);
//     try {
//       const canvas = await html2canvas(treeRef.current, {
//         scale: 2,
//         useCORS: true,
//         allowTaint: true,
//         backgroundColor: '#ffffff',
//         logging: false,
//       });
      
//       const link = document.createElement('a');
//       link.download = `Family_Tree_${selectedFamily?.familyName || 'All'}_${new Date().toISOString().split('T')[0]}.png`;
//       link.href = canvas.toDataURL('image/png');
//       link.click();
//       toast.success('Image export successful!');
//     } catch (error) {
//       console.error('Image export error:', error);
//       toast.error('Failed to export Image');
//     } finally {
//       setExporting(false);
//     }
//   };

//   // Print
//   const handlePrint = () => {
//     window.print();
//   };

//   // Render family card
//   const FamilyCard = ({ family }) => {
//     const memberCount = getFamilyMemberCount(family._id);
//     const isClosed = family.status === 'closed';

//     return (
//       <motion.div
//         whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }}
//         className={`bg-white rounded-2xl border ${isClosed ? 'border-gray-300' : 'border-green-200'} 
//           overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer`}
//         onClick={() => handleFamilyClick(family)}
//       >
//         <div className="relative">
//           <div className={`h-32 ${isClosed ? 'bg-gray-300' : 'bg-gradient-to-r from-green-400 to-emerald-500'} 
//             flex items-center justify-center`}>
//             <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
//               {family.familyPhoto ? (
//                 <img 
//                   src={family.familyPhoto} 
//                   alt={family.familyName}
//                   className="w-full h-full object-cover rounded-full"
//                 />
//               ) : (
//                 <FaHome className={`text-white text-3xl ${isClosed ? 'opacity-50' : ''}`} />
//               )}
//             </div>
//           </div>
          
//           {family.familyPhoto && (
//             <div className="absolute -bottom-10 left-4 w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg">
//               <img 
//                 src={family.familyPhoto} 
//                 alt={family.familyName}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           )}
//         </div>

//         <div className="pt-8 pb-4 px-4">
//           <div className="flex items-start justify-between">
//             <div>
//               <h3 className="font-bold text-lg text-gray-800 truncate">
//                 {family.familyName || 'Unnamed Family'}
//               </h3>
//               <p className="text-sm text-gray-500">
//                 घर नं. {family.house?.houseNumber || 'N/A'} • परिवार नं. {family.familyNumber}
//               </p>
//               {family.vanshaGenerationNumber && (
//                 <p className="text-xs text-gray-400 mt-0.5">
//                   वंश/पुस्ता: {family.vanshaGenerationNumber}
//                 </p>
//               )}
//             </div>
//             {isClosed && (
//               <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">
//                 बन्द
//               </span>
//             )}
//           </div>
          
//           <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
//             <div className="flex items-center gap-1.5">
//               <FaUsers className={`${isClosed ? 'text-gray-400' : 'text-blue-500'} text-sm`} />
//               <span className={`text-sm font-medium ${isClosed ? 'text-gray-500' : 'text-gray-700'}`}>
//                 {memberCount} सदस्यहरू
//               </span>
//             </div>
//             {family.clan && (
//               <div className="flex items-center gap-1.5">
//                 <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
//                   {family.clan}
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="mt-3">
//             <span className={`text-xs font-medium flex items-center gap-1 ${isClosed ? 'text-gray-400' : 'text-green-600'}`}>
//               <FaTree className="text-xs" />
//               {isClosed ? 'हेर्नुहोस्' : 'वृक्ष हेर्नुहोस्'}
//             </span>
//           </div>
//         </div>
//       </motion.div>
//     );
//   };

//   // Render tree nodes with cards
//   const renderTreeNode = (node, level = 0) => {
//     if (!node) return null;

//     const hasChildren = node.children && node.children.length > 0;
//     const isDeceased = !node.isAlive;

//     return (
//       <div key={node._id} className="flex flex-col items-center relative">
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
//               border-2 ${isDeceased ? 'border-gray-300' : 'border-green-200'}
//               cursor-pointer min-w-[140px] max-w-[180px] p-3
//               hover:border-green-400
//             `}
//             onClick={() => handleMemberClick(node)}
//           >
//             {/* Photo */}
//             <div className="relative">
//               <div className={`
//                 w-16 h-16 mx-auto rounded-full overflow-hidden border-2 
//                 ${isDeceased ? 'border-gray-300' : 'border-green-200'}
//                 mb-2 bg-gray-100
//               `}>
//                 {exportWithPhotos && node.photo ? (
//                   <img 
//                     src={node.photo} 
//                     alt={node.name}
//                     className="w-full h-full object-cover"
//                     onError={(e) => {
//                       e.target.src = '/default-avatar.png';
//                     }}
//                   />
//                 ) : (
//                   <div className={`
//                     w-full h-full flex items-center justify-center
//                     ${isDeceased ? 'bg-gray-200' : 'bg-gradient-to-br from-green-100 to-emerald-100'}
//                   `}>
//                     <span className="text-2xl">
//                       {node.gender === 'male' ? '👨' : node.gender === 'female' ? '👩' : '👤'}
//                     </span>
//                   </div>
//                 )}
//               </div>
              
//               {/* Deceased badge */}
//               {isDeceased && (
//                 <div className="absolute -top-1 -right-1 bg-gray-600 text-white rounded-full px-1.5 py-0.5 text-[8px] font-bold">
//                   ✝
//                 </div>
//               )}
//             </div>

//             {/* Name */}
//             <div className="text-center">
//               <p className="font-semibold text-sm text-gray-800 truncate" title={node.name}>
//                 {node.name}
//               </p>
//               {node.rollNumber && (
//                 <p className="text-xs text-green-600 font-mono">
//                   रोल {node.rollNumber}
//                 </p>
//               )}
//               {node.vanshaGenerationNumber && (
//                 <p className="text-[10px] text-gray-400">
//                   वंश {node.vanshaGenerationNumber}
//                 </p>
//               )}
//               {node.generation && (
//                 <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
//                   पुस्ता {node.generation}
//                 </span>
//               )}
//             </div>

//             {/* Relationship badge */}
//             {node.relationship && node.relationship !== 'सदस्य' && (
//               <div className="flex items-center justify-center mt-1">
//                 <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
//                   {node.relationship}
//                 </span>
//               </div>
//             )}

//             {/* DOB/DOD */}
//             <div className="text-center mt-1">
//               {node.dob && (
//                 <p className="text-[10px] text-gray-500">
//                   जन्म: {new Date(node.dob).toLocaleDateString('ne-NP')}
//                 </p>
//               )}
//               {node.dod && (
//                 <p className="text-[10px] text-red-500">
//                   मृत्यु: {new Date(node.dod).toLocaleDateString('ne-NP')}
//                 </p>
//               )}
//             </div>
//           </div>
//         </motion.div>

//         {/* Children */}
//         {hasChildren && (
//           <div className="relative mt-4">
//             {/* Vertical line from parent to children */}
//             <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-green-300 -mt-1" />
            
//             {/* Horizontal line connecting children */}
//             <div className="relative flex flex-wrap justify-center gap-6 pt-4">
//               <div className="absolute top-0 left-[10%] right-[10%] h-0.5 bg-green-300" />
              
//               {node.children.map((child) => (
//                 <div key={child._id} className="relative">
//                   {/* Vertical line to each child */}
//                   <div className="absolute -top-4 left-1/2 w-0.5 h-4 bg-green-300" />
//                   {renderTreeNode(child, level + 1)}
//                 </div>
//               ))}
//             </div>
//           </div>
//         )}
//       </div>
//     );
//   };

//   // Loading state
//   if (familiesLoading || membersLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">परिवारहरू लोड हुँदै...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <FaTree className="text-green-500" />
//             पारिवारिक वृक्ष
//           </h1>
//           <p className="text-gray-600">परिवारको वृक्ष हेर्नुहोस् र डाउनलोड गर्नुहोस्</p>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="relative max-w-md">
//         <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//         <input
//           type="text"
//           placeholder="परिवारको नाम, नम्बर, वंश/पुस्ता, वा कुल द्वारा खोज्नुहोस्..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//         />
//       </div>

//       {/* Family Grid */}
//       {filteredFamilies.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
//           <FaHome className="text-4xl text-gray-300 mx-auto mb-3" />
//           <p className="text-gray-500">कुनै परिवार फेला परेन</p>
//           <p className="text-sm text-gray-400">आफ्नो खोज समायोजन गर्नुहोस्</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredFamilies.map((family) => (
//             <FamilyCard key={family._id} family={family} />
//           ))}
//         </div>
//       )}

//       {/* Family Tree Modal */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         title={selectedFamily?.familyName || 'पारिवारिक वृक्ष'}
//         size="xl"
//       >
//         {selectedFamily && (
//           <div className="space-y-4">
//             {/* Family Info Bar */}
//             <div className={`flex flex-wrap items-center gap-4 p-4 rounded-xl border
//               ${selectedFamily.status === 'closed' 
//                 ? 'bg-gray-50 border-gray-200' 
//                 : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'}`}>
//               <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow flex-shrink-0">
//                 {selectedFamily.familyPhoto ? (
//                   <img 
//                     src={selectedFamily.familyPhoto} 
//                     alt={selectedFamily.familyName}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className={`w-full h-full ${selectedFamily.status === 'closed' ? 'bg-gray-200' : 'bg-green-200'} 
//                     flex items-center justify-center`}>
//                     <FaHome className={`${selectedFamily.status === 'closed' ? 'text-gray-500' : 'text-green-600'} text-2xl`} />
//                   </div>
//                 )}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="text-xl font-bold text-gray-800">
//                   {selectedFamily.familyName}
//                 </h3>
//                 <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
//                   <span>घर नं. {selectedFamily.house?.houseNumber || 'N/A'}</span>
//                   <span>•</span>
//                   <span>परिवार नं. {selectedFamily.familyNumber}</span>
//                   {selectedFamily.vanshaGenerationNumber && (
//                     <>
//                       <span>•</span>
//                       <span>वंश/पुस्ता: {selectedFamily.vanshaGenerationNumber}</span>
//                     </>
//                   )}
//                   {selectedFamily.status === 'closed' && (
//                     <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs font-medium ml-2">
//                       🔒 बन्द
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-xs text-gray-500">
//                   {getFamilyMemberCount(selectedFamily._id)} सदस्यहरू
//                 </p>
//               </div>

//               {/* Export Buttons */}
//               <div className="flex flex-wrap gap-2 flex-shrink-0">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={exportToExcel}
//                   disabled={exporting}
//                   className="flex items-center"
//                 >
//                   <FaFileExcel className="mr-1.5 text-green-600" />
//                   Excel
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={exportToPDF}
//                   disabled={exporting}
//                   className="flex items-center"
//                 >
//                   <FaFilePdf className="mr-1.5 text-red-600" />
//                   PDF
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={exportToImage}
//                   disabled={exporting}
//                   className="flex items-center"
//                 >
//                   <FaImage className="mr-1.5 text-blue-600" />
//                   Image
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={handlePrint}
//                   className="flex items-center"
//                 >
//                   <FaPrint className="mr-1.5 text-gray-600" />
//                   Print
//                 </Button>
//               </div>
//             </div>

//             {/* Photo toggle */}
//             <div className="flex items-center gap-2">
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={exportWithPhotos}
//                   onChange={(e) => setExportWithPhotos(e.target.checked)}
//                   className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//                 />
//                 <span className="text-sm text-gray-700">फोटो सहित</span>
//               </label>
//             </div>

//             {/* Tree View */}
//             <div 
//               ref={treeRef}
//               className="min-h-[400px] max-h-[70vh] overflow-auto bg-white rounded-xl p-4"
//             >
//               {treeLoading ? (
//                 <div className="flex items-center justify-center h-64">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
//                 </div>
//               ) : treeData?.data && treeData.data.length > 0 ? (
//                 <div className="flex flex-wrap justify-center gap-4 p-4 min-h-[400px]">
//                   {treeData.data.map((root) => (
//                     <div key={root._id} className="flex flex-col items-center">
//                       {renderTreeNode(root, 0)}
//                     </div>
//                   ))}
//                 </div>
//               ) : (
//                 <div className="text-center py-12">
//                   <FaTree className="text-4xl text-gray-300 mx-auto mb-3" />
//                   <p className="text-gray-500">कुनै वृक्ष डाटा उपलब्ध छैन</p>
//                   <p className="text-sm text-gray-400">वृक्ष निर्माण गर्न सदस्यहरू र सम्बन्धहरू थप्नुहोस्</p>
//                 </div>
//               )}
//             </div>

//             {/* Tree info */}
//             {treeData?.data && treeData.data.length > 0 && (
//               <div className="text-center text-sm text-gray-500">
//                 <span className="bg-gray-100 px-3 py-1 rounded-full">
//                   कुल {treeData.count || treeData.data.reduce((acc, node) => {
//                     const countNodes = (n) => {
//                       let total = 1;
//                       if (n.children) {
//                         n.children.forEach(c => total += countNodes(c));
//                       }
//                       return total;
//                     };
//                     return acc + countNodes(node);
//                   }, 0)} सदस्यहरू
//                 </span>
//               </div>
//             )}
//           </div>
//         )}
//       </Modal>

//       {/* Print styles */}
//       <style jsx global>{`
//         @media print {
//           body * {
//             visibility: hidden;
//           }
//           #print-area, #print-area * {
//             visibility: visible;
//           }
//           #print-area {
//             position: absolute;
//             left: 0;
//             top: 0;
//             width: 100%;
//           }
//           .no-print {
//             display: none !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default FamilyTreePage;


// src/pages/FamilyTreePage.jsx - COMPLETE IMPLEMENTATION WITH ALL REQUIREMENTS

import React, { useState, useMemo, useRef, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFamilies, getFamilyTreeByFamily } from '../api/families';
import { getMembers } from '../api/members';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FaSearch, FaUsers, FaTree, FaHome, FaFileExcel, FaFilePdf, 
  FaImage, FaPrint, FaUser, FaHeart, FaExpand, FaCompress,
  FaPlus, FaMinus, FaMale, FaFemale, FaUserCircle, FaCamera,
  FaAngleUp, FaAngleDown, FaArrowsAlt, FaEye, FaEyeSlash
} from 'react-icons/fa';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import * as XLSX from 'xlsx';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import Modal from '../components/Modal';
import Button from '../components/Button';
import toast from 'react-hot-toast';

const FamilyTreePage = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showPhotos, setShowPhotos] = useState(true);
  const [zoomLevel, setZoomLevel] = useState(1);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [showAncestors, setShowAncestors] = useState(true);
  const [isPrinting, setIsPrinting] = useState(false);
  const [treeWidth, setTreeWidth] = useState('auto');
  
  const treeRef = useRef(null);
  const containerRef = useRef(null);
  const printContainerRef = useRef(null);
  const navigate = useNavigate();

  // Fetch all families
  const { data: familiesData, isLoading: familiesLoading } = useQuery({
    queryKey: ['families'],
    queryFn: () => getFamilies({ limit: 1000 }),
  });

  // Fetch all members for tree generation
  const { data: membersData, isLoading: membersLoading } = useQuery({
    queryKey: ['members-tree'],
    queryFn: () => getMembers({ limit: 10000 }),
  });

  // Get family tree data for selected family
  const { data: treeData, isLoading: treeLoading, refetch: refetchTree } = useQuery({
    queryKey: ['familyTree', selectedFamily?._id],
    queryFn: () => getFamilyTreeByFamily(selectedFamily._id),
    enabled: !!selectedFamily,
  });

  // Filter families by search
  const filteredFamilies = useMemo(() => {
    if (!familiesData?.data) return [];
    if (!searchTerm) return familiesData.data;
    
    const search = searchTerm.toLowerCase();
    return familiesData.data.filter(family => 
      family.familyName?.toLowerCase().includes(search) ||
      family.familyNumber?.toLowerCase().includes(search) ||
      family.vanshaGenerationNumber?.toLowerCase().includes(search) ||
      family.clan?.toLowerCase().includes(search)
    );
  }, [familiesData, searchTerm]);

  // Get members count per family
  const getFamilyMemberCount = (familyId) => {
    if (!membersData?.data) return 0;
    return membersData.data.filter(m => m.family?._id === familyId || m.family === familyId).length;
  };

  const handleFamilyClick = (family) => {
    setSelectedFamily(family);
    setExpandedNodes(new Set());
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedFamily(null);
  };

  const handleMemberClick = (member) => {
    navigate(`/profile/${member._id}`);
  };

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

  // Toggle all nodes
  const toggleAllNodes = () => {
    if (expandedNodes.size > 0) {
      setExpandedNodes(new Set());
    } else {
      const allIds = new Set();
      const collectIds = (nodes) => {
        nodes.forEach(node => {
          allIds.add(node._id);
          if (node.children) collectIds(node.children);
        });
      };
      if (treeData?.data) collectIds(treeData.data);
      setExpandedNodes(allIds);
    }
  };

  // Zoom controls
  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.3));
  const handleResetZoom = () => setZoomLevel(1);
  const handleFitToScreen = () => {
    if (treeRef.current && containerRef.current) {
      const treeWidth = treeRef.current.scrollWidth;
      const containerWidth = containerRef.current.clientWidth;
      if (treeWidth > containerWidth) {
        const newZoom = (containerWidth - 40) / treeWidth;
        setZoomLevel(Math.min(newZoom, 1));
      } else {
        setZoomLevel(1);
      }
    }
  };

  // ============ EXPORT FUNCTIONS ============

  const exportToExcel = () => {
    if (!treeData?.data) {
      toast.error('कुनै डाटा छैन');
      return;
    }

    setExporting(true);
    try {
      const flattenTree = (nodes, level = 0, parent = '') => {
        let result = [];
        nodes.forEach(node => {
          result.push({
            'पुस्ता': level,
            'नाम': node.name || '',
            'सम्बन्ध': node.relationship || 'सदस्य',
            'वंशज नं.': node.vanshaGenerationNumber || '',
            'परिवार नं.': node.familyNumber || '',
            'रोल नं.': node.rollNumber || '',
            'जन्म मिति': node.dob ? new Date(node.dob).toLocaleDateString('ne-NP') : '',
            'मृत्यु मिति': node.dod ? new Date(node.dod).toLocaleDateString('ne-NP') : '',
            'जीवित': node.isAlive ? 'हो' : 'होइन',
            'लिङ्ग': node.gender === 'male' ? 'पुरुष' : node.gender === 'female' ? 'महिला' : 'अन्य',
            'फोटो': node.photo ? 'छ' : 'छैन',
            'परिवार': node.family?.familyName || '',
            'पूर्वज': parent || '',
          });
          if (node.children && node.children.length > 0) {
            result = result.concat(flattenTree(node.children, level + 1, node.name));
          }
        });
        return result;
      };

      const data = flattenTree(treeData.data);
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, 'Family Tree');
      
      const colWidths = [
        { wch: 8 }, { wch: 25 }, { wch: 18 }, { wch: 14 },
        { wch: 14 }, { wch: 12 }, { wch: 15 }, { wch: 15 },
        { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 20 },
        { wch: 20 }
      ];
      ws['!cols'] = colWidths;

      XLSX.writeFile(wb, `Family_Tree_${selectedFamily?.familyName || 'All'}_${new Date().toISOString().split('T')[0]}.xlsx`);
      toast.success('Excel export successful!');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export Excel');
    } finally {
      setExporting(false);
    }
  };

  const exportToPDF = async () => {
    if (!treeRef.current) {
      toast.error('Tree not ready');
      return;
    }

    setExporting(true);
    try {
      const canvas = await html2canvas(treeRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: treeRef.current.scrollWidth,
        height: treeRef.current.scrollHeight,
        windowWidth: treeRef.current.scrollWidth,
        windowHeight: treeRef.current.scrollHeight,
      });
      
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px',
        format: [canvas.width, canvas.height],
      });
      
      pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
      pdf.save(`Family_Tree_${selectedFamily?.familyName || 'All'}_${new Date().toISOString().split('T')[0]}.pdf`);
      toast.success('PDF export successful!');
    } catch (error) {
      console.error('PDF export error:', error);
      toast.error('Failed to export PDF');
    } finally {
      setExporting(false);
    }
  };

  const exportToImage = async () => {
    if (!treeRef.current) {
      toast.error('Tree not ready');
      return;
    }

    setExporting(true);
    try {
      const canvas = await html2canvas(treeRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        width: treeRef.current.scrollWidth,
        height: treeRef.current.scrollHeight,
        windowWidth: treeRef.current.scrollWidth,
        windowHeight: treeRef.current.scrollHeight,
      });
      
      const link = document.createElement('a');
      link.download = `Family_Tree_${selectedFamily?.familyName || 'All'}_${new Date().toISOString().split('T')[0]}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
      toast.success('Image export successful!');
    } catch (error) {
      console.error('Image export error:', error);
      toast.error('Failed to export Image');
    } finally {
      setExporting(false);
    }
  };

  // ============ TREE-ONLY PRINT IMPLEMENTATION ============

  const handlePrint = useCallback(() => {
    setIsPrinting(true);
    
    // Create print-specific content
    const printContent = document.createElement('div');
    printContent.className = 'print-only-content';
    printContent.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background: white;
      z-index: 99999;
      overflow: auto;
      padding: 40px;
    `;

    // Clone the tree content for printing
    const treeElement = treeRef.current;
    if (treeElement) {
      const clonedTree = treeElement.cloneNode(true);
      // Remove any interactive elements from clone
      const buttons = clonedTree.querySelectorAll('button');
      buttons.forEach(btn => btn.remove());
      
      printContent.appendChild(clonedTree);
    }

    document.body.appendChild(printContent);

    // Force print after a short delay
    setTimeout(() => {
      window.print();
      
      // Clean up after print dialog closes
      setTimeout(() => {
        if (printContent.parentNode) {
          printContent.parentNode.removeChild(printContent);
        }
        setIsPrinting(false);
      }, 500);
    }, 200);
  }, []);

  // ============ TREE RENDERER ============

  // Render head-only ancestor node
  const renderAncestorNode = (ancestor, isLast = false) => {
    if (!ancestor) return null;

    const isDeceased = !ancestor.isAlive;
    const genderIcon = ancestor.gender === 'male' ? '👴' : ancestor.gender === 'female' ? '👵' : '👤';

    return (
      <div className="flex flex-col items-center ancestor-node">
        <div 
          className={`
            w-14 h-14 rounded-full overflow-hidden border-2 
            ${isDeceased ? 'border-gray-300' : 'border-amber-300'}
            bg-amber-50 shadow-sm cursor-pointer hover:shadow-md transition-shadow
            flex-shrink-0
          `}
          onClick={() => handleMemberClick(ancestor)}
          title={ancestor.name}
        >
          {showPhotos && ancestor.photo ? (
            <img 
              src={ancestor.photo} 
              alt={ancestor.name}
              className="w-full h-full object-cover"
              onError={(e) => {
                e.target.src = '/default-avatar.png';
              }}
            />
          ) : showPhotos ? (
            <div className={`
              w-full h-full flex items-center justify-center text-2xl
              ${isDeceased ? 'bg-gray-200' : 'bg-amber-100'}
            `}>
              {genderIcon}
            </div>
          ) : (
            <div className="w-full h-full flex items-center justify-center text-[10px] font-medium text-gray-600 bg-amber-50 px-1 text-center">
              {ancestor.name?.length > 10 ? ancestor.name.substring(0, 8) + '..' : ancestor.name}
            </div>
          )}
        </div>
        {isDeceased && (
          <span className="text-[9px] text-red-400 mt-0.5">✝</span>
        )}
      </div>
    );
  };

  // Render full member card
  const renderMemberCard = (member, isSpouse = false) => {
    if (!member) return null;

    const isDeceased = !member.isAlive;
    const hasChildren = member.children && member.children.length > 0;
    const isExpanded = expandedNodes.has(member._id);
    const genderIcon = member.gender === 'male' ? '👨' : member.gender === 'female' ? '👩' : '👤';

    return (
      <div className="relative group" key={member._id}>
        <div 
          className={`
            bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 
            border-2 ${isDeceased ? 'border-gray-300' : isSpouse ? 'border-pink-300' : 'border-green-300'}
            cursor-pointer w-52
            hover:border-green-400
            ${isSpouse ? 'bg-pink-50/80' : ''}
          `}
          onClick={() => handleMemberClick(member)}
        >
          <div className="p-3">
            {/* Photo and Relationship */}
            <div className="flex items-start gap-2">
              {/* Photo */}
              <div className="flex-shrink-0">
                <div className={`
                  w-14 h-14 rounded-full overflow-hidden border-2 
                  ${isDeceased ? 'border-gray-300' : isSpouse ? 'border-pink-300' : 'border-green-200'}
                  bg-gray-100
                `}>
                  {showPhotos && member.photo ? (
                    <img 
                      src={member.photo} 
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  ) : showPhotos ? (
                    <div className={`
                      w-full h-full flex items-center justify-center text-2xl
                      ${isDeceased ? 'bg-gray-200' : isSpouse ? 'bg-pink-100' : 'bg-gradient-to-br from-green-100 to-emerald-100'}
                    `}>
                      {genderIcon}
                    </div>
                  ) : null}
                </div>
              </div>

              {/* Info */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-1 flex-wrap">
                  <span className="text-[9px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full truncate max-w-[60px]">
                    {member.relationship || 'सदस्य'}
                  </span>
                  {isSpouse && (
                    <span className="text-[9px] bg-pink-50 text-pink-600 px-1.5 py-0.5 rounded-full">
                      श्रीमती
                    </span>
                  )}
                  {isDeceased && (
                    <span className="text-[9px] text-red-500">✝</span>
                  )}
                </div>
                <p className="font-semibold text-sm text-gray-800 truncate mt-0.5" title={member.name}>
                  {member.name}
                </p>
                {member.surname && (
                  <p className="text-[10px] text-gray-500 truncate">{member.surname}</p>
                )}
              </div>
            </div>

            {/* Details */}
            <div className="mt-2 pt-2 border-t border-gray-100 text-[10px] text-gray-500 space-y-0.5">
              {member.vanshaGenerationNumber && (
                <p className="truncate">वंशज नं: {member.vanshaGenerationNumber}</p>
              )}
              {member.familyNumber && (
                <p className="truncate">परिवार नं: {member.familyNumber}</p>
              )}
              {member.rollNumber && (
                <p className="truncate">रोल नं: {member.rollNumber}</p>
              )}
              {member.generation && (
                <p className="truncate">पुस्ता: {member.generation}</p>
              )}
            </div>

            {/* DOB/DOD */}
            <div className="mt-1 text-[9px] text-gray-400">
              {member.dob && (
                <p>जन्म: {new Date(member.dob).toLocaleDateString('ne-NP')}</p>
              )}
              {member.dod && (
                <p className="text-red-400">मृत्यु: {new Date(member.dod).toLocaleDateString('ne-NP')}</p>
              )}
            </div>

            {/* Children count badge */}
            {hasChildren && (
              <div className="mt-1 text-[9px] text-green-500">
                {member.children.length} सन्तान
              </div>
            )}
          </div>
        </div>

        {/* Expand button for children */}
        {hasChildren && (
          <button
            onClick={(e) => toggleNode(member._id, e)}
            className="absolute -bottom-2.5 right-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md hover:bg-green-600 transition-colors text-xs z-10"
          >
            {isExpanded ? <FaMinus className="text-[8px]" /> : <FaPlus className="text-[8px]" />}
          </button>
        )}
      </div>
    );
  };

  // Render family node with proper connector structure
  const renderFamilyNode = (node, level = 0, isChild = false) => {
    if (!node) return null;

    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node._id);
    const hasSpouse = node.spouse && Object.keys(node.spouse).length > 0;
    const spouse = hasSpouse ? node.spouse : null;
    const isDeceased = !node.isAlive;

    return (
      <div key={node._id} className="flex flex-col items-center relative">
        {/* Husband + Wife side by side */}
        <div className="flex items-center gap-2 relative">
          {/* Husband Card */}
          <div className="relative">
            {renderMemberCard(node, false)}
          </div>

          {/* Marriage connector line - only for spouse relationship */}
          {hasSpouse && spouse && (
            <>
              <div className="flex flex-col items-center px-1">
                <div className="w-10 h-0.5 bg-pink-400"></div>
                <span className="text-[8px] text-pink-500 mt-0.5 whitespace-nowrap">विवाह</span>
              </div>
              {/* Spouse Card */}
              {renderMemberCard(spouse, true)}
            </>
          )}
        </div>

        {/* Children connector - ORIGINATES FROM HUSBAND ONLY */}
        {hasChildren && isExpanded && (
          <div className="relative mt-2 w-full">
            {/* Vertical line from HUSBAND card center */}
            <div className="absolute top-0 left-1/2 w-0.5 h-5 bg-green-400 -translate-x-1/2" />
            
            {/* Children container with horizontal bridge */}
            <div className="relative pt-5">
              {/* Horizontal bridge line connecting all children */}
              {node.children.length > 1 && (
                <div className="absolute top-5 left-[10%] right-[10%] h-0.5 bg-green-400" />
              )}
              
              {/* Children positioned with equal spacing */}
              <div className={`
                flex justify-center items-start
                ${node.children.length <= 3 ? 'gap-8' : 
                  node.children.length <= 5 ? 'gap-6' : 
                  node.children.length <= 8 ? 'gap-4' : 'gap-3'}
              `}>
                {node.children.map((child, index) => (
                  <div key={child._id} className="relative flex flex-col items-center">
                    {/* Vertical line from horizontal bridge to each child */}
                    <div className="absolute -top-5 left-1/2 w-0.5 h-5 bg-green-400" />
                    {renderFamilyNode(child, level + 1, true)}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Collapsed children indicator */}
        {hasChildren && !isExpanded && (
          <button
            onClick={(e) => toggleNode(node._id, e)}
            className="mt-2 text-xs text-green-500 hover:text-green-600 flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full transition-colors"
          >
            <FaPlus className="text-[8px]" />
            {node.children.length} सन्तान हेर्नुहोस्
          </button>
        )}
      </div>
    );
  };

  // Build complete tree with spouse mapping and ancestor detection
  const buildTreeWithSpouses = useCallback((nodes, memberMap, level = 0) => {
    if (!nodes) return [];
    
    return nodes.map(node => {
      // Find spouse if exists
      let spouse = null;
      if (node.spouse) {
        const spouseId = typeof node.spouse === 'object' ? node.spouse._id : node.spouse;
        if (spouseId && memberMap[spouseId]) {
          spouse = memberMap[spouseId];
        }
      }
      
      // Recursively process children - children come from husband
      const children = node.children ? buildTreeWithSpouses(node.children, memberMap, level + 1) : [];
      
      return {
        ...node,
        spouse,
        children,
        level,
      };
    });
  }, []);

  // Find ancestors for a node
  const findAncestors = useCallback((node, memberMap) => {
    const ancestors = [];
    
    // Check for father
    if (node.father) {
      const fatherId = typeof node.father === 'object' ? node.father._id : node.father;
      if (fatherId && memberMap[fatherId]) {
        ancestors.push(memberMap[fatherId]);
      }
    }
    
    // Check for grandfather
    if (node.grandfather) {
      const grandId = typeof node.grandfather === 'object' ? node.grandfather._id : node.grandfather;
      if (grandId && memberMap[grandId]) {
        ancestors.push(memberMap[grandId]);
      }
    }
    
    // Check for great-grandfather
    if (node.greatGrandfather) {
      const greatId = typeof node.greatGrandfather === 'object' ? node.greatGrandfather._id : node.greatGrandfather;
      if (greatId && memberMap[greatId]) {
        ancestors.push(memberMap[greatId]);
      }
    }
    
    return ancestors;
  }, []);

  // Get tree data with spouses and ancestors
  const getTreeDataWithSpouses = useCallback(() => {
    if (!treeData?.data) return null;

    // Create a map of all members by ID
    const memberMap = {};
    const buildMap = (nodes) => {
      nodes.forEach(node => {
        memberMap[node._id] = node;
        if (node.children) buildMap(node.children);
      });
    };
    buildMap(treeData.data);

    const treeWithSpouses = buildTreeWithSpouses(treeData.data, memberMap);
    
    // Find ancestors for each root
    const rootsWithAncestors = treeWithSpouses.map(root => {
      const ancestors = findAncestors(root, memberMap);
      return {
        ...root,
        ancestors,
      };
    });
    
    return rootsWithAncestors;
  }, [treeData, buildTreeWithSpouses, findAncestors]);

  // Calculate total nodes for display
  const countTotalNodes = useCallback((nodes) => {
    let count = 0;
    const traverse = (node) => {
      count++;
      if (node.children) {
        node.children.forEach(traverse);
      }
    };
    nodes.forEach(traverse);
    return count;
  }, []);

  // ============ FAMILY CARD COMPONENT ============

  const FamilyCard = ({ family }) => {
    const memberCount = getFamilyMemberCount(family._id);
    const isClosed = family.status === 'closed';

    return (
      <motion.div
        whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }}
        className={`bg-white rounded-2xl border ${isClosed ? 'border-gray-300' : 'border-green-200'} 
          overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer`}
        onClick={() => handleFamilyClick(family)}
      >
        <div className="relative">
          <div className={`h-32 ${isClosed ? 'bg-gray-300' : 'bg-gradient-to-r from-green-400 to-emerald-500'} 
            flex items-center justify-center`}>
            <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
              {family.familyPhoto ? (
                <img 
                  src={family.familyPhoto} 
                  alt={family.familyName}
                  className="w-full h-full object-cover rounded-full"
                />
              ) : (
                <FaHome className={`text-white text-3xl ${isClosed ? 'opacity-50' : ''}`} />
              )}
            </div>
          </div>
          
          {family.familyPhoto && (
            <div className="absolute -bottom-10 left-4 w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg">
              <img 
                src={family.familyPhoto} 
                alt={family.familyName}
                className="w-full h-full object-cover"
              />
            </div>
          )}
        </div>

        <div className="pt-8 pb-4 px-4">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-bold text-lg text-gray-800 truncate">
                {family.familyName || 'Unnamed Family'}
              </h3>
              <p className="text-sm text-gray-500">
                घर नं. {family.house?.houseNumber || 'N/A'} • परिवार नं. {family.familyNumber}
              </p>
              {family.vanshaGenerationNumber && (
                <p className="text-xs text-gray-400 mt-0.5">
                  वंश/पुस्ता: {family.vanshaGenerationNumber}
                </p>
              )}
            </div>
            {isClosed && (
              <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">
                बन्द
              </span>
            )}
          </div>
          
          <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
            <div className="flex items-center gap-1.5">
              <FaUsers className={`${isClosed ? 'text-gray-400' : 'text-blue-500'} text-sm`} />
              <span className={`text-sm font-medium ${isClosed ? 'text-gray-500' : 'text-gray-700'}`}>
                {memberCount} सदस्यहरू
              </span>
            </div>
            {family.clan && (
              <div className="flex items-center gap-1.5">
                <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                  {family.clan}
                </span>
              </div>
            )}
          </div>

          <div className="mt-3">
            <span className={`text-xs font-medium flex items-center gap-1 ${isClosed ? 'text-gray-400' : 'text-green-600'}`}>
              <FaTree className="text-xs" />
              {isClosed ? 'हेर्नुहोस्' : 'वृक्ष हेर्नुहोस्'}
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  // Loading state
  if (familiesLoading || membersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
          <p className="mt-4 text-gray-600">परिवारहरू लोड हुँदै...</p>
        </div>
      </div>
    );
  }

  // Get tree data with spouses and ancestors
  const treeDataWithSpouses = getTreeDataWithSpouses();
  const totalNodes = treeDataWithSpouses ? countTotalNodes(treeDataWithSpouses) : 0;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaTree className="text-green-500" />
            पारिवारिक वृक्ष
          </h1>
          <p className="text-gray-600">परिवारको वृक्ष हेर्नुहोस् र डाउनलोड गर्नुहोस्</p>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="परिवारको नाम, नम्बर, वंश/पुस्ता, वा कुल द्वारा खोज्नुहोस्..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Family Grid */}
      {filteredFamilies.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FaHome className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">कुनै परिवार फेला परेन</p>
          <p className="text-sm text-gray-400">आफ्नो खोज समायोजन गर्नुहोस्</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFamilies.map((family) => (
            <FamilyCard key={family._id} family={family} />
          ))}
        </div>
      )}

      {/* Family Tree Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedFamily?.familyName || 'पारिवारिक वृक्ष'}
        size="xl"
      >
        {selectedFamily && (
          <div className="space-y-4">
            {/* Family Info Bar - Hidden during print */}
            <div className="no-print flex flex-wrap items-center gap-4 p-4 rounded-xl border
              ${selectedFamily.status === 'closed' 
                ? 'bg-gray-50 border-gray-200' 
                : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'}">
              <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow flex-shrink-0">
                {selectedFamily.familyPhoto ? (
                  <img 
                    src={selectedFamily.familyPhoto} 
                    alt={selectedFamily.familyName}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className={`w-full h-full ${selectedFamily.status === 'closed' ? 'bg-gray-200' : 'bg-green-200'} 
                    flex items-center justify-center`}>
                    <FaHome className={`${selectedFamily.status === 'closed' ? 'text-gray-500' : 'text-green-600'} text-2xl`} />
                  </div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedFamily.familyName}
                </h3>
                <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
                  <span>घर नं. {selectedFamily.house?.houseNumber || 'N/A'}</span>
                  <span>•</span>
                  <span>परिवार नं. {selectedFamily.familyNumber}</span>
                  {selectedFamily.vanshaGenerationNumber && (
                    <>
                      <span>•</span>
                      <span>वंश/पुस्ता: {selectedFamily.vanshaGenerationNumber}</span>
                    </>
                  )}
                  {selectedFamily.status === 'closed' && (
                    <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs font-medium ml-2">
                      🔒 बन्द
                    </span>
                  )}
                </div>
                <p className="text-xs text-gray-500">
                  {getFamilyMemberCount(selectedFamily._id)} सदस्यहरू
                </p>
              </div>

              {/* Export Buttons */}
              <div className="flex flex-wrap gap-2 flex-shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToExcel}
                  disabled={exporting}
                  className="flex items-center"
                  title="Excel मा डाउनलोड गर्नुहोस्"
                >
                  <FaFileExcel className="mr-1.5 text-green-600" />
                  Excel
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToPDF}
                  disabled={exporting}
                  className="flex items-center"
                  title="PDF मा डाउनलोड गर्नुहोस्"
                >
                  <FaFilePdf className="mr-1.5 text-red-600" />
                  PDF
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={exportToImage}
                  disabled={exporting}
                  className="flex items-center"
                  title="तस्वीरको रूपमा डाउनलोड गर्नुहोस्"
                >
                  <FaImage className="mr-1.5 text-blue-600" />
                  Image
                </Button>
                <Button
                  variant="primary"
                  size="sm"
                  onClick={handlePrint}
                  className="flex items-center"
                  title="प्रिन्ट गर्नुहोस्"
                >
                  <FaPrint className="mr-1.5" />
                  Print
                </Button>
              </div>
            </div>

            {/* Controls - Hidden during print */}
            <div className="no-print flex flex-wrap items-center gap-4">
              {/* Photo toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPhotos}
                  onChange={(e) => setShowPhotos(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">फोटो सहित</span>
              </label>

              {/* Ancestor toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showAncestors}
                  onChange={(e) => setShowAncestors(e.target.checked)}
                  className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
                />
                <span className="text-sm text-gray-700">पूर्वज देखाउनुहोस्</span>
              </label>

              {/* Zoom controls */}
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
                <button
                  onClick={handleZoomOut}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Zoom Out"
                >
                  <FaMinus className="h-3 w-3 text-gray-600" />
                </button>
                <span className="text-xs text-gray-600 min-w-[40px] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button
                  onClick={handleZoomIn}
                  className="p-1 hover:bg-gray-100 rounded transition-colors"
                  title="Zoom In"
                >
                  <FaPlus className="h-3 w-3 text-gray-600" />
                </button>
                <button
                  onClick={handleResetZoom}
                  className="p-1 hover:bg-gray-100 rounded transition-colors ml-1"
                  title="Reset Zoom"
                >
                  <FaExpand className="h-3 w-3 text-gray-600" />
                </button>
                <button
                  onClick={handleFitToScreen}
                  className="p-1 hover:bg-gray-100 rounded transition-colors ml-1"
                  title="Fit to Screen"
                >
                  <FaCompress className="h-3 w-3 text-gray-600" />
                </button>
              </div>

              {/* Expand/Collapse all */}
              <button
                onClick={toggleAllNodes}
                className="text-sm text-green-600 hover:text-green-700 transition-colors flex items-center gap-1"
              >
                {expandedNodes.size > 0 ? (
                  <>
                    <FaCompress className="text-xs" />
                    सबै संकुचित गर्नुहोस्
                  </>
                ) : (
                  <>
                    <FaExpand className="text-xs" />
                    सबै विस्तार गर्नुहोस्
                  </>
                )}
              </button>

              {/* Node count */}
              {totalNodes > 0 && (
                <span className="text-xs text-gray-400">
                  कुल {totalNodes} सदस्य
                </span>
              )}
            </div>

            {/* Tree View */}
            <div 
              ref={containerRef}
              className="min-h-[400px] max-h-[70vh] overflow-auto bg-white rounded-xl p-4 border border-gray-200 print-tree-container"
            >
              <div 
                ref={treeRef}
                className="min-h-[400px] tree-content"
                style={{
                  transform: `scale(${zoomLevel})`,
                  transformOrigin: 'top center',
                  width: `${100 / zoomLevel}%`,
                }}
              >
                {treeLoading ? (
                  <div className="flex items-center justify-center h-64">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
                  </div>
                ) : treeDataWithSpouses && treeDataWithSpouses.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-8 p-4 min-h-[400px]">
                    {treeDataWithSpouses.map((root) => (
                      <div key={root._id} className="flex flex-col items-center">
                        {/* Ancestors - Head-only nodes above */}
                        {showAncestors && root.ancestors && root.ancestors.length > 0 && (
                          <div className="flex flex-col items-center mb-3 ancestor-chain">
                            {root.ancestors.map((ancestor, index) => (
                              <React.Fragment key={ancestor._id}>
                                {renderAncestorNode(ancestor)}
                                {index < root.ancestors.length - 1 && (
                                  <div className="w-0.5 h-5 bg-amber-300" />
                                )}
                              </React.Fragment>
                            ))}
                            {/* Connection line from ancestors to main tree */}
                            <div className="w-0.5 h-6 bg-amber-300" />
                          </div>
                        )}
                        
                        {/* Main family node with proper genealogy structure */}
                        {renderFamilyNode(root, 0)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaTree className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">कुनै वृक्ष डाटा उपलब्ध छैन</p>
                    <p className="text-sm text-gray-400">वृक्ष निर्माण गर्न सदस्यहरू र सम्बन्धहरू थप्नुहोस्</p>
                  </div>
                )}
              </div>
            </div>

            {/* Tree info */}
            {treeDataWithSpouses && treeDataWithSpouses.length > 0 && (
              <div className="text-center text-sm text-gray-500 no-print">
                <span className="bg-gray-100 px-3 py-1 rounded-full">
                  कुल {totalNodes} सदस्यहरू
                </span>
              </div>
            )}
          </div>
        )}
      </Modal>

      {/* ============ PRINT STYLES ============ */}
      <style jsx global>{`
        /* Hide all UI elements during print */
        @media print {
          /* Hide ALL UI elements */
          .no-print,
          header, nav, .sidebar, .toolbar, 
          button:not(.print-only-button),
          .modal-controls, .export-buttons,
          .family-info-bar, .controls-bar,
          .search-bar, .family-grid,
          .modal-header, .modal-footer,
          [class*="Header"], [class*="Toolbar"],
          [class*="Sidebar"], [class*="Navigation"] {
            display: none !important;
          }
          
          /* Only show tree container */
          .print-tree-container {
            display: block !important;
            position: relative !important;
            width: 100% !important;
            height: auto !important;
            max-height: none !important;
            overflow: visible !important;
            background: white !important;
            padding: 20px !important;
            border: none !important;
            box-shadow: none !important;
          }
          
          /* Ensure tree content is visible */
          .print-tree-container * {
            visibility: visible !important;
          }
          
          /* Tree content scaling */
          .tree-content {
            transform: scale(0.85) !important;
            transform-origin: top left !important;
            width: 117% !important;
          }
          
          /* Card styles for print */
          .tree-content .bg-white {
            background: white !important;
            box-shadow: 0 1px 3px rgba(0,0,0,0.1) !important;
          }
          
          /* Page breaks */
          .tree-page-break {
            page-break-after: always;
          }
          
          /* Ensure connectors print */
          .tree-content .bg-green-400,
          .tree-content .bg-pink-400,
          .tree-content .bg-amber-300 {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }
          
          /* Ensure card colors print */
          .tree-content .bg-green-50,
          .tree-content .bg-pink-50,
          .tree-content .bg-amber-50 {
            print-color-adjust: exact !important;
            -webkit-print-color-adjust: exact !important;
          }
        }

        /* Print-only content styling */
        .print-only-content {
          font-size: 12px;
          line-height: 1.4;
        }
        .print-only-content .bg-white {
          background: white !important;
        }
        .print-only-content .border {
          border-color: #e5e7eb !important;
        }

        /* Print-specific card styling */
        .print-only-content .tree-content {
          transform: none !important;
          width: 100% !important;
        }
      `}</style>
    </div>
  );
};

export default FamilyTreePage;

// src/pages/FamilyTreePage.jsx - COMPLETE UPDATED WITH PROPER GENEALOGY TREE

// import React, { useState, useMemo, useRef, useCallback } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { getFamilies, getFamilyTreeByFamily } from '../api/families';
// import { getMembers } from '../api/members';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { 
//   FaSearch, FaUsers, FaTree, FaHome, FaFileExcel, FaFilePdf, 
//   FaImage, FaPrint, FaUser, FaHeart, FaExpand, FaCompress,
//   FaPlus, FaMinus, FaMale, FaFemale, FaUserCircle, FaCamera
// } from 'react-icons/fa';
// import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// import * as XLSX from 'xlsx';
// import html2canvas from 'html2canvas';
// import jsPDF from 'jspdf';
// import Modal from '../components/Modal';
// import Button from '../components/Button';
// import toast from 'react-hot-toast';

// const FamilyTreePage = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedFamily, setSelectedFamily] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [exporting, setExporting] = useState(false);
//   const [showPhotos, setShowPhotos] = useState(true);
//   const [zoomLevel, setZoomLevel] = useState(1);
//   const [expandedNodes, setExpandedNodes] = useState(new Set());
//   const treeRef = useRef(null);
//   const containerRef = useRef(null);
//   const navigate = useNavigate();

//   // Fetch all families
//   const { data: familiesData, isLoading: familiesLoading } = useQuery({
//     queryKey: ['families'],
//     queryFn: () => getFamilies({ limit: 1000 }),
//   });

//   // Fetch all members for tree generation
//   const { data: membersData, isLoading: membersLoading } = useQuery({
//     queryKey: ['members-tree'],
//     queryFn: () => getMembers({ limit: 10000 }),
//   });

//   // Get family tree data for selected family
//   const { data: treeData, isLoading: treeLoading } = useQuery({
//     queryKey: ['familyTree', selectedFamily?._id],
//     queryFn: () => getFamilyTreeByFamily(selectedFamily._id),
//     enabled: !!selectedFamily,
//   });

//   // Filter families by search
//   const filteredFamilies = useMemo(() => {
//     if (!familiesData?.data) return [];
//     if (!searchTerm) return familiesData.data;
    
//     const search = searchTerm.toLowerCase();
//     return familiesData.data.filter(family => 
//       family.familyName?.toLowerCase().includes(search) ||
//       family.familyNumber?.toLowerCase().includes(search) ||
//       family.vanshaGenerationNumber?.toLowerCase().includes(search) ||
//       family.clan?.toLowerCase().includes(search)
//     );
//   }, [familiesData, searchTerm]);

//   // Get members count per family
//   const getFamilyMemberCount = (familyId) => {
//     if (!membersData?.data) return 0;
//     return membersData.data.filter(m => m.family?._id === familyId || m.family === familyId).length;
//   };

//   const handleFamilyClick = (family) => {
//     setSelectedFamily(family);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedFamily(null);
//   };

//   const handleMemberClick = (member) => {
//     navigate(`/profile/${member._id}`);
//   };

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

//   // Toggle all nodes
//   const toggleAllNodes = () => {
//     if (expandedNodes.size > 0) {
//       setExpandedNodes(new Set());
//     } else {
//       const allIds = new Set();
//       const collectIds = (nodes) => {
//         nodes.forEach(node => {
//           allIds.add(node._id);
//           if (node.children) collectIds(node.children);
//         });
//       };
//       if (treeData?.data) collectIds(treeData.data);
//       setExpandedNodes(allIds);
//     }
//   };

//   // Zoom controls
//   const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2));
//   const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.3));
//   const handleResetZoom = () => setZoomLevel(1);

//   // ============ EXPORT FUNCTIONS ============

//   // Export to Excel with full details
//   const exportToExcel = () => {
//     if (!treeData?.data) {
//       toast.error('कुनै डाटा छैन');
//       return;
//     }

//     setExporting(true);
//     try {
//       const flattenTree = (nodes, level = 0, parent = '') => {
//         let result = [];
//         nodes.forEach(node => {
//           result.push({
//             'पुस्ता': level,
//             'नाम': node.name || '',
//             'सम्बन्ध': node.relationship || 'सदस्य',
//             'वंशज नं.': node.vanshaGenerationNumber || '',
//             'परिवार नं.': node.familyNumber || '',
//             'रोल नं.': node.rollNumber || '',
//             'जन्म मिति': node.dob ? new Date(node.dob).toLocaleDateString('ne-NP') : '',
//             'मृत्यु मिति': node.dod ? new Date(node.dod).toLocaleDateString('ne-NP') : '',
//             'जीवित': node.isAlive ? 'हो' : 'होइन',
//             'लिङ्ग': node.gender === 'male' ? 'पुरुष' : node.gender === 'female' ? 'महिला' : 'अन्य',
//             'फोटो': node.photo ? 'छ' : 'छैन',
//             'परिवार': node.family?.familyName || '',
//             'पूर्वज': parent || '',
//           });
//           if (node.children && node.children.length > 0) {
//             result = result.concat(flattenTree(node.children, level + 1, node.name));
//           }
//         });
//         return result;
//       };

//       const data = flattenTree(treeData.data);
//       const ws = XLSX.utils.json_to_sheet(data);
//       const wb = XLSX.utils.book_new();
//       XLSX.utils.book_append_sheet(wb, ws, 'Family Tree');
      
//       // Auto column widths
//       const colWidths = [
//         { wch: 8 }, { wch: 25 }, { wch: 18 }, { wch: 14 },
//         { wch: 14 }, { wch: 12 }, { wch: 15 }, { wch: 15 },
//         { wch: 10 }, { wch: 10 }, { wch: 10 }, { wch: 20 },
//         { wch: 20 }
//       ];
//       ws['!cols'] = colWidths;

//       XLSX.writeFile(wb, `Family_Tree_${selectedFamily?.familyName || 'All'}_${new Date().toISOString().split('T')[0]}.xlsx`);
//       toast.success('Excel export successful!');
//     } catch (error) {
//       console.error('Export error:', error);
//       toast.error('Failed to export Excel');
//     } finally {
//       setExporting(false);
//     }
//   };

//   // Export to PDF
//   const exportToPDF = async () => {
//     if (!treeRef.current) {
//       toast.error('Tree not ready');
//       return;
//     }

//     setExporting(true);
//     try {
//       const canvas = await html2canvas(treeRef.current, {
//         scale: 2,
//         useCORS: true,
//         allowTaint: true,
//         backgroundColor: '#ffffff',
//         logging: false,
//         width: treeRef.current.scrollWidth,
//         height: treeRef.current.scrollHeight,
//         windowWidth: treeRef.current.scrollWidth,
//         windowHeight: treeRef.current.scrollHeight,
//       });
      
//       const imgData = canvas.toDataURL('image/png');
//       const pdf = new jsPDF({
//         orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
//         unit: 'px',
//         format: [canvas.width, canvas.height],
//       });
      
//       pdf.addImage(imgData, 'PNG', 0, 0, canvas.width, canvas.height);
//       pdf.save(`Family_Tree_${selectedFamily?.familyName || 'All'}_${new Date().toISOString().split('T')[0]}.pdf`);
//       toast.success('PDF export successful!');
//     } catch (error) {
//       console.error('PDF export error:', error);
//       toast.error('Failed to export PDF');
//     } finally {
//       setExporting(false);
//     }
//   };

//   // Export to Image
//   const exportToImage = async () => {
//     if (!treeRef.current) {
//       toast.error('Tree not ready');
//       return;
//     }

//     setExporting(true);
//     try {
//       const canvas = await html2canvas(treeRef.current, {
//         scale: 2,
//         useCORS: true,
//         allowTaint: true,
//         backgroundColor: '#ffffff',
//         logging: false,
//         width: treeRef.current.scrollWidth,
//         height: treeRef.current.scrollHeight,
//         windowWidth: treeRef.current.scrollWidth,
//         windowHeight: treeRef.current.scrollHeight,
//       });
      
//       const link = document.createElement('a');
//       link.download = `Family_Tree_${selectedFamily?.familyName || 'All'}_${new Date().toISOString().split('T')[0]}.png`;
//       link.href = canvas.toDataURL('image/png');
//       link.click();
//       toast.success('Image export successful!');
//     } catch (error) {
//       console.error('Image export error:', error);
//       toast.error('Failed to export Image');
//     } finally {
//       setExporting(false);
//     }
//   };

//   // Print
//   const handlePrint = () => {
//     window.print();
//   };

//   // ============ TREE RENDERER ============

//   // Render spouse pair (husband and wife side by side)
//   const renderSpousePair = (member, memberMap) => {
//     if (!member) return null;

//     const spouseId = member.spouse;
//     const spouse = spouseId ? memberMap[spouseId] : null;
    
//     // Check if this member has a spouse and we should render as pair
//     if (spouse) {
//       // Make sure we only render the pair once (from the husband's perspective)
//       if (member.gender === 'female') return null;
      
//       return (
//         <div className="flex items-center gap-3">
//           {renderMemberCard(member)}
//           <div className="flex flex-col items-center">
//             <div className="w-8 h-0.5 bg-pink-400"></div>
//             <span className="text-[10px] text-pink-500 mt-0.5">विवाह</span>
//           </div>
//           {renderMemberCard(spouse)}
//         </div>
//       );
//     }
    
//     // Single member (no spouse)
//     return renderMemberCard(member);
//   };

//   // Render a single member card
//   const renderMemberCard = (member, isSpouse = false) => {
//     if (!member) return null;

//     const isDeceased = !member.isAlive;
//     const hasChildren = member.children && member.children.length > 0;
//     const isExpanded = expandedNodes.has(member._id);
//     const genderIcon = member.gender === 'male' ? '👨' : member.gender === 'female' ? '👩' : '👤';

//     return (
//       <div className="relative group" key={member._id}>
//         <div 
//           className={`
//             bg-white rounded-xl shadow-md hover:shadow-xl transition-all duration-300 
//             border-2 ${isDeceased ? 'border-gray-300' : isSpouse ? 'border-pink-300' : 'border-green-200'}
//             cursor-pointer w-48
//             hover:border-green-400
//             ${isSpouse ? 'bg-pink-50' : ''}
//           `}
//           onClick={() => handleMemberClick(member)}
//         >
//           <div className="p-3">
//             {/* Photo and Relationship */}
//             <div className="flex items-start gap-2">
//               {/* Photo */}
//               <div className="flex-shrink-0">
//                 <div className={`
//                   w-14 h-14 rounded-full overflow-hidden border-2 
//                   ${isDeceased ? 'border-gray-300' : isSpouse ? 'border-pink-300' : 'border-green-200'}
//                   bg-gray-100
//                 `}>
//                   {showPhotos && member.photo ? (
//                     <img 
//                       src={member.photo} 
//                       alt={member.name}
//                       className="w-full h-full object-cover"
//                       onError={(e) => {
//                         e.target.src = '/default-avatar.png';
//                       }}
//                     />
//                   ) : showPhotos ? (
//                     <div className={`
//                       w-full h-full flex items-center justify-center text-2xl
//                       ${isDeceased ? 'bg-gray-200' : isSpouse ? 'bg-pink-100' : 'bg-gradient-to-br from-green-100 to-emerald-100'}
//                     `}>
//                       {genderIcon}
//                     </div>
//                   ) : null}
//                 </div>
//               </div>

//               {/* Info */}
//               <div className="flex-1 min-w-0">
//                 <div className="flex items-center gap-1">
//                   <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full truncate max-w-[60px]">
//                     {member.relationship || 'सदस्य'}
//                   </span>
//                   {isDeceased && (
//                     <span className="text-[10px] text-red-500">✝</span>
//                   )}
//                 </div>
//                 <p className="font-semibold text-sm text-gray-800 truncate" title={member.name}>
//                   {member.name}
//                 </p>
//                 {member.surname && (
//                   <p className="text-xs text-gray-500 truncate">{member.surname}</p>
//                 )}
//               </div>
//             </div>

//             {/* Details */}
//             <div className="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500 space-y-0.5">
//               {member.vanshaGenerationNumber && (
//                 <p className="truncate">वंशज नं: {member.vanshaGenerationNumber}</p>
//               )}
//               {member.familyNumber && (
//                 <p className="truncate">परिवार नं: {member.familyNumber}</p>
//               )}
//               {member.rollNumber && (
//                 <p className="truncate">रोल नं: {member.rollNumber}</p>
//               )}
//               {member.generation && (
//                 <p className="truncate">पुस्ता: {member.generation}</p>
//               )}
//             </div>

//             {/* DOB/DOD */}
//             <div className="mt-1 text-[10px] text-gray-400">
//               {member.dob && (
//                 <p>जन्म: {new Date(member.dob).toLocaleDateString('ne-NP')}</p>
//               )}
//               {member.dod && (
//                 <p className="text-red-400">मृत्यु: {new Date(member.dod).toLocaleDateString('ne-NP')}</p>
//               )}
//             </div>

//             {/* Expand button for children */}
//             {hasChildren && (
//               <button
//                 onClick={(e) => toggleNode(member._id, e)}
//                 className="absolute -bottom-2.5 right-2 bg-green-500 text-white rounded-full w-5 h-5 flex items-center justify-center shadow-md hover:bg-green-600 transition-colors text-xs"
//               >
//                 {isExpanded ? <FaMinus className="text-[8px]" /> : <FaPlus className="text-[8px]" />}
//               </button>
//             )}
//           </div>
//         </div>
//       </div>
//     );
//   };

//   // Render a family node with spouse and children
//   const renderFamilyNode = (node, level = 0) => {
//     if (!node) return null;

//     const hasChildren = node.children && node.children.length > 0;
//     const isExpanded = expandedNodes.has(node._id);
    
//     // Get spouse
//     const spouse = node.spouse ? node : null;
    
//     // Render the member and spouse pair
//     return (
//       <div key={node._id} className="flex flex-col items-center relative">
//         {/* Member + Spouse pair */}
//         <div className="flex flex-col items-center">
//           <div className="flex items-center gap-2">
//             {renderMemberCard(node, false)}
//             {node.spouse && (
//               <>
//                 <div className="flex flex-col items-center">
//                   <div className="w-6 h-0.5 bg-pink-400"></div>
//                   <span className="text-[8px] text-pink-500">विवाह</span>
//                 </div>
//                 {renderMemberCard(node.spouse, true)}
//               </>
//             )}
//           </div>

//           {/* Children */}
//           {hasChildren && isExpanded && (
//             <div className="relative mt-4">
//               {/* Vertical line from parent to children */}
//               <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-green-300 -mt-1" />
              
//               {/* Horizontal line connecting children */}
//               <div className="relative flex flex-wrap justify-center gap-6 pt-4">
//                 <div className="absolute top-0 left-[10%] right-[10%] h-0.5 bg-green-300" />
                
//                 {node.children.map((child, index) => (
//                   <div key={child._id} className="relative">
//                     {/* Vertical line to each child */}
//                     <div className="absolute -top-4 left-1/2 w-0.5 h-4 bg-green-300" />
//                     {renderFamilyNode(child, level + 1)}
//                   </div>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* Children collapsed indicator */}
//           {hasChildren && !isExpanded && (
//             <button
//               onClick={(e) => toggleNode(node._id, e)}
//               className="mt-1 text-[10px] text-green-500 hover:text-green-600 flex items-center gap-1"
//             >
//               <FaPlus className="text-[8px]" />
//               {node.children.length} सन्तान
//             </button>
//           )}
//         </div>
//       </div>
//     );
//   };

//   // Build complete tree with spouse mapping
//   const buildTreeWithSpouses = useCallback((nodes, memberMap) => {
//     if (!nodes) return [];
    
//     return nodes.map(node => {
//       // Find spouse if exists
//       let spouse = null;
//       if (node.spouse) {
//         const spouseId = typeof node.spouse === 'object' ? node.spouse._id : node.spouse;
//         if (spouseId && memberMap[spouseId]) {
//           spouse = memberMap[spouseId];
//         }
//       }
      
//       // Recursively process children
//       const children = node.children ? buildTreeWithSpouses(node.children, memberMap) : [];
      
//       return {
//         ...node,
//         spouse,
//         children,
//       };
//     });
//   }, []);

//   // Get tree data with spouses
//   const getTreeDataWithSpouses = useCallback(() => {
//     if (!treeData?.data) return null;

//     // Create a map of all members by ID
//     const memberMap = {};
//     const buildMap = (nodes) => {
//       nodes.forEach(node => {
//         memberMap[node._id] = node;
//         if (node.children) buildMap(node.children);
//       });
//     };
//     buildMap(treeData.data);

//     return buildTreeWithSpouses(treeData.data, memberMap);
//   }, [treeData, buildTreeWithSpouses]);

//   // Render Family Card (for selection grid)
//   const FamilyCard = ({ family }) => {
//     const memberCount = getFamilyMemberCount(family._id);
//     const isClosed = family.status === 'closed';

//     return (
//       <motion.div
//         whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }}
//         className={`bg-white rounded-2xl border ${isClosed ? 'border-gray-300' : 'border-green-200'} 
//           overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer`}
//         onClick={() => handleFamilyClick(family)}
//       >
//         <div className="relative">
//           <div className={`h-32 ${isClosed ? 'bg-gray-300' : 'bg-gradient-to-r from-green-400 to-emerald-500'} 
//             flex items-center justify-center`}>
//             <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
//               {family.familyPhoto ? (
//                 <img 
//                   src={family.familyPhoto} 
//                   alt={family.familyName}
//                   className="w-full h-full object-cover rounded-full"
//                 />
//               ) : (
//                 <FaHome className={`text-white text-3xl ${isClosed ? 'opacity-50' : ''}`} />
//               )}
//             </div>
//           </div>
          
//           {family.familyPhoto && (
//             <div className="absolute -bottom-10 left-4 w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg">
//               <img 
//                 src={family.familyPhoto} 
//                 alt={family.familyName}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           )}
//         </div>

//         <div className="pt-8 pb-4 px-4">
//           <div className="flex items-start justify-between">
//             <div>
//               <h3 className="font-bold text-lg text-gray-800 truncate">
//                 {family.familyName || 'Unnamed Family'}
//               </h3>
//               <p className="text-sm text-gray-500">
//                 घर नं. {family.house?.houseNumber || 'N/A'} • परिवार नं. {family.familyNumber}
//               </p>
//               {family.vanshaGenerationNumber && (
//                 <p className="text-xs text-gray-400 mt-0.5">
//                   वंश/पुस्ता: {family.vanshaGenerationNumber}
//                 </p>
//               )}
//             </div>
//             {isClosed && (
//               <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">
//                 बन्द
//               </span>
//             )}
//           </div>
          
//           <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
//             <div className="flex items-center gap-1.5">
//               <FaUsers className={`${isClosed ? 'text-gray-400' : 'text-blue-500'} text-sm`} />
//               <span className={`text-sm font-medium ${isClosed ? 'text-gray-500' : 'text-gray-700'}`}>
//                 {memberCount} सदस्यहरू
//               </span>
//             </div>
//             {family.clan && (
//               <div className="flex items-center gap-1.5">
//                 <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
//                   {family.clan}
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="mt-3">
//             <span className={`text-xs font-medium flex items-center gap-1 ${isClosed ? 'text-gray-400' : 'text-green-600'}`}>
//               <FaTree className="text-xs" />
//               {isClosed ? 'हेर्नुहोस्' : 'वृक्ष हेर्नुहोस्'}
//             </span>
//           </div>
//         </div>
//       </motion.div>
//     );
//   };

//   // Loading state
//   if (familiesLoading || membersLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">परिवारहरू लोड हुँदै...</p>
//         </div>
//       </div>
//     );
//   }

//   // Get tree data with spouses
//   const treeDataWithSpouses = getTreeDataWithSpouses();

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <FaTree className="text-green-500" />
//             पारिवारिक वृक्ष
//           </h1>
//           <p className="text-gray-600">परिवारको वृक्ष हेर्नुहोस् र डाउनलोड गर्नुहोस्</p>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="relative max-w-md">
//         <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//         <input
//           type="text"
//           placeholder="परिवारको नाम, नम्बर, वंश/पुस्ता, वा कुल द्वारा खोज्नुहोस्..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//         />
//       </div>

//       {/* Family Grid */}
//       {filteredFamilies.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
//           <FaHome className="text-4xl text-gray-300 mx-auto mb-3" />
//           <p className="text-gray-500">कुनै परिवार फेला परेन</p>
//           <p className="text-sm text-gray-400">आफ्नो खोज समायोजन गर्नुहोस्</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredFamilies.map((family) => (
//             <FamilyCard key={family._id} family={family} />
//           ))}
//         </div>
//       )}

//       {/* Family Tree Modal */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         title={selectedFamily?.familyName || 'पारिवारिक वृक्ष'}
//         size="xl"
//       >
//         {selectedFamily && (
//           <div className="space-y-4">
//             {/* Family Info Bar */}
//             <div className={`flex flex-wrap items-center gap-4 p-4 rounded-xl border
//               ${selectedFamily.status === 'closed' 
//                 ? 'bg-gray-50 border-gray-200' 
//                 : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'}`}>
//               <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow flex-shrink-0">
//                 {selectedFamily.familyPhoto ? (
//                   <img 
//                     src={selectedFamily.familyPhoto} 
//                     alt={selectedFamily.familyName}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className={`w-full h-full ${selectedFamily.status === 'closed' ? 'bg-gray-200' : 'bg-green-200'} 
//                     flex items-center justify-center`}>
//                     <FaHome className={`${selectedFamily.status === 'closed' ? 'text-gray-500' : 'text-green-600'} text-2xl`} />
//                   </div>
//                 )}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="text-xl font-bold text-gray-800">
//                   {selectedFamily.familyName}
//                 </h3>
//                 <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
//                   <span>घर नं. {selectedFamily.house?.houseNumber || 'N/A'}</span>
//                   <span>•</span>
//                   <span>परिवार नं. {selectedFamily.familyNumber}</span>
//                   {selectedFamily.vanshaGenerationNumber && (
//                     <>
//                       <span>•</span>
//                       <span>वंश/पुस्ता: {selectedFamily.vanshaGenerationNumber}</span>
//                     </>
//                   )}
//                   {selectedFamily.status === 'closed' && (
//                     <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs font-medium ml-2">
//                       🔒 बन्द
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-xs text-gray-500">
//                   {getFamilyMemberCount(selectedFamily._id)} सदस्यहरू
//                 </p>
//               </div>

//               {/* Export Buttons */}
//               <div className="flex flex-wrap gap-2 flex-shrink-0">
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={exportToExcel}
//                   disabled={exporting}
//                   className="flex items-center"
//                   title="Excel मा डाउनलोड गर्नुहोस्"
//                 >
//                   <FaFileExcel className="mr-1.5 text-green-600" />
//                   Excel
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={exportToPDF}
//                   disabled={exporting}
//                   className="flex items-center"
//                   title="PDF मा डाउनलोड गर्नुहोस्"
//                 >
//                   <FaFilePdf className="mr-1.5 text-red-600" />
//                   PDF
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={exportToImage}
//                   disabled={exporting}
//                   className="flex items-center"
//                   title="तस्वीरको रूपमा डाउनलोड गर्नुहोस्"
//                 >
//                   <FaImage className="mr-1.5 text-blue-600" />
//                   Image
//                 </Button>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onClick={handlePrint}
//                   className="flex items-center"
//                   title="प्रिन्ट गर्नुहोस्"
//                 >
//                   <FaPrint className="mr-1.5 text-gray-600" />
//                   Print
//                 </Button>
//               </div>
//             </div>

//             {/* Controls */}
//             <div className="flex flex-wrap items-center gap-4">
//               {/* Photo toggle */}
//               <label className="flex items-center gap-2 cursor-pointer">
//                 <input
//                   type="checkbox"
//                   checked={showPhotos}
//                   onChange={(e) => setShowPhotos(e.target.checked)}
//                   className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//                 />
//                 <span className="text-sm text-gray-700">फोटो सहित</span>
//               </label>

//               {/* Zoom controls */}
//               <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1">
//                 <button
//                   onClick={handleZoomOut}
//                   className="p-1 hover:bg-gray-100 rounded transition-colors"
//                   title="Zoom Out"
//                 >
//                   <FaMinus className="h-3 w-3 text-gray-600" />
//                 </button>
//                 <span className="text-xs text-gray-600 min-w-[40px] text-center">
//                   {Math.round(zoomLevel * 100)}%
//                 </span>
//                 <button
//                   onClick={handleZoomIn}
//                   className="p-1 hover:bg-gray-100 rounded transition-colors"
//                   title="Zoom In"
//                 >
//                   <FaPlus className="h-3 w-3 text-gray-600" />
//                 </button>
//                 <button
//                   onClick={handleResetZoom}
//                   className="p-1 hover:bg-gray-100 rounded transition-colors ml-1"
//                   title="Reset Zoom"
//                 >
//                   <FaExpand className="h-3 w-3 text-gray-600" />
//                 </button>
//               </div>

//               {/* Expand/Collapse all */}
//               <button
//                 onClick={toggleAllNodes}
//                 className="text-sm text-green-600 hover:text-green-700 transition-colors"
//               >
//                 {expandedNodes.size > 0 ? 'सबै संकुचित गर्नुहोस्' : 'सबै विस्तार गर्नुहोस्'}
//               </button>
//             </div>

//             {/* Tree View */}
//             <div 
//               ref={containerRef}
//               className="min-h-[400px] max-h-[70vh] overflow-auto bg-white rounded-xl p-4 border border-gray-200"
//             >
//               <div 
//                 ref={treeRef}
//                 className="min-h-[400px]"
//                 style={{
//                   transform: `scale(${zoomLevel})`,
//                   transformOrigin: 'top left',
//                   width: `${100 / zoomLevel}%`,
//                 }}
//               >
//                 {treeLoading ? (
//                   <div className="flex items-center justify-center h-64">
//                     <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
//                   </div>
//                 ) : treeDataWithSpouses && treeDataWithSpouses.length > 0 ? (
//                   <div className="flex flex-wrap justify-center gap-8 p-4 min-h-[400px]">
//                     {treeDataWithSpouses.map((root) => (
//                       <div key={root._id} className="flex flex-col items-center">
//                         {renderFamilyNode(root, 0)}
//                       </div>
//                     ))}
//                   </div>
//                 ) : (
//                   <div className="text-center py-12">
//                     <FaTree className="text-4xl text-gray-300 mx-auto mb-3" />
//                     <p className="text-gray-500">कुनै वृक्ष डाटा उपलब्ध छैन</p>
//                     <p className="text-sm text-gray-400">वृक्ष निर्माण गर्न सदस्यहरू र सम्बन्धहरू थप्नुहोस्</p>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Tree info */}
//             {treeDataWithSpouses && treeDataWithSpouses.length > 0 && (
//               <div className="text-center text-sm text-gray-500">
//                 <span className="bg-gray-100 px-3 py-1 rounded-full">
//                   कुल {treeData?.count || treeDataWithSpouses.reduce((acc, node) => {
//                     const countNodes = (n) => {
//                       let total = 1;
//                       if (n.children) {
//                         n.children.forEach(c => total += countNodes(c));
//                       }
//                       return total;
//                     };
//                     return acc + countNodes(node);
//                   }, 0)} सदस्यहरू
//                 </span>
//               </div>
//             )}
//           </div>
//         )}
//       </Modal>

//       {/* Print styles */}
//       <style jsx global>{`
//         @media print {
//           .no-print {
//             display: none !important;
//           }
//           .print-area {
//             display: block !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default FamilyTreePage;

// src/pages/FamilyTreePage.jsx - UPDATED
// import { useState, useMemo } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { getFamilies, getFamilyTreeByFamily } from '../api/families';
// import { getMembers } from '../api/members';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaSearch, FaUsers, FaTree, FaHome, FaUser, FaFilter } from 'react-icons/fa';
// import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// import LineageTree from '../components/LineageTree';
// import ExportModal from '../components/ExportModal';
// import Modal from '../components/Modal';
// import Button from '../components/Button';
// import toast from 'react-hot-toast';

// const FamilyTreePage = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedFamily, setSelectedFamily] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [isExportModalOpen, setIsExportModalOpen] = useState(false);
//   const [exporting, setExporting] = useState(false);
//   const navigate = useNavigate();

//   // Fetch all families
//   const { data: familiesData, isLoading: familiesLoading } = useQuery({
//     queryKey: ['families'],
//     queryFn: () => getFamilies({ limit: 1000 }),
//   });

//   // Fetch all members for tree generation
//   const { data: membersData, isLoading: membersLoading } = useQuery({
//     queryKey: ['members-tree'],
//     queryFn: () => getMembers({ limit: 10000 }),
//   });

//   // Get family tree data for selected family
//   const { data: treeData, isLoading: treeLoading } = useQuery({
//     queryKey: ['familyTree', selectedFamily?._id],
//     queryFn: () => getFamilyTreeByFamily(selectedFamily._id),
//     enabled: !!selectedFamily,
//   });

//   // Filter families by search
//   const filteredFamilies = useMemo(() => {
//     if (!familiesData?.data) return [];
//     if (!searchTerm) return familiesData.data;
    
//     const search = searchTerm.toLowerCase();
//     return familiesData.data.filter(family => 
//       family.familyName?.toLowerCase().includes(search) ||
//       family.familyNumber?.toLowerCase().includes(search) ||
//       family.vanshaGenerationNumber?.toLowerCase().includes(search) ||
//       family.clan?.toLowerCase().includes(search)
//     );
//   }, [familiesData, searchTerm]);

//   // Get members count per family
//   const getFamilyMemberCount = (familyId) => {
//     if (!membersData?.data) return 0;
//     return membersData.data.filter(m => m.family?._id === familyId || m.family === familyId).length;
//   };

//   const handleFamilyClick = (family) => {
//     setSelectedFamily(family);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedFamily(null);
//   };

//   const handleMemberClick = (member) => {
//     navigate(`/profile/${member._id}`);
//   };

//   const handleExport = () => {
//     setIsExportModalOpen(true);
//   };

//   const handleExportConfirm = async ({ type, photoMode, format }) => {
//     setExporting(true);
//     try {
//       // For now, we'll handle PDF/Image export by capturing the tree view
//       // In production, this would call the backend API
//       toast.success(`Exporting ${type.toUpperCase()} with ${photoMode ? 'photos' : 'no photos'}`);
//       setIsExportModalOpen(false);
//     } catch (error) {
//       toast.error('Failed to export');
//     } finally {
//       setExporting(false);
//     }
//   };

//   // Render family card
//   const FamilyCard = ({ family }) => {
//     const memberCount = getFamilyMemberCount(family._id);
//     const isClosed = family.status === 'closed';

//     return (
//       <motion.div
//         whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }}
//         className={`bg-white rounded-2xl border ${isClosed ? 'border-gray-300' : 'border-green-200'} 
//           overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer`}
//         onClick={() => handleFamilyClick(family)}
//       >
//         <div className="relative">
//           <div className={`h-32 ${isClosed ? 'bg-gray-300' : 'bg-gradient-to-r from-green-400 to-emerald-500'} 
//             flex items-center justify-center`}>
//             <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
//               {family.familyPhoto ? (
//                 <img 
//                   src={family.familyPhoto} 
//                   alt={family.familyName}
//                   className="w-full h-full object-cover rounded-full"
//                 />
//               ) : (
//                 <FaHome className={`text-white text-3xl ${isClosed ? 'opacity-50' : ''}`} />
//               )}
//             </div>
//           </div>
          
//           {family.familyPhoto && (
//             <div className="absolute -bottom-10 left-4 w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg">
//               <img 
//                 src={family.familyPhoto} 
//                 alt={family.familyName}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           )}
//         </div>

//         <div className="pt-8 pb-4 px-4">
//           <div className="flex items-start justify-between">
//             <div>
//               <h3 className="font-bold text-lg text-gray-800 truncate">
//                 {family.familyName || 'Unnamed Family'}
//               </h3>
//               <p className="text-sm text-gray-500">
//                 House No. {family.house?.houseNumber || 'N/A'} • Family No. {family.familyNumber}
//               </p>
//               {family.vanshaGenerationNumber && (
//                 <p className="text-xs text-gray-400 mt-0.5">
//                   Vansha/Generation: {family.vanshaGenerationNumber}
//                 </p>
//               )}
//             </div>
//             {isClosed && (
//               <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs font-medium">
//                 CLOSED
//               </span>
//             )}
//           </div>
          
//           <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
//             <div className="flex items-center gap-1.5">
//               <FaUsers className={`${isClosed ? 'text-gray-400' : 'text-blue-500'} text-sm`} />
//               <span className={`text-sm font-medium ${isClosed ? 'text-gray-500' : 'text-gray-700'}`}>
//                 {memberCount} Members
//               </span>
//             </div>
//             {family.clan && (
//               <div className="flex items-center gap-1.5">
//                 <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
//                   {family.clan}
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="mt-3">
//             <span className={`text-xs font-medium flex items-center gap-1 ${isClosed ? 'text-gray-400' : 'text-green-600'}`}>
//               <FaTree className="text-xs" />
//               {isClosed ? 'View Only' : 'View Tree'}
//             </span>
//           </div>
//         </div>
//       </motion.div>
//     );
//   };

//   // Loading state
//   if (familiesLoading || membersLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading families...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <FaTree className="text-green-500" />
//             Family Tree
//           </h1>
//           <p className="text-gray-600">Browse and explore family trees</p>
//         </div>
//         <div className="flex gap-2">
//           <Button
//             variant="outline"
//             onClick={handleExport}
//             disabled={!selectedFamily}
//             className="flex items-center"
//           >
//             <FaTree className="mr-2" />
//             Export Tree
//           </Button>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="relative max-w-md">
//         <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//         <input
//           type="text"
//           placeholder="Search by Family Name, Number, Vansha/Generation, or Clan..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//         />
//       </div>

//       {/* Family Grid */}
//       {filteredFamilies.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
//           <FaHome className="text-4xl text-gray-300 mx-auto mb-3" />
//           <p className="text-gray-500">No families found</p>
//           <p className="text-sm text-gray-400">Try adjusting your search</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredFamilies.map((family) => (
//             <FamilyCard key={family._id} family={family} />
//           ))}
//         </div>
//       )}

//       {/* Family Tree Modal */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         title={selectedFamily?.familyName || 'Family Tree'}
//         size="xl"
//       >
//         {selectedFamily && (
//           <div className="space-y-4">
//             {/* Family Info Bar */}
//             <div className={`flex items-center gap-4 p-4 rounded-xl border
//               ${selectedFamily.status === 'closed' 
//                 ? 'bg-gray-50 border-gray-200' 
//                 : 'bg-gradient-to-r from-green-50 to-emerald-50 border-green-200'}`}>
//               <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow flex-shrink-0">
//                 {selectedFamily.familyPhoto ? (
//                   <img 
//                     src={selectedFamily.familyPhoto} 
//                     alt={selectedFamily.familyName}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className={`w-full h-full ${selectedFamily.status === 'closed' ? 'bg-gray-200' : 'bg-green-200'} 
//                     flex items-center justify-center`}>
//                     <FaHome className={`${selectedFamily.status === 'closed' ? 'text-gray-500' : 'text-green-600'} text-2xl`} />
//                   </div>
//                 )}
//               </div>
//               <div className="flex-1 min-w-0">
//                 <h3 className="text-xl font-bold text-gray-800">
//                   {selectedFamily.familyName}
//                 </h3>
//                 <div className="flex flex-wrap items-center gap-2 text-sm text-gray-600">
//                   <span>House No. {selectedFamily.house?.houseNumber || 'N/A'}</span>
//                   <span>•</span>
//                   <span>Family No. {selectedFamily.familyNumber}</span>
//                   {selectedFamily.vanshaGenerationNumber && (
//                     <>
//                       <span>•</span>
//                       <span>Vansha/Generation: {selectedFamily.vanshaGenerationNumber}</span>
//                     </>
//                   )}
//                   {selectedFamily.status === 'closed' && (
//                     <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full text-xs font-medium ml-2">
//                       🔒 CLOSED
//                     </span>
//                   )}
//                 </div>
//                 <p className="text-xs text-gray-500">
//                   {getFamilyMemberCount(selectedFamily._id)} Members
//                 </p>
//               </div>
//               <Button
//                 variant="outline"
//                 size="sm"
//                 onClick={handleExport}
//                 className="flex-shrink-0"
//               >
//                 <FaTree className="mr-1.5" />
//                 Export
//               </Button>
//             </div>

//             {/* Tree View */}
//             <div className="min-h-[400px] max-h-[70vh] overflow-auto">
//               {treeLoading ? (
//                 <div className="flex items-center justify-center h-64">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
//                 </div>
//               ) : treeData?.data ? (
//                 <LineageTree 
//                   treeData={treeData.data}
//                   family={treeData.family}
//                   onMemberClick={handleMemberClick}
//                   photoMode={true}
//                 />
//               ) : (
//                 <div className="text-center py-12">
//                   <FaTree className="text-4xl text-gray-300 mx-auto mb-3" />
//                   <p className="text-gray-500">No tree data available</p>
//                   <p className="text-sm text-gray-400">Add members and relationships to build the tree</p>
//                 </div>
//               )}
//             </div>
//           </div>
//         )}
//       </Modal>

//       {/* Export Modal */}
//       <ExportModal
//         isOpen={isExportModalOpen}
//         onClose={() => setIsExportModalOpen(false)}
//         onExport={handleExportConfirm}
//         familyName={selectedFamily?.familyName}
//         exporting={exporting}
//       />
//     </div>
//   );
// };

// export default FamilyTreePage;

// import { useState, useMemo } from 'react';
// import { useQuery } from '@tanstack/react-query';
// import { getFamilies, getFamilyTreeByFamily } from '../api/families';
// import { getMembers } from '../api/members';
// import { useNavigate } from 'react-router-dom';
// import { motion, AnimatePresence } from 'framer-motion';
// import { FaSearch, FaUsers, FaTree, FaHome, FaUser } from 'react-icons/fa';
// import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
// import FamilyTreeView from '../components/FamilyTreeView';
// import Modal from '../components/Modal';

// const FamilyTreePage = () => {
//   const [searchTerm, setSearchTerm] = useState('');
//   const [selectedFamily, setSelectedFamily] = useState(null);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const navigate = useNavigate();

//   // Fetch all families
//   const { data: familiesData, isLoading: familiesLoading } = useQuery({
//     queryKey: ['families'],
//     queryFn: () => getFamilies({ limit: 1000 }),
//   });

//   // Fetch all members for tree generation
//   const { data: membersData, isLoading: membersLoading } = useQuery({
//     queryKey: ['members-tree'],
//     queryFn: () => getMembers({ limit: 10000 }),
//   });

//   // Get family tree data for selected family
//   const { data: treeData, isLoading: treeLoading } = useQuery({
//     queryKey: ['familyTree', selectedFamily?._id],
//     queryFn: () => getFamilyTreeByFamily(selectedFamily._id),
//     enabled: !!selectedFamily,
//   });

//   // Filter families by search
//   const filteredFamilies = useMemo(() => {
//     if (!familiesData?.data) return [];
//     if (!searchTerm) return familiesData.data;
    
//     const search = searchTerm.toLowerCase();
//     return familiesData.data.filter(family => 
//       family.familyName?.toLowerCase().includes(search) ||
//       family.familyNumber?.toLowerCase().includes(search) ||
//       family.clan?.toLowerCase().includes(search)
//     );
//   }, [familiesData, searchTerm]);

//   // Get members count per family
//   const getFamilyMemberCount = (familyId) => {
//     if (!membersData?.data) return 0;
//     return membersData.data.filter(m => m.family?._id === familyId || m.family === familyId).length;
//   };

//   const handleFamilyClick = (family) => {
//     setSelectedFamily(family);
//     setIsModalOpen(true);
//   };

//   const handleCloseModal = () => {
//     setIsModalOpen(false);
//     setSelectedFamily(null);
//   };

//   const handleMemberClick = (member) => {
//     navigate(`/profile/${member._id}`);
//   };

//   // Render family card
//   const FamilyCard = ({ family }) => {
//     const memberCount = getFamilyMemberCount(family._id);
//     const headOfFamily = family.headOfFamily || {};

//     return (
//       <motion.div
//         whileHover={{ y: -4, boxShadow: '0 12px 24px rgba(0,0,0,0.12)' }}
//         className="bg-white rounded-2xl border border-gray-200 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer"
//         onClick={() => handleFamilyClick(family)}
//       >
//         <div className="relative">
//           <div className="h-32 bg-gradient-to-r from-green-400 to-emerald-500 flex items-center justify-center">
//             <div className="w-20 h-20 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border-2 border-white/30">
//               {family.familyPhoto ? (
//                 <img 
//                   src={family.familyPhoto} 
//                   alt={family.familyName}
//                   className="w-full h-full object-cover rounded-full"
//                 />
//               ) : (
//                 <FaHome className="text-white text-3xl" />
//               )}
//             </div>
//           </div>
          
//           {family.familyPhoto && (
//             <div className="absolute -bottom-10 left-4 w-20 h-20 rounded-full border-4 border-white overflow-hidden shadow-lg">
//               <img 
//                 src={family.familyPhoto} 
//                 alt={family.familyName}
//                 className="w-full h-full object-cover"
//               />
//             </div>
//           )}
//         </div>

//         <div className="pt-8 pb-4 px-4">
//           <h3 className="font-bold text-lg text-gray-800 truncate">
//             {family.familyName || 'Unnamed Family'}
//           </h3>
//           <p className="text-sm text-gray-500">
//             House No. {family.familyNumber || 'N/A'}
//           </p>
          
//           <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100">
//             <div className="flex items-center gap-1.5">
//               <FaUsers className="text-green-500 text-sm" />
//               <span className="text-sm font-medium text-gray-700">{memberCount} Members</span>
//             </div>
//             {family.clan && (
//               <div className="flex items-center gap-1.5">
//                 <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
//                   {family.clan}
//                 </span>
//               </div>
//             )}
//           </div>

//           <div className="mt-3">
//             <span className="text-xs text-green-600 font-medium flex items-center gap-1">
//               <FaTree className="text-xs" />
//               Open Tree
//             </span>
//           </div>
//         </div>
//       </motion.div>
//     );
//   };

//   // Loading state
//   if (familiesLoading || membersLoading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading families...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="space-y-6">
//       <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
//             <FaTree className="text-green-500" />
//             Family Tree
//           </h1>
//           <p className="text-gray-600">Browse and explore family trees</p>
//         </div>
//       </div>

//       {/* Search Bar */}
//       <div className="relative max-w-md">
//         <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
//         <input
//           type="text"
//           placeholder="Search Family by Name, Number, or Clan..."
//           value={searchTerm}
//           onChange={(e) => setSearchTerm(e.target.value)}
//           className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
//         />
//       </div>

//       {/* Family Grid */}
//       {filteredFamilies.length === 0 ? (
//         <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
//           <FaHome className="text-4xl text-gray-300 mx-auto mb-3" />
//           <p className="text-gray-500">No families found</p>
//           <p className="text-sm text-gray-400">Try adjusting your search</p>
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
//           {filteredFamilies.map((family) => (
//             <FamilyCard key={family._id} family={family} />
//           ))}
//         </div>
//       )}

//       {/* Family Tree Modal */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={handleCloseModal}
//         title={selectedFamily?.familyName || 'Family Tree'}
//         size="xl"
//       >
//         {selectedFamily && (
//           <div className="space-y-4">
//             <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200">
//               <div className="w-14 h-14 rounded-full overflow-hidden border-2 border-white shadow">
//                 {selectedFamily.familyPhoto ? (
//                   <img 
//                     src={selectedFamily.familyPhoto} 
//                     alt={selectedFamily.familyName}
//                     className="w-full h-full object-cover"
//                   />
//                 ) : (
//                   <div className="w-full h-full bg-green-200 flex items-center justify-center">
//                     <FaHome className="text-green-600 text-2xl" />
//                   </div>
//                 )}
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-gray-800">
//                   {selectedFamily.familyName}
//                 </h3>
//                 <p className="text-sm text-gray-600">
//                   House No. {selectedFamily.familyNumber} • {getFamilyMemberCount(selectedFamily._id)} Members
//                 </p>
//               </div>
//             </div>

//             <div className="min-h-[400px] max-h-[70vh] overflow-auto">
//               {treeLoading ? (
//                 <div className="flex items-center justify-center h-64">
//                   <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
//                 </div>
//               ) : (
//                 <FamilyTreeView 
//                   members={treeData?.data || []} 
//                   layout="horizontal"
//                   onMemberClick={handleMemberClick}
//                   familyId={selectedFamily._id}
//                 />
//               )}
//             </div>
//           </div>
//         )}
//       </Modal>
//     </div>
//   );
// };

// export default FamilyTreePage;