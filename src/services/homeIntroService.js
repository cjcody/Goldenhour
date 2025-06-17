// Home Intro Service
// Handles fetching and processing home intro section data from Google Sheets

import { fetchSheetData } from './googleSheets.js';

// Cache for home intro data
let homeIntroCache = null;
let homeIntroCacheTimestamp = null;
const HOME_INTRO_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Parses CSV data specifically for home intro configuration
 * @param {string} csvData - Raw CSV data
 * @returns {Object} - Parsed home intro configuration object
 */
const parseHomeIntroCSV = (csvData) => {
  try {
    // Split CSV into lines and remove empty lines
    const lines = csvData.trim().split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return {};
    }

    // Parse each line manually for column-based structure
    const config = {};
    
    lines.forEach((line, index) => {
      // Split by comma, but handle quoted values
      const values = parseCSVLine(line);
      
      if (values.length >= 2) {
        const header = values[0]?.trim();
        const value = values[1]?.trim(); // Use index 1 (second column) for consistency
        
        if (header && value !== undefined && (header.startsWith('Home Intro') || header.startsWith('Home Stat'))) {
          config[header] = value;
        }
      }
    });

    return config;
  } catch (error) {
    console.error('Error parsing home intro CSV:', error);
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
 * Transforms raw sheet data into organized home intro configuration
 * @param {Object} rawData - Raw data from Google Sheets (already parsed as object)
 * @returns {Object} - Organized home intro configuration
 */
const transformHomeIntroData = (rawData) => {
  const result = {
    smallTitle: rawData['Home Intro Small Title'] || 'Our Story',
    blackTitle: rawData['Home Intro Black Title'] || 'A Passion for',
    orangeTitle: rawData['Home Intro Orange Title'] || 'Perfect Baking',
    paragraph1: rawData['Home Intro Paragraph1'] || 'For over a decade, we\'ve been crafting artisanal baked goods that bring joy to every occasion. What started as a small home kitchen has grown into a beloved local bakery, but our commitment to quality and personal touch remains unchanged.',
    paragraph2: rawData['Home Intro Paragraph2'] || '',
    stats: [
      {
        number: rawData['Home Intro Stat1'] || '',
        description: rawData['Home Stat1 Description'] || ''
      },
      {
        number: rawData['Home Intro Stat2'] || '',
        description: rawData['Home Stat2 Description'] || ''
      },
      {
        number: rawData['Home Intro Stat3'] || '',
        description: rawData['Home Stat3 Description'] || ''
      }
    ],
    buttonText: rawData['Home Intro Button Text'] || 'Learn More About Us',
    buttonLink: rawData['Home Intro Button Link'] || '/about',
    image: rawData['Home Intro Image'] || ''
  };

  return result;
};

/**
 * Returns default home intro configuration when Google Sheets is unavailable
 * @returns {Object} - Default home intro configuration
 */
const getDefaultHomeIntroConfig = () => {
  return {
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
};

/**
 * Fetches home intro configuration data from Google Sheets
 * @returns {Promise<Object>} - Home intro configuration object
 */
export const getHomeIntroConfig = async () => {
  try {
    // Check cache first
    const now = Date.now();
    if (homeIntroCache && homeIntroCacheTimestamp && (now - homeIntroCacheTimestamp) < HOME_INTRO_CACHE_DURATION) {
      return homeIntroCache;
    }

    // Clear cache if it's expired
    if (homeIntroCache && homeIntroCacheTimestamp && (now - homeIntroCacheTimestamp) >= HOME_INTRO_CACHE_DURATION) {
      homeIntroCache = null;
      homeIntroCacheTimestamp = null;
    }

    const { getSheetUrl } = await import('./sheetConfig.js');
    const url = getSheetUrl('HERO');
    
    if (!url || url === 'YOUR_HERO_SHEET_CSV_URL_HERE') {
      console.log('No URL configured for HERO sheet, using default config');
      return getDefaultHomeIntroConfig();
    }

    // Fetch raw CSV data
    const csvData = await fetchSheetData(url);
    
    // Parse using dedicated home intro config parser
    const rawData = parseHomeIntroCSV(csvData);
    
    if (!rawData || Object.keys(rawData).length === 0) {
      console.log('No home intro configuration found in Google Sheets');
      return getDefaultHomeIntroConfig();
    }

    // Transform raw data into organized configuration object
    const homeIntroConfig = transformHomeIntroData(rawData);
    
    // Cache the result
    homeIntroCache = homeIntroConfig;
    homeIntroCacheTimestamp = now;
    
    return homeIntroConfig;
  } catch (error) {
    console.error('Error fetching home intro configuration:', error);
    
    // Use cached data if available, even if expired
    if (homeIntroCache) {
      return homeIntroCache;
    }
    
    // Return default configuration on error
    return getDefaultHomeIntroConfig();
  }
};

/**
 * Manually clears the home intro cache to force fresh data fetching
 */
export const clearHomeIntroCache = () => {
  console.log('Manually clearing home intro cache');
  homeIntroCache = null;
  homeIntroCacheTimestamp = null;
};

/**
 * Refreshes home intro configuration (clears cache and fetches fresh data)
 * @returns {Promise<Object>} - Fresh home intro configuration
 */
export const refreshHomeIntroConfig = async () => {
  try {
    console.log('Refreshing home intro configuration');
    
    // Clear cache
    homeIntroCache = null;
    homeIntroCacheTimestamp = null;
    
    return await getHomeIntroConfig();
  } catch (error) {
    console.error('Error refreshing home intro configuration:', error);
    return getDefaultHomeIntroConfig();
  }
}; 