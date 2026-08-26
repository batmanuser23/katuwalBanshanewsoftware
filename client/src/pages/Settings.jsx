// // src/pages/Settings.jsx - COMPLETE WORKING VERSION
// import { useState, useEffect } from 'react';
// import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
// import Button from '../components/Button';
// import toast from 'react-hot-toast';
// import { useTheme } from '../context/ThemeContext';
// import { useLanguage } from '../context/LanguageContext';
// import { translations } from '../translations';
// import * as Icons from 'lucide-react';

// const Settings = () => {
//   const [activeSection, setActiveSection] = useState('appearance');
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
//   const [isLoading, setIsLoading] = useState(false);
//   const queryClient = useQueryClient();
  
//   // Theme context
//   const { theme, setTheme, isDark } = useTheme();
//   // Language context
//   const { language, setLanguage, t } = useLanguage();

//   // Local state for settings
//   const [settings, setSettings] = useState({
//     theme: theme || 'system',
//     language: language || 'en',
//     notifications: {
//       email: true,
//       push: true,
//       donation: true,
//       member: true,
//       family: true,
//     },
//     appearance: {
//       compactMode: false,
//       fontSize: 'medium',
//     },
//     system: {
//       autoBackup: true,
//       backupFrequency: 'daily',
//     },
//   });

//   // Update settings when context changes
//   useEffect(() => {
//     setSettings(prev => ({
//       ...prev,
//       theme: theme || 'system',
//       language: language || 'en',
//     }));
//   }, [theme, language]);

//   // Navigation items with translations
//   const navItems = [
//     { id: 'appearance', label: t('appearance') || 'Appearance', icon: Icons.Palette },
//     { id: 'language', label: t('language') || 'Language', icon: Icons.Languages },
//     { id: 'notifications', label: t('notifications') || 'Notifications', icon: Icons.Bell },
//     { id: 'system', label: t('system') || 'System', icon: Icons.Settings },
//     { id: 'about', label: t('about') || 'About', icon: Icons.Info },
//   ];

//   // Handle theme change
//   const handleThemeChange = (newTheme) => {
//     setTheme(newTheme);
//     setSettings(prev => ({ ...prev, theme: newTheme }));
//     setHasUnsavedChanges(true);
//     toast.success(t('theme_changed') || 'Theme changed successfully');
//   };

//   // Handle language change
//   const handleLanguageChange = (newLanguage) => {
//     setLanguage(newLanguage);
//     setSettings(prev => ({ ...prev, language: newLanguage }));
//     setHasUnsavedChanges(true);
//     toast.success(t('language_changed') || 'Language changed successfully');
//   };

//   // Handle notification toggle
//   const handleNotificationToggle = (key) => {
//     setSettings(prev => ({
//       ...prev,
//       notifications: {
//         ...prev.notifications,
//         [key]: !prev.notifications[key],
//       }
//     }));
//     setHasUnsavedChanges(true);
//   };

//   // Handle save
//   const handleSave = () => {
//     setIsLoading(true);
//     try {
//       // Save theme to localStorage via context
//       localStorage.setItem('theme', settings.theme);
//       localStorage.setItem('language', settings.language);
      
//       // Save notifications to localStorage
//       localStorage.setItem('notifications', JSON.stringify(settings.notifications));
      
//       toast.success(t('settings_saved') || 'Settings saved successfully');
//       setHasUnsavedChanges(false);
//     } catch (error) {
//       toast.error(t('error_saving_settings') || 'Failed to save settings');
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   // Handle reset
//   const handleReset = () => {
//     if (confirm(t('confirm_reset') || 'Are you sure you want to reset all settings?')) {
//       setSettings({
//         theme: 'system',
//         language: 'en',
//         notifications: {
//           email: true,
//           push: true,
//           donation: true,
//           member: true,
//           family: true,
//         },
//         appearance: {
//           compactMode: false,
//           fontSize: 'medium',
//         },
//         system: {
//           autoBackup: true,
//           backupFrequency: 'daily',
//         },
//       });
//       setTheme('system');
//       setLanguage('en');
//       setHasUnsavedChanges(true);
//       toast.success(t('settings_reset') || 'Settings reset to default');
//     }
//   };

