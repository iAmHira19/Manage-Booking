'use client';

import { useState, useEffect, useRef } from 'react';
import { FiGlobe, FiSearch, FiX, FiChevronRight, FiHome, FiInfo, FiPhone, FiGlobe as FiGlobeIcon } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import { FaLanguage } from 'react-icons/fa';

// Function to get flag emoji from country code
const getFlagEmoji = (countryCode) => {
  if (!countryCode) return '🌍';
  const codePoints = countryCode
    .toUpperCase()
    .split('')
    .map(char => 127397 + char.charCodeAt(0));
  return String.fromCodePoint(...codePoints);
};

// Function to map API data to our component's format
const mapApiDataToRegions = (apiData) => {
  if (!apiData || !Array.isArray(apiData)) {
    console.error('Invalid API data format:', apiData);
    return [];
  }

  // First, create a map to group languages by country
  const countriesMap = new Map();
  
  apiData.forEach(item => {
    try {
      if (!item.tpCC_COUNTRY || !item.tpCC_LANGUAGE) return;
      
      const countryCode = item.tpCC_COUNTRY_CODE || '';
      const languageCode = (item.tpCC_LANGUAGE || 'en').substring(0, 2).toLowerCase();
      
      if (!countriesMap.has(countryCode)) {
        countriesMap.set(countryCode, {
          name: item.tpCC_COUNTRY,
          code: countryCode,
          continent: item.tpCC_CONTINENT || 'Other',
          languages: []
        });
      }
      
      const country = countriesMap.get(countryCode);
      
      // Add language if not already added
      if (!country.languages.some(lang => lang.code === languageCode)) {
        country.languages.push({
          code: languageCode,
          name: item.tpCC_LANGUAGE,
          nativeName: item.tpCC_LANGUAGE_NATIVE || item.tpCC_LANGUAGE,
          flag: getFlagEmoji(countryCode),
          isAvailable: true
        });
      }
    } catch (error) {
      console.error('Error processing item:', item, error);
    }
  }); // Close the forEach callback
  
  // Group countries by continent
  const countriesByContinent = {};
  
  for (const [_, country] of countriesMap) {
    const continent = country.continent;
    if (!countriesByContinent[continent]) {
      countriesByContinent[continent] = [];
    }
    
    // Sort languages by name
    country.languages.sort((a, b) => a.name.localeCompare(b.name));
    countriesByContinent[continent].push(country);
  }
  
  // Convert to regions array and sort continents
  return Object.entries(countriesByContinent)
    .map(([continent, countries]) => ({
      name: continent,
      // Sort countries by name within each continent
      countries: [...countries].sort((a, b) => a.name.localeCompare(b.name))
    }))
    // Sort continents alphabetically
    .sort((a, b) => a.name.localeCompare(b.name));
};

