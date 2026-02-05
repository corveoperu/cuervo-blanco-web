'use client';
import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useAuth } from '@/context/AuthContext'; // HOOK
import { Loader2, AlertTriangle, Lock, ShieldCheck } from 'lucide-react';
import { useRouter } from 'next/navigation';

const adminSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});
type FormData = z.infer<typeof adminSchema>;

export default function AdminLoginPage() {
  const { login, user } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const { register, handleSubmit } = useForm<FormData>({ resolver: zodResolver(adminSchema) });

  // SI YA ESTÁS LOGUEADO COMO ADMIN, ENTRA
  useEffect(() => {
    if (user?.role === 'admin') router.push('/admin');
  }, [user, router]);

  const onSubmit = async (data: FormData) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      await login(data.email, 'admin', data.password);
    } catch (err: any) {
      setErrorMsg(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-sm border border-[#333] bg-[#0a0a0a] p-8 rounded-lg shadow-[0_0_50px_rgba(255,215,0,0.05)] relative overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-[#FFD700] to-transparent"></div>
        <div className="text-center mb-8">
          <div className="bg-[#FFD700]/10 p-3 rounded-full inline-block mb-4"><Lock className="w-8 h-8 text-[#FFD700]" /></div>
          <h1 className="text-xl font-black text-white tracking-widest uppercase">Cuervo Blanco</h1>
          <p className="text-[#FFD700] text-[10px] font-bold tracking-[0.2em] mt-2 uppercase">Acceso Restringido</p>
        </div>
        {errorMsg && <div className="mb-6 bg-red-900/20 border border-red-900 p-3 rounded flex items-center gap-2 text-xs text-red-500 font-bold"><AlertTriangle size={14} /> {errorMsg}</div>}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="text-[10px] text-gray-500 font-bold ml-1 mb-1 block">ID OPERADOR</label>
            <input {...register("email")} className="w-full bg-black border border-[#333] p-3 rounded text-white text-sm outline-none focus:border-[#FFD700] transition-colors font-mono" placeholder="admin@cuervo.com" />
          </div>
          <div>
            <label className="text-[10px] text-gray-500 font-bold ml-1 mb-1 block">CLAVE DE ACCESO</label>
            <input {...register("password")} type="password" className="w-full bg-black border border-[#333] p-3 rounded text-white text-sm outline-none focus:border-[#FFD700] transition-colors font-mono" placeholder="••••••••" />
          </div>
          <button type="submit" disabled={loading} className="w-full bg-[#FFD700] text-black font-black py-3 rounded text-sm hover:bg-[#ffe033] transition-all flex justify-center gap-2 uppercase tracking-wide mt-4">
            {loading ? <Loader2 className="animate-spin w-4 h-4" /> : 'Autenticar Sistema'}
          </button>
        </form>
        <div className="mt-8 text-center border-t border-[#222] pt-4 flex justify-center gap-2 text-[#FFD700]/50 text-[10px] font-mono"><ShieldCheck size={12}/> SECURE CONNECTION</div>
      </div>
    </div>
  );
}