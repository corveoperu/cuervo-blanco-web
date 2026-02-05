import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import Navbar from '@/components/shared/Navbar';
import { CartProvider } from '@/context/CartContext';
import { AuthProvider } from '@/context/AuthContext'; // IMPORTANTE

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Cuervo Blanco | Ingeniería Electrónica',
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
        <AuthProvider> {/* 1. AUTH PRIMERO */}
          <CartProvider> {/* 2. CART SEGUNDO */}
            <Navbar />
            {children}
          </CartProvider>
        </AuthProvider>
      </body>
    </html>
  );
}