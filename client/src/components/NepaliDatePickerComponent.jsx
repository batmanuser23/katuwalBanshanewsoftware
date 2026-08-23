// // src/components/NepaliDatePicker.jsx
// import React, { useState, useEffect } from 'react';
// import { NepaliDatePicker } from "nepali-datepicker-reactjs";
// import "nepali-datepicker-reactjs/dist/index.css";
// import { FaCalendar } from 'react-icons/fa';

// const NepaliDatePickerComponent = ({
//   label,
//   name,
//   value,
//   onChange,
//   required = false,
//   className = '',
//   placeholder = 'Select date',
// }) => {
//   const [date, setDate] = useState(value || '');

//   useEffect(() => {
//     setDate(value || '');
//   }, [value]);

//   const handleDateChange = (selectedDate) => {
//     const dateStr = selectedDate || '';
//     setDate(dateStr);
//     onChange(name, dateStr);
//   };

//   return (
//     <div className={`w-full ${className}`}>
//       <label className="block text-sm font-medium text-gray-700 mb-1">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       <div className="relative">
//         <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 z-10">
//           <FaCalendar className="h-4 w-4" />
//         </div>
//         <NepaliDatePicker
//           value={date}
//           onChange={handleDateChange}
//           placeholder={placeholder}
//           className="w-full pl-9 pr-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
//           language="en"
//         />
//       </div>
//     </div>
//   );
// };

// export default NepaliDatePickerComponent;

// // src/components/NepaliDatePickerComponent.jsx
// import React, { useState, useEffect } from 'react';
// import { NepaliDatePicker } from "nepali-datepicker-reactjs";
// import "nepali-datepicker-reactjs/dist/index.css";
// import { FaCalendar } from 'react-icons/fa';

// const NepaliDatePickerComponent = ({
//   label,
//   name,
//   value,
//   onChange,
//   required = false,
//   className = '',
//   placeholder = 'Select date',
// }) => {
//   const [date, setDate] = useState(value || '');

//   useEffect(() => {
//     setDate(value || '');
//   }, [value]);

//   const handleDateChange = (selectedDate) => {
//     const dateStr = selectedDate || '';
//     setDate(dateStr);
//     onChange(name, dateStr);
//   };

//   return (
//     <div className={`w-full ${className}`}>
//       <label className="block text-xs font-medium text-gray-700 mb-1">
//         {label} {required && <span className="text-red-500">*</span>}
//       </label>
//       <div className="relative">
//         <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 z-10">
//           <FaCalendar className="h-3.5 w-3.5" />
//         </div>
//         <NepaliDatePicker
//           value={date}
//           onChange={handleDateChange}
//           placeholder={placeholder}
//           className="w-full pl-8 pr-2.5 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all hover:border-green-300 text-sm text-gray-700"
//           language="en"
//         />
//       </div>
//       <style jsx>{`
//         /* Main container */
//         .nepali-date-picker {
//           width: 100% !important;
//         }
        
//         /* Input field */
//         .nepali-date-picker .date-picker-input {
//           border-radius: 0.5rem !important;
//           border-color: #e5e7eb !important;
//           padding: 0.5rem 0.625rem 0.5rem 2rem !important;
//           font-size: 0.875rem !important;
//           height: 42px !important;
//           background-color: white !important;
//         }
        
//         .nepali-date-picker .date-picker-input:focus {
//           border-color: #22c55e !important;
//           box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15) !important;
//           outline: none !important;
//         }
        
//         .nepali-date-picker .date-picker-input:hover {
//           border-color: #86efac !important;
//         }
        
//         /* Calendar popup */
//         .nepali-date-picker .date-picker-calendar {
//           border-radius: 0.75rem !important;
//           border: 1px solid #d1fae5 !important;
//           box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.02) !important;
//           padding: 0.75rem !important;
//           background: white !important;
//           min-width: 300px !important;
//         }
        
