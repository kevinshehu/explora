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
}

interface TourRow {
  id: string;
  name: string;
  destination_id: string;
}

interface ReservationRow {
  id: string;
  reservation_code: string;
  customer_id: string;
  destination_id: string | null;
  tour_id: string | null;
  reservation_date: string;
  start_time: string | null;
  end_time: string | null;
  adults: number;
  children: number;
  total_guests: number;
  place?: string | null;
  tour_name?: string | null;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  pickup_location: string;
  customer_notes: string;
  base_price: number;
  additional_costs: number;
  discount: number;
  total_price: number;
  currency: string;
  created_at: string;
  updated_at: string;
  customer?: CustomerRow | null;
  destination?: DestinationRow | null;
  tour?: TourRow | null;
}

interface SupabaseEnv {
  url: string;
  serviceRoleKey: string;
}

interface ReservationSchemaFeatures {
  place: boolean;
  tourName: boolean;
}

let reservationSchemaFeatures: ReservationSchemaFeatures | null = null;

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

function mapReservationRow(row: ReservationRow) {
  return {
    id: row.id,
    reservationCode: row.reservation_code,
    customerId: row.customer_id,
    customerName: row.customer?.full_name ?? '',
    email: row.customer?.email ?? '',
    phone: row.customer?.phone ?? '',
    whatsapp: row.customer?.whatsapp ?? '',
    reservationDate: row.reservation_date,
    startTime: row.start_time,
    endTime: row.end_time,
    adults: Number(row.adults),
    children: Number(row.children),
    totalGuests: Number(row.total_guests),
    place: row.place ?? row.destination?.name ?? '',
    tourName: row.tour_name ?? row.tour?.name ?? '',
    status: row.status,
    pickupLocation: row.pickup_location,
    notes: row.customer_notes,
    price: Number(row.base_price),
    additionalCosts: Number(row.additional_costs),
    discount: Number(row.discount),
    totalPrice: Number(row.total_price),
    currency: row.currency,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

async function getReservationSchemaFeatures(client: SupabaseClient): Promise<ReservationSchemaFeatures> {
  if (reservationSchemaFeatures) {
    return reservationSchemaFeatures;
  }

  const { data, error } = await client
    .from('information_schema.columns')
    .select('column_name')
    .eq('table_schema', 'public')
    .eq('table_name', 'reservations')
    .in('column_name', ['place', 'tour_name']);

  if (error) {
    reservationSchemaFeatures = { place: false, tourName: false };
    return reservationSchemaFeatures;
  }

  const columnNames = new Set((data ?? []).map((item) => String((item as { column_name?: unknown }).column_name)));
  reservationSchemaFeatures = {
    place: columnNames.has('place'),
    tourName: columnNames.has('tour_name'),
  };

  return reservationSchemaFeatures;
}

async function fetchCustomers(client: SupabaseClient): Promise<CustomerRow[]> {
  const { data, error } = await client.from('customers').select('*').order('created_at', { ascending: false });
  if (error) {
    throw error;
  }
  return (data ?? []) as CustomerRow[];
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
  const from = String(request.query['from'] ?? '');
  const to = String(request.query['to'] ?? '');

  return rows.filter((row) => {
    const matchesQuery =
      !query ||
      [
        row.reservation_code,
        row.customer?.full_name,
        row.customer?.email,
        row.place,
        row.tour_name,
        row.destination?.name,
        row.tour?.name,
      ]
        .filter(Boolean)
        .some((value) => String(value).toLowerCase().includes(query));

    const matchesStatus = status === 'all' || row.status === status;
    const matchesFrom = !from || row.reservation_date >= from;
    const matchesTo = !to || row.reservation_date <= to;

    return matchesQuery && matchesStatus && matchesFrom && matchesTo;
  });
}

async function ensureCustomer(
  client: SupabaseClient,
  payload: { customerId?: string; customerName: string; email: string; phone: string; whatsapp: string },
): Promise<string> {
  if (payload.customerId) {
    return payload.customerId;
  }

  const customers = await fetchCustomers(client);
  const normalizedEmail = payload.email.trim().toLowerCase();
  const normalizedPhone = payload.phone.trim();
  const normalizedWhatsapp = payload.whatsapp.trim();

  const existing = customers.find((customer) => {
    const emailMatch = normalizedEmail && customer.email.trim().toLowerCase() === normalizedEmail;
    const phoneMatch = normalizedPhone && customer.phone.trim() === normalizedPhone;
    const whatsappMatch = normalizedWhatsapp && customer.whatsapp.trim() === normalizedWhatsapp;
    return emailMatch || phoneMatch || whatsappMatch;
  });

  if (existing) {
    const { data, error } = await client
      .from('customers')
      .update({
        full_name: payload.customerName || existing.full_name,
        email: payload.email || existing.email,
        phone: payload.phone || existing.phone,
        whatsapp: payload.whatsapp || existing.whatsapp,
      })
      .eq('id', existing.id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return (data as CustomerRow).id;
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

async function ensureDestination(client: SupabaseClient, place: string): Promise<string> {
  const normalizedName = place.trim() || 'Unspecified place';

  const { data: existing, error: existingError } = await client
    .from('destinations')
    .select('id,name')
    .eq('name', normalizedName)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing?.id) {
    return String(existing.id);
  }

  const { data, error } = await client
    .from('destinations')
    .insert({
      id: randomUUID(),
      name: normalizedName,
      location: normalizedName,
      description: normalizedName,
      category: 'General',
      image: '',
      starting_price: 0,
      active: true,
    })
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  return String((data as { id: string }).id);
}

async function ensureTour(client: SupabaseClient, payload: { destinationId: string; tourName: string; price: number }): Promise<string> {
  const normalizedName = payload.tourName.trim() || 'General experience';

  const { data: existing, error: existingError } = await client
    .from('tours')
    .select('id,name,destination_id')
    .eq('name', normalizedName)
    .eq('destination_id', payload.destinationId)
    .maybeSingle();

  if (existingError) {
    throw existingError;
  }

  if (existing?.id) {
    return String(existing.id);
  }

  const { data, error } = await client
    .from('tours')
    .insert({
      id: randomUUID(),
      name: normalizedName,
      destination_id: payload.destinationId,
      description: normalizedName,
      duration: '',
      price: payload.price,
      price_type: 'fixed',
      available_days: [],
      maximum_guests: 0,
      images: [],
      category: 'General',
      active: true,
    })
    .select('id')
    .single();

  if (error) {
    throw error;
  }

  return String((data as { id: string }).id);
}

export function registerAdminApiRoutes(server: Router): void {
  server.use('/api/admin', async (req, res) => {
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
        const schema = await getReservationSchemaFeatures(client);
        const customerId = await ensureCustomer(client, {
          customerId: typeof body['customerId'] === 'string' && body['customerId'].trim() ? String(body['customerId']) : undefined,
          customerName: String(body['customerName'] ?? ''),
          email: String(body['email'] ?? ''),
          phone: String(body['phone'] ?? ''),
          whatsapp: String(body['whatsapp'] ?? ''),
        });
        const place = String(body['place'] ?? '');
        const tourName = String(body['tourName'] ?? '');
        const destinationId = await ensureDestination(client, place);
        const tourId = await ensureTour(client, {
          destinationId,
          tourName,
          price: Number(body['price'] ?? 0),
        });

        const reservationCode = `RES-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomUUID().slice(0, 8).toUpperCase()}`;
        const insertPayload: Record<string, unknown> = {
          id: randomUUID(),
          reservation_code: reservationCode,
          customer_id: customerId,
          destination_id: destinationId,
          tour_id: tourId,
          reservation_date: String(body['reservationDate'] ?? ''),
          start_time: body['startTime'] ? String(body['startTime']) : null,
          end_time: body['endTime'] ? String(body['endTime']) : null,
          number_of_days: null,
          adults: Number(body['adults'] ?? 0),
          children: Number(body['children'] ?? 0),
          total_guests: Number(body['totalGuests'] ?? 0),
          base_price: Number(body['price'] ?? 0),
          price_per_person: 0,
          additional_costs: Number(body['additionalCosts'] ?? 0),
          discount: Number(body['discount'] ?? 0),
          total_price: Number(body['totalPrice'] ?? 0),
          currency: String(body['currency'] ?? 'EUR'),
          status: String(body['status'] ?? 'pending'),
          booking_source: 'whatsapp',
          pickup_location: String(body['pickupLocation'] ?? ''),
          customer_notes: String(body['notes'] ?? ''),
          internal_notes: '',
          special_requests: '',
        };

        if (schema.place) {
          insertPayload['place'] = place;
        }

        if (schema.tourName) {
          insertPayload['tour_name'] = tourName;
        }

        const { data, error } = await client
          .from('reservations')
          .insert(insertPayload)
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
        const reservationId = String(id ?? '');
        const schema = await getReservationSchemaFeatures(client);

        const { data: existingReservation, error: existingError } = await client
          .from('reservations')
          .select('id, customer_id, destination_id, tour_id')
          .eq('id', reservationId)
          .single();

        if (existingError || !existingReservation) {
          res.status(404).json({ error: 'Reservation not found' });
          return;
        }

        const customerId = await ensureCustomer(client, {
          customerId:
            typeof body['customerId'] === 'string' && body['customerId'].trim()
              ? String(body['customerId'])
              : String(existingReservation.customer_id),
          customerName: String(body['customerName'] ?? ''),
          email: String(body['email'] ?? ''),
          phone: String(body['phone'] ?? ''),
          whatsapp: String(body['whatsapp'] ?? ''),
        });

        const place = String(body['place'] ?? '');
        const tourName = String(body['tourName'] ?? '');
        const destinationId = await ensureDestination(client, place);
        const tourId = await ensureTour(client, {
          destinationId,
          tourName,
          price: Number(body['price'] ?? 0),
        });

        const updatePayload: Record<string, unknown> = {
          customer_id: customerId,
          destination_id: destinationId,
          tour_id: tourId,
          reservation_date: body['reservationDate'],
          start_time: body['startTime'] ?? null,
          end_time: body['endTime'] ?? null,
          adults: body['adults'],
          children: body['children'],
          total_guests: body['totalGuests'],
          status: body['status'],
          pickup_location: body['pickupLocation'],
          customer_notes: body['notes'],
          base_price: body['price'],
          additional_costs: body['additionalCosts'],
          discount: body['discount'],
          total_price: body['totalPrice'],
          currency: body['currency'],
        };

        if (schema.place) {
          updatePayload['place'] = place;
        }

        if (schema.tourName) {
          updatePayload['tour_name'] = tourName;
        }

        const { data, error } = await client
          .from('reservations')
          .update(updatePayload)
          .eq('id', reservationId)
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
        const customers = (await fetchCustomers(client))
          .filter((customer) => {
            if (!query) {
              return true;
            }
            return [customer.full_name, customer.email, customer.phone, customer.whatsapp]
              .some((value) => value.toLowerCase().includes(query));
          })
          .map(mapCustomer);
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
        const { data, error } = await client
          .from('customers')
          .insert({
            id: randomUUID(),
            full_name: String(body['fullName'] ?? ''),
            email: String(body['email'] ?? ''),
            phone: String(body['phone'] ?? ''),
            whatsapp: String(body['whatsapp'] ?? ''),
            notes: String(body['notes'] ?? ''),
          })
          .select('*')
          .single();

        if (error) {
          throw error;
        }

        res.status(201).json(mapCustomer(data as CustomerRow));
        return;
      }

      if (req.method === 'PATCH' && path.startsWith('/customers/')) {
        const id = path.split('/').pop();
        const body = req.body as Record<string, unknown>;
        const { data, error } = await client
          .from('customers')
          .update({
            full_name: body['fullName'],
            email: body['email'],
            phone: body['phone'],
            whatsapp: body['whatsapp'],
            notes: body['notes'],
          })
          .eq('id', id)
          .select('*')
          .single();

        if (error) {
          throw error;
        }

        res.json(mapCustomer(data as CustomerRow));
        return;
      }

      if (req.method === 'DELETE' && path.startsWith('/customers/')) {
        const id = path.split('/').pop();
        const customerId = String(id ?? '');

        const { error: reservationError } = await client.from('reservations').delete().eq('customer_id', customerId);
        if (reservationError) {
          throw reservationError;
        }

        const { error } = await client.from('customers').delete().eq('id', customerId);
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
