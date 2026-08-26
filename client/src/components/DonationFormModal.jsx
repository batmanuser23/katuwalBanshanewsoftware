// // src/components/DonationFormModal.jsx - UPDATED with glassmorphism and payment status
// import React, { useState, useEffect } from 'react';
// import { useMutation, useQueryClient } from '@tanstack/react-query';
// import { createDonation, updateDonation } from '../api/donations';
// import { getMembers } from '../api/members';
// import Button from './Buttons';
// import QRCodeDisplay from './QRCodeDisplay';
// import { useLanguage } from '../context/LanguageContext';
// import { useTheme } from '../context/ThemeContext';
// import { XMarkIcon } from '@heroicons/react/24/outline';
// import toast from 'react-hot-toast';

// const DonationFormModal = ({ isOpen, onClose, donation, mode = 'create' }) => {
//   const queryClient = useQueryClient();
//   const { t } = useLanguage();
//   const { isDark } = useTheme();
  
//   const [formData, setFormData] = useState({
//     donorType: 'external',
//     donorId: '',
//     donorName: '',
//     donorPhone: '',
//     donorEmail: '',
//     amount: '',
//     paymentMethod: 'cash',
//     category: 'general',
//     donationDate: new Date().toISOString().split('T')[0],
//     remarks: '',
//     isAnonymous: false,
//     qrPaymentCompleted: false,
//     paymentStatus: 'pending',
//   });

//   const [members, setMembers] = useState([]);
//   const [selectedMember, setSelectedMember] = useState(null);

//   useEffect(() => {
//     if (donation && mode === 'edit') {
//       setFormData({
//         donorType: donation.donorType || 'external',
//         donorId: donation.donorId?._id || donation.donorId || '',
//         donorName: donation.donorName || '',
//         donorPhone: donation.donorPhone || '',
//         donorEmail: donation.donorEmail || '',
//         amount: donation.amount || '',
//         paymentMethod: donation.paymentMethod || 'cash',
//         category: donation.category || 'general',
//         donationDate: new Date(donation.donationDate).toISOString().split('T')[0],
//         remarks: donation.remarks || '',
//         isAnonymous: donation.isAnonymous || false,
//         qrPaymentCompleted: donation.qrPaymentCompleted || false,
//         paymentStatus: donation.paymentStatus || 'pending',
//       });
//       if (donation.donorId) {
//         setSelectedMember(donation.donorId);
//       }
//     }
//   }, [donation, mode]);

//   useEffect(() => {
//     const fetchMembers = async () => {
//       try {
//         const data = await getMembers({ limit: 1000 });
//         setMembers(data.data || []);
//       } catch (error) {
//         console.error('Error fetching members:', error);
//       }
//     };
//     if (isOpen) {
//       fetchMembers();
//     }
//   }, [isOpen]);

//   // Reset form when modal opens
//   useEffect(() => {
//     if (isOpen && mode === 'create') {
//       setFormData({
//         donorType: 'external',
//         donorId: '',
//         donorName: '',
//         donorPhone: '',
//         donorEmail: '',
//         amount: '',
//         paymentMethod: 'cash',
//         category: 'general',
//         donationDate: new Date().toISOString().split('T')[0],
//         remarks: '',
//         isAnonymous: false,
//         qrPaymentCompleted: false,
//         paymentStatus: 'pending',
//       });
//       setSelectedMember(null);
//     }
//   }, [isOpen, mode]);

//   const mutation = useMutation({
//     mutationFn: (data) => {
//       if (mode === 'edit') {
//         return updateDonation(donation._id, data);
//       }
//       return createDonation(data);
//     },

//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['donations'] });
//       queryClient.invalidateQueries({ queryKey: ['donationStats'] });
//       toast.success(mode === 'edit' ? t('donation_updated') || 'Donation updated' : t('donation_created') || 'Donation created');
//       onClose();
//     },

//     onError: (error) => {
//       console.log('❌ Error Response:', error.response?.data);
//       toast.error(error.response?.data?.message || t('error_saving_donation') || 'Failed to save donation');
//     }
//   });

