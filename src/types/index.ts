export type Role = 'SUPER_ADMIN' | 'SHOP_ADMIN' | 'MASTER' | 'USER';
export type ProductType = 'NEW' | 'USED' | 'PART';
export type OrderStatus = 'PENDING' | 'CONFIRMED' | 'SHIPPING' | 'DELIVERED' | 'CANCELLED' | 'IN_PROGRESS' | 'DONE';
export type OrderType = 'PRODUCT' | 'SERVICE';
export type ShopStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED';
export type MasterStatus = 'ACTIVE' | 'INACTIVE' | 'BUSY';

export interface User {
  id: number;
  name: string;
  email: string;
  tel: string;
  address?: string;
  role: Role;
  createdAt: string;
  shop?: { id: number; name: string; status: ShopStatus } | null;
  master?: { id: number; specialty: string; rating: number; status: MasterStatus } | null;
}

export interface Shop {
  id: number;
  name: string;
  tel: string;
  email: string;
  address: string;
  type: string;
  status: ShopStatus;
  joinedAt: string;
  owner?: { id: number; name: string; email: string };
  _count?: { products: number; orders: number };
}

export interface Master {
  id: number;
  name: string;
  specialty: string;
  tel: string;
  email: string;
  address?: string;
  rating: number;
  status: MasterStatus;
  joinedAt: string;
  _count?: { services: number; orders: number; reviews: number };
}

export interface Product {
  id: number;
  name: string;
  brand: string;
  price: number;
  stock: number;
  type: ProductType;
  memory?: string;
  emoji?: string;
  color?: string;
  description?: string;
  condition?: string;
  shopId: number;
  shop?: { id: number; name: string; address: string };
  createdAt: string;
}

export interface Service {
  id: number;
  name: string;
  price: number;
  duration: number;
  emoji?: string;
  description?: string;
  isActive: boolean;
  masterId: number;
  master?: { id: number; name: string; specialty: string; rating: number };
  createdAt: string;
}

export interface Order {
  id: number;
  type: OrderType;
  amount: number;
  status: OrderStatus;
  promoCode?: string;
  createdAt: string;
  user?: { id: number; name: string; tel: string };
  product?: { id: number; name: string; brand: string; emoji?: string } | null;
  service?: { id: number; name: string; emoji?: string } | null;
  master?: { id: number; name: string } | null;
  shop?: { id: number; name: string } | null;
  repair?: { id: number; currentStep: number; completedAt?: string } | null;
}

export interface RepairStep {
  id: number;
  step: number;
  label: string;
  status: 'pending' | 'done';
  note?: string;
  completedAt?: string;
}

export interface Repair {
  id: number;
  currentStep: number;
  model?: string;
  notes?: string;
  warrantyDays: number;
  startedAt: string;
  completedAt?: string;
  steps: RepairStep[];
  master?: { id: number; name: string; specialty: string };
}

export interface Review {
  id: number;
  rating: number;
  comment?: string;
  createdAt: string;
  user?: { id: number; name: string };
  master?: { id: number; name: string };
}

export interface PromoCode {
  id: number;
  code: string;
  discount: number;
  maxUses: number;
  usedCount: number;
  isActive: boolean;
  expiresAt?: string;
  createdAt: string;
}

export interface CartItem {
  id: number;
  quantity: number;
  product: { id: number; name: string; brand: string; price: number; stock: number; emoji?: string; color?: string };
}