//   // Render active section
//   const renderSection = () => {
//     switch (activeSection) {
//       case 'appearance':
//         return (
//           <div className="space-y-6">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('appearance_settings') || 'Appearance Settings'}</h3>
            
//             {/* Theme Selection */}
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 {t('theme') || 'Theme'}
//               </label>
//               <div className="grid grid-cols-3 gap-3">
//                 <button
//                   onClick={() => handleThemeChange('light')}
//                   className={`p-4 rounded-xl border-2 transition-all ${
//                     settings.theme === 'light'
//                       ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
//                       : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
//                   }`}
//                 >
//                   <div className="flex items-center justify-center gap-2">
//                     <div className="w-8 h-8 rounded-full bg-white border border-gray-300 shadow-sm"></div>
//                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                       {t('light') || 'Light'}
//                     </span>
//                   </div>
//                 </button>
//                 <button
//                   onClick={() => handleThemeChange('dark')}
//                   className={`p-4 rounded-xl border-2 transition-all ${
//                     settings.theme === 'dark'
//                       ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
//                       : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
//                   }`}
//                 >
//                   <div className="flex items-center justify-center gap-2">
//                     <div className="w-8 h-8 rounded-full bg-gray-800 border border-gray-700 shadow-sm"></div>
//                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                       {t('dark') || 'Dark'}
//                     </span>
//                   </div>
//                 </button>
//                 <button
//                   onClick={() => handleThemeChange('system')}
//                   className={`p-4 rounded-xl border-2 transition-all ${
//                     settings.theme === 'system'
//                       ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
//                       : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
//                   }`}
//                 >
//                   <div className="flex items-center justify-center gap-2">
//                     <div className="w-8 h-8 rounded-full bg-gradient-to-r from-white to-gray-800 border border-gray-300 shadow-sm"></div>
//                     <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
//                       {t('system') || 'System'}
//                     </span>
//                   </div>
//                 </button>
//               </div>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 {settings.theme === 'system' 
//                   ? (t('theme_system_desc') || 'Follows your system preference')
//                   : settings.theme === 'dark'
//                   ? (t('theme_dark_desc') || 'Dark mode enabled')
//                   : (t('theme_light_desc') || 'Light mode enabled')}
//               </p>
//             </div>

//             {/* Font Size */}
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 {t('font_size') || 'Font Size'}
//               </label>
//               <div className="grid grid-cols-3 gap-3">
//                 <button
//                   onClick={() => {
//                     setSettings(prev => ({
//                       ...prev,
//                       appearance: { ...prev.appearance, fontSize: 'small' }
//                     }));
//                     setHasUnsavedChanges(true);
//                   }}
//                   className={`p-3 rounded-xl border-2 transition-all ${
//                     settings.appearance?.fontSize === 'small'
//                       ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
//                       : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
//                   }`}
//                 >
//                   <span className="text-xs font-medium text-gray-700 dark:text-gray-300">A</span>
//                   <span className="text-sm font-medium text-gray-500 dark:text-gray-400"> {t('small') || 'Small'}</span>
//                 </button>
//                 <button
//                   onClick={() => {
//                     setSettings(prev => ({
//                       ...prev,
//                       appearance: { ...prev.appearance, fontSize: 'medium' }
//                     }));
//                     setHasUnsavedChanges(true);
//                   }}
//                   className={`p-3 rounded-xl border-2 transition-all ${
//                     settings.appearance?.fontSize === 'medium'
//                       ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
//                       : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
//                   }`}
//                 >
//                   <span className="text-base font-medium text-gray-700 dark:text-gray-300">A</span>
//                   <span className="text-sm font-medium text-gray-500 dark:text-gray-400"> {t('medium') || 'Medium'}</span>
//                 </button>
//                 <button
//                   onClick={() => {
//                     setSettings(prev => ({
//                       ...prev,
//                       appearance: { ...prev.appearance, fontSize: 'large' }
//                     }));
//                     setHasUnsavedChanges(true);
//                   }}
//                   className={`p-3 rounded-xl border-2 transition-all ${
//                     settings.appearance?.fontSize === 'large'
//                       ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
//                       : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
//                   }`}
//                 >
//                   <span className="text-xl font-medium text-gray-700 dark:text-gray-300">A</span>
//                   <span className="text-sm font-medium text-gray-500 dark:text-gray-400"> {t('large') || 'Large'}</span>
//                 </button>
//               </div>
//             </div>

