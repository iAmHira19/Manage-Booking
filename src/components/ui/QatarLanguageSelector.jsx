'use client';

import { useState, useEffect, useRef } from 'react';
import { FiGlobe, FiSearch, FiX, FiChevronRight, FiHome, FiInfo, FiPhone } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

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
      className={`p-4 rounded-lg cursor-pointer transition-all ${
        isSelected 
          ? 'bg-orange-50 border-2 border-orange-200' 
          : 'bg-white hover:bg-gray-50 border border-gray-100 hover:border-orange-100'
      }`}
    >
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 rounded-full bg-orange-50 flex items-center justify-center text-2xl">
            {lang.flag || '🌐'}
          </div>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-gray-900 truncate">
            {lang.name}
          </p>
          <p className="text-xs text-orange-600 truncate">
            {lang.nativeName !== lang.name ? lang.nativeName : ''}
          </p>
        </div>
        {isSelected && (
          <div className="flex-shrink-0">
            <div className="h-5 w-5 rounded-full bg-orange-500 flex items-center justify-center">
              <svg className="h-3 w-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const QatarLanguageSelector = () => {
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
    ? getLanguagesForSelectedRegion().filter(lang => 
        lang.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (lang.nativeName && lang.nativeName.toLowerCase().includes(searchQuery.toLowerCase()))
      )
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
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={toggleModal}
        className="flex items-center space-x-2 px-4 py-2 bg-white border border-gray-200 rounded-lg shadow-sm hover:bg-gray-50 transition-colors"
        aria-expanded={isOpen}
        aria-haspopup="dialog"
        aria-controls="language-selector-dialog"
      >
        <FiGlobe className="text-orange-500" />
        <span className="font-medium">
          {selectedLanguage ? `${selectedLanguage.name} (${selectedLanguage.countryCode})` : 'Select Language'}
        </span>
        <FiChevronRight className={`ml-1 h-4 w-4 transition-transform ${isOpen ? 'rotate-180' : ''}`} />
      </motion.button>

      {/* Full-screen Language Selector Modal */}
      <AnimatePresence>
        {isOpen && (
          <div className="fixed inset-0 z-[100] overflow-y-auto">
            {/* Overlay */}
            <div 
              className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity" 
              onClick={closeModal}
              aria-hidden="true"
              style={{ pointerEvents: 'auto' }}
            />

            {/* Modal */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.2 }}
              className="flex min-h-screen items-center justify-center p-4"
              role="dialog"
              aria-modal="true"
              aria-labelledby="language-selector-title"
              id="language-selector-dialog"
            >
              <div className="w-full max-w-4xl bg-white/95 backdrop-blur-md rounded-xl shadow-2xl overflow-hidden border border-white/20">
                {/* Header */}
                <div className="p-6 border-b border-gray-200 bg-white/80">
                  <div className="flex justify-between items-center">
                    <h2 className="text-2xl font-bold text-gray-900" id="language-selector-title">
                      Select your language
                    </h2>
                    <button
                      onClick={closeModal}
                      className="text-gray-400 hover:text-gray-500"
                      aria-label="Close"
                    >
                      <FiX className="h-6 w-6" />
                    </button>
                  </div>
                  
                  {/* Search */}
                  <div className="mt-4 relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <FiSearch className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                      type="text"
                      className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-orange-500 focus:border-orange-500 sm:text-sm"
                      placeholder="Search languages..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button
                        onClick={() => setSearchQuery('')}
                        className="absolute inset-y-0 right-0 pr-3 flex items-center"
                      >
                        <FiX className="h-5 w-5 text-gray-400 hover:text-gray-500" />
                      </button>
                    )}
                  </div>
                </div>

                {/* Content */}
                <div 
                  className="flex h-[500px] overflow-hidden relative z-10 bg-white/90"
                  onClick={(e) => e.stopPropagation()}
                >
                  {/* Sidebar */}
                  <div 
                    className="w-64 bg-gradient-to-b from-orange-50 to-orange-100 border-r border-orange-200 overflow-y-auto"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <div className="p-4">
                      <h3 className="text-sm font-medium text-orange-700 uppercase tracking-wider mb-4 flex items-center">
                        <FiGlobe className="mr-2" /> Regions
                      </h3>
                      <nav className="space-y-1">
                        {regions.map((region) => (
                          <button
                            key={region.name}
                            onClick={() => setSelectedRegion(region.name)}
                            className={`w-full text-left px-4 py-2.5 text-sm font-medium rounded-md flex items-center justify-between transition-colors duration-200 ${
                              selectedRegion === region.name
                                ? 'bg-orange-100 text-orange-700 font-medium border-l-4 border-orange-500'
                                : 'text-orange-700 hover:bg-orange-50 hover:border-l-4 hover:border-orange-200'
                            }`}
                          >
                            <span>{region.name}</span>
                            <FiChevronRight className="h-4 w-4" />
                          </button>
                        ))}
                      </nav>
                      
                      <div className="mt-8">
                        <h3 className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-2 px-2">
                          Menu
                        </h3>
                        <nav className="space-y-1">
                          <a href="#" className="flex items-center px-3 py-2.5 text-sm font-medium text-orange-700 hover:bg-orange-50 rounded-md group transition-colors">
                            <FiHome className="mr-3 h-5 w-5 text-orange-500 group-hover:text-orange-700" />
                            Home
                          </a>
                          <a href="#" className="flex items-center px-3 py-2.5 text-sm font-medium text-orange-700 hover:bg-orange-50 rounded-md group transition-colors">
                            <FiInfo className="mr-3 h-5 w-5 text-orange-500 group-hover:text-orange-700" />
                            About
                          </a>
                          <a href="#" className="flex items-center px-3 py-2.5 text-sm font-medium text-orange-700 hover:bg-orange-50 rounded-md group transition-colors">
                            <FiPhone className="mr-3 h-5 w-5 text-orange-500 group-hover:text-orange-700" />
                            Contact
                          </a>
                        </nav>
                      </div>
                    </div>
                  </div>

                  {/* Main content */}
                  <div className="flex-1 overflow-y-auto p-6 bg-white/80">
                    {selectedRegion && (
                      <>
                        <h3 className="text-lg font-medium text-gray-900 mb-4">
                          {selectedRegion} Languages
                        </h3>
                        
                        {filteredLanguages.length > 0 ? (
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {filteredLanguages.map((lang) => (
                              <LanguageItem
                                key={`${lang.countryCode}-${lang.code}`}
                                lang={lang}
                                isSelected={selectedLanguage?.code === lang.code && selectedLanguage?.countryCode === lang.countryCode}
                                onClick={() => handleLanguageSelect(lang)}
                              />
                            ))}
                          </div>
                        ) : (
                          <div className="text-center py-12">
                            <FiGlobe className="mx-auto h-12 w-12 text-gray-400" />
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No languages found</h3>
                            <p className="mt-1 text-sm text-gray-500">
                              {searchQuery
                                ? 'Try adjusting your search or filter to find what you\'re looking for.'
                                : 'No languages available for the selected region.'}
                            </p>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QatarLanguageSelector;
