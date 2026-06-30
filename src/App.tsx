import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import Navbar from './components/Navbar';
import HeroSection from './components/HeroSection';
import CollectionsShowcase from './components/CollectionsShowcase';
import AboutSection from './components/AboutSection';
import Testimonials from './components/Testimonials';
import ConsultationForm from './components/ConsultationForm';
import CartDrawer from './components/CartDrawer';
import AdminPortal from './components/AdminPortal';
import Footer from './components/Footer';
import MyOrders from './components/MyOrders';

// Premium Feature Integrations
import AuthModal from './components/AuthModal';
import VirtualTryOn from './components/VirtualTryOn';
import AIJewelleryConsultant from './components/AIJewelleryConsultant';
import CustomJewelleryForm from './components/CustomJewelleryForm';
import LiveGoldRateWidget from './components/LiveGoldRateWidget';

import { JewelryItem, CartItem, Order, Consultation } from './types';
import { INITIAL_PRODUCTS, INITIAL_ORDERS, INITIAL_CONSULTATIONS } from './data/initialData';
import { Landmark, Sparkles, Sliders, Sparkle, Star, Eye } from 'lucide-react';

export default function App() {
  // --- DATABASE STATE WITH LOCAL STORAGE PERSISTENCE ---
  const [products, setProducts] = useState<JewelryItem[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [consultations, setConsultations] = useState<Consultation[]>([]);
  const [cart, setCart] = useState<CartItem[]>([]);
  
  // --- NAVIGATION & INTERFACE VIEW STATE ---
  const [activeSection, setActiveSection] = useState('home');
  const [cartOpen, setCartOpen] = useState(false);

  // --- PREMIUM CONCIERGE & TRY-ON STATES ---
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [tryOnOpen, setTryOnOpen] = useState(false);
  const [tryOnProduct, setTryOnProduct] = useState<JewelryItem | null>(null);
  const [consultantOpen, setConsultantOpen] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ userId: string; name: string; email: string; role: 'Customer' | 'Admin' } | null>(null);

  // Initialize databases from LocalStorage or default fallback mock data
  useEffect(() => {
    const storedProducts = localStorage.getItem('atelier_products');
    const storedOrders = localStorage.getItem('atelier_orders');
    const storedConsultations = localStorage.getItem('atelier_consultations');
    const storedCart = localStorage.getItem('atelier_cart');
    const storedUser = localStorage.getItem('atelier_current_user');

    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      if (parsedUser && !parsedUser.userId) {
        parsedUser.userId = parsedUser.email || 'guest';
      }
      setCurrentUser(parsedUser);
    }

    if (storedProducts) {
      setProducts(JSON.parse(storedProducts));
    } else {
      setProducts(INITIAL_PRODUCTS);
      localStorage.setItem('atelier_products', JSON.stringify(INITIAL_PRODUCTS));
    }

    if (storedOrders) {
      setOrders(JSON.parse(storedOrders));
    } else {
      setOrders(INITIAL_ORDERS);
      localStorage.setItem('atelier_orders', JSON.stringify(INITIAL_ORDERS));
    }

    if (storedConsultations) {
      setConsultations(JSON.parse(storedConsultations));
    } else {
      setConsultations(INITIAL_CONSULTATIONS);
      localStorage.setItem('atelier_consultations', JSON.stringify(INITIAL_CONSULTATIONS));
    }

    if (storedCart) {
      setCart(JSON.parse(storedCart));
    }
  }, []);

  // Sync state helpers to persistent Storage
    const updateStoredProducts = (newProds: JewelryItem[]) => {
      setProducts(newProds);
      localStorage.setItem('atelier_products', JSON.stringify(newProds));
    };

    const updateStoredOrders = (newOrders: Order[]) => {
      setOrders(newOrders);
      localStorage.setItem('atelier_orders', JSON.stringify(newOrders));
    };

    // Load and sync orders from backend if logged in as Admin
    useEffect(() => {
      if (currentUser?.role === 'Admin') {
        fetch('/api/admin/orders', {
          headers: {
            'Authorization': 'Bearer ATELIER'
          }
        })
          .then(res => {
            if (res.ok) return res.json();
            throw new Error('Failed to fetch admin orders');
          })
          .then(data => {
            // Map flat backend records back to standard Order structured format
            const mappedOrders: Order[] = data.map((o: any) => ({
              id: o.id,
              customerName: o.user_id.split('@')[0],
              customerEmail: o.user_id,
              customerPhone: '',
              items: [
                {
                  item: { id: o.id, name: o.product_name, price: o.price, category: 'Bespoke', weight: '', material: '', description: '', images: [], rating: 5 },
                  quantity: o.quantity,
                  selectedMetal: 'Platinum/Gold',
                  selectedSize: 'Standard'
                }
              ],
              total: o.price * o.quantity,
              status: o.status,
              date: o.date
            }));
            setOrders(mappedOrders);
          })
          .catch(err => console.error('Admin order sync error:', err));
      }
    }, [currentUser]);

  const updateStoredConsultations = (newCons: Consultation[]) => {
    setConsultations(newCons);
    localStorage.setItem('atelier_consultations', JSON.stringify(newCons));
  };

  const updateStoredCart = (newCart: CartItem[]) => {
    setCart(newCart);
    localStorage.setItem('atelier_cart', JSON.stringify(newCart));
  };

  // --- ACTIONS ---
  const handleAddToCart = (item: JewelryItem, quantity: number, metal: string, size: string) => {
    const existingIndex = cart.findIndex(
      (c) => c.item.id === item.id && c.selectedMetal === metal && c.selectedSize === size
    );

    let updatedCart = [...cart];
    if (existingIndex > -1) {
      updatedCart[existingIndex].quantity += quantity;
    } else {
      updatedCart.push({ item, quantity, selectedMetal: metal, selectedSize: size });
    }
    updateStoredCart(updatedCart);
  };

  const handleUpdateCartQuantity = (index: number, quantity: number) => {
    let updatedCart = [...cart];
    updatedCart[index].quantity = quantity;
    updateStoredCart(updatedCart);
  };

  const handleRemoveFromCart = (index: number) => {
    const updatedCart = cart.filter((_, idx) => idx !== index);
    updateStoredCart(updatedCart);
  };

  const handleCheckoutSubmit = (name: string, email: string, phone: string, address: string) => {
    const newOrder: Order = {
      id: `ORD-${Math.floor(1000 + Math.random() * 9000)}`,
      customerName: name,
      customerEmail: email,
      customerPhone: phone,
      items: [...cart],
      total: cart.reduce((tot, c) => tot + c.item.price * c.quantity, 0) + (cart.reduce((tot, c) => tot + c.item.price * c.quantity, 0) > 10000 ? 0 : 75),
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
      shippingAddress: address,
    };

    const updatedOrders = [newOrder, ...orders];
    updateStoredOrders(updatedOrders);

    // Sync order items to the backend database securely
    const userEmail = currentUser?.email || email;
    if (userEmail) {
      cart.forEach(async (cartItem, index) => {
        try {
          await fetch('/api/orders', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${userEmail}`
            },
            body: JSON.stringify({
              id: cart.length > 1 ? `${newOrder.id}-${index + 1}` : newOrder.id,
              product_name: cartItem.item.name,
              price: cartItem.item.price,
              quantity: cartItem.quantity,
              status: 'Pending',
              date: newOrder.date
            })
          });
        } catch (error) {
          console.error('Error saving order to backend:', error);
        }
      });
    }

    updateStoredCart([]); // Empty bag on success
  };

  const handleBookConsultation = (cons: Omit<Consultation, 'id' | 'status'>) => {
    const newCons: Consultation = {
      ...cons,
      id: `CNS-${Math.floor(200 + Math.random() * 800)}`,
      status: 'Scheduled',
    };
    const updatedCons = [newCons, ...consultations];
    updateStoredConsultations(updatedCons);
  };

  // --- ADMIN PORTAL DATABASE CRUD BINDERS ---
  const handleUpdateProduct = (updated: JewelryItem) => {
    const updatedProds = products.map((p) => (p.id === updated.id ? updated : p));
    updateStoredProducts(updatedProds);
  };

  const handleAddProduct = (newProd: JewelryItem) => {
    const updatedProds = [newProd, ...products];
    updateStoredProducts(updatedProds);
  };

  const handleDeleteProduct = (id: string) => {
    const updatedProds = products.filter((p) => p.id !== id);
    updateStoredProducts(updatedProds);
  };

  const handleUpdateOrderStatus = (orderId: string, status: Order['status']) => {
    const updatedOrders = orders.map((ord) => {
      if (ord.id === orderId) {
        let updated = { ...ord, status };
        if (status === 'Insured Transit' && !ord.trackingNumber) {
          updated.trackingNumber = `ATL-SHIP-${Math.floor(1000000 + Math.random() * 9000000)}`;
        }
        return updated;
      }
      return ord;
    });
    updateStoredOrders(updatedOrders);

    // Sync state to backend database
    fetch(`/api/admin/orders/${orderId}/status`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer ATELIER'
      },
      body: JSON.stringify({ status })
    }).catch(err => console.error('Error updating status on server:', err));
  };

  const handleUpdateConsultationStatus = (cId: string, status: Consultation['status']) => {
    const updatedCons = consultations.map((c) => (c.id === cId ? { ...c, status } : c));
    updateStoredConsultations(updatedCons);
  };

  // --- USER AUTHENTICATION HANDLERS ---
  const handleLoginSuccess = (user: { userId: string; name: string; email: string; role: 'Customer' | 'Admin' }) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    localStorage.removeItem('atelier_current_user');
    setCurrentUser(null);
  };

  // --- NAVIGATION ACTION ---
  const handleNavigate = (section: string) => {
    setActiveSection(section);
    
    // Quick scrolling to appropriate element
    setTimeout(() => {
      const el = document.getElementById(section);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
      }
    }, 100);
  };

  return (
    <div className="relative min-h-screen bg-[#0a1617] text-neutral-100 flex flex-col justify-between selection:bg-[#c5a059]/30 selection:text-[#c5a059]">
      
      {/* Upper ambient subtle lines */}
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-[#1d2f30] to-transparent z-40" />

      {/* Global Navigation Bar */}
      <Navbar
        cart={cart}
        onOpenCart={() => setCartOpen(true)}
        activeSection={activeSection}
        onNavigate={handleNavigate}
        currentUser={currentUser}
        onOpenAuth={() => setAuthModalOpen(true)}
        onLogout={handleLogout}
        onOpenConsultant={() => setConsultantOpen(true)}
        onOpenTryOn={() => {
          setTryOnProduct(null);
          setTryOnOpen(true);
        }}
      />

      {/* Primary Content Window */}
      <main className="flex-1">
        {currentUser?.role === 'Admin' ? (
          <div className="max-w-7xl mx-auto px-6 py-8">
            <AdminPortal
              products={products}
              orders={orders}
              consultations={consultations}
              onUpdateProduct={handleUpdateProduct}
              onAddProduct={handleAddProduct}
              onDeleteProduct={handleDeleteProduct}
              onUpdateOrderStatus={handleUpdateOrderStatus}
              onUpdateConsultationStatus={handleUpdateConsultationStatus}
            />
          </div>
        ) : activeSection === 'my-orders' && currentUser ? (
          <div className="max-w-7xl mx-auto px-6">
            <MyOrders
              currentUser={currentUser}
              onNavigateHome={() => handleNavigate('home')}
            />
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Home / Hero Stage */}
            <div id="home">
              <HeroSection
                onExploreClick={() => handleNavigate('collections')}
                onShopClick={() => handleNavigate('collections')}
                onDiscoverClick={() => handleNavigate('about')}
              />
            </div>

            {/* Premium Live Index and AI Assistant summon section */}
            <div className="max-w-7xl mx-auto px-6 w-full grid grid-cols-1 md:grid-cols-3 gap-6 pb-12 pt-6 border-b border-[#1d2f30]/60">
              
              {/* Column 1: Live Gold index widget */}
              <div className="md:col-span-1">
                <LiveGoldRateWidget />
              </div>

              {/* Column 2: AI Concierge Suite Callout */}
              <div className="relative overflow-hidden rounded-md border border-[#1d2f30] bg-[#111e1f] p-5 shadow-gold-glow flex flex-col justify-between text-left">
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gold-gradient" />
                <div className="space-y-2">
                  <div className="flex items-center space-x-1.5">
                    <Sparkles className="h-4 w-4 text-[#c5a059]" />
                    <span className="font-display text-[9px] uppercase tracking-[0.2em] text-[#c5a059] font-bold">Atelier AI Concierge</span>
                  </div>
                  <h4 className="font-luxury-title text-sm text-white font-medium">Private Curation Suite</h4>
                  <p className="text-[10px] text-neutral-400 font-sans leading-relaxed">
                    Summon our bespoke GIA-trained artificial advisor to align pure gold custom masterpieces tailored to your wedding trousseau or sovereign gala events.
                  </p>
                </div>
                <button 
                  onClick={() => setConsultantOpen(true)}
                  className="mt-4 rounded bg-gold-gradient text-black py-2.5 text-[10px] font-display font-bold tracking-widest uppercase hover:opacity-95 shadow-gold-glow cursor-pointer text-center w-full"
                >
                  Summon Advisor
                </button>
              </div>

              {/* Column 3: Live Try-On callout */}
              <div className="relative overflow-hidden rounded-md border border-[#1d2f30] bg-[#111e1f] p-5 shadow-gold-glow flex flex-col justify-between text-left">
                <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gold-gradient" />
                <div className="space-y-2">
                  <div className="flex items-center space-x-1.5">
                    <Eye className="h-4 w-4 text-[#c5a059]" />
                    <span className="font-display text-[9px] uppercase tracking-[0.2em] text-[#c5a059] font-bold">Camera AR Try-On</span>
                  </div>
                  <h4 className="font-luxury-title text-sm text-white font-medium">Virtual Fitting Studio</h4>
                  <p className="text-[10px] text-neutral-400 font-sans leading-relaxed">
                    Activate your device camera to virtually calibrate bespoke solitaire bands, bridal emerald necklaces, filigree jhumkas and luxury bracelets instantly.
                  </p>
                </div>
                <button 
                  onClick={() => {
                    setTryOnProduct(null);
                    setTryOnOpen(true);
                  }}
                  className="mt-4 rounded border border-[#c5a059]/40 bg-[#c5a059]/5 text-[#c5a059] py-2.5 text-[10px] font-display font-bold tracking-widest uppercase hover:bg-[#c5a059]/15 cursor-pointer text-center w-full"
                >
                  Open Fitting Studio
                </button>
              </div>

            </div>

            {/* Collections & Masterpiece Catalog */}
            <CollectionsShowcase
              products={products}
              onAddToCart={handleAddToCart}
              onTryOn={(p) => {
                setTryOnProduct(p);
                setTryOnOpen(true);
              }}
              currentUser={currentUser}
              onUpdateProduct={handleUpdateProduct}
            />

            {/* Legacy About Story & Values */}
            <AboutSection />

            {/* Verified Client Testimonials */}
            <Testimonials />

            {/* Private Virtual Suite Showroom Booking */}
            <ConsultationForm
              onBookConsultation={handleBookConsultation}
            />

            {/* Co-Design / Custom Commissions Heirloom Suite */}
            <section id="custom-commission" className="relative bg-transparent py-20 border-t border-[#1d2f30] overflow-hidden">
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[35rem] h-[35rem] bg-amber-500/5 rounded-full filter blur-[150px] pointer-events-none" />
              <div className="max-w-7xl mx-auto px-6">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                  
                  <div className="lg:col-span-5 space-y-6 lg:sticky lg:top-28 text-left">
                    <div className="flex items-center space-x-2">
                      <div className="h-[1px] w-8 bg-[#c5a059]" />
                      <span className="font-display text-xs tracking-[0.25em] text-[#c5a059] uppercase font-semibold">
                        ATELIER COMMISSIONS
                      </span>
                    </div>

                    <h2 className="font-luxury-title text-3xl md:text-5xl font-medium leading-tight text-white">
                      Co-Create Your <br />
                      <span className="italic font-normal text-gold-gradient">Unique Heirloom</span>
                    </h2>

                    <p className="font-sans text-xs md:text-sm text-neutral-400 leading-relaxed">
                      Formulate your conceptual outline directly with our Head Artisans. Detail metal weights, gemstone purities, hallmarking preferences, and reference designs. Receive transparent appraisal quotes and track your piece from review to production and secure handover.
                    </p>

                    <div className="pt-6 space-y-4">
                      <div className="flex items-start space-x-3.5">
                        <div className="h-9 w-9 rounded border border-[#1d2f30] bg-[#111e1f] flex items-center justify-center shrink-0">
                          <Sparkle className="h-4.5 w-4.5 text-[#c5a059] animate-pulse" />
                        </div>
                        <div>
                          <h4 className="font-serif text-sm text-neutral-200">GIA Certified Sourcing</h4>
                          <p className="text-xs text-neutral-500">Every commission diamond is verified by direct lab appraisers.</p>
                        </div>
                      </div>

                      <div className="flex items-start space-x-3.5">
                        <div className="h-9 w-9 rounded border border-[#1d2f30] bg-[#111e1f] flex items-center justify-center shrink-0">
                          <Sliders className="h-4.5 w-4.5 text-[#c5a059]" />
                        </div>
                        <div>
                          <h4 className="font-serif text-sm text-neutral-200">Calibration Tracking</h4>
                          <p className="text-xs text-neutral-500">Follow the status from raw cast to laser hallmarking in real-time.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="lg:col-span-7">
                    <CustomJewelleryForm />
                  </div>

                </div>
              </div>
            </section>

          </div>
        )}
      </main>

      {/* Global Brand Footer */}
      {currentUser?.role !== 'Admin' && <Footer onNavigate={handleNavigate} />}

      {/* E-Commerce Checkout / Bag Side Sheet */}
      <CartDrawer
        isOpen={cartOpen}
        onClose={() => setCartOpen(false)}
        cart={cart}
        onUpdateQuantity={handleUpdateCartQuantity}
        onRemoveItem={handleRemoveFromCart}
        onCheckout={handleCheckoutSubmit}
      />

      {/* Global Interactive Patron Suite Overlays */}
      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLoginSuccess={handleLoginSuccess}
      />

      <VirtualTryOn
        isOpen={tryOnOpen}
        onClose={() => {
          setTryOnOpen(false);
          setTryOnProduct(null);
        }}
        preselectedProduct={tryOnProduct}
        products={products}
      />

      <AIJewelleryConsultant
        isOpen={consultantOpen}
        onClose={() => setConsultantOpen(false)}
        products={products}
        onInspectProduct={(p) => {
          // Add to cart with default options from AI recommendations
          handleAddToCart(p, 1, p.metalOptions[0] || '18K Yellow Gold', 'Standard');
        }}
      />
      
    </div>
  );
}
