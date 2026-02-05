'use client';
import { motion } from 'framer-motion';

const brands = ["Arduino", "Raspberry Pi", "Altium", "Prusa", "Fluke", "Weller", "Nvidia", "Intel", "Microchip", "Espressif"];

export default function BrandsMarquee() {
  return (
    <div className="bg-[#FFD700] py-4 overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-[#FFD700] to-transparent z-10"></div>
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-[#FFD700] to-transparent z-10"></div>
      
      <div className="flex">
        <motion.div 
          className="flex gap-16 whitespace-nowrap text-black font-bold text-xl uppercase tracking-widest"
          animate={{ x: "-50%" }}
          transition={{ repeat: Infinity, ease: "linear", duration: 20 }}
        >
          {[...brands, ...brands, ...brands].map((brand, i) => (
            <span key={i}>{brand}</span>
          ))}
        </motion.div>
      </div>
    </div>
  );
}