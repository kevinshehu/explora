create extension if not exists pgcrypto;

DO $$
BEGIN
  CREATE TYPE reservation_status AS ENUM ('pending', 'confirmed', 'completed', 'cancelled');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE booking_source AS ENUM ('whatsapp', 'website', 'phone', 'walk-in', 'other');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

DO $$
BEGIN
  CREATE TYPE price_type AS ENUM ('fixed', 'per-person', 'per-day', 'custom');
EXCEPTION
  WHEN duplicate_object THEN NULL;
END $$;

create or replace function set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create table if not exists destinations (
  id uuid primary key default gen_random_uuid(),
  name text not null unique,
  location text not null,
  description text not null,
  category text not null,
  image text not null,
  starting_price numeric(10,2) not null default 0,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint destinations_starting_price_nonnegative check (starting_price >= 0)
);

create table if not exists tours (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  destination_id uuid not null references destinations(id) on delete restrict,
  description text not null,
  duration text not null,
  price numeric(10,2) not null default 0,
  price_type price_type not null default 'fixed',
  available_days text[] not null default '{}'::text[],
  maximum_guests integer not null default 0,
  images text[] not null default '{}'::text[],
  category text not null,
  active boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint tours_price_nonnegative check (price >= 0),
  constraint tours_maximum_guests_nonnegative check (maximum_guests >= 0),
  constraint tours_name_destination_unique unique (name, destination_id)
);

create table if not exists customers (
  id uuid primary key default gen_random_uuid(),
  full_name text not null,
  email text not null unique,
  phone text not null,
  whatsapp text not null,
  notes text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  reservation_code text not null unique default ('RES-' || to_char(now(), 'YYYYMMDD') || '-' || upper(substr(replace(gen_random_uuid()::text, '-', ''), 1, 8))),
  customer_id uuid not null references customers(id) on delete restrict,
  destination_id uuid not null references destinations(id) on delete restrict,
  tour_id uuid not null references tours(id) on delete restrict,
  reservation_date date not null,
  start_time time,
  end_time time,
  number_of_days integer,
  adults integer not null default 0,
  children integer not null default 0,
  total_guests integer not null default 0,
  base_price numeric(10,2) not null default 0,
  price_per_person numeric(10,2) not null default 0,
  additional_costs numeric(10,2) not null default 0,
  discount numeric(10,2) not null default 0,
  total_price numeric(10,2) not null default 0,
  currency text not null default 'EUR',
  status reservation_status not null default 'pending',
  booking_source booking_source not null default 'whatsapp',
  pickup_location text not null default '',
  customer_notes text not null default '',
  internal_notes text not null default '',
  special_requests text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint reservations_adults_nonnegative check (adults >= 0),
  constraint reservations_children_nonnegative check (children >= 0),
  constraint reservations_total_guests_nonnegative check (total_guests >= 0),
  constraint reservations_pricing_nonnegative check (base_price >= 0 and price_per_person >= 0 and additional_costs >= 0 and discount >= 0 and total_price >= 0),
  constraint reservations_number_of_days_positive check (number_of_days is null or number_of_days >= 1)
);

create index if not exists idx_tours_destination_id on tours(destination_id);
create index if not exists idx_tours_active on tours(active);
create index if not exists idx_customers_email on customers(email);
create index if not exists idx_customers_phone on customers(phone);
create index if not exists idx_reservations_customer_id on reservations(customer_id);
create index if not exists idx_reservations_destination_id on reservations(destination_id);
create index if not exists idx_reservations_tour_id on reservations(tour_id);
create index if not exists idx_reservations_status on reservations(status);
create index if not exists idx_reservations_reservation_date on reservations(reservation_date);
create index if not exists idx_reservations_booking_source on reservations(booking_source);

drop trigger if exists set_destinations_updated_at on destinations;
create trigger set_destinations_updated_at
before update on destinations
for each row execute function set_updated_at();

drop trigger if exists set_tours_updated_at on tours;
create trigger set_tours_updated_at
before update on tours
for each row execute function set_updated_at();

drop trigger if exists set_customers_updated_at on customers;
create trigger set_customers_updated_at
before update on customers
for each row execute function set_updated_at();

