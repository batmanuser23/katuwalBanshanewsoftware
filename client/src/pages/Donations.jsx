// // src/pages/Donation.jsx - COMPLETE UPDATED VERSION
// import { useState, useEffect } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { getDonations, deleteDonation, exportAllDonations, getDonationStats } from '../api/donations';
// import Table from '../components/Tablee';
// import Button from '../components/Buttons';
// import DonationStats from '../components/DonationStats';
// import DonationFilters from '../components/DonationFilters';
// import DonationFormModal from '../components/DonationFormModal';
// import QRCodeDisplay from '../components/QRCodeDisplay';
// import { PlusIcon, ArrowDownTrayIcon, DocumentArrowDownIcon, PrinterIcon } from '@heroicons/react/24/outline';
// import { useLanguage } from '../context/LanguageContext';
// import { useTheme } from '../context/ThemeContext';
// import toast from 'react-hot-toast';

// const Donations = () => {
//   const queryClient = useQueryClient();
//   const { t } = useLanguage();
//   const { theme } = useTheme();
//   const [page, setPage] = useState(1);
//   const [filters, setFilters] = useState({
//     search: '',
//     paymentMethod: '',
//     category: '',
//     paymentStatus: '',
//     startDate: '',
//     endDate: '',
//     minAmount: '',
//     maxAmount: '',
//   });
//   const [isFormOpen, setIsFormOpen] = useState(false);
//   const [selectedDonation, setSelectedDonation] = useState(null);
//   const [formMode, setFormMode] = useState('create');

//   // Fetch donations with filters
//   const { data, isLoading, refetch } = useQuery({
//     queryKey: ['donations', page, filters],
//     queryFn: () => getDonations({ page, limit: 10, ...filters }),
//     keepPreviousData: true,
//   });

//   // Fetch donation statistics
//   const { data: statsData, isLoading: statsLoading } = useQuery({
//     queryKey: ['donationStats'],
//     queryFn: getDonationStats,
//     refetchInterval: 30000,
//   });

//   // Delete mutation
//   const deleteMutation = useMutation({
//     mutationFn: deleteDonation,
//     onSuccess: () => {
//       queryClient.invalidateQueries({ queryKey: ['donations'] });
//       queryClient.invalidateQueries({ queryKey: ['donationStats'] });
//       toast.success(t('donation_deleted') || 'Donation deleted successfully');
//     },
//     onError: () => {
//       toast.error(t('error_deleting_donation') || 'Failed to delete donation');
//     }
//   });

//   // Export all donations
//   const handleExportAll = async () => {
//     try {
//       const blob = await exportAllDonations();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `donations_${new Date().toISOString().split('T')[0]}.xlsx`;
//       link.click();
//       window.URL.revokeObjectURL(url);
//       toast.success(t('export_success') || 'Export successful');
//     } catch (error) {
//       console.error('Error exporting donations:', error);
//       toast.error(t('export_failed') || 'Export failed');
//     }
//   };

//   // Print donations
//   const handlePrint = () => {
//     window.print();
//   };

//   // Export single donation
//   const handleExportSingle = async (donation) => {
//     try {
//       const response = await fetch(`/api/donations/export/${donation._id}`, {
//         headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
//       });
//       const blob = await response.blob();
//       const url = window.URL.createObjectURL(blob);
//       const link = document.createElement('a');
//       link.href = url;
//       link.download = `donation_${donation.receiptNumber}.xlsx`;
//       link.click();
//       window.URL.revokeObjectURL(url);
//       toast.success(t('export_success') || 'Export successful');
//     } catch (error) {
//       console.error('Error exporting donation:', error);
//       toast.error(t('export_failed') || 'Export failed');
//     }
//   };

//   const handleEdit = (donation) => {
//     setSelectedDonation(donation);
//     setFormMode('edit');
//     setIsFormOpen(true);
//   };

//   const handleDelete = (donation) => {
//     if (window.confirm(t('confirm_delete') || `Are you sure you want to delete donation ${donation.receiptNumber}?`)) {
//       deleteMutation.mutate(donation._id);
//     }
//   };

//   const handleAddNew = () => {
//     setSelectedDonation(null);
//     setFormMode('create');
//     setIsFormOpen(true);
//   };

//   const handleFilterChange = (newFilters) => {
//     setFilters(newFilters);
//     setPage(1);
//   };

//   const handleSearch = (searchTerm) => {
//     setFilters((prev) => ({ ...prev, search: searchTerm }));
//     setPage(1);
//   };

