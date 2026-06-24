-- ============================================================================
-- Linen Works Portal — database schema, security policies and seed data.
-- Run this ONCE in your Supabase project: Dashboard → SQL Editor → paste → Run.
-- Safe to re-run: it drops and recreates its own objects.
-- ============================================================================

-- ---------------------------------------------------------------------------
-- TABLES
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id           uuid primary key references auth.users(id) on delete cascade,
  role         text not null default 'customer' check (role in ('customer','employee')),
  status       text not null default 'pending'  check (status in ('pending','active','suspended')),
  company_name text,
  contact_name text,
  phone        text,
  created_at   timestamptz not null default now()
);

create table if not exists public.inventory_items (
  id             uuid primary key default gen_random_uuid(),
  sku            text unique,
  name           text not null,
  category       text,
  description    text,
  unit           text not null default 'each',
  stock_quantity integer not null default 0 check (stock_quantity >= 0),
  active         boolean not null default true,
  created_at     timestamptz not null default now()
);

create table if not exists public.orders (
  id           uuid primary key default gen_random_uuid(),
  customer_id  uuid not null references public.profiles(id),
  status       text not null default 'pending'
                 check (status in ('pending','processing','fulfilled','cancelled')),
  notes        text,
  created_at   timestamptz not null default now(),
  fulfilled_at timestamptz,
  fulfilled_by uuid references public.profiles(id)
);

create table if not exists public.order_items (
  id        uuid primary key default gen_random_uuid(),
  order_id  uuid not null references public.orders(id) on delete cascade,
  item_id   uuid not null references public.inventory_items(id),
  item_name text not null,                 -- snapshot of name at order time
  quantity  integer not null check (quantity > 0)
);

create index if not exists idx_orders_customer on public.orders(customer_id);
create index if not exists idx_order_items_order on public.order_items(order_id);

-- ---------------------------------------------------------------------------
-- HELPER FUNCTIONS (security definer = bypass RLS so policies don't recurse)
-- ---------------------------------------------------------------------------

create or replace function public.is_employee()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'employee'
  );
$$;

create or replace function public.is_active_customer()
returns boolean language sql security definer stable set search_path = public as $$
  select exists (
    select 1 from public.profiles
    where id = auth.uid() and role = 'customer' and status = 'active'
  );
$$;

-- ---------------------------------------------------------------------------
-- NEW-USER TRIGGER — create a pending customer profile on sign-up.
-- Sign-up metadata (company_name, contact_name, phone) is read from the JWT.
-- ---------------------------------------------------------------------------

create or replace function public.handle_new_user()
returns trigger language plpgsql security definer set search_path = public as $$
begin
  insert into public.profiles (id, role, status, company_name, contact_name, phone)
  values (
    new.id,
    'customer',
    'pending',
    new.raw_user_meta_data->>'company_name',
    new.raw_user_meta_data->>'contact_name',
    new.raw_user_meta_data->>'phone'
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- ROW-LEVEL SECURITY
-- ---------------------------------------------------------------------------

alter table public.profiles        enable row level security;
alter table public.inventory_items enable row level security;
alter table public.orders          enable row level security;
alter table public.order_items     enable row level security;

-- profiles -------------------------------------------------------------------
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated
  using (id = auth.uid() or public.is_employee());

-- only employees may change a profile (e.g. approve a customer)
drop policy if exists profiles_update on public.profiles;
create policy profiles_update on public.profiles
  for update to authenticated
  using (public.is_employee())
  with check (public.is_employee());

-- inventory ------------------------------------------------------------------
drop policy if exists inventory_select on public.inventory_items;
create policy inventory_select on public.inventory_items
  for select to authenticated
  using (true);

drop policy if exists inventory_write on public.inventory_items;
create policy inventory_write on public.inventory_items
  for all to authenticated
  using (public.is_employee())
  with check (public.is_employee());

-- orders ---------------------------------------------------------------------
drop policy if exists orders_select on public.orders;
create policy orders_select on public.orders
  for select to authenticated
  using (customer_id = auth.uid() or public.is_employee());

drop policy if exists orders_insert on public.orders;
create policy orders_insert on public.orders
  for insert to authenticated
  with check (customer_id = auth.uid() and public.is_active_customer());

drop policy if exists orders_update on public.orders;
create policy orders_update on public.orders
  for update to authenticated
  using (public.is_employee())
  with check (public.is_employee());

-- order_items ----------------------------------------------------------------
drop policy if exists order_items_select on public.order_items;
create policy order_items_select on public.order_items
  for select to authenticated
  using (exists (
    select 1 from public.orders o
    where o.id = order_id
      and (o.customer_id = auth.uid() or public.is_employee())
  ));

drop policy if exists order_items_insert on public.order_items;
create policy order_items_insert on public.order_items
  for insert to authenticated
  with check (exists (
    select 1 from public.orders o
    where o.id = order_id and o.customer_id = auth.uid()
  ));

-- ---------------------------------------------------------------------------
-- SEED INVENTORY (edit freely — these are starter linen items)
-- ---------------------------------------------------------------------------

insert into public.inventory_items (sku, name, category, description, unit, stock_quantity) values
  ('TOW-BATH',  'Bath Towels',        'Towels',  'White cotton bath towels, 70×140cm.',      'each', 800),
  ('TOW-HAND',  'Hand Towels',        'Towels',  'White cotton hand towels, 50×90cm.',       'each', 1200),
  ('TOW-FACE',  'Face Cloths',        'Towels',  'White cotton face cloths, 30×30cm.',       'each', 1500),
  ('BED-SHT-D', 'Bed Sheets — Double','Bed Linen','White flat sheets, double.',              'each', 600),
  ('BED-SHT-S', 'Bed Sheets — Single','Bed Linen','White flat sheets, single.',              'each', 600),
  ('BED-DUV-D', 'Duvet Covers — Double','Bed Linen','White duvet covers, double.',           'each', 400),
  ('BED-PIL',   'Pillowcases',        'Bed Linen','White pillowcases, standard.',             'each', 1600),
  ('TAB-CLOTH', 'Tablecloths',        'Table Linen','White restaurant tablecloths, 130×130cm.','each', 500),
  ('TAB-NAP',   'Napkins',            'Table Linen','White cotton dinner napkins, 45×45cm.',  'each', 3000),
  ('TAB-RUN',   'Table Runners',      'Table Linen','Neutral table runners.',                 'each', 200),
  ('KIT-APR',   'Aprons',             'Kitchen', 'Bistro aprons, charcoal.',                  'each', 300),
  ('KIT-CLOTH', 'Kitchen Cloths',     'Kitchen', 'Cotton kitchen / glass cloths.',            'pack', 400),
  ('SPA-ROBE',  'Bath Robes',         'Spa',     'Waffle-weave spa robes, one size.',         'each', 150),
  ('SPA-TOW',   'Spa Towels',         'Spa',     'Large white spa / pool towels.',            'each', 250)
on conflict (sku) do nothing;

-- ---------------------------------------------------------------------------
-- AFTER RUNNING THIS:
--  1. Create your own login at the portal (sign up), OR in Auth → Users.
--  2. Promote yourself to employee so you can manage everything:
--       update public.profiles
--       set role = 'employee', status = 'active'
--       where id = (select id from auth.users where email = 'you@example.com');
-- ---------------------------------------------------------------------------
