import React, { useState, useEffect } from 'react';
import Menucomponent from '../components/Menu';
import { getSpecialOffersConfig, refreshSpecialOffersConfig } from '../services/specialOffersService.js';
import { getMenuData } from '../services/menuService.js';
import PageLoading from '../components/PageLoading.jsx';

const Menu = () => {
  const [specialOffersData, setSpecialOffersData] = useState(null);
  const [menuData, setMenuData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const fetchAllData = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('MENU PAGE: Starting to fetch all data...');
        
        // Fetch both special offers and menu data in parallel
        const [specialOffers, menu] = await Promise.all([
          getSpecialOffersConfig(),
          getMenuData()
        ]);
        
        console.log('MENU PAGE: Received special offers data:', specialOffers);
        console.log('MENU PAGE: Received menu data:', menu);
        
        setSpecialOffersData(specialOffers);
        setMenuData(menu);
        setError(null);
      } catch (err) {
        console.error('MENU PAGE: Error fetching data:', err);
        setError('Failed to load menu content');
      } finally {
        setLoading(false);
      }
    };

    fetchAllData();
  }, []);

  // Handle image loading for hero images
  useEffect(() => {
    if (!loading && specialOffersData) {
      const loadHeroImages = async () => {
        const imagesToLoad = [];
        
        if (specialOffersData.heroImageDesktop) {
          imagesToLoad.push(specialOffersData.heroImageDesktop);
        }
        if (specialOffersData.heroImageMobile) {
          imagesToLoad.push(specialOffersData.heroImageMobile);
        }
        
        if (imagesToLoad.length === 0) {
          setImagesLoaded(true);
          return;
        }
        
        try {
          await Promise.all(
            imagesToLoad.map(src => {
              return new Promise((resolve, reject) => {
                const img = new Image();
                img.onload = resolve;
                img.onerror = resolve; // Don't fail if image doesn't load
                img.src = src;
              });
            })
          );
        } catch (err) {
          console.warn('MENU PAGE: Some hero images failed to load:', err);
        } finally {
          setImagesLoaded(true);
        }
      };
      
      loadHeroImages();
    }
  }, [loading, specialOffersData]);

  const handleRefresh = async () => {
    try {
      setLoading(true);
      setImagesLoaded(false);
      console.log('MENU PAGE: Refreshing all data...');
      
      const [specialOffers, menu] = await Promise.all([
        refreshSpecialOffersConfig(),
        getMenuData()
      ]);
      
      console.log('MENU PAGE: Refreshed special offers data:', specialOffers);
      console.log('MENU PAGE: Refreshed menu data:', menu);
      
      setSpecialOffersData(specialOffers);
      setMenuData(menu);
      setError(null);
    } catch (err) {
      console.error('MENU PAGE: Error refreshing data:', err);
      setError('Failed to refresh menu content');
    } finally {
      setLoading(false);
    }
  };

  // Show loading until all data and images are loaded
  if (loading || !imagesLoaded) {
    return <PageLoading pageName="Menu" />;
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
        {specialOffersData?.heroImageDesktop && (
          <div className="hidden md:block absolute inset-0 z-0">
            <img 
              src={specialOffersData.heroImageDesktop} 
              alt="Menu hero background" 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('MENU PAGE: Desktop hero image failed to load:', specialOffersData.heroImageDesktop);
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        )}
        
        {/* Mobile Hero Image */}
        {specialOffersData?.heroImageMobile && (
          <div className="md:hidden absolute inset-0 z-0">
            <img 
              src={specialOffersData.heroImageMobile} 
              alt="Menu hero background" 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('MENU PAGE: Mobile hero image failed to load:', specialOffersData.heroImageMobile);
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
                {specialOffersData?.heroTitleBlack || 'Fresh from the'}
                <span className="block text-amber-600">{specialOffersData?.heroTitleOrange || 'Oven'}</span>
              </h1>
              <p className="text-xl text-gray-800 max-w-3xl mx-auto">
                {specialOffersData?.heroPhrase || 'Discover our complete selection'}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Menu Component - Pass the loaded menu data */}
      <Menucomponent menuData={menuData} />

      {/* Special Offers */}
      {specialOffersData?.specialOffers && specialOffersData.specialOffers.length > 0 && (
        <section className="py-20 bg-gradient-to-r from-amber-500 to-orange-500">
          <div className="container mx-auto px-4">
            <div className="text-center text-white">
              <h2 className="text-4xl font-bold mb-6">{specialOffersData?.bannerTitle || 'Special Offers'}</h2>
              <div className={`grid grid-cols-1 md:grid-cols-${specialOffersData.specialOffers.length > 2 ? '3' : specialOffersData.specialOffers.length === 2 ? '2' : '1'} gap-8 max-w-4xl mx-auto`}>
                {specialOffersData.specialOffers.map((offer, index) => (
                  <div key={index} className="bg-white/10 rounded-2xl p-8 backdrop-blur-sm">
                    <h3 className="text-2xl font-bold mb-4">{offer.title}</h3>
                    <p className="text-amber-100 mb-4">{offer.description}</p>
                    <button 
                      className="bg-white text-amber-600 hover:bg-gray-100 px-6 py-3 rounded-lg font-semibold transition-all duration-300"
                      onClick={() => {
                        if (offer.buttonLink && offer.buttonLink !== '#') {
                          window.open(offer.buttonLink, '_blank');
                        }
                      }}
                    >
                      {offer.buttonText}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>
      )}
    </div>
  );
};

export default Menu; 