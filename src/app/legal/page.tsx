import { ShieldCheck } from 'lucide-react';

export default function LegalPage() {
  return (
    <div className="min-h-screen bg-[#050505] py-20 px-4">
      <div className="max-w-4xl mx-auto bg-[#111] border border-[#333] rounded-xl p-8 md:p-12">
        <div className="flex items-center gap-4 mb-8 border-b border-[#333] pb-6">
          <ShieldCheck className="text-[#FFD700] w-10 h-10" />
          <h1 className="text-3xl font-bold text-white">Términos y Condiciones</h1>
        </div>

        <div className="space-y-6 text-gray-400 leading-relaxed">
          <section>
            <h2 className="text-xl font-bold text-white mb-3">1. Introducción</h2>
            <p>
              Bienvenido a Cuervo Blanco. Al acceder a nuestro sitio web y utilizar nuestros servicios de ingeniería y tienda en línea, aceptas cumplir con los siguientes términos y condiciones.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">2. Compras y Pagos</h2>
            <p>
              Todos los precios están en dólares/soles. Nos reservamos el derecho de cancelar pedidos si detectamos errores en el stock o precios. Los pagos son procesados de manera segura.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">3. Garantía de Servicios</h2>
            <p>
              Nuestros servicios de reparación cuentan con una garantía de 3 meses sobre la mano de obra y componentes reemplazados. Esta garantía no cubre daños por mal uso o accidentes posteriores.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-bold text-white mb-3">4. Propiedad Intelectual</h2>
            <p>
              Todo el contenido, diseños de PCB y código mostrado en este sitio son propiedad intelectual de Cuervo Blanco, a menos que se indique lo contrario.
            </p>
          </section>

          <div className="pt-8 border-t border-[#333] text-sm italic">
            Última actualización: Enero 2026
          </div>
        </div>
      </div>
    </div>
  );
}