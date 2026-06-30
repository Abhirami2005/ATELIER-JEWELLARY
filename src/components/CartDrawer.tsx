import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';
import { X, Trash2, ShieldCheck, CreditCard, ShoppingBag, Truck, Lock } from 'lucide-react';

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  onUpdateQuantity: (index: number, quantity: number) => void;
  onRemoveItem: (index: number) => void;
  onCheckout: (customerName: string, customerEmail: string, customerPhone: string, shippingAddress: string) => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: CartDrawerProps) {
  const [checkoutMode, setCheckoutMode] = useState(false);
  const [customerName, setCustomerName] = useState('');
  const [customerEmail, setCustomerEmail] = useState('');
  const [customerPhone, setCustomerPhone] = useState('');
  const [shippingAddress, setShippingAddress] = useState('');
  const [processing, setProcessing] = useState(false);
  const [orderComplete, setOrderComplete] = useState<string | null>(null);

  const subtotal = cart.reduce((total, item) => total + (item.item.price * item.quantity), 0);
  const insuranceFee = subtotal > 10000 ? 0 : 75; // free insurance on high luxury orders
  const total = subtotal + insuranceFee;

  const handleCheckoutSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customerName || !customerEmail || !customerPhone || !shippingAddress) return;

    setProcessing(true);
    
    // Simulate luxury transaction
    setTimeout(() => {
      setProcessing(false);
      const generatedOrderId = `ORD-${Math.floor(1000 + Math.random() * 9000)}`;
      onCheckout(customerName, customerEmail, customerPhone, shippingAddress);
      setOrderComplete(generatedOrderId);
      
      // Reset states
      setCheckoutMode(false);
      setCustomerName('');
      setCustomerEmail('');
      setCustomerPhone('');
      setShippingAddress('');
    }, 2500);
  };

  const closeAndReset = () => {
    setOrderComplete(null);
    setCheckoutMode(false);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop blur */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeAndReset}
            className="absolute inset-0 bg-black/80 backdrop-blur-sm"
          />

          {/* Drawer Panel */}
          <div className="absolute inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', stiffness: 300, damping: 32 }}
              className="w-screen max-w-md border-l border-[#1d2f30] bg-[#0a1617] shadow-gold-heavy flex flex-col justify-between text-left"
            >
              {/* Header */}
              <div className="h-20 px-6 border-b border-[#1d2f30] flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="h-4.5 w-4.5 text-[#c5a059]" />
                  <h2 className="font-luxury-title text-lg text-white font-medium uppercase tracking-wider">
                    ATELIER BAG
                  </h2>
                </div>
                <button
                  onClick={closeAndReset}
                  className="text-neutral-400 hover:text-white border border-[#1d2f30] hover:border-[#c5a059] rounded-full h-8 w-8 flex items-center justify-center bg-[#111e1f] cursor-pointer"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>

              {/* Core Content Container */}
              <div className="flex-1 overflow-y-auto p-6 scrollbar">
                {orderComplete ? (
                  /* Order Successful View */
                  <div className="py-12 text-center space-y-6">
                    <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-emerald-400/10 border border-emerald-400/40 text-emerald-400">
                      <ShieldCheck className="h-7 w-7" />
                    </div>
                    <div className="space-y-2">
                      <h3 className="font-luxury-title text-2xl text-white font-medium">Acquisition Successful</h3>
                      <p className="text-xs text-[#c5a059] font-mono tracking-wider">ORDER ID: {orderComplete}</p>
                    </div>
                    <p className="font-sans text-xs text-neutral-400 max-w-sm mx-auto leading-relaxed">
                      Your order has been recorded into our secure systems. A digital copy of GIA / BIS certification papers has been allocated to you. Our concierge will call you shortly to confirm the scheduled insured handover details.
                    </p>
                    
                    <button
                      onClick={closeAndReset}
                      className="w-full rounded bg-gold-gradient py-3.5 text-xs font-display font-bold uppercase tracking-[0.15em] text-black hover:opacity-95 shadow-gold-glow transition-all duration-300"
                    >
                      Continue Exploring
                    </button>
                  </div>
                ) : checkoutMode ? (
                  /* Checkout Form View */
                  <form onSubmit={handleCheckoutSubmit} className="space-y-5">
                    <div className="flex items-center space-x-2 mb-3">
                      <span className="text-[10px] font-display uppercase tracking-widest text-[#c5a059] font-semibold">
                        CLIENT HANDOVER DETALIZATION
                      </span>
                    </div>

                    {processing ? (
                      <div className="py-20 text-center space-y-4">
                        <div className="inline-block h-8 w-8 animate-spin rounded-full border-2 border-[#c5a059] border-t-transparent" />
                        <p className="font-sans text-xs text-neutral-400">Securing payment vaults & signing GIA tokens...</p>
                      </div>
                    ) : (
                      <>
                        {/* Name */}
                        <div className="space-y-1.5">
                          <label className="block text-[9px] font-display tracking-widest text-neutral-500 uppercase font-semibold">
                            Full Name
                          </label>
                          <input
                            required
                            type="text"
                            placeholder="Priya Sharma"
                            value={customerName}
                            onChange={(e) => setCustomerName(e.target.value)}
                            className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-3 px-3.5 text-xs text-neutral-200 placeholder-neutral-700 focus:border-[#c5a059] focus:outline-none"
                          />
                        </div>

                        {/* Email */}
                        <div className="space-y-1.5">
                          <label className="block text-[9px] font-display tracking-widest text-neutral-500 uppercase font-semibold">
                            Email Address
                          </label>
                          <input
                            required
                            type="email"
                            placeholder="priya.sharma@gmail.com"
                            value={customerEmail}
                            onChange={(e) => setCustomerEmail(e.target.value)}
                            className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-3 px-3.5 text-xs text-neutral-200 placeholder-neutral-700 focus:border-[#c5a059] focus:outline-none"
                          />
                        </div>

                        {/* Phone */}
                        <div className="space-y-1.5">
                          <label className="block text-[9px] font-display tracking-widest text-neutral-500 uppercase font-semibold">
                            Phone Number
                          </label>
                          <input
                            required
                            type="tel"
                            placeholder="+91 99887 76655"
                            value={customerPhone}
                            onChange={(e) => setCustomerPhone(e.target.value)}
                            className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-3 px-3.5 text-xs text-neutral-200 placeholder-neutral-700 focus:border-[#c5a059] focus:outline-none"
                          />
                        </div>

                        {/* Shipping Address */}
                        <div className="space-y-1.5">
                          <label className="block text-[9px] font-display tracking-widest text-neutral-500 uppercase font-semibold">
                            Secure Handover Address
                          </label>
                          <textarea
                            required
                            rows={3}
                            placeholder="Flat 102, Shanti Vihar, Connaught Place, New Delhi, 110001"
                            value={shippingAddress}
                            onChange={(e) => setShippingAddress(e.target.value)}
                            className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-3 px-3.5 text-xs text-neutral-200 placeholder-neutral-700 focus:border-[#c5a059] focus:outline-none"
                          />
                        </div>

                        <div className="h-[1px] bg-[#1d2f30]/80 my-4" />

                        {/* Handover Summary */}
                        <div className="space-y-2 text-xs p-4 rounded border border-[#1d2f30] bg-[#0a1617]/60 font-sans">
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Valued Cart</span>
                            <span className="text-neutral-300 font-mono">${subtotal.toLocaleString()}</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-neutral-500">Insured Shipping Handover</span>
                            <span className="text-neutral-300">
                              {insuranceFee === 0 ? <span className="text-emerald-400 font-semibold">FREE (Luxury Shield)</span> : `$${insuranceFee}`}
                            </span>
                          </div>
                          <div className="border-t border-[#1d2f30] pt-2 flex justify-between font-bold">
                            <span className="text-neutral-300">Total Valuation</span>
                            <span className="text-[#c5a059] font-mono">${total.toLocaleString()}</span>
                          </div>
                        </div>

                        {/* Actions */}
                        <div className="pt-2 grid grid-cols-2 gap-3">
                          <button
                            type="button"
                            onClick={() => setCheckoutMode(false)}
                            className="rounded border border-[#1d2f30] bg-[#111e1f] text-neutral-400 hover:text-white py-3.5 text-xs font-display uppercase tracking-wider text-center cursor-pointer"
                          >
                            Return to Bag
                          </button>
                          
                          <button
                            type="submit"
                            className="rounded bg-gold-gradient text-black py-3.5 text-xs font-display font-bold uppercase tracking-wider text-center shadow-gold-glow flex items-center justify-center space-x-1.5 cursor-pointer"
                          >
                            <CreditCard className="h-4 w-4" />
                            <span>Authorize</span>
                          </button>
                        </div>
                      </>
                    )}
                  </form>
                ) : cart.length === 0 ? (
                  /* Empty Bag */
                  <div className="h-full flex flex-col items-center justify-center py-20 text-center space-y-4">
                    <div className="h-16 w-16 rounded-full border border-[#1d2f30] bg-[#111e1f] flex items-center justify-center text-neutral-600">
                      <ShoppingBag className="h-6 w-6" />
                    </div>
                    <div>
                      <p className="font-serif text-base text-neutral-400">Your Bag is Empty</p>
                      <p className="font-sans text-xs text-neutral-550 max-w-xs mt-1">Browse ourcurated anthology of rings, necklaces, and bridal sets to acquire pieces.</p>
                    </div>
                  </div>
                ) : (
                  /* Bag items list */
                  <div className="space-y-6">
                    {cart.map((item, index) => (
                      <div
                        key={`${item.item.id}-${item.selectedMetal}-${item.selectedSize}`}
                        className="flex items-start space-x-4 pb-5 border-b border-[#1d2f30]"
                      >
                        <div className="h-20 w-20 rounded overflow-hidden border border-[#1d2f30] bg-[#111e1f] shrink-0">
                          <img src={item.item.image} alt={item.item.name} className="h-full w-full object-cover" />
                        </div>

                        <div className="flex-1 text-left min-w-0 space-y-1">
                          <h4 className="font-luxury-title text-sm text-white truncate">{item.item.name}</h4>
                          
                          <p className="text-[10px] text-neutral-500 font-sans">
                            {item.selectedMetal} &bull; Size {item.selectedSize}
                          </p>
                          
                          <div className="flex items-center justify-between pt-2">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-[#1d2f30] rounded bg-[#111e1f] overflow-hidden w-20">
                              <button
                                disabled={item.quantity <= 1}
                                onClick={() => onUpdateQuantity(index, item.quantity - 1)}
                                className="flex-1 py-0.5 text-center text-xs text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                              >
                                -
                              </button>
                              <span className="font-mono text-xs text-center flex-1">{item.quantity}</span>
                              <button
                                disabled={item.quantity >= item.item.stock}
                                onClick={() => onUpdateQuantity(index, item.quantity + 1)}
                                className="flex-1 py-0.5 text-center text-xs text-neutral-400 hover:text-white disabled:opacity-30 cursor-pointer"
                              >
                                +
                              </button>
                            </div>

                            <div className="flex items-center space-x-3">
                              <span className="font-serif text-sm font-semibold text-[#c5a059]">
                                ${(item.item.price * item.quantity).toLocaleString()}
                              </span>
                              
                              <button
                                onClick={() => onRemoveItem(index)}
                                className="text-neutral-600 hover:text-rose-400 transition-colors cursor-pointer"
                                title="Remove piece"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Drawer Footer valuation summary */}
              {!checkoutMode && !orderComplete && cart.length > 0 && (
                <div className="p-6 border-t border-[#1d2f30] bg-[#0a1617]/85">
                  <div className="space-y-2 text-xs font-sans mb-5">
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Valued Cart Subtotal</span>
                      <span className="text-neutral-300 font-mono">${subtotal.toLocaleString()}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-500">Secure Insured Handover</span>
                      <span className="text-neutral-300">
                        {insuranceFee === 0 ? <span className="text-emerald-400 font-semibold">FREE</span> : `$${insuranceFee}`}
                      </span>
                    </div>
                    <div className="h-[1px] bg-[#1d2f30]/60 my-2" />
                    <div className="flex justify-between font-bold text-sm">
                      <span className="text-neutral-350 font-luxury-title">Total Valuation</span>
                      <span className="text-[#c5a059] font-mono">${total.toLocaleString()}</span>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <button
                      onClick={() => setCheckoutMode(true)}
                      className="w-full rounded bg-gold-gradient py-3.5 text-xs font-display font-bold uppercase tracking-[0.25em] text-black hover:opacity-95 shadow-gold-glow flex items-center justify-center space-x-2 cursor-pointer"
                    >
                      <Lock className="h-4 w-4 stroke-[2.5px]" />
                      <span>PROCEED TO HANDOVER SECUREMENT</span>
                    </button>
                    <div className="flex items-center justify-center space-x-1.5 text-[9px] font-display text-neutral-500 tracking-wider">
                      <ShieldCheck className="h-3.5 w-3.5 text-emerald-500" />
                      <span>128-BIT CLIENT DATA ENCRYPTION VAULTS</span>
                    </div>
                  </div>
                </div>
              )}

            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
