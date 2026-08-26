// // src/components/DonationFilters.jsx - UPDATED with payment status
// import React, { useState } from 'react';
// import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
// import { useLanguage } from '../context/LanguageContext';
// import { useTheme } from '../context/ThemeContext';

// const DonationFilters = ({ filters, onFilterChange, onSearch }) => {
//   const { t } = useLanguage();
//   const { isDark } = useTheme();
//   const [showAdvanced, setShowAdvanced] = useState(false);
//   const [searchTerm, setSearchTerm] = useState(filters.search || '');

//   const handleSearch = (e) => {
//     e.preventDefault();
//     onSearch(searchTerm);
//   };

//   const handleFilterChange = (key, value) => {
//     onFilterChange({ ...filters, [key]: value });
//   };

//   const handleClearFilters = () => {
//     setSearchTerm('');
//     onFilterChange({
//       search: '',
//       paymentMethod: '',
//       category: '',
//       paymentStatus: '',
//       startDate: '',
//       endDate: '',
//       minAmount: '',
//       maxAmount: '',
//     });
//   };

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4">
//       {/* Search Bar */}
//       <form onSubmit={handleSearch} className="flex gap-2 flex-wrap">
//         <div className="flex-1 min-w-[200px] relative">
//           <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
//           <input
//             type="text"
//             placeholder={t('search_donations') || "Search by donor name, phone, amount..."}
//             value={searchTerm}
//             onChange={(e) => setSearchTerm(e.target.value)}
//             className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//           />
//         </div>
//         <button
//           type="submit"
//           className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
//         >
//           {t('search') || 'Search'}
//         </button>
//         <button
//           type="button"
//           onClick={() => setShowAdvanced(!showAdvanced)}
//           className={`px-4 py-2 border rounded-lg transition-colors ${
//             showAdvanced
//               ? 'bg-green-600 text-white border-green-600'
//               : 'bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700'
//           }`}
//         >
//           <FunnelIcon className="h-5 w-5" />
//         </button>
//       </form>

//       {/* Advanced Filters */}
//       {showAdvanced && (
//         <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
//           <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
//             {/* Payment Method */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 {t('payment_method') || 'Payment Method'}
//               </label>
//               <select
//                 value={filters.paymentMethod || ''}
//                 onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//               >
//                 <option value="">{t('all_methods') || 'All Methods'}</option>
//                 <option value="qr">{t('qr_payment') || 'QR Payment'}</option>
//                 <option value="cash">{t('cash') || 'Cash'}</option>
//                 <option value="bank_transfer">{t('bank_transfer') || 'Bank Transfer'}</option>
//                 <option value="cheque">{t('cheque') || 'Cheque'}</option>
//               </select>
//             </div>

//             {/* Category */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 {t('category') || 'Category'}
//               </label>
//               <select
//                 value={filters.category || ''}
//                 onChange={(e) => handleFilterChange('category', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//               >
//                 <option value="">{t('all_categories') || 'All Categories'}</option>
//                 <option value="general">{t('general') || 'General'}</option>
//                 <option value="temple">{t('temple') || 'Temple'}</option>
//                 <option value="education">{t('education') || 'Education'}</option>
//                 <option value="emergency">{t('emergency') || 'Emergency'}</option>
//                 <option value="event">{t('event') || 'Event'}</option>
//                 <option value="other">{t('other') || 'Other'}</option>
//               </select>
//             </div>

//             {/* Payment Status - NEW */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 {t('payment_status') || 'Payment Status'}
//               </label>
//               <select
//                 value={filters.paymentStatus || ''}
//                 onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
//                 className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//               >
//                 <option value="">{t('all_status') || 'All Status'}</option>
//                 <option value="pending">{t('pending') || 'Pending'}</option>
//                 <option value="paid">{t('paid') || 'Paid'}</option>
//                 <option value="failed">{t('failed') || 'Failed'}</option>
//               </select>
//             </div>

//             {/* Date Range */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 {t('date_range') || 'Date Range'}
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   type="date"
//                   value={filters.startDate || ''}
//                   onChange={(e) => handleFilterChange('startDate', e.target.value)}
//                   className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//                 />
//                 <input
//                   type="date"
//                   value={filters.endDate || ''}
//                   onChange={(e) => handleFilterChange('endDate', e.target.value)}
//                   className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//                 />
//               </div>
//             </div>

//             {/* Amount Range */}
//             <div>
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                 {t('amount_range') || 'Amount Range'}
//               </label>
//               <div className="flex gap-2">
//                 <input
//                   type="number"
//                   placeholder={t('min') || 'Min'}
//                   value={filters.minAmount || ''}
//                   onChange={(e) => handleFilterChange('minAmount', e.target.value)}
//                   className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//                 />
//                 <input
//                   type="number"
//                   placeholder={t('max') || 'Max'}
//                   value={filters.maxAmount || ''}
//                   onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
//                   className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//                 />
//               </div>
//             </div>
//           </div>