//   const handleSubmit = (e) => {
//     e.preventDefault();
    
//     const submitData = {
//       ...formData,
//       amount: parseFloat(formData.amount),
//     };

//     // Only add donorId if donor is member/family AND selected
//     if (
//       (formData.donorType === 'member' || formData.donorType === 'family') &&
//       selectedMember
//     ) {
//       submitData.donorId = selectedMember;
//     } else {
//       delete submitData.donorId;
//     }

//     // Remove empty fields
//     if (!submitData.donorEmail || submitData.donorEmail.trim() === '') {
//       delete submitData.donorEmail;
//     }
//     if (!submitData.donorPhone || submitData.donorPhone.trim() === '') {
//       delete submitData.donorPhone;
//     }
//     if (!submitData.remarks || submitData.remarks.trim() === '') {
//       delete submitData.remarks;
//     }

//     console.log('📤 Submitting:', submitData);
//     mutation.mutate(submitData);
//   };

//   const handleChange = (field, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [field]: value,
//     }));

//     if (field === 'donorType' && value === 'external') {
//       setSelectedMember(null);
//       setFormData((prev) => ({
//         ...prev,
//         donorId: '',
//         donorName: '',
//         donorPhone: '',
//         donorEmail: '',
//       }));
//     }
//   };

//   // Handle ESC key
//   useEffect(() => {
//     const handleEsc = (event) => {
//       if (event.key === 'Escape' && isOpen) {
//         onClose();
//       }
//     };
//     window.addEventListener('keydown', handleEsc);
//     return () => window.removeEventListener('keydown', handleEsc);
//   }, [isOpen, onClose]);

//   if (!isOpen) return null;

//   return (
//     <div 
//       className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
//       onClick={(e) => {
//         if (e.target === e.currentTarget) onClose();
//       }}
//     >
//       <div className="bg-white/95 dark:bg-gray-900/95 backdrop-blur-md rounded-2xl w-full max-w-6xl mx-auto max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20 dark:border-gray-700/30">
//         {/* Header */}
//         <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200 dark:border-gray-700 sticky top-0 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm z-10 rounded-t-2xl">
//           <h2 className="text-xl md:text-2xl font-bold text-gray-900 dark:text-white">
//             {mode === 'edit' ? t('edit_donation') || 'Edit Donation' : t('add_donation') || 'Add New Donation'}
//           </h2>
//           <button 
//             onClick={onClose} 
//             className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
//             aria-label="Close"
//           >
//             <XMarkIcon className="h-6 w-6 text-gray-500 dark:text-gray-400" />
//           </button>
//         </div>

//         {/* Body */}
//         <div className="p-4 md:p-6">
//           <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
//             {/* QR Code Display */}
//             <div className="lg:col-span-1 order-2 lg:order-1">
//               <QRCodeDisplay />
//             </div>

//             {/* Donation Form */}
//             <form onSubmit={handleSubmit} className="lg:col-span-2 order-1 lg:order-2 space-y-6">
//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Donor Type */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     {t('donor_type') || 'Donor Type'} *
//                   </label>
//                   <select
//                     value={formData.donorType}
//                     onChange={(e) => handleChange('donorType', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//                     required
//                   >
//                     <option value="member">{t('member') || 'Member'}</option>
//                     <option value="family">{t('family') || 'Family'}</option>
//                     <option value="external">{t('external_donor') || 'External Donor'}</option>
//                   </select>
//                 </div>

//                 {/* Member/Family Selection */}
//                 {(formData.donorType === 'member' || formData.donorType === 'family') && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       {t('select') || 'Select'} {formData.donorType === 'member' ? t('member') : t('family_member')} *
//                     </label>
//                     <select
//                       value={selectedMember || ''}
//                       onChange={(e) => {
//                         const memberId = e.target.value;
//                         setSelectedMember(memberId);
//                         const member = members.find(m => m._id === memberId);
//                         if (member) {
//                           setFormData((prev) => ({
//                             ...prev,
//                             donorName: member.name,
//                             donorPhone: member.phone || '',
//                             donorEmail: member.email || '',
//                           }));
//                         }
//                       }}
//                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//                       required
//                     >
//                       <option value="">{t('select') || 'Select'} {formData.donorType}</option>
//                       {members.map((member) => (
//                         <option key={member._id} value={member._id}>
//                           {member.name} {member.phone ? `(${member.phone})` : ''}
//                           {formData.donorType === 'family' && member.familyName ? ` - ${member.familyName}` : ''}
//                         </option>
//                       ))}
//                     </select>
//                   </div>
//                 )}