//   const columns = [
//     {
//       key: 'receiptNumber',
//       label: t('receipt') || 'Receipt #',
//       render: (value) => (
//         <span className="font-mono text-sm font-medium text-gray-900 dark:text-gray-100">
//           {value}
//         </span>
//       ),
//     },
//     {
//       key: 'donorName',
//       label: t('donor') || 'Donor',
//       render: (value, row) => (
//         <div>
//           <div className="font-medium text-gray-900 dark:text-gray-100">{value}</div>
//           <div className="text-xs text-gray-500 dark:text-gray-400">{row.donorPhone || t('no_phone') || 'No phone'}</div>
//         </div>
//       ),
//     },
//     {
//       key: 'amount',
//       label: t('amount') || 'Amount',
//       render: (value) => (
//         <span className="font-semibold text-green-600 dark:text-green-400">
//           Rs. {value?.toFixed(2) || '0.00'}
//         </span>
//       ),
//     },
//     {
//       key: 'paymentMethod',
//       label: t('payment_method') || 'Payment',
//       render: (value) => {
//         const colors = {
//           qr: 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300',
//           cash: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
//           bank_transfer: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
//           cheque: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
//         };
//         const labels = {
//           qr: 'QR',
//           cash: t('cash') || 'Cash',
//           bank_transfer: t('bank') || 'Bank',
//           cheque: t('cheque') || 'Cheque',
//         };
//         return (
//           <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[value] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
//             {labels[value] || value}
//           </span>
//         );
//       },
//     },
//     {
//       key: 'category',
//       label: t('category') || 'Category',
//       render: (value) => (
//         <span className="text-sm capitalize dark:text-gray-300">{value || t('general') || 'General'}</span>
//       ),
//     },
//     {
//       key: 'donationDate',
//       label: t('date') || 'Date',
//       render: (value) => new Date(value).toLocaleDateString(),
//     },
//     {
//       key: 'paymentStatus',
//       label: t('status') || 'Status',
//       render: (value) => {
//         const colors = {
//           paid: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
//           pending: 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300',
//           failed: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
//         };
//         const labels = {
//           paid: t('paid') || 'Paid',
//           pending: t('pending') || 'Pending',
//           failed: t('failed') || 'Failed',
//         };
//         return (
//           <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[value] || 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300'}`}>
//             {labels[value] || value || t('pending') || 'Pending'}
//           </span>
//         );
//       },
//     },
//     {
//       key: 'actions',
//       label: t('actions') || 'Actions',
//       render: (_, row) => (
//         <div className="flex items-center gap-2">
//           <button
//             onClick={() => handleExportSingle(row)}
//             className="p-1 text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
//             title={t('export_excel') || 'Export to Excel'}
//           >
//             <DocumentArrowDownIcon className="h-4 w-4" />
//           </button>
//           <button
//             onClick={() => handleEdit(row)}
//             className="p-1 text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300"
//           >
//             {t('edit') || 'Edit'}
//           </button>
//           <button
//             onClick={() => handleDelete(row)}
//             className="p-1 text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300"
//           >
//             {t('delete') || 'Delete'}
//           </button>
//         </div>
//       ),
//     },
//   ];

//   // Print styles
//   const printStyles = `
//     @media print {
//       .no-print { display: none !important; }
//       .print-only { display: block !important; }
//       .print-table { width: 100%; border-collapse: collapse; }
//       .print-table th, .print-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
//       .print-table th { background-color: #f2f2f2; }
//     }
//   `;

//   return (
//     <div className="space-y-6">
//       {/* Print Styles */}
//       <style>{printStyles}</style>

//       {/* Header */}
//       <div className="flex flex-wrap justify-between items-center gap-4 no-print">
//         <div>
//           <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{t('donations') || 'Donations'}</h1>
//           <p className="text-gray-600 dark:text-gray-400">{t('track_donations') || 'Track and manage all donations'}</p>
//         </div>
//         <div className="flex gap-2 flex-wrap">
//           <Button variant="outline" onClick={handlePrint}>
//             <PrinterIcon className="h-4 w-4 mr-1" />
//             {t('print') || 'Print'}
//           </Button>
//           <Button variant="outline" onClick={handleExportAll}>
//             <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
//             {t('export_all') || 'Export All'}
//           </Button>
//           <Button variant="primary" onClick={handleAddNew}>
//             <PlusIcon className="h-4 w-4 mr-1" />
//             {t('add_donation') || 'Add Donation'}
//           </Button>
//         </div>
//       </div>

//       {/* Print Header */}
//       <div className="hidden print-only text-center mb-6">
//         <h1 className="text-2xl font-bold">{t('donation_report') || 'Donation Report'}</h1>
//         <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
//         <hr className="my-4" />
//       </div>

//       {/* Statistics Cards */}
//       <DonationStats stats={statsData} isLoading={statsLoading} />

//       {/* QR Code Display */}
//       <QRCodeDisplay />

//       {/* Filters */}
//       <DonationFilters
//         filters={filters}
//         onFilterChange={handleFilterChange}
//         onSearch={handleSearch}
//       />

