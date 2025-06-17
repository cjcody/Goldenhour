import React, { useState, useEffect } from 'react';

const Testimonials = ({ testimonialsData }) => {
  const [testimonials, setTestimonials] = useState([]);
  const [sectionData, setSectionData] = useState({});
  const [bannerData, setBannerData] = useState({});

  // Set data from props when it changes
  useEffect(() => {
    if (testimonialsData) {
      setTestimonials(testimonialsData.testimonialsData || []);
      setSectionData(testimonialsData.sectionData || {});
      setBannerData(testimonialsData.bannerData || {});
    }
  }, [testimonialsData]);

  const renderStars = (rating) => {
    return [...Array(5)].map((_, index) => (
      <svg
        key={index}
        className={`w-5 h-5 ${index < rating ? 'text-yellow-400' : 'text-gray-300'}`}
        fill="currentColor"
        viewBox="0 0 20 20"
      >
        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
      </svg>
    ));
  };

  // Render empty state
  if (!testimonials || testimonials.length === 0) {
    return (
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <p className="text-gray-600">No testimonials available.</p>
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
            {sectionData?.testimonial_small_title || 'Testimonials'}
          </span>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-800 mt-4 mb-6">
            {sectionData?.testimonial_black_title || 'What Our'}
            <span className="block text-amber-600">{sectionData?.testimonial_orange_title || 'Customers Say'}</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            {sectionData?.testimonial_description || "Don't just take our word for it - hear from our satisfied customers who have experienced our delicious baked goods and exceptional service."}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <div key={index} className="bg-gradient-to-br from-amber-50 to-orange-50 rounded-2xl p-8 hover:shadow-lg transition-all duration-300 transform hover:-translate-y-2">
              <div className="flex items-center mb-6">
                <div className="w-16 h-16 bg-amber-200 rounded-full flex items-center justify-center text-amber-600 mr-4">
                  <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/>
                  </svg>
                </div>
                <div>
                  <h4 className="font-bold text-gray-800">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
              
              <div className="flex mb-4">
                {renderStars(testimonial.rating)}
              </div>
              
              <p className="text-gray-700 leading-relaxed italic">
                "{testimonial.content}"
              </p>
            </div>
          ))}
        </div>

        {/* Overall Rating */}
        <div className="mt-16 text-center">
          <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
            <h3 className="text-3xl font-bold mb-4">{bannerData?.testimonial_banner_title || 'Overall Rating'}</h3>
            <div className="flex justify-center mb-4">
              {renderStars(5)}
            </div>
            <p className="text-xl mb-2">{bannerData?.testimonial_banner_text_top || '4.9 out of 5 stars'}</p>
            <p className="text-amber-100">{bannerData?.testimonial_banner_text_bottom || 'Based on 500+ customer reviews'}</p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Testimonials; 