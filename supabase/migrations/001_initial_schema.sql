-- ELLA Phone Store — initial schema
-- Run in Supabase SQL Editor or via CLI

-- Profiles (extends auth.users)
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  locale text not null default 'en',
  created_at timestamptz not null default now()
);

-- Store settings (single row)
create table if not exists public.store_settings (
  id uuid primary key default gen_random_uuid(),
  store_name text not null default 'ELLA — Phone Repair & Store',
  tagline_en text not null default 'Phones you''ll love. Repairs you can trust.',
  tagline_es text not null default 'Celulares que amarás. Reparaciones en las que confías.',
  email text not null default 'ellaphonerepair@gmail.com',
  phone text,
  address_line1 text not null default '124 Rosewood Lane, Suite B',
  address_line2 text,
  city text not null default 'Miami',
  state text not null default 'FL',
  zip text not null default '33101',
  country text not null default 'US',
  logo_url text not null default '/logo.svg',
  logo_placeholder_url text not null default '/logo-placeholder.svg',
  delivery_radius_km numeric not null default 15,
  delivery_store_enabled boolean not null default true,
  delivery_service_enabled boolean not null default true,
  stripe_enabled boolean not null default false,
  updated_at timestamptz not null default now()
);

-- Products
create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  slug text unique not null,
  name_en text not null,
  name_es text not null,
  description_en text,
  description_es text,
  brand text not null,
  base_price numeric not null,
  target_buy_price numeric,
  expected_profit numeric,
  image_url text,
  is_featured boolean not null default false,
  is_active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Product variants
create table if not exists public.product_variants (
  id uuid primary key default gen_random_uuid(),
  product_id uuid not null references public.products(id) on delete cascade,
  storage text not null,
  color text not null default 'Default',
  condition text not null check (condition in ('new', 'refurbished', 'used')),
  price_adjustment numeric not null default 0,
  stock_quantity integer not null default 0
);

-- Orders (purchase requests)
create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  product_id uuid not null references public.products(id),
  variant_id uuid references public.product_variants(id),
  quantity integer not null default 1,
  fulfillment_type text not null check (fulfillment_type in ('pickup', 'store_delivery', 'delivery_service')),
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'ready', 'completed', 'cancelled')),
  customer_name text not null,
  customer_email text not null,
  customer_phone text,
  delivery_address jsonb,
  notes text,
  stripe_payment_intent_id text,
  total_amount numeric not null,
  created_at timestamptz not null default now()
);

-- Repairs
create table if not exists public.repairs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references auth.users(id) on delete set null,
  device_model text not null,
  issue_description text not null,
  status text not null default 'received' check (status in ('received', 'diagnosing', 'in_repair', 'ready', 'picked_up', 'cancelled')),
  estimated_cost numeric,
  notes text,
  admin_notes text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- Chat
create table if not exists public.conversations (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  subject text,
  created_at timestamptz not null default now()
);

create table if not exists public.messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid not null references public.conversations(id) on delete cascade,
  sender_id uuid not null references auth.users(id),
  content text not null,
  created_at timestamptz not null default now()
);

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, full_name, role)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'full_name', new.email),
    coalesce(new.raw_user_meta_data->>'role', 'customer')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- RLS
alter table public.profiles enable row level security;
alter table public.store_settings enable row level security;
alter table public.products enable row level security;
alter table public.product_variants enable row level security;
alter table public.orders enable row level security;
alter table public.repairs enable row level security;
alter table public.conversations enable row level security;
alter table public.messages enable row level security;

-- Helper: is admin
create or replace function public.is_admin()
returns boolean as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$ language sql security definer stable;

-- Profiles policies
create policy "Users can view own profile" on public.profiles
  for select using (auth.uid() = id);
create policy "Users can update own profile" on public.profiles
  for update using (auth.uid() = id);
create policy "Admins can view all profiles" on public.profiles
  for select using (public.is_admin());

-- Store settings: public read, admin write
create policy "Anyone can read store settings" on public.store_settings
  for select using (true);
create policy "Admins can update store settings" on public.store_settings
  for all using (public.is_admin());

-- Products: public read active, admin full
create policy "Anyone can read active products" on public.products
  for select using (is_active = true or public.is_admin());
create policy "Admins manage products" on public.products
  for all using (public.is_admin());

create policy "Anyone can read variants of active products" on public.product_variants
  for select using (
    exists (
      select 1 from public.products p
      where p.id = product_id and (p.is_active = true or public.is_admin())
    )
  );
create policy "Admins manage variants" on public.product_variants
  for all using (public.is_admin());

-- Orders
create policy "Users view own orders" on public.orders
  for select using (auth.uid() = user_id or public.is_admin());
create policy "Anyone can create orders" on public.orders
  for insert with check (true);
create policy "Admins manage orders" on public.orders
  for update using (public.is_admin());

-- Repairs
create policy "Users view own repairs" on public.repairs
  for select using (auth.uid() = user_id or public.is_admin());
create policy "Authenticated users create repairs" on public.repairs
  for insert with check (auth.uid() = user_id or user_id is null);
create policy "Admins manage repairs" on public.repairs
  for all using (public.is_admin());

-- Chat
create policy "Users view own conversations" on public.conversations
  for select using (auth.uid() = user_id or public.is_admin());
create policy "Users create conversations" on public.conversations
  for insert with check (auth.uid() = user_id);
create policy "Users view messages in own conversations" on public.messages
  for select using (
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
      and (c.user_id = auth.uid() or public.is_admin())
    )
  );
create policy "Users send messages in own conversations" on public.messages
  for insert with check (
    auth.uid() = sender_id and
    exists (
      select 1 from public.conversations c
      where c.id = conversation_id
      and (c.user_id = auth.uid() or public.is_admin())
    )
  );

-- Realtime for chat
alter publication supabase_realtime add table public.messages;

-- Seed default store settings row
insert into public.store_settings (store_name, email)
values ('ELLA — Phone Repair & Store', 'ellaphonerepair@gmail.com')
on conflict do nothing;