//             {/* Compact Mode */}
//             <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
//               <div>
//                 <h4 className="font-medium text-gray-900 dark:text-white">{t('compact_mode') || 'Compact Mode'}</h4>
//                 <p className="text-sm text-gray-500 dark:text-gray-400">
//                   {t('compact_mode_desc') || 'Reduce spacing for more content'}
//                 </p>
//               </div>
//               <button
//                 onClick={() => {
//                   setSettings(prev => ({
//                     ...prev,
//                     appearance: { ...prev.appearance, compactMode: !prev.appearance?.compactMode }
//                   }));
//                   setHasUnsavedChanges(true);
//                 }}
//                 className={`w-12 h-6 rounded-full transition-all ${
//                   settings.appearance?.compactMode
//                     ? 'bg-green-500'
//                     : 'bg-gray-300 dark:bg-gray-600'
//                 }`}
//               >
//                 <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${
//                   settings.appearance?.compactMode
//                     ? 'translate-x-6'
//                     : 'translate-x-0'
//                 }`} />
//               </button>
//             </div>
//           </div>
//         );

//       case 'language':
//         return (
//           <div className="space-y-6">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('language_settings') || 'Language Settings'}</h3>
            
//             <div className="space-y-4">
//               <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                 {t('select_language') || 'Select Language'}
//               </label>
//               <div className="grid grid-cols-2 gap-3">
//                 <button
//                   onClick={() => handleLanguageChange('en')}
//                   className={`p-4 rounded-xl border-2 transition-all ${
//                     settings.language === 'en'
//                       ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
//                       : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <span className="text-2xl">🇬🇧</span>
//                     <div className="text-left">
//                       <div className="font-medium text-gray-900 dark:text-white">English</div>
//                       <div className="text-sm text-gray-500 dark:text-gray-400">English (US)</div>
//                     </div>
//                   </div>
//                 </button>
//                 <button
//                   onClick={() => handleLanguageChange('ne')}
//                   className={`p-4 rounded-xl border-2 transition-all ${
//                     settings.language === 'ne'
//                       ? 'border-green-500 bg-green-50 dark:bg-green-900/20'
//                       : 'border-gray-200 dark:border-gray-700 hover:border-green-300'
//                   }`}
//                 >
//                   <div className="flex items-center gap-3">
//                     <span className="text-2xl">🇳🇵</span>
//                     <div className="text-left">
//                       <div className="font-medium text-gray-900 dark:text-white">नेपाली</div>
//                       <div className="text-sm text-gray-500 dark:text-gray-400">Nepali</div>
//                     </div>
//                   </div>
//                 </button>
//               </div>
//               <p className="text-sm text-gray-500 dark:text-gray-400">
//                 {settings.language === 'ne' 
//                   ? 'अन्तरफेस नेपालीमा देखाइनेछ' 
//                   : 'Interface will be displayed in English'}
//               </p>
//             </div>
//           </div>
//         );

//       case 'notifications':
//         return (
//           <div className="space-y-6">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('notification_settings') || 'Notification Settings'}</h3>
            
//             <div className="space-y-4">
//               <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
//                 <div>
//                   <h4 className="font-medium text-gray-900 dark:text-white">{t('email_notifications') || 'Email Notifications'}</h4>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">{t('email_notifications_desc') || 'Receive notifications via email'}</p>
//                 </div>
//                 <button
//                   onClick={() => handleNotificationToggle('email')}
//                   className={`w-12 h-6 rounded-full transition-all ${
//                     settings.notifications?.email
//                       ? 'bg-green-500'
//                       : 'bg-gray-300 dark:bg-gray-600'
//                   }`}
//                 >
//                   <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${
//                     settings.notifications?.email
//                       ? 'translate-x-6'
//                       : 'translate-x-0'
//                   }`} />
//                 </button>
//               </div>

