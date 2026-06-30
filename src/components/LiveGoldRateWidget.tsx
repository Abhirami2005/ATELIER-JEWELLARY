import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { TrendingUp, TrendingDown, RefreshCw, Star } from 'lucide-react';

export default function LiveGoldRateWidget() {
  const [rate24K, setRate24K] = useState(7450); // INR per gram
  const [rate22K, setRate22K] = useState(6830); // INR per gram
  const [rate24K_USD, setRate24K_USD] = useState(78.50); // USD per gram
  const [rate22K_USD, setRate22K_USD] = useState(72.10); // USD per gram
  
  const [change, setChange] = useState(0.42); // Daily percent change
  const [lastUpdated, setLastUpdated] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);

  const formatTime = () => {
    const d = new Date();
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  };

  useEffect(() => {
    setLastUpdated(formatTime());
    
    // Simulate real-time luxury fluctuations every 10 seconds
    const interval = setInterval(() => {
      setIsUpdating(true);
      setTimeout(() => {
        const delta = (Math.random() * 6 - 3); // -3 to +3 rupees
        const deltaPercent = (Math.random() * 0.08 - 0.04);
        
        setRate24K(prev => Math.round((prev + delta) * 10) / 10);
        setRate22K(prev => Math.round((prev + delta * 0.92) * 10) / 10);
        setRate24K_USD(prev => Math.round((prev + delta * 0.012) * 100) / 100);
        setRate22K_USD(prev => Math.round((prev + delta * 0.011) * 100) / 100);
        
        setChange(prev => Math.round((prev + deltaPercent) * 100) / 100);
        setLastUpdated(formatTime());
        setIsUpdating(false);
      }, 800);
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  const triggerManualUpdate = () => {
    if (isUpdating) return;
    setIsUpdating(true);
    setTimeout(() => {
      const delta = (Math.random() * 4 - 2);
      setRate24K(prev => Math.round((prev + delta) * 10) / 10);
      setRate22K(prev => Math.round((prev + delta * 0.92) * 10) / 10);
      setLastUpdated(formatTime());
      setIsUpdating(false);
    }, 600);
  };

  const isPositive = change >= 0;

  return (
    <div className="relative overflow-hidden rounded-md border border-[#1d2f30] bg-[#111e1f] p-4.5 shadow-gold-glow">
      <div className="absolute top-0 left-0 right-0 h-[1px] bg-gradient-to-r from-[#c5a059]/40 to-transparent" />
      
      <div className="flex items-center justify-between mb-3 border-b border-[#1d2f30]/60 pb-2.5">
        <div className="flex items-center space-x-2">
          <Star className="h-3.5 w-3.5 text-[#c5a059] animate-pulse" />
          <span className="font-display text-[9px] uppercase tracking-[0.2em] text-[#c5a059] font-bold">
            Live Gold Index (per 10g)
          </span>
        </div>
        
        <div className="flex items-center space-x-1.5">
          <span className="font-mono text-[9px] text-neutral-500">Live</span>
          <button 
            onClick={triggerManualUpdate}
            disabled={isUpdating}
            className="text-neutral-500 hover:text-[#c5a059] cursor-pointer disabled:opacity-40 transition-colors"
          >
            <RefreshCw className={`h-3 w-3 ${isUpdating ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {/* 24K Rates */}
        <div className="space-y-1">
          <p className="text-[9px] font-display uppercase tracking-widest text-neutral-400 font-semibold">24K Pure Gold</p>
          <div className="flex flex-col">
            <span className="font-mono text-base font-bold text-white leading-tight">
              ₹{(rate24K * 10).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            <span className="font-mono text-[10px] text-neutral-500">
              ${(rate24K_USD * 10).toFixed(2)} USD
            </span>
          </div>
        </div>

        {/* 22K Rates */}
        <div className="space-y-1">
          <p className="text-[9px] font-display uppercase tracking-widest text-neutral-400 font-semibold">22K Standard Gold</p>
          <div className="flex flex-col">
            <span className="font-mono text-base font-bold text-[#c5a059] leading-tight">
              ₹{(rate22K * 10).toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
            <span className="font-mono text-[10px] text-neutral-500">
              ${(rate22K_USD * 10).toFixed(2)} USD
            </span>
          </div>
        </div>
      </div>

      <div className="mt-3 pt-2 border-t border-[#1d2f30]/40 flex items-center justify-between text-[9px]">
        <div className="flex items-center space-x-1 font-mono">
          <span className="text-neutral-500">Change:</span>
          <span className={`flex items-center font-bold ${isPositive ? 'text-emerald-400' : 'text-rose-400'}`}>
            {isPositive ? <TrendingUp className="h-2.5 w-2.5 mr-0.5" /> : <TrendingDown className="h-2.5 w-2.5 mr-0.5" />}
            {isPositive ? '+' : ''}{change}%
          </span>
        </div>
        
        <span className="font-mono text-neutral-500">
          Sync: {lastUpdated}
        </span>
      </div>
    </div>
  );
}
