'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiChevronRight, FiGlobe, FiHome, FiInfo, FiPhone, FiGlobe as FiLanguage } from 'react-icons/fi';
import Header from '@/app/component/(FirstPageComponents)/Header/Header';

const LanguageSelectionPage = () => {
  const [regions, setRegions] = useState([]);
  const [selectedRegion, setSelectedRegion] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchRegionsAndLanguages = async () => {
      try {
        // Fetch data from your API
        const response = await fetch('http://localhost:8081/api/tpMasterDataService/getCountry/None');
        const data = await response.json();
        
        // Process the data to get unique regions
        const uniqueRegions = [...new Set(data.map(item => item.tpCC_CONTINENT || 'Other'))];
        
        setRegions(uniqueRegions);
        setSelectedRegion(uniqueRegions[0]); // Select first region by default
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching regions:', error);
        setIsLoading(false);
      }
    };

    fetchRegionsAndLanguages();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-50">
      <Header />

      <div className="flex flex-1 overflow-hidden pt-4">
        {/* Sidebar */}
        <div className="w-64 bg-gradient-to-b from-orange-50 to-orange-100 border-r border-orange-200 overflow-y-auto">
          <div className="p-4">
            <h2 className="text-lg font-semibold text-orange-800 mb-4 flex items-center">
              <FiLanguage className="mr-2" /> Select Region
            </h2>
            
            {/* Sidebar Menu */}
            <div className="mb-6">
              <h3 className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-2 px-2">Menu</h3>
              <nav className="space-y-1">
                <Link href="/" className="flex items-center px-3 py-2 text-sm font-medium text-orange-700 hover:bg-orange-200 rounded-md group">
                  <FiHome className="mr-3 h-5 w-5 text-orange-500 group-hover:text-orange-700" />
                  Home
                </Link>
                <Link href="/about" className="flex items-center px-3 py-2 text-sm font-medium text-orange-700 hover:bg-orange-200 rounded-md group">
                  <FiInfo className="mr-3 h-5 w-5 text-orange-500 group-hover:text-orange-700" />
                  About
                </Link>
                <Link href="/contact" className="flex items-center px-3 py-2 text-sm font-medium text-orange-700 hover:bg-orange-200 rounded-md group">
                  <FiPhone className="mr-3 h-5 w-5 text-orange-500 group-hover:text-orange-700" />
                  Contact
                </Link>
              </nav>
            </div>
            
            <h3 className="text-xs font-semibold text-orange-700 uppercase tracking-wider mb-2 px-2">Regions</h3>
            <div className="space-y-1">
              {regions.map((region) => (
                <button
                  key={region}
                  onClick={() => setSelectedRegion(region)}
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center justify-between ${
                    selectedRegion === region
                      ? 'bg-orange-100 text-orange-700 font-medium border-l-4 border-orange-500'
                      : 'text-orange-700 hover:bg-orange-50 hover:border-l-4 hover:border-orange-200'
                  } transition-colors duration-200`}
                >
                  <span>{region}</span>
                  <FiChevronRight className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          {selectedRegion && (
            <div className="max-w-6xl mx-auto">
              <h1 className="text-2xl font-bold text-orange-800 mb-6 flex items-center">
                <FiGlobe className="mr-2" /> Languages in {selectedRegion}
              </h1>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <div 
                    key={i} 
                    className="bg-white p-5 rounded-xl shadow-sm border border-orange-100 hover:shadow-md transition-all duration-300 hover:border-orange-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-orange-50 rounded-xl">
                        <FiGlobe className="h-6 w-6 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 text-lg">Language {i}</h3>
                        <p className="text-sm text-orange-600">Native name</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectionPage;
