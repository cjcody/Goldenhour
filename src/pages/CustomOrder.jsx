import React, { useState, useEffect } from 'react';
import CustomOrderForm from '../components/CustomOrderForm';
import { getCustomOrderConfig } from '../services/customOrderService';
import PageLoading from '../components/PageLoading';

const CustomOrder = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        const customOrderConfig = await getCustomOrderConfig();
        setConfig(customOrderConfig);
      } catch (error) {
        console.error('Error fetching custom order config:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchConfig();
  }, []);

  // Wait for hero images to load
  useEffect(() => {
    if (!loading && config) {
      const imagesToLoad = [];
      if (config.heroImageDesktop) imagesToLoad.push(config.heroImageDesktop);
      if (config.heroImageMobile) imagesToLoad.push(config.heroImageMobile);
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
  }, [loading, config]);

  if (loading || !imagesLoaded) {
    return <PageLoading pageName="Custom Order" />;
  }

  return (
    <div>
      {/* Custom Order Hero Section */}
      <section className="py-20 relative bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        {/* Background Image */}
        {/* Desktop Image */}
        {config?.heroImageDesktop && (
          <div className="hidden md:block absolute inset-0 z-0">
            <img 
              src={config.heroImageDesktop} 
              alt="Custom Order Hero" 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('CUSTOM ORDER: Desktop hero image failed to load:', config.heroImageDesktop);
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        )}
        
        {/* Mobile Image */}
        {config?.heroImageMobile && (
          <div className="md:hidden absolute inset-0 z-0">
            <img 
              src={config.heroImageMobile} 
              alt="Custom Order Hero" 
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error('CUSTOM ORDER: Mobile hero image failed to load:', config.heroImageMobile);
                e.target.style.display = 'none';
              }}
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        )}
        
        {/* Content */}
        <div className="container mx-auto px-4 relative z-20">
          <div className="text-center">
            <div className="inline-block backdrop-blur-md bg-white/20 border border-white/30 px-6 py-4 md:px-10 md:py-6 rounded-2xl mb-8 mx-auto max-w-xl md:max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mt-4 mb-6">
                {config?.heroTitleBlack || 'Request a'} 
                <span className="block text-amber-600">
                  {config?.heroTitleOrange || 'Custom Order'}
                </span>
              </h1>
              <p className="text-xl text-gray-800 max-w-3xl mx-auto">
                {config?.heroPhrase || 'Let us know your vision'}
              </p>
            </div>
          </div>
        </div>
      </section>
      
      <CustomOrderForm googleAppsScriptUrl={config?.googleAppsScriptUrl} />
    </div>
  );
};

export default CustomOrder; 