//                 {/* Donor Name (for external) */}
//                 {(formData.donorType === 'external') && (
//                   <div>
//                     <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                       {t('full_name') || 'Full Name'} *
//                     </label>
//                     <input
//                       type="text"
//                       value={formData.donorName}
//                       onChange={(e) => handleChange('donorName', e.target.value)}
//                       className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//                       required
//                     />
//                   </div>
//                 )}

//                 {/* Phone */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     {t('phone') || 'Phone Number'}
//                   </label>
//                   <input
//                     type="tel"
//                     value={formData.donorPhone}
//                     onChange={(e) => handleChange('donorPhone', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//                   />
//                 </div>

//                 {/* Email */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     {t('email') || 'Email'} ({t('optional') || 'Optional'})
//                   </label>
//                   <input
//                     type="email"
//                     value={formData.donorEmail}
//                     onChange={(e) => handleChange('donorEmail', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Amount */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     {t('amount') || 'Donation Amount'} *
//                   </label>
//                   <input
//                     type="number"
//                     step="0.01"
//                     min="0"
//                     value={formData.amount}
//                     onChange={(e) => handleChange('amount', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//                     required
//                   />
//                 </div>

//                 {/* Payment Method */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     {t('payment_method') || 'Payment Method'} *
//                   </label>
//                   <select
//                     value={formData.paymentMethod}
//                     onChange={(e) => handleChange('paymentMethod', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//                     required
//                   >
//                     <option value="cash">{t('cash') || 'Cash'}</option>
//                     <option value="qr">{t('qr_payment') || 'QR Payment'}</option>
//                     <option value="bank_transfer">{t('bank_transfer') || 'Bank Transfer'}</option>
//                     <option value="cheque">{t('cheque') || 'Cheque'}</option>
//                   </select>
//                 </div>

//                 {/* Category */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     {t('category') || 'Category'} *
//                   </label>
//                   <select
//                     value={formData.category}
//                     onChange={(e) => handleChange('category', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//                     required
//                   >
//                     <option value="general">{t('general') || 'General'}</option>
//                     <option value="temple">{t('temple') || 'Temple'}</option>
//                     <option value="education">{t('education') || 'Education'}</option>
//                     <option value="emergency">{t('emergency') || 'Emergency'}</option>
//                     <option value="event">{t('event') || 'Event'}</option>
//                     <option value="other">{t('other') || 'Other'}</option>
//                   </select>
//                 </div>

//                 {/* Donation Date */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     {t('donation_date') || 'Donation Date'} *
//                   </label>
//                   <input
//                     type="date"
//                     value={formData.donationDate}
//                     onChange={(e) => handleChange('donationDate', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//                     required
//                   />
//                 </div>
//               </div>

//               <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//                 {/* Payment Status */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     {t('payment_status') || 'Payment Status'} *
//                   </label>
//                   <select
//                     value={formData.paymentStatus}
//                     onChange={(e) => handleChange('paymentStatus', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//                     required
//                   >
//                     <option value="pending">{t('pending') || 'Pending'}</option>
//                     <option value="paid">{t('paid') || 'Paid'}</option>
//                   </select>
//                 </div>

//                 {/* Remarks */}
//                 <div>
//                   <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
//                     {t('remarks') || 'Remarks'}
//                   </label>
//                   <input
//                     type="text"
//                     value={formData.remarks}
//                     onChange={(e) => handleChange('remarks', e.target.value)}
//                     className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//                   />
//                 </div>
//               </div>

