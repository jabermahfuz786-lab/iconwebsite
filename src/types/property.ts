// Property type definitions
export interface Property {
  id: string;
  title: string;
  location: string;
  price: number;
  currency: string;
  image: string;
  bedrooms: number;
  bathrooms: number;
  area: number;
  areaUnit: string;
  description: string;
  agentName: string;
  agentPhone: string;
  agentEmail?: string;
  amenities?: string[];
  featured?: boolean;
  rating?: number;
}

export interface InquiryFormData {
  name: string;
  email: string;
  phone: string;
  message: string;
  propertyId: string;
}

export interface N8nWebhookPayload {
  type: 'property_inquiry';
  property: Property;
  inquiry: InquiryFormData;
  timestamp: string;
  source: 'website';
}
