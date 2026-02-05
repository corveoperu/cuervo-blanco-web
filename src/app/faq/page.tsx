'use client';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Minus, HelpCircle, MessageCircle, Star, ThumbsUp, ThumbsDown, Filter, Send, User } from 'lucide-react';

// Preguntas Frecuentes (Estáticas)
const faqs = [
  { question: "¿Hacen envíos a todo el Perú?", answer: "Sí, trabajamos con Shalom y Olva Courier. Los envíos a Lima llegan en 24h y a provincia en 48-72h." },
  { question: "¿Cuánto cuesta el diagnóstico?", answer: "El diagnóstico es GRATUITO si realizas la reparación. De lo contrario, cuesta S/ 30." },
  { question: "¿Qué garantía tienen?", answer: "12 meses de garantía por defectos de fábrica en productos nuevos y 6 meses en reparaciones." },
  { question: "¿Medios de pago?", answer: "Aceptamos Tarjetas, Yape, Plin y Transferencia Bancaria." }
];

// Datos Iniciales de Reseñas
const initialReviews = [
  { id: 1, name: "Carlos Mendoza", date: "Hace 2 días", rating: 5, comment: "Me salvaron el semestre con el kit Arduino. Excelente atención.", helpful: 12, notHelpful: 0 },
  { id: 2, name: "Lucía P.", date: "Hace 1 semana", rating: 4, comment: "Buen producto, pero el envío demoró un día más de lo esperado.", helpful: 5, notHelpful: 1 },
  { id: 3, name: "Taller Mecánico VR", date: "Hace 3 semanas", rating: 5, comment: "Repararon nuestra controladora industrial en tiempo récord. Profesionales.", helpful: 20, notHelpful: 0 },
];