//         /* Header */
//         .nepali-date-picker .date-picker-calendar .date-picker-header {
//           background: linear-gradient(135deg, #16a34a, #059669) !important;
//           padding: 0.625rem 0.75rem !important;
//           border-radius: 0.5rem !important;
//           margin-bottom: 0.75rem !important;
//           border: none !important;
//         }
        
//         /* Month/Year selector */
//         .nepali-date-picker .date-picker-calendar .month-year-selector {
//           color: white !important;
//           font-weight: 600 !important;
//           font-size: 0.875rem !important;
//         }
        
//         /* Navigation arrows */
//         .nepali-date-picker .date-picker-calendar .month-year-nav {
//           color: white !important;
//           background: rgba(255, 255, 255, 0.2) !important;
//           border-radius: 0.375rem !important;
//           padding: 0.25rem 0.5rem !important;
//           transition: all 0.2s !important;
//           border: none !important;
//         }
        
//         .nepali-date-picker .date-picker-calendar .month-year-nav:hover {
//           background: rgba(255, 255, 255, 0.3) !important;
//         }
        
//         /* Weekday labels */
//         .nepali-date-picker .date-picker-calendar .day-name {
//           color: #16a34a !important;
//           font-weight: 700 !important;
//           font-size: 0.7rem !important;
//           text-transform: uppercase !important;
//           letter-spacing: 0.05em !important;
//           padding: 0.25rem !important;
//         }
        
//         /* Day cells */
//         .nepali-date-picker .date-picker-calendar .day-cell {
//           padding: 0.25rem !important;
//           font-size: 0.8rem !important;
//           border-radius: 0.375rem !important;
//           transition: all 0.15s !important;
//           cursor: pointer !important;
//         }
        
//         .nepali-date-picker .date-picker-calendar .day-cell:hover:not(.selected-day) {
//           background-color: #f0fdf4 !important;
//           color: #16a34a !important;
//         }
        
//         /* Selected day - Green */
//         .nepali-date-picker .date-picker-calendar .selected-day {
//           background: linear-gradient(135deg, #16a34a, #059669) !important;
//           color: white !important;
//           border-radius: 0.375rem !important;
//           font-weight: 600 !important;
//           box-shadow: 0 2px 8px rgba(22, 163, 74, 0.3) !important;
//         }
        
//         /* Today - Light Green border */
//         .nepali-date-picker .date-picker-calendar .today-day {
//           border: 2px solid #16a34a !important;
//           border-radius: 0.375rem !important;
//           background: #f0fdf4 !important;
//           color: #16a34a !important;
//           font-weight: 600 !important;
//         }
        
//         /* Today when selected */
//         .nepali-date-picker .date-picker-calendar .today-day.selected-day {
//           background: linear-gradient(135deg, #16a34a, #059669) !important;
//           color: white !important;
//           border: 2px solid #16a34a !important;
//         }
        
//         /* Disabled dates */
//         .nepali-date-picker .date-picker-calendar .day-cell.disabled {
//           color: #d1d5db !important;
//           cursor: not-allowed !important;
//         }
        
//         /* Other month dates */
//         .nepali-date-picker .date-picker-calendar .day-cell.other-month {
//           color: #9ca3af !important;
//         }
        
//         /* Footer buttons */
//         .nepali-date-picker .date-picker-calendar .date-picker-footer {
//           border-top: 1px solid #f3f4f6 !important;
//           padding-top: 0.5rem !important;
//           margin-top: 0.5rem !important;
//         }
        
//         .nepali-date-picker .date-picker-calendar .date-picker-footer button {
//           color: #16a34a !important;
//           font-weight: 500 !important;
//           transition: all 0.2s !important;
//           border-radius: 0.375rem !important;
//           padding: 0.25rem 0.75rem !important;
//         }
        
//         .nepali-date-picker .date-picker-calendar .date-picker-footer button:hover {
//           background-color: #f0fdf4 !important;
//         }
        
//         /* Responsive adjustments */
//         @media (max-width: 640px) {
//           .nepali-date-picker .date-picker-calendar {
//             min-width: 280px !important;
//             padding: 0.5rem !important;
//           }
          
