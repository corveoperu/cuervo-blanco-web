'use client';
import { 
  Cpu, Phone, Mail, User, DollarSign, 
  FileText, Send, ShieldCheck, Zap, Lightbulb, PenTool, Lock, AlertTriangle, CheckCircle, X 
} from 'lucide-react';
import { useState, useEffect } from 'react';

export default function EncargosPage() {
  
  const projectTypes = [
    "Diseño y Fabricación de PCB",
    "Automatización Industrial (PLC/HMI)",
    "Programación de Microcontroladores (Arduino/ESP32)",
    "Desarrollo de Sistemas IoT",
    "Robótica y Mecatrónica",
    "Ingeniería Inversa / Clonación",
    "Impresión y Modelado 3D",
    "Asesoría de Tesis / Proyectos",
    "Mantenimiento Preventivo Especializado",
    "Otro (Especificar en detalles)"
  ];

  // --- ESTADOS DEL FORMULARIO ---
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    type: '', // Para el select de Tipo
    budget: '', // Para el select de Presupuesto
    details: ''
  });

  // --- ESTADO DE NOTIFICACIÓN ---
  const [notification, setNotification] = useState<{show: boolean, type: 'success' | 'error', msg: string} | null>(null);

  // Auto-ocultar notificación después de 4 segundos
  useEffect(() => {
    if (notification?.show) {
      const timer = setTimeout(() => setNotification(null), 4000);
      return () => clearTimeout(timer);
    }
  }, [notification]);

  // Manejar cambios en los inputs
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // Validar y Enviar
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // 1. Validación de Campos Vacíos
    const missingFields = [];
    if (!formData.name) missingFields.push("Nombre");
    if (!formData.phone) missingFields.push("Teléfono");
    if (!formData.email) missingFields.push("Correo");
    if (!formData.type) missingFields.push("Tipo de Trabajo");
    if (!formData.budget) missingFields.push("Presupuesto");
    if (!formData.details) missingFields.push("Detalles");

    if (missingFields.length > 0) {
      setNotification({
        show: true,
        type: 'error',
        msg: `Faltan campos obligatorios: ${missingFields.join(', ')}`
      });
      return;
    }

    // 2. Simulación de Envío Exitoso
    setNotification({
      show: true,
      type: 'success',
      msg: '¡Solicitud enviada correctamente! Un ingeniero te contactará pronto.'
    });

    // Limpiar formulario
    setFormData({
      name: '', phone: '', email: '', type: '', budget: '', details: ''
    });
  };

  return (
    <div className="min-h-screen bg-[#050505] py-20 px-4 relative overflow-hidden">
      
      {/* NOTIFICACIÓN FLOTANTE (TOAST) */}
      {notification && (
        <div className={`fixed top-24 right-4 z-50 max-w-sm w-full p-4 rounded-xl shadow-2xl border flex items-start gap-3 animate-in slide-in-from-right-10 duration-300 ${
          notification.type === 'error' 
            ? 'bg-red-900/90 border-red-500 text-white' 
            : 'bg-green-900/90 border-green-500 text-white'
        }`}>
          <div className={`p-2 rounded-full shrink-0 ${notification.type === 'error' ? 'bg-red-500' : 'bg-green-500'}`}>
            {notification.type === 'error' ? <AlertTriangle size={16} /> : <CheckCircle size={16} />}
          </div>
          <div className="flex-1">
            <h4 className="font-bold text-sm">{notification.type === 'error' ? 'Error en el formulario' : 'Éxito'}</h4>
            <p className="text-xs opacity-90 mt-1">{notification.msg}</p>
          </div>
          <button onClick={() => setNotification(null)} className="opacity-50 hover:opacity-100"><X size={16}/></button>
        </div>
      )}

      {/* Fondo decorativo */}
      <div className="absolute top-0 left-0 w-full h-[500px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#FFD700]/10 via-[#050505] to-[#050505] pointer-events-none"></div>

      <div className="max-w-7xl mx-auto relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 bg-[#FFD700]/10 text-[#FFD700] px-4 py-1.5 rounded-full border border-[#FFD700]/30 text-sm font-bold mb-6">
            <Lightbulb size={16} /> MATERIALIZA TUS IDEAS
          </div>
          <h1 className="text-5xl md:text-7xl font-black text-white tracking-tighter mb-6">
            SOLICITUD DE <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#FFD700] to-yellow-600">PROYECTOS</span>
          </h1>
          <p className="text-xl text-gray-400 max-w-3xl mx-auto leading-relaxed">
            Cuéntanos tu visión y nuestro equipo de ingeniería evaluará la viabilidad técnica y financiera <strong>sin compromiso</strong>.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* COLUMNA IZQUIERDA: INFORMACIÓN */}
          <div className="lg:col-span-5 space-y-8">
            <div className="bg-[#111] p-8 rounded-2xl border border-[#333] relative overflow-hidden group">
              <div className="absolute top-0 right-0 p-4 opacity-10 group-hover:opacity-20 transition">
                <ShieldCheck size={100} />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">Garantía Cuervo Blanco</h3>
              <ul className="space-y-6">
                <li className="flex gap-4">
                  <div className="bg-[#FFD700]/10 p-3 rounded-lg h-fit text-[#FFD700]"><Zap size={24} /></div>
                  <div>
                    <h4 className="font-bold text-white">Viabilidad Técnica</h4>
                    <p className="text-sm text-gray-400">Analizamos la física y electrónica real de tu idea antes de cobrar.</p>
                  </div>
                </li>
                <li className="flex gap-4">
                  <div className="bg-[#FFD700]/10 p-3 rounded-lg h-fit text-[#FFD700]"><Lock size={24} /></div>
                  <div>
                    <h4 className="font-bold text-white">Privacidad Total</h4>
                    <p className="text-sm text-gray-400">Tu propiedad intelectual está segura. Firmamos NDA si es necesario.</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>

          {/* COLUMNA DERECHA: FORMULARIO */}
          <div className="lg:col-span-7">
            <form onSubmit={handleSubmit} className="bg-[#111] p-8 md:p-10 rounded-3xl border border-[#333] shadow-2xl relative">
              
              <div className="absolute inset-0 rounded-3xl border border-[#FFD700]/20 pointer-events-none"></div>

              <h2 className="text-2xl font-bold text-white mb-8 flex items-center gap-2">
                <Cpu className="text-[#FFD700]" /> Configura tu Proyecto
              </h2>

              <div className="space-y-6">
                
                {/* 1. Datos Personales */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-2">
                      <User size={14} /> Nombre Completo <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" name="name" value={formData.name} onChange={handleChange} 
                      placeholder="Ej: Juan Pérez" 
                      className="w-full bg-black border border-[#333] p-4 text-white rounded-xl focus:border-[#FFD700] outline-none transition" 
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-2">
                      <Phone size={14} /> Teléfono / WhatsApp <span className="text-red-500">*</span>
                    </label>
                    <input 
                      type="text" name="phone" value={formData.phone} onChange={handleChange}
                      placeholder="+51 999..." 
                      className="w-full bg-black border border-[#333] p-4 text-white rounded-xl focus:border-[#FFD700] outline-none transition" 
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-2">
                    <Mail size={14} /> Correo Electrónico <span className="text-red-500">*</span>
                  </label>
                  <input 
                    type="email" name="email" value={formData.email} onChange={handleChange}
                    placeholder="contacto@ejemplo.com" 
                    className="w-full bg-black border border-[#333] p-4 text-white rounded-xl focus:border-[#FFD700] outline-none transition" 
                  />
                </div>

                {/* 2. Detalles del Proyecto */}
                <div className="grid md:grid-cols-2 gap-6">
                  
                  {/* SELECT: TIPO DE TRABAJO (CORREGIDO) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-2">
                      <Zap size={14} /> Tipo de Trabajo <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select 
                        name="type" 
                        value={formData.type} 
                        onChange={handleChange}
                        className="w-full bg-black border border-[#333] p-4 text-white rounded-xl focus:border-[#FFD700] outline-none appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Seleccionar categoría...</option>
                        {projectTypes.map((type, i) => (
                          <option key={i} value={type}>{type}</option>
                        ))}
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                    </div>
                  </div>

                  {/* SELECT: PRESUPUESTO (CORREGIDO) */}
                  <div className="space-y-2">
                    <label className="text-xs font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-2">
                      <DollarSign size={14} /> Presupuesto Estimado <span className="text-red-500">*</span>
                    </label>
                    <div className="relative">
                      <select 
                        name="budget"
                        value={formData.budget}
                        onChange={handleChange}
                        className="w-full bg-black border border-[#333] p-4 text-white rounded-xl focus:border-[#FFD700] outline-none appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Rango de inversión...</option>
                        <option value="estudiante">Nivel Estudiante (S/ 50 - S/ 300)</option>
                        <option value="intermedio">Proyecto Intermedio (S/ 300 - S/ 1000)</option>
                        <option value="profesional">Profesional / MVP (S/ 1000 - S/ 3000)</option>
                        <option value="industrial">Industrial / Maquinaria (+ S/ 3000)</option>
                        <option value="cotizar">No estoy seguro / A cotizar</option>
                      </select>
                      <div className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-gray-500">▼</div>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-bold text-[#FFD700] uppercase tracking-wider flex items-center gap-2">
                    <FileText size={14} /> Detalles Técnicos <span className="text-red-500">*</span>
                  </label>
                  <textarea 
                    name="details"
                    value={formData.details}
                    onChange={handleChange}
                    rows={6} 
                    className="w-full bg-black border border-[#333] p-4 text-white rounded-xl focus:border-[#FFD700] outline-none transition resize-none"
                    placeholder="Describe las funciones deseadas, dimensiones, voltajes, o cualquier requisito específico..."
                  ></textarea>
                </div>

                {/* Footer del Formulario */}
                <div className="pt-4 flex items-center justify-between border-t border-[#333] mt-6">
                  <p className="text-xs text-gray-500 max-w-xs">
                    * Campos marcados con rojo son obligatorios para evaluar la solicitud.
                  </p>
                  <button type="submit" className="bg-[#FFD700] text-black font-bold py-4 px-8 rounded-xl hover:bg-[#e6c200] transition shadow-[0_0_20px_rgba(255,215,0,0.4)] flex items-center gap-2 uppercase tracking-wide transform hover:scale-105 duration-200">
                    Enviar a Evaluación <Send size={20} />
                  </button>
                </div>

              </div>
            </form>
          </div>

        </div>
      </div>
    </div>
  );
}