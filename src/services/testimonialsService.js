// Testimonials Service
// Handles fetching and processing testimonials data from Google Sheets
// Supports flexible parsing for testimonials with fallback to existing content

import { fetchSheetData, parseCSVLine } from './googleSheets.js';

// Cache for testimonials data
let testimonialsCache = null;
let testimonialsCacheTimestamp = null;
const TESTIMONIALS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
const MAX_CACHE_SIZE = 10 * 1024 * 1024; // 10MB limit for cache

/**
 * Validates cache size and clears if necessary
 */
const validateCacheSize = () => {
  if (testimonialsCache) {
    const cacheSize = JSON.stringify(testimonialsCache).length;
    if (cacheSize > MAX_CACHE_SIZE) {
      console.warn('Cache size exceeded limit, clearing cache');
      testimonialsCache = null;
      testimonialsCacheTimestamp = null;
    }
  }
};

/**
 * Parses CSV data for testimonials content including section headers and individual testimonials
 * @param {string} csvData - Raw CSV data
 * @param {Object} options - Parsing options
 * @returns {Object} - Object containing section data and testimonials data
 */
const parseTestimonialsCSV = (csvData, options = {}) => {
  try {
    // Validate input
    if (!csvData || typeof csvData !== 'string') {
      console.warn('Invalid CSV data provided to parseTestimonialsCSV');
      return { sectionData: {}, testimonialsData: [], bannerData: {} };
    }

    const { 
      sectionHeaders = ['Testimonial Small Title', 'Testimonial Black Title', 'Testimonial Orange Title', 'Testimonial Description'],
      testimonialHeaders = ['Testimonial Name', 'Testimonial Name Label', 'Testimonial Quote'],
      bannerHeaders = ['Testimonial Banner Title', 'Testimonial Banner Text Top', 'Testimonial Banner Text Bottom']
    } = options;
    
    // Split CSV into lines and remove empty lines
    const lines = csvData.trim().split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      console.warn('No data found in CSV');
      return { sectionData: {}, testimonialsData: [], bannerData: {} };
    }

    // Parse all lines
    const parsedLines = lines.map(line => parseCSVLine(line));
    
    // Validate CSV structure - ensure we have at least 2 columns
    const hasValidStructure = parsedLines.every(line => line.length >= 2);
    if (!hasValidStructure) {
      console.warn('CSV structure appears invalid - expected at least 2 columns');
    }
    
    // Initialize data containers
    const sectionData = {};
    const testimonialsData = [];
    const bannerData = {};
    
    parsedLines.forEach((line, lineIndex) => {
      const header = line[0]?.trim();
      
      // Skip empty headers
      if (!header) {
        return;
      }
      
      // Parse section data (titles and descriptions)
      if (sectionHeaders.some(sectionHeader => 
        header && header.toLowerCase().includes(sectionHeader.toLowerCase())
      )) {
        // Get the value from column 1 (second column)
        const value = line[1]?.trim();
        if (value && value !== '') {
          // Map header to internal field name
          let fieldName = header.toLowerCase().replace(/\s+/g, '_');
          sectionData[fieldName] = value;
        }
      }
      
      // Parse individual testimonials (Name1, Name2, Name3, etc.)
      if (testimonialHeaders.some(testimonialHeader => 
        header && header.toLowerCase().includes(testimonialHeader.toLowerCase())
      )) {
        // Extract testimonial number from header (e.g., "Testimonial Name1" -> 1)
        const testimonialNumber = header.match(/\d+/)?.[0];
        if (testimonialNumber) {
          const testimonialIndex = parseInt(testimonialNumber) - 1;
          
          // Validate testimonial index
          if (testimonialIndex < 0) {
            console.warn(`Invalid testimonial index: ${testimonialIndex} from header: ${header}`);
            return;
          }
          
          // Get the value from column 1 (second column)
          const value = line[1]?.trim();
          if (value && value !== '') {
            // Map header to internal field name (remove the number)
            let fieldName = header.toLowerCase().replace(/\d+/g, '').replace(/\s+/g, '_');
            
            console.log(`Parsing testimonial: Header="${header}", Number=${testimonialNumber}, Index=${testimonialIndex}, Field="${fieldName}", Value="${value}"`);
            
            // Ensure testimonialsData array has enough elements
            while (testimonialsData.length <= testimonialIndex) {
              testimonialsData.push({});
            }
            
            testimonialsData[testimonialIndex][fieldName] = value;
          }
        }
      }
      
      // Parse banner data
      if (bannerHeaders.some(bannerHeader => 
        header && header.toLowerCase().includes(bannerHeader.toLowerCase())
      )) {
        // Get the value from column 1 (second column)
        const value = line[1]?.trim();
        if (value && value !== '') {
          // Map header to internal field name
          let fieldName = header.toLowerCase().replace(/\s+/g, '_');
          bannerData[fieldName] = value;
        }
      }
    });

    return {
      sectionData,
      testimonialsData,
      bannerData
    };
  } catch (error) {
    console.error('Error parsing testimonials CSV:', error);
    return { sectionData: {}, testimonialsData: [], bannerData: {} };
  }
};

/**
 * Transforms testimonials data into the format expected by the Testimonials component
 * @param {Array} testimonialsData - Raw testimonials data from CSV
 * @returns {Array} - Formatted testimonials for component
 */
