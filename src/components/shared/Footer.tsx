'use client';
import Link from 'next/link';
import { CircuitBoard, Facebook, Instagram, Linkedin, Bird } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-[#111] border-t border-white/10 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        
        {/* Columna 1: Marca */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bird className="text-[#FFD700] h-8 w-8" />
            <span className="text-xl font-bold tracking-wider text-white">CORVEO</span>
          </div>
          <p className="text-gray-400 text-sm leading-relaxed">
            Ingeniería electrónica de vanguardia. Diseñamos el futuro, reparamos el presente y educamos a la siguiente generación.
          </p>
        </div>
        
        {/* Columna 2: Navegación */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Explorar</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link href="/tienda" className="hover:text-[#FFD700] transition">Tienda Oficial</Link></li>
            <li><Link href="/proyectos" className="hover:text-[#FFD700] transition">La Academia (Gratis)</Link></li>
            <li><Link href="/encargos" className="hover:text-[#FFD700] transition">Servicios de Ingeniería</Link></li>
            <li><Link href="/reparaciones" className="hover:text-[#FFD700] transition">Centro de Reparaciones</Link></li>
          </ul>
        </div>

        {/* Columna 3: Soporte y Legal */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Soporte</h3>
          <ul className="space-y-2 text-gray-400 text-sm">
            <li><Link href="/faq" className="hover:text-[#FFD700] transition">Preguntas Frecuentes</Link></li>
            <li><Link href="/contacto" className="hover:text-[#FFD700] transition">Contáctanos</Link></li>
            <li><Link href="/legal" className="hover:text-[#FFD700] transition">Términos y Condiciones</Link></li>
            <li><Link href="/legal" className="hover:text-[#FFD700] transition">Libro de Reclamaciones</Link></li>
          </ul>
        </div>

        {/* Columna 4: Redes */}
        <div>
          <h3 className="text-white font-bold mb-4 uppercase tracking-wider text-sm">Comunidad</h3>
          <div className="flex gap-4">
            <a href="#" className="bg-[#222] p-2 rounded-full text-gray-400 hover:text-[#FFD700] hover:bg-black transition">
              <Instagram size={20} />
            </a>
            <a href="#" className="bg-[#222] p-2 rounded-full text-gray-400 hover:text-[#FFD700] hover:bg-black transition">
              <Facebook size={20} />
            </a>
            <a href="#" className="bg-[#222] p-2 rounded-full text-gray-400 hover:text-[#FFD700] hover:bg-black transition">
              <Linkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 text-center text-gray-600 text-xs border-t border-white/5 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
        <p>© 2026 Corveo. Todos los derechos reservados.</p>
        <p>Lima, Perú</p>
      </div>
    </footer>
  );
}