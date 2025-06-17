import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const Products = ({ productsData }) => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);
  const [productCategories, setProductCategories] = useState([]);
  const [sectionData, setSectionData] = useState({});
  const [specialOfferData, setSpecialOfferData] = useState({});

  // Set data from props when it changes
  useEffect(() => {
    if (productsData) {
      setProductCategories(productsData.carouselItems || []);
      setSectionData(productsData.sectionData || {});
      setSpecialOfferData(productsData.specialOfferData || {});
    }
  }, [productsData]);

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying) return;
    
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % (productCategories.length || 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [isAutoPlaying, productCategories.length]);

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % (productCategories.length || 1));
    setIsAutoPlaying(false);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + (productCategories.length || 1)) % (productCategories.length || 1));
    setIsAutoPlaying(false);
  };

  const goToSlide = (index) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
  };

  // Render empty state
  if (!productCategories || productCategories.length === 0) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">No products available.</p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-16">
          <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
            {sectionData?.products_small_title || 'Our Menu'}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-4 mb-6">
            {sectionData?.products_black_title || 'Fresh from the'}
            <span className="block text-amber-600">{sectionData?.products_orange_title || 'Oven'}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {sectionData?.products_description || 'Discover our selection of handcrafted baked goods, each made with the finest ingredients and traditional baking methods.'}
          </p>
        </div>

        {/* Carousel Container */}
        <div className="relative max-w-4xl mx-auto">
          {/* Carousel Track */}
          <div className="relative overflow-hidden rounded-2xl shadow-2xl">
            <div 
              className="flex transition-transform duration-500 ease-in-out"
              style={{ transform: `translateX(-${currentSlide * 100}%)` }}
            >
              {productCategories?.map((category, index) => (
                <div key={index} className="w-full flex-shrink-0">
                  <div className="bg-white">
                    {/* Image Section */}
                    <div className="relative h-64 md:h-80 bg-gradient-to-br from-amber-100 to-orange-100">
                      {/* Show actual image if available, otherwise show placeholder */}
                      {category?.image ? (
                        <div className="absolute inset-0">
                          <img 
                            src={category.image} 
                            alt={category?.mainTitle || 'Product'} 
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              console.log('Image failed to load:', category.image);
                              e.target.style.display = 'none';
                              e.target.nextSibling.style.display = 'flex';
                            }}
                          />
                          {/* Fallback placeholder (hidden by default) */}
                          <div className="absolute inset-0 flex items-center justify-center" style={{ display: 'none' }}>
                            <div className="text-center">
                              <svg className="w-24 h-24 text-amber-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                              </svg>
                              <p className="text-amber-600 font-medium">Image Not Available</p>
                              <p className="text-amber-500 text-sm">({category.image})</p>
                            </div>
                          </div>
                        </div>
                      ) : (
                        /* Placeholder for client uploaded image */
                        <div className="absolute inset-0 flex items-center justify-center">
                          <div className="text-center">
                            <svg className="w-24 h-24 text-amber-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                            <p className="text-amber-600 font-medium">Upload Photo</p>
                            <p className="text-amber-500 text-sm">(Client can replace this)</p>
                          </div>
                        </div>
                      )}
                      
                      {/* Category Badge */}
                      <div className="absolute top-4 left-4">
                        <span className="bg-amber-600 text-white px-3 py-1 rounded-full text-sm font-medium">
                          {category?.badgeTitle || 'Category'}
                        </span>
                      </div>
                    </div>

                    {/* Content Section */}
                    <div className="p-8">
                      <div className="text-center">
                        <h3 className="text-2xl font-bold text-gray-800 mb-4">{category?.mainTitle || 'Category'}</h3>
                        <p className="text-gray-600 text-lg leading-relaxed">{category?.description || 'Description coming soon...'}</p>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
            aria-label="Previous slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-3 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-10"
            aria-label="Next slide"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
            </svg>
          </button>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-6 space-x-2">
            {productCategories?.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  index === currentSlide 
                    ? 'bg-amber-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to slide ${index + 1}`}
              />
            ))}
          </div>

          {/* Play/Pause Button */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="bg-amber-600 hover:bg-amber-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-all duration-300"
            >
              {isAutoPlaying ? 'Pause' : 'Play'} Auto-Play
            </button>
          </div>
        </div>

        {/* Special Offer */}
        <div className="mt-16 bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-center text-white">
          <h3 className="text-3xl font-bold mb-4">{specialOfferData?.special_offer_title || 'Special Offer'}</h3>
          <p className="text-xl mb-6">{specialOfferData?.special_offer_description || 'Order 6 or more items and get 15% off!'}</p>
          <Link 
            to={specialOfferData?.special_offer_button_link || '/menu'} 
            className="inline-block bg-white text-amber-600 hover:bg-gray-100 px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105"
          >
            {specialOfferData?.special_offer_button_text || 'View Full Menu'}
          </Link>
        </div>
      </div>
    </section>
  );
};

export default Products; 