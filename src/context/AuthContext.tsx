'use client';
import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { createClient } from '@/utils/supabase/client';

// Definimos la estructura de un usuario
interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'admin' | 'customer';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  // CORRECCIÓN AQUÍ: Ahora aceptamos 'password' como 3er argumento opcional
  login: (email: string, role: 'admin' | 'customer', password?: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const supabase = createClient();

  // 1. VERIFICAR SESIÓN AL CARGAR (PERSISTENCIA)
  useEffect(() => {
    const checkSession = async () => {
      // --- A) MODO OFFLINE (SIMULACIÓN) ---
      const storedSession = localStorage.getItem('corveo_session');
      if (storedSession) {
        setUser(JSON.parse(storedSession));
        setLoading(false);
        return;
      }

      // --- B) MODO ONLINE (REAL - Descomentar luego) ---
      /*
      const { data: { session } } = await supabase.auth.getSession();
      if (session) {
        const { data: profile } = await supabase
           .from('profiles')
           .select('*')
           .eq('id', session.user.id)
           .single();
        
        if (profile) {
            setUser({
                id: session.user.id,
                email: session.user.email!,
                full_name: profile.full_name,
                role: profile.role
            });
        }
      }
      */
      
      setLoading(false);
    };
    checkSession();
  }, []);

  // 2. FUNCIÓN DE LOGIN (Ahora recibe password)
  const login = async (email: string, role: 'admin' | 'customer', password?: string) => {
    setLoading(true);

    try {
        // --- VALIDACIÓN OFFLINE ---
        await new Promise(resolve => setTimeout(resolve, 1000));

        if (role === 'admin') {
            if (email !== 'admin@cuervo.com' || password !== 'Admin123!') {
                throw new Error("Credenciales de Administrador inválidas.");
            }
        } else {
            // Validación simple para clientes en modo prueba
            if (email === 'cliente@demo.com' && password !== '123456') {
                throw new Error("Contraseña incorrecta.");
            }
        }

        // Crear usuario simulado
        const mockUser: User = {
            id: role === 'admin' ? 'admin-id' : 'user-id-123',
            email: email,
            full_name: role === 'admin' ? 'Administrador' : 'Tony Stark',
            role: role
        };

        // Guardar sesión
        localStorage.setItem('corveo_session', JSON.stringify(mockUser));
        if (role === 'admin') localStorage.setItem('admin_session', 'active');
        
        setUser(mockUser);

        // Redirección
        if (role === 'admin') router.push('/admin');
        else router.push('/');

    } catch (error) {
        throw error;
    } finally {
        setLoading(false);
    }
  };

  // 3. FUNCIÓN DE LOGOUT
  const logout = async () => {
    localStorage.removeItem('corveo_session');
    localStorage.removeItem('admin_session');
    await supabase.auth.signOut();
    setUser(null);
    router.push('/auth/login');
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth debe usarse dentro de un AuthProvider");
  return context;
};