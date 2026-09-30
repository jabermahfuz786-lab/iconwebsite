export type Language = 'bn' | 'en' | 'ar';

export type ProjectCategory = 'makkah' | 'madinah' | 'oman' | 'bangladesh' | 'upcoming' | 'completed';
export type PropertyType = 'land' | 'flat' | 'hotel' | 'building';
export type ConstructionStatus = 'ready' | 'under_construction' | 'upcoming';
export type PaymentType = 'cash' | 'installment';
export type EngagementType = 'ownership' | 'investment';
export type Currency = 'SAR' | 'OMR' | 'BDT' | 'USD';
export type StatusBadge = 'available' | 'upcoming' | 'sold_out' | 'completed';

export interface Project {
  id: string;
  name: string;
  slug: string;
  category: ProjectCategory;
  country: string;
  city: string;
  property_type: PropertyType;
  construction_status: ConstructionStatus;
  land_size: string | null;
  unit_size: string | null;
  starting_price: number;
  price_currency: Currency;
  payment_type: PaymentType;
  engagement_type: EngagementType;
  installment_plan: string | null;
  available_units: number;
  total_units: number;
  construction_progress: number;
  expected_completion: string | null;
  ownership_info: string | null;
  map_lat: number | null;
  map_lng: number | null;
  map_url: string | null;
  brochure_url: string | null;
  description: string | null;
  is_public: boolean;
  status_badge: StatusBadge;
  featured: boolean;
  sort_order: number;
  created_at: string;
  updated_at: string;
}

export interface ProjectImage {
  id: string;
  project_id: string;
  url: string;
  type: 'image' | 'video';
  sort_order: number;
}

export interface ProjectFacility {
  id: string;
  project_id: string;
  name: string;
  icon: string | null;
  sort_order: number;
}

export interface InvestmentApplication {
  id?: string;
  full_name: string;
  country: string;
  mobile: string;
  email: string;
  interested_project?: string;
  investment_type?: string;
  proposed_amount?: number;
  preferred_currency: Currency;
  payment_preference: PaymentType;
  preferred_meeting_time?: string;
  message?: string;
}

export interface UmrahAgency {
  id?: string;
  agency_name: string;
  country: string;
  license_number: string;
  contact_person: string;
  monthly_passenger_volume?: number;
  required_visa_quantity?: number;
  services_required: string[];
  document_url?: string;
  whatsapp_link?: string;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  excerpt: string | null;
  content: string;
  image_url: string | null;
  category: string;
  is_published: boolean;
  created_at: string;
  updated_at: string;
}

export interface Investor {
  id: string;
  email: string;
  investor_code: string;
  full_name: string;
  phone: string | null;
  country: string | null;
  nominee_name: string | null;
  nominee_relation: string | null;
  nominee_phone: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface Investment {
  id: string;
  investor_id: string;
  project_id: string | null;
  project_name: string;
  investment_amount: number;
  paid_amount: number;
  due_amount: number;
  currency: Currency;
  next_installment_date: string | null;
  next_installment_amount: number | null;
  profit_distributed: number;
  agreement_url: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

export interface InvestmentDocument {
  id: string;
  investment_id: string;
  document_type: 'agreement' | 'receipt' | 'other';
  title: string;
  file_url: string;
  created_at: string;
}

export interface InvestorNotice {
  id: string;
  investor_id: string | null;
  title: string;
  body: string;
  is_read: boolean;
  created_at: string;
}

export interface InvestorMeeting {
  id?: string;
  investor_id: string;
  requested_date: string;
  requested_time: string;
  topic: string;
  notes?: string;
  status: string;
}

export interface ContactMessage {
  id?: string;
  name: string;
  email: string;
  phone?: string;
  subject?: string;
  message: string;
}

export interface ExpatServiceRequest {
  id?: string;
  service_type: string;
  description: string;
  document_url?: string;
  contact_name?: string;
  contact_phone?: string;
}

export interface BusinessInquiry {
  id?: string;
  inquiry_type: string;
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
}