const transformTestimonialsData = (testimonialsData) => {
  return testimonialsData
    .filter(testimonial => testimonial.testimonial_name && testimonial.testimonial_quote)
    .map((testimonial, index) => ({
      name: testimonial.testimonial_name || `Customer ${index + 1}`,
      role: testimonial.testimonial_name_label || 'Happy Customer',
      content: testimonial.testimonial_quote || 'Great service and delicious food!',
      rating: 5 // Default rating
    }));
};

/**
 * Returns default testimonials configuration using existing fallback content
 * @returns {Object} - Default testimonials configuration
 */
const getDefaultTestimonialsConfig = () => {
  return {
    sectionData: {
      testimonial_small_title: 'Testimonials',
      testimonial_black_title: 'What Our',
      testimonial_orange_title: 'Customers Say',
      testimonial_description: "Don't just take our word for it - hear from our satisfied customers who have experienced our delicious baked goods and exceptional service."
    },
    testimonialsData: [
      {
        name: "Sarah Johnson",
        role: "Wedding Client",
        content: "The wedding cake was absolutely stunning! Not only did it look perfect, but it tasted incredible. Our guests couldn't stop raving about it. Thank you for making our special day even more memorable!",
        rating: 5
      },
      {
        name: "Michael Chen",
        role: "Regular Customer",
        content: "I've been coming here for their sourdough bread for over 2 years now. It's consistently amazing - crispy crust, perfect texture, and that authentic sourdough flavor. Best bakery in town!",
        rating: 5
      },
      {
        name: "Emily Rodriguez",
        role: "Birthday Party Host",
        content: "Ordered cupcakes for my daughter's birthday party and they were a huge hit! The decorations were beautiful and the flavors were delicious. The kids loved them and so did the adults!",
        rating: 5
      }
    ],
    bannerData: {
      testimonial_banner_title: 'Overall Rating',
      testimonial_banner_text_top: '4.9 out of 5 stars',
      testimonial_banner_text_bottom: 'Based on 500+ customer reviews'
    }
  };
};

/**
 * Fetches testimonials data from Google Sheets
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - Object containing section data, testimonials data, and banner data
 */
export const getTestimonialsData = async (options = {}) => {
  try {
    // Check cache first
    const now = Date.now();
    if (testimonialsCache && testimonialsCacheTimestamp && (now - testimonialsCacheTimestamp) < TESTIMONIALS_CACHE_DURATION) {
      console.log('Returning cached testimonials data');
      return testimonialsCache;
    }

    // Get the sheet URL - use the same sheet as other sections
    const { getSheetUrl } = await import('./sheetConfig.js');
    const url = getSheetUrl('TESTIMONIALS'); // Using TESTIMONIALS sheet
    
    // Validate URL
    if (!url) {
      console.warn('No sheet URL configured for testimonials');
      return getDefaultTestimonialsConfig();
    }
    
    if (url.includes('YOUR_') || url.includes('placeholder')) {
      console.warn('Sheet URL appears to be a placeholder');
      return getDefaultTestimonialsConfig();
    }

    // Fetch raw CSV data
    const csvData = await fetchSheetData(url);
    
    // Validate CSV data
    if (!csvData || typeof csvData !== 'string') {
      console.warn('Invalid CSV data received from sheet');
      return getDefaultTestimonialsConfig();
    }
    
    // Parse using comprehensive parser
    const { sectionData, testimonialsData, bannerData } = parseTestimonialsCSV(csvData, options);
    
    // Transform testimonials data
    const transformedTestimonials = transformTestimonialsData(testimonialsData);
    
    console.log('Raw testimonials data from CSV:', testimonialsData);
    console.log('Transformed testimonials:', transformedTestimonials);
    
    const result = {
      sectionData: sectionData || getDefaultTestimonialsConfig().sectionData,
      testimonialsData: transformedTestimonials.length > 0 ? transformedTestimonials : getDefaultTestimonialsConfig().testimonialsData,
      bannerData: bannerData || getDefaultTestimonialsConfig().bannerData
    };
    
    // Cache the result
    validateCacheSize(); // Check cache size before storing
    testimonialsCache = result;
    testimonialsCacheTimestamp = now;
    
    return result;
  } catch (error) {
    console.error('Error fetching testimonials data:', error);
    
    // Use cached data if available, even if expired
    if (testimonialsCache) {
      console.log('Using expired cached data due to error');
      return testimonialsCache;
    }
    
    // Return default configuration on error
    console.log('Using default testimonials configuration due to error');
    return getDefaultTestimonialsConfig();
  }
};

/**
 * Refreshes testimonials data (clears cache and fetches fresh data)
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - Fresh testimonials data
 */
export const refreshTestimonialsData = async (options = {}) => {
  try {
    console.log('Refreshing testimonials data...');
    
    // Clear cache
    testimonialsCache = null;
    testimonialsCacheTimestamp = null;
    
    // Fetch fresh data
    const freshData = await getTestimonialsData(options);
    
    console.log('Testimonials data refreshed successfully');
    return freshData;
  } catch (error) {
    console.error('Error refreshing testimonials data:', error);
    
    // Return default configuration on error
    console.log('Using default testimonials configuration due to refresh error');
    return getDefaultTestimonialsConfig();
  }
};
