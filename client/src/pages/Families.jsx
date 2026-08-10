// src/pages/Families.jsx - UPDATED
import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFamilies, closeFamily, reopenFamily } from '../api/families';
import { getMembers } from '../api/members';
import FamilyCard from '../components/FamilyCard';
import Modal from '../components/Modal';
import FamilyTreeView from '../components/FamilyTreeView';
import Button from '../components/Button';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { FaHome, FaPlus } from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Families = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [isTreeModalOpen, setIsTreeModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ['families', page, search],
    queryFn: () => getFamilies({ page, limit: 10, search }),
  });

  // Fetch members for each family
  const { data: membersData } = useQuery({
    queryKey: ['members-family-tree'],
    queryFn: () => getMembers({ limit: 10000 }),
  });

  const closeMutation = useMutation({
    mutationFn: ({ id, reason }) => closeFamily(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
      toast.success('Family closed successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to close family');
    },
  });

  const reopenMutation = useMutation({
    mutationFn: (id) => reopenFamily(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
      toast.success('Family reopened successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to reopen family');
    },
  });

  const getFamilyMemberCount = (familyId) => {
    if (!membersData?.data) return 0;
    return membersData.data.filter(m => m.family?._id === familyId || m.family === familyId).length;
  };

  const getFamilyGenerations = (familyId) => {
    if (!membersData?.data) return 0;
    const gens = new Set();
    membersData.data
      .filter(m => m.family?._id === familyId || m.family === familyId)
      .forEach(m => {
        if (m.generation) gens.add(m.generation);
      });
    return gens.size;
  };

  const handleViewTree = (family) => {
    setSelectedFamily(family);
    setIsTreeModalOpen(true);
  };

  const handleViewDetails = (family) => {
    setSelectedFamily(family);
    setIsDetailsModalOpen(true);
  };

  const handleCloseFamily = (family) => {
    const reason = window.prompt('Enter reason for closing this family:');
    if (reason !== null) {
      closeMutation.mutate({ id: family._id, reason });
    }
  };

  const handleReopenFamily = (family) => {
    if (window.confirm('Are you sure you want to reopen this family?')) {
      reopenMutation.mutate(family._id);
    }
  };

  const handleAddFamily = () => {
    navigate('/data-entry/family');
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaHome className="text-green-500" />
            Families
          </h1>
          <p className="text-gray-600">Manage all families and their details</p>
        </div>
        <Button variant="primary" onClick={handleAddFamily} className="flex items-center">
          <FaPlus className="mr-2" />
          Add Family
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="Search by Family Name, Number, Vansha/Generation..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Family Grid */}
      {isLoading ? (
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
      ) : data?.data?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FaHome className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No families found</p>
          <p className="text-sm text-gray-400">Try adjusting your search or add a new family</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((family) => (
            <FamilyCard
              key={family._id}
              family={family}
              memberCount={getFamilyMemberCount(family._id)}
              generationCount={getFamilyGenerations(family._id)}
              onViewTree={() => handleViewTree(family)}
              onViewDetails={() => handleViewDetails(family)}
              onClose={() => handleCloseFamily(family)}
              onReopen={() => handleReopenFamily(family)}
              isAdmin={true}
            />
          ))}
        </div>
      )}

      {/* Tree Modal */}
      <Modal
        isOpen={isTreeModalOpen}
        onClose={() => {
          setIsTreeModalOpen(false);
          setSelectedFamily(null);
        }}
        title={`Family Tree - ${selectedFamily?.familyName || ''}`}
        size="xl"
      >
        {selectedFamily && (
          <div className="min-h-[400px] max-h-[75vh] overflow-auto">
            <FamilyTreeView 
              familyId={selectedFamily._id}
              onMemberClick={(member) => {
                navigate(`/profile/${member._id}`);
              }}
            />
          </div>
        )}
      </Modal>

      {/* Details Modal */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedFamily(null);
        }}
        title="Family Details"
        size="lg"
      >
        {selectedFamily && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Family Name</p>
                <p className="font-medium">{selectedFamily.familyName}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Family Number</p>
                <p className="font-medium">{selectedFamily.familyNumber}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">House</p>
                <p className="font-medium">
                  {selectedFamily.house?.houseNumber || 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Vansha/Generation</p>
                <p className="font-medium">{selectedFamily.vanshaGenerationNumber || 'N/A'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Total Members</p>
                <p className="font-medium">{getFamilyMemberCount(selectedFamily._id)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Generations</p>
                <p className="font-medium">{getFamilyGenerations(selectedFamily._id)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">Status</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedFamily.status === 'closed' 
                    ? 'bg-gray-100 text-gray-600' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {selectedFamily.status?.toUpperCase() || 'OPEN'}
                </span>
              </div>
              {selectedFamily.familyHead && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">Family Head</p>
                  <p className="font-medium">
                    {typeof selectedFamily.familyHead === 'object' 
                      ? selectedFamily.familyHead.name 
                      : selectedFamily.familyHead}
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Families;