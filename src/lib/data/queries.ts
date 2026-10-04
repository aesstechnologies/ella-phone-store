import type {
  Order,
  Product,
  Repair,
  StoreSettings,
} from "@/types/database";
import {
  defaultStoreSettings,
  seedProducts,
} from "@/lib/data/seed";
import { devMockOrders, devMockRepairs } from "@/lib/data/dev-mock";
import { getDevSession, isDevUserId } from "@/lib/dev-auth";
import { createClientOrNull } from "@/lib/supabase/server";

export async function getStoreSettings(): Promise<StoreSettings> {
  const supabase = await createClientOrNull();
  if (!supabase) return defaultStoreSettings;

  const { data } = await supabase
    .from("store_settings")
    .select("*")
    .limit(1)
    .single();

  return data ?? defaultStoreSettings;
}

export async function getProducts(): Promise<Product[]> {
  const supabase = await createClientOrNull();
  if (!supabase) return seedProducts.filter((p) => p.is_active);

  const { data: products } = await supabase
    .from("products")
    .select("*, variants:product_variants(*)")
    .eq("is_active", true)
    .order("base_price", { ascending: false });

  if (!products?.length) return seedProducts.filter((p) => p.is_active);
  return products as Product[];
}

export async function getProductBySlug(slug: string): Promise<Product | null> {
  const supabase = await createClientOrNull();
  if (!supabase) {
    return seedProducts.find((p) => p.slug === slug) ?? null;
  }

  const { data } = await supabase
    .from("products")
    .select("*, variants:product_variants(*)")
    .eq("slug", slug)
    .eq("is_active", true)
    .single();

  if (!data) {
    return seedProducts.find((p) => p.slug === slug) ?? null;
  }

  return data as Product;
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const products = await getProducts();
  return products.filter((p) => p.is_featured).slice(0, 4);
}

export async function getCurrentProfile() {
  const devSession = await getDevSession();
  if (devSession) return devSession;

  const supabase = await createClientOrNull();
  if (!supabase) return null;

  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("id", user.id)
    .single();

  return profile ? { user, profile } : { user, profile: null };
}

export async function getUserRepairs(userId: string): Promise<Repair[]> {
  if (isDevUserId(userId)) return devMockRepairs;

  const supabase = await createClientOrNull();
  if (!supabase) return [];

  const { data } = await supabase
    .from("repairs")
    .select("*")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data as Repair[]) ?? [];
}

export async function getUserOrders(userId: string): Promise<Order[]> {
  if (isDevUserId(userId)) return devMockOrders;

  const supabase = await createClientOrNull();
  if (!supabase) return [];

  const { data } = await supabase
    .from("orders")
    .select("*, product:products(*)")
    .eq("user_id", userId)
    .order("created_at", { ascending: false });

  return (data as Order[]) ?? [];
}

export async function isAdmin(): Promise<boolean> {
  const session = await getCurrentProfile();
  return session?.profile?.role === "admin";
}

export async function getAllProductsAdmin(): Promise<Product[]> {
  const supabase = await createClientOrNull();
  if (!supabase) return seedProducts;

  const { data } = await supabase
    .from("products")
    .select("*, variants:product_variants(*)")
    .order("created_at", { ascending: false });

  return (data as Product[]) ?? seedProducts;
}

export async function getAllRepairsAdmin(): Promise<Repair[]> {
  const supabase = await createClientOrNull();
  if (!supabase) return [];

  const { data } = await supabase
    .from("repairs")
    .select("*")
    .order("created_at", { ascending: false });

  return (data as Repair[]) ?? [];
}

export async function getAllOrdersAdmin(): Promise<Order[]> {
  const supabase = await createClientOrNull();
  if (!supabase) return [];

  const { data } = await supabase
    .from("orders")
    .select("*, product:products(*)")
    .order("created_at", { ascending: false });

  return (data as Order[]) ?? [];
}
