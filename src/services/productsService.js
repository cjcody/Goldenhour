// Products Service
// Handles fetching and processing products carousel data from Google Sheets
// Supports flexible parsing for carousel items that can span multiple columns

import { fetchSheetData } from './googleSheets.js';

// Cache for products data
let productsCache = null;
let productsCacheTimestamp = null;
const PRODUCTS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Parses a single CSV line, properly handling quoted fields with commas
 * @param {string} line - CSV line to parse
 * @returns {Array} - Array of field values
 */
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      if (inQuotes && line[i + 1] === '"') {
        // Escaped quote
        current += '"';
        i++; // Skip next quote
      } else {
        // Toggle quote state
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      // End of field
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  // Add the last field
  result.push(current.trim());
  
  return result;
};

/**
 * Parses CSV data for all products-related content including carousel, titles, and special offer
 * @param {string} csvData - Raw CSV data
 * @param {Object} options - Parsing options
 * @returns {Object} - Object containing carousel items, section data, and special offer data
 */
const parseProductsCSV = (csvData, options = {}) => {
  try {
    const { 
      carouselHeaders = ['Product Slide Badge', 'Product Slide Image', 'Product Slide Title', 'Product Slide Description'],
      sectionHeaders = ['Products Small Title', 'Products Black Title', 'Products Orange Title', 'Products Description'],
      specialOfferHeaders = ['Special Offer Title', 'Special Offer Description', 'Special Offer Button Text', 'Special Offer Button Link']
    } = options;
    
    // Split CSV into lines and remove empty lines
    const lines = csvData.trim().split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return { carouselItems: [], sectionData: {}, specialOfferData: {} };
    }

    console.log('Products CSV lines:', lines); // Debug log

    // Parse all lines
    const parsedLines = lines.map(line => parseCSVLine(line));
    
    // Initialize data containers
    const carouselData = {};
    const sectionData = {};
    const specialOfferData = {};
    
    parsedLines.forEach((line, lineIndex) => {
      const header = line[0]?.trim();
      
      // Parse carousel data
      if (carouselHeaders.some(carouselHeader => 
        header && header.toLowerCase().includes(carouselHeader.toLowerCase())
      )) {
        // This is a carousel section - read all columns to the right
        // Start from column 1 (skip the header column)
        for (let colIndex = 1; colIndex < line.length; colIndex++) {
          const value = line[colIndex]?.trim();
          
          if (value && value !== '') {
            // Map the header to internal field names
            let fieldName = header.toLowerCase().replace(/\s+/g, '_');
            
            // Special mapping for the specific headers
            if (header === 'Product Slide Badge') fieldName = 'badge_title';
            else if (header === 'Product Slide Title') fieldName = 'main_title';
            else if (header === 'Product Slide Description') fieldName = 'description';
            else if (header === 'Product Slide Image') fieldName = 'image';
            
            // Store data by column index (each column is a carousel item)
            if (!carouselData[colIndex]) {
              carouselData[colIndex] = {};
            }
            carouselData[colIndex][fieldName] = value;
          }
        }
      }
      
      // Parse section data (titles and descriptions above carousel)
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
      
      // Parse special offer data
      if (specialOfferHeaders.some(offerHeader => 
        header && header.toLowerCase().includes(offerHeader.toLowerCase())
      )) {
        // Get the value from column 1 (second column)
        const value = line[1]?.trim();
        if (value && value !== '') {
          // Map header to internal field name
          let fieldName = header.toLowerCase().replace(/\s+/g, '_');
          specialOfferData[fieldName] = value;
        }
      }
    });

    // Convert the collected carousel data into carousel items
    const carouselItems = Object.keys(carouselData).map(colIndex => ({
      header: `Carousel Item ${colIndex}`,
      data: carouselData[colIndex],
      lineIndex: parseInt(colIndex),
      columnIndex: parseInt(colIndex)
    }));

    console.log('Found carousel items:', carouselItems);
    console.log('Found section data:', sectionData);
    console.log('Found special offer data:', specialOfferData);
    
    return {
      carouselItems,
      sectionData,
      specialOfferData
    };
  } catch (error) {
    console.error('Error parsing products CSV:', error);
    return { carouselItems: [], sectionData: {}, specialOfferData: {} };
  }
};

