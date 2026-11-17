import { useParams, Link } from 'react-router-dom';
import { CheckCircle2, Package, Truck, ArrowRight, ShieldCheck, Mail } from 'lucide-react';

export default function OrderSuccess() {
  const { orderId } = useParams<{ orderId: string }>();

  // Delivery date estimated 3 business days ahead
  const deliveryDate = new Date();
  deliveryDate.setDate(deliveryDate.getDate() + 3);
  const formattedDelivery = deliveryDate.toLocaleDateString('en-IN', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="min-h-screen pt-28 pb-20 bg-white">
      <div className="max-w-2xl mx-auto px-6 text-center">
        {/* Success Icon */}
        <div className="w-16 h-16 mx-auto rounded-full bg-emerald-50 border border-emerald-200 flex items-center justify-center text-emerald-600 mb-6 animate-scale-in">
          <CheckCircle2 className="w-8 h-8" />
        </div>

        <span className="text-[11px] uppercase tracking-[0.25em] text-db-gold font-bold block mb-2">
          ORDER CONFIRMED
        </span>

        <h1 className="font-serif text-3xl sm:text-4xl font-bold uppercase tracking-tight text-db-black mb-3">
          Thank You For Your Patronage
        </h1>

        <p className="text-xs sm:text-sm text-db-neutral-600 mb-6 max-w-lg mx-auto leading-relaxed">
          Your order <strong className="text-db-black font-semibold">#{orderId || 'DB-89214'}</strong> has been successfully received by our Mumbai atelier. A confirmation email with receipt and invoice has been dispatched to your inbox.
        </p>

        {/* Status card */}
        <div className="bg-db-neutral-50 p-6 sm:p-8 border border-db-neutral-200 text-left my-8 space-y-6">
          <div className="flex flex-col sm:flex-row justify-between sm:items-center pb-4 border-b border-db-neutral-200 gap-2">
            <div>
              <p className="text-[10px] uppercase tracking-wider text-db-neutral-500">Order Reference</p>
              <p className="font-mono text-sm font-bold text-db-black">{orderId || 'DB-89214'}</p>
            </div>
            <div>
              <p className="text-[10px] uppercase tracking-wider text-db-neutral-500">Estimated Atelier Dispatch</p>
              <p className="text-xs font-bold text-db-black">{formattedDelivery}</p>
            </div>
          </div>

          {/* Timeline */}
          <div>
            <p className="text-xs font-serif font-bold uppercase tracking-wider text-db-black mb-4">
              Fulfillment Journey
            </p>
            <div className="relative pl-6 space-y-5 border-l-2 border-db-gold">
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-db-gold border-2 border-white ring-2 ring-db-gold" />
                <p className="text-xs font-bold text-db-black">Order Placed & Confirmed</p>
                <p className="text-[11px] text-db-neutral-500">Payment verified. Ready for cutting and QC inspection.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-db-neutral-300 border-2 border-white" />
                <p className="text-xs font-bold text-db-neutral-700">Atelier QC & Packaging</p>
                <p className="text-[11px] text-db-neutral-400">Hand-finished with custom garment dust bag.</p>
              </div>
              <div className="relative">
                <span className="absolute -left-[31px] top-0.5 w-3.5 h-3.5 rounded-full bg-db-neutral-300 border-2 border-white" />
                <p className="text-xs font-bold text-db-neutral-700">Express Air Transit</p>
                <p className="text-[11px] text-db-neutral-400">Handed to BlueDart / Delhivery courier partner.</p>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-db-neutral-200 flex items-center justify-between text-xs text-db-neutral-500">
            <span className="flex items-center gap-1.5">
              <Mail className="w-3.5 h-3.5" /> Tracking link emailed
            </span>
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-db-gold" /> 7-Day Exchange Guaranteed
            </span>
          </div>
        </div>

        {/* Navigation CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            to="/shop"
            className="w-full sm:w-auto px-8 py-3.5 bg-db-black text-white text-xs font-semibold tracking-[0.2em] uppercase hover:bg-db-charcoal transition-colors flex items-center justify-center gap-2"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            to="/account"
            className="w-full sm:w-auto px-8 py-3.5 border border-db-neutral-300 text-db-black text-xs font-semibold tracking-[0.2em] uppercase hover:border-db-black transition-colors"
          >
            View Order History
          </Link>
        </div>
      </div>
    </div>
  );
}
