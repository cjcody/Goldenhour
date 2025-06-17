import React, { useState, useEffect } from 'react';
import { getAboutConfig, refreshAboutConfig } from '../services/aboutService.js';
import PageLoading from './PageLoading.jsx';

// Simple cache utility for this component
const getCachedData = (key) => {
  try {
    const cached = sessionStorage.getItem(key);
    if (cached) {
      const { data, timestamp } = JSON.parse(cached);
      const now = Date.now();
      const cacheAge = now - timestamp;
      const cacheExpiry = 5 * 60 * 1000; // 5 minutes
      
      if (cacheAge < cacheExpiry) {
        console.log(`ABOUT COMPONENT: Using cached data for ${key}`);
        return data;
      } else {
        console.log(`ABOUT COMPONENT: Cache expired for ${key}, removing`);
        sessionStorage.removeItem(key);
      }
    }
  } catch (err) {
    console.warn('ABOUT COMPONENT: Error reading cache:', err);
  }
  return null;
};

const setCachedData = (key, data) => {
  try {
    const cacheData = {
      data,
      timestamp: Date.now()
    };
    sessionStorage.setItem(key, JSON.stringify(cacheData));
    console.log(`ABOUT COMPONENT: Cached data for ${key}`);
  } catch (err) {
    console.warn('ABOUT COMPONENT: Error setting cache:', err);
  }
};

