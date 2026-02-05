'use client';
import { useState, useEffect } from 'react';
import { Cookie, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CookieBanner() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    // Verificar si ya aceptó cookies antes
    const consent = localStorage.getItem('cookieConsent');
    if (!consent) {
      setTimeout(() => setIsVisible(true), 2000); // Mostrar a los 2 segs
    }
  }, []);

  const acceptCookies = () => {
    localStorage.setItem('cookieConsent', 'true');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div 
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-50"
        >
          <div className="bg-[#111] border border-[#333] p-6 rounded-2xl shadow-2xl flex flex-col gap-4 relative">
            <button 
              onClick={() => setIsVisible(false)} 
              className="absolute top-2 right-2 text-gray-500 hover:text-white"
            >
              <X size={16} />
            </button>
            
            <div className="flex items-center gap-3">
              <div className="bg-[#FFD700]/20 p-2 rounded-lg text-[#FFD700]">
                <Cookie size={24} />
              </div>
              <h3 className="font-bold text-white">Usamos Cookies</h3>
            </div>
            
            <p className="text-xs text-gray-400 leading-relaxed">
              Utilizamos cookies para mejorar tu experiencia y analizar el tráfico del cuervo. 
              Al continuar, aceptas nuestra política de privacidad.
            </p>
            
            <div className="flex gap-2">
              <button 
                onClick={acceptCookies}
                className="flex-1 bg-[#FFD700] text-black font-bold py-2 rounded hover:bg-[#e6c200] transition text-xs uppercase"
              >
                Aceptar
              </button>
              <button 
                onClick={() => setIsVisible(false)}
                className="flex-1 border border-[#333] text-gray-300 font-bold py-2 rounded hover:bg-[#222] transition text-xs uppercase"
              >
                Rechazar
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}