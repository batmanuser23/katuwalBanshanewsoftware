// import React from 'react';
// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

// const Tablee = ({
//   columns,
//   data,
//   loading = false,
//   pagination = null,
//   emptyMessage = 'No data available',
//   onRowClick = null,
// }) => {
//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
//       </div>
//     );
//   }

//   if (!data || data.length === 0) {
//     return (
//       <div className="text-center py-12 text-gray-500">
//         <p>{emptyMessage}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200">
//         <thead className="bg-gray-50">
//           <tr>
//             {columns.map((column) => (
//               <th
//                 key={column.key}
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
//               >
//                 {column.label}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody className="bg-white divide-y divide-gray-200">
//           {data.map((row, rowIndex) => (
//             <tr
//               key={row._id || rowIndex}
//               onClick={() => onRowClick && onRowClick(row)}
//               className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
//             >
//               {columns.map((column) => (
//                 <td
//                   key={`${row._id}-${column.key}`}
//                   className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
//                 >
//                   {column.render
//                     ? column.render(row[column.key], row)
//                     : row[column.key] || '-'}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {pagination && pagination.totalPages > 1 && (
//         <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between">
//           <div className="text-sm text-gray-700">
//             Showing page {pagination.currentPage} of {pagination.totalPages}
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
//               disabled={pagination.currentPage === 1}
//               className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <ChevronLeftIcon className="h-4 w-4" />
//             </button>
//             <button
//               onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
//               disabled={pagination.currentPage === pagination.totalPages}
//               className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <ChevronRightIcon className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Tablee;
// src/components/Tablee.jsx - THEME REMOVED
import React from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';

const Tablee = ({
  columns,
  data,
  loading = false,
  pagination = null,
  emptyMessage = 'No data available',
  onRowClick = null,
}) => {
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  if (!data || data.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
              >
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {data.map((row, rowIndex) => (
            <tr
              key={row._id || rowIndex}
              onClick={() => onRowClick && onRowClick(row)}
              className={onRowClick ? 'cursor-pointer hover:bg-gray-50' : ''}
            >
              {columns.map((column) => (
                <td
                  key={`${row._id}-${column.key}`}
                  className="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
                >
                  {column.render
                    ? column.render(row[column.key], row)
                    : row[column.key] || '-'}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      {pagination && pagination.totalPages > 1 && (
        <div className="px-6 py-4 bg-gray-50 border-t border-gray-200 flex items-center justify-between flex-wrap gap-2">
          <div className="text-sm text-gray-700">
            {pagination.currentPage} / {pagination.totalPages}
          </div>
          <div className="flex gap-2">
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
              disabled={pagination.currentPage === 1}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeftIcon className="h-4 w-4" />
            </button>
            <button
              onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
              disabled={pagination.currentPage === pagination.totalPages}
              className="px-3 py-1 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRightIcon className="h-4 w-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Tablee;

// // src/components/Tablee.jsx - UPDATED with dark mode support
// import React from 'react';
// import { ChevronLeftIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
// import { useTheme } from '../context/ThemeContext';

// const Tablee = ({
//   columns,
//   data,
//   loading = false,
//   pagination = null,
//   emptyMessage = 'No data available',
//   onRowClick = null,
// }) => {
//   const { isDark } = useTheme();

//   if (loading) {
//     return (
//       <div className="flex items-center justify-center h-64">
//         <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
//       </div>
//     );
//   }

//   if (!data || data.length === 0) {
//     return (
//       <div className="text-center py-12 text-gray-500 dark:text-gray-400">
//         <p>{emptyMessage}</p>
//       </div>
//     );
//   }

//   return (
//     <div className="overflow-x-auto">
//       <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
//         <thead className="bg-gray-50 dark:bg-gray-700">
//           <tr>
//             {columns.map((column) => (
//               <th
//                 key={column.key}
//                 className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider"
//               >
//                 {column.label}
//               </th>
//             ))}
//           </tr>
//         </thead>
//         <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
//           {data.map((row, rowIndex) => (
//             <tr
//               key={row._id || rowIndex}
//               onClick={() => onRowClick && onRowClick(row)}
//               className={onRowClick ? 'cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-700/50' : ''}
//             >
//               {columns.map((column) => (
//                 <td
//                   key={`${row._id}-${column.key}`}
//                   className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100"
//                 >
//                   {column.render
//                     ? column.render(row[column.key], row)
//                     : row[column.key] || '-'}
//                 </td>
//               ))}
//             </tr>
//           ))}
//         </tbody>
//       </table>

//       {pagination && pagination.totalPages > 1 && (
//         <div className="px-6 py-4 bg-gray-50 dark:bg-gray-700 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between flex-wrap gap-2">
//           <div className="text-sm text-gray-700 dark:text-gray-300">
//             {pagination.currentPage} / {pagination.totalPages}
//           </div>
//           <div className="flex gap-2">
//             <button
//               onClick={() => pagination.onPageChange(pagination.currentPage - 1)}
//               disabled={pagination.currentPage === 1}
//               className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <ChevronLeftIcon className="h-4 w-4" />
//             </button>
//             <button
//               onClick={() => pagination.onPageChange(pagination.currentPage + 1)}
//               disabled={pagination.currentPage === pagination.totalPages}
//               className="px-3 py-1 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-600 disabled:opacity-50 disabled:cursor-not-allowed"
//             >
//               <ChevronRightIcon className="h-4 w-4" />
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default Tablee;