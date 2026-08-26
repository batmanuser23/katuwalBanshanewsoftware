// // src/components/DonationStats.jsx - UPDATED with all statistics
// import React from 'react';
// import { useLanguage } from '../context/LanguageContext';
// import { useTheme } from '../context/ThemeContext';

// const DonationStats = ({ stats, isLoading }) => {
//   const { t } = useLanguage();
//   const { isDark } = useTheme();

//   if (isLoading) {
//     return (
//       <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//         {[...Array(4)].map((_, i) => (
//           <div key={i} className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
//             <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2 mb-2"></div>
//             <div className="h-8 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
//           </div>
//         ))}
//       </div>
//     );
//   }

//   // Extract data from stats
//   const summary = stats?.summary || {};
//   const totalDonations = summary.count || 0;
//   const totalAmount = summary.totalAmount || 0;
//   const pendingCount = summary.pendingCount || 0;
//   const pendingAmount = summary.pendingAmount || 0;
//   const paidCount = (summary.count || 0) - (summary.pendingCount || 0);
//   const paidAmount = (summary.totalAmount || 0) - (summary.pendingAmount || 0);
  
//   // Unique donors count - use the uniqueDonors from stats if available
//   const uniqueDonors = stats?.uniqueDonors || 0;

//   // Monthly stats - get current month
//   const monthlyData = stats?.monthly || [];
//   const currentMonth = monthlyData.length > 0 ? monthlyData[monthlyData.length - 1] : null;
//   const thisMonthTotal = currentMonth?.total || 0;
//   const thisMonthCount = currentMonth?.count || 0;

//   const statsData = [
//     {
//       label: t('total_donors') || 'Total Donors',
//       value: uniqueDonors,
//       subtext: t('unique_donors') || 'Unique donors',
//       color: 'blue',
//       icon: '👤',
//     },
//     {
//       label: t('total_amount') || 'Total Amount',
//       value: totalAmount,
//       format: 'currency',
//       subtext: `${totalDonations} ${t('donations') || 'donations'}`,
//       color: 'green',
//       icon: '💰',
//     },
//     {
//       label: t('this_month') || 'This Month',
//       value: thisMonthTotal,
//       format: 'currency',
//       subtext: `${thisMonthCount} ${t('donations') || 'donations'}`,
//       color: 'purple',
//       icon: '📅',
//     },
//     {
//       label: t('pending') || 'Pending',
//       value: pendingCount,
//       format: 'number',
//       subtext: `Rs. ${pendingAmount.toFixed(2)} ${t('pending') || 'pending'}`,
//       color: 'orange',
//       icon: '⏳',
//     },
//   ];

//   const colorClasses = {
//     blue: 'bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800',
//     green: 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 border-green-200 dark:border-green-800',
//     purple: 'bg-purple-50 dark:bg-purple-900/20 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800',
//     orange: 'bg-orange-50 dark:bg-orange-900/20 text-orange-700 dark:text-orange-300 border-orange-200 dark:border-orange-800',
//   };

//   const formatCurrency = (value) => {
//     return `Rs. ${value?.toFixed(2) || '0.00'}`;
//   };

//   const formatNumber = (value) => {
//     return value?.toLocaleString() || '0';
//   };

//   return (
//     <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//       {statsData.map((stat, index) => (
//         <div
//           key={index}
//           className={`${colorClasses[stat.color]} rounded-lg border p-4 md:p-6 transition-all hover:shadow-md`}
//         >
//           <div className="flex items-center justify-between mb-2">
//             <span className="text-2xl">{stat.icon}</span>
//             <span className="text-xs font-medium opacity-70">{stat.subtext}</span>
//           </div>
//           <p className="text-sm font-medium opacity-80">{stat.label}</p>
//           <p className="text-xl md:text-2xl font-bold">
//             {stat.format === 'currency' ? formatCurrency(stat.value) : formatNumber(stat.value)}
//           </p>
//         </div>
//       ))}
//     </div>
//   );
// };

// export default DonationStats;
// src/components/DonationStats.jsx - THEME REMOVED
import React from 'react';
import { useLanguage } from '../context/LanguageContext';

const DonationStats = ({ stats, isLoading }) => {
  const { t } = useLanguage();

  if (isLoading) {
    return (
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
            <div className="h-8 bg-gray-200 rounded w-3/4"></div>
          </div>
        ))}
      </div>
    );
  }

  const summary = stats?.summary || {};
  const totalDonations = summary.count || 0;
  const totalAmount = summary.totalAmount || 0;
  const pendingCount = summary.pendingCount || 0;
  const pendingAmount = summary.pendingAmount || 0;
  const uniqueDonors = stats?.uniqueDonors || 0;

  const monthlyData = stats?.monthly || [];
  const currentMonth = monthlyData.length > 0 ? monthlyData[monthlyData.length - 1] : null;
  const thisMonthTotal = currentMonth?.total || 0;
  const thisMonthCount = currentMonth?.count || 0;

  const statsData = [
    {
      label: t('total_donors') || 'Total Donors',
      value: uniqueDonors,
      subtext: t('unique_donors') || 'Unique donors',
      color: 'blue',
      icon: '👤',
    },
    {
      label: t('total_amount') || 'Total Amount',
      value: totalAmount,
      format: 'currency',
      subtext: `${totalDonations} ${t('donations') || 'donations'}`,
      color: 'green',
      icon: '💰',
    },
    {
      label: t('this_month') || 'This Month',
      value: thisMonthTotal,
      format: 'currency',
      subtext: `${thisMonthCount} ${t('donations') || 'donations'}`,
      color: 'purple',
      icon: '📅',
    },
    {
      label: t('pending') || 'Pending',
      value: pendingCount,
      format: 'number',
      subtext: `Rs. ${pendingAmount.toFixed(2)} ${t('pending') || 'pending'}`,
      color: 'orange',
      icon: '⏳',
    },
  ];

  const colorClasses = {
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    green: 'bg-green-50 text-green-700 border-green-200',
    purple: 'bg-purple-50 text-purple-700 border-purple-200',
    orange: 'bg-orange-50 text-orange-700 border-orange-200',
  };

  const formatCurrency = (value) => {
    return `Rs. ${value?.toFixed(2) || '0.00'}`;
  };

  const formatNumber = (value) => {
    return value?.toLocaleString() || '0';
  };

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {statsData.map((stat, index) => (
        <div
          key={index}
          className={`${colorClasses[stat.color]} rounded-lg border p-4 md:p-6 transition-all hover:shadow-md`}
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{stat.icon}</span>
            <span className="text-xs font-medium opacity-70">{stat.subtext}</span>
          </div>
          <p className="text-sm font-medium opacity-80">{stat.label}</p>
          <p className="text-xl md:text-2xl font-bold">
            {stat.format === 'currency' ? formatCurrency(stat.value) : formatNumber(stat.value)}
          </p>
        </div>
      ))}
    </div>
  );
};

export default DonationStats;