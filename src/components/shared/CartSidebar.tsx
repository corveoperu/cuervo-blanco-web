'use client';
import { useCart } from '@/context/CartContext';
import { X, Trash2, ShoppingBag } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import Link from 'next/link';

export default function CartSidebar() {
  const { isCartOpen, toggleCart, cart, removeFromCart, total } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* 1. OVERLAY (FONDO) - SIN BLUR PARA MAYOR VELOCIDAD */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={toggleCart}
            className="fixed inset-0 bg-black/70 z-[60]" 
          />

          {/* 2. PANEL LATERAL - OPTIMIZADO PARA GPU */}
          <motion.div 
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            // Transición rápida y seca (0.3s)
            transition={{ type: "tween", duration: 0.3, ease: "easeOut" }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-[#111] border-l border-[#333] z-[70] shadow-2xl flex flex-col will-change-transform"
          >
            {/* Cabecera */}
            <div className="p-6 border-b border-[#333] flex justify-between items-center bg-[#0a0a0a]">
              <div className="flex items-center gap-2">
                <ShoppingBag className="text-[#FFD700]" />
                <h2 className="text-xl font-bold text-white">Tu Carrito</h2>
                <span className="bg-[#FFD700] text-black text-xs font-bold px-2 py-0.5 rounded-full">
                  {cart.length}
                </span>
              </div>
              <button onClick={toggleCart} className="text-gray-400 hover:text-white transition p-2">
                <X size={24} />
              </button>
            </div>

            {/* Lista de Productos */}
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center text-center space-y-4 text-gray-500">
                  <ShoppingBag size={48} className="opacity-20" />
                  <p>Tu carrito está vacío.</p>
                  <button onClick={toggleCart} className="text-[#FFD700] hover:underline text-sm">
                    Volver a la tienda
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div 
                    key={item.id} 
                    className="flex gap-4 bg-black/40 p-3 rounded-lg border border-[#333] hover:border-[#FFD700]/30 transition"
                  >
                    {/* Imagen */}
                    <div 
                      className="w-20 h-20 bg-gray-800 rounded-md bg-cover bg-center shrink-0 border border-[#333]" 
                      style={{ backgroundImage: `url(${item.image})` }}
                    ></div>
                    
                    {/* Detalles */}
                    <div className="flex-1 flex flex-col justify-between">
                      <div>
                        <h3 className="font-bold text-sm text-gray-200 line-clamp-1">{item.name}</h3>
                        <p className="text-[#FFD700] font-bold text-sm">${item.price}</p>
                      </div>
                      <div className="flex justify-between items-end">
                        <p className="text-xs text-gray-500 bg-[#222] px-2 py-1 rounded">Cant: {item.quantity}</p>
                        <button 
                          onClick={() => removeFromCart(item.id)} 
                          className="text-red-500 hover:text-red-400 hover:bg-red-500/10 p-1.5 rounded transition"
                          title="Eliminar producto"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {/* Footer / Checkout */}
            {cart.length > 0 && (
              <div className="p-6 border-t border-[#333] bg-[#0a0a0a] space-y-4">
                {/* Input de Cupón */}
                <div>
                  <label className="text-xs text-gray-500 mb-1 block uppercase tracking-wider font-bold">Cupón de Descuento</label>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="CÓDIGO" 
                      className="flex-1 bg-[#1a1a1a] border border-[#333] rounded p-2.5 text-sm text-white focus:border-[#FFD700] outline-none transition" 
                    />
                    <button className="bg-[#333] text-white px-4 py-2 rounded text-xs font-bold hover:bg-[#444] transition">
                      APLICAR
                    </button>
                  </div>
                </div>
                
                {/* Totales */}
                <div className="space-y-2 py-2">
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Subtotal</span>
                    <span>${total}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Envío</span>
                    <span className="text-[#FFD700]">Gratis</span>
                  </div>
                  <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-[#333]">
                    <span>Total</span>
                    <span className="text-[#FFD700]">${total}</span>
                  </div>
                </div>
                
                {/* Botón de Acción */}
                <Link 
                  href="/checkout" 
                  onClick={toggleCart}
                  className="w-full bg-[#FFD700] text-black py-4 rounded font-bold hover:bg-[#e6c200] transition uppercase tracking-widest text-sm flex items-center justify-center gap-2"
                >
                  Proceder al Pago <ShoppingBag size={18} />
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}