import type { Order, Repair } from "@/types/database";

export const devMockRepairs: Repair[] = [
  {
    id: "dev-repair-1",
    user_id: "dev-customer",
    device_model: "iPhone 14 Pro",
    issue_description: "Screen cracked after drop — touch still works.",
    status: "in_repair",
    estimated_cost: 149,
    notes: "We will notify you when ready for pickup.",
    admin_notes: null,
    created_at: new Date(Date.now() - 3 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
  {
    id: "dev-repair-2",
    user_id: "dev-customer",
    device_model: "Galaxy S24",
    issue_description: "Battery drains quickly, gets warm while charging.",
    status: "ready",
    estimated_cost: 89,
    notes: "Ready for pickup at the store.",
    admin_notes: null,
    created_at: new Date(Date.now() - 10 * 86400000).toISOString(),
    updated_at: new Date().toISOString(),
  },
];

export const devMockOrders: Order[] = [
  {
    id: "dev-order-1",
    user_id: "dev-customer",
    product_id: "p-iphone-15",
    variant_id: null,
    quantity: 1,
    fulfillment_type: "pickup",
    status: "pending",
    customer_name: "Demo Customer",
    customer_email: "customer@example.com",
    customer_phone: null,
    delivery_address: null,
    notes: "Prefer pickup on Saturday.",
    stripe_payment_intent_id: null,
    total_amount: 406.99,
    created_at: new Date(Date.now() - 1 * 86400000).toISOString(),
  },
];
