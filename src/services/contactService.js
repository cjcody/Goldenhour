// Contact Service
// Handles fetching and processing contact page data from Google Sheets
// Supports endless FAQ columns for flexible client content management

import { fetchSheetData } from './googleSheets.js';

// Cache for contact data
let contactCache = null;
let contactCacheTimestamp = null;
const CONTACT_CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

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
 * Parses CSV data specifically for contact page configuration
 * @param {string} csvData - Raw CSV data
 * @returns {Object} - Parsed contact configuration object with FAQs
 */
const parseContactCSV = (csvData) => {
  try {
    // Split CSV into lines and remove empty lines
    const lines = csvData.trim().split('\n').filter(line => line.trim());
    
    if (lines.length === 0) {
      return { contactInfo: {}, faqs: [] };
    }

    console.log('Contact CSV lines:', lines); // Debug log

    // Parse each line manually for column-based structure
    const contactInfo = {};
    const faqs = [];
    
    lines.forEach((line, index) => {
      // Split by comma, but handle quoted values
      const values = parseCSVLine(line);
      console.log(`Contact line ${index}:`, values); // Debug log
      
      if (values.length >= 2) {
        const header = values[0]?.trim();
        
        if (header && header !== undefined) {
          // Check if this is a FAQ item
          if (header === 'FAQ Question') {
            // Process all FAQ questions across columns
            for (let i = 1; i < values.length; i++) {
              const question = values[i]?.trim();
              if (question && question !== '') {
                // Find or create FAQ item
                let faqItem = faqs.find(faq => faq.number === i);
                if (!faqItem) {
                  faqItem = { number: i, question: '', answer: '' };
                  faqs.push(faqItem);
                }
                faqItem.question = question;
              }
            }
          } else if (header === 'FAQ Answer') {
            // Process all FAQ answers across columns
            for (let i = 1; i < values.length; i++) {
              const answer = values[i]?.trim();
              if (answer && answer !== '') {
                // Find or create FAQ item
                let faqItem = faqs.find(faq => faq.number === i);
                if (!faqItem) {
                  faqItem = { number: i, question: '', answer: '' };
                  faqs.push(faqItem);
                }
                faqItem.answer = answer;
              }
            }
          } else {
            // Regular contact info - use first value (column B)
            const value = values[1]?.trim();
            if (value !== undefined) {
              contactInfo[header] = value;
            }
          }
        }
      }
    });

    // Sort FAQs by number
    faqs.sort((a, b) => a.number - b.number);

    console.log('Final contact config object:', { contactInfo, faqs }); // Debug log
    console.log('FAQ details:', faqs.map(faq => ({ number: faq.number, question: faq.question, answer: faq.answer }))); // More detailed FAQ debug
    return { contactInfo, faqs };
  } catch (error) {
    console.error('Error parsing contact CSV:', error);
    return { contactInfo: {}, faqs: [] };
  }
};

/**
 * Transforms raw contact data into organized configuration object
 * @param {Object} rawData - Raw parsed data
 * @returns {Object} - Organized contact configuration
 */
const transformContactData = (rawData) => {
  const { contactInfo, faqs } = rawData;
  
  return {
    // Hero section
    heroDesktopImage: contactInfo['Contact Hero Desktop Image'] || '',
    heroMobileImage: contactInfo['Contact Hero Mobile Image'] || '',
    heroTitleBlack: contactInfo['Contact Hero Title Black'] || 'Ready to',
    heroTitleOrange: contactInfo['Contact Hero Title Orange'] || 'Order?',
    heroPhrase: contactInfo['Contact Hero Phrase'] || "We'd love to hear from you",
    
    // Contact information
    contactBoxTitle: contactInfo['Contact Box Title'] || 'Contact Information',
    addressTitle: contactInfo['Address Title'] || 'Address',
    addressInfo: contactInfo['Address Info'] || '123 Baker Street, Sweetville, CA 90210',
    phoneTitle: contactInfo['Phone Title'] || 'Phone',
    phoneInfo: contactInfo['Phone Info'] || '(555) 123-4567',
    emailTitle: contactInfo['Email Title'] || 'Email',
    emailInfo: contactInfo['Email Info'] || 'hello@artisanbaking.com',
    hoursTitle: contactInfo['Hours Title'] || 'Hours',
    hoursInfo: contactInfo['Hours Info'] || 'Mon-Fri: 7AM-6PM\nSat: 8AM-4PM\nSun: 9AM-2PM',
    
    // Location section
    mapTitle: contactInfo['Contact Map Title'] || 'Our Location',
    mapDescription: contactInfo['Contact Map Description'] || '',
    mapEmbedCode: contactInfo['Contact Map url Location'] || '', // Should contain just the Google Maps embed URL, not full iframe HTML
    
    // FAQ section
    faqTitle: contactInfo['FAQ Title'] || 'Frequently Asked Questions',
    faqs: faqs.map((faq, index) => ({
      id: `faq-${faq.number || index + 1}`,
      question: faq.question,
      answer: faq.answer
    }))
  };
};

