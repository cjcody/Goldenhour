// Legal Service
// Handles fetching and processing Privacy Policy and Terms of Service data from Google Sheets

import { fetchSheetData } from './googleSheets.js';

// Cache for legal data
let legalCache = null;
let legalCacheTimestamp = null;
const LEGAL_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

/**
 * Parses CSV data specifically for legal configuration
 * @param {string} csvData - Raw CSV data
 * @returns {Object} - Parsed legal configuration object
 */
const parseLegalCSV = (csvData) => {
  try {
    // Split CSV into lines and remove empty lines
    const lines = csvData.trim().split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return {};
    }

    console.log('Legal CSV lines:', lines); // Debug log

    // Parse each line manually for column-based structure
    const config = {};
    
    lines.forEach((line, index) => {
      // Split by comma, but handle quoted values
      const values = parseCSVLine(line);
      console.log(`Legal line ${index}:`, values); // Debug log
      
      if (values.length >= 2) {
        const header = values[0]?.trim();
        const value = values[1]?.trim();
        
        if (header && value !== undefined) {
          config[header] = value;
        }
      }
    });

    console.log('Final legal config object:', config); // Debug log
    return config;
  } catch (error) {
    console.error('Error parsing legal CSV:', error);
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
 * Transforms raw sheet data into organized legal configuration
 * @param {Object} rawData - Raw data from Google Sheets (already parsed as object)
 * @returns {Object} - Organized legal configuration
 */
const transformLegalData = (rawData) => {
  console.log('Raw legal data from Google Sheets:', rawData); // Debug log

  // Build services array dynamically
  const services = [];
  for (let i = 1; i <= 12; i++) {
    const service = {
      title: rawData[`Service Title${i}`] || '',
      description: rawData[`Service Description${i}`] || ''
    };
    
    // Only add if both title and description exist
    if (service.title && service.title.trim() && service.description && service.description.trim()) {
      services.push(service);
    }
  }

  return {
    // Privacy Policy
    privacyPolicyLastUpdated: rawData['Privacy Policy Last Updated Date'] || '',
    
    // Terms of Service
    termsOfServiceLastUpdated: rawData['Terms of Service Last Updated Date'] || '',
    services: services
  };
};

/**
 * Returns default legal configuration when Google Sheets is unavailable
 * @returns {Object} - Default legal configuration
 */
const getDefaultLegalConfig = () => {
  return {
    // Privacy Policy
    privacyPolicyLastUpdated: 'June 15, 2025',
    
    // Terms of Service
    termsOfServiceLastUpdated: 'June 15, 2025',
    services: [
      {
        title: "1. Acceptance of Terms",
        description: "By accessing and using this website, you accept and agree to be bound by the terms and provision of this agreement. If you do not agree to abide by the above, please do not use this service."
      },
      {
        title: "2. Use License",
        description: "Permission is granted to temporarily download one copy of the materials (information or software) on this website for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title, and under this license you may not modify or copy the materials, use the materials for any commercial purpose or for any public display, attempt to decompile or reverse engineer any software contained on the website, remove any copyright or other proprietary notations from the materials, or transfer the materials to another person or \"mirror\" the materials on any other server."
      },
      {
        title: "3. Ordering and Payment",
        description: "When placing orders through our website or other communication channels, all prices are subject to change without notice. Payment is required at the time of ordering unless otherwise agreed. We reserve the right to refuse service to anyone. Orders are not confirmed until payment is received and processed. We are not responsible for any errors in pricing or product descriptions."
      },
      {
        title: "4. Delivery and Pickup",
        description: "Delivery times are estimates and may vary based on circumstances. We are not responsible for delays due to weather, traffic, or other factors beyond our control. Customers are responsible for providing accurate delivery information. Items must be picked up within the specified timeframe or may be disposed of. Additional delivery fees may apply based on distance and order size."
      },
      {
        title: "5. Cancellation and Refund Policy",
        description: "Cancellations must be made within the specified timeframe (typically 24-48 hours in advance). Late cancellations may result in partial or no refund. Refunds are processed according to our refund policy. We reserve the right to cancel orders due to circumstances beyond our control. Custom orders may have different cancellation terms."
      },
      {
        title: "6. Allergen and Dietary Information",
        description: "We handle common allergens in our kitchen. While we take precautions, we cannot guarantee allergen-free preparation. Customers with severe allergies should contact us directly. We are not liable for allergic reactions or dietary issues. Ingredient lists are available upon request."
      },
      {
        title: "7. Product Quality and Satisfaction",
        description: "We strive for quality and customer satisfaction. Products are made fresh to order when possible. We use high-quality ingredients and follow food safety guidelines. If you are not satisfied, please contact us within 24 hours. We will work to resolve any issues to your satisfaction. Photographs may not exactly represent final products."
      },
      {
        title: "8. Privacy and Data Protection",
        description: "Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the website, to understand our practices."
      },
      {
        title: "9. Limitation of Liability",
        description: "In no event shall we or our suppliers be liable for any damages (including, without limitation, damages for loss of data or profit, or due to business interruption) arising out of the use or inability to use the materials on our website, even if we or our authorized representative has been notified orally or in writing of the possibility of such damage."
      },
      {
        title: "10. Governing Law",
        description: "These terms and conditions are governed by and construed in accordance with the laws of the jurisdiction in which our business operates, and you irrevocably submit to the exclusive jurisdiction of the courts in that location."
      },
      {
        title: "11. Changes to Terms",
        description: "We may revise these terms of service at any time without notice. By using this website, you are agreeing to be bound by the then current version of these terms of service."
      },
      {
        title: "12. Contact Information",
        description: "If you have any questions about these Terms of Service, please contact us through our website's contact page or using the contact information provided on our website."
      }
    ]
  };
};

/**
 * Fetches legal configuration data from Google Sheets
 * @returns {Promise<Object>} - Legal configuration object
 */
export const getLegalConfig = async () => {
  try {
    // Check cache first
    const now = Date.now();
    if (legalCache && legalCacheTimestamp && (now - legalCacheTimestamp) < LEGAL_CACHE_DURATION) {
      console.log('Using cached legal configuration');
      return legalCache;
    }

    const { getSheetUrl } = await import('./sheetConfig.js');
    const url = getSheetUrl('LEGAL');
    
    if (!url || url === 'YOUR_LEGAL_SHEET_CSV_URL_HERE') {
      console.log('No URL configured for LEGAL sheet, using default config');
      return getDefaultLegalConfig();
    }

    console.log('Fetching legal config from:', url); // Debug log

    // Fetch raw CSV data
    const csvData = await fetchSheetData(url);
    console.log('Raw legal CSV data:', csvData.substring(0, 200) + '...'); // Debug log
    
    // Parse using dedicated legal config parser
    const rawData = parseLegalCSV(csvData);
    console.log('Parsed legal raw data:', rawData); // Debug log
    
    if (!rawData || Object.keys(rawData).length === 0) {
      console.log('No legal configuration found in Google Sheets');
      return getDefaultLegalConfig();
    }

    // Transform raw data into organized configuration object
    const legalConfig = transformLegalData(rawData);
    
    // Cache the result
    legalCache = legalConfig;
    legalCacheTimestamp = now;
    
    return legalConfig;
  } catch (error) {
    console.error('Error fetching legal configuration:', error);
    
    // Use cached data if available, even if expired
    if (legalCache) {
      console.log('Using expired legal cache due to error');
      return legalCache;
    }
    
    // Return default configuration on error
    return getDefaultLegalConfig();
  }
}; 