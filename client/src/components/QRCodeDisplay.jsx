// import React from 'react';
// import { QrCodeIcon } from '@heroicons/react/24/outline';
// import qrImagePath from "../assets/qrimg.png";

// const QRCodeDisplay = () => {
//   // Fixed QR image path - place your QR image in public/assets/qr-code.png
//   // const qrImagePath = '../assets/qrimg.png';

//   return (
//     <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
//       <div className="flex flex-col items-center">
//         <div className="flex items-center gap-2 mb-3">
//           <QrCodeIcon className="h-6 w-6 text-primary" />
//           <h3 className="text-lg font-semibold text-gray-900">QR Payment</h3>
//         </div>
        
//         <div className="relative w-48 h-48 bg-gray-50 rounded-lg border-2 border-gray-200 p-2">
//           <img
//             src={qrImagePath}
//             alt="Payment QR Code"
//             className="w-full h-full object-contain"
//             onError={(e) => {
//               // Fallback if image doesn't load
//               e.target.src = '/assets/qr-placeholder.png';
//             }}
//           />
//         </div>
        
//         <p className="mt-3 text-sm text-gray-600 text-center">
//           Scan this QR code to make a donation
//           <br />
//           <span className="text-xs text-gray-500">
//             (Fixed QR code for all donations)
//           </span>
//         </p>
        
//         <button
//           onClick={() => {
//             // Download QR code functionality
//             const link = document.createElement('a');
//             link.download = 'qr-code.png';
//             link.href = qrImagePath;
//             link.click();
//           }}
//           className="mt-3 text-sm text-primary hover:text-primary-dark underline"
//         >
//           Download QR Code
//         </button>
//       </div>
//     </div>
//   );
// };

// export default QRCodeDisplay;

// src/components/QRCodeDisplay.jsx - THEME REMOVED
import React from 'react';
import { QrCodeIcon } from '@heroicons/react/24/outline';
import qrImagePath from "../assets/qrimg.png";
import { useLanguage } from '../context/LanguageContext';

const QRCodeDisplay = () => {
  const { t } = useLanguage();

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex flex-col items-center">
        <div className="flex items-center gap-2 mb-3">
          <QrCodeIcon className="h-6 w-6 text-green-600" />
          <h3 className="text-lg font-semibold text-gray-900">{t('qr_payment') || 'QR Payment'}</h3>
        </div>
        
        <div className="relative w-48 h-48 bg-gray-50 rounded-lg border-2 border-gray-200 p-2">
          <img
            src={qrImagePath}
            alt="Payment QR Code"
            className="w-full h-full object-contain"
            onError={(e) => {
              e.target.src = '/assets/qr-placeholder.png';
            }}
          />
        </div>
        
        <p className="mt-3 text-sm text-gray-600 text-center">
          {t('scan_qr') || 'Scan this QR code to make a donation'}
          <br />
          <span className="text-xs text-gray-500">
            ({t('fixed_qr') || 'Fixed QR code for all donations'})
          </span>
        </p>
        
        <button
          onClick={() => {
            const link = document.createElement('a');
            link.download = 'qr-code.png';
            link.href = qrImagePath;
            link.click();
          }}
          className="mt-3 text-sm text-green-600 hover:text-green-700 underline"
        >
          {t('download_qr') || 'Download QR Code'}
        </button>
      </div>
    </div>
  );
};

export default QRCodeDisplay;

// src/components/QRCodeDisplay.jsx - UPDATED with dark mode
// import React from 'react';
// import { QrCodeIcon } from '@heroicons/react/24/outline';
// import qrImagePath from "../assets/qrimg.png";
// import { useTheme } from '../context/ThemeContext';
// import { useLanguage } from '../context/LanguageContext';

// const QRCodeDisplay = () => {
//   const { isDark } = useTheme();
//   const { t } = useLanguage();

//   return (
//     <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6">
//       <div className="flex flex-col items-center">
//         <div className="flex items-center gap-2 mb-3">
//           <QrCodeIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
//           <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('qr_payment') || 'QR Payment'}</h3>
//         </div>
        
//         <div className="relative w-48 h-48 bg-gray-50 dark:bg-gray-700 rounded-lg border-2 border-gray-200 dark:border-gray-600 p-2">
//           <img
//             src={qrImagePath}
//             alt="Payment QR Code"
//             className="w-full h-full object-contain"
//             onError={(e) => {
//               e.target.src = '/assets/qr-placeholder.png';
//             }}
//           />
//         </div>
        
//         <p className="mt-3 text-sm text-gray-600 dark:text-gray-400 text-center">
//           {t('scan_qr') || 'Scan this QR code to make a donation'}
//           <br />
//           <span className="text-xs text-gray-500 dark:text-gray-500">
//             ({t('fixed_qr') || 'Fixed QR code for all donations'})
//           </span>
//         </p>
        
//         <button
//           onClick={() => {
//             const link = document.createElement('a');
//             link.download = 'qr-code.png';
//             link.href = qrImagePath;
//             link.click();
//           }}
//           className="mt-3 text-sm text-green-600 dark:text-green-400 hover:text-green-700 dark:hover:text-green-300 underline"
//         >
//           {t('download_qr') || 'Download QR Code'}
//         </button>
//       </div>
//     </div>
//   );
// };

// export default QRCodeDisplay;