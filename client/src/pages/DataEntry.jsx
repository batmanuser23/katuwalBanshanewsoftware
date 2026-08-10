// import { useState, useEffect } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { createMember, updateMember, getMembers } from '../api/members';
// import { getFamilies } from '../api/families';
// import Button from '../components/Button';
// import ImageUpload from '../components/ImageUpload';
// import Camera from '../components/Camera';
// import Select from 'react-select';
// import toast from 'react-hot-toast';

// const DataEntry = ({ member, onSuccess, onCancel }) => {
//   const initialFormData = {
//     // Personal Information
//     name: '',
//     gender: 'male',
//     dob: '',
//     placeOfBirth: '',
//     bloodGroup: 'unknown',
//     maritalStatus: 'single',
//     isAlive: true,
//     dod: '',
//     occupation: '',
//     education: '',
//     religion: '',
//     casteEthnicity: '',
//     nationality: 'Nepali',

//     // Contact Information
//     phone: '',
//     alternatePhone: '',
//     email: '',

//     // Address Information
//     houseNumber: '',
//     wardNumber: '',
//     toleVillage: '',
//     municipality: '',
//     district: '',
//     province: '',
//     country: 'Nepal',
//     currentAddress: '',
//     permanentAddress: '',
//     postalCode: '',

//     // Family Information
//     family: '',
//     familyNumber: '',
//     rollNumber: '',
//     generation: 1,
//     relationship: 'member',
//     father: '',
//     mother: '',
//     grandfather: '',
//     grandmother: '',
//     spouse: '',
//     guardian: '',
//     familyContact: '',

//     // Identification
//     citizenshipNumber: '',
//     citizenshipIssueDate: '',
//     citizenshipIssueDistrict: '',
//     nationalIdNumber: '',
//     nationalIdIssueDate: '',

//     // Passport
//     passportNumber: '',
//     passportIssueDate: '',
//     passportExpiryDate: '',

//     // Driving License
//     drivingLicenseNumber: '',
//     drivingLicenseCategory: '',
//     drivingLicenseIssueDate: '',
//     drivingLicenseExpiryDate: '',

//     // Documents
//     birthCertificate: '',
//     marriageCertificate: '',
//     deathCertificate: '',
//     panCard: '',
//     voterId: '',

//     // Additional Information
//     biography: '',
//     notes: '',
//     specialRemarks: '',
//     medicalNotes: '',
//     disabilityInfo: '',

//     // Status
//     status: 'active',
//     verificationStatus: 'pending',
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [photo, setPhoto] = useState(null);
//   const [photoPreview, setPhotoPreview] = useState('');
//   const [citizenshipFront, setCitizenshipFront] = useState(null);
//   const [citizenshipFrontPreview, setCitizenshipFrontPreview] = useState('');
//   const [citizenshipBack, setCitizenshipBack] = useState(null);
//   const [citizenshipBackPreview, setCitizenshipBackPreview] = useState('');
//   const [nationalIdFront, setNationalIdFront] = useState(null);
//   const [nationalIdFrontPreview, setNationalIdFrontPreview] = useState('');
//   const [passportPhoto, setPassportPhoto] = useState(null);
//   const [passportPhotoPreview, setPassportPhotoPreview] = useState('');
//   const [drivingLicensePhoto, setDrivingLicensePhoto] = useState(null);
//   const [drivingLicensePhotoPreview, setDrivingLicensePhotoPreview] = useState('');
//   const [showCamera, setShowCamera] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [activeTab, setActiveTab] = useState('personal');
//   const [cameraType, setCameraType] = useState('photo');

//   const queryClient = useQueryClient();

//   // Fetch families data
//   const { data: familiesData, isLoading: familiesLoading } = useQuery({
//     queryKey: ['families'],
//     queryFn: () => getFamilies({ limit: 1000 }),
//     staleTime: 5 * 60 * 1000,
//   });

//   // Fetch members data for dropdowns
//   const { data: membersData, isLoading: membersLoading } = useQuery({
//     queryKey: ['members-dropdown'],
//     queryFn: () => getMembers({ limit: 1000 }),
//     staleTime: 5 * 60 * 1000,
//   });

//   // Create member mutation
//   const createMutation = useMutation({
//     mutationFn: createMember,
//     onSuccess: () => {
//       toast.success('Member created successfully');
//       queryClient.invalidateQueries({ queryKey: ['members'] });
//       queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
//       onSuccess?.();
//       resetForm();
//     },
//     onError: (error) => {
//       toast.error(error.message || 'Failed to create member');
//     },
//   });

//   // Update member mutation
//   const updateMutation = useMutation({
//     mutationFn: ({ id, data }) => updateMember(id, data),
//     onSuccess: () => {
//       toast.success('Member updated successfully');
//       queryClient.invalidateQueries({ queryKey: ['members'] });
//       queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
//       onSuccess?.();
//     },
//     onError: (error) => {
//       toast.error(error.message || 'Failed to update member');
//     },
//   });

//   // Reset form function
//   const resetForm = () => {
//     setFormData(initialFormData);
//     setPhoto(null);
//     setPhotoPreview('');
//     setCitizenshipFront(null);
//     setCitizenshipFrontPreview('');
//     setCitizenshipBack(null);
//     setCitizenshipBackPreview('');
//     setNationalIdFront(null);
//     setNationalIdFrontPreview('');
//     setPassportPhoto(null);
//     setPassportPhotoPreview('');
//     setDrivingLicensePhoto(null);
//     setDrivingLicensePhotoPreview('');
//     setActiveTab('personal');
//   };

//   // Populate form when editing
//   useEffect(() => {
//     if (member) {
//       setFormData({
//         name: member.name || '',
//         gender: member.gender || 'male',
//         dob: member.dob ? member.dob.split('T')[0] : '',
//         placeOfBirth: member.placeOfBirth || '',
//         bloodGroup: member.bloodGroup || 'unknown',
//         maritalStatus: member.maritalStatus || 'single',
//         isAlive: member.isAlive !== undefined ? member.isAlive : true,
//         dod: member.dod ? member.dod.split('T')[0] : '',
//         occupation: member.occupation || '',
//         education: member.education || '',
//         religion: member.religion || '',
//         casteEthnicity: member.casteEthnicity || '',
//         nationality: member.nationality || 'Nepali',
//         phone: member.phone || '',
//         alternatePhone: member.alternatePhone || '',
//         email: member.email || '',
//         houseNumber: member.houseNumber || '',
//         wardNumber: member.wardNumber || '',
//         toleVillage: member.toleVillage || '',
//         municipality: member.municipality || '',
//         district: member.district || '',
//         province: member.province || '',
//         country: member.country || 'Nepal',
//         currentAddress: member.currentAddress || '',
//         permanentAddress: member.permanentAddress || '',
//         postalCode: member.postalCode || '',
//         family: member.family?._id || '',
//         familyNumber: member.familyNumber || '',
//         rollNumber: member.rollNumber || '',
//         generation: member.generation || 1,
//         relationship: member.relationship || 'member',
//         father: member.father?._id || '',
//         mother: member.mother?._id || '',
//         grandfather: member.grandfather?._id || '',
//         grandmother: member.grandmother?._id || '',
//         spouse: member.spouse?._id || '',
//         guardian: member.guardian?._id || '',
//         familyContact: member.familyContact || '',
//         citizenshipNumber: member.citizenshipNumber || '',
//         citizenshipIssueDate: member.citizenshipIssueDate ? member.citizenshipIssueDate.split('T')[0] : '',
//         citizenshipIssueDistrict: member.citizenshipIssueDistrict || '',
//         nationalIdNumber: member.nationalIdNumber || '',
//         nationalIdIssueDate: member.nationalIdIssueDate ? member.nationalIdIssueDate.split('T')[0] : '',
//         passportNumber: member.passportNumber || '',
//         passportIssueDate: member.passportIssueDate ? member.passportIssueDate.split('T')[0] : '',
//         passportExpiryDate: member.passportExpiryDate ? member.passportExpiryDate.split('T')[0] : '',
//         drivingLicenseNumber: member.drivingLicenseNumber || '',
//         drivingLicenseCategory: member.drivingLicenseCategory || '',
//         drivingLicenseIssueDate: member.drivingLicenseIssueDate ? member.drivingLicenseIssueDate.split('T')[0] : '',
//         drivingLicenseExpiryDate: member.drivingLicenseExpiryDate ? member.drivingLicenseExpiryDate.split('T')[0] : '',
//         birthCertificate: member.birthCertificate || '',
//         marriageCertificate: member.marriageCertificate || '',
//         deathCertificate: member.deathCertificate || '',
//         panCard: member.panCard || '',
//         voterId: member.voterId || '',
//         biography: member.biography || '',
//         notes: member.notes || '',
//         specialRemarks: member.specialRemarks || '',
//         medicalNotes: member.medicalNotes || '',
//         disabilityInfo: member.disabilityInfo || '',
//         status: member.status || 'active',
//         verificationStatus: member.verificationStatus || 'pending',
//       });
      
//       if (member.photo) setPhotoPreview(member.photo);
//       if (member.citizenshipFront) setCitizenshipFrontPreview(member.citizenshipFront);
//       if (member.citizenshipBack) setCitizenshipBackPreview(member.citizenshipBack);
//       if (member.nationalIdFront) setNationalIdFrontPreview(member.nationalIdFront);
//       if (member.passportPhoto) setPassportPhotoPreview(member.passportPhoto);
//       if (member.drivingLicensePhoto) setDrivingLicensePhotoPreview(member.drivingLicensePhoto);
//     }
//   }, [member]);

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleSelectChange = (name, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value || '',
//     }));
//   };

//   const handlePhotoCapture = (file, type) => {
//     if (!file) return;
    
//     const setters = {
//       photo: { file: setPhoto, preview: setPhotoPreview },
//       citizenshipFront: { file: setCitizenshipFront, preview: setCitizenshipFrontPreview },
//       citizenshipBack: { file: setCitizenshipBack, preview: setCitizenshipBackPreview },
//       nationalIdFront: { file: setNationalIdFront, preview: setNationalIdFrontPreview },
//       passportPhoto: { file: setPassportPhoto, preview: setPassportPhotoPreview },
//       drivingLicensePhoto: { file: setDrivingLicensePhoto, preview: setDrivingLicensePhotoPreview },
//     };

//     if (setters[type]) {
//       setters[type].file(file);
//       setters[type].preview(URL.createObjectURL(file));
//       setShowCamera(false);
//     }
//   };

//   const handleImageRemove = (type) => {
//     const setters = {
//       photo: { file: setPhoto, preview: setPhotoPreview },
//       citizenshipFront: { file: setCitizenshipFront, preview: setCitizenshipFrontPreview },
//       citizenshipBack: { file: setCitizenshipBack, preview: setCitizenshipBackPreview },
//       nationalIdFront: { file: setNationalIdFront, preview: setNationalIdFrontPreview },
//       passportPhoto: { file: setPassportPhoto, preview: setPassportPhotoPreview },
//       drivingLicensePhoto: { file: setDrivingLicensePhoto, preview: setDrivingLicensePhotoPreview },
//     };
//     if (setters[type]) {
//       setters[type].file(null);
//       setters[type].preview('');
//     }
//   };

//   const memberOptions = (membersData?.data || []).map(m => ({
//     value: m._id,
//     label: `${m.name} (${m.familyNumber || 'No Family'})`,
//   }));

//   const familyOptions = (familiesData?.data || []).map(f => ({
//     value: f._id,
//     label: `${f.familyName} (${f.familyNumber})`,
//   }));

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     // Validation
//     if (!formData.name.trim()) {
//       toast.error('Name is required');
//       return;
//     }

//     setLoading(true);

//     try {
//       const submitData = new FormData();
      
//       // Append all form data
//       Object.keys(formData).forEach((key) => {
//         const value = formData[key];
//         if (value !== undefined && value !== null && value !== '') {
//           // Convert boolean to string for FormData
//           if (typeof value === 'boolean') {
//             submitData.append(key, String(value));
//           } else {
//             submitData.append(key, value);
//           }
//         }
//       });

//       // Append images
//       if (photo) submitData.append('photo', photo);
//       if (citizenshipFront) submitData.append('citizenshipFront', citizenshipFront);
//       if (citizenshipBack) submitData.append('citizenshipBack', citizenshipBack);
//       if (nationalIdFront) submitData.append('nationalIdFront', nationalIdFront);
//       if (passportPhoto) submitData.append('passportPhoto', passportPhoto);
//       if (drivingLicensePhoto) submitData.append('drivingLicensePhoto', drivingLicensePhoto);

//       if (member) {
//         await updateMutation.mutateAsync({ id: member._id, data: submitData });
//       } else {
//         await createMutation.mutateAsync(submitData);
//       }
//     } catch (error) {
//   console.log(error.response);
//   console.log(error.response?.data);
//   console.log(error.response?.data?.message);
//   console.log(error.response?.data?.errors);
// } finally {
//       setLoading(false);
//     }
//   };

//   const tabs = [
//     { id: 'personal', label: 'Personal Info' },
//     { id: 'contact', label: 'Contact & Address' },
//     { id: 'family', label: 'Family' },
//     { id: 'identification', label: 'ID Cards' },
//     { id: 'passport', label: 'Passport & License' },
//     { id: 'documents', label: 'Documents' },
//     { id: 'additional', label: 'Additional' },
//   ];

//   const renderImageUpload = (label, preview, onCamera, type) => (
//     <div className="flex flex-col items-center">
//       {preview ? (
//         <div className="relative">
//           <img
//             src={preview}
//             alt={label}
//             className="h-20 w-20 sm:h-24 sm:w-24 object-cover rounded-lg border-2 border-gray-200"
//           />
//           <button
//             type="button"
//             onClick={() => handleImageRemove(type)}
//             className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 text-xs transition-colors"
//           >
//             <svg className="h-3 w-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
//               <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//             </svg>
//           </button>
//         </div>
//       ) : (
//         <div className="h-20 w-20 sm:h-24 sm:w-24 bg-gray-100 rounded-lg flex items-center justify-center border-2 border-dashed border-gray-300">
//           <span className="text-gray-500 text-xs text-center px-1">{label}</span>
//         </div>
//       )}
//       <div className="flex space-x-1 mt-2">
//         <ImageUpload
//           onImageSelect={(file) => {
//             if (file) {
//               const setters = {
//                 photo: { file: setPhoto, preview: setPhotoPreview },
//                 citizenshipFront: { file: setCitizenshipFront, preview: setCitizenshipFrontPreview },
//                 citizenshipBack: { file: setCitizenshipBack, preview: setCitizenshipBackPreview },
//                 nationalIdFront: { file: setNationalIdFront, preview: setNationalIdFrontPreview },
//                 passportPhoto: { file: setPassportPhoto, preview: setPassportPhotoPreview },
//                 drivingLicensePhoto: { file: setDrivingLicensePhoto, preview: setDrivingLicensePhotoPreview },
//               };
//               if (setters[type]) {
//                 setters[type].file(file);
//                 setters[type].preview(URL.createObjectURL(file));
//               }
//             }
//           }}
//           label="Upload"
//           maxSize={15}
//         />
//         <Button
//           type="button"
//           variant="outline"
//           size="sm"
//           onClick={() => {
//             setCameraType(type);
//             setShowCamera(true);
//           }}
//           className="px-2 py-1 text-sm"
//         >
//           📷
//         </Button>
//       </div>
//     </div>
//   );

//   // Loading state
//   if (familiesLoading || membersLoading) {
//     return (
//       <div className="flex justify-center items-center py-12">
//         <div className="text-center">
//           <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
//           <p className="mt-4 text-gray-600">Loading data...</p>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <form onSubmit={handleSubmit} className="space-y-6 max-w-full">
//       {/* Header */}
//       <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
//         <h2 className="text-xl sm:text-2xl font-bold text-gray-800">
//           {member ? 'Edit Member' : 'Add New Member'}
//         </h2>
//         <div className="flex items-center space-x-2">
//           <span className="text-sm text-gray-500">
//             {member ? 'Editing existing member' : 'Creating new member'}
//           </span>
//         </div>
//       </div>

//       {/* Photo Upload Section */}
//       <div className="bg-gray-50 rounded-lg p-4">
//         <label className="block text-sm font-medium text-gray-700 mb-3">Photos & Documents</label>
//         <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
//           {renderImageUpload('Photo', photoPreview, null, 'photo')}
//           {renderImageUpload('Citizenship Front', citizenshipFrontPreview, null, 'citizenshipFront')}
//           {renderImageUpload('Citizenship Back', citizenshipBackPreview, null, 'citizenshipBack')}
//           {renderImageUpload('NID Front', nationalIdFrontPreview, null, 'nationalIdFront')}
//           {renderImageUpload('Passport', passportPhotoPreview, null, 'passportPhoto')}
//           {renderImageUpload('DL', drivingLicensePhotoPreview, null, 'drivingLicensePhoto')}
//         </div>
//       </div>

//       {/* Camera Modal */}
//       {showCamera && (
//         <Camera
//           onCapture={(file) => handlePhotoCapture(file, cameraType)}
//           onClose={() => setShowCamera(false)}
//         />
//       )}

//       {/* Tabs - Responsive */}
//       <div className="border-b border-gray-200 overflow-x-auto">
//         <nav className="flex space-x-1 sm:space-x-4 min-w-max">
//           {tabs.map((tab) => (
//             <button
//               key={tab.id}
//               type="button"
//               onClick={() => setActiveTab(tab.id)}
//               className={`px-3 py-2 text-xs sm:text-sm font-medium whitespace-nowrap border-b-2 transition-all ${
//                 activeTab === tab.id
//                   ? 'border-primary text-primary'
//                   : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
//               }`}
//             >
//               {tab.label}
//             </button>
//           ))}
//         </nav>
//       </div>

//       {/* Tab Content - Responsive Grid */}
//       <div className="bg-white rounded-lg p-4 sm:p-6">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
//           {/* Personal Information */}
//           {activeTab === 'personal' && (
//             <>
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">
//                   Full Name <span className="text-red-500">*</span>
//                 </label>
//                 <input
//                   type="text"
//                   name="name"
//                   value={formData.name}
//                   onChange={handleChange}
//                   required
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Enter full name"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Gender</label>
//                 <select
//                   name="gender"
//                   value={formData.gender}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                 >
//                   <option value="male">Male</option>
//                   <option value="female">Female</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label>
//                 <input
//                   type="date"
//                   name="dob"
//                   value={formData.dob}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Place of Birth</label>
//                 <input
//                   type="text"
//                   name="placeOfBirth"
//                   value={formData.placeOfBirth}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="City, District"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Blood Group</label>
//                 <select
//                   name="bloodGroup"
//                   value={formData.bloodGroup}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                 >
//                   <option value="unknown">Unknown</option>
//                   <option value="A+">A+</option>
//                   <option value="A-">A-</option>
//                   <option value="B+">B+</option>
//                   <option value="B-">B-</option>
//                   <option value="AB+">AB+</option>
//                   <option value="AB-">AB-</option>
//                   <option value="O+">O+</option>
//                   <option value="O-">O-</option>
//                 </select>
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Marital Status</label>
//                 <select
//                   name="maritalStatus"
//                   value={formData.maritalStatus}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                 >
//                   <option value="single">Single</option>
//                   <option value="married">Married</option>
//                   <option value="divorced">Divorced</option>
//                   <option value="widowed">Widowed</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>

//               <div className="col-span-2">
//                 <label className="flex items-center space-x-2 cursor-pointer">
//                   <input
//                     type="checkbox"
//                     name="isAlive"
//                     checked={formData.isAlive}
//                     onChange={handleChange}
//                     className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded transition"
//                   />
//                   <span className="text-sm text-gray-700">Is Alive</span>
//                 </label>
//               </div>

//               {!formData.isAlive && (
//                 <div className="col-span-1">
//                   <label className="block text-sm font-medium text-gray-700 mb-1">Date of Death</label>
//                   <input
//                     type="date"
//                     name="dod"
//                     value={formData.dod}
//                     onChange={handleChange}
//                     className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   />
//                 </div>
//               )}

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Occupation</label>
//                 <input
//                   type="text"
//                   name="occupation"
//                   value={formData.occupation}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Job title"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Education</label>
//                 <input
//                   type="text"
//                   name="education"
//                   value={formData.education}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Highest degree"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Religion</label>
//                 <input
//                   type="text"
//                   name="religion"
//                   value={formData.religion}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Religion"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Caste / Ethnicity</label>
//                 <input
//                   type="text"
//                   name="casteEthnicity"
//                   value={formData.casteEthnicity}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Caste or ethnicity"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
//                 <input
//                   type="text"
//                   name="nationality"
//                   value={formData.nationality}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                 />
//               </div>
//             </>
//           )}

//           {/* Contact & Address */}
//           {activeTab === 'contact' && (
//             <>
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Mobile Number</label>
//                 <input
//                   type="tel"
//                   name="phone"
//                   value={formData.phone}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="98XXXXXXXX"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Alternative Mobile</label>
//                 <input
//                   type="tel"
//                   name="alternatePhone"
//                   value={formData.alternatePhone}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="98XXXXXXXX"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
//                 <input
//                   type="email"
//                   name="email"
//                   value={formData.email}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="email@example.com"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">House Number</label>
//                 <input
//                   type="text"
//                   name="houseNumber"
//                   value={formData.houseNumber}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="House #"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Ward Number</label>
//                 <input
//                   type="text"
//                   name="wardNumber"
//                   value={formData.wardNumber}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Ward #"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Tole / Village</label>
//                 <input
//                   type="text"
//                   name="toleVillage"
//                   value={formData.toleVillage}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Tole or village name"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Municipality</label>
//                 <input
//                   type="text"
//                   name="municipality"
//                   value={formData.municipality}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Municipality name"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">District</label>
//                 <input
//                   type="text"
//                   name="district"
//                   value={formData.district}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="District name"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Province</label>
//                 <input
//                   type="text"
//                   name="province"
//                   value={formData.province}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Province #"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Country</label>
//                 <input
//                   type="text"
//                   name="country"
//                   value={formData.country}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                 />
//               </div>

//               <div className="col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Current Address</label>
//                 <textarea
//                   name="currentAddress"
//                   value={formData.currentAddress}
//                   onChange={handleChange}
//                   rows="2"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Full current address"
//                 />
//               </div>

//               <div className="col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label>
//                 <textarea
//                   name="permanentAddress"
//                   value={formData.permanentAddress}
//                   onChange={handleChange}
//                   rows="2"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Full permanent address"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Postal Code</label>
//                 <input
//                   type="text"
//                   name="postalCode"
//                   value={formData.postalCode}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Postal code"
//                 />
//               </div>
//             </>
//           )}

//           {/* Family Information */}
//           {activeTab === 'family' && (
//             <>
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Family</label>
//                 <Select
//                   options={familyOptions}
//                   value={familyOptions.find(opt => opt.value === formData.family) || null}
//                   onChange={(opt) => handleSelectChange('family', opt?.value)}
//                   placeholder="Select Family"
//                   isClearable
//                   className="react-select-container"
//                   classNamePrefix="react-select"
//                   styles={{
//                     control: (base) => ({
//                       ...base,
//                       borderRadius: '0.5rem',
//                       borderColor: '#d1d5db',
//                       '&:hover': {
//                         borderColor: '#d1d5db',
//                       },
//                     }),
//                   }}
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Family Number</label>
//                 <input
//                   type="text"
//                   name="familyNumber"
//                   value={formData.familyNumber}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Family #"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Roll Number</label>
//                 <input
//                   type="text"
//                   name="rollNumber"
//                   value={formData.rollNumber}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Roll #"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Generation</label>
//                 <input
//                   type="number"
//                   name="generation"
//                   value={formData.generation}
//                   onChange={handleChange}
//                   min="1"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
//                 <select
//                   name="relationship"
//                   value={formData.relationship}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                 >
//                   <option value="member">Member</option>
//                   <option value="spouse">Spouse</option>
//                   <option value="child">Child</option>
//                   <option value="parent">Parent</option>
//                   <option value="sibling">Sibling</option>
//                   <option value="grandparent">Grandparent</option>
//                   <option value="grandchild">Grandchild</option>
//                   <option value="other">Other</option>
//                 </select>
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Family Contact</label>
//                 <input
//                   type="tel"
//                   name="familyContact"
//                   value={formData.familyContact}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Family contact number"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Father</label>
//                 <Select
//                   options={memberOptions}
//                   value={memberOptions.find(opt => opt.value === formData.father) || null}
//                   onChange={(opt) => handleSelectChange('father', opt?.value)}
//                   placeholder="Search Father"
//                   isClearable
//                   styles={{
//                     control: (base) => ({
//                       ...base,
//                       borderRadius: '0.5rem',
//                       borderColor: '#d1d5db',
//                       '&:hover': {
//                         borderColor: '#d1d5db',
//                       },
//                     }),
//                   }}
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Mother</label>
//                 <Select
//                   options={memberOptions}
//                   value={memberOptions.find(opt => opt.value === formData.mother) || null}
//                   onChange={(opt) => handleSelectChange('mother', opt?.value)}
//                   placeholder="Search Mother"
//                   isClearable
//                   styles={{
//                     control: (base) => ({
//                       ...base,
//                       borderRadius: '0.5rem',
//                       borderColor: '#d1d5db',
//                       '&:hover': {
//                         borderColor: '#d1d5db',
//                       },
//                     }),
//                   }}
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Grandfather</label>
//                 <Select
//                   options={memberOptions}
//                   value={memberOptions.find(opt => opt.value === formData.grandfather) || null}
//                   onChange={(opt) => handleSelectChange('grandfather', opt?.value)}
//                   placeholder="Search Grandfather"
//                   isClearable
//                   styles={{
//                     control: (base) => ({
//                       ...base,
//                       borderRadius: '0.5rem',
//                       borderColor: '#d1d5db',
//                       '&:hover': {
//                         borderColor: '#d1d5db',
//                       },
//                     }),
//                   }}
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Grandmother</label>
//                 <Select
//                   options={memberOptions}
//                   value={memberOptions.find(opt => opt.value === formData.grandmother) || null}
//                   onChange={(opt) => handleSelectChange('grandmother', opt?.value)}
//                   placeholder="Search Grandmother"
//                   isClearable
//                   styles={{
//                     control: (base) => ({
//                       ...base,
//                       borderRadius: '0.5rem',
//                       borderColor: '#d1d5db',
//                       '&:hover': {
//                         borderColor: '#d1d5db',
//                       },
//                     }),
//                   }}
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Spouse</label>
//                 <Select
//                   options={memberOptions}
//                   value={memberOptions.find(opt => opt.value === formData.spouse) || null}
//                   onChange={(opt) => handleSelectChange('spouse', opt?.value)}
//                   placeholder="Search Spouse"
//                   isClearable
//                   styles={{
//                     control: (base) => ({
//                       ...base,
//                       borderRadius: '0.5rem',
//                       borderColor: '#d1d5db',
//                       '&:hover': {
//                         borderColor: '#d1d5db',
//                       },
//                     }),
//                   }}
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Guardian</label>
//                 <Select
//                   options={memberOptions}
//                   value={memberOptions.find(opt => opt.value === formData.guardian) || null}
//                   onChange={(opt) => handleSelectChange('guardian', opt?.value)}
//                   placeholder="Search Guardian"
//                   isClearable
//                   styles={{
//                     control: (base) => ({
//                       ...base,
//                       borderRadius: '0.5rem',
//                       borderColor: '#d1d5db',
//                       '&:hover': {
//                         borderColor: '#d1d5db',
//                       },
//                     }),
//                   }}
//                 />
//               </div>
//             </>
//           )}

//           {/* Identification */}
//           {activeTab === 'identification' && (
//             <>
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Citizenship Number</label>
//                 <input
//                   type="text"
//                   name="citizenshipNumber"
//                   value={formData.citizenshipNumber}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Citizenship #"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Citizenship Issue Date</label>
//                 <input
//                   type="date"
//                   name="citizenshipIssueDate"
//                   value={formData.citizenshipIssueDate}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Citizenship Issue District</label>
//                 <input
//                   type="text"
//                   name="citizenshipIssueDistrict"
//                   value={formData.citizenshipIssueDistrict}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="District"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">National ID Number</label>
//                 <input
//                   type="text"
//                   name="nationalIdNumber"
//                   value={formData.nationalIdNumber}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="NID #"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">NID Issue Date</label>
//                 <input
//                   type="date"
//                   name="nationalIdIssueDate"
//                   value={formData.nationalIdIssueDate}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                 />
//               </div>
//             </>
//           )}

//           {/* Passport & License */}
//           {activeTab === 'passport' && (
//             <>
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Passport Number</label>
//                 <input
//                   type="text"
//                   name="passportNumber"
//                   value={formData.passportNumber}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Passport #"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Passport Issue Date</label>
//                 <input
//                   type="date"
//                   name="passportIssueDate"
//                   value={formData.passportIssueDate}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Passport Expiry Date</label>
//                 <input
//                   type="date"
//                   name="passportExpiryDate"
//                   value={formData.passportExpiryDate}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Driving License Number</label>
//                 <input
//                   type="text"
//                   name="drivingLicenseNumber"
//                   value={formData.drivingLicenseNumber}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="DL #"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">DL Category</label>
//                 <input
//                   type="text"
//                   name="drivingLicenseCategory"
//                   value={formData.drivingLicenseCategory}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="A, B, C, etc."
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">DL Issue Date</label>
//                 <input
//                   type="date"
//                   name="drivingLicenseIssueDate"
//                   value={formData.drivingLicenseIssueDate}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">DL Expiry Date</label>
//                 <input
//                   type="date"
//                   name="drivingLicenseExpiryDate"
//                   value={formData.drivingLicenseExpiryDate}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                 />
//               </div>
//             </>
//           )}

//           {/* Documents */}
//           {activeTab === 'documents' && (
//             <>
//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Birth Certificate</label>
//                 <input
//                   type="text"
//                   name="birthCertificate"
//                   value={formData.birthCertificate}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Certificate #"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Marriage Certificate</label>
//                 <input
//                   type="text"
//                   name="marriageCertificate"
//                   value={formData.marriageCertificate}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Certificate #"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Death Certificate</label>
//                 <input
//                   type="text"
//                   name="deathCertificate"
//                   value={formData.deathCertificate}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Certificate #"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">PAN Card</label>
//                 <input
//                   type="text"
//                   name="panCard"
//                   value={formData.panCard}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="PAN #"
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Voter ID</label>
//                 <input
//                   type="text"
//                   name="voterId"
//                   value={formData.voterId}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Voter ID #"
//                 />
//               </div>
//             </>
//           )}

//           {/* Additional Information */}
//           {activeTab === 'additional' && (
//             <>
//               <div className="col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Biography</label>
//                 <textarea
//                   name="biography"
//                   value={formData.biography}
//                   onChange={handleChange}
//                   rows="4"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Write a brief biography..."
//                 />
//               </div>

//               <div className="col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
//                 <textarea
//                   name="notes"
//                   value={formData.notes}
//                   onChange={handleChange}
//                   rows="3"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Additional notes..."
//                 />
//               </div>

//               <div className="col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Special Remarks</label>
//                 <textarea
//                   name="specialRemarks"
//                   value={formData.specialRemarks}
//                   onChange={handleChange}
//                   rows="3"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Any special remarks..."
//                 />
//               </div>

//               <div className="col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Medical Notes</label>
//                 <textarea
//                   name="medicalNotes"
//                   value={formData.medicalNotes}
//                   onChange={handleChange}
//                   rows="3"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Medical information..."
//                 />
//               </div>

//               <div className="col-span-2">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Disability Information</label>
//                 <textarea
//                   name="disabilityInfo"
//                   value={formData.disabilityInfo}
//                   onChange={handleChange}
//                   rows="3"
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                   placeholder="Any disability information..."
//                 />
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
//                 <select
//                   name="status"
//                   value={formData.status}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                 >
//                   <option value="active">Active</option>
//                   <option value="inactive">Inactive</option>
//                   <option value="deceased">Deceased</option>
//                 </select>
//               </div>

//               <div className="col-span-1">
//                 <label className="block text-sm font-medium text-gray-700 mb-1">Verification Status</label>
//                 <select
//                   name="verificationStatus"
//                   value={formData.verificationStatus}
//                   onChange={handleChange}
//                   className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent transition"
//                 >
//                   <option value="verified">Verified</option>
//                   <option value="pending">Pending</option>
//                   <option value="rejected">Rejected</option>
//                 </select>
//               </div>
//             </>
//           )}
//         </div>
//       </div>

//       {/* Form Actions - Responsive */}
//       <div className="flex flex-col sm:flex-row justify-end gap-3 pt-4 border-t border-gray-200">
//         <Button
//           type="button"
//           variant="outline"
//           onClick={onCancel}
//           className="w-full sm:w-auto order-2 sm:order-1"
//         >
//           Cancel
//         </Button>
//         <Button
//           type="submit"
//           disabled={loading || createMutation.isLoading || updateMutation.isLoading}
//           className="w-full sm:w-auto order-1 sm:order-2"
//         >
//           {loading || createMutation.isLoading || updateMutation.isLoading ? (
//             <span className="flex items-center justify-center">
//               <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                 <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                 <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//               </svg>
//               Saving...
//             </span>
//           ) : (
//             member ? 'Update Member' : 'Create Member'
//           )}
//         </Button>
//       </div>
//     </form>
//   );
// };

// export default DataEntry;
// useMemo, useCallback 

// src/pages/DataEntry.jsx
// import React, { useState, useEffect } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { createMember, updateMember, getMembers } from '../api/members';
// import { getFamilies } from '../api/families';
// import toast from 'react-hot-toast';
// import { motion, AnimatePresence } from 'framer-motion';

// // Components
// import FloatingInput from '../components/FloatingInput';
// import SearchableSelect from '../components/SearchableSelect';
// import LocationSelect from '../components/LocationSelect';
// import ImageUpload from '../components/ImageUpload';
// import NepaliDatePickerComponent from '../components/NepaliDatePickerComponent';
// import Button from '../components/Button';

// // Data
// import { jobTitles, educationLevels, bloodGroups, maritalStatuses, relationships } from '../data/options';

// // Icons
// import { 
//   FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapPin, 
//   FaIdCard, FaBriefcase, FaGraduationCap, FaHeart, 
//   FaUsers, FaAddressCard, FaPassport, FaCar, FaFile,
//   FaInfoCircle, FaSave, FaTimes, FaCamera, FaUpload,
//   FaChevronLeft, FaChevronRight, FaImage, FaPlus, FaTrash
// } from 'react-icons/fa';
// import { PiGenderIntersexBold } from 'react-icons/pi';

// const DataEntry = ({ member, onSuccess, onCancel }) => {
//   const queryClient = useQueryClient();
//   const [activeTab, setActiveTab] = useState('personal');
//   const [loading, setLoading] = useState(false);

//   // Tab order for navigation
//   const tabOrder = ['personal', 'contact', 'family', 'identification', 'passport', 'documents', 'additional'];
//   const currentTabIndex = tabOrder.indexOf(activeTab);
//   const isLastTab = currentTabIndex === tabOrder.length - 1;
//   const isFirstTab = currentTabIndex === 0;

//   // Initial form data
//   const initialFormData = {
//     // Personal Information
//     name: '',
//     gender: 'male',
//     dob: '',
//     placeOfBirth: '',
//     bloodGroup: 'unknown',
//     maritalStatus: 'single',
//     isAlive: true,
//     dod: '',
//     occupation: '',
//     education: '',
//     religion: '',
//     casteEthnicity: '',
//     nationality: 'Nepali',

//     // Contact Information
//     phone: '',
//     alternatePhone: '',
//     email: '',

//     // Address Information
//     houseNumber: '',
//     wardNumber: '',
//     toleVillage: '',
//     municipality: '',
//     district: '',
//     province: '',
//     country: 'Nepal',
//     currentAddress: '',
//     permanentAddress: '',
//     postalCode: '',

//     // Family Information
//     family: '',
//     familyNumber: '',
//     rollNumber: '',
//     generation: 1,
//     relationship: 'member',
//     father: '',
//     mother: '',
//     grandfather: '',
//     grandmother: '',
//     spouse: '',
//     guardian: '',
//     familyContact: '',

//     // Identification
//     citizenshipNumber: '',
//     citizenshipIssueDate: '',
//     citizenshipIssueDistrict: '',
//     nationalIdNumber: '',
//     nationalIdIssueDate: '',

//     // Passport
//     passportNumber: '',
//     passportIssueDate: '',
//     passportExpiryDate: '',

//     // Driving License
//     drivingLicenseNumber: '',
//     drivingLicenseCategory: '',
//     drivingLicenseIssueDate: '',
//     drivingLicenseExpiryDate: '',

//     // Documents
//     birthCertificate: '',
//     marriageCertificate: '',
//     deathCertificate: '',
//     panCard: '',
//     voterId: '',

//     // Additional Information
//     biography: '',
//     notes: '',
//     specialRemarks: '',
//     medicalNotes: '',
//     disabilityInfo: '',

//     // Status
//     status: 'active',
//     verificationStatus: 'pending',
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [photos, setPhotos] = useState({
//     photo: null,
//     photoPreview: '',
//     citizenshipFront: null,
//     citizenshipFrontPreview: '',
//     citizenshipBack: null,
//     citizenshipBackPreview: '',
//     nationalIdFront: null,
//     nationalIdFrontPreview: '',
//     passportPhoto: null,
//     passportPhotoPreview: '',
//     drivingLicensePhoto: null,
//     drivingLicensePhotoPreview: '',
//   });

//   // Document upload state
//   const [documents, setDocuments] = useState({
//     birthCertificate: null,
//     marriageCertificate: null,
//     deathCertificate: null,
//     panCard: null,
//     voterId: null,
//   });

//   // Fetch families data
//   const { data: familiesData } = useQuery({
//     queryKey: ['families'],
//     queryFn: () => getFamilies({ limit: 1000 }),
//     staleTime: 5 * 60 * 1000,
//   });

//   // Fetch members data for dropdowns
//   const { data: membersData } = useQuery({
//     queryKey: ['members-dropdown'],
//     queryFn: () => getMembers({ limit: 1000 }),
//     staleTime: 5 * 60 * 1000,
//   });

//   // Mutations
//   const createMutation = useMutation({
//     mutationFn: createMember,
//     onSuccess: () => {
//       toast.success('Member created successfully');
//       queryClient.invalidateQueries({ queryKey: ['members'] });
//       queryClient.invalidateQueries({ queryKey: ['members-dropdown'] });
//       queryClient.invalidateQueries({ queryKey: ['families'] });
//       queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
//       onSuccess?.();
//       resetForm();
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || 'Failed to create member');
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ id, data }) => updateMember(id, data),
//     onSuccess: () => {
//       toast.success('Member updated successfully');
//       queryClient.invalidateQueries({ queryKey: ['members'] });
//       queryClient.invalidateQueries({ queryKey: ['members-dropdown'] });
//       queryClient.invalidateQueries({ queryKey: ['families'] });
//       queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
//       onSuccess?.();
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || 'Failed to update member');
//     },
//   });

