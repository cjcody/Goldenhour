// Hero Service
// Handles fetching and processing hero section data from Google Sheets

import { fetchSheetData } from './googleSheets.js';

// Cache for hero data
let heroCache = null;
let heroCacheTimestamp = null;
const HERO_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Parses CSV data specifically for hero configuration
 * @param {string} csvData - Raw CSV data
 * @returns {Object} - Parsed hero configuration object
 */
const parseHeroCSV = (csvData) => {
  try {
    // Split CSV into lines and remove empty lines
    const lines = csvData.trim().split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return {};
    }

    console.log('Hero CSV lines:', lines); // Debug log

    // Parse each line manually for column-based structure
    const config = {};
    
    lines.forEach((line, index) => {
      // Split by comma, but handle quoted values
      const values = parseCSVLine(line);
      console.log(`Hero line ${index}:`, values); // Debug log
      
      if (values.length >= 2) {
        const header = values[0]?.trim();
        const value = values[1]?.trim();
        
        if (header && value !== undefined) {
          config[header] = value;
        }
      }
    });

    console.log('Final hero config object:', config); // Debug log
    return config;
  } catch (error) {
    console.error('Error parsing hero CSV:', error);
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
 * Transforms raw sheet data into organized hero configuration
 * @param {Object} rawData - Raw data from Google Sheets (already parsed as object)
 * @returns {Object} - Organized hero configuration
 */
const transformHeroData = (rawData) => {
  console.log('Raw hero data from Google Sheets:', rawData); // Debug log

  return {
    heroImageDesktop: rawData['Home Hero Desktop Image'] || '',
    heroImageMobile: rawData['Home Hero Mobile Image'] || '',
    titleBlack: rawData['Home Hero Title Black'] || 'Artisanal',
    titleOrange: rawData['Home Hero Title Orange'] || 'Baking',
    phrase: rawData['Home Hero Phrase'] || 'Made with Love',
    buttonText: rawData['Home Hero Button Text'] || 'View Menu',
    buttonLink: rawData['Home Hero Button Link'] || '/menu'
  };
};

/**
 * Returns default hero configuration when Google Sheets is unavailable
 * @returns {Object} - Default hero configuration
 */
const getDefaultHeroConfig = () => {
  return {
    heroImage: '',
    titleBlack: 'Artisanal',
    titleOrange: 'Baking',
    phrase: 'Made with Love',
    buttonText: 'View Menu',
    buttonLink: '/menu'
  };
};

/**
 * Fetches hero configuration data from Google Sheets
 * @returns {Promise<Object>} - Hero configuration object
 */
export const getHeroConfig = async () => {
  try {
    // Check cache first
    const now = Date.now();
    if (heroCache && heroCacheTimestamp && (now - heroCacheTimestamp) < HERO_CACHE_DURATION) {
      console.log('Using cached hero configuration');
      return heroCache;
    }

    const { getSheetUrl } = await import('./sheetConfig.js');
    const url = getSheetUrl('HERO');
    
    if (!url || url === 'YOUR_HERO_SHEET_CSV_URL_HERE') {
      console.log('No URL configured for HERO sheet, using default config');
      return getDefaultHeroConfig();
    }

    console.log('Fetching hero config from:', url); // Debug log

    // Fetch raw CSV data
    const csvData = await fetchSheetData(url);
    console.log('Raw hero CSV data:', csvData.substring(0, 200) + '...'); // Debug log
    
    // Parse using dedicated hero config parser
    const rawData = parseHeroCSV(csvData);
    console.log('Parsed hero raw data:', rawData); // Debug log
    
    if (!rawData || Object.keys(rawData).length === 0) {
      console.log('No hero configuration found in Google Sheets');
      return getDefaultHeroConfig();
    }

    // Transform raw data into organized configuration object
    const heroConfig = transformHeroData(rawData);
    
    // Cache the result
    heroCache = heroConfig;
    heroCacheTimestamp = now;
    
    return heroConfig;
  } catch (error) {
    console.error('Error fetching hero configuration:', error);
    
    // Use cached data if available, even if expired
    if (heroCache) {
      console.log('Using expired hero cache due to error');
      return heroCache;
    }
    
    // Return default configuration on error
    return getDefaultHeroConfig();
  }
};

/**
 * Refreshes hero configuration (clears cache and fetches fresh data)
 * @returns {Promise<Object>} - Fresh hero configuration
 */
export const refreshHeroConfig = async () => {
  try {
    console.log('Refreshing hero configuration');
    
    // Clear cache
    heroCache = null;
    heroCacheTimestamp = null;
    
    return await getHeroConfig();
  } catch (error) {
    console.error('Error refreshing hero configuration:', error);
    return getDefaultHeroConfig();
  }
}; 