import React from 'react';
import { Link } from 'react-router-dom';

const Homeintro = ({ homeIntroData }) => {
  // Use default data if homeIntroData is not provided
  const data = homeIntroData || {
    smallTitle: 'Our Story',
    blackTitle: 'A Passion for',
    orangeTitle: 'Perfect Baking',
    paragraph1: 'For over a decade, we\'ve been crafting artisanal baked goods that bring joy to every occasion. What started as a small home kitchen has grown into a beloved local bakery, but our commitment to quality and personal touch remains unchanged.',
    paragraph2: 'Every recipe is a family treasure, every ingredient carefully selected, and every creation made with the same love and attention to detail that we put into our very first batch.',
    stats: [
      {
        number: '10+',
        description: 'Years Experience'
      },
      {
        number: '500+',
        description: 'Happy Customers'
      },
      {
        number: '50+',
        description: 'Unique Recipes'
      }
    ],
    buttonText: 'Learn More About Us',
    buttonLink: '/about',
    image: ''
  };

  // Filter out empty stats
  const validStats = data.stats.filter(stat => stat.number && stat.description);

  return (
    <section className="py-20 pt-36">
      <div className="container mx-auto px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Text Content */}
            <div className="space-y-6">
              <div className="block text-center md:text-left">
                <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
                  {data.smallTitle}
                </span>
              </div>
              
              <h2 className="text-4xl md:text-5xl font-bold text-gray-800 leading-tight text-center md:text-left">
                {data.blackTitle}
                <span className="block text-amber-600">{data.orangeTitle}</span>
              </h2>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                {data.paragraph1}
              </p>
              
              <p className="text-xl text-gray-600 leading-relaxed">
                {data.paragraph2}
              </p>

              {/* Stats - Only show if there are valid stats */}
              {validStats.length > 0 && (
                <div className="grid grid-cols-3 gap-6 pt-8">
                  {validStats.map((stat, index) => (
                    <div key={index} className="text-center">
                      <div className="text-3xl font-bold text-amber-600">{stat.number}</div>
                      <div className="text-sm text-gray-600">{stat.description}</div>
                    </div>
                  ))}
                </div>
              )}

              <div className="text-center">
                <Link 
                  to={data.buttonLink}
                  className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-full font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg inline-block"
                >
                  {data.buttonText}
                </Link>
              </div>
            </div>

            {/* Image */}
            <div className="relative">
              {data.image ? (
                <div className="rounded-2xl overflow-hidden shadow-lg">
                  <img 
                    src={data.image} 
                    alt="Baker's photo" 
                    className="w-full h-96 object-cover"
                  />
                </div>
              ) : (
                <div className="bg-gradient-to-br from-amber-100 to-orange-100 rounded-2xl p-8 h-96 flex items-center justify-center">
                  <div className="text-center">
                    <svg className="w-24 h-24 text-amber-400 mx-auto mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"></path>
                    </svg>
                    <p className="text-amber-600 font-medium">Baker's Photo</p>
                    <p className="text-amber-500 text-sm">(Replace with actual image)</p>
                  </div>
                </div>
              )}
              
              {/* Decorative Elements */}
              <div className="absolute -top-4 -right-4 w-20 h-20 bg-amber-200 rounded-full opacity-50"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-orange-200 rounded-full opacity-50"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
   
export default Homeintro; 