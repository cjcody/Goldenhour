// Custom Order Service
// Handles fetching and processing custom order page data from Google Sheets

import { fetchSheetData } from './googleSheets.js';

// Cache for custom order data
let customOrderCache = null;
let customOrderCacheTimestamp = null;
const CUSTOM_ORDER_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Parses CSV data specifically for custom order configuration
 * @param {string} csvData - Raw CSV data
 * @returns {Object} - Parsed custom order configuration object
 */
const parseCustomOrderCSV = (csvData) => {
  try {
    // Split CSV into lines and remove empty lines
    const lines = csvData.trim().split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return {};
    }

    console.log('Custom Order CSV lines:', lines); // Debug log

    // Parse each line manually for column-based structure
    const config = {};
    
    lines.forEach((line, index) => {
      // Split by comma, but handle quoted values
      const values = parseCSVLine(line);
      console.log(`Custom Order line ${index}:`, values); // Debug log
      
      if (values.length >= 2) {
        const header = values[0]?.trim();
        const value = values[1]?.trim();
        
        if (header && value !== undefined) {
          config[header] = value;
        }
      }
    });

    console.log('Final custom order config object:', config); // Debug log
    return config;
  } catch (error) {
    console.error('Error parsing custom order CSV:', error);
    return {};
  }
};

/**
 * Helper function to parse CSV lines while handling quoted values
 * @param {string} line - CSV line to parse
 * @returns {Array} - Array of values
 */
const parseCSVLine = (line) => {
  const values = [];
  let current = '';
  let inQuotes = false;
  
  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === ',' && !inQuotes) {
      values.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }
  
  values.push(current.trim());
  return values;
};

/**
 * Transforms raw sheet data into organized custom order configuration
 * @param {Object} rawData - Raw data from Google Sheets (already parsed as object)
 * @returns {Object} - Organized custom order configuration
 */
const transformCustomOrderData = (rawData) => {
  console.log('Raw custom order data from Google Sheets:', rawData); // Debug log

  return {
    // Hero Section
    heroImageDesktop: rawData['Form Page Hero Desktop Image'] || '',
    heroImageMobile: rawData['Form Page Hero Mobile Image'] || '',
    heroTitleBlack: rawData['Form Page Hero Title Black'] || 'Request a',
    heroTitleOrange: rawData['Form Page Hero Title Orange'] || 'Custom Order',
    heroPhrase: rawData['Form Page Hero Phrase'] || 'Let us know your vision',
    
    // Google Apps Script URL
    googleAppsScriptUrl: rawData['Google Apps Script url'] || ''
  };
};

/**
 * Returns default custom order configuration when Google Sheets is unavailable
 * @returns {Object} - Default custom order configuration
 */
const getDefaultCustomOrderConfig = () => {
  return {
    // Hero Section
    heroImageDesktop: '',
    heroImageMobile: '',
    heroTitleBlack: 'Request a',
    heroTitleOrange: 'Custom Order',
    heroPhrase: 'Let us know your vision',
    
    // Google Apps Script URL
    googleAppsScriptUrl: ''
  };
};

/**
 * Fetches custom order configuration data from Google Sheets
 * @returns {Promise<Object>} - Custom order configuration object
 */
export const getCustomOrderConfig = async () => {
  try {
    // Check cache first
    const now = Date.now();
    if (customOrderCache && customOrderCacheTimestamp && (now - customOrderCacheTimestamp) < CUSTOM_ORDER_CACHE_DURATION) {
      console.log('Using cached custom order configuration');
      return customOrderCache;
    }

    const { getSheetUrl } = await import('./sheetConfig.js');
    const url = getSheetUrl('CUSTOM_ORDER');
    
    if (!url || url === 'YOUR_CUSTOM_ORDER_SHEET_CSV_URL_HERE') {
      console.log('No URL configured for CUSTOM_ORDER sheet, using default config');
      return getDefaultCustomOrderConfig();
    }

    console.log('Fetching custom order config from:', url); // Debug log

    // Fetch raw CSV data
    const csvData = await fetchSheetData(url);
    console.log('Raw custom order CSV data:', csvData.substring(0, 200) + '...'); // Debug log
    
    // Parse using dedicated custom order config parser
    const rawData = parseCustomOrderCSV(csvData);
    console.log('Parsed custom order raw data:', rawData); // Debug log
    
    if (!rawData || Object.keys(rawData).length === 0) {
      console.log('No custom order configuration found in Google Sheets');
      return getDefaultCustomOrderConfig();
    }

    // Transform raw data into organized configuration object
    const customOrderConfig = transformCustomOrderData(rawData);
    
    // Cache the result
    customOrderCache = customOrderConfig;
    customOrderCacheTimestamp = now;
    
    return customOrderConfig;
  } catch (error) {
    console.error('Error fetching custom order configuration:', error);
    
    // Use cached data if available, even if expired
    if (customOrderCache) {
      console.log('Using expired custom order cache due to error');
      return customOrderCache;
    }
    
    // Return default configuration on error
    return getDefaultCustomOrderConfig();
  }
}; 