//               <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
//                 <div>
//                   <h4 className="font-medium text-gray-900 dark:text-white">{t('push_notifications') || 'Push Notifications'}</h4>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">{t('push_notifications_desc') || 'Receive push notifications'}</p>
//                 </div>
//                 <button
//                   onClick={() => handleNotificationToggle('push')}
//                   className={`w-12 h-6 rounded-full transition-all ${
//                     settings.notifications?.push
//                       ? 'bg-green-500'
//                       : 'bg-gray-300 dark:bg-gray-600'
//                   }`}
//                 >
//                   <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${
//                     settings.notifications?.push
//                       ? 'translate-x-6'
//                       : 'translate-x-0'
//                   }`} />
//                 </button>
//               </div>

//               <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
//                 <div>
//                   <h4 className="font-medium text-gray-900 dark:text-white">{t('donation_notifications') || 'Donation Notifications'}</h4>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">{t('donation_notifications_desc') || 'Notify on new donations'}</p>
//                 </div>
//                 <button
//                   onClick={() => handleNotificationToggle('donation')}
//                   className={`w-12 h-6 rounded-full transition-all ${
//                     settings.notifications?.donation
//                       ? 'bg-green-500'
//                       : 'bg-gray-300 dark:bg-gray-600'
//                   }`}
//                 >
//                   <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${
//                     settings.notifications?.donation
//                       ? 'translate-x-6'
//                       : 'translate-x-0'
//                   }`} />
//                 </button>
//               </div>
//             </div>
//           </div>
//         );

//       case 'system':
//         return (
//           <div className="space-y-6">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('system_settings') || 'System Settings'}</h3>
            
//             <div className="space-y-4">
//               <div className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700/30 rounded-xl">
//                 <div>
//                   <h4 className="font-medium text-gray-900 dark:text-white">{t('auto_backup') || 'Auto Backup'}</h4>
//                   <p className="text-sm text-gray-500 dark:text-gray-400">{t('auto_backup_desc') || 'Automatically backup data'}</p>
//                 </div>
//                 <button
//                   onClick={() => {
//                     setSettings(prev => ({
//                       ...prev,
//                       system: { ...prev.system, autoBackup: !prev.system?.autoBackup }
//                     }));
//                     setHasUnsavedChanges(true);
//                   }}
//                   className={`w-12 h-6 rounded-full transition-all ${
//                     settings.system?.autoBackup
//                       ? 'bg-green-500'
//                       : 'bg-gray-300 dark:bg-gray-600'
//                   }`}
//                 >
//                   <div className={`w-5 h-5 bg-white rounded-full shadow transform transition-all ${
//                     settings.system?.autoBackup
//                       ? 'translate-x-6'
//                       : 'translate-x-0'
//                   }`} />
//                 </button>
//               </div>

//               <div className="space-y-2">
//                 <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
//                   {t('backup_frequency') || 'Backup Frequency'}
//                 </label>
//                 <select
//                   value={settings.system?.backupFrequency || 'daily'}
//                   onChange={(e) => {
//                     setSettings(prev => ({
//                       ...prev,
//                       system: { ...prev.system, backupFrequency: e.target.value }
//                     }));
//                     setHasUnsavedChanges(true);
//                   }}
//                   className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-xl bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
//                 >
//                   <option value="daily">{t('daily') || 'Daily'}</option>
//                   <option value="weekly">{t('weekly') || 'Weekly'}</option>
//                   <option value="monthly">{t('monthly') || 'Monthly'}</option>
//                 </select>
//               </div>
//             </div>
//           </div>
//         );

//       case 'about':
//         return (
//           <div className="space-y-6">
//             <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{t('about') || 'About'}</h3>
            
//             <div className="bg-gray-50 dark:bg-gray-700/30 rounded-xl p-6 text-center">
//               <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-4">
//                 KB
//               </div>
//               <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Katuwal Bansha</h2>
//               <p className="text-gray-600 dark:text-gray-400">{t('app_description') || 'Family Tree Management System'}</p>
//               <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">Version 1.0.0</p>
//               <p className="text-sm text-gray-500 dark:text-gray-400">© 2026 NDS Software</p>
//             </div>
//           </div>
//         );

