'use client';
import { useState, useEffect } from 'react';
import { useCart } from '@/context/CartContext';
import { createClient } from '@/utils/supabase/client';
import { useAuth } from '@/context/AuthContext';
import { UploadCloud, CheckCircle, Loader2, ArrowRight } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function CheckoutPage() {
  const { cart, total, clearCart } = useCart();
  const { user, loading: authLoading } = useAuth(); 
  const supabase = createClient();
  const router = useRouter();
  
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [orderId, setOrderId] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: ''
  });

  // PROTECCIÓN Y AUTORELLENO

  useEffect(() => {
    if (!authLoading) {
      if (!user) {
        router.push('/auth/login');
      } else {
        // SOLUCIÓN: Usamos (user as any) para saltar la restricción de TS
        const meta = (user as any).user_metadata || {};
        
        setFormData(prev => ({
          ...prev,
          name: meta.full_name || user.email || '', 
          email: user.email || ''
        }));
      }
    }
  }, [user, authLoading, router]);

  if (authLoading || !user) {
      return <div className="min-h-screen bg-black flex items-center justify-center text-[#FFD700]"><Loader2 className="animate-spin mr-2"/> Verificando sesión...</div>;
  }

  // --- PASO 1: CREAR PEDIDO ---
  const handleCreateOrder = async () => {
    if (!formData.name || !formData.phone || !formData.email) return alert("Completa tus datos");
    if (cart.length === 0) return alert("Carrito vacío");

    setLoading(true);
    try {
      // 1. Validamos que el ID sea válido (UUID)
      if (!user.id) throw new Error("No se detectó el ID de usuario.");

      const { data: order, error: orderError } = await supabase.from('orders').insert([{
          user_id: user.id, // ID REAL DE SUPABASE
          guest_info: formData,
          total: total,
          status: 'pending',
          payment_method: 'Yape/Plin',
          payment_proof: null 
        }]).select().single();

      if (orderError) throw orderError;

      const items = cart.map(item => ({
        order_id: order.id,
        product_id: item.id,
        quantity: item.quantity, // CORRECCIÓN: Usar cantidad real del carrito
        price_at_purchase: item.price
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(items);
      if (itemsError) throw itemsError;

      setOrderId(order.id);
      setStep(2);
      clearCart();

    } catch (error: any) {
      console.error(error);
      alert("Error al crear pedido: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  // --- PASO 2: SUBIR VOUCHER ---
  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !orderId) return;
    setUploading(true);
    const file = e.target.files[0];
    const fileExt = file.name.split('.').pop();
    const fileName = `vouchers/${orderId}-${Date.now()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage.from('cuervo-files').upload(fileName, file);
      if (uploadError) throw uploadError;
      
      const { data: urlData } = supabase.storage.from('cuervo-files').getPublicUrl(fileName);
      
      const { error: updateError } = await supabase.from('orders').update({ payment_proof: urlData.publicUrl }).eq('id', orderId);
      if (updateError) throw updateError;

      setStep(3);
    } catch (error: any) {
      alert("Error subiendo imagen: " + error.message);
    } finally {
      setUploading(false);
    }
  };

  if (step === 3) return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-6 animate-in fade-in">
        <div className="bg-[#111] border border-[#222] p-12 rounded-3xl max-w-lg w-full text-center shadow-2xl">
            <CheckCircle className="text-green-500 w-16 h-16 mx-auto mb-6" />
            <h2 className="text-4xl font-black text-white mb-4">¡Pedido Recibido!</h2>
            <p className="text-gray-400 mb-8">Hemos recibido tu comprobante. Lo verificaremos pronto.</p>
            <Link href="/profile" className="block w-full bg-[#FFD700] text-black font-black py-4 rounded-xl hover:bg-[#ffe033]">IR A MIS PEDIDOS</Link>
        </div>
      </div>
  );

  if (step === 2) return (
      <div className="min-h-screen bg-[#050505] text-white flex flex-col items-center justify-center p-4 animate-in fade-in">
        <div className="bg-[#111] border border-[#222] p-8 rounded-3xl max-w-md w-full text-center">
          <h2 className="text-2xl font-black text-white mb-2">Realiza tu Pago</h2>
          <p className="text-[#FFD700] font-black text-2xl mb-6">S/ {total.toFixed(2)}</p>
          <div className="bg-white p-4 rounded-2xl inline-block mb-6"><Image src="/yape-qr.png" alt="Yape QR" width={180} height={180} className="rounded-lg mix-blend-multiply" /></div>
          <label className={`w-full border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer ${uploading ? 'border-gray-600' : 'border-[#FFD700] bg-[#FFD700]/10'}`}>
            {uploading ? <Loader2 className="animate-spin text-[#FFD700] mb-2" /> : <UploadCloud className="text-[#FFD700] mb-2" size={32} />}
            <span className="text-white font-bold">{uploading ? 'Subiendo...' : 'Subir Voucher'}</span>
            <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} disabled={uploading} />
          </label>
        </div>
      </div>
  );

  return (
    <div className="min-h-screen bg-[#050505] text-white pt-24 px-4 max-w-2xl mx-auto">
      <h1 className="text-3xl font-bold mb-8 text-[#FFD700]">Finalizar Compra</h1>
      <div className="bg-[#111] p-8 rounded-3xl border border-[#222] space-y-6">
        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 ml-1">NOMBRE</label>
            <input type="text" value={formData.name} onChange={e => setFormData({...formData, name: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#333] p-4 rounded-xl text-white outline-none focus:border-[#FFD700]" />
        </div>
        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 ml-1">TELÉFONO</label>
            <input type="tel" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#333] p-4 rounded-xl text-white outline-none focus:border-[#FFD700]" placeholder="Para coordinar envío" />
        </div>
        <div className="space-y-2">
            <label className="text-xs font-bold text-gray-500 ml-1">DIRECCIÓN</label>
            <input type="text" value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} className="w-full bg-[#0a0a0a] border border-[#333] p-4 rounded-xl text-white outline-none focus:border-[#FFD700]" placeholder="Calle, Distrito, Referencia" />
        </div>
        <div className="pt-4 border-t border-[#222] flex justify-between items-center">
            <span className="text-gray-400">Total:</span><span className="text-3xl font-black text-white">S/ {total.toFixed(2)}</span>
        </div>
        <button onClick={handleCreateOrder} disabled={loading} className="w-full bg-[#FFD700] text-black font-black text-lg py-5 rounded-xl hover:bg-[#ffe033] flex items-center justify-center gap-2">
            {loading ? <Loader2 className="animate-spin" /> : <>CONTINUAR AL PAGO <ArrowRight size={20} /></>}
        </button>
      </div>
    </div>
  );
}