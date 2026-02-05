'use client';
import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';
import { ShieldAlert, Loader2 } from 'lucide-react';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const pathname = usePathname(); // Para saber en qué página estamos
  const [isAuthorized, setIsAuthorized] = useState(false);
  const supabase = createClient();

  useEffect(() => {
    // Si ya estamos en el login, no validamos (para evitar bucle infinito)
    if (pathname === '/admin/login') {
        setIsAuthorized(true);
        return;
    }

    const checkAccess = async () => {
      // ==========================================
      // 1. VERIFICACIÓN OFFLINE (SIMULADA)
      // ==========================================
      const offlineSession = localStorage.getItem('admin_session');
      
      if (offlineSession === 'active') {
        setIsAuthorized(true);
        return; 
      }

      // ==========================================
      // 2. VERIFICACIÓN ONLINE (REAL - FUTURO)
      // ==========================================
      /* const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
           .from('profiles')
           .select('role')
           .eq('id', session.user.id)
           .single();
           
        if (profile?.role === 'admin') {
            setIsAuthorized(true);
            return;
        }
      }
      */

      // SI FALLA: Expulsar al login
      console.warn("🔒 Acceso denegado: Se requiere autenticación.");
      router.push('/admin/login');
    };

    checkAccess();
  }, [router, pathname]);

  // Mientras verifica, mostramos pantalla de seguridad
  if (!isAuthorized && pathname !== '/admin/login') {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-[#FFD700] p-4 text-center">
        <ShieldAlert className="w-16 h-16 mb-4 animate-pulse text-red-500" />
        <h2 className="text-xl font-black tracking-widest uppercase text-white">Verificando Credenciales</h2>
        <div className="flex items-center gap-2 mt-4 text-xs text-gray-500 font-mono">
            <Loader2 className="animate-spin w-3 h-3"/> ACCESS CONTROL SYSTEM
        </div>
      </div>
    );
  }

  return <>{children}</>;
}