'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation'; // Importante para el Logout
import { createClient } from '@/utils/supabase/client';
import ProductEditor from '@/components/admin/ProductEditor'; 
import { 
  LayoutDashboard, Users, ShoppingBag, Wrench, GraduationCap, 
  ShoppingCart, Search, FileText, Plus, Pencil, Trash2, 
  CheckCircle, AlertCircle, X, UploadCloud, Save, ChevronRight,
  Eye, Image as ImageIcon, ExternalLink, LogOut 
} from 'lucide-react';

// --- VISTA 1: USUARIOS ---
const UsersView = () => {
  const supabase = createClient();
  const [users, setUsers] = useState<any[]>([]);

  useEffect(() => {
    const fetchUsers = async () => {
      const { data } = await supabase.from('profiles').select('*');
      if (data) setUsers(data);
    };
    fetchUsers();
  }, []);

  return (
    <div className="space-y-6 animate-in fade-in">
      <h2 className="text-2xl font-bold text-white flex items-center gap-2">
        <Users className="text-[#FFD700]"/> Usuarios Registrados
      </h2>
      <div className="bg-[#111] border border-[#333] rounded-xl overflow-hidden">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-black text-[#FFD700] uppercase font-bold text-xs tracking-wider">
            <tr><th className="p-4">Nombre</th><th className="p-4">Correo</th><th className="p-4">Rol</th><th className="p-4">Fecha</th></tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id} className="border-t border-[#333] hover:bg-white/5 transition">
                <td className="p-4 font-bold text-white">{u.full_name || 'Sin Nombre'}</td>
                <td className="p-4 font-mono text-gray-500">{u.email}</td>
                <td className="p-4"><span className={`px-2 py-1 rounded text-[10px] uppercase font-bold ${u.role === 'admin' ? 'bg-[#FFD700] text-black' : 'bg-[#222] text-gray-400'}`}>{u.role}</span></td>
                <td className="p-4 text-xs">{new Date(u.created_at).toLocaleDateString()}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- VISTA 2: PRODUCTOS ---
const ProductsView = () => {
  const supabase = createClient();
  const [products, setProducts] = useState<any[]>([]);
  const [isEditorOpen, setIsEditorOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState<any>(null);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchProducts = async () => {
    const { data } = await supabase.from('products').select('*').order('id', { ascending: false });
    if (data) setProducts(data);
  };

  useEffect(() => { fetchProducts(); }, []);

  const handleDelete = async (id: number) => {
    if (!confirm("⚠️ ¿Estás seguro de eliminar este producto?")) return;
    await supabase.from('products').delete().eq('id', id);
    fetchProducts();
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (isEditorOpen) {
    return (
      <ProductEditor 
        productToEdit={productToEdit} 
        onClose={() => setIsEditorOpen(false)} 
        onSaved={() => { fetchProducts(); }} 
      />
    );
  }

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2">
          <ShoppingBag className="text-[#FFD700]" /> Inventario <span className="text-sm text-gray-500 font-normal">({products.length})</span>
        </h2>
        
        <div className="flex gap-3 w-full md:w-auto">
             <div className="relative flex-1 md:w-64">
                <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
                <input 
                    placeholder="Buscar..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-full bg-[#111] border border-[#333] pl-10 pr-4 py-2 rounded-lg text-white text-sm focus:border-[#FFD700] outline-none"
                />
             </div>
            <button 
              onClick={() => { setProductToEdit(null); setIsEditorOpen(true); }} 
              className="bg-[#FFD700] hover:bg-[#ffe033] text-black px-4 py-2 rounded-lg font-bold flex items-center gap-2 shadow-lg shadow-[#FFD700]/10 whitespace-nowrap"
            >
              <Plus size={18}/> Nuevo
            </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {filteredProducts.map(p => (
          <div key={p.id} className="bg-[#111] p-3 rounded-xl border border-[#333] flex gap-3 group hover:border-[#FFD700]/50 transition-all hover:bg-[#161616]">
             <div className="w-24 h-24 bg-[#050505] rounded-lg relative overflow-hidden shrink-0 border border-[#222]">
                {p.images && p.images[0] ? (
                    <img src={p.images[0]} alt="" className="w-full h-full object-cover" />
                ) : (
                    <img src={p.image_url || '/placeholder.png'} alt="" className="w-full h-full object-cover opacity-50" />
                )}
             </div>
             <div className="flex-1 overflow-hidden flex flex-col justify-between py-1">
               <div>
                    <h4 className="font-bold text-gray-200 text-sm leading-tight line-clamp-2 mb-1 group-hover:text-white transition-colors">{p.name}</h4>
                    <span className="text-[10px] uppercase font-bold text-gray-500 border border-[#333] px-1.5 py-0.5 rounded">{p.category}</span>
               </div>
               <div className="flex items-end justify-between">
                    <div>
                        <p className="text-[#FFD700] font-black text-lg">S/ {p.price}</p>
                        <p className={`text-[10px] ${p.stock < 5 ? 'text-red-500 font-bold' : 'text-gray-500'}`}>
                           {p.stock > 0 ? `Stock: ${p.stock}` : 'AGOTADO'}
                        </p>
                    </div>
                    <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => { setProductToEdit(p); setIsEditorOpen(true); }} className="p-1.5 bg-[#222] text-blue-400 rounded hover:bg-blue-600 hover:text-white transition"><Pencil size={14}/></button>
                        <button onClick={() => handleDelete(p.id)} className="p-1.5 bg-[#222] text-red-400 rounded hover:bg-red-600 hover:text-white transition"><Trash2 size={14}/></button>
                    </div>
               </div>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// --- VISTA 3: PEDIDOS ---
const OrdersView = () => {
  const supabase = createClient();
  const [orders, setOrders] = useState<any[]>([]);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    const fetchOrders = async () => {
      const { data } = await supabase.from('orders').select('*').order('created_at', { ascending: false });
      if (data) setOrders(data);
    };
    fetchOrders();
  }, []);

  const updateStatus = async (id: string, newStatus: string) => {
    const { error } = await supabase.from('orders').update({status: newStatus}).eq('id', id);
    if (!error) {
        setOrders(orders.map(o => o.id === id ? {...o, status: newStatus} : o));
    } else {
        alert("Error: " + error.message);
    }
  };

  const filteredOrders = orders.filter(o => 
    o.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    o.guest_info?.name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6 animate-in fade-in">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-white flex items-center gap-2"><FileText className="text-[#FFD700]"/> Pedidos</h2>
        <div className="relative w-64">
           <Search className="absolute left-3 top-2.5 text-gray-500 w-4 h-4" />
           <input placeholder="Buscar ID o Cliente..." onChange={e => setSearchTerm(e.target.value)} className="w-full bg-[#111] border border-[#333] pl-10 py-2 rounded-lg text-white text-sm focus:border-[#FFD700] outline-none" />
        </div>
      </div>

      <div className="bg-[#111] border border-[#333] rounded-xl overflow-hidden shadow-xl">
        <table className="w-full text-left text-sm text-gray-400">
          <thead className="bg-black text-[#FFD700] uppercase font-bold text-xs">
            <tr><th className="p-4">ID / Fecha</th><th className="p-4">Cliente</th><th className="p-4 text-center">Voucher</th><th className="p-4">Total</th><th className="p-4">Estado</th></tr>
          </thead>
          <tbody>
            {filteredOrders.length === 0 ? (
                <tr><td colSpan={5} className="p-8 text-center">No hay pedidos registrados.</td></tr>
            ) : filteredOrders.map((o) => (
              <tr key={o.id} className="border-t border-[#333] hover:bg-white/5 transition">
                <td className="p-4">
                  <span className="font-mono text-white text-xs block truncate w-24 mb-1">#{o.id.slice(0,8)}...</span>
                  <span className="text-[10px] text-gray-600">{new Date(o.created_at).toLocaleString()}</span>
                </td>
                <td className="p-4">
                  <p className="font-bold text-white text-sm">{o.guest_info?.name || 'Invitado'}</p>
                  <p className="text-[10px] text-gray-500">{o.guest_info?.phone}</p>
                </td>
                <td className="p-4 text-center">
                  {o.payment_proof ? (
                    <a href={o.payment_proof} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 bg-[#FFD700] text-black px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-[#ffe033] shadow-lg shadow-yellow-900/20">
                      <ImageIcon size={14} /> VER FOTO
                    </a>
                  ) : <span className="text-[10px] text-gray-600 border border-[#333] px-2 py-1 rounded">Pendiente</span>}
                </td>
                <td className="p-4 font-black text-[#FFD700] text-base">S/ {o.total}</td>
                <td className="p-4">
                  <div className="relative">
                      <select 
                        value={o.status} 
                        onChange={(e) => updateStatus(o.id, e.target.value)}
                        className={`appearance-none w-32 bg-[#050505] border px-3 py-2 rounded-lg text-xs uppercase font-bold outline-none cursor-pointer
                          ${o.status === 'paid' ? 'text-green-500 border-green-900' : 
                            o.status === 'cancelled' ? 'text-red-500 border-red-900' :
                            'text-yellow-500 border-yellow-900'}`}
                      >
                        <option value="pending">🟡 Pendiente</option>
                        <option value="paid">🟢 Pagado</option>
                        <option value="shipped">🔵 Enviado</option>
                        <option value="cancelled">🔴 Cancelado</option>
                      </select>
                      {o.status === 'cancelled' && <span className="block text-[9px] text-red-500 mt-1 text-center font-bold">STOCK DEVUELTO</span>}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

// --- VISTAS ADICIONALES ---
const AcademyView = () => <div className="text-gray-500 p-10 border border-dashed border-[#333] rounded-xl text-center">Módulo Academia (Próximamente)</div>;
const CartsView = () => <div className="text-gray-500 p-10 border border-dashed border-[#333] rounded-xl text-center">Módulo Carritos en Vivo</div>;
const RepairsView = () => <div className="text-gray-500 p-10 border border-dashed border-[#333] rounded-xl text-center">Módulo Taller</div>;

// --- LAYOUT PRINCIPAL ---
export default function AdminPage() {
  const router = useRouter(); // Hook para redireccionar al salir
  const [activeTab, setActiveTab] = useState('products');

  // Lógica de Cierre de Sesión
  const handleLogout = async () => {
      // 1. Borrar sesión offline
      localStorage.removeItem('admin_session');
      
      // 2. Borrar sesión online (Supabase)
      const supabase = createClient();
      await supabase.auth.signOut();

      // 3. Mandar al login
      router.push('/admin/login');
  };

  const menuItems = [
    { id: 'products', label: 'Productos', icon: <ShoppingBag size={20} /> },
    { id: 'orders', label: 'Pedidos', icon: <FileText size={20} /> },
    { id: 'users', label: 'Usuarios', icon: <Users size={20} /> },
    { id: 'academy', label: 'Academia', icon: <GraduationCap size={20} /> },
    { id: 'carts', label: 'En Vivo', icon: <ShoppingCart size={20} /> },
    { id: 'repairs', label: 'Taller', icon: <Wrench size={20} /> },
  ];

  return (
    <div className="min-h-screen bg-[#050505] pt-20 flex font-sans">
      <aside className="w-64 bg-[#0a0a0a] border-r border-[#222] hidden md:flex flex-col h-[calc(100vh-80px)] fixed left-0 top-20 z-40">
        <div className="p-6 border-b border-[#222]">
          <h1 className="font-black text-xl text-white tracking-widest flex items-center gap-2">
            ADMIN <span className="text-[#FFD700]">PANEL</span>
          </h1>
        </div>
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          {menuItems.map(item => (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`w-full flex items-center justify-between p-3 rounded-lg transition font-medium text-sm ${
                activeTab === item.id 
                ? 'bg-[#FFD700] text-black shadow-lg shadow-[#FFD700]/20' 
                : 'text-gray-400 hover:text-white hover:bg-white/5'
              }`}
            >
              <div className="flex items-center gap-3">{item.icon} {item.label}</div>
              {activeTab === item.id && <ChevronRight size={16}/>}
            </button>
          ))}
        </nav>
        
        {/* BOTÓN DE CERRAR SESIÓN */}
        <div className="p-4 border-t border-[#222]">
            <button 
                onClick={handleLogout}
                className="w-full flex items-center gap-3 p-3 rounded-lg text-red-500 hover:bg-red-900/10 hover:text-red-400 transition font-bold text-sm"
            >
                <LogOut size={20} /> CERRAR SESIÓN
            </button>
            <div className="mt-4 text-[10px] text-gray-600 text-center">
                Corveo System v2.0 <br/> Status: Secure
            </div>
        </div>
      </aside>

      <main className="flex-1 md:ml-64 p-6 md:p-10 overflow-y-auto h-[calc(100vh-80px)] bg-[#050505] relative">
        <div className="max-w-7xl mx-auto">
            {activeTab === 'users' && <UsersView />}
            {activeTab === 'products' && <ProductsView />}
            {activeTab === 'orders' && <OrdersView />}
            {activeTab === 'academy' && <AcademyView />}
            {activeTab === 'carts' && <CartsView />}
            {activeTab === 'repairs' && <RepairsView />}
        </div>
      </main>
    </div>
  );
}