import React from 'react';
import { useTheme } from '../../context/ThemeContext';
import { useLanguage } from '../../context/LanguageContext';
import { MoonIcon, SunIcon, ComputerDesktopIcon } from '@heroicons/react/24/outline';

const AppearanceSettings = ({ onDataChange }) => {
  const { theme, setTheme, THEMES, isDark } = useTheme();
  const { t } = useLanguage();

  const themeOptions = [
    { 
      id: THEMES.LIGHT, 
      label: t('settings.theme.light'), 
      icon: SunIcon,
      description: 'Light mode',
      preview: 'bg-white border-gray-200 text-gray-900'
    },
    { 
      id: THEMES.DARK, 
      label: t('settings.theme.dark'), 
      icon: MoonIcon,
      description: 'Dark mode',
      preview: 'bg-gray-900 border-gray-700 text-white'
    },
    { 
      id: THEMES.SYSTEM, 
      label: t('settings.theme.system'), 
      icon: ComputerDesktopIcon,
      description: 'Use system preference',
      preview: 'bg-gray-100 border-gray-300 text-gray-700'
    },
  ];

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    if (onDataChange) onDataChange();
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-900">
          {t('settings.theme.title')}
        </h3>
        <p className="text-sm text-gray-500">
          {t('settings.theme.description')}
        </p>
      </div>

      {/* Theme Options */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {themeOptions.map((option) => {
          const Icon = option.icon;
          const isActive = theme === option.id;
          
          return (
            <button
              key={option.id}
              onClick={() => handleThemeChange(option.id)}
              className={`relative p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                isActive
                  ? 'border-green-500 bg-green-50 ring-2 ring-green-500 ring-offset-2'
                  : 'border-gray-200 hover:border-gray-300 hover:shadow-md'
              } ${isDark ? 'bg-gray-800 border-gray-700' : ''}`}
            >
              <div className="flex items-center gap-3 mb-3">
                <div className={`p-2 rounded-lg ${
                  isActive ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-600'
                }`}>
                  <Icon className="w-5 h-5" />
                </div>
                <span className={`font-medium ${isActive ? 'text-green-700' : 'text-gray-700'}`}>
                  {option.label}
                </span>
              </div>

              {/* Theme Preview */}
              <div className={`rounded-lg p-3 border ${option.preview} transition-colors duration-200`}>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full bg-green-500"></div>
                  <div className="flex-1 h-2 rounded bg-current opacity-30"></div>
                  <div className="w-3 h-3 rounded-full bg-current opacity-30"></div>
                </div>
                <div className="mt-2 space-y-1">
                  <div className="h-2 rounded bg-current opacity-20 w-3/4"></div>
                  <div className="h-2 rounded bg-current opacity-10 w-1/2"></div>
                </div>
              </div>

              {isActive && (
                <div className="absolute top-2 right-2">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                    Active
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Current Theme Info */}
      <div className={`mt-4 p-4 rounded-lg ${isDark ? 'bg-gray-800' : 'bg-gray-50'}`}>
        <p className="text-sm text-gray-600">
          <span className="font-medium">Current theme:</span>{' '}
          {theme === THEMES.LIGHT && '☀️ Light'}
          {theme === THEMES.DARK && '🌙 Dark'}
          {theme === THEMES.SYSTEM && '💻 System'}
          {theme === THEMES.SYSTEM && ` (${isDark ? '🌙 Dark' : '☀️ Light'})`}
        </p>
      </div>
    </div>
  );
};

export default AppearanceSettings;