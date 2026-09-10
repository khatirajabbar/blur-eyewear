-- BLUR store schema
-- Run this file once in the Supabase SQL Editor before enabling checkout.
-- The service-role key is only used by the server-side Stripe webhook.

create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  role text not null default 'customer' check (role in ('customer', 'admin')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists public.orders (
  id uuid primary key default gen_random_uuid(),
  stripe_checkout_session_id text not null unique,
  stripe_payment_intent_id text unique,
  user_id uuid not null references auth.users (id) on delete restrict,
  email text,
  status text not null default 'pending' check (status in ('pending', 'paid', 'failed', 'refunded')),
  currency text not null default 'usd',
  amount_total integer check (amount_total is null or amount_total >= 0),
  cart jsonb not null default '[]'::jsonb check (jsonb_typeof(cart) = 'array'),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  paid_at timestamptz
);

create table if not exists public.order_items (
  id uuid primary key default gen_random_uuid(),
  order_id uuid not null references public.orders (id) on delete cascade,
  product_id text not null,
  product_code text not null,
  product_name text not null,
  quantity integer not null check (quantity > 0),
  unit_amount integer not null check (unit_amount >= 0),
  created_at timestamptz not null default now(),
  unique (order_id, product_id)
);

create index if not exists orders_user_id_created_at_idx on public.orders (user_id, created_at desc);
create index if not exists order_items_order_id_idx on public.order_items (order_id);

create or replace function public.set_updated_at()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
before update on public.profiles
for each row execute function public.set_updated_at();

drop trigger if exists orders_set_updated_at on public.orders;
create trigger orders_set_updated_at
before update on public.orders
for each row execute function public.set_updated_at();

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email)
  values (new.id, new.email)
  on conflict (id) do update set email = excluded.email;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
drop trigger if exists on_auth_user_email_changed on auth.users;
create trigger on_auth_user_email_changed
after insert or update of email on auth.users
for each row execute function public.handle_new_user();

-- Add profiles for any users who existed before this schema was installed.
insert into public.profiles (id, email)
select id, email from auth.users
on conflict (id) do update set email = excluded.email;

create or replace function public.is_admin()
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.profiles
    where id = auth.uid() and role = 'admin'
  );
$$;

alter table public.profiles enable row level security;
alter table public.orders enable row level security;
alter table public.order_items enable row level security;

drop policy if exists "profiles_select_self_or_admin" on public.profiles;
create policy "profiles_select_self_or_admin"
on public.profiles
for select
to authenticated
using (id = auth.uid() or public.is_admin());

drop policy if exists "orders_select_self_or_admin" on public.orders;
create policy "orders_select_self_or_admin"
on public.orders
for select
to authenticated
using (user_id = auth.uid() or public.is_admin());

drop policy if exists "order_items_select_owner_or_admin" on public.order_items;
create policy "order_items_select_owner_or_admin"
on public.order_items
for select
to authenticated
using (
  exists (
    select 1 from public.orders
    where orders.id = order_items.order_id
      and (orders.user_id = auth.uid() or public.is_admin())
  )
);

-- Customers get read-only access to their own data. There are deliberately no
-- INSERT/UPDATE/DELETE policies: Stripe webhook writes run with service role.
revoke all on table public.profiles, public.orders, public.order_items from anon;
grant select on table public.profiles, public.orders, public.order_items to authenticated;
revoke all on function public.handle_new_user() from public;
revoke all on function public.set_updated_at() from public;
revoke all on function public.is_admin() from public;
grant execute on function public.is_admin() to authenticated;

-- Promote the owner only after they have created an account in BLUR:
-- update public.profiles set role = 'admin' where email = 'your-email@example.com';
