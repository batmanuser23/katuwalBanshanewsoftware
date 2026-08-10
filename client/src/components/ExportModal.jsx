// src/components/ExportModal.jsx
import React, { useState } from 'react';
import { FaFilePdf, FaImage, FaPrint, FaFileExcel, FaTimes, FaCheck } from 'react-icons/fa';
import Button from './Button';
import Modal from './Modal';

const ExportModal = ({ 
  isOpen, 
  onClose, 
  onExport, 
  familyName,
  exporting = false,
}) => {
  const [exportType, setExportType] = useState('pdf');
  const [photoMode, setPhotoMode] = useState(true);
  const [format, setFormat] = useState('landscape');

  const exportOptions = [
    { id: 'pdf', label: 'PDF', icon: FaFilePdf, description: 'Export as PDF document' },
    { id: 'image', label: 'Image', icon: FaImage, description: 'Export as PNG image' },
    { id: 'print', label: 'Print', icon: FaPrint, description: 'Print directly' },
  ];

  const handleExport = () => {
    onExport({
      type: exportType,
      photoMode,
      format,
    });
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Export Family Tree" size="md">
      <div className="space-y-6">
        {/* Family Name */}
        {familyName && (
          <p className="text-sm text-gray-600">
            Exporting: <span className="font-semibold text-gray-800">{familyName}</span>
          </p>
        )}

        {/* Export Type */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Export Format
          </label>
          <div className="grid grid-cols-3 gap-2">
            {exportOptions.map((option) => {
              const Icon = option.icon;
              const isSelected = exportType === option.id;
              return (
                <button
                  key={option.id}
                  onClick={() => setExportType(option.id)}
                  className={`
                    p-3 rounded-xl border-2 text-center transition-all duration-200
                    ${isSelected 
                      ? 'border-green-500 bg-green-50 shadow-sm' 
                      : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'}
                  `}
                >
                  <Icon className={`h-6 w-6 mx-auto ${isSelected ? 'text-green-600' : 'text-gray-400'}`} />
                  <span className={`text-xs font-medium block mt-1 ${isSelected ? 'text-green-700' : 'text-gray-600'}`}>
                    {option.label}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Photo Mode */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Photo Mode
          </label>
          <div className="flex gap-3">
            <button
              onClick={() => setPhotoMode(true)}
              className={`
                flex-1 p-3 rounded-xl border-2 text-center transition-all duration-200
                ${photoMode 
                  ? 'border-green-500 bg-green-50 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300'}
              `}
            >
              <div className="flex items-center justify-center gap-2">
                <FaCheck className={`h-4 w-4 ${photoMode ? 'text-green-600' : 'text-gray-300'}`} />
                <span className={`text-sm font-medium ${photoMode ? 'text-green-700' : 'text-gray-600'}`}>
                  With Photos
                </span>
              </div>
            </button>
            <button
              onClick={() => setPhotoMode(false)}
              className={`
                flex-1 p-3 rounded-xl border-2 text-center transition-all duration-200
                ${!photoMode 
                  ? 'border-green-500 bg-green-50 shadow-sm' 
                  : 'border-gray-200 hover:border-gray-300'}
              `}
            >
              <div className="flex items-center justify-center gap-2">
                <FaCheck className={`h-4 w-4 ${!photoMode ? 'text-green-600' : 'text-gray-300'}`} />
                <span className={`text-sm font-medium ${!photoMode ? 'text-green-700' : 'text-gray-600'}`}>
                  Without Photos
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Page Format (for PDF/Print) */}
        {(exportType === 'pdf' || exportType === 'print') && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Page Format
            </label>
            <div className="flex gap-3">
              <button
                onClick={() => setFormat('portrait')}
                className={`
                  flex-1 p-3 rounded-xl border-2 text-center transition-all duration-200
                  ${format === 'portrait' 
                    ? 'border-green-500 bg-green-50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <span className={`text-sm font-medium ${format === 'portrait' ? 'text-green-700' : 'text-gray-600'}`}>
                  Portrait
                </span>
              </button>
              <button
                onClick={() => setFormat('landscape')}
                className={`
                  flex-1 p-3 rounded-xl border-2 text-center transition-all duration-200
                  ${format === 'landscape' 
                    ? 'border-green-500 bg-green-50 shadow-sm' 
                    : 'border-gray-200 hover:border-gray-300'}
                `}
              >
                <span className={`text-sm font-medium ${format === 'landscape' ? 'text-green-700' : 'text-gray-600'}`}>
                  Landscape
                </span>
              </button>
            </div>
          </div>
        )}

        {/* Actions */}
        <div className="flex gap-3 pt-4 border-t border-gray-200">
          <Button
            variant="primary"
            onClick={handleExport}
            disabled={exporting}
            className="flex-1"
          >
            {exporting ? (
              <>
                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Exporting...
              </>
            ) : (
              <>
                Export
              </>
            )}
          </Button>
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
        </div>
      </div>
    </Modal>
  );
};

export default ExportModal;