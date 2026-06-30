import { Diamond, Mail, Phone, MapPin, Instagram, Facebook } from 'lucide-react';

interface FooterProps {
  onNavigate: (section: string) => void;
}

export default function Footer({ onNavigate }: FooterProps) {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="relative bg-[#071011] border-t border-[#1d2f30] py-16 text-left">
      <div className="mx-auto max-w-7xl px-6">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 mb-12">
          
          {/* Logo Brand Description (Col 5) */}
          <div className="md:col-span-5 space-y-4">
            <button
              onClick={() => onNavigate('home')}
              className="flex flex-col items-start focus:outline-none group text-left"
            >
              <span className="font-display text-xl font-bold tracking-widest text-gold-gradient group-hover:opacity-90">
                ATELIER
              </span>
              <span className="font-serif text-[8px] uppercase tracking-[0.25em] text-neutral-400">
                High Jewellery House
              </span>
            </button>
            
            <p className="font-sans text-xs text-neutral-400 leading-relaxed max-w-sm">
              Creating timeless jewellery that celebrates love, heritage, and life's unforgettable moments. Designed using high-quality materials and exceptional attention to detail.
            </p>

            <div className="flex space-x-4 pt-2">
              <a href="#" className="h-8 w-8 rounded-full border border-[#1d2f30] flex items-center justify-center text-neutral-400 hover:text-[#c5a059] hover:border-[#c5a059] transition-all duration-300">
                <Instagram className="h-4 w-4" />
              </a>
              <a href="#" className="h-8 w-8 rounded-full border border-[#1d2f30] flex items-center justify-center text-neutral-400 hover:text-[#c5a059] hover:border-[#c5a059] transition-all duration-300">
                <Facebook className="h-4 w-4" />
              </a>
            </div>
          </div>

          {/* Quick links (Col 3) */}
          <div className="md:col-span-3 space-y-4 text-xs font-sans">
            <h4 className="font-display font-semibold text-[10px] uppercase tracking-widest text-[#c5a059]">
              Atelier Collections
            </h4>
            <ul className="space-y-2.5 text-neutral-400">
              <li>
                <button onClick={() => onNavigate('collections')} className="hover:text-white transition-colors">
                  Diamond Collection
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('collections')} className="hover:text-white transition-colors">
                  Gold Jewellery
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('collections')} className="hover:text-white transition-colors">
                  Bridal Collection
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('collections')} className="hover:text-white transition-colors">
                  Wedding Essentials
                </button>
              </li>
            </ul>
          </div>

          {/* Concierge contact info (Col 4) */}
          <div className="md:col-span-4 space-y-4 text-xs font-sans">
            <h4 className="font-display font-semibold text-[10px] uppercase tracking-widest text-[#c5a059]">
              Concierge Services
            </h4>
            
            <div className="space-y-3 text-neutral-400">
              <div className="flex items-start space-x-2.5">
                <MapPin className="h-3.5 w-3.5 text-neutral-500 mt-0.5" />
                <span>Taj Mansingh Chambers, 1, Mansingh Road, New Delhi, India 110011</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Phone className="h-3.5 w-3.5 text-neutral-500" />
                <span>+91 11 4123 4567</span>
              </div>
              <div className="flex items-center space-x-2.5">
                <Mail className="h-3.5 w-3.5 text-neutral-500" />
                <span>concierge@atelier-jewels.com</span>
              </div>
            </div>
          </div>

        </div>

        {/* Bottom line with copyright */}
        <div className="border-t border-[#1d2f30] pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[10px] font-display text-neutral-500 tracking-wider">
          <p>&copy; {currentYear} ATELIER High Jewellery House. All Rights Reserved.</p>
          <div className="flex items-center space-x-6">
            <span className="flex items-center"><Diamond className="h-3 w-3 text-[#c5a059] mr-1" /> BIS HALLMARKED 916</span>
            <span className="flex items-center"><Diamond className="h-3 w-3 text-[#c5a059] mr-1" /> GIA CERTIFIED</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
