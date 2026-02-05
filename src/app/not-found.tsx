import Link from 'next/link';
import { AlertTriangle, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#050505] text-center px-4">
      <div className="relative">
        <h1 className="text-[150px] font-black text-[#111] leading-none select-none">404</h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <AlertTriangle className="w-24 h-24 text-[#FFD700]" />
        </div>
      </div>
      
      <h2 className="text-3xl font-bold text-white mt-8 mb-4">Página no encontrada</h2>
      <p className="text-gray-400 max-w-md mb-8">
        Parece que el circuito que buscas está desconectado o no existe.
        Regresa a la base para reiniciar.
      </p>

      <Link 
        href="/" 
        className="bg-[#FFD700] text-black px-8 py-3 rounded font-bold hover:bg-[#e6c200] transition flex items-center gap-2 uppercase tracking-wide"
      >
        <Home size={20} /> Volver al Inicio
      </Link>
    </div>
  );
}