//       default:
//         return null;
//     }
//   };

//   return (
//     <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] bg-gray-50 dark:bg-gray-900">
//       {/* Left Navigation - Sidebar style */}
//       <nav className="w-full md:w-64 bg-white dark:bg-gray-800 border-b md:border-b-0 md:border-r border-gray-200 dark:border-gray-700 overflow-y-auto flex-shrink-0">
//         <div className="p-4 border-b border-gray-200 dark:border-gray-700">
//           <h2 className="text-lg font-semibold text-gray-900 dark:text-white">⚙️ {t('settings') || 'Settings'}</h2>
//         </div>
//         <div className="p-2">
//           {navItems.map((item) => {
//             const Icon = item.icon;
//             return (
//               <button
//                 key={item.id}
//                 onClick={() => {
//                   if (hasUnsavedChanges) {
//                     if (!confirm(t('unsaved_changes') || 'You have unsaved changes. Are you sure you want to leave?')) {
//                       return;
//                     }
//                   }
//                   setActiveSection(item.id);
//                   setHasUnsavedChanges(false);
//                 }}
//                 className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
//                   activeSection === item.id
//                     ? 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400'
//                     : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'
//                 }`}
//               >
//                 <Icon className={`w-5 h-5 mr-3 ${
//                   activeSection === item.id ? 'text-green-600 dark:text-green-400' : 'text-gray-400 dark:text-gray-500'
//                 }`} />
//                 <span className="text-sm font-medium">{item.label}</span>
//               </button>
//             );
//           })}
//         </div>
//       </nav>

//       {/* Main Content */}
//       <div className="flex-1 overflow-y-auto">
//         <div className="max-w-4xl mx-auto p-4 md:p-6 pb-32">
//           {/* Section Header */}
//           <div className="mb-6">
//             <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
//               {navItems.find(item => item.id === activeSection)?.label}
//             </h1>
//             <p className="text-gray-600 dark:text-gray-400 mt-1">
//               {t('manage_settings') || 'Manage'} {navItems.find(item => item.id === activeSection)?.label?.toLowerCase()} {t('settings') || 'settings'}
//             </p>
//           </div>

//           {/* Section Content */}
//           <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 md:p-6">
//             {renderSection()}
//           </div>
//         </div>

//         {/* Fixed Bottom Actions */}
//         <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 p-4 shadow-lg z-10">
//           <div className="max-w-4xl mx-auto flex flex-wrap justify-end gap-3">
//             <Button
//               variant="outline"
//               onClick={handleReset}
//               disabled={isLoading}
//             >
//               {t('reset') || 'Reset'}
//             </Button>
//             <Button
//               onClick={handleSave}
//               disabled={isLoading || !hasUnsavedChanges}
//             >
//               {isLoading ? (t('saving') || 'Saving...') : (t('save_changes') || 'Save Changes')}
//             </Button>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Settings;

// src/pages/Settings.jsx - WITHOUT THEME (Only Language)
import { useState } from 'react';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { useLanguage } from '../context/LanguageContext';
import * as Icons from 'lucide-react';

