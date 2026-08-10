// src/components/LineageTree.jsx
import React, { useState, useMemo, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaUser, FaHeart, FaTree, FaPlus, FaMinus, FaExpand, FaCompress } from 'react-icons/fa';
import { ZoomIn, ZoomOut, Move, Maximize2 } from 'lucide-react';

const LineageTree = ({ 
  treeData, 
  family,
  onMemberClick,
  layout = 'horizontal',
  photoMode = true,
  className = '',
}) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [expandedNodes, setExpandedNodes] = useState(new Set());
  const [selectedNode, setSelectedNode] = useState(null);
  const [panOffset, setPanOffset] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const [dragStart, setDragStart] = useState({ x: 0, y: 0 });

  // Initialize all nodes as expanded
  const initializeExpanded = useCallback(() => {
    const allIds = new Set();
    const collectIds = (nodes) => {
      nodes.forEach(node => {
        allIds.add(node._id);
        if (node.children) collectIds(node.children);
        if (node.spouses) collectIds(node.spouses);
      });
    };
    if (treeData) collectIds(treeData);
    setExpandedNodes(allIds);
  }, [treeData]);

  // Reset on tree change
  useMemo(() => {
    if (treeData && treeData.length > 0) {
      initializeExpanded();
    }
  }, [treeData, initializeExpanded]);

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

  const toggleAll = () => {
    if (expandedNodes.size === 0) {
      initializeExpanded();
    } else {
      setExpandedNodes(new Set());
    }
  };

  const handleZoomIn = () => {
    setZoomLevel(prev => Math.min(prev + 0.1, 2));
  };

  const handleZoomOut = () => {
    setZoomLevel(prev => Math.max(prev - 0.1, 0.5));
  };

  const handleResetZoom = () => {
    setZoomLevel(1);
    setPanOffset({ x: 0, y: 0 });
  };

  const handleMouseDown = (e) => {
    setIsDragging(true);
    setDragStart({ x: e.clientX - panOffset.x, y: e.clientY - panOffset.y });
  };

  const handleMouseMove = (e) => {
    if (isDragging) {
      setPanOffset({
        x: e.clientX - dragStart.x,
        y: e.clientY - dragStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  // Render a single node
  const renderNode = (node, level = 0, isSpouse = false) => {
    if (!node) return null;

    const isExpanded = expandedNodes.has(node._id);
    const hasChildren = node.children && node.children.length > 0;
    const hasSpouses = node.spouses && node.spouses.length > 0;
    const isSelected = selectedNode === node._id;
    const isDeceased = !node.isAlive;

    return (
      <div key={node._id} className="flex flex-col items-center relative">
        {/* Node Card */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: level * 0.05 }}
          className="relative"
        >
          <div
            className={`
              bg-white rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 
              border-2 ${isDeceased ? 'border-gray-300 opacity-75' : isSpouse ? 'border-pink-300' : 'border-green-200'}
              cursor-pointer min-w-[120px] max-w-[180px]
              ${isSelected ? 'ring-2 ring-green-500 ring-offset-2' : ''}
            `}
            onClick={() => {
              setSelectedNode(node._id);
              if (onMemberClick) onMemberClick(node);
            }}
            style={{
              transform: `scale(${zoomLevel})`,
              transition: 'transform 0.3s ease',
            }}
          >
            <div className="p-3">
              {/* Photo */}
              <div className="relative">
                <div className={`
                  w-16 h-16 mx-auto rounded-full overflow-hidden border-2 
                  ${isDeceased ? 'border-gray-300 grayscale' : isSpouse ? 'border-pink-300' : 'border-green-200'}
                  mb-2 bg-gray-100
                `}>
                  {photoMode && node.photo ? (
                    <img 
                      src={node.photo} 
                      alt={node.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        e.target.src = '/default-avatar.png';
                      }}
                    />
                  ) : (
                    <div className={`
                      w-full h-full flex items-center justify-center
                      ${isDeceased ? 'bg-gray-200' : isSpouse ? 'bg-pink-100' : 'bg-gradient-to-br from-green-100 to-emerald-100'}
                    `}>
                      <FaUser className={`
                        text-2xl
                        ${isDeceased ? 'text-gray-500' : isSpouse ? 'text-pink-500' : 'text-green-600'}
                      `} />
                    </div>
                  )}
                </div>
                
                {/* Deceased badge */}
                {isDeceased && (
                  <div className="absolute -top-1 -right-1 bg-gray-600 text-white rounded-full px-1.5 py-0.5 text-[8px] font-bold">
                    ✝
                  </div>
                )}
              </div>

              {/* Name */}
              <div className="text-center">
                <p className="font-semibold text-sm text-gray-800 truncate" title={node.name}>
                  {node.name}
                </p>
                {node.rollNumber && (
                  <p className="text-xs text-green-600 font-mono">
                    Roll {node.rollNumber}
                  </p>
                )}
                {node.vanshaGenerationNumber && (
                  <p className="text-[10px] text-gray-400">
                    Vansha {node.vanshaGenerationNumber}
                  </p>
                )}
                {node.generation && (
                  <span className="text-[10px] text-gray-400 bg-gray-100 px-1.5 py-0.5 rounded-full">
                    Gen {node.generation}
                  </span>
                )}
              </div>

              {/* Relationship badge */}
              {node.relationship && node.relationship !== 'member' && (
                <div className="flex items-center justify-center mt-1">
                  <span className="text-[10px] bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded-full">
                    {node.relationship}
                  </span>
                </div>
              )}

              {/* Spouse indicator */}
              {hasSpouses && (
                <div className="flex items-center justify-center mt-1 gap-1">
                  <FaHeart className="text-red-400 text-[10px]" />
                  <span className="text-[10px] text-gray-400">Spouse</span>
                </div>
              )}

              {/* Lineage source indicator */}
              {node.isLineageSource !== false && hasChildren && (
                <div className="flex items-center justify-center mt-1">
                  <span className="text-[10px] bg-green-50 text-green-600 px-1.5 py-0.5 rounded-full">
                    Lineage
                  </span>
                </div>
              )}
            </div>

            {/* Expand/Collapse button */}
            {hasChildren && node.isLineageSource !== false && (
              <button
                onClick={(e) => toggleNode(node._id, e)}
                className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 
                  bg-green-500 text-white rounded-full w-6 h-6 flex items-center justify-center 
                  shadow-md hover:bg-green-600 transition-colors text-sm z-10"
              >
                {isExpanded ? <FaMinus className="text-xs" /> : <FaPlus className="text-xs" />}
              </button>
            )}
          </div>
        </motion.div>

        {/* Spouses */}
        {hasSpouses && isExpanded && (
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            {node.spouses.map(spouse => (
              <div key={spouse._id} className="relative">
                {/* Connection line to spouse */}
                <div className="absolute -top-4 left-1/2 w-0.5 h-4 bg-pink-300" />
                {renderNode(spouse, level + 1, true)}
              </div>
            ))}
          </div>
        )}

        {/* Children - Only from lineage source */}
        {hasChildren && isExpanded && node.isLineageSource !== false && (
          <div className="relative mt-6">
            {/* Vertical line from parent to children */}
            <div className="absolute top-0 left-1/2 w-0.5 h-4 bg-green-300 -mt-1" />
            
            {/* Horizontal line connecting children */}
            <div className="relative flex flex-wrap justify-center gap-6 pt-4">
              <div className="absolute top-0 left-[10%] right-[10%] h-0.5 bg-green-300" />
              
              {node.children.map((child, index) => (
                <div key={child._id} className="relative">
                  {/* Vertical line to each child */}
                  <div className="absolute -top-4 left-1/2 w-0.5 h-4 bg-green-300" />
                  {renderNode(child, level + 1, false)}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  if (!treeData || treeData.length === 0) {
    return (
      <div className="text-center py-12">
        <FaTree className="text-4xl text-gray-300 mx-auto mb-3" />
        <p className="text-gray-500">No family tree structure found</p>
        <p className="text-sm text-gray-400">Add relationships to build the tree</p>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      {/* Tree Controls */}
      <div className="absolute top-4 right-4 z-10 flex flex-col gap-2 bg-white rounded-xl shadow-lg p-2 border border-gray-200">
        <button
          onClick={handleZoomIn}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title="Zoom In"
        >
          <ZoomIn className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={handleZoomOut}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title="Zoom Out"
        >
          <ZoomOut className="h-4 w-4 text-gray-600" />
        </button>
        <button
          onClick={handleResetZoom}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title="Reset Zoom"
        >
          <Maximize2 className="h-4 w-4 text-gray-600" />
        </button>
        <div className="w-full h-px bg-gray-200" />
        <button
          onClick={toggleAll}
          className="p-1.5 hover:bg-gray-100 rounded-lg transition-colors"
          title={expandedNodes.size > 0 ? "Collapse All" : "Expand All"}
        >
          {expandedNodes.size > 0 ? (
            <FaCompress className="h-4 w-4 text-gray-600" />
          ) : (
            <FaExpand className="h-4 w-4 text-gray-600" />
          )}
        </button>
      </div>

      {/* Tree Container */}
      <div 
        className="overflow-auto min-h-[500px] w-full cursor-grab active:cursor-grabbing"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
        style={{
          cursor: isDragging ? 'grabbing' : 'grab',
        }}
      >
        <div 
          className="flex flex-wrap justify-center gap-8 p-8 min-h-[500px]"
          style={{
            transform: `translate(${panOffset.x}px, ${panOffset.y}px)`,
            transition: isDragging ? 'none' : 'transform 0.3s ease',
          }}
        >
          {treeData.map((root, index) => (
            <div key={root._id || index} className="flex flex-col items-center">
              {renderNode(root, 0, false)}
            </div>
          ))}
        </div>
      </div>

      {/* Family Info Footer */}
      {family && (
        <div className="mt-4 p-3 bg-gray-50 rounded-xl border border-gray-200 text-center">
          <p className="text-sm text-gray-600">
            <span className="font-medium">{family.name}</span>
            {family.number && ` • Family No. ${family.number}`}
            {family.vanshaGenerationNumber && ` • Vansha/Generation: ${family.vanshaGenerationNumber}`}
            {family.house && typeof family.house === 'object' && 
              ` • House No. ${family.house.houseNumber}`
            }
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {zoomLevel !== 1 && `Zoom: ${Math.round(zoomLevel * 100)}% • `}
            Drag to pan • Click member for details
          </p>
        </div>
      )}
    </div>
  );
};

export default LineageTree;