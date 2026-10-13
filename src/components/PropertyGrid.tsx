'use client';

import React, { useState } from 'react';
import { Property } from '@/types/property';
import PropertyCard from './PropertyCard';
import PropertyInquiryForm from './PropertyInquiryForm';

interface PropertyGridProps {
  properties: Property[];
  title?: string;
  description?: string;
}

export default function PropertyGrid({ properties, title = 'Featured Properties', description }: PropertyGridProps) {
  const [selectedProperty, setSelectedProperty] = useState<Property | null>(null);
  const [inquireOpen, setInquireOpen] = useState(false);

  const handleInquire = (property: Property) => {
    setSelectedProperty(property);
    setInquireOpen(true);
  };

  return (
    <section className="py-20 px-4 md:px-8 lg:px-16 bg-gradient-to-b from-slate-950 via-teal-950/20 to-slate-950">
      {/* Section Header */}
      <div className="max-w-6xl mx-auto mb-16 text-center">
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-4">
          {title}
        </h2>
        {description && (
          <p className="text-lg text-teal-300/80 max-w-2xl mx-auto">
            {description}
          </p>
        )}
      </div>

      {/* Properties Grid */}
      <div className="max-w-7xl mx-auto">
        {properties.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-teal-300/60 text-lg">No properties available at the moment.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {properties.map((property) => (
              <div key={property.id} className="h-full">
                <PropertyCard
                  property={property}
                  onInquire={() => handleInquire(property)}
                />
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Inquiry Form Modal */}
      {selectedProperty && (
        <PropertyInquiryForm
          property={selectedProperty}
          isOpen={inquireOpen}
          onClose={() => setInquireOpen(false)}
        />
      )}

      {/* Decorative Elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-72 h-72 bg-teal-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-yellow-500/5 rounded-full blur-3xl"></div>
      </div>
    </section>
  );
}