//           .nepali-date-picker .date-picker-calendar .day-cell {
//             padding: 0.15rem !important;
//             font-size: 0.75rem !important;
//           }
          
//           .nepali-date-picker .date-picker-calendar .day-name {
//             font-size: 0.65rem !important;
//           }
//         }
//       `}</style>
//     </div>
//   );
// };

// export default NepaliDatePickerComponent;


// src/components/NepaliDatePickerComponent.jsx - COMPLETE UPDATED FILE

import React, { useState, useEffect, useRef } from 'react';
import { NepaliDatePicker } from "nepali-datepicker-reactjs";
import "nepali-datepicker-reactjs/dist/index.css";
import { FaCalendar } from 'react-icons/fa';

const NepaliDatePickerComponent = ({
  label,
  name,
  value,
  onChange,
  required = false,
  className = '',
  placeholder = 'मिति चयन गर्नुहोस्',
}) => {
  const [date, setDate] = useState(value || '');
  const containerRef = useRef(null);

  useEffect(() => {
    setDate(value || '');
  }, [value]);

  const handleDateChange = (selectedDate) => {
    const dateStr = selectedDate || '';
    setDate(dateStr);
    onChange(name, dateStr);
  };

  return (
    <div className={`w-full ${className}`} ref={containerRef}>
      <label className="block text-xs font-medium text-gray-700 mb-1">
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <div className="relative" style={{ position: 'relative', zIndex: 10 }}>
        <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-green-600 z-10 pointer-events-none">
          <FaCalendar className="h-3.5 w-3.5" />
        </div>
        <NepaliDatePicker
          value={date}
          onChange={handleDateChange}
          placeholder={placeholder}
          className="w-full pl-8 pr-2.5 py-2 rounded-lg border border-gray-200 focus:border-green-500 focus:outline-none focus:ring-2 focus:ring-green-200 transition-all hover:border-green-300 text-sm text-gray-700"
          language="en"
        />
      </div>
      <style jsx>{`
        /* ✅ FIXED: Calendar positioning - not clipped */
        .nepali-date-picker {
          width: 100% !important;
          position: relative !important;
        }
        
        .nepali-date-picker .date-picker-input {
          border-radius: 0.5rem !important;
          border-color: #e5e7eb !important;
          padding: 0.5rem 0.625rem 0.5rem 2rem !important;
          font-size: 0.875rem !important;
          height: 42px !important;
          background-color: white !important;
          width: 100% !important;
        }
        
        .nepali-date-picker .date-picker-input:focus {
          border-color: #22c55e !important;
          box-shadow: 0 0 0 3px rgba(34, 197, 94, 0.15) !important;
          outline: none !important;
        }
        
        .nepali-date-picker .date-picker-input:hover {
          border-color: #86efac !important;
        }
        
        /* ✅ FIXED: Calendar popup - properly positioned and visible */
        .nepali-date-picker .date-picker-calendar {
          position: fixed !important;
          top: auto !important;
          left: auto !important;
          bottom: auto !important;
          right: auto !important;
          border-radius: 0.75rem !important;
          border: 1px solid #d1fae5 !important;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.15), 0 8px 20px rgba(0, 0, 0, 0.05) !important;
          padding: 0.75rem !important;
          background: white !important;
          min-width: 320px !important;
          max-width: 90vw !important;
          z-index: 999999 !important;
          transform: translateY(0) !important;
          max-height: 80vh !important;
          overflow: auto !important;
        }
        
        /* ✅ FIXED: Center calendar on mobile */
        @media (max-width: 640px) {
          .nepali-date-picker .date-picker-calendar {
            position: fixed !important;
            top: 50% !important;
            left: 50% !important;
            transform: translate(-50%, -50%) !important;
            min-width: 90vw !important;
            max-height: 80vh !important;
            border-radius: 1rem !important;
            z-index: 999999 !important;
          }
        }
        
        /* ✅ Calendar header - Green gradient */
        .nepali-date-picker .date-picker-calendar .date-picker-header {
          background: linear-gradient(135deg, #16a34a, #059669) !important;
          padding: 0.625rem 0.75rem !important;
          border-radius: 0.5rem !important;
          margin-bottom: 0.75rem !important;
          border: none !important;
        }
        
        .nepali-date-picker .date-picker-calendar .month-year-selector {
          color: white !important;
          font-weight: 600 !important;
          font-size: 0.875rem !important;
        }
        
        .nepali-date-picker .date-picker-calendar .month-year-nav {
          color: white !important;
          background: rgba(255, 255, 255, 0.2) !important;
          border-radius: 0.375rem !important;
          padding: 0.25rem 0.5rem !important;
          transition: all 0.2s !important;
          border: none !important;
        }
        
        .nepali-date-picker .date-picker-calendar .month-year-nav:hover {
          background: rgba(255, 255, 255, 0.3) !important;
        }
        
        /* ✅ Weekday labels - Green */
        .nepali-date-picker .date-picker-calendar .day-name {
          color: #16a34a !important;
          font-weight: 700 !important;
          font-size: 0.7rem !important;
          text-transform: uppercase !important;
          letter-spacing: 0.05em !important;
          padding: 0.25rem !important;
        }
        
        /* ✅ Day cells */
        .nepali-date-picker .date-picker-calendar .day-cell {
          padding: 0.25rem !important;
          font-size: 0.8rem !important;
          border-radius: 0.375rem !important;
          transition: all 0.15s !important;
          cursor: pointer !important;
        }
        
        .nepali-date-picker .date-picker-calendar .day-cell:hover:not(.selected-day) {
          background-color: #f0fdf4 !important;
          color: #16a34a !important;
        }
        
        /* ✅ Selected day - Green gradient */
        .nepali-date-picker .date-picker-calendar .selected-day {
          background: linear-gradient(135deg, #16a34a, #059669) !important;
          color: white !important;
          border-radius: 0.375rem !important;
          font-weight: 600 !important;
          box-shadow: 0 2px 8px rgba(22, 163, 74, 0.3) !important;
        }
        
        /* ✅ Today - Light Green border */
        .nepali-date-picker .date-picker-calendar .today-day {
          border: 2px solid #16a34a !important;
          border-radius: 0.375rem !important;
          background: #f0fdf4 !important;
          color: #16a34a !important;
          font-weight: 600 !important;
        }
        
        /* ✅ Today when selected */
        .nepali-date-picker .date-picker-calendar .today-day.selected-day {
          background: linear-gradient(135deg, #16a34a, #059669) !important;
          color: white !important;
          border: 2px solid #16a34a !important;
        }
        
        /* Disabled dates */
        .nepali-date-picker .date-picker-calendar .day-cell.disabled {
          color: #d1d5db !important;
          cursor: not-allowed !important;
        }
        
        /* Other month dates */
        .nepali-date-picker .date-picker-calendar .day-cell.other-month {
          color: #9ca3af !important;
        }
        
        /* ✅ Footer buttons */
        .nepali-date-picker .date-picker-calendar .date-picker-footer {
          border-top: 1px solid #f3f4f6 !important;
          padding-top: 0.5rem !important;
          margin-top: 0.5rem !important;
        }
        
        .nepali-date-picker .date-picker-calendar .date-picker-footer button {
          color: #16a34a !important;
          font-weight: 500 !important;
          transition: all 0.2s !important;
          border-radius: 0.375rem !important;
          padding: 0.25rem 0.75rem !important;
        }
        
        .nepali-date-picker .date-picker-calendar .date-picker-footer button:hover {
          background-color: #f0fdf4 !important;
        }
        
        /* ✅ Responsive adjustments */
        @media (max-width: 640px) {
          .nepali-date-picker .date-picker-calendar {
            min-width: 90vw !important;
            padding: 0.75rem !important;
          }
          
          .nepali-date-picker .date-picker-calendar .day-cell {
            padding: 0.35rem !important;
            font-size: 0.85rem !important;
          }
          
          .nepali-date-picker .date-picker-calendar .day-name {
            font-size: 0.7rem !important;
          }
        }
      `}</style>
    </div>
  );
};

export default NepaliDatePickerComponent;