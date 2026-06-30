export interface JewelryItem {
  id: string;
  name: string;
  subtitle: string;
  description: string;
  price: number;
  rating: number;
  image: string;
  collection: string;
  metalOptions: string[];
  stock: number;
  certified: boolean;
  certId: string;
  sku: string;
  caratWeight?: number;
  materials: string;
}

export interface CartItem {
  item: JewelryItem;
  quantity: number;
  selectedMetal: string;
  selectedSize: string;
}

export interface Order {
  id: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Processing' | 'Insured Transit' | 'Delivered';
  date: string;
  shippingAddress: string;
  trackingNumber?: string;
}

export interface Consultation {
  id: string;
  name: string;
  email: string;
  phone: string;
  date: string;
  time: string;
  serviceRequested: 'Bespoke Design' | 'Bridal Consultation' | 'Sizing & Care' | 'Private Showroom Viewing';
  notes?: string;
  status: 'Scheduled' | 'Completed' | 'Cancelled';
}
