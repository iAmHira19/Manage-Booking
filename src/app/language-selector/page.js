'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { FiChevronRight, FiGlobe, FiHome, FiInfo, FiPhone, FiGlobe as FiLanguage } from 'react-icons/fi';
import Header from '@/app/component/(FirstPageComponents)/Header/Header';

const LanguageSelectorPage = () => {
  const [regions, setRegions] = useState([
    { name: 'Asia', countries: ['India', 'China', 'Japan'] },
    { name: 'Europe', countries: ['France', 'Germany', 'Spain'] },
    { name: 'Americas', countries: ['USA', 'Canada', 'Brazil'] },
  ]);
  const [selectedRegion, setSelectedRegion] = useState('Asia');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  // Simulate API call
  useEffect(() => {
    // In a real app, you would fetch this from your API
    // const fetchRegions = async () => {
    //   const response = await fetch('YOUR_API_ENDPOINT');
    //   const data = await response.json();
    //   setRegions(data);
    // };
    // fetchRegions();
  }, []);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-orange-500"></div>
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
            <div className="space-y-1">
              {regions.map((region) => (
                <button
                  key={region.name}
                  onClick={() => setSelectedRegion(region.name)}
                  className={`w-full text-left px-4 py-2 rounded-md flex items-center justify-between ${
                    selectedRegion === region.name
                      ? 'bg-orange-100 text-orange-700 font-medium border-l-4 border-orange-500'
                      : 'text-orange-700 hover:bg-orange-50 hover:border-l-4 hover:border-orange-200'
                  } transition-colors duration-200`}
                >
                  <span>{region.name}</span>
                  <FiChevronRight className="h-4 w-4" />
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-white">
          <div className="max-w-6xl mx-auto">
            <h1 className="text-2xl font-bold text-orange-800 mb-6">
              Languages in {selectedRegion}
            </h1>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {regions
                .find(r => r.name === selectedRegion)
                ?.countries.map((country, index) => (
                  <div 
                    key={index}
                    className="bg-white p-5 rounded-xl shadow-sm border border-orange-100 hover:shadow-md transition-all duration-300 hover:border-orange-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-orange-50 rounded-xl">
                        <FiGlobe className="h-6 w-6 text-orange-500" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-800 text-lg">{country} Language</h3>
                        <p className="text-sm text-orange-600">Native name</p>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LanguageSelectorPage;