//   // Populate form when editing - FIXED: Now populates ALL fields
//   useEffect(() => {
//     if (member) {
//       // Populate all form fields from member object
//       const populatedData = { ...initialFormData };
      
//       // Handle nested objects (like family, father, mother, spouse, etc.)
//       const fieldsToPopulate = { ...member };
      
//       // Convert nested objects to their IDs for dropdown selects
//       if (member.family && typeof member.family === 'object') {
//         fieldsToPopulate.family = member.family._id || '';
//       }
//       if (member.father && typeof member.father === 'object') {
//         fieldsToPopulate.father = member.father._id || '';
//       }
//       if (member.mother && typeof member.mother === 'object') {
//         fieldsToPopulate.mother = member.mother._id || '';
//       }
//       if (member.grandfather && typeof member.grandfather === 'object') {
//         fieldsToPopulate.grandfather = member.grandfather._id || '';
//       }
//       if (member.grandmother && typeof member.grandmother === 'object') {
//         fieldsToPopulate.grandmother = member.grandmother._id || '';
//       }
//       if (member.spouse && typeof member.spouse === 'object') {
//         fieldsToPopulate.spouse = member.spouse._id || '';
//       }
//       if (member.guardian && typeof member.guardian === 'object') {
//         fieldsToPopulate.guardian = member.guardian._id || '';
//       }

//       // Merge with member data, ensuring we don't overwrite with undefined
//       Object.keys(fieldsToPopulate).forEach(key => {
//         if (fieldsToPopulate[key] !== undefined && fieldsToPopulate[key] !== null) {
//           populatedData[key] = fieldsToPopulate[key];
//         }
//       });

//       setFormData(populatedData);

//       // Populate photos - FIXED: Properly set previews without overwriting
//       setPhotos(prev => ({
//         ...prev,
//         photoPreview: member.photo || '',
//         citizenshipFrontPreview: member.citizenshipFront || '',
//         citizenshipBackPreview: member.citizenshipBack || '',
//         nationalIdFrontPreview: member.nationalIdFront || '',
//         passportPhotoPreview: member.passportPhoto || '',
//         drivingLicensePhotoPreview: member.drivingLicensePhoto || '',
//       }));
//     }
//   }, [member]);

//   const resetForm = () => {
//     // Clean up any object URLs to prevent memory leaks
//     Object.values(photos).forEach(value => {
//       if (typeof value === 'string' && value.startsWith('blob:')) {
//         URL.revokeObjectURL(value);
//       }
//     });

//     setFormData(initialFormData);
//     setPhotos({
//       photo: null,
//       photoPreview: '',
//       citizenshipFront: null,
//       citizenshipFrontPreview: '',
//       citizenshipBack: null,
//       citizenshipBackPreview: '',
//       nationalIdFront: null,
//       nationalIdFrontPreview: '',
//       passportPhoto: null,
//       passportPhotoPreview: '',
//       drivingLicensePhoto: null,
//       drivingLicensePhotoPreview: '',
//     });
//     setDocuments({
//       birthCertificate: null,
//       marriageCertificate: null,
//       deathCertificate: null,
//       panCard: null,
//       voterId: null,
//     });
//     setActiveTab('personal');
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//   };

//   const handleSelectChange = (name, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value || '',
//     }));
//   };

//   const handlePhotoUpload = (type, file) => {
//     if (!file) return;
    
//     // Clean up existing blob URL if it exists
//     const existingPreview = photos[`${type}Preview`];
//     if (typeof existingPreview === 'string' && existingPreview.startsWith('blob:')) {
//       URL.revokeObjectURL(existingPreview);
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPhotos((prev) => ({
//         ...prev,
//         [type]: file,
//         [`${type}Preview`]: reader.result,
//       }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const handlePhotoRemove = (type) => {
//     // Clean up blob URL to prevent memory leak
//     const preview = photos[`${type}Preview`];
//     if (typeof preview === 'string' && preview.startsWith('blob:')) {
//       URL.revokeObjectURL(preview);
//     }

//     setPhotos((prev) => ({
//       ...prev,
//       [type]: null,
//       [`${type}Preview`]: '',
//     }));
//   };

//   // FIXED: Handle image selection with proper preview
//   const handleImageSelect = (type, file, preview) => {
//     // Clean up existing blob URL
//     const existingPreview = photos[`${type}Preview`];
//     if (typeof existingPreview === 'string' && existingPreview.startsWith('blob:')) {
//       URL.revokeObjectURL(existingPreview);
//     }

//     setPhotos((prev) => ({
//       ...prev,
//       [type]: file,
//       [`${type}Preview`]: preview || (file ? URL.createObjectURL(file) : ''),
//     }));
//   };

//   // FIXED: Handle document upload
//   const handleDocumentUpload = (type, file) => {
//     setDocuments(prev => ({
//       ...prev,
//       [type]: file
//     }));
//   };

//   // Validation function
//   const validateForm = () => {
//   const errors = [];

//   if (!formData.name?.trim()) {
//     errors.push('Full Name is required');
//   }

//   if (!formData.gender) {
//     errors.push('Gender is required');
//   }

//   if (!formData.dob) {
//     errors.push('Date of Birth is required');
//   }

//   if (!formData.phone?.trim()) {
//     errors.push('Phone number is required');
//   }

//   // Email validation if provided
//   if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
//     errors.push('Invalid email format');
//   }

//   // FAMILY VALIDATION: Either family OR relationship with existing member
//   const hasFamily = !!formData.family;
  
//   const hasRelationship = [
//     formData.father,
//     formData.mother,
//     formData.grandfather,
//     formData.grandmother,
//     formData.spouse,
//     formData.guardian,
//   ].some(Boolean);

//   if (!hasFamily && !hasRelationship) {
//     errors.push(
//       'Please select a Family OR connect this member with an existing family member (Father, Mother, Spouse, Guardian, etc.)'
//     );
//   }

//   return errors;
// };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     const validationErrors = validateForm();
//     if (validationErrors.length > 0) {
//       validationErrors.forEach(error => toast.error(error));
//       return;
//     }

//     setLoading(true);

//     try {
//       const submitData = new FormData();
      
//       // Append form data - FIXED: Handle number and boolean properly
//       Object.keys(formData).forEach((key) => {
//         const value = formData[key];
//         if (value !== undefined && value !== null && value !== '') {
//           if (key === 'generation') {
//             submitData.append(key, Number(value));
//           } else if (typeof value === 'boolean') {
//             submitData.append(key, String(value));
//           } else if (typeof value === 'object' && value._id) {
//             submitData.append(key, value._id);
//           } else {
//             submitData.append(key, value);
//           }
//         }
//       });

//       // Append photos
//       const photoFields = [
//         'photo', 'citizenshipFront', 'citizenshipBack', 
//         'nationalIdFront', 'passportPhoto', 'drivingLicensePhoto'
//       ];
      
//       photoFields.forEach(field => {
//         if (photos[field] && photos[field] instanceof File) {
//           submitData.append(field, photos[field]);
//         }
//       });

//       // FIXED: Append documents
//       Object.entries(documents).forEach(([key, file]) => {
//         if (file && file instanceof File) {
//           submitData.append(key, file);
//         }
//       });

//       if (member) {
//         await updateMutation.mutateAsync({ id: member._id, data: submitData });
//         resetForm();
//       } else {
//         await createMutation.mutateAsync(submitData);
//       }
//     } catch (error) {
//       console.error('Submit error:', error);
//       toast.error(error.response?.data?.message || 'Failed to save member');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const goToNextTab = () => {
//     const nextIndex = currentTabIndex + 1;
//     if (nextIndex < tabOrder.length) {
//       setActiveTab(tabOrder[nextIndex]);
//     }
//   };

//   const goToPrevTab = () => {
//     const prevIndex = currentTabIndex - 1;
//     if (prevIndex >= 0) {
//       setActiveTab(tabOrder[prevIndex]);
//     }
//   };

//   // Tab configuration
//   const tabs = [
//     { id: 'personal', label: 'Personal Info', icon: FaUser },
//     { id: 'contact', label: 'Contact & Address', icon: FaAddressCard },
//     { id: 'family', label: 'Family', icon: FaUsers },
//     { id: 'identification', label: 'ID Cards', icon: FaIdCard },
//     { id: 'passport', label: 'Passport & License', icon: FaPassport },
//     { id: 'documents', label: 'Documents', icon: FaFile },
//     { id: 'additional', label: 'Additional', icon: FaInfoCircle },
//   ];

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'personal':
//         return renderPersonalInfo();
//       case 'contact':
//         return renderContactAddress();
//       case 'family':
//         return renderFamilyInfo();
//       case 'identification':
//         return renderIdentification();
//       case 'passport':
//         return renderPassportLicense();
//       case 'documents':
//         return renderDocuments();
//       case 'additional':
//         return renderAdditionalInfo();
//       default:
//         return null;
//     }
//   };

//   // Photo Upload Component Renderer - FIXED: Better cleanup
//   const renderPhotoUpload = (type, label, preview, required = false, size = 'md') => {
//     const sizeClasses = {
//       sm: 'w-32 h-32',
//       md: 'w-40 h-40',
//       lg: 'w-48 h-48',
//       xl: 'w-56 h-56',
//     };

//     return (
//       <div className="flex flex-col items-center">
//         {preview ? (
//           <div className="relative group">
//             <div className={`${sizeClasses[size]} rounded-xl overflow-hidden border-2 border-green-200 shadow-md hover:shadow-lg transition-all duration-300`}>
//               <img src={preview} alt={label} className="w-full h-full object-cover" />
//             </div>
//             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
//               <button
//                 type="button"
//                 onClick={() => handlePhotoRemove(type)}
//                 className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
//                 title="Remove photo"
//               >
//                 <FaTrash className="h-5 w-5 text-red-500" />
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className={`${sizeClasses[size]}`}>
//             <ImageUpload
//               onImageSelect={(file, preview) => handleImageSelect(type, file, preview)}
//               label={label}
//               maxSize={5}
//             />
//           </div>
//         )}
//         {required && !preview && (
//           <span className="text-xs text-red-500 mt-1">* Required</span>
//         )}
//       </div>
//     );
//   };

//   const renderPersonalInfo = () => (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       {/* Left Column - Form Fields (2/3) */}
//       <div className="md:col-span-2 space-y-3">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div className="md:col-span-2">
//             <FloatingInput
//               label="Full Name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               icon={FaUser}
//             />
//           </div>
//           <SearchableSelect
//             label="Gender"
//             name="gender"
//             value={formData.gender}
//             onChange={handleSelectChange}
//             options={[
//               { value: 'male', label: 'Male' },
//               { value: 'female', label: 'Female' },
//               { value: 'other', label: 'Other' },
//             ]}
//             icon={PiGenderIntersexBold}
//           />
//           <NepaliDatePickerComponent
//             label="Date of Birth (BS)"
//             name="dob"
//             value={formData.dob}
//             onChange={handleSelectChange}
//           />
//           <FloatingInput
//             label="Place of Birth"
//             name="placeOfBirth"
//             value={formData.placeOfBirth}
//             onChange={handleChange}
//             icon={FaMapPin}
//           />
//           <SearchableSelect
//             label="Blood Group"
//             name="bloodGroup"
//             value={formData.bloodGroup}
//             onChange={handleSelectChange}
//             options={bloodGroups}
//           />
//           <SearchableSelect
//             label="Marital Status"
//             name="maritalStatus"
//             value={formData.maritalStatus}
//             onChange={handleSelectChange}
//             options={maritalStatuses}
//           />
//           <div className="md:col-span-2">
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="isAlive"
//                 checked={formData.isAlive}
//                 onChange={handleChange}
//                 className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//               />
//               <span className="text-sm text-gray-700">Is Alive</span>
//             </label>
//           </div>
//           {!formData.isAlive && (
//             <NepaliDatePickerComponent
//               label="Date of Death (BS)"
//               name="dod"
//               value={formData.dod}
//               onChange={handleSelectChange}
//             />
//           )}
//           <SearchableSelect
//             label="Occupation"
//             name="occupation"
//             value={formData.occupation}
//             onChange={handleSelectChange}
//             options={jobTitles}
//             creatable
//             placeholder="Search or enter occupation"
//           />
//           <SearchableSelect
//             label="Education"
//             name="education"
//             value={formData.education}
//             onChange={handleSelectChange}
//             options={educationLevels}
//             creatable
//             placeholder="Search or enter education"
//           />
//           <FloatingInput
//             label="Religion"
//             name="religion"
//             value={formData.religion}
//             onChange={handleChange}
//             icon={FaHeart}
//           />
//           <FloatingInput
//             label="Caste / Ethnicity"
//             name="casteEthnicity"
//             value={formData.casteEthnicity}
//             onChange={handleChange}
//             icon={FaUsers}
//           />
//           <FloatingInput
//             label="Nationality"
//             name="nationality"
//             value={formData.nationality}
//             onChange={handleChange}
//             icon={FaAddressCard}
//           />
//         </div>
//       </div>

//       {/* Right Column - Photo Upload (1/3) */}
//       <div className="md:col-span-1">
//         <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//           <div className="text-center mb-4">
//             <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
//               <FaCamera className="text-green-600 text-2xl" />
//             </div>
//             <h4 className="text-sm font-semibold text-green-800">Passport Photo</h4>
//             <p className="text-xs text-gray-500">2x2 inch, white background</p>
//           </div>
          
//           <div className="flex justify-center">
//             {renderPhotoUpload('photo', 'Photo', photos.photoPreview, true, 'xl')}
//           </div>
          
//           <div className="mt-3 flex justify-center gap-2 text-xs text-gray-400">
//             <span>PNG</span>
//             <span>•</span>
//             <span>JPG</span>
//             <span>•</span>
//             <span>JPEG</span>
//             <span>•</span>
//             <span>5MB</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderContactAddress = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//       <FloatingInput
//         label="Mobile Number"
//         name="phone"
//         value={formData.phone}
//         onChange={handleChange}
//         type="tel"
//         icon={FaPhone}
//         required
//       />
//       <FloatingInput
//         label="Alternate Mobile"
//         name="alternatePhone"
//         value={formData.alternatePhone}
//         onChange={handleChange}
//         type="tel"
//         icon={FaPhone}
//       />
//       <FloatingInput
//         label="Email"
//         name="email"
//         value={formData.email}
//         onChange={handleChange}
//         type="email"
//         icon={FaEnvelope}
//       />
//       <FloatingInput
//         label="House Number"
//         name="houseNumber"
//         value={formData.houseNumber}
//         onChange={handleChange}
//         icon={FaMapPin}
//       />
//       <LocationSelect
//         label="Province"
//         type="province"
//         value={formData.province}
//         onChange={(type, value) => handleSelectChange('province', value)}
//       />
//       <LocationSelect
//         label="District"
//         type="district"
//         province={formData.province}
//         value={formData.district}
//         onChange={(type, value) => handleSelectChange('district', value)}
//       />
//       <LocationSelect
//         label="Municipality"
//         type="municipality"
//         district={formData.district}
//         value={formData.municipality}
//         onChange={(type, value) => handleSelectChange('municipality', value)}
//       />
//       <FloatingInput
//         label="Tole / Village"
//         name="toleVillage"
//         value={formData.toleVillage}
//         onChange={handleChange}
//         icon={FaMapPin}
//       />
//       <LocationSelect
//         label="Ward"
//         type="ward"
//         value={formData.wardNumber}
//         onChange={(type, value) => handleSelectChange('wardNumber', value)}
//       />
//       <FloatingInput
//         label="Country"
//         name="country"
//         value={formData.country}
//         onChange={handleChange}
//         icon={FaMapPin}
//       />
//       <FloatingInput
//         label="Postal Code"
//         name="postalCode"
//         value={formData.postalCode}
//         onChange={handleChange}
//         icon={FaMapPin}
//       />
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Current Address"
//           name="currentAddress"
//           value={formData.currentAddress}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaMapPin}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Permanent Address"
//           name="permanentAddress"
//           value={formData.permanentAddress}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaMapPin}
//         />
//       </div>
//     </div>
//   );

//   const renderFamilyInfo = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//       <SearchableSelect
//         label="Family"
//         name="family"
//         value={formData.family}
//         onChange={handleSelectChange}
//         options={familyOptions}
//         placeholder="Search family..."
//       />
//       <FloatingInput
//         label="Family Number"
//         name="familyNumber"
//         value={formData.familyNumber}
//         onChange={handleChange}
//         icon={FaUsers}
//       />
//       <FloatingInput
//         label="Roll Number"
//         name="rollNumber"
//         value={formData.rollNumber}
//         onChange={handleChange}
//         icon={FaUsers}
//       />
//       <FloatingInput
//         label="Generation"
//         name="generation"
//         value={formData.generation}
//         onChange={handleChange}
//         type="number"
//         icon={FaUsers}
//       />
//       <SearchableSelect
//         label="Relationship"
//         name="relationship"
//         value={formData.relationship}
//         onChange={handleSelectChange}
//         options={relationships}
//       />
//       <FloatingInput
//         label="Family Contact"
//         name="familyContact"
//         value={formData.familyContact}
//         onChange={handleChange}
//         type="tel"
//         icon={FaPhone}
//       />
//       <SearchableSelect
//         label="Father"
//         name="father"
//         value={formData.father}
//         onChange={handleSelectChange}
//         options={memberOptions}
//         placeholder="Search father..."
//       />
//       <SearchableSelect
//         label="Mother"
//         name="mother"
//         value={formData.mother}
//         onChange={handleSelectChange}
//         options={memberOptions}
//         placeholder="Search mother..."
//       />
//       <SearchableSelect
//         label="Grandfather"
//         name="grandfather"
//         value={formData.grandfather}
//         onChange={handleSelectChange}
//         options={memberOptions}
//         placeholder="Search grandfather..."
//       />
//       <SearchableSelect
//         label="Grandmother"
//         name="grandmother"
//         value={formData.grandmother}
//         onChange={handleSelectChange}
//         options={memberOptions}
//         placeholder="Search grandmother..."
//       />
//       <SearchableSelect
//         label="Spouse"
//         name="spouse"
//         value={formData.spouse}
//         onChange={handleSelectChange}
//         options={memberOptions}
//         placeholder="Search spouse..."
//       />
//       <SearchableSelect
//         label="Guardian"
//         name="guardian"
//         value={formData.guardian}
//         onChange={handleSelectChange}
//         options={memberOptions}
//         placeholder="Search guardian..."
//       />
//     </div>
//   );

//   const renderIdentification = () => (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         <FloatingInput
//           label="Citizenship Number"
//           name="citizenshipNumber"
//           value={formData.citizenshipNumber}
//           onChange={handleChange}
//           icon={FaIdCard}
//         />
//         <NepaliDatePickerComponent
//           label="Citizenship Issue Date (BS)"
//           name="citizenshipIssueDate"
//           value={formData.citizenshipIssueDate}
//           onChange={handleSelectChange}
//         />
//         <LocationSelect
//           label="Citizenship Issue District"
//           type="district"
//           value={formData.citizenshipIssueDistrict}
//           onChange={(type, value) => handleSelectChange('citizenshipIssueDistrict', value)}
//         />
//         <FloatingInput
//           label="National ID Number"
//           name="nationalIdNumber"
//           value={formData.nationalIdNumber}
//           onChange={handleChange}
//           icon={FaIdCard}
//         />
//         <NepaliDatePickerComponent
//           label="NID Issue Date (BS)"
//           name="nationalIdIssueDate"
//           value={formData.nationalIdIssueDate}
//           onChange={handleSelectChange}
//         />
//       </div>
      
//       {/* Citizenship Document Uploads */}
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//           <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Citizenship Front</h5>
//           <div className="flex justify-center">
//             {renderPhotoUpload('citizenshipFront', 'Citizenship Front', photos.citizenshipFrontPreview, false, 'md')}
//           </div>
//         </div>
//         <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//           <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Citizenship Back</h5>
//           <div className="flex justify-center">
//             {renderPhotoUpload('citizenshipBack', 'Citizenship Back', photos.citizenshipBackPreview, false, 'md')}
//           </div>
//         </div>
//       </div>
      
//       {/* NID Document Upload */}
//       <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
//         <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 max-w-md mx-auto">
//           <h5 className="text-xs font-medium text-green-700 mb-2 text-center">National ID Front</h5>
//           <div className="flex justify-center">
//             {renderPhotoUpload('nationalIdFront', 'National ID Front', photos.nationalIdFrontPreview, false, 'md')}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderPassportLicense = () => (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         <FloatingInput
//           label="Passport Number"
//           name="passportNumber"
//           value={formData.passportNumber}
//           onChange={handleChange}
//           icon={FaPassport}
//         />
//         <NepaliDatePickerComponent
//           label="Passport Issue Date (BS)"
//           name="passportIssueDate"
//           value={formData.passportIssueDate}
//           onChange={handleSelectChange}
//         />
//         <NepaliDatePickerComponent
//           label="Passport Expiry Date (BS)"
//           name="passportExpiryDate"
//           value={formData.passportExpiryDate}
//           onChange={handleSelectChange}
//         />
//       </div>
      
//       {/* Passport Photo Upload */}
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 max-w-md mx-auto">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Passport Photo</h5>
//         <div className="flex justify-center">
//           {renderPhotoUpload('passportPhoto', 'Passport Photo', photos.passportPhotoPreview, false, 'lg')}
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         <FloatingInput
//           label="Driving License Number"
//           name="drivingLicenseNumber"
//           value={formData.drivingLicenseNumber}
//           onChange={handleChange}
//           icon={FaCar}
//         />
//         <FloatingInput
//           label="DL Category"
//           name="drivingLicenseCategory"
//           value={formData.drivingLicenseCategory}
//           onChange={handleChange}
//           icon={FaCar}
//         />
//         <NepaliDatePickerComponent
//           label="DL Issue Date (BS)"
//           name="drivingLicenseIssueDate"
//           value={formData.drivingLicenseIssueDate}
//           onChange={handleSelectChange}
//         />
//         <NepaliDatePickerComponent
//           label="DL Expiry Date (BS)"
//           name="drivingLicenseExpiryDate"
//           value={formData.drivingLicenseExpiryDate}
//           onChange={handleSelectChange}
//         />
//       </div>
      
//       {/* Driving License Photo Upload */}
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 max-w-md mx-auto">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Driving License Photo</h5>
//         <div className="flex justify-center">
//           {renderPhotoUpload('drivingLicensePhoto', 'Driving License Photo', photos.drivingLicensePhotoPreview, false, 'lg')}
//         </div>
//       </div>
//     </div>
//   );

//   // FIXED: Documents tab now properly handles uploads
//   const renderDocuments = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Birth Certificate</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('birthCertificate', file)}
//             label="Upload Birth Certificate"
//             maxSize={5}
//           />
//         </div>
//         {documents.birthCertificate && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Marriage Certificate</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('marriageCertificate', file)}
//             label="Upload Marriage Certificate"
//             maxSize={5}
//           />
//         </div>
//         {documents.marriageCertificate && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Death Certificate</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('deathCertificate', file)}
//             label="Upload Death Certificate"
//             maxSize={5}
//           />
//         </div>
//         {documents.deathCertificate && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">PAN Card</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('panCard', file)}
//             label="Upload PAN Card"
//             maxSize={5}
//           />
//         </div>
//         {documents.panCard && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 md:col-span-2 max-w-md mx-auto">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Voter ID</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('voterId', file)}
//             label="Upload Voter ID"
//             maxSize={5}
//           />
//         </div>
//         {documents.voterId && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//     </div>
//   );

//   const renderAdditionalInfo = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Biography"
//           name="biography"
//           value={formData.biography}
//           onChange={handleChange}
//           type="textarea"
//           rows={3}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Notes"
//           name="notes"
//           value={formData.notes}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Special Remarks"
//           name="specialRemarks"
//           value={formData.specialRemarks}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Medical Notes"
//           name="medicalNotes"
//           value={formData.medicalNotes}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Disability Information"
//           name="disabilityInfo"
//           value={formData.disabilityInfo}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <SearchableSelect
//         label="Status"
//         name="status"
//         value={formData.status}
//         onChange={handleSelectChange}
//         options={[
//           { value: 'active', label: 'Active' },
//           { value: 'inactive', label: 'Inactive' },
//           { value: 'deceased', label: 'Deceased' },
//         ]}
//       />
//       <SearchableSelect
//         label="Verification Status"
//         name="verificationStatus"
//         value={formData.verificationStatus}
//         onChange={handleSelectChange}
//         options={[
//           { value: 'verified', label: 'Verified' },
//           { value: 'pending', label: 'Pending' },
//           { value: 'rejected', label: 'Rejected' },
//         ]}
//       />
//     </div>
//   );

//   // FIXED: Better member options with family info
//   const memberOptions = (membersData?.data || []).map(m => ({
//     value: m._id,
//     label: `${m.name} (Family: ${m.familyNumber || 'N/A'}, Roll: ${m.rollNumber || 'N/A'})`,
//   }));

//   const familyOptions = (familiesData?.data || []).map(f => ({
//     value: f._id,
//     label: `${f.familyName} (${f.familyNumber})`,
//   }));

//   const isSubmitting = loading || createMutation.isLoading || updateMutation.isLoading;

//   return (
//     <>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 rounded-xl p-4 shadow-sm border border-green-100">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
//             <div>
//               <h2 className="text-xl md:text-2xl font-bold text-green-800 flex items-center gap-2">
//                 {member ? (
//                   <>
//                     <span>✏️</span> Edit Member
//                   </>
//                 ) : (
//                   <>
//                     <span>➕</span> Add New Member
//                   </>
//                 )}
//               </h2>
//               <p className="text-xs text-green-600 mt-0.5">
//                 {member ? 'Update member information' : 'Enter member details'} • Step {currentTabIndex + 1} of {tabOrder.length}
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
//                 {member ? 'Editing' : 'New'}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Progress Bar */}
//         <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
//           <div 
//             className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all duration-500"
//             style={{ width: `${((currentTabIndex + 1) / tabOrder.length) * 100}%` }}
//           />
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 gap-4">
//           {/* Tabs */}
//           <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
//             <div className="bg-green-50/30 px-3 pt-2 overflow-x-auto">
//               <div className="flex min-w-max gap-1">
//                 {tabs.map((tab) => (
//                   <button
//                     key={tab.id}
//                     type="button"
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`
//                       flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap
//                       transition-all duration-300 relative rounded-t-lg
//                       ${activeTab === tab.id
//                         ? 'text-green-700 bg-white shadow-sm'
//                         : 'text-gray-500 hover:text-green-600 hover:bg-green-50/50'
//                       }
//                     `}
//                   >
//                     <tab.icon className={`h-3.5 w-3.5 ${activeTab === tab.id ? 'text-green-600' : ''}`} />
//                     <span className="hidden sm:inline">{tab.label}</span>
//                     <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
//                     {activeTab === tab.id && (
//                       <motion.div
//                         layoutId="activeTab"
//                         className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500"
//                         transition={{ duration: 0.3 }}
//                       />
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Tab Content */}
//             <div className="p-3 md:p-4">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={activeTab}
//                   initial={{ opacity: 0, x: 10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -10 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   {renderTabContent()}
//                 </motion.div>
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* Navigation Buttons */}
//           <div className="bg-white rounded-xl shadow-sm border border-green-100 p-3">
//             <div className="flex flex-col sm:flex-row justify-between gap-2">
//               <div className="flex gap-2 order-2 sm:order-1">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={onCancel}
//                   size="sm"
//                   className="px-4"
//                 >
//                   <FaTimes className="mr-1.5 text-xs" />
//                   Cancel
//                 </Button>
//               </div>
//               <div className="flex gap-2 order-1 sm:order-2">
//                 {!isFirstTab && (
//                   <Button
//                     type="button"
//                     variant="secondary"
//                     onClick={goToPrevTab}
//                     size="sm"
//                     className="px-4"
//                   >
//                     <FaChevronLeft className="mr-1.5 text-xs" />
//                     Previous
//                   </Button>
//                 )}
//                 {isLastTab ? (
//                   <>
//                     <Button
//                       type="submit"
//                       disabled={isSubmitting}
//                       variant="primary"
//                       size="sm"
//                       className="px-5"
//                     >
//                       {isSubmitting ? (
//                         <span className="flex items-center">
//                           <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                             <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                             <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                           </svg>
//                           Saving...
//                         </span>
//                       ) : (
//                         <>
//                           <FaSave className="mr-1.5 text-xs" />
//                           {member ? 'Update Member' : 'Save Member'}
//                         </>
//                       )}
//                     </Button>
//                   </>
//                 ) : (
//                   <Button
//                     type="button"
//                     variant="primary"
//                     onClick={goToNextTab}
//                     size="sm"
//                     className="px-5"
//                   >
//                     Next
//                     <FaChevronRight className="ml-1.5 text-xs" />
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </form>
//     </>
//   );
// };