//               {/* Checkboxes */}
//               <div className="flex flex-wrap gap-4">
//                 <label className="flex items-center gap-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     checked={formData.isAnonymous}
//                     onChange={(e) => handleChange('isAnonymous', e.target.checked)}
//                     className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
//                   />
//                   <span className="text-sm text-gray-700 dark:text-gray-300">{t('anonymous_donation') || 'Anonymous Donation'}</span>
//                 </label>

//                 {formData.paymentMethod === 'qr' && (
//                   <label className="flex items-center gap-2 cursor-pointer">
//                     <input
//                       type="checkbox"
//                       checked={formData.qrPaymentCompleted}
//                       onChange={(e) => handleChange('qrPaymentCompleted', e.target.checked)}
//                       className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
//                     />
//                     <span className="text-sm text-gray-700 dark:text-gray-300">{t('qr_payment_completed') || 'QR Payment Completed'}</span>
//                   </label>
//                 )}
//               </div>

//               {/* Submit Buttons */}
//               <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-gray-200 dark:border-gray-700">
//                 <Button variant="outline" onClick={onClose} type="button">
//                   {t('cancel') || 'Cancel'}
//                 </Button>
//                 <Button
//                   type="submit"
//                   variant="primary"
//                   disabled={mutation.isPending}
//                 >
//                   {mutation.isPending 
//                     ? (t('saving') || 'Saving...') 
//                     : (mode === 'edit' ? (t('update_donation') || 'Update Donation') : (t('save_donation') || 'Save Donation'))
//                   }
//                 </Button>
//               </div>
//             </form>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default DonationFormModal;


