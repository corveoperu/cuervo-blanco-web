'use client';
import { useCart } from '@/context/CartContext';
import { ShoppingCart, Search, Filter, X, Star, ChevronLeft, ChevronRight, Eye, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useState, useEffect, useMemo } from 'react';
import { createClient } from '@/utils/supabase/client'; // Importación correcta

// Filtros estáticos
const ALL_CATEGORIES = ["Robótica", "Microcontroladores", "Herramientas", "Impresión 3D", "Componentes"];
const ALL_BRANDS = ["Arduino", "Raspberry Pi", "Fluke", "Creality", "Weller", "Espressif"];

export default function TiendaPage() {
  // 1. CORRECCIÓN: INICIALIZAR EL CLIENTE AQUÍ
  const supabase = createClient();
  
  const { addToCart } = useCart();
  
  // --- ESTADO DE DATOS (BD) ---
  const [products, setProducts] = useState<any[]>([]); 
  const [loading, setLoading] = useState(true); 

  // --- ESTADOS DE FILTROS ---
  const [searchTerm, setSearchTerm] = useState('');
  const [priceRange, setPriceRange] = useState({ min: 0, max: 5000 });
  const [selectedCats, setSelectedCats] = useState<string[]>([]);
  const [selectedBrands, setSelectedBrands] = useState<string[]>([]);
  const [sortOrder, setSortOrder] = useState('relevant');
  
  // --- PAGINACIÓN ---
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 20;

  // 2. CARGAR PRODUCTOS DESDE SUPABASE
  useEffect(() => {
    async function fetchProducts() {
      try {
        const { data, error } = await supabase
          .from('products')
          .select('*')
          // .eq('is_active', true) <-- Descomenta esto si tienes esa columna en tu DB
          .order('id', { ascending: false });

        if (error) throw error;
        if (data) setProducts(data);
      } catch (error) {
        console.error("Error al cargar productos:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchProducts();
  }, [supabase]); // Agregamos supabase como dependencia

  // 3. LÓGICA DE FILTRADO (Client-Side)
  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchPrice = product.price >= priceRange.min && product.price <= priceRange.max;
      const matchCat = selectedCats.length === 0 || (product.category && selectedCats.includes(product.category));
      const matchBrand = selectedBrands.length === 0 || (product.brand && selectedBrands.includes(product.brand));

      return matchSearch && matchPrice && matchCat && matchBrand;
    }).sort((a, b) => {
      if (sortOrder === 'low-high') return a.price - b.price;
      if (sortOrder === 'high-low') return b.price - a.price;
      if (sortOrder === 'a-z') return a.name.localeCompare(b.name);
      return 0; 
    });
  }, [products, searchTerm, priceRange, selectedCats, selectedBrands, sortOrder]);

  // Resetear página al filtrar
  useEffect(() => { setCurrentPage(1); }, [searchTerm, priceRange, selectedCats, selectedBrands, sortOrder]);

  // Paginación
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const toggleFilter = (item: string, list: string[], setList: any) => {
    if (list.includes(item)) setList(list.filter((i: string) => i !== item));
    else setList([...list, item]);
  };

  const clearFilters = () => {
    setPriceRange({ min: 0, max: 5000 });
    setSelectedCats([]);
    setSelectedBrands([]);
    setSearchTerm('');
    setSortOrder('relevant');
  };

  return (
    <div className="min-h-screen bg-[#050505] pt-20 pb-20 px-4">
      <div className="max-w-[1400px] mx-auto">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-white">TIENDA <span className="text-[#FFD700]">OFICIAL</span></h1>
            <p className="text-gray-400 text-sm mt-1">
              {loading ? 'Cargando catálogo...' : `${filteredProducts.length} productos disponibles`}
            </p>
          </div>
          
          <div className="flex gap-4 w-full md:w-auto">
            <div className="relative flex-1 md:w-80">
              <input 
                type="text" placeholder="Buscar producto..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-[#111] border border-[#333] text-white py-2.5 pl-10 pr-4 rounded-lg focus:border-[#FFD700] outline-none transition"
              />
              <Search className="absolute left-3 top-3 text-gray-500 w-4 h-4" />
            </div>
            
            <select 
              value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}
              className="bg-[#111] border border-[#333] text-white px-4 rounded-lg focus:border-[#FFD700] outline-none cursor-pointer"
            >
              <option value="relevant">Relevancia</option>
              <option value="low-high">Precio: Menor a Mayor</option>
              <option value="high-low">Precio: Mayor a Menor</option>
              <option value="a-z">Alfabético (A-Z)</option>
            </select>
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* SIDEBAR FILTROS */}
          <aside className="lg:col-span-1 space-y-8 bg-[#111] p-6 rounded-2xl border border-[#333] h-fit sticky top-24">
            <div className="flex justify-between items-center border-b border-[#333] pb-4">
              <h3 className="font-bold text-white flex items-center gap-2"><Filter size={18} /> Filtros</h3>
              <button onClick={clearFilters} className="text-xs text-[#FFD700] hover:underline flex items-center gap-1">Borrar <X size={12} /></button>
            </div>
            {/* Precio */}
            <div>
              <h4 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Rango de Precio</h4>
              <div className="flex items-center gap-2">
                <input type="number" value={priceRange.min} onChange={(e) => setPriceRange({...priceRange, min: Number(e.target.value)})} className="w-full bg-black border border-[#333] rounded p-2 text-white text-sm focus:border-[#FFD700] outline-none" />
                <span className="text-gray-500">-</span>
                <input type="number" value={priceRange.max} onChange={(e) => setPriceRange({...priceRange, max: Number(e.target.value)})} className="w-full bg-black border border-[#333] rounded p-2 text-white text-sm focus:border-[#FFD700] outline-none" />
              </div>
            </div>
            {/* Categorías */}
            <div>
              <h4 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Categoría</h4>
              <div className="space-y-2">
                {ALL_CATEGORIES.map(cat => (
                  <label key={cat} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${selectedCats.includes(cat) ? 'bg-[#FFD700] border-[#FFD700]' : 'border-[#333] bg-black group-hover:border-gray-500'}`}>
                      {selectedCats.includes(cat) && <X size={12} className="text-black" />}
                    </div>
                    <input type="checkbox" className="hidden" onChange={() => toggleFilter(cat, selectedCats, setSelectedCats)} checked={selectedCats.includes(cat)} />
                    <span className={`text-sm ${selectedCats.includes(cat) ? 'text-white font-bold' : 'text-gray-400'}`}>{cat}</span>
                  </label>
                ))}
              </div>
            </div>
            {/* Marcas */}
            <div>
              <h4 className="text-sm font-bold text-gray-300 mb-3 uppercase tracking-wider">Marca</h4>
              <div className="space-y-2">
                {ALL_BRANDS.map(brand => (
                  <label key={brand} className="flex items-center gap-3 cursor-pointer group">
                    <div className={`w-5 h-5 rounded border flex items-center justify-center transition ${selectedBrands.includes(brand) ? 'bg-[#FFD700] border-[#FFD700]' : 'border-[#333] bg-black group-hover:border-gray-500'}`}>
                      {selectedBrands.includes(brand) && <X size={12} className="text-black" />}
                    </div>
                    <input type="checkbox" className="hidden" onChange={() => toggleFilter(brand, selectedBrands, setSelectedBrands)} checked={selectedBrands.includes(brand)} />
                    <span className={`text-sm ${selectedBrands.includes(brand) ? 'text-white font-bold' : 'text-gray-400'}`}>{brand}</span>
                  </label>
                ))}
              </div>
            </div>
          </aside>

          {/* GRID PRODUCTOS */}
          <div className="lg:col-span-3">
            {loading ? (
              <div className="h-96 flex flex-col items-center justify-center text-[#FFD700]">
                <Loader2 size={48} className="animate-spin mb-4" />
                <p className="text-white font-bold">Cargando productos...</p>
              </div>
            ) : currentProducts.length === 0 ? (
              <div className="h-64 flex flex-col items-center justify-center text-gray-500 border border-[#333] border-dashed rounded-2xl">
                <Search size={48} className="mb-4 opacity-20" />
                <p>No se encontraron productos con estos filtros.</p>
                <button onClick={clearFilters} className="text-[#FFD700] mt-2 underline">Limpiar búsqueda</button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {currentProducts.map((p) => (
                  <div key={p.id} className="group relative bg-[#111] border border-[#333] rounded-xl overflow-hidden hover:border-[#FFD700] transition-all duration-300 hover:shadow-[0_0_20px_rgba(255,215,0,0.15)] flex flex-col">
                    {p.brand && (
                      <div className="absolute top-3 left-3 z-20 bg-black/80 backdrop-blur px-2 py-1 rounded text-[10px] text-gray-300 border border-white/10">{p.brand}</div>
                    )}
                    <div className="relative h-64 overflow-hidden">
                      <div className="absolute inset-0 bg-cover bg-center transition-transform duration-700 group-hover:scale-110" style={{ backgroundImage: `url(${p.image_url || p.image})` }}></div>
                      <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center gap-3 p-4">
                        <button onClick={() => addToCart(p)} className="w-full bg-[#FFD700] text-black font-bold py-3 rounded-lg hover:bg-[#e6c200] transform translate-y-4 group-hover:translate-y-0 transition duration-300 flex items-center justify-center gap-2"><ShoppingCart size={18} /> Agregar</button>
                        <Link href={`/tienda/${p.id}`} className="w-full bg-white text-black font-bold py-3 rounded-lg hover:bg-gray-200 transform translate-y-4 group-hover:translate-y-0 transition duration-300 delay-75 flex items-center justify-center gap-2"><Eye size={18} /> Ver Detalles</Link>
                      </div>
                    </div>
                    <div className="p-5 flex-1 flex flex-col justify-between bg-gradient-to-b from-[#111] to-black">
                      <div>
                        <div className="flex justify-between items-start mb-2">
                          <p className="text-xs text-gray-500 uppercase font-bold tracking-wider">{p.category || 'General'}</p>
                          <div className="flex items-center gap-1 text-[#FFD700]"><Star size={12} fill="#FFD700" /><span className="text-xs font-bold">4.8</span></div>
                        </div>
                        <Link href={`/tienda/${p.id}`}><h3 className="font-bold text-white text-lg mb-2 leading-tight hover:text-[#FFD700] transition line-clamp-2">{p.name}</h3></Link>
                      </div>
                      <div className="mt-4 pt-4 border-t border-[#222] flex items-center justify-between">
                        <span className="text-2xl font-bold text-[#FFD700]">${p.price}</span>
                        {p.stock < 5 ? <span className="text-xs text-red-500 font-bold animate-pulse">¡Últimos {p.stock}!</span> : <span className="text-xs text-green-500 font-bold flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-green-500"></div> Stock</span>}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            
            {/* PAGINACIÓN */}
            {!loading && totalPages > 1 && (
              <div className="mt-12 flex justify-center gap-2">
                <button onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} className="w-10 h-10 flex items-center justify-center border border-[#333] rounded hover:border-[#FFD700] text-white disabled:opacity-50 disabled:cursor-not-allowed transition"><ChevronLeft size={20} /></button>
                {[...Array(totalPages)].map((_, i) => (
                  <button key={i} onClick={() => setCurrentPage(i + 1)} className={`w-10 h-10 flex items-center justify-center rounded font-bold transition ${currentPage === i + 1 ? 'bg-[#FFD700] text-black' : 'border border-[#333] text-white hover:border-[#FFD700]'}`}>{i + 1}</button>
                ))}
                <button onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} className="w-10 h-10 flex items-center justify-center border border-[#333] rounded hover:border-[#FFD700] text-white disabled:opacity-50 disabled:cursor-not-allowed transition"><ChevronRight size={20} /></button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}