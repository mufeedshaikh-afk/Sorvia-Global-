-- 1. Order Insertion Policies
drop policy if exists "Anyone can create orders" on public.orders;
create policy "Anyone can create orders"
  on public.orders for insert
  with check (true);

drop policy if exists "Anyone can create order items" on public.order_items;
create policy "Anyone can create order items"
  on public.order_items for insert
  with check (true);

-- 2. Order Reading Policies (Allows tracking and customer history)
drop policy if exists "Allow order lookup" on public.orders;
create policy "Allow order lookup"
  on public.orders for select
  using (true);

drop policy if exists "Allow order items lookup" on public.order_items;
create policy "Allow order items lookup"
  on public.order_items for select
  using (true);
