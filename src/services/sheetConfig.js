// Google Sheets Configuration
// Replace these URLs with your actual published Google Sheets CSV URLs

export const SHEET_CONFIG = {
  // Website Configuration Sheet - Replace with your actual published CSV URL
  WEBSITE: {
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRUSiE3ZGt0ccb5uNC6HSuNK-KVjEgCD04YxDGclPhstHLZgWBe6z8Rep_W9ojiRDaU3BqqnRi2KL_Z/pub?gid=135580160&single=true&output=csv',
    // Column-based structure: Column A contains headers, Column B contains values
    columns: {
      // Use actual Google Sheets headers for direct mapping
      'Nav Logo Image': 'Nav Logo Image',
      'Nav Company Name': 'Nav Company Name',
      'Nav Home': 'Nav Home',
      'Nav About': 'Nav About',
      'Nav Menu': 'Nav Menu',
      'Nav Contact': 'Nav Contact',
      'Nav Custom Order': 'Nav Custom Order',
      
      'Footer Company Name': 'Footer Company Name',
      'Footer Company Description': 'Footer Company Description',
      'Footer Copyright Text': 'Footer Copyright Text',
      'Footer Home': 'Footer Home',
      'Footer About Us': 'Footer About Us',
      'Footer Our Menu': 'Footer Our Menu',
      'Footer Contact Us': 'Footer Contact Us',
      'Footer Custom Order': 'Footer Custom Order',
      
      'X url': 'X url',
      'Facebook url': 'Facebook url',
      'Pinterest url': 'Pinterest url',
      'Instagram url': 'Instagram url',
      'Youtube url': 'Youtube url',
      'Linkedin url': 'Linkedin url',
      'Tiktok url': 'Tiktok url',
      
      'Services Line1': 'Services Line1',
      'Services Line2': 'Services Line2',
      'Services Line3': 'Services Line3',
      'Services Line4': 'Services Line4',
      'Services Line5': 'Services Line5',
      
      'Favicon Image': 'Favicon Image',
      'Browser Page Title': 'Browser Page Title'
    }
  },
  
  // Hero Section Sheet - Replace with your actual published CSV URL
  HERO: {
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRUSiE3ZGt0ccb5uNC6HSuNK-KVjEgCD04YxDGclPhstHLZgWBe6z8Rep_W9ojiRDaU3BqqnRi2KL_Z/pub?gid=417426300&single=true&output=csv',
    columns: {
      'Home Hero Desktop Image': 'Home Hero Desktop Image',
      'Home Hero Mobile Image': 'Home Hero Mobile Image',
      'Home Hero Title Black': 'Home Hero Title Black',
      'Home Hero Title Orange': 'Home Hero Title Orange',
      'Home Hero Phrase': 'Home Hero Phrase',
      'Home Hero Button Text': 'Home Hero Button Text',
      'Home Hero Button Link': 'Home Hero Button Link',
      'Home Intro Small Title': 'Home Intro Small Title',
      'Home Intro Black Title': 'Home Intro Black Title',
      'Home Intro Orange Title': 'Home Intro Orange Title',
      'Home Intro Paragraph1': 'Home Intro Paragraph1',
      'Home Intro Paragraph2': 'Home Intro Paragraph2',
      'Home Intro Stat1': 'Home Intro Stat1',
      'Home Stat1 Description': 'Home Stat1 Description',
      'Home Intro Stat2': 'Home Intro Stat2',
      'Home Stat2 Description': 'Home Stat2 Description',
      'Home Intro Stat3': 'Home Intro Stat3',
      'Home Stat3 Description': 'Home Stat3 Description',
      'Home Intro Button Text': 'Home Intro Button Text',
      'Home Intro Button Link': 'Home Intro Button Link',
      'Home Intro Image': 'Home Intro Image'
    }
  },
  
  // Testimonials Sheet - Replace with your actual published CSV URL
  TESTIMONIALS: {
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRUSiE3ZGt0ccb5uNC6HSuNK-KVjEgCD04YxDGclPhstHLZgWBe6z8Rep_W9ojiRDaU3BqqnRi2KL_Z/pub?gid=417426300&single=true&output=csv',
    columns: {
      // Section headers
      'Testimonial Small Title': 'Testimonial Small Title',
      'Testimonial Black Title': 'Testimonial Black Title',
      'Testimonial Orange Title': 'Testimonial Orange Title',
      'Testimonial Description': 'Testimonial Description',
      
      // Individual testimonials (can have multiple: Testimonial Name1, Testimonial Name2, etc.)
      'Testimonial Name': 'Testimonial Name',
      'Testimonial Name Label': 'Testimonial Name Label',
      'Testimonial Quote': 'Testimonial Quote',
      
      // Banner data
      'Testimonial Banner Title': 'Testimonial Banner Title',
      'Testimonial Banner Text Top': 'Testimonial Banner Text Top',
      'Testimonial Banner Text Bottom': 'Testimonial Banner Text Bottom'
    }
  },
  
  // Products Sheet - Replace with your actual published CSV URL
  PRODUCTS: {
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRUSiE3ZGt0ccb5uNC6HSuNK-KVjEgCD04YxDGclPhstHLZgWBe6z8Rep_W9ojiRDaU3BqqnRi2KL_Z/pub?gid=417426300&single=true&output=csv',
    columns: {
      // Section headers
      'Products Small Title': 'Products Small Title',
      'Products Black Title': 'Products Black Title',
      'Products Orange Title': 'Products Orange Title',
      'Products Description': 'Products Description',
      
      // Carousel items (can span multiple columns)
      'Product Slide Badge': 'Product Slide Badge',
      'Product Slide Image': 'Product Slide Image',
      'Product Slide Title': 'Product Slide Title',
      'Product Slide Description': 'Product Slide Description',
      
      // Special offer section
      'Special Offer Title': 'Special Offer Title',
      'Special Offer Description': 'Special Offer Description',
      'Special Offer Button Text': 'Special Offer Button Text',
      'Special Offer Button Link': 'Special Offer Button Link'
    }
  },
  
    // About Page Sheet - Replace with your actual published CSV URL
  ABOUT: {
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRUSiE3ZGt0ccb5uNC6HSuNK-KVjEgCD04YxDGclPhstHLZgWBe6z8Rep_W9ojiRDaU3BqqnRi2KL_Z/pub?gid=1090980362&single=true&output=csv',
    columns: {
      'About Hero Desktop Image': 'About Hero Desktop Image',
      'About Hero Mobile Image': 'About Hero Mobile Image',
      'About Hero Black Title': 'About Hero Black Title',
      'About Hero Orange Title': 'About Hero Orange Title',
      'About Hero Phrase': 'About Hero Phrase',
      'About Intro Title': 'About Intro Title',
      'About Intro Description': 'About Intro Description',
      'About Intro Description2': 'About Intro Description2',
      'About Intro Image': 'About Intro Image',
      'About Values Title': 'About Values Title',
      'About Value1 Title': 'About Value1 Title',
      'About Value1 Description': 'About Value1 Description',
      'About Value2 Title': 'About Value2 Title',
      'About Value2 Description': 'About Value2 Description',
      'About Value3 Title': 'About Value3 Title',
      'About Value3 Description': 'About Value3 Description',
      'About Banner Title': 'About Banner Title',
      'About Banner Stat1 Title': 'About Banner Stat1 Title',
      'About Banner Stat1 Description': 'About Banner Stat1 Description',
      'About Banner Stat2 Title': 'About Banner Stat2 Title',
      'About Banner Stat2 Description': 'About Banner Stat2 Description',
      'About Banner Stat3 Title': 'About Banner Stat3 Title',
      'About Banner Stat3 Description': 'About Banner Stat3 Description',
      'About Banner Stat4 Title': 'About Banner Stat4 Title',
      'About Banner Stat4 Description': 'About Banner Stat4 Description'
    }
  },

  // Special Offers Sheet - Replace with your actual published CSV URL
  SPECIAL_OFFERS: {
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRUSiE3ZGt0ccb5uNC6HSuNK-KVjEgCD04YxDGclPhstHLZgWBe6z8Rep_W9ojiRDaU3BqqnRi2KL_Z/pub?gid=568011479&single=true&output=csv',
    columns: {
      // Menu Hero Section
      'Menu Hero Desktop Image': 'Menu Hero Desktop Image',
      'Menu Hero Mobile Image': 'Menu Hero Mobile Image',
      'Menu Hero Title Black': 'Menu Hero Title Black',
      'Menu Hero Title Orange': 'Menu Hero Title Orange',
      'Menu Hero Phrase': 'Menu Hero Phrase',
      'Menu Bottom Banner Title': 'Menu Bottom Banner Title',
      
      // Special Offers (flexible 1-3 offers)
      'Menu Offer1 Title': 'Menu Offer1 Title',
      'Menu Offer1 Description': 'Menu Offer1 Description',
      'Menu Offer1 Button Text': 'Menu Offer1 Button Text',
      'Menu Offer1 Button Link': 'Menu Offer1 Button Link',
      
      'Menu Offer2 Title': 'Menu Offer2 Title',
      'Menu Offer2 Description': 'Menu Offer2 Description',
      'Menu Offer2 Button Text': 'Menu Offer2 Button Text',
      'Menu Offer2 Button Link': 'Menu Offer2 Button Link',
      
      'Menu Offer3 Title': 'Menu Offer3 Title',
      'Menu Offer3 Description': 'Menu Offer3 Description',
      'Menu Offer3 Button Text': 'Menu Offer3 Button Text',
      'Menu Offer3 Button Link': 'Menu Offer3 Button Link'
    }
  },
  
   // Menu Sheet - Replace with your actual published CSV URL
  MENU: {
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRUSiE3ZGt0ccb5uNC6HSuNK-KVjEgCD04YxDGclPhstHLZgWBe6z8Rep_W9ojiRDaU3BqqnRi2KL_Z/pub?gid=0&single=true&output=csv',
    // Column-based structure: each row is a field type, each column is a category
    columns: {
      category: 'Category',                    // Row header for category names
      categoryDescription: 'Category Description', // Row header for category descriptions
      itemName: 'Item Name',                   // Row header for menu item names
      price: 'Price',                          // Row header for prices
      description: 'Description',              // Row header for item descriptions
      popular: 'Popular',                      // Row header for popular flag (true/false)
      onSale: 'On Sale',                       // Row header for on sale flag (true/false)
      seasonal: 'Seasonal',                    // Row header for seasonal flag (true/false)
      orderButtonText: 'Order Button Text',    // Row header for order button text
      orderLink: 'Order Link',                 // Row header for order button URLs
      photos: 'Photos'                         // Row header for photo URLs (comma-separated)
    }
  },

  // Contact Page Sheet - Replace with your actual published CSV URL
  CONTACT: {
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRUSiE3ZGt0ccb5uNC6HSuNK-KVjEgCD04YxDGclPhstHLZgWBe6z8Rep_W9ojiRDaU3BqqnRi2KL_Z/pub?gid=1774824803&single=true&output=csv',
    // Column-based structure: Column A contains headers, Column B contains values
    columns: {
      // Hero section
      'Contact Hero Desktop Image': 'Contact Hero Desktop Image',
      'Contact Hero Mobile Image': 'Contact Hero Mobile Image',
      'Contact Hero Title Black': 'Contact Hero Title Black',
      'Contact Hero Title Orange': 'Contact Hero Title Orange',
      'Contact Hero Phrase': 'Contact Hero Phrase',
      
      // Contact information
      'Contact Box Title': 'Contact Box Title',
      'Address Title': 'Address Title',
      'Address Info': 'Address Info',
      'Phone Title': 'Phone Title',
      'Phone Info': 'Phone Info',
      'Email Title': 'Email Title',
      'Email Info': 'Email Info',
      'Hours Title': 'Hours Title',
      'Hours Info': 'Hours Info',
      
      // Location section
      'Contact Map Title': 'Contact Map Title',
      'Contact Map Description': 'Contact Map Description',
      'Contact Map url Location': 'Contact Map url Location', // Should contain just the Google Maps embed URL (e.g., https://www.google.com/maps/embed?...), not the full iframe HTML
      
      // FAQ section
      'FAQ Title': 'FAQ Title',
      'FAQ Question': 'FAQ Question',
      'FAQ Answer': 'FAQ Answer'
    }
  },
  
  // Custom Order Page Sheet - Replace with your actual published CSV URL
  CUSTOM_ORDER: {
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRUSiE3ZGt0ccb5uNC6HSuNK-KVjEgCD04YxDGclPhstHLZgWBe6z8Rep_W9ojiRDaU3BqqnRi2KL_Z/pub?gid=1825937196&single=true&output=csv',
    // Column-based structure: Column A contains headers, Column B contains values
    columns: {
      // Hero section
      'Form Page Hero Desktop Image': 'Form Page Hero Desktop Image',
      'Form Page Hero Mobile Image': 'Form Page Hero Mobile Image',
      'Form Page Hero Title Black': 'Form Page Hero Title Black',
      'Form Page Hero Title Orange': 'Form Page Hero Title Orange',
      'Form Page Hero Phrase': 'Form Page Hero Phrase',
      
      // Google Apps Script URL
      'Google Apps Script url': 'Google Apps Script url'
    }
  },
  
  // Legal Pages Sheet - Replace with your actual published CSV URL
  LEGAL: {
    url: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRUSiE3ZGt0ccb5uNC6HSuNK-KVjEgCD04YxDGclPhstHLZgWBe6z8Rep_W9ojiRDaU3BqqnRi2KL_Z/pub?gid=664877592&single=true&output=csv',
    // Column-based structure: Column A contains headers, Column B contains values
    columns: {
      // Privacy Policy
      'Privacy Policy Last Updated Date': 'Privacy Policy Last Updated Date',
      
      // Terms of Service
      'Terms of Service Last Updated Date': 'Terms of Service Last Updated Date',
      
      // Service sections (1-12)
      'Service Title1': 'Service Title1',
      'Service Description1': 'Service Description1',
      'Service Title2': 'Service Title2',
      'Service Description2': 'Service Description2',
      'Service Title3': 'Service Title3',
      'Service Description3': 'Service Description3',
      'Service Title4': 'Service Title4',
      'Service Description4': 'Service Description4',
      'Service Title5': 'Service Title5',
      'Service Description5': 'Service Description5',
      'Service Title6': 'Service Title6',
      'Service Description6': 'Service Description6',
      'Service Title7': 'Service Title7',
      'Service Description7': 'Service Description7',
      'Service Title8': 'Service Title8',
      'Service Description8': 'Service Description8',
      'Service Title9': 'Service Title9',
      'Service Description9': 'Service Description9',
      'Service Title10': 'Service Title10',
      'Service Description10': 'Service Description10',
      'Service Title11': 'Service Title11',
      'Service Description11': 'Service Description11',
      'Service Title12': 'Service Title12',
      'Service Description12': 'Service Description12'
    }
  }
};

// Helper function to get sheet URL by type
export const getSheetUrl = (sheetType) => {
  return SHEET_CONFIG[sheetType]?.url || null;
};

// Helper function to get column mapping by type
export const getColumnMapping = (sheetType) => {
  return SHEET_CONFIG[sheetType]?.columns || {};
}; 