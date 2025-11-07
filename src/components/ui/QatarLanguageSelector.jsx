'use client';

import { useState, useRef, useEffect } from 'react';
import { FiGlobe, FiChevronDown } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

const regions = [
  {
    name: 'Middle East',
    countries: [
      {
        name: 'Qatar',
        code: 'QA',
        languages: [
          { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', isAvailable: true },
          { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇶🇦', isAvailable: false }
        ]
      },
      {
        name: 'United Arab Emirates',
        code: 'AE',
        languages: [
          { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇦🇪', isAvailable: false }
        ]
      },
      {
        name: 'Saudi Arabia',
        code: 'SA',
        languages: [
          { code: 'ar', name: 'Arabic', nativeName: 'العربية', flag: '🇸🇦', isAvailable: false }
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
          { code: 'en', name: 'English', nativeName: 'English', flag: '🇬🇧', isAvailable: true }
        ]
      },
      {
        name: 'France',
        code: 'FR',
        languages: [
          { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇫🇷', isAvailable: false }
        ]
      },
      {
        name: 'Germany',
        code: 'DE',
        languages: [
          { code: 'de', name: 'German', nativeName: 'Deutsch', flag: '🇩🇪', isAvailable: false }
        ]
      }
    ]
  },
  {
    name: 'Asia Pacific',
    countries: [
      {
        name: 'India',
        code: 'IN',
        languages: [
          { code: 'hi', name: 'Hindi', nativeName: 'हिन्दी', flag: '🇮🇳', isAvailable: false }
        ]
      },
      {
        name: 'China',
        code: 'CN',
        languages: [
          { code: 'zh', name: 'Chinese', nativeName: '中文', flag: '🇨🇳', isAvailable: false }
        ]
      },
      {
        name: 'Japan',
        code: 'JP',
        languages: [
          { code: 'ja', name: 'Japanese', nativeName: '日本語', flag: '🇯🇵', isAvailable: false }
        ]
      }
    ]
  },
  {
    name: 'Americas',
    countries: [
      {
        name: 'United States',
        code: 'US',
        languages: [
          { code: 'es', name: 'Spanish', nativeName: 'Español', flag: '🇪🇸', isAvailable: false }
        ]
      },
      {
        name: 'Canada',
        code: 'CA',
        languages: [
          { code: 'fr', name: 'French', nativeName: 'Français', flag: '🇨🇦', isAvailable: false }
        ]
      },
      {
        name: 'Brazil',
        code: 'BR',
        languages: [
          { code: 'pt', name: 'Portuguese', nativeName: 'Português', flag: '🇧🇷', isAvailable: false }
        ]
      }
    ]
  }
];

const QatarLanguageSelector = () => {
  const [isOpen, setIsOpen] = useState(false);
  // Set English as the default language
  const [selectedLanguage, setSelectedLanguage] = useState({ 
    code: 'en', 
    name: 'English',
    flag: '🇬🇧',
    nativeName: 'English',
    isAvailable: true
  });
  const panelRef = useRef(null);
  const hasInitialized = useRef(false);

  // Set initial language on component mount
  useEffect(() => {
    // Only run this once on mount
    if (hasInitialized.current) return;
    
    const savedLang = localStorage.getItem('selectedLanguage');
    if (savedLang && savedLang !== 'en') {
      // Only update if the saved language is not English
      let found = false;
      for (const region of regions) {
        for (const country of region.countries) {
          const lang = country.languages.find(l => l.code === savedLang && l.isAvailable);
          if (lang) {
            setSelectedLanguage(lang);
            document.documentElement.lang = lang.code;
            found = true;
            break;
          }
        }
        if (found) break;
      }
    } else {
      // Ensure English is set as default
      localStorage.setItem('selectedLanguage', 'en');
      document.documentElement.lang = 'en';
    }
    
    hasInitialized.current = true;
  }, []);

  // Handle language change - only allow English for now
  const handleLanguageChange = (language) => {
    if (!language.isAvailable || language.code !== 'en') return;
    
    setSelectedLanguage(language);
    setIsOpen(false);
    document.documentElement.lang = language.code;
    localStorage.setItem('selectedLanguage', language.code);
  };

  // Close panel when clicking outside or pressing Escape
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (panelRef.current && !panelRef.current.contains(event.target)) {
        // Check if the click was not on the language button
        const languageButton = document.querySelector('.language-button');
        if (!languageButton || !languageButton.contains(event.target)) {
          setIsOpen(false);
        }
      }
    };

    const handleEscape = (event) => {
      if (event.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const togglePanel = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative z-50">
      <button
        onClick={(e) => {
          e.stopPropagation();
          togglePanel();
        }}
        className="language-button flex items-center space-x-1 text-base font-gotham text-blue-900 hover:text-orange-500 focus:outline-none transition-colors duration-200 px-3 py-2 rounded-md hover:bg-blue-50"
      >
        <FiGlobe className="w-5 h-5" />
        <span className="font-medium">{selectedLanguage.code.toUpperCase()}</span>
        <FiChevronDown className={`w-4 h-4 transition-transform duration-200 ${isOpen ? 'transform rotate-180' : ''}`} />
      </button>

      <AnimatePresence>
        {isOpen && (
          <>
            {/* Overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black z-40"
              onClick={(e) => {
                e.stopPropagation();
                setIsOpen(false);
              }}
            />

            {/* Language Panel */}
            <motion.div
              ref={panelRef}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -20, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="fixed left-0 right-0 top-[64px] bg-white shadow-2xl z-[100] h-[calc(100vh-64px)] max-h-[700px] overflow-hidden flex flex-col border-t-2 border-orange-500"
            >
              <div className="p-6 border-b border-gray-200 relative">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">Select your language</h2>
                    <p className="text-sm text-gray-500 mt-1">Choose your preferred language and region</p>
                  </div>
                  <button
                    onClick={() => setIsOpen(false)}
                    className="ml-4 p-2 -mt-2 -mr-2 text-gray-400 hover:text-gray-500 focus:outline-none"
                    aria-label="Close language selector"
                  >
                    <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {regions.map((region) => (
                    <div key={region.name} className="border border-gray-200 rounded-lg overflow-hidden">
                      <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                        <h3 className="font-medium text-gray-900">{region.name}</h3>
                      </div>
                      <div className="p-4 space-y-4">
                        {region.countries.map((country) => (
                          <div key={country.code} className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <span className="text-lg">{country.flag}</span>
                              <span className="text-sm font-medium text-gray-900">{country.name}</span>
                            </div>
                            <div className="pl-6 space-y-1">
                              {country.languages.map((language) => (
                                <button
                                  key={`${country.code}-${language.code}`}
                                  onClick={() => handleLanguageChange(language)}
                                  disabled={!language.isAvailable}
                                  className={`w-full text-left px-4 py-2.5 text-sm rounded-md flex items-center transition-colors duration-200 ${
                                    selectedLanguage.code === language.code && language.isAvailable
                                      ? 'bg-orange-50 text-orange-700 font-medium'
                                      : 'text-gray-700 hover:bg-orange-50 hover:text-orange-600'
                                  } ${
                                    !language.isAvailable ? 'opacity-60 cursor-not-allowed hover:bg-transparent' : 'cursor-pointer'
                                  }`}
                                >
                                  <span className="mr-2">{language.flag}</span>
                                  <span>{language.name}</span>
                                  {!language.isAvailable && (
                                    <span className="ml-2 text-xs bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
                                      Coming Soon
                                    </span>
                                  )}
                                </button>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-4 border-t border-gray-200 bg-gray-50 flex justify-end">
                <button
                  onClick={() => setIsOpen(false)}
                  className="px-6 py-2.5 text-sm font-medium text-white bg-orange-500 hover:bg-orange-600 rounded-md transition-colors duration-200"
                >
                  Close
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default QatarLanguageSelector;
