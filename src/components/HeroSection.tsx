import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Sparkles, Diamond, ChevronRight } from 'lucide-react';

interface HeroSectionProps {
  onExploreClick: () => void;
  onShopClick: () => void;
  onDiscoverClick: () => void;
}

const TAGLINES = [
  "Crafted for Generations, Designed for You.",
  "Timeless Elegance. Handcrafted Luxury.",
  "Where Every Jewel Tells a Story.",
  "Crafted with Heritage, Worn with Pride.",
  "India's Modern Luxury Jewellery House.",
  "Precision. Purity. Perfection."
];

export default function HeroSection({
  onExploreClick,
  onShopClick,
  onDiscoverClick,
}: HeroSectionProps) {
  const [taglineIndex, setTaglineIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setTaglineIndex((prev) => (prev + 1) % TAGLINES.length);
    }, 5000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden bg-transparent pt-10">
      
      {/* Absolute Ambient Background Overlays */}
      <div className="absolute inset-0 opacity-40">
        <div className="absolute top-1/4 left-1/4 w-[35rem] h-[35rem] bg-gradient-to-r from-amber-500/10 to-transparent rounded-full filter blur-[120px]" />
        <div className="absolute bottom-1/4 right-1/4 w-[30rem] h-[30rem] bg-gradient-to-r from-yellow-600/10 to-transparent rounded-full filter blur-[100px]" />
      </div>

      {/* Decorative Gold Fine Lines */}
      <div className="absolute top-0 bottom-0 left-1/2 w-[1px] bg-gradient-to-b from-[#1d2f30] via-[#1d2f30]/20 to-transparent pointer-events-none" />
      <div className="absolute left-10 right-10 top-1/2 h-[1px] bg-gradient-to-r from-transparent via-[#1d2f30]/30 to-transparent pointer-events-none" />

      {/* Animated Background Jewellery Silhouette */}
      <div 
        className="absolute inset-0 z-0 bg-cover bg-center mix-blend-luminosity opacity-15"
        style={{ 
          backgroundImage: `url('https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=1920&q=80')`,
          filter: 'brightness(0.3) contrast(1.1) sepia(0.3)'
        }}
      />

      {/* Radial overlay to darken edges */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0a1617] via-transparent to-[#0a1617]/85 z-0" />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        
        {/* Animated Tagline Rotator */}
        <div className="inline-flex flex-col items-center mb-8">
          <div className="flex items-center space-x-2 px-4 py-1.5 rounded-full border border-[#1d2f30] bg-[#111e1f]/40 backdrop-blur-sm shadow-gold-glow mb-4">
            <Sparkles className="h-3 w-3 text-[#c5a059]" />
            <span className="font-display text-[10px] uppercase tracking-[0.25em] text-[#c5a059] font-semibold">
              ATELIER HERITAGE
            </span>
          </div>

          <div className="h-12 flex items-center justify-center px-4">
            <AnimatePresence mode="wait">
              <motion.p
                key={taglineIndex}
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                className="font-serif italic text-lg md:text-xl text-neutral-300 tracking-wide text-shadow"
              >
                &ldquo;{TAGLINES[taglineIndex]}&rdquo;
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Interactive Tagline Dots */}
          <div className="flex items-center justify-center space-x-2 mt-2">
            {TAGLINES.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setTaglineIndex(idx)}
                className={`transition-all duration-300 ${
                  idx === taglineIndex ? 'w-3 h-1.5 rounded-full bg-[#c5a059]' : 'w-1.5 h-1.5 rounded-full bg-neutral-750 hover:bg-neutral-500'
                }`}
                aria-label={`Go to tagline ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="font-luxury-title text-4xl md:text-7xl font-medium leading-tight mb-6"
        >
          Discover Jewellery That <br />
          <span className="text-gold-gradient font-normal italic">Lasts Beyond a Lifetime</span>
        </motion.h1>

        {/* Subheadline */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="font-sans text-sm md:text-base text-neutral-400 max-w-3xl mx-auto leading-relaxed mb-12"
        >
          Atelier brings together timeless Indian craftsmanship and modern luxury design. From elegant diamond rings to statement necklaces, every piece is created to celebrate life's most precious moments.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-xl mx-auto"
        >
          {/* Explore Collection */}
          <button
            onClick={onExploreClick}
            className="w-full sm:w-auto relative group overflow-hidden rounded-md border border-[#c5a059] px-8 py-3.5 bg-[#111e1f] font-display text-xs tracking-widest uppercase text-[#c5a059] hover:text-black transition-colors duration-500 cursor-pointer"
          >
            <div className="absolute inset-0 bg-gold-gradient translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
            <span className="relative z-10 font-bold flex items-center justify-center space-x-1">
              <span>Explore Collection</span>
              <ChevronRight className="h-3.5 w-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </button>

          {/* Shop Now */}
          <button
            onClick={onShopClick}
            className="w-full sm:w-auto rounded-md bg-gold-gradient hover:bg-opacity-90 text-black font-display font-bold text-xs tracking-widest uppercase px-8 py-4 transition-all duration-300 hover:shadow-gold-heavy cursor-pointer"
          >
            Shop Now
          </button>

          {/* Discover Luxury */}
          <button
            onClick={onDiscoverClick}
            className="w-full sm:w-auto rounded-md border border-[#1d2f30] bg-[#111e1f]/50 hover:bg-[#111e1f] hover:border-[#c5a059] text-neutral-300 font-display font-medium text-xs tracking-widest uppercase px-8 py-4 transition-all duration-300 cursor-pointer"
          >
            Discover Luxury
          </button>
        </motion.div>

        {/* Bottom Fine Stamp */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.6 }}
          transition={{ duration: 1, delay: 1 }}
          className="mt-20 flex items-center justify-center space-x-8 text-[10px] font-display tracking-[0.25em] text-neutral-500 uppercase"
        >
          <span className="flex items-center"><Diamond className="h-3 w-3 text-[#c5a059] mr-1.5" /> BIS 916 HALLMARKED</span>
          <span className="w-1 h-1 bg-[#1d2f30] rounded-full" />
          <span className="flex items-center"><Diamond className="h-3 w-3 text-[#c5a059] mr-1.5" /> GIA CERTIFIED</span>
          <span className="w-1 h-1 bg-[#1d2f30] rounded-full" />
          <span className="flex items-center"><Diamond className="h-3 w-3 text-[#c5a059] mr-1.5" /> SECURE HANDOVER</span>
        </motion.div>

      </div>
    </section>
  );
}
