// src/pages/FamilyTreePage.jsx - COMPLETE UPDATED VERSION
// Key changes:
// - Spouse deduplication (couple shown only once)
// - Children branch originates from husband/lineage side
// - Print only the tree (no UI elements)
// - Real database-driven tree (no hardcoded data)
// - Proper visited set to prevent infinite loops

import React, { useState, useMemo, useRef, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { getFamilies, getFamilyTreeByFamily } from '../api/families';
import { getMembers } from '../api/members';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  FaSearch, FaTree, FaHome, FaFileExcel, FaFilePdf,
  FaImage, FaPrint, FaUser, FaExpand, FaCompress,
  FaPlus, FaMinus, FaEye
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

  const treeRef = useRef(null);
  const containerRef = useRef(null);
  const printRef = useRef(null);
  const navigate = useNavigate();

  // ============================================================
  // FETCH DATA
  // ============================================================
  const { data: familiesData, isLoading: familiesLoading } = useQuery({
    queryKey: ['families'],
    queryFn: () => getFamilies({ limit: 1000 }),
  });

  const { data: membersData, isLoading: membersLoading } = useQuery({
    queryKey: ['members-tree'],
    queryFn: () => getMembers({ limit: 10000 }),
  });

  const { data: treeData, isLoading: treeLoading } = useQuery({
    queryKey: ['familyTree', selectedFamily?._id],
    queryFn: () => getFamilyTreeByFamily(selectedFamily._id),
    enabled: !!selectedFamily,
  });

  // ============================================================
  // FILTER FAMILIES
  // ============================================================
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

  const getFamilyMemberCount = (familyId) => {
    if (!membersData?.data) return 0;
    return membersData.data.filter(m => m.family?._id === familyId || m.family === familyId).length;
  };

  // ============================================================
  // HANDLERS
  // ============================================================
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

  const toggleNode = (nodeId, e) => {
    if (e) e.stopPropagation();
    setExpandedNodes(prev => {
      const newSet = new Set(prev);
      if (newSet.has(nodeId)) newSet.delete(nodeId);
      else newSet.add(nodeId);
      return newSet;
    });
  };

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

  const handleZoomIn = () => setZoomLevel(prev => Math.min(prev + 0.1, 2.5));
  const handleZoomOut = () => setZoomLevel(prev => Math.max(prev - 0.1, 0.3));
  const handleResetZoom = () => setZoomLevel(1);

  // ============================================================
  // EXPORT FUNCTIONS
  // ============================================================
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
            'जन्म मिति': node.dob ? new Date(node.dob).toLocaleDateString('ne-NP') : '',
            'जीवित': node.isAlive ? 'हो' : 'होइन',
            'लिङ्ग': node.gender === 'male' ? 'पुरुष' : node.gender === 'female' ? 'महिला' : 'अन्य',
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
        scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false,
      });
      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF({
        orientation: canvas.width > canvas.height ? 'landscape' : 'portrait',
        unit: 'px', format: [canvas.width, canvas.height],
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
        scale: 2, useCORS: true, backgroundColor: '#ffffff', logging: false,
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

  // ============================================================
  // PRINT - ONLY THE TREE
  // ============================================================
  const handlePrint = useCallback(() => {
    if (!treeRef.current) {
      toast.error('Tree not ready');
      return;
    }

    const printWindow = window.open('', '_blank');
    if (!printWindow) {
      toast.error('Please allow popups to print');
      return;
    }

    const treeHTML = treeRef.current.outerHTML;
    const familyName = selectedFamily?.familyName || 'Family Tree';

    printWindow.document.write(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>${familyName} - Family Tree</title>
          <style>
            @page { size: A3 landscape; margin: 10mm; }
            * { box-sizing: border-box; -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            body { font-family: system-ui, -apple-system, sans-serif; margin: 0; padding: 20px; background: white; }
            .tree-print-title { text-align: center; font-size: 20px; font-weight: bold; margin-bottom: 20px; color: #333; }
            img { max-width: 100%; }
            .transform { transform: none !important; }
          </style>
        </head>
        <body>
          <div class="tree-print-title">${familyName}</div>
          <div style="transform: scale(0.75); transform-origin: top center;">
            ${treeHTML}
          </div>
        </body>
      </html>
    `);

    printWindow.document.close();
    printWindow.focus();

    setTimeout(() => {
      printWindow.print();
      setTimeout(() => printWindow.close(), 1000);
    }, 500);
  }, [selectedFamily]);

  // ============================================================
  // RENDER MEMBER CARD (compact genealogy node)
  // ============================================================
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
            cursor-pointer w-48 hover:border-green-400
            ${isSpouse ? 'bg-pink-50/80' : ''}
          `}
          onClick={() => handleMemberClick(member)}
        >
          <div className="p-2.5">
            {/* Photo & Info */}
            <div className="flex items-start gap-2">
              <div className="flex-shrink-0">
                <div className={`
                  w-12 h-12 rounded-full overflow-hidden border-2
                  ${isDeceased ? 'border-gray-300' : isSpouse ? 'border-pink-300' : 'border-green-200'}
                  bg-gray-100
                `}>
                  {showPhotos && member.photo ? (
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      onError={(e) => { e.target.src = '/default-avatar.png'; }}
                    />
                  ) : (
                    <div className={`
                      w-full h-full flex items-center justify-center text-xl
                      ${isDeceased ? 'bg-gray-200' : isSpouse ? 'bg-pink-100' : 'bg-gradient-to-br from-green-100 to-emerald-100'}
                    `}>
                      {genderIcon}
                    </div>
                  )}
                </div>
              </div>

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
                  {isDeceased && <span className="text-[9px] text-red-500">✝</span>}
                </div>
                <p className="font-semibold text-xs text-gray-800 truncate mt-0.5">
                  {member.name}
                </p>
                {member.vanshaGenerationNumber && (
                  <p className="text-[9px] text-gray-500">वंशज: {member.vanshaGenerationNumber}</p>
                )}
              </div>
            </div>

            {/* Generation */}
            {member.generation && (
              <div className="mt-1.5 pt-1.5 border-t border-gray-100 text-[9px] text-gray-500">
                पुस्ता: {member.generation}
              </div>
            )}
          </div>
        </div>

        {/* Expand button */}
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

  // ============================================================
  // RENDER FAMILY NODE - WITH SPOUSE DEDUPLICATION & CHILDREN FROM HUSBAND
  // ============================================================
  const renderFamilyNode = (node, visited = new Set(), level = 0) => {
    if (!node || !node._id) return null;

    // ⭐ Prevent infinite loops
    if (visited.has(node._id)) return null;
    visited.add(node._id);

    const hasChildren = node.children && node.children.length > 0;
    const isExpanded = expandedNodes.has(node._id);

    // ⭐ Get spouse (from node.spouse or node.spouses array)
    let spouse = null;
    if (node.spouse) {
      spouse = typeof node.spouse === 'object' ? node.spouse : null;
    } else if (node.spouses && node.spouses.length > 0) {
      const firstSpouse = node.spouses[0];
      spouse = typeof firstSpouse === 'object' ? firstSpouse : null;
    }

    // ⭐ Deduplicate: only render spouse if not already visited
    if (spouse && visited.has(spouse._id)) {
      spouse = null;
    }
    if (spouse) visited.add(spouse._id);

    // Filter children to avoid duplicates
    const childIds = (node.children || [])
      .map(c => typeof c === 'object' ? c : { _id: c })
      .filter(c => c && c._id && !visited.has(c._id));

    return (
      <div key={node._id} className="flex flex-col items-center relative">
        {/* Husband + Wife side by side */}
        <div className="flex items-center gap-2 relative">
          {renderMemberCard(node, false)}

          {spouse && (
            <>
              <div className="flex flex-col items-center px-1">
                <div className="w-10 h-0.5 bg-pink-400"></div>
                <span className="text-[8px] text-pink-500 mt-0.5 whitespace-nowrap">विवाह</span>
              </div>
              {renderMemberCard(spouse, true)}
            </>
          )}
        </div>

        {/* Children - branch from HUSBAND side */}
        {hasChildren && isExpanded && childIds.length > 0 && (
          <div className="relative mt-2">
            {/* Vertical line from husband card */}
            <div className="absolute top-0 left-[96px] w-0.5 h-6 bg-green-400" />

            {/* Children container */}
            <div className="relative pt-6">
              {/* Horizontal bridge */}
              {childIds.length > 1 && (
                <div
                  className="absolute top-6 h-0.5 bg-green-400"
                  style={{
                    left: '15%',
                    right: childIds.length % 2 === 0 ? '15%' : '15%',
                  }}
                />
              )}

              <div className={`flex justify-center items-start ${
                childIds.length <= 3 ? 'gap-6' :
                childIds.length <= 5 ? 'gap-4' : 'gap-3'
              }`}>
                {childIds.map((child) => {
                  const childNode = typeof child === 'object' && child.children !== undefined
                    ? child
                    : (treeData?.data && findNodeInTree(treeData.data, child._id));

                  if (!childNode || visited.has(childNode._id)) return null;

                  return (
                    <div key={childNode._id} className="relative flex flex-col items-center">
                      <div className="absolute -top-6 left-1/2 w-0.5 h-6 bg-green-400 -translate-x-1/2" />
                      {renderFamilyNode(childNode, visited, level + 1)}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* Collapsed indicator */}
        {hasChildren && !isExpanded && (
          <button
            onClick={(e) => toggleNode(node._id, e)}
            className="mt-2 text-xs text-green-500 hover:text-green-600 flex items-center gap-1 bg-green-50 px-3 py-1 rounded-full"
          >
            <FaPlus className="text-[8px]" />
            {childIds.length} सन्तान
          </button>
        )}
      </div>
    );
  };

  // Helper to find node in tree
  const findNodeInTree = (nodes, nodeId) => {
    for (const node of nodes) {
      if (node._id === nodeId) return node;
      if (node.children) {
        const found = findNodeInTree(node.children, nodeId);
        if (found) return found;
      }
    }
    return null;
  };

  // ============================================================
  // FAMILY CARD
  // ============================================================
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
                <img src={family.familyPhoto} alt={family.familyName} className="w-full h-full object-cover rounded-full" />
              ) : (
                <FaHome className={`text-white text-3xl ${isClosed ? 'opacity-50' : ''}`} />
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 pb-4 px-4">
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
                  वंशज नं.: {family.vanshaGenerationNumber}
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
              <FaUser className={`${isClosed ? 'text-gray-400' : 'text-blue-500'} text-sm`} />
              <span className="text-sm font-medium text-gray-700">{memberCount} सदस्य</span>
            </div>
            {family.totalGenerations > 0 && (
              <div className="flex items-center gap-1.5">
                <FaTree className={`${isClosed ? 'text-gray-400' : 'text-green-500'} text-sm`} />
                <span className="text-sm font-medium text-gray-700">{family.totalGenerations} पुस्ता</span>
              </div>
            )}
          </div>

          <div className="mt-3">
            <span className={`text-xs font-medium flex items-center gap-1 ${isClosed ? 'text-gray-400' : 'text-green-600'}`}>
              <FaTree className="text-xs" />
              वृक्ष हेर्नुहोस्
            </span>
          </div>
        </div>
      </motion.div>
    );
  };

  // ============================================================
  // LOADING
  // ============================================================
  if (familiesLoading || membersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // ============================================================
  // MAIN RENDER
  // ============================================================
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
          <FaTree className="text-green-500" />
          पारिवारिक वृक्ष
        </h1>
        <p className="text-gray-600">परिवारको वृक्ष हेर्नुहोस् र डाउनलोड गर्नुहोस्</p>
      </div>

      {/* Search */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="परिवार खोज्नुहोस्..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500"
        />
      </div>

      {/* Family Grid */}
      {filteredFamilies.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FaHome className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">कुनै परिवार फेला परेन</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredFamilies.map((family) => (
            <FamilyCard key={family._id} family={family} />
          ))}
        </div>
      )}

      {/* Tree Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        title={selectedFamily?.familyName || 'पारिवारिक वृक्ष'}
        size="xl"
      >
        {selectedFamily && (
          <div className="space-y-4">
            {/* Controls - hidden during print */}
            <div className="no-print flex flex-wrap items-center gap-3 p-3 bg-gray-50 rounded-xl">
              {/* Export Buttons */}
              <div className="flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={exportToExcel} disabled={exporting}>
                  <FaFileExcel className="mr-1.5 text-green-600" />
                  Excel
                </Button>
                <Button variant="outline" size="sm" onClick={exportToPDF} disabled={exporting}>
                  <FaFilePdf className="mr-1.5 text-red-600" />
                  PDF
                </Button>
                <Button variant="outline" size="sm" onClick={exportToImage} disabled={exporting}>
                  <FaImage className="mr-1.5 text-blue-600" />
                  Image
                </Button>
                <Button variant="primary" size="sm" onClick={handlePrint}>
                  <FaPrint className="mr-1.5" />
                  Print
                </Button>
              </div>

              {/* Separator */}
              <div className="h-6 w-px bg-gray-300" />

              {/* Photo toggle */}
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={showPhotos}
                  onChange={(e) => setShowPhotos(e.target.checked)}
                  className="h-4 w-4 text-green-600 rounded"
                />
                <span className="text-xs text-gray-700">फोटो</span>
              </label>

              {/* Zoom controls */}
              <div className="flex items-center gap-1 border border-gray-200 rounded-lg p-1 bg-white">
                <button onClick={handleZoomOut} className="p-1 hover:bg-gray-100 rounded">
                  <FaMinus className="h-3 w-3 text-gray-600" />
                </button>
                <span className="text-xs text-gray-600 min-w-[40px] text-center">
                  {Math.round(zoomLevel * 100)}%
                </span>
                <button onClick={handleZoomIn} className="p-1 hover:bg-gray-100 rounded">
                  <FaPlus className="h-3 w-3 text-gray-600" />
                </button>
                <button onClick={handleResetZoom} className="p-1 hover:bg-gray-100 rounded ml-1">
                  <FaExpand className="h-3 w-3 text-gray-600" />
                </button>
              </div>

              {/* Expand/Collapse */}
              <button
                onClick={toggleAllNodes}
                className="text-xs text-green-600 hover:text-green-700 flex items-center gap-1"
              >
                {expandedNodes.size > 0 ? (
                  <><FaCompress className="text-xs" /> सबै संकुचित</>
                ) : (
                  <><FaExpand className="text-xs" /> सबै विस्तार</>
                )}
              </button>
            </div>

            {/* Tree View */}
            <div
              ref={containerRef}
              className="min-h-[400px] max-h-[70vh] overflow-auto bg-white rounded-xl p-4 border border-gray-200"
            >
              <div
                ref={treeRef}
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
                ) : treeData?.data && treeData.data.length > 0 ? (
                  <div className="flex flex-wrap justify-center gap-8 p-4 min-h-[400px]">
                    {treeData.data.map((root) => (
                      <div key={root._id} className="flex flex-col items-center">
                        {renderFamilyNode(root, new Set(), 0)}
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <FaTree className="text-4xl text-gray-300 mx-auto mb-3" />
                    <p className="text-gray-500">कुनै वृक्ष डाटा उपलब्ध छैन</p>
                    <p className="text-sm text-gray-400">वृक्ष निर्माण गर्न सदस्यहरू थप्नुहोस्</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </Modal>

      {/* Print Styles - hide all UI when printing */}
      <style jsx global>{`
        @media print {
          .no-print,
          header, nav, .sidebar, .toolbar,
          button, .modal-controls, .export-buttons,
          .family-info-bar, .controls-bar {
            display: none !important;
          }
          body * {
            visibility: hidden;
          }
          .tree-print-title,
          .tree-print-title *,
          .tree-content,
          .tree-content * {
            visibility: visible;
          }
        }
      `}</style>
    </div>
  );
};

export default FamilyTreePage;