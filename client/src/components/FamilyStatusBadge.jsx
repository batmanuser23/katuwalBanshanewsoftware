// src/components/FamilyStatusBadge.jsx
import React from 'react';
import { FaLock, FaUnlock } from 'react-icons/fa';

const FamilyStatusBadge = ({ status, size = 'md', className = '' }) => {
  const isClosed = status === 'closed';
  
  const sizeClasses = {
    sm: 'px-2 py-0.5 text-xs',
    md: 'px-3 py-1 text-sm',
    lg: 'px-4 py-1.5 text-base',
  };

  return (
    <span className={`
      inline-flex items-center gap-1.5 rounded-full font-medium
      ${sizeClasses[size]}
      ${isClosed 
        ? 'bg-gray-100 text-gray-600' 
        : 'bg-green-100 text-green-700'}
      ${className}
    `}>
      {isClosed ? (
        <>
          <FaLock className="text-xs" />
          CLOSED
        </>
      ) : (
        <>
          <FaUnlock className="text-xs" />
          OPEN
        </>
      )}
    </span>
  );
};

export default FamilyStatusBadge;