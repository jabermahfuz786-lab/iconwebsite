import { MessageCircle } from 'lucide-react';
import { whatsappLink } from '@/lib/supabase';

export default function WhatsAppFloat() {
  return (
    <a
      href={whatsappLink('আসসালামু আলাইকুম, আমি মাই আইকন সেবা সম্পর্কে জানতে চাই।')}
      target="_blank"
      rel="noopener noreferrer"
      className="whatsapp-float"
      aria-label="WhatsApp"
    >
      <MessageCircle className="w-6 h-6 text-white" fill="white" />
    </a>
  );
}
