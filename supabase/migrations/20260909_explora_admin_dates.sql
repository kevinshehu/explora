alter table reservations
  add column if not exists end_date date;

update reservations
set end_date = reservation_date
where end_date is null;

create index if not exists idx_reservations_end_date on reservations(end_date);
