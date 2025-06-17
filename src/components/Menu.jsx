import React, { useState } from 'react';

const Menu = ({ menuData }) => {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);

  // Mini Carousel Component
  const MiniCarousel = ({ photos, itemName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);

    const nextPhoto = () => {
      setCurrentIndex((prev) => (prev + 1) % photos.length);
    };

    const prevPhoto = () => {
      setCurrentIndex((prev) => (prev - 1 + photos.length) % photos.length);
    };

    const goToPhoto = (index) => {
      setCurrentIndex(index);
    };

    return (
      <div className="relative mb-4">
        {/* Photo Display */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-amber-100 to-orange-100 rounded-lg overflow-hidden">
          {photos && photos.length > 0 ? (
            // Show actual photos - render all images but control visibility
            <>
              {photos.map((photo, index) => (
                <div 
                  key={index}
                  className={`absolute inset-0 transition-opacity duration-300 ${
                    index === currentIndex ? 'opacity-100' : 'opacity-0'
                  }`}
                  style={{ display: index === currentIndex ? 'block' : 'none' }}
                >
                  <img 
                    src={photo} 
                    alt={`${itemName} - Photo ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      e.target.style.display = 'none';
                    }}
                  />
                </div>
              ))}
              
              {/* Navigation Arrows - Show if more than 1 photo */}
              {photos.length > 1 && (
                <>
                  <button
                    onClick={prevPhoto}
                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
                    aria-label="Previous photo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
                    </svg>
                  </button>

                  <button
                    onClick={nextPhoto}
                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/90 hover:bg-white text-gray-800 p-2 rounded-full shadow-lg transition-all duration-300 hover:scale-110 z-50"
                    aria-label="Next photo"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path>
                    </svg>
                  </button>
                </>
              )}

            </>
          ) : (
            // Show placeholder when no photos
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <svg className="w-16 h-16 text-amber-400 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p className="text-amber-600 font-medium text-sm">Upload Photos</p>
                <p className="text-amber-500 text-xs">(Client can replace this)</p>
              </div>
            </div>
          )}
        </div>

        {/* Dots Indicator - Show if more than 1 photo */}
        {photos && photos.length > 1 && (
          <div className="flex justify-center mt-2 space-x-1">
            {photos.map((_, index) => (
              <button
                key={index}
                onClick={() => goToPhoto(index)}
                className={`w-2 h-2 rounded-full transition-all duration-300 ${
                  index === currentIndex 
                    ? 'bg-amber-600 scale-125' 
                    : 'bg-gray-300 hover:bg-gray-400'
                }`}
                aria-label={`Go to photo ${index + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4">
        {menuData && menuData.length > 0 ? (
          // Render menu categories when data is available
          menuData.map((category, index) => (
            <div key={index} className="mb-20 last:mb-0">
              <div className="text-center mb-12">
                <h2 className="text-4xl font-bold text-gray-800 mb-4">{category.title}</h2>
                <p className="text-xl text-gray-600 max-w-2xl mx-auto">{category.description}</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {category.items.map((item, itemIndex) => (
                  <div key={itemIndex} className="bg-white rounded-2xl shadow-lg hover:shadow-xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100">
                    {/* Item Photos */}
                    <div className="p-6">
                      {item.photos && item.photos.length > 0 && (
                        <MiniCarousel photos={item.photos} itemName={item.name} />
                      )}
                      
                      <div className="flex justify-between items-start mb-3">
                        <h3 className="text-xl font-bold text-gray-800">{item.name}</h3>
                        <span className="text-amber-600 font-bold text-lg">{item.price}</span>
                      </div>
                      
                      <p className="text-gray-600 mb-4">{item.description}</p>
                      
                      {/* Badges */}
                      <div className="flex gap-2 mb-4">
                        {item.popular && (
                          <span className="bg-amber-100 text-amber-800 px-3 py-1 rounded-full text-sm font-medium">
                            Popular
                          </span>
                        )}
                        {item.onSale && (
                          <span className="bg-red-100 text-red-800 px-3 py-1 rounded-full text-sm font-medium">
                            On Sale
                          </span>
                        )}
                        {item.seasonal && (
                          <span className="bg-orange-100 text-orange-800 px-3 py-1 rounded-full text-sm font-medium">
                            Seasonal
                          </span>
                        )}
                      </div>
                      
                      {/* Order Button - Centered at bottom */}
                      <div className="flex justify-center">
                        {item.orderLink ? (
                          <a 
                            href={item.orderLink}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105"
                          >
                            {item.orderButtonText || 'Order Now'}
                          </a>
                        ) : (
                          <button className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105">
                            {item.orderButtonText || 'Order Now'}
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        ) : (
          // Empty state - ready for Google Sheets integration
          <div className="text-center py-20">
            <div className="max-w-2xl mx-auto">
              <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-12 mb-8">
                <svg className="w-24 h-24 text-amber-400 mx-auto mb-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path>
                </svg>
                <h2 className="text-3xl font-bold text-gray-800 mb-4">Menu Coming Soon</h2>
                <p className="text-lg text-gray-600 mb-6">
                  Our menu will be dynamically loaded from Google Sheets. 
                  This allows for easy updates without any coding required.
                </p>
                <div className="bg-white/50 rounded-lg p-6 text-left">
                  <h3 className="font-semibold text-gray-800 mb-3">How it works:</h3>
                  <ul className="text-gray-600 space-y-2">
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                      Add menu items to Google Sheets
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                      Organize by categories and descriptions
                    </li>
                    <li className="flex items-center">
                      <span className="w-2 h-2 bg-amber-500 rounded-full mr-3"></span>
                      Menu updates automatically on the website
                    </li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default Menu; 