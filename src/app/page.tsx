'use client';
import BrandsMarquee from '@/components/shared/BrandsMarquee';
import Link from "next/link";
import { ArrowRight, ShoppingBag, Cpu, ShieldCheck, Zap, Users, Star } from "lucide-react";
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCart } from '@/context/CartContext';
import productsData from '@/data/products.json';

// Imágenes para el Slider del Hero
const HERO_IMAGES = [
  "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop", // Cyberpunk City
  "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop", // Electronics
  "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop"  // Engineering
];

export default function Home() {
  const { addToCart } = useCart();
  const [currentImage, setCurrentImage] = useState(0);

  // Rotar imágenes del Hero cada 5 segundos
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % HERO_IMAGES.length);
    }, 5000);
    return () => clearInterval(timer);
  }, []);

  // Seleccionar los Top 3 productos (simulado tomando los primeros 3)
  const bestSellers = productsData.slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-[#050505]">
      
      {/* 1. HERO SECTION CON SLIDER ANIMADO */}
      <section className="relative h-[90vh] flex items-center justify-center overflow-hidden">
        {/* Fondo con Transición */}
        <AnimatePresence mode='wait'>
          <motion.div
            key={currentImage}
            initial={{ opacity: 0, scale: 1.1 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.5 }}
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${HERO_IMAGES[currentImage]})` }}
          >
            {/* Overlay Gradiente */}
            <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/50 to-[#050505]"></div>
          </motion.div>
        </AnimatePresence>

        {/* Contenido Hero */}
        <div className="relative z-10 text-center px-4 max-w-5xl mx-auto space-y-8">
          <motion.div 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.5, duration: 0.8 }}
            className="inline-block bg-[#FFD700] text-black px-4 py-1 rounded-full font-bold text-sm uppercase tracking-widest mb-4"
          >
            Ingeniería & Innovación
          </motion.div>
          
          <motion.h1 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-6xl md:text-8xl font-black text-white tracking-tighter"
          >
            EL FUTURO ES <br/> <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-yellow-600">AHORA</span>
          </motion.h1>
          
          <motion.p 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 0.9, duration: 0.8 }}
            className="text-xl text-gray-300 max-w-2xl mx-auto leading-relaxed"
          >
            Somos CORVEO. Diseñamos soluciones electrónicas, reparamos lo imposible y formamos a la próxima generación de ingenieros.
          </motion.p>
          
          <motion.div 
            initial={{ y: 30, opacity: 0 }} 
            animate={{ y: 0, opacity: 1 }} 
            transition={{ delay: 1.1, duration: 0.8 }}
            className="flex flex-col sm:flex-row gap-4 justify-center pt-8"
          >
            <Link href="/tienda" className="bg-[#FFD700] text-black px-8 py-4 rounded-full font-bold hover:bg-[#e6c200] transition flex items-center justify-center gap-2 hover:scale-105 duration-300 shadow-[0_0_20px_rgba(255,215,0,0.4)]">
              Ver Tienda <ShoppingBag className="w-5 h-5"/>
            </Link>
            <Link href="/proyectos" className="bg-white/10 backdrop-blur border border-white/20 text-white px-8 py-4 rounded-full font-bold hover:bg-white hover:text-black transition flex items-center justify-center gap-2 hover:scale-105 duration-300">
              La Academia <Cpu className="w-5 h-5"/>
            </Link>
          </motion.div>
        </div>
      </section>

      {/* Banda de Marcas */}
      <BrandsMarquee />

      {/* 2. QUIÉNES SOMOS (DETALLE) */}
      <section className="py-24 px-4 bg-[#050505] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-1/3 h-full bg-[#FFD700]/5 blur-3xl pointer-events-none"></div>
        
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-16 items-center">
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-[#FFD700] to-orange-600 rounded-2xl opacity-30 group-hover:opacity-50 blur-lg transition duration-500"></div>
            <div className="relative rounded-2xl overflow-hidden border border-[#333] shadow-2xl aspect-video bg-gray-900">
               <img src="https://images.unsplash.com/photo-1581092334651-ddf26d9a09d0?auto=format&fit=crop&q=80&w=800" alt="Laboratorio" className="w-full h-full object-cover opacity-80 group-hover:opacity-100 transition duration-500 scale-105 group-hover:scale-100" />
            </div>
          </div>
          
          <div className="space-y-8">
            <h2 className="text-4xl md:text-5xl font-bold text-white">MÁS QUE UNA TIENDA, <span className="text-[#FFD700]">SOMOS MAKERS.</span></h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Fundada en el corazón de Lima, <strong>Corveo</strong> nació con una misión simple: democratizar el acceso a la tecnología avanzada. 
              No solo vendemos componentes; los usamos, los probamos y los llevamos al límite en nuestro laboratorio.
            </p>
            
            <div className="grid sm:grid-cols-2 gap-6">
              <div className="bg-[#111] p-6 rounded-xl border border-[#333] hover:border-[#FFD700] transition group">
                <ShieldCheck className="text-[#FFD700] mb-3 w-8 h-8 group-hover:scale-110 transition" />
                <h3 className="font-bold text-white mb-1">Garantía Real</h3>
                <p className="text-sm text-gray-500">Soporte técnico directo de ingenieros, no vendedores.</p>
              </div>
              <div className="bg-[#111] p-6 rounded-xl border border-[#333] hover:border-[#FFD700] transition group">
                <Zap className="text-[#FFD700] mb-3 w-8 h-8 group-hover:scale-110 transition" />
                <h3 className="font-bold text-white mb-1">Innovación Constante</h3>
                <p className="text-sm text-gray-500">Desarrollamos proyectos IoT y robótica a medida.</p>
              </div>
            </div>
            
            <div className="pt-4">
               <Link href="/encargos" className="text-[#FFD700] font-bold hover:underline flex items-center gap-2">
                 Conoce nuestros servicios de ingeniería <ArrowRight size={18}/>
               </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 3. BEST SELLERS (LOS 3 MÁS VENDIDOS) */}
      <section className="py-24 px-4 bg-[#0a0a0a]">
        <div className="max-w-7xl mx-auto">
          <div className="flex justify-between items-end mb-12">
            <div>
               <h2 className="text-4xl font-bold text-white mb-2">TOP <span className="text-[#FFD700]">VENTAS</span></h2>
               <p className="text-gray-400">Lo más solicitado por nuestra comunidad esta semana.</p>
            </div>
            <Link href="/tienda" className="hidden md:flex items-center gap-2 text-white hover:text-[#FFD700] transition font-bold">
               Ver Catálogo Completo <ArrowRight size={20}/>
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {bestSellers.map((p, i) => (
              <div key={p.id} className="group relative bg-[#111] border border-[#333] rounded-2xl overflow-hidden hover:border-[#FFD700] transition-all duration-300 hover:shadow-[0_0_30px_rgba(255,215,0,0.15)] flex flex-col">
                
                {/* Badge Top */}
                <div className="absolute top-4 left-4 z-20 bg-[#FFD700] text-black text-xs font-black px-3 py-1 rounded shadow-lg uppercase tracking-wider flex items-center gap-1">
                   <Star size={12} fill="black" /> Top #{i+1}
                </div>

                {/* Imagen */}
                <div className="relative h-64 overflow-hidden bg-gray-800">
                   <div 
                     className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" 
                     style={{ backgroundImage: `url(${p.image})` }}
                   ></div>
                   
                   {/* Overlay Acción */}
                   <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <button 
                        onClick={() => addToCart(p)}
                        className="bg-[#FFD700] text-black font-bold px-6 py-3 rounded-full hover:scale-105 transition transform translate-y-4 group-hover:translate-y-0 duration-300 flex items-center gap-2"
                      >
                        <ShoppingBag size={18} /> Agregar
                      </button>
                   </div>
                </div>

                {/* Info */}
                <div className="p-6 flex-1 flex flex-col justify-between">
                   <div>
                      <p className="text-xs text-gray-500 uppercase font-bold mb-1">{p.brand || 'Genérico'}</p>
                      <Link href={`/tienda/${p.id}`}>
                        <h3 className="font-bold text-white text-xl mb-2 hover:text-[#FFD700] transition">{p.name}</h3>
                      </Link>
                      <div className="flex gap-1 mb-4">
                        {[...Array(5)].map((_, j) => (
                          <Star key={j} size={14} className="text-[#FFD700] fill-[#FFD700]" />
                        ))}
                      </div>
                   </div>
                   <div className="flex justify-between items-center pt-4 border-t border-[#222]">
                      <span className="text-2xl font-bold text-white">${p.price}</span>
                      <Link href={`/tienda/${p.id}`} className="text-sm text-gray-400 hover:text-white transition">Ver Detalles</Link>
                   </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-12 text-center md:hidden">
            <Link href="/tienda" className="bg-[#111] border border-[#333] text-white px-8 py-3 rounded-full font-bold hover:bg-[#FFD700] hover:text-black transition inline-flex items-center gap-2">
               Ver Catálogo Completo <ArrowRight size={20}/>
            </Link>
          </div>
        </div>
      </section>

      {/* 4. STATS RAPIDOS */}
      <section className="py-20 border-t border-[#222]">
         <div className="max-w-7xl mx-auto px-4 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {[
              { num: "+500", label: "Proyectos Realizados" },
              { num: "100%", label: "Clientes Satisfechos" },
              { num: "+2000", label: "Productos Vendidos" },
              { num: "24/7", label: "Soporte Técnico" }
            ].map((s, i) => (
              <div key={i}>
                 <h4 className="text-4xl md:text-5xl font-black text-[#FFD700] mb-2">{s.num}</h4>
                 <p className="text-gray-500 font-medium uppercase tracking-wider text-sm">{s.label}</p>
              </div>
            ))}
         </div>
      </section>

    </div>
  );
}