/**
 * Transforms carousel items into the format expected by the Products component
 * @param {Array} carouselItems - Raw carousel items from CSV
 * @param {Object} options - Transformation options
 * @returns {Array} - Formatted product categories for carousel
 */
const transformCarouselData = (carouselItems, options = {}) => {
  const { 
    defaultBadgeTitle = 'Category',
    defaultMainTitle = 'Category',
    defaultDescription = 'Description coming soon...',
    defaultImage = '',
    fieldMapping = {
      badgeTitle: ['badge_title', 'badge', 'category'],
      mainTitle: ['main_title', 'title', 'name'],
      description: ['description', 'desc', 'details'],
      image: ['image', 'image_url', 'photo', 'photo_url']
    }
  } = options;

  return carouselItems.map((item, index) => {
    const data = item.data;
    
    // Helper function to find the best matching field
    const findField = (fieldNames) => {
      for (const fieldName of fieldNames) {
        if (data[fieldName]) {
          return data[fieldName];
        }
      }
      return null;
    };
    
    // Extract values using flexible field mapping
    const badgeTitle = findField(fieldMapping.badgeTitle) || 
                      data.badge_title || 
                      data.column_1 || 
                      defaultBadgeTitle;
    
    const mainTitle = findField(fieldMapping.mainTitle) || 
                     data.main_title || 
                     data.column_2 || 
                     data.column_1 || 
                     defaultMainTitle;
    
    const description = findField(fieldMapping.description) || 
                       data.description || 
                       data.column_3 || 
                       data.column_4 || 
                       defaultDescription;
    
    const image = findField(fieldMapping.image) || 
                  data.image || 
                  data.column_5 || 
                  data.column_6 || 
                  defaultImage;
    
    return {
      badgeTitle: badgeTitle,
      mainTitle: mainTitle,
      description: description,
      image: image
    };
  });
};

/**
 * Returns default products configuration when Google Sheets is unavailable
 * @returns {Array} - Default product categories
 */
const getDefaultProductsConfig = () => {
  return [
    {
      badgeTitle: "Artisan Breads",
      mainTitle: "Artisan Breads",
      description: "Freshly baked daily with traditional techniques",
      image: "/images/artisan-breads.jpg",
    },
    {
      badgeTitle: "Pastries",
      mainTitle: "Pastries",
      description: "Delicate pastries made with premium butter",
      image: "/images/pastries.jpg",
    },
    {
      badgeTitle: "Custom Cakes",
      mainTitle: "Custom Cakes",
      description: "Personalized cakes for every celebration",
      image: "/images/custom-cakes.jpg",
    }
  ];
};

/**
 * Returns default section data when Google Sheets is unavailable
 * @returns {Object} - Default section configuration
 */
const getDefaultSectionData = () => {
  return {
    products_small_title: 'Our Menu',
    products_black_title: 'Fresh from the',
    products_orange_title: 'Oven',
    products_description: 'Discover our selection of handcrafted baked goods, each made with the finest ingredients and traditional baking methods.'
  };
};

/**
 * Returns default special offer data when Google Sheets is unavailable
 * @returns {Object} - Default special offer configuration
 */
const getDefaultSpecialOfferData = () => {
  return {
    special_offer_title: 'Special Offer',
    special_offer_description: 'Order 6 or more items and get 15% off!',
    special_offer_button_text: 'View Full Menu',
    special_offer_button_link: '/menu'
  };
};

/**
 * Fetches all products data from Google Sheets including carousel, titles, and special offer
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - Object containing carousel items, section data, and special offer data
 */