//       {/* Donation Table */}
//       <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
//         <Table
//           columns={columns}
//           data={data?.data || []}
//           loading={isLoading}
//           pagination={{
//             currentPage: data?.pagination?.page || 1,
//             totalPages: data?.pagination?.pages || 1,
//             onPageChange: setPage,
//           }}
//           emptyMessage={t('no_donations') || 'No donations found. Start by adding your first donation!'}
//         />
//       </div>

//       {/* Donation Form Modal */}
//       <DonationFormModal
//         isOpen={isFormOpen}
//         onClose={() => setIsFormOpen(false)}
//         donation={selectedDonation}
//         mode={formMode}
//       />
//     </div>
//   );
// };

// export default Donations;

// src/pages/Donation.jsx - THEME REMOVED
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDonations, deleteDonation, exportAllDonations, getDonationStats } from '../api/donations';
import Table from '../components/Tablee';
import Button from '../components/Buttons';
import DonationStats from '../components/DonationStats';
import DonationFilters from '../components/DonationFilters';
import DonationFormModal from '../components/DonationFormModal';
import QRCodeDisplay from '../components/QRCodeDisplay';
import { PlusIcon, ArrowDownTrayIcon, DocumentArrowDownIcon, PrinterIcon } from '@heroicons/react/24/outline';
import { useLanguage } from '../context/LanguageContext';
import toast from 'react-hot-toast';

