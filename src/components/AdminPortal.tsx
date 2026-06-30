import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { JewelryItem, Order, Consultation } from '../types';
import { 
  TrendingUp, ShoppingBag, Calendar, Users, DollarSign, 
  Trash2, Edit, Plus, FileSpreadsheet, Check, X, ShieldAlert,
  Search, BarChart2, Package, Inbox, Layers, FileCheck
} from 'lucide-react';
import AddMasterpieceModal from './AddMasterpieceModal';

interface AdminPortalProps {
  products: JewelryItem[];
  orders: Order[];
  consultations: Consultation[];
  onUpdateProduct: (product: JewelryItem) => void;
  onAddProduct: (product: JewelryItem) => void;
  onDeleteProduct: (id: string) => void;
  onUpdateOrderStatus: (orderId: string, status: Order['status']) => void;
  onUpdateConsultationStatus: (consultationId: string, status: Consultation['status']) => void;
}

export default function AdminPortal({
  products,
  orders,
  consultations,
  onUpdateProduct,
  onAddProduct,
  onDeleteProduct,
  onUpdateOrderStatus,
  onUpdateConsultationStatus,
}: AdminPortalProps) {
  const [activeTab, setActiveTab] = useState<'analytics' | 'orders' | 'inventory' | 'consultations' | 'commissions'>('analytics');
  
  // Custom Commission Requests State
  const [commissions, setCommissions] = useState<any[]>([]);
  
  React.useEffect(() => {
    const stored = localStorage.getItem('atelier_custom_requests');
    if (stored) {
      setCommissions(JSON.parse(stored));
    }
  }, [activeTab]);

  const handleUpdateCommissionStatus = (id: string, status: string) => {
    const updated = commissions.map(c => c.id === id ? { ...c, status } : c);
    setCommissions(updated);
    localStorage.setItem('atelier_custom_requests', JSON.stringify(updated));
  };

  const handleSendCommissionQuotation = (id: string, quote: number) => {
    const updated = commissions.map(c => c.id === id ? { ...c, quotation: quote, status: 'Under Review' } : c);
    setCommissions(updated);
    localStorage.setItem('atelier_custom_requests', JSON.stringify(updated));
  };

  // Search and filter states
  const [searchQuery, setSearchQuery] = useState('');
  const [collectionFilter, setCollectionFilter] = useState('All');

  // Add Masterpiece Modal and Luxury Toast states
  const [showAddModal, setShowAddModal] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 4000);
  };

  // Inventory forms states
  const [editingProduct, setEditingProduct] = useState<JewelryItem | null>(null);
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [formName, setFormName] = useState('');
  const [formSubtitle, setFormSubtitle] = useState('');
  const [formDesc, setFormDesc] = useState('');
  const [formPrice, setFormPrice] = useState(0);
  const [formCollection, setFormCollection] = useState('Diamond Collection');
  const [formMetals, setFormMetals] = useState('18K Yellow Gold, Platinum');
  const [formStock, setFormStock] = useState(5);
  const [formCertified, setFormCertified] = useState(true);
  const [formCertId, setFormCertId] = useState('');
  const [formMaterials, setFormMaterials] = useState('');
  const [formImage, setFormImage] = useState('');

  // ----------------- CALCULATE METRICS -----------------
  const totalSalesValuation = orders.reduce((sum, ord) => sum + ord.total, 0);
  const activeOrdersCount = orders.filter(ord => ord.status !== 'Delivered').length;
  const averageOrderValue = orders.length > 0 ? Math.round(totalSalesValuation / orders.length) : 0;
  const pendingConsultationsCount = consultations.filter(c => c.status === 'Scheduled').length;

  // Collection inventory distribution
  const collectionsList = Array.from(new Set(products.map(p => p.collection)));
  
  // ----------------- CRUD PRODUCTS ACTIONS -----------------
  const openEditProduct = (prod: JewelryItem) => {
    setEditingProduct(prod);
    setIsAddingNew(false);
    setFormName(prod.name);
    setFormSubtitle(prod.subtitle);
    setFormDesc(prod.description);
    setFormPrice(prod.price);
    setFormCollection(prod.collection);
    setFormMetals(prod.metalOptions.join(', '));
    setFormStock(prod.stock);
    setFormCertified(prod.certified);
    setFormCertId(prod.certId);
    setFormMaterials(prod.materials);
    setFormImage(prod.image);
  };

  const openAddNewProduct = () => {
    setShowAddModal(true);
    setEditingProduct(null);
    setIsAddingNew(false);
  };

  const handleSaveProductForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formName || !formSubtitle || !formDesc || formPrice <= 0) return;

    const metalOptionsArray = formMetals.split(',').map(m => m.trim()).filter(Boolean);

    if (editingProduct) {
      // Edit mode
      const updated: JewelryItem = {
        ...editingProduct,
        name: formName,
        subtitle: formSubtitle,
        description: formDesc,
        price: Number(formPrice),
        collection: formCollection,
        metalOptions: metalOptionsArray,
        stock: Number(formStock),
        certified: formCertified,
        certId: formCertId,
        materials: formMaterials,
        image: formImage || editingProduct.image,
      };
      onUpdateProduct(updated);
      setEditingProduct(null);
    } else if (isAddingNew) {
      // Add mode
      const generatedId = `new-${Math.floor(Math.random() * 1000)}`;
      const generatedSku = `ATL-NEW-${Math.floor(100 + Math.random() * 900)}`;
      const newProd: JewelryItem = {
        id: generatedId,
        name: formName,
        subtitle: formSubtitle,
        description: formDesc,
        price: Number(formPrice),
        rating: 4.8,
        image: formImage || 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
        collection: formCollection,
        metalOptions: metalOptionsArray,
        stock: Number(formStock),
        certified: formCertified,
        certId: formCertId,
        sku: generatedSku,
        materials: formMaterials,
      };
      onAddProduct(newProd);
      setIsAddingNew(false);
    }
  };

  // ----------------- FILTERS & SEARCHES -----------------
  const filteredProducts = products.filter(p => {
    const matchesSearch = p.name.toLowerCase().includes(searchQuery.toLowerCase()) || p.sku.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCollection = collectionFilter === 'All' || p.collection === collectionFilter;
    return matchesSearch && matchesCollection;
  });

  return (
    <section className="bg-transparent min-h-screen text-left py-12 px-6">
      <div className="mx-auto max-w-7xl">
        
        {/* Dashboard Title & Tagline Header */}
        <div className="border-b border-[#1d2f30] pb-8 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded bg-[#c5a059]/5 border border-[#c5a059]/35 mb-3">
              <span className="h-1.5 w-1.5 rounded-full bg-[#c5a059] animate-pulse" />
              <span className="font-display text-[9px] uppercase tracking-widest text-[#c5a059] font-semibold">
                OPERATIONAL SECURITY SAFEGUARD
              </span>
            </div>
            
            <h1 className="font-luxury-title text-3xl md:text-4xl text-white font-medium">
              Atelier Luxury Management Portal
            </h1>
            <p className="font-sans text-xs text-neutral-400 mt-1">
              Monitor customers, inventory, orders, analytics, and business performance in real time.
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={openAddNewProduct}
              className="rounded bg-gold-gradient hover:opacity-95 text-black px-4 py-2 text-xs font-display font-semibold uppercase tracking-wider flex items-center space-x-1.5 shadow-gold-glow cursor-pointer"
            >
              <Plus className="h-4 w-4 stroke-[2.5px]" />
              <span>Catalog Masterpiece</span>
            </button>
          </div>
        </div>

        {/* Statistics Tiles Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Sales valuation */}
          <div className="p-6 rounded border border-[#1d2f30] bg-[#111e1f] flex items-center justify-between shadow-gold-glow">
            <div className="space-y-1.5">
              <span className="text-[10px] font-display text-neutral-500 tracking-wider uppercase font-semibold">Sales Volume</span>
              <h3 className="font-mono text-2xl font-bold text-[#c5a059]">${totalSalesValuation.toLocaleString()}</h3>
              <p className="text-[10px] text-neutral-400 leading-tight">Secured payment handovers</p>
            </div>
            <div className="h-12 w-12 rounded border border-[#1d2f30] flex items-center justify-center text-[#c5a059] bg-[#0a1617]/60">
              <DollarSign className="h-5 w-5" />
            </div>
          </div>

          {/* Active Orders */}
          <div className="p-6 rounded border border-[#1d2f30] bg-[#111e1f] flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-display text-neutral-500 tracking-wider uppercase font-semibold">Active Orders</span>
              <h3 className="font-mono text-2xl font-bold text-white">{activeOrdersCount} Pending</h3>
              <p className="text-[10px] text-emerald-400 font-medium leading-tight">Insured transit active</p>
            </div>
            <div className="h-12 w-12 rounded border border-[#1d2f30] flex items-center justify-center text-neutral-400">
              <ShoppingBag className="h-5 w-5" />
            </div>
          </div>

          {/* Average Order Value */}
          <div className="p-6 rounded border border-[#1d2f30] bg-[#111e1f] flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-display text-neutral-500 tracking-wider uppercase font-semibold">Avg Acquisition</span>
              <h3 className="font-mono text-2xl font-bold text-white">${averageOrderValue.toLocaleString()}</h3>
              <p className="text-[10px] text-neutral-400 leading-tight">Collector standard grade</p>
            </div>
            <div className="h-12 w-12 rounded border border-[#1d2f30] flex items-center justify-center text-neutral-400">
              <TrendingUp className="h-5 w-5" />
            </div>
          </div>

          {/* Showroom Inquiries */}
          <div className="p-6 rounded border border-[#1d2f30] bg-[#111e1f] flex items-center justify-between">
            <div className="space-y-1.5">
              <span className="text-[10px] font-display text-neutral-500 tracking-wider uppercase font-semibold">Atelier Inquiries</span>
              <h3 className="font-mono text-2xl font-bold text-[#c5a059]">{pendingConsultationsCount} Scheduled</h3>
              <p className="text-[10px] text-neutral-400 leading-tight">Private viewings pending</p>
            </div>
            <div className="h-12 w-12 rounded border border-[#1d2f30] flex items-center justify-center text-neutral-400">
              <Calendar className="h-5 w-5" />
            </div>
          </div>
        </div>

        {/* Dashboard Tabs Selectors */}
        <div className="flex border-b border-[#1d2f30] gap-6 mb-8 overflow-x-auto">
          <button
            onClick={() => setActiveTab('analytics')}
            className={`py-3 text-xs font-display uppercase tracking-widest border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'analytics' ? 'border-[#c5a059] text-[#c5a059] font-semibold' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            📊 Real-Time Analytics
          </button>
          
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 text-xs font-display uppercase tracking-widest border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'orders' ? 'border-[#c5a059] text-[#c5a059] font-semibold' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            📦 Client Orders ({orders.length})
          </button>

          <button
            onClick={() => setActiveTab('inventory')}
            className={`py-3 text-xs font-display uppercase tracking-widest border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'inventory' ? 'border-[#c5a059] text-[#c5a059] font-semibold' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            💎 Inventory Controller ({products.length})
          </button>

          <button
            onClick={() => setActiveTab('consultations')}
            className={`py-3 text-xs font-display uppercase tracking-widest border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'consultations' ? 'border-[#c5a059] text-[#c5a059] font-semibold' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            ⚜️ Showroom Inquiries ({consultations.length})
          </button>

          <button
            onClick={() => setActiveTab('commissions')}
            className={`py-3 text-xs font-display uppercase tracking-widest border-b-2 transition-colors cursor-pointer shrink-0 ${
              activeTab === 'commissions' ? 'border-[#c5a059] text-[#c5a059] font-semibold' : 'border-transparent text-neutral-400 hover:text-white'
            }`}
          >
            🎨 Custom Commissions ({commissions.length})
          </button>
        </div>

        {/* Core Workspace Switcher */}
        <div className="min-h-[400px]">
          
          {/* TAB 1: ANALYTICS OVERVIEW */}
          {activeTab === 'analytics' && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="space-y-8"
            >
              {/* Custom SVG Charts */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Income Chart */}
                <div className="p-6 rounded border border-[#1d2f30] bg-[#111e1f]">
                  <div className="flex justify-between items-center mb-6">
                    <div className="space-y-0.5">
                      <h4 className="font-luxury-title text-base text-white">Acquisition Revenue Performance</h4>
                      <p className="text-[10px] text-neutral-500 font-sans">Calculated based on GIA certified orders over current timeline</p>
                    </div>
                    <span className="text-[10px] font-mono font-bold text-emerald-400 bg-emerald-400/5 px-2.5 py-1 rounded">
                      +14.8% MT-D
                    </span>
                  </div>
                  
                  {/* Glowing line SVG chart */}
                  <div className="h-64 flex items-end justify-center relative pt-4">
                    <svg className="w-full h-full text-[#c5a059]" viewBox="0 0 500 200">
                      <defs>
                        <linearGradient id="chartGlow" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="0%" stopColor="#c5a059" stopOpacity="0.25" />
                          <stop offset="100%" stopColor="#c5a059" stopOpacity="0" />
                        </linearGradient>
                      </defs>
                      {/* Gridlines */}
                      <line x1="0" y1="40" x2="500" y2="40" stroke="#1c1c1c" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="0" y1="100" x2="500" y2="100" stroke="#1c1c1c" strokeWidth="1" strokeDasharray="3,3" />
                      <line x1="0" y1="160" x2="500" y2="160" stroke="#1c1c1c" strokeWidth="1" strokeDasharray="3,3" />
                      
                      {/* Filled area */}
                      <path d="M 0,160 Q 100,120 200,130 T 350,70 T 500,50 L 500,200 L 0,200 Z" fill="url(#chartGlow)" />
                      {/* Line */}
                      <path d="M 0,160 Q 100,120 200,130 T 350,70 T 500,50" fill="none" stroke="#c5a059" strokeWidth="2.5" />
                      {/* Glowing markers */}
                      <circle cx="200" cy="130" r="4" fill="#000" stroke="#c5a059" strokeWidth="2" />
                      <circle cx="350" cy="70" r="4" fill="#000" stroke="#c5a059" strokeWidth="2" />
                      <circle cx="500" cy="50" r="4" fill="#c5a059" stroke="#FFF" strokeWidth="2.5" />
                    </svg>
                    
                    {/* SVG Chart X axis tags */}
                    <div className="absolute bottom-1 left-0 right-0 flex justify-between px-2 font-mono text-[9px] text-neutral-500">
                      <span>May 01</span>
                      <span>May 15</span>
                      <span>Jun 01</span>
                      <span>Jun 15</span>
                      <span>Jun 25 (Today)</span>
                    </div>
                  </div>
                </div>

                {/* Popularity Circle Chart */}
                <div className="p-6 rounded border border-[#1d2f30] bg-[#111e1f]">
                  <div className="flex justify-between items-center mb-6">
                    <div className="space-y-0.5">
                      <h4 className="font-luxury-title text-base text-white">Demand Spread by Category</h4>
                      <p className="text-[10px] text-neutral-500 font-sans">Active stock allocation based on collection purchases</p>
                    </div>
                    <Layers className="h-4 w-4 text-[#c5a059]" />
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-64">
                    {/* Circle drawing */}
                    <div className="flex justify-center">
                      <div className="relative h-40 w-40 flex items-center justify-center">
                        {/* Donut chart simulation */}
                        <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                          {/* Segment 1: Diamond 50% */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#c5a059" strokeWidth="2" strokeDasharray="50 100" strokeDashoffset="0" />
                          {/* Segment 2: Gold 30% */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#F5D76E" strokeWidth="2" strokeDasharray="30 100" strokeDashoffset="-50" />
                          {/* Segment 3: Bridal & others 20% */}
                          <circle cx="18" cy="18" r="15.915" fill="none" stroke="#8A7320" strokeWidth="2" strokeDasharray="20 100" strokeDashoffset="-80" />
                        </svg>
                        <div className="absolute text-center">
                          <p className="font-luxury-title text-2xl font-bold text-white">88%</p>
                          <p className="font-sans text-[8px] tracking-widest text-neutral-500 uppercase">Retention</p>
                        </div>
                      </div>
                    </div>

                    {/* Legend */}
                    <div className="space-y-4">
                      <div className="flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center space-x-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#c5a059]" />
                          <span className="text-neutral-400">Diamonds & Platinum</span>
                        </div>
                        <span className="font-mono text-neutral-200 font-semibold">50%</span>
                      </div>
                      
                      <div className="flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center space-x-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#F5D76E]" />
                          <span className="text-neutral-400">Gold & Polki Sets</span>
                        </div>
                        <span className="font-mono text-neutral-200 font-semibold">30%</span>
                      </div>

                      <div className="flex items-center justify-between text-xs font-sans">
                        <div className="flex items-center space-x-2">
                          <span className="h-2.5 w-2.5 rounded-full bg-[#8A7320]" />
                          <span className="text-neutral-400">Bridal & Special</span>
                        </div>
                        <span className="font-mono text-neutral-200 font-semibold">20%</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Integrity report warning */}
              <div className="p-4 rounded border border-[#1d2f30] bg-[#0a1617] flex items-center space-x-3">
                <ShieldAlert className="h-5 w-5 text-[#c5a059] shrink-0" />
                <p className="text-[10px] text-neutral-400 leading-relaxed font-sans">
                  <span className="text-neutral-200 font-bold">Automatic Audits Engaged:</span> All sales and inventory evaluations are tied securely to live BIS Hallmark ledgers and GIA verification indices. Discrepancies generate automatic internal security lockdowns.
                </p>
              </div>
            </motion.div>
          )}

          {/* TAB 2: LIVE ORDERS LIST */}
          {activeTab === 'orders' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-x-auto rounded border border-[#1d2f30] bg-[#111e1f]"
            >
              <table className="w-full text-left font-sans text-xs min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#1d2f30] bg-[#111e1f]/60 text-neutral-500 font-display uppercase tracking-wider">
                    <th className="p-4 py-3 font-semibold text-[10px]">Order ID</th>
                    <th className="p-4 py-3 font-semibold text-[10px]">Acquirer</th>
                    <th className="p-4 py-3 font-semibold text-[10px]">Date</th>
                    <th className="p-4 py-3 font-semibold text-[10px]">Acquired items</th>
                    <th className="p-4 py-3 font-semibold text-[10px]">Valuation</th>
                    <th className="p-4 py-3 font-semibold text-[10px]">Security Status</th>
                    <th className="p-4 py-3 font-semibold text-[10px]">Shipment Token</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1d2f30]">
                  {orders.map((ord) => (
                    <tr key={ord.id} className="hover:bg-[#1d2f30]/20 transition-colors">
                      <td className="p-4 font-mono font-bold text-[#c5a059]">{ord.id}</td>
                      <td className="p-4">
                        <div className="font-medium text-neutral-200">{ord.customerName}</div>
                        <div className="text-[10px] text-neutral-500 truncate max-w-[150px]">{ord.customerEmail}</div>
                      </td>
                      <td className="p-4 text-neutral-400">{ord.date}</td>
                      <td className="p-4 max-w-xs">
                        {ord.items.map((it, i) => (
                          <div key={i} className="truncate text-neutral-300" title={it.item.name}>
                            {it.quantity}x {it.item.name} <span className="text-[10px] text-neutral-550">({it.selectedMetal})</span>
                          </div>
                        ))}
                      </td>
                      <td className="p-4 font-mono text-neutral-200 font-bold">${ord.total.toLocaleString()}</td>
                      <td className="p-4">
                        <select
                          value={ord.status}
                          onChange={(e) => onUpdateOrderStatus(ord.id, e.target.value as any)}
                          className={`px-2.5 py-1.5 rounded text-[11px] font-display font-medium uppercase border bg-[#111e1f] cursor-pointer focus:outline-none ${
                            ord.status === 'Delivered'
                              ? 'border-emerald-500/30 text-emerald-400 bg-emerald-500/5'
                              : ord.status === 'Insured Transit'
                              ? 'border-[#c5a059]/30 text-[#c5a059] bg-amber-400/5'
                              : ord.status === 'Processing'
                              ? 'border-sky-500/30 text-sky-400 bg-sky-500/5'
                              : 'border-[#1d2f30] text-neutral-400 bg-[#111e1f]'
                          }`}
                        >
                          <option value="Pending">Pending Auth</option>
                          <option value="Processing">Processing GIA</option>
                          <option value="Insured Transit">Insured Transit</option>
                          <option value="Delivered">Delivered Safely</option>
                        </select>
                      </td>
                      <td className="p-4">
                        {ord.trackingNumber ? (
                          <span className="font-mono text-[10px] text-neutral-400 bg-[#0a1617] px-2 py-1 rounded border border-[#1d2f30]">
                            {ord.trackingNumber}
                          </span>
                        ) : (
                          <button
                            onClick={() => onUpdateOrderStatus(ord.id, 'Insured Transit')}
                            className="text-[10px] font-display uppercase tracking-widest text-[#c5a059] hover:underline"
                          >
                            Assign Shipment
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {/* TAB 3: INVENTORY MANAGER CRUD */}
          {activeTab === 'inventory' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="grid grid-cols-1 lg:grid-cols-12 gap-8"
            >
               {/* Left Column: Form to Edit / Add */}
              {(editingProduct || isAddingNew) ? (
                <div className="lg:col-span-5 rounded border border-[#1d2f30] bg-[#111e1f] p-6 shadow-gold-glow">
                  <div className="flex justify-between items-center border-b border-[#1d2f30] pb-4 mb-6">
                    <h3 className="font-luxury-title text-base text-white">
                      {editingProduct ? 'Modify Masterpiece Record' : 'Catalog New Masterpiece'}
                    </h3>
                    <button
                      onClick={() => { setEditingProduct(null); setIsAddingNew(false); }}
                      className="text-neutral-500 hover:text-white"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>

                  <form onSubmit={handleSaveProductForm} className="space-y-4 text-xs font-sans">
                    {/* Item Name */}
                    <div className="space-y-1">
                      <label className="text-neutral-400">Masterpiece Name</label>
                      <input
                        required
                        type="text"
                        value={formName}
                        onChange={(e) => setFormName(e.target.value)}
                        className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-2.5 px-3 text-neutral-200 placeholder-neutral-700 focus:border-[#c5a059]"
                      />
                    </div>

                    {/* Subtitle */}
                    <div className="space-y-1">
                      <label className="text-neutral-400">Luxury Subtitle</label>
                      <input
                        required
                        type="text"
                        value={formSubtitle}
                        onChange={(e) => setFormSubtitle(e.target.value)}
                        className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-2.5 px-3 text-neutral-200 placeholder-neutral-700 focus:border-[#c5a059]"
                      />
                    </div>

                    {/* Pricing and Stock */}
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-1">
                        <label className="text-neutral-400">Valuation ($)</label>
                        <input
                          required
                          type="number"
                          value={formPrice}
                          onChange={(e) => setFormPrice(Number(e.target.value))}
                          className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-2.5 px-3 text-neutral-200 font-mono focus:border-[#c5a059]"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-neutral-400">Showroom Stock</label>
                        <input
                          required
                          type="number"
                          value={formStock}
                          onChange={(e) => setFormStock(Number(e.target.value))}
                          className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-2.5 px-3 text-neutral-200 font-mono focus:border-[#c5a059]"
                        />
                      </div>
                    </div>

                    {/* Collection Selection */}
                    <div className="space-y-1">
                      <label className="text-neutral-400">Collection allocation</label>
                      <select
                        value={formCollection}
                        onChange={(e) => setFormCollection(e.target.value)}
                        className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-2.5 px-3 text-neutral-200 cursor-pointer focus:border-[#c5a059]"
                      >
                        <option value="Diamond Collection">Diamond Collection</option>
                        <option value="Gold Jewellery">Gold Jewellery</option>
                        <option value="Bridal Collection">Bridal Collection</option>
                        <option value="Wedding Essentials">Wedding Essentials</option>
                        <option value="Daily Elegance">Daily Elegance</option>
                        <option value="Premium Exclusive Collection">Premium Exclusive Collection</option>
                        <option value="New Arrivals">New Arrivals</option>
                        <option value="Best Sellers">Best Sellers</option>
                      </select>
                    </div>

                    {/* Metallurgy comma list */}
                    <div className="space-y-1">
                      <label className="text-neutral-400">Precious metals (comma-separated)</label>
                      <input
                        required
                        type="text"
                        value={formMetals}
                        onChange={(e) => setFormMetals(e.target.value)}
                        className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-2.5 px-3 text-neutral-200 focus:border-[#c5a059]"
                        placeholder="Platinum, 18K Yellow Gold"
                      />
                    </div>

                    {/* Materials Description */}
                    <div className="space-y-1">
                      <label className="text-neutral-400">Materials Spec detailing</label>
                      <input
                        required
                        type="text"
                        value={formMaterials}
                        placeholder="Platinum, GIA certified round diamond"
                        onChange={(e) => setFormMaterials(e.target.value)}
                        className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-2.5 px-3 text-neutral-200 focus:border-[#c5a059]"
                      />
                    </div>

                    {/* Description Text */}
                    <div className="space-y-1">
                      <label className="text-neutral-400">Detailed storytelling description</label>
                      <textarea
                        required
                        rows={3}
                        value={formDesc}
                        onChange={(e) => setFormDesc(e.target.value)}
                        className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-2.5 px-3 text-neutral-200 focus:border-[#c5a059]"
                      />
                    </div>

                    {/* Certification and Cert ID */}
                    <div className="grid grid-cols-1 md:grid-cols-12 gap-3 items-center">
                      <div className="md:col-span-4 flex items-center space-x-2 pt-4">
                        <input
                          type="checkbox"
                          id="certified"
                          checked={formCertified}
                          onChange={(e) => setFormCertified(e.target.checked)}
                          className="h-4 w-4 bg-[#0a1617] rounded border-[#1d2f30]"
                        />
                        <label htmlFor="certified" className="text-neutral-400 cursor-pointer">Certified</label>
                      </div>
                      
                      <div className="md:col-span-8 space-y-1">
                        <label className="text-neutral-400">GIA / BIS Registry ID</label>
                        <input
                          disabled={!formCertified}
                          type="text"
                          value={formCertId}
                          onChange={(e) => setFormCertId(e.target.value)}
                          className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-2.5 px-3 text-neutral-200 font-mono disabled:opacity-40 focus:border-[#c5a059]"
                        />
                      </div>
                    </div>

                    {/* Image URL */}
                    <div className="space-y-1">
                      <label className="text-neutral-400">Masterpiece Image URL (Unsplash or direct)</label>
                      <input
                        type="text"
                        value={formImage}
                        onChange={(e) => setFormImage(e.target.value)}
                        className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-2.5 px-3 text-neutral-200 font-mono focus:border-[#c5a059]"
                      />
                    </div>

                    {/* Actions */}
                    <div className="pt-4 flex space-x-3">
                      <button
                        type="button"
                        onClick={() => { setEditingProduct(null); setIsAddingNew(false); }}
                        className="flex-1 py-3 bg-[#0a1617] hover:bg-[#111e1f] text-neutral-400 text-xs font-display uppercase tracking-wider rounded border border-[#1d2f30] cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        className="flex-1 py-3 bg-gold-gradient text-black font-display font-bold uppercase tracking-wider rounded shadow-gold-glow cursor-pointer"
                      >
                        {editingProduct ? 'Commit' : 'Catalogue'}
                      </button>
                    </div>

                  </form>
                </div>
              ) : (
                /* Information Banner */
                <div className="lg:col-span-4 p-6 rounded border border-[#1d2f30] bg-[#111e1f]/40 text-left space-y-4">
                  <div className="h-10 w-10 rounded border border-[#1d2f30] bg-[#0a1617] flex items-center justify-center text-[#c5a059]">
                    <Layers className="h-5 w-5" />
                  </div>
                  <h4 className="font-luxury-title text-base text-white">Precious Inventory Control</h4>
                  <p className="text-xs text-neutral-400 leading-relaxed">
                    Select a masterpiece from the table to update catalog prices, modify alloy metal alternatives, configure GIA security codes, or declare stock updates.
                  </p>
                  <p className="text-xs text-neutral-550">
                    Changes take effect on the active customer-facing storefront in real time. Persists across browser visits securely.
                  </p>
                </div>
              )}

              {/* Right/Left Column: Products List Table */}
              <div className={(editingProduct || isAddingNew) ? "lg:col-span-7 space-y-4" : "lg:col-span-8 space-y-4"}>
                
                {/* Filters Row */}
                <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
                  <div className="relative w-full md:max-w-xs">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-neutral-500" />
                    <input
                      type="text"
                      placeholder="Search SKU or Name..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full bg-[#0a1617] rounded border border-[#1d2f30] py-2 pl-9 pr-4 text-xs text-neutral-200 focus:border-[#c5a059] focus:outline-none"
                    />
                  </div>

                  <div className="flex items-center space-x-2 w-full md:w-auto">
                    <span className="text-[10px] font-display text-neutral-500 uppercase font-semibold">Filter:</span>
                    <select
                      value={collectionFilter}
                      onChange={(e) => setCollectionFilter(e.target.value)}
                      className="bg-[#0a1617] rounded border border-[#1d2f30] py-2 px-3 text-xs text-neutral-300 focus:outline-none cursor-pointer"
                    >
                      <option value="All">All Collections</option>
                      {collectionsList.map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>

                {/* Table */}
                <div className="overflow-x-auto rounded border border-[#1d2f30] bg-[#111e1f]">
                  <table className="w-full text-left text-xs font-sans min-w-[500px]">
                    <thead>
                      <tr className="border-b border-[#1d2f30] bg-[#111e1f]/60 text-neutral-500 font-display uppercase">
                        <th className="p-3">Masterpiece</th>
                        <th className="p-3">SKU / Collection</th>
                        <th className="p-3">Price</th>
                        <th className="p-3">Stock</th>
                        <th className="p-3 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-[#1d2f30]">
                      {filteredProducts.map((prod) => (
                        <tr key={prod.id} className="hover:bg-[#1d2f30]/20 transition-colors">
                          <td className="p-3 flex items-center space-x-3">
                            <img src={prod.image} alt="" className="h-9 w-9 rounded object-cover border border-[#1d2f30] shrink-0" />
                            <div>
                              <div className="font-semibold text-neutral-200">{prod.name}</div>
                              <div className="text-[10px] text-neutral-500 italic truncate max-w-[150px]">{prod.subtitle}</div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="font-mono text-[10px] text-neutral-300">{prod.sku}</div>
                            <div className="text-[9px] text-neutral-500 font-display uppercase tracking-widest">{prod.collection}</div>
                          </td>
                          <td className="p-3 font-mono font-bold text-[#c5a059]">${prod.price.toLocaleString()}</td>
                          <td className="p-3">
                            <span className={`font-mono font-semibold ${prod.stock <= 2 ? 'text-rose-400' : 'text-neutral-300'}`}>
                              {prod.stock} Units
                            </span>
                          </td>
                          <td className="p-3 text-right space-x-1.5 shrink-0">
                            <button
                               onClick={() => openEditProduct(prod)}
                              className="p-2 rounded bg-[#0a1617] hover:bg-[#111e1f] text-[#c5a059] border border-[#1d2f30] cursor-pointer"
                              title="Edit"
                            >
                              <Edit className="h-3.5 w-3.5" />
                            </button>
                            <button
                              disabled={products.length <= 4} // Do not delete below safe threshold
                              onClick={() => onDeleteProduct(prod.id)}
                              className="p-2 rounded bg-[#0a1617] hover:bg-rose-950/40 text-neutral-500 hover:text-rose-400 border border-[#1d2f30] cursor-pointer disabled:opacity-30"
                              title="Archive / Remove"
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {filteredProducts.length === 0 && (
                  <div className="text-center py-10 bg-[#111e1f]/30 border border-dashed border-[#1d2f30] rounded">
                    <p className="text-neutral-500 font-serif">No products found matching active search parameters.</p>
                  </div>
                )}
              </div>
            </motion.div>
          )}

          {/* TAB 4: CONSULTATIONS & SHOWROOM INQUIRIES */}
          {activeTab === 'consultations' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="overflow-x-auto rounded border border-[#1d2f30] bg-[#111e1f]"
            >
              <table className="w-full text-left font-sans text-xs min-w-[700px]">
                <thead>
                  <tr className="border-b border-[#1d2f30] bg-[#111e1f] text-neutral-500 font-display uppercase tracking-wider">
                    <th className="p-4 py-3 font-semibold text-[10px]">Client</th>
                    <th className="p-4 py-3 font-semibold text-[10px]">Service Requested</th>
                    <th className="p-4 py-3 font-semibold text-[10px]">DateTime Booking</th>
                    <th className="p-4 py-3 font-semibold text-[10px]">Inquiry Narrative</th>
                    <th className="p-4 py-3 font-semibold text-[10px]">Status</th>
                    <th className="p-4 py-3 font-semibold text-[10px] text-right">Concierge Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#1d2f30]">
                  {consultations.map((c) => (
                    <tr key={c.id} className="hover:bg-[#1d2f30]/20 transition-colors">
                      <td className="p-4">
                        <div className="font-semibold text-neutral-200">{c.name}</div>
                        <div className="text-[10px] text-neutral-500 font-mono">{c.phone}</div>
                        <div className="text-[10px] text-neutral-500">{c.email}</div>
                      </td>
                      <td className="p-4">
                        <span className="font-serif text-xs font-semibold text-[#c5a059]">
                          {c.serviceRequested}
                        </span>
                      </td>
                      <td className="p-4 text-neutral-300">
                        <div className="font-medium">{c.date}</div>
                        <div className="text-[10px] text-neutral-500 font-mono">Slot: {c.time}</div>
                      </td>
                      <td className="p-4 max-w-xs text-neutral-400 italic">
                        &ldquo;{c.notes || 'No specialized annotations provided.'}&rdquo;
                      </td>
                      <td className="p-4">
                        <span className={`px-2 py-1 rounded text-[10px] font-display font-bold uppercase ${
                          c.status === 'Completed'
                            ? 'bg-[#0a1617] text-neutral-500 border border-[#1d2f30]'
                            : c.status === 'Cancelled'
                            ? 'bg-rose-400/5 text-rose-400 border border-rose-400/20'
                            : 'bg-[#c5a059]/10 text-[#c5a059] border border-[#c5a059]/30'
                        }`}>
                          {c.status}
                        </span>
                      </td>
                      <td className="p-4 text-right space-x-1.5">
                        {c.status === 'Scheduled' && (
                          <>
                            <button
                              onClick={() => onUpdateConsultationStatus(c.id, 'Completed')}
                              className="px-2.5 py-1.5 rounded bg-[#0a1617] hover:bg-[#111e1f] text-emerald-400 border border-[#1d2f30] text-[10px] font-display font-bold uppercase tracking-wider cursor-pointer"
                            >
                              Confirm Showroom
                            </button>
                            <button
                              onClick={() => onUpdateConsultationStatus(c.id, 'Cancelled')}
                              className="px-2.5 py-1.5 rounded bg-[#0a1617] hover:bg-rose-950/40 text-neutral-500 hover:text-rose-400 border border-[#1d2f30] text-[10px] font-display font-bold uppercase tracking-wider cursor-pointer"
                            >
                              Deny
                            </button>
                          </>
                        )}
                        {c.status !== 'Scheduled' && (
                          <span className="text-[10px] text-neutral-600 font-display tracking-widest uppercase">ARCHIVED</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </motion.div>
          )}

          {/* TAB 5: CUSTOM COMMISSIONS */}
          {activeTab === 'commissions' && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="space-y-6"
            >
              <div className="overflow-x-auto rounded border border-[#1d2f30] bg-[#111e1f]">
                <table className="w-full text-left font-sans text-xs min-w-[800px]">
                  <thead>
                    <tr className="border-b border-[#1d2f30] bg-[#111e1f] text-neutral-500 font-display uppercase tracking-wider">
                      <th className="p-4 py-3 font-semibold text-[10px]">Creation ID</th>
                      <th className="p-4 py-3 font-semibold text-[10px]">Client Details</th>
                      <th className="p-4 py-3 font-semibold text-[10px]">Custom Request Details</th>
                      <th className="p-4 py-3 font-semibold text-[10px]">Reference Image</th>
                      <th className="p-4 py-3 font-semibold text-[10px]">Target Budget</th>
                      <th className="p-4 py-3 font-semibold text-[10px]">Appraised Quote</th>
                      <th className="p-4 py-3 font-semibold text-[10px]">Status</th>
                      <th className="p-4 py-3 font-semibold text-[10px] text-right font-bold">Artisan Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1d2f30]">
                    {commissions.map((c) => (
                      <tr key={c.id} className="hover:bg-[#1d2f30]/20 transition-colors">
                        <td className="p-4 font-mono font-bold text-neutral-300">{c.id}</td>
                        <td className="p-4">
                          <div className="font-semibold text-neutral-200">{c.name}</div>
                          <div className="text-[10px] text-neutral-500 font-mono">{c.phone}</div>
                          <div className="text-[10px] text-neutral-500">{c.email}</div>
                        </td>
                        <td className="p-4 max-w-sm">
                          <span className="font-serif text-xs font-bold text-[#c5a059] block mb-1">
                            {c.jewelType}
                          </span>
                          <p className="text-[11px] text-neutral-400 italic leading-relaxed line-clamp-3">
                            &ldquo;{c.description}&rdquo;
                          </p>
                          <div className="text-[9px] text-neutral-500 mt-1 font-mono">Submitted: {c.date}</div>
                        </td>
                        <td className="p-4">
                          {c.referenceImage ? (
                            <a href={c.referenceImage} target="_blank" rel="noreferrer" className="block h-12 w-12 rounded overflow-hidden border border-[#1d2f30]">
                              <img src={c.referenceImage} alt="Ref" className="h-full w-full object-cover" />
                            </a>
                          ) : (
                            <span className="text-[10px] text-neutral-600">No Image</span>
                          )}
                        </td>
                        <td className="p-4 font-mono font-semibold text-white">
                          ${(c.budget || 0).toLocaleString()}
                        </td>
                        <td className="p-4 font-mono font-bold text-[#c5a059]">
                          {c.quotation ? `$${c.quotation.toLocaleString()}` : (
                            <span className="text-[10px] text-neutral-500 italic">No Quotation</span>
                          )}
                        </td>
                        <td className="p-4">
                          <span className={`px-2 py-1 rounded text-[10px] font-display font-bold uppercase border ${
                            c.status === 'Delivered'
                              ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                              : c.status === 'In Production'
                              ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                              : c.status === 'Approved'
                              ? 'bg-teal-500/10 text-teal-400 border-teal-500/30'
                              : c.status === 'Ready for Delivery'
                              ? 'bg-blue-500/10 text-blue-400 border-blue-500/30'
                              : c.status === 'Under Review'
                              ? 'bg-amber-400/5 text-amber-400 border-amber-400/20'
                              : 'bg-neutral-500/10 text-neutral-400 border-neutral-500/20'
                          }`}>
                            {c.status}
                          </span>
                        </td>
                        <td className="p-4 text-right">
                          <div className="flex flex-col gap-1 items-end">
                            {c.status === 'Pending' && (
                              <button
                                onClick={() => handleUpdateCommissionStatus(c.id, 'Under Review')}
                                className="px-2 py-1 rounded bg-[#0a1617] hover:bg-[#111e1f] text-amber-400 border border-[#1d2f30] text-[9px] font-display font-bold uppercase tracking-wider cursor-pointer w-32 text-center"
                              >
                                Review Request
                              </button>
                            )}

                            {c.status === 'Under Review' && (
                              <div className="flex gap-1 justify-end">
                                <input 
                                  type="number" 
                                  placeholder="Value" 
                                  className="bg-[#0a1617] border border-[#1d2f30] text-white px-2 py-1 text-[10px] font-mono rounded w-16 focus:outline-none"
                                  onKeyDown={(e) => {
                                    if (e.key === 'Enter') {
                                      const val = Number((e.target as HTMLInputElement).value);
                                      if (val > 0) handleSendCommissionQuotation(c.id, val);
                                    }
                                  }}
                                />
                                <button
                                  onClick={(e) => {
                                    const input = (e.currentTarget.previousSibling as HTMLInputElement);
                                    const val = Number(input.value);
                                    if (val > 0) handleSendCommissionQuotation(c.id, val);
                                  }}
                                  className="px-2 py-1 rounded bg-[#c5a059] text-black text-[9px] font-display font-bold uppercase tracking-wider cursor-pointer text-center"
                                >
                                  Quote
                                </button>
                              </div>
                            )}

                            {c.status === 'Under Review' && c.quotation && (
                              <button
                                onClick={() => handleUpdateCommissionStatus(c.id, 'Approved')}
                                className="px-2 py-1 rounded bg-[#0a1617] hover:bg-emerald-950/20 text-emerald-400 border border-[#1d2f30] text-[9px] font-display font-bold uppercase tracking-wider cursor-pointer w-32 text-center"
                              >
                                Approve Design
                              </button>
                            )}

                            {c.status === 'Approved' && (
                              <button
                                onClick={() => handleUpdateCommissionStatus(c.id, 'In Production')}
                                className="px-2 py-1 rounded bg-[#0a1617] hover:bg-purple-950/20 text-purple-400 border border-[#1d2f30] text-[9px] font-display font-bold uppercase tracking-wider cursor-pointer w-32 text-center"
                              >
                                Start Production
                              </button>
                            )}

                            {c.status === 'In Production' && (
                              <button
                                onClick={() => handleUpdateCommissionStatus(c.id, 'Ready for Delivery')}
                                className="px-2 py-1 rounded bg-[#0a1617] hover:bg-blue-950/20 text-blue-400 border border-[#1d2f30] text-[9px] font-display font-bold uppercase tracking-wider cursor-pointer w-32 text-center"
                              >
                                Ready to Ship
                              </button>
                            )}

                            {c.status === 'Ready for Delivery' && (
                              <button
                                onClick={() => handleUpdateCommissionStatus(c.id, 'Delivered')}
                                className="px-2 py-1 rounded bg-gold-gradient text-black text-[9px] font-display font-bold uppercase tracking-wider cursor-pointer w-32 text-center"
                              >
                                Deliver Jewel
                              </button>
                            )}

                            {c.status === 'Delivered' && (
                              <span className="text-[9px] text-neutral-600 font-display tracking-widest uppercase font-semibold">Commission Complete</span>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {commissions.length === 0 && (
                <div className="text-center py-12 bg-[#111e1f]/30 border border-dashed border-[#1d2f30] rounded">
                  <p className="text-neutral-500 font-serif">No custom commissions requested by sovereign clients yet.</p>
                </div>
              )}
            </motion.div>
          )}

        </div>

      </div>

      <AnimatePresence>
        {showAddModal && (
          <AddMasterpieceModal
            isOpen={showAddModal}
            onClose={() => setShowAddModal(false)}
            onAddProduct={onAddProduct}
            onShowToast={showToast}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {toastMessage && (
          <motion.div
            initial={{ opacity: 0, y: 50, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            className="fixed bottom-6 right-6 z-[60] flex items-center space-x-3 rounded border border-[#c5a059]/40 bg-[#111e1f] px-5 py-4 shadow-gold-heavy text-left"
          >
            <Check className="h-5 w-5 text-emerald-400 stroke-[2.5px]" />
            <div className="text-left">
              <p className="text-[11px] font-display uppercase tracking-widest text-neutral-300 font-semibold">Atelier Notification</p>
              <p className="text-xs text-neutral-400 font-sans mt-0.5">{toastMessage}</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}
