import { motion } from 'motion/react';
import { ShieldCheck, Sparkles, Lock, Gift, Heart, Users, Compass, Award, Star } from 'lucide-react';

export default function AboutSection() {
  const features = [
    {
      icon: <ShieldCheck className="h-6 w-6 text-[#c5a059]" />,
      title: 'Certified Quality',
      symbol: '💎',
      desc: 'Every gemstone and diamond undergoes strict quality verification.',
    },
    {
      icon: <Sparkles className="h-6 w-6 text-[#c5a059]" />,
      title: 'Handcrafted Excellence',
      symbol: '✨',
      desc: 'Designed with precision by skilled artisans and modern technology.',
    },
    {
      icon: <Lock className="h-6 w-6 text-[#c5a059]" />,
      title: 'Secure Shopping',
      symbol: '🔒',
      desc: 'Protected payments and trusted delivery experience.',
    },
    {
      icon: <Gift className="h-6 w-6 text-[#c5a059]" />,
      title: 'Insured Delivery',
      symbol: '📦',
      desc: 'Premium packaging and secure nationwide shipping.',
    },
    {
      icon: <Heart className="h-6 w-6 text-[#c5a059]" />,
      title: 'Lifetime Memories',
      symbol: '❤️',
      desc: 'Jewellery designed for weddings, celebrations, and special moments.',
    },
  ];

  const statistics = [
    {
      value: '10,000+',
      label: 'Happy Customers',
      icon: <Users className="h-5 w-5 text-neutral-400" />,
      sub: 'Durable trust earned across generations'
    },
    {
      value: '5,000+',
      label: 'Luxury Pieces Delivered',
      icon: <Compass className="h-5 w-5 text-neutral-400" />,
      sub: 'Bespoke designs and fine collections'
    },
    {
      value: '99%',
      label: 'Customer Satisfaction',
      icon: <Star className="h-5 w-5 text-neutral-400" />,
      sub: 'Impeccable score in custom design support'
    },
    {
      value: '100%',
      label: 'Certified Jewellery',
      icon: <Award className="h-5 w-5 text-neutral-400" />,
      sub: 'Independently graded by GIA, IGI & BIS'
    },
  ];

  return (
    <section id="about" className="relative bg-[#0d1c1d] py-24 border-t border-b border-[#1d2f30]">
      
      {/* Background patterns */}
      <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/5 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-yellow-600/5 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6">
        
        {/* Brand Legacy Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-28">
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <div className="flex items-center space-x-2">
              <div className="h-[1px] w-8 bg-[#c5a059]" />
              <span className="font-display text-xs tracking-[0.2em] text-[#c5a059] uppercase font-semibold">
                OUR STORY & LEGACY
              </span>
            </div>

            <h2 className="font-luxury-title text-3xl md:text-5xl font-medium leading-tight">
              Crafting Heritage, <br />
              <span className="italic font-normal text-gold-gradient">Designed for You</span>
            </h2>

            <p className="font-sans text-neutral-400 leading-relaxed text-sm md:text-base">
              Atelier is a premium luxury jewellery destination inspired by India's rich heritage of craftsmanship. We believe jewellery is more than an accessory—it is a symbol of love, celebration, and legacy. Every piece is carefully designed using high-quality materials and exceptional attention to detail, ensuring beauty that lasts for generations.
            </p>

            <div className="pt-4 grid grid-cols-2 gap-6">
              <div className="p-4 rounded-md border border-[#1d2f30] bg-[#111e1f]/50">
                <h4 className="font-serif text-lg text-[#c5a059] mb-1">Our Inspiration</h4>
                <p className="text-xs text-neutral-500">Royal Indian motifs reimagined for the modern aesthetic.</p>
              </div>
              <div className="p-4 rounded-md border border-[#1d2f30] bg-[#111e1f]/50">
                <h4 className="font-serif text-lg text-[#c5a059] mb-1">Our Craft</h4>
                <p className="text-xs text-neutral-500">Master craftsmen detailing gold and hand-setting gems.</p>
              </div>
            </div>
          </motion.div>

          {/* Luxury Showcase Image */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.8 }}
            className="relative"
          >
            <div className="absolute -inset-1.5 rounded-lg bg-gradient-to-r from-amber-500/10 to-transparent blur-md opacity-75" />
            <div className="relative overflow-hidden rounded-lg border border-[#1d2f30] aspect-4/3">
              <img
                src="https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1200&q=80"
                alt="High Jewellery Craftsmanship"
                className="w-full h-full object-cover brightness-75 hover:scale-105 transition-transform duration-700 ease-out"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              
              {/* Overlay Quality Badge */}
              <div className="absolute bottom-6 left-6 right-6 p-4 rounded border border-[#1d2f30] bg-[#111e1f]/95 backdrop-blur-md flex items-center justify-between">
                <div>
                  <p className="font-display text-[9px] tracking-widest text-neutral-400 uppercase">QUALITY ASSURANCE</p>
                  <p className="font-serif text-sm text-[#c5a059]">Every Diamond is GIA Certified</p>
                </div>
                <div className="h-10 w-10 rounded-full border border-[#1d2f30] flex items-center justify-center">
                  <ShieldCheck className="h-5 w-5 text-[#c5a059]" />
                </div>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Brand Excellence Features (5 Cards) */}
        <div className="mb-28">
          <div className="text-center max-w-xl mx-auto mb-16">
            <p className="font-display text-xs tracking-[0.25em] text-[#c5a059] uppercase mb-3">EXCELLENCE BUILT-IN</p>
            <h3 className="font-luxury-title text-2xl md:text-3xl font-medium">Why Discerning Clients Choose Atelier</h3>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {features.map((feat, index) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group relative rounded-md border border-[#1d2f30] bg-[#111e1f] p-6 hover:border-[#c5a059] hover:shadow-gold-glow transition-all duration-300"
              >
                <div className="absolute top-4 right-4 text-2xl filter grayscale opacity-45 group-hover:grayscale-0 group-hover:opacity-100 transition-all duration-300">
                  {feat.symbol}
                </div>
                
                <div className="mb-6 inline-flex h-12 w-12 items-center justify-center rounded bg-[#0a1617] border border-[#1d2f30] group-hover:border-[#c5a059] transition-colors duration-300">
                  {feat.icon}
                </div>

                <h4 className="font-luxury-title text-base text-white mb-2 font-medium">
                  {feat.title}
                </h4>

                <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                  {feat.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

        {/* Luxury Statistics Section (4 Columns) */}
        <div className="relative rounded-lg border border-[#1d2f30] bg-gradient-to-r from-[#0d1b1c] via-[#112426] to-[#0d1b1c] p-10 md:p-14 overflow-hidden shadow-gold-glow">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-[#c5a059]/30 to-transparent" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 text-center md:text-left relative z-10">
            {statistics.map((stat, idx) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                className="space-y-3"
              >
                <div className="flex items-center justify-center md:justify-start space-x-2">
                  <div className="p-1.5 rounded bg-[#0a1617] border border-[#1d2f30]">
                    {stat.icon}
                  </div>
                  <p className="font-display text-[10px] tracking-widest text-neutral-500 uppercase">{stat.label}</p>
                </div>
                
                <h3 className="font-luxury-title text-3xl md:text-5xl font-bold text-gold-gradient">
                  {stat.value}
                </h3>
                
                <p className="text-xs text-neutral-400 font-sans leading-tight">
                  {stat.sub}
                </p>
              </motion.div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}
