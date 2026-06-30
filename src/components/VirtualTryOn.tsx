import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Camera, CameraOff, RotateCw, ZoomIn, ZoomOut, Move, Sliders, ChevronDown, Check, Sparkles, X, Download, HelpCircle, RefreshCcw } from 'lucide-react';
import { JewelryItem } from '../types';

interface VirtualTryOnProps {
  products: JewelryItem[];
  isOpen: boolean;
  onClose: () => void;
  preselectedProduct?: JewelryItem | null;
}

const CATEGORIES = ['Ring', 'Necklace', 'Earrings', 'Bracelet'];

const MODEL_BACKGROUNDS: Record<string, string> = {
  Ring: 'https://images.unsplash.com/photo-1573408301185-9146fe634ad0?auto=format&fit=crop&q=80&w=640&h=480',
  Necklace: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&q=80&w=640&h=480',
  Earrings: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&q=80&w=640&h=480',
  Bracelet: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&q=80&w=640&h=480',
};

export default function VirtualTryOn({
  products,
  isOpen,
  onClose,
  preselectedProduct = null,
}: VirtualTryOnProps) {
  const [selectedCategory, setSelectedCategory] = useState('Ring');
  const [selectedProduct, setSelectedProduct] = useState<JewelryItem | null>(null);
  
  // Camera & Stream State
  const [cameraActive, setCameraActive] = useState(false);
  const [streamError, setStreamError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // Overlay Adjustment States
  const [scale, setScale] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [position, setPosition] = useState({ x: 0, y: 0 });
  const [opacity, setOpacity] = useState(0.9);
  const [showGuides, setShowGuides] = useState(true);
  const [dragActive, setDragActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const [showShutterFlash, setShowShutterFlash] = useState(false);

  const containerRef = useRef<HTMLDivElement | null>(null);

  // Filter products by category
  const filteredProducts = products.filter(p => {
    const nameLower = p.name.toLowerCase();
    const subLower = p.subtitle.toLowerCase();
    const descLower = p.description.toLowerCase();
    const colLower = p.collection.toLowerCase();

    if (selectedCategory === 'Ring') {
      return nameLower.includes('ring') || subLower.includes('ring') || nameLower.includes('band');
    }
    if (selectedCategory === 'Necklace') {
      return nameLower.includes('necklace') || nameLower.includes('choker') || nameLower.includes('pendant') || subLower.includes('pendant') || nameLower.includes('set');
    }
    if (selectedCategory === 'Earrings') {
      return nameLower.includes('earring') || nameLower.includes('jhumka') || nameLower.includes('huggie') || subLower.includes('huggie');
    }
    if (selectedCategory === 'Bracelet') {
      return nameLower.includes('bracelet') || nameLower.includes('cada') || nameLower.includes('kada') || nameLower.includes('cuff') || nameLower.includes('bangle');
    }
    return false;
  });

  // Handle auto-preselection
  useEffect(() => {
    if (isOpen) {
      if (preselectedProduct) {
        setSelectedProduct(preselectedProduct);
        // Deduce category
        const nameL = preselectedProduct.name.toLowerCase();
        if (nameL.includes('ring') || nameL.includes('band')) setSelectedCategory('Ring');
        else if (nameL.includes('necklace') || nameL.includes('choker') || nameL.includes('pendant') || nameL.includes('set')) setSelectedCategory('Necklace');
        else if (nameL.includes('earring') || nameL.includes('jhumka') || nameL.includes('huggie')) setSelectedCategory('Earrings');
        else if (nameL.includes('bracelet') || nameL.includes('cada') || nameL.includes('kada') || nameL.includes('cuff') || nameL.includes('bangle')) setSelectedCategory('Bracelet');
      } else if (filteredProducts.length > 0) {
        setSelectedProduct(filteredProducts[0]);
      }
      startCamera();
    } else {
      stopCamera();
    }
  }, [isOpen, preselectedProduct]);

  // Adjust category when selectedCategory change
  useEffect(() => {
    if (!preselectedProduct && filteredProducts.length > 0) {
      setSelectedProduct(filteredProducts[0]);
      resetAdjustments();
    }
  }, [selectedCategory]);

  const startCamera = async () => {
    setStreamError(null);
    try {
      if (streamRef.current) {
        stopCamera();
      }
      const constraints = {
        video: {
          facingMode: 'user',
          width: { ideal: 640 },
          height: { ideal: 480 },
        },
        audio: false,
      };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play().catch(e => console.info(e));
      }
      setCameraActive(true);
    } catch (err: any) {
      console.info('Camera permissions could not be acquired (using model preview fallback):', err?.message || err);
      setStreamError('Permission dismissed or camera unavailable. Operating in Studio Model Mode.');
      setCameraActive(false);
    }
  };

  const stopCamera = () => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
    setCameraActive(false);
  };

  const resetAdjustments = () => {
    setScale(1);
    setRotation(0);
    setPosition({ x: 0, y: 0 });
    setOpacity(0.9);
  };

  // Drag logic for the jewelry overlay
  const handlePointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    setDragActive(true);
    const target = e.currentTarget as HTMLDivElement;
    target.setPointerCapture(e.pointerId);
  };

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!dragActive) return;
    setPosition(prev => ({
      x: prev.x + e.movementX,
      y: prev.y + e.movementY,
    }));
  };

  const handlePointerUp = (e: React.PointerEvent) => {
    setDragActive(false);
    const target = e.currentTarget as HTMLDivElement;
    try {
      target.releasePointerCapture(e.pointerId);
    } catch (err) {}
  };

  // Draw product overlay over the specified canvas context helper
  const drawProductOnCanvas = (ctx: CanvasRenderingContext2D, canvas: HTMLCanvasElement) => {
    if (selectedProduct) {
      const img = new Image();
      img.crossOrigin = 'anonymous';
      img.src = selectedProduct.image;
      img.onload = () => {
        ctx.save();
        ctx.globalAlpha = opacity;
        
        // Translate to center of canvas + adjustable offset
        const centerX = 320 + position.x;
        const centerY = 240 + position.y;
        ctx.translate(centerX, centerY);
        ctx.rotate((rotation * Math.PI) / 180);
        
        const drawWidth = 150 * scale;
        const drawHeight = 150 * scale;
        ctx.drawImage(img, -drawWidth / 2, -drawHeight / 2, drawWidth, drawHeight);
        ctx.restore();
        
        // Set captured state
        setCapturedImage(canvas.toDataURL('image/png'));
      };
      img.onerror = () => {
        setCapturedImage(canvas.toDataURL('image/png'));
      };
    } else {
      setCapturedImage(canvas.toDataURL('image/png'));
    }
  };

  // Shutter Snap Snapshot
  const captureSnapshot = () => {
    setShowShutterFlash(true);
    setTimeout(() => setShowShutterFlash(false), 200);

    // Create a canvas to draw both video/model and jewelry element
    const canvas = document.createElement('canvas');
    canvas.width = 640;
    canvas.height = 480;
    const ctx = canvas.getContext('2d');
    
    if (ctx) {
      if (cameraActive && videoRef.current) {
        // Draw video stream
        ctx.drawImage(videoRef.current, 0, 0, 640, 480);
        drawProductOnCanvas(ctx, canvas);
      } else {
        // Draw elegant model background
        const bgImg = new Image();
        bgImg.crossOrigin = 'anonymous';
        bgImg.src = MODEL_BACKGROUNDS[selectedCategory] || MODEL_BACKGROUNDS.Necklace;
        bgImg.onload = () => {
          ctx.drawImage(bgImg, 0, 0, 640, 480);
          drawProductOnCanvas(ctx, canvas);
        };
        bgImg.onerror = () => {
          drawProductOnCanvas(ctx, canvas);
        };
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4 py-6 bg-black/90 backdrop-blur-md">
      
      {/* Shutter flash overlay */}
      <AnimatePresence>
        {showShutterFlash && (
          <motion.div 
            initial={{ opacity: 1 }}
            animate={{ opacity: 0 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-white z-50 pointer-events-none"
          />
        )}
      </AnimatePresence>

      <div className="relative w-full max-w-5xl rounded-lg border border-[#1d2f30] bg-[#0a1617] p-5 md:p-8 shadow-gold-heavy flex flex-col justify-between max-h-[92vh] overflow-hidden">
        
        {/* Luxury top line indicator */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gold-gradient" />
        
        {/* Header bar */}
        <div className="flex items-center justify-between mb-4 border-b border-[#1d2f30]/60 pb-3">
          <div className="flex items-center space-x-2.5">
            <Sparkles className="h-4.5 w-4.5 text-[#c5a059] animate-pulse" />
            <div>
              <h2 className="font-luxury-title text-lg md:text-xl text-white font-medium">Atelier Private AR Try-On Suite</h2>
              <p className="text-[10px] text-neutral-400 font-sans">Experience luxury pieces aligned to your device camera in real-time</p>
            </div>
          </div>
          
          <button
            onClick={() => {
              stopCamera();
              onClose();
            }}
            className="text-neutral-400 hover:text-white border border-[#1d2f30] hover:border-[#c5a059] rounded-full h-8 w-8 flex items-center justify-center bg-[#111e1f] cursor-pointer"
          >
            <X className="h-4.5 w-4.5" />
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 flex-1 overflow-hidden">
          
          {/* CAMERA FEED & INTERACTIVE CANVAS (Col span 7) */}
          <div className="lg:col-span-7 flex flex-col justify-center items-center bg-[#071011] rounded border border-[#1d2f30] relative overflow-hidden aspect-[4/3] max-h-[50vh] lg:max-h-[60vh] select-none" ref={containerRef}>
            
            {cameraActive && !streamError ? (
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className="absolute inset-0 h-full w-full object-cover scale-x-[-1]" // Mirror for selfie mode
              />
            ) : (
              <div className="absolute inset-0 h-full w-full">
                <img 
                  src={MODEL_BACKGROUNDS[selectedCategory] || MODEL_BACKGROUNDS.Necklace} 
                  alt="Model Profile Background" 
                  className="h-full w-full object-cover brightness-[0.5] contrast-[1.05]"
                  referrerPolicy="no-referrer"
                />
                
                {/* Premium indicator overlay for Model mode */}
                <div className="absolute top-3 left-3 bg-[#0a1617]/90 backdrop-blur border border-[#c5a059]/30 rounded px-2.5 py-1 text-[8px] font-mono uppercase tracking-wider text-[#c5a059] flex items-center space-x-1 z-10">
                  <span className="h-1.5 w-1.5 rounded-full bg-amber-500 animate-pulse mr-1" />
                  <span>Studio Model Mode</span>
                </div>
              </div>
            )}

            {/* Placement Guides Overlay (Silhouettes) */}
            {cameraActive && showGuides && (
              <div className="absolute inset-0 flex items-center justify-center opacity-25 pointer-events-none select-none">
                {selectedCategory === 'Ring' && (
                  <div className="w-40 h-40 border-2 border-dashed border-[#c5a059] rounded-full flex items-center justify-center">
                    <span className="font-mono text-[9px] text-[#c5a059] uppercase tracking-wider">Position Hand</span>
                  </div>
                )}
                {selectedCategory === 'Necklace' && (
                  <svg className="w-64 h-64 text-[#c5a059]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="1" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                )}
                {selectedCategory === 'Earrings' && (
                  <div className="flex justify-between w-60">
                    <div className="h-10 w-10 border-2 border-dashed border-[#c5a059] rounded-full" />
                    <div className="h-10 w-10 border-2 border-dashed border-[#c5a059] rounded-full" />
                  </div>
                )}
                {selectedCategory === 'Bracelet' && (
                  <div className="w-52 h-20 border-2 border-dashed border-[#c5a059] rounded-full flex items-center justify-center">
                    <span className="font-mono text-[9px] text-[#c5a059] uppercase tracking-wider">Position Wrist</span>
                  </div>
                )}
              </div>
            )}

            {/* DRAGGABLE REAL-TIME JEWELRY ITEM */}
            {selectedProduct && (
              <motion.div
                onPointerDown={handlePointerDown}
                onPointerMove={handlePointerMove}
                onPointerUp={handlePointerUp}
                style={{
                  x: position.x,
                  y: position.y,
                  scale: scale,
                  rotate: `${rotation}deg`,
                  opacity: opacity,
                  cursor: dragActive ? 'grabbing' : 'grab',
                }}
                className="absolute w-36 h-36 flex items-center justify-center touch-none select-none z-20"
                whileHover={{ shadow: '0 0 15px rgba(197, 160, 89, 0.3)' }}
              >
                <img
                  src={selectedProduct.image}
                  alt={selectedProduct.name}
                  className="max-h-full max-w-full object-contain filter drop-shadow-[0_4px_12px_rgba(197,160,89,0.55)] select-none pointer-events-none"
                  referrerPolicy="no-referrer"
                />
              </motion.div>
            )}

            {/* Quick action controls overlay on canvas */}
            {selectedProduct && (
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between pointer-events-auto z-30">
                <button
                  onClick={resetAdjustments}
                  className="rounded bg-[#0a1617]/85 backdrop-blur border border-[#1d2f30] px-3 py-1.5 text-[9px] font-display text-neutral-400 tracking-widest uppercase hover:text-[#c5a059] transition-all cursor-pointer flex items-center space-x-1"
                >
                  <RefreshCcw className="h-3 w-3" />
                  <span>Reset AR</span>
                </button>

                <button
                  onClick={captureSnapshot}
                  className="h-12 w-12 rounded-full border border-[#c5a059] bg-gold-gradient flex items-center justify-center text-black shadow-gold-heavy hover:scale-105 transition-all cursor-pointer"
                  title="Snap Virtual Photo"
                >
                  <Camera className="h-5 w-5 stroke-[2.5px]" />
                </button>

                {cameraActive ? (
                  <button
                    onClick={() => setShowGuides(!showGuides)}
                    className={`rounded border px-3 py-1.5 text-[9px] font-display tracking-widest uppercase transition-all cursor-pointer ${
                      showGuides 
                        ? 'border-[#c5a059] bg-[#c5a059]/10 text-[#c5a059]' 
                        : 'border-[#1d2f30] bg-[#0a1617]/85 text-neutral-400'
                    }`}
                  >
                    {showGuides ? 'Hide Guides' : 'Show Guides'}
                  </button>
                ) : (
                  <button
                    onClick={startCamera}
                    className="rounded border border-[#c5a059]/40 bg-[#c5a059]/10 px-3 py-1.5 text-[9px] font-display font-bold text-[#c5a059] tracking-widest uppercase hover:bg-[#c5a059]/20 transition-all cursor-pointer flex items-center space-x-1"
                    title="Enable device camera stream"
                  >
                    <Camera className="h-3.5 w-3.5" />
                    <span>Live Camera</span>
                  </button>
                )}
              </div>
            )}
          </div>

          {/* ITEM SELECTOR & CONTROLS (Col span 5) */}
          <div className="lg:col-span-5 flex flex-col text-left space-y-5 overflow-y-auto max-h-[40vh] lg:max-h-[60vh] pr-1.5">
            
            {/* Category Choice */}
            <div>
              <p className="text-[10px] font-display tracking-widest text-neutral-400 uppercase mb-2 font-bold">Category Suite</p>
              <div className="grid grid-cols-4 gap-1.5">
                {CATEGORIES.map(cat => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`py-1.5 text-[10px] font-display tracking-widest uppercase border rounded cursor-pointer transition-all ${
                      selectedCategory === cat
                        ? 'border-[#c5a059] bg-[#c5a059]/10 text-[#c5a059] font-bold'
                        : 'border-[#1d2f30] bg-[#111e1f] text-neutral-400 hover:border-[#c5a059]/50'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>

            {/* Filtered Products Carousel */}
            <div>
              <p className="text-[10px] font-display tracking-widest text-neutral-400 uppercase mb-2 font-bold">Select Masterpiece</p>
              <div className="grid grid-cols-2 gap-2.5 max-h-[160px] overflow-y-auto pr-1">
                {filteredProducts.map(p => (
                  <button
                    key={p.id}
                    onClick={() => {
                      setSelectedProduct(p);
                      resetAdjustments();
                    }}
                    className={`p-2 rounded border flex items-center space-x-2 text-left cursor-pointer transition-all ${
                      selectedProduct?.id === p.id
                        ? 'border-[#c5a059] bg-[#c5a059]/5 text-[#c5a059]'
                        : 'border-[#1d2f30] bg-[#111e1f] text-neutral-300 hover:border-neutral-700'
                    }`}
                  >
                    <img 
                      src={p.image} 
                      alt={p.name} 
                      className="h-8 w-8 object-cover rounded bg-[#0a1617]" 
                      referrerPolicy="no-referrer"
                    />
                    <div className="overflow-hidden min-w-0">
                      <h4 className="text-[10px] font-bold truncate leading-tight">{p.name}</h4>
                      <p className="text-[9px] text-neutral-500 font-mono leading-none">${p.price.toLocaleString()}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Selected Product Card */}
            {selectedProduct && (
              <div className="p-3 border border-[#1d2f30] bg-[#111e1f]/40 rounded space-y-1">
                <span className="text-[8px] font-display uppercase tracking-widest text-[#c5a059] border border-[#c5a059]/40 bg-[#c5a059]/5 px-1.5 py-0.5 rounded">
                  Active Try-On
                </span>
                <h3 className="font-luxury-title text-sm text-white pt-1">{selectedProduct.name}</h3>
                <p className="text-[10px] text-neutral-400 font-sans line-clamp-2">{selectedProduct.description}</p>
              </div>
            )}

            {/* Adjustments Tool Box */}
            <div className="p-4 border border-[#1d2f30] bg-[#111e1f] rounded space-y-4">
              <div className="flex items-center space-x-1.5 text-[10px] font-display uppercase tracking-wider text-[#c5a059] font-bold">
                <Sliders className="h-3.5 w-3.5" />
                <span>Fine Calibration Parameters</span>
              </div>

              {/* Scale Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] text-neutral-400">
                  <span className="flex items-center"><ZoomIn className="h-3 w-3 mr-1" /> Size Dimensions</span>
                  <span className="font-mono text-[#c5a059]">{Math.round(scale * 100)}%</span>
                </div>
                <input 
                  type="range"
                  min="0.4"
                  max="2.5"
                  step="0.05"
                  value={scale}
                  onChange={(e) => setScale(parseFloat(e.target.value))}
                  className="w-full accent-[#c5a059] h-1 bg-[#0a1617] rounded-lg cursor-pointer"
                />
              </div>

              {/* Rotation Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] text-neutral-400">
                  <span className="flex items-center"><RotateCw className="h-3 w-3 mr-1" /> Rotation Angle</span>
                  <span className="font-mono text-[#c5a059]">{rotation}°</span>
                </div>
                <input 
                  type="range"
                  min="-180"
                  max="180"
                  step="2"
                  value={rotation}
                  onChange={(e) => setRotation(parseInt(e.target.value))}
                  className="w-full accent-[#c5a059] h-1 bg-[#0a1617] rounded-lg cursor-pointer"
                />
              </div>

              {/* Opacity Slider */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-[9px] text-neutral-400">
                  <span>Physical Reflection (Opacity)</span>
                  <span className="font-mono text-[#c5a059]">{Math.round(opacity * 100)}%</span>
                </div>
                <input 
                  type="range"
                  min="0.3"
                  max="1"
                  step="0.05"
                  value={opacity}
                  onChange={(e) => setOpacity(parseFloat(e.target.value))}
                  className="w-full accent-[#c5a059] h-1 bg-[#0a1617] rounded-lg cursor-pointer"
                />
              </div>
            </div>

            {/* Quick Tutorial Tip */}
            <div className="flex items-start space-x-2 text-[10px] text-neutral-400 leading-normal bg-[#0a1617]/50 p-2.5 rounded border border-[#1d2f30]/30">
              <HelpCircle className="h-4 w-4 text-[#c5a059] shrink-0 mt-0.5" />
              <p>
                Drag directly on the jewellery piece inside the feed to position it. Use fine sliders for perfect size, rotation, and reflection.
              </p>
            </div>

          </div>

        </div>

        {/* Snapshot Modal overlay if snapshot captured */}
        <AnimatePresence>
          {capturedImage && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/95">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="w-full max-w-lg rounded border border-[#1d2f30] bg-[#0a1617] p-5 text-center space-y-4"
              >
                <div className="flex items-center justify-between pb-2 border-b border-[#1d2f30]">
                  <span className="font-display text-xs text-[#c5a059] font-bold uppercase tracking-widest">Snapshot Captured</span>
                  <button 
                    onClick={() => setCapturedImage(null)}
                    className="text-neutral-400 hover:text-white"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>

                <div className="rounded border border-[#1d2f30] overflow-hidden aspect-[4/3] bg-[#071011]">
                  <img src={capturedImage} alt="Virtual Try-On Screenshot" className="w-full h-full object-contain" />
                </div>

                <p className="text-[11px] text-neutral-400 font-sans">
                  The masterpiece has been configured to your physical profile! Save this snapshot to consult with our private designers.
                </p>

                <div className="flex gap-3">
                  <button
                    onClick={() => setCapturedImage(null)}
                    className="flex-1 rounded border border-[#1d2f30] bg-[#111e1f] text-neutral-300 py-2.5 text-xs font-display font-semibold tracking-wider uppercase cursor-pointer hover:bg-[#1d2f30]"
                  >
                    Take Another
                  </button>
                  <a
                    href={capturedImage}
                    download={`Atelier_TryOn_${selectedProduct?.sku || 'Item'}.png`}
                    className="flex-1 rounded bg-gold-gradient text-black py-2.5 text-xs font-display font-bold tracking-widest uppercase flex items-center justify-center space-x-1 shadow-gold-glow cursor-pointer"
                  >
                    <Download className="h-3.5 w-3.5" />
                    <span>Save Image</span>
                  </a>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

      </div>
    </div>
  );
}
