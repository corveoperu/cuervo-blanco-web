'use client';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext'; // HOOK
import { Eye, ShoppingBag, Loader2, AlertCircle } from 'lucide-react'; // Se quitó EyeOff que no se usaba
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const loginSchema = z.object({
  email: z.string().email("Correo inválido"),
  password: z.string().min(1, "Ingresa tu contraseña"),
});
type FormData = z.infer<typeof loginSchema>;

export default function CustomerLoginPage() {
  const { login, user } = useAuth(); // USAR CONTEXTO
  const router = useRouter();
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(loginSchema) });

  // SI YA ESTÁS LOGUEADO, AL HOME
  useEffect(() => {
    if (user) router.push('/');
  }, [user, router]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await login(data.email, 'customer', data.password);
      // El contexto redirige automáticamente
    } catch (err: any) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white flex items-center justify-center p-4">
      <div className="bg-[#111] border border-[#222] w-full max-w-md p-8 rounded-2xl shadow-2xl relative overflow-hidden">
        
        {/* Decoración Superior */}
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-purple-500"></div>
        
        <div className="text-center mb-8">
          <div className="inline-block p-3 rounded-full bg-blue-900/20 mb-4">
             <ShoppingBag className="text-blue-400 w-8 h-8" />
          </div>
          <h1 className="text-2xl font-bold text-white">¡Hola de nuevo!</h1>
          <p className="text-gray-500 text-sm mt-2">Ingresa para ver tus pedidos y favoritos</p>
        </div>

        {errorMsg && (
          <div className="mb-6 bg-red-900/10 border border-red-900/50 p-3 rounded-lg flex items-center gap-2 text-sm text-red-400">
             <AlertCircle size={16} /> {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 ml-1">CORREO</label>
            <input {...register("email")} className="w-full bg-[#0a0a0a] border border-[#333] p-3 rounded-xl outline-none focus:border-blue-500 transition-colors" placeholder="tu@correo.com" />
            {errors.email && <span className="text-red-500 text-xs">{errors.email.message}</span>}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-gray-500 ml-1">CONTRASEÑA</label>
            <div className="relative">
              <input {...register("password")} type={showPass ? "text" : "password"} className="w-full bg-[#0a0a0a] border border-[#333] p-3 rounded-xl outline-none focus:border-blue-500 transition-colors pr-10" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPass(!showPass)} className="absolute right-3 top-3.5 text-gray-500 hover:text-white">
                 <Eye size={18}/>
              </button>
            </div>
            {errors.password && <span className="text-red-500 text-xs">{errors.password.message}</span>}
          </div>

          <button type="submit" disabled={loading} className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-all flex justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : 'INGRESAR'}
          </button>

          <div className="text-center text-[10px] text-gray-700 mt-4 font-mono">
             MODO PRUEBA: cliente@demo.com / 123456
          </div>

          <p className="text-center text-gray-500 text-sm mt-4">
            ¿Nuevo aquí? <Link href="/auth/register" className="text-blue-400 font-bold hover:underline">Crea una cuenta</Link>
          </p>
        </form>
      </div>
    </div>
  );
}