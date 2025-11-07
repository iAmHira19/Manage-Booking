'use client';

import { useState, useRef, useEffect } from 'react';
import { FiGlobe, FiX, FiSearch } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const regions = [
  {
    id: 'middle-east',
    name: 'Middle East',
    countries: [
      {
        id: 'pk',
        name: 'Pakistan',
        flag: '🇵🇰',
        languages: [
          { code: 'ur', name: 'اردو', nativeName: 'اردو', isAvailable: true },
          { code: 'en', name: 'English', nativeName: 'English', isAvailable: true },
        ]
      },
      {
        id: 'sa',
        name: 'Saudi Arabia',
        flag: '🇸🇦',
        languages: [
          { code: 'ar', name: 'العربية', nativeName: 'العربية', isAvailable: true },
          { code: 'en', name: 'English', nativeName: 'English', isAvailable: true },
        ]
      },
      {
        id: 'ae',
        name: 'United Arab Emirates',
        flag: '🇦🇪',
        languages: [
          { code: 'ar', name: 'العربية', nativeName: 'العربية', isAvailable: true },
          { code: 'en', name: 'English', nativeName: 'English', isAvailable: true },
        ]
      },
      {
        id: 'qa',
        name: 'Qatar',
        flag: '🇶🇦',
        languages: [
          { code: 'ar', name: 'العربية', nativeName: 'العربية', isAvailable: true },
          { code: 'en', name: 'English', nativeName: 'English', isAvailable: true },
        ]
      },
      {
        id: 'kw',
        name: 'Kuwait',
        flag: '🇰🇼',
        languages: [
          { code: 'ar', name: 'العربية', nativeName: 'العربية', isAvailable: true },
          { code: 'en', name: 'English', nativeName: 'English', isAvailable: true },
        ]
      },
      {
        id: 'bh',
        name: 'Bahrain',
        flag: '🇧🇭',
        languages: [
          { code: 'ar', name: 'العربية', nativeName: 'العربية', isAvailable: true },
          { code: 'en', name: 'English', nativeName: 'English', isAvailable: true },
        ]
      },
      {
        id: 'om',
        name: 'Oman',
        flag: '🇴🇲',
        languages: [
          { code: 'ar', name: 'العربية', nativeName: 'العربية', isAvailable: true },
          { code: 'en', name: 'English', nativeName: 'English', isAvailable: true },
        ]
      },
      {
        id: 'iq',
        name: 'Iraq',
        flag: '🇮🇶',
        languages: [
          { code: 'ar', name: 'العربية', nativeName: 'العربية', isAvailable: true },
          { code: 'ku', name: 'Kurdî', nativeName: 'کوردی', isAvailable: true },
        ]
      },
      {
        id: 'jo',
        name: 'Jordan',
        flag: '🇯🇴',
        languages: [
          { code: 'ar', name: 'العربية', nativeName: 'العربية', isAvailable: true },
        ]
      },
      {
        id: 'lb',
        name: 'Lebanon',
        flag: '🇱🇧',
        languages: [
          { code: 'ar', name: 'العربية', nativeName: 'العربية', isAvailable: true },
          { code: 'fr', name: 'Français', nativeName: 'Français', isAvailable: true },
        ]
      },
      {
        id: 'ir',
        name: 'Iran',
        flag: '🇮🇷',
        languages: [
          { code: 'fa', name: 'فارسی', nativeName: 'فارسی', isAvailable: true },
        ]
      },
      {
        id: 'il',
        name: 'Israel',
        flag: '🇮🇱',
        languages: [
          { code: 'he', name: 'עברית', nativeName: 'עברית', isAvailable: true },
          { code: 'ar', name: 'العربية', nativeName: 'العربية', isAvailable: true },
        ]
      },
    ]
  },
  {
    id: 'europe',
    name: 'Europe',
    countries: [
      {
        id: 'uk',
        name: 'United Kingdom',
        flag: '🇬🇧',
        languages: [
          { code: 'en', name: 'English', nativeName: 'English', isAvailable: true },
        ]
      },
      {
        id: 'fr',
        name: 'France',
        flag: '🇫🇷',
        languages: [
          { code: 'fr', name: 'Français', nativeName: 'Français', isAvailable: true },
        ]
      },
      {
        id: 'de',
        name: 'Germany',
        flag: '🇩🇪',
        languages: [
          { code: 'de', name: 'Deutsch', nativeName: 'Deutsch', isAvailable: true },
        ]
      },
      {
        id: 'it',
        name: 'Italy',
        flag: '🇮🇹',
        languages: [
          { code: 'it', name: 'Italiano', nativeName: 'Italiano', isAvailable: true },
        ]
      },
      {
        id: 'es',
        name: 'Spain',
        flag: '🇪🇸',
        languages: [
          { code: 'es', name: 'Español', nativeName: 'Español', isAvailable: true },
        ]
      },
    ]
  },
  {
    id: 'asia',
    name: 'Asia',
    countries: [
      {
        id: 'in',
        name: 'India',
        flag: '🇮🇳',
        languages: [
          { code: 'hi', name: 'हिन्दी', nativeName: 'हिन्दी', isAvailable: true },
          { code: 'en', name: 'English', nativeName: 'English', isAvailable: true },
        ]
      },
      {
        id: 'cn',
        name: 'China',
        flag: '🇨🇳',
        languages: [
          { code: 'zh', name: '中文', nativeName: '中文', isAvailable: true },
        ]
      },
      {
        id: 'jp',
        name: 'Japan',
        flag: '🇯🇵',
        languages: [
          { code: 'ja', name: '日本語', nativeName: '日本語', isAvailable: true },
        ]
      },
      {
        id: 'kr',
        name: 'South Korea',
        flag: '🇰🇷',
        languages: [
          { code: 'ko', name: '한국어', nativeName: '한국어', isAvailable: true },
        ]
      },
      {
        id: 'th',
        name: 'Thailand',
        flag: '🇹🇭',
        languages: [
          { code: 'th', name: 'ไทย', nativeName: 'ไทย', isAvailable: true },
        ]
      },
    ]
  },
  {
    id: 'africa',
    name: 'Africa',
    countries: [
      {
        id: 'eg',
        name: 'Egypt',
        flag: '🇪🇬',
        languages: [
          { code: 'ar', name: 'العربية', nativeName: 'العربية', isAvailable: true },
        ]
      },
      {
        id: 'za',
        name: 'South Africa',
        flag: '🇿🇦',
        languages: [
          { code: 'en', name: 'English', nativeName: 'English', isAvailable: true },
          { code: 'zu', name: 'Zulu', nativeName: 'isiZulu', isAvailable: true },
          { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa', isAvailable: true },
        ]
      },
      {
        id: 'ng',
        name: 'Nigeria',
        flag: '🇳🇬',
        languages: [
          { code: 'en', name: 'English', nativeName: 'English', isAvailable: true },
          { code: 'ha', name: 'Hausa', nativeName: 'Hausa', isAvailable: true },
          { code: 'yo', name: 'Yoruba', nativeName: 'Yorùbá', isAvailable: true },
          { code: 'ig', name: 'Igbo', nativeName: 'Igbo', isAvailable: true },
        ]
      },
    ]
  },
  {
    id: 'americas',
    name: 'Americas',
    countries: [
      {
        id: 'us',
        name: 'United States',
        flag: '🇺🇸',
        languages: [
          { code: 'en', name: 'English', nativeName: 'English', isAvailable: true },
          { code: 'es', name: 'Español', nativeName: 'Español', isAvailable: true },
        ]
      },
      {
        id: 'ca',
        name: 'Canada',
        flag: '🇨🇦',
        languages: [
          { code: 'en', name: 'English', nativeName: 'English', isAvailable: true },
          { code: 'fr', name: 'Français', nativeName: 'Français', isAvailable: true },
        ]
      },
      {
        id: 'br',
        name: 'Brazil',
        flag: '🇧🇷',
        languages: [
          { code: 'pt', name: 'Português', nativeName: 'Português', isAvailable: true },
        ]
      },
    ]
  },
  {
    id: 'oceania',
    name: 'Oceania',
    countries: [
      {
        id: 'au',
        name: 'Australia',
        flag: '🇦🇺',
        languages: [
          { code: 'en', name: 'English', nativeName: 'English', isAvailable: true },
        ]
      },
      {
        id: 'nz',
        name: 'New Zealand',
        flag: '🇳🇿',
        languages: [
          { code: 'en', name: 'English', nativeName: 'English', isAvailable: true },
          { code: 'mi', name: 'Māori', nativeName: 'Māori', isAvailable: true },
        ]
      },
    ]
  }
];

const LanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState({ code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧' });
  const [selectedRegion, setSelectedRegion] = useState(null);
  const modalRef = useRef(null);
  const searchInputRef = useRef(null);
  const [allLanguages, setAllLanguages] = useState([]);

  // Flatten all languages for search
  useEffect(() => {
    const languages = [];
    regions.forEach(region => {
      region.countries.forEach(country => {
        country.languages.forEach(lang => {
          if (lang.isAvailable) {
            languages.push({
              ...lang,
              countryName: country.name,
              countryFlag: country.flag,
              region: region.name
            });
          }
        });
      });
    });
    setAllLanguages(languages);
  }, []);

  const toggleModal = () => setIsOpen(!isOpen);
  const closeModal = () => setIsOpen(false);

  const selectLanguage = (lang) => {
    setSelectedLanguage(lang);
    closeModal();
  };

  // Filter languages based on search query
  const filteredLanguages = searchQuery
    ? allLanguages.filter(lang => 
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        lang.countryName.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  // Handle language selection
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    closeModal();
  };

  // Handle region selection
  const handleRegionSelect = (region) => {
    setSelectedRegion(region);
    setSearchQuery('');
  };

  // Handle back to regions
  const handleBackToRegions = () => {
    setSelectedRegion(null);
    setSearchQuery('');
  };

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        const languageButton = document.querySelector('.language-button');
        if (!languageButton || !languageButton.contains(event.target)) {
          closeModal();
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        closeModal();
      }
    };

    document.addEventListener('keydown', handleEscape);
    return () => {
      document.removeEventListener('keydown', handleEscape);
    };
  }, []);

  // Focus search input when modal opens
  useEffect(() => {
    if (isOpen && searchInputRef.current) {
      setTimeout(() => searchInputRef.current.focus(), 100);
    }
  }, [isOpen, selectedRegion]);

  return (
    <div className="relative">
      {/* Language Selector Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="language-button flex items-center space-x-1 px-3 py-2 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors focus:outline-none focus:ring-2 focus:ring-orange-500 focus:ring-offset-2"
        aria-label="Select language"
        aria-expanded={isOpen}
      >
        <FiGlobe className="w-5 h-5" />
        <span className="font-medium text-sm">{selectedLanguage.code.toUpperCase()}</span>
      </button>

      {/* Modal Overlay */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-40">
            {/* Clickable Overlay - Placed below navbar */}
            <div 
              className="absolute inset-0 bg-black bg-opacity-30 top-16"
              onClick={closeModal}
            ></div>
            
            {/* Modal Content - Positioned below navbar */}
            <div className="fixed top-16 left-0 right-0 z-40 flex justify-center px-4">
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full max-w-md bg-white rounded-b-lg shadow-xl border-t-0 border border-gray-200"
                ref={modalRef}
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="sticky top-0 bg-white z-10 p-4 border-b border-gray-200 rounded-t-lg">
                  <div className="flex items-center justify-between">
                    <h3 className="text-base font-semibold text-gray-800">
                      {selectedRegion ? (
                        <button 
                          onClick={handleBackToRegions}
                          className="flex items-center text-orange-600 hover:text-orange-700"
                        >
                          <svg 
                            xmlns="http://www.w3.org/2000/svg" 
                            className="h-5 w-5 mr-1" 
                            viewBox="0 0 20 20" 
                            fill="currentColor"
                          >
                            <path 
                              fillRule="evenodd" 
                              d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" 
                              clipRule="evenodd" 
                            />
                          </svg>
                          {selectedRegion.name}
                        </button>
                      ) : searchQuery ? (
                        'Search Results'
                      ) : (
                        'Select Your Language'
                      )}
                    </h3>
                    <button
                      onClick={closeModal}
                      className="text-gray-500 hover:text-orange-600 focus:outline-none transition-colors"
                    >
                      <FiX className="h-5 w-5" />
                    </button>
                  </div>
                  
                  {/* Search Input */}
                  <div className="mt-3 relative">
                    <FiSearch className="absolute left-3 top-2.5 text-gray-400" />
                    <input
                      type="text"
                      ref={searchInputRef}
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search language or country..."
                      className="block w-full pl-9 pr-3 py-2 text-sm border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-400 focus:outline-none focus:ring-1 focus:ring-orange-500 focus:border-orange-500"
                    />
                  </div>
                </div>

                {/* Content */}
                <div className="overflow-y-auto max-h-[calc(100vh-64px)]">
                  {searchQuery ? (
                    // Search Results
                    <div className="p-4">
                      {filteredLanguages.length > 0 ? (
                        <ul className="space-y-1">
                          {filteredLanguages.map((lang) => (
                            <li key={`${lang.countryName}-${lang.code}`}>
                              <button
                                onClick={() => handleLanguageSelect(lang)}
                                className={`w-full px-4 py-2.5 text-left flex items-center space-x-3 transition-colors duration-100 text-sm ${
                                  selectedLanguage.code === lang.code
                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                    : 'hover:bg-gray-50 text-gray-700 hover:text-blue-600'
                                }`}
                              >
                                <span className="text-2xl flex-shrink-0">{lang.countryFlag}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-base font-medium truncate">
                                    {lang.name} ({lang.countryName})
                                  </p>
                                  <p className="text-sm text-gray-500 truncate">{lang.nativeName}</p>
                                </div>
                                {selectedLanguage.code === lang.code && (
                                  <span className="text-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                )}
                              </button>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <div className="flex flex-col items-center justify-center py-8 text-gray-500">
                          <FiSearch className="h-10 w-10 mb-3 opacity-30" />
                          <p className="text-sm">No languages found</p>
                          <p className="text-xs mt-1 text-gray-400">Try a different search term</p>
                        </div>
                      )}
                    </div>
                  ) : selectedRegion ? (
                    // Languages in selected region
                    <div className="p-4">
                      <ul className="space-y-1">
                        {selectedRegion.countries.flatMap(country => 
                          country.languages.filter(lang => lang.isAvailable).map(lang => (
                            <li key={`${country.id}-${lang.code}`}>
                              <button
                                onClick={() => handleLanguageSelect({
                                  ...lang,
                                  countryName: country.name,
                                  countryFlag: country.flag
                                })}
                                className={`w-full px-4 py-2.5 text-left flex items-center space-x-3 transition-colors duration-100 text-sm ${
                                  selectedLanguage.code === lang.code
                                    ? 'bg-blue-50 text-blue-700 font-medium'
                                    : 'hover:bg-gray-50 text-gray-700 hover:text-blue-600'
                                }`}
                              >
                                <span className="text-2xl flex-shrink-0">{country.flag}</span>
                                <div className="flex-1 min-w-0">
                                  <p className="text-base font-medium truncate">
                                    {lang.name} ({country.name})
                                  </p>
                                  <p className="text-sm text-gray-500 truncate">{lang.nativeName}</p>
                                </div>
                                {selectedLanguage.code === lang.code && (
                                  <span className="text-blue-600">
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                    </svg>
                                  </span>
                                )}
                              </button>
                            </li>
                          ))
                        )}
                      </ul>
                    </div>
                  ) : (
                    // Region Selection
                    <div className="p-4">
                      <div className="space-y-4">
                        {regions.map((region) => (
                          <div key={region.id} className="border border-gray-200 rounded-lg overflow-hidden">
                            <button
                              onClick={() => handleRegionSelect(region)}
                              className="w-full px-4 py-3 text-left bg-gray-50 hover:bg-gray-100 transition-colors flex items-center justify-between"
                            >
                              <span className="font-medium text-gray-900">{region.name}</span>
                              <FiChevronRight className="text-gray-400" />
                            </button>
                            <div className="p-2 bg-white grid grid-cols-2 gap-1">
                              {region.countries.slice(0, 4).map(country => (
                                <div key={country.id} className="flex items-center space-x-2 p-1.5 rounded hover:bg-gray-50">
                                  <span className="text-lg">{country.flag}</span>
                                  <span className="text-sm text-gray-600 truncate">{country.name}</span>
                                </div>
                              ))}
                              {region.countries.length > 4 && (
                                <div className="flex items-center p-1.5">
                                  <span className="text-xs text-gray-500">+{region.countries.length - 4} more</span>
                                </div>
                              )}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default LanguageSelector;
