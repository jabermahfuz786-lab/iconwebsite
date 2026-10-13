'use client';

import React, { useState } from 'react';
import { Property, InquiryFormData } from '@/types/property';
import { FaWhatsapp, FaPaperPlane, FaTimes } from 'react-icons/fa';

interface PropertyInquiryFormProps {
  property: Property;
  isOpen: boolean;
  onClose: () => void;
}

export default function PropertyInquiryForm({ property, isOpen, onClose }: PropertyInquiryFormProps) {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState<InquiryFormData>({
    name: '',
    email: '',
    phone: '',
    message: `I'm interested in the property: ${property.title}`,
    propertyId: property.id,
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // Prepare payload for n8n webhook
      const payload = {
        type: 'property_inquiry',
        property: {
          id: property.id,
          title: property.title,
          price: property.price,
          location: property.location,
          agentName: property.agentName,
          agentPhone: property.agentPhone,
        },
        inquiry: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          message: formData.message,
          propertyId: property.id,
        },
        timestamp: new Date().toISOString(),
        source: 'website',
      };

      // Send to n8n webhook (configured in environment variable)
      const webhookUrl = process.env.NEXT_PUBLIC_N8N_WEBHOOK_URL || 
        'https://n8n-rfve.srv2028389.hstgr.cloud/webhook/website-listings';

      const response = await fetch(webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error('Failed to submit inquiry');
      }

      // Success - show WhatsApp option
      setSubmitted(true);

      // Auto-send WhatsApp message (optional)
      const whatsappMessage = `Hi ${property.agentName}, I'm interested in ${property.title} located at ${property.location}. Please contact me at ${formData.phone}. Name: ${formData.name}`;
      const whatsappUrl = `https://wa.me/${property.agentPhone.replace(/\D/g, '')}?text=${encodeURIComponent(whatsappMessage)}`;
      
      // Open WhatsApp in new tab after 2 seconds
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
      }, 2000);

      // Reset form after 5 seconds
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setFormData({
          name: '',
          email: '',
          phone: '',
          message: `I'm interested in the property: ${property.title}`,
          propertyId: property.id,
        });
      }, 5000);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      {/* Modal Container */}
      <div className="relative w-full max-w-md rounded-2xl overflow-hidden">
        {/* Glass-morphism Background */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-teal-900/40 via-slate-900/60 to-slate-950/80 
          backdrop-blur-xl border border-teal-500/30"
          style={{
            boxShadow: '0 0 40px rgba(13, 148, 136, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)',
          }}
        />

        {/* Content */}
        <div className="relative z-10 p-8">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-teal-300 hover:text-yellow-400 transition text-2xl"
          >
            <FaTimes />
          </button>

          {submitted ? (
            // Success Message
            <div className="text-center py-8">
              <div className="text-6xl mb-4 animate-bounce">✅</div>
              <h3 className="text-2xl font-bold text-white mb-3">Inquiry Submitted!</h3>
              <p className="text-teal-200 mb-4">
                Your inquiry has been received. Opening WhatsApp to connect with {property.agentName}...
              </p>
              <div className="flex items-center justify-center gap-2 text-yellow-400">
                <FaWhatsapp className="w-5 h-5" />
                <span className="text-sm">Redirecting to WhatsApp...</span>
              </div>
            </div>
          ) : (
            <>
              {/* Header */}
              <h2 className="text-2xl font-bold text-white mb-2">Inquire About</h2>
              <p className="text-teal-300 mb-6 text-sm">{property.title}</p>

              {/* Form */}
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Name Input */}
                <div>
                  <label className="block text-teal-300 text-sm font-semibold mb-2">Name *</label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-800/50 border border-teal-500/30 rounded-lg px-4 py-2 text-white 
                    placeholder-teal-500/50 focus:outline-none focus:border-yellow-400/70 focus:ring-2 focus:ring-yellow-400/20 transition"
                    placeholder="Your full name"
                  />
                </div>

                {/* Email Input */}
                <div>
                  <label className="block text-teal-300 text-sm font-semibold mb-2">Email *</label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-800/50 border border-teal-500/30 rounded-lg px-4 py-2 text-white 
                    placeholder-teal-500/50 focus:outline-none focus:border-yellow-400/70 focus:ring-2 focus:ring-yellow-400/20 transition"
                    placeholder="your@email.com"
                  />
                </div>

                {/* Phone Input */}
                <div>
                  <label className="block text-teal-300 text-sm font-semibold mb-2">Phone *</label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    required
                    className="w-full bg-slate-800/50 border border-teal-500/30 rounded-lg px-4 py-2 text-white 
                    placeholder-teal-500/50 focus:outline-none focus:border-yellow-400/70 focus:ring-2 focus:ring-yellow-400/20 transition"
                    placeholder="+1 (123) 456-7890"
                  />
                </div>

                {/* Message Input */}
                <div>
                  <label className="block text-teal-300 text-sm font-semibold mb-2">Message</label>
                  <textarea
                    name="message"
                    value={formData.message}
                    onChange={handleChange}
                    rows={3}
                    className="w-full bg-slate-800/50 border border-teal-500/30 rounded-lg px-4 py-2 text-white 
                    placeholder-teal-500/50 focus:outline-none focus:border-yellow-400/70 focus:ring-2 focus:ring-yellow-400/20 transition resize-none"
                    placeholder="Tell us more about your inquiry..."
                  />
                </div>

                {/* Error Message */}
                {error && (
                  <div className="bg-red-900/40 border border-red-500/50 rounded-lg p-3 text-red-300 text-sm">
                    {error}
                  </div>
                )}

                {/* Submit Button */}
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 
                  disabled:from-yellow-600 disabled:to-yellow-700 text-slate-900 font-bold py-3 rounded-lg transition-all duration-300 
                  transform hover:scale-105 shadow-lg hover:shadow-yellow-500/50 flex items-center justify-center gap-2"
                >
                  <FaPaperPlane className="w-4 h-4" />
                  {loading ? 'Submitting...' : 'Submit Inquiry'}
                </button>

                {/* Terms */}
                <p className="text-teal-400/70 text-xs text-center">
                  We'll send your inquiry via WhatsApp to {property.agentName}
                </p>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
