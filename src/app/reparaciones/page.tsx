'use client';
import { useState } from 'react';
import { Laptop, Monitor, Printer, Tv, Smartphone, Wrench, Search, CheckCircle, Clock, Truck, CreditCard, ChevronRight, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function ReparacionesPage() {
  // --- ESTADOS DEL RASTREADOR ---
  const [ticketCode, setTicketCode] = useState('');
  const [ticketStatus, setTicketStatus] = useState<any>(null);

  // Simulación de búsqueda de ticket
  const handleTrack = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulamos que encuentra un ticket (En un caso real, esto vendría del Backend)
    setTicketStatus({
      id: ticketCode,
      device: 'Laptop HP Pavilion',
      status: 2, // 0: Recibido, 1: Diagnóstico, 2: Reparando, 3: Listo, 4: Entregado
      steps: [
        { label: 'En espera de recibir', date: '01 Feb' },
        { label: 'En cola / Diagnóstico', date: '02 Feb' },
        { label: 'Reparando', date: 'En proceso' },
        { label: 'Reparación Lista', date: '-' },
        { label: 'Entregado', date: '-' }
      ]
    });
  };

  // --- ESTADOS DEL FORMULARIO (WIZARD) ---
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    deviceType: '',
    issue: '',
    logistics: 'taller' // 'taller' o 'recojo'
  });

  const deviceTypes = [
    { id: 'laptop', name: 'Laptop', icon: <Laptop size={32} /> },
    { id: 'pc', name: 'PC Desktop', icon: <Monitor size={32} /> },
    { id: 'printer', name: 'Impresora', icon: <Printer size={32} /> },
    { id: 'tv', name: 'Televisión', icon: <Tv size={32} /> },
    { id: 'mobile', name: 'Celular', icon: <Smartphone size={32} /> },
    { id: 'other', name: 'Otro', icon: <Wrench size={32} /> },
  ];

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  return (
    <div className="min-h-screen bg-[#050505] py-20 px-4">
      
      {/* HEADER EXPLICATIVO */}
      <div className="max-w-7xl mx-auto mb-16 text-center">
        <h1 className="text-4xl md:text-6xl font-bold mb-6 text-white">CENTRO DE <span className="text-[#FFD700]">REPARACIONES</span></h1>
        
        {/* Pasos del Servicio (Explicación) */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-4xl mx-auto mt-10">
          {[
            { icon: <Search />, t: "1. Diagnóstico", d: "Evaluamos la falla GRATIS." },
            { icon: <Clock />, t: "2. Cotización", d: "Te enviamos el costo. Tú apruebas." },
            { icon: <Wrench />, t: "3. Reparación", d: "Técnicos expertos manos a la obra." },
            { icon: <CreditCard />, t: "4. Pago y Retiro", d: "Pagas al estar conforme y retiras." }
          ].map((item, i) => (
            <div key={i} className="bg-[#111] p-4 rounded-xl border border-[#333] flex flex-col items-center">
              <div className="text-[#FFD700] mb-2">{item.icon}</div>
              <h3 className="font-bold text-white text-sm">{item.t}</h3>
              <p className="text-gray-500 text-xs mt-1">{item.d}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-start">
        
        {/* --- COLUMNA IZQUIERDA: RASTREADOR (TRACKER) --- */}
        <div className="bg-[#111] border border-[#333] rounded-2xl p-8 sticky top-24">
          <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
            <Search className="text-[#FFD700]" /> Estado de mi Reparación
          </h2>
          
          <form onSubmit={handleTrack} className="flex gap-2 mb-8">
            <input 
              type="text" 
              placeholder="Ingresa tu Código de Servicio (Ej: REP-123)" 
              value={ticketCode}
              onChange={(e) => setTicketCode(e.target.value)}
              className="flex-1 bg-black border border-[#333] rounded p-3 text-white focus:border-[#FFD700] outline-none font-mono uppercase"
            />
            <button className="bg-[#FFD700] text-black font-bold px-6 rounded hover:bg-[#e6c200] transition">
              Ver
            </button>
          </form>

          {ticketStatus ? (
            <div className="animate-in fade-in slide-in-from-bottom-4">
              <div className="bg-black/50 p-4 rounded mb-6 border border-[#333]">
                <p className="text-gray-400 text-xs uppercase">Equipo</p>
                <p className="text-white font-bold text-lg">{ticketStatus.device}</p>
              </div>

              {/* Timeline Vertical */}
              <div className="space-y-0 relative pl-4 border-l-2 border-[#333]">
                {ticketStatus.steps.map((step: any, index: number) => {
                  const isActive = index === ticketStatus.status;
                  const isPast = index < ticketStatus.status;
                  
                  return (
                    <div key={index} className="mb-8 relative pl-6 last:mb-0">
                      {/* Punto indicador */}
                      <div className={`absolute -left-[21px] top-1 w-4 h-4 rounded-full border-2 transition-colors ${
                        isActive ? 'bg-[#FFD700] border-[#FFD700] shadow-[0_0_10px_#FFD700]' : 
                        isPast ? 'bg-[#333] border-[#333]' : 'bg-black border-[#333]'
                      }`}></div>
                      
                      <h4 className={`font-bold text-sm ${isActive ? 'text-[#FFD700]' : isPast ? 'text-gray-500' : 'text-gray-600'}`}>
                        {step.label}
                      </h4>
                      <span className="text-xs text-gray-600">{step.date}</span>
                      
                      {isActive && index === 2 && (
                        <p className="text-xs text-[#FFD700] mt-1 animate-pulse">
                          ● Técnico trabajando actualmente...
                        </p>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ) : (
            <div className="text-center text-gray-500 py-10">
              <Wrench size={48} className="mx-auto mb-4 opacity-20" />
              <p>Ingresa tu código para ver el progreso en tiempo real.</p>
            </div>
          )}
        </div>


        {/* --- COLUMNA DERECHA: SOLICITUD DE REPARACIÓN (WIZARD) --- */}
        <div className="bg-[#111] border border-[#333] rounded-2xl p-8 relative overflow-hidden">
          {/* Barra de Progreso Superior */}
          <div className="absolute top-0 left-0 w-full h-1.5 bg-[#222]">
            <motion.div 
              className="h-full bg-[#FFD700] shadow-[0_0_10px_#FFD700]"
              initial={{ width: "0%" }}
              animate={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
            />
          </div>

          <div className="mb-8 mt-4">
            <span className="text-[#FFD700] text-xs font-bold uppercase tracking-wider">Paso {step} de 4</span>
            <h2 className="text-3xl font-bold text-white mt-1">
              {step === 1 && "¿Qué equipo reparamos?"}
              {step === 2 && "Detalla la falla"}
              {step === 3 && "¿Cómo lo recibimos?"}
              {step === 4 && "¡Solicitud Recibida!"}
            </h2>
          </div>

          <AnimatePresence mode="wait">
            
            {/* PASO 1: SELECCIÓN DE EQUIPO */}
            {step === 1 && (
              <motion.div 
                key="step1"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="grid grid-cols-2 sm:grid-cols-3 gap-4"
              >
                {deviceTypes.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => { setFormData({...formData, deviceType: d.name}); nextStep(); }}
                    className="flex flex-col items-center justify-center gap-3 p-6 bg-black border border-[#333] rounded-xl hover:border-[#FFD700] hover:bg-[#FFD700]/10 transition group"
                  >
                    <div className="text-gray-400 group-hover:text-[#FFD700] transition">{d.icon}</div>
                    <span className="text-sm font-bold text-white">{d.name}</span>
                  </button>
                ))}
              </motion.div>
            )}

            {/* PASO 2: DESCRIPCIÓN DEL PROBLEMA */}
            {step === 2 && (
              <motion.div 
                key="step2"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Equipo Seleccionado:</label>
                  <div className="flex items-center gap-2 text-[#FFD700] font-bold text-xl">
                    <CheckCircle size={20} /> {formData.deviceType}
                  </div>
                </div>
                
                <div>
                  <label className="block text-white font-bold mb-2">¿Qué falla presenta?</label>
                  <textarea 
                    rows={5} 
                    className="w-full bg-black border border-[#333] rounded p-4 text-white focus:border-[#FFD700] outline-none resize-none"
                    placeholder="Ej: No enciende, pantalla azul, hace un ruido extraño, se calienta mucho..."
                    value={formData.issue}
                    onChange={(e) => setFormData({...formData, issue: e.target.value})}
                  ></textarea>
                  <p className="text-xs text-gray-500 mt-2 flex items-center gap-1">
                    <AlertCircle size={12} /> Trataremos de reproducir esta falla en el taller.
                  </p>
                </div>

                <div className="flex gap-4">
                  <button onClick={prevStep} className="flex-1 py-3 rounded border border-[#333] text-gray-300 hover:bg-[#222]">Atrás</button>
                  <button 
                    onClick={nextStep} 
                    disabled={!formData.issue}
                    className="flex-1 bg-[#FFD700] text-black font-bold py-3 rounded hover:bg-[#e6c200] disabled:opacity-50 disabled:cursor-not-allowed transition"
                  >
                    Continuar
                  </button>
                </div>
              </motion.div>
            )}

            {/* PASO 3: LOGÍSTICA */}
            {step === 3 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}
                className="space-y-6"
              >
                <div className="grid grid-cols-1 gap-4">
                  <button 
                    onClick={() => setFormData({...formData, logistics: 'taller'})}
                    className={`p-6 border rounded-xl flex items-center gap-4 transition ${formData.logistics === 'taller' ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-[#333] bg-black hover:border-gray-500'}`}
                  >
                    <div className="bg-[#111] p-3 rounded-full"><Wrench className="text-white" /></div>
                    <div className="text-left">
                      <h4 className="font-bold text-white">Lo llevaré al taller</h4>
                      <p className="text-sm text-gray-400">Av. Arequipa 1234, Lima.</p>
                    </div>
                  </button>

                  <button 
                    onClick={() => setFormData({...formData, logistics: 'recojo'})}
                    className={`p-6 border rounded-xl flex items-center gap-4 transition ${formData.logistics === 'recojo' ? 'border-[#FFD700] bg-[#FFD700]/10' : 'border-[#333] bg-black hover:border-gray-500'}`}
                  >
                    <div className="bg-[#111] p-3 rounded-full"><Truck className="text-white" /></div>
                    <div className="text-left">
                      <h4 className="font-bold text-white">Solicitar Recojo a Domicilio</h4>
                      <p className="text-sm text-gray-400">Costo adicional según distrito.</p>
                    </div>
                  </button>
                </div>

                {formData.logistics === 'recojo' && (
                  <div className="bg-black p-4 rounded border border-[#333] text-sm text-gray-300 animate-in fade-in">
                    <label className="block text-xs uppercase font-bold text-[#FFD700] mb-1">Dirección de Recojo</label>
                    <input type="text" placeholder="Ingresa tu dirección y referencia..." className="w-full bg-[#111] border-b border-[#333] py-2 outline-none focus:border-[#FFD700] text-white" />
                  </div>
                )}

                <div className="flex gap-4 pt-4">
                  <button onClick={prevStep} className="flex-1 py-3 rounded border border-[#333] text-gray-300 hover:bg-[#222]">Atrás</button>
                  <button 
                    onClick={nextStep} 
                    className="flex-1 bg-[#FFD700] text-black font-bold py-3 rounded hover:bg-[#e6c200] transition shadow-[0_0_15px_rgba(255,215,0,0.3)] flex justify-center items-center gap-2"
                  >
                    Confirmar Solicitud <ChevronRight size={18} />
                  </button>
                </div>
              </motion.div>
            )}

            {/* PASO 4: ÉXITO */}
            {step === 4 && (
              <motion.div 
                key="step3"
                initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}
                className="text-center py-10"
              >
                <div className="w-20 h-20 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_20px_rgba(34,197,94,0.4)]">
                  <CheckCircle size={40} className="text-white" />
                </div>
                <h3 className="text-3xl font-bold text-white mb-2">¡Solicitud Enviada!</h3>
                <p className="text-gray-400 mb-8 max-w-md mx-auto">
                  Hemos recibido los datos de tu <strong>{formData.deviceType}</strong>. 
                  Un asesor te contactará en breve para coordinar.
                </p>
                
                <div className="bg-[#1a1a1a] p-6 rounded-lg border border-[#333] inline-block mb-8">
                  <p className="text-xs text-gray-500 uppercase tracking-widest mb-1">Tu código de seguimiento temporal</p>
                  <p className="text-4xl font-mono font-bold text-[#FFD700]">REP-{Math.floor(Math.random()*10000)}</p>
                </div>

                <button 
                  onClick={() => { setStep(1); setFormData({deviceType: '', issue: '', logistics: 'taller'}); }}
                  className="block w-full text-gray-400 hover:text-white underline text-sm"
                >
                  Registrar otro equipo
                </button>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}