// export default DataEntry;
// src/pages/DataEntry.jsx - UPDATED COMPLETE FILE

// import React, { useState, useEffect } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { createMember, updateMember, getMembers } from '../api/members';
// import { getFamilies } from '../api/families';
// import toast from 'react-hot-toast';
// import { motion, AnimatePresence } from 'framer-motion';

// // Components
// import FloatingInput from '../components/FloatingInput';
// import SearchableSelect from '../components/SearchableSelect';
// import LocationSelect from '../components/LocationSelect';
// import ImageUpload from '../components/ImageUpload';
// import NepaliDatePickerComponent from '../components/NepaliDatePickerComponent';
// import Button from '../components/Button';

// // Data
// import { jobTitles, educationLevels, bloodGroups, maritalStatuses, relationships } from '../data/options';

// // Icons
// import { 
//   FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapPin, 
//   FaIdCard, FaBriefcase, FaGraduationCap, FaHeart, 
//   FaUsers, FaAddressCard, FaPassport, FaCar, FaFile,
//   FaInfoCircle, FaSave, FaTimes, FaCamera, FaUpload,
//   FaChevronLeft, FaChevronRight, FaImage, FaPlus, FaTrash,
//   FaHome, FaTree, FaChild
// } from 'react-icons/fa';
// import { PiGenderIntersexBold } from 'react-icons/pi';

// const DataEntry = ({ member, onSuccess, onCancel }) => {
//   const queryClient = useQueryClient();
//   const [activeTab, setActiveTab] = useState('personal');
//   const [loading, setLoading] = useState(false);
//   const [validationErrors, setValidationErrors] = useState({});

//   // Tab order for navigation
//   const tabOrder = ['personal', 'contact', 'family', 'identification', 'passport', 'documents', 'additional'];
//   const currentTabIndex = tabOrder.indexOf(activeTab);
//   const isLastTab = currentTabIndex === tabOrder.length - 1;
//   const isFirstTab = currentTabIndex === 0;

//   // Initial form data - Updated with required fields
//   const initialFormData = {
//     // Personal Information (Required)
//     name: '',
//     surname: '',
//     gender: 'male',
//     dob: '',
//     // Address (Required)
//     houseNumber: '',
//     district: '',
//     country: 'Nepal',
    
//     // Optional fields
//     placeOfBirth: '',
//     bloodGroup: 'unknown',
//     maritalStatus: 'single',
//     isAlive: true,
//     dod: '',
//     occupation: '',
//     education: '',
//     religion: '',
//     casteEthnicity: '',
//     nationality: 'Nepali',

//     // Contact Information
//     phone: '',
//     alternatePhone: '',
//     email: '',

//     // Address Information (Optional)
//     wardNumber: '',
//     toleVillage: '',
//     municipality: '',
//     province: '',
//     currentAddress: '',
//     permanentAddress: '',
//     postalCode: '',

//     // Family Information - UPDATED
//     houseNumber: '',
//     family: '',
//     familyNumber: '',
//     rollNumber: '',
//     vanshaGenerationNumber: '',
//     generation: 1,
//     relationship: 'member',
//     father: '',
//     mother: '',
//     grandfather: '',
//     grandmother: '',
//     spouse: '',
//     guardian: '',
//     childBirthOrder: '',
//     lineageRole: 'lineage_member',
//     familyContact: '',

//     // Identification
//     citizenshipNumber: '',
//     citizenshipIssueDate: '',
//     citizenshipIssueDistrict: '',
//     nationalIdNumber: '',
//     nationalIdIssueDate: '',

//     // Passport
//     passportNumber: '',
//     passportIssueDate: '',
//     passportExpiryDate: '',

//     // Driving License
//     drivingLicenseNumber: '',
//     drivingLicenseCategory: '',
//     drivingLicenseIssueDate: '',
//     drivingLicenseExpiryDate: '',

//     // Documents
//     birthCertificate: '',
//     marriageCertificate: '',
//     deathCertificate: '',
//     panCard: '',
//     voterId: '',

//     // Additional Information
//     biography: '',
//     notes: '',
//     specialRemarks: '',
//     medicalNotes: '',
//     disabilityInfo: '',

//     // Status
//     status: 'active',
//     verificationStatus: 'pending',
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [photos, setPhotos] = useState({
//     photo: null,
//     photoPreview: '',
//     citizenshipFront: null,
//     citizenshipFrontPreview: '',
//     citizenshipBack: null,
//     citizenshipBackPreview: '',
//     nationalIdFront: null,
//     nationalIdFrontPreview: '',
//     passportPhoto: null,
//     passportPhotoPreview: '',
//     drivingLicensePhoto: null,
//     drivingLicensePhotoPreview: '',
//   });

//   const [documents, setDocuments] = useState({
//     birthCertificate: null,
//     marriageCertificate: null,
//     deathCertificate: null,
//     panCard: null,
//     voterId: null,
//   });

//   // Fetch families data
//   const { data: familiesData } = useQuery({
//     queryKey: ['families'],
//     queryFn: () => getFamilies({ limit: 1000 }),
//     staleTime: 5 * 60 * 1000,
//   });

//   // Fetch members data for dropdowns
//   const { data: membersData } = useQuery({
//     queryKey: ['members-dropdown'],
//     queryFn: () => getMembers({ limit: 1000 }),
//     staleTime: 5 * 60 * 1000,
//   });

//   // Mutations
//   const createMutation = useMutation({
//     mutationFn: createMember,
//     onSuccess: () => {
//       toast.success('Member created successfully');
//       queryClient.invalidateQueries({ queryKey: ['members'] });
//       queryClient.invalidateQueries({ queryKey: ['members-dropdown'] });
//       queryClient.invalidateQueries({ queryKey: ['families'] });
//       queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
//       onSuccess?.();
//       resetForm();
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || 'Failed to create member');
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ id, data }) => updateMember(id, data),
//     onSuccess: () => {
//       toast.success('Member updated successfully');
//       queryClient.invalidateQueries({ queryKey: ['members'] });
//       queryClient.invalidateQueries({ queryKey: ['members-dropdown'] });
//       queryClient.invalidateQueries({ queryKey: ['families'] });
//       queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
//       onSuccess?.();
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || 'Failed to update member');
//     },
//   });

//   // Populate form when editing
//   useEffect(() => {
//     if (member) {
//       const populatedData = { ...initialFormData };
      
//       const fieldsToPopulate = { ...member };
      
//       if (member.family && typeof member.family === 'object') {
//         fieldsToPopulate.family = member.family._id || '';
//       }
//       if (member.father && typeof member.father === 'object') {
//         fieldsToPopulate.father = member.father._id || '';
//       }
//       if (member.mother && typeof member.mother === 'object') {
//         fieldsToPopulate.mother = member.mother._id || '';
//       }
//       if (member.grandfather && typeof member.grandfather === 'object') {
//         fieldsToPopulate.grandfather = member.grandfather._id || '';
//       }
//       if (member.grandmother && typeof member.grandmother === 'object') {
//         fieldsToPopulate.grandmother = member.grandmother._id || '';
//       }
//       if (member.spouse && typeof member.spouse === 'object') {
//         fieldsToPopulate.spouse = member.spouse._id || '';
//       }
//       if (member.guardian && typeof member.guardian === 'object') {
//         fieldsToPopulate.guardian = member.guardian._id || '';
//       }

//       Object.keys(fieldsToPopulate).forEach(key => {
//         if (fieldsToPopulate[key] !== undefined && fieldsToPopulate[key] !== null) {
//           populatedData[key] = fieldsToPopulate[key];
//         }
//       });

//       setFormData(populatedData);

//       setPhotos(prev => ({
//         ...prev,
//         photoPreview: member.photo || '',
//         citizenshipFrontPreview: member.citizenshipFront || '',
//         citizenshipBackPreview: member.citizenshipBack || '',
//         nationalIdFrontPreview: member.nationalIdFront || '',
//         passportPhotoPreview: member.passportPhoto || '',
//         drivingLicensePhotoPreview: member.drivingLicensePhoto || '',
//       }));
//     }
//   }, [member]);

//   const resetForm = () => {
//     Object.values(photos).forEach(value => {
//       if (typeof value === 'string' && value.startsWith('blob:')) {
//         URL.revokeObjectURL(value);
//       }
//     });

