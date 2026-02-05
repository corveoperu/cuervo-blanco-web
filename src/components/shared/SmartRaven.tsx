'use client';
import { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { Bird } from 'lucide-react';
import { usePathname } from 'next/navigation';

export default function SmartRaven() {
  const pathname = usePathname();
  const controls = useAnimation();
  const [position, setPosition] = useState({ x: 50, y: 20 }); // Posición inicial (arriba izquierda)
  const [isFlying, setIsFlying] = useState(false);
  const [direction, setDirection] = useState(1); // 1: derecha, -1: izquierda

  // --- LÓGICA DE MOVIMIENTO ---
  const flyToRandomSpot = async () => {
    setIsFlying(true);
    
    // Calcular límites de la pantalla (seguro para no salirse)
    // Dejamos un margen de 100px para que no quede pegado al borde
    const maxWidth = typeof window !== 'undefined' ? window.innerWidth - 100 : 1000;
    const maxHeight = typeof window !== 'undefined' ? window.innerHeight - 150 : 800;

    // Generar nueva posición aleatoria (Preferimos los bordes para no tapar contenido)
    const randomX = Math.random() * maxWidth;
    // 80% de probabilidad de ir a la parte superior (header) o inferior (footer)
    const isEdge = Math.random() > 0.2; 
    const randomY = isEdge 
      ? (Math.random() > 0.5 ? Math.random() * 100 : maxHeight - Math.random() * 100) 
      : Math.random() * maxHeight;

    // Determinar dirección para voltear el icono
    setDirection(randomX > position.x ? 1 : -1);

    // Animación de vuelo
    await controls.start({
      x: randomX,
      y: randomY,
      transition: { 
        type: "spring", 
        stiffness: 50, 
        damping: 15, 
        duration: 2 
      }
    });

    setPosition({ x: randomX, y: randomY });
    setIsFlying(false);
  };

  // 1. Volar al cambiar de ruta (Pestaña)
  useEffect(() => {
    // Pequeño delay para que no sea inmediato al cargar
    const timer = setTimeout(() => {
      flyToRandomSpot();
    }, 500);
    return () => clearTimeout(timer);
  }, [pathname]);

  // 2. Inicializar posición
  useEffect(() => {
    flyToRandomSpot();
  }, []);

  return (
    <motion.div
      animate={controls}
      initial={{ x: 50, y: 20 }}
      className="fixed z-[60] cursor-pointer touch-none" // Z-index alto para estar sobre todo
      onClick={flyToRandomSpot} // Volar al hacer clic
      whileHover={{ scale: 1.2 }}
      title="Soy Cuervo, tu asistente. ¡Hazme clic!"
    >
      <motion.div
        // Animación constante de "flotar" cuando está quieto
        animate={isFlying ? {
          y: [0, -10, 0, -10, 0], // Aleteo frenético al volar
          rotate: [0, 5, -5, 5, 0],
          scaleY: [1, 0.8, 1, 0.8, 1] // Simula aleteo aplastándose
        } : {
          y: [0, -10, 0], // Flotar suave al estar quieto
        }}
        transition={isFlying ? {
          duration: 0.5,
          repeat: Infinity
        } : {
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        style={{ scaleX: direction * -1 }} // Voltear según dirección (-1 para mirar a la derecha si el icono es zurdo)
      >
        <div className="relative group">
          {/* El Cuervo */}
          <Bird size={48} className={`text-[#FFD700] drop-shadow-[0_0_10px_rgba(255,215,0,0.5)] ${isFlying ? 'opacity-100' : 'opacity-80'}`} />
          
          {/* Globo de texto (Tooltip) opcional */}
          {!isFlying && (
            <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-white text-black text-[10px] font-bold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap pointer-events-none">
              ¡Clic para volar!
            </div>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}