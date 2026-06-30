import { useState } from 'react';
import { ShoppingBag, ShieldCheck, Menu, X, Landmark, User, LogOut } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { CartItem } from '../types';

interface NavbarProps {
  cart: CartItem[];
  onOpenCart: () => void;
  activeSection: string;
  onNavigate: (section: string) => void;
  currentUser: { userId: string; name: string; email: string; role: 'Customer' | 'Admin' } | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenConsultant?: () => void;
  onOpenTryOn?: () => void;
}

export default function Navbar({
  cart,
  onOpenCart,
  activeSection,
  onNavigate,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenConsultant,
  onOpenTryOn,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);

  const handleNavClick = (section: string) => {
    if (section === 'ai-concierge') {
      onOpenConsultant?.();
    } else if (section === 'ar-tryon') {
      onOpenTryOn?.();
    } else {
      onNavigate(section);
    }
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { id: 'home', label: 'Home' },
    { id: 'collections', label: 'Collections' },
    { id: 'about', label: 'About Atelier' },
    ...(currentUser && currentUser.role === 'Customer' ? [{ id: 'my-orders', label: 'My Orders' }] : []),
    { id: 'ai-concierge', label: 'Atelier AI Concierge' },
    { id: 'ar-tryon', label: 'Camera AR Try-On' },
    { id: 'consultation', label: 'Private Suite' },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-[#1d2f30] bg-[#0a1617]/85 backdrop-blur-md">
      <div className="mx-auto flex h-20 max-w-7xl items-center justify-between px-6">
        
        {/* Brand Logo */}
        <button
          onClick={() => {
            if (currentUser?.role !== 'Admin') {
              handleNavClick('home');
            }
          }}
          className={`group flex flex-col items-start focus:outline-none ${currentUser?.role === 'Admin' ? 'cursor-default' : 'cursor-pointer'}`}
        >
          <span className="font-luxury-display text-2xl font-bold tracking-widest text-gold-gradient group-hover:opacity-90">
            ATELIER
          </span>
          <span className="font-serif text-[9px] uppercase tracking-[0.25em] text-neutral-400 group-hover:text-[#c5a059] transition-colors duration-300">
            High Jewellery
          </span>
        </button>

        {/* Desktop Navigation */}
        {currentUser?.role !== 'Admin' && (
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map((link) => (
              <button
                key={link.id}
                onClick={() => handleNavClick(link.id)}
                className={`relative py-2 font-display text-xs tracking-wider uppercase transition-colors duration-300 focus:outline-none cursor-pointer ${
                  activeSection === link.id
                    ? 'text-[#c5a059] font-semibold'
                    : 'text-neutral-400 hover:text-white'
                }`}
              >
                {link.label}
                {activeSection === link.id && (
                  <motion.div
                    layoutId="activeIndicator"
                    className="absolute bottom-0 left-0 h-[1.5px] w-full bg-[#c5a059]"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </nav>
        )}

        {/* Action Controls */}
        <div className="flex items-center space-x-3.5">
          
          {/* Member Authentication Control */}
          {currentUser ? (
            <div className="flex items-center space-x-2">
              <div className="hidden lg:flex flex-col items-end text-right">
                <span className="text-[10px] text-[#c5a059] font-display uppercase tracking-widest font-bold">
                  {currentUser.role === 'Admin' ? 'Atelier Administrator' : 'Sovereign Patron'}
                </span>
                <span className="text-[9px] text-neutral-400 font-sans truncate max-w-[120px]">
                  {currentUser.name}
                </span>
              </div>
              
              <button
                onClick={onLogout}
                className="flex h-10 w-10 items-center justify-center rounded-full border border-rose-950/40 bg-rose-950/10 text-rose-400 transition-colors hover:bg-rose-900/30 cursor-pointer"
                title="Sovereign Log Out"
              >
                <LogOut className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <button
              onClick={onOpenAuth}
              className="flex items-center space-x-1 border border-[#1d2f30] hover:border-[#c5a059]/80 bg-[#111e1f]/60 rounded-full px-3.5 py-2 text-neutral-400 hover:text-white transition-all text-xs font-display tracking-widest uppercase cursor-pointer"
            >
              <User className="h-3.5 w-3.5 text-[#c5a059]" />
              <span className="hidden sm:inline font-medium">Patron Login</span>
            </button>
          )}

          {/* Cart Bag - Customer only */}
          {currentUser?.role !== 'Admin' && (
            <button
              onClick={onOpenCart}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-[#1d2f30] bg-[#111e1f] text-neutral-400 transition-colors hover:border-[#c5a059] hover:text-[#c5a059] cursor-pointer"
            >
              <ShoppingBag className="h-4 w-4" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -top-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-[#c5a059] text-[10px] font-bold text-black"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </button>
          )}

          {/* Mobile Menu Toggle - Customer only */}
          {currentUser?.role !== 'Admin' && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="flex h-10 w-10 items-center justify-center rounded-full border border-[#1d2f30] bg-[#111e1f] text-neutral-400 transition-colors hover:text-white md:hidden cursor-pointer"
            >
              {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Panel */}
      <AnimatePresence>
        {mobileMenuOpen && currentUser?.role !== 'Admin' && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="absolute top-20 left-0 w-full border-b border-[#1d2f30] bg-[#0a1617] px-6 py-6 md:hidden"
          >
            <div className="flex flex-col space-y-4">
               {navLinks.map((link) => (
                <button
                  key={link.id}
                  onClick={() => handleNavClick(link.id)}
                  className={`text-left font-display text-sm tracking-widest uppercase py-2 border-l-2 pl-3 ${
                    activeSection === link.id
                      ? 'border-[#c5a059] text-[#c5a059] bg-[#c5a059]/5'
                      : 'border-transparent text-neutral-400 hover:text-white'
                  }`}
                >
                  {link.label}
                </button>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
