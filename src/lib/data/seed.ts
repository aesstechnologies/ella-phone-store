import type {
  Product,
  ProductVariant,
  StoreSettings,
} from "@/types/database";
import { slugify } from "@/lib/utils";

const defaultVariants = (
  productId: string,
  baseStorage: string[],
): ProductVariant[] =>
  baseStorage.flatMap((storage, i) =>
    (["refurbished", "used"] as const).map((condition, j) => ({
      id: `${productId}-v-${i}-${j}`,
      product_id: productId,
      storage,
      color: "Default",
      condition,
      price_adjustment: condition === "refurbished" ? 0 : -20,
      stock_quantity: condition === "refurbished" ? 3 : 2,
    })),
  );

export const defaultStoreSettings: StoreSettings = {
  id: "default",
  store_name: "ELLA — Phone Repair & Store",
  tagline_en: "Phones you'll love. Repairs you can trust.",
  tagline_es: "Celulares que amarás. Reparaciones en las que confías.",
  email: "ellaphonerepair@gmail.com",
  phone: "(555) 012-3456",
  address_line1: "124 Rosewood Lane, Suite B",
  address_line2: null,
  city: "Miami",
  state: "FL",
  zip: "33101",
  country: "US",
  logo_url: "/logo.svg",
  logo_placeholder_url: "/logo-placeholder.svg",
  delivery_radius_km: 15,
  delivery_store_enabled: true,
  delivery_service_enabled: true,
  stripe_enabled: false,
  updated_at: new Date().toISOString(),
};

export const seedProducts: Product[] = [
  {
    id: "p-iphone-15",
    slug: slugify("iPhone 15"),
    name_en: "iPhone 15",
    name_es: "iPhone 15",
    description_en:
      "Best mainstream balance — unlocked, tested, and ready for daily use.",
    description_es:
      "El mejor equilibrio — desbloqueado, probado y listo para el día a día.",
    brand: "Apple",
    base_price: 406.99,
    target_buy_price: 277.74,
    expected_profit: 74.62,
    image_url: null,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    variants: defaultVariants("p-iphone-15", ["128GB", "256GB"]),
  },
  {
    id: "p-iphone-14",
    slug: slugify("iPhone 14"),
    name_en: "iPhone 14",
    name_es: "iPhone 14",
    description_en: "Broad buyer demand — excellent value refurbished pick.",
    description_es: "Alta demanda — excelente valor reacondicionado.",
    brand: "Apple",
    base_price: 296.99,
    target_buy_price: 182.65,
    expected_profit: 69.61,
    image_url: null,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    variants: defaultVariants("p-iphone-14", ["128GB", "256GB"]),
  },
  {
    id: "p-iphone-13",
    slug: slugify("iPhone 13"),
    name_en: "iPhone 13",
    name_es: "iPhone 13",
    description_en: "Accessible fast-moving option for smart shoppers.",
    description_es: "Opción accesible y popular para compradores inteligentes.",
    brand: "Apple",
    base_price: 273.99,
    target_buy_price: 162.76,
    expected_profit: 68.57,
    image_url: null,
    is_featured: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    variants: defaultVariants("p-iphone-13", ["128GB"]),
  },
  {
    id: "p-iphone-15-pro",
    slug: slugify("iPhone 15 Pro"),
    name_en: "iPhone 15 Pro",
    name_es: "iPhone 15 Pro",
    description_en: "Premium without Pro Max capital — pro features, smart price.",
    description_es: "Premium sin el precio Pro Max — funciones pro, precio inteligente.",
    brand: "Apple",
    base_price: 503.99,
    target_buy_price: 333.1,
    expected_profit: 107.53,
    image_url: null,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    variants: defaultVariants("p-iphone-15-pro", ["128GB", "256GB", "512GB"]),
  },
  {
    id: "p-iphone-14-pro-max",
    slug: slugify("iPhone 14 Pro Max"),
    name_en: "iPhone 14 Pro Max",
    name_es: "iPhone 14 Pro Max",
    description_en: "Popular large premium model with stunning display.",
    description_es: "Modelo premium grande popular con pantalla impresionante.",
    brand: "Apple",
    base_price: 451.99,
    target_buy_price: 316.65,
    expected_profit: 76.67,
    image_url: null,
    is_featured: false,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    variants: defaultVariants("p-iphone-14-pro-max", ["256GB", "512GB"]),
  },
  {
    id: "p-galaxy-s24-ultra",
    slug: slugify("Galaxy S24 Ultra"),
    name_en: "Galaxy S24 Ultra",
    name_es: "Galaxy S24 Ultra",
    description_en: "Best Android premium candidate — S Pen, powerhouse camera.",
    description_es: "El mejor Android premium — S Pen, cámara potente.",
    brand: "Samsung",
    base_price: 527.99,
    target_buy_price: 353.85,
    expected_profit: 108.62,
    image_url: null,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    variants: defaultVariants("p-galaxy-s24-ultra", ["256GB", "512GB"]),
  },
  {
    id: "p-iphone-15-pro-max",
    slug: slugify("iPhone 15 Pro Max"),
    name_en: "iPhone 15 Pro Max",
    name_es: "iPhone 15 Pro Max",
    description_en: "Highest dollar profit potential — flagship experience.",
    description_es: "Máximo potencial — experiencia flagship completa.",
    brand: "Apple",
    base_price: 596.99,
    target_buy_price: 413.5,
    expected_profit: 111.76,
    image_url: null,
    is_featured: true,
    is_active: true,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
    variants: defaultVariants("p-iphone-15-pro-max", ["256GB", "512GB", "1TB"]),
  },
];

export function getProductName(product: Product, locale: string) {
  return locale === "es" ? product.name_es : product.name_en;
}

export function getProductDescription(product: Product, locale: string) {
  return locale === "es" ? product.description_es : product.description_en;
}

export function getStoreTagline(settings: StoreSettings, locale: string) {
  return locale === "es" ? settings.tagline_es : settings.tagline_en;
}

export function calculateVariantPrice(
  basePrice: number,
  variant?: ProductVariant,
) {
  return basePrice + (variant?.price_adjustment ?? 0);
}

export function calculateMonthlyPrice(total: number, months = 24) {
  return total / months;
}
