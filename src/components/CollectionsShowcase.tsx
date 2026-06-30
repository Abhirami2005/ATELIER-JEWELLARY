import { useState, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { JewelryItem, CartItem } from '../types';
import { ShieldCheck, Truck, Scale, HelpCircle, FileCheck, ShoppingCart, Check, X, Award, Eye, Upload, Image as ImageIcon, Sparkles, PenTool, Crown, DollarSign } from 'lucide-react';

interface CollectionsShowcaseProps {
  products: JewelryItem[];
  onAddToCart: (item: JewelryItem, quantity: number, metal: string, size: string) => void;
  onTryOn: (product: JewelryItem) => void;
  currentUser?: { name: string; email: string; role: 'Customer' | 'Admin' } | null;
  onUpdateProduct?: (product: JewelryItem) => void;
}

const COLLECTIONS = [
  'All Masterpieces',
  'Diamond Collection',
  'Gold Jewellery',
  'Bridal Collection',
  'Wedding Essentials',
  'Daily Elegance',
  'Premium Exclusive Collection',
  'New Arrivals',
  'Best Sellers'
];

const RING_SIZES = ['5', '6', '7', '8', '9', '10', '11'];
const CHAIN_LENGTHS = ['16"', '18"', '20"', '22"'];
const DEFAULT_SIZES = ['Standard', 'Custom Fit'];

export default function CollectionsShowcase({
  products,
  onAddToCart,
  onTryOn,
  currentUser,
  onUpdateProduct,
}: CollectionsShowcaseProps) {
  const [selectedCollection, setSelectedCollection] = useState('All Masterpieces');
  const [activeProduct, setActiveProduct] = useState<JewelryItem | null>(null);
  
  // Customization state for active product
  const [selectedMetal, setSelectedMetal] = useState('');
  const [selectedSize, setSelectedSize] = useState('Standard');
  const [quantity, setQuantity] = useState(1);
  const [addedAnimation, setAddedAnimation] = useState(false);

  // Tabbed view inside the inspect modal
  const [modalTab, setModalTab] = useState<'details' | 'cocreate' | 'adminEdit'>('details');

  // Co-creation form states
  const [customImage, setCustomImage] = useState('');
  const [customDescription, setCustomDescription] = useState('');
  const [customPrice, setCustomPrice] = useState('');
  const [customUniqueness, setCustomUniqueness] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [coCreateSuccess, setCoCreateSuccess] = useState(false);

  // Admin edit form states
  const [editName, setEditName] = useState('');
  const [editSubtitle, setEditSubtitle] = useState('');
  const [editDescription, setEditDescription] = useState('');
  const [editPrice, setEditPrice] = useState('');
  const [editImage, setEditImage] = useState('');
  const [editUniqueness, setEditUniqueness] = useState('');
  const [isAdminUploading, setIsAdminUploading] = useState(false);
  const [adminEditSuccess, setAdminEditSuccess] = useState(false);

  // Filtered products list
  const filteredProducts = selectedCollection === 'All Masterpieces'
    ? products
    : products.filter(p => p.collection === selectedCollection);

  // Open modal & reset states
  const handleOpenProduct = (product: JewelryItem) => {
    setActiveProduct(product);
    setSelectedMetal(product.metalOptions[0] || '18K Yellow Gold');
    
    // Determine size list type
    if (product.sku.includes('RG') || product.name.toLowerCase().includes('ring')) {
      setSelectedSize('7');
    } else if (product.name.toLowerCase().includes('chain') || product.name.toLowerCase().includes('pendant')) {
      setSelectedSize('18"');
    } else {
      setSelectedSize('Standard');
    }
    
    setQuantity(1);
    setAddedAnimation(false);
    setModalTab('details');

    // Reset co-creation fields to match this specific item
    setCustomImage(product.image);
    setCustomDescription(product.description);
    setCustomPrice(product.price.toString());
    setCustomUniqueness('Graded and laser-engraved with ancestral signatures');
    setCoCreateSuccess(false);

    // Reset admin edit fields
    setEditName(product.name);
    setEditSubtitle(product.subtitle);
    setEditDescription(product.description);
    setEditPrice(product.price.toString());
    setEditImage(product.image);
    setEditUniqueness(product.materials || '');
    setAdminEditSuccess(false);
  };

  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>, isAdmin: boolean) => {
    const file = e.target.files?.[0];
    if (file) {
      if (isAdmin) {
        setIsAdminUploading(true);
      } else {
        setIsUploading(true);
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        if (isAdmin) {
          setEditImage(reader.result as string);
          setIsAdminUploading(false);
        } else {
          setCustomImage(reader.result as string);
          setIsUploading(false);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  const handleCoCreateSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!activeProduct) return;

    // Create a custom request
    const newRequest = {
      id: `REQ-${Math.floor(1000 + Math.random() * 9000)}`,
      name: currentUser?.name || 'Private Patron',
      email: currentUser?.email || 'patron@atelier.com',
      phone: '+91 Private Consultation',
      jewelType: activeProduct.name,
      budget: Number(customPrice),
      description: `${customDescription} | Uniqueness: ${customUniqueness}`,
      referenceImage: customImage || activeProduct.image,
      status: 'Pending',
      date: new Date().toISOString().split('T')[0],
    };

    // Store custom requests in LocalStorage
    const stored = localStorage.getItem('atelier_custom_requests');
    const list = stored ? JSON.parse(stored) : [];
    list.unshift(newRequest);
    localStorage.setItem('atelier_custom_requests', JSON.stringify(list));

    setCoCreateSuccess(true);
    setTimeout(() => {
      setCoCreateSuccess(false);
      setActiveProduct(null); // Close modal on success
    }, 3000);
  };

  const handleAdminEditSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!activeProduct || !onUpdateProduct) return;

    const updatedProduct: JewelryItem = {
      ...activeProduct,
      name: editName,
      subtitle: editSubtitle,
      description: editDescription,
      price: Number(editPrice),
      image: editImage,
      materials: editUniqueness,
    };

    onUpdateProduct(updatedProduct);
    setAdminEditSuccess(true);
    setTimeout(() => {
      setAdminEditSuccess(false);
      setActiveProduct(null); // Close modal on success
    }, 2000);
  };

  const handleCartAdd = () => {
    if (!activeProduct) return;
    onAddToCart(activeProduct, quantity, selectedMetal, selectedSize);
    setAddedAnimation(true);
    setTimeout(() => {
      setAddedAnimation(false);
      setActiveProduct(null); // Auto close or keep open
    }, 1200);
  };

  return (
    <section id="collections" className="relative bg-transparent py-24">
      <div className="mx-auto max-w-7xl px-6">
        
        {/* Title & Introduction */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <p className="font-display text-xs tracking-[0.25em] text-[#c5a059] uppercase mb-3">
            CURATED ANTHOLOGY
          </p>
          <h2 className="font-luxury-title text-3xl md:text-5xl font-medium leading-tight mb-4">
            The Atelier Collections
          </h2>
          <p className="font-sans text-xs md:text-sm text-neutral-400 leading-relaxed">
            Every collection tells a unique story of Indian inheritance blending seamlessly with continental contemporary design guidelines.
          </p>
        </div>

        {/* Collection Filter Tabs */}
        <div className="flex flex-wrap justify-center gap-2 md:gap-4 mb-16 border-b border-[#1d2f30] pb-8">
          {COLLECTIONS.map((col) => (
            <button
              key={col}
              onClick={() => setSelectedCollection(col)}
              className={`relative px-4 py-2 text-xs font-display tracking-widest uppercase transition-luxury rounded-md cursor-pointer ${
                selectedCollection === col
                  ? 'text-black bg-gold-gradient font-bold shadow-gold-glow'
                  : 'text-neutral-400 border border-[#1d2f30] hover:border-[#c5a059] bg-[#111e1f] hover:text-white'
              }`}
            >
              {col}
            </button>
          ))}
        </div>

        {/* Catalog Grid */}
        <AnimatePresence mode="popLayout">
          <motion.div
            layout
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
          >
            {filteredProducts.map((prod, index) => (
              <motion.div
                key={prod.id}
                layout
                initial={{ opacity: 0, y: 35 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ 
                  duration: 0.65, 
                  delay: (index % 4) * 0.08, 
                  ease: [0.16, 1, 0.3, 1] 
                }}
                className="group relative flex flex-col justify-between overflow-hidden rounded-md border border-[#1d2f30] bg-[#111e1f] p-4 transition-all duration-300 hover:border-[#c5a059]/50 shadow-gold-glow hover:-translate-y-1"
              >
                {/* Photo container */}
                <div className="relative overflow-hidden rounded-md bg-[#0a1617] aspect-square mb-5">
                  <img
                    src={prod.image}
                    alt={prod.name}
                    className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
                    referrerPolicy="no-referrer"
                  />
                  {/* Luxury Tag overlay */}
                  <div className="absolute top-3 left-3 bg-[#0a1617]/80 backdrop-blur-sm border border-[#1d2f30] px-2.5 py-1 rounded text-[9px] font-display uppercase tracking-widest text-neutral-300">
                    {prod.collection}
                  </div>
                  
                  {prod.certified && (
                    <div className="absolute top-3 right-3 flex h-5 w-5 items-center justify-center rounded-full bg-[#c5a059]/90 text-black shadow-lg" title="GIA / BIS Certified">
                      <Award className="h-3 w-3" />
                    </div>
                  )}
                  
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0a1617]/95 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end justify-center pb-6">
                    <button
                      onClick={() => handleOpenProduct(prod)}
                      className="rounded bg-gold-gradient px-5 py-2.5 text-[10px] font-display font-bold uppercase tracking-widest text-black transition-transform duration-300 transform translate-y-4 group-hover:translate-y-0 shadow-gold-heavy cursor-pointer"
                    >
                      Inspect Masterpiece
                    </button>
                  </div>
                </div>

                {/* Details text */}
                <div className="space-y-1 text-left flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="font-luxury-title text-base text-white group-hover:text-[#c5a059] transition-colors">
                      {prod.name}
                    </h3>
                    <p className="font-sans text-[11px] text-neutral-400 italic">
                      {prod.subtitle}
                    </p>
                  </div>
                  
                  <div className="pt-4 flex items-center justify-between border-t border-[#1d2f30]/60 mt-3">
                    <span className="font-serif text-base font-medium text-white">
                      ${prod.price.toLocaleString()}
                    </span>
                    <span className="font-display text-[9px] text-neutral-500 tracking-wider">
                      SKU: {prod.sku}
                    </span>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        </AnimatePresence>

        {/* Empty catalog warning */}
        {filteredProducts.length === 0 && (
          <div className="text-center py-16 rounded border border-dashed border-[#1d2f30] bg-[#111e1f]/30">
            <p className="text-neutral-500 font-serif">No products currently available under this collection tab.</p>
          </div>
        )}

      </div>

      {/* Product Details overlay modal */}
      <AnimatePresence>
        {activeProduct && (
          <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-8">
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setActiveProduct(null)}
              className="fixed inset-0 bg-black/90 backdrop-blur-md"
            />

            {/* Modal Body */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-5xl rounded-lg border border-[#1d2f30] bg-[#0a1617] p-6 md:p-10 z-10 shadow-gold-heavy overflow-hidden"
            >
              {/* Gold glowing framing borders */}
              <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gold-gradient" />
              
              <button
                onClick={() => setActiveProduct(null)}
                className="absolute top-4 right-4 text-neutral-400 hover:text-white border border-[#1d2f30] hover:border-[#c5a059] rounded-full h-8 w-8 flex items-center justify-center bg-[#111e1f] z-20 cursor-pointer"
              >
                <X className="h-4 w-4" />
              </button>

              {/* Tab Navigation inside Modal */}
              <div className="flex border-b border-[#1d2f30]/60 pb-3 mb-8 gap-6 md:gap-8 overflow-x-auto text-left">
                <button
                  onClick={() => setModalTab('details')}
                  className={`pb-1 text-xs md:text-sm font-display tracking-widest uppercase relative cursor-pointer shrink-0 transition-all ${
                    modalTab === 'details' ? 'text-[#c5a059] font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Atelier Masterpiece
                  {modalTab === 'details' && (
                    <motion.div layoutId="modalTabLine" className="absolute -bottom-[13px] left-0 h-[2px] w-full bg-[#c5a059]" />
                  )}
                </button>
                <button
                  onClick={() => {
                    setModalTab('cocreate');
                    setCustomDescription(customDescription || activeProduct.description);
                    setCustomPrice(customPrice || activeProduct.price.toString());
                    setCustomImage(customImage || activeProduct.image);
                  }}
                  className={`pb-1 text-xs md:text-sm font-display tracking-widest uppercase relative cursor-pointer shrink-0 transition-all ${
                    modalTab === 'cocreate' ? 'text-[#c5a059] font-bold' : 'text-neutral-400 hover:text-white'
                  }`}
                >
                  Co-Create Heirloom Variation
                  {modalTab === 'cocreate' && (
                    <motion.div layoutId="modalTabLine" className="absolute -bottom-[13px] left-0 h-[2px] w-full bg-[#c5a059]" />
                  )}
                </button>
                {currentUser?.role === 'Admin' && (
                  <button
                    onClick={() => {
                      setModalTab('adminEdit');
                      setEditName(activeProduct.name);
                      setEditSubtitle(activeProduct.subtitle);
                      setEditDescription(activeProduct.description);
                      setEditPrice(activeProduct.price.toString());
                      setEditImage(activeProduct.image);
                      setEditUniqueness(activeProduct.materials || '');
                    }}
                    className={`pb-1 text-xs md:text-sm font-display tracking-widest uppercase relative cursor-pointer shrink-0 transition-all ${
                      modalTab === 'adminEdit' ? 'text-[#c5a059] font-bold' : 'text-neutral-400 hover:text-white'
                    }`}
                  >
                    Edit Masterpiece (Admin)
                    {modalTab === 'adminEdit' && (
                      <motion.div layoutId="modalTabLine" className="absolute -bottom-[13px] left-0 h-[2px] w-full bg-[#c5a059]" />
                    )}
                  </button>
                )}
              </div>

              {/* TAB 1: ORIGINAL DETAILS */}
              {modalTab === 'details' && (
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                  {/* Product Media Column */}
                  <div className="lg:col-span-5 space-y-6">
                    <div className="relative overflow-hidden rounded border border-[#1d2f30] bg-[#111e1f] aspect-square shadow-inner-gold">
                      <img
                        src={activeProduct.image}
                        alt={activeProduct.name}
                        className="h-full w-full object-cover brightness-95"
                        referrerPolicy="no-referrer"
                      />
                    </div>
                    
                    {/* Insurance Trust Seals */}
                    <div className="p-4 rounded border border-[#1d2f30] bg-[#111e1f]/50 space-y-3">
                      <div className="flex items-start space-x-2.5">
                        <Truck className="h-4 w-4 text-[#c5a059] mt-0.5" />
                        <div>
                          <p className="text-[11px] font-bold text-neutral-300 font-display tracking-wider">SECURE INSURED SHIPPING</p>
                          <p className="text-[10px] text-neutral-500">Premium tamper-proof packaging, fully insured transit across India with signature on delivery.</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Product Configurations Column */}
                  <div className="lg:col-span-7 flex flex-col justify-between text-left space-y-6">
                    
                    <div className="space-y-4">
                      {/* Badge line */}
                      <div className="flex items-center space-x-3">
                        <span className="text-[9px] font-display uppercase tracking-widest text-[#c5a059] px-2.5 py-0.5 rounded border border-[#c5a059]/30 bg-[#c5a059]/5">
                          {activeProduct.collection}
                        </span>
                        <span className="text-[10px] text-neutral-500 font-mono">SKU: {activeProduct.sku}</span>
                      </div>

                      <h1 className="font-luxury-title text-2xl md:text-3xl text-white font-medium">
                        {activeProduct.name}
                      </h1>

                      <p className="font-sans text-xs text-neutral-400 leading-relaxed">
                        {activeProduct.description}
                      </p>

                      <div className="border-t border-b border-[#1d2f30] py-4 flex items-center justify-between">
                        <div>
                          <p className="text-[9px] font-display tracking-widest text-neutral-500 uppercase">HERITAGE VALUATION</p>
                          <p className="font-serif text-2xl font-semibold text-[#c5a059]">
                            ${activeProduct.price.toLocaleString()}
                          </p>
                        </div>
                        
                        {activeProduct.caratWeight && (
                          <div className="text-right">
                            <p className="text-[9px] font-display tracking-widest text-neutral-500 uppercase">DIAMOND CARAT</p>
                            <p className="font-serif text-lg text-neutral-200">
                              {activeProduct.caratWeight} ct WT
                            </p>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Interactive Options */}
                    <div className="space-y-5">
                      {/* Metal Configuration */}
                      <div>
                        <p className="text-[10px] font-display tracking-widest text-neutral-400 uppercase mb-2.5">
                          SELECT METALLURGY
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {activeProduct.metalOptions.map((metal) => (
                            <button
                              key={metal}
                              onClick={() => setSelectedMetal(metal)}
                              className={`px-3 py-1.5 text-xs font-sans rounded border cursor-pointer ${
                                selectedMetal === metal
                                  ? 'border-[#c5a059] text-[#c5a059] bg-[#c5a059]/5 font-semibold'
                                  : 'border-[#1d2f30] bg-[#111e1f] text-neutral-400 hover:border-[#c5a059]/45'
                              }`}
                            >
                              {metal}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Sizing Configuration */}
                      <div>
                        <p className="text-[10px] font-display tracking-widest text-neutral-400 uppercase mb-2.5">
                          {activeProduct.sku.includes('RG') ? 'RING SIZING (US)' : activeProduct.name.toLowerCase().includes('chain') ? 'CHAIN LENGTH' : 'DIMENSIONS'}
                        </p>
                        <div className="flex flex-wrap gap-2">
                          {(activeProduct.sku.includes('RG')
                            ? RING_SIZES
                            : activeProduct.name.toLowerCase().includes('chain')
                            ? CHAIN_LENGTHS
                            : DEFAULT_SIZES
                          ).map((size) => (
                            <button
                              key={size}
                              onClick={() => setSelectedSize(size)}
                              className={`px-3 py-1 text-xs rounded border font-sans cursor-pointer ${
                                selectedSize === size
                                  ? 'border-[#c5a059] text-[#c5a059] bg-[#c5a059]/5 font-semibold'
                                  : 'border-[#1d2f30] bg-[#111e1f] text-neutral-400 hover:border-[#c5a059]/45'
                              }`}
                            >
                              {size}
                            </button>
                          ))}
                        </div>
                      </div>

                      {/* Quantity Selector & Stock Indicator */}
                      <div className="flex items-center space-x-6">
                        <div>
                          <p className="text-[10px] font-display tracking-widest text-neutral-400 uppercase mb-2">
                            QUANTITY
                          </p>
                          <div className="flex items-center border border-[#1d2f30] rounded bg-[#111e1f] overflow-hidden w-24">
                            <button
                              disabled={quantity <= 1}
                              onClick={() => setQuantity(q => q - 1)}
                              className="flex-1 py-1 text-center text-xs text-neutral-400 hover:text-white hover:bg-[#0a1617] disabled:opacity-30 disabled:hover:bg-transparent"
                            >
                              -
                            </button>
                            <span className="font-mono text-xs text-center flex-1">{quantity}</span>
                            <button
                              disabled={quantity >= activeProduct.stock}
                              onClick={() => setQuantity(q => q + 1)}
                              className="flex-1 py-1 text-center text-xs text-neutral-400 hover:text-white hover:bg-[#0a1617] disabled:opacity-30"
                            >
                              +
                            </button>
                          </div>
                        </div>

                        <div className="pt-4">
                          <span className="inline-flex items-center space-x-1.5 text-[10px] font-mono text-emerald-400">
                            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                            <span>In Stock ({activeProduct.stock} Available)</span>
                          </span>
                          <p className="text-[9px] text-neutral-500 mt-0.5">Secure item reservation enabled.</p>
                        </div>
                      </div>
                    </div>

                    {/* Certification Report Summary Box */}
                    {activeProduct.certified && (
                      <div className="p-3.5 rounded border border-[#1d2f30] bg-[#111e1f]/80 space-y-1.5">
                        <div className="flex items-center space-x-1.5 text-[10px] font-display font-semibold text-[#c5a059]">
                          <FileCheck className="h-3.5 w-3.5" />
                          <span>GRADED AND CERTIFIED</span>
                        </div>
                        <p className="text-[10px] text-neutral-400 font-sans leading-relaxed">
                          Accompanying grading ID <span className="font-mono text-neutral-200">{activeProduct.certId}</span>. Guaranteed parameters: {activeProduct.materials}.
                        </p>
                      </div>
                    )}

                    {/* Add To Cart Master Action Button */}
                    <div className="pt-4 space-y-3">
                      <button
                        disabled={addedAnimation}
                        onClick={handleCartAdd}
                        className="w-full relative overflow-hidden rounded bg-gold-gradient py-4 text-xs font-display font-bold uppercase tracking-[0.2em] text-black hover:opacity-95 shadow-gold-heavy flex items-center justify-center space-x-2 transition-all duration-300 disabled:bg-[#c5a059] disabled:opacity-100 cursor-pointer"
                      >
                        <AnimatePresence mode="wait">
                          {addedAnimation ? (
                            <motion.span
                              key="added"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              className="flex items-center space-x-1.5"
                            >
                              <Check className="h-4 w-4 stroke-[3px]" />
                              <span>ADDED TO ATELIER BAG</span>
                            </motion.span>
                          ) : (
                            <motion.span
                              key="cart"
                              initial={{ scale: 0.8, opacity: 0 }}
                              animate={{ scale: 1, opacity: 1 }}
                              exit={{ scale: 0.8, opacity: 0 }}
                              className="flex items-center space-x-2"
                            >
                              <ShoppingCart className="h-4 w-4" />
                              <span>ACQUIRE PIECE</span>
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>

                      <button
                        onClick={() => {
                          onTryOn(activeProduct);
                          setActiveProduct(null);
                        }}
                        className="w-full flex items-center justify-center space-x-2 rounded border border-[#c5a059]/40 bg-[#c5a059]/5 text-[#c5a059] hover:bg-[#c5a059]/15 py-3 text-xs font-display font-bold uppercase tracking-[0.2em] transition-all duration-300 cursor-pointer"
                      >
                        <Eye className="h-4 w-4" />
                        <span>ACTIVATE CAMERA TRY-ON</span>
                      </button>
                    </div>

                  </div>
                </div>
              )}

              {/* TAB 2: CO-CREATE HEIRLOOM VARIATION */}
              {modalTab === 'cocreate' && (
                <div className="text-left">
                  {coCreateSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-16 text-center space-y-4"
                    >
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-[#c5a059]/10 border border-[#c5a059]/50 text-[#c5a059] mb-2">
                        <Check className="h-8 w-8 animate-bounce" />
                      </div>
                      <h3 className="font-luxury-title text-2xl text-white font-medium">Bespoke Proposal Received</h3>
                      <p className="font-sans text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                        We have registered your co-creation instructions for <strong>{activeProduct.name}</strong>. Our Head Designer will prepare a high-resolution render, calculate weight metrics, and contact you in 24 hours.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleCoCreateSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      {/* Left side: Upload & Preview */}
                      <div className="lg:col-span-5 space-y-6">
                        <p className="text-[10px] font-display tracking-widest text-neutral-400 uppercase font-semibold">
                          CO-CREATION REFERENCE IMAGE
                        </p>
                        
                        <div className="relative overflow-hidden rounded border border-[#1d2f30] bg-[#111e1f] aspect-square shadow-inner-gold flex items-center justify-center">
                          {isUploading ? (
                            <div className="space-y-2 text-center">
                              <span className="h-2 w-2 rounded-full bg-[#c5a059] inline-block animate-ping mr-1" />
                              <p className="text-xs text-neutral-500 font-mono">Converting Image...</p>
                            </div>
                          ) : (
                            <img
                              src={customImage || activeProduct.image}
                              alt="Co-creation reference"
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          )}
                        </div>

                        {/* File Picker or URL Paste */}
                        <div className="space-y-4">
                          <label className="flex flex-col items-center justify-center border border-dashed border-[#1d2f30] hover:border-[#c5a059]/50 bg-[#111e1f]/30 rounded-lg p-5 cursor-pointer hover:bg-[#111e1f]/50 transition-all text-center">
                            <Upload className="h-5 w-5 text-[#c5a059] mb-2" />
                            <span className="text-[10px] font-display text-neutral-300 uppercase tracking-wider font-semibold">Upload Jewellery Picture</span>
                            <span className="text-[9px] text-neutral-500 mt-1">JPEG, PNG, WEBP (Supports device camera snapshots)</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, false)}
                              className="hidden"
                            />
                          </label>

                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <ImageIcon className="h-3.5 w-3.5 text-neutral-500" />
                            </div>
                            <input
                              type="url"
                              placeholder="Or paste direct image URL..."
                              value={customImage}
                              onChange={(e) => setCustomImage(e.target.value)}
                              className="w-full bg-[#111e1f] rounded border border-[#1d2f30] py-2.5 pl-9 pr-4 text-[11px] text-neutral-200 focus:border-[#c5a059] focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right side: Inputs */}
                      <div className="lg:col-span-7 space-y-6">
                        <div className="space-y-2 border-b border-[#1d2f30]/40 pb-4">
                          <div className="flex items-center space-x-2 text-[#c5a059]">
                            <Sparkles className="h-4 w-4 animate-pulse" />
                            <span className="text-[10px] font-display uppercase tracking-widest font-bold">Personalize this masterpiece</span>
                          </div>
                          <h2 className="font-luxury-title text-xl text-white">Bespoke Co-Creation</h2>
                        </div>

                        <div className="space-y-4">
                          {/* Budget */}
                          <div className="space-y-1.5">
                            <label className="block text-[9px] font-display tracking-widest text-neutral-400 uppercase font-semibold">
                              Target Price / Budget Range ($)
                            </label>
                            <div className="relative">
                              <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#c5a059]" />
                              <input
                                required
                                type="number"
                                min="100"
                                value={customPrice}
                                onChange={(e) => setCustomPrice(e.target.value)}
                                className="w-full bg-[#111e1f] rounded border border-[#1d2f30] py-3 pl-8 pr-4 text-xs text-neutral-200 focus:border-[#c5a059] focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Uniqueness */}
                          <div className="space-y-1.5">
                            <label className="block text-[9px] font-display tracking-widest text-neutral-400 uppercase font-semibold">
                              Design Uniqueness Factor (What makes it special?)
                            </label>
                            <div className="relative">
                              <Crown className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-amber-500" />
                              <input
                                required
                                type="text"
                                placeholder="e.g. Inlay grandfather's ruby, personalized rose gold trim, or custom anniversary engraving"
                                value={customUniqueness}
                                onChange={(e) => setCustomUniqueness(e.target.value)}
                                className="w-full bg-[#111e1f] rounded border border-[#1d2f30] py-3 pl-8 pr-4 text-xs text-neutral-200 focus:border-[#c5a059] focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Description */}
                          <div className="space-y-1.5">
                            <label className="block text-[9px] font-display tracking-widest text-neutral-400 uppercase font-semibold">
                              Bespoke Request & Style Modifications Description
                            </label>
                            <textarea
                              required
                              rows={4}
                              placeholder="Detail modifications: specify metals (e.g. 18K Yellow vs Rose Gold), side stones settings, shank engraving style, band width, or ring resizing intents..."
                              value={customDescription}
                              onChange={(e) => setCustomDescription(e.target.value)}
                              className="w-full bg-[#111e1f] rounded border border-[#1d2f30] p-3 text-xs text-neutral-200 focus:border-[#c5a059] focus:outline-none"
                            />
                          </div>
                        </div>

                        <button
                          type="submit"
                          className="w-full rounded bg-gold-gradient py-4 text-xs font-display font-bold uppercase tracking-[0.2em] text-black hover:opacity-95 shadow-gold-glow transition-all duration-300 cursor-pointer"
                        >
                          SUBMIT BESPOKE HEIRLOOM DESIGN
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}

              {/* TAB 3: ADMIN EDIT ORIGINAL */}
              {modalTab === 'adminEdit' && (
                <div className="text-left">
                  {adminEditSuccess ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-16 text-center space-y-4"
                    >
                      <div className="inline-flex h-16 w-16 items-center justify-center rounded-full bg-emerald-500/10 border border-emerald-500/50 text-emerald-400 mb-2">
                        <Check className="h-8 w-8" />
                      </div>
                      <h3 className="font-luxury-title text-2xl text-white font-medium">Masterpiece Catalog Synchronized</h3>
                      <p className="font-sans text-xs text-neutral-400 max-w-md mx-auto leading-relaxed">
                        The updates to <strong>{editName}</strong> have been successfully registered in the Atelier's collections vault.
                      </p>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleAdminEditSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-10">
                      {/* Left Column: Image Editor */}
                      <div className="lg:col-span-5 space-y-6">
                        <p className="text-[10px] font-display tracking-widest text-neutral-400 uppercase font-semibold">
                          MASTERPIECE CATALOG PICTURE
                        </p>

                        <div className="relative overflow-hidden rounded border border-[#1d2f30] bg-[#0a1617] aspect-square shadow-inner-gold flex items-center justify-center">
                          {isAdminUploading ? (
                            <div className="space-y-2 text-center">
                              <span className="h-2 w-2 rounded-full bg-[#c5a059] inline-block animate-ping mr-1" />
                              <p className="text-xs text-neutral-500 font-mono">Converting Image...</p>
                            </div>
                          ) : (
                            <img
                              src={editImage || activeProduct.image}
                              alt="Catalog Preview"
                              className="h-full w-full object-cover"
                              referrerPolicy="no-referrer"
                            />
                          )}
                        </div>

                        {/* File upload for admin */}
                        <div className="space-y-4">
                          <label className="flex flex-col items-center justify-center border border-dashed border-[#1d2f30] hover:border-[#c5a059]/50 bg-[#111e1f]/30 rounded-lg p-5 cursor-pointer hover:bg-[#111e1f]/50 transition-all text-center text-xs">
                            <Upload className="h-5 w-5 text-[#c5a059] mb-2" />
                            <span className="text-[10px] font-display text-neutral-300 uppercase tracking-wider font-semibold">Upload New Catalog Image</span>
                            <span className="text-[9px] text-neutral-500 mt-1">Updates the actual catalog image file</span>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={(e) => handleImageUpload(e, true)}
                              className="hidden"
                            />
                          </label>

                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <ImageIcon className="h-3.5 w-3.5 text-neutral-500" />
                            </div>
                            <input
                              type="url"
                              placeholder="Or paste direct image URL..."
                              value={editImage}
                              onChange={(e) => setEditImage(e.target.value)}
                              className="w-full bg-[#111e1f] rounded border border-[#1d2f30] py-2.5 pl-9 pr-4 text-[11px] text-neutral-200 focus:border-[#c5a059] focus:outline-none"
                            />
                          </div>
                        </div>
                      </div>

                      {/* Right Column: Information Editor */}
                      <div className="lg:col-span-7 space-y-5">
                        <div className="space-y-2 border-b border-[#1d2f30]/40 pb-3">
                          <span className="text-[9px] font-mono uppercase tracking-widest text-[#c5a059]">Atelier Vault Database</span>
                          <h2 className="font-luxury-title text-xl text-white">Edit Masterpiece Specifications</h2>
                        </div>

                        <div className="space-y-4">
                          {/* Name */}
                          <div className="space-y-1">
                            <label className="block text-[9px] font-display tracking-widest text-neutral-400 uppercase font-semibold">
                              Masterpiece Name
                            </label>
                            <input
                              required
                              type="text"
                              value={editName}
                              onChange={(e) => setEditName(e.target.value)}
                              className="w-full bg-[#111e1f] rounded border border-[#1d2f30] py-2.5 px-3.5 text-xs text-neutral-200 focus:border-[#c5a059] focus:outline-none"
                            />
                          </div>

                          {/* Subtitle */}
                          <div className="space-y-1">
                            <label className="block text-[9px] font-display tracking-widest text-neutral-400 uppercase font-semibold">
                              Subtitle / Provenance
                            </label>
                            <input
                              required
                              type="text"
                              value={editSubtitle}
                              onChange={(e) => setEditSubtitle(e.target.value)}
                              className="w-full bg-[#111e1f] rounded border border-[#1d2f30] py-2.5 px-3.5 text-xs text-neutral-200 focus:border-[#c5a059] focus:outline-none"
                            />
                          </div>

                          {/* Price */}
                          <div className="space-y-1">
                            <label className="block text-[9px] font-display tracking-widest text-neutral-400 uppercase font-semibold">
                              Retail Price ($)
                            </label>
                            <div className="relative">
                              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-[#c5a059] font-mono">$</span>
                              <input
                                required
                                type="number"
                                value={editPrice}
                                onChange={(e) => setEditPrice(e.target.value)}
                                className="w-full bg-[#111e1f] rounded border border-[#1d2f30] py-2.5 pl-7 pr-3.5 text-xs text-neutral-200 focus:border-[#c5a059] focus:outline-none"
                              />
                            </div>
                          </div>

                          {/* Uniqueness / Materials */}
                          <div className="space-y-1">
                            <label className="block text-[9px] font-display tracking-widest text-neutral-400 uppercase font-semibold">
                              Materials & Uniqueness Details
                            </label>
                            <input
                              required
                              type="text"
                              placeholder="e.g. Platinum, GIA Certified Diamond (D, FL)"
                              value={editUniqueness}
                              onChange={(e) => setEditUniqueness(e.target.value)}
                              className="w-full bg-[#111e1f] rounded border border-[#1d2f30] py-2.5 px-3.5 text-xs text-neutral-200 focus:border-[#c5a059] focus:outline-none"
                            />
                          </div>

                          {/* Description */}
                          <div className="space-y-1">
                            <label className="block text-[9px] font-display tracking-widest text-neutral-400 uppercase font-semibold">
                              Masterpiece Description
                            </label>
                            <textarea
                              required
                              rows={3}
                              value={editDescription}
                              onChange={(e) => setEditDescription(e.target.value)}
                              className="w-full bg-[#111e1f] rounded border border-[#1d2f30] p-3 text-xs text-neutral-200 focus:border-[#c5a059] focus:outline-none"
                            />
                          </div>
                        </div>

                        <div className="flex gap-4 pt-3">
                          <button
                            type="button"
                            onClick={() => setModalTab('details')}
                            className="flex-1 rounded border border-[#1d2f30] text-neutral-400 hover:text-white py-3.5 text-xs font-display tracking-wider uppercase transition-all cursor-pointer"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="flex-1 rounded bg-gold-gradient text-black py-3.5 text-xs font-display font-bold tracking-wider uppercase hover:opacity-95 shadow-gold-glow transition-all cursor-pointer"
                          >
                            Save Masterpiece Changes
                          </button>
                        </div>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </section>
  );
}
