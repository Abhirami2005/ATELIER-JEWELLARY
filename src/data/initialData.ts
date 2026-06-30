import { JewelryItem, Order, Consultation } from '../types';

export const INITIAL_PRODUCTS: JewelryItem[] = [
  // 1. Diamond Collection
  {
    id: 'd1',
    name: 'The Eternal Solitaire Ring',
    subtitle: 'Classic Platinum D-Flawless',
    description: 'A breathtaking 2.5-carat round brilliant-cut diamond, D color, Flawless clarity, set in an elegant four-prong platinum band. Designed to capture and reflect light with unmatched brilliance.',
    price: 18500,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    collection: 'Diamond Collection',
    metalOptions: ['Platinum', '18K White Gold', '18K Yellow Gold'],
    stock: 3,
    certified: true,
    certId: 'GIA-2409854721',
    sku: 'ATL-DM-SR01',
    caratWeight: 2.5,
    materials: 'Platinum, GIA Certified Diamond (D, FL)'
  },
  {
    id: 'd2',
    name: 'Aura Diamond Choker',
    subtitle: 'Cascading Radiance Choker',
    description: 'A masterpiece of high jewelry, featuring 15 carats of hand-selected pear and brilliant-cut diamonds cascading down a fluid 18K white gold setting.',
    price: 42000,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?auto=format&fit=crop&w=800&q=80',
    collection: 'Diamond Collection',
    metalOptions: ['18K White Gold', 'Platinum'],
    stock: 1,
    certified: true,
    certId: 'HRD-202611943',
    sku: 'ATL-DM-CK02',
    caratWeight: 15.2,
    materials: '18K White Gold, VVS diamonds'
  },

  // 2. Gold Jewellery
  {
    id: 'g1',
    name: 'The Royal Peacock Jhumkas',
    subtitle: 'Heritage Filigree & Ruby Accents',
    description: 'Handcrafted in 22K yellow gold, these exquisite Jhumka earrings display traditional Indian peacock carvings, intricate gold granulation, and teardrop ruby droplets.',
    price: 3600,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1635767798638-3e25273a8236?auto=format&fit=crop&w=800&q=80',
    collection: 'Gold Jewellery',
    metalOptions: ['22K Yellow Gold'],
    stock: 5,
    certified: true,
    certId: 'BIS-916-G8374',
    sku: 'ATL-GD-JK01',
    materials: '22K Yellow Gold, Burmese Rubies'
  },
  {
    id: 'g2',
    name: 'Kundan Antique Kada',
    subtitle: 'Traditional Floral Enameling',
    description: 'A rigid openable cuff bangle (Kada) in 22K gold, decorated with pure Kundan stone-setting and reverse-side Meenakari floral hand-enameling.',
    price: 5200,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80',
    collection: 'Gold Jewellery',
    metalOptions: ['22K Yellow Gold', '22K Antique Gold'],
    stock: 4,
    certified: true,
    certId: 'BIS-916-K3245',
    sku: 'ATL-GD-KD02',
    materials: '22K Gold, Uncut Kundan, Fine Enamel'
  },

  // 3. Bridal Collection
  {
    id: 'b1',
    name: 'The Maharaja Heritage Set',
    subtitle: 'Polki & Emerald Bridal Statement',
    description: 'An majestic bridal masterpiece. Featuring uncut Polki diamonds framed by fine gold foil settings and suspended with premium Zambian emerald beads.',
    price: 29500,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80',
    collection: 'Bridal Collection',
    metalOptions: ['22K Yellow Gold', '18K Rose Gold'],
    stock: 2,
    certified: true,
    certId: 'ATL-CERT-BR908',
    sku: 'ATL-BR-MS01',
    caratWeight: 24.5,
    materials: '22K Gold, Polki Diamonds, Emerald Beads'
  },
  {
    id: 'b2',
    name: 'Noor Bridal Mathapatti',
    subtitle: 'Intricate Royal Head Ornament',
    description: 'A delicate headpiece representing royal Mughal heritage, designed with gold filigree, freshwater pearls, and central crescent-shaped Chandbali motifs.',
    price: 4100,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=800&q=80',
    collection: 'Bridal Collection',
    metalOptions: ['22K Yellow Gold'],
    stock: 3,
    certified: true,
    certId: 'BIS-916-MP129',
    sku: 'ATL-BR-MP02',
    materials: '22K Gold, Seed Pearls, Kundan'
  },

  // 4. Wedding Essentials
  {
    id: 'w1',
    name: 'Saptapadi Wedding Band Set',
    subtitle: 'His & Hers Textured Gold Bands',
    description: 'Matching bands featuring an elegant hand-chiseled raw gold texture, symbolize the beautiful sacred union of marriage. Exquisitely rounded comfort-fit inner profiling.',
    price: 2400,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1617038260897-41a1f14a8ca0?auto=format&fit=crop&w=800&q=80',
    collection: 'Wedding Essentials',
    metalOptions: ['18K Yellow Gold', 'Platinum', '18K Rose Gold'],
    stock: 12,
    certified: true,
    certId: 'ATL-CERT-WB441',
    sku: 'ATL-WD-BS01',
    materials: '18K Solid Gold'
  },
  {
    id: 'w2',
    name: 'Mangalsutra Moderne',
    subtitle: 'Contemporary Diamond Floating Bead',
    description: 'A contemporary take on the traditional sacred thread. Minimal black onyx beads set on a micro-chain, supporting a brilliant floating bezel baguette diamond.',
    price: 1800,
    rating: 4.8,
    image: 'https://images.unsplash.com/photo-1603561591411-07134e71a2a9?auto=format&fit=crop&w=800&q=80',
    collection: 'Wedding Essentials',
    metalOptions: ['18K Yellow Gold', '18K White Gold', '18K Rose Gold'],
    stock: 8,
    certified: true,
    certId: 'GIA-99204128',
    sku: 'ATL-WD-MS02',
    caratWeight: 0.35,
    materials: '18K Yellow Gold, Baguette Diamond, Onyx'
  },

  // 5. Daily Elegance
  {
    id: 'e1',
    name: 'Floating Solitaire Pendant',
    subtitle: 'Minimalist 18K Rose Gold Chain',
    description: 'A brilliant 0.75-carat round diamond appearing to float on a nearly invisible, diamond-cut 18K rose gold chain. Perfect for effortless luxury every single day.',
    price: 2900,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1535632066927-ab7c9ab60908?auto=format&fit=crop&w=800&q=80',
    collection: 'Daily Elegance',
    metalOptions: ['18K Rose Gold', '18K White Gold', '18K Yellow Gold'],
    stock: 15,
    certified: true,
    certId: 'GIA-5561028',
    sku: 'ATL-DE-PD01',
    caratWeight: 0.75,
    materials: '18K Rose Gold, Brilliant Round Diamond'
  },
  {
    id: 'e2',
    name: 'Trinity Gold Huggies',
    subtitle: 'Interlocked Three-Tone Bands',
    description: 'Stylish interlocking hoops of 18K yellow, white, and rose gold. A sleek, highly versatile design that complements both corporate and casual wear.',
    price: 1250,
    rating: 4.7,
    image: 'https://images.unsplash.com/photo-1611085583191-a3b1a30a5a40?auto=format&fit=crop&w=800&q=80',
    collection: 'Daily Elegance',
    metalOptions: ['18K Three-Tone Gold'],
    stock: 20,
    certified: true,
    certId: 'BIS-750-HG892',
    sku: 'ATL-DE-HG02',
    materials: '18K Yellow, White, and Rose Gold'
  },

  // 6. Premium Exclusive Collection
  {
    id: 'p1',
    name: 'The Empress Emerald Necklace',
    subtitle: 'Investment Grade Zamibian Emerald',
    description: 'A heavy luxury collar necklace focusing on a striking 8-carat oval Zambian Emerald, surrounded by a crown-like array of marquise and pear diamonds.',
    price: 68000,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1602751584552-8ba73aad10e1?auto=format&fit=crop&w=800&q=80',
    collection: 'Premium Exclusive Collection',
    metalOptions: ['Platinum', '18K White Gold'],
    stock: 1,
    certified: true,
    certId: 'Gubelin-90831',
    sku: 'ATL-EX-NL01',
    caratWeight: 14.8,
    materials: 'Platinum, 8ct Zambian Emerald, F-VVS Diamonds'
  },

  // 7. New Arrivals
  {
    id: 'n1',
    name: 'Chevron Diamond Cuff',
    subtitle: 'Geometric Contemporary Wrap',
    description: 'An architectural, bold cuff bracelet featuring geometric chevron patterns, set pavé with rare black and classic white brilliant-cut diamonds.',
    price: 9200,
    rating: 4.9,
    image: 'https://images.unsplash.com/photo-1611591437281-460bfbe1220a?auto=format&fit=crop&w=800&q=80',
    collection: 'New Arrivals',
    metalOptions: ['18K White Gold', '18K Yellow Gold'],
    stock: 4,
    certified: true,
    certId: 'GIA-88120349',
    sku: 'ATL-NA-CF01',
    caratWeight: 3.2,
    materials: '18K White Gold, White & Black Pavé Diamonds'
  },

  // 8. Best Sellers
  {
    id: 's1',
    name: 'The Atelier Signature Ring',
    subtitle: 'Double-Halo Split Shank Oval Diamond',
    description: 'Our most-coveted engagement masterpiece. A magnificent 1.5-carat oval center diamond surrounded by two micro-pavé halos on a split-shank platinum band.',
    price: 11400,
    rating: 5.0,
    image: 'https://images.unsplash.com/photo-1605100804763-247f67b3557e?auto=format&fit=crop&w=800&q=80',
    collection: 'Best Sellers',
    metalOptions: ['Platinum', '18K White Gold', '18K Rose Gold'],
    stock: 6,
    certified: true,
    certId: 'GIA-44018247',
    sku: 'ATL-BS-RG01',
    caratWeight: 2.1,
    materials: 'Platinum, Certified Oval Diamond'
  }
];