const Donations = () => {
  const queryClient = useQueryClient();
  const { t } = useLanguage();
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState({
    search: '',
    paymentMethod: '',
    category: '',
    paymentStatus: '',
    startDate: '',
    endDate: '',
    minAmount: '',
    maxAmount: '',
  });
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedDonation, setSelectedDonation] = useState(null);
  const [formMode, setFormMode] = useState('create');

  const { data, isLoading } = useQuery({
    queryKey: ['donations', page, filters],
    queryFn: () => getDonations({ page, limit: 10, ...filters }),
    keepPreviousData: true,
  });

  const { data: statsData, isLoading: statsLoading } = useQuery({
    queryKey: ['donationStats'],
    queryFn: getDonationStats,
    refetchInterval: 30000,
  });

  const deleteMutation = useMutation({
    mutationFn: deleteDonation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['donations'] });
      queryClient.invalidateQueries({ queryKey: ['donationStats'] });
      toast.success(t('donation_deleted') || 'Donation deleted successfully');
    },
    onError: () => {
      toast.error(t('error_deleting_donation') || 'Failed to delete donation');
    }
  });

  const handleExportAll = async () => {
    try {
      const blob = await exportAllDonations();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `donations_${new Date().toISOString().split('T')[0]}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success(t('export_success') || 'Export successful');
    } catch (error) {
      console.error('Error exporting donations:', error);
      toast.error(t('export_failed') || 'Export failed');
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleExportSingle = async (donation) => {
    try {
      const response = await fetch(`/api/donations/export/${donation._id}`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `donation_${donation.receiptNumber}.xlsx`;
      link.click();
      window.URL.revokeObjectURL(url);
      toast.success(t('export_success') || 'Export successful');
    } catch (error) {
      console.error('Error exporting donation:', error);
      toast.error(t('export_failed') || 'Export failed');
    }
  };

  const handleEdit = (donation) => {
    setSelectedDonation(donation);
    setFormMode('edit');
    setIsFormOpen(true);
  };

  const handleDelete = (donation) => {
    if (window.confirm(t('confirm_delete') || `Are you sure you want to delete donation ${donation.receiptNumber}?`)) {
      deleteMutation.mutate(donation._id);
    }
  };

  const handleAddNew = () => {
    setSelectedDonation(null);
    setFormMode('create');
    setIsFormOpen(true);
  };

  const handleFilterChange = (newFilters) => {
    setFilters(newFilters);
    setPage(1);
  };

  const handleSearch = (searchTerm) => {
    setFilters((prev) => ({ ...prev, search: searchTerm }));
    setPage(1);
  };

  const columns = [
    {
      key: 'receiptNumber',
      label: t('receipt') || 'Receipt #',
      render: (value) => (
        <span className="font-mono text-sm font-medium text-gray-900">{value}</span>
      ),
    },
    {
      key: 'donorName',
      label: t('donor') || 'Donor',
      render: (value, row) => (
        <div>
          <div className="font-medium text-gray-900">{value}</div>
          <div className="text-xs text-gray-500">{row.donorPhone || t('no_phone') || 'No phone'}</div>
        </div>
      ),
    },
    {
      key: 'amount',
      label: t('amount') || 'Amount',
      render: (value) => (
        <span className="font-semibold text-green-600">Rs. {value?.toFixed(2) || '0.00'}</span>
      ),
    },
    {
      key: 'paymentMethod',
      label: t('payment_method') || 'Payment',
      render: (value) => {
        const colors = {
          qr: 'bg-purple-100 text-purple-800',
          cash: 'bg-green-100 text-green-800',
          bank_transfer: 'bg-blue-100 text-blue-800',
          cheque: 'bg-yellow-100 text-yellow-800',
        };
        const labels = {
          qr: 'QR',
          cash: t('cash') || 'Cash',
          bank_transfer: t('bank') || 'Bank',
          cheque: t('cheque') || 'Cheque',
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[value] || 'bg-gray-100 text-gray-800'}`}>
            {labels[value] || value}
          </span>
        );
      },
    },
    {
      key: 'category',
      label: t('category') || 'Category',
      render: (value) => (
        <span className="text-sm capitalize">{value || t('general') || 'General'}</span>
      ),
    },
    {
      key: 'donationDate',
      label: t('date') || 'Date',
      render: (value) => new Date(value).toLocaleDateString(),
    },
    {
      key: 'paymentStatus',
      label: t('status') || 'Status',
      render: (value) => {
        const colors = {
          paid: 'bg-green-100 text-green-800',
          pending: 'bg-yellow-100 text-yellow-800',
          failed: 'bg-red-100 text-red-800',
        };
        const labels = {
          paid: t('paid') || 'Paid',
          pending: t('pending') || 'Pending',
          failed: t('failed') || 'Failed',
        };
        return (
          <span className={`px-2 py-1 text-xs font-medium rounded-full ${colors[value] || 'bg-gray-100 text-gray-800'}`}>
            {labels[value] || value || t('pending') || 'Pending'}
          </span>
        );
      },
    },
    {
      key: 'actions',
      label: t('actions') || 'Actions',
      render: (_, row) => (
        <div className="flex items-center gap-2">
          <button
            onClick={() => handleExportSingle(row)}
            className="p-1 text-blue-600 hover:text-blue-800"
            title={t('export_excel') || 'Export to Excel'}
          >
            <DocumentArrowDownIcon className="h-4 w-4" />
          </button>
          <button
            onClick={() => handleEdit(row)}
            className="p-1 text-indigo-600 hover:text-indigo-800"
          >
            {t('edit') || 'Edit'}
          </button>
          <button
            onClick={() => handleDelete(row)}
            className="p-1 text-red-600 hover:text-red-800"
          >
            {t('delete') || 'Delete'}
          </button>
        </div>
      ),
    },
  ];

  const printStyles = `
    @media print {
      .no-print { display: none !important; }
      .print-only { display: block !important; }
      .print-table { width: 100%; border-collapse: collapse; }
      .print-table th, .print-table td { border: 1px solid #ddd; padding: 8px; text-align: left; }
      .print-table th { background-color: #f2f2f2; }
    }
  `;

  return (
    <div className="space-y-6">
      <style>{printStyles}</style>

      <div className="flex flex-wrap justify-between items-center gap-4 no-print">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{t('donations') || 'Donations'}</h1>
          <p className="text-gray-600">{t('track_donations') || 'Track and manage all donations'}</p>
        </div>
        <div className="flex gap-2 flex-wrap">
          <Button variant="outline" onClick={handlePrint}>
            <PrinterIcon className="h-4 w-4 mr-1" />
            {t('print') || 'Print'}
          </Button>
          <Button variant="outline" onClick={handleExportAll}>
            <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
            {t('export_all') || 'Export All'}
          </Button>
          <Button variant="primary" onClick={handleAddNew}>
            <PlusIcon className="h-4 w-4 mr-1" />
            {t('add_donation') || 'Add Donation'}
          </Button>
        </div>
      </div>

      <div className="hidden print-only text-center mb-6">
        <h1 className="text-2xl font-bold">{t('donation_report') || 'Donation Report'}</h1>
        <p className="text-gray-600">{new Date().toLocaleDateString()}</p>
        <hr className="my-4" />
      </div>

      <DonationStats stats={statsData} isLoading={statsLoading} />
      <QRCodeDisplay />
      <DonationFilters filters={filters} onFilterChange={handleFilterChange} onSearch={handleSearch} />

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <Table
          columns={columns}
          data={data?.data || []}
          loading={isLoading}
          pagination={{
            currentPage: data?.pagination?.page || 1,
            totalPages: data?.pagination?.pages || 1,
            onPageChange: setPage,
          }}
          emptyMessage={t('no_donations') || 'No donations found. Start by adding your first donation!'}
        />
      </div>

      <DonationFormModal
        isOpen={isFormOpen}
        onClose={() => setIsFormOpen(false)}
        donation={selectedDonation}
        mode={formMode}
      />
    </div>
  );
};

export default Donations;