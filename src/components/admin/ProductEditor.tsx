'use client';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client';
import { 
  Upload, X, Save, ArrowLeft, Plus, Trash2, 
  CheckCircle, Shield, Truck, Star, Cpu, FileText, Image as ImageIcon 
} from 'lucide-react';
import Image from 'next/image';

interface ProductEditorProps {
  productToEdit?: any;
  onClose: () => void;
  onSaved: () => void;
}

export default function ProductEditor({ productToEdit, onClose, onSaved }: ProductEditorProps) {
  const supabase = createClient();
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs'>('desc');
  
  // Estado del formulario
  const [form, setForm] = useState({
    name: '',
    price: 0,
    stock: 0,
    category: 'Componentes',
    brand: 'Genérico',
    description: '', // Descripción corta/marketing
    long_description: '', // Descripción técnica detallada
    images: [] as string[],
    specs: [] as { key: string, value: string }[] // Array para ficha técnica
  });

  // Cargar datos al iniciar
  useEffect(() => {
    if (productToEdit) {
      // Convertir el objeto JSON de specs a array para editarlo
      const specsArray = productToEdit.specs 
        ? Object.entries(productToEdit.specs).map(([key, value]) => ({ key, value: String(value) }))
        : [];

      setForm({
        name: productToEdit.name || '',
        price: productToEdit.price || 0,
        stock: productToEdit.stock || 0,
        category: productToEdit.category || 'Componentes',
        brand: productToEdit.brand || 'Genérico',
        description: productToEdit.description || '',
        long_description: productToEdit.long_description || productToEdit.description || '',
        images: productToEdit.images && productToEdit.images.length > 0 
                ? productToEdit.images 
                : (productToEdit.image_url ? [productToEdit.image_url] : []),
        specs: specsArray
      });
    }
  }, [productToEdit]);

  // --- MANEJO DE IMÁGENES ---
  const handleImageUpload = async (e: any) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setLoading(true);
    const newImages = [...form.images];

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      const fileName = `products/${Date.now()}-${file.name.replace(/\s+/g, '-')}`;
      const { data } = await supabase.storage.from('cuervo-files').upload(fileName, file);
      if (data) {
        const { data: urlData } = supabase.storage.from('cuervo-files').getPublicUrl(fileName);
        newImages.push(urlData.publicUrl);
      }
    }
    setForm(prev => ({ ...prev, images: newImages }));
    setLoading(false);
  };

  // --- MANEJO DE SPECS (FICHA TÉCNICA) ---
  const addSpec = () => setForm(prev => ({ ...prev, specs: [...prev.specs, { key: '', value: '' }] }));
  const removeSpec = (index: number) => setForm(prev => ({ ...prev, specs: prev.specs.filter((_, i) => i !== index) }));
  const updateSpec = (index: number, field: 'key' | 'value', text: string) => {
    const newSpecs = [...form.specs];
    newSpecs[index][field] = text;
    setForm(prev => ({ ...prev, specs: newSpecs }));
  };

  // --- GUARDAR ---
  const handleSave = async () => {
    if (!form.name || form.price <= 0) return alert("Nombre y Precio son obligatorios");
    setLoading(true);

    // Convertir array de specs a Objeto JSON para la base de datos
    const specsJson = form.specs.reduce((acc, curr) => {
      if (curr.key) acc[curr.key] = curr.value;
      return acc;
    }, {} as Record<string, string>);

    const payload = {
      name: form.name,
      price: form.price,
      stock: form.stock,
      category: form.category,
      brand: form.brand,
      description: form.description,
      long_description: form.long_description,
      specs: specsJson,
      images: form.images, 
      image_url: form.images[0] || null
    };

    let error;
    if (productToEdit) {
      const { error: err } = await supabase.from('products').update(payload).eq('id', productToEdit.id);
      error = err;
    } else {
      const { error: err } = await supabase.from('products').insert([payload]);
      error = err;
    }

    if (error) alert('Error: ' + error.message);
    else { onSaved(); onClose(); }
    setLoading(false);
  };

  return (
    <div className="bg-[#050505] min-h-screen text-white font-sans relative pb-20">
      
      {/* --- BARRA FLOTANTE DE GUARDADO (Top) --- */}
      <div className="sticky top-0 z-50 bg-[#111]/90 backdrop-blur-md border-b border-[#333] px-6 py-4 flex justify-between items-center shadow-2xl">
        <button onClick={onClose} className="text-gray-400 hover:text-white flex items-center gap-2 text-sm font-bold uppercase tracking-wider">
          <ArrowLeft size={18}/> Cancelar
        </button>
        <div className="flex items-center gap-4">
          <span className="text-xs text-gray-500 uppercase font-bold animate-pulse">
            {productToEdit ? 'Modo Edición en Vivo' : 'Creando Nuevo Producto'}
          </span>
          <button 
            onClick={handleSave} 
            disabled={loading}
            className="bg-[#FFD700] hover:bg-[#ffe033] text-black px-8 py-3 rounded-full font-black flex items-center gap-2 shadow-[0_0_20px_rgba(255,215,0,0.3)] transform hover:scale-105 transition-all"
          >
            {loading ? 'Guardando...' : <><Save size={20}/> GUARDAR CAMBIOS</>}
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 pt-10 grid lg:grid-cols-2 gap-16">
        
        {/* === COLUMNA IZQUIERDA: GALERÍA === */}
        <div className="space-y-6">
          <div className="relative aspect-square bg-[#111] rounded-3xl border-2 border-dashed border-[#333] overflow-hidden group hover:border-[#FFD700] transition-colors">
            {form.images[0] ? (
              <Image src={form.images[0]} alt="Main" fill className="object-contain p-4" />
            ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-600">
                <ImageIcon size={64} className="mb-4 opacity-50"/>
                <p>La imagen principal aparecerá aquí</p>
              </div>
            )}
            
            {/* Overlay de Subida */}
            <label className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center cursor-pointer">
              <Upload size={48} className="text-[#FFD700] mb-2" />
              <span className="text-white font-bold uppercase tracking-widest">Subir / Cambiar Fotos</span>
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>

          {/* Miniaturas */}
          <div className="flex gap-4 overflow-x-auto pb-4">
            {form.images.map((img, idx) => (
              <div key={idx} className="relative w-24 h-24 shrink-0 rounded-xl border border-[#333] overflow-hidden group">
                <Image src={img} alt="" fill className="object-cover" />
                <button 
                  onClick={() => setForm(prev => ({...prev, images: prev.images.filter((_, i) => i !== idx)}))}
                  className="absolute inset-0 bg-red-900/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                >
                  <Trash2 size={20} />
                </button>
              </div>
            ))}
            <label className="w-24 h-24 shrink-0 rounded-xl border-2 border-dashed border-[#333] flex items-center justify-center cursor-pointer hover:border-[#FFD700] hover:text-[#FFD700] text-gray-600 transition-colors">
              <Plus size={24} />
              <input type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
            </label>
          </div>
        </div>

        {/* === COLUMNA DERECHA: INFORMACIÓN === */}
        <div className="flex flex-col justify-center space-y-8">
          
          {/* Nombre editable */}
          <div>
            <input 
              value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              placeholder="Escribe el nombre del producto..."
              className="w-full bg-transparent text-5xl font-black text-white placeholder-gray-700 outline-none border-b-2 border-transparent focus:border-[#FFD700] transition-colors pb-2"
            />
            
            <div className="flex items-center gap-4 mt-4">
               {/* Stock Editable */}
               <div className={`flex items-center gap-2 px-3 py-1 rounded border ${form.stock > 0 ? 'border-green-900 bg-green-900/20 text-green-400' : 'border-red-900 bg-red-900/20 text-red-500'}`}>
                  <CheckCircle size={16} />
                  <span className="text-sm font-bold">Stock:</span>
                  <input 
                    type="number" 
                    value={form.stock}
                    onChange={e => setForm({...form, stock: Number(e.target.value)})}
                    className="w-16 bg-transparent outline-none font-bold"
                  />
               </div>

               <div className="text-gray-600">|</div>

               {/* Categoría y Marca */}
               <select 
                 value={form.category}
                 onChange={e => setForm({...form, category: e.target.value})}
                 className="bg-[#111] border border-[#333] text-white text-xs uppercase font-bold px-2 py-1 rounded outline-none focus:border-[#FFD700]"
               >
                 {["Componentes", "Robótica", "Impresión 3D", "Kits", "Herramientas"].map(c => <option key={c} value={c}>{c}</option>)}
               </select>
               <input 
                 value={form.brand}
                 onChange={e => setForm({...form, brand: e.target.value})}
                 placeholder="Marca"
                 className="bg-transparent text-gray-400 text-sm uppercase font-bold outline-none w-24 hover:text-white"
               />
            </div>
          </div>

          {/* Precio Editable */}
          <div className="flex items-center gap-2">
            <span className="text-5xl font-black text-[#FFD700]">S/</span>
            <input 
              type="number"
              value={form.price}
              onChange={e => setForm({...form, price: Number(e.target.value)})}
              className="bg-transparent text-5xl font-black text-[#FFD700] outline-none placeholder-yellow-900 w-full"
              placeholder="0.00"
            />
          </div>

          {/* Descripción Corta */}
          <div className="relative group">
            <textarea 
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              placeholder="Escribe aquí una descripción breve y atractiva para la venta..."
              className="w-full bg-transparent text-xl text-gray-300 leading-relaxed outline-none border-l-4 border-[#333] pl-4 resize-none focus:border-[#FFD700] min-h-[120px]"
            />
            <span className="absolute top-0 right-0 text-xs text-gray-600 opacity-0 group-hover:opacity-100">Descripción Corta</span>
          </div>

          {/* Botón Simulado (No hace nada aquí) */}
          <button className="w-full bg-[#222] text-gray-500 font-bold text-xl py-5 rounded-xl border border-[#333] border-dashed cursor-not-allowed uppercase tracking-wide flex items-center justify-center gap-3">
            <Shield size={20}/> Botón de Compra (Simulación)
          </button>

        </div>
      </div>

      {/* === SECCIÓN INFERIOR: TABS DE DETALLES (Ficha Técnica y Descripción Larga) === */}
      <div className="max-w-7xl mx-auto mt-20 px-4">
        <div className="bg-[#111] border border-[#333] rounded-3xl overflow-hidden min-h-[500px]">
            
            {/* Header de Tabs */}
            <div className="flex border-b border-[#333]">
                <button 
                  onClick={() => setActiveTab('desc')}
                  className={`flex-1 py-6 font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition ${activeTab === 'desc' ? 'bg-[#FFD700] text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <FileText size={20} /> Descripción Detallada
                </button>
                <button 
                  onClick={() => setActiveTab('specs')}
                  className={`flex-1 py-6 font-bold uppercase tracking-wider flex items-center justify-center gap-2 transition ${activeTab === 'specs' ? 'bg-[#FFD700] text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                >
                  <Cpu size={20} /> Ficha Técnica ({form.specs.length})
                </button>
            </div>

            <div className="p-10">
                {/* EDITOR DE DESCRIPCIÓN LARGA */}
                {activeTab === 'desc' && (
                    <div className="relative group animate-in fade-in">
                        <textarea 
                            value={form.long_description}
                            onChange={e => setForm({...form, long_description: e.target.value})}
                            placeholder="Escribe aquí toda la información detallada del producto. Puedes copiar y pegar texto largo..."
                            className="w-full bg-transparent text-gray-300 leading-relaxed outline-none resize-none min-h-[400px] text-lg p-4 border border-transparent focus:border-[#333] rounded-xl"
                        />
                         <div className="absolute top-2 right-2 text-xs text-gray-500 opacity-0 group-hover:opacity-100 pointer-events-none">
                            Markdown support (futuro)
                        </div>
                    </div>
                )}

                {/* EDITOR DE FICHA TÉCNICA (Clave - Valor) */}
                {activeTab === 'specs' && (
                    <div className="max-w-3xl mx-auto animate-in fade-in">
                        <div className="flex justify-between items-center mb-8">
                            <h3 className="text-xl font-bold text-white">Especificaciones Técnicas</h3>
                            <button onClick={addSpec} className="text-[#FFD700] hover:text-white flex items-center gap-1 text-sm font-bold uppercase border border-[#FFD700] px-3 py-1 rounded hover:bg-[#FFD700] hover:text-black transition">
                                <Plus size={16}/> Agregar Fila
                            </button>
                        </div>

                        <div className="space-y-3">
                            {form.specs.length === 0 ? (
                                <div className="text-center py-10 text-gray-600 border border-dashed border-[#333] rounded-xl">
                                    No hay especificaciones aún. ¡Agrega la primera!
                                </div>
                            ) : form.specs.map((spec, idx) => (
                                <div key={idx} className="flex gap-4 group">
                                    <input 
                                        value={spec.key}
                                        onChange={e => updateSpec(idx, 'key', e.target.value)}
                                        placeholder="Ej: Voltaje"
                                        className="flex-1 bg-[#050505] border border-[#333] p-3 rounded text-[#FFD700] font-bold text-sm outline-none focus:border-[#FFD700]"
                                    />
                                    <input 
                                        value={spec.value}
                                        onChange={e => updateSpec(idx, 'value', e.target.value)}
                                        placeholder="Ej: 5V - 12V"
                                        className="flex-[2] bg-[#050505] border border-[#333] p-3 rounded text-white text-sm outline-none focus:border-[#FFD700]"
                                    />
                                    <button 
                                        onClick={() => removeSpec(idx)}
                                        className="text-red-500 hover:bg-red-900/30 p-3 rounded border border-transparent hover:border-red-900 transition"
                                    >
                                        <Trash2 size={18}/>
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>
    </div>
  );
}