export default function FAQPage() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);
  
  // ESTADOS DE RESEÑAS
  const [reviews, setReviews] = useState(initialReviews);
  const [filterRating, setFilterRating] = useState<number | 'all'>('all');
  
  // ESTADOS DEL FORMULARIO
  const [newReview, setNewReview] = useState({ name: '', comment: '', rating: 5 });
  const [hoverRating, setHoverRating] = useState(0); // Para efecto visual al pasar mouse por estrellas

  // 1. Enviar Reseña
  const handleSubmitReview = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newReview.name || !newReview.comment) return;

    const reviewObj = {
      id: Date.now(),
      name: newReview.name,
      date: "Justo ahora",
      rating: newReview.rating,
      comment: newReview.comment,
      helpful: 0,
      notHelpful: 0
    };

    setReviews([reviewObj, ...reviews]); // Agregar al inicio
    setNewReview({ name: '', comment: '', rating: 5 }); // Limpiar
  };

  // 2. Votar Utilidad (Manito Arriba/Abajo)
  const handleVote = (id: number, type: 'up' | 'down') => {
    setReviews(reviews.map(r => {
      if (r.id === id) {
        return type === 'up' 
          ? { ...r, helpful: r.helpful + 1 } 
          : { ...r, notHelpful: r.notHelpful + 1 };
      }
      return r;
    }));
  };

  // 3. Filtrar Reseñas
  const filteredReviews = filterRating === 'all' 
    ? reviews 
    : reviews.filter(r => r.rating === filterRating);

  return (
    <div className="min-h-screen bg-[#050505] py-24 px-4">
      <div className="max-w-5xl mx-auto">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <HelpCircle className="w-16 h-16 text-[#FFD700] mx-auto mb-4" />
          <h1 className="text-4xl font-bold text-white mb-4">CENTRO DE <span className="text-[#FFD700]">AYUDA</span></h1>
          <p className="text-gray-400">Preguntas frecuentes y experiencias de la comunidad.</p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* COLUMNA IZQUIERDA: FAQ ACORDEÓN (5 columnas) */}
          <div className="lg:col-span-5 space-y-4 h-fit sticky top-24">
            <h3 className="text-xl font-bold text-white mb-4 flex items-center gap-2">
              <MessageCircle className="text-[#FFD700]" /> Preguntas Frecuentes
            </h3>
            {faqs.map((faq, i) => (
              <div key={i} className="bg-[#111] border border-[#333] rounded-xl overflow-hidden">
                <button 
                  onClick={() => setOpenIndex(openIndex === i ? null : i)}
                  className="w-full flex justify-between items-center p-4 text-left hover:bg-white/5 transition"
                >
                  <span className={`font-bold text-sm ${openIndex === i ? 'text-[#FFD700]' : 'text-gray-300'}`}>
                    {faq.question}
                  </span>
                  {openIndex === i ? <Minus size={16} className="text-[#FFD700]" /> : <Plus size={16} className="text-gray-500" />}
                </button>
                <AnimatePresence>
                  {openIndex === i && (
                    <motion.div initial={{ height: 0 }} animate={{ height: "auto" }} exit={{ height: 0 }}>
                      <div className="px-4 pb-4 text-gray-400 text-sm border-t border-[#222] pt-3 leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>

          {/* COLUMNA DERECHA: SISTEMA DE RESEÑAS (7 columnas) */}
          <div className="lg:col-span-7">
            
            {/* 1. FORMULARIO DE NUEVA RESEÑA */}
            <div className="bg-[#111] border border-[#333] rounded-2xl p-6 mb-10 shadow-xl">
              <h3 className="text-xl font-bold text-white mb-4">Deja tu opinión</h3>
              <form onSubmit={handleSubmitReview} className="space-y-4">
                <div className="flex gap-4">
                  <div className="flex-1">
                    <input 
                      type="text" 
                      placeholder="Tu Nombre" 
                      value={newReview.name}
                      onChange={e => setNewReview({...newReview, name: e.target.value})}
                      className="w-full bg-black border border-[#333] p-3 rounded-lg text-white focus:border-[#FFD700] outline-none text-sm"
                    />
                  </div>
                  {/* Selector de Estrellas Interactivo */}
                  <div className="flex items-center gap-1 bg-black border border-[#333] px-3 rounded-lg">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        type="button"
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setNewReview({...newReview, rating: star})}
                        className="transition-transform hover:scale-110"
                      >
                        <Star 
                          size={20} 
                          className={`${star <= (hoverRating || newReview.rating) ? "fill-[#FFD700] text-[#FFD700]" : "text-gray-600"}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>
                <textarea 
                  placeholder="Cuéntanos tu experiencia con Cuervo Blanco..." 
                  rows={3}
                  value={newReview.comment}
                  onChange={e => setNewReview({...newReview, comment: e.target.value})}
                  className="w-full bg-black border border-[#333] p-3 rounded-lg text-white focus:border-[#FFD700] outline-none resize-none text-sm"
                ></textarea>
                <button type="submit" className="bg-[#FFD700] text-black font-bold py-2 px-6 rounded-lg hover:bg-[#e6c200] transition flex items-center gap-2 text-sm ml-auto">
                  Publicar Reseña <Send size={16} />
                </button>
              </form>
            </div>

            {/* 2. BARRA DE FILTROS */}
            <div className="flex flex-wrap items-center gap-2 mb-6 border-b border-[#333] pb-4">
              <div className="flex items-center gap-2 text-gray-400 mr-4 text-sm font-bold uppercase">
                <Filter size={16} /> Filtrar por:
              </div>
              <button 
                onClick={() => setFilterRating('all')}
                className={`px-3 py-1 rounded-full text-xs font-bold transition ${filterRating === 'all' ? 'bg-white text-black' : 'bg-[#222] text-gray-400 hover:text-white'}`}
              >
                Todas
              </button>
              {[5, 4, 3, 2, 1].map(num => (
                <button 
                  key={num}
                  onClick={() => setFilterRating(num)}
                  className={`px-3 py-1 rounded-full text-xs font-bold transition flex items-center gap-1 ${filterRating === num ? 'bg-[#FFD700] text-black' : 'bg-[#222] text-gray-400 hover:text-white'}`}
                >
                  {num} <Star size={10} fill="currentColor" />
                </button>
              ))}
            </div>

            {/* 3. LISTA DE RESEÑAS */}
            <div className="space-y-4">
              {filteredReviews.length === 0 ? (
                <div className="text-center py-10 text-gray-500">No hay reseñas con esta calificación.</div>
              ) : (
                filteredReviews.map((review) => (
                  <motion.div 
                    key={review.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-[#111] border border-[#333] p-5 rounded-2xl hover:border-[#FFD700]/30 transition"
                  >
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-gray-800 to-black rounded-full flex items-center justify-center border border-[#333]">
                          <User size={18} className="text-gray-400" />
                        </div>
                        <div>
                          <h4 className="font-bold text-white text-sm">{review.name}</h4>
                          <span className="text-xs text-gray-500">{review.date}</span>
                        </div>
                      </div>
                      <div className="flex gap-0.5">
                        {[...Array(5)].map((_, i) => (
                          <Star key={i} size={14} className={`${i < review.rating ? "fill-[#FFD700] text-[#FFD700]" : "text-gray-700"}`} />
                        ))}
                      </div>
                    </div>
                    
                    <p className="text-gray-300 text-sm leading-relaxed mb-4 pl-[52px]">
                      "{review.comment}"
                    </p>

                    {/* BOTONES ÚTIL / NO ÚTIL */}
                    <div className="flex items-center gap-4 pl-[52px]">
                      <button 
                        onClick={() => handleVote(review.id, 'up')}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-green-500 transition group"
                      >
                        <ThumbsUp size={14} className="group-hover:scale-110 transition" />
                        <span>Es útil ({review.helpful})</span>
                      </button>
                      <button 
                        onClick={() => handleVote(review.id, 'down')}
                        className="flex items-center gap-1.5 text-xs text-gray-500 hover:text-red-500 transition group"
                      >
                        <ThumbsDown size={14} className="group-hover:scale-110 transition" />
                        <span>({review.notHelpful})</span>
                      </button>
                    </div>
                  </motion.div>
                ))
              )}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}