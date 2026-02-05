'use client';
import { MessageCircle } from 'lucide-react';

export default function WhatsAppButton() {
  const phoneNumber = "51955599041"; // Reemplaza con tu número real
  const message = "Hola Cuervo Blanco, estoy interesado en sus servicios.";

  return (
    <a
      href={`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`}
      target="_blank"
      rel="noopener noreferrer"
      className="fixed bottom-6 right-6 z-50 group"
      title="Chatear por WhatsApp"
    >
      {/* Efecto de Onda (Pulse) */}
      <span className="absolute inline-flex h-full w-full rounded-full bg-green-500 opacity-75 animate-ping"></span>
      
      {/* Botón */}
      <div className="relative bg-green-500 w-14 h-14 rounded-full flex items-center justify-center text-white shadow-lg hover:bg-green-600 transition-transform hover:scale-110 duration-300">
        <MessageCircle size={32} fill="white" />
      </div>

      {/* Tooltip Lateral */}
      <div className="absolute right-16 top-1/2 -translate-y-1/2 bg-white text-black text-xs font-bold px-3 py-1.5 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap shadow-lg pointer-events-none">
        ¡Hablemos!
      </div>
    </a>
  );
}