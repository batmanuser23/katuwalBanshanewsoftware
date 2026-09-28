// src/pages/DataEntry.jsx - COMPLETE FIXED VERSION (wifeName/wifeDob removed, houseNumber read-only)

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createMember, updateMember, getMembers } from '../api/members';
import { getFamilies, getFamilyBanshaNumbers } from '../api/families';
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
  FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapPin, 
  FaIdCard, FaBriefcase, FaGraduationCap, FaHeart, 
  FaUsers, FaAddressCard, FaPassport, FaCar, FaFile,
  FaInfoCircle, FaSave, FaTimes, FaCamera, 
  FaChevronLeft, FaChevronRight, FaTrash,
  FaHome, FaTree, FaChild, FaBuilding, FaClone, FaPrint
} from 'react-icons/fa';
import { PiGenderIntersexBold } from 'react-icons/pi';

const DataEntry = ({ member, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  const [isDraft, setIsDraft] = useState(false);
  const [selectedFamilyId, setSelectedFamilyId] = useState('');

  const tabOrder = ['personal', 'contact', 'family', 'identification', 'passport', 'documents', 'additional'];
  const currentTabIndex = tabOrder.indexOf(activeTab);
  const isLastTab = currentTabIndex === tabOrder.length - 1;
  const isFirstTab = currentTabIndex === 0;

  const initialFormData = {
    name: '',
    surname: '',
    gender: 'male',
    dob: '',
    houseNumber: '',
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

    // ❌ REMOVED: wifeName and wifeDob fields

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
    vanshaGenerationNumber: '',
    generation: 1,
    relationship: '',
    father: '',
    mother: '',
    grandfather: '',
    grandmother: '',
    spouse: '',
    guardian: '',
    childBirthOrder: '',
    lineageRole: 'lineage_member',
    familyContact: '',
    
    // Sons and Daughters selection
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

    birthCertificate: '',
    marriageCertificate: '',
    deathCertificate: '',
    panCard: '',
    voterId: '',

    biography: '',
    notes: '',
    specialRemarks: '',
    medicalNotes: '',
    disabilityInfo: '',

    status: 'active',
    verificationStatus: 'pending',
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

  // Fetch families
  const { data: familiesData } = useQuery({
    queryKey: ['families'],
    queryFn: () => getFamilies({ limit: 1000 }),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch members for dropdown
  const { data: membersData } = useQuery({
    queryKey: ['members-dropdown'],
    queryFn: () => getMembers({ limit: 1000 }),
    staleTime: 5 * 60 * 1000,
  });

  // Fetch family-specific Bansha numbers when family changes
  const { data: banshaData } = useQuery({
    queryKey: ['family-bansha', formData.family],
    queryFn: () => getFamilyBanshaNumbers(formData.family),
    enabled: !!formData.family,
    staleTime: 5 * 60 * 1000,
  });

  const createMutation = useMutation({
    mutationFn: createMember,
    onSuccess: () => {
      toast.success('Member created successfully');
      queryClient.invalidateQueries({ queryKey: ['members'] });
      queryClient.invalidateQueries({ queryKey: ['members-dropdown'] });
      queryClient.invalidateQueries({ queryKey: ['families'] });
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['family-bansha'] });
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
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      queryClient.invalidateQueries({ queryKey: ['family-bansha'] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update member');
    },
  });

  // Save Draft
  const saveDraft = () => {
    try {
      localStorage.setItem('memberDraft', JSON.stringify(formData));
      localStorage.setItem('memberDraftPhotos', JSON.stringify(photos));
      toast.success('Draft saved successfully');
      setIsDraft(true);
    } catch (error) {
      toast.error('Failed to save draft');
    }
  };

  // Load Draft
  const loadDraft = () => {
    try {
      const savedData = localStorage.getItem('memberDraft');
      const savedPhotos = localStorage.getItem('memberDraftPhotos');
      if (savedData) {
        setFormData(JSON.parse(savedData));
        if (savedPhotos) {
          setPhotos(JSON.parse(savedPhotos));
        }
        toast.success('Draft loaded');
        setIsDraft(true);
      } else {
        toast.error('No draft found');
      }
    } catch (error) {
      toast.error('Failed to load draft');
    }
  };

  useEffect(() => {
    if (member) {
      const populatedData = { ...initialFormData };
      
      const fieldsToPopulate = { ...member };
      
      if (member.family && typeof member.family === 'object') {
        fieldsToPopulate.family = member.family._id || '';
        if (member.family.house) {
          fieldsToPopulate.houseNumber = member.family.house.houseNumber || '';
        }
        fieldsToPopulate.familyNumber = member.family.familyNumber || '';
        fieldsToPopulate.vanshaGenerationNumber = member.vanshaGenerationNumber || '';
      }
      
      // Populate father, mother, etc.
      const relationFields = ['father', 'mother', 'grandfather', 'grandmother', 'spouse', 'guardian'];
      relationFields.forEach(field => {
        if (member[field] && typeof member[field] === 'object') {
          populatedData[field] = member[field]._id || '';
        }
      });

      // Populate sons and daughters
      if (member.sons && Array.isArray(member.sons)) {
        populatedData.sons = member.sons.map(s => typeof s === 'object' ? s._id : s);
      }
      if (member.daughters && Array.isArray(member.daughters)) {
        populatedData.daughters = member.daughters.map(d => typeof d === 'object' ? d._id : d);
      }

      Object.keys(fieldsToPopulate).forEach(key => {
        if (fieldsToPopulate[key] !== undefined && fieldsToPopulate[key] !== null) {
          populatedData[key] = fieldsToPopulate[key];
        }
      });

      setFormData(populatedData);

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

  const resetForm = () => {
    Object.values(photos).forEach(value => {
      if (typeof value === 'string' && value.startsWith('blob:')) {
        URL.revokeObjectURL(value);
      }
    });

    setFormData(initialFormData);
    setPhotos({
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
    setDocuments({
      birthCertificate: null,
      marriageCertificate: null,
      deathCertificate: null,
      panCard: null,
      voterId: null,
    });
    setActiveTab('personal');
    setValidationErrors({});
    setIsDraft(false);
    localStorage.removeItem('memberDraft');
    localStorage.removeItem('memberDraftPhotos');
  };

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

  const handleSelectChange = (name, value) => {
    // Handle multi-select for sons/daughters
    if (name === 'sons' || name === 'daughters') {
      if (Array.isArray(value)) {
        setFormData(prev => ({
          ...prev,
          [name]: value
        }));
      } else {
        // Single selection - toggle
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

    if (name === 'family') {
      const familyId = typeof value === 'object' && value !== null 
        ? (value._id || value.value || String(value))
        : String(value || '');
      
      setSelectedFamilyId(familyId);
      
      setFormData(prev => ({
        ...prev,
        [name]: familyId,
      }));
      
      if (familyId) {
        const selectedFamily = familiesData?.data?.find(f => f._id === familyId);
        if (selectedFamily) {
          setFormData(prev => ({
            ...prev,
            familyNumber: selectedFamily.familyNumber || '',
            houseNumber: selectedFamily.house?.houseNumber || '',
            vanshaGenerationNumber: selectedFamily.vanshaGenerationNumber || '',
          }));
          toast.success(`परिवार चयन गरियो: ${selectedFamily.familyName}`);
        }
      } else {
        setFormData(prev => ({
          ...prev,
          familyNumber: '',
          houseNumber: '',
          vanshaGenerationNumber: '',
        }));
      }
      
      if (validationErrors[name]) {
        setValidationErrors(prev => ({ ...prev, [name]: '' }));
      }
      return;
    }
    
    // ✅ SIMPLIFIED: Handle marital status change - just set the value
    // No wifeName/wifeDob reset needed anymore
    if (name === 'maritalStatus') {
      setFormData((prev) => ({
        ...prev,
        [name]: value || '',
        // Clear spouse link if not married
        spouse: value === 'married' ? prev.spouse : '',
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
    setDocuments(prev => ({
      ...prev,
      [type]: file
    }));
  };

  // ✅ FIXED: validateForm - removed photo requirement, removed houseNumber requirement
  const validateForm = () => {
    const errors = {};
    
    if (!formData.name?.trim()) {
      errors.name = 'Full Name is required';
    }
    
    if (!formData.surname?.trim()) {
      errors.surname = 'Surname is required';
    }
    
    if (!formData.gender) {
      errors.gender = 'Gender is required';
    }
    
    if (!formData.dob) {
      errors.dob = 'Date of Birth is required';
    }
    
    // ❌ REMOVED: houseNumber validation - it's from family
    // if (!formData.houseNumber?.trim()) {
    //   errors.houseNumber = 'House Number is required';
    // }
    
    if (!formData.district) {
      errors.district = 'District is required';
    }
    
    if (!formData.country?.trim()) {
      errors.country = 'Country is required';
    }

    if (!formData.family) {
      errors.family = 'परिवार चयन गर्नुहोस् (Family is required)';
    }

    // ❌ REMOVED: Photo requirement
    // if (!member && !photos.photo && !photos.photoPreview) {
    //   errors.photo = 'Passport photo is required';
    // }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const errorMessages = Object.values(validationErrors);
      errorMessages.forEach(msg => toast.error(msg));
      if (validationErrors.name || validationErrors.surname || validationErrors.gender || validationErrors.dob) {
        setActiveTab('personal');
      } else if (validationErrors.district || validationErrors.country || validationErrors.family) {
        setActiveTab('contact');
      }
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        
        if (value === undefined || value === null || value === '') return;
        
        if (key === 'generation' || key === 'childBirthOrder') {
          submitData.append(key, Number(value));
        } else if (typeof value === 'boolean') {
          submitData.append(key, String(value));
        } else if (Array.isArray(value)) {
          // Handle arrays (sons, daughters)
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

      const photoFields = [
        'photo', 'citizenshipFront', 'citizenshipBack', 
        'nationalIdFront', 'passportPhoto', 'drivingLicensePhoto'
      ];
      
      photoFields.forEach(field => {
        if (photos[field] && photos[field] instanceof File) {
          submitData.append(field, photos[field]);
        }
      });

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

  // ✅ FIXED: goToNextTab - removed photo and houseNumber checks
  const goToNextTab = () => {
    if (activeTab === 'personal') {
      const personalErrors = {};
      if (!formData.name?.trim()) personalErrors.name = 'Full Name is required';
      if (!formData.surname?.trim()) personalErrors.surname = 'Surname is required';
      if (!formData.gender) personalErrors.gender = 'Gender is required';
      if (!formData.dob) personalErrors.dob = 'Date of Birth is required';
      // ❌ REMOVED: Photo requirement
      // if (!member && !photos.photo && !photos.photoPreview) personalErrors.photo = 'Passport photo is required';
      
      if (Object.keys(personalErrors).length > 0) {
        setValidationErrors(personalErrors);
        Object.values(personalErrors).forEach(msg => toast.error(msg));
        return;
      }
    }
    
    if (activeTab === 'contact') {
      const contactErrors = {};
      // ❌ REMOVED: houseNumber check
      // if (!formData.houseNumber?.trim()) contactErrors.houseNumber = 'House Number is required';
      if (!formData.district) contactErrors.district = 'District is required';
      if (!formData.country?.trim()) contactErrors.country = 'Country is required';
      
      if (Object.keys(contactErrors).length > 0) {
        setValidationErrors(contactErrors);
        Object.values(contactErrors).forEach(msg => toast.error(msg));
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
    { id: 'contact', label: 'Contact & Address', icon: FaAddressCard },
    { id: 'family', label: 'Family', icon: FaUsers },
    { id: 'identification', label: 'ID Cards', icon: FaIdCard },
    { id: 'passport', label: 'Passport & License', icon: FaPassport },
    { id: 'documents', label: 'Documents', icon: FaFile },
    { id: 'additional', label: 'Additional', icon: FaInfoCircle },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case 'personal':
        return renderPersonalInfo();
      case 'contact':
        return renderContactAddress();
      case 'family':
        return renderFamilyInfo();
      case 'identification':
        return renderIdentification();
      case 'passport':
        return renderPassportLicense();
      case 'documents':
        return renderDocuments();
      case 'additional':
        return renderAdditionalInfo();
      default:
        return null;
    }
  };

  const renderPhotoUpload = (type, label, preview, required = false, size = 'md') => {
    const sizeClasses = {
      sm: 'w-32 h-32',
      md: 'w-40 h-40',
      lg: 'w-48 h-48',
      xl: 'w-56 h-56',
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
                title="Remove photo"
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
        {required && !preview && (
          <span className="text-xs text-red-500 mt-1">* Required</span>
        )}
        {hasError && (
          <span className="text-xs text-red-500 mt-1">{validationErrors[type]}</span>
        )}
      </div>
    );
  };

  // ✅ UPDATED: Personal Info - Wife section completely removed
  const renderPersonalInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div className="md:col-span-2 space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <FloatingInput
              label="Full Name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              required
              icon={FaUser}
              error={validationErrors.name}
            />
          </div>
          <div className="md:col-span-2">
            <FloatingInput
              label="Surname (Last Name) - Optional"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              icon={FaUser}
              error={validationErrors.surname}
            />
          </div>
          <SearchableSelect
            label="Gender"
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
          <NepaliDatePickerComponent
            label="Date of Birth (BS)"
            name="dob"
            value={formData.dob}
            onChange={handleSelectChange}
            required
            error={validationErrors.dob}
          />
          <FloatingInput
            label="Place of Birth"
            name="placeOfBirth"
            value={formData.placeOfBirth}
            onChange={handleChange}
            icon={FaMapPin}
          />
          <SearchableSelect
            label="Blood Group - Optional"
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
          
          {/* ❌ REMOVED: Wife section - completely removed */}
          
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
                label="मृत्यु मिति (Date of Death) - Optional"
                name="dod"
                value={formData.dod}
                onChange={handleSelectChange}
                placeholder="मृत्यु मिति चयन गर्नुहोस्"
                required={false}
              />
              <p className="text-xs text-gray-400 mt-1">
                💡 मृत व्यक्तिको लागि मात्र भर्नुहोस्। जीवित व्यक्तिको लागि खाली छोड्नुहोस्।
              </p>
            </div>
          )}
          <SearchableSelect
            label="Occupation"
            name="occupation"
            value={formData.occupation}
            onChange={handleSelectChange}
            options={jobTitles}
            creatable
            placeholder="Search or enter occupation"
          />
          <SearchableSelect
            label="Education"
            name="education"
            value={formData.education}
            onChange={handleSelectChange}
            options={educationLevels}
            creatable
            placeholder="Search or enter education"
          />
          <FloatingInput
            label="Religion"
            name="religion"
            value={formData.religion}
            onChange={handleChange}
            icon={FaHeart}
          />
          <FloatingInput
            label="Caste / Ethnicity"
            name="casteEthnicity"
            value={formData.casteEthnicity}
            onChange={handleChange}
            icon={FaUsers}
          />
          <FloatingInput
            label="Nationality"
            name="nationality"
            value={formData.nationality}
            onChange={handleChange}
            icon={FaAddressCard}
          />
        </div>
      </div>

      <div className="md:col-span-1">
        <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
          <div className="text-center mb-4">
            <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
              <FaCamera className="text-green-600 text-2xl" />
            </div>
            <h4 className="text-sm font-semibold text-green-800">Passport Photo - Optional</h4>
            <p className="text-xs text-gray-500">2x2 inch, white background</p>
          </div>
          
          <div className="flex justify-center">
            {renderPhotoUpload('photo', 'Photo', photos.photoPreview, false, 'xl')}
          </div>
          
          <div className="mt-3 flex justify-center gap-2 text-xs text-gray-400">
            <span>PNG</span>
            <span>•</span>
            <span>JPG</span>
            <span>•</span>
            <span>JPEG</span>
            <span>•</span>
            <span>5MB</span>
          </div>
        </div>
      </div>
    </div>
  );

  // ✅ UPDATED: renderContactAddress - houseNumber removed (it's from family)
  const renderContactAddress = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <FloatingInput
        label="Mobile Number"
        name="phone"
        value={formData.phone}
        onChange={handleChange}
        type="tel"
        icon={FaPhone}
      />
      <FloatingInput
        label="Alternate Mobile"
        name="alternatePhone"
        value={formData.alternatePhone}
        onChange={handleChange}
        type="tel"
        icon={FaPhone}
      />
      <FloatingInput
        label="Email"
        name="email"
        value={formData.email}
        onChange={handleChange}
        type="email"
        icon={FaEnvelope}
      />
      <LocationSelect
        label="Province"
        type="province"
        value={formData.province}
        onChange={(type, value) => handleSelectChange('province', value)}
      />
      <LocationSelect
        label="District"
        type="district"
        province={formData.province}
        value={formData.district}
        onChange={(type, value) => handleSelectChange('district', value)}
        required
        error={validationErrors.district}
      />
      <LocationSelect
        label="Municipality"
        type="municipality"
        district={formData.district}
        value={formData.municipality}
        onChange={(type, value) => handleSelectChange('municipality', value)}
      />
      <FloatingInput
        label="Tole / Village"
        name="toleVillage"
        value={formData.toleVillage}
        onChange={handleChange}
        icon={FaMapPin}
      />
      <LocationSelect
        label="Ward"
        type="ward"
        value={formData.wardNumber}
        onChange={(type, value) => handleSelectChange('wardNumber', value)}
      />
      <FloatingInput
        label="Country"
        name="country"
        value={formData.country}
        onChange={handleChange}
        icon={FaMapPin}
        required
        error={validationErrors.country}
      />
      <FloatingInput
        label="Postal Code"
        name="postalCode"
        value={formData.postalCode}
        onChange={handleChange}
        icon={FaMapPin}
      />
      <div className="md:col-span-2">
        <FloatingInput
          label="Current Address"
          name="currentAddress"
          value={formData.currentAddress}
          onChange={handleChange}
          type="textarea"
          rows={2}
          icon={FaMapPin}
        />
      </div>
      <div className="md:col-span-2">
        <FloatingInput
          label="Permanent Address"
          name="permanentAddress"
          value={formData.permanentAddress}
          onChange={handleChange}
          type="textarea"
          rows={2}
          icon={FaMapPin}
        />
      </div>
    </div>
  );

  // ✅ UPDATED: Family Info - houseNumber is read-only from family
  const renderFamilyInfo = () => {
    const maleMembers = (membersData?.data || []).filter(m => m.gender === 'male');
    const femaleMembers = (membersData?.data || []).filter(m => m.gender === 'female');
    const allMembers = membersData?.data || [];

    const familyOptions = (familiesData?.data || []).map(f => ({
      value: f._id,
      label: `${f.familyName} (घर: ${f.house?.houseNumber || 'N/A'})${f.vanshaGenerationNumber ? ` - पुस्ता: ${f.vanshaGenerationNumber}` : ''}`,
    }));

    const createMemberOptions = (members) => members.map(m => ({
      value: m._id,
      label: `${m.name}${m.surname ? ` ${m.surname}` : ''} (${m.memberNumber || 'N/A'})`,
    }));

    const sonOptions = createMemberOptions(maleMembers);
    const daughterOptions = createMemberOptions(femaleMembers);

    // Get available bansha numbers from the API
    const banshaOptions = (banshaData?.data || []).map(num => ({
      value: num,
      label: num,
    }));

    return (
      <div className="space-y-4">
        <div className="bg-blue-50 rounded-xl p-4 border border-blue-200">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
              <FaInfoCircle className="text-blue-600 text-lg" />
            </div>
            <div>
              <p className="text-sm text-blue-800 font-medium">
                परिवार चयन गर्नुहोस्
              </p>
              <p className="text-xs text-blue-600">
                नयाँ परिवार थप्नको लागि कृपया "परिवारहरू" पृष्ठमा जानुहोस्।
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
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
          </div>
          
          {/* ✅ FIXED: House Number is read-only, comes from family */}
          <FloatingInput
            label="घर नम्बर (House No.) - From Family"
            name="houseNumber"
            value={formData.houseNumber}
            onChange={handleChange}
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

          {/* House Identifier display */}
          {formData.family && (
            <FloatingInput
              label="घर आइडी (House ID)"
              name="houseIdentifier"
              value={familiesData?.data?.find(f => f._id === formData.family)?.houseIdentifier || ''}
              onChange={handleChange}
              icon={FaHome}
              disabled={true}
            />
          )}

          <div className="md:col-span-2">
            <VanshNoAutocomplete
              label="वंश नं. (Bansha No.)"
              name="vanshaGenerationNumber"
              value={formData.vanshaGenerationNumber}
              onChange={handleSelectChange}
              placeholder="खोज्नुहोस् वा नयाँ वंश नं. प्रविष्ट गर्नुहोस्..."
              familyId={formData.family}
              required={false}
            />
            <p className="text-xs text-gray-400 mt-1">
              💡 यस परिवारमा अवस्थित वंश नं. मध्येबाट छान्नुहोस् वा नयाँ प्रविष्ट गर्नुहोस्। एउटै वंश नं. धेरै पटक प्रयोग गर्न सकिन्छ।
            </p>
          </div>

          <FloatingInput
            label="पुस्ता"
            name="generation"
            value={formData.generation}
            onChange={handleChange}
            type="number"
            icon={FaUsers}
          />
          
          <SearchableSelect
            label="सम्बन्ध (Relationship)"
            name="relationship"
            value={formData.relationship}
            onChange={handleSelectChange}
            options={relationships}
            placeholder="सम्बन्ध चयन गर्नुहोस्..."
          />

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

          <SearchableSelect
            label="बुवा"
            name="father"
            value={formData.father}
            onChange={handleSelectChange}
            options={createMemberOptions(maleMembers)}
            placeholder="बुवा खोज्नुहोस्..."
          />
          
          <SearchableSelect
            label="आमा"
            name="mother"
            value={formData.mother}
            onChange={handleSelectChange}
            options={createMemberOptions(femaleMembers)}
            placeholder="आमा खोज्नुहोस्..."
          />
          
          <SearchableSelect
            label="हजुरबा"
            name="grandfather"
            value={formData.grandfather}
            onChange={handleSelectChange}
            options={createMemberOptions(maleMembers)}
            placeholder="हजुरबा खोज्नुहोस्..."
          />
          
          <SearchableSelect
            label="हजुरआमा"
            name="grandmother"
            value={formData.grandmother}
            onChange={handleSelectChange}
            options={createMemberOptions(femaleMembers)}
            placeholder="हजुरआमा खोज्नुहोस्..."
          />
          
          <SearchableSelect
            label="श्रीमान/श्रीमती"
            name="spouse"
            value={formData.spouse}
            onChange={handleSelectChange}
            options={createMemberOptions(allMembers)}
            placeholder="श्रीमान/श्रीमती खोज्नुहोस्..."
          />
          
          <SearchableSelect
            label="अभिभावक"
            name="guardian"
            value={formData.guardian}
            onChange={handleSelectChange}
            options={createMemberOptions(allMembers)}
            placeholder="अभिभावक खोज्नुहोस्..."
          />
          
          <FloatingInput
            label="सन्तान क्रम"
            name="childBirthOrder"
            value={formData.childBirthOrder}
            onChange={handleChange}
            type="number"
            icon={FaChild}
          />

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

          <FloatingInput
            label="परिवार सम्पर्क"
            name="familyContact"
            value={formData.familyContact}
            onChange={handleChange}
            type="tel"
            icon={FaPhone}
          />
        </div>
      </div>
    );
  };

  const renderIdentification = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FloatingInput
          label="Citizenship Number"
          name="citizenshipNumber"
          value={formData.citizenshipNumber}
          onChange={handleChange}
          icon={FaIdCard}
        />
        <NepaliDatePickerComponent
          label="Citizenship Issue Date (BS)"
          name="citizenshipIssueDate"
          value={formData.citizenshipIssueDate}
          onChange={handleSelectChange}
        />
        <LocationSelect
          label="Citizenship Issue District"
          type="district"
          value={formData.citizenshipIssueDistrict}
          onChange={(type, value) => handleSelectChange('citizenshipIssueDistrict', value)}
        />
        <FloatingInput
          label="National ID Number"
          name="nationalIdNumber"
          value={formData.nationalIdNumber}
          onChange={handleChange}
          icon={FaIdCard}
        />
        <NepaliDatePickerComponent
          label="NID Issue Date (BS)"
          name="nationalIdIssueDate"
          value={formData.nationalIdIssueDate}
          onChange={handleSelectChange}
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
          <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Citizenship Front</h5>
          <div className="flex justify-center">
            {renderPhotoUpload('citizenshipFront', 'Citizenship Front', photos.citizenshipFrontPreview, false, 'md')}
          </div>
        </div>
        <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
          <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Citizenship Back</h5>
          <div className="flex justify-center">
            {renderPhotoUpload('citizenshipBack', 'Citizenship Back', photos.citizenshipBackPreview, false, 'md')}
          </div>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
        <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 max-w-md mx-auto">
          <h5 className="text-xs font-medium text-green-700 mb-2 text-center">National ID Front</h5>
          <div className="flex justify-center">
            {renderPhotoUpload('nationalIdFront', 'National ID Front', photos.nationalIdFrontPreview, false, 'md')}
          </div>
        </div>
      </div>
    </div>
  );

  const renderPassportLicense = () => (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FloatingInput
          label="Passport Number"
          name="passportNumber"
          value={formData.passportNumber}
          onChange={handleChange}
          icon={FaPassport}
        />
        <NepaliDatePickerComponent
          label="Passport Issue Date (BS)"
          name="passportIssueDate"
          value={formData.passportIssueDate}
          onChange={handleSelectChange}
        />
        <NepaliDatePickerComponent
          label="Passport Expiry Date (BS)"
          name="passportExpiryDate"
          value={formData.passportExpiryDate}
          onChange={handleSelectChange}
        />
      </div>
      
      <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 max-w-md mx-auto">
        <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Passport Photo</h5>
        <div className="flex justify-center">
          {renderPhotoUpload('passportPhoto', 'Passport Photo', photos.passportPhotoPreview, false, 'lg')}
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        <FloatingInput
          label="Driving License Number"
          name="drivingLicenseNumber"
          value={formData.drivingLicenseNumber}
          onChange={handleChange}
          icon={FaCar}
        />
        <FloatingInput
          label="DL Category"
          name="drivingLicenseCategory"
          value={formData.drivingLicenseCategory}
          onChange={handleChange}
          icon={FaCar}
        />
        <NepaliDatePickerComponent
          label="DL Issue Date (BS)"
          name="drivingLicenseIssueDate"
          value={formData.drivingLicenseIssueDate}
          onChange={handleSelectChange}
        />
        <NepaliDatePickerComponent
          label="DL Expiry Date (BS)"
          name="drivingLicenseExpiryDate"
          value={formData.drivingLicenseExpiryDate}
          onChange={handleSelectChange}
        />
      </div>
      
      <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 max-w-md mx-auto">
        <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Driving License Photo</h5>
        <div className="flex justify-center">
          {renderPhotoUpload('drivingLicensePhoto', 'Driving License Photo', photos.drivingLicensePhotoPreview, false, 'lg')}
        </div>
      </div>
    </div>
  );

  const renderDocuments = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
        <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Birth Certificate</h5>
        <div className="flex justify-center">
          <ImageUpload
            onImageSelect={(file) => handleDocumentUpload('birthCertificate', file)}
            label="Upload Birth Certificate"
            maxSize={5}
          />
        </div>
        {documents.birthCertificate && (
          <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
        )}
      </div>
      <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
        <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Marriage Certificate</h5>
        <div className="flex justify-center">
          <ImageUpload
            onImageSelect={(file) => handleDocumentUpload('marriageCertificate', file)}
            label="Upload Marriage Certificate"
            maxSize={5}
          />
        </div>
        {documents.marriageCertificate && (
          <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
        )}
      </div>
      <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
        <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Death Certificate</h5>
        <div className="flex justify-center">
          <ImageUpload
            onImageSelect={(file) => handleDocumentUpload('deathCertificate', file)}
            label="Upload Death Certificate"
            maxSize={5}
          />
        </div>
        {documents.deathCertificate && (
          <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
        )}
      </div>
      <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
        <h5 className="text-xs font-medium text-green-700 mb-2 text-center">PAN Card</h5>
        <div className="flex justify-center">
          <ImageUpload
            onImageSelect={(file) => handleDocumentUpload('panCard', file)}
            label="Upload PAN Card"
            maxSize={5}
          />
        </div>
        {documents.panCard && (
          <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
        )}
      </div>
      <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 md:col-span-2 max-w-md mx-auto">
        <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Voter ID</h5>
        <div className="flex justify-center">
          <ImageUpload
            onImageSelect={(file) => handleDocumentUpload('voterId', file)}
            label="Upload Voter ID"
            maxSize={5}
          />
        </div>
        {documents.voterId && (
          <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
        )}
      </div>
    </div>
  );

  // ✅ UPDATED: Additional Info - Status and Verification removed
  const renderAdditionalInfo = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div className="md:col-span-2">
        <FloatingInput
          label="Biography"
          name="biography"
          value={formData.biography}
          onChange={handleChange}
          type="textarea"
          rows={3}
          icon={FaInfoCircle}
        />
      </div>
      <div className="md:col-span-2">
        <FloatingInput
          label="Notes"
          name="notes"
          value={formData.notes}
          onChange={handleChange}
          type="textarea"
          rows={2}
          icon={FaInfoCircle}
        />
      </div>
      <div className="md:col-span-2">
        <FloatingInput
          label="Special Remarks"
          name="specialRemarks"
          value={formData.specialRemarks}
          onChange={handleChange}
          type="textarea"
          rows={2}
          icon={FaInfoCircle}
        />
      </div>
      <div className="md:col-span-2">
        <FloatingInput
          label="Medical Notes"
          name="medicalNotes"
          value={formData.medicalNotes}
          onChange={handleChange}
          type="textarea"
          rows={2}
          icon={FaInfoCircle}
        />
      </div>
      <div className="md:col-span-2">
        <FloatingInput
          label="Disability Information"
          name="disabilityInfo"
          value={formData.disabilityInfo}
          onChange={handleChange}
          type="textarea"
          rows={2}
          icon={FaInfoCircle}
        />
      </div>
      {/* ❌ REMOVED: Status and Verification Status dropdowns */}
    </div>
  );

  const isSubmitting = loading || createMutation.isLoading || updateMutation.isLoading;

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 rounded-xl p-4 shadow-sm border border-green-100">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
          <div>
            <h2 className="text-xl md:text-2xl font-bold text-green-800 flex items-center gap-2">
              {member ? (
                <>
                  <span>✏️</span> Edit Member
                </>
              ) : (
                <>
                  <span>➕</span> Add New Member
                </>
              )}
            </h2>
            <p className="text-xs text-green-600 mt-0.5">
              {member ? 'Update member information' : 'Enter member details'} • Step {currentTabIndex + 1} of {tabOrder.length}
            </p>
          </div>
          <div className="flex items-center gap-2">
            {!member && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={saveDraft}
                className="flex items-center"
              >
                <FaClone className="mr-1.5 text-xs" />
                Save Draft
              </Button>
            )}
            {!member && (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={loadDraft}
                className="flex items-center"
              >
                <FaFile className="mr-1.5 text-xs" />
                Load Draft
              </Button>
            )}
            <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
              {member ? 'Editing' : 'New'}
            </span>
          </div>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
        <div 
          className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all duration-500"
          style={{ width: `${((currentTabIndex + 1) / tabOrder.length) * 100}%` }}
        />
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 gap-4">
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
                    ${activeTab === tab.id
                      ? 'text-green-700 bg-white shadow-sm'
                      : 'text-gray-500 hover:text-green-600 hover:bg-green-50/50'
                    }
                    ${index < currentTabIndex ? 'text-green-500' : ''}
                  `}
                >
                  {index < currentTabIndex && (
                    <span className="text-green-500 mr-0.5">✓</span>
                  )}
                  <tab.icon className={`h-3.5 w-3.5 ${activeTab === tab.id ? 'text-green-600' : ''}`} />
                  <span className="hidden sm:inline">{tab.label}</span>
                  <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
                  {activeTab === tab.id && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500"
                      transition={{ duration: 0.3 }}
                    />
                  )}
                </button>
              ))}
            </div>
          </div>

          {/* Tab Content */}
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

        {/* Navigation Buttons */}
        <div className="bg-white rounded-xl shadow-sm border border-green-100 p-3">
          <div className="flex flex-col sm:flex-row justify-between gap-2">
            <div className="flex gap-2 order-2 sm:order-1">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                size="sm"
                className="px-4"
              >
                <FaTimes className="mr-1.5 text-xs" />
                Cancel
              </Button>
            </div>
            <div className="flex gap-2 order-1 sm:order-2">
              {!isFirstTab && (
                <Button
                  type="button"
                  variant="secondary"
                  onClick={goToPrevTab}
                  size="sm"
                  className="px-4"
                >
                  <FaChevronLeft className="mr-1.5 text-xs" />
                  Previous
                </Button>
              )}
              {isLastTab ? (
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  variant="primary"
                  size="sm"
                  className="px-5"
                >
                  {isSubmitting ? (
                    <span className="flex items-center">
                      <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Saving...
                    </span>
                  ) : (
                    <>
                      <FaSave className="mr-1.5 text-xs" />
                      {member ? 'Update Member' : 'Save Member'}
                    </>
                  )}
                </Button>
              ) : (
                <Button
                  type="button"
                  variant="primary"
                  onClick={goToNextTab}
                  size="sm"
                  className="px-5"
                >
                  Next
                  <FaChevronRight className="ml-1.5 text-xs" />
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>
    </form>
  );
};

export default DataEntry;