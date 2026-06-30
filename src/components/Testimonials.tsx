import { motion } from 'motion/react';
import { Quote, Star } from 'lucide-react';

export default function Testimonials() {
  const reviews = [
    {
      text: "Absolutely stunning craftsmanship and elegant packaging.",
      author: "Priya Sharma",
      location: "New Delhi",
      item: "Empress Emerald Collection",
    },
    {
      text: "The perfect blend of modern design and traditional luxury.",
      author: "Ananya Reddy",
      location: "Hyderabad",
      item: "Kundan Heritage Kada",
    },
    {
      text: "My engagement ring exceeded every expectation.",
      author: "Kavya Patel",
      location: "Mumbai",
      item: "Atelier Signature Double-Halo",
    },
  ];

  return (
    <section className="relative bg-transparent py-24 border-t border-[#1d2f30]">
      
      {/* Decorative vector curves */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#1d2f30] to-transparent pointer-events-none" />

      <div className="mx-auto max-w-7xl px-6">
        {/* Title */}
        <div className="text-center max-w-xl mx-auto mb-16">
          <p className="font-display text-xs tracking-[0.25em] text-[#c5a059] uppercase mb-3">
            VERIFIED VOICES
          </p>
          <h2 className="font-luxury-title text-3xl md:text-5xl font-medium text-white leading-tight">
            Atelier Testimonials
          </h2>
        </div>

        {/* Reviews Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left">
          {reviews.map((rev, idx) => (
            <motion.div
              key={rev.author}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: idx * 0.15 }}
              className="relative flex flex-col justify-between rounded-lg border border-[#1d2f30] bg-[#111e1f] p-8 hover:border-[#c5a059]/40 hover:shadow-gold-glow transition-all duration-300"
            >
              {/* Quote Icon */}
              <div className="absolute -top-4 left-6 flex h-8 w-8 items-center justify-center rounded-full border border-[#1d2f30] bg-[#0a1617] text-[#c5a059]">
                <Quote className="h-3.5 w-3.5 fill-[#c5a059]/10" />
              </div>

              {/* Stars */}
              <div className="flex items-center space-x-1 text-[#c5a059] mb-6 pt-2">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-3.5 w-3.5 fill-[#c5a059]" />
                ))}
              </div>

              {/* Text */}
              <p className="font-serif text-lg text-neutral-200 leading-relaxed italic mb-8">
                &ldquo;{rev.text}&rdquo;
              </p>

              {/* Author Footer */}
              <div className="border-t border-[#1d2f30]/60 pt-4 flex items-center justify-between">
                <div>
                  <h4 className="font-luxury-title text-sm text-[#c5a059] font-semibold">
                    {rev.author}
                  </h4>
                  <p className="font-sans text-[10px] text-neutral-500 uppercase tracking-widest mt-0.5">
                    {rev.location}
                  </p>
                </div>
                <div className="text-right">
                  <p className="font-sans text-[9px] text-neutral-600 uppercase tracking-widest">AQUIRED PIECE</p>
                  <p className="font-sans text-[10px] text-neutral-400 font-medium truncate max-w-[130px]" title={rev.item}>
                    {rev.item}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* GIA Endorsement Box */}
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-16 text-center max-w-xl mx-auto"
        >
          <p className="text-[10px] font-sans text-neutral-500 leading-relaxed">
            All reviews have been authenticated via GIA registry matching or independent BIS validation certificates. Names changed partially to protect royal customer discretion.
          </p>
        </motion.div>

      </div>
    </section>
  );
}
