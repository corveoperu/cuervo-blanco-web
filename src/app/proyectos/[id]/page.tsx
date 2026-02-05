'use client';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Download, ShoppingCart, Code, Cpu, ChevronLeft } from 'lucide-react';
// IMPORTAMOS LOS DATOS
import projectsData from '@/data/projects.json';

export default function ProjectDetail() {
  const { id } = useParams();
  
  // BUSCAMOS EN EL JSON
  const project = projectsData.find(p => p.id === Number(id));

  if (!project) return <div className="text-white text-center py-20 min-h-screen pt-32">Proyecto no encontrado en la base de datos.</div>;

  return (
    <div className="min-h-screen bg-[#050505] py-20 px-4">
      <div className="max-w-7xl mx-auto">
        <Link href="/proyectos" className="text-gray-400 hover:text-[#FFD700] flex items-center gap-2 mb-8 transition">
          <ChevronLeft size={20} /> Volver a Proyectos
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          
          <div className="space-y-8">
            <div className="rounded-2xl overflow-hidden border border-[#333] shadow-2xl relative">
              <img src={project.image} alt={project.title} className="w-full h-auto object-cover" />
              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur text-[#FFD700] px-4 py-1 rounded-full text-sm font-bold border border-[#FFD700]/30">
                {project.level}
              </div>
            </div>
            
            <div>
              <h1 className="text-4xl font-bold text-white mb-4">{project.title}</h1>
              <p className="text-gray-300 leading-relaxed text-lg">{project.desc}</p>
            </div>

            <div className="bg-[#111] p-6 rounded-xl border border-[#333]">
              <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
                <Cpu className="text-[#FFD700]" /> Componentes Necesarios
              </h3>
              <ul className="space-y-2 mb-6">
                {project.components.map((comp, i) => (
                  <li key={i} className="text-gray-400 flex items-center gap-2">
                    <span className="w-1.5 h-1.5 bg-[#FFD700] rounded-full"></span> {comp}
                  </li>
                ))}
              </ul>
              
              <Link href="/tienda" className="w-full bg-[#1a1a1a] border border-[#333] hover:border-[#FFD700] text-gray-300 hover:text-[#FFD700] py-3 rounded flex items-center justify-center gap-2 transition group">
                <ShoppingCart size={18} />
                <span className="font-bold">¿Te faltan componentes? Ir a la tienda</span>
              </Link>
            </div>

            {/* Enlace de descarga dinámico desde el JSON */}
            <a href={project.downloadLink} download className="w-full bg-[#FFD700] text-black font-bold py-4 rounded hover:bg-[#e6c200] transition flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(255,215,0,0.3)] cursor-pointer">
              <Download size={20} /> Descargar Archivos (.zip)
            </a>
          </div>

          <div className="bg-[#111] rounded-xl border border-[#333] overflow-hidden flex flex-col h-full max-h-[800px]">
            <div className="bg-[#1a1a1a] p-4 border-b border-[#333] flex justify-between items-center">
              <div className="flex items-center gap-2 text-gray-300">
                <Code size={18} className="text-[#FFD700]" />
                <span className="font-mono text-sm">Código Fuente</span>
              </div>
              <div className="flex gap-2">
                <div className="w-3 h-3 rounded-full bg-red-500"></div>
                <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                <div className="w-3 h-3 rounded-full bg-green-500"></div>
              </div>
            </div>
            
            <div className="p-6 overflow-auto custom-scrollbar flex-1 bg-[#0a0a0a]">
              <pre className="font-mono text-sm text-green-400 whitespace-pre-wrap">
                <code>{project.code}</code>
              </pre>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}