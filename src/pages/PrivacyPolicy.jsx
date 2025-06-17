import React, { useState, useEffect } from 'react';
import { getLegalConfig } from '../services/legalService';
import PageLoading from '../components/PageLoading';

const PrivacyPolicy = () => {
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
    return <PageLoading pageName="Privacy Policy" />;
  }

  // Show error state if there was an issue loading
  if (error) {
    return (
      <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Unable to Load Privacy Policy</h2>
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

  return (
    <div className="bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50 min-h-screen">
      <div className="container mx-auto px-4 py-20">
        <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-lg p-8">
          {/* Header */}
          <div className="text-center mb-12">
            <span className="bg-amber-100 text-amber-800 px-4 py-2 rounded-full text-sm font-medium">
              Privacy Policy
            </span>
            <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mt-4 mb-6">
              Privacy Policy
            </h1>
            <p className="text-gray-600 text-lg">
              Last updated: {config?.privacyPolicyLastUpdated || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}
            </p>
          </div>

          {/* Content */}
          <div className="prose prose-lg max-w-none">
            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">1. Information We Collect</h2>
              <p className="text-gray-700 mb-4">
                We collect information you provide directly to us, such as when you:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Contact us through our contact form</li>
                <li>Submit a custom order request</li>
                <li>Sign up for our newsletter (if applicable)</li>
                <li>Communicate with us via email or phone</li>
              </ul>
              <p className="text-gray-700">
                This information may include your name, email address, phone number, delivery address, and any other details you choose to provide.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">2. How We Use Your Information</h2>
              <p className="text-gray-700 mb-4">
                We use the information we collect to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Process and fulfill your custom orders</li>
                <li>Respond to your inquiries and provide customer service</li>
                <li>Send you order confirmations and updates</li>
                <li>Improve our services and website</li>
                <li>Comply with legal obligations</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">3. Information Sharing</h2>
              <p className="text-gray-700 mb-4">
                We do not sell, trade, or otherwise transfer your personal information to third parties, except in the following circumstances:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>With your explicit consent</li>
                <li>To comply with legal requirements</li>
                <li>To protect our rights and safety</li>
                <li>With trusted service providers who assist us in operating our website and serving you (such as delivery services)</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">4. Data Security</h2>
              <p className="text-gray-700 mb-4">
                We implement appropriate security measures to protect your personal information against unauthorized access, alteration, disclosure, or destruction. However, no method of transmission over the internet or electronic storage is 100% secure.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">5. Cookies and Tracking</h2>
              <p className="text-gray-700 mb-4">
                Our website uses only essential cookies necessary for basic functionality. We do not use tracking cookies, advertising cookies, or any other types of cookies that collect personal information.
              </p>
              <p className="text-gray-700 mb-4">
                This website uses standard browser caching to improve performance. No personal information is stored or tracked through our caching system.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">6. Third-Party Services</h2>
              <p className="text-gray-700 mb-4">
                Our website may contain links to third-party services, such as Google Maps for location display. These services have their own privacy policies, and we are not responsible for their practices.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">7. Your Rights</h2>
              <p className="text-gray-700 mb-4">
                You have the right to:
              </p>
              <ul className="list-disc pl-6 text-gray-700 mb-4">
                <li>Access the personal information we hold about you</li>
                <li>Request correction of inaccurate information</li>
                <li>Request deletion of your personal information</li>
                <li>Opt out of marketing communications</li>
              </ul>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">8. Children's Privacy</h2>
              <p className="text-gray-700 mb-4">
                Our website is not intended for children under 13 years of age. We do not knowingly collect personal information from children under 13.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">9. Changes to This Policy</h2>
              <p className="text-gray-700 mb-4">
                We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the "Last updated" date.
              </p>
            </section>

            <section className="mb-8">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">10. Contact Us</h2>
              <p className="text-gray-700 mb-4">
                If you have any questions about this Privacy Policy, please contact us through our website's contact page or using the contact information provided on our website.
              </p>
            </section>
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

export default PrivacyPolicy; 