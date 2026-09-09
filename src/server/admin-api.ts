import { Request, Response, Router } from 'express';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';

interface CustomerRow {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  whatsapp: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface DestinationRow {
  id: string;
  name: string;
  location: string;
  description: string;
  category: string;
  image: string;
  starting_price: number;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface TourRow {
  id: string;
  name: string;
  destination_id: string;
  description: string;
  duration: string;
  price: number;
  price_type: string;
  available_days: string[];
  maximum_guests: number;
  images: string[];
  category: string;
  active: boolean;
  created_at: string;
  updated_at: string;
}

interface ReservationRow {
  id: string;
  reservation_code: string;
  customer_id: string;
  destination_id: string;
  tour_id: string;
  reservation_date: string;
  start_time: string | null;
  end_time: string | null;
  number_of_days: number | null;
  adults: number;
  children: number;
  total_guests: number;
  base_price: number;
  price_per_person: number;
  additional_costs: number;
  discount: number;
  total_price: number;
  currency: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  booking_source: 'whatsapp' | 'website' | 'phone' | 'walk-in' | 'other';
  pickup_location: string;
  customer_notes: string;
  internal_notes: string;
  special_requests: string;
  created_at: string;
  updated_at: string;
  customer?: CustomerRow | null;
  destination?: DestinationRow | null;
  tour?: TourRow | null;
}

interface DashboardItem {
  label: string;
  value: number;
  color?: string;
}

interface DashboardData {
  metrics: Array<{ label: string; value: number; hint?: string }>;
  statusBreakdown: DashboardItem[];
  destinationBreakdown: DashboardItem[];
  tourBreakdown: DashboardItem[];
  upcomingReservations: ReturnType<typeof mapReservationRow>[];
}

interface SupabaseEnv {
  url: string;
  serviceRoleKey: string;
}

function mapCustomer(row: CustomerRow) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    whatsapp: row.whatsapp,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapDestination(row: DestinationRow) {
  return {
    id: row.id,
    name: row.name,
    location: row.location,
    description: row.description,
    category: row.category,
    image: row.image,
    startingPrice: Number(row.starting_price),
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapTour(row: TourRow) {
  return {
    id: row.id,
    name: row.name,
    destinationId: row.destination_id,
    description: row.description,
    duration: row.duration,
    price: Number(row.price),
    priceType: row.price_type,
    availableDays: row.available_days ?? [],
    maximumGuests: row.maximum_guests,
    images: row.images ?? [],
    category: row.category,
    active: row.active,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapReservationRow(row: ReservationRow) {
  return {
    id: row.id,
    reservationCode: row.reservation_code,
    customerId: row.customer_id,
    customerName: row.customer?.full_name ?? '',
    email: row.customer?.email ?? '',
    phone: row.customer?.phone ?? '',
    whatsapp: row.customer?.whatsapp ?? '',
    destinationId: row.destination_id,
    destinationName: row.destination?.name ?? '',
    tourId: row.tour_id,
    tourName: row.tour?.name ?? '',
    reservationDate: row.reservation_date,
    startTime: row.start_time,
    endTime: row.end_time,
    numberOfDays: row.number_of_days,
    adults: row.adults,
    children: row.children,
    totalGuests: row.total_guests,
    basePrice: Number(row.base_price),
    pricePerPerson: Number(row.price_per_person),
    additionalCosts: Number(row.additional_costs),
    discount: Number(row.discount),
    totalPrice: Number(row.total_price),
    currency: row.currency,
    status: row.status,
    bookingSource: row.booking_source,
    pickupLocation: row.pickup_location,
    customerNotes: row.customer_notes,
    internalNotes: row.internal_notes,
    specialRequests: row.special_requests,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function createSupabaseClient(env: SupabaseEnv): SupabaseClient {
  return createClient(env.url, env.serviceRoleKey, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

function getEnv(): SupabaseEnv | null {
  const url = process.env['SUPABASE_URL'] ?? '';
  const serviceRoleKey = process.env['SUPABASE_SERVICE_ROLE_KEY'] ?? '';

  if (!url || !serviceRoleKey) {
    return null;
  }

  return { url, serviceRoleKey };
}

function sendMissingConfig(res: Response): void {
  res.status(503).json({
    error: 'Supabase is not configured on the server. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
  });
}

async function fetchCustomers(client: SupabaseClient): Promise<CustomerRow[]> {
  const { data, error } = await client.from('customers').select('*').order('created_at', { ascending: false });
  if (error) {
    throw error;
  }
  return (data ?? []) as CustomerRow[];
}

async function fetchDestinations(client: SupabaseClient): Promise<DestinationRow[]> {
  const { data, error } = await client.from('destinations').select('*').order('name', { ascending: true });
  if (error) {
    throw error;
  }
  return (data ?? []) as DestinationRow[];
}

async function fetchTours(client: SupabaseClient): Promise<TourRow[]> {
  const { data, error } = await client.from('tours').select('*').order('name', { ascending: true });
  if (error) {
    throw error;
  }
  return (data ?? []) as TourRow[];
}

async function fetchReservations(client: SupabaseClient): Promise<ReservationRow[]> {
  const { data, error } = await client
    .from('reservations')
    .select('*, customer:customers(*), destination:destinations(*), tour:tours(*)')
    .order('reservation_date', { ascending: false })
    .order('start_time', { ascending: false });

  if (error) {
    throw error;
  }

  return (data ?? []) as ReservationRow[];
}

function applyReservationFilters(rows: ReservationRow[], request: Request): ReservationRow[] {
  const query = String(request.query['query'] ?? '').trim().toLowerCase();
  const status = String(request.query['status'] ?? 'all');
  const destinationId = String(request.query['destinationId'] ?? 'all');
  const tourId = String(request.query['tourId'] ?? 'all');
  const bookingSource = String(request.query['bookingSource'] ?? 'all');
  const from = String(request.query['from'] ?? '');
  const to = String(request.query['to'] ?? '');

  return rows.filter((row) => {
    const matchesQuery =
      !query ||
      [
        row.reservation_code,
        row.customer?.full_name,
        row.customer?.email,
        row.destination?.name,
        row.tour?.name,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));

    const matchesStatus = status === 'all' || row.status === status;
    const matchesDestination = destinationId === 'all' || row.destination_id === destinationId;
    const matchesTour = tourId === 'all' || row.tour_id === tourId;
    const matchesSource = bookingSource === 'all' || row.booking_source === bookingSource;
    const matchesFrom = !from || row.reservation_date >= from;
    const matchesTo = !to || row.reservation_date <= to;

    return matchesQuery && matchesStatus && matchesDestination && matchesTour && matchesSource && matchesFrom && matchesTo;
  });
}

async function ensureCustomer(client: SupabaseClient, payload: { customerId?: string; customerName: string; email: string; phone: string; whatsapp: string; }) {
  if (payload.customerId) {
    return payload.customerId;
  }

  const customers = await fetchCustomers(client);
  const existing = customers.find((customer) => customer.email === payload.email || customer.phone === payload.phone || customer.whatsapp === payload.whatsapp);
  if (existing) {
    return existing.id;
  }

  const { data, error } = await client
    .from('customers')
    .insert({
      id: randomUUID(),
      full_name: payload.customerName,
      email: payload.email,
      phone: payload.phone,
      whatsapp: payload.whatsapp,
      notes: '',
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return (data as CustomerRow).id;
}

function createDashboardData(rows: ReservationRow[]): DashboardData {
  const totals = {
    totalReservations: rows.length,
    pendingReservations: rows.filter((row) => row.status === 'pending').length,
    confirmedReservations: rows.filter((row) => row.status === 'confirmed').length,
    completedReservations: rows.filter((row) => row.status === 'completed').length,
    cancelledReservations: rows.filter((row) => row.status === 'cancelled').length,
    todaysReservations: rows.filter((row) => row.reservation_date === new Date().toISOString().slice(0, 10)).length,
    upcomingReservations: rows.filter((row) => row.reservation_date >= new Date().toISOString().slice(0, 10) && row.status !== 'cancelled').length,
    totalBookingValue: rows.reduce((sum, row) => sum + Number(row.total_price), 0),
  };

  const byStatus = [
    ['Pending', totals.pendingReservations],
    ['Confirmed', totals.confirmedReservations],
    ['Completed', totals.completedReservations],
    ['Cancelled', totals.cancelledReservations],
  ];

  const byDestination = aggregateBy(rows, (row) => row.destination?.name ?? 'Unknown destination');
  const byTour = aggregateBy(rows, (row) => row.tour?.name ?? 'Unknown tour');
  const upcomingReservations = rows
    .filter((row) => row.reservation_date >= new Date().toISOString().slice(0, 10) && row.status !== 'cancelled')
    .sort((a, b) => `${a.reservation_date} ${a.start_time ?? ''}`.localeCompare(`${b.reservation_date} ${b.start_time ?? ''}`))
    .slice(0, 8)
    .map(mapReservationRow);

  return {
    metrics: [
      { label: 'Total reservations', value: totals.totalReservations },
      { label: 'Pending reservations', value: totals.pendingReservations },
      { label: 'Confirmed reservations', value: totals.confirmedReservations },
      { label: 'Completed reservations', value: totals.completedReservations },
      { label: 'Cancelled reservations', value: totals.cancelledReservations },
      { label: "Today's reservations", value: totals.todaysReservations },
      { label: 'Upcoming reservations', value: totals.upcomingReservations },
      { label: 'Total booking value', value: totals.totalBookingValue, hint: 'Across all reservations' },
    ],
    statusBreakdown: byStatus.map(([label, value]) => ({ label: String(label), value: Number(value) })),
    destinationBreakdown: byDestination,
    tourBreakdown: byTour,
    upcomingReservations,
  };
}

function aggregateBy(rows: ReservationRow[], selector: (row: ReservationRow) => string): DashboardItem[] {
  const bucket = new Map<string, number>();
  for (const row of rows) {
    const key = selector(row);
    bucket.set(key, (bucket.get(key) ?? 0) + 1);
  }

  return [...bucket.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 8)
    .map(([label, value]) => ({ label, value }));
}

export function registerAdminApiRoutes(server: Router): void {
  server.use('/api/admin', async (req, res, next) => {
    try {
      const env = getEnv();
      if (!env) {
        sendMissingConfig(res);
        return;
      }

      const client = createSupabaseClient(env);
      const path = req.path.replace(/\/$/, '');

      if (req.method === 'GET' && path === '/health') {
        res.json({ configured: true });
        return;
      }

      if (req.method === 'GET' && path === '/dashboard') {
        const reservations = await fetchReservations(client);
        res.json(createDashboardData(reservations));
        return;
      }

      if (req.method === 'GET' && path === '/reservations') {
        const reservations = applyReservationFilters(await fetchReservations(client), req).map(mapReservationRow);
        res.json(reservations);
        return;
      }

      if (req.method === 'GET' && path.startsWith('/reservations/')) {
        const id = path.split('/').pop();
        const reservations = await fetchReservations(client);
        const reservation = reservations.find((row) => row.id === id);
        if (!reservation) {
          res.status(404).json({ error: 'Reservation not found' });
          return;
        }
        res.json(mapReservationRow(reservation));
        return;
      }

      if (req.method === 'POST' && path === '/reservations') {
        const body = req.body as Record<string, unknown>;
        const customerId = await ensureCustomer(client, {
          customerId: typeof body['customerId'] === 'string' ? body['customerId'] : undefined,
          customerName: String(body['customerName'] ?? ''),
          email: String(body['email'] ?? ''),
          phone: String(body['phone'] ?? ''),
          whatsapp: String(body['whatsapp'] ?? ''),
        });

        const reservationCode = `RES-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomUUID().slice(0, 8).toUpperCase()}`;
        const { data, error } = await client
          .from('reservations')
          .insert({
            id: randomUUID(),
            reservation_code: reservationCode,
            customer_id: customerId,
            destination_id: String(body['destinationId'] ?? ''),
            tour_id: String(body['tourId'] ?? ''),
            reservation_date: String(body['reservationDate'] ?? ''),
            start_time: body['startTime'] ? String(body['startTime']) : null,
            end_time: body['endTime'] ? String(body['endTime']) : null,
            number_of_days: body['numberOfDays'] ? Number(body['numberOfDays']) : null,
            adults: Number(body['adults'] ?? 0),
            children: Number(body['children'] ?? 0),
            total_guests: Number(body['totalGuests'] ?? 0),
            base_price: Number(body['basePrice'] ?? 0),
            price_per_person: Number(body['pricePerPerson'] ?? 0),
            additional_costs: Number(body['additionalCosts'] ?? 0),
            discount: Number(body['discount'] ?? 0),
            total_price: Number(body['totalPrice'] ?? 0),
            currency: String(body['currency'] ?? 'EUR'),
            status: String(body['status'] ?? 'pending'),
            booking_source: String(body['bookingSource'] ?? 'whatsapp'),
            pickup_location: String(body['pickupLocation'] ?? ''),
            customer_notes: String(body['customerNotes'] ?? ''),
            internal_notes: String(body['internalNotes'] ?? ''),
            special_requests: String(body['specialRequests'] ?? ''),
          })
          .select('*, customer:customers(*), destination:destinations(*), tour:tours(*)')
          .single();

        if (error) {
          throw error;
        }

        res.status(201).json(mapReservationRow(data as ReservationRow));
        return;
      }

      if (req.method === 'PATCH' && path.startsWith('/reservations/')) {
        const id = path.split('/').pop();
        const body = req.body as Record<string, unknown>;
        const { data, error } = await client
          .from('reservations')
          .update({
            customer_id: body['customerId'],
            destination_id: body['destinationId'],
            tour_id: body['tourId'],
            reservation_date: body['reservationDate'],
            start_time: body['startTime'] ?? null,
            end_time: body['endTime'] ?? null,
            number_of_days: body['numberOfDays'] ?? null,
            adults: body['adults'],
            children: body['children'],
            total_guests: body['totalGuests'],
            base_price: body['basePrice'],
            price_per_person: body['pricePerPerson'],
            additional_costs: body['additionalCosts'],
            discount: body['discount'],
            total_price: body['totalPrice'],
            currency: body['currency'],
            status: body['status'],
            booking_source: body['bookingSource'],
            pickup_location: body['pickupLocation'],
            customer_notes: body['customerNotes'],
            internal_notes: body['internalNotes'],
            special_requests: body['specialRequests'],
          })
          .eq('id', id)
          .select('*, customer:customers(*), destination:destinations(*), tour:tours(*)')
          .single();

        if (error) {
          throw error;
        }

        res.json(mapReservationRow(data as ReservationRow));
        return;
      }

      if (req.method === 'DELETE' && path.startsWith('/reservations/')) {
        const id = path.split('/').pop();
        const { error } = await client.from('reservations').delete().eq('id', id);
        if (error) {
          throw error;
        }
        res.status(204).send();
        return;
      }

      if (req.method === 'GET' && path === '/customers') {
        const query = String(req.query['query'] ?? '').trim().toLowerCase();
        const customers = (await fetchCustomers(client)).filter((customer) => {
          if (!query) {
            return true;
          }
          return [customer.full_name, customer.email, customer.phone, customer.whatsapp].some((value) => value.toLowerCase().includes(query));
        }).map(mapCustomer);
        res.json(customers);
        return;
      }

      if (req.method === 'GET' && path.startsWith('/customers/')) {
        const id = path.split('/').pop();
        const customer = (await fetchCustomers(client)).find((row) => row.id === id);
        if (!customer) {
          res.status(404).json({ error: 'Customer not found' });
          return;
        }
        res.json(mapCustomer(customer));
        return;
      }

      if (req.method === 'POST' && path === '/customers') {
        const body = req.body as Record<string, unknown>;
        const { data, error } = await client.from('customers').insert({
          id: randomUUID(),
          full_name: String(body['fullName'] ?? ''),
          email: String(body['email'] ?? ''),
          phone: String(body['phone'] ?? ''),
          whatsapp: String(body['whatsapp'] ?? ''),
          notes: String(body['notes'] ?? ''),
        }).select('*').single();

        if (error) {
          throw error;
        }

        res.status(201).json(mapCustomer(data as CustomerRow));
        return;
      }

      if (req.method === 'PATCH' && path.startsWith('/customers/')) {
        const id = path.split('/').pop();
        const body = req.body as Record<string, unknown>;
        const { data, error } = await client.from('customers').update({
          full_name: body['fullName'],
          email: body['email'],
          phone: body['phone'],
          whatsapp: body['whatsapp'],
          notes: body['notes'],
        }).eq('id', id).select('*').single();

        if (error) {
          throw error;
        }

        res.json(mapCustomer(data as CustomerRow));
        return;
      }

      if (req.method === 'GET' && path === '/destinations') {
        res.json((await fetchDestinations(client)).map(mapDestination));
        return;
      }

      if (req.method === 'POST' && path === '/destinations') {
        const body = req.body as Record<string, unknown>;
        const { data, error } = await client.from('destinations').insert({
          id: randomUUID(),
          name: String(body['name'] ?? ''),
          location: String(body['location'] ?? ''),
          description: String(body['description'] ?? ''),
          category: String(body['category'] ?? ''),
          image: String(body['image'] ?? ''),
          starting_price: Number(body['startingPrice'] ?? 0),
          active: Boolean(body['active']),
        }).select('*').single();

        if (error) {
          throw error;
        }

        res.status(201).json(mapDestination(data as DestinationRow));
        return;
      }

      if (req.method === 'PATCH' && path.startsWith('/destinations/')) {
        const id = path.split('/').pop();
        const body = req.body as Record<string, unknown>;
        const { data, error } = await client.from('destinations').update({
          name: body['name'],
          location: body['location'],
          description: body['description'],
          category: body['category'],
          image: body['image'],
          starting_price: body['startingPrice'],
          active: body['active'],
        }).eq('id', id).select('*').single();

        if (error) {
          throw error;
        }

        res.json(mapDestination(data as DestinationRow));
        return;
      }

      if (req.method === 'DELETE' && path.startsWith('/destinations/')) {
        const id = path.split('/').pop();
        const { error } = await client.from('destinations').delete().eq('id', id);
        if (error) {
          throw error;
        }
        res.status(204).send();
        return;
      }

      if (req.method === 'GET' && path === '/tours') {
        res.json((await fetchTours(client)).map(mapTour));
        return;
      }

      if (req.method === 'POST' && path === '/tours') {
        const body = req.body as Record<string, unknown>;
        const { data, error } = await client.from('tours').insert({
          id: randomUUID(),
          name: String(body['name'] ?? ''),
          destination_id: String(body['destinationId'] ?? ''),
          description: String(body['description'] ?? ''),
          duration: String(body['duration'] ?? ''),
          price: Number(body['price'] ?? 0),
          price_type: String(body['priceType'] ?? 'fixed'),
          available_days: Array.isArray(body['availableDays']) ? body['availableDays'] : [],
          maximum_guests: Number(body['maximumGuests'] ?? 0),
          images: Array.isArray(body['images']) ? body['images'] : [],
          category: String(body['category'] ?? ''),
          active: Boolean(body['active']),
        }).select('*').single();

        if (error) {
          throw error;
        }

        res.status(201).json(mapTour(data as TourRow));
        return;
      }

      if (req.method === 'PATCH' && path.startsWith('/tours/')) {
        const id = path.split('/').pop();
        const body = req.body as Record<string, unknown>;
        const { data, error } = await client.from('tours').update({
          name: body['name'],
          destination_id: body['destinationId'],
          description: body['description'],
          duration: body['duration'],
          price: body['price'],
          price_type: body['priceType'],
          available_days: body['availableDays'],
          maximum_guests: body['maximumGuests'],
          images: body['images'],
          category: body['category'],
          active: body['active'],
        }).eq('id', id).select('*').single();

        if (error) {
          throw error;
        }

        res.json(mapTour(data as TourRow));
        return;
      }

      if (req.method === 'DELETE' && path.startsWith('/tours/')) {
        const id = path.split('/').pop();
        const { error } = await client.from('tours').delete().eq('id', id);
        if (error) {
          throw error;
        }
        res.status(204).send();
        return;
      }

      res.status(404).json({ error: 'Admin endpoint not found' });
    } catch (error) {
      console.error('Admin API error', req.method, req.originalUrl, error);
      const message =
        error && typeof error === 'object' && 'message' in error
          ? String((error as { message?: unknown }).message)
          : String(error);

      res.status(500).json({ error: message });
    }
  });
}
