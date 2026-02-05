import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/shared/Navbar';
import Footer from '@/components/shared/Footer'; // 1. IMPORTAR FOOTER (Asegúrate que exista el archivo)
import CartSidebar from '@/components/shared/CartSidebar'; 
import SmartRaven from '@/components/shared/SmartRaven'; // 2. IMPORTAR CUERVO
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Corveo Perú | Ingeniería Electrónica', // 3. CAMBIO DE NOMBRE
  description: 'Tienda de electrónica, desarrollo de proyectos y reparaciones.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="es">
      <body className={inter.className}>
        <AuthProvider>
          <CartProvider>
            <Navbar />
            <CartSidebar />
            <SmartRaven /> {/* 4. AGREGAR CUERVO AQUÍ */}
            
            <main className="min-h-screen">
              {children}
            </main>

            <Footer /> {/* 5. AGREGAR FOOTER AQUÍ */}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}