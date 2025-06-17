import React from 'react';
import { Link } from 'react-router-dom';

const Hero = ({ heroData }) => {
  // Use default data if heroData is not provided
  const data = heroData || {
    titleBlack: 'Artisanal',
    titleOrange: 'Baking',
    phrase: 'Made with Love',
    buttonText: 'View Menu',
    buttonLink: '/menu'
  };

  return (
    <section className="relative min-h-screen flex items-center py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
      {/* Hero Background Images */}
      {/* Desktop background image */}
      {data.heroImageDesktop && (
        <div className="absolute inset-0 z-0 hidden sm:block">
          <img
            src={data.heroImageDesktop}
            alt="Hero background desktop"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      )}
      {/* Mobile background image */}
      {data.heroImageMobile && (
        <div className="absolute inset-0 z-0 block sm:hidden">
          <img
            src={data.heroImageMobile}
            alt="Hero background mobile"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-black/20"></div>
        </div>
      )}

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-4xl mx-auto text-center">
          {/* Main Heading and Description */}
          <div className="inline-block backdrop-blur-md bg-white/20 border border-white/30 px-6 py-4 md:px-10 md:py-6 rounded-2xl mb-8 mx-auto max-w-xl md:max-w-2xl">
            <h1 className="text-5xl md:text-7xl font-bold text-gray-800 leading-tight mb-6 text-center">
              {data.titleBlack}
              <span className="block text-amber-600">{data.titleOrange}</span>
              <span className="block text-3xl md:text-4xl font-light text-gray-800 mt-4">
                {data.phrase}
              </span>
            </h1>
          </div>

          {/* CTA Buttons */}
          <div className="flex justify-center items-center mb-12">
            <Link 
              to={data.buttonLink} 
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              {data.buttonText}
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero; 