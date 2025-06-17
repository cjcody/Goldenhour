import React, { useState, useEffect } from 'react';
import { getLegalConfig } from '../services/legalService';
import PageLoading from '../components/PageLoading';

const TermsOfService = () => {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchConfig = async () => {
      try {
        setLoading(true);
        setError(false);
        
        const legalConfig = await getLegalConfig();
        
        // Ensure we have a valid config object before stopping loading
        if (legalConfig && typeof legalConfig === 'object') {
          setConfig(legalConfig);
        } else {
          console.error('Invalid legal config received:', legalConfig);
          setError(true);
        }
      } catch (error) {
        console.error('Error fetching legal config:', error);
        setError(true);
      } finally {
        // Add a small delay to ensure content is rendered before hiding loading
        setTimeout(() => {
          setLoading(false);
        }, 500);
      }
    };

    fetchConfig();
  }, []);

  // Show loading screen until content is fully loaded
  if (loading || !config) {
    return <PageLoading pageName="Terms of Service" />;
  }

  // Show error state if there was an issue loading
  if (error) {
    return (
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to Load Terms of Service</h2>
          <p className="text-gray-600 mb-4">Please try refreshing the page or contact support if the issue persists.</p>
          <button 
            onClick={() => window.location.reload()} 
            className="bg-amber-600 hover:bg-amber-700 text-white px-6 py-2 rounded-lg font-semibold transition-all duration-300"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  // Use services from Google Sheets if available, otherwise use default terms
  const services = config?.services && config.services.length > 0 
    ? config.services 
    : [
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
      ];

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 min-h-screen">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
              Terms of Service
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mt-4 mb-6">
              Terms of Service
            </h1>
            <p className="text-gray-600 text-lg">
              Last updated: {config?.termsOfServiceLastUpdated || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            {services.map((service, index) => (
              <section key={index} className="mb-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">{service.title}</h2>
                <div className="text-gray-700 mb-4 leading-relaxed">
                  {service.description}
                </div>
              </section>
            ))}
          </div>

          {/* Back Button */}
          <div className="text-center mt-12">
            <button 
              onClick={() => window.history.back()} 
              className="bg-amber-600 hover:bg-amber-700 text-white px-8 py-3 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg"
            >
              ← Back to Previous Page
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TermsOfService; 