drop trigger if exists set_reservations_updated_at on reservations;
create trigger set_reservations_updated_at
before update on reservations
for each row execute function set_updated_at();

alter table destinations enable row level security;
alter table tours enable row level security;
alter table customers enable row level security;
alter table reservations enable row level security;

drop policy if exists "Public can read destinations" on destinations;
create policy "Public can read destinations"
  on destinations
  for select
  using (true);

drop policy if exists "Service role can manage destinations" on destinations;
create policy "Service role can manage destinations"
  on destinations
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Public can read tours" on tours;
create policy "Public can read tours"
  on tours
  for select
  using (true);

drop policy if exists "Service role can manage tours" on tours;
create policy "Service role can manage tours"
  on tours
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Service role can manage customers" on customers;
create policy "Service role can manage customers"
  on customers
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

drop policy if exists "Service role can manage reservations" on reservations;
create policy "Service role can manage reservations"
  on reservations
  for all
  using (auth.role() = 'service_role')
  with check (auth.role() = 'service_role');

insert into destinations (name, location, description, category, image, starting_price, active)
values
  ('Dhërmi', 'Himarë District', 'Dhërmi blends long Ionian beaches, dramatic cliffs, and a polished coastal atmosphere ideal for premium day trips and guided beach experiences.', 'Beach', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', 45, true),
  ('Himarë', 'Vlorë County', 'Himarë combines a charming old town, a laid-back promenade, and easy access to secluded coves and swim stops.', 'Town', 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80', 35, true),
  ('Ksamil', 'Sarandë District', 'Ksamil is famous for shallow turquoise water, small island views, and beach clubs that work beautifully for relaxed coastal days.', 'Beach', 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80', 50, true),
  ('Sarandë', 'Southern Albania', 'Sarandë is the Riviera gateway with a lively harbor, waterfront dining, and easy access to nearby beaches and boat routes.', 'City', 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', 40, true),
  ('Jale Beach', 'Himarë Coast', 'Jale offers a scenic cove with crystal water, music-friendly beach clubs, and a classic Southern Albania summer feel.', 'Beach', 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80', 42, true),
  ('Borsh', 'Himarë District', 'Borsh is known for one of the longest beaches in Albania, olive groves, and a slower-paced coastal escape.', 'Beach', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80', 38, true),
  ('Qeparo', 'Himarë District', 'Qeparo pairs the atmosphere of a quiet heritage village with elegant sea views and boutique coastal experiences.', 'Village', 'https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=1200&q=80', 36, true),
  ('Porto Palermo', 'Southern Albania', 'Porto Palermo delivers fortress views, deep blue water, and boat-friendly coves perfect for scenic stops and photography.', 'Fortress', 'https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80', 48, true),
  ('Gjipe Beach', 'Vlorë County', 'Gjipe is a dramatic canyon-to-sea experience with hiking access, kayaking possibilities, and a wild-beauty backdrop.', 'Beach', 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', 55, true),
  ('Llogara', 'Llogara National Park', 'Llogara combines mountain air, scenic passes, and panoramic viewpoints overlooking the Albanian Riviera.', 'Nature', 'https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80', 30, true),
  ('Vlorë', 'Vlorë County', 'Vlorë offers a modern coastline, urban convenience, and a practical launch point for wider Southern Albania routes.', 'City', 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', 28, true),
  ('Blue Eye', 'Near Sarandë', 'The Blue Eye is one of Albania’s most iconic natural springs, with vivid water, shady paths, and a strong day-trip appeal.', 'Nature', 'https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80', 33, true)
on conflict (name) do update set
  location = excluded.location,
  description = excluded.description,
  category = excluded.category,
  image = excluded.image,
  starting_price = excluded.starting_price,
  active = excluded.active;

insert into tours (name, destination_id, description, duration, price, price_type, available_days, maximum_guests, images, category, active)
values
  ('Dhërmi Beach Tour', (select id from destinations where name = 'Dhërmi'), 'A full beach-focused day in Dhërmi with curated swim stops, scenic viewpoints, and time for relaxed coastal dining.', 'Full day', 240, 'fixed', array['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'], 12, array['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'], 'Beach', true),
  ('Himarë Heritage & Coast', (select id from destinations where name = 'Himarë'), 'Explore Himarë old town, coastal viewpoints, and quiet swim stops with a flexible route.', '6 hours', 180, 'fixed', array['Mon', 'Wed', 'Fri', 'Sun'], 10, array['https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80'], 'Culture', true),
  ('Ksamil Islands Experience', (select id from destinations where name = 'Ksamil'), 'Visit Ksamil’s island views, shallow waters, and popular beach clubs with a premium day-trip rhythm.', 'Full day', 260, 'fixed', array['Every day'], 14, array['https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80'], 'Beach', true),
  ('Sarandë Sunset Cruise', (select id from destinations where name = 'Sarandë'), 'A sunset-facing reservation with harbor views, easy logistics, and optional dinner add-ons.', '3 hours', 90, 'per-person', array['Thu', 'Fri', 'Sat', 'Sun'], 20, array['https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80'], 'Boat', true),
  ('Jale Beach Club Day', (select id from destinations where name = 'Jale Beach'), 'A music-friendly beach day with comfortable logistics and a clean booking flow for groups.', 'Full day', 210, 'fixed', array['Fri', 'Sat', 'Sun'], 16, array['https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80'], 'Beach', true),
  ('Borsh Olive Coast Escape', (select id from destinations where name = 'Borsh'), 'A quieter coastal route blending olive groves, long beaches, and a laid-back local lunch stop.', '6 hours', 155, 'fixed', array['Mon', 'Tue', 'Thu', 'Sat'], 10, array['https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80'], 'Nature', true),
  ('Qeparo Village & Sea View', (select id from destinations where name = 'Qeparo'), 'A refined village visit with photo stops, sea-view dining, and a slower pace.', 'Half day', 125, 'per-person', array['Mon', 'Wed', 'Sat'], 8, array['https://images.unsplash.com/photo-1519985176271-adb1088fa94c?auto=format&fit=crop&w=1200&q=80'], 'Culture', true),
  ('Porto Palermo Fortress & Swim', (select id from destinations where name = 'Porto Palermo'), 'Fortress history, vivid waters, and a scenic harbor stop in one manageable excursion.', '4 hours', 140, 'fixed', array['Tue', 'Thu', 'Sun'], 12, array['https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&w=1200&q=80'], 'History', true),
  ('Gjipe Canyon & Beach Hike', (select id from destinations where name = 'Gjipe Beach'), 'A scenic route to one of Albania’s most dramatic beaches, combining hike access and swim time.', 'Full day', 220, 'fixed', array['Mon', 'Wed', 'Fri', 'Sun'], 10, array['https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80'], 'Adventure', true),
  ('Llogara Scenic Pass', (select id from destinations where name = 'Llogara'), 'A mountain-to-sea scenic route with panoramic stops and flexible photography time.', '5 hours', 110, 'per-person', array['Every day'], 12, array['https://images.unsplash.com/photo-1501785888041-af3ef285b470?auto=format&fit=crop&w=1200&q=80'], 'Nature', true),
  ('Vlorë Intro Route', (select id from destinations where name = 'Vlorë'), 'A practical city-to-coast introduction for travelers starting their South Albania journey in Vlorë.', 'Half day', 85, 'per-person', array['Every day'], 15, array['https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80'], 'City', true),
  ('Blue Eye Spring Visit', (select id from destinations where name = 'Blue Eye'), 'A guided visit to the iconic Blue Eye spring with a calm and photo-friendly schedule.', '4 hours', 95, 'fixed', array['Tue', 'Thu', 'Sat'], 12, array['https://images.unsplash.com/photo-1493558103817-58b2924bce98?auto=format&fit=crop&w=1200&q=80'], 'Nature', true)
on conflict (name, destination_id) do update set
  description = excluded.description,
  duration = excluded.duration,
  price = excluded.price,
  price_type = excluded.price_type,
  available_days = excluded.available_days,
  maximum_guests = excluded.maximum_guests,
  images = excluded.images,
  category = excluded.category,
  active = excluded.active;
