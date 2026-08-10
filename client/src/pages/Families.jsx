// src/pages/Families.jsx - UPDATED with members in details modal

import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getFamilies, closeFamily, reopenFamily } from '../api/families';
import { getMembers } from '../api/members';
import FamilyCard from '../components/FamilyCard';
import Modal from '../components/Modal';
import FamilyTreeView from '../components/FamilyTreeView';
import Button from '../components/Button';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { FaHome, FaPlus, FaUser } from 'react-icons/fa';
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

  const getFamilyMembers = (familyId) => {
    if (!membersData?.data) return [];
    return membersData.data.filter(m => m.family?._id === familyId || m.family === familyId);
  };

  const getFamilyMemberCount = (familyId) => {
    return getFamilyMembers(familyId).length;
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

  // Get relationship label in Nepali
  const getRelationshipLabel = (relationship) => {
    const labels = {
      'member': 'सदस्य',
      'spouse': 'श्रीमान/श्रीमती',
      'child': 'सन्तान',
      'parent': 'आमा/बुवा',
      'sibling': 'दाजु/भाइ/दिदी/बहिनी',
      'grandparent': 'हजुरबा/हजुरआमा',
      'grandchild': 'नाति/नातिनी',
      'other': 'अन्य'
    };
    return labels[relationship] || relationship || 'सदस्य';
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <FaHome className="text-green-500" />
            परिवारहरू
          </h1>
          <p className="text-gray-600">सबै परिवार र तिनीहरूको विवरण व्यवस्थापन गर्नुहोस्</p>
        </div>
        <Button variant="primary" onClick={handleAddFamily} className="flex items-center">
          <FaPlus className="mr-2" />
          परिवार थप्नुहोस्
        </Button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="परिवारको नाम, नम्बर, वंश/पुस्ता द्वारा खोज्नुहोस्..."
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
          <p className="text-gray-500">कुनै परिवार फेला परेन</p>
          <p className="text-sm text-gray-400">आफ्नो खोज समायोजन गर्नुहोस् वा नयाँ परिवार थप्नुहोस्</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {data?.data?.map((family) => (
            <FamilyCard
              key={family._id}
              family={family}
              memberCount={getFamilyMemberCount(family._id)}
              generationCount={getFamilyGenerations(family._id)}
              members={getFamilyMembers(family._id)}
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
        title={`पारिवारिक वृक्ष - ${selectedFamily?.familyName || ''}`}
        size="xl"
      >
        {selectedFamily && (
          <div className="min-h-[400px] max-h-[75vh] overflow-auto">
            <FamilyTreeView 
              members={getFamilyMembers(selectedFamily._id)}
              familyId={selectedFamily._id}
              onMemberClick={(member) => {
                navigate(`/profile/${member._id}`);
              }}
            />
          </div>
        )}
      </Modal>

      {/* Details Modal with Members List */}
      <Modal
        isOpen={isDetailsModalOpen}
        onClose={() => {
          setIsDetailsModalOpen(false);
          setSelectedFamily(null);
        }}
        title="परिवार विवरण"
        size="lg"
      >
        {selectedFamily && (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">परिवारको नाम</p>
                <p className="font-medium">{selectedFamily.familyName}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">परिवार नम्बर</p>
                <p className="font-medium">{selectedFamily.familyNumber}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">घर</p>
                <p className="font-medium">
                  {selectedFamily.house?.houseNumber || 'N/A'}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">वंश/पुस्ता</p>
                <p className="font-medium">{selectedFamily.vanshaGenerationNumber || 'N/A'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">कुल सदस्य</p>
                <p className="font-medium">{getFamilyMemberCount(selectedFamily._id)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">पुस्ताहरू</p>
                <p className="font-medium">{getFamilyGenerations(selectedFamily._id)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">स्थिति</p>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  selectedFamily.status === 'closed' 
                    ? 'bg-gray-100 text-gray-600' 
                    : 'bg-green-100 text-green-700'
                }`}>
                  {selectedFamily.status === 'closed' ? 'बन्द' : 'खुला'}
                </span>
              </div>
              {selectedFamily.familyHead && (
                <div className="p-3 bg-gray-50 rounded-lg">
                  <p className="text-xs text-gray-500">घरमुली</p>
                  <p className="font-medium">
                    {typeof selectedFamily.familyHead === 'object' 
                      ? selectedFamily.familyHead.name 
                      : selectedFamily.familyHead}
                  </p>
                </div>
              )}
            </div>

            {/* Members List */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaUser className="text-green-500" />
                सदस्यहरू ({getFamilyMemberCount(selectedFamily._id)})
              </h4>
              <div className="border border-gray-200 rounded-xl overflow-hidden">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">क्र.सं.</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">नाम</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">सम्बन्ध</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">पुस्ता</th>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500">स्थिति</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {getFamilyMembers(selectedFamily._id).map((member, index) => (
                      <tr key={member._id} className="hover:bg-gray-50">
                        <td className="px-4 py-2 text-xs text-gray-500">{index + 1}</td>
                        <td className="px-4 py-2 font-medium text-gray-700">{member.name}</td>
                        <td className="px-4 py-2 text-gray-600">
                          {member.lineageRole === 'lineage_head' ? 'घरमुली' : 
                           getRelationshipLabel(member.relationship)}
                        </td>
                        <td className="px-4 py-2 text-gray-600">{member.generation || 'N/A'}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            member.isAlive !== false ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'
                          }`}>
                            {member.isAlive !== false ? 'जीवित' : 'मृत'}
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Families;