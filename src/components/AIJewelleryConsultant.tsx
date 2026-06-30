import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, DollarSign, Gift, Star, Award, ChevronRight, HelpCircle, X, ShieldAlert } from 'lucide-react';
import { JewelryItem } from '../types';

interface AIJewelleryConsultantProps {
  products: JewelryItem[];
  isOpen: boolean;
  onClose: () => void;
  onInspectProduct: (product: JewelryItem) => void;
}

const OCCASIONS = ['Bridal Trousseau', 'Anniversary Celebration', 'Sovereign Gala', 'Daily High-Luxury', 'Festive Inheritance'];
const JEWELRY_TYPES = ['Solitaire Rings', 'Royal Chokers & Necklaces', 'Filigree Jhumkas & Earrings', 'Kundan Kadas & Bracelets'];
const STYLES = ['Traditional Heritage', 'Continental Contemporary', 'Minimalist Royal', 'Extravagant Statement'];

export default function AIJewelleryConsultant({
  products,
  isOpen,
  onClose,
  onInspectProduct,
}: AIJewelleryConsultantProps) {
  const [budget, setBudget] = useState('15000');
  const [occasion, setOccasion] = useState('Bridal Trousseau');
  const [jewelType, setJewelType] = useState('Solitaire Rings');
  const [style, setStyle] = useState('Traditional Heritage');
  
  const [loading, setLoading] = useState(false);
  const [adviceText, setAdviceText] = useState<string | null>(null);
  const [recommendedProducts, setRecommendedProducts] = useState<JewelryItem[]>([]);

  const handleRunConsultant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setAdviceText(null);
    setRecommendedProducts([]);

    try {
      const response = await fetch('/api/gemini/consultant', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          budget: Number(budget),
          occasion,
          jewelType,
          style,
          catalogProducts: products.map(p => ({
            id: p.id,
            name: p.name,
            subtitle: p.subtitle,
            price: p.price,
            description: p.description,
            collection: p.collection,
            materials: p.materials,
            image: p.image,
            sku: p.sku
          }))
        })
      });

      const data = await response.json();
      
      if (data.error) {
        throw new Error(data.error);
      }

      setAdviceText(data.consultantAdvice);
      
      if (data.recommendedProductIds && Array.isArray(data.recommendedProductIds)) {
        const matched = products.filter(p => data.recommendedProductIds.includes(p.id));
        setRecommendedProducts(matched);
      } else {
        // Fallback: match based on budget
        const matched = products.filter(p => p.price <= Number(budget));
        setRecommendedProducts(matched.slice(0, 2));
      }
    } catch (err: any) {
      console.error(err);
      // Fail-safe graceful client-side fallback
      setAdviceText(`Welcome to ATELIER, where heritage meets your personal aspirations. As your bespoke concierge advisor, I have curated a selection for your upcoming ${occasion}. Under your luxury budget of $${Number(budget).toLocaleString()}, our collections represent the pinnacle of fine design. Styled to complement a ${style} look, they stand ready to accompany you through moments of celebration.`);
      const matched = products.filter(p => p.price <= Number(budget));
      setRecommendedProducts(matched.slice(0, 2));
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8 bg-black/92 backdrop-blur-md">
      <div className="relative w-full max-w-5xl rounded-lg border border-[#1d2f30] bg-[#0a1617] p-6 md:p-9 shadow-gold-heavy flex flex-col justify-between max-h-[92vh] overflow-hidden">
        
        {/* Glowing border framing */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gold-gradient" />

        {/* Header Bar */}
        <div className="flex items-center justify-between mb-6 border-b border-[#1d2f30]/60 pb-3">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="h-5 w-5 text-[#c5a059]" />
            <div>
              <h2 className="font-luxury-title text-xl text-white font-medium">Bespoke AI Jewellery Curator</h2>
              <p className="text-[10px] text-neutral-400 font-sans">Curating certified masterpieces tuned to your financial scale, event and style</p>
            </div>
          </div>
          
          <button
            onClick={onClose}
            className="text-neutral-400 hover:text-white border border-[#1d2f30] hover:border-[#c5a059] rounded-full h-8 w-8 flex items-center justify-center bg-[#111e1f] cursor-pointer animate-transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 flex-1 overflow-hidden">
          
          {/* PARAMETERS CONFIGURATION PANEL (Col span 5) */}
          <form onSubmit={handleRunConsultant} className="lg:col-span-5 flex flex-col space-y-4.5 text-left overflow-y-auto pr-1">
            
            {/* Budget */}
            <div className="space-y-1.5">
              <label className="block text-[9px] font-display tracking-widest text-neutral-400 uppercase font-bold">
                Bespoke Acquisition Budget (USD)
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <span className="text-[#c5a059] font-mono text-xs font-bold">$</span>
                </div>
                <input
                  type="number"
                  required
                  min="500"
                  max="100000"
                  value={budget}
                  onChange={(e) => setBudget(e.target.value)}
                  className="w-full bg-[#111e1f] rounded border border-[#1d2f30] py-3.5 pl-8 pr-4 text-xs font-mono text-neutral-200 focus:border-[#c5a059] focus:outline-none"
                />
              </div>
              <p className="text-[9px] text-neutral-500 font-sans">Enter valuation threshold between $500 and $100,000</p>
            </div>

            {/* Occasion */}
            <div className="space-y-1.5">
              <label className="block text-[9px] font-display tracking-widest text-neutral-400 uppercase font-bold">
                Occasion Profile
              </label>
              <div className="relative">
                <select
                  value={occasion}
                  onChange={(e) => setOccasion(e.target.value)}
                  className="w-full bg-[#111e1f] rounded border border-[#1d2f30] py-3.5 px-4 text-xs text-neutral-300 focus:border-[#c5a059] focus:outline-none appearance-none"
                >
                  {OCCASIONS.map(oc => (
                    <option key={oc} value={oc} className="bg-[#0a1617]">{oc}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-neutral-400">
                  <ChevronRight className="h-3.5 w-3.5 rotate-90" />
                </div>
              </div>
            </div>

            {/* Jewelry Type */}
            <div className="space-y-1.5">
              <label className="block text-[9px] font-display tracking-widest text-neutral-400 uppercase font-bold">
                Preferred Category
              </label>
              <div className="relative">
                <select
                  value={jewelType}
                  onChange={(e) => setJewelType(e.target.value)}
                  className="w-full bg-[#111e1f] rounded border border-[#1d2f30] py-3.5 px-4 text-xs text-neutral-300 focus:border-[#c5a059] focus:outline-none appearance-none"
                >
                  {JEWELRY_TYPES.map(jt => (
                    <option key={jt} value={jt} className="bg-[#0a1617]">{jt}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-neutral-400">
                  <ChevronRight className="h-3.5 w-3.5 rotate-90" />
                </div>
              </div>
            </div>

            {/* Style Preference */}
            <div className="space-y-1.5">
              <label className="block text-[9px] font-display tracking-widest text-neutral-400 uppercase font-bold">
                Aesthetic Preference
              </label>
              <div className="relative">
                <select
                  value={style}
                  onChange={(e) => setStyle(e.target.value)}
                  className="w-full bg-[#111e1f] rounded border border-[#1d2f30] py-3.5 px-4 text-xs text-neutral-300 focus:border-[#c5a059] focus:outline-none appearance-none"
                >
                  {STYLES.map(st => (
                    <option key={st} value={st} className="bg-[#0a1617]">{st}</option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 flex items-center pr-4 pointer-events-none text-neutral-400">
                  <ChevronRight className="h-3.5 w-3.5 rotate-90" />
                </div>
              </div>
            </div>

            {/* Submit Consultation */}
            <button
              type="submit"
              disabled={loading}
              className="w-full rounded bg-gold-gradient py-4 text-xs font-display font-bold uppercase tracking-[0.2em] text-black hover:opacity-95 shadow-gold-glow transition-all cursor-pointer flex items-center justify-center space-x-2"
            >
              <span>{loading ? 'ANALYZING ATELIER INVENTORY...' : 'ACQUIRE AI RECOMMENDATIONS'}</span>
            </button>
          </form>

          {/* RECOMMENDATIONS & CURATION NARRATIVE PANEL (Col span 7) */}
          <div className="lg:col-span-7 flex flex-col bg-[#111e1f]/30 rounded border border-[#1d2f30] p-6 relative overflow-hidden overflow-y-auto max-h-[50vh] lg:max-h-[60vh]">
            
            <AnimatePresence mode="wait">
              {loading ? (
                /* Loading animated overlay */
                <motion.div
                  key="loading"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="absolute inset-0 flex flex-col items-center justify-center space-y-4 px-6 text-center bg-[#0a1617]/95"
                >
                  <div className="relative h-16 w-16 flex items-center justify-center">
                    {/* Golden luxury spinner */}
                    <div className="absolute inset-0 rounded-full border-2 border-[#1d2f30] border-t-[#c5a059] animate-spin" />
                    <Sparkles className="h-6 w-6 text-[#c5a059] animate-pulse" />
                  </div>
                  <h3 className="font-luxury-title text-base text-white">Consulting Lead GIA Gemologists</h3>
                  <p className="text-[11px] text-neutral-400 max-w-sm leading-relaxed font-sans">
                    Analyzing carat dimensions, purity variables, and catalog masterpieces for custom styling matches...
                  </p>
                </motion.div>
              ) : adviceText ? (
                /* Curation advice & recommended items showcase */
                <motion.div
                  key="results"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="space-y-6 text-left"
                >
                  {/* Curation advice letter */}
                  <div className="space-y-3">
                    <div className="flex items-center space-x-1.5 text-[10px] font-display text-[#c5a059] font-bold uppercase tracking-wider">
                      <Award className="h-4 w-4" />
                      <span>Artisan Curation Dispatch</span>
                    </div>
                    <div className="font-serif text-neutral-300 text-xs leading-relaxed italic bg-[#0a1617]/55 p-4 rounded border border-[#1d2f30]/40 border-l-2 border-l-[#c5a059] shadow-inner-gold whitespace-pre-wrap">
                      &ldquo;{adviceText}&rdquo;
                    </div>
                  </div>

                  {/* Curated Products Cards Carousel */}
                  <div className="space-y-3.5">
                    <p className="text-[9px] font-display tracking-widest text-neutral-400 uppercase font-bold">Selected Masterpieces</p>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      {recommendedProducts.map(prod => (
                        <div 
                          key={prod.id}
                          className="rounded border border-[#1d2f30] bg-[#111e1f] p-3 flex flex-col justify-between hover:border-[#c5a059]/40 transition-colors"
                        >
                          <div className="flex items-center space-x-3 mb-3">
                            <img 
                              src={prod.image} 
                              alt={prod.name} 
                              className="h-14 w-14 object-cover rounded bg-[#0a1617] border border-[#1d2f30]/40 shrink-0" 
                              referrerPolicy="no-referrer"
                            />
                            <div className="overflow-hidden">
                              <h4 className="text-xs font-serif text-white truncate leading-snug">{prod.name}</h4>
                              <p className="text-[10px] text-[#c5a059] font-mono">${prod.price.toLocaleString()}</p>
                              <span className="text-[8px] font-mono text-neutral-500 block truncate">{prod.materials}</span>
                            </div>
                          </div>

                          <button
                            onClick={() => {
                              onInspectProduct(prod);
                              onClose();
                            }}
                            className="w-full text-center rounded border border-[#c5a059]/40 hover:bg-[#c5a059]/10 text-neutral-200 py-1.5 text-[9px] font-display font-bold tracking-widest uppercase cursor-pointer"
                          >
                            Inspect Masterpiece
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                </motion.div>
              ) : (
                /* Welcome / idle display */
                <motion.div
                  key="idle"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex flex-col items-center justify-center space-y-3 py-12 text-center h-full my-auto"
                >
                  <div className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-[#c5a059]/10 border border-[#c5a059]/30 text-[#c5a059]">
                    <Sparkles className="h-5 w-5" />
                  </div>
                  <h3 className="font-luxury-title text-base text-white">Your Personal Curation Awaits</h3>
                  <p className="text-xs text-neutral-400 max-w-sm leading-relaxed font-sans">
                    Configure your investment threshold and luxury preferences on the left, then click the request button. Our AI algorithm will compose a tailored selection report instantly.
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

          </div>

        </div>

      </div>
    </div>
  );
}
