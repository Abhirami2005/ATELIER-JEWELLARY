import { useState, useRef, DragEvent, ChangeEvent, FormEvent } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { JewelryItem } from '../types';
import { 
  X, Upload, Image as ImageIcon, Sparkles, DollarSign, 
  Crown, Star, Scale, Package, Layers, Info, Check
} from 'lucide-react';

interface AddMasterpieceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAddProduct: (product: JewelryItem) => void;
  onShowToast: (message: string) => void;
}

const COLLECTIONS = [
  'Diamond Collection',
  'Gold Jewellery',
  'Bridal Collection',
  'Wedding Essentials',
  'Daily Elegance',
  'Premium Exclusive Collection',
  'New Arrivals',
  'Best Sellers'
];

export default function AddMasterpieceModal({
  isOpen,
  onClose,
  onAddProduct,
  onShowToast
}: AddMasterpieceModalProps) {
  // Form states
  const [name, setName] = useState('');
  const [subtitle, setSubtitle] = useState('');
  const [collection, setCollection] = useState('Diamond Collection');
  const [price, setPrice] = useState('');
  const [description, setDescription] = useState('');
  const [materials, setMaterials] = useState('');
  const [weight, setWeight] = useState('');
  const [stock, setStock] = useState('5');
  const [isFeatured, setIsFeatured] = useState(false);
  
  // Image states
  const [images, setImages] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Validation errors
  const [errors, setErrors] = useState<Record<string, string>>({});

  if (!isOpen) return null;

  // Process files into Base64
  const processFiles = (files: FileList | null) => {
    if (!files) return;
    const fileArray = Array.from(files);
    
    fileArray.forEach(file => {
      if (!file.type.startsWith('image/')) {
        setErrors(prev => ({ ...prev, images: 'Only image files are permitted.' }));
        return;
      }
      
      const reader = new FileReader();
      reader.onload = (e) => {
        if (e.target?.result && typeof e.target.result === 'string') {
          setImages(prev => [...prev, e.target!.result as string]);
          // Clear image error if any
          setErrors(prev => {
            const copy = { ...prev };
            delete copy.images;
            return copy;
          });
        }
      };
      reader.readAsDataURL(file);
    });
  };

  // Drag and drop handlers
  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    setIsDragging(false);
    processFiles(e.dataTransfer.files);
  };

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    processFiles(e.target.files);
  };

  const triggerFilePicker = () => {
    fileInputRef.current?.click();
  };

  const removeImage = (indexToRemove: number) => {
    setImages(prev => prev.filter((_, idx) => idx !== indexToRemove));
  };

  // Submit and validate
  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!name.trim()) newErrors.name = 'Masterpiece Title is required.';
    if (!price || Number(price) <= 0) newErrors.price = 'Valid luxury valuation is required.';
    if (!description.trim()) newErrors.description = 'Storytelling description is required.';
    if (!materials.trim()) newErrors.materials = 'Precious metallurgy details are required.';
    if (!stock || Number(stock) < 0) newErrors.stock = 'Stock must be 0 or more.';
    if (images.length === 0) newErrors.images = 'At least one showcase image is required.';

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      // Find first error and scroll to it or let state show
      return;
    }

    // Generate unique ID, SKU, and GIA Certificate ID
    const generatedId = `new-${Date.now()}`;
    const generatedSku = `ATL-RG-${Math.floor(100 + Math.random() * 899)}`;
    const generatedCert = `GIA-${Math.floor(100000000 + Math.random() * 900000000)}`;

    const newProduct: JewelryItem = {
      id: generatedId,
      name: name.trim(),
      subtitle: subtitle.trim() || 'Exquisite Atelier Masterpiece',
      description: description.trim(),
      price: Number(price),
      rating: 4.9,
      image: images[0], // First image is the primary showcase image
      collection,
      metalOptions: materials.split(',').map(m => m.trim()).filter(Boolean),
      stock: Number(stock),
      certified: true,
      certId: generatedCert,
      sku: generatedSku,
      materials: materials.trim(),
      caratWeight: weight ? Number(weight) : undefined
    };

    // Trigger onAddProduct instantly to inventory and storefront!
    onAddProduct(newProduct);
    
    // Clear forms and close
    onShowToast('Masterpiece added successfully.');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-md overflow-y-auto">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 15 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 15 }}
        className="relative w-full max-w-4xl rounded-lg border border-[#1d2f30] bg-[#0a1617] p-6 md:p-8 shadow-gold-heavy my-8 text-left overflow-hidden"
      >
        {/* Top decorative gold line */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gold-gradient" />

        {/* Close Button */}
        <button
          onClick={onClose}
          type="button"
          className="absolute top-4 right-4 text-neutral-400 hover:text-white border border-[#1d2f30] hover:border-[#c5a059] rounded-full h-8 w-8 flex items-center justify-center bg-[#111e1f] transition-colors cursor-pointer"
        >
          <X className="h-4 w-4" />
        </button>

        {/* Header */}
        <div className="border-b border-[#1d2f30]/60 pb-5 mb-6">
          <div className="flex items-center space-x-2 text-[#c5a059] mb-1.5">
            <Crown className="h-4 w-4 animate-pulse" />
            <span className="text-[10px] font-display uppercase tracking-[0.2em] font-bold">Atelier Vault Registration</span>
          </div>
          <h2 className="font-luxury-title text-2xl md:text-3xl text-white font-medium">Catalog Masterpiece</h2>
          <p className="text-[11px] text-neutral-400 font-sans mt-1">
            Register a newly created heirloom or collection piece into the showroom database in real time.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Left Column: Image Upload & Previews (span 5) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="space-y-2">
              <label className="block text-[10px] font-display tracking-widest text-neutral-400 uppercase font-semibold">
                Showcase Media Gallery
              </label>
              <p className="text-[10px] text-neutral-500 font-sans leading-normal">
                Drag and drop high-resolution photographs. First image will act as the master catalog cover.
              </p>
            </div>

            {/* Large Drag & Drop upload area */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={triggerFilePicker}
              className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 cursor-pointer text-center transition-all duration-300 ${
                isDragging 
                  ? 'border-[#c5a059] bg-[#c5a059]/10 shadow-gold-glow' 
                  : 'border-[#1d2f30] hover:border-[#c5a059]/50 bg-[#111e1f]/30 hover:bg-[#111e1f]/50'
              }`}
            >
              <input
                type="file"
                multiple
                accept="image/*"
                ref={fileInputRef}
                onChange={handleFileChange}
                className="hidden"
              />
              <div className="h-12 w-12 rounded-full bg-[#111e1f] border border-[#1d2f30] flex items-center justify-center text-[#c5a059] mb-4 shadow-inner-gold group-hover:scale-105 transition-transform duration-300">
                <Upload className="h-5 w-5" />
              </div>
              <span className="text-xs font-display text-neutral-300 uppercase tracking-wider font-semibold">
                Drag & Drop Images
              </span>
              <span className="text-[10px] text-neutral-500 mt-1 font-sans">
                or click to browse local files / camera roll
              </span>
              
              <button
                type="button"
                className="mt-4 px-4 py-1.5 rounded border border-[#c5a059]/40 bg-[#c5a059]/5 hover:bg-[#c5a059]/15 text-[#c5a059] text-[10px] font-display font-semibold uppercase tracking-wider transition-colors duration-200"
              >
                Choose Images
              </button>
            </div>

            {errors.images && (
              <p className="text-rose-400 text-[11px] font-sans flex items-center space-x-1">
                <span className="h-1.5 w-1.5 rounded-full bg-rose-500 inline-block mr-1" />
                {errors.images}
              </p>
            )}

            {/* Image Previews */}
            {images.length > 0 && (
              <div className="space-y-3">
                <p className="text-[10px] font-display uppercase tracking-wider text-neutral-400 font-semibold flex items-center justify-between">
                  <span>Uploaded Previews ({images.length})</span>
                  <span className="text-[9px] text-[#c5a059] font-sans capitalize font-normal">Primary Cover Is Highlighted</span>
                </p>
                
                <div className="grid grid-cols-4 gap-3">
                  <AnimatePresence>
                    {images.map((img, idx) => (
                      <motion.div
                        key={idx}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className={`group relative aspect-square rounded overflow-hidden border bg-[#111e1f] ${
                          idx === 0 ? 'border-[#c5a059] ring-1 ring-[#c5a059]/40' : 'border-[#1d2f30]'
                        }`}
                      >
                        <img 
                          src={img} 
                          alt={`Preview ${idx + 1}`} 
                          className="h-full w-full object-cover brightness-95 group-hover:scale-105 transition-transform duration-300" 
                        />
                        {idx === 0 && (
                          <div className="absolute top-1 left-1 bg-[#c5a059] text-black text-[7px] font-display uppercase tracking-widest font-extrabold px-1 rounded-sm shadow">
                            Cover
                          </div>
                        )}
                        <button
                          type="button"
                          onClick={() => removeImage(idx)}
                          className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 flex items-center justify-center text-rose-400 transition-opacity duration-200"
                        >
                          <X className="h-4 w-4 bg-[#0a1617] rounded-full p-0.5 border border-rose-500/50" />
                        </button>
                      </motion.div>
                    ))}
                  </AnimatePresence>
                </div>
              </div>
            )}
          </div>

          {/* Right Column: Product Details (span 7) */}
          <div className="lg:col-span-7 space-y-5">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Product Title */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-display tracking-widest text-neutral-400 uppercase font-semibold">
                  Product Title *
                </label>
                <input
                  required
                  type="text"
                  placeholder="e.g. Imperial Emerald Solitaire"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    if (errors.name) setErrors(prev => { const c = {...prev}; delete c.name; return c; });
                  }}
                  className={`w-full bg-[#111e1f] rounded border py-2.5 px-3 text-xs text-neutral-200 placeholder-neutral-700 focus:border-[#c5a059] focus:outline-none transition-all ${
                    errors.name ? 'border-rose-500/50' : 'border-[#1d2f30]'
                  }`}
                />
                {errors.name && <p className="text-rose-400 text-[10px] font-sans mt-0.5">{errors.name}</p>}
              </div>

              {/* Subtitle / Provenance */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-display tracking-widest text-neutral-400 uppercase font-semibold">
                  Luxury Subtitle / Provenance
                </label>
                <input
                  type="text"
                  placeholder="e.g. Handcrafted Platinum Band"
                  value={subtitle}
                  onChange={(e) => setSubtitle(e.target.value)}
                  className="w-full bg-[#111e1f] rounded border border-[#1d2f30] py-2.5 px-3 text-xs text-neutral-200 placeholder-neutral-700 focus:border-[#c5a059] focus:outline-none transition-all"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Category Dropdown */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-display tracking-widest text-neutral-400 uppercase font-semibold">
                  Category Collection *
                </label>
                <div className="relative">
                  <select
                    value={collection}
                    onChange={(e) => setCollection(e.target.value)}
                    className="w-full bg-[#111e1f] rounded border border-[#1d2f30] py-2.5 px-3 text-xs text-neutral-200 cursor-pointer focus:border-[#c5a059] focus:outline-none transition-all appearance-none"
                  >
                    {COLLECTIONS.map(col => (
                      <option key={col} value={col} className="bg-[#0a1617]">{col}</option>
                    ))}
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-[#c5a059]">
                    <Layers className="h-3.5 w-3.5 mr-1" />
                  </div>
                </div>
              </div>

              {/* Price */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-display tracking-widest text-neutral-400 uppercase font-semibold">
                  Heritage Valuation ($ Price) *
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#c5a059]" />
                  <input
                    required
                    type="number"
                    min="1"
                    placeholder="2500"
                    value={price}
                    onChange={(e) => {
                      setPrice(e.target.value);
                      if (errors.price) setErrors(prev => { const c = {...prev}; delete c.price; return c; });
                    }}
                    className={`w-full bg-[#111e1f] rounded border py-2.5 pl-9 pr-3 text-xs text-neutral-200 font-mono placeholder-neutral-700 focus:border-[#c5a059] focus:outline-none transition-all ${
                      errors.price ? 'border-rose-500/50' : 'border-[#1d2f30]'
                    }`}
                  />
                </div>
                {errors.price && <p className="text-rose-400 text-[10px] font-sans mt-0.5">{errors.price}</p>}
              </div>
            </div>

            {/* Description (multiline) */}
            <div className="space-y-1.5">
              <label className="block text-[9px] font-display tracking-widest text-neutral-400 uppercase font-semibold">
                Sovereign Storytelling Description *
              </label>
              <textarea
                required
                rows={4}
                placeholder="Narrate the inspiration, historical styling, design depth, and exquisite detailing of this handcrafted jewelry masterpiece..."
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                  if (errors.description) setErrors(prev => { const c = {...prev}; delete c.description; return c; });
                }}
                className={`w-full bg-[#111e1f] rounded border p-3 text-xs text-neutral-200 placeholder-neutral-700 focus:border-[#c5a059] focus:outline-none transition-all ${
                  errors.description ? 'border-rose-500/50' : 'border-[#1d2f30]'
                }`}
              />
              {errors.description && <p className="text-rose-400 text-[10px] font-sans mt-0.5">{errors.description}</p>}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Material */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-display tracking-widest text-neutral-400 uppercase font-semibold">
                  Precious Materials & Metallurgy *
                </label>
                <div className="relative">
                  <Star className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-[#c5a059]" />
                  <input
                    required
                    type="text"
                    placeholder="e.g. Platinum, 18K Yellow Gold"
                    value={materials}
                    onChange={(e) => {
                      setMaterials(e.target.value);
                      if (errors.materials) setErrors(prev => { const c = {...prev}; delete c.materials; return c; });
                    }}
                    className={`w-full bg-[#111e1f] rounded border py-2.5 pl-9 pr-3 text-xs text-neutral-200 placeholder-neutral-700 focus:border-[#c5a059] focus:outline-none transition-all ${
                      errors.materials ? 'border-rose-500/50' : 'border-[#1d2f30]'
                    }`}
                  />
                </div>
                {errors.materials && <p className="text-rose-400 text-[10px] font-sans mt-0.5">{errors.materials}</p>}
              </div>

              {/* Weight */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-display tracking-widest text-neutral-400 uppercase font-semibold">
                  Diamond Carat / Metal Weight (wt)
                </label>
                <div className="relative">
                  <Scale className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    placeholder="e.g. 1.25"
                    value={weight}
                    onChange={(e) => setWeight(e.target.value)}
                    className="w-full bg-[#111e1f] rounded border border-[#1d2f30] py-2.5 pl-9 pr-3 text-xs text-neutral-200 font-mono placeholder-neutral-700 focus:border-[#c5a059] focus:outline-none transition-all"
                  />
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-center">
              {/* Stock Quantity */}
              <div className="space-y-1.5">
                <label className="block text-[9px] font-display tracking-widest text-neutral-400 uppercase font-semibold">
                  Atelier Stock Quantity *
                </label>
                <div className="relative">
                  <Package className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                  <input
                    required
                    type="number"
                    min="0"
                    placeholder="5"
                    value={stock}
                    onChange={(e) => {
                      setStock(e.target.value);
                      if (errors.stock) setErrors(prev => { const c = {...prev}; delete c.stock; return c; });
                    }}
                    className={`w-full bg-[#111e1f] rounded border py-2.5 pl-9 pr-3 text-xs text-neutral-200 font-mono focus:border-[#c5a059] focus:outline-none transition-all ${
                      errors.stock ? 'border-rose-500/50' : 'border-[#1d2f30]'
                    }`}
                  />
                </div>
                {errors.stock && <p className="text-rose-400 text-[10px] font-sans mt-0.5">{errors.stock}</p>}
              </div>

              {/* Featured Product toggle */}
              <div className="pt-4 flex items-center justify-between p-3.5 rounded border border-[#1d2f30] bg-[#111e1f]/50">
                <div className="space-y-0.5">
                  <span className="text-[10px] font-display uppercase tracking-wider text-neutral-300 font-bold flex items-center">
                    <Sparkles className="h-3 w-3 text-[#c5a059] mr-1" />
                    Featured Masterpiece
                  </span>
                  <p className="text-[9px] text-neutral-500 font-sans">Highlight on showroom landing sliders</p>
                </div>
                
                <label className="relative inline-flex items-center cursor-pointer">
                  <input 
                    type="checkbox" 
                    checked={isFeatured}
                    onChange={(e) => setIsFeatured(e.target.checked)}
                    className="sr-only peer" 
                  />
                  <div className="w-9 h-5 bg-[#111e1f] border border-[#1d2f30] rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[4px] after:left-[4px] after:bg-[#1d2f30] peer-checked:after:bg-[#c5a059] after:border-none after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#c5a059]/10 peer-checked:border-[#c5a059]/55"></div>
                </label>
              </div>
            </div>

            {/* Actions Buttons */}
            <div className="flex gap-4 pt-4 border-t border-[#1d2f30]/60">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 rounded border border-[#1d2f30] text-neutral-400 hover:text-white py-3.5 text-xs font-display tracking-wider uppercase transition-all cursor-pointer bg-[#111e1f]/30 hover:bg-[#111e1f]/80"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="flex-1 rounded bg-gold-gradient text-black py-3.5 text-xs font-display font-bold tracking-[0.15em] uppercase hover:opacity-95 shadow-gold-glow transition-all cursor-pointer flex items-center justify-center space-x-2"
              >
                <Check className="h-4 w-4 stroke-[2.5px]" />
                <span>Save Product</span>
              </button>
            </div>
          </div>
        </form>
      </motion.div>
    </div>
  );
}