//     setFormData(initialFormData);
//     setPhotos({
//       photo: null,
//       photoPreview: '',
//       citizenshipFront: null,
//       citizenshipFrontPreview: '',
//       citizenshipBack: null,
//       citizenshipBackPreview: '',
//       nationalIdFront: null,
//       nationalIdFrontPreview: '',
//       passportPhoto: null,
//       passportPhotoPreview: '',
//       drivingLicensePhoto: null,
//       drivingLicensePhotoPreview: '',
//     });
//     setDocuments({
//       birthCertificate: null,
//       marriageCertificate: null,
//       deathCertificate: null,
//       panCard: null,
//       voterId: null,
//     });
//     setActiveTab('personal');
//     setValidationErrors({});
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//     // Clear validation error for this field
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleSelectChange = (name, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value || '',
//     }));
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handlePhotoUpload = (type, file) => {
//     if (!file) return;
    
//     const existingPreview = photos[`${type}Preview`];
//     if (typeof existingPreview === 'string' && existingPreview.startsWith('blob:')) {
//       URL.revokeObjectURL(existingPreview);
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPhotos((prev) => ({
//         ...prev,
//         [type]: file,
//         [`${type}Preview`]: reader.result,
//       }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const handlePhotoRemove = (type) => {
//     const preview = photos[`${type}Preview`];
//     if (typeof preview === 'string' && preview.startsWith('blob:')) {
//       URL.revokeObjectURL(preview);
//     }

//     setPhotos((prev) => ({
//       ...prev,
//       [type]: null,
//       [`${type}Preview`]: '',
//     }));
//   };

//   const handleImageSelect = (type, file, preview) => {
//     const existingPreview = photos[`${type}Preview`];
//     if (typeof existingPreview === 'string' && existingPreview.startsWith('blob:')) {
//       URL.revokeObjectURL(existingPreview);
//     }

//     setPhotos((prev) => ({
//       ...prev,
//       [type]: file,
//       [`${type}Preview`]: preview || (file ? URL.createObjectURL(file) : ''),
//     }));
//   };

//   const handleDocumentUpload = (type, file) => {
//     setDocuments(prev => ({
//       ...prev,
//       [type]: file
//     }));
//   };

//   // Validation function - Only required fields
//   const validateForm = () => {
//     const errors = {};
    
//     // Required fields
//     if (!formData.name?.trim()) {
//       errors.name = 'Full Name is required';
//     }
    
//     if (!formData.surname?.trim()) {
//       errors.surname = 'Surname is required';
//     }
    
//     if (!formData.gender) {
//       errors.gender = 'Gender is required';
//     }
    
//     if (!formData.dob) {
//       errors.dob = 'Date of Birth is required';
//     }
    
//     if (!formData.houseNumber?.trim()) {
//       errors.houseNumber = 'House Number is required';
//     }
    
//     if (!formData.district) {
//       errors.district = 'District is required';
//     }
    
//     if (!formData.country?.trim()) {
//       errors.country = 'Country is required';
//     }

//     // Check if photo is uploaded for new members
//     if (!member && !photos.photo && !photos.photoPreview) {
//       errors.photo = 'Passport photo is required';
//     }

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       // Show toast with error message
//       const errorMessages = Object.values(validationErrors);
//       errorMessages.forEach(msg => toast.error(msg));
//       // Switch to the tab with errors
//       if (validationErrors.name || validationErrors.surname || validationErrors.gender || validationErrors.dob || validationErrors.photo) {
//         setActiveTab('personal');
//       } else if (validationErrors.houseNumber || validationErrors.district || validationErrors.country) {
//         setActiveTab('contact');
//       }
//       return;
//     }

//     setLoading(true);

//     try {
//       const submitData = new FormData();
      
//       // Append form data
//       Object.keys(formData).forEach((key) => {
//         const value = formData[key];
//         if (value !== undefined && value !== null && value !== '') {
//           if (key === 'generation' || key === 'childBirthOrder') {
//             submitData.append(key, Number(value));
//           } else if (typeof value === 'boolean') {
//             submitData.append(key, String(value));
//           } else if (typeof value === 'object' && value._id) {
//             submitData.append(key, value._id);
//           } else {
//             submitData.append(key, value);
//           }
//         }
//       });

//       // Append photos
//       const photoFields = [
//         'photo', 'citizenshipFront', 'citizenshipBack', 
//         'nationalIdFront', 'passportPhoto', 'drivingLicensePhoto'
//       ];
      
//       photoFields.forEach(field => {
//         if (photos[field] && photos[field] instanceof File) {
//           submitData.append(field, photos[field]);
//         }
//       });

//       // Append documents
//       Object.entries(documents).forEach(([key, file]) => {
//         if (file && file instanceof File) {
//           submitData.append(key, file);
//         }
//       });

//       if (member) {
//         await updateMutation.mutateAsync({ id: member._id, data: submitData });
//         resetForm();
//       } else {
//         await createMutation.mutateAsync(submitData);
//       }
//     } catch (error) {
//       console.error('Submit error:', error);
//       toast.error(error.response?.data?.message || 'Failed to save member');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const goToNextTab = () => {
//     // Validate required fields before moving to next tab
//     if (activeTab === 'personal') {
//       const personalErrors = {};
//       if (!formData.name?.trim()) personalErrors.name = 'Full Name is required';
//       if (!formData.surname?.trim()) personalErrors.surname = 'Surname is required';
//       if (!formData.gender) personalErrors.gender = 'Gender is required';
//       if (!formData.dob) personalErrors.dob = 'Date of Birth is required';
//       if (!member && !photos.photo && !photos.photoPreview) personalErrors.photo = 'Passport photo is required';
      
//       if (Object.keys(personalErrors).length > 0) {
//         setValidationErrors(personalErrors);
//         Object.values(personalErrors).forEach(msg => toast.error(msg));
//         return;
//       }
//     }
    
//     if (activeTab === 'contact') {
//       const contactErrors = {};
//       if (!formData.houseNumber?.trim()) contactErrors.houseNumber = 'House Number is required';
//       if (!formData.district) contactErrors.district = 'District is required';
//       if (!formData.country?.trim()) contactErrors.country = 'Country is required';
      
//       if (Object.keys(contactErrors).length > 0) {
//         setValidationErrors(contactErrors);
//         Object.values(contactErrors).forEach(msg => toast.error(msg));
//         return;
//       }
//     }

//     const nextIndex = currentTabIndex + 1;
//     if (nextIndex < tabOrder.length) {
//       setActiveTab(tabOrder[nextIndex]);
//       setValidationErrors({});
//     }
//   };

//   const goToPrevTab = () => {
//     const prevIndex = currentTabIndex - 1;
//     if (prevIndex >= 0) {
//       setActiveTab(tabOrder[prevIndex]);
//       setValidationErrors({});
//     }
//   };

//   // Tab configuration
//   const tabs = [
//     { id: 'personal', label: 'Personal Info', icon: FaUser },
//     { id: 'contact', label: 'Contact & Address', icon: FaAddressCard },
//     { id: 'family', label: 'Family', icon: FaUsers },
//     { id: 'identification', label: 'ID Cards', icon: FaIdCard },
//     { id: 'passport', label: 'Passport & License', icon: FaPassport },
//     { id: 'documents', label: 'Documents', icon: FaFile },
//     { id: 'additional', label: 'Additional', icon: FaInfoCircle },
//   ];

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'personal':
//         return renderPersonalInfo();
//       case 'contact':
//         return renderContactAddress();
//       case 'family':
//         return renderFamilyInfo();
//       case 'identification':
//         return renderIdentification();
//       case 'passport':
//         return renderPassportLicense();
//       case 'documents':
//         return renderDocuments();
//       case 'additional':
//         return renderAdditionalInfo();
//       default:
//         return null;
//     }
//   };

//   // Photo Upload Component Renderer
//   const renderPhotoUpload = (type, label, preview, required = false, size = 'md') => {
//     const sizeClasses = {
//       sm: 'w-32 h-32',
//       md: 'w-40 h-40',
//       lg: 'w-48 h-48',
//       xl: 'w-56 h-56',
//     };

//     const hasError = validationErrors[type];

//     return (
//       <div className="flex flex-col items-center">
//         {preview ? (
//           <div className="relative group">
//             <div className={`${sizeClasses[size]} rounded-xl overflow-hidden border-2 ${hasError ? 'border-red-500' : 'border-green-200'} shadow-md hover:shadow-lg transition-all duration-300`}>
//               <img src={preview} alt={label} className="w-full h-full object-cover" />
//             </div>
//             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
//               <button
//                 type="button"
//                 onClick={() => handlePhotoRemove(type)}
//                 className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
//                 title="Remove photo"
//               >
//                 <FaTrash className="h-5 w-5 text-red-500" />
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className={`${sizeClasses[size]}`}>
//             <ImageUpload
//               onImageSelect={(file, preview) => handleImageSelect(type, file, preview)}
//               label={label}
//               maxSize={5}
//             />
//           </div>
//         )}
//         {required && !preview && (
//           <span className="text-xs text-red-500 mt-1">* Required</span>
//         )}
//         {hasError && (
//           <span className="text-xs text-red-500 mt-1">{validationErrors[type]}</span>
//         )}
//       </div>
//     );
//   };

//   const renderPersonalInfo = () => (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       <div className="md:col-span-2 space-y-3">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div className="md:col-span-2">
//             <FloatingInput
//               label="Full Name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               icon={FaUser}
//               error={validationErrors.name}
//             />
//           </div>
//           <div className="md:col-span-2">
//             <FloatingInput
//               label="Surname (Last Name)"
//               name="surname"
//               value={formData.surname}
//               onChange={handleChange}
//               required
//               icon={FaUser}
//               error={validationErrors.surname}
//             />
//           </div>
//           <SearchableSelect
//             label="Gender"
//             name="gender"
//             value={formData.gender}
//             onChange={handleSelectChange}
//             options={[
//               { value: 'male', label: 'Male' },
//               { value: 'female', label: 'Female' },
//               { value: 'other', label: 'Other' },
//             ]}
//             icon={PiGenderIntersexBold}
//             required
//             error={validationErrors.gender}
//           />
//           <NepaliDatePickerComponent
//             label="Date of Birth (BS)"
//             name="dob"
//             value={formData.dob}
//             onChange={handleSelectChange}
//             required
//             error={validationErrors.dob}
//           />
//           <FloatingInput
//             label="Place of Birth"
//             name="placeOfBirth"
//             value={formData.placeOfBirth}
//             onChange={handleChange}
//             icon={FaMapPin}
//           />
//           <SearchableSelect
//             label="Blood Group"
//             name="bloodGroup"
//             value={formData.bloodGroup}
//             onChange={handleSelectChange}
//             options={bloodGroups}
//           />
//           <SearchableSelect
//             label="Marital Status"
//             name="maritalStatus"
//             value={formData.maritalStatus}
//             onChange={handleSelectChange}
//             options={maritalStatuses}
//           />
//           <div className="md:col-span-2">
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="isAlive"
//                 checked={formData.isAlive}
//                 onChange={handleChange}
//                 className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//               />
//               <span className="text-sm text-gray-700">Is Alive</span>
//             </label>
//           </div>
//           {!formData.isAlive && (
//             <NepaliDatePickerComponent
//               label="Date of Death (BS)"
//               name="dod"
//               value={formData.dod}
//               onChange={handleSelectChange}
//             />
//           )}
//           <SearchableSelect
//             label="Occupation"
//             name="occupation"
//             value={formData.occupation}
//             onChange={handleSelectChange}
//             options={jobTitles}
//             creatable
//             placeholder="Search or enter occupation"
//           />
//           <SearchableSelect
//             label="Education"
//             name="education"
//             value={formData.education}
//             onChange={handleSelectChange}
//             options={educationLevels}
//             creatable
//             placeholder="Search or enter education"
//           />
//           <FloatingInput
//             label="Religion"
//             name="religion"
//             value={formData.religion}
//             onChange={handleChange}
//             icon={FaHeart}
//           />
//           <FloatingInput
//             label="Caste / Ethnicity"
//             name="casteEthnicity"
//             value={formData.casteEthnicity}
//             onChange={handleChange}
//             icon={FaUsers}
//           />
//           <FloatingInput
//             label="Nationality"
//             name="nationality"
//             value={formData.nationality}
//             onChange={handleChange}
//             icon={FaAddressCard}
//           />
//         </div>
//       </div>

//       <div className="md:col-span-1">
//         <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//           <div className="text-center mb-4">
//             <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
//               <FaCamera className="text-green-600 text-2xl" />
//             </div>
//             <h4 className="text-sm font-semibold text-green-800">Passport Photo</h4>
//             <p className="text-xs text-gray-500">2x2 inch, white background</p>
//           </div>
          
//           <div className="flex justify-center">
//             {renderPhotoUpload('photo', 'Photo', photos.photoPreview, true, 'xl')}
//           </div>
          
//           <div className="mt-3 flex justify-center gap-2 text-xs text-gray-400">
//             <span>PNG</span>
//             <span>•</span>
//             <span>JPG</span>
//             <span>•</span>
//             <span>JPEG</span>
//             <span>•</span>
//             <span>5MB</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderContactAddress = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//       <FloatingInput
//         label="Mobile Number"
//         name="phone"
//         value={formData.phone}
//         onChange={handleChange}
//         type="tel"
//         icon={FaPhone}
//       />
//       <FloatingInput
//         label="Alternate Mobile"
//         name="alternatePhone"
//         value={formData.alternatePhone}
//         onChange={handleChange}
//         type="tel"
//         icon={FaPhone}
//       />
//       <FloatingInput
//         label="Email"
//         name="email"
//         value={formData.email}
//         onChange={handleChange}
//         type="email"
//         icon={FaEnvelope}
//       />
//       <FloatingInput
//         label="House Number"
//         name="houseNumber"
//         value={formData.houseNumber}
//         onChange={handleChange}
//         icon={FaMapPin}
//         required
//         error={validationErrors.houseNumber}
//       />
//       <LocationSelect
//         label="Province"
//         type="province"
//         value={formData.province}
//         onChange={(type, value) => handleSelectChange('province', value)}
//       />
//       <LocationSelect
//         label="District"
//         type="district"
//         province={formData.province}
//         value={formData.district}
//         onChange={(type, value) => handleSelectChange('district', value)}
//         required
//         error={validationErrors.district}
//       />
//       <LocationSelect
//         label="Municipality"
//         type="municipality"
//         district={formData.district}
//         value={formData.municipality}
//         onChange={(type, value) => handleSelectChange('municipality', value)}
//       />
//       <FloatingInput
//         label="Tole / Village"
//         name="toleVillage"
//         value={formData.toleVillage}
//         onChange={handleChange}
//         icon={FaMapPin}
//       />
//       <LocationSelect
//         label="Ward"
//         type="ward"
//         value={formData.wardNumber}
//         onChange={(type, value) => handleSelectChange('wardNumber', value)}
//       />
//       <FloatingInput
//         label="Country"
//         name="country"
//         value={formData.country}
//         onChange={handleChange}
//         icon={FaMapPin}
//         required
//         error={validationErrors.country}
//       />
//       <FloatingInput
//         label="Postal Code"
//         name="postalCode"
//         value={formData.postalCode}
//         onChange={handleChange}
//         icon={FaMapPin}
//       />
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Current Address"
//           name="currentAddress"
//           value={formData.currentAddress}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaMapPin}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Permanent Address"
//           name="permanentAddress"
//           value={formData.permanentAddress}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaMapPin}
//         />
//       </div>
//     </div>
//   );

//   // UPDATED Family Information Section - Removed Auto/Manual buttons, added Nepali labels
//   const renderFamilyInfo = () => {
//     // Filter members by gender for relationship fields
//     const maleMembers = (membersData?.data || []).filter(m => m.gender === 'male');
//     const femaleMembers = (membersData?.data || []).filter(m => m.gender === 'female');
//     const allMembers = membersData?.data || [];

//     const familyOptions = (familiesData?.data || []).map(f => ({
//       value: f._id,
//       label: `${f.familyName} (${f.familyNumber}) - ${f.vanshaGenerationNumber || 'वंश: N/A'}`,
//     }));

//     const createMemberOptions = (members) => members.map(m => ({
//       value: m._id,
//       label: `${m.name}${m.surname ? ` ${m.surname}` : ''} (रोल: ${m.rollNumber || 'N/A'})`,
//     }));

//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         {/* House Number */}
//         <FloatingInput
//           label="घर नम्बर"
//           name="houseNumber"
//           value={formData.houseNumber}
//           onChange={handleChange}
//           icon={FaHome}
//           required
//           error={validationErrors.houseNumber}
//         />
        
//         <SearchableSelect
//           label="परिवार"
//           name="family"
//           value={formData.family}
//           onChange={handleSelectChange}
//           options={familyOptions}
//           placeholder="परिवार खोज्नुहोस्..."
//         />
        
//         <FloatingInput
//           label="परिवार नम्बर"
//           name="familyNumber"
//           value={formData.familyNumber}
//           onChange={handleChange}
//           icon={FaUsers}
//           disabled={true}
//         />

//         {/* Roll Number */}
//         <FloatingInput
//           label="रोल नम्बर"
//           name="rollNumber"
//           value={formData.rollNumber}
//           onChange={handleChange}
//           icon={FaUsers}
//           disabled={true}
//         />

//         {/* Vansha/Generation Number - REMOVED Auto/Manual buttons */}
//         <div className="md:col-span-2">
//           <FloatingInput
//             label="वंश / पुस्ता नम्बर"
//             name="vanshaGenerationNumber"
//             value={formData.vanshaGenerationNumber}
//             onChange={handleChange}
//             icon={FaTree}
//             placeholder="खाली छोड्नुहोस् स्वत: जेनेरेट हुनेछ"
//           />
//           <p className="text-xs text-gray-400 mt-1">
//             {!formData.vanshaGenerationNumber ? '💡 खाली छोड्नुहोस् - स्वत: नम्बर जेनेरेट हुनेछ' : '✏️ म्यानुअल नम्बर प्रयोग गरिँदै'}
//           </p>
//         </div>

//         <FloatingInput
//           label="पुस्ता"
//           name="generation"
//           value={formData.generation}
//           onChange={handleChange}
//           type="number"
//           icon={FaUsers}
//         />
        
//         <SearchableSelect
//           label="सम्बन्ध"
//           name="relationship"
//           value={formData.relationship}
//           onChange={handleSelectChange}
//           options={relationships}
//         />

//         <SearchableSelect
//           label="बुवा"
//           name="father"
//           value={formData.father}
//           onChange={handleSelectChange}
//           options={createMemberOptions(maleMembers)}
//           placeholder="बुवा खोज्नुहोस्..."
//         />
        
//         <SearchableSelect
//           label="आमा"
//           name="mother"
//           value={formData.mother}
//           onChange={handleSelectChange}
//           options={createMemberOptions(femaleMembers)}
//           placeholder="आमा खोज्नुहोस्..."
//         />
        
//         <SearchableSelect
//           label="हजुरबा"
//           name="grandfather"
//           value={formData.grandfather}
//           onChange={handleSelectChange}
//           options={createMemberOptions(maleMembers)}
//           placeholder="हजुरबा खोज्नुहोस्..."
//         />
        
//         <SearchableSelect
//           label="हजुरआमा"
//           name="grandmother"
//           value={formData.grandmother}
//           onChange={handleSelectChange}
//           options={createMemberOptions(femaleMembers)}
//           placeholder="हजुरआमा खोज्नुहोस्..."
//         />
        
//         <SearchableSelect
//           label="श्रीमान/श्रीमती"
//           name="spouse"
//           value={formData.spouse}
//           onChange={handleSelectChange}
//           options={createMemberOptions(allMembers)}
//           placeholder="श्रीमान/श्रीमती खोज्नुहोस्..."
//         />
        
//         <SearchableSelect
//           label="अभिभावक"
//           name="guardian"
//           value={formData.guardian}
//           onChange={handleSelectChange}
//           options={createMemberOptions(allMembers)}
//           placeholder="अभिभावक खोज्नुहोस्..."
//         />
        
//         <FloatingInput
//           label="सन्तान क्रम"
//           name="childBirthOrder"
//           value={formData.childBirthOrder}
//           onChange={handleChange}
//           type="number"
//           icon={FaChild}
//         />

//         <SearchableSelect
//           label="पुस्ताको भूमिका"
//           name="lineageRole"
//           value={formData.lineageRole}
//           onChange={handleSelectChange}
//           options={[
//             { value: 'lineage_head', label: 'घरमुली' },
//             { value: 'lineage_member', label: 'सदस्य' },
//             { value: 'spouse', label: 'श्रीमान/श्रीमती' },
//             { value: 'other', label: 'अन्य' },
//           ]}
//         />

//         <FloatingInput
//           label="परिवार सम्पर्क"
//           name="familyContact"
//           value={formData.familyContact}
//           onChange={handleChange}
//           type="tel"
//           icon={FaPhone}
//         />
//       </div>
//     );
//   };

//   const renderIdentification = () => (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         <FloatingInput
//           label="Citizenship Number"
//           name="citizenshipNumber"
//           value={formData.citizenshipNumber}
//           onChange={handleChange}
//           icon={FaIdCard}
//         />
//         <NepaliDatePickerComponent
//           label="Citizenship Issue Date (BS)"
//           name="citizenshipIssueDate"
//           value={formData.citizenshipIssueDate}
//           onChange={handleSelectChange}
//         />
//         <LocationSelect
//           label="Citizenship Issue District"
//           type="district"
//           value={formData.citizenshipIssueDistrict}
//           onChange={(type, value) => handleSelectChange('citizenshipIssueDistrict', value)}
//         />
//         <FloatingInput
//           label="National ID Number"
//           name="nationalIdNumber"
//           value={formData.nationalIdNumber}
//           onChange={handleChange}
//           icon={FaIdCard}
//         />
//         <NepaliDatePickerComponent
//           label="NID Issue Date (BS)"
//           name="nationalIdIssueDate"
//           value={formData.nationalIdIssueDate}
//           onChange={handleSelectChange}
//         />
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//           <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Citizenship Front</h5>
//           <div className="flex justify-center">
//             {renderPhotoUpload('citizenshipFront', 'Citizenship Front', photos.citizenshipFrontPreview, false, 'md')}
//           </div>
//         </div>
//         <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//           <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Citizenship Back</h5>
//           <div className="flex justify-center">
//             {renderPhotoUpload('citizenshipBack', 'Citizenship Back', photos.citizenshipBackPreview, false, 'md')}
//           </div>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
//         <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 max-w-md mx-auto">
//           <h5 className="text-xs font-medium text-green-700 mb-2 text-center">National ID Front</h5>
//           <div className="flex justify-center">
//             {renderPhotoUpload('nationalIdFront', 'National ID Front', photos.nationalIdFrontPreview, false, 'md')}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderPassportLicense = () => (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         <FloatingInput
//           label="Passport Number"
//           name="passportNumber"
//           value={formData.passportNumber}
//           onChange={handleChange}
//           icon={FaPassport}
//         />
//         <NepaliDatePickerComponent
//           label="Passport Issue Date (BS)"
//           name="passportIssueDate"
//           value={formData.passportIssueDate}
//           onChange={handleSelectChange}
//         />
//         <NepaliDatePickerComponent
//           label="Passport Expiry Date (BS)"
//           name="passportExpiryDate"
//           value={formData.passportExpiryDate}
//           onChange={handleSelectChange}
//         />
//       </div>
      
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 max-w-md mx-auto">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Passport Photo</h5>
//         <div className="flex justify-center">
//           {renderPhotoUpload('passportPhoto', 'Passport Photo', photos.passportPhotoPreview, false, 'lg')}
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         <FloatingInput
//           label="Driving License Number"
//           name="drivingLicenseNumber"
//           value={formData.drivingLicenseNumber}
//           onChange={handleChange}
//           icon={FaCar}
//         />
//         <FloatingInput
//           label="DL Category"
//           name="drivingLicenseCategory"
//           value={formData.drivingLicenseCategory}
//           onChange={handleChange}
//           icon={FaCar}
//         />
//         <NepaliDatePickerComponent
//           label="DL Issue Date (BS)"
//           name="drivingLicenseIssueDate"
//           value={formData.drivingLicenseIssueDate}
//           onChange={handleSelectChange}
//         />
//         <NepaliDatePickerComponent
//           label="DL Expiry Date (BS)"
//           name="drivingLicenseExpiryDate"
//           value={formData.drivingLicenseExpiryDate}
//           onChange={handleSelectChange}
//         />
//       </div>
      
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 max-w-md mx-auto">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Driving License Photo</h5>
//         <div className="flex justify-center">
//           {renderPhotoUpload('drivingLicensePhoto', 'Driving License Photo', photos.drivingLicensePhotoPreview, false, 'lg')}
//         </div>
//       </div>
//     </div>
//   );

//   const renderDocuments = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Birth Certificate</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('birthCertificate', file)}
//             label="Upload Birth Certificate"
//             maxSize={5}
//           />
//         </div>
//         {documents.birthCertificate && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Marriage Certificate</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('marriageCertificate', file)}
//             label="Upload Marriage Certificate"
//             maxSize={5}
//           />
//         </div>
//         {documents.marriageCertificate && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Death Certificate</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('deathCertificate', file)}
//             label="Upload Death Certificate"
//             maxSize={5}
//           />
//         </div>
//         {documents.deathCertificate && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">PAN Card</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('panCard', file)}
//             label="Upload PAN Card"
//             maxSize={5}
//           />
//         </div>
//         {documents.panCard && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 md:col-span-2 max-w-md mx-auto">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Voter ID</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('voterId', file)}
//             label="Upload Voter ID"
//             maxSize={5}
//           />
//         </div>
//         {documents.voterId && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//     </div>
//   );

//   const renderAdditionalInfo = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Biography"
//           name="biography"
//           value={formData.biography}
//           onChange={handleChange}
//           type="textarea"
//           rows={3}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Notes"
//           name="notes"
//           value={formData.notes}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Special Remarks"
//           name="specialRemarks"
//           value={formData.specialRemarks}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Medical Notes"
//           name="medicalNotes"
//           value={formData.medicalNotes}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Disability Information"
//           name="disabilityInfo"
//           value={formData.disabilityInfo}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <SearchableSelect
//         label="Status"
//         name="status"
//         value={formData.status}
//         onChange={handleSelectChange}
//         options={[
//           { value: 'active', label: 'Active' },
//           { value: 'inactive', label: 'Inactive' },
//           { value: 'deceased', label: 'Deceased' },
//         ]}
//       />
//       <SearchableSelect
//         label="Verification Status"
//         name="verificationStatus"
//         value={formData.verificationStatus}
//         onChange={handleSelectChange}
//         options={[
//           { value: 'verified', label: 'Verified' },
//           { value: 'pending', label: 'Pending' },
//           { value: 'rejected', label: 'Rejected' },
//         ]}
//       />
//     </div>
//   );

//   const isSubmitting = loading || createMutation.isLoading || updateMutation.isLoading;

//   return (
//     <>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 rounded-xl p-4 shadow-sm border border-green-100">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
//             <div>
//               <h2 className="text-xl md:text-2xl font-bold text-green-800 flex items-center gap-2">
//                 {member ? (
//                   <>
//                     <span>✏️</span> Edit Member
//                   </>
//                 ) : (
//                   <>
//                     <span>➕</span> Add New Member
//                   </>
//                 )}
//               </h2>
//               <p className="text-xs text-green-600 mt-0.5">
//                 {member ? 'Update member information' : 'Enter member details'} • Step {currentTabIndex + 1} of {tabOrder.length}
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
//                 {member ? 'Editing' : 'New'}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Progress Bar */}
//         <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
//           <div 
//             className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all duration-500"
//             style={{ width: `${((currentTabIndex + 1) / tabOrder.length) * 100}%` }}
//           />
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 gap-4">
//           {/* Tabs */}
//           <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
//             <div className="bg-green-50/30 px-3 pt-2 overflow-x-auto">
//               <div className="flex min-w-max gap-1">
//                 {tabs.map((tab) => (
//                   <button
//                     key={tab.id}
//                     type="button"
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`
//                       flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap
//                       transition-all duration-300 relative rounded-t-lg
//                       ${activeTab === tab.id
//                         ? 'text-green-700 bg-white shadow-sm'
//                         : 'text-gray-500 hover:text-green-600 hover:bg-green-50/50'
//                       }
//                     `}
//                   >
//                     <tab.icon className={`h-3.5 w-3.5 ${activeTab === tab.id ? 'text-green-600' : ''}`} />
//                     <span className="hidden sm:inline">{tab.label}</span>
//                     <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
//                     {activeTab === tab.id && (
//                       <motion.div
//                         layoutId="activeTab"
//                         className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500"
//                         transition={{ duration: 0.3 }}
//                       />
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Tab Content */}
//             <div className="p-3 md:p-4">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={activeTab}
//                   initial={{ opacity: 0, x: 10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -10 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   {renderTabContent()}
//                 </motion.div>
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* Navigation Buttons */}
//           <div className="bg-white rounded-xl shadow-sm border border-green-100 p-3">
//             <div className="flex flex-col sm:flex-row justify-between gap-2">
//               <div className="flex gap-2 order-2 sm:order-1">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={onCancel}
//                   size="sm"
//                   className="px-4"
//                 >
//                   <FaTimes className="mr-1.5 text-xs" />
//                   Cancel
//                 </Button>
//               </div>
//               <div className="flex gap-2 order-1 sm:order-2">
//                 {!isFirstTab && (
//                   <Button
//                     type="button"
//                     variant="secondary"
//                     onClick={goToPrevTab}
//                     size="sm"
//                     className="px-4"
//                   >
//                     <FaChevronLeft className="mr-1.5 text-xs" />
//                     Previous
//                   </Button>
//                 )}
//                 {isLastTab ? (
//                   <Button
//                     type="submit"
//                     disabled={isSubmitting}
//                     variant="primary"
//                     size="sm"
//                     className="px-5"
//                   >
//                     {isSubmitting ? (
//                       <span className="flex items-center">
//                         <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Saving...
//                       </span>
//                     ) : (
//                       <>
//                         <FaSave className="mr-1.5 text-xs" />
//                         {member ? 'Update Member' : 'Save Member'}
//                       </>
//                     )}
//                   </Button>
//                 ) : (
//                   <Button
//                     type="button"
//                     variant="primary"
//                     onClick={goToNextTab}
//                     size="sm"
//                     className="px-5"
//                   >
//                     Next
//                     <FaChevronRight className="ml-1.5 text-xs" />
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </form>
//     </>
//   );
// };

// export default DataEntry;


// // src/pages/DataEntry.jsx - UPDATED with Family Add Form

// import React, { useState, useEffect } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { createMember, updateMember, getMembers } from '../api/members';
// import { getFamilies, createFamily, updateFamily } from '../api/families'; // ⭐ Added family APIs
// import toast from 'react-hot-toast';
// import { motion, AnimatePresence } from 'framer-motion';

// // Components
// import FloatingInput from '../components/FloatingInput';
// import SearchableSelect from '../components/SearchableSelect';
// import LocationSelect from '../components/LocationSelect';
// import ImageUpload from '../components/ImageUpload';
// import NepaliDatePickerComponent from '../components/NepaliDatePickerComponent';
// import Button from '../components/Button';
// import Modal from '../components/Modal'; // ⭐ Added Modal

// // Data
// import { jobTitles, educationLevels, bloodGroups, maritalStatuses, relationships } from '../data/options';

// // Icons
// import { 
//   FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapPin, 
//   FaIdCard, FaBriefcase, FaGraduationCap, FaHeart, 
//   FaUsers, FaAddressCard, FaPassport, FaCar, FaFile,
//   FaInfoCircle, FaSave, FaTimes, FaCamera, FaUpload,
//   FaChevronLeft, FaChevronRight, FaImage, FaPlus, FaTrash,
//   FaHome, FaTree, FaChild, FaBuilding
// } from 'react-icons/fa';
// import { PiGenderIntersexBold } from 'react-icons/pi';

// const DataEntry = ({ member, onSuccess, onCancel }) => {
//   const queryClient = useQueryClient();
//   const [activeTab, setActiveTab] = useState('personal');
//   const [loading, setLoading] = useState(false);
//   const [validationErrors, setValidationErrors] = useState({});
//   const [showFamilyForm, setShowFamilyForm] = useState(false); // ⭐ NEW: Toggle family form
//   const [familyFormData, setFamilyFormData] = useState({ // ⭐ NEW: Family form data
//     familyName: '',
//     familyNumber: '',
//     houseNumber: '',
//     vanshaGenerationNumber: '',
//     familyHead: '',
//     status: 'open',
//   });

//   const tabOrder = ['personal', 'contact', 'family', 'identification', 'passport', 'documents', 'additional'];
//   const currentTabIndex = tabOrder.indexOf(activeTab);
//   const isLastTab = currentTabIndex === tabOrder.length - 1;
//   const isFirstTab = currentTabIndex === 0;

//   const initialFormData = {
//     name: '',
//     surname: '',
//     gender: 'male',
//     dob: '',
//     houseNumber: '',
//     district: '',
//     country: 'Nepal',
    
//     placeOfBirth: '',
//     bloodGroup: 'unknown',
//     maritalStatus: 'single',
//     isAlive: true,
//     dod: '',
//     occupation: '',
//     education: '',
//     religion: '',
//     casteEthnicity: '',
//     nationality: 'Nepali',

//     phone: '',
//     alternatePhone: '',
//     email: '',

//     wardNumber: '',
//     toleVillage: '',
//     municipality: '',
//     province: '',
//     currentAddress: '',
//     permanentAddress: '',
//     postalCode: '',

//     houseNumber: '',
//     family: '',
//     familyNumber: '',
//     rollNumber: '',
//     vanshaGenerationNumber: '',
//     generation: 1,
//     relationship: 'member',
//     father: '',
//     mother: '',
//     grandfather: '',
//     grandmother: '',
//     spouse: '',
//     guardian: '',
//     childBirthOrder: '',
//     lineageRole: 'lineage_member',
//     familyContact: '',

//     citizenshipNumber: '',
//     citizenshipIssueDate: '',
//     citizenshipIssueDistrict: '',
//     nationalIdNumber: '',
//     nationalIdIssueDate: '',

//     passportNumber: '',
//     passportIssueDate: '',
//     passportExpiryDate: '',

//     drivingLicenseNumber: '',
//     drivingLicenseCategory: '',
//     drivingLicenseIssueDate: '',
//     drivingLicenseExpiryDate: '',

//     birthCertificate: '',
//     marriageCertificate: '',
//     deathCertificate: '',
//     panCard: '',
//     voterId: '',

//     biography: '',
//     notes: '',
//     specialRemarks: '',
//     medicalNotes: '',
//     disabilityInfo: '',

//     status: 'active',
//     verificationStatus: 'pending',
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [photos, setPhotos] = useState({
//     photo: null,
//     photoPreview: '',
//     citizenshipFront: null,
//     citizenshipFrontPreview: '',
//     citizenshipBack: null,
//     citizenshipBackPreview: '',
//     nationalIdFront: null,
//     nationalIdFrontPreview: '',
//     passportPhoto: null,
//     passportPhotoPreview: '',
//     drivingLicensePhoto: null,
//     drivingLicensePhotoPreview: '',
//   });

//   const [documents, setDocuments] = useState({
//     birthCertificate: null,
//     marriageCertificate: null,
//     deathCertificate: null,
//     panCard: null,
//     voterId: null,
//   });

//   // Fetch families data
//   const { data: familiesData, refetch: refetchFamilies } = useQuery({
//     queryKey: ['families'],
//     queryFn: () => getFamilies({ limit: 1000 }),
//     staleTime: 5 * 60 * 1000,
//   });

//   const { data: membersData } = useQuery({
//     queryKey: ['members-dropdown'],
//     queryFn: () => getMembers({ limit: 1000 }),
//     staleTime: 5 * 60 * 1000,
//   });

//   // ⭐ NEW: Create Family Mutation
//   const createFamilyMutation = useMutation({
//     mutationFn: createFamily,
//     onSuccess: (newFamily) => {
//       toast.success('परिवार सफलतापूर्वक थपियो 🎉');
//       queryClient.invalidateQueries({ queryKey: ['families'] });
//       refetchFamilies();
      
//       // Auto-select the new family
//       setFormData(prev => ({
//         ...prev,
//         family: newFamily._id,
//         familyNumber: newFamily.familyNumber,
//         vanshaGenerationNumber: newFamily.vanshaGenerationNumber,
//       }));
      
//       setShowFamilyForm(false);
//       setFamilyFormData({
//         familyName: '',
//         familyNumber: '',
//         houseNumber: '',
//         vanshaGenerationNumber: '',
//         familyHead: '',
//         status: 'open',
//       });
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || 'परिवार थप्न असफल भयो');
//     },
//   });

//   const createMutation = useMutation({
//     mutationFn: createMember,
//     onSuccess: () => {
//       toast.success('Member created successfully');
//       queryClient.invalidateQueries({ queryKey: ['members'] });
//       queryClient.invalidateQueries({ queryKey: ['members-dropdown'] });
//       queryClient.invalidateQueries({ queryKey: ['families'] });
//       queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
//       onSuccess?.();
//       resetForm();
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || 'Failed to create member');
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ id, data }) => updateMember(id, data),
//     onSuccess: () => {
//       toast.success('Member updated successfully');
//       queryClient.invalidateQueries({ queryKey: ['members'] });
//       queryClient.invalidateQueries({ queryKey: ['members-dropdown'] });
//       queryClient.invalidateQueries({ queryKey: ['families'] });
//       queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
//       onSuccess?.();
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || 'Failed to update member');
//     },
//   });

//   useEffect(() => {
//     if (member) {
//       const populatedData = { ...initialFormData };
      
//       const fieldsToPopulate = { ...member };
      
//       if (member.family && typeof member.family === 'object') {
//         fieldsToPopulate.family = member.family._id || '';
//       }
//       if (member.father && typeof member.father === 'object') {
//         fieldsToPopulate.father = member.father._id || '';
//       }
//       if (member.mother && typeof member.mother === 'object') {
//         fieldsToPopulate.mother = member.mother._id || '';
//       }
//       if (member.grandfather && typeof member.grandfather === 'object') {
//         fieldsToPopulate.grandfather = member.grandfather._id || '';
//       }
//       if (member.grandmother && typeof member.grandmother === 'object') {
//         fieldsToPopulate.grandmother = member.grandmother._id || '';
//       }
//       if (member.spouse && typeof member.spouse === 'object') {
//         fieldsToPopulate.spouse = member.spouse._id || '';
//       }
//       if (member.guardian && typeof member.guardian === 'object') {
//         fieldsToPopulate.guardian = member.guardian._id || '';
//       }

//       Object.keys(fieldsToPopulate).forEach(key => {
//         if (fieldsToPopulate[key] !== undefined && fieldsToPopulate[key] !== null) {
//           populatedData[key] = fieldsToPopulate[key];
//         }
//       });

//       setFormData(populatedData);

//       setPhotos(prev => ({
//         ...prev,
//         photoPreview: member.photo || '',
//         citizenshipFrontPreview: member.citizenshipFront || '',
//         citizenshipBackPreview: member.citizenshipBack || '',
//         nationalIdFrontPreview: member.nationalIdFront || '',
//         passportPhotoPreview: member.passportPhoto || '',
//         drivingLicensePhotoPreview: member.drivingLicensePhoto || '',
//       }));
//     }
//   }, [member]);

//   const resetForm = () => {
//     Object.values(photos).forEach(value => {
//       if (typeof value === 'string' && value.startsWith('blob:')) {
//         URL.revokeObjectURL(value);
//       }
//     });

