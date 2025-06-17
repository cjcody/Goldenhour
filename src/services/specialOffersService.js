// Special Offers Service
// Handles fetching and processing menu hero and special offers data from Google Sheets

import { fetchSheetData } from './googleSheets.js';

// Cache for special offers data
let specialOffersCache = null;
let specialOffersCacheTimestamp = null;
const SPECIAL_OFFERS_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Parses CSV data specifically for special offers configuration
 * @param {string} csvData - Raw CSV data
 * @returns {Object} - Parsed special offers configuration object
 */
const parseSpecialOffersCSV = (csvData) => {
  try {
    // Split CSV into lines and remove empty lines
    const lines = csvData.trim().split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return {};
    }

    console.log('Special Offers CSV lines:', lines); // Debug log

    // Parse each line manually for column-based structure
    const config = {};
    
    lines.forEach((line, index) => {
      // Split by comma, but handle quoted values
      const values = parseCSVLine(line);
      console.log(`Special Offers line ${index}:`, values); // Debug log
      
      if (values.length >= 2) {
        const header = values[0]?.trim();
        const value = values[1]?.trim();
        
        if (header && value !== undefined) {
          config[header] = value;
        }
      }
    });

    console.log('Final special offers config object:', config); // Debug log
    return config;
  } catch (error) {
    console.error('Error parsing special offers CSV:', error);
    return {};
  }
};

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
 * Transforms raw sheet data into organized special offers configuration
 * @param {Object} rawData - Raw data from Google Sheets (already parsed as object)
 * @returns {Object} - Organized special offers configuration
 */
const transformSpecialOffersData = (rawData) => {
  console.log('Raw special offers data from Google Sheets:', rawData); // Debug log

  // Build special offers array dynamically
  const specialOffers = [];
  for (let i = 1; i <= 3; i++) {
    const offer = {
      title: rawData[`Menu Offer${i} Title`] || '',
      description: rawData[`Menu Offer${i} Description`] || '',
      buttonText: rawData[`Menu Offer${i} Button Text`] || 'Learn More',
      buttonLink: rawData[`Menu Offer${i} Button Link`] || '#'
    };
    
    // Only add if title exists (client has content)
    if (offer.title && offer.title.trim()) {
      specialOffers.push(offer);
    }
  }

  return {
    // Menu Hero Section
    heroImageDesktop: rawData['Menu Hero Desktop Image'] || '',
    heroImageMobile: rawData['Menu Hero Mobile Image'] || '',
    heroTitleBlack: rawData['Menu Hero Title Black'] || 'Fresh from the',
    heroTitleOrange: rawData['Menu Hero Title Orange'] || 'Oven',
    heroPhrase: rawData['Menu Hero Phrase'] || 'Discover our complete selection',
    bannerTitle: rawData['Menu Bottom Banner Title'] || 'Special Offers',
    
    // Special Offers Section
    specialOffers: specialOffers
  };
};

/**
 * Returns default special offers configuration when Google Sheets is unavailable
 * @returns {Object} - Default special offers configuration
 */
const getDefaultSpecialOffersConfig = () => {
  return {
    // Menu Hero Section
    heroImageDesktop: '',
    heroImageMobile: '',
    heroTitleBlack: 'Fresh from the',
    heroTitleOrange: 'Oven',
    heroPhrase: 'Discover our complete selection',
    bannerTitle: 'Special Offers',
    
    // Special Offers Section
    specialOffers: [
      {
        title: 'Bulk Discount',
        description: 'Order 6 or more items and get 15% off!',
        buttonText: 'Learn More',
        buttonLink: '#'
      },
      {
        title: 'Wedding Package',
        description: 'Complete wedding cake package with consultation',
        buttonText: 'Get Quote',
        buttonLink: '#'
      },
      {
        title: 'Daily Special',
        description: 'Fresh bread and pastries at 20% off after 4PM',
        buttonText: 'View Today\'s',
        buttonLink: '#'
      }
    ]
  };
};

/**
 * Fetches special offers configuration data from Google Sheets
 * @returns {Promise<Object>} - Special offers configuration object
 */
export const getSpecialOffersConfig = async () => {
  try {
    // Check cache first
    const now = Date.now();
    if (specialOffersCache && specialOffersCacheTimestamp && (now - specialOffersCacheTimestamp) < SPECIAL_OFFERS_CACHE_DURATION) {
      console.log('Using cached special offers configuration');
      return specialOffersCache;
    }

    const { getSheetUrl } = await import('./sheetConfig.js');
    const url = getSheetUrl('SPECIAL_OFFERS');
    
    console.log('SPECIAL_OFFERS SERVICE: Special offers sheet URL:', url); // More specific debug log
    
    if (!url || url === 'YOUR_SPECIAL_OFFERS_SHEET_CSV_URL_HERE') {
      console.log('SPECIAL_OFFERS SERVICE: No URL configured for SPECIAL_OFFERS sheet, using default config');
      return getDefaultSpecialOffersConfig();
    }

    console.log('SPECIAL_OFFERS SERVICE: Fetching special offers config from:', url); // More specific debug log

    // Fetch raw CSV data
    const csvData = await fetchSheetData(url);
    console.log('SPECIAL_OFFERS SERVICE: Raw special offers CSV data:', csvData.substring(0, 200) + '...'); // More specific debug log
    
    // Parse using dedicated special offers config parser
    const rawData = parseSpecialOffersCSV(csvData);
    console.log('SPECIAL_OFFERS SERVICE: Parsed special offers raw data:', rawData); // More specific debug log
    
    if (!rawData || Object.keys(rawData).length === 0) {
      console.log('SPECIAL_OFFERS SERVICE: No special offers configuration found in Google Sheets');
      return getDefaultSpecialOffersConfig();
    }

    // Transform raw data into organized configuration object
    const specialOffersConfig = transformSpecialOffersData(rawData);
    console.log('SPECIAL_OFFERS SERVICE: Final special offers config:', specialOffersConfig); // More specific debug log
    
    // Cache the result
    specialOffersCache = specialOffersConfig;
    specialOffersCacheTimestamp = now;
    
    return specialOffersConfig;
  } catch (error) {
    console.error('SPECIAL_OFFERS SERVICE: Error fetching special offers configuration:', error);
    
    // Use cached data if available, even if expired
    if (specialOffersCache) {
      console.log('SPECIAL_OFFERS SERVICE: Using expired special offers cache due to error');
      return specialOffersCache;
    }
    
    // Return default configuration on error
    return getDefaultSpecialOffersConfig();
  }
};

/**
 * Refreshes special offers configuration (clears cache and fetches fresh data)
 * @returns {Promise<Object>} - Fresh special offers configuration
 */
export const refreshSpecialOffersConfig = async () => {
  try {
    console.log('SPECIAL_OFFERS SERVICE: Refreshing special offers configuration');
    
    // Clear cache
    specialOffersCache = null;
    specialOffersCacheTimestamp = null;
    
    return await getSpecialOffersConfig();
  } catch (error) {
    console.error('SPECIAL_OFFERS SERVICE: Error refreshing special offers configuration:', error);
    return getDefaultSpecialOffersConfig();
  }
}; 