export const getProductsData = async (options = {}) => {
  try {
    // Check cache first
    const now = Date.now();
    if (productsCache && productsCacheTimestamp && (now - productsCacheTimestamp) < PRODUCTS_CACHE_DURATION) {
      console.log('Using cached products data');
      return productsCache;
    }

    console.log('Fetching fresh products data');
    
    // Get the sheet URL - use the new PRODUCTS sheet
    const { getSheetUrl } = await import('./sheetConfig.js');
    const url = getSheetUrl('PRODUCTS'); // Using PRODUCTS sheet
    
    if (!url || url.includes('YOUR_')) {
      console.log('No URL configured for products sheet, using default config');
      return {
        carouselItems: getDefaultProductsConfig(),
        sectionData: getDefaultSectionData(),
        specialOfferData: getDefaultSpecialOfferData()
      };
    }

    // Fetch raw CSV data
    const csvData = await fetchSheetData(url);
    
    // Parse using comprehensive parser
    const { carouselItems, sectionData, specialOfferData } = parseProductsCSV(csvData, options);
    
    if (!carouselItems || carouselItems.length === 0) {
      console.log('No products carousel data found in Google Sheets, using default config');
      return {
        carouselItems: getDefaultProductsConfig(),
        sectionData: sectionData || getDefaultSectionData(),
        specialOfferData: specialOfferData || getDefaultSpecialOfferData()
      };
    }

    // Transform carousel data into expected format
    const transformedCarouselItems = transformCarouselData(carouselItems, options);
    
    // Debug logging to see what data we have
    console.log('Transformed products data:', transformedCarouselItems);
    
    // If transformation resulted in empty or invalid data, use defaults
    if (!transformedCarouselItems || transformedCarouselItems.length === 0) {
      console.log('Transformation resulted in empty data, using default config');
      return {
        carouselItems: getDefaultProductsConfig(),
        sectionData: sectionData || getDefaultSectionData(),
        specialOfferData: specialOfferData || getDefaultSpecialOfferData()
      };
    }
    
    const result = {
      carouselItems: transformedCarouselItems,
      sectionData: sectionData || getDefaultSectionData(),
      specialOfferData: specialOfferData || getDefaultSpecialOfferData()
    };
    
    // Cache the result
    productsCache = result;
    productsCacheTimestamp = now;
    
    return result;
  } catch (error) {
    console.error('Error fetching products data:', error);
    
    // Use cached data if available, even if expired
    if (productsCache) {
      console.log('Using expired products cache due to error');
      return productsCache;
    }
    
    // Return default configuration on error
    console.log('Using default products config due to error');
    return {
      carouselItems: getDefaultProductsConfig(),
      sectionData: getDefaultSectionData(),
      specialOfferData: getDefaultSpecialOfferData()
    };
  }
};

/**
 * Refreshes products data (clears cache and fetches fresh data)
 * @param {Object} options - Configuration options
 * @returns {Promise<Object>} - Fresh products data
 */
export const refreshProductsData = async (options = {}) => {
  try {
    console.log('Refreshing products data');
    
    // Clear cache
    productsCache = null;
    productsCacheTimestamp = null;
    
    return await getProductsData(options);
  } catch (error) {
    console.error('Error refreshing products data:', error);
    return {
      carouselItems: getDefaultProductsConfig(),
      sectionData: getDefaultSectionData(),
      specialOfferData: getDefaultSpecialOfferData()
    };
  }
};

/**
 * Helper function to get products data with specific carousel headers
 * @param {Array} carouselHeaders - Headers to look for in the sheet
 * @returns {Promise<Object>} - Products data
 */
export const getProductsByHeaders = async (carouselHeaders = ['Product Slide Badge']) => {
  return await getProductsData({
    carouselHeaders: carouselHeaders,
    columnMapping: {
      'Product Slide Badge': 'badge_title',
      'Product Slide Title': 'main_title',
      'Product Slide Description': 'description',
      'Product Slide Image': 'image'
    }
  });
}; 