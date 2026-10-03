// src/pages/Families.jsx - COMPLETE UPDATED VERSION
// Key changes:
// - Simplified family form (only essential fields)
// - Family head search + manual entry
// - Manual vanshaj number
// - Total generations calculated from tree
// - House number manual input

import { useState, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  getFamilies, 
  closeFamily, 
  reopenFamily, 
  createFamily, 
  updateFamily,
  getFamilyById,
} from '../api/families';
import { getMembers, getMembersByFamily } from '../api/members';
import FamilyCard from '../components/FamilyCard';
import Modal from '../components/Modal';
import FamilyTreeView from '../components/FamilyTreeView';
import Button from '../components/Button';
import FloatingInput from '../components/FloatingInput';
import SearchableSelect from '../components/SearchableSelect';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';
import { 
  FaHome, FaPlus, FaUser, FaTimes, FaSave, FaTree, 
  FaBuilding, FaUsers, FaInfoCircle, FaUserTie 
} from 'react-icons/fa';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const Families = () => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [selectedFamily, setSelectedFamily] = useState(null);
  const [isTreeModalOpen, setIsTreeModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingFamily, setEditingFamily] = useState(null);
  const [familyMembers, setFamilyMembers] = useState([]);
  const [loadingMembers, setLoadingMembers] = useState(false);
  const [familyHeadMode, setFamilyHeadMode] = useState('select'); // 'select' or 'manual'
  
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  // ============================================================
  // SIMPLIFIED FAMILY FORM
  // ============================================================
  const initialFamilyForm = {
    familyName: '',
    houseNumber: '',
    houseName: '',
    familyHead: '',
    familyHeadName: '',
    vanshaGenerationNumber: '',
    clan: '',
    origin: '',
    currentAddress: '',
    description: '',
    status: 'open',
  };

  const [familyForm, setFamilyForm] = useState(initialFamilyForm);
  const [formErrors, setFormErrors] = useState({});

  // ============================================================
  // FETCH DATA
  // ============================================================
  const { data, isLoading } = useQuery({
    queryKey: ['families', page, search],
    queryFn: () => getFamilies({ page, limit: 12, search }),
  });

  const { data: membersData, isLoading: membersLoading } = useQuery({
    queryKey: ['members-for-families'],
    queryFn: () => getMembers({ limit: 10000 }),
  });

  // ============================================================
  // MEMBER OPTIONS FOR FAMILY HEAD
  // ============================================================
  const memberOptions = useMemo(() => {
    if (!membersData?.data) return [];
    return membersData.data.map(m => ({
      value: m._id,
      label: `${m.name}${m.surname ? ` ${m.surname}` : ''} (${m.memberNumber || 'N/A'})`,
    }));
  }, [membersData]);

  // ============================================================
  // GROUP MEMBERS BY FAMILY
  // ============================================================
  const membersByFamily = useMemo(() => {
    if (!membersData?.data) return {};
    const grouped = {};
    membersData.data.forEach(member => {
      const familyId = member.family?._id || member.family;
      if (familyId) {
        if (!grouped[familyId]) grouped[familyId] = [];
        grouped[familyId].push(member);
      }
    });
    return grouped;
  }, [membersData]);

  const getFamilyMembers = (familyId) => membersByFamily[familyId] || [];
  const getFamilyMemberCount = (familyId) => getFamilyMembers(familyId).length;

  // ============================================================
  // MUTATIONS
  // ============================================================
  const closeMutation = useMutation({
    mutationFn: ({ id, reason }) => closeFamily(id, reason),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
      toast.success('परिवार सफलतापूर्वक बन्द गरियो');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'परिवार बन्द गर्न असफल'),
  });

  const reopenMutation = useMutation({
    mutationFn: (id) => reopenFamily(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['families'] });
      toast.success('परिवार पुन: खोलियो');
    },
    onError: (error) => toast.error(error.response?.data?.message || 'परिवार पुन: खोल्न असफल'),
  });

  const createFamilyMutation = useMutation({
    mutationFn: createFamily,
    onSuccess: () => {
      toast.success('परिवार सफलतापूर्वक थपियो 🎉');
      queryClient.invalidateQueries({ queryKey: ['families'] });
      queryClient.invalidateQueries({ queryKey: ['members-for-families'] });
      setIsCreateModalOpen(false);
      resetForm();
    },
    onError: (error) => toast.error(error.response?.data?.message || 'परिवार थप्न असफल'),
  });

  const updateFamilyMutation = useMutation({
    mutationFn: ({ id, data }) => updateFamily(id, data),
    onSuccess: () => {
      toast.success('परिवार सफलतापूर्वक अद्यावधिक गरियो');
      queryClient.invalidateQueries({ queryKey: ['families'] });
      queryClient.invalidateQueries({ queryKey: ['members-for-families'] });
      setIsEditModalOpen(false);
      setEditingFamily(null);
      resetForm();
    },
    onError: (error) => toast.error(error.response?.data?.message || 'परिवार अद्यावधिक गर्न असफल'),
  });

  // ============================================================
  // RESET FORM
  // ============================================================
  const resetForm = () => {
    setFamilyForm(initialFamilyForm);
    setFormErrors({});
    setFamilyHeadMode('select');
  };

  // ============================================================
  // HANDLERS
  // ============================================================
  const handleViewTree = async (family) => {
    setSelectedFamily(family);
    setIsTreeModalOpen(true);
    setLoadingMembers(true);
    
    try {
      const response = await getMembersByFamily(family._id);
      setFamilyMembers(response.data || []);
    } catch (error) {
      console.error('Failed to load family members:', error);
      setFamilyMembers(getFamilyMembers(family._id));
    } finally {
      setLoadingMembers(false);
    }
  };

  const handleViewDetails = (family) => {
    setSelectedFamily(family);
    setIsDetailsModalOpen(true);
  };

  const handleCloseFamily = (family) => {
    const reason = window.prompt('परिवार बन्द गर्ने कारण लेख्नुहोस्:');
    if (reason !== null) {
      closeMutation.mutate({ id: family._id, reason });
    }
  };

  const handleReopenFamily = (family) => {
    if (window.confirm('के तपाईं यो परिवार पुन: खोल्न निश्चित हुनुहुन्छ?')) {
      reopenMutation.mutate(family._id);
    }
  };

  const handleAddFamily = () => {
    resetForm();
    setIsCreateModalOpen(true);
  };

  const handleEditFamily = (family) => {
    setEditingFamily(family);
    
    // Determine if family head was selected from DB or manually entered
    const hasDbHead = family.familyHead && typeof family.familyHead === 'object';
    
    setFamilyForm({
      familyName: family.familyName || '',
      houseNumber: family.house?.houseNumber || '',
      houseName: family.house?.houseName || '',
      familyHead: hasDbHead ? family.familyHead._id : '',
      familyHeadName: !hasDbHead ? (family.familyHeadName || '') : '',
      vanshaGenerationNumber: family.vanshaGenerationNumber || '',
      clan: family.clan || '',
      origin: family.origin || '',
      currentAddress: family.currentAddress || '',
      description: family.description || '',
      status: family.status || 'open',
    });
    
    setFamilyHeadMode(hasDbHead || !family.familyHeadName ? 'select' : 'manual');
    setFormErrors({});
    setIsEditModalOpen(true);
  };

  // ============================================================
  // FORM HANDLERS
  // ============================================================
  const handleFamilyFormChange = (e) => {
    const { name, value } = e.target;
    setFamilyForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleFamilySelectChange = (name, value) => {
    setFamilyForm(prev => ({ ...prev, [name]: value }));
    if (formErrors[name]) {
      setFormErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ============================================================
  // VALIDATE FORM
  // ============================================================
  const validateFamilyForm = () => {
    const errors = {};
    
    if (!familyForm.familyName?.trim()) {
      errors.familyName = 'परिवारको नाम आवश्यक छ';
    }
    
    if (!familyForm.houseNumber?.trim()) {
      errors.houseNumber = 'घर नम्बर आवश्यक छ';
    }

    // Family head validation
    if (familyHeadMode === 'select' && !familyForm.familyHead) {
      // Allow empty - not required
    }
    if (familyHeadMode === 'manual' && !familyForm.familyHeadName?.trim()) {
      // Allow empty - not required
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ============================================================
  // SUBMIT FORM
  // ============================================================
  const handleFamilySubmit = async (e) => {
    e.preventDefault();
    
    if (!validateFamilyForm()) {
      Object.values(formErrors).forEach(err => toast.error(err));
      return;
    }

    const submitData = {
      familyName: familyForm.familyName.trim(),
      houseNumber: familyForm.houseNumber.trim(),
      houseName: familyForm.houseName?.trim() || undefined,
      vanshaGenerationNumber: familyForm.vanshaGenerationNumber?.trim() || undefined,
      clan: familyForm.clan?.trim() || undefined,
      origin: familyForm.origin?.trim() || undefined,
      currentAddress: familyForm.currentAddress?.trim() || undefined,
      description: familyForm.description?.trim() || undefined,
      status: familyForm.status || 'open',
    };

    // Handle family head based on mode
    if (familyHeadMode === 'select' && familyForm.familyHead) {
      submitData.familyHead = familyForm.familyHead;
    } else if (familyHeadMode === 'manual' && familyForm.familyHeadName?.trim()) {
      submitData.familyHeadName = familyForm.familyHeadName.trim();
    }

    try {
      if (editingFamily) {
        await updateFamilyMutation.mutateAsync({
          id: editingFamily._id,
          data: submitData,
        });
      } else {
        await createFamilyMutation.mutateAsync(submitData);
      }
    } catch (error) {
      console.error('Family submit error:', error);
    }
  };

  // ============================================================
  // GET RELATIONSHIP LABEL
  // ============================================================
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

  // ============================================================
  // RENDER FORM
  // ============================================================
  const renderFamilyForm = (isEdit = false) => (
    <form onSubmit={handleFamilySubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Family Name */}
        <div className="md:col-span-2">
          <FloatingInput
            label="परिवारको नाम *"
            name="familyName"
            value={familyForm.familyName}
            onChange={handleFamilyFormChange}
            icon={FaHome}
            required
            error={formErrors.familyName}
            placeholder="जस्तै: कटवाल परिवार"
          />
        </div>

        {/* House Number */}
        <FloatingInput
          label="घर नम्बर / आँट *"
          name="houseNumber"
          value={familyForm.houseNumber}
          onChange={handleFamilyFormChange}
          icon={FaBuilding}
          required
          error={formErrors.houseNumber}
          placeholder="जस्तै: 1"
        />

        {/* House Name */}
        <FloatingInput
          label="घरको नाम"
          name="houseName"
          value={familyForm.houseName}
          onChange={handleFamilyFormChange}
          icon={FaBuilding}
          placeholder="जस्तै: मेन हाउस"
        />

        {/* Family Head - Mode Toggle */}
        <div className="md:col-span-2">
          <div className="flex items-center gap-2 mb-2">
            <label className="text-xs font-medium text-gray-700">
              घरमुली (Head of Family)
            </label>
            <div className="flex gap-1 bg-gray-100 rounded-lg p-0.5">
              <button
                type="button"
                onClick={() => setFamilyHeadMode('select')}
                className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${
                  familyHeadMode === 'select'
                    ? 'bg-white text-green-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaUser className="inline mr-0.5 text-[8px]" />
                सदस्य छान्नुहोस्
              </button>
              <button
                type="button"
                onClick={() => setFamilyHeadMode('manual')}
                className={`px-2 py-0.5 text-[10px] font-medium rounded transition-colors ${
                  familyHeadMode === 'manual'
                    ? 'bg-white text-green-700 shadow-sm'
                    : 'text-gray-500 hover:text-gray-700'
                }`}
              >
                <FaUserTie className="inline mr-0.5 text-[8px]" />
                नाम टाइप गर्नुहोस्
              </button>
            </div>
          </div>

          {familyHeadMode === 'select' ? (
            <SearchableSelect
              label=""
              name="familyHead"
              value={familyForm.familyHead}
              onChange={handleFamilySelectChange}
              options={memberOptions}
              placeholder="घरमुली खोज्नुहोस्..."
            />
          ) : (
            <FloatingInput
              label=""
              name="familyHeadName"
              value={familyForm.familyHeadName}
              onChange={handleFamilyFormChange}
              icon={FaUserTie}
              placeholder="घरमुलीको नाम टाइप गर्नुहोस्"
            />
          )}
        </div>

        {/* Vanshaj Number - MANUAL ENTRY */}
        <FloatingInput
          label="वंशज नं. (Vanshaj Number)"
          name="vanshaGenerationNumber"
          value={familyForm.vanshaGenerationNumber}
          onChange={handleFamilyFormChange}
          icon={FaTree}
          placeholder="जस्तै: 1, 2, 5"
        />

        {/* Clan */}
        <FloatingInput
          label="कुल / गोत्र"
          name="clan"
          value={familyForm.clan}
          onChange={handleFamilyFormChange}
          icon={FaUsers}
          placeholder="जस्तै: माण्डप"
        />

        {/* Origin */}
        <FloatingInput
          label="मूल स्थान"
          name="origin"
          value={familyForm.origin}
          onChange={handleFamilyFormChange}
          icon={FaHome}
        />

        {/* Current Address */}
        <FloatingInput
          label="हालको ठेगाना"
          name="currentAddress"
          value={familyForm.currentAddress}
          onChange={handleFamilyFormChange}
          icon={FaHome}
        />

        {/* Description */}
        <div className="md:col-span-2">
          <FloatingInput
            label="विवरण"
            name="description"
            value={familyForm.description}
            onChange={handleFamilyFormChange}
            type="textarea"
            rows={2}
            icon={FaInfoCircle}
          />
        </div>

        {/* Status */}
        <SearchableSelect
          label="स्थिति"
          name="status"
          value={familyForm.status}
          onChange={handleFamilySelectChange}
          options={[
            { value: 'open', label: 'खुला' },
            { value: 'closed', label: 'बन्द' },
          ]}
        />
      </div>

      {/* Note about total generations */}
      <div className="bg-blue-50 rounded-lg p-3 border border-blue-200">
        <p className="text-xs text-blue-700">
          💡 कुल पुस्ता (Total Generations) स्वत: सदस्यहरूको डाटाबाट गणना हुनेछ।
        </p>
      </div>

      {/* Form Actions */}
      <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t border-gray-200">
        <Button
          type="submit"
          variant="primary"
          disabled={createFamilyMutation.isLoading || updateFamilyMutation.isLoading}
          className="flex-1"
        >
          {(createFamilyMutation.isLoading || updateFamilyMutation.isLoading) ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {isEdit ? 'अद्यावधिक गर्दै...' : 'थप्दै...'}
            </span>
          ) : (
            <>
              <FaSave className="mr-1.5" />
              {isEdit ? 'परिवार अद्यावधिक गर्नुहोस्' : 'परिवार थप्नुहोस्'}
            </>
          )}
        </Button>
        <Button
          type="button"
          variant="outline"
          onClick={() => {
            setIsCreateModalOpen(false);
            setIsEditModalOpen(false);
            setEditingFamily(null);
            resetForm();
          }}
        >
          <FaTimes className="mr-1.5" />
          रद्द गर्नुहोस्
        </Button>
      </div>
    </form>
  );

  // ============================================================
  // LOADING
  // ============================================================
  if (isLoading || membersLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      </div>
    );
  }

  // ============================================================
  // MAIN RENDER
  // ============================================================
  return (
    <div className="space-y-6">
      {/* Header */}
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

      {/* Search */}
      <div className="relative max-w-md">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
        <input
          type="text"
          placeholder="परिवारको नाम, नम्बर, वंशज नं. द्वारा खोज्नुहोस्..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
          className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
        />
      </div>

      {/* Family Grid */}
      {data?.data?.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-xl border border-gray-200">
          <FaHome className="text-4xl text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">कुनै परिवार फेला परेन</p>
          <p className="text-sm text-gray-400">नयाँ परिवार थप्नुहोस्</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {data?.data?.map((family) => (
            <FamilyCard
              key={family._id}
              family={family}
              memberCount={getFamilyMemberCount(family._id)}
              members={getFamilyMembers(family._id)}
              onViewTree={() => handleViewTree(family)}
              onViewDetails={() => handleViewDetails(family)}
              onEdit={handleEditFamily}
              onClose={() => handleCloseFamily(family)}
              onReopen={() => handleReopenFamily(family)}
              isAdmin={true}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {data?.pagination && data.pagination.pages > 1 && (
        <div className="flex justify-center gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            पछिल्लो
          </Button>
          <span className="flex items-center px-3 text-sm text-gray-600">
            {page} / {data.pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(data.pagination.pages, p + 1))}
            disabled={page === data.pagination.pages}
          >
            अर्को
          </Button>
        </div>
      )}

      {/* CREATE MODAL */}
      <Modal
        isOpen={isCreateModalOpen}
        onClose={() => {
          setIsCreateModalOpen(false);
          resetForm();
        }}
        title="नयाँ परिवार थप्नुहोस्"
        size="lg"
      >
        {renderFamilyForm(false)}
      </Modal>

      {/* EDIT MODAL */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingFamily(null);
          resetForm();
        }}
        title="परिवार अद्यावधिक गर्नुहोस्"
        size="lg"
      >
        {renderFamilyForm(true)}
      </Modal>

      {/* TREE MODAL */}
      <Modal
        isOpen={isTreeModalOpen}
        onClose={() => {
          setIsTreeModalOpen(false);
          setSelectedFamily(null);
          setFamilyMembers([]);
        }}
        title={`पारिवारिक वृक्ष - ${selectedFamily?.familyName || ''}`}
        size="xl"
      >
        {selectedFamily && (
          <div className="min-h-[400px] max-h-[75vh] overflow-auto">
            {loadingMembers ? (
              <div className="flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-green-500"></div>
              </div>
            ) : (
              <FamilyTreeView 
                members={familyMembers}
                familyId={selectedFamily._id}
                onMemberClick={(member) => {
                  navigate(`/profile/${member._id}`);
                }}
              />
            )}
          </div>
        )}
      </Modal>

      {/* DETAILS MODAL */}
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
                <p className="text-xs text-gray-500">घर नम्बर</p>
                <p className="font-medium">{selectedFamily.house?.houseNumber || 'N/A'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">वंशज नं.</p>
                <p className="font-medium">{selectedFamily.vanshaGenerationNumber || 'N/A'}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">कुल सदस्य</p>
                <p className="font-medium">{getFamilyMemberCount(selectedFamily._id)}</p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg">
                <p className="text-xs text-gray-500">कुल पुस्ता</p>
                <p className="font-medium">
                  {(() => {
                    const members = getFamilyMembers(selectedFamily._id);
                    if (members.length === 0) return 0;
                    return Math.max(...members.map(m => m.generation || 1));
                  })()}
                </p>
              </div>
              <div className="p-3 bg-gray-50 rounded-lg col-span-2">
                <p className="text-xs text-gray-500">घरमुली</p>
                <p className="font-medium">
                  {selectedFamily.familyHead?.name || 
                   selectedFamily.familyHeadName || 
                   'N/A'}
                </p>
              </div>
            </div>

            {/* Members List */}
            <div>
              <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                <FaUser className="text-green-500" />
                सदस्यहरू ({getFamilyMemberCount(selectedFamily._id)})
              </h4>
              <div className="border border-gray-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 sticky top-0">
                    <tr>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">क्र.सं.</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">नाम</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">सम्बन्ध</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">पुस्ता</th>
                      <th className="px-3 py-2 text-left text-xs font-medium text-gray-500">स्थिति</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {getFamilyMembers(selectedFamily._id).map((member, index) => (
                      <tr key={member._id} className="hover:bg-gray-50">
                        <td className="px-3 py-2 text-xs text-gray-500">{index + 1}</td>
                        <td className="px-3 py-2 font-medium text-gray-700">{member.name}</td>
                        <td className="px-3 py-2 text-gray-600 text-xs">
                          {member.lineageRole === 'lineage_head' ? 'घरमुली' : 
                           getRelationshipLabel(member.relationship)}
                        </td>
                        <td className="px-3 py-2 text-gray-600">{member.generation || 'N/A'}</td>
                        <td className="px-3 py-2">
                          <span className={`px-2 py-0.5 rounded-full text-xs ${
                            member.isAlive !== false 
                              ? 'bg-green-100 text-green-700' 
                              : 'bg-gray-100 text-gray-700'
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