export type UserRole = "customer" | "admin";

export type RepairStatus =
  | "received"
  | "diagnosing"
  | "in_repair"
  | "ready"
  | "picked_up"
  | "cancelled";

export type OrderStatus =
  | "pending"
  | "confirmed"
  | "ready"
  | "completed"
  | "cancelled";

export type FulfillmentType = "pickup" | "store_delivery" | "delivery_service";

export type ProductCondition = "new" | "refurbished" | "used";

export interface Profile {
  id: string;
  full_name: string | null;
  phone: string | null;
  role: UserRole;
  locale: string;
  created_at: string;
}

export interface StoreSettings {
  id: string;
  store_name: string;
  tagline_en: string;
  tagline_es: string;
  email: string;
  phone: string | null;
  address_line1: string;
  address_line2: string | null;
  city: string;
  state: string;
  zip: string;
  country: string;
  logo_url: string;
  logo_placeholder_url: string;
  delivery_radius_km: number;
  delivery_store_enabled: boolean;
  delivery_service_enabled: boolean;
  stripe_enabled: boolean;
  updated_at: string;
}

export interface Product {
  id: string;
  slug: string;
  name_en: string;
  name_es: string;
  description_en: string | null;
  description_es: string | null;
  brand: string;
  base_price: number;
  target_buy_price: number | null;
  expected_profit: number | null;
  image_url: string | null;
  is_featured: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
  variants?: ProductVariant[];
}

export interface ProductVariant {
  id: string;
  product_id: string;
  storage: string;
  color: string;
  condition: ProductCondition;
  price_adjustment: number;
  stock_quantity: number;
}

export interface Order {
  id: string;
  user_id: string | null;
  product_id: string;
  variant_id: string | null;
  quantity: number;
  fulfillment_type: FulfillmentType;
  status: OrderStatus;
  customer_name: string;
  customer_email: string;
  customer_phone: string | null;
  delivery_address: Record<string, string> | null;
  notes: string | null;
  stripe_payment_intent_id: string | null;
  total_amount: number;
  created_at: string;
  product?: Product;
}

export interface Repair {
  id: string;
  user_id: string | null;
  device_model: string;
  issue_description: string;
  status: RepairStatus;
  estimated_cost: number | null;
  notes: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface Conversation {
  id: string;
  user_id: string;
  subject: string | null;
  created_at: string;
}

export interface Message {
  id: string;
  conversation_id: string;
  sender_id: string;
  content: string;
  created_at: string;
}

export interface PurchaseRequest {
  productId: string;
  variantId?: string;
  fulfillmentType: FulfillmentType;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  deliveryAddress?: Record<string, string>;
  notes?: string;
}
