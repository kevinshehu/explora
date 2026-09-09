alter table reservations
  add column if not exists place text not null default '',
  add column if not exists tour_name text not null default '';

alter table reservations
  alter column destination_id drop not null,
  alter column tour_id drop not null;

update reservations r
set place = coalesce(d.name, '')
from destinations d
where r.destination_id = d.id
  and coalesce(r.place, '') = '';

update reservations r
set tour_name = coalesce(t.name, '')
from tours t
where r.tour_id = t.id
  and coalesce(r.tour_name, '') = '';

create index if not exists idx_reservations_place on reservations(place);
create index if not exists idx_reservations_tour_name on reservations(tour_name);
