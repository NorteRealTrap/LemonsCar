import { MessageCircle } from 'lucide-react@0.487.0';
import { useSiteData } from '../contexts/SiteDataContext';

export function WhatsAppButton() {
  const { settings } = useSiteData();
  
  // Remover formatação do telefone para criar link do WhatsApp
  const phoneNumber = settings.whatsapp.replace(/\D/g, '');
  const whatsappLink = `https://wa.me/55${phoneNumber}`;

  return (
    <a
      href={whatsappLink}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-40 bg-green-500 hover:bg-green-600 text-white rounded-full p-4 shadow-lg hover:shadow-xl transition-all duration-300 transform hover:scale-110 animate-bounce-slow group"
      aria-label="Falar no WhatsApp"
    >
      <MessageCircle className="w-6 h-6" />
      
      {/* Tooltip */}
      <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-black text-white px-3 py-2 rounded-lg text-sm whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
        Fale conosco no WhatsApp
        <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-full border-8 border-transparent border-l-black"></div>
      </div>

      {/* Badge de notificação (opcional) */}
      <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center animate-pulse">
        !
      </span>
    </a>
  );
}