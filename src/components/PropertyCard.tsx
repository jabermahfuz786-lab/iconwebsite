'use client';

import React, { useState } from 'react';
import { Property } from '@/types/property';
import { FaBed, FaBath, FaRuler, FaPhone, FaEnvelope, FaStar } from 'react-icons/fa';

interface PropertyCardProps {
  property: Property;
  onInquire?: (property: Property) => void;
}

export default function PropertyCard({ property, onInquire }: PropertyCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const [showInquireForm, setShowInquireForm] = useState(false);

  return (
    <div
      className="relative group overflow-hidden rounded-2xl transition-all duration-500"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Glass-morphism Background with Glow */}
      <div
        className={`absolute inset-0 bg-gradient-to-br from-teal-900/40 via-slate-900/60 to-slate-950/80 
        backdrop-blur-xl border border-teal-500/30 transition-all duration-500
        ${isHovered ? 'border-yellow-500/60 shadow-2xl shadow-yellow-500/20' : 'shadow-xl'}`}
        style={{
          boxShadow: isHovered
            ? '0 0 40px rgba(255,214,10, 0.3), inset 0 1px 0 rgba(255,255,255,0.1)'
            : '0 0 20px rgba(13, 148, 136, 0.2), inset 0 1px 0 rgba(255,255,255,0.05)',
        }}
      />

      {/* Content Container */}
      <div className="relative z-10 p-6">
        {/* Image Section */}
        <div className="relative h-48 mb-4 rounded-xl overflow-hidden group/image">
          <img
            src={property.image}
            alt={property.title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover/image:scale-110"
          />
          {/* Featured Badge */}
          {property.featured && (
            <div className="absolute top-3 right-3 bg-yellow-500/80 text-slate-900 px-3 py-1 rounded-full text-sm font-bold backdrop-blur-sm">
              Featured
            </div>
          )}
          {/* Rating Badge */}
          {property.rating && (
            <div className="absolute bottom-3 right-3 bg-teal-500/80 text-white px-3 py-1 rounded-full text-sm flex items-center gap-1 backdrop-blur-sm">
              <FaStar className="w-3 h-3" />
              {property.rating}
            </div>
          )}
        </div>

        {/* Title & Location */}
        <h3 className="text-xl font-bold text-white mb-2 line-clamp-2 group-hover:text-yellow-300 transition-colors">
          {property.title}
        </h3>
        <p className="text-teal-300 text-sm mb-3 flex items-center gap-2">
          📍 {property.location}
        </p>

        {/* Price */}
        <div className="mb-4 pb-4 border-b border-teal-500/30">
          <p className="text-3xl font-bold text-yellow-400">
            {property.currency} {property.price.toLocaleString()}
          </p>
        </div>

        {/* Property Features */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="flex items-center gap-2 text-teal-200">
            <FaBed className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">{property.bedrooms} Beds</span>
          </div>
          <div className="flex items-center gap-2 text-teal-200">
            <FaBath className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">{property.bathrooms} Baths</span>
          </div>
          <div className="flex items-center gap-2 text-teal-200">
            <FaRuler className="w-4 h-4 text-yellow-400" />
            <span className="text-sm">{property.area} {property.areaUnit}</span>
          </div>
        </div>

        {/* Description */}
        <p className="text-teal-100/80 text-sm mb-4 line-clamp-2 h-10">
          {property.description}
        </p>

        {/* Agent Info */}
        <div className="bg-teal-900/40 backdrop-blur-sm border border-teal-500/20 rounded-lg p-3 mb-4">
          <p className="text-white font-semibold text-sm mb-2">{property.agentName}</p>
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-teal-200 text-xs">
              <FaPhone className="w-3 h-3 text-yellow-400" />
              <a href={`tel:${property.agentPhone}`} className="hover:text-yellow-300 transition">
                {property.agentPhone}
              </a>
            </div>
            {property.agentEmail && (
              <div className="flex items-center gap-2 text-teal-200 text-xs">
                <FaEnvelope className="w-3 h-3 text-yellow-400" />
                <a href={`mailto:${property.agentEmail}`} className="hover:text-yellow-300 transition">
                  {property.agentEmail}
                </a>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={() => setShowInquireForm(true)}
            className="flex-1 bg-gradient-to-r from-yellow-500 to-yellow-600 hover:from-yellow-400 hover:to-yellow-500 
            text-slate-900 font-bold py-2 rounded-lg transition-all duration-300 
            transform hover:scale-105 shadow-lg hover:shadow-yellow-500/50"
          >
            Inquire Now
          </button>
          <button
            className="px-4 py-2 border border-teal-400/50 text-teal-300 hover:text-white hover:border-yellow-400 
            rounded-lg transition-all duration-300 font-semibold"
          >
            Details
          </button>
        </div>

        {/* Quick Contact - Hovered State */}
        {isHovered && (
          <div className="mt-4 pt-4 border-t border-teal-500/30 text-center">
            <p className="text-teal-300 text-xs mb-2">Quick Contact</p>
            <div className="flex gap-2 justify-center">
              <a
                href={`https://wa.me/${property.agentPhone.replace(/\D/g, '')}`}
                className="px-3 py-1 bg-teal-500/40 hover:bg-teal-500/70 text-white rounded text-xs transition"
              >
                WhatsApp
              </a>
              <a
                href={`tel:${property.agentPhone}`}
                className="px-3 py-1 bg-yellow-500/40 hover:bg-yellow-500/70 text-white rounded text-xs transition"
              >
                Call
              </a>
            </div>
          </div>
        )}
      </div>

      {/* Glowing Border Animation */}
      <div
        className="absolute inset-0 rounded-2xl pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300"
        style={{
          backgroundImage: `conic-gradient(from 0deg, transparent, rgba(255,214,10, 0.3), transparent 50%)`,
        }}
      />
    </div>
  );
}