//           <div className="mt-4 flex justify-end">
//             <button
//               onClick={handleClearFilters}
//               className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white flex items-center gap-2"
//             >
//               <XMarkIcon className="h-4 w-4" />
//               {t('clear_filters') || 'Clear Filters'}
//             </button>
//           </div>
//         </div>
//       )}
//     </div>
//   );
// };

// export default DonationFilters;


// src/components/DonationFilters.jsx - THEME REMOVED
import React, { useState } from 'react';
import { MagnifyingGlassIcon, FunnelIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';

const DonationFilters = ({ filters, onFilterChange, onSearch }) => {
  const { t } = useLanguage();
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [searchTerm, setSearchTerm] = useState(filters.search || '');

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleFilterChange = (key, value) => {
    onFilterChange({ ...filters, [key]: value });
  };

  const handleClearFilters = () => {
    setSearchTerm('');
    onFilterChange({
      search: '',
      paymentMethod: '',
      category: '',
      paymentStatus: '',
      startDate: '',
      endDate: '',
      minAmount: '',
      maxAmount: '',
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
      {/* Search Bar */}
      <form onSubmit={handleSearch} className="flex gap-2 flex-wrap">
        <div className="flex-1 min-w-[200px] relative">
          <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            placeholder={t('search_donations') || "Search by donor name, phone, amount..."}
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
          />
        </div>
        <button
          type="submit"
          className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
        >
          {t('search') || 'Search'}
        </button>
        <button
          type="button"
          onClick={() => setShowAdvanced(!showAdvanced)}
          className={`px-4 py-2 border rounded-lg transition-colors ${
            showAdvanced
              ? 'bg-green-600 text-white border-green-600'
              : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-50'
          }`}
        >
          <FunnelIcon className="h-5 w-5" />
        </button>
      </form>

      {/* Advanced Filters */}
      {showAdvanced && (
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Payment Method */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('payment_method') || 'Payment Method'}
              </label>
              <select
                value={filters.paymentMethod || ''}
                onChange={(e) => handleFilterChange('paymentMethod', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="">{t('all_methods') || 'All Methods'}</option>
                <option value="qr">{t('qr_payment') || 'QR Payment'}</option>
                <option value="cash">{t('cash') || 'Cash'}</option>
                <option value="bank_transfer">{t('bank_transfer') || 'Bank Transfer'}</option>
                <option value="cheque">{t('cheque') || 'Cheque'}</option>
              </select>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('category') || 'Category'}
              </label>
              <select
                value={filters.category || ''}
                onChange={(e) => handleFilterChange('category', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="">{t('all_categories') || 'All Categories'}</option>
                <option value="general">{t('general') || 'General'}</option>
                <option value="temple">{t('temple') || 'Temple'}</option>
                <option value="education">{t('education') || 'Education'}</option>
                <option value="emergency">{t('emergency') || 'Emergency'}</option>
                <option value="event">{t('event') || 'Event'}</option>
                <option value="other">{t('other') || 'Other'}</option>
              </select>
            </div>

            {/* Payment Status */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('payment_status') || 'Payment Status'}
              </label>
              <select
                value={filters.paymentStatus || ''}
                onChange={(e) => handleFilterChange('paymentStatus', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
              >
                <option value="">{t('all_status') || 'All Status'}</option>
                <option value="pending">{t('pending') || 'Pending'}</option>
                <option value="paid">{t('paid') || 'Paid'}</option>
                <option value="failed">{t('failed') || 'Failed'}</option>
              </select>
            </div>

            {/* Date Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('date_range') || 'Date Range'}
              </label>
              <div className="flex gap-2">
                <input
                  type="date"
                  value={filters.startDate || ''}
                  onChange={(e) => handleFilterChange('startDate', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                />
                <input
                  type="date"
                  value={filters.endDate || ''}
                  onChange={(e) => handleFilterChange('endDate', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                />
              </div>
            </div>

            {/* Amount Range */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {t('amount_range') || 'Amount Range'}
              </label>
              <div className="flex gap-2">
                <input
                  type="number"
                  placeholder={t('min') || 'Min'}
                  value={filters.minAmount || ''}
                  onChange={(e) => handleFilterChange('minAmount', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                />
                <input
                  type="number"
                  placeholder={t('max') || 'Max'}
                  value={filters.maxAmount || ''}
                  onChange={(e) => handleFilterChange('maxAmount', e.target.value)}
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                />
              </div>
            </div>
          </div>

          <div className="mt-4 flex justify-end">
            <button
              onClick={handleClearFilters}
              className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900 flex items-center gap-2"
            >
              <XMarkIcon className="h-4 w-4" />
              {t('clear_filters') || 'Clear Filters'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default DonationFilters;