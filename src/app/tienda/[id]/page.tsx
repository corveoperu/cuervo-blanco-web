'use client';
import { useParams, useRouter } from 'next/navigation'; // Agregamos useRouter
import { useCart } from '@/context/CartContext';
import { ShoppingCart, CheckCircle, Shield, Truck, Star, Box, Cpu, FileText, Plus, Minus, AlertTriangle, Loader2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { createClient } from '@/utils/supabase/client'; // Importamos el cliente de Supabase

// Definimos el tipo de dato para TypeScript (para que no se queje)
type ProductType = {
  id: number;
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  brand: string;
  images: string[] | null;
  image_url: string | null;
  // Estos campos son opcionales porque aun no estan en tu DB, los simularemos
  specs?: any;
  reviews?: any[];
  includes?: string[];
};

export default function ProductDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { addToCart } = useCart();
  const [product, setProduct] = useState<ProductType | null>(null);
  const [loading, setLoading] = useState(true);
  
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'desc' | 'specs' | 'reviews'>('desc');
  const [mainImage, setMainImage] = useState('');

  // 1. EFECTO: Buscar producto en Supabase al cargar la página
  useEffect(() => {
    const fetchProduct = async () => {
      const supabase = createClient();
      
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single();

      if (error || !data) {
        console.error("Error fetching product:", error);
        setLoading(false);
        return; 
      }

      setProduct(data);
      // Lógica para elegir la imagen principal
      if (data.images && data.images.length > 0) {
        setMainImage(data.images[0]);
      } else {
        setMainImage(data.image_url || '/placeholder.png');
      }
      setLoading(false);
    };

    fetchProduct();
  }, [id]);

  // Lógica de cantidad
  const increaseQty = () => {
    if (product && quantity < (product.stock || 0)) setQuantity(quantity + 1);
  };
  
  const decreaseQty = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  // Función para agregar N veces al carrito
  const handleAddToCart = () => {
    if (!product) return;
    // Adaptamos el objeto para el carrito (usando la imagen correcta)
    const itemForCart = {
      ...product,
      image: mainImage // El carrito espera 'image', le damos la que estamos viendo
    };

    for(let i = 0; i < quantity; i++) {
      addToCart(itemForCart);
    }
    // Opcional: Feedback visual o redirección
    alert(`Agregado: ${quantity} x ${product.name}`);
  };

  // --- RENDERIZADO ---

  // 1. Estado de Carga
  if (loading) return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center text-white">
      <Loader2 className="animate-spin text-[#FFD700] h-12 w-12" />
    </div>
  );

  // 2. Si no se encontró el producto
  if (!product) return (
    <div className="min-h-screen bg-[#050505] flex flex-col items-center justify-center text-white gap-4">
      <h2 className="text-2xl font-bold">Producto no encontrado</h2>
      <button onClick={() => router.back()} className="text-[#FFD700] hover:underline">Volver a la tienda</button>
    </div>
  );

  return (
    <div className="min-h-screen py-20 px-4 bg-[#050505]">
      <div className="max-w-7xl mx-auto pt-10">
        
        {/* SECCIÓN SUPERIOR: IMAGEN Y COMPRA */}
        <div className="grid lg:grid-cols-2 gap-12 mb-20">
          
          {/* Columna Izquierda: Galería */}
          <div className="space-y-4">
            <div className="bg-[#111] rounded-2xl overflow-hidden border border-[#333] h-[500px] relative group">
              <div 
                className="absolute inset-0 bg-contain bg-no-repeat bg-center transition-transform duration-700 group-hover:scale-105"
                style={{ backgroundImage: `url(${mainImage})` }}
              ></div>
              
              {/* Etiqueta de Stock bajo */}
              {product.stock < 5 && product.stock > 0 && (
                <div className="absolute top-4 left-4 bg-red-600 text-white text-xs font-bold px-3 py-1 rounded-full animate-pulse shadow-lg">
                  ¡Solo quedan {product.stock}!
                </div>
              )}
            </div>
            
            {/* Miniaturas (Si hay array de imágenes) */}
            {product.images && product.images.length > 1 && (
              <div className="flex gap-4 overflow-x-auto pb-2">
                {product.images.map((img, idx) => (
                  <button 
                    key={idx}
                    onClick={() => setMainImage(img)}
                    className={`h-20 w-20 rounded-lg border-2 bg-[#111] bg-cover bg-center shrink-0 transition ${mainImage === img ? 'border-[#FFD700]' : 'border-[#333] hover:border-gray-500'}`}
                    style={{ backgroundImage: `url(${img})` }}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Columna Derecha: Info de Compra */}
          <div className="flex flex-col justify-center space-y-6">
            <div>
              <div className="flex items-center justify-between">
                <h1 className="text-4xl md:text-5xl font-bold text-white mb-2">{product.name}</h1>
              </div>
              
              <div className="flex items-center gap-4 text-sm mt-2">
                {product.stock > 0 ? (
                  <div className="flex items-center gap-1 text-[#00ff9d] bg-[#00ff9d]/10 px-2 py-1 rounded">
                    <CheckCircle size={16} /> <span>En Stock ({product.stock})</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-1 text-red-500 bg-red-500/10 px-2 py-1 rounded">
                    <AlertTriangle size={16} /> <span>Agotado</span>
                  </div>
                )}
                
                <span className="text-gray-600">|</span>
                
                <span className="text-gray-400 uppercase tracking-wider text-xs font-bold border border-gray-700 px-2 py-1 rounded">
                  {product.category || 'General'}
                </span>
              </div>
            </div>

            <div className="text-5xl font-black text-[#FFD700] tracking-tight">
              S/ {product.price.toFixed(2)}
            </div>
            
            <p className="text-gray-300 text-lg leading-relaxed border-l-4 border-[#333] pl-4">
              {product.description}
            </p>

            {/* Selector de Cantidad */}
            {product.stock > 0 && (
              <div className="bg-[#111] border border-[#333] rounded-lg p-4 w-fit">
                <label className="text-xs text-gray-500 uppercase font-bold mb-2 block">Cantidad</label>
                <div className="flex items-center gap-4">
                  <button onClick={decreaseQty} className="w-10 h-10 bg-black border border-[#333] hover:border-[#FFD700] hover:text-[#FFD700] rounded flex items-center justify-center text-white transition disabled:opacity-50">
                    <Minus size={16} />
                  </button>
                  <span className="text-2xl font-bold text-white w-8 text-center">{quantity}</span>
                  <button onClick={increaseQty} className="w-10 h-10 bg-black border border-[#333] hover:border-[#FFD700] hover:text-[#FFD700] rounded flex items-center justify-center text-white transition disabled:opacity-50" disabled={quantity >= product.stock}>
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            )}

            {/* Botones de Garantía */}
            <div className="grid grid-cols-2 gap-4 text-sm text-gray-500 border-y border-[#333] py-6">
              <div className="flex items-center gap-2"><Shield size={18} className="text-[#FFD700]" /> Garantía Corveo</div>
              <div className="flex items-center gap-2"><Truck size={18} className="text-[#FFD700]" /> Envíos Nacionales</div>
            </div>

            <button 
              onClick={handleAddToCart}
              disabled={product.stock === 0}
              className="w-full bg-[#FFD700] text-black font-black text-xl py-5 rounded-xl hover:bg-[#e6c200] transition flex items-center justify-center gap-3 shadow-[0_0_20px_rgba(255,215,0,0.2)] hover:shadow-[0_0_30px_rgba(255,215,0,0.4)] disabled:bg-gray-800 disabled:text-gray-500 disabled:shadow-none disabled:cursor-not-allowed uppercase tracking-wide transform hover:-translate-y-1"
            >
              {product.stock > 0 ? (
                <><ShoppingCart /> Agregar al Carrito</>
              ) : (
                'Sin Stock'
              )}
            </button>
          </div>
        </div>

        {/* SECCIÓN INFERIOR: TABS DE DETALLES */}
        <div className="bg-[#111] border border-[#333] rounded-2xl overflow-hidden min-h-[400px]">
          {/* Encabezados de Tabs */}
          <div className="flex border-b border-[#333] flex-wrap">
            <button 
              onClick={() => setActiveTab('desc')}
              className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition min-w-[150px] ${activeTab === 'desc' ? 'bg-[#FFD700] text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <FileText size={18} /> Detalles
            </button>
            <button 
              onClick={() => setActiveTab('specs')}
              className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition min-w-[150px] ${activeTab === 'specs' ? 'bg-[#FFD700] text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Cpu size={18} /> Ficha Técnica
            </button>
            <button 
              onClick={() => setActiveTab('reviews')}
              className={`flex-1 py-4 font-bold text-sm uppercase tracking-wider flex items-center justify-center gap-2 transition min-w-[150px] ${activeTab === 'reviews' ? 'bg-[#FFD700] text-black' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
            >
              <Star size={18} /> Opiniones
            </button>
          </div>

          {/* Contenido de Tabs */}
          <div className="p-8 md:p-12">
            
            {/* 1. Descripción Extendida */}
            {activeTab === 'desc' && (
              <div className="grid md:grid-cols-2 gap-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4">Sobre este producto</h3>
                  <p className="text-gray-400 leading-relaxed whitespace-pre-line">
                    {product.description}
                  </p>
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
                    <Box className="text-[#FFD700]" /> Contenido
                  </h3>
                  {/* Como aun no tienes la columna 'includes', mostramos mensaje genérico o usamos description */}
                  <ul className="space-y-3">
                    <li className="flex items-center gap-3 text-gray-300 bg-black/30 p-3 rounded border border-[#333]">
                        <CheckCircle size={16} className="text-[#FFD700] shrink-0" />
                        Producto sellado ({product.name})
                    </li>
                    <li className="flex items-center gap-3 text-gray-300 bg-black/30 p-3 rounded border border-[#333]">
                        <CheckCircle size={16} className="text-[#FFD700] shrink-0" />
                        Garantía de funcionamiento
                    </li>
                  </ul>
                </div>
              </div>
            )}

            {/* 2. Especificaciones Técnicas (Simuladas por ahora) */}
            {activeTab === 'specs' && (
              <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 text-center">
                 <h3 className="text-2xl font-bold text-white mb-8">Especificaciones</h3>
                 <div className="bg-black/40 p-6 rounded border border-[#333]">
                    <p className="text-gray-500 mb-4">Las especificaciones detalladas se están actualizando para este producto.</p>
                    <div className="grid grid-cols-2 gap-4 text-left">
                       <div className="p-3 border-b border-[#333]">
                          <span className="text-[#FFD700] text-xs uppercase block">Marca</span>
                          <span className="text-white">{product.brand || 'Corveo Genérico'}</span>
                       </div>
                       <div className="p-3 border-b border-[#333]">
                          <span className="text-[#FFD700] text-xs uppercase block">Categoría</span>
                          <span className="text-white">{product.category || 'Electrónica'}</span>
                       </div>
                    </div>
                 </div>
              </div>
            )}

            {/* 3. Comentarios */}
            {activeTab === 'reviews' && (
              <div className="max-w-3xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
                 <div className="text-center py-10 bg-black/20 rounded border border-[#333] border-dashed">
                    <Star className="mx-auto text-gray-700 mb-2 h-10 w-10" />
                    <p className="text-gray-500">Las reseñas están siendo migradas a la nueva base de datos.</p>
                    <p className="text-[#FFD700] text-sm mt-2">Pronto podrás dejar tu opinión.</p>
                  </div>
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}