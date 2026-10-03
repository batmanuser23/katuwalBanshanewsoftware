// src/pages/Members.jsx - COMPLETE UPDATED
// Key changes:
// - Removed rollNumber column
// - Added vanshaGenerationNumber, lineageRole, childBirthOrder columns
// - Member ID (M0001 format) shown
// - All existing functionality preserved

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getMembers, deleteMember, exportAllMembers } from '../api/members';
import Table from '../components/Table';
import Button from '../components/Button';
import Modal from '../components/Modal';
import MemberProfile from '../components/MemberProfile';
import { MagnifyingGlassIcon, FunnelIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline';
import toast from 'react-hot-toast';
import MemberForm from "../pages/DataEntry";

const Members = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [filters, setFilters] = useState({
    gender: '',
    status: '',
    generation: '',
    verificationStatus: '',
    family: '',
    district: '',
    province: '',
    house: '',
    vanshaGenerationNumber: '',
    lineageRole: '',
  });
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [editingMember, setEditingMember] = useState(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [exporting, setExporting] = useState(false);
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['members', page, search, filters],
    queryFn: () => getMembers({ 
      page, 
      limit: 10, 
      search,
      ...filters 
    }),
  });

  const deleteMutation = useMutation({
    mutationFn: deleteMember,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      toast.success('Member deleted successfully');
    },
  });

  const handleDelete = (id) => {
    if (window.confirm('Are you sure you want to delete this member?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleView = (member) => {
    setSelectedMember(member);
    setIsProfileOpen(true);
  };

  const handleEdit = (member) => {
    setEditingMember(member);
    setIsEditModalOpen(true);
  };

  const handlePrint = (member) => {
    window.open(`/profile/${member._id}/print`, '_blank');
  };

  const handleExport = async () => {
    setExporting(true);
    try {
      const blob = await exportAllMembers({
        ...filters,
        search,
      });
      
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `Members_${new Date().toISOString().split('T')[0]}.xlsx`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
      
      toast.success('Members exported successfully');
    } catch (error) {
      console.error('Export error:', error);
      toast.error('Failed to export members');
    } finally {
      setExporting(false);
    }
  };

  // ⭐ UPDATED: Columns — rollNumber removed, vanshaGenerationNumber added
  const columns = [
    { key: 'photo', label: 'Photo', type: 'image' },
    { key: 'memberNumber', label: 'Member ID' },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'houseNumber', label: 'House No.' },
    { key: 'familyNumber', label: 'Family No.' },
    { key: 'vanshaGenerationNumber', label: 'Vanshaj No.' },
    { key: 'generation', label: 'Gen' },
    { key: 'lineageRole', label: 'Lineage Role', 
      render: (value) => {
        const roles = {
          'lineage_head': 'घरमुली',
          'lineage_member': 'सदस्य',
          'spouse': 'श्रीमान/श्रीमती',
          'other': 'अन्य'
        };
        return roles[value] || value || 'N/A';
      }
    },
    { key: 'childBirthOrder', label: 'Birth Order' },
    { key: 'gender', label: 'Gender' },
    { key: 'phone', label: 'Phone' },
    { key: 'email', label: 'Email' },
    { key: 'isAlive', label: 'Status', type: 'status' },
    { key: 'verificationStatus', label: 'Verification', type: 'verification' },
  ];

  const handleResetFilters = () => {
    setFilters({
      gender: '',
      status: '',
      generation: '',
      verificationStatus: '',
      family: '',
      district: '',
      province: '',
      house: '',
      vanshaGenerationNumber: '',
      lineageRole: '',
    });
    setSearch('');
    setPage(1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Members</h1>
          <p className="text-gray-600">View and manage all family members</p>
        </div>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            onClick={handleExport}
            disabled={exporting}
            className="flex items-center"
          >
            <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
            {exporting ? 'Exporting...' : 'Export All'}
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
            className="flex items-center"
          >
            <FunnelIcon className="h-5 w-5 mr-2" />
            Filter
          </Button>
          {isFilterOpen && (
            <Button
              variant="ghost"
              onClick={handleResetFilters}
              className="text-sm"
            >
              Reset
            </Button>
          )}
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Search by Name, Member ID, Vanshaj No., Phone, House Number..."
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
            />
          </div>
        </div>

        {isFilterOpen && (
          <div className="p-4 border-b border-gray-200 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 bg-gray-50">
            <select
              value={filters.gender}
              onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Genders</option>
              <option value="male">Male</option>
              <option value="female">Female</option>
              <option value="other">Other</option>
            </select>
            
            <select
              value={filters.status}
              onChange={(e) => setFilters({ ...filters, status: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="deceased">Deceased</option>
            </select>

            <select
              value={filters.generation}
              onChange={(e) => setFilters({ ...filters, generation: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Generations</option>
              {[1,2,3,4,5,6,7,8,9,10].map(gen => (
                <option key={gen} value={gen}>Generation {gen}</option>
              ))}
            </select>

            <select
              value={filters.verificationStatus}
              onChange={(e) => setFilters({ ...filters, verificationStatus: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Verification</option>
              <option value="verified">Verified</option>
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
            </select>

            <input
              type="text"
              placeholder="House Number"
              value={filters.house}
              onChange={(e) => setFilters({ ...filters, house: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <input
              type="text"
              placeholder="Vanshaj Number"
              value={filters.vanshaGenerationNumber}
              onChange={(e) => setFilters({ ...filters, vanshaGenerationNumber: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            />

            <select
              value={filters.lineageRole}
              onChange={(e) => setFilters({ ...filters, lineageRole: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Lineage Roles</option>
              <option value="lineage_head">Lineage Head</option>
              <option value="lineage_member">Lineage Member</option>
              <option value="spouse">Spouse</option>
              <option value="other">Other</option>
            </select>

            <select
              value={filters.district}
              onChange={(e) => setFilters({ ...filters, district: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Districts</option>
              <option value="Kathmandu">Kathmandu</option>
              <option value="Lalitpur">Lalitpur</option>
              <option value="Bhaktapur">Bhaktapur</option>
            </select>

            <select
              value={filters.province}
              onChange={(e) => setFilters({ ...filters, province: e.target.value })}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
            >
              <option value="">All Provinces</option>
              <option value="1">Province 1</option>
              <option value="2">Province 2</option>
              <option value="3">Province 3</option>
              <option value="4">Province 4</option>
              <option value="5">Province 5</option>
              <option value="6">Province 6</option>
              <option value="7">Province 7</option>
            </select>
          </div>
        )}

        <Table
          columns={columns}
          data={data?.data || []}
          loading={isLoading}
          onView={handleView}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onPrint={handlePrint}
          pagination={{
            currentPage: data?.pagination?.page || 1,
            totalPages: data?.pagination?.pages || 1,
            onPageChange: setPage,
          }}
        />
      </div>

      <Modal
        isOpen={isProfileOpen}
        onClose={() => {
          setIsProfileOpen(false);
          setSelectedMember(null);
        }}
        title="Member Profile"
        size="xl"
      >
        {selectedMember && <MemberProfile member={selectedMember} />}
      </Modal>

      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingMember(null);
        }}
        title="Edit Member"
        size="xl"
      >
        <MemberForm
          member={editingMember}
          onSuccess={() => {
            setIsEditModalOpen(false);
            setEditingMember(null);
            queryClient.invalidateQueries({ queryKey: ['members'] });
            queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
            toast.success('Member updated successfully');
          }}
          onCancel={() => {
            setIsEditModalOpen(false);
            setEditingMember(null);
          }}
        />
      </Modal>
    </div>
  );
};

export default Members;