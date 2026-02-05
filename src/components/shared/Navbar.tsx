'use client';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Menu, X, ShoppingCart, User, Search, Package, Cpu, ArrowRight, Bird } from 'lucide-react';
import { useState, useEffect, useRef } from 'react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext'; // IMPORTAR AUTH
import { motion } from 'framer-motion';
import productsData from '@/data/products.json';
import projectsData from '@/data/projects.json';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { toggleCart, cart } = useCart();
  const { user } = useAuth(); // OBTENER USUARIO
  const router = useRouter();
  
  // --- LÓGICA DE BÚSQUEDA ---
  const [searchTerm, setSearchTerm] = useState('');
  const [suggestions, setSuggestions] = useState<{products: any[], projects: any[]}>({ products: [], projects: [] });
  const [showDropdown, setShowDropdown] = useState(false);
  const searchRef = useRef<HTMLDivElement>(null);

  const normalizeText = (text: string) => {
    return text.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    const rawTerm = e.target.value;
    setSearchTerm(rawTerm);
    const term = normalizeText(rawTerm);

    if (term.length > 1) {
      const filteredProducts = productsData.filter(p => {
        const name = normalizeText(p.name);
        const cat = p.category ? normalizeText(p.category) : '';
        const brand = p.brand ? normalizeText(p.brand) : '';
        return name.includes(term) || cat.includes(term) || brand.includes(term);
      }).slice(0, 3);

      const filteredProjects = projectsData.filter(p => {
        const title = normalizeText(p.title);
        const components = p.components.map((c: string) => normalizeText(c)).join(' ');
        return title.includes(term) || components.includes(term);
      }).slice(0, 3);

      setSuggestions({ products: filteredProducts, projects: filteredProjects });
      setShowDropdown(true);
    } else {
      setShowDropdown(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const goToResult = (path: string) => {
    router.push(path);
    setSearchTerm('');
    setShowDropdown(false);
    setIsOpen(false);
  };

  // --- EFECTO TYPEWRITER ---
  const [placeholder, setPlaceholder] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);
  const [loopNum, setLoopNum] = useState(0);
  const [typingSpeed, setTypingSpeed] = useState(150);
  const phrases = ["¿Te gustaría programar con Arduino?", "Intenta buscar 'Raspberry Pi'...", "¿Necesitas un servomotor?", "Busca 'Kit de Robótica'...", "Proyectos de domótica..."];

  useEffect(() => {
    const handleType = () => {
      const i = loopNum % phrases.length;
      const fullText = phrases[i];
      setPlaceholder(isDeleting ? fullText.substring(0, placeholder.length - 1) : fullText.substring(0, placeholder.length + 1));
      setTypingSpeed(isDeleting ? 50 : 100);
      if (!isDeleting && placeholder === fullText) { setTimeout(() => setIsDeleting(true), 2000); } 
      else if (isDeleting && placeholder === '') { setIsDeleting(false); setLoopNum(loopNum + 1); }
    };
    const timer = setTimeout(handleType, typingSpeed);
    return () => clearTimeout(timer);
  }, [placeholder, isDeleting, loopNum, typingSpeed, phrases]);

  const navItems = [
    { name: 'Inicio', path: '/' },
    { name: 'La Academia', path: '/proyectos' },
    { name: 'Tienda', path: '/tienda' },
    { name: 'Reparaciones', path: '/reparaciones' },
    { name: 'Encargos', path: '/encargos' },
  ];

  return (
    <nav className="fixed w-full z-50 bg-[#050505]/95 backdrop-blur-md border-b border-[#333]">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-20 gap-8">
          
          {/* LOGO */}
          <Link href="/" className="flex items-center gap-3 shrink-0 group">
             <motion.div 
               className="text-[#FFD700]"
               whileHover={{ scale: 1.2, rotate: -5 }} 
               whileTap={{ scale: 0.9 }}
               transition={{ type: "spring", stiffness: 400, damping: 10 }}
             >
                <Bird className="h-9 w-9" />
             </motion.div>
             <span className="text-xl font-bold tracking-wider text-white hidden lg:block group-hover:text-[#FFD700] transition-colors duration-300">
               CORVEO
             </span>
          </Link>     

          {/* SEARCH BAR */}
          <div className="hidden md:flex flex-1 max-w-2xl relative" ref={searchRef}>
            <div className="w-full relative">
              <input 
                type="text" value={searchTerm} onChange={handleSearch} onFocus={() => searchTerm.length > 1 && setShowDropdown(true)} placeholder={placeholder}
                className="w-full bg-[#111] border border-[#333] text-white py-2.5 pl-10 pr-4 rounded-full focus:border-[#FFD700] focus:ring-1 focus:ring-[#FFD700] outline-none transition-all placeholder-gray-500 font-mono text-sm"
              />
              <Search className="absolute left-3.5 top-2.5 text-gray-400 w-4 h-4" />
            </div>
            {/* ... Dropdown (igual que antes) ... */}
            {showDropdown && (suggestions.products.length > 0 || suggestions.projects.length > 0) && (
              <div className="absolute top-12 left-0 w-full bg-[#111] border border-[#333] rounded-xl shadow-2xl overflow-hidden z-50">
                {/* ... Contenido del dropdown igual ... */}
                {suggestions.products.map(p => (
                   <button key={p.id} onClick={() => goToResult(`/tienda/${p.id}`)} className="w-full text-left flex items-center gap-3 p-3 hover:bg-[#222]"><p className="text-white text-sm">{p.name}</p></button>
                ))}
              </div>
            )}
          </div>

          {/* LINKS ESCRITORIO */}
          <div className="hidden lg:flex items-center gap-6 shrink-0">
            {navItems.map((item) => (
              <Link key={item.name} href={item.path} className="text-gray-300 hover:text-[#FFD700] text-sm font-bold uppercase tracking-wide transition-colors">
                {item.name}
              </Link>
            ))}
          </div>

          {/* ICONOS */}
          <div className="flex items-center gap-4 shrink-0">
            <button onClick={toggleCart} className="relative text-white hover:text-[#FFD700] transition group">
              <ShoppingCart className="h-6 w-6 group-hover:scale-110 transition-transform" />
              {cart.length > 0 && <span className="absolute -top-2 -right-2 bg-[#FFD700] text-black text-[10px] font-bold h-5 w-5 flex items-center justify-center rounded-full border-2 border-black">{cart.length}</span>}
            </button>
            
            {/* --- AQUÍ ESTÁ EL CAMBIO INTELIGENTE --- */}
            {user ? (
              <Link href="/profile" className="hidden md:flex items-center gap-2 group">
                <div className="w-8 h-8 rounded-full bg-[#FFD700] text-black flex items-center justify-center font-bold text-sm shadow-lg shadow-[#FFD700]/20">
                  {user.full_name.charAt(0).toUpperCase()}
                </div>
              </Link>
            ) : (
              <Link href="/auth/login" className="hidden md:block text-white hover:text-[#FFD700] transition">
                <User className="h-6 w-6" />
              </Link>
            )}

            <button onClick={() => setIsOpen(!isOpen)} className="lg:hidden text-white">{isOpen ? <X /> : <Menu />}</button>
          </div>
        </div>
      </div>
      
      {/* MENÚ MÓVIL */}
      {isOpen && (
        <div className="lg:hidden bg-black border-b border-[#333] max-h-[90vh] overflow-y-auto">
          {navItems.map((item) => (
            <Link key={item.name} href={item.path} className="block px-6 py-4 text-gray-300 border-b border-[#222]" onClick={() => setIsOpen(false)}>{item.name}</Link>
          ))}
          {/* Opción extra en móvil si no está logueado */}
          {!user && (
             <Link href="/auth/login" className="block px-6 py-4 text-[#FFD700] font-bold border-b border-[#222]" onClick={() => setIsOpen(false)}>
                Iniciar Sesión
             </Link>
          )}
          {user && (
             <Link href="/profile" className="block px-6 py-4 text-[#FFD700] font-bold border-b border-[#222]" onClick={() => setIsOpen(false)}>
                Mi Perfil ({user.full_name})
             </Link>
          )}
        </div>
      )}
    </nav>
  );
}