// src/components/DonationFormModal.jsx - THEME REMOVED
import React, { useState, useEffect } from 'react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { createDonation, updateDonation } from '../api/donations';
import { getMembers } from '../api/members';
import Button from './Buttons';
import QRCodeDisplay from './QRCodeDisplay';
import { useLanguage } from '../context/LanguageContext';
import { XMarkIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';

const DonationFormModal = ({ isOpen, onClose, donation, mode = 'create' }) => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  
  const [formData, setFormData] = useState({
    donorType: 'external',
    donorId: '',
    donorName: '',
    donorPhone: '',
    donorEmail: '',
    amount: '',
    paymentMethod: 'cash',
    category: 'general',
    donationDate: new Date().toISOString().split('T')[0],
    remarks: '',
    isAnonymous: false,
    qrPaymentCompleted: false,
    paymentStatus: 'pending',
  });

  const [members, setMembers] = useState([]);
  const [selectedMember, setSelectedMember] = useState(null);

  useEffect(() => {
    if (donation && mode === 'edit') {
      setFormData({
        donorType: donation.donorType || 'external',
        donorId: donation.donorId?._id || donation.donorId || '',
        donorName: donation.donorName || '',
        donorPhone: donation.donorPhone || '',
        donorEmail: donation.donorEmail || '',
        amount: donation.amount || '',
        paymentMethod: donation.paymentMethod || 'cash',
        category: donation.category || 'general',
        donationDate: new Date(donation.donationDate).toISOString().split('T')[0],
        remarks: donation.remarks || '',
        isAnonymous: donation.isAnonymous || false,
        qrPaymentCompleted: donation.qrPaymentCompleted || false,
        paymentStatus: donation.paymentStatus || 'pending',
      });
      if (donation.donorId) {
        setSelectedMember(donation.donorId);
      }
    }
  }, [donation, mode]);

  useEffect(() => {
    const fetchMembers = async () => {
      try {
        const data = await getMembers({ limit: 1000 });
        setMembers(data.data || []);
      } catch (error) {
        console.error('Error fetching members:', error);
      }
    };
    if (isOpen) {
      fetchMembers();
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && mode === 'create') {
      setFormData({
        donorType: 'external',
        donorId: '',
        donorName: '',
        donorPhone: '',
        donorEmail: '',
        amount: '',
        paymentMethod: 'cash',
        category: 'general',
        donationDate: new Date().toISOString().split('T')[0],
        remarks: '',
        isAnonymous: false,
        qrPaymentCompleted: false,
        paymentStatus: 'pending',
      });
      setSelectedMember(null);
    }
  }, [isOpen, mode]);

  const mutation = useMutation({
    mutationFn: (data) => {
      if (mode === 'edit') {
        return updateDonation(donation._id, data);
      }
      return createDonation(data);
    },

    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      queryClient.invalidateQueries({ queryKey: ['donationStats'] });
      toast.success(mode === 'edit' ? t('donation_updated') || 'Donation updated' : t('donation_created') || 'Donation created');
      onClose();
    },

    onError: (error) => {
      console.log('❌ Error Response:', error.response?.data);
      toast.error(error.response?.data?.message || t('error_saving_donation') || 'Failed to save donation');
    }
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    
    const submitData = {
      ...formData,
      amount: parseFloat(formData.amount),
    };

    if (
      (formData.donorType === 'member' || formData.donorType === 'family') &&
      selectedMember
    ) {
      submitData.donorId = selectedMember;
    } else {
      delete submitData.donorId;
    }

    if (!submitData.donorEmail || submitData.donorEmail.trim() === '') {
      delete submitData.donorEmail;
    }
    if (!submitData.donorPhone || submitData.donorPhone.trim() === '') {
      delete submitData.donorPhone;
    }
    if (!submitData.remarks || submitData.remarks.trim() === '') {
      delete submitData.remarks;
    }

    console.log('📤 Submitting:', submitData);
    mutation.mutate(submitData);
  };

  const handleChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    if (field === 'donorType' && value === 'external') {
      setSelectedMember(null);
      setFormData((prev) => ({
        ...prev,
        donorId: '',
        donorName: '',
        donorPhone: '',
        donorEmail: '',
      }));
    }
  };

  useEffect(() => {
    const handleEsc = (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleEsc);
    return () => window.removeEventListener('keydown', handleEsc);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div 
      className="fixed inset-0 z-50 overflow-y-auto bg-black/40 backdrop-blur-sm flex items-center justify-center p-4"
      onClick={(e) => {
        if (e.target === e.currentTarget) onClose();
      }}
    >
      <div className="bg-white/95 backdrop-blur-md rounded-2xl w-full max-w-6xl mx-auto max-h-[90vh] overflow-y-auto shadow-2xl border border-white/20">
        {/* Header */}
        <div className="flex justify-between items-center p-4 md:p-6 border-b border-gray-200 sticky top-0 bg-white/80 backdrop-blur-sm z-10 rounded-t-2xl">
          <h2 className="text-xl md:text-2xl font-bold text-gray-900">
            {mode === 'edit' ? t('edit_donation') || 'Edit Donation' : t('add_donation') || 'Add New Donation'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            aria-label="Close"
          >
            <XMarkIcon className="h-6 w-6 text-gray-500" />
          </button>
        </div>

        {/* Body */}
        <div className="p-4 md:p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* QR Code Display */}
            <div className="lg:col-span-1 order-2 lg:order-1">
              <QRCodeDisplay />
            </div>

            {/* Donation Form */}
            <form onSubmit={handleSubmit} className="lg:col-span-2 order-1 lg:order-2 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('donor_type') || 'Donor Type'} *
                  </label>
                  <select
                    value={formData.donorType}
                    onChange={(e) => handleChange('donorType', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                    required
                  >
                    <option value="member">{t('member') || 'Member'}</option>
                    <option value="family">{t('family') || 'Family'}</option>
                    <option value="external">{t('external_donor') || 'External Donor'}</option>
                  </select>
                </div>

                {(formData.donorType === 'member' || formData.donorType === 'family') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('select') || 'Select'} {formData.donorType === 'member' ? t('member') : t('family_member')} *
                    </label>
                    <select
                      value={selectedMember || ''}
                      onChange={(e) => {
                        const memberId = e.target.value;
                        setSelectedMember(memberId);
                        const member = members.find(m => m._id === memberId);
                        if (member) {
                          setFormData((prev) => ({
                            ...prev,
                            donorName: member.name,
                            donorPhone: member.phone || '',
                            donorEmail: member.email || '',
                          }));
                        }
                      }}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                      required
                    >
                      <option value="">{t('select') || 'Select'} {formData.donorType}</option>
                      {members.map((member) => (
                        <option key={member._id} value={member._id}>
                          {member.name} {member.phone ? `(${member.phone})` : ''}
                          {formData.donorType === 'family' && member.familyName ? ` - ${member.familyName}` : ''}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {(formData.donorType === 'external') && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      {t('full_name') || 'Full Name'} *
                    </label>
                    <input
                      type="text"
                      value={formData.donorName}
                      onChange={(e) => handleChange('donorName', e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                      required
                    />
                  </div>
                )}

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('phone') || 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    value={formData.donorPhone}
                    onChange={(e) => handleChange('donorPhone', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('email') || 'Email'} ({t('optional') || 'Optional'})
                  </label>
                  <input
                    type="email"
                    value={formData.donorEmail}
                    onChange={(e) => handleChange('donorEmail', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('amount') || 'Donation Amount'} *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    value={formData.amount}
                    onChange={(e) => handleChange('amount', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('payment_method') || 'Payment Method'} *
                  </label>
                  <select
                    value={formData.paymentMethod}
                    onChange={(e) => handleChange('paymentMethod', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                    required
                  >
                    <option value="cash">{t('cash') || 'Cash'}</option>
                    <option value="qr">{t('qr_payment') || 'QR Payment'}</option>
                    <option value="bank_transfer">{t('bank_transfer') || 'Bank Transfer'}</option>
                    <option value="cheque">{t('cheque') || 'Cheque'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('category') || 'Category'} *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => handleChange('category', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                    required
                  >
                    <option value="general">{t('general') || 'General'}</option>
                    <option value="temple">{t('temple') || 'Temple'}</option>
                    <option value="education">{t('education') || 'Education'}</option>
                    <option value="emergency">{t('emergency') || 'Emergency'}</option>
                    <option value="event">{t('event') || 'Event'}</option>
                    <option value="other">{t('other') || 'Other'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('donation_date') || 'Donation Date'} *
                  </label>
                  <input
                    type="date"
                    value={formData.donationDate}
                    onChange={(e) => handleChange('donationDate', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('payment_status') || 'Payment Status'} *
                  </label>
                  <select
                    value={formData.paymentStatus}
                    onChange={(e) => handleChange('paymentStatus', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                    required
                  >
                    <option value="pending">{t('pending') || 'Pending'}</option>
                    <option value="paid">{t('paid') || 'Paid'}</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    {t('remarks') || 'Remarks'}
                  </label>
                  <input
                    type="text"
                    value={formData.remarks}
                    onChange={(e) => handleChange('remarks', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent bg-white text-gray-900"
                  />
                </div>
              </div>

              <div className="flex flex-wrap gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.isAnonymous}
                    onChange={(e) => handleChange('isAnonymous', e.target.checked)}
                    className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                  />
                  <span className="text-sm text-gray-700">{t('anonymous_donation') || 'Anonymous Donation'}</span>
                </label>

                {formData.paymentMethod === 'qr' && (
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.qrPaymentCompleted}
                      onChange={(e) => handleChange('qrPaymentCompleted', e.target.checked)}
                      className="w-4 h-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
                    />
                    <span className="text-sm text-gray-700">{t('qr_payment_completed') || 'QR Payment Completed'}</span>
                  </label>
                )}
              </div>

              <div className="flex flex-wrap justify-end gap-3 pt-4 border-t border-gray-200">
                <Button variant="outline" onClick={onClose} type="button">
                  {t('cancel') || 'Cancel'}
                </Button>
                <Button
                  type="submit"
                  variant="primary"
                  disabled={mutation.isPending}
                >
                  {mutation.isPending 
                    ? (t('saving') || 'Saving...') 
                    : (mode === 'edit' ? (t('update_donation') || 'Update Donation') : (t('save_donation') || 'Save Donation'))
                  }
                </Button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DonationFormModal;