//     setFormData(initialFormData);
//     setPhotos({
//       photo: null,
//       photoPreview: '',
//       citizenshipFront: null,
//       citizenshipFrontPreview: '',
//       citizenshipBack: null,
//       citizenshipBackPreview: '',
//       nationalIdFront: null,
//       nationalIdFrontPreview: '',
//       passportPhoto: null,
//       passportPhotoPreview: '',
//       drivingLicensePhoto: null,
//       drivingLicensePhotoPreview: '',
//     });
//     setDocuments({
//       birthCertificate: null,
//       marriageCertificate: null,
//       deathCertificate: null,
//       panCard: null,
//       voterId: null,
//     });
//     setActiveTab('personal');
//     setValidationErrors({});
//     setShowFamilyForm(false);
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleSelectChange = (name, value) => {
//     console.log(`🔍 Select changed: ${name} = ${value}`);
    
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value || '',
//     }));
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   // ⭐ NEW: Handle family form changes
//   const handleFamilyFormChange = (e) => {
//     const { name, value } = e.target;
//     setFamilyFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // ⭐ NEW: Handle family form select changes
//   const handleFamilySelectChange = (name, value) => {
//     setFamilyFormData(prev => ({
//       ...prev,
//       [name]: value
//     }));
//   };

//   // ⭐ NEW: Submit family form
//   const handleFamilySubmit = async (e) => {
//     e.preventDefault();
    
//     // Validate family form
//     if (!familyFormData.familyName?.trim()) {
//       toast.error('परिवारको नाम आवश्यक छ');
//       return;
//     }
//     if (!familyFormData.houseNumber?.trim()) {
//       toast.error('घर नम्बर आवश्यक छ');
//       return;
//     }

//     try {
//       await createFamilyMutation.mutateAsync(familyFormData);
//     } catch (error) {
//       console.error('Family creation error:', error);
//     }
//   };

//   const handlePhotoUpload = (type, file) => {
//     if (!file) return;
    
//     const existingPreview = photos[`${type}Preview`];
//     if (typeof existingPreview === 'string' && existingPreview.startsWith('blob:')) {
//       URL.revokeObjectURL(existingPreview);
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPhotos((prev) => ({
//         ...prev,
//         [type]: file,
//         [`${type}Preview`]: reader.result,
//       }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const handlePhotoRemove = (type) => {
//     const preview = photos[`${type}Preview`];
//     if (typeof preview === 'string' && preview.startsWith('blob:')) {
//       URL.revokeObjectURL(preview);
//     }

//     setPhotos((prev) => ({
//       ...prev,
//       [type]: null,
//       [`${type}Preview`]: '',
//     }));
//   };

//   const handleImageSelect = (type, file, preview) => {
//     const existingPreview = photos[`${type}Preview`];
//     if (typeof existingPreview === 'string' && existingPreview.startsWith('blob:')) {
//       URL.revokeObjectURL(existingPreview);
//     }

//     setPhotos((prev) => ({
//       ...prev,
//       [type]: file,
//       [`${type}Preview`]: preview || (file ? URL.createObjectURL(file) : ''),
//     }));
//   };

//   const handleDocumentUpload = (type, file) => {
//     setDocuments(prev => ({
//       ...prev,
//       [type]: file
//     }));
//   };

//   const validateForm = () => {
//     const errors = {};
    
//     if (!formData.name?.trim()) {
//       errors.name = 'Full Name is required';
//     }
    
//     if (!formData.surname?.trim()) {
//       errors.surname = 'Surname is required';
//     }
    
//     if (!formData.gender) {
//       errors.gender = 'Gender is required';
//     }
    
//     if (!formData.dob) {
//       errors.dob = 'Date of Birth is required';
//     }
    
//     if (!formData.houseNumber?.trim()) {
//       errors.houseNumber = 'House Number is required';
//     }
    
//     if (!formData.district) {
//       errors.district = 'District is required';
//     }
    
//     if (!formData.country?.trim()) {
//       errors.country = 'Country is required';
//     }

//     if (!formData.family) {
//       errors.family = 'परिवार चयन गर्नुहोस् (Family is required)';
//     }

//     if (!member && !photos.photo && !photos.photoPreview) {
//       errors.photo = 'Passport photo is required';
//     }

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       const errorMessages = Object.values(validationErrors);
//       errorMessages.forEach(msg => toast.error(msg));
//       if (validationErrors.name || validationErrors.surname || validationErrors.gender || validationErrors.dob || validationErrors.photo) {
//         setActiveTab('personal');
//       } else if (validationErrors.houseNumber || validationErrors.district || validationErrors.country || validationErrors.family) {
//         setActiveTab('contact');
//       }
//       return;
//     }

//     setLoading(true);

//     try {
//       const submitData = new FormData();
      
//       console.log('📤 Submitting member with family ID:', formData.family);
      
//       Object.keys(formData).forEach((key) => {
//         const value = formData[key];
        
//         if (value !== undefined && value !== null && value !== '') {
//           if (key === 'generation' || key === 'childBirthOrder') {
//             submitData.append(key, Number(value));
//           } else if (typeof value === 'boolean') {
//             submitData.append(key, String(value));
//           } else if (typeof value === 'object' && value._id) {
//             submitData.append(key, value._id);
//           } else {
//             submitData.append(key, value);
//           }
//         }
//       });

//       if (formData.family) {
//         submitData.append('family', formData.family);
//         console.log('✅ Appended family:', formData.family);
//       } else {
//         console.warn('⚠️ No family selected!');
//       }

//       const photoFields = [
//         'photo', 'citizenshipFront', 'citizenshipBack', 
//         'nationalIdFront', 'passportPhoto', 'drivingLicensePhoto'
//       ];
      
//       photoFields.forEach(field => {
//         if (photos[field] && photos[field] instanceof File) {
//           submitData.append(field, photos[field]);
//         }
//       });

//       Object.entries(documents).forEach(([key, file]) => {
//         if (file && file instanceof File) {
//           submitData.append(key, file);
//         }
//       });

//       if (member) {
//         await updateMutation.mutateAsync({ id: member._id, data: submitData });
//         resetForm();
//       } else {
//         await createMutation.mutateAsync(submitData);
//       }
//     } catch (error) {
//       console.error('Submit error:', error);
//       toast.error(error.response?.data?.message || 'Failed to save member');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const goToNextTab = () => {
//     if (activeTab === 'personal') {
//       const personalErrors = {};
//       if (!formData.name?.trim()) personalErrors.name = 'Full Name is required';
//       if (!formData.surname?.trim()) personalErrors.surname = 'Surname is required';
//       if (!formData.gender) personalErrors.gender = 'Gender is required';
//       if (!formData.dob) personalErrors.dob = 'Date of Birth is required';
//       if (!member && !photos.photo && !photos.photoPreview) personalErrors.photo = 'Passport photo is required';
      
//       if (Object.keys(personalErrors).length > 0) {
//         setValidationErrors(personalErrors);
//         Object.values(personalErrors).forEach(msg => toast.error(msg));
//         return;
//       }
//     }
    
//     if (activeTab === 'contact') {
//       const contactErrors = {};
//       if (!formData.houseNumber?.trim()) contactErrors.houseNumber = 'House Number is required';
//       if (!formData.district) contactErrors.district = 'District is required';
//       if (!formData.country?.trim()) contactErrors.country = 'Country is required';
//       if (!formData.family) contactErrors.family = 'परिवार चयन गर्नुहोस्';
      
//       if (Object.keys(contactErrors).length > 0) {
//         setValidationErrors(contactErrors);
//         Object.values(contactErrors).forEach(msg => toast.error(msg));
//         return;
//       }
//     }

//     const nextIndex = currentTabIndex + 1;
//     if (nextIndex < tabOrder.length) {
//       setActiveTab(tabOrder[nextIndex]);
//       setValidationErrors({});
//     }
//   };

//   const goToPrevTab = () => {
//     const prevIndex = currentTabIndex - 1;
//     if (prevIndex >= 0) {
//       setActiveTab(tabOrder[prevIndex]);
//       setValidationErrors({});
//     }
//   };

//   const tabs = [
//     { id: 'personal', label: 'Personal Info', icon: FaUser },
//     { id: 'contact', label: 'Contact & Address', icon: FaAddressCard },
//     { id: 'family', label: 'Family', icon: FaUsers },
//     { id: 'identification', label: 'ID Cards', icon: FaIdCard },
//     { id: 'passport', label: 'Passport & License', icon: FaPassport },
//     { id: 'documents', label: 'Documents', icon: FaFile },
//     { id: 'additional', label: 'Additional', icon: FaInfoCircle },
//   ];

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'personal':
//         return renderPersonalInfo();
//       case 'contact':
//         return renderContactAddress();
//       case 'family':
//         return renderFamilyInfo();
//       case 'identification':
//         return renderIdentification();
//       case 'passport':
//         return renderPassportLicense();
//       case 'documents':
//         return renderDocuments();
//       case 'additional':
//         return renderAdditionalInfo();
//       default:
//         return null;
//     }
//   };

//   const renderPhotoUpload = (type, label, preview, required = false, size = 'md') => {
//     const sizeClasses = {
//       sm: 'w-32 h-32',
//       md: 'w-40 h-40',
//       lg: 'w-48 h-48',
//       xl: 'w-56 h-56',
//     };

//     const hasError = validationErrors[type];

//     return (
//       <div className="flex flex-col items-center">
//         {preview ? (
//           <div className="relative group">
//             <div className={`${sizeClasses[size]} rounded-xl overflow-hidden border-2 ${hasError ? 'border-red-500' : 'border-green-200'} shadow-md hover:shadow-lg transition-all duration-300`}>
//               <img src={preview} alt={label} className="w-full h-full object-cover" />
//             </div>
//             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
//               <button
//                 type="button"
//                 onClick={() => handlePhotoRemove(type)}
//                 className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
//                 title="Remove photo"
//               >
//                 <FaTrash className="h-5 w-5 text-red-500" />
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className={`${sizeClasses[size]}`}>
//             <ImageUpload
//               onImageSelect={(file, preview) => handleImageSelect(type, file, preview)}
//               label={label}
//               maxSize={5}
//             />
//           </div>
//         )}
//         {required && !preview && (
//           <span className="text-xs text-red-500 mt-1">* Required</span>
//         )}
//         {hasError && (
//           <span className="text-xs text-red-500 mt-1">{validationErrors[type]}</span>
//         )}
//       </div>
//     );
//   };

//   const renderPersonalInfo = () => (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       <div className="md:col-span-2 space-y-3">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div className="md:col-span-2">
//             <FloatingInput
//               label="Full Name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               icon={FaUser}
//               error={validationErrors.name}
//             />
//           </div>
//           <div className="md:col-span-2">
//             <FloatingInput
//               label="Surname (Last Name)"
//               name="surname"
//               value={formData.surname}
//               onChange={handleChange}
//               required
//               icon={FaUser}
//               error={validationErrors.surname}
//             />
//           </div>
//           <SearchableSelect
//             label="Gender"
//             name="gender"
//             value={formData.gender}
//             onChange={handleSelectChange}
//             options={[
//               { value: 'male', label: 'Male' },
//               { value: 'female', label: 'Female' },
//               { value: 'other', label: 'Other' },
//             ]}
//             icon={PiGenderIntersexBold}
//             required
//             error={validationErrors.gender}
//           />
//           <NepaliDatePickerComponent
//             label="Date of Birth (BS)"
//             name="dob"
//             value={formData.dob}
//             onChange={handleSelectChange}
//             required
//             error={validationErrors.dob}
//           />
//           <FloatingInput
//             label="Place of Birth"
//             name="placeOfBirth"
//             value={formData.placeOfBirth}
//             onChange={handleChange}
//             icon={FaMapPin}
//           />
//           <SearchableSelect
//             label="Blood Group"
//             name="bloodGroup"
//             value={formData.bloodGroup}
//             onChange={handleSelectChange}
//             options={bloodGroups}
//           />
//           <SearchableSelect
//             label="Marital Status"
//             name="maritalStatus"
//             value={formData.maritalStatus}
//             onChange={handleSelectChange}
//             options={maritalStatuses}
//           />
//           <div className="md:col-span-2">
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="isAlive"
//                 checked={formData.isAlive}
//                 onChange={handleChange}
//                 className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//               />
//               <span className="text-sm text-gray-700">Is Alive</span>
//             </label>
//           </div>
//           {!formData.isAlive && (
//             <NepaliDatePickerComponent
//               label="Date of Death (BS)"
//               name="dod"
//               value={formData.dod}
//               onChange={handleSelectChange}
//             />
//           )}
//           <SearchableSelect
//             label="Occupation"
//             name="occupation"
//             value={formData.occupation}
//             onChange={handleSelectChange}
//             options={jobTitles}
//             creatable
//             placeholder="Search or enter occupation"
//           />
//           <SearchableSelect
//             label="Education"
//             name="education"
//             value={formData.education}
//             onChange={handleSelectChange}
//             options={educationLevels}
//             creatable
//             placeholder="Search or enter education"
//           />
//           <FloatingInput
//             label="Religion"
//             name="religion"
//             value={formData.religion}
//             onChange={handleChange}
//             icon={FaHeart}
//           />
//           <FloatingInput
//             label="Caste / Ethnicity"
//             name="casteEthnicity"
//             value={formData.casteEthnicity}
//             onChange={handleChange}
//             icon={FaUsers}
//           />
//           <FloatingInput
//             label="Nationality"
//             name="nationality"
//             value={formData.nationality}
//             onChange={handleChange}
//             icon={FaAddressCard}
//           />
//         </div>
//       </div>

//       <div className="md:col-span-1">
//         <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//           <div className="text-center mb-4">
//             <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
//               <FaCamera className="text-green-600 text-2xl" />
//             </div>
//             <h4 className="text-sm font-semibold text-green-800">Passport Photo</h4>
//             <p className="text-xs text-gray-500">2x2 inch, white background</p>
//           </div>
          
//           <div className="flex justify-center">
//             {renderPhotoUpload('photo', 'Photo', photos.photoPreview, true, 'xl')}
//           </div>
          
//           <div className="mt-3 flex justify-center gap-2 text-xs text-gray-400">
//             <span>PNG</span>
//             <span>•</span>
//             <span>JPG</span>
//             <span>•</span>
//             <span>JPEG</span>
//             <span>•</span>
//             <span>5MB</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderContactAddress = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//       <FloatingInput
//         label="Mobile Number"
//         name="phone"
//         value={formData.phone}
//         onChange={handleChange}
//         type="tel"
//         icon={FaPhone}
//       />
//       <FloatingInput
//         label="Alternate Mobile"
//         name="alternatePhone"
//         value={formData.alternatePhone}
//         onChange={handleChange}
//         type="tel"
//         icon={FaPhone}
//       />
//       <FloatingInput
//         label="Email"
//         name="email"
//         value={formData.email}
//         onChange={handleChange}
//         type="email"
//         icon={FaEnvelope}
//       />
//       <FloatingInput
//         label="House Number"
//         name="houseNumber"
//         value={formData.houseNumber}
//         onChange={handleChange}
//         icon={FaMapPin}
//         required
//         error={validationErrors.houseNumber}
//       />
//       <LocationSelect
//         label="Province"
//         type="province"
//         value={formData.province}
//         onChange={(type, value) => handleSelectChange('province', value)}
//       />
//       <LocationSelect
//         label="District"
//         type="district"
//         province={formData.province}
//         value={formData.district}
//         onChange={(type, value) => handleSelectChange('district', value)}
//         required
//         error={validationErrors.district}
//       />
//       <LocationSelect
//         label="Municipality"
//         type="municipality"
//         district={formData.district}
//         value={formData.municipality}
//         onChange={(type, value) => handleSelectChange('municipality', value)}
//       />
//       <FloatingInput
//         label="Tole / Village"
//         name="toleVillage"
//         value={formData.toleVillage}
//         onChange={handleChange}
//         icon={FaMapPin}
//       />
//       <LocationSelect
//         label="Ward"
//         type="ward"
//         value={formData.wardNumber}
//         onChange={(type, value) => handleSelectChange('wardNumber', value)}
//       />
//       <FloatingInput
//         label="Country"
//         name="country"
//         value={formData.country}
//         onChange={handleChange}
//         icon={FaMapPin}
//         required
//         error={validationErrors.country}
//       />
//       <FloatingInput
//         label="Postal Code"
//         name="postalCode"
//         value={formData.postalCode}
//         onChange={handleChange}
//         icon={FaMapPin}
//       />
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Current Address"
//           name="currentAddress"
//           value={formData.currentAddress}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaMapPin}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Permanent Address"
//           name="permanentAddress"
//           value={formData.permanentAddress}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaMapPin}
//         />
//       </div>
//     </div>
//   );

//   // ⭐⭐⭐ COMPLETE REWRITE: renderFamilyInfo with Add Family Form
//   const renderFamilyInfo = () => {
//     const maleMembers = (membersData?.data || []).filter(m => m.gender === 'male');
//     const femaleMembers = (membersData?.data || []).filter(m => m.gender === 'female');
//     const allMembers = membersData?.data || [];

//     const familyOptions = (familiesData?.data || []).map(f => ({
//       value: f._id,
//       label: `${f.familyName} (वंश: ${f.familyNumber})${f.vanshaGenerationNumber ? ` - पुस्ता: ${f.vanshaGenerationNumber}` : ''}`,
//     }));

//     const createMemberOptions = (members) => members.map(m => ({
//       value: m._id,
//       label: `${m.name}${m.surname ? ` ${m.surname}` : ''} (रोल: ${m.rollNumber || 'N/A'})`,
//     }));

//     return (
//       <div className="space-y-4">
//         {/* ⭐ ADD FAMILY BUTTON */}
//         <div className="flex justify-between items-center">
//           <h3 className="text-md font-semibold text-gray-700">परिवार विवरण</h3>
//           <button
//             type="button"
//             onClick={() => setShowFamilyForm(!showFamilyForm)}
//             className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium flex items-center gap-2 transition-colors"
//           >
//             <FaPlus className="h-3 w-3" />
//             {showFamilyForm ? 'फारम लुकाउनुहोस्' : 'नयाँ परिवार थप्नुहोस्'}
//           </button>
//         </div>

//         {/* ⭐ FAMILY ADD FORM - Toggleable */}
//         <AnimatePresence>
//           {showFamilyForm && (
//             <motion.div
//               initial={{ opacity: 0, y: -20 }}
//               animate={{ opacity: 1, y: 0 }}
//               exit={{ opacity: 0, y: -20 }}
//               className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-4 border-2 border-green-200"
//             >
//               <h4 className="text-sm font-bold text-green-800 mb-3 flex items-center gap-2">
//                 <FaBuilding className="text-green-600" />
//                 नयाँ परिवार थप्नुहोस्
//               </h4>
              
//               <form onSubmit={handleFamilySubmit} className="grid grid-cols-1 md:grid-cols-2 gap-3">
//                 <div className="md:col-span-2">
//                   <FloatingInput
//                     label="परिवारको नाम *"
//                     name="familyName"
//                     value={familyFormData.familyName}
//                     onChange={handleFamilyFormChange}
//                     icon={FaUsers}
//                     required
//                   />
//                 </div>
                
//                 <FloatingInput
//                   label="घर नम्बर *"
//                   name="houseNumber"
//                   value={familyFormData.houseNumber}
//                   onChange={handleFamilyFormChange}
//                   icon={FaHome}
//                   required
//                 />
                
//                 <FloatingInput
//                   label="वंश नम्बर"
//                   name="familyNumber"
//                   value={familyFormData.familyNumber}
//                   onChange={handleFamilyFormChange}
//                   icon={FaTree}
//                   placeholder="खाली छोड्नुहोस् स्वत: जेनेरेट हुनेछ"
//                 />
                
//                 <div className="md:col-span-2">
//                   <FloatingInput
//                     label="वंश / पुस्ता नम्बर"
//                     name="vanshaGenerationNumber"
//                     value={familyFormData.vanshaGenerationNumber}
//                     onChange={handleFamilyFormChange}
//                     icon={FaTree}
//                     placeholder="खाली छोड्नुहोस् स्वत: जेनेरेट हुनेछ"
//                   />
//                 </div>
                
//                 <SearchableSelect
//                   label="घरमुली"
//                   name="familyHead"
//                   value={familyFormData.familyHead}
//                   onChange={handleFamilySelectChange}
//                   options={createMemberOptions(allMembers)}
//                   placeholder="घरमुली खोज्नुहोस्..."
//                 />
                
//                 <SearchableSelect
//                   label="स्थिति"
//                   name="status"
//                   value={familyFormData.status}
//                   onChange={handleFamilySelectChange}
//                   options={[
//                     { value: 'open', label: 'खुला' },
//                     { value: 'closed', label: 'बन्द' },
//                   ]}
//                 />

//                 <div className="md:col-span-2 flex gap-3 pt-2">
//                   <Button
//                     type="submit"
//                     variant="primary"
//                     size="sm"
//                     disabled={createFamilyMutation.isLoading}
//                     className="flex-1"
//                   >
//                     {createFamilyMutation.isLoading ? (
//                       <span className="flex items-center justify-center">
//                         <svg className="animate-spin -ml-1 mr-1.5 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         थप्दै...
//                       </span>
//                     ) : (
//                       <>
//                         <FaSave className="mr-1.5" />
//                         परिवार थप्नुहोस्
//                       </>
//                     )}
//                   </Button>
//                   <Button
//                     type="button"
//                     variant="outline"
//                     size="sm"
//                     onClick={() => setShowFamilyForm(false)}
//                   >
//                     <FaTimes className="mr-1.5" />
//                     रद्द गर्नुहोस्
//                   </Button>
//                 </div>
//               </form>
//             </motion.div>
//           )}
//         </AnimatePresence>

//         {/* ⭐ MEMBER FAMILY SELECTION */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <FloatingInput
//             label="घर नम्बर"
//             name="houseNumber"
//             value={formData.houseNumber}
//             onChange={handleChange}
//             icon={FaHome}
//             required
//             error={validationErrors.houseNumber}
//           />
          
//           <div className="md:col-span-2">
//             <SearchableSelect
//               label="परिवार *"
//               name="family"
//               value={formData.family}
//               onChange={(name, value) => {
//                 console.log('🔄 Family selected:', name, value);
//                 handleSelectChange(name, value);
//               }}
//               options={familyOptions}
//               placeholder="परिवार खोज्नुहोस्..."
//               required
//               error={validationErrors.family}
//             />
//             {!formData.family && (
//               <p className="text-xs text-red-500 mt-1">⚠️ कृपया परिवार चयन गर्नुहोस्</p>
//             )}
//             {familyOptions.length === 0 && (
//               <p className="text-xs text-amber-500 mt-1">
//                 💡 कुनै परिवार छैन। कृपया माथिको "नयाँ परिवार थप्नुहोस्" बटन प्रयोग गर्नुहोस्।
//               </p>
//             )}
//           </div>
          
//           <FloatingInput
//             label="परिवार नम्बर"
//             name="familyNumber"
//             value={formData.familyNumber}
//             onChange={handleChange}
//             icon={FaUsers}
//             disabled={true}
//           />

//           <FloatingInput
//             label="रोल नम्बर"
//             name="rollNumber"
//             value={formData.rollNumber}
//             onChange={handleChange}
//             icon={FaUsers}
//             disabled={true}
//           />

//           <div className="md:col-span-2">
//             <FloatingInput
//               label="वंश / पुस्ता नम्बर"
//               name="vanshaGenerationNumber"
//               value={formData.vanshaGenerationNumber}
//               onChange={handleChange}
//               icon={FaTree}
//               placeholder="खाली छोड्नुहोस् स्वत: जेनेरेट हुनेछ"
//             />
//             <p className="text-xs text-gray-400 mt-1">
//               {!formData.vanshaGenerationNumber ? '💡 खाली छोड्नुहोस् - स्वत: नम्बर जेनेरेट हुनेछ' : '✏️ म्यानुअल नम्बर प्रयोग गरिँदै'}
//             </p>
//           </div>

//           <FloatingInput
//             label="पुस्ता"
//             name="generation"
//             value={formData.generation}
//             onChange={handleChange}
//             type="number"
//             icon={FaUsers}
//           />
          
//           <SearchableSelect
//             label="सम्बन्ध"
//             name="relationship"
//             value={formData.relationship}
//             onChange={handleSelectChange}
//             options={relationships}
//           />

//           <SearchableSelect
//             label="बुवा"
//             name="father"
//             value={formData.father}
//             onChange={handleSelectChange}
//             options={createMemberOptions(maleMembers)}
//             placeholder="बुवा खोज्नुहोस्..."
//           />
          
//           <SearchableSelect
//             label="आमा"
//             name="mother"
//             value={formData.mother}
//             onChange={handleSelectChange}
//             options={createMemberOptions(femaleMembers)}
//             placeholder="आमा खोज्नुहोस्..."
//           />
          
//           <SearchableSelect
//             label="हजुरबा"
//             name="grandfather"
//             value={formData.grandfather}
//             onChange={handleSelectChange}
//             options={createMemberOptions(maleMembers)}
//             placeholder="हजुरबा खोज्नुहोस्..."
//           />
          
//           <SearchableSelect
//             label="हजुरआमा"
//             name="grandmother"
//             value={formData.grandmother}
//             onChange={handleSelectChange}
//             options={createMemberOptions(femaleMembers)}
//             placeholder="हजुरआमा खोज्नुहोस्..."
//           />
          
//           <SearchableSelect
//             label="श्रीमान/श्रीमती"
//             name="spouse"
//             value={formData.spouse}
//             onChange={handleSelectChange}
//             options={createMemberOptions(allMembers)}
//             placeholder="श्रीमान/श्रीमती खोज्नुहोस्..."
//           />
          
//           <SearchableSelect
//             label="अभिभावक"
//             name="guardian"
//             value={formData.guardian}
//             onChange={handleSelectChange}
//             options={createMemberOptions(allMembers)}
//             placeholder="अभिभावक खोज्नुहोस्..."
//           />
          
//           <FloatingInput
//             label="सन्तान क्रम"
//             name="childBirthOrder"
//             value={formData.childBirthOrder}
//             onChange={handleChange}
//             type="number"
//             icon={FaChild}
//           />

//           <SearchableSelect
//             label="पुस्ताको भूमिका"
//             name="lineageRole"
//             value={formData.lineageRole}
//             onChange={handleSelectChange}
//             options={[
//               { value: 'lineage_head', label: 'घरमुली' },
//               { value: 'lineage_member', label: 'सदस्य' },
//               { value: 'spouse', label: 'श्रीमान/श्रीमती' },
//               { value: 'other', label: 'अन्य' },
//             ]}
//           />

//           <FloatingInput
//             label="परिवार सम्पर्क"
//             name="familyContact"
//             value={formData.familyContact}
//             onChange={handleChange}
//             type="tel"
//             icon={FaPhone}
//           />
//         </div>
//       </div>
//     );
//   };

//   const renderIdentification = () => (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         <FloatingInput
//           label="Citizenship Number"
//           name="citizenshipNumber"
//           value={formData.citizenshipNumber}
//           onChange={handleChange}
//           icon={FaIdCard}
//         />
//         <NepaliDatePickerComponent
//           label="Citizenship Issue Date (BS)"
//           name="citizenshipIssueDate"
//           value={formData.citizenshipIssueDate}
//           onChange={handleSelectChange}
//         />
//         <LocationSelect
//           label="Citizenship Issue District"
//           type="district"
//           value={formData.citizenshipIssueDistrict}
//           onChange={(type, value) => handleSelectChange('citizenshipIssueDistrict', value)}
//         />
//         <FloatingInput
//           label="National ID Number"
//           name="nationalIdNumber"
//           value={formData.nationalIdNumber}
//           onChange={handleChange}
//           icon={FaIdCard}
//         />
//         <NepaliDatePickerComponent
//           label="NID Issue Date (BS)"
//           name="nationalIdIssueDate"
//           value={formData.nationalIdIssueDate}
//           onChange={handleSelectChange}
//         />
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//           <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Citizenship Front</h5>
//           <div className="flex justify-center">
//             {renderPhotoUpload('citizenshipFront', 'Citizenship Front', photos.citizenshipFrontPreview, false, 'md')}
//           </div>
//         </div>
//         <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//           <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Citizenship Back</h5>
//           <div className="flex justify-center">
//             {renderPhotoUpload('citizenshipBack', 'Citizenship Back', photos.citizenshipBackPreview, false, 'md')}
//           </div>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
//         <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 max-w-md mx-auto">
//           <h5 className="text-xs font-medium text-green-700 mb-2 text-center">National ID Front</h5>
//           <div className="flex justify-center">
//             {renderPhotoUpload('nationalIdFront', 'National ID Front', photos.nationalIdFrontPreview, false, 'md')}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderPassportLicense = () => (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         <FloatingInput
//           label="Passport Number"
//           name="passportNumber"
//           value={formData.passportNumber}
//           onChange={handleChange}
//           icon={FaPassport}
//         />
//         <NepaliDatePickerComponent
//           label="Passport Issue Date (BS)"
//           name="passportIssueDate"
//           value={formData.passportIssueDate}
//           onChange={handleSelectChange}
//         />
//         <NepaliDatePickerComponent
//           label="Passport Expiry Date (BS)"
//           name="passportExpiryDate"
//           value={formData.passportExpiryDate}
//           onChange={handleSelectChange}
//         />
//       </div>
      
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 max-w-md mx-auto">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Passport Photo</h5>
//         <div className="flex justify-center">
//           {renderPhotoUpload('passportPhoto', 'Passport Photo', photos.passportPhotoPreview, false, 'lg')}
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         <FloatingInput
//           label="Driving License Number"
//           name="drivingLicenseNumber"
//           value={formData.drivingLicenseNumber}
//           onChange={handleChange}
//           icon={FaCar}
//         />
//         <FloatingInput
//           label="DL Category"
//           name="drivingLicenseCategory"
//           value={formData.drivingLicenseCategory}
//           onChange={handleChange}
//           icon={FaCar}
//         />
//         <NepaliDatePickerComponent
//           label="DL Issue Date (BS)"
//           name="drivingLicenseIssueDate"
//           value={formData.drivingLicenseIssueDate}
//           onChange={handleSelectChange}
//         />
//         <NepaliDatePickerComponent
//           label="DL Expiry Date (BS)"
//           name="drivingLicenseExpiryDate"
//           value={formData.drivingLicenseExpiryDate}
//           onChange={handleSelectChange}
//         />
//       </div>
      
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 max-w-md mx-auto">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Driving License Photo</h5>
//         <div className="flex justify-center">
//           {renderPhotoUpload('drivingLicensePhoto', 'Driving License Photo', photos.drivingLicensePhotoPreview, false, 'lg')}
//         </div>
//       </div>
//     </div>
//   );

//   const renderDocuments = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Birth Certificate</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('birthCertificate', file)}
//             label="Upload Birth Certificate"
//             maxSize={5}
//           />
//         </div>
//         {documents.birthCertificate && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Marriage Certificate</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('marriageCertificate', file)}
//             label="Upload Marriage Certificate"
//             maxSize={5}
//           />
//         </div>
//         {documents.marriageCertificate && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Death Certificate</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('deathCertificate', file)}
//             label="Upload Death Certificate"
//             maxSize={5}
//           />
//         </div>
//         {documents.deathCertificate && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">PAN Card</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('panCard', file)}
//             label="Upload PAN Card"
//             maxSize={5}
//           />
//         </div>
//         {documents.panCard && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 md:col-span-2 max-w-md mx-auto">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Voter ID</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('voterId', file)}
//             label="Upload Voter ID"
//             maxSize={5}
//           />
//         </div>
//         {documents.voterId && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//     </div>
//   );

//   const renderAdditionalInfo = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Biography"
//           name="biography"
//           value={formData.biography}
//           onChange={handleChange}
//           type="textarea"
//           rows={3}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Notes"
//           name="notes"
//           value={formData.notes}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Special Remarks"
//           name="specialRemarks"
//           value={formData.specialRemarks}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Medical Notes"
//           name="medicalNotes"
//           value={formData.medicalNotes}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Disability Information"
//           name="disabilityInfo"
//           value={formData.disabilityInfo}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <SearchableSelect
//         label="Status"
//         name="status"
//         value={formData.status}
//         onChange={handleSelectChange}
//         options={[
//           { value: 'active', label: 'Active' },
//           { value: 'inactive', label: 'Inactive' },
//           { value: 'deceased', label: 'Deceased' },
//         ]}
//       />
//       <SearchableSelect
//         label="Verification Status"
//         name="verificationStatus"
//         value={formData.verificationStatus}
//         onChange={handleSelectChange}
//         options={[
//           { value: 'verified', label: 'Verified' },
//           { value: 'pending', label: 'Pending' },
//           { value: 'rejected', label: 'Rejected' },
//         ]}
//       />
//     </div>
//   );

//   const isSubmitting = loading || createMutation.isLoading || updateMutation.isLoading;

//   return (
//     <>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 rounded-xl p-4 shadow-sm border border-green-100">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
//             <div>
//               <h2 className="text-xl md:text-2xl font-bold text-green-800 flex items-center gap-2">
//                 {member ? (
//                   <>
//                     <span>✏️</span> Edit Member
//                   </>
//                 ) : (
//                   <>
//                     <span>➕</span> Add New Member
//                   </>
//                 )}
//               </h2>
//               <p className="text-xs text-green-600 mt-0.5">
//                 {member ? 'Update member information' : 'Enter member details'} • Step {currentTabIndex + 1} of {tabOrder.length}
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
//                 {member ? 'Editing' : 'New'}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Progress Bar */}
//         <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
//           <div 
//             className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all duration-500"
//             style={{ width: `${((currentTabIndex + 1) / tabOrder.length) * 100}%` }}
//           />
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 gap-4">
//           {/* Tabs */}
//           <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
//             <div className="bg-green-50/30 px-3 pt-2 overflow-x-auto">
//               <div className="flex min-w-max gap-1">
//                 {tabs.map((tab) => (
//                   <button
//                     key={tab.id}
//                     type="button"
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`
//                       flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap
//                       transition-all duration-300 relative rounded-t-lg
//                       ${activeTab === tab.id
//                         ? 'text-green-700 bg-white shadow-sm'
//                         : 'text-gray-500 hover:text-green-600 hover:bg-green-50/50'
//                       }
//                     `}
//                   >
//                     <tab.icon className={`h-3.5 w-3.5 ${activeTab === tab.id ? 'text-green-600' : ''}`} />
//                     <span className="hidden sm:inline">{tab.label}</span>
//                     <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
//                     {activeTab === tab.id && (
//                       <motion.div
//                         layoutId="activeTab"
//                         className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500"
//                         transition={{ duration: 0.3 }}
//                       />
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Tab Content */}
//             <div className="p-3 md:p-4">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={activeTab}
//                   initial={{ opacity: 0, x: 10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -10 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   {renderTabContent()}
//                 </motion.div>
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* Navigation Buttons */}
//           <div className="bg-white rounded-xl shadow-sm border border-green-100 p-3">
//             <div className="flex flex-col sm:flex-row justify-between gap-2">
//               <div className="flex gap-2 order-2 sm:order-1">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={onCancel}
//                   size="sm"
//                   className="px-4"
//                 >
//                   <FaTimes className="mr-1.5 text-xs" />
//                   Cancel
//                 </Button>
//               </div>
//               <div className="flex gap-2 order-1 sm:order-2">
//                 {!isFirstTab && (
//                   <Button
//                     type="button"
//                     variant="secondary"
//                     onClick={goToPrevTab}
//                     size="sm"
//                     className="px-4"
//                   >
//                     <FaChevronLeft className="mr-1.5 text-xs" />
//                     Previous
//                   </Button>
//                 )}
//                 {isLastTab ? (
//                   <Button
//                     type="submit"
//                     disabled={isSubmitting}
//                     variant="primary"
//                     size="sm"
//                     className="px-5"
//                   >
//                     {isSubmitting ? (
//                       <span className="flex items-center">
//                         <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Saving...
//                       </span>
//                     ) : (
//                       <>
//                         <FaSave className="mr-1.5 text-xs" />
//                         {member ? 'Update Member' : 'Save Member'}
//                       </>
//                     )}
//                   </Button>
//                 ) : (
//                   <Button
//                     type="button"
//                     variant="primary"
//                     onClick={goToNextTab}
//                     size="sm"
//                     className="px-5"
//                   >
//                     Next
//                     <FaChevronRight className="ml-1.5 text-xs" />
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </form>
//     </>
//   );
// };

// export default DataEntry;

// src/pages/DataEntry.jsx - MODIFIED (FAMILY CREATE REMOVED FROM DATA ENTRY)

import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { createMember, updateMember, getMembers } from '../api/members';
import { getFamilies } from '../api/families'; // ⭐ Only getFamilies - NO createFamily
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';

// Components
import FloatingInput from '../components/FloatingInput';
import SearchableSelect from '../components/SearchableSelect';
import LocationSelect from '../components/LocationSelect';
import ImageUpload from '../components/ImageUpload';
import NepaliDatePickerComponent from '../components/NepaliDatePickerComponent';
import Button from '../components/Button';

// Data
import { jobTitles, educationLevels, bloodGroups, maritalStatuses, relationships } from '../data/options';

// Icons
import { 
  FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapPin, 
  FaIdCard, FaBriefcase, FaGraduationCap, FaHeart, 
  FaUsers, FaAddressCard, FaPassport, FaCar, FaFile,
  FaInfoCircle, FaSave, FaTimes, FaCamera, 
  FaChevronLeft, FaChevronRight, FaTrash,
  FaHome, FaTree, FaChild, FaBuilding
} from 'react-icons/fa';
import { PiGenderIntersexBold } from 'react-icons/pi';

const DataEntry = ({ member, onSuccess, onCancel }) => {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('personal');
  const [loading, setLoading] = useState(false);
  const [validationErrors, setValidationErrors] = useState({});
  // ⭐ REMOVED: showFamilyForm, familyFormData - No family creation in DataEntry

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

    // ⭐ IMPORTANT: houseNumber is Family-level, but kept for form completeness
    // It will be auto-filled from selected Family's house
    family: '', // ⭐ REQUIRED - must select existing family
    familyNumber: '',
    rollNumber: '',
    vanshaGenerationNumber: '',
    generation: 1,
    relationship: 'member',
    father: '',
    mother: '',
    grandfather: '',
    grandmother: '',
    spouse: '',
    guardian: '',
    childBirthOrder: '',
    lineageRole: 'lineage_member',
    familyContact: '',

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

  // Fetch families data - only for selection
  const { data: familiesData, refetch: refetchFamilies } = useQuery({
    queryKey: ['families'],
    queryFn: () => getFamilies({ limit: 1000 }),
    staleTime: 5 * 60 * 1000,
  });

  const { data: membersData } = useQuery({
    queryKey: ['members-dropdown'],
    queryFn: () => getMembers({ limit: 1000 }),
    staleTime: 5 * 60 * 1000,
  });

  // ⭐ REMOVED: createFamilyMutation - No family creation in DataEntry

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
      queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
      onSuccess?.();
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update member');
    },
  });

  useEffect(() => {
    if (member) {
      const populatedData = { ...initialFormData };
      
      const fieldsToPopulate = { ...member };
      
      if (member.family && typeof member.family === 'object') {
        fieldsToPopulate.family = member.family._id || '';
        // Auto-fill family details
        if (member.family.house) {
          fieldsToPopulate.houseNumber = member.family.house.houseNumber || '';
        }
        fieldsToPopulate.familyNumber = member.family.familyNumber || '';
        fieldsToPopulate.vanshaGenerationNumber = member.family.vanshaGenerationNumber || '';
      }
      if (member.father && typeof member.father === 'object') {
        fieldsToPopulate.father = member.father._id || '';
      }
      if (member.mother && typeof member.mother === 'object') {
        fieldsToPopulate.mother = member.mother._id || '';
      }
      if (member.grandfather && typeof member.grandfather === 'object') {
        fieldsToPopulate.grandfather = member.grandfather._id || '';
      }
      if (member.grandmother && typeof member.grandmother === 'object') {
        fieldsToPopulate.grandmother = member.grandmother._id || '';
      }
      if (member.spouse && typeof member.spouse === 'object') {
        fieldsToPopulate.spouse = member.spouse._id || '';
      }
      if (member.guardian && typeof member.guardian === 'object') {
        fieldsToPopulate.guardian = member.guardian._id || '';
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

  // ⭐ NEW: Auto-fill family details when family is selected
  const handleFamilySelect = (name, value) => {
    console.log('🔄 Family selected:', value);
    
    setFormData(prev => ({
      ...prev,
      [name]: value || '',
    }));
    
    // Auto-fill family details from selected family
    if (value) {
      const selectedFamily = familiesData?.data?.find(f => f._id === value);
      if (selectedFamily) {
        setFormData(prev => ({
          ...prev,
          familyNumber: selectedFamily.familyNumber || '',
          vanshaGenerationNumber: selectedFamily.vanshaGenerationNumber || '',
          houseNumber: selectedFamily.house?.houseNumber || '',
        }));
        toast.success(`परिवार चयन गरियो: ${selectedFamily.familyName}`);
      }
    } else {
      // Clear auto-filled fields if no family selected
      setFormData(prev => ({
        ...prev,
        familyNumber: '',
        vanshaGenerationNumber: '',
        houseNumber: '',
      }));
    }
    
    if (validationErrors[name]) {
      setValidationErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

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
    console.log(`🔍 Select changed: ${name} = ${value}`);
    
    // If family is being changed, use special handler
    if (name === 'family') {
      handleFamilySelect(name, value);
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

  // ⭐ REMOVED: handleFamilyFormChange, handleFamilySelectChange, handleFamilySubmit

  const handlePhotoUpload = (type, file) => {
    if (!file) return;
    
    const existingPreview = photos[`${type}Preview`];
    if (typeof existingPreview === 'string' && existingPreview.startsWith('blob:')) {
      URL.revokeObjectURL(existingPreview);
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      setPhotos((prev) => ({
        ...prev,
        [type]: file,
        [`${type}Preview`]: reader.result,
      }));
    };
    reader.readAsDataURL(file);
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

  const handleDocumentUpload = (type, file) => {
    setDocuments(prev => ({
      ...prev,
      [type]: file
    }));
  };

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
    
    if (!formData.houseNumber?.trim()) {
      errors.houseNumber = 'House Number is required';
    }
    
    if (!formData.district) {
      errors.district = 'District is required';
    }
    
    if (!formData.country?.trim()) {
      errors.country = 'Country is required';
    }

    // ⭐ CRITICAL: Family is REQUIRED
    if (!formData.family) {
      errors.family = 'परिवार चयन गर्नुहोस् (Family is required)';
    }

    if (!member && !photos.photo && !photos.photoPreview) {
      errors.photo = 'Passport photo is required';
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      const errorMessages = Object.values(validationErrors);
      errorMessages.forEach(msg => toast.error(msg));
      if (validationErrors.name || validationErrors.surname || validationErrors.gender || validationErrors.dob || validationErrors.photo) {
        setActiveTab('personal');
      } else if (validationErrors.houseNumber || validationErrors.district || validationErrors.country || validationErrors.family) {
        setActiveTab('contact');
      }
      return;
    }

    setLoading(true);

    try {
      const submitData = new FormData();
      
      console.log('📤 Submitting member with family ID:', formData.family);
      
      Object.keys(formData).forEach((key) => {
        const value = formData[key];
        
        if (value !== undefined && value !== null && value !== '') {
          if (key === 'generation' || key === 'childBirthOrder') {
            submitData.append(key, Number(value));
          } else if (typeof value === 'boolean') {
            submitData.append(key, String(value));
          } else if (typeof value === 'object' && value._id) {
            submitData.append(key, value._id);
          } else {
            submitData.append(key, value);
          }
        }
      });

      // ⭐ CRITICAL: Always append family ID
      if (formData.family) {
        submitData.append('family', formData.family);
        console.log('✅ Appended family:', formData.family);
      } else {
        console.error('❌ No family selected! Cannot save member without family.');
        toast.error('कृपया परिवार चयन गर्नुहोस्');
        setLoading(false);
        return;
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
      } else {
        await createMutation.mutateAsync(submitData);
      }
    } catch (error) {
      console.error('Submit error:', error);
      toast.error(error.response?.data?.message || 'Failed to save member');
    } finally {
      setLoading(false);
    }
  };

  const goToNextTab = () => {
    if (activeTab === 'personal') {
      const personalErrors = {};
      if (!formData.name?.trim()) personalErrors.name = 'Full Name is required';
      if (!formData.surname?.trim()) personalErrors.surname = 'Surname is required';
      if (!formData.gender) personalErrors.gender = 'Gender is required';
      if (!formData.dob) personalErrors.dob = 'Date of Birth is required';
      if (!member && !photos.photo && !photos.photoPreview) personalErrors.photo = 'Passport photo is required';
      
      if (Object.keys(personalErrors).length > 0) {
        setValidationErrors(personalErrors);
        Object.values(personalErrors).forEach(msg => toast.error(msg));
        return;
      }
    }
    
    if (activeTab === 'contact') {
      const contactErrors = {};
      if (!formData.houseNumber?.trim()) contactErrors.houseNumber = 'House Number is required';
      if (!formData.district) contactErrors.district = 'District is required';
      if (!formData.country?.trim()) contactErrors.country = 'Country is required';
      if (!formData.family) contactErrors.family = 'परिवार चयन गर्नुहोस्';
      
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
              label="Surname (Last Name)"
              name="surname"
              value={formData.surname}
              onChange={handleChange}
              required
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
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                name="isAlive"
                checked={formData.isAlive}
                onChange={handleChange}
                className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
              />
              <span className="text-sm text-gray-700">Is Alive</span>
            </label>
          </div>
          {!formData.isAlive && (
            <NepaliDatePickerComponent
              label="Date of Death (BS)"
              name="dod"
              value={formData.dod}
              onChange={handleSelectChange}
            />
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
            <h4 className="text-sm font-semibold text-green-800">Passport Photo</h4>
            <p className="text-xs text-gray-500">2x2 inch, white background</p>
          </div>
          
          <div className="flex justify-center">
            {renderPhotoUpload('photo', 'Photo', photos.photoPreview, true, 'xl')}
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
      <FloatingInput
        label="House Number"
        name="houseNumber"
        value={formData.houseNumber}
        onChange={handleChange}
        icon={FaMapPin}
        required
        error={validationErrors.houseNumber}
        disabled={!!formData.family} // Auto-filled from family selection
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

  // ⭐ COMPLETE REWRITE: renderFamilyInfo - NO FAMILY CREATE, ONLY SELECTION
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
      label: `${m.name}${m.surname ? ` ${m.surname}` : ''} (रोल: ${m.rollNumber || 'N/A'})`,
    }));

    return (
      <div className="space-y-4">
        {/* ⭐ INFO: Family selection only */}
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

        {/* ⭐ MEMBER FAMILY SELECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="md:col-span-2">
            <SearchableSelect
              label="परिवार *"
              name="family"
              value={formData.family}
              onChange={(name, value) => {
                console.log('🔄 Family selected:', name, value);
                handleSelectChange(name, value);
              }}
              options={familyOptions}
              placeholder="परिवार खोज्नुहोस्..."
              required
              error={validationErrors.family}
            />
            {!formData.family && (
              <p className="text-xs text-red-500 mt-1">⚠️ कृपया परिवार चयन गर्नुहोस्</p>
            )}
            {familyOptions.length === 0 && (
              <p className="text-xs text-amber-500 mt-1">
                💡 कुनै परिवार छैन। कृपया "परिवारहरू" पृष्ठमा गएर नयाँ परिवार थप्नुहोस्।
              </p>
            )}
          </div>
          
          <FloatingInput
            label="घर नम्बर"
            name="houseNumber"
            value={formData.houseNumber}
            onChange={handleChange}
            icon={FaHome}
            required
            disabled={!!formData.family}
            error={validationErrors.houseNumber}
          />
          
          <FloatingInput
            label="परिवार नम्बर"
            name="familyNumber"
            value={formData.familyNumber}
            onChange={handleChange}
            icon={FaUsers}
            disabled={true}
          />

          <FloatingInput
            label="रोल नम्बर"
            name="rollNumber"
            value={formData.rollNumber}
            onChange={handleChange}
            icon={FaUsers}
            disabled={true}
          />

          <div className="md:col-span-2">
            <FloatingInput
              label="वंश / पुस्ता नम्बर"
              name="vanshaGenerationNumber"
              value={formData.vanshaGenerationNumber}
              onChange={handleChange}
              icon={FaTree}
              placeholder="खाली छोड्नुहोस् स्वत: जेनेरेट हुनेछ"
              disabled={!!formData.family}
            />
            <p className="text-xs text-gray-400 mt-1">
              {!formData.vanshaGenerationNumber ? '💡 खाली छोड्नुहोस् - स्वत: नम्बर जेनेरेट हुनेछ' : '✏️ म्यानुअल नम्बर प्रयोग गरिँदै'}
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
            label="सम्बन्ध"
            name="relationship"
            value={formData.relationship}
            onChange={handleSelectChange}
            options={relationships}
          />

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
      <SearchableSelect
        label="Status"
        name="status"
        value={formData.status}
        onChange={handleSelectChange}
        options={[
          { value: 'active', label: 'Active' },
          { value: 'inactive', label: 'Inactive' },
          { value: 'deceased', label: 'Deceased' },
        ]}
      />
      <SearchableSelect
        label="Verification Status"
        name="verificationStatus"
        value={formData.verificationStatus}
        onChange={handleSelectChange}
        options={[
          { value: 'verified', label: 'Verified' },
          { value: 'pending', label: 'Pending' },
          { value: 'rejected', label: 'Rejected' },
        ]}
      />
    </div>
  );

  const isSubmitting = loading || createMutation.isLoading || updateMutation.isLoading;

  return (
    <>
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
                {tabs.map((tab) => (
                  <button
                    key={tab.id}
                    type="button"
                    onClick={() => setActiveTab(tab.id)}
                    className={`
                      flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap
                      transition-all duration-300 relative rounded-t-lg
                      ${activeTab === tab.id
                        ? 'text-green-700 bg-white shadow-sm'
                        : 'text-gray-500 hover:text-green-600 hover:bg-green-50/50'
                      }
                    `}
                  >
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
    </>
  );
};

export default DataEntry;
// // src/pages/DataEntry.jsx - UPDATED COMPLETE FILE

// import React, { useState, useEffect } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { createMember, updateMember, getMembers } from '../api/members';
// import { getFamilies } from '../api/families';
// import toast from 'react-hot-toast';
// import { motion, AnimatePresence } from 'framer-motion';

// // Components
// import FloatingInput from '../components/FloatingInput';
// import SearchableSelect from '../components/SearchableSelect';
// import LocationSelect from '../components/LocationSelect';
// import ImageUpload from '../components/ImageUpload';
// import NepaliDatePickerComponent from '../components/NepaliDatePickerComponent';
// import Button from '../components/Button';

// // Data
// import { jobTitles, educationLevels, bloodGroups, maritalStatuses, relationships } from '../data/options';

// // Icons
// import { 
//   FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapPin, 
//   FaIdCard, FaBriefcase, FaGraduationCap, FaHeart, 
//   FaUsers, FaAddressCard, FaPassport, FaCar, FaFile,
//   FaInfoCircle, FaSave, FaTimes, FaCamera, FaUpload,
//   FaChevronLeft, FaChevronRight, FaImage, FaPlus, FaTrash,
//   FaHome, FaTree, FaChild
// } from 'react-icons/fa';
// import { PiGenderIntersexBold } from 'react-icons/pi';

// const DataEntry = ({ member, onSuccess, onCancel }) => {
//   const queryClient = useQueryClient();
//   const [activeTab, setActiveTab] = useState('personal');
//   const [loading, setLoading] = useState(false);
//   const [validationErrors, setValidationErrors] = useState({});

//   // Tab order for navigation
//   const tabOrder = ['personal', 'contact', 'family', 'identification', 'passport', 'documents', 'additional'];
//   const currentTabIndex = tabOrder.indexOf(activeTab);
//   const isLastTab = currentTabIndex === tabOrder.length - 1;
//   const isFirstTab = currentTabIndex === 0;

//   // Initial form data - Updated with required fields
//   const initialFormData = {
//     // Personal Information (Required)
//     name: '',
//     surname: '',
//     gender: 'male',
//     dob: '',
//     // Address (Required)
//     houseNumber: '',
//     district: '',
//     country: 'Nepal',
    
//     // Optional fields
//     placeOfBirth: '',
//     bloodGroup: 'unknown',
//     maritalStatus: 'single',
//     isAlive: true,
//     dod: '',
//     occupation: '',
//     education: '',
//     religion: '',
//     casteEthnicity: '',
//     nationality: 'Nepali',

//     // Contact Information
//     phone: '',
//     alternatePhone: '',
//     email: '',

//     // Address Information (Optional)
//     wardNumber: '',
//     toleVillage: '',
//     municipality: '',
//     province: '',
//     currentAddress: '',
//     permanentAddress: '',
//     postalCode: '',

//     // Family Information - UPDATED
//     houseNumber: '',
//     family: '',
//     familyNumber: '',
//     rollNumber: '',
//     vanshaGenerationNumber: '',
//     generation: 1,
//     relationship: 'member',
//     father: '',
//     mother: '',
//     grandfather: '',
//     grandmother: '',
//     spouse: '',
//     guardian: '',
//     childBirthOrder: '',
//     lineageRole: 'lineage_member',
//     familyContact: '',

//     // Identification
//     citizenshipNumber: '',
//     citizenshipIssueDate: '',
//     citizenshipIssueDistrict: '',
//     nationalIdNumber: '',
//     nationalIdIssueDate: '',

//     // Passport
//     passportNumber: '',
//     passportIssueDate: '',
//     passportExpiryDate: '',

//     // Driving License
//     drivingLicenseNumber: '',
//     drivingLicenseCategory: '',
//     drivingLicenseIssueDate: '',
//     drivingLicenseExpiryDate: '',

//     // Documents
//     birthCertificate: '',
//     marriageCertificate: '',
//     deathCertificate: '',
//     panCard: '',
//     voterId: '',

//     // Additional Information
//     biography: '',
//     notes: '',
//     specialRemarks: '',
//     medicalNotes: '',
//     disabilityInfo: '',

//     // Status
//     status: 'active',
//     verificationStatus: 'pending',
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [photos, setPhotos] = useState({
//     photo: null,
//     photoPreview: '',
//     citizenshipFront: null,
//     citizenshipFrontPreview: '',
//     citizenshipBack: null,
//     citizenshipBackPreview: '',
//     nationalIdFront: null,
//     nationalIdFrontPreview: '',
//     passportPhoto: null,
//     passportPhotoPreview: '',
//     drivingLicensePhoto: null,
//     drivingLicensePhotoPreview: '',
//   });

//   const [documents, setDocuments] = useState({
//     birthCertificate: null,
//     marriageCertificate: null,
//     deathCertificate: null,
//     panCard: null,
//     voterId: null,
//   });

//   // Fetch families data
//   const { data: familiesData } = useQuery({
//     queryKey: ['families'],
//     queryFn: () => getFamilies({ limit: 1000 }),
//     staleTime: 5 * 60 * 1000,
//   });

//   // Fetch members data for dropdowns
//   const { data: membersData } = useQuery({
//     queryKey: ['members-dropdown'],
//     queryFn: () => getMembers({ limit: 1000 }),
//     staleTime: 5 * 60 * 1000,
//   });

//   // Mutations
//   const createMutation = useMutation({
//     mutationFn: createMember,
//     onSuccess: () => {
//       toast.success('Member created successfully');
//       queryClient.invalidateQueries({ queryKey: ['members'] });
//       queryClient.invalidateQueries({ queryKey: ['members-dropdown'] });
//       queryClient.invalidateQueries({ queryKey: ['families'] });
//       queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
//       onSuccess?.();
//       resetForm();
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || 'Failed to create member');
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ id, data }) => updateMember(id, data),
//     onSuccess: () => {
//       toast.success('Member updated successfully');
//       queryClient.invalidateQueries({ queryKey: ['members'] });
//       queryClient.invalidateQueries({ queryKey: ['members-dropdown'] });
//       queryClient.invalidateQueries({ queryKey: ['families'] });
//       queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
//       onSuccess?.();
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || 'Failed to update member');
//     },
//   });

//   // Populate form when editing
//   useEffect(() => {
//     if (member) {
//       const populatedData = { ...initialFormData };
      
//       const fieldsToPopulate = { ...member };
      
//       if (member.family && typeof member.family === 'object') {
//         fieldsToPopulate.family = member.family._id || '';
//       }
//       if (member.father && typeof member.father === 'object') {
//         fieldsToPopulate.father = member.father._id || '';
//       }
//       if (member.mother && typeof member.mother === 'object') {
//         fieldsToPopulate.mother = member.mother._id || '';
//       }
//       if (member.grandfather && typeof member.grandfather === 'object') {
//         fieldsToPopulate.grandfather = member.grandfather._id || '';
//       }
//       if (member.grandmother && typeof member.grandmother === 'object') {
//         fieldsToPopulate.grandmother = member.grandmother._id || '';
//       }
//       if (member.spouse && typeof member.spouse === 'object') {
//         fieldsToPopulate.spouse = member.spouse._id || '';
//       }
//       if (member.guardian && typeof member.guardian === 'object') {
//         fieldsToPopulate.guardian = member.guardian._id || '';
//       }

//       Object.keys(fieldsToPopulate).forEach(key => {
//         if (fieldsToPopulate[key] !== undefined && fieldsToPopulate[key] !== null) {
//           populatedData[key] = fieldsToPopulate[key];
//         }
//       });

//       setFormData(populatedData);

//       setPhotos(prev => ({
//         ...prev,
//         photoPreview: member.photo || '',
//         citizenshipFrontPreview: member.citizenshipFront || '',
//         citizenshipBackPreview: member.citizenshipBack || '',
//         nationalIdFrontPreview: member.nationalIdFront || '',
//         passportPhotoPreview: member.passportPhoto || '',
//         drivingLicensePhotoPreview: member.drivingLicensePhoto || '',
//       }));
//     }
//   }, [member]);

//   const resetForm = () => {
//     Object.values(photos).forEach(value => {
//       if (typeof value === 'string' && value.startsWith('blob:')) {
//         URL.revokeObjectURL(value);
//       }
//     });

//     setFormData(initialFormData);
//     setPhotos({
//       photo: null,
//       photoPreview: '',
//       citizenshipFront: null,
//       citizenshipFrontPreview: '',
//       citizenshipBack: null,
//       citizenshipBackPreview: '',
//       nationalIdFront: null,
//       nationalIdFrontPreview: '',
//       passportPhoto: null,
//       passportPhotoPreview: '',
//       drivingLicensePhoto: null,
//       drivingLicensePhotoPreview: '',
//     });
//     setDocuments({
//       birthCertificate: null,
//       marriageCertificate: null,
//       deathCertificate: null,
//       panCard: null,
//       voterId: null,
//     });
//     setActiveTab('personal');
//     setValidationErrors({});
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//     // Clear validation error for this field
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleSelectChange = (name, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value || '',
//     }));
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handlePhotoUpload = (type, file) => {
//     if (!file) return;
    
//     const existingPreview = photos[`${type}Preview`];
//     if (typeof existingPreview === 'string' && existingPreview.startsWith('blob:')) {
//       URL.revokeObjectURL(existingPreview);
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPhotos((prev) => ({
//         ...prev,
//         [type]: file,
//         [`${type}Preview`]: reader.result,
//       }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const handlePhotoRemove = (type) => {
//     const preview = photos[`${type}Preview`];
//     if (typeof preview === 'string' && preview.startsWith('blob:')) {
//       URL.revokeObjectURL(preview);
//     }

//     setPhotos((prev) => ({
//       ...prev,
//       [type]: null,
//       [`${type}Preview`]: '',
//     }));
//   };

//   const handleImageSelect = (type, file, preview) => {
//     const existingPreview = photos[`${type}Preview`];
//     if (typeof existingPreview === 'string' && existingPreview.startsWith('blob:')) {
//       URL.revokeObjectURL(existingPreview);
//     }

//     setPhotos((prev) => ({
//       ...prev,
//       [type]: file,
//       [`${type}Preview`]: preview || (file ? URL.createObjectURL(file) : ''),
//     }));
//   };

//   const handleDocumentUpload = (type, file) => {
//     setDocuments(prev => ({
//       ...prev,
//       [type]: file
//     }));
//   };

//   // Validation function - Only required fields
//   const validateForm = () => {
//     const errors = {};
    
//     // Required fields
//     if (!formData.name?.trim()) {
//       errors.name = 'Full Name is required';
//     }
    
//     if (!formData.surname?.trim()) {
//       errors.surname = 'Surname is required';
//     }
    
//     if (!formData.gender) {
//       errors.gender = 'Gender is required';
//     }
    
//     if (!formData.dob) {
//       errors.dob = 'Date of Birth is required';
//     }
    
//     if (!formData.houseNumber?.trim()) {
//       errors.houseNumber = 'House Number is required';
//     }
    
//     if (!formData.district) {
//       errors.district = 'District is required';
//     }
    
//     if (!formData.country?.trim()) {
//       errors.country = 'Country is required';
//     }

//     // Check if photo is uploaded for new members
//     if (!member && !photos.photo && !photos.photoPreview) {
//       errors.photo = 'Passport photo is required';
//     }

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       // Show toast with error message
//       const errorMessages = Object.values(validationErrors);
//       errorMessages.forEach(msg => toast.error(msg));
//       // Switch to the tab with errors
//       if (validationErrors.name || validationErrors.surname || validationErrors.gender || validationErrors.dob || validationErrors.photo) {
//         setActiveTab('personal');
//       } else if (validationErrors.houseNumber || validationErrors.district || validationErrors.country) {
//         setActiveTab('contact');
//       }
//       return;
//     }

//     setLoading(true);

//     try {
//       const submitData = new FormData();
      
//       // Append form data
//       Object.keys(formData).forEach((key) => {
//         const value = formData[key];
//         if (value !== undefined && value !== null && value !== '') {
//           if (key === 'generation' || key === 'childBirthOrder') {
//             submitData.append(key, Number(value));
//           } else if (typeof value === 'boolean') {
//             submitData.append(key, String(value));
//           } else if (typeof value === 'object' && value._id) {
//             submitData.append(key, value._id);
//           } else {
//             submitData.append(key, value);
//           }
//         }
//       });

//       // Append photos
//       const photoFields = [
//         'photo', 'citizenshipFront', 'citizenshipBack', 
//         'nationalIdFront', 'passportPhoto', 'drivingLicensePhoto'
//       ];
      
//       photoFields.forEach(field => {
//         if (photos[field] && photos[field] instanceof File) {
//           submitData.append(field, photos[field]);
//         }
//       });

//       // Append documents
//       Object.entries(documents).forEach(([key, file]) => {
//         if (file && file instanceof File) {
//           submitData.append(key, file);
//         }
//       });

//       if (member) {
//         await updateMutation.mutateAsync({ id: member._id, data: submitData });
//         resetForm();
//       } else {
//         await createMutation.mutateAsync(submitData);
//       }
//     } catch (error) {
//       console.error('Submit error:', error);
//       toast.error(error.response?.data?.message || 'Failed to save member');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const goToNextTab = () => {
//     // Validate required fields before moving to next tab
//     if (activeTab === 'personal') {
//       const personalErrors = {};
//       if (!formData.name?.trim()) personalErrors.name = 'Full Name is required';
//       if (!formData.surname?.trim()) personalErrors.surname = 'Surname is required';
//       if (!formData.gender) personalErrors.gender = 'Gender is required';
//       if (!formData.dob) personalErrors.dob = 'Date of Birth is required';
//       if (!member && !photos.photo && !photos.photoPreview) personalErrors.photo = 'Passport photo is required';
      
//       if (Object.keys(personalErrors).length > 0) {
//         setValidationErrors(personalErrors);
//         Object.values(personalErrors).forEach(msg => toast.error(msg));
//         return;
//       }
//     }
    
//     if (activeTab === 'contact') {
//       const contactErrors = {};
//       if (!formData.houseNumber?.trim()) contactErrors.houseNumber = 'House Number is required';
//       if (!formData.district) contactErrors.district = 'District is required';
//       if (!formData.country?.trim()) contactErrors.country = 'Country is required';
      
//       if (Object.keys(contactErrors).length > 0) {
//         setValidationErrors(contactErrors);
//         Object.values(contactErrors).forEach(msg => toast.error(msg));
//         return;
//       }
//     }

//     const nextIndex = currentTabIndex + 1;
//     if (nextIndex < tabOrder.length) {
//       setActiveTab(tabOrder[nextIndex]);
//       setValidationErrors({});
//     }
//   };

//   const goToPrevTab = () => {
//     const prevIndex = currentTabIndex - 1;
//     if (prevIndex >= 0) {
//       setActiveTab(tabOrder[prevIndex]);
//       setValidationErrors({});
//     }
//   };

//   // Tab configuration
//   const tabs = [
//     { id: 'personal', label: 'Personal Info', icon: FaUser },
//     { id: 'contact', label: 'Contact & Address', icon: FaAddressCard },
//     { id: 'family', label: 'Family', icon: FaUsers },
//     { id: 'identification', label: 'ID Cards', icon: FaIdCard },
//     { id: 'passport', label: 'Passport & License', icon: FaPassport },
//     { id: 'documents', label: 'Documents', icon: FaFile },
//     { id: 'additional', label: 'Additional', icon: FaInfoCircle },
//   ];

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'personal':
//         return renderPersonalInfo();
//       case 'contact':
//         return renderContactAddress();
//       case 'family':
//         return renderFamilyInfo();
//       case 'identification':
//         return renderIdentification();
//       case 'passport':
//         return renderPassportLicense();
//       case 'documents':
//         return renderDocuments();
//       case 'additional':
//         return renderAdditionalInfo();
//       default:
//         return null;
//     }
//   };

//   // Photo Upload Component Renderer
//   const renderPhotoUpload = (type, label, preview, required = false, size = 'md') => {
//     const sizeClasses = {
//       sm: 'w-32 h-32',
//       md: 'w-40 h-40',
//       lg: 'w-48 h-48',
//       xl: 'w-56 h-56',
//     };

//     const hasError = validationErrors[type];

//     return (
//       <div className="flex flex-col items-center">
//         {preview ? (
//           <div className="relative group">
//             <div className={`${sizeClasses[size]} rounded-xl overflow-hidden border-2 ${hasError ? 'border-red-500' : 'border-green-200'} shadow-md hover:shadow-lg transition-all duration-300`}>
//               <img src={preview} alt={label} className="w-full h-full object-cover" />
//             </div>
//             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
//               <button
//                 type="button"
//                 onClick={() => handlePhotoRemove(type)}
//                 className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
//                 title="Remove photo"
//               >
//                 <FaTrash className="h-5 w-5 text-red-500" />
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className={`${sizeClasses[size]}`}>
//             <ImageUpload
//               onImageSelect={(file, preview) => handleImageSelect(type, file, preview)}
//               label={label}
//               maxSize={5}
//             />
//           </div>
//         )}
//         {required && !preview && (
//           <span className="text-xs text-red-500 mt-1">* Required</span>
//         )}
//         {hasError && (
//           <span className="text-xs text-red-500 mt-1">{validationErrors[type]}</span>
//         )}
//       </div>
//     );
//   };

//   const renderPersonalInfo = () => (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       <div className="md:col-span-2 space-y-3">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div className="md:col-span-2">
//             <FloatingInput
//               label="Full Name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               icon={FaUser}
//               error={validationErrors.name}
//             />
//           </div>
//           <div className="md:col-span-2">
//             <FloatingInput
//               label="Surname (Last Name)"
//               name="surname"
//               value={formData.surname}
//               onChange={handleChange}
//               required
//               icon={FaUser}
//               error={validationErrors.surname}
//             />
//           </div>
//           <SearchableSelect
//             label="Gender"
//             name="gender"
//             value={formData.gender}
//             onChange={handleSelectChange}
//             options={[
//               { value: 'male', label: 'Male' },
//               { value: 'female', label: 'Female' },
//               { value: 'other', label: 'Other' },
//             ]}
//             icon={PiGenderIntersexBold}
//             required
//             error={validationErrors.gender}
//           />
//           <NepaliDatePickerComponent
//             label="Date of Birth (BS)"
//             name="dob"
//             value={formData.dob}
//             onChange={handleSelectChange}
//             required
//             error={validationErrors.dob}
//           />
//           <FloatingInput
//             label="Place of Birth"
//             name="placeOfBirth"
//             value={formData.placeOfBirth}
//             onChange={handleChange}
//             icon={FaMapPin}
//           />
//           <SearchableSelect
//             label="Blood Group"
//             name="bloodGroup"
//             value={formData.bloodGroup}
//             onChange={handleSelectChange}
//             options={bloodGroups}
//           />
//           <SearchableSelect
//             label="Marital Status"
//             name="maritalStatus"
//             value={formData.maritalStatus}
//             onChange={handleSelectChange}
//             options={maritalStatuses}
//           />
//           <div className="md:col-span-2">
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="isAlive"
//                 checked={formData.isAlive}
//                 onChange={handleChange}
//                 className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//               />
//               <span className="text-sm text-gray-700">Is Alive</span>
//             </label>
//           </div>
//           {!formData.isAlive && (
//             <NepaliDatePickerComponent
//               label="Date of Death (BS)"
//               name="dod"
//               value={formData.dod}
//               onChange={handleSelectChange}
//             />
//           )}
//           <SearchableSelect
//             label="Occupation"
//             name="occupation"
//             value={formData.occupation}
//             onChange={handleSelectChange}
//             options={jobTitles}
//             creatable
//             placeholder="Search or enter occupation"
//           />
//           <SearchableSelect
//             label="Education"
//             name="education"
//             value={formData.education}
//             onChange={handleSelectChange}
//             options={educationLevels}
//             creatable
//             placeholder="Search or enter education"
//           />
//           <FloatingInput
//             label="Religion"
//             name="religion"
//             value={formData.religion}
//             onChange={handleChange}
//             icon={FaHeart}
//           />
//           <FloatingInput
//             label="Caste / Ethnicity"
//             name="casteEthnicity"
//             value={formData.casteEthnicity}
//             onChange={handleChange}
//             icon={FaUsers}
//           />
//           <FloatingInput
//             label="Nationality"
//             name="nationality"
//             value={formData.nationality}
//             onChange={handleChange}
//             icon={FaAddressCard}
//           />
//         </div>
//       </div>

//       <div className="md:col-span-1">
//         <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//           <div className="text-center mb-4">
//             <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
//               <FaCamera className="text-green-600 text-2xl" />
//             </div>
//             <h4 className="text-sm font-semibold text-green-800">Passport Photo</h4>
//             <p className="text-xs text-gray-500">2x2 inch, white background</p>
//           </div>
          
//           <div className="flex justify-center">
//             {renderPhotoUpload('photo', 'Photo', photos.photoPreview, true, 'xl')}
//           </div>
          
//           <div className="mt-3 flex justify-center gap-2 text-xs text-gray-400">
//             <span>PNG</span>
//             <span>•</span>
//             <span>JPG</span>
//             <span>•</span>
//             <span>JPEG</span>
//             <span>•</span>
//             <span>5MB</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderContactAddress = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//       <FloatingInput
//         label="Mobile Number"
//         name="phone"
//         value={formData.phone}
//         onChange={handleChange}
//         type="tel"
//         icon={FaPhone}
//       />
//       <FloatingInput
//         label="Alternate Mobile"
//         name="alternatePhone"
//         value={formData.alternatePhone}
//         onChange={handleChange}
//         type="tel"
//         icon={FaPhone}
//       />
//       <FloatingInput
//         label="Email"
//         name="email"
//         value={formData.email}
//         onChange={handleChange}
//         type="email"
//         icon={FaEnvelope}
//       />
//       <FloatingInput
//         label="House Number"
//         name="houseNumber"
//         value={formData.houseNumber}
//         onChange={handleChange}
//         icon={FaMapPin}
//         required
//         error={validationErrors.houseNumber}
//       />
//       <LocationSelect
//         label="Province"
//         type="province"
//         value={formData.province}
//         onChange={(type, value) => handleSelectChange('province', value)}
//       />
//       <LocationSelect
//         label="District"
//         type="district"
//         province={formData.province}
//         value={formData.district}
//         onChange={(type, value) => handleSelectChange('district', value)}
//         required
//         error={validationErrors.district}
//       />
//       <LocationSelect
//         label="Municipality"
//         type="municipality"
//         district={formData.district}
//         value={formData.municipality}
//         onChange={(type, value) => handleSelectChange('municipality', value)}
//       />
//       <FloatingInput
//         label="Tole / Village"
//         name="toleVillage"
//         value={formData.toleVillage}
//         onChange={handleChange}
//         icon={FaMapPin}
//       />
//       <LocationSelect
//         label="Ward"
//         type="ward"
//         value={formData.wardNumber}
//         onChange={(type, value) => handleSelectChange('wardNumber', value)}
//       />
//       <FloatingInput
//         label="Country"
//         name="country"
//         value={formData.country}
//         onChange={handleChange}
//         icon={FaMapPin}
//         required
//         error={validationErrors.country}
//       />
//       <FloatingInput
//         label="Postal Code"
//         name="postalCode"
//         value={formData.postalCode}
//         onChange={handleChange}
//         icon={FaMapPin}
//       />
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Current Address"
//           name="currentAddress"
//           value={formData.currentAddress}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaMapPin}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Permanent Address"
//           name="permanentAddress"
//           value={formData.permanentAddress}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaMapPin}
//         />
//       </div>
//     </div>
//   );

//   // UPDATED Family Information Section
//   const renderFamilyInfo = () => {
//     // Filter members by gender for relationship fields
//     const maleMembers = (membersData?.data || []).filter(m => m.gender === 'male');
//     const femaleMembers = (membersData?.data || []).filter(m => m.gender === 'female');
//     const allMembers = membersData?.data || [];

//     const familyOptions = (familiesData?.data || []).map(f => ({
//       value: f._id,
//       label: `${f.familyName} (${f.familyNumber}) - ${f.vanshaGenerationNumber || 'Vansha: N/A'}`,
//     }));

//     const createMemberOptions = (members) => members.map(m => ({
//       value: m._id,
//       label: `${m.name}${m.surname ? ` ${m.surname}` : ''} (${m.rollNumber || 'Roll: N/A'})`,
//     }));

//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         {/* House Number - New */}
//         <FloatingInput
//           label="House Number"
//           name="houseNumber"
//           value={formData.houseNumber}
//           onChange={handleChange}
//           icon={FaHome}
//           required
//           error={validationErrors.houseNumber}
//         />
        
//         <SearchableSelect
//           label="Family"
//           name="family"
//           value={formData.family}
//           onChange={handleSelectChange}
//           options={familyOptions}
//           placeholder="Search family..."
//         />
        
//         <FloatingInput
//           label="Family Number"
//           name="familyNumber"
//           value={formData.familyNumber}
//           onChange={handleChange}
//           icon={FaUsers}
//           disabled={true}
//         />

//         {/* Roll Number - New */}
//         <FloatingInput
//           label="Roll Number"
//           name="rollNumber"
//           value={formData.rollNumber}
//           onChange={handleChange}
//           icon={FaUsers}
//           disabled={true}
//         />

//         {/* Vansha/Generation Number - New */}
//         <div className="md:col-span-2">
//           <div className="flex items-center gap-4">
//             <div className="flex-1">
//               <FloatingInput
//                 label="Vansha / Generation Number"
//                 name="vanshaGenerationNumber"
//                 value={formData.vanshaGenerationNumber}
//                 onChange={handleChange}
//                 icon={FaTree}
//               />
//             </div>
//             <div className="flex gap-2 pt-6">
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   // Auto-generate next vansha number
//                   // This would call the API to get the next number
//                   const nextNumber = prompt('Enter Vansha/Generation Number:', 'Auto');
//                   if (nextNumber) {
//                     handleSelectChange('vanshaGenerationNumber', nextNumber);
//                   }
//                 }}
//               >
//                 Auto
//               </Button>
//               <Button
//                 type="button"
//                 variant="outline"
//                 size="sm"
//                 onClick={() => {
//                   const manualNumber = prompt('Enter Manual Vansha/Generation Number:', '');
//                   if (manualNumber) {
//                     handleSelectChange('vanshaGenerationNumber', manualNumber);
//                   }
//                 }}
//               >
//                 Manual
//               </Button>
//             </div>
//           </div>
//         </div>

//         <FloatingInput
//           label="Generation"
//           name="generation"
//           value={formData.generation}
//           onChange={handleChange}
//           type="number"
//           icon={FaUsers}
//         />
        
//         <SearchableSelect
//           label="Relationship"
//           name="relationship"
//           value={formData.relationship}
//           onChange={handleSelectChange}
//           options={relationships}
//         />

//         <SearchableSelect
//           label="Father"
//           name="father"
//           value={formData.father}
//           onChange={handleSelectChange}
//           options={createMemberOptions(maleMembers)}
//           placeholder="Search father..."
//         />
        
//         <SearchableSelect
//           label="Mother"
//           name="mother"
//           value={formData.mother}
//           onChange={handleSelectChange}
//           options={createMemberOptions(femaleMembers)}
//           placeholder="Search mother..."
//         />
        
//         <SearchableSelect
//           label="Grandfather"
//           name="grandfather"
//           value={formData.grandfather}
//           onChange={handleSelectChange}
//           options={createMemberOptions(maleMembers)}
//           placeholder="Search grandfather..."
//         />
        
//         <SearchableSelect
//           label="Grandmother"
//           name="grandmother"
//           value={formData.grandmother}
//           onChange={handleSelectChange}
//           options={createMemberOptions(femaleMembers)}
//           placeholder="Search grandmother..."
//         />
        
//         <SearchableSelect
//           label="Spouse"
//           name="spouse"
//           value={formData.spouse}
//           onChange={handleSelectChange}
//           options={createMemberOptions(allMembers)}
//           placeholder="Search spouse..."
//         />
        
//         <SearchableSelect
//           label="Guardian"
//           name="guardian"
//           value={formData.guardian}
//           onChange={handleSelectChange}
//           options={createMemberOptions(allMembers)}
//           placeholder="Search guardian..."
//         />
        
//         {/* Child Birth Order - New */}
//         <FloatingInput
//           label="Child Birth Order"
//           name="childBirthOrder"
//           value={formData.childBirthOrder}
//           onChange={handleChange}
//           type="number"
//           icon={FaChild}
//         />

//         {/* Lineage Role - New */}
//         <SearchableSelect
//           label="Lineage Role"
//           name="lineageRole"
//           value={formData.lineageRole}
//           onChange={handleSelectChange}
//           options={[
//             { value: 'lineage_head', label: 'Lineage Head' },
//             { value: 'lineage_member', label: 'Lineage Member' },
//             { value: 'spouse', label: 'Spouse' },
//             { value: 'other', label: 'Other' },
//           ]}
//         />

//         <FloatingInput
//           label="Family Contact"
//           name="familyContact"
//           value={formData.familyContact}
//           onChange={handleChange}
//           type="tel"
//           icon={FaPhone}
//         />
//       </div>
//     );
//   };

//   const renderIdentification = () => (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         <FloatingInput
//           label="Citizenship Number"
//           name="citizenshipNumber"
//           value={formData.citizenshipNumber}
//           onChange={handleChange}
//           icon={FaIdCard}
//         />
//         <NepaliDatePickerComponent
//           label="Citizenship Issue Date (BS)"
//           name="citizenshipIssueDate"
//           value={formData.citizenshipIssueDate}
//           onChange={handleSelectChange}
//         />
//         <LocationSelect
//           label="Citizenship Issue District"
//           type="district"
//           value={formData.citizenshipIssueDistrict}
//           onChange={(type, value) => handleSelectChange('citizenshipIssueDistrict', value)}
//         />
//         <FloatingInput
//           label="National ID Number"
//           name="nationalIdNumber"
//           value={formData.nationalIdNumber}
//           onChange={handleChange}
//           icon={FaIdCard}
//         />
//         <NepaliDatePickerComponent
//           label="NID Issue Date (BS)"
//           name="nationalIdIssueDate"
//           value={formData.nationalIdIssueDate}
//           onChange={handleSelectChange}
//         />
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//           <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Citizenship Front</h5>
//           <div className="flex justify-center">
//             {renderPhotoUpload('citizenshipFront', 'Citizenship Front', photos.citizenshipFrontPreview, false, 'md')}
//           </div>
//         </div>
//         <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//           <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Citizenship Back</h5>
//           <div className="flex justify-center">
//             {renderPhotoUpload('citizenshipBack', 'Citizenship Back', photos.citizenshipBackPreview, false, 'md')}
//           </div>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
//         <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 max-w-md mx-auto">
//           <h5 className="text-xs font-medium text-green-700 mb-2 text-center">National ID Front</h5>
//           <div className="flex justify-center">
//             {renderPhotoUpload('nationalIdFront', 'National ID Front', photos.nationalIdFrontPreview, false, 'md')}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderPassportLicense = () => (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         <FloatingInput
//           label="Passport Number"
//           name="passportNumber"
//           value={formData.passportNumber}
//           onChange={handleChange}
//           icon={FaPassport}
//         />
//         <NepaliDatePickerComponent
//           label="Passport Issue Date (BS)"
//           name="passportIssueDate"
//           value={formData.passportIssueDate}
//           onChange={handleSelectChange}
//         />
//         <NepaliDatePickerComponent
//           label="Passport Expiry Date (BS)"
//           name="passportExpiryDate"
//           value={formData.passportExpiryDate}
//           onChange={handleSelectChange}
//         />
//       </div>
      
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 max-w-md mx-auto">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Passport Photo</h5>
//         <div className="flex justify-center">
//           {renderPhotoUpload('passportPhoto', 'Passport Photo', photos.passportPhotoPreview, false, 'lg')}
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         <FloatingInput
//           label="Driving License Number"
//           name="drivingLicenseNumber"
//           value={formData.drivingLicenseNumber}
//           onChange={handleChange}
//           icon={FaCar}
//         />
//         <FloatingInput
//           label="DL Category"
//           name="drivingLicenseCategory"
//           value={formData.drivingLicenseCategory}
//           onChange={handleChange}
//           icon={FaCar}
//         />
//         <NepaliDatePickerComponent
//           label="DL Issue Date (BS)"
//           name="drivingLicenseIssueDate"
//           value={formData.drivingLicenseIssueDate}
//           onChange={handleSelectChange}
//         />
//         <NepaliDatePickerComponent
//           label="DL Expiry Date (BS)"
//           name="drivingLicenseExpiryDate"
//           value={formData.drivingLicenseExpiryDate}
//           onChange={handleSelectChange}
//         />
//       </div>
      
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 max-w-md mx-auto">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Driving License Photo</h5>
//         <div className="flex justify-center">
//           {renderPhotoUpload('drivingLicensePhoto', 'Driving License Photo', photos.drivingLicensePhotoPreview, false, 'lg')}
//         </div>
//       </div>
//     </div>
//   );

//   const renderDocuments = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Birth Certificate</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('birthCertificate', file)}
//             label="Upload Birth Certificate"
//             maxSize={5}
//           />
//         </div>
//         {documents.birthCertificate && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Marriage Certificate</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('marriageCertificate', file)}
//             label="Upload Marriage Certificate"
//             maxSize={5}
//           />
//         </div>
//         {documents.marriageCertificate && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Death Certificate</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('deathCertificate', file)}
//             label="Upload Death Certificate"
//             maxSize={5}
//           />
//         </div>
//         {documents.deathCertificate && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">PAN Card</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('panCard', file)}
//             label="Upload PAN Card"
//             maxSize={5}
//           />
//         </div>
//         {documents.panCard && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 md:col-span-2 max-w-md mx-auto">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Voter ID</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('voterId', file)}
//             label="Upload Voter ID"
//             maxSize={5}
//           />
//         </div>
//         {documents.voterId && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//     </div>
//   );

//   const renderAdditionalInfo = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Biography"
//           name="biography"
//           value={formData.biography}
//           onChange={handleChange}
//           type="textarea"
//           rows={3}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Notes"
//           name="notes"
//           value={formData.notes}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Special Remarks"
//           name="specialRemarks"
//           value={formData.specialRemarks}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Medical Notes"
//           name="medicalNotes"
//           value={formData.medicalNotes}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Disability Information"
//           name="disabilityInfo"
//           value={formData.disabilityInfo}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <SearchableSelect
//         label="Status"
//         name="status"
//         value={formData.status}
//         onChange={handleSelectChange}
//         options={[
//           { value: 'active', label: 'Active' },
//           { value: 'inactive', label: 'Inactive' },
//           { value: 'deceased', label: 'Deceased' },
//         ]}
//       />
//       <SearchableSelect
//         label="Verification Status"
//         name="verificationStatus"
//         value={formData.verificationStatus}
//         onChange={handleSelectChange}
//         options={[
//           { value: 'verified', label: 'Verified' },
//           { value: 'pending', label: 'Pending' },
//           { value: 'rejected', label: 'Rejected' },
//         ]}
//       />
//     </div>
//   );

//   const isSubmitting = loading || createMutation.isLoading || updateMutation.isLoading;

//   return (
//     <>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 rounded-xl p-4 shadow-sm border border-green-100">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
//             <div>
//               <h2 className="text-xl md:text-2xl font-bold text-green-800 flex items-center gap-2">
//                 {member ? (
//                   <>
//                     <span>✏️</span> Edit Member
//                   </>
//                 ) : (
//                   <>
//                     <span>➕</span> Add New Member
//                   </>
//                 )}
//               </h2>
//               <p className="text-xs text-green-600 mt-0.5">
//                 {member ? 'Update member information' : 'Enter member details'} • Step {currentTabIndex + 1} of {tabOrder.length}
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
//                 {member ? 'Editing' : 'New'}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Progress Bar */}
//         <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
//           <div 
//             className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all duration-500"
//             style={{ width: `${((currentTabIndex + 1) / tabOrder.length) * 100}%` }}
//           />
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 gap-4">
//           {/* Tabs */}
//           <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
//             <div className="bg-green-50/30 px-3 pt-2 overflow-x-auto">
//               <div className="flex min-w-max gap-1">
//                 {tabs.map((tab) => (
//                   <button
//                     key={tab.id}
//                     type="button"
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`
//                       flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap
//                       transition-all duration-300 relative rounded-t-lg
//                       ${activeTab === tab.id
//                         ? 'text-green-700 bg-white shadow-sm'
//                         : 'text-gray-500 hover:text-green-600 hover:bg-green-50/50'
//                       }
//                     `}
//                   >
//                     <tab.icon className={`h-3.5 w-3.5 ${activeTab === tab.id ? 'text-green-600' : ''}`} />
//                     <span className="hidden sm:inline">{tab.label}</span>
//                     <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
//                     {activeTab === tab.id && (
//                       <motion.div
//                         layoutId="activeTab"
//                         className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500"
//                         transition={{ duration: 0.3 }}
//                       />
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Tab Content */}
//             <div className="p-3 md:p-4">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={activeTab}
//                   initial={{ opacity: 0, x: 10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -10 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   {renderTabContent()}
//                 </motion.div>
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* Navigation Buttons */}
//           <div className="bg-white rounded-xl shadow-sm border border-green-100 p-3">
//             <div className="flex flex-col sm:flex-row justify-between gap-2">
//               <div className="flex gap-2 order-2 sm:order-1">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={onCancel}
//                   size="sm"
//                   className="px-4"
//                 >
//                   <FaTimes className="mr-1.5 text-xs" />
//                   Cancel
//                 </Button>
//               </div>
//               <div className="flex gap-2 order-1 sm:order-2">
//                 {!isFirstTab && (
//                   <Button
//                     type="button"
//                     variant="secondary"
//                     onClick={goToPrevTab}
//                     size="sm"
//                     className="px-4"
//                   >
//                     <FaChevronLeft className="mr-1.5 text-xs" />
//                     Previous
//                   </Button>
//                 )}
//                 {isLastTab ? (
//                   <Button
//                     type="submit"
//                     disabled={isSubmitting}
//                     variant="primary"
//                     size="sm"
//                     className="px-5"
//                   >
//                     {isSubmitting ? (
//                       <span className="flex items-center">
//                         <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Saving...
//                       </span>
//                     ) : (
//                       <>
//                         <FaSave className="mr-1.5 text-xs" />
//                         {member ? 'Update Member' : 'Save Member'}
//                       </>
//                     )}
//                   </Button>
//                 ) : (
//                   <Button
//                     type="button"
//                     variant="primary"
//                     onClick={goToNextTab}
//                     size="sm"
//                     className="px-5"
//                   >
//                     Next
//                     <FaChevronRight className="ml-1.5 text-xs" />
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </form>
//     </>
//   );
// };

// export default DataEntry;




// import React, { useState, useEffect } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import { createMember, updateMember, getMembers } from '../api/members';
// import { getFamilies } from '../api/families';
// import toast from 'react-hot-toast';
// import { motion, AnimatePresence } from 'framer-motion';

// // Components
// import FloatingInput from '../components/FloatingInput';
// import SearchableSelect from '../components/SearchableSelect';
// import LocationSelect from '../components/LocationSelect';
// import ImageUpload from '../components/ImageUpload';
// import NepaliDatePickerComponent from '../components/NepaliDatePickerComponent';
// import Button from '../components/Button';

// // Data
// import { jobTitles, educationLevels, bloodGroups, maritalStatuses, relationships } from '../data/options';

// // Icons
// import { 
//   FaUser, FaEnvelope, FaPhone, FaCalendar, FaMapPin, 
//   FaIdCard, FaBriefcase, FaGraduationCap, FaHeart, 
//   FaUsers, FaAddressCard, FaPassport, FaCar, FaFile,
//   FaInfoCircle, FaSave, FaTimes, FaCamera, FaUpload,
//   FaChevronLeft, FaChevronRight, FaImage, FaPlus, FaTrash
// } from 'react-icons/fa';
// import { PiGenderIntersexBold } from 'react-icons/pi';

// const DataEntry = ({ member, onSuccess, onCancel }) => {
//   const queryClient = useQueryClient();
//   const [activeTab, setActiveTab] = useState('personal');
//   const [loading, setLoading] = useState(false);
//   const [validationErrors, setValidationErrors] = useState({});

//   // Tab order for navigation
//   const tabOrder = ['personal', 'contact', 'family', 'identification', 'passport', 'documents', 'additional'];
//   const currentTabIndex = tabOrder.indexOf(activeTab);
//   const isLastTab = currentTabIndex === tabOrder.length - 1;
//   const isFirstTab = currentTabIndex === 0;

//   // Initial form data - Updated with required fields
//   const initialFormData = {
//     // Personal Information (Required)
//     name: '',
//     surname: '',
//     gender: 'male',
//     dob: '',
//     // Address (Required)
//     houseNumber: '',
//     district: '',
//     country: 'Nepal',
    
//     // Optional fields
//     placeOfBirth: '',
//     bloodGroup: 'unknown',
//     maritalStatus: 'single',
//     isAlive: true,
//     dod: '',
//     occupation: '',
//     education: '',
//     religion: '',
//     casteEthnicity: '',
//     nationality: 'Nepali',

//     // Contact Information
//     phone: '',
//     alternatePhone: '',
//     email: '',

//     // Address Information (Optional)
//     wardNumber: '',
//     toleVillage: '',
//     municipality: '',
//     province: '',
//     currentAddress: '',
//     permanentAddress: '',
//     postalCode: '',

//     // Family Information
//     family: '',
//     familyNumber: '',
//     rollNumber: '',
//     generation: 1,
//     relationship: 'member',
//     father: '',
//     mother: '',
//     grandfather: '',
//     grandmother: '',
//     spouse: '',
//     guardian: '',
//     familyContact: '',

//     // Identification
//     citizenshipNumber: '',
//     citizenshipIssueDate: '',
//     citizenshipIssueDistrict: '',
//     nationalIdNumber: '',
//     nationalIdIssueDate: '',

//     // Passport
//     passportNumber: '',
//     passportIssueDate: '',
//     passportExpiryDate: '',

//     // Driving License
//     drivingLicenseNumber: '',
//     drivingLicenseCategory: '',
//     drivingLicenseIssueDate: '',
//     drivingLicenseExpiryDate: '',

//     // Documents
//     birthCertificate: '',
//     marriageCertificate: '',
//     deathCertificate: '',
//     panCard: '',
//     voterId: '',

//     // Additional Information
//     biography: '',
//     notes: '',
//     specialRemarks: '',
//     medicalNotes: '',
//     disabilityInfo: '',

//     // Status
//     status: 'active',
//     verificationStatus: 'pending',
//   };

//   const [formData, setFormData] = useState(initialFormData);
//   const [photos, setPhotos] = useState({
//     photo: null,
//     photoPreview: '',
//     citizenshipFront: null,
//     citizenshipFrontPreview: '',
//     citizenshipBack: null,
//     citizenshipBackPreview: '',
//     nationalIdFront: null,
//     nationalIdFrontPreview: '',
//     passportPhoto: null,
//     passportPhotoPreview: '',
//     drivingLicensePhoto: null,
//     drivingLicensePhotoPreview: '',
//   });

//   const [documents, setDocuments] = useState({
//     birthCertificate: null,
//     marriageCertificate: null,
//     deathCertificate: null,
//     panCard: null,
//     voterId: null,
//   });

//   // Fetch families data
//   const { data: familiesData } = useQuery({
//     queryKey: ['families'],
//     queryFn: () => getFamilies({ limit: 1000 }),
//     staleTime: 5 * 60 * 1000,
//   });

//   // Fetch members data for dropdowns
//   const { data: membersData } = useQuery({
//     queryKey: ['members-dropdown'],
//     queryFn: () => getMembers({ limit: 1000 }),
//     staleTime: 5 * 60 * 1000,
//   });

//   // Mutations
//   const createMutation = useMutation({
//     mutationFn: createMember,
//     onSuccess: () => {
//       toast.success('Member created successfully');
//       queryClient.invalidateQueries({ queryKey: ['members'] });
//       queryClient.invalidateQueries({ queryKey: ['members-dropdown'] });
//       queryClient.invalidateQueries({ queryKey: ['families'] });
//       queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
//       onSuccess?.();
//       resetForm();
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || 'Failed to create member');
//     },
//   });

//   const updateMutation = useMutation({
//     mutationFn: ({ id, data }) => updateMember(id, data),
//     onSuccess: () => {
//       toast.success('Member updated successfully');
//       queryClient.invalidateQueries({ queryKey: ['members'] });
//       queryClient.invalidateQueries({ queryKey: ['members-dropdown'] });
//       queryClient.invalidateQueries({ queryKey: ['families'] });
//       queryClient.invalidateQueries({ queryKey: ['dashboardStats'] });
//       onSuccess?.();
//     },
//     onError: (error) => {
//       toast.error(error.response?.data?.message || 'Failed to update member');
//     },
//   });

//   // Populate form when editing
//   useEffect(() => {
//     if (member) {
//       const populatedData = { ...initialFormData };
      
//       const fieldsToPopulate = { ...member };
      
//       if (member.family && typeof member.family === 'object') {
//         fieldsToPopulate.family = member.family._id || '';
//       }
//       if (member.father && typeof member.father === 'object') {
//         fieldsToPopulate.father = member.father._id || '';
//       }
//       if (member.mother && typeof member.mother === 'object') {
//         fieldsToPopulate.mother = member.mother._id || '';
//       }
//       if (member.grandfather && typeof member.grandfather === 'object') {
//         fieldsToPopulate.grandfather = member.grandfather._id || '';
//       }
//       if (member.grandmother && typeof member.grandmother === 'object') {
//         fieldsToPopulate.grandmother = member.grandmother._id || '';
//       }
//       if (member.spouse && typeof member.spouse === 'object') {
//         fieldsToPopulate.spouse = member.spouse._id || '';
//       }
//       if (member.guardian && typeof member.guardian === 'object') {
//         fieldsToPopulate.guardian = member.guardian._id || '';
//       }

//       Object.keys(fieldsToPopulate).forEach(key => {
//         if (fieldsToPopulate[key] !== undefined && fieldsToPopulate[key] !== null) {
//           populatedData[key] = fieldsToPopulate[key];
//         }
//       });

//       setFormData(populatedData);

//       setPhotos(prev => ({
//         ...prev,
//         photoPreview: member.photo || '',
//         citizenshipFrontPreview: member.citizenshipFront || '',
//         citizenshipBackPreview: member.citizenshipBack || '',
//         nationalIdFrontPreview: member.nationalIdFront || '',
//         passportPhotoPreview: member.passportPhoto || '',
//         drivingLicensePhotoPreview: member.drivingLicensePhoto || '',
//       }));
//     }
//   }, [member]);

//   const resetForm = () => {
//     Object.values(photos).forEach(value => {
//       if (typeof value === 'string' && value.startsWith('blob:')) {
//         URL.revokeObjectURL(value);
//       }
//     });

//     setFormData(initialFormData);
//     setPhotos({
//       photo: null,
//       photoPreview: '',
//       citizenshipFront: null,
//       citizenshipFrontPreview: '',
//       citizenshipBack: null,
//       citizenshipBackPreview: '',
//       nationalIdFront: null,
//       nationalIdFrontPreview: '',
//       passportPhoto: null,
//       passportPhotoPreview: '',
//       drivingLicensePhoto: null,
//       drivingLicensePhotoPreview: '',
//     });
//     setDocuments({
//       birthCertificate: null,
//       marriageCertificate: null,
//       deathCertificate: null,
//       panCard: null,
//       voterId: null,
//     });
//     setActiveTab('personal');
//     setValidationErrors({});
//   };

//   const handleChange = (e) => {
//     const { name, value, type, checked } = e.target;
//     setFormData((prev) => ({
//       ...prev,
//       [name]: type === 'checkbox' ? checked : value,
//     }));
//     // Clear validation error for this field
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handleSelectChange = (name, value) => {
//     setFormData((prev) => ({
//       ...prev,
//       [name]: value || '',
//     }));
//     if (validationErrors[name]) {
//       setValidationErrors(prev => ({ ...prev, [name]: '' }));
//     }
//   };

//   const handlePhotoUpload = (type, file) => {
//     if (!file) return;
    
//     const existingPreview = photos[`${type}Preview`];
//     if (typeof existingPreview === 'string' && existingPreview.startsWith('blob:')) {
//       URL.revokeObjectURL(existingPreview);
//     }

//     const reader = new FileReader();
//     reader.onloadend = () => {
//       setPhotos((prev) => ({
//         ...prev,
//         [type]: file,
//         [`${type}Preview`]: reader.result,
//       }));
//     };
//     reader.readAsDataURL(file);
//   };

//   const handlePhotoRemove = (type) => {
//     const preview = photos[`${type}Preview`];
//     if (typeof preview === 'string' && preview.startsWith('blob:')) {
//       URL.revokeObjectURL(preview);
//     }

//     setPhotos((prev) => ({
//       ...prev,
//       [type]: null,
//       [`${type}Preview`]: '',
//     }));
//   };

//   const handleImageSelect = (type, file, preview) => {
//     const existingPreview = photos[`${type}Preview`];
//     if (typeof existingPreview === 'string' && existingPreview.startsWith('blob:')) {
//       URL.revokeObjectURL(existingPreview);
//     }

//     setPhotos((prev) => ({
//       ...prev,
//       [type]: file,
//       [`${type}Preview`]: preview || (file ? URL.createObjectURL(file) : ''),
//     }));
//   };

//   const handleDocumentUpload = (type, file) => {
//     setDocuments(prev => ({
//       ...prev,
//       [type]: file
//     }));
//   };

//   // Validation function - Only required fields
//   const validateForm = () => {
//     const errors = {};
    
//     // Required fields
//     if (!formData.name?.trim()) {
//       errors.name = 'Full Name is required';
//     }
    
//     if (!formData.surname?.trim()) {
//       errors.surname = 'Surname is required';
//     }
    
//     if (!formData.gender) {
//       errors.gender = 'Gender is required';
//     }
    
//     if (!formData.dob) {
//       errors.dob = 'Date of Birth is required';
//     }
    
//     if (!formData.houseNumber?.trim()) {
//       errors.houseNumber = 'House Number is required';
//     }
    
//     if (!formData.district) {
//       errors.district = 'District is required';
//     }
    
//     if (!formData.country?.trim()) {
//       errors.country = 'Country is required';
//     }

//     // Check if photo is uploaded for new members
//     if (!member && !photos.photo && !photos.photoPreview) {
//       errors.photo = 'Passport photo is required';
//     }

//     setValidationErrors(errors);
//     return Object.keys(errors).length === 0;
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
    
//     if (!validateForm()) {
//       // Show toast with error message
//       const errorMessages = Object.values(validationErrors);
//       errorMessages.forEach(msg => toast.error(msg));
//       // Switch to the tab with errors
//       if (validationErrors.name || validationErrors.surname || validationErrors.gender || validationErrors.dob || validationErrors.photo) {
//         setActiveTab('personal');
//       } else if (validationErrors.houseNumber || validationErrors.district || validationErrors.country) {
//         setActiveTab('contact');
//       }
//       return;
//     }

//     setLoading(true);

//     try {
//       const submitData = new FormData();
      
//       // Append form data
//       Object.keys(formData).forEach((key) => {
//         const value = formData[key];
//         if (value !== undefined && value !== null && value !== '') {
//           if (key === 'generation') {
//             submitData.append(key, Number(value));
//           } else if (typeof value === 'boolean') {
//             submitData.append(key, String(value));
//           } else if (typeof value === 'object' && value._id) {
//             submitData.append(key, value._id);
//           } else {
//             submitData.append(key, value);
//           }
//         }
//       });

//       // Append photos
//       const photoFields = [
//         'photo', 'citizenshipFront', 'citizenshipBack', 
//         'nationalIdFront', 'passportPhoto', 'drivingLicensePhoto'
//       ];
      
//       photoFields.forEach(field => {
//         if (photos[field] && photos[field] instanceof File) {
//           submitData.append(field, photos[field]);
//         }
//       });

//       // Append documents
//       Object.entries(documents).forEach(([key, file]) => {
//         if (file && file instanceof File) {
//           submitData.append(key, file);
//         }
//       });

//       if (member) {
//         await updateMutation.mutateAsync({ id: member._id, data: submitData });
//         resetForm();
//       } else {
//         await createMutation.mutateAsync(submitData);
//       }
//     } catch (error) {
//       console.error('Submit error:', error);
//       toast.error(error.response?.data?.message || 'Failed to save member');
//     } finally {
//       setLoading(false);
//     }
//   };

//   const goToNextTab = () => {
//     // Validate required fields before moving to next tab
//     if (activeTab === 'personal') {
//       const personalErrors = {};
//       if (!formData.name?.trim()) personalErrors.name = 'Full Name is required';
//       if (!formData.surname?.trim()) personalErrors.surname = 'Surname is required';
//       if (!formData.gender) personalErrors.gender = 'Gender is required';
//       if (!formData.dob) personalErrors.dob = 'Date of Birth is required';
//       if (!member && !photos.photo && !photos.photoPreview) personalErrors.photo = 'Passport photo is required';
      
//       if (Object.keys(personalErrors).length > 0) {
//         setValidationErrors(personalErrors);
//         Object.values(personalErrors).forEach(msg => toast.error(msg));
//         return;
//       }
//     }
    
//     if (activeTab === 'contact') {
//       const contactErrors = {};
//       if (!formData.houseNumber?.trim()) contactErrors.houseNumber = 'House Number is required';
//       if (!formData.district) contactErrors.district = 'District is required';
//       if (!formData.country?.trim()) contactErrors.country = 'Country is required';
      
//       if (Object.keys(contactErrors).length > 0) {
//         setValidationErrors(contactErrors);
//         Object.values(contactErrors).forEach(msg => toast.error(msg));
//         return;
//       }
//     }

//     const nextIndex = currentTabIndex + 1;
//     if (nextIndex < tabOrder.length) {
//       setActiveTab(tabOrder[nextIndex]);
//       setValidationErrors({});
//     }
//   };

//   const goToPrevTab = () => {
//     const prevIndex = currentTabIndex - 1;
//     if (prevIndex >= 0) {
//       setActiveTab(tabOrder[prevIndex]);
//       setValidationErrors({});
//     }
//   };

//   // Tab configuration
//   const tabs = [
//     { id: 'personal', label: 'Personal Info', icon: FaUser },
//     { id: 'contact', label: 'Contact & Address', icon: FaAddressCard },
//     { id: 'family', label: 'Family', icon: FaUsers },
//     { id: 'identification', label: 'ID Cards', icon: FaIdCard },
//     { id: 'passport', label: 'Passport & License', icon: FaPassport },
//     { id: 'documents', label: 'Documents', icon: FaFile },
//     { id: 'additional', label: 'Additional', icon: FaInfoCircle },
//   ];

//   const renderTabContent = () => {
//     switch (activeTab) {
//       case 'personal':
//         return renderPersonalInfo();
//       case 'contact':
//         return renderContactAddress();
//       case 'family':
//         return renderFamilyInfo();
//       case 'identification':
//         return renderIdentification();
//       case 'passport':
//         return renderPassportLicense();
//       case 'documents':
//         return renderDocuments();
//       case 'additional':
//         return renderAdditionalInfo();
//       default:
//         return null;
//     }
//   };

//   // Photo Upload Component Renderer
//   const renderPhotoUpload = (type, label, preview, required = false, size = 'md') => {
//     const sizeClasses = {
//       sm: 'w-32 h-32',
//       md: 'w-40 h-40',
//       lg: 'w-48 h-48',
//       xl: 'w-56 h-56',
//     };

//     const hasError = validationErrors[type];

//     return (
//       <div className="flex flex-col items-center">
//         {preview ? (
//           <div className="relative group">
//             <div className={`${sizeClasses[size]} rounded-xl overflow-hidden border-2 ${hasError ? 'border-red-500' : 'border-green-200'} shadow-md hover:shadow-lg transition-all duration-300`}>
//               <img src={preview} alt={label} className="w-full h-full object-cover" />
//             </div>
//             <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl flex items-center justify-center">
//               <button
//                 type="button"
//                 onClick={() => handlePhotoRemove(type)}
//                 className="p-2 bg-white/90 rounded-full hover:bg-white transition-colors"
//                 title="Remove photo"
//               >
//                 <FaTrash className="h-5 w-5 text-red-500" />
//               </button>
//             </div>
//           </div>
//         ) : (
//           <div className={`${sizeClasses[size]}`}>
//             <ImageUpload
//               onImageSelect={(file, preview) => handleImageSelect(type, file, preview)}
//               label={label}
//               maxSize={5}
//             />
//           </div>
//         )}
//         {required && !preview && (
//           <span className="text-xs text-red-500 mt-1">* Required</span>
//         )}
//         {hasError && (
//           <span className="text-xs text-red-500 mt-1">{validationErrors[type]}</span>
//         )}
//       </div>
//     );
//   };

//   const renderPersonalInfo = () => (
//     <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
//       <div className="md:col-span-2 space-y-3">
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//           <div className="md:col-span-2">
//             <FloatingInput
//               label="Full Name"
//               name="name"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               icon={FaUser}
//               error={validationErrors.name}
//             />
//           </div>
//           <div className="md:col-span-2">
//             <FloatingInput
//               label="Surname (Last Name)"
//               name="surname"
//               value={formData.surname}
//               onChange={handleChange}
//               required
//               icon={FaUser}
//               error={validationErrors.surname}
//             />
//           </div>
//           <SearchableSelect
//             label="Gender"
//             name="gender"
//             value={formData.gender}
//             onChange={handleSelectChange}
//             options={[
//               { value: 'male', label: 'Male' },
//               { value: 'female', label: 'Female' },
//               { value: 'other', label: 'Other' },
//             ]}
//             icon={PiGenderIntersexBold}
//             required
//             error={validationErrors.gender}
//           />
//           <NepaliDatePickerComponent
//             label="Date of Birth (BS)"
//             name="dob"
//             value={formData.dob}
//             onChange={handleSelectChange}
//             required
//             error={validationErrors.dob}
//           />
//           <FloatingInput
//             label="Place of Birth"
//             name="placeOfBirth"
//             value={formData.placeOfBirth}
//             onChange={handleChange}
//             icon={FaMapPin}
//           />
//           <SearchableSelect
//             label="Blood Group"
//             name="bloodGroup"
//             value={formData.bloodGroup}
//             onChange={handleSelectChange}
//             options={bloodGroups}
//           />
//           <SearchableSelect
//             label="Marital Status"
//             name="maritalStatus"
//             value={formData.maritalStatus}
//             onChange={handleSelectChange}
//             options={maritalStatuses}
//           />
//           <div className="md:col-span-2">
//             <label className="flex items-center gap-2 cursor-pointer">
//               <input
//                 type="checkbox"
//                 name="isAlive"
//                 checked={formData.isAlive}
//                 onChange={handleChange}
//                 className="h-4 w-4 text-green-600 focus:ring-green-500 border-gray-300 rounded"
//               />
//               <span className="text-sm text-gray-700">Is Alive</span>
//             </label>
//           </div>
//           {!formData.isAlive && (
//             <NepaliDatePickerComponent
//               label="Date of Death (BS)"
//               name="dod"
//               value={formData.dod}
//               onChange={handleSelectChange}
//             />
//           )}
//           <SearchableSelect
//             label="Occupation"
//             name="occupation"
//             value={formData.occupation}
//             onChange={handleSelectChange}
//             options={jobTitles}
//             creatable
//             placeholder="Search or enter occupation"
//           />
//           <SearchableSelect
//             label="Education"
//             name="education"
//             value={formData.education}
//             onChange={handleSelectChange}
//             options={educationLevels}
//             creatable
//             placeholder="Search or enter education"
//           />
//           <FloatingInput
//             label="Religion"
//             name="religion"
//             value={formData.religion}
//             onChange={handleChange}
//             icon={FaHeart}
//           />
//           <FloatingInput
//             label="Caste / Ethnicity"
//             name="casteEthnicity"
//             value={formData.casteEthnicity}
//             onChange={handleChange}
//             icon={FaUsers}
//           />
//           <FloatingInput
//             label="Nationality"
//             name="nationality"
//             value={formData.nationality}
//             onChange={handleChange}
//             icon={FaAddressCard}
//           />
//         </div>
//       </div>

//       <div className="md:col-span-1">
//         <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//           <div className="text-center mb-4">
//             <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-emerald-100 rounded-full flex items-center justify-center mx-auto mb-2">
//               <FaCamera className="text-green-600 text-2xl" />
//             </div>
//             <h4 className="text-sm font-semibold text-green-800">Passport Photo</h4>
//             <p className="text-xs text-gray-500">2x2 inch, white background</p>
//           </div>
          
//           <div className="flex justify-center">
//             {renderPhotoUpload('photo', 'Photo', photos.photoPreview, true, 'xl')}
//           </div>
          
//           <div className="mt-3 flex justify-center gap-2 text-xs text-gray-400">
//             <span>PNG</span>
//             <span>•</span>
//             <span>JPG</span>
//             <span>•</span>
//             <span>JPEG</span>
//             <span>•</span>
//             <span>5MB</span>
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderContactAddress = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//       <FloatingInput
//         label="Mobile Number"
//         name="phone"
//         value={formData.phone}
//         onChange={handleChange}
//         type="tel"
//         icon={FaPhone}
//       />
//       <FloatingInput
//         label="Alternate Mobile"
//         name="alternatePhone"
//         value={formData.alternatePhone}
//         onChange={handleChange}
//         type="tel"
//         icon={FaPhone}
//       />
//       <FloatingInput
//         label="Email"
//         name="email"
//         value={formData.email}
//         onChange={handleChange}
//         type="email"
//         icon={FaEnvelope}
//       />
//       <FloatingInput
//         label="House Number"
//         name="houseNumber"
//         value={formData.houseNumber}
//         onChange={handleChange}
//         icon={FaMapPin}
//         required
//         error={validationErrors.houseNumber}
//       />
//       <LocationSelect
//         label="Province"
//         type="province"
//         value={formData.province}
//         onChange={(type, value) => handleSelectChange('province', value)}
//       />
//       <LocationSelect
//         label="District"
//         type="district"
//         province={formData.province}
//         value={formData.district}
//         onChange={(type, value) => handleSelectChange('district', value)}
//         required
//         error={validationErrors.district}
//       />
//       <LocationSelect
//         label="Municipality"
//         type="municipality"
//         district={formData.district}
//         value={formData.municipality}
//         onChange={(type, value) => handleSelectChange('municipality', value)}
//       />
//       <FloatingInput
//         label="Tole / Village"
//         name="toleVillage"
//         value={formData.toleVillage}
//         onChange={handleChange}
//         icon={FaMapPin}
//       />
//       <LocationSelect
//         label="Ward"
//         type="ward"
//         value={formData.wardNumber}
//         onChange={(type, value) => handleSelectChange('wardNumber', value)}
//       />
//       <FloatingInput
//         label="Country"
//         name="country"
//         value={formData.country}
//         onChange={handleChange}
//         icon={FaMapPin}
//         required
//         error={validationErrors.country}
//       />
//       <FloatingInput
//         label="Postal Code"
//         name="postalCode"
//         value={formData.postalCode}
//         onChange={handleChange}
//         icon={FaMapPin}
//       />
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Current Address"
//           name="currentAddress"
//           value={formData.currentAddress}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaMapPin}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Permanent Address"
//           name="permanentAddress"
//           value={formData.permanentAddress}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaMapPin}
//         />
//       </div>
//     </div>
//   );

//   const renderFamilyInfo = () => {
//     // Filter members by gender for relationship fields
//     const maleMembers = (membersData?.data || []).filter(m => m.gender === 'male');
//     const femaleMembers = (membersData?.data || []).filter(m => m.gender === 'female');
//     const allMembers = membersData?.data || [];

//     const familyOptions = (familiesData?.data || []).map(f => ({
//       value: f._id,
//       label: `${f.familyName} (${f.familyNumber})`,
//     }));

//     const createMemberOptions = (members) => members.map(m => ({
//       value: m._id,
//       label: `${m.name}${m.surname ? ` ${m.surname}` : ''} (${m.memberNumber || 'N/A'})`,
//     }));

//     return (
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         <SearchableSelect
//           label="Family"
//           name="family"
//           value={formData.family}
//           onChange={handleSelectChange}
//           options={familyOptions}
//           placeholder="Search family..."
//         />
//         <FloatingInput
//           label="Family Number"
//           name="familyNumber"
//           value={formData.familyNumber}
//           onChange={handleChange}
//           icon={FaUsers}
//         />
//         <FloatingInput
//           label="Roll Number"
//           name="rollNumber"
//           value={formData.rollNumber}
//           onChange={handleChange}
//           icon={FaUsers}
//         />
//         <FloatingInput
//           label="Generation"
//           name="generation"
//           value={formData.generation}
//           onChange={handleChange}
//           type="number"
//           icon={FaUsers}
//         />
//         <SearchableSelect
//           label="Relationship"
//           name="relationship"
//           value={formData.relationship}
//           onChange={handleSelectChange}
//           options={relationships}
//         />
//         <FloatingInput
//           label="Family Contact"
//           name="familyContact"
//           value={formData.familyContact}
//           onChange={handleChange}
//           type="tel"
//           icon={FaPhone}
//         />
//         <SearchableSelect
//           label="Father"
//           name="father"
//           value={formData.father}
//           onChange={handleSelectChange}
//           options={createMemberOptions(maleMembers)}
//           placeholder="Search father..."
//         />
//         <SearchableSelect
//           label="Mother"
//           name="mother"
//           value={formData.mother}
//           onChange={handleSelectChange}
//           options={createMemberOptions(femaleMembers)}
//           placeholder="Search mother..."
//         />
//         <SearchableSelect
//           label="Grandfather"
//           name="grandfather"
//           value={formData.grandfather}
//           onChange={handleSelectChange}
//           options={createMemberOptions(maleMembers)}
//           placeholder="Search grandfather..."
//         />
//         <SearchableSelect
//           label="Grandmother"
//           name="grandmother"
//           value={formData.grandmother}
//           onChange={handleSelectChange}
//           options={createMemberOptions(femaleMembers)}
//           placeholder="Search grandmother..."
//         />
//         <SearchableSelect
//           label="Spouse"
//           name="spouse"
//           value={formData.spouse}
//           onChange={handleSelectChange}
//           options={createMemberOptions(allMembers)}
//           placeholder="Search spouse..."
//         />
//         <SearchableSelect
//           label="Guardian"
//           name="guardian"
//           value={formData.guardian}
//           onChange={handleSelectChange}
//           options={createMemberOptions(allMembers)}
//           placeholder="Search guardian..."
//         />
//       </div>
//     );
//   };

//   const renderIdentification = () => (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         <FloatingInput
//           label="Citizenship Number"
//           name="citizenshipNumber"
//           value={formData.citizenshipNumber}
//           onChange={handleChange}
//           icon={FaIdCard}
//         />
//         <NepaliDatePickerComponent
//           label="Citizenship Issue Date (BS)"
//           name="citizenshipIssueDate"
//           value={formData.citizenshipIssueDate}
//           onChange={handleSelectChange}
//         />
//         <LocationSelect
//           label="Citizenship Issue District"
//           type="district"
//           value={formData.citizenshipIssueDistrict}
//           onChange={(type, value) => handleSelectChange('citizenshipIssueDistrict', value)}
//         />
//         <FloatingInput
//           label="National ID Number"
//           name="nationalIdNumber"
//           value={formData.nationalIdNumber}
//           onChange={handleChange}
//           icon={FaIdCard}
//         />
//         <NepaliDatePickerComponent
//           label="NID Issue Date (BS)"
//           name="nationalIdIssueDate"
//           value={formData.nationalIdIssueDate}
//           onChange={handleSelectChange}
//         />
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//         <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//           <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Citizenship Front</h5>
//           <div className="flex justify-center">
//             {renderPhotoUpload('citizenshipFront', 'Citizenship Front', photos.citizenshipFrontPreview, false, 'md')}
//           </div>
//         </div>
//         <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//           <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Citizenship Back</h5>
//           <div className="flex justify-center">
//             {renderPhotoUpload('citizenshipBack', 'Citizenship Back', photos.citizenshipBackPreview, false, 'md')}
//           </div>
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
//         <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 max-w-md mx-auto">
//           <h5 className="text-xs font-medium text-green-700 mb-2 text-center">National ID Front</h5>
//           <div className="flex justify-center">
//             {renderPhotoUpload('nationalIdFront', 'National ID Front', photos.nationalIdFrontPreview, false, 'md')}
//           </div>
//         </div>
//       </div>
//     </div>
//   );

//   const renderPassportLicense = () => (
//     <div className="space-y-4">
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         <FloatingInput
//           label="Passport Number"
//           name="passportNumber"
//           value={formData.passportNumber}
//           onChange={handleChange}
//           icon={FaPassport}
//         />
//         <NepaliDatePickerComponent
//           label="Passport Issue Date (BS)"
//           name="passportIssueDate"
//           value={formData.passportIssueDate}
//           onChange={handleSelectChange}
//         />
//         <NepaliDatePickerComponent
//           label="Passport Expiry Date (BS)"
//           name="passportExpiryDate"
//           value={formData.passportExpiryDate}
//           onChange={handleSelectChange}
//         />
//       </div>
      
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 max-w-md mx-auto">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Passport Photo</h5>
//         <div className="flex justify-center">
//           {renderPhotoUpload('passportPhoto', 'Passport Photo', photos.passportPhotoPreview, false, 'lg')}
//         </div>
//       </div>
      
//       <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//         <FloatingInput
//           label="Driving License Number"
//           name="drivingLicenseNumber"
//           value={formData.drivingLicenseNumber}
//           onChange={handleChange}
//           icon={FaCar}
//         />
//         <FloatingInput
//           label="DL Category"
//           name="drivingLicenseCategory"
//           value={formData.drivingLicenseCategory}
//           onChange={handleChange}
//           icon={FaCar}
//         />
//         <NepaliDatePickerComponent
//           label="DL Issue Date (BS)"
//           name="drivingLicenseIssueDate"
//           value={formData.drivingLicenseIssueDate}
//           onChange={handleSelectChange}
//         />
//         <NepaliDatePickerComponent
//           label="DL Expiry Date (BS)"
//           name="drivingLicenseExpiryDate"
//           value={formData.drivingLicenseExpiryDate}
//           onChange={handleSelectChange}
//         />
//       </div>
      
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 max-w-md mx-auto">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Driving License Photo</h5>
//         <div className="flex justify-center">
//           {renderPhotoUpload('drivingLicensePhoto', 'Driving License Photo', photos.drivingLicensePhotoPreview, false, 'lg')}
//         </div>
//       </div>
//     </div>
//   );

//   const renderDocuments = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Birth Certificate</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('birthCertificate', file)}
//             label="Upload Birth Certificate"
//             maxSize={5}
//           />
//         </div>
//         {documents.birthCertificate && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Marriage Certificate</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('marriageCertificate', file)}
//             label="Upload Marriage Certificate"
//             maxSize={5}
//           />
//         </div>
//         {documents.marriageCertificate && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Death Certificate</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('deathCertificate', file)}
//             label="Upload Death Certificate"
//             maxSize={5}
//           />
//         </div>
//         {documents.deathCertificate && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">PAN Card</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('panCard', file)}
//             label="Upload PAN Card"
//             maxSize={5}
//           />
//         </div>
//         {documents.panCard && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//       <div className="bg-white rounded-xl border-2 border-dashed border-green-200 p-4 hover:border-green-400 transition-all duration-300 md:col-span-2 max-w-md mx-auto">
//         <h5 className="text-xs font-medium text-green-700 mb-2 text-center">Voter ID</h5>
//         <div className="flex justify-center">
//           <ImageUpload
//             onImageSelect={(file) => handleDocumentUpload('voterId', file)}
//             label="Upload Voter ID"
//             maxSize={5}
//           />
//         </div>
//         {documents.voterId && (
//           <p className="text-xs text-green-600 mt-1 text-center">✓ File ready to upload</p>
//         )}
//       </div>
//     </div>
//   );

//   const renderAdditionalInfo = () => (
//     <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Biography"
//           name="biography"
//           value={formData.biography}
//           onChange={handleChange}
//           type="textarea"
//           rows={3}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Notes"
//           name="notes"
//           value={formData.notes}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Special Remarks"
//           name="specialRemarks"
//           value={formData.specialRemarks}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Medical Notes"
//           name="medicalNotes"
//           value={formData.medicalNotes}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <div className="md:col-span-2">
//         <FloatingInput
//           label="Disability Information"
//           name="disabilityInfo"
//           value={formData.disabilityInfo}
//           onChange={handleChange}
//           type="textarea"
//           rows={2}
//           icon={FaInfoCircle}
//         />
//       </div>
//       <SearchableSelect
//         label="Status"
//         name="status"
//         value={formData.status}
//         onChange={handleSelectChange}
//         options={[
//           { value: 'active', label: 'Active' },
//           { value: 'inactive', label: 'Inactive' },
//           { value: 'deceased', label: 'Deceased' },
//         ]}
//       />
//       <SearchableSelect
//         label="Verification Status"
//         name="verificationStatus"
//         value={formData.verificationStatus}
//         onChange={handleSelectChange}
//         options={[
//           { value: 'verified', label: 'Verified' },
//           { value: 'pending', label: 'Pending' },
//           { value: 'rejected', label: 'Rejected' },
//         ]}
//       />
//     </div>
//   );

//   const isSubmitting = loading || createMutation.isLoading || updateMutation.isLoading;

//   return (
//     <>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         {/* Header */}
//         <div className="bg-gradient-to-r from-green-50 via-emerald-50 to-green-50 rounded-xl p-4 shadow-sm border border-green-100">
//           <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
//             <div>
//               <h2 className="text-xl md:text-2xl font-bold text-green-800 flex items-center gap-2">
//                 {member ? (
//                   <>
//                     <span>✏️</span> Edit Member
//                   </>
//                 ) : (
//                   <>
//                     <span>➕</span> Add New Member
//                   </>
//                 )}
//               </h2>
//               <p className="text-xs text-green-600 mt-0.5">
//                 {member ? 'Update member information' : 'Enter member details'} • Step {currentTabIndex + 1} of {tabOrder.length}
//               </p>
//             </div>
//             <div className="flex items-center gap-2">
//               <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium">
//                 {member ? 'Editing' : 'New'}
//               </span>
//             </div>
//           </div>
//         </div>

//         {/* Progress Bar */}
//         <div className="w-full bg-gray-200 rounded-full h-1.5 overflow-hidden">
//           <div 
//             className="bg-gradient-to-r from-green-400 to-emerald-500 h-full transition-all duration-500"
//             style={{ width: `${((currentTabIndex + 1) / tabOrder.length) * 100}%` }}
//           />
//         </div>

//         {/* Main Content */}
//         <div className="grid grid-cols-1 gap-4">
//           {/* Tabs */}
//           <div className="bg-white rounded-xl shadow-sm border border-green-100 overflow-hidden">
//             <div className="bg-green-50/30 px-3 pt-2 overflow-x-auto">
//               <div className="flex min-w-max gap-1">
//                 {tabs.map((tab) => (
//                   <button
//                     key={tab.id}
//                     type="button"
//                     onClick={() => setActiveTab(tab.id)}
//                     className={`
//                       flex items-center gap-1.5 px-3 py-2 text-xs font-medium whitespace-nowrap
//                       transition-all duration-300 relative rounded-t-lg
//                       ${activeTab === tab.id
//                         ? 'text-green-700 bg-white shadow-sm'
//                         : 'text-gray-500 hover:text-green-600 hover:bg-green-50/50'
//                       }
//                     `}
//                   >
//                     <tab.icon className={`h-3.5 w-3.5 ${activeTab === tab.id ? 'text-green-600' : ''}`} />
//                     <span className="hidden sm:inline">{tab.label}</span>
//                     <span className="sm:hidden">{tab.label.slice(0, 4)}</span>
//                     {activeTab === tab.id && (
//                       <motion.div
//                         layoutId="activeTab"
//                         className="absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r from-green-400 to-emerald-500"
//                         transition={{ duration: 0.3 }}
//                       />
//                     )}
//                   </button>
//                 ))}
//               </div>
//             </div>

//             {/* Tab Content */}
//             <div className="p-3 md:p-4">
//               <AnimatePresence mode="wait">
//                 <motion.div
//                   key={activeTab}
//                   initial={{ opacity: 0, x: 10 }}
//                   animate={{ opacity: 1, x: 0 }}
//                   exit={{ opacity: 0, x: -10 }}
//                   transition={{ duration: 0.2 }}
//                 >
//                   {renderTabContent()}
//                 </motion.div>
//               </AnimatePresence>
//             </div>
//           </div>

//           {/* Navigation Buttons */}
//           <div className="bg-white rounded-xl shadow-sm border border-green-100 p-3">
//             <div className="flex flex-col sm:flex-row justify-between gap-2">
//               <div className="flex gap-2 order-2 sm:order-1">
//                 <Button
//                   type="button"
//                   variant="outline"
//                   onClick={onCancel}
//                   size="sm"
//                   className="px-4"
//                 >
//                   <FaTimes className="mr-1.5 text-xs" />
//                   Cancel
//                 </Button>
//               </div>
//               <div className="flex gap-2 order-1 sm:order-2">
//                 {!isFirstTab && (
//                   <Button
//                     type="button"
//                     variant="secondary"
//                     onClick={goToPrevTab}
//                     size="sm"
//                     className="px-4"
//                   >
//                     <FaChevronLeft className="mr-1.5 text-xs" />
//                     Previous
//                   </Button>
//                 )}
//                 {isLastTab ? (
//                   <Button
//                     type="submit"
//                     disabled={isSubmitting}
//                     variant="primary"
//                     size="sm"
//                     className="px-5"
//                   >
//                     {isSubmitting ? (
//                       <span className="flex items-center">
//                         <svg className="animate-spin -ml-1 mr-1.5 h-3.5 w-3.5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
//                           <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
//                           <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
//                         </svg>
//                         Saving...
//                       </span>
//                     ) : (
//                       <>
//                         <FaSave className="mr-1.5 text-xs" />
//                         {member ? 'Update Member' : 'Save Member'}
//                       </>
//                     )}
//                   </Button>
//                 ) : (
//                   <Button
//                     type="button"
//                     variant="primary"
//                     onClick={goToNextTab}
//                     size="sm"
//                     className="px-5"
//                   >
//                     Next
//                     <FaChevronRight className="ml-1.5 text-xs" />
//                   </Button>
//                 )}
//               </div>
//             </div>
//           </div>
//         </div>
//       </form>
//     </>
//   );
// };

// export default DataEntry;