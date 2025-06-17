import React, { useState, useEffect } from 'react';
import { getContactConfig } from '../services/contactService';
import { extractGoogleMapsUrl, createSafeMapIframe } from '../utils/mapHelpers';
import PageLoading from './PageLoading'; // adjust path if needed

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
        console.log(`CONTACT COMPONENT: Using cached data for ${key}`);
        return data;
      } else {
        console.log(`CONTACT COMPONENT: Cache expired for ${key}, removing`);
        sessionStorage.removeItem(key);
      }
    }
  } catch (err) {
    console.warn('CONTACT COMPONENT: Error reading cache:', err);
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
    console.log(`CONTACT COMPONENT: Cached data for ${key}`);
  } catch (err) {
    console.warn('CONTACT COMPONENT: Error setting cache:', err);
  }
};

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    orderType: '',
    message: ''
  });

  const [contactConfig, setContactConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [imagesLoaded, setImagesLoaded] = useState(false);
  const [expandedFaqs, setExpandedFaqs] = useState(new Set());

  // Fetch contact configuration
  useEffect(() => {
    const fetchContactConfig = async () => {
      try {
        setLoading(true);
        setImagesLoaded(false);
        
        // Check cache first
        const cachedData = getCachedData('contactData');
        if (cachedData) {
          setContactConfig(cachedData);
          setLoading(false);
          return;
        }
        
        console.log('CONTACT COMPONENT: Fetching fresh data...');
        const config = await getContactConfig();
        setContactConfig(config);
        
        // Cache the data
        setCachedData('contactData', config);
      } catch (error) {
        console.error('Error fetching contact config:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchContactConfig();
  }, []);

  // Wait for hero images to load
  useEffect(() => {
    if (!loading && contactConfig) {
      const imagesToLoad = [];
      if (contactConfig.heroDesktopImage) imagesToLoad.push(contactConfig.heroDesktopImage);
      if (contactConfig.heroMobileImage) imagesToLoad.push(contactConfig.heroMobileImage);
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
  }, [loading, contactConfig]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle form submission here
    console.log('Form submitted:', formData);
  };

  const toggleFaq = (faqId) => {
    setExpandedFaqs(prev => {
      const newSet = new Set(prev);
      if (newSet.has(faqId)) {
        newSet.delete(faqId);
      } else {
        newSet.add(faqId);
      }
      return newSet;
    });
  };

  // Show loading state until both data and images are loaded
  if (loading || !imagesLoaded) {
    return <PageLoading />;
  }

  // Use default config if none loaded
  const config = contactConfig || {
    heroDesktopImage: '',
    heroMobileImage: '',
    heroTitleBlack: 'Ready to',
    heroTitleOrange: 'Order?',
    heroPhrase: "We'd love to hear from you",
    contactBoxTitle: 'Contact Information',
    addressTitle: 'Address',
    addressInfo: '123 Baker Street, Sweetville, CA 90210',
    phoneTitle: 'Phone',
    phoneInfo: '(555) 123-4567',
    emailTitle: 'Email',
    emailInfo: 'hello@artisanbaking.com',
    hoursTitle: 'Hours',
    hoursInfo: 'Mon-Fri: 7AM-6PM\nSat: 8AM-4PM\nSun: 9AM-2PM',
    mapTitle: 'Our Location',
    mapDescription: 'Serving Sweetville and the surrounding area. Find us in the heart of downtown at 123 Baker Street, Sweetville, CA.',
    mapEmbedCode: '',
    faqTitle: 'Frequently Asked Questions',
    faqs: []
  };

  // Split hours into lines for display
  const hoursLines = config.hoursInfo.split('\n');

  return (
    <div>
      {/* Hero Section with Background Images */}
      <section className="relative py-20 bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50">
        {/* Background Images */}
        {/* Desktop Image */}
        {config.heroDesktopImage && (
          <div className="hidden md:block absolute inset-0 z-0">
            <img 
              src={config.heroDesktopImage} 
              alt="Contact Hero" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        )}
        
        {/* Mobile Image */}
        {config.heroMobileImage && (
          <div className="md:hidden absolute inset-0 z-0">
            <img 
              src={config.heroMobileImage} 
              alt="Contact Hero" 
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black/20"></div>
          </div>
        )}
        
        {/* Hero Content */}
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center">
            <div className="inline-block backdrop-blur-md bg-white/20 border border-white/30 px-6 py-4 md:px-10 md:py-6 rounded-2xl mb-8 mx-auto max-w-xl md:max-w-2xl">
              <h1 className="text-5xl md:text-6xl font-bold text-gray-800 mt-4 mb-6">
                {config.heroTitleBlack}
                <span className="block text-amber-600">{config.heroTitleOrange}</span>
              </h1>
              <p className="text-xl text-gray-800 max-w-3xl mx-auto">
                {config.heroPhrase}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-6xl mx-auto">
            <div className="max-w-4xl mx-auto">
              {/* Contact Information */}
              <div className="bg-white rounded-2xl shadow-lg p-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-6 text-center">{config.contactBoxTitle}</h3>
                
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">{config.addressTitle}</h4>
                    <p className="text-gray-600 text-sm">{config.addressInfo}</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z"></path>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">{config.phoneTitle}</h4>
                    <p className="text-gray-600 text-sm">{config.phoneInfo}</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 4.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"></path>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">{config.emailTitle}</h4>
                    <p className="text-gray-600 text-sm">{config.emailInfo}</p>
                  </div>

                  <div className="text-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mx-auto mb-3">
                      <svg className="w-6 h-6 text-amber-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                      </svg>
                    </div>
                    <h4 className="font-semibold text-gray-800 mb-1">{config.hoursTitle}</h4>
                    <p className="text-gray-600 text-sm">
                      {hoursLines.map((line, index) => (
                        <span key={index}>
                          {line}
                          {index < hoursLines.length - 1 && <br />}
                        </span>
                      ))}
                    </p>
                  </div>
                </div>
              </div>

              {/* Our Location - Google Map Section */}
              <div className="bg-white rounded-2xl shadow-lg p-8 my-8">
                <h3 className="text-3xl font-bold text-gray-800 mb-2 text-center">{config.mapTitle}</h3>
                <p className="text-gray-600 mb-4 text-lg">{config.mapDescription}</p>
                <div className="w-full h-64 md:h-80 rounded-xl overflow-hidden shadow-lg">
                  {config.mapEmbedCode ? (
                    (() => {
                      const iframeProps = createSafeMapIframe(extractGoogleMapsUrl(config.mapEmbedCode));
                      return iframeProps ? (
                        <iframe {...iframeProps} />
                      ) : (
                        <iframe
                          title="Our Location"
                          src="https://www.google.com/maps?q=123+Baker+Street,+Sweetville,+CA&output=embed"
                          width="100%"
                          height="100%"
                          style={{ border: 0, width: '100%', height: '100%', display: 'block', borderRadius: '0.75rem' }}
                          allowFullScreen=""
                          loading="lazy"
                          referrerPolicy="no-referrer-when-downgrade"
                        />
                      );
                    })()
                  ) : (
                    <iframe
                      title="Our Location"
                      src="https://www.google.com/maps?q=123+Baker+Street,+Sweetville,+CA&output=embed"
                      width="100%"
                      height="100%"
                      style={{ border: 0, width: '100%', height: '100%', display: 'block', borderRadius: '0.75rem' }}
                      allowFullScreen=""
                      loading="lazy"
                      referrerPolicy="no-referrer-when-downgrade"
                    />
                  )}
                </div>
              </div>

              {/* FAQ Section */}
              {config.faqs && config.faqs.length > 0 && (
                <div className="bg-gradient-to-r from-amber-500 to-orange-500 rounded-2xl p-8 text-white">
                  <h3 className="text-3xl font-bold mb-6 text-center">{config.faqTitle}</h3>
                  <div className="space-y-4">
                    {config.faqs.map((faq) => (
                      <div key={faq.id} className="bg-white/10 rounded-lg p-4 backdrop-blur-sm">
                        <button 
                          className="w-full text-left flex justify-between items-center font-semibold text-lg"
                          onClick={() => toggleFaq(faq.id)}
                        >
                          <span>{faq.question}</span>
                          <svg 
                            className={`w-5 h-5 transform transition-transform duration-200 ${
                              expandedFaqs.has(faq.id) ? 'rotate-180' : ''
                            }`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
                          </svg>
                        </button>
                        {expandedFaqs.has(faq.id) && (
                          <div className="mt-3 text-amber-100">
                            <p>{faq.answer}</p>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 