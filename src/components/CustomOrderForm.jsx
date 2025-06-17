import React, { useState } from 'react';

const CustomOrderForm = ({ googleAppsScriptUrl }) => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    orderType: '',
    deliveryDate: '',
    deliveryTime: '',
    address: '',
    message: ''
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState(null);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitStatus(null);

    try {
      // Use the URL from Google Sheets config, or fallback to the hardcoded one
      const scriptUrl = googleAppsScriptUrl;
      
      const response = await fetch(scriptUrl, {
        method: 'POST',
        mode: 'no-cors',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(form)
      });

      // With no-cors mode, we can't read the response, so we assume success
      setSubmitStatus('success');
      // Reset form on successful submission
      setForm({
        name: '',
        email: '',
        phone: '',
        orderType: '',
        deliveryDate: '',
        deliveryTime: '',
        address: '',
        message: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      setSubmitStatus('error');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="py-20">
      <div className="container mx-auto px-4 max-w-3xl">
        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-8 space-y-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
              <input name="name" value={form.name} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" placeholder="Your full name" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
              <input name="email" type="email" value={form.email} onChange={handleChange} required className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" placeholder="your@email.com" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
              <input name="phone" value={form.phone} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" placeholder="(555) 123-4567" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Product/Service Requested *</label>
              <input 
                type="text" 
                name="orderType" 
                value={form.orderType} 
                onChange={handleChange} 
                required 
                placeholder="e.g. product name, service name, etc."
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500"
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Delivery Date
              </label>
              <input 
                name="deliveryDate" 
                type="date" 
                value={form.deliveryDate} 
                onChange={handleChange} 
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" 
              />
              <p className="text-xs text-gray-500 mt-1">Tap to open calendar</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Preferred Delivery Time</label>
              <input name="deliveryTime" value={form.deliveryTime} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" placeholder="e.g. 2:00 PM" />
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">Delivery Address</label>
              <input name="address" value={form.address} onChange={handleChange} className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" placeholder="Full address" />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Additional Message</label>
            <textarea name="message" value={form.message} onChange={handleChange} rows="3" className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-amber-500" placeholder="Any other details or questions?" />
          </div>
          <button 
            type="submit" 
            disabled={isSubmitting}
            className={`w-full py-4 rounded-lg font-semibold transition-all duration-300 transform shadow-lg ${
              isSubmitting 
                ? 'bg-gray-400 cursor-not-allowed' 
                : 'bg-amber-600 hover:bg-amber-700 hover:scale-105'
            } text-white`}
          >
            {isSubmitting ? 'Submitting...' : 'Submit Order Request'}
          </button>
          
          {/* Status Messages - Now below the button */}
          {submitStatus === 'success' && (
            <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg">
              Thank you! Your order request has been submitted successfully. We'll be in touch soon!
            </div>
          )}
          
          {submitStatus === 'error' && (
            <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
              Sorry, there was an error submitting your request. Please try again or contact us directly.
            </div>
          )}
        </form>
      </div>
    </section>
  );
};

export default CustomOrderForm; 