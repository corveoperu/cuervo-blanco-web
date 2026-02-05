'use client';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Package, Wrench, Download, LogOut, Clock, CheckCircle } from 'lucide-react';

export default function ProfilePage() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('orders');

  // PROTECCIÓN DE RUTA
  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  if (loading || !user) return <div className="min-h-screen bg-black text-white flex items-center justify-center">Cargando perfil...</div>;

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 px-4 pb-12">
      <div className="max-w-6xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-8 border-b border-[#222] pb-6 gap-4">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 rounded-full bg-[#FFD700] text-black flex items-center justify-center text-3xl font-black shadow-lg shadow-[#FFD700]/20">
              {user.full_name.charAt(0).toUpperCase()}
            </div>
            <div>
              <h1 className="text-3xl font-bold text-white tracking-tight">{user.full_name}</h1>
              <p className="text-gray-500 font-mono text-sm">{user.email}</p>
              <span className="inline-block mt-2 bg-[#1a1a1a] border border-[#333] text-gray-300 text-[10px] px-2 py-1 rounded uppercase font-bold tracking-wider">
                {user.role === 'admin' ? 'Administrador' : 'Miembro Oficial'}
              </span>
            </div>
          </div>
          <button onClick={logout} className="flex items-center gap-2 text-red-500 hover:text-red-400 font-bold text-sm bg-red-900/10 px-4 py-2 rounded-lg transition hover:bg-red-900/20">
            <LogOut size={16} /> Cerrar Sesión
          </button>
        </div>

        {/* TABS */}
        <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
          <TabButton active={activeTab === 'orders'} onClick={() => setActiveTab('orders')} icon={<Package size={18}/>} label="Mis Pedidos" />
          <TabButton active={activeTab === 'repairs'} onClick={() => setActiveTab('repairs')} icon={<Wrench size={18}/>} label="Reparaciones" />
          <TabButton active={activeTab === 'downloads'} onClick={() => setActiveTab('downloads')} icon={<Download size={18}/>} label="Descargas" />
        </div>

        {/* CONTENIDO */}
        <div className="bg-[#111] border border-[#222] rounded-2xl p-6 min-h-[400px] shadow-xl">
          
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-[#FFD700] mb-4 flex items-center gap-2"><Package/> Historial de Compras</h2>
              {/* MOCK DATA */}
              <OrderItem id="CB-9281" date="04 Feb 2026" status="En Camino" total={120.50} items="Arduino Uno, Kit Resistencias" />
              <OrderItem id="CB-1029" date="20 Ene 2026" status="Entregado" total={45.00} items="Filamento PLA Negro" />
            </div>
          )}

          {activeTab === 'repairs' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-blue-400 mb-4 flex items-center gap-2"><Wrench/> Estado de Reparaciones</h2>
              <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333] flex items-center justify-between">
                 <div>
                    <h3 className="font-bold text-white">Laptop ASUS TUF Gaming</h3>
                    <p className="text-sm text-gray-500">Cambio de Pasta Térmica + Limpieza</p>
                 </div>
                 <span className="bg-yellow-900/30 text-yellow-500 px-3 py-1 rounded text-xs font-bold flex items-center gap-1"><Clock size={12}/> EN PROCESO</span>
              </div>
            </div>
          )}

           {activeTab === 'downloads' && (
            <div className="space-y-4">
              <h2 className="text-xl font-bold text-green-400 mb-4 flex items-center gap-2"><Download/> Mis Proyectos</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                 <div className="bg-[#1a1a1a] p-4 rounded-xl border border-[#333] hover:border-green-500/50 transition cursor-pointer group">
                    <h3 className="font-bold text-white group-hover:text-green-400 transition">Manual Brazo Robótico v2</h3>
                    <p className="text-xs text-gray-500 mb-3">PDF + Código Arduino</p>
                    <button className="text-green-400 text-sm font-bold flex items-center gap-2 hover:underline"><Download size={16}/> Descargar Archivos</button>
                 </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TabButton({ active, onClick, icon, label }: any) {
  return (
    <button onClick={onClick} className={`flex items-center gap-2 px-6 py-3 rounded-xl font-bold transition-all whitespace-nowrap ${active ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/10' : 'bg-[#1a1a1a] text-gray-400 hover:text-white hover:bg-[#222]'}`}>
      {icon} {label}
    </button>
  );
}

function OrderItem({ id, date, status, total, items }: any) {
    const isDelivered = status === 'Entregado';
    return (
        <div className="flex flex-col md:flex-row justify-between items-center bg-[#0a0a0a] p-4 rounded-xl border border-[#222] hover:border-[#333] transition">
            <div className="mb-2 md:mb-0">
                <div className="flex items-center gap-3">
                    <span className="font-mono text-[#FFD700] font-bold">#{id}</span>
                    <span className="text-xs text-gray-600">| {date}</span>
                </div>
                <p className="text-sm text-gray-300 mt-1">{items}</p>
            </div>
            <div className="flex items-center gap-6">
                <span className="font-black text-white">S/ {total.toFixed(2)}</span>
                <span className={`px-3 py-1 rounded text-xs font-bold flex items-center gap-1 ${isDelivered ? 'bg-green-900/20 text-green-500' : 'bg-blue-900/20 text-blue-500'}`}>
                    {isDelivered ? <CheckCircle size={12}/> : <Clock size={12}/>} {status}
                </span>
            </div>
        </div>
    )
}