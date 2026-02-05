'use client';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { createClient } from '@/utils/supabase/client';
import { Filter } from 'bad-words';
import { Eye, EyeOff, Check, X, ShieldAlert, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

// --- 1. CONFIGURACIÓN DEL FILTRO DE GROSERÍAS ---
const filter = new Filter();
// Agregamos jerga peruana/latina común para bloquear
filter.addWords('puta', 'mierda', 'conchatumadre', 'cabro', 'pinga', 'culo', 'idiota', 'estupido');

// --- 2. ESQUEMA DE VALIDACIÓN (ZOD) ---
const registerSchema = z.object({
  fullName: z.string()
    .min(3, "El nombre debe tener al menos 3 letras")
    .refine((val) => !filter.isProfane(val), {
      message: "El nombre contiene palabras no permitidas. Sé profesional.",
    }),
  email: z.string().email("Correo electrónico inválido"),
  password: z.string()
    .min(8, "Mínimo 8 caracteres")
    .regex(/[A-Z]/, "Falta una mayúscula")
    .regex(/[a-z]/, "Falta una minúscula")
    .regex(/[0-9]/, "Falta un número")
    .regex(/[^A-Za-z0-9]/, "Falta un símbolo (@, #, $, etc.)"),
  confirmPassword: z.string()
}).refine((data) => data.password === data.confirmPassword, {
  message: "Las contraseñas no coinciden",
  path: ["confirmPassword"],
});

type FormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const supabase = createClient();
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const { register, handleSubmit, formState: { errors }, watch } = useForm<FormData>({
    resolver: zodResolver(registerSchema),
    mode: "onChange" // Valida mientras escribes
  });

  const passwordValue = watch("password", "");

  // Función para verificar requisitos visualmente
  const checkReq = (regex: RegExp) => regex.test(passwordValue);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setServerError(null);

    try {
      // A. Crear Usuario en Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: data.email,
        password: data.password,
        options: {
          data: { full_name: data.fullName }, // Meta-data inicial
        }
      });

      if (authError) throw authError;
      if (!authData.user) throw new Error("No se pudo crear el usuario");

      // B. Crear Entrada en Tabla 'profiles' (Crucial para tu Admin Panel)
      const { error: profileError } = await supabase.from('profiles').insert([{
        id: authData.user.id,
        email: data.email,
        full_name: data.fullName,
        role: 'customer' // Rol por defecto
      }]);

      if (profileError) {
        // Si falla el perfil, es un problema de consistencia, pero el usuario ya se creó.
        console.error("Error creando perfil:", profileError);
      }

      // C. Éxito
      alert("¡Cuenta creada! Revisa tu correo o inicia sesión.");
      router.push('/auth/login');

    } catch (error: any) {
      setServerError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
      <div className="bg-[#111] border border-[#222] w-full max-w-md p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        
        {/* Decoración Superior */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFD700] to-yellow-900"></div>

        <div className="text-center mb-8">
          <h1 className="text-3xl font-black text-white tracking-tight">Únete a Cuervo Blanco</h1>
          <p className="text-gray-500 text-sm mt-2">Crea tu cuenta para acceder a la tecnología</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
          
          {/* Nombre Completo */}
          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-gray-500 ml-1">Nombre o Apodo</label>
            <input 
              {...register("fullName")}
              className={`w-full bg-[#0a0a0a] border ${errors.fullName ? 'border-red-500' : 'border-[#333]'} p-3 rounded-xl outline-none focus:border-[#FFD700] transition-colors`}
              placeholder="Ingeniero Tony Stark"
            />
            {errors.fullName && <span className="text-red-500 text-xs flex items-center gap-1"><ShieldAlert size={12}/> {errors.fullName.message}</span>}
          </div>

          {/* Email */}
          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-gray-500 ml-1">Correo Electrónico</label>
            <input 
              {...register("email")}
              type="email"
              className={`w-full bg-[#0a0a0a] border ${errors.email ? 'border-red-500' : 'border-[#333]'} p-3 rounded-xl outline-none focus:border-[#FFD700] transition-colors`}
              placeholder="nombre@ejemplo.com"
            />
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
          </div>

          {/* Contraseña */}
          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-gray-500 ml-1">Contraseña Segura</label>
            <div className="relative">
              <input 
                {...register("password")}
                type={showPass ? "text" : "password"}
                className={`w-full bg-[#0a0a0a] border ${errors.password ? 'border-red-500' : 'border-[#333]'} p-3 rounded-xl outline-none focus:border-[#FFD700] transition-colors pr-10`}
                placeholder="••••••••"
              />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-gray-500 hover:text-white">
                {showPass ? <EyeOff size={18}/> : <Eye size={18}/>}
              </button>
            </div>
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
            
            {/* Checklist de Contraseña (Visual Feedback) */}
            <div className="grid grid-cols-2 gap-2 mt-2 bg-[#1a1a1a] p-3 rounded-lg border border-[#222]">
               <ReqItem label="8+ Caracteres" met={passwordValue.length >= 8} />
               <ReqItem label="Mayúscula (A-Z)" met={checkReq(/[A-Z]/)} />
               <ReqItem label="Minúscula (a-z)" met={checkReq(/[a-z]/)} />
               <ReqItem label="Número (0-9)" met={checkReq(/[0-9]/)} />
               <ReqItem label="Símbolo (!@#)" met={checkReq(/[^A-Za-z0-9]/)} />
            </div>
          </div>

          {/* Confirmar Contraseña */}
          <div className="space-y-1">
            <label className="text-xs uppercase font-bold text-gray-500 ml-1">Confirmar Contraseña</label>
            <input 
              {...register("confirmPassword")}
              type="password"
              className={`w-full bg-[#0a0a0a] border ${errors.confirmPassword ? 'border-red-500' : 'border-[#333]'} p-3 rounded-xl outline-none focus:border-[#FFD700] transition-colors`}
              placeholder="••••••••"
            />
            {errors.confirmPassword && <span className="text-red-500 text-xs">{errors.confirmPassword.message}</span>}
          </div>

          {/* Mensaje de Error del Servidor */}
          {serverError && (
            <div className="bg-red-900/20 border border-red-900 p-3 rounded-lg text-red-400 text-sm text-center">
              {serverError}
            </div>
          )}

          <button 
            type="submit" 
            disabled={loading}
            className="w-full bg-[#FFD700] text-black font-black py-4 rounded-xl hover:bg-[#ffe033] transition-all transform active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed flex justify-center gap-2"
          >
            {loading ? <Loader2 className="animate-spin" /> : 'CREAR CUENTA'}
          </button>

          <p className="text-center text-gray-500 text-sm mt-4">
            ¿Ya tienes cuenta? <Link href="/auth/login" className="text-[#FFD700] font-bold hover:underline">Inicia Sesión</Link>
          </p>
        </form>
      </div>
    </div>
  );
}

// Componente pequeño para el checklist
function ReqItem({ label, met }: { label: string, met: boolean }) {
  return (
    <div className={`flex items-center gap-2 text-[10px] font-bold transition-colors ${met ? 'text-green-500' : 'text-gray-600'}`}>
      {met ? <Check size={12} /> : <X size={12} />} {label}
    </div>
  );
}