import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Palette, FileCheck, CheckCircle2, DollarSign, PenTool, Image, User, Mail, Phone, Crown } from 'lucide-react';

export interface CustomRequest {
  id: string;
  name: string;
  email: string;
  phone: string;
  jewelType: string;
  budget: number;
  description: string;
  referenceImage?: string;
  status: 'Pending' | 'Under Review' | 'Approved' | 'In Production' | 'Ready for Delivery' | 'Delivered';
  quotation?: number;
  date: string;
}

const JEWEL_TYPES = ['Bespeke Ring', 'Curated Collar Necklace', 'Intricate Earring Sets', 'Sovereign Cuff Bracelet', 'Heirloom Headpiece'];

export default function CustomJewelleryForm() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [jewelType, setJewelType] = useState('Bespeke Ring');
  const [budget, setBudget] = useState('5000');
  const [description, setDescription] = useState('');
  const [refImage, setRefImage] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !phone || !description) return;

    const newRequest: CustomRequest = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      name,
      email,
      phone,
      jewelType,
      budget: Number(budget),
      description,
      referenceImage: refImage || 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80',
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
    };

    // Store custom requests in LocalStorage
    const stored = localStorage.getItem('atelier_custom_requests');
    const list = stored ? JSON.parse(stored) : [];
    list.unshift(newRequest);
    localStorage.setItem('atelier_custom_requests', JSON.stringify(list));

    setSuccess(true);
    setTimeout(() => {
      setName('');
      setEmail('');
      setPhone('');
      setJewelType('Bespeke Ring');
      setBudget('5000');
      setDescription('');
      setRefImage('');
      setSuccess(false);
    }, 4000);
  };

  return (
    <div className="relative rounded-lg border border-[#1d2f30] bg-[#111e1f] p-8 md:p-10 shadow-gold-glow overflow-hidden text-left">
      <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gold-gradient" />

      <AnimatePresence mode="wait">
        {success ? (
          <motion.div
            key="success"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="py-12 text-center space-y-4"
          >
            <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#c5a059]/10 border border-[#c5a059]/50 text-[#c5a059] mb-2">
              <CheckCircle2 className="h-8 w-8 animate-bounce" />
            </div>
            <h3 className="font-luxury-title text-2xl text-white font-medium">Commission Request Initiated</h3>
            <p className="font-sans text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
              Congratulations, {name}. Your bespoke creation proposal has been registered. Our private commissioning artisans will review your design description, establish initial grading criteria, and issue a secure appraisal within 24 hours.
            </p>
            <div className="pt-4 flex items-center justify-center space-x-2">
              <Crown className="h-3.5 w-3.5 text-[#c5a059] animate-pulse" />
              <span className="text-[10px] text-[#c5a059] font-display uppercase tracking-widest font-semibold">
                Status: Pending Artisan Review
              </span>
            </div>
          </motion.div>
        ) : (
          <motion.form
            key="form"
            onSubmit={handleSubmit}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="space-y-6"
          >
            <div className="border-b border-[#1d2f30]/60 pb-4 mb-4">
              <div className="flex items-center space-x-2 text-[#c5a059] mb-1">
                <Palette className="h-4.5 w-4.5" />
                <span className="font-display text-[10px] uppercase tracking-widest font-bold">Atelier Artisan Commission Suite</span>
              </div>
              <p className="text-[11px] text-neutral-400 font-sans">
                Co-design your dream masterpiece. Outline your conceptual outline, select dimensions, and upload optional references.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Name */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-display tracking-widest text-neutral-500 uppercase font-semibold">
                  Customer Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                  <input
                    required
                    type="text"
                    placeholder="e.g. Radhika Roy"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-3.5 pl-10 pr-4 text-xs text-neutral-200 focus:border-[#c5a059] focus:outline-none"
                  />
                </div>
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-display tracking-widest text-neutral-500 uppercase font-semibold">
                  Email Address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                  <input
                    required
                    type="email"
                    placeholder="e.g. radhika@heritage.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-3.5 pl-10 pr-4 text-xs text-neutral-200 focus:border-[#c5a059] focus:outline-none"
                  />
                </div>
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-display tracking-widest text-neutral-500 uppercase font-semibold">
                  Phone Number
                </label>
                <div className="relative">
                  <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                  <input
                    required
                    type="tel"
                    placeholder="e.g. +91 98300 44100"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-3.5 pl-10 pr-4 text-xs text-neutral-200 focus:border-[#c5a059] focus:outline-none"
                  />
                </div>
              </div>

              {/* Type and Budget group */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="block text-[9px] font-display tracking-widest text-neutral-500 uppercase font-semibold">
                    Jewel Type
                  </label>
                  <select
                    value={jewelType}
                    onChange={(e) => setJewelType(e.target.value)}
                    className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-3.5 px-3.5 text-xs text-neutral-300 focus:border-[#c5a059] focus:outline-none appearance-none"
                  >
                    {JEWEL_TYPES.map(jt => (
                      <option key={jt} value={jt}>{jt}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-[9px] font-display tracking-widest text-neutral-500 uppercase font-semibold">
                    Target Budget
                  </label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 -translate-y-1/2 text-[10px] text-[#c5a059] font-mono">$</span>
                    <input
                      required
                      type="number"
                      min="1000"
                      value={budget}
                      onChange={(e) => setBudget(e.target.value)}
                      className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-3.5 pl-7 pr-3 text-xs text-neutral-200 focus:border-[#c5a059] focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Reference Image Link */}
            <div className="space-y-1.5">
              <label className="block text-[9px] font-display tracking-widest text-neutral-500 uppercase font-semibold">
                Design Reference Image URL (Optional)
              </label>
              <div className="relative">
                <Image className="absolute left-3.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                <input
                  type="url"
                  placeholder="Paste a direct image link (JPEG, PNG) for reference..."
                  value={refImage}
                  onChange={(e) => setRefImage(e.target.value)}
                  className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-3.5 pl-10 pr-4 text-xs text-neutral-200 focus:border-[#c5a059] focus:outline-none"
                />
              </div>
            </div>

            {/* Design Description */}
            <div className="space-y-1.5">
              <label className="block text-[9px] font-display tracking-widest text-neutral-500 uppercase font-semibold">
                Design Description & Material Intent
              </label>
              <div className="relative">
                <PenTool className="absolute left-3.5 top-3.5 h-3.5 w-3.5 text-neutral-500" />
                <textarea
                  required
                  rows={4}
                  placeholder="Detail your creation: explain gemstone preferences, setting parameters (e.g., Kundan, pavé, bezel), engraving requests, and gold hallmarking intents..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-3 pl-10 pr-4 text-xs text-neutral-200 focus:border-[#c5a059] focus:outline-none"
                />
              </div>
            </div>

            {/* Book Action */}
            <button
              type="submit"
              className="w-full rounded bg-gold-gradient py-4 text-xs font-display font-bold uppercase tracking-[0.2em] text-black hover:opacity-95 shadow-gold-glow transition-all duration-300 cursor-pointer"
            >
              SUBMIT Bespoke CREATION PROPOSAL
            </button>
          </motion.form>
        )}
      </AnimatePresence>
    </div>
  );
}
