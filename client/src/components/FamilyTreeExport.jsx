// src/components/FamilyTreeExport.jsx - NEW COMPONENT

import React from 'react';
import { FaFileExcel, FaFilePdf, FaImage } from 'react-icons/fa';
import Button from './Button';

const FamilyTreeExport = ({ family, members, onExport }) => {
  const handleExport = (format) => {
    onExport({ family, members, format });
  };

  return (
    <div className="flex gap-2">
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('excel')}
        className="flex items-center"
      >
        <FaFileExcel className="mr-1.5 text-green-600" />
        Excel
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('pdf')}
        className="flex items-center"
      >
        <FaFilePdf className="mr-1.5 text-red-600" />
        PDF
      </Button>
      <Button
        variant="outline"
        size="sm"
        onClick={() => handleExport('image')}
        className="flex items-center"
      >
        <FaImage className="mr-1.5 text-blue-600" />
        Image
      </Button>
    </div>
  );
};

export default FamilyTreeExport;