/**
 * Returns default contact configuration
 * @returns {Object} - Default contact configuration
 */
const getDefaultContactConfig = () => {
  return {
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
    faqs: [
      {
        id: 'faq-1',
        question: 'How far in advance should I order a custom cake?',
        answer: 'We recommend ordering custom cakes at least 1-2 weeks in advance to ensure we have enough time to create your perfect design. For wedding cakes or large orders, we suggest 3-4 weeks notice.'
      }
    ]
  };
};

/**
 * Fetches contact configuration data from Google Sheets
 * @returns {Promise<Object>} - Contact configuration object
 */
export const getContactConfig = async () => {
  try {
    // Check cache first
    const now = Date.now();
    if (contactCache && contactCacheTimestamp && (now - contactCacheTimestamp) < CONTACT_CACHE_DURATION) {
      console.log('Using cached contact configuration');
      return contactCache;
    }

    const { getSheetUrl } = await import('./sheetConfig.js');
    const url = getSheetUrl('CONTACT');
    
    console.log('CONTACT SERVICE: Contact sheet URL:', url); // More specific debug log
    
    if (!url || url === 'YOUR_CONTACT_SHEET_CSV_URL_HERE') {
      console.log('CONTACT SERVICE: No URL configured for CONTACT sheet, using default config');
      return getDefaultContactConfig();
    }

    console.log('CONTACT SERVICE: Fetching contact config from:', url); // More specific debug log

    // Fetch raw CSV data
    const csvData = await fetchSheetData(url);
    console.log('CONTACT SERVICE: Raw contact CSV data:', csvData.substring(0, 200) + '...'); // More specific debug log
    
    // Parse using dedicated contact config parser
    const rawData = parseContactCSV(csvData);
    console.log('CONTACT SERVICE: Parsed contact raw data:', rawData); // More specific debug log
    
    if (!rawData || (!rawData.contactInfo && !rawData.faqs)) {
      console.log('CONTACT SERVICE: No contact configuration found in Google Sheets');
      return getDefaultContactConfig();
    }

    // Transform raw data into organized configuration object
    const contactConfig = transformContactData(rawData);
    console.log('CONTACT SERVICE: Final contact config:', contactConfig); // More specific debug log
    
    // Cache the result
    contactCache = contactConfig;
    contactCacheTimestamp = now;
    
    return contactConfig;
  } catch (error) {
    console.error('Error fetching contact configuration:', error);
    
    // Use cached data if available, even if expired
    if (contactCache) {
      console.log('Using expired contact cache due to error');
      return contactCache;
    }
    
    // Return default configuration on error
    return getDefaultContactConfig();
  }
};

/**
 * Refreshes contact data (clears cache and fetches fresh data)
 * @returns {Promise<Object>} - Fresh contact configuration
 */
export const refreshContactData = async () => {
  try {
    console.log('Refreshing contact data');
    
    // Clear cache
    contactCache = null;
    contactCacheTimestamp = null;
    
    return await getContactConfig();
  } catch (error) {
    console.error('Error refreshing contact data:', error);
    return getDefaultContactConfig();
  }
}; 