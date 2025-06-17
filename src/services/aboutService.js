// About Service
// Handles fetching and processing about page data from Google Sheets

import { fetchSheetData } from './googleSheets.js';

// Cache for about data
let aboutCache = null;
let aboutCacheTimestamp = null;
const ABOUT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Parses CSV data specifically for about page configuration
 * @param {string} csvData - Raw CSV data
 * @returns {Object} - Parsed about configuration object
 */
const parseAboutCSV = (csvData) => {
  try {
    // Split CSV into lines and remove empty lines
    const lines = csvData.trim().split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return {};
    }

    console.log('About CSV lines:', lines); // Debug log

    // Parse each line manually for column-based structure
    const config = {};
    
    lines.forEach((line, index) => {
      // Split by comma, but handle quoted values
      const values = parseCSVLine(line);
      console.log(`About line ${index}:`, values); // Debug log
      
      if (values.length >= 2) {
        const header = values[0]?.trim();
        const value = values[1]?.trim();
        
        if (header && value !== undefined) {
          config[header] = value;
        }
      }
    });

    console.log('Final about config object:', config); // Debug log
    return config;
  } catch (error) {
    console.error('Error parsing about CSV:', error);
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
 * Transforms raw sheet data into organized about configuration
 * @param {Object} rawData - Raw data from Google Sheets (already parsed as object)
 * @returns {Object} - Organized about configuration
 */
const transformAboutData = (rawData) => {
  console.log('Raw about data from Google Sheets:', rawData); // Debug log

  return {
    // Hero Section
    heroImageDesktop: rawData['About Hero Desktop Image'] || '',
    heroImageMobile: rawData['About Hero Mobile Image'] || '',
    heroTitleBlack: rawData['About Hero Black Title'] || 'Our Baking',
    heroTitleOrange: rawData['About Hero Orange Title'] || 'Story',
    heroPhrase: rawData['About Hero Phrase'] || 'Discover the passion',
    
    // Intro Section
    introTitle: rawData['About Intro Title'] || 'A Family Tradition',
    introDescription: rawData['About Intro Description'] || 'Our journey began in a small kitchen with a big dream. What started as a grandmother\'s secret recipes has grown into a beloved local bakery, but our commitment to quality and personal touch remains unchanged.',
    introDescription2: rawData['About Intro Description2'] || 'Every recipe is a family treasure, every ingredient carefully selected, and every creation made with the same love and attention to detail that we put into our very first batch.',
    introImage: rawData['About Intro Image'] || '',
    
    // Values Section
    valuesTitle: rawData['About Values Title'] || 'Our Values',
    value1Title: rawData['About Value1 Title'] || 'Quality First',
    value1Description: rawData['About Value1 Description'] || 'We use only the finest ingredients and traditional baking methods to ensure every product meets our high standards.',
    value2Title: rawData['About Value2 Title'] || 'Made with Love',
    value2Description: rawData['About Value2 Description'] || 'Every creation is crafted with passion, care, and the same love that goes into baking for our own family.',
    value3Title: rawData['About Value3 Title'] || 'Community Focused',
    value3Description: rawData['About Value3 Description'] || 'We\'re proud to be part of our local community and love creating special moments for our neighbors and friends.',
    
    // Banner Section
    bannerTitle: rawData['About Banner Title'] || 'Our Journey in Numbers',
    bannerStat1Title: rawData['About Banner Stat1 Title'] || '10+',
    bannerStat1Description: rawData['About Banner Stat1 Description'] || 'Years Experience',
    bannerStat2Title: rawData['About Banner Stat2 Title'] || '500+',
    bannerStat2Description: rawData['About Banner Stat2 Description'] || 'Happy Customers',
    bannerStat3Title: rawData['About Banner Stat3 Title'] || '50+',
    bannerStat3Description: rawData['About Banner Stat3 Description'] || 'Unique Recipes',
    bannerStat4Title: rawData['About Banner Stat4 Title'] || '1000+',
    bannerStat4Description: rawData['About Banner Stat4 Description'] || 'Cakes Baked'
  };
};

/**
 * Returns default about configuration when Google Sheets is unavailable
 * @returns {Object} - Default about configuration
 */
const getDefaultAboutConfig = () => {
  return {
    // Hero Section
    heroImageDesktop: '',
    heroImageMobile: '',
    heroTitleBlack: 'Our Baking',
    heroTitleOrange: 'Story',
    heroPhrase: 'Discover the passion',
    
    // Intro Section
    introTitle: 'A Family Tradition',
    introDescription: 'Our journey began in a small kitchen with a big dream. What started as a grandmother\'s secret recipes has grown into a beloved local bakery, but our commitment to quality and personal touch remains unchanged.',
    introDescription2: 'Every recipe is a family treasure, every ingredient carefully selected, and every creation made with the same love and attention to detail that we put into our very first batch.',
    introImage: '',
    
    // Values Section
    valuesTitle: 'Our Values',
    value1Title: 'Quality First',
    value1Description: 'We use only the finest ingredients and traditional baking methods to ensure every product meets our high standards.',
    value2Title: 'Made with Love',
    value2Description: 'Every creation is crafted with passion, care, and the same love that goes into baking for our own family.',
    value3Title: 'Community Focused',
    value3Description: 'We\'re proud to be part of our local community and love creating special moments for our neighbors and friends.',
    
    // Banner Section
    bannerTitle: 'Our Journey in Numbers',
    bannerStat1Title: '10+',
    bannerStat1Description: 'Years Experience',
    bannerStat2Title: '500+',
    bannerStat2Description: 'Happy Customers',
    bannerStat3Title: '50+',
    bannerStat3Description: 'Unique Recipes',
    bannerStat4Title: '1000+',
    bannerStat4Description: 'Cakes Baked'
  };
};

/**
 * Fetches about configuration data from Google Sheets
 * @returns {Promise<Object>} - About configuration object
 */
export const getAboutConfig = async () => {
  try {
    // Check cache first
    const now = Date.now();
    if (aboutCache && aboutCacheTimestamp && (now - aboutCacheTimestamp) < ABOUT_CACHE_DURATION) {
      console.log('Using cached about configuration');
      return aboutCache;
    }

    const { getSheetUrl } = await import('./sheetConfig.js');
    const url = getSheetUrl('ABOUT');
    
    console.log('ABOUT SERVICE: About sheet URL:', url); // More specific debug log
    
    if (!url || url === 'YOUR_ABOUT_SHEET_CSV_URL_HERE') {
      console.log('ABOUT SERVICE: No URL configured for ABOUT sheet, using default config');
      return getDefaultAboutConfig();
    }

    console.log('ABOUT SERVICE: Fetching about config from:', url); // More specific debug log

    // Fetch raw CSV data
    const csvData = await fetchSheetData(url);
    console.log('ABOUT SERVICE: Raw about CSV data:', csvData.substring(0, 200) + '...'); // More specific debug log
    
    // Parse using dedicated about config parser
    const rawData = parseAboutCSV(csvData);
    console.log('ABOUT SERVICE: Parsed about raw data:', rawData); // More specific debug log
    
    if (!rawData || Object.keys(rawData).length === 0) {
      console.log('ABOUT SERVICE: No about configuration found in Google Sheets');
      return getDefaultAboutConfig();
    }

    // Transform raw data into organized configuration object
    const aboutConfig = transformAboutData(rawData);
    console.log('ABOUT SERVICE: Final about config:', aboutConfig); // More specific debug log
    
    // Cache the result
    aboutCache = aboutConfig;
    aboutCacheTimestamp = now;
    
    return aboutConfig;
  } catch (error) {
    console.error('ABOUT SERVICE: Error fetching about configuration:', error);
    
    // Use cached data if available, even if expired
    if (aboutCache) {
      console.log('ABOUT SERVICE: Using expired about cache due to error');
      return aboutCache;
    }
    
    // Return default configuration on error
    return getDefaultAboutConfig();
  }
};

/**
 * Refreshes about configuration (clears cache and fetches fresh data)
 * @returns {Promise<Object>} - Fresh about configuration
 */
export const refreshAboutConfig = async () => {
  try {
    console.log('Refreshing about configuration');
    
    // Clear cache
    aboutCache = null;
    aboutCacheTimestamp = null;
    
    return await getAboutConfig();
  } catch (error) {
    console.error('Error refreshing about configuration:', error);
    return getDefaultAboutConfig();
  }
}; 