const Settings = () => {
  const [activeSection, setActiveSection] = useState('language');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  const { language, setLanguage, t } = useLanguage();

  // Navigation items
  const navItems = [
    { id: 'language', label: t('language') || 'Language', icon: Icons.Languages },
    { id: 'notifications', label: t('notifications') || 'Notifications', icon: Icons.Bell },
    { id: 'about', label: t('about') || 'About', icon: Icons.Info },
  ];

  // Handle language change
  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setHasUnsavedChanges(true);
    toast.success(t('language_changed') || 'Language changed successfully');
  };

  // Handle save
  const handleSave = () => {
    setIsLoading(true);
    try {
      localStorage.setItem('language', language);
      toast.success(t('settings_saved') || 'Settings saved successfully');
      setHasUnsavedChanges(false);
    } catch (error) {
      toast.error(t('error_saving_settings') || 'Failed to save settings');
    } finally {
      setIsLoading(false);
    }
  };

  // Render active section
  const renderSection = () => {
    switch (activeSection) {
      case 'language':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('language_settings') || 'Language Settings'}
            </h3>
            
            <div className="space-y-4">
              <label className="block text-sm font-medium text-gray-700">
                {t('select_language') || 'Select Language'}
              </label>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => handleLanguageChange('en')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    language === 'en'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇬🇧</span>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">English</div>
                      <div className="text-sm text-gray-500">English (US)</div>
                    </div>
                  </div>
                </button>
                <button
                  onClick={() => handleLanguageChange('ne')}
                  className={`p-4 rounded-xl border-2 transition-all ${
                    language === 'ne'
                      ? 'border-green-500 bg-green-50'
                      : 'border-gray-200 hover:border-green-300'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <span className="text-2xl">🇳🇵</span>
                    <div className="text-left">
                      <div className="font-medium text-gray-900">नेपाली</div>
                      <div className="text-sm text-gray-500">Nepali</div>
                    </div>
                  </div>
                </button>
              </div>
              <p className="text-sm text-gray-500">
                {language === 'ne' 
                  ? 'अन्तरफेस नेपालीमा देखाइनेछ' 
                  : 'Interface will be displayed in English'}
              </p>
            </div>
          </div>
        );

      case 'notifications':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('notification_settings') || 'Notification Settings'}
            </h3>
            <div className="text-gray-500">
              Notification settings will be available soon.
            </div>
          </div>
        );

      case 'about':
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-900">
              {t('about') || 'About'}
            </h3>
            <div className="bg-gray-50 rounded-xl p-6 text-center">
              <div className="w-20 h-20 mx-auto bg-gradient-to-r from-green-500 to-emerald-600 rounded-2xl flex items-center justify-center text-white text-3xl font-bold mb-4">
                KB
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Katuwal Bansha</h2>
              <p className="text-gray-600">{t('app_description') || 'Family Tree Management System'}</p>
              <p className="text-sm text-gray-500 mt-2">Version 1.0.0</p>
              <p className="text-sm text-gray-500">© 2026 NDS Software</p>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-[calc(100vh-80px)] bg-gray-50">
      {/* Left Navigation */}
      <nav className="w-full md:w-64 bg-white border-b md:border-b-0 md:border-r border-gray-200 overflow-y-auto flex-shrink-0">
        <div className="p-4 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">⚙️ {t('settings') || 'Settings'}</h2>
        </div>
        <div className="p-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (hasUnsavedChanges) {
                    if (!confirm(t('unsaved_changes') || 'You have unsaved changes. Are you sure?')) {
                      return;
                    }
                  }
                  setActiveSection(item.id);
                  setHasUnsavedChanges(false);
                }}
                className={`w-full flex items-center px-4 py-3 rounded-lg transition-colors ${
                  activeSection === item.id
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                <Icon className={`w-5 h-5 mr-3 ${
                  activeSection === item.id ? 'text-green-600' : 'text-gray-400'
                }`} />
                <span className="text-sm font-medium">{item.label}</span>
              </button>
            );
          })}
        </div>
      </nav>

      {/* Main Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-4xl mx-auto p-4 md:p-6 pb-32">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900">
              {navItems.find(item => item.id === activeSection)?.label}
            </h1>
            <p className="text-gray-600 mt-1">
              {t('manage_settings') || 'Manage'} {navItems.find(item => item.id === activeSection)?.label?.toLowerCase()} {t('settings') || 'settings'}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
            {renderSection()}
          </div>
        </div>

        {/* Fixed Bottom Actions */}
        <div className="fixed bottom-0 left-0 md:left-64 right-0 bg-white border-t border-gray-200 p-4 shadow-lg z-10">
          <div className="max-w-4xl mx-auto flex flex-wrap justify-end gap-3">
            <Button
              onClick={handleSave}
              disabled={isLoading || !hasUnsavedChanges}
            >
              {isLoading ? (t('saving') || 'Saving...') : (t('save_changes') || 'Save Changes')}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Settings;