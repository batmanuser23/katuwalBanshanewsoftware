// src/pages/DataEntry.jsx - COMPLETE UPDATED VERSION
// Key changes:
// - REMOVED: surname field
// - ADDED: DOB typing (AD/BS) + auto conversion
// - ADDED: generationMode (auto/manual)
// - ADDED: Progressive family selection (show fields only after family selected)
// - MANUAL: vanshaGenerationNumber entry
// - ADDED: personStatus (known/missing/unknown_name)
// - ADDED: spouse auto-linking

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createMember, updateMember, getMembers } from '../api/members';
import { getFamilies } from '../api/families';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import FloatingInput from '../components/FloatingInput';
import SearchableSelect from '../components/SearchableSelect';
import LocationSelect from '../components/LocationSelect';
import ImageUpload from '../components/ImageUpload';
import NepaliDatePickerComponent from '../components/NepaliDatePickerComponent';
import Button from '../components/Button';
import VanshNoAutocomplete from '../components/VanshNoAutocomplete';

// Data
import { jobTitles, educationLevels, bloodGroups, maritalStatuses, relationships } from '../data/options';

// Icons
import {
  FaUser, FaEnvelope, FaPhone, FaMapPin,
  FaIdCard, FaPassport, FaCar, FaFile,
  FaInfoCircle, FaSave, FaTimes, FaCamera,
  FaChevronLeft, FaChevronRight, FaTrash,
  FaHome, FaTree, FaChild, FaClone,
  FaQuestionCircle, FaUserSlash, FaUserTie, FaHeart
} from 'react-icons/fa';
import { PiGenderIntersexBold } from 'react-icons/pi';