const Aboutinfo = () => {
  const [aboutData, setAboutData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const fetchAboutData = async () => {
      try {
        setLoading(true);
        setImagesLoaded(false);
        
        // Check cache first
        const cachedData = getCachedData('aboutData');
        if (cachedData) {
          setAboutData(cachedData);
          setError(null);
          setLoading(false);
          return;
        }
        
        console.log('ABOUT COMPONENT: Fetching fresh data...');
        const data = await getAboutConfig();
        setAboutData(data);
        setError(null);
        
        // Cache the data
        setCachedData('aboutData', data);
      } catch (err) {
        console.error('ABOUT COMPONENT: Error fetching about data:', err);
        setError('Failed to load about page content');
      } finally {
        setLoading(false);
      }
    };
    fetchAboutData();
  }, []);

  // Wait for hero images to load
  useEffect(() => {
    if (!loading && aboutData) {
      const imagesToLoad = [];
      if (aboutData.heroImageDesktop) imagesToLoad.push(aboutData.heroImageDesktop);
      if (aboutData.heroImageMobile) imagesToLoad.push(aboutData.heroImageMobile);
      if (imagesToLoad.length === 0) {
        setImagesLoaded(true);
        return;
      }
      let loaded = 0;
      imagesToLoad.forEach(src => {
        const img = new window.Image();
        img.onload = img.onerror = () => {
          loaded++;
          if (loaded === imagesToLoad.length) setImagesLoaded(true);
        };
        img.src = src;
      });
    }
  }, [loading, aboutData]);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setImagesLoaded(false);
      console.log('ABOUT COMPONENT: Refreshing about data...');
      
      // Clear cache and fetch fresh data
      sessionStorage.removeItem('aboutData');
      const data = await refreshAboutConfig();
      console.log('ABOUT COMPONENT: Refreshed about data:', data);
      setAboutData(data);
      setError(null);
      
      // Cache the fresh data
      setCachedData('aboutData', data);
    } catch (err) {
      console.error('ABOUT COMPONENT: Error refreshing about data:', err);
      setError('Failed to refresh about page content');
    } finally {
      setLoading(false);
    }
  };

  if (loading || !imagesLoaded) {
    return <PageLoading pageName="About" />;
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Error Loading Content</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button 
            onClick={handleRefresh} 
            className="bg-amber-600 text-white px-6 py-2 rounded-lg hover:bg-amber-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div>
      {/* Hero Section */}
      <section className="py-20 relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        {/* Hero Background Images */}
        {/* Desktop Hero Image */}
        {aboutData?.heroImageDesktop && (
          <div className="hidden md:block absolute inset-0 z-0">
            <img 
              src={aboutData.heroImageDesktop} 
              alt="About hero background" 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('ABOUT COMPONENT: Desktop hero image failed to load:', aboutData.heroImageDesktop);
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        )}
        
        {/* Mobile Hero Image */}
        {aboutData?.heroImageMobile && (
          <div className="md:hidden absolute inset-0 z-0">
            <img 
              src={aboutData.heroImageMobile} 
              alt="About hero background" 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('ABOUT COMPONENT: Mobile hero image failed to load:', aboutData.heroImageMobile);
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        )}
        
        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center">
            <div className="inline-block backdrop-blur-md bg-white/20 border border-white/30 px-6 py-4 md:px-10 md:py-6 rounded-2xl mb-8 mx-auto max-w-xl md:max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mt-4 mb-6">
                {aboutData?.heroTitleBlack || 'Our Baking'}
                <span className="block text-amber-600">{aboutData?.heroTitleOrange || 'Story'}</span>
              </h1>
              <p className="text-xl text-gray-800 max-w-3xl mx-auto">
                {aboutData?.heroPhrase || 'Discover the passion'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center mb-20">
              <div>
                <h2 className="text-3xl font-bold text-gray-800 mb-6 text-center md:text-left">{aboutData?.introTitle || 'A Family Tradition'}</h2>
                <p className="text-xl text-gray-600 leading-relaxed mb-6">
                  {aboutData?.introDescription || 'Our journey began in a small kitchen with a big dream. What started as a grandmother\'s secret recipes has grown into a beloved local bakery, but our commitment to quality and personal touch remains unchanged.'}
                </p>
                <p className="text-xl text-gray-600 leading-relaxed">
                  {aboutData?.introDescription2 || 'Every recipe is a family treasure, every ingredient carefully selected, and every creation made with the same love and attention to detail that we put into our very first batch.'}
                </p>
              </div>
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl h-96 flex items-center justify-center">
                {aboutData?.introImage ? (
                  <img 
                    src={aboutData.introImage} 
                    alt="About us" 
                    className="w-full h-full object-cover rounded-xl"
                    onError={(e) => {
                      console.error('ABOUT COMPONENT: Image failed to load:', aboutData.introImage);
                      e.target.style.display = 'none';
                    }}
                    onLoad={() => {
                      console.log('ABOUT COMPONENT: Image loaded successfully:', aboutData.introImage);
                    }}
                  />
                ) : (
                  <div className="text-center">
                    <svg className="w-24 h-24 text-amber-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <p className="text-amber-600 font-medium">Family Photo</p>
                    <p className="text-amber-500 text-sm">(Replace with actual image)</p>
                  </div>
                )}
              </div>
            </div>

            {/* Values Section */}
            <div className="mb-20">
              <h2 className="text-3xl font-bold text-gray-800 text-center mb-12">{aboutData?.valuesTitle || 'Our Values'}</h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="text-center">
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{aboutData?.value1Title || 'Quality First'}</h3>
                  <p className="text-gray-600">{aboutData?.value1Description || 'We use only the finest ingredients and traditional baking methods to ensure every product meets our high standards.'}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{aboutData?.value2Title || 'Made with Love'}</h3>
                  <p className="text-gray-600">{aboutData?.value2Description || 'Every creation is crafted with passion, care, and the same love that goes into baking for our own family.'}</p>
                </div>
                
                <div className="text-center">
                  <div className="w-20 h-20 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <svg className="w-10 h-10 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                  </div>
                  <h3 className="text-xl font-bold text-gray-800 mb-4">{aboutData?.value3Title || 'Community Focused'}</h3>
                  <p className="text-gray-600">{aboutData?.value3Description || 'We\'re proud to be part of our local community and love creating special moments for our neighbors and friends.'}</p>
                </div>
              </div>
            </div>

            {/* Stats Section */}
            <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-12 text-white text-center">
              <h2 className="text-3xl font-bold mb-8">{aboutData?.bannerTitle || 'Our Journey in Numbers'}</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                <div>
                  <div className="text-4xl font-bold mb-2">{aboutData?.bannerStat1Title || '10+'}</div>
                  <div className="text-amber-100">{aboutData?.bannerStat1Description || 'Years Experience'}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">{aboutData?.bannerStat2Title || '500+'}</div>
                  <div className="text-amber-100">{aboutData?.bannerStat2Description || 'Happy Customers'}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">{aboutData?.bannerStat3Title || '50+'}</div>
                  <div className="text-amber-100">{aboutData?.bannerStat3Description || 'Unique Recipes'}</div>
                </div>
                <div>
                  <div className="text-4xl font-bold mb-2">{aboutData?.bannerStat4Title || '1000+'}</div>
                  <div className="text-amber-100">{aboutData?.bannerStat4Description || 'Cakes Baked'}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Aboutinfo; 