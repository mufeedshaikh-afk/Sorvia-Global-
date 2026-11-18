-- ==============================================================================
-- SorviaGlobal - Supabase PostgreSQL Schema
-- ==============================================================================

-- 1. EXTENSIONS
create extension if not exists "uuid-ossp";

-- 2. PRODUCTS TABLE
create table if not exists public.products (
  id text primary key,
  sku text unique not null,
  name text not null,
  category text not null,
  material text not null,
  description text not null,
  price numeric(10, 2),
  currency text not null default 'INR',
  availability text not null default 'Unconfirmed' check (availability in ('Unconfirmed', 'In stock', 'Out of stock')),
  dimensions text,
  weight text,
  finish text,
  care text,
  contents text,
  variants text,
  shipping text,
  collection_paths text[] default array[]::text[],
  image_url text not null,
  image_alt text not null,
  is_featured boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Indexing for search and filtering
create index if not exists products_material_idx on public.products (material);
create index if not exists products_category_idx on public.products (category);
create index if not exists products_sku_idx on public.products (sku);

-- 3. PROFILES TABLE (Linked to auth.users)
create table if not exists public.profiles (
  id uuid references auth.users on delete cascade primary key,
  email text not null,
  full_name text,
  phone text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 4. ADDRESSES TABLE
create table if not exists public.addresses (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) on delete cascade not null,
  full_name text not null,
  street text not null,
  apartment text,
  city text not null,
  state text,
  postal_code text not null,
  country text not null,
  phone text not null,
  is_default boolean default false,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 5. ORDERS TABLE
create table if not exists public.orders (
  id text primary key, -- e.g. SG-1001
  user_id uuid references public.profiles(id) on delete set null,
  email text not null,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled')),
  currency text not null default 'INR',
  subtotal numeric(10, 2) not null default 0.00,
  shipping numeric(10, 2) not null default 0.00,
  tax numeric(10, 2) not null default 0.00,
  total numeric(10, 2) not null default 0.00,
  shipping_address jsonb not null default '{}'::jsonb,
  tracking_reference text,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 6. ORDER ITEMS TABLE
create table if not exists public.order_items (
  id uuid default uuid_generate_v4() primary key,
  order_id text references public.orders(id) on delete cascade not null,
  product_id text references public.products(id) on delete set null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_price numeric(10, 2) not null default 0.00,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- 7. ROW LEVEL SECURITY (RLS)
alter table public.products enable row level security;
alter table public.profiles enable row level security;
alter table public.addresses enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

-- Products RLS: Anyone can view active products; only admins can modify
create policy "Products are viewable by everyone"
  on public.products for select
  using (true);

create policy "Admins can manage products"
  on public.products for all
  using (
    auth.uid() in (select id from public.profiles where role = 'admin')
  );

-- Profiles RLS: Users can read and update their own profile
create policy "Users can view own profile"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Users can update own profile"
  on public.profiles for update
  using (auth.uid() = id);

-- Addresses RLS: Users manage their own addresses
create policy "Users can view own addresses"
  on public.addresses for select
  using (auth.uid() = user_id);

create policy "Users can insert own addresses"
  on public.addresses for insert
  with check (auth.uid() = user_id);

create policy "Users can update own addresses"
  on public.addresses for update
  using (auth.uid() = user_id);

create policy "Users can delete own addresses"
  on public.addresses for delete
  using (auth.uid() = user_id);

-- Orders RLS: Users can view own orders, admins view all
create policy "Users can view own orders"
  on public.orders for select
  using (
    auth.uid() = user_id
    or auth.uid() in (select id from public.profiles where role = 'admin')
  );

create policy "Users can view own order items"
  on public.order_items for select
  using (
    exists (
      select 1 from public.orders
      where orders.id = order_items.order_id
      and (orders.user_id = auth.uid() or auth.uid() in (select id from public.profiles where role = 'admin'))
    )
  );

-- Trigger to create profile automatically on auth.users sign-up
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, role)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', coalesce(new.raw_user_meta_data->>'role', 'customer'));
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();