const DataEntry = ({ member, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isDraft, setIsDraft] = useState(false);
  const [familySelected, setFamilySelected] = useState(false);

  const tabOrder = ['personal', 'contact', 'family', 'identification', 'passport', 'documents', 'additional'];
  const currentTabIndex = tabOrder.indexOf(activeTab);
  const isLastTab = currentTabIndex === tabOrder.length - 1;
  const isFirstTab = currentTabIndex === 0;

  // ============================================================
  // INITIAL FORM DATA
  // ============================================================
  const initialFormData = {
    name: '',
    // ⭐ SURNAME REMOVED
    gender: 'male',
    dob: '',
    dobNepali: '',
    dobInputMode: 'BS', // 'BS' or 'AD'
    district: '',
    country: 'Nepal',

    placeOfBirth: '',
    bloodGroup: 'unknown',
    maritalStatus: 'single',
    isAlive: true,
    dod: '',
    occupation: '',
    education: '',
    religion: '',
    casteEthnicity: '',
    nationality: 'Nepali',

    // ⭐ SPOUSE FIELDS
    spouse: '',
    wifeName: '',
    wifeDob: '',

    // ⭐ PERSON STATUS
    personStatus: 'known',
    unknownNameNote: '',

    phone: '',
    alternatePhone: '',
    email: '',

    wardNumber: '',
    toleVillage: '',
    municipality: '',
    province: '',
    currentAddress: '',
    permanentAddress: '',
    postalCode: '',

    family: '',
    familyNumber: '',
    vanshaGenerationNumber: '', // ⭐ MANUAL ENTRY
    // ⭐ GENERATION with mode
    generation: 1,
    generationMode: 'auto',
    relationship: '',
    father: '',
    mother: '',
    grandfather: '',
    grandmother: '',
    guardian: '',
    childBirthOrder: '',
    lineageRole: 'lineage_member',
    familyContact: '',

    sons: [],
    daughters: [],

    citizenshipNumber: '',
    citizenshipIssueDate: '',
    citizenshipIssueDistrict: '',
    nationalIdNumber: '',
    nationalIdIssueDate: '',

    passportNumber: '',
    passportIssueDate: '',
    passportExpiryDate: '',

    drivingLicenseNumber: '',
    drivingLicenseCategory: '',
    drivingLicenseIssueDate: '',
    drivingLicenseExpiryDate: '',

    biography: '',
    notes: '',
    specialRemarks: '',
    medicalNotes: '',
    disabilityInfo: '',
  };

  const [formData, setFormData] = useState(initialFormData);
  const [photos, setPhotos] = useState({
    photo: null,
    photoPreview: '',
    citizenshipFront: null,
    citizenshipFrontPreview: '',
    citizenshipBack: null,
    citizenshipBackPreview: '',
    nationalIdFront: null,
    nationalIdFrontPreview: '',
    passportPhoto: null,
    passportPhotoPreview: '',
    drivingLicensePhoto: null,
    drivingLicensePhotoPreview: '',
  });

  const [documents, setDocuments] = useState({
    birthCertificate: null,
    marriageCertificate: null,
    deathCertificate: null,
    panCard: null,
    voterId: null,
  });

  // ============================================================
  // FETCH FAMILIES
  // ============================================================
  const { data: familiesData } = useQuery({
    queryKey: ['families'],
    queryFn: () => getFamilies({ limit: 1000 }),
    staleTime: 5 * 60 * 1000,
  });

  // ============================================================
  // FETCH MEMBERS FOR DROPDOWN
  // ============================================================
  const { data: membersData } = useQuery({
    queryKey: ['members-dropdown'],
    queryFn: () => getMembers({ limit: 1000 }),
    staleTime: 5 * 60 * 1000,
  });

  // ============================================================
  // MUTATIONS
  // ============================================================
  const createMutation = useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      toast.success('Member created successfully');
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['members-dropdown'] });
      queryClient.invalidateQueries({ queryKey: ['families'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      onSuccess?.();
      resetForm();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create member');
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => updateMember(id, data),
    onSuccess: () => {
      toast.success('Member updated successfully');
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['members-dropdown'] });
      queryClient.invalidateQueries({ queryKey: ['families'] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update member');
    },
  });

  // ============================================================
  // POPULATE ON EDIT
  // ============================================================
  useEffect(() => {
    if (member) {
      const populatedData = { ...initialFormData };

      const fieldsToPopulate = { ...member };

      if (member.family && typeof member.family === 'object') {
        fieldsToPopulate.family = member.family._id || '';
        fieldsToPopulate.familyNumber = member.family.familyNumber || '';
      }

      // ⭐ REMOVED: surname
      const relationFields = ['father', 'mother', 'grandfather', 'grandmother', 'spouse', 'guardian'];
      relationFields.forEach(field => {
        if (member[field] && typeof member[field] === 'object') {
          populatedData[field] = member[field]._id || '';
        }
      });

      if (member.sons && Array.isArray(member.sons)) {
        populatedData.sons = member.sons.map(s => typeof s === 'object' ? s._id : s);
      }
      if (member.daughters && Array.isArray(member.daughters)) {
        populatedData.daughters = member.daughters.map(d => typeof d === 'object' ? d._id : d);
      }

      // ⭐ Handle DOB - prefer dobNepali if available
      if (member.dobNepali) {
        populatedData.dob = member.dobNepali;
        populatedData.dobNepali = member.dobNepali;
      } else if (member.dob) {
        populatedData.dob = member.dob;
      }

      Object.keys(fieldsToPopulate).forEach(key => {
        if (fieldsToPopulate[key] !== undefined && fieldsToPopulate[key] !== null && key !== 'surname') {
          populatedData[key] = fieldsToPopulate[key];
        }
      });

      // ⭐ Set generationMode
      populatedData.generationMode = member.generationMode || 'auto';

      setFormData(populatedData);
      setFamilySelected(!!populatedData.family);

      setPhotos(prev => ({
        ...prev,
        photoPreview: member.photo || '',
        citizenshipFrontPreview: member.citizenshipFront || '',
        citizenshipBackPreview: member.citizenshipBack || '',
        nationalIdFrontPreview: member.nationalIdFront || '',
        passportPhotoPreview: member.passportPhoto || '',
        drivingLicensePhotoPreview: member.drivingLicensePhoto || '',
      }));
    }
  }, [member]);

  // ============================================================
  // RESET FORM
  // ============================================================
  const resetForm = () => {
    Object.values(photos).forEach(value => {
      if (typeof value === 'string' && value.startsWith('blob:')) {
        URL.revokeObjectURL(value);
      }
    });

    setFormData(initialFormData);
    setPhotos({
      photo: null, photoPreview: '',
      citizenshipFront: null, citizenshipFrontPreview: '',
      citizenshipBack: null, citizenshipBackPreview: '',
      nationalIdFront: null, nationalIdFrontPreview: '',
      passportPhoto: null, passportPhotoPreview: '',
      drivingLicensePhoto: null, drivingLicensePhotoPreview: '',
    });
    setDocuments({
      birthCertificate: null, marriageCertificate: null,
      deathCertificate: null, panCard: null, voterId: null,
    });
    setActiveTab('personal');
    setValidationErrors({});
    setIsDraft(false);
    setFamilySelected(false);
    localStorage.removeItem('memberDraft');
    localStorage.removeItem('memberDraftPhotos');
  };

  // ============================================================
  // HANDLE CHANGE
  // ============================================================
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }));
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ============================================================
  // HANDLE SELECT CHANGE
  // ============================================================
  const handleSelectChange = (name, value) => {
    // Multi-select for sons/daughters
    if (name === 'sons' || name === 'daughters') {
      if (Array.isArray(value)) {
        setFormData(prev => ({ ...prev, [name]: value }));
      } else {
        setFormData(prev => {
          const current = prev[name] || [];
          if (current.includes(value)) {
            return { ...prev, [name]: current.filter(v => v !== value) };
          } else {
            return { ...prev, [name]: [...current, value] };
          }
        });
      }
      return;
    }

    // Family selection - progressive workflow
    if (name === 'family') {
      const familyId = typeof value === 'object' && value !== null
        ? (value._id || value.value || String(value))
        : String(value || '');

      setFormData(prev => ({
        ...prev,
        family: familyId,
      }));

      if (familyId) {
        const selectedFamily = familiesData?.data?.find(f => f._id === familyId);
        if (selectedFamily) {
          setFormData(prev => ({
            ...prev,
            familyNumber: selectedFamily.familyNumber || '',
          }));
          toast.success(`परिवार चयन गरियो: ${selectedFamily.familyName}`);
        }
        setFamilySelected(true);
      } else {
        setFormData(prev => ({
          ...prev,
          familyNumber: '',
          vanshaGenerationNumber: '',
          generation: 1,
        }));
        setFamilySelected(false);
      }

      if (validationErrors[name]) {
        setValidationErrors(prev => ({ ...prev, [name]: '' }));
      }
      return;
    }

    // Marital status change
    if (name === 'maritalStatus') {
      setFormData((prev) => ({
        ...prev,
        [name]: value || '',
        spouse: value === 'married' ? prev.spouse : '',
        wifeName: value === 'married' ? prev.wifeName : '',
        wifeDob: value === 'married' ? prev.wifeDob : '',
      }));
      return;
    }

    // Person status change
    if (name === 'personStatus') {
      setFormData((prev) => ({
        ...prev,
        [name]: value || 'known',
        name: value === 'unknown_name' ? '' : prev.name,
        unknownNameNote: value === 'unknown_name' ? prev.unknownNameNote : '',
      }));
      return;
    }

    // Generation mode toggle
    if (name === 'generationMode') {
      setFormData(prev => ({
        ...prev,
        generationMode: value,
        // If switching to auto, recalculate
        generation: value === 'auto' ? prev.generation : prev.generation,
      }));
      return;
    }

    setFormData((prev) => ({
      ...prev,
      [name]: value || '',
    }));

    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // ============================================================
  // PHOTO HANDLERS
  // ============================================================
  const handleImageSelect = (type, file, preview) => {
    const existingPreview = photos[`${type}Preview`];
    if (typeof existingPreview === 'string' && existingPreview.startsWith('blob:')) {
      URL.revokeObjectURL(existingPreview);
    }

    setPhotos((prev) => ({
      ...prev,
      [type]: file,
      [`${type}Preview`]: preview || (file ? URL.createObjectURL(file) : ''),
    }));
  };

  const handlePhotoRemove = (type) => {
    const preview = photos[`${type}Preview`];
    if (typeof preview === 'string' && preview.startsWith('blob:')) {
      URL.revokeObjectURL(preview);
    }

    setPhotos((prev) => ({
      ...prev,
      [type]: null,
      [`${type}Preview`]: '',
    }));
  };

  const handleDocumentUpload = (type, file) => {
    setDocuments(prev => ({ ...prev, [type]: file }));
  };

  // ============================================================
  // VALIDATE FORM
  // ============================================================
  const validateForm = () => {
    const errors = {};

    if (formData.personStatus !== 'unknown_name') {
      if (!formData.name?.trim()) {
        errors.name = 'Full Name is required';
      }
    }

    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }

    if (formData.personStatus !== 'unknown_name') {
      if (!formData.dob) {
        errors.dob = 'Date of Birth is required';
      }
    }

    if (!formData.country?.trim()) {
      errors.country = 'Country is required';
    }

    if (!formData.family) {
      errors.family = 'परिवार चयन गर्नुहोस् (Family is required)';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // ============================================================
  // SUBMIT
  // ============================================================
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Object.values(validationErrors).forEach(msg => toast.error(msg));
      if (validationErrors.name || validationErrors.gender || validationErrors.dob) {
        setActiveTab('personal');
      } else if (validationErrors.family) {
        setActiveTab('family');
      }
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();

      Object.keys(formData).forEach((key) => {
        const value = formData[key];

        if (value === undefined || value === null || value === '') return;
        if (key === 'surname') return; // ⭐ SKIP surname

        if (key === 'generation' || key === 'childBirthOrder') {
          submitData.append(key, Number(value));
        } else if (typeof value === 'boolean') {
          submitData.append(key, String(value));
        } else if (Array.isArray(value)) {
          value.forEach((item, index) => {
            submitData.append(`${key}[${index}]`, item);
          });
        } else if (typeof value === 'object' && value._id) {
          submitData.append(key, value._id);
        } else {
          submitData.append(key, value);
        }
      });

      if (formData.family) {
        const familyId = typeof formData.family === 'string'
          ? formData.family
          : formData.family._id || String(formData.family);
        submitData.append('family', familyId);
      }

      // Photos
      const photoFields = [
        'photo', 'citizenshipFront', 'citizenshipBack',
        'nationalIdFront', 'passportPhoto', 'drivingLicensePhoto'
      ];

      photoFields.forEach(field => {
        if (photos[field] && photos[field] instanceof File) {
          submitData.append(field, photos[field]);
        }
      });

      // Documents
      Object.entries(documents).forEach(([key, file]) => {
        if (file && file instanceof File) {
          submitData.append(key, file);
        }
      });

      if (member) {
        await updateMutation.mutateAsync({ id: member._id, data: submitData });
        resetForm();
        onSuccess?.();
      } else {
        await createMutation.mutateAsync(submitData);
        resetForm();
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to save member');
    } finally {
      setLoading(false);
    }
  };

  // ============================================================
  // TAB NAVIGATION
  // ============================================================
  const goToNextTab = () => {
    if (activeTab === 'personal') {
      const personalErrors = {};
      if (formData.personStatus !== 'unknown_name' && !formData.name?.trim()) {
        personalErrors.name = 'Full Name is required';
      }
      if (!formData.gender) personalErrors.gender = 'Gender is required';
      if (formData.personStatus !== 'unknown_name' && !formData.dob) {
        personalErrors.dob = 'Date of Birth is required';
      }

      if (Object.keys(personalErrors).length > 0) {
        setValidationErrors(personalErrors);
        Object.values(personalErrors).forEach(msg => toast.error(msg));
        return;
      }
    }

    const nextIndex = currentTabIndex + 1;
    if (nextIndex < tabOrder.length) {
      setActiveTab(tabOrder[nextIndex]);
      setValidationErrors({});
    }
  };

  const goToPrevTab = () => {
    const prevIndex = currentTabIndex - 1;
    if (prevIndex >= 0) {
      setActiveTab(tabOrder[prevIndex]);
      setValidationErrors({});
    }
  };

  const handleTabClick = (tabId) => {
    setActiveTab(tabId);
    setValidationErrors({});
  };

  const tabs = [
    { id: 'personal', label: 'Personal Info', icon: FaUser },
    { id: 'contact', label: 'Contact & Address', icon: FaMapPin },
    { id: 'family', label: 'Family', icon: FaHome },
    { id: 'identification', label: 'ID Cards', icon: FaIdCard },
    { id: 'passport', label: 'Passport & License', icon: FaPassport },
    { id: 'documents', label: 'Documents', icon: FaFile },
    { id: 'additional', label: 'Additional', icon: FaInfoCircle },
  ];

  // ============================================================
  // RENDER TAB CONTENT
  // ============================================================
  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal': return renderPersonalInfo();
      case 'contact': return renderContactAddress();
      case 'family': return renderFamilyInfo();
      case 'identification': return renderIdentification();
      case 'passport': return renderPassportLicense();
      case 'documents': return renderDocuments();
      case 'additional': return renderAdditionalInfo();
      default: return null;
    }
  };

  // ============================================================
  // PHOTO UPLOAD HELPER
  // ============================================================
  const renderPhotoUpload = (type, label, preview, required = false, size = 'md') => {
    const sizeClasses = {
      sm: 'w-32 h-32', md: 'w-40 h-40', lg: 'w-48 h-48', xl: 'w-56 h-56',
    };
    const hasError = validationErrors[type];

    return (
      <div className="flex flex-col items-center">
        {preview ? (
          <div className="relative group">
            <div className={`${sizeClasses[size]} rounded-xl overflow-hidden border-2 ${hasError ? 'border-red-500' : 'border-green-200'} shadow-md hover:shadow-lg transition-all duration-300`}>
              <img src={preview} alt={label} className="w-full h-full object-cover" />
            </div>
            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
              <button
                type="button"
                onClick={() => handlePhotoRemove(type)}
                className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
              >
                <FaTrash className="h-5 w-5 text-red-500" />
              </button>
            </div>
          </div>
        ) : (
          <div className={`${sizeClasses[size]}`}>
            <ImageUpload
              onImageSelect={(file, preview) => handleImageSelect(type, file, preview)}
              label={label}
              maxSize={5}
            />
          </div>
        )}
        {hasError && <span className="text-xs text-red-500 mt-1">{validationErrors[type]}</span>}
      </div>
    );
  };

  // ============================================================
  // PERSONAL INFO TAB
  // ============================================================
  const renderPersonalInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-3">
        {/* Person Status Selector */}
        <div className="p-3 bg-amber-50 rounded-xl border border-amber-200">
          <label className="block text-xs font-medium text-amber-700 mb-2">
            व्यक्तिको स्थिति (Person Status)
          </label>
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => handleSelectChange('personStatus', 'known')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                formData.personStatus === 'known'
                  ? 'bg-green-500 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-green-300'
              }`}
            >
              <FaUser className="inline mr-1.5 text-xs" />
              ज्ञात व्यक्ति
            </button>
            <button
              type="button"
              onClick={() => handleSelectChange('personStatus', 'missing')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                formData.personStatus === 'missing'
                  ? 'bg-orange-500 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-orange-300'
              }`}
            >
              <FaUserSlash className="inline mr-1.5 text-xs" />
              हराएको
            </button>
            <button
              type="button"
              onClick={() => handleSelectChange('personStatus', 'unknown_name')}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                formData.personStatus === 'unknown_name'
                  ? 'bg-gray-500 text-white shadow-md'
                  : 'bg-white text-gray-600 border border-gray-200 hover:border-gray-300'
              }`}
            >
              <FaQuestionCircle className="inline mr-1.5 text-xs" />
              नाम अज्ञात
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {/* Full Name */}
          <div className="md:col-span-2">
            <FloatingInput
              label={formData.personStatus === 'unknown_name' ? 'नाम अज्ञात' : 'Full Name *'}
              name="name"
              value={formData.name}
              onChange={handleChange}
              required={formData.personStatus !== 'unknown_name'}
              icon={FaUser}
              error={validationErrors.name}
              disabled={formData.personStatus === 'unknown_name'}
            />
          </div>

          {formData.personStatus === 'unknown_name' && (
            <div className="md:col-span-2">
              <FloatingInput
                label="थप जानकारी"
                name="unknownNameNote"
                value={formData.unknownNameNote}
                onChange={handleChange}
                icon={FaInfoCircle}
                placeholder="जस्तै: हजुरबुबाको दाजुको नाम थाहा छैन"
              />
            </div>
          )}

          {/* ⭐ SURNAME FIELD REMOVED */}

          <SearchableSelect
            label="Gender *"
            name="gender"
            value={formData.gender}
            onChange={handleSelectChange}
            options={[
              { value: 'male', label: 'Male' },
              { value: 'female', label: 'Female' },
              { value: 'other', label: 'Other' },
            ]}
            icon={PiGenderIntersexBold}
            required
            error={validationErrors.gender}
          />

          {/* ⭐ DOB with AD/BS typing support */}
          <NepaliDatePickerComponent
            label="Date of Birth (BS/AD) *"
            name="dob"
            value={formData.dob}
            onChange={handleSelectChange}
            required={formData.personStatus !== 'unknown_name'}
            error={validationErrors.dob}
            showAdInput={true}
          />

          <FloatingInput
            label="Place of Birth"
            name="placeOfBirth"
            value={formData.placeOfBirth}
            onChange={handleChange}
            icon={FaMapPin}
          />

          <SearchableSelect
            label="Blood Group"
            name="bloodGroup"
            value={formData.bloodGroup}
            onChange={handleSelectChange}
            options={bloodGroups}
          />

          <SearchableSelect
            label="Marital Status"
            name="maritalStatus"
            value={formData.maritalStatus}
            onChange={handleSelectChange}
            options={maritalStatuses}
          />

          {/* Spouse section */}
          {formData.maritalStatus === 'married' && (
            <div className="md:col-span-2 p-4 bg-pink-50 rounded-xl border border-pink-200">
              <h4 className="text-sm font-medium text-pink-700 mb-3 flex items-center gap-2">
                <FaHeart className="text-pink-500" />
                श्रीमान/श्रीमतीको विवरण
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                <SearchableSelect
                  label="विद्यमान सदस्यबाट छान्नुहोस्"
                  name="spouse"
                  value={formData.spouse}
                  onChange={handleSelectChange}
                  options={(membersData?.data || [])
                    .filter(m => {
                      if (formData.gender === 'male') return m.gender === 'female';
                      if (formData.gender === 'female') return m.gender === 'male';
                      return true;
                    })
                    .map(m => ({
                      value: m._id,
                      label: `${m.name}${m.surname ? ` ${m.surname}` : ''} (${m.memberNumber || 'N/A'})`,
                    }))}
                  placeholder="श्रीमान/श्रीमती खोज्नुहोस्..."
                />

                {!formData.spouse && formData.gender === 'male' && (
                  <>
                    <FloatingInput
                      label="श्रीमतीको नाम"
                      name="wifeName"
                      value={formData.wifeName}
                      onChange={handleChange}
                      icon={FaUser}
                    />
                    <NepaliDatePickerComponent
                      label="श्रीमतीको जन्म मिति"
                      name="wifeDob"
                      value={formData.wifeDob}
                      onChange={handleSelectChange}
                    />
                  </>
                )}
              </div>
            </div>
          )}

          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isAlive"
                checked={formData.isAlive}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">जीवित (Is Alive)</span>
            </label>
          </div>

          {!formData.isAlive && (
            <div className="md:col-span-2">
              <NepaliDatePickerComponent
                label="मृत्यु मिति (Date of Death)"
                name="dod"
                value={formData.dod}
                onChange={handleSelectChange}
                required={false}
              />
            </div>
          )}

          <SearchableSelect
            label="Occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleSelectChange}
            options={jobTitles}
            creatable
          />

          <SearchableSelect
            label="Education"
            name="education"
            value={formData.education}
            onChange={handleSelectChange}
            options={educationLevels}
            creatable
          />

          <FloatingInput
            label="Religion"
            name="religion"
            value={formData.religion}
            onChange={handleChange}
            icon={FaHeart}
          />

          <FloatingInput
            label="Caste / Gotra"
            name="casteEthnicity"
            value={formData.casteEthnicity}
            onChange={handleChange}
            icon={FaUsers}
            placeholder="जस्तै: माण्डप"
          />

          <FloatingInput
            label="Nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            icon={FaIdCard}
          />
        </div>
      </div>

      {/* Photo Upload */}
      <div className="md:col-span-1">
        <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FaCamera className="text-green-600 text-2xl" />
            </div>
            <h4 className="text-sm font-semibold text-green-800">Passport Photo (Optional)</h4>
          </div>

          <div className="flex justify-center">
            {renderPhotoUpload('photo', 'Photo', photos.photoPreview, false, 'xl')}
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================
  // CONTACT & ADDRESS TAB
  // ============================================================
  const renderContactAddress = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <FloatingInput label="Mobile Number" name="phone" value={formData.phone} onChange={handleChange} type="tel" icon={FaPhone} />
      <FloatingInput label="Alternate Mobile" name="alternatePhone" value={formData.alternatePhone} onChange={handleChange} type="tel" icon={FaPhone} />
      <FloatingInput label="Email" name="email" value={formData.email} onChange={handleChange} type="email" icon={FaEnvelope} />

      <LocationSelect label="Province" type="province" value={formData.province} onChange={(type, value) => handleSelectChange('province', value)} />
      <LocationSelect label="District" type="district" province={formData.province} value={formData.district} onChange={(type, value) => handleSelectChange('district', value)} />
      <LocationSelect label="Municipality" type="municipality" district={formData.district} value={formData.municipality} onChange={(type, value) => handleSelectChange('municipality', value)} />
      <FloatingInput label="Tole / Village" name="toleVillage" value={formData.toleVillage} onChange={handleChange} icon={FaMapPin} />
      <LocationSelect label="Ward" type="ward" value={formData.wardNumber} onChange={(type, value) => handleSelectChange('wardNumber', value)} />

      {/* ⭐ House Number NOT here - comes from Family */}

      <FloatingInput label="Country *" name="country" value={formData.country} onChange={handleChange} icon={FaMapPin} required error={validationErrors.country} />
      <FloatingInput label="Postal Code" name="postalCode" value={formData.postalCode} onChange={handleChange} icon={FaMapPin} />

      <div className="md:col-span-2">
        <FloatingInput label="Current Address" name="currentAddress" value={formData.currentAddress} onChange={handleChange} type="textarea" rows={2} icon={FaMapPin} />
      </div>
      <div className="md:col-span-2">
        <FloatingInput label="Permanent Address" name="permanentAddress" value={formData.permanentAddress} onChange={handleChange} type="textarea" rows={2} icon={FaMapPin} />
      </div>
    </div>
  );

  // ============================================================
  // FAMILY TAB - PROGRESSIVE WORKFLOW
  // ============================================================
  const renderFamilyInfo = () => {
    const maleMembers = (membersData?.data || []).filter(m => m.gender === 'male');
    const femaleMembers = (membersData?.data || []).filter(m => m.gender === 'female');
    const allMembers = membersData?.data || [];

    const familyOptions = (familiesData?.data || []).map(f => ({
      value: f._id,
      label: `${f.familyName} (घर: ${f.house?.houseNumber || 'N/A'})${f.vanshaGenerationNumber ? ` - वंशज: ${f.vanshaGenerationNumber}` : ''}`,
    }));

    const createMemberOptions = (members) => members.map(m => ({
      value: m._id,
      label: `${m.name}${m.surname ? ` ${m.surname}` : ''} (${m.memberNumber || 'N/A'})`,
    }));

    const sonOptions = createMemberOptions(maleMembers);
    const daughterOptions = createMemberOptions(femaleMembers);

    const selectedFamily = familiesData?.data?.find(f => f._id === formData.family);

    return (
      <div className="space-y-4">
        {/* Step 1: Family Selection - ALWAYS SHOWN */}
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FaInfoCircle className="text-blue-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-blue-800 font-medium">
                पहिले परिवार चयन गर्नुहोस्
              </p>
              <p className="text-xs text-blue-600">
                परिवार चयन गरेपछि मात्र बाँकी जानकारी देखिनेछ।
              </p>
            </div>
          </div>
        </div>

        <SearchableSelect
          label="परिवार *"
          name="family"
          value={formData.family}
          onChange={handleSelectChange}
          options={familyOptions}
          placeholder="परिवार खोज्नुहोस्..."
          required
          error={validationErrors.family}
        />

        {/* ⭐ PROGRESSIVE: Show remaining fields only after family selected */}
        {familySelected && selectedFamily && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-4"
          >
            {/* Family Info Display */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FloatingInput
                label="घर नम्बर"
                name="houseNumber"
                value={selectedFamily.house?.houseNumber || 'N/A'}
                onChange={() => {}}
                icon={FaHome}
                disabled={true}
              />
              <FloatingInput
                label="परिवार नम्बर"
                name="familyNumber"
                value={formData.familyNumber}
                onChange={handleChange}
                icon={FaUsers}
                disabled={true}
              />
            </div>

            {/* Vanshaj Number - MANUAL ENTRY */}
            <div>
              <VanshNoAutocomplete
                label="वंशज नं. (Manual Entry)"
                name="vanshaGenerationNumber"
                value={formData.vanshaGenerationNumber}
                onChange={handleSelectChange}
                placeholder="खोज्नुहोस् वा नयाँ वंशज नं. प्रविष्ट गर्नुहोस्..."
                familyId={formData.family}
                required={false}
              />
              <p className="text-xs text-gray-400 mt-1">
                💡 वंशज नं. म्यानुअल रूपमा प्रविष्ट गर्नुहोस्। स्वत: जेनेरेट हुँदैन।
              </p>
            </div>

            {/* Generation with Mode */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-medium text-gray-700 mb-1">
                  पुस्ता (Generation)
                </label>
                <div className="flex gap-2">
                  <input
                    type="number"
                    name="generation"
                    value={formData.generation}
                    onChange={handleChange}
                    className="flex-1 px-3 py-2.5 rounded-lg border-2 border-gray-200 focus:border-green-500 focus:outline-none"
                    min="1"
                  />
                  <div className="flex bg-gray-100 rounded-lg p-0.5">
                    <button
                      type="button"
                      onClick={() => handleSelectChange('generationMode', 'auto')}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                        formData.generationMode === 'auto'
                          ? 'bg-white text-green-700 shadow-sm'
                          : 'text-gray-500'
                      }`}
                    >
                      Auto
                    </button>
                    <button
                      type="button"
                      onClick={() => handleSelectChange('generationMode', 'manual')}
                      className={`px-3 py-1 text-xs font-medium rounded transition-colors ${
                        formData.generationMode === 'manual'
                          ? 'bg-white text-green-700 shadow-sm'
                          : 'text-gray-500'
                      }`}
                    >
                      Manual
                    </button>
                  </div>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  {formData.generationMode === 'auto'
                    ? '💡 पुस्ता स्वत: गणना हुनेछ'
                    : '💡 तपाईंले प्रविष्ट गरेको पुस्ता प्रयोग हुनेछ'}
                </p>
              </div>

              <SearchableSelect
                label="सम्बन्ध"
                name="relationship"
                value={formData.relationship}
                onChange={handleSelectChange}
                options={relationships}
                placeholder="सम्बन्ध चयन गर्नुहोस्..."
              />
            </div>

            {/* Children Selection */}
            <div className="md:col-span-2">
              <SearchableSelect
                label="छोराहरू (Sons)"
                name="sons"
                value={formData.sons || []}
                onChange={handleSelectChange}
                options={sonOptions}
                placeholder="छोराहरू चयन गर्नुहोस्..."
                isMulti
              />
            </div>

            <div className="md:col-span-2">
              <SearchableSelect
                label="छोरीहरू (Daughters)"
                name="daughters"
                value={formData.daughters || []}
                onChange={handleSelectChange}
                options={daughterOptions}
                placeholder="छोरीहरू चयन गर्नुहोस्..."
                isMulti
              />
            </div>

            {/* Parent Relationships */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <SearchableSelect label="बुवा" name="father" value={formData.father} onChange={handleSelectChange} options={createMemberOptions(maleMembers)} placeholder="बुवा खोज्नुहोस्..." />
              <SearchableSelect label="आमा" name="mother" value={formData.mother} onChange={handleSelectChange} options={createMemberOptions(femaleMembers)} placeholder="आमा खोज्नुहोस्..." />
              <SearchableSelect label="हजुरबा" name="grandfather" value={formData.grandfather} onChange={handleSelectChange} options={createMemberOptions(maleMembers)} placeholder="हजुरबा खोज्नुहोस्..." />
              <SearchableSelect label="हजुरआमा" name="grandmother" value={formData.grandmother} onChange={handleSelectChange} options={createMemberOptions(femaleMembers)} placeholder="हजुरआमा खोज्नुहोस्..." />
              <SearchableSelect label="श्रीमान/श्रीमती" name="spouse" value={formData.spouse} onChange={handleSelectChange} options={createMemberOptions(allMembers)} placeholder="श्रीमान/श्रीमती खोज्नुहोस्..." />
              <SearchableSelect label="अभिभावक" name="guardian" value={formData.guardian} onChange={handleSelectChange} options={createMemberOptions(allMembers)} placeholder="अभिभावक खोज्नुहोस्..." />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <FloatingInput label="सन्तान क्रम" name="childBirthOrder" value={formData.childBirthOrder} onChange={handleChange} type="number" icon={FaChild} />
              <SearchableSelect
                label="पुस्ताको भूमिका"
                name="lineageRole"
                value={formData.lineageRole}
                onChange={handleSelectChange}
                options={[
                  { value: 'lineage_head', label: 'घरमुली' },
                  { value: 'lineage_member', label: 'सदस्य' },
                  { value: 'spouse', label: 'श्रीमान/श्रीमती' },
                  { value: 'other', label: 'अन्य' },
                ]}
              />
            </div>

            <FloatingInput label="परिवार सम्पर्क" name="familyContact" value={formData.familyContact} onChange={handleChange} type="tel" icon={FaPhone} />
          </motion.div>
        )}
      </div>
    );
  };

  // ============================================================
  // IDENTIFICATION TAB
  // ============================================================
  const renderIdentification = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FloatingInput label="Citizenship Number" name="citizenshipNumber" value={formData.citizenshipNumber} onChange={handleChange} icon={FaIdCard} />
        <NepaliDatePickerComponent label="Citizenship Issue Date" name="citizenshipIssueDate" value={formData.citizenshipIssueDate} onChange={handleSelectChange} />
        <LocationSelect label="Citizenship Issue District" type="district" value={formData.citizenshipIssueDistrict} onChange={(type, value) => handleSelectChange('citizenshipIssueDistrict', value)} />
        <FloatingInput label="National ID Number" name="nationalIdNumber" value={formData.nationalIdNumber} onChange={handleChange} icon={FaIdCard} />
        <NepaliDatePickerComponent label="NID Issue Date" name="nationalIdIssueDate" value={formData.nationalIdIssueDate} onChange={handleSelectChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4">
          <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Citizenship Front</h5>
          <div className="flex justify-center">
            {renderPhotoUpload('citizenshipFront', 'Citizenship Front', photos.citizenshipFrontPreview, false, 'md')}
          </div>
        </div>
        <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4">
          <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Citizenship Back</h5>
          <div className="flex justify-center">
            {renderPhotoUpload('citizenshipBack', 'Citizenship Back', photos.citizenshipBackPreview, false, 'md')}
          </div>
        </div>
      </div>
    </div>
  );

  // ============================================================
  // PASSPORT & LICENSE TAB
  // ============================================================
  const renderPassportLicense = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FloatingInput label="Passport Number" name="passportNumber" value={formData.passportNumber} onChange={handleChange} icon={FaPassport} />
        <NepaliDatePickerComponent label="Passport Issue Date" name="passportIssueDate" value={formData.passportIssueDate} onChange={handleSelectChange} />
        <NepaliDatePickerComponent label="Passport Expiry Date" name="passportExpiryDate" value={formData.passportExpiryDate} onChange={handleSelectChange} />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FloatingInput label="Driving License Number" name="drivingLicenseNumber" value={formData.drivingLicenseNumber} onChange={handleChange} icon={FaCar} />
        <FloatingInput label="DL Category" name="drivingLicenseCategory" value={formData.drivingLicenseCategory} onChange={handleChange} icon={FaCar} />
        <NepaliDatePickerComponent label="DL Issue Date" name="drivingLicenseIssueDate" value={formData.drivingLicenseIssueDate} onChange={handleSelectChange} />
        <NepaliDatePickerComponent label="DL Expiry Date" name="drivingLicenseExpiryDate" value={formData.drivingLicenseExpiryDate} onChange={handleSelectChange} />
      </div>
    </div>
  );

  // ============================================================
  // DOCUMENTS TAB
  // ============================================================
  const renderDocuments = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[
        { key: 'birthCertificate', label: 'Birth Certificate' },
        { key: 'marriageCertificate', label: 'Marriage Certificate' },
        { key: 'deathCertificate', label: 'Death Certificate' },
        { key: 'panCard', label: 'PAN Card' },
        { key: 'voterId', label: 'Voter ID' },
      ].map(({ key, label }) => (
        <div key={key} className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4">
          <h5 className="text-xs font-medium text-green-700 mb-2 text-center">{label}</h5>
          <div className="flex justify-center">
            <ImageUpload onImageSelect={(file) => handleDocumentUpload(key, file)} label={`Upload ${label}`} maxSize={5} />
          </div>
          {documents[key] && <p className="text-xs text-green-600 mt-1 text-center">✓ Ready</p>}
        </div>
      ))}
    </div>
  );

  // ============================================================
  // ADDITIONAL TAB
  // ============================================================
  const renderAdditionalInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="md:col-span-2">
        <FloatingInput label="Biography" name="biography" value={formData.biography} onChange={handleChange} type="textarea" rows={3} icon={FaInfoCircle} />
      </div>
      <div className="md:col-span-2">
        <FloatingInput label="Notes" name="notes" value={formData.notes} onChange={handleChange} type="textarea" rows={2} icon={FaInfoCircle} />
      </div>
      <div className="md:col-span-2">
        <FloatingInput label="Special Remarks" name="specialRemarks" value={formData.specialRemarks} onChange={handleChange} type="textarea" rows={2} icon={FaInfoCircle} />
      </div>
      <div className="md:col-span-2">
        <FloatingInput label="Medical Notes" name="medicalNotes" value={formData.medicalNotes} onChange={handleChange} type="textarea" rows={2} icon={FaInfoCircle} />
      </div>
      <div className="md:col-span-2">
        <FloatingInput label="Disability Information" name="disabilityInfo" value={formData.disabilityInfo} onChange={handleChange} type="textarea" rows={2} icon={FaInfoCircle} />
      </div>
    </div>
  );

  const isSubmitting = loading || createMutation.isLoading || updateMutation.isLoading;

  // ============================================================
  // MAIN RENDER
  // ============================================================
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 rounded-xl p-4 shadow-sm border border-green-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-green-800 flex items-center gap-2">
              {member ? <><span>✏️</span> Edit Member</> : <><span>➕</span> Add New Member</>}
            </h2>
            <p className="text-xs text-green-600 mt-0.5">
              Step {currentTabIndex + 1} of {tabOrder.length}
            </p>
          </div>
          <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
            {member ? 'Editing' : 'New'}
          </span>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div
          className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all duration-500"
          style={{ width: `${((currentTabIndex + 1) / tabOrder.length) * 100}%` }}
        />
      </div>

      {/* Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
        <div className="bg-green-50/30 px-3 pt-2 overflow-x-auto">
          <div className="flex min-w-max gap-1">
            {tabs.map((tab, index) => (
              <button
                key={tab.id}
                type="button"
                onClick={() => handleTabClick(tab.id)}
                className={`
                  flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap
                  transition-all duration-300 relative rounded-t-lg
                  ${activeTab === tab.id ? 'text-green-700 bg-white shadow-sm' : 'text-gray-500 hover:text-green-600 hover:bg-green-50/50'}
                `}
              >
                {index < currentTabIndex && <span className="text-green-500 mr-0.5">✓</span>}
                <tab.icon className="h-3.5 w-3.5" />
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
                {activeTab === tab.id && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        <div className="p-3 md:p-4">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              {renderTabContent()}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation */}
      <div className="bg-white rounded-xl shadow-sm border border-green-100 p-3">
        <div className="flex flex-col sm:flex-row justify-between gap-2">
          <Button type="button" variant="outline" onClick={onCancel} size="sm">
            <FaTimes className="mr-1.5 text-xs" />
            Cancel
          </Button>
          <div className="flex gap-2">
            {!isFirstTab && (
              <Button type="button" variant="secondary" onClick={goToPrevTab} size="sm">
                <FaChevronLeft className="mr-1.5 text-xs" />
                Previous
              </Button>
            )}
            {isLastTab ? (
              <Button type="submit" disabled={isSubmitting} variant="primary" size="sm">
                {isSubmitting ? 'Saving...' : (<><FaSave className="mr-1.5 text-xs" />{member ? 'Update' : 'Save'}</>)}
              </Button>
            ) : (
              <Button type="button" variant="primary" onClick={goToNextTab} size="sm">
                Next
                <FaChevronRight className="ml-1.5 text-xs" />
              </Button>
            )}
          </div>
        </div>
      </div>
    </form>
  );
};

export default DataEntry;