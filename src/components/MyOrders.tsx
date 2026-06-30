import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  Check, Clock, ShieldCheck, ShoppingBag, 
  RefreshCw, ChevronRight, Package, AlertCircle, ArrowLeft, ExternalLink
} from 'lucide-react';

interface DBOrder {
  id: string;
  product_name: string;
  price: number;
  quantity: number;
  user_id: string;
  status: 'Pending' | 'Shipped' | 'Delivered';
  date: string;
}

interface MyOrdersProps {
  currentUser: { userId: string; name: string; email: string; role: 'Customer' | 'Admin' };
  onNavigateHome: () => void;
}

export default function MyOrders({ currentUser, onNavigateHome }: MyOrdersProps) {
  const [orders, setOrders] = useState<DBOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchOrders = async (showRefreshIndicator = false) => {
    if (showRefreshIndicator) setRefreshing(true);
    else setLoading(true);
    setError(null);

    try {
      // Derive the identity securely by sending the email as bearer token
      const response = await fetch('/api/my-orders', {
        headers: {
          'Authorization': `Bearer ${currentUser.email}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error(`Atelier Server returned ${response.status} Error`);
      }

      const data = await response.json();
      setOrders(data);
    } catch (err: any) {
      console.error('Error fetching orders:', err);
      setError('An error occurred while connecting to the Atelier Vault database. Please try again.');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [currentUser.email]);

  return (
    <section className="relative py-16 bg-transparent text-left overflow-hidden min-h-[70vh]">
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-amber-500/5 rounded-full filter blur-[150px] pointer-events-none" />
      
      <div className="max-w-6xl mx-auto px-6">
        
        {/* Navigation Breadcrumb */}
        <div className="flex items-center justify-between mb-8">
          <button 
            onClick={onNavigateHome}
            className="group flex items-center space-x-2 text-neutral-400 hover:text-white transition-colors duration-200 text-xs font-display uppercase tracking-widest cursor-pointer"
          >
            <ArrowLeft className="h-4 w-4 group-hover:-translate-x-0.5 transition-transform" />
            <span>Return to Showroom</span>
          </button>

          <button
            onClick={() => fetchOrders(true)}
            disabled={loading || refreshing}
            className="flex items-center space-x-1.5 text-neutral-400 hover:text-[#c5a059] disabled:opacity-50 text-xs font-display uppercase tracking-widest cursor-pointer transition-colors"
          >
            <RefreshCw className={`h-3.5 w-3.5 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Syncing...' : 'Sync Vault'}</span>
          </button>
        </div>

        {/* Section Header */}
        <div className="border-b border-[#1d2f30]/60 pb-6 mb-10 text-left">
          <div className="flex items-center space-x-2 text-[#c5a059] mb-2">
            <ShieldCheck className="h-4.5 w-4.5" />
            <span className="font-display text-[10px] uppercase tracking-[0.25em] font-bold">Secure Ledger Profile</span>
          </div>
          <h1 className="font-luxury-title text-3xl md:text-5xl text-white font-medium">My Orders</h1>
          <p className="text-xs md:text-sm text-neutral-400 mt-2 font-sans leading-relaxed max-w-2xl">
            Acquisitions and bespoke hand-hallmarked masterworks assigned to your personal portfolio, synchronized with GIA registry logs and real-time transit telemetry.
          </p>
        </div>

        {/* Orders Content Area */}
        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-4">
            <div className="relative flex items-center justify-center">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#c5a059]" />
              <div className="absolute h-6 w-6 rounded-full bg-[#0a1617] border border-[#1d2f30]" />
            </div>
            <p className="text-xs text-neutral-500 font-display uppercase tracking-widest">Querying Atelier Ledgers...</p>
          </div>
        ) : error ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded border border-rose-500/20 bg-rose-500/5 p-6 text-center max-w-lg mx-auto"
          >
            <AlertCircle className="h-8 w-8 text-rose-400 mx-auto mb-3" />
            <p className="text-sm text-neutral-200 font-serif mb-2">Database Error</p>
            <p className="text-xs text-neutral-400 leading-relaxed mb-4">{error}</p>
            <button 
              onClick={() => fetchOrders()}
              className="px-4 py-2 text-xs font-display font-semibold uppercase tracking-wider text-black bg-gold-gradient rounded hover:opacity-95 transition-opacity"
            >
              Retry Connection
            </button>
          </motion.div>
        ) : orders.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="rounded-lg border border-[#1d2f30] bg-[#111e1f]/30 p-12 text-center max-w-xl mx-auto"
          >
            <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-[#111e1f] border border-[#1d2f30] text-[#c5a059]/60 mb-4">
              <ShoppingBag className="h-6 w-6" />
            </div>
            <h3 className="font-luxury-title text-lg text-white font-medium mb-2">No Acquisitions Discovered</h3>
            <p className="text-xs text-neutral-400 leading-relaxed mb-6">
              You haven't checked out any masterpieces from our showcase catalog yet. Explore our bespoke diamond and gold collections.
            </p>
            <button 
              onClick={onNavigateHome}
              className="px-6 py-3 text-xs font-display font-bold uppercase tracking-widest text-black bg-gold-gradient rounded hover:opacity-95 shadow-gold-glow transition-all"
            >
              Explore Masterpieces
            </button>
          </motion.div>
        ) : (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Desktop Table View */}
            <div className="hidden md:block overflow-hidden rounded border border-[#1d2f30] bg-[#111e1f]/50 backdrop-blur-sm">
              <table className="w-full text-left font-sans text-xs">
                <thead>
                  <tr className="border-b border-[#1d2f30] bg-[#111e1f]/80 text-neutral-500 font-display uppercase tracking-widest">
                    <th className="p-5 py-4 font-semibold text-[10px]">Registry ID</th>
                    <th className="p-5 py-4 font-semibold text-[10px]">Masterpiece Title</th>
                    <th className="p-5 py-4 font-semibold text-[10px]">Acquisition Date</th>
                    <th className="p-5 py-4 font-semibold text-[10px]">Quantity</th>
                    <th className="p-5 py-4 font-semibold text-[10px]">Valuation</th>
                    <th className="p-5 py-4 font-semibold text-[10px] text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1d2f30]/60">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#1d2f30]/20 transition-colors">
                      <td className="p-5 font-mono font-bold text-[#c5a059] tracking-wider">{ord.id}</td>
                      <td className="p-5">
                        <div className="font-serif text-sm text-neutral-100 font-medium">{ord.product_name}</div>
                      </td>
                      <td className="p-5 text-neutral-400">{ord.date}</td>
                      <td className="p-5 font-mono text-neutral-300">{ord.quantity}</td>
                      <td className="p-5 font-mono text-neutral-100 font-bold">${ord.price.toLocaleString()}</td>
                      <td className="p-5 text-right">
                        <span className={`inline-flex items-center space-x-1.5 px-3 py-1 rounded text-[10px] font-display font-bold uppercase tracking-wider ${
                          ord.status === 'Delivered'
                            ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                            : ord.status === 'Shipped'
                            ? 'bg-amber-500/10 text-[#c5a059] border border-amber-500/20'
                            : 'bg-[#111e1f] text-neutral-400 border border-[#1d2f30]'
                        }`}>
                          {ord.status === 'Delivered' && <Check className="h-3 w-3 text-emerald-400 stroke-[3px]" />}
                          {ord.status === 'Shipped' && <Package className="h-3 w-3 text-[#c5a059]" />}
                          {ord.status === 'Pending' && <Clock className="h-3 w-3 text-neutral-400 animate-pulse" />}
                          <span>{ord.status}</span>
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile Cards View */}
            <div className="md:hidden space-y-4">
              {orders.map((ord) => (
                <div 
                  key={ord.id} 
                  className="rounded border border-[#1d2f30] bg-[#111e1f]/50 p-5 space-y-3.5 text-left"
                >
                  <div className="flex items-center justify-between border-b border-[#1d2f30]/60 pb-3">
                    <span className="font-mono font-bold text-[#c5a059] tracking-wider text-xs">{ord.id}</span>
                    <span className={`inline-flex items-center space-x-1 px-2 py-0.5 rounded text-[9px] font-display font-bold uppercase tracking-wider ${
                      ord.status === 'Delivered'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : ord.status === 'Shipped'
                        ? 'bg-amber-500/10 text-[#c5a059] border border-amber-500/20'
                        : 'bg-[#111e1f] text-neutral-400 border border-[#1d2f30]'
                    }`}>
                      {ord.status === 'Delivered' && <Check className="h-2.5 w-2.5" />}
                      {ord.status === 'Shipped' && <Package className="h-2.5 w-2.5" />}
                      {ord.status === 'Pending' && <Clock className="h-2.5 w-2.5" />}
                      <span>{ord.status}</span>
                    </span>
                  </div>

                  <div className="space-y-1">
                    <p className="text-[10px] uppercase font-display tracking-widest text-neutral-500">Masterpiece</p>
                    <p className="font-serif text-sm text-neutral-100 font-medium leading-snug">{ord.product_name}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-4 border-t border-[#1d2f30]/40 pt-3">
                    <div className="space-y-0.5">
                      <p className="text-[9px] uppercase font-display tracking-widest text-neutral-500">Date</p>
                      <p className="text-[11px] text-neutral-300 font-medium font-mono">{ord.date}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] uppercase font-display tracking-widest text-neutral-500">Qty</p>
                      <p className="text-[11px] text-neutral-300 font-medium font-mono">{ord.quantity}</p>
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-[9px] uppercase font-display tracking-widest text-neutral-500">Valuation</p>
                      <p className="text-[11px] text-neutral-100 font-bold font-mono">${ord.price.toLocaleString()}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Total Summary Footer */}
            <div className="rounded border border-[#c5a059]/30 bg-[#c5a059]/5 p-5 md:p-6 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mt-8">
              <div className="space-y-1">
                <span className="font-display text-[9px] uppercase tracking-[0.2em] text-[#c5a059] font-bold">Patron Valuation Ledger</span>
                <p className="font-serif text-neutral-300 text-sm">Thank you for building your sovereign legacy with ATELIER.</p>
              </div>
              <div className="text-left sm:text-right">
                <p className="text-[9px] uppercase font-display tracking-widest text-neutral-400">Total Showroom Portfolio Valuation</p>
                <p className="font-mono text-xl md:text-2xl text-[#c5a059] font-extrabold mt-0.5">
                  ${orders.reduce((sum, ord) => sum + (ord.price * ord.quantity), 0).toLocaleString()}
                </p>
              </div>
            </div>

          </motion.div>
        )}

      </div>
    </section>
  );
}
