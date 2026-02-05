import Link from 'next/link';
import { BrainCircuit, Zap, Flame, ArrowRight, Download, BookOpen } from 'lucide-react';
import projectsData from '@/data/projects.json';

export default function ProyectosPage() {
  const getProjectsByLevel = (level: string) => projectsData.filter(p => p.level === level);

  const categories = [
    {
      id: 'basico',
      title: 'Iniciado (Un paso a la vez)',
      filter: 'Básico',
      color: 'text-green-400',
      border: 'border-green-400',
      icon: <Zap />
    },
    {
      id: 'intermedio',
      title: 'Aprendiz (Puedes con esto?)',
      filter: 'Intermedio',
      color: 'text-[#FFD700]',
      border: 'border-[#FFD700]',
      icon: <BrainCircuit />
    },
    {
      id: 'avanzado',
      title: 'Maestro (Ponte serio)',
      filter: 'Avanzado',
      color: 'text-red-500',
      border: 'border-red-500',
      icon: <Flame />
    }
  ];

  return (
    <div className="min-h-screen bg-[#050505] pb-20">
      
      {/* HERO SECTION DE LA ACADEMIA */}
      <section className="relative py-24 px-4 overflow-hidden border-b border-[#333]">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFD700]/10 via-[#050505] to-[#050505]"></div>
        <div className="relative z-10 max-w-7xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 text-[#FFD700] px-4 py-1.5 rounded-full border border-[#FFD700]/30 text-sm font-bold mb-6 animate-pulse">
            <BookOpen size={16} /> TECNOLOGÍA PARA TODOS
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white tracking-tighter mb-6">
            LA <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-orange-500">ACADEMIA</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto mb-10 leading-relaxed">
            Nuestra misión es compartir el conocimiento. Accede a nuestra biblioteca de proyectos, 
            descarga el código fuente y aprende construyendo. <br/>
            <span className="text-white font-bold">Nada de costos. Solo pura ingeniería.</span>
          </p>
        </div>
      </section>

      {/* LISTA DE PROYECTOS */}
      <div className="max-w-7xl mx-auto px-4 mt-16 space-y-24">
        {categories.map((cat) => {
          const projects = getProjectsByLevel(cat.filter);
          if (projects.length === 0) return null;

          return (
            <section key={cat.id}>
              <div className="flex items-center gap-4 mb-10">
                <div className={`p-3 rounded-xl bg-[#111] border border-[#333] ${cat.color}`}>{cat.icon}</div>
                <div>
                  <h2 className="text-3xl font-bold text-white">{cat.title}</h2>
                  <p className="text-gray-500 text-sm">Proyectos diseñados para este nivel de habilidad.</p>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {projects.map((p) => (
                  <Link href={`/proyectos/${p.id}`} key={p.id} className="group relative bg-[#111] border border-[#333] rounded-2xl overflow-hidden hover:border-[#FFD700] transition duration-300 flex flex-col h-full hover:shadow-[0_0_30px_rgba(255,215,0,0.1)]">
                    
                    {/* Badge GRATIS */}
                    <div className="absolute top-4 left-4 z-20 bg-[#FFD700] text-black text-xs font-black px-3 py-1 rounded shadow-lg uppercase tracking-wider">
                      Gratis
                    </div>

                    <div className="h-56 bg-gray-800 bg-cover bg-center group-hover:scale-105 transition duration-700 relative" style={{ backgroundImage: `url(${p.image})` }}>
                      <div className="absolute inset-0 bg-gradient-to-t from-[#111] to-transparent opacity-80"></div>
                    </div>
                    
                    <div className="p-8 flex-1 flex flex-col justify-between relative z-10 -mt-10">
                      <div>
                        <h3 className="text-2xl font-bold text-white mb-3 group-hover:text-[#FFD700] transition">{p.title}</h3>
                        <p className="text-gray-400 text-sm mb-6 leading-relaxed line-clamp-3">{p.desc}</p>
                      </div>
                      
                      <div className="flex items-center justify-between pt-6 border-t border-[#222]">
                        <span className={`text-xs font-bold uppercase tracking-wider ${cat.color} flex items-center gap-1`}>
                          <Download size={14} /> Código + Diagramas
                        </span>
                        <span className="w-10 h-10 rounded-full bg-[#222] flex items-center justify-center group-hover:bg-[#FFD700] group-hover:text-black transition text-white">
                          <ArrowRight size={20} />
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            </section>
          );
        })}
      </div>
    </div>
  );
}