// Default empty regions that will be replaced with API data
const defaultRegions = [
  {
    name: 'Asia',
    countries: [
      {
        name: 'Qatar',
        code: 'QA',
        languages: [
          { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
          { code: 'en', name: 'English', nativeName: 'English' }
        ]
      },
      {
        name: 'United Arab Emirates',
        code: 'AE',
        languages: [
          { code: 'ar', name: 'Arabic', nativeName: 'العربية' },
          { code: 'en', name: 'English', nativeName: 'English' }
        ]
      }
    ]
  },
  {
    name: 'Europe',
    countries: [
      {
        name: 'United Kingdom',
        code: 'GB',
        languages: [
          { code: 'en', name: 'English', nativeName: 'English' }
        ]
      },
      {
        name: 'France',
        code: 'FR',
        languages: [
          { code: 'fr', name: 'French', nativeName: 'Français' }
        ]
      }
    ]
  }
];

const LanguageItem = ({ lang, isSelected, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={`p-4 cursor-pointer transition-all flex items-center justify-between ${
        isSelected 
          ? 'bg-orange-50 border-r-4 border-orange-600' 
          : 'hover:bg-gray-50 border-b border-gray-100 last:border-b-0'
      }`}
    >
      <div className="flex items-center">
        <div className="text-2xl mr-4">
          {lang.flag || '🌐'}
        </div>
        <div>
          <p className="text-base font-medium text-gray-800">
            {lang.name}
          </p>
          <p className="text-sm text-gray-500">
            {lang.nativeName}
          </p>
        </div>
      </div>
      {isSelected && (
        <div className="text-orange-600">
          <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </div>
      )}
    </div>
  );
};

const QatarLanguageSelector = ({ textClassName = 'text-blue-900' }) => {
  const [regions, setRegions] = useState(defaultRegions);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState(null);
  const [selectedRegion, setSelectedRegion] = useState('Asia');
  const panelRef = useRef(null);

  // Fetch languages from API
  useEffect(() => {
    const fetchLanguages = async () => {
      try {
        const response = await fetch('http://localhost:8081/api/tpMasterDataService/getCountry/None');
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        
        if (data && Array.isArray(data)) {
          const mappedRegions = mapApiDataToRegions(data);
          setRegions(mappedRegions);
        } else {
          console.warn('Unexpected API response format:', data);
          // Use default regions if API response is not as expected
          setRegions(defaultRegions);
        }
      } catch (err) {
        console.error('Error fetching languages:', err);
        setError(err.message);
        // Fall back to default regions if API call fails
        setRegions(defaultRegions);
      } finally {
        setIsLoading(false);
      }
    };

    fetchLanguages();
  }, []);

  // Close modal when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      // Only close if clicking outside the entire modal
      if (isOpen && panelRef.current && !panelRef.current.contains(event.target)) {
        // Check if the click is not on a button or interactive element
        if (!event.target.closest('button, a, input, [role="button"]')) {
          setIsOpen(false);
        }
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  const toggleModal = () => {
    setIsOpen(!isOpen);
  };

  const closeModal = () => {
    setIsOpen(false);
  };

  // Get all languages for the selected region
  const getLanguagesForSelectedRegion = () => {
    if (!selectedRegion) return [];
    
    const region = regions.find(r => r.name === selectedRegion);
    if (!region) return [];
    
    // Flatten all languages from all countries in the region
    return region.countries.flatMap(country => 
      country.languages.map(lang => ({
        ...lang,
        countryName: country.name,
        countryCode: country.code
      }))
    );
  };

  // Filter languages based on search query
  const filteredLanguages = searchQuery
    ? getLanguagesForSelectedRegion().filter(lang => {
        const query = searchQuery.toLowerCase();
        return (
          (lang.name && lang.name.toLowerCase().includes(query)) ||
          (lang.nativeName && lang.nativeName.toLowerCase().includes(query)) ||
          (lang.countryName && lang.countryName.toLowerCase().includes(query))
        );
      })
    : getLanguagesForSelectedRegion();

  // Handle language selection
  const handleLanguageSelect = (lang) => {
    setSelectedLanguage(lang);
    // Here you would typically update the application's language
    console.log('Selected language:', lang);
    closeModal();
  };

  if (isLoading) {
    return (
      <div className="flex h-64 items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-orange-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 text-red-600 bg-red-50 rounded-md">
        <p>Error loading languages. Please try again later.</p>
      </div>
    );
  }

  return (
    <div className="relative" ref={panelRef}>
      {/* Language Selector Button */}
      <button
        onClick={toggleModal}
        className="text-base font-gotham uppercase hover:text-orange-500 transition-colors duration-200 whitespace-nowrap flex items-center"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls="language-selector-dialog"
      >
        <div className={`flex items-center space-x-1 cursor-pointer ${textClassName}`}>
          <FiGlobe className="h-5 w-5" />
          <span className="text-sm font-medium">{selectedLanguage?.code?.toUpperCase() || 'EN'}</span>
        </div>
      </button>

      {/* Full-screen Language Selector Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[9999] overflow-y-auto">
            {/* Overlay with blur effect */}
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={closeModal}
              aria-hidden="true"
            />

            {/* Main Modal Container */}
            <div className="flex items-center justify-center min-h-screen p-4">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="relative w-full max-w-5xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col h-[90vh] max-h-[900px]"
                aria-modal="true"
                aria-labelledby="language-selector-title"
                id="language-selector-dialog"
                onClick={(e) => e.stopPropagation()}
              >
                {/* Header */}
                <div className="p-8 border-b border-gray-200 bg-white shadow-sm">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold flex items-center text-gray-800" id="language-selector-title">
                      <FaLanguage className="mr-3 text-orange-600" size={24} />
                      Select your preferred language
                    </h2>
                    <button
                      onClick={closeModal}
                      className="p-2 rounded-full hover:bg-black/10 text-white hover:text-white transition-colors"
                      aria-label="Close"
                    >
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>
                  
                  {/* Search */}
                  <div className="relative max-w-2xl">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-12 pr-12 py-3 border border-gray-200 bg-white text-gray-800 placeholder-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-transparent text-base transition-all"
                      placeholder="Search for a language..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      autoFocus
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors"
                        aria-label="Clear search"
                      >
                        <FiX className="h-5 w-5" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Main Content */}
                <div className="flex flex-1 overflow-hidden bg-gray-50">
                  {/* Sidebar */}
                  <div className="w-56 bg-white border-r border-gray-200 overflow-y-auto">
                    <div className="p-4">
                      <h3 className="text-sm font-semibold text-gray-700 mb-4 pl-2 font-gotham">
                        Regions
                      </h3>
                      <nav className="space-y-1">
                        {[
                          { name: 'Africa', count: 55 },
                          { name: 'Americas', count: 52 },
                          { name: 'Asia', count: 50 },
                          { name: 'Europe', count: 46 },
                          { name: 'Oceania', count: 25 }
                        ].map((region) => (
                          <button
                            key={region.name}
                            onClick={() => setSelectedRegion(region.name)}
                            className={`w-full text-left px-4 py-3 text-sm transition-colors relative font-gotham ${
                              selectedRegion === region.name
                                ? 'bg-orange-50 text-orange-600 font-medium' 
                                : 'text-gray-700 hover:bg-gray-50'
                            }`}
                          >
                            {selectedRegion === region.name && (
                              <div className="absolute left-0 top-0 bottom-0 w-1 bg-orange-500 rounded-r"></div>
                            )}
                            <span className="flex justify-between items-center">
                              <span>{region.name}</span>
                              <span className="text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded-full">
                                {region.count}
                              </span>
                            </span>
                          </button>
                        ))}
                      </nav>
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="flex-1 overflow-y-auto p-8 bg-gray-50">
                    {selectedRegion && (
                      <div>
                        <div className="flex items-center justify-between mb-6">
                          <h3 className="text-lg font-semibold text-gray-800">
                            {selectedRegion} Languages
                          </h3>
                          <span className="text-xs font-medium px-3 py-1 bg-white rounded-full text-gray-600 border border-gray-200">
                            {filteredLanguages.length} {filteredLanguages.length === 1 ? 'language' : 'languages'} found
                          </span>
                        </div>
                        
                        {filteredLanguages.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredLanguages.map((lang, index) => (
                              <div
                                key={`${lang.countryCode}-${lang.code}-${index}`}
                                onClick={() => handleLanguageSelect(lang)}
                                className={`p-4 rounded-lg flex flex-col cursor-pointer transition-colors ${
                                  selectedLanguage?.code === lang.code && selectedLanguage?.countryCode === lang.countryCode
                                    ? 'bg-orange-50 border-l-4 border-orange-500'
                                    : 'hover:bg-gray-50 border border-gray-100'
                                }`}
                              >
                                <div className="flex items-start">
                                  <span className="text-2xl mr-3 mt-1 flex-shrink-0" role="img" aria-label={lang.countryName}>
                                    {lang.flag}
                                  </span>
                                  <div className="min-w-0">
                                    <div className="font-gotham font-medium text-gray-900">
                                      {lang.name}
                                    </div>
                                    <div className="text-sm text-gray-600 font-normal mt-1">
                                      {lang.countryName}
                                    </div>
                                    {lang.nativeName && lang.nativeName !== lang.name && (
                                      <div className="text-xs text-gray-500 font-light mt-1">
                                        {lang.nativeName}
                                      </div>
                                    )}
                                  </div>
                                  {selectedLanguage?.code === lang.code && selectedLanguage?.countryCode === lang.countryCode && (
                                    <svg 
                                      className="h-5 w-5 text-orange-500 flex-shrink-0 ml-2 mt-1" 
                                      fill="none" 
                                      viewBox="0 0 24 24" 
                                      stroke="currentColor"
                                    >
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                  )}
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-16 bg-white rounded-xl border border-gray-100 shadow-sm">
                            <FiGlobe className="mx-auto h-20 w-20 text-gray-300 mb-4" />
                            <h3 className="text-xl font-medium text-gray-800">No languages found</h3>
                            <p className="mt-2 text-gray-500 max-w-md mx-auto">
                              {searchQuery
                                ? 'We couldn\'t find any languages matching your search. Try different keywords.'
                                : 'No languages available for the selected region.'}
                            </p>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QatarLanguageSelector;