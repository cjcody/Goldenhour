import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero';
import Products from '../components/Products';
import Testimonials from '../components/Testimonials';
import Homeintro from '../components/Homeintro';
import PageLoading from '../components/PageLoading';
import { usePageData } from '../hooks/usePageData';
import { getHeroConfig } from '../services/heroService';
import { getHomeIntroConfig } from '../services/homeIntroService';
import { getProductsData } from '../services/productsService';
import { getTestimonialsData } from '../services/testimonialsService';

const Home = () => {
  // Define all data sources this page needs with their options
  const dataSources = [
    getHeroConfig, // Hero section data
    getHomeIntroConfig, // Home intro section data
    () => getProductsData({
      carouselHeaders: ['Product Slide Badge', 'Product Slide Image', 'Product Slide Title', 'Product Slide Description'],
      sectionHeaders: ['Products Small Title', 'Products Black Title', 'Products Orange Title', 'Products Description'],
      specialOfferHeaders: ['Special Offer Title', 'Special Offer Description', 'Special Offer Button Text', 'Special Offer Button Link'],
      columnMapping: {
        'Product Slide Badge': 'badge_title',
        'Product Slide Title': 'main_title',
        'Product Slide Description': 'description',
        'Product Slide Image': 'image'
      }
    }), // Products carousel data
    () => getTestimonialsData({
      sectionHeaders: ['Testimonial Small Title', 'Testimonial Black Title', 'Testimonial Orange Title', 'Testimonial Description'],
      testimonialHeaders: ['Testimonial Name', 'Testimonial Name Label', 'Testimonial Quote'],
      bannerHeaders: ['Testimonial Banner Title', 'Testimonial Banner Text Top', 'Testimonial Banner Text Bottom']
    }), // Testimonials data
  ];

  const dataNames = [
    'hero',
    'homeIntro',
    'products',
    'testimonials',
  ];

  const { loading, error, data, refresh } = usePageData(dataSources, dataNames);
  const [imagesLoaded, setImagesLoaded] = useState(false);

  // Wait for hero images to load
  useEffect(() => {
    if (!loading && data && data.hero) {
      const imagesToLoad = [];
      if (data.hero.heroImageDesktop) imagesToLoad.push(data.hero.heroImageDesktop);
      if (data.hero.heroImageMobile) imagesToLoad.push(data.hero.heroImageMobile);
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
  }, [loading, data]);

  // Show loading screen while fetching all data and images
  if (loading || !imagesLoaded) {
    return <PageLoading pageName="Home" />;
  }

  // Show error state if data failed to load
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
        <div className="text-center max-w-2xl mx-auto p-8">
          <div className="bg-white rounded-2xl p-12 shadow-lg">
            <svg className="w-24 h-24 text-red-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z"></path>
            </svg>
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Page Loading Error</h2>
            <p className="text-lg text-gray-600 mb-6">{error}</p>
            <button 
              onClick={refresh}
              className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-3 rounded-full font-semibold transition-all duration-300"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Pass the loaded data to components that need it
  return (
    <div>
      <Hero heroData={data.hero} />
      <Homeintro homeIntroData={data.homeIntro} />
      <Products productsData={data.products} />
      <Testimonials testimonialsData={data.testimonials} />
    </div>
  );
};

export default Home; 