export const INITIAL_ORDERS: Order[] = [
  {
    id: 'ORD-8941',
    customerName: 'Aarav Malhotra',
    customerEmail: 'aarav.m@gmail.com',
    customerPhone: '+91 98123 45678',
    items: [
      {
        item: INITIAL_PRODUCTS[0], // Solitaire Ring
        quantity: 1,
        selectedMetal: 'Platinum',
        selectedSize: '6'
      }
    ],
    total: 18500,
    status: 'Insured Transit',
    date: '2026-06-23',
    shippingAddress: '45, Lodhi Estate, New Delhi, 110003',
    trackingNumber: 'ATL-SHIP-9923812'
  },
  {
    id: 'ORD-7624',
    customerName: 'Meera Deshmukh',
    customerEmail: 'meera.deshmukh@yahoo.com',
    customerPhone: '+91 91234 56789',
    items: [
      {
        item: INITIAL_PRODUCTS[2], // Peacock Jhumkas
        quantity: 1,
        selectedMetal: '22K Yellow Gold',
        selectedSize: 'Standard'
      },
      {
        item: INITIAL_PRODUCTS[7], // Daily Elegance Chain
        quantity: 1,
        selectedMetal: '18K Rose Gold',
        selectedSize: '16 inches'
      }
    ],
    total: 4850,
    status: 'Delivered',
    date: '2026-06-18',
    shippingAddress: 'B-302, Marina Towers, Bandra West, Mumbai, 400050',
    trackingNumber: 'ATL-SHIP-7712398'
  },
  {
    id: 'ORD-4122',
    customerName: 'Devika Sen',
    customerEmail: 'devika.sen@outlook.com',
    customerPhone: '+91 88776 55443',
    items: [
      {
        item: INITIAL_PRODUCTS[6], // Saptapadi Bands
        quantity: 1,
        selectedMetal: 'Platinum',
        selectedSize: '7 & 10'
      }
    ],
    total: 2400,
    status: 'Pending',
    date: '2026-06-25',
    shippingAddress: 'Flat 7A, Regency Court, Ballygunge, Kolkata, 700019'
  }
];

export const INITIAL_CONSULTATIONS: Consultation[] = [
  {
    id: 'CNS-201',
    name: 'Vikram Sethi',
    email: 'vikram.sethi@gmail.com',
    phone: '+91 95432 10987',
    date: '2026-06-27',
    time: '14:30',
    serviceRequested: 'Bespoke Design',
    notes: 'Looking to co-design a custom emerald engagement ring incorporating family heirloom diamonds.',
    status: 'Scheduled'
  },
  {
    id: 'CNS-202',
    name: 'Sanjana Kapoor',
    email: 'sanjana.kapoor@gmail.com',
    phone: '+91 96543 21098',
    date: '2026-06-29',
    time: '11:00',
    serviceRequested: 'Bridal Consultation',
    notes: 'Bridal neckwear and Jhumkas matching with crimson lehenga for wedding in December.',
    status: 'Scheduled'
  }
];
