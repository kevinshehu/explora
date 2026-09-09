import 'dotenv/config';
import { createClient } from '@supabase/supabase-js';
import { randomUUID } from 'node:crypto';

const JSON_HEADERS = {
  'Content-Type': 'application/json',
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET,POST,PATCH,DELETE,OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type, Authorization',
};

function jsonResponse(statusCode, body) {
  return new Response(JSON.stringify(body), {
    status: statusCode,
    headers: JSON_HEADERS,
  });
}

function normalizePath(pathname) {
  if (!pathname) {
    return '/';
  }

  const cleanPath = pathname.split('?')[0];
  const prefixes = ['/api/admin', '/.netlify/functions/admin-api'];

  for (const prefix of prefixes) {
    if (cleanPath.startsWith(prefix)) {
      return cleanPath.slice(prefix.length) || '/';
    }
  }

  return cleanPath;
}

const reservationSchemaFeatures = { place: null, tourName: null };

function mapCustomer(row) {
  return {
    id: row.id,
    fullName: row.full_name,
    email: row.email,
    phone: row.phone,
    whatsapp: row.whatsapp ?? row.phone ?? '',
    notes: row.notes ?? '',
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function mapReservationRow(row) {
  return {
    id: row.id,
    reservationCode: row.reservation_code,
    customerId: row.customer_id,
    customerName: row.customer?.full_name ?? '',
    email: row.customer?.email ?? '',
    phone: row.customer?.phone ?? '',
    whatsapp: row.customer?.whatsapp ?? row.customer?.phone ?? '',
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

function getSupabaseClient() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: { persistSession: false, autoRefreshToken: false },
  });
}

async function getReservationSchemaFeatures(client) {
  if (reservationSchemaFeatures.place !== null && reservationSchemaFeatures.tourName !== null) {
    return reservationSchemaFeatures;
  }

  const { data, error } = await client
    .from('information_schema.columns')
    .select('column_name')
    .eq('table_schema', 'public')
    .eq('table_name', 'reservations')
    .in('column_name', ['place', 'tour_name']);

  const columnNames = new Set((data ?? []).map((item) => String(item.column_name)));
  reservationSchemaFeatures.place = columnNames.has('place');
  reservationSchemaFeatures.tourName = columnNames.has('tour_name');

  if (error) {
    reservationSchemaFeatures.place = false;
    reservationSchemaFeatures.tourName = false;
  }

  return reservationSchemaFeatures;
}

async function fetchCustomers(client) {
  const { data, error } = await client.from('customers').select('*').order('created_at', { ascending: false });
  if (error) {
    throw error;
  }

  return data ?? [];
}

async function fetchReservations(client) {
  const { data, error } = await client
    .from('reservations')
    .select('*, customer:customers(*), destination:destinations(*), tour:tours(*)')
    .order('reservation_date', { ascending: false })
    .order('start_time', { ascending: false });

  if (error) {
    throw error;
  }

  return data ?? [];
}

function applyReservationFilters(rows, searchParams) {
  const query = String(searchParams.get('query') ?? '').trim().toLowerCase();
  const status = String(searchParams.get('status') ?? 'all');
  const from = String(searchParams.get('from') ?? '');
  const to = String(searchParams.get('to') ?? '');

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

async function ensureCustomer(client, payload) {
  const customerId = typeof payload.customerId === 'string' && payload.customerId.trim() ? payload.customerId : null;
  if (customerId) {
    return customerId;
  }

  const customers = await fetchCustomers(client);
  const normalizedEmail = String(payload.email ?? '').trim().toLowerCase();
  const normalizedPhone = String(payload.phone ?? '').trim();
  const normalizedWhatsapp = String(payload.whatsapp ?? '').trim();

  const existing = customers.find((customer) => {
    const emailMatch = normalizedEmail && customer.email?.trim().toLowerCase() === normalizedEmail;
    const phoneMatch = normalizedPhone && customer.phone?.trim() === normalizedPhone;
    const whatsappMatch = normalizedWhatsapp && customer.whatsapp?.trim() === normalizedWhatsapp;
    return emailMatch || phoneMatch || whatsappMatch;
  });

  if (existing) {
    const { data, error } = await client
      .from('customers')
      .update({
        full_name: payload.customerName || existing.full_name,
        email: payload.email || existing.email,
        phone: payload.phone || existing.phone,
        whatsapp: payload.whatsapp || existing.whatsapp || payload.phone || existing.phone,
      })
      .eq('id', existing.id)
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    return data.id;
  }

  const { data, error } = await client
    .from('customers')
    .insert({
      id: randomUUID(),
      full_name: payload.customerName,
      email: payload.email,
      phone: payload.phone,
      whatsapp: payload.whatsapp || payload.phone,
      notes: '',
    })
    .select('*')
    .single();

  if (error) {
    throw error;
  }

  return data.id;
}

async function ensureDestination(client, place) {
  const normalizedName = String(place ?? '').trim() || 'Unspecified place';

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

  return String(data.id);
}

async function ensureTour(client, payload) {
  const normalizedName = String(payload.tourName ?? '').trim() || 'General experience';

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
      price: Number(payload.price ?? 0),
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

  return String(data.id);
}

export default async function handler(req, context) {
  const method = (req.httpMethod || req.method || 'GET').toUpperCase();
  const rawPath = req.path || req.rawUrl || req.url || '/';
  const pathname = normalizePath(rawPath);
  const queryString = new URLSearchParams(req.queryStringParameters || {});

  if (method === 'OPTIONS') {
    return jsonResponse(200, { ok: true });
  }

  const client = getSupabaseClient();
  if (!client) {
    return jsonResponse(503, {
      error: 'Supabase is not configured on the server. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.',
    });
  }

  try {
    if (method === 'GET' && pathname === '/health') {
      return jsonResponse(200, { configured: true });
    }

    if (method === 'GET' && pathname === '/customers') {
      const customers = await fetchCustomers(client);
      return jsonResponse(200, customers.map(mapCustomer));
    }

    if (method === 'POST' && pathname === '/customers') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body ?? {});
      const payload = {
        customerId: body.customerId,
        customerName: String(body.fullName ?? body.customerName ?? ''),
        email: String(body.email ?? ''),
        phone: String(body.phone ?? ''),
        whatsapp: String(body.whatsapp ?? body.phone ?? ''),
      };

      const customerId = await ensureCustomer(client, payload);
      const { data, error } = await client
        .from('customers')
        .select('*')
        .eq('id', customerId)
        .single();

      if (error) {
        throw error;
      }

      return jsonResponse(201, mapCustomer(data));
    }

    if (method === 'PATCH' && pathname.startsWith('/customers/')) {
      const customerId = pathname.split('/').filter(Boolean).at(-1);
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body ?? {});
      const { data, error } = await client
        .from('customers')
        .update({
          full_name: body.fullName ?? body.customerName,
          email: body.email,
          phone: body.phone,
          whatsapp: body.whatsapp ?? body.phone,
          notes: body.notes,
        })
        .eq('id', customerId)
        .select('*')
        .single();

      if (error) {
        throw error;
      }

      return jsonResponse(200, mapCustomer(data));
    }

    if (method === 'DELETE' && pathname.startsWith('/customers/')) {
      const customerId = pathname.split('/').filter(Boolean).at(-1);
      const { error } = await client.from('customers').delete().eq('id', customerId);
      if (error) {
        throw error;
      }
      return jsonResponse(204, null);
    }

    if (method === 'GET' && pathname === '/reservations') {
      const reservations = applyReservationFilters(await fetchReservations(client), queryString).map(mapReservationRow);
      return jsonResponse(200, reservations);
    }

    if (method === 'GET' && pathname.startsWith('/reservations/')) {
      const reservationId = pathname.split('/').filter(Boolean).at(-1);
      const reservations = await fetchReservations(client);
      const reservation = reservations.find((row) => row.id === reservationId);

      if (!reservation) {
        return jsonResponse(404, { error: 'Reservation not found' });
      }

      return jsonResponse(200, mapReservationRow(reservation));
    }

    if (method === 'POST' && pathname === '/reservations') {
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body ?? {});
      const schema = await getReservationSchemaFeatures(client);
      const customerId = await ensureCustomer(client, {
        customerId: body.customerId,
        customerName: String(body.customerName ?? ''),
        email: String(body.email ?? ''),
        phone: String(body.phone ?? ''),
        whatsapp: String(body.whatsapp ?? body.phone ?? ''),
      });

      const place = String(body.place ?? '');
      const tourName = String(body.tourName ?? '');
      const destinationId = await ensureDestination(client, place);
      const tourId = await ensureTour(client, {
        destinationId,
        tourName,
        price: Number(body.price ?? 0),
      });

      const reservationCode = `RES-${new Date().toISOString().slice(0, 10).replace(/-/g, '')}-${randomUUID().slice(0, 8).toUpperCase()}`;
      const insertPayload = {
        id: randomUUID(),
        reservation_code: reservationCode,
        customer_id: customerId,
        destination_id: destinationId,
        tour_id: tourId,
        reservation_date: String(body.reservationDate ?? ''),
        start_time: body.startTime ? String(body.startTime) : null,
        end_time: body.endTime ? String(body.endTime) : null,
        adults: Number(body.adults ?? 0),
        children: Number(body.children ?? 0),
        total_guests: Number(body.totalGuests ?? 0),
        base_price: Number(body.price ?? 0),
        additional_costs: Number(body.additionalCosts ?? 0),
        discount: Number(body.discount ?? 0),
        total_price: Number(body.totalPrice ?? 0),
        currency: String(body.currency ?? 'EUR'),
        status: String(body.status ?? 'pending'),
        booking_source: 'whatsapp',
        pickup_location: String(body.pickupLocation ?? ''),
        customer_notes: String(body.notes ?? ''),
        internal_notes: '',
        special_requests: '',
      };

      if (schema.place) {
        insertPayload.place = place;
      }

      if (schema.tourName) {
        insertPayload.tour_name = tourName;
      }

      const { data, error } = await client
        .from('reservations')
        .insert(insertPayload)
        .select('*, customer:customers(*), destination:destinations(*), tour:tours(*)')
        .single();

      if (error) {
        throw error;
      }

      return jsonResponse(201, mapReservationRow(data));
    }

    if (method === 'PATCH' && pathname.startsWith('/reservations/')) {
      const reservationId = pathname.split('/').filter(Boolean).at(-1);
      const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : (req.body ?? {});
      const schema = await getReservationSchemaFeatures(client);

      const { data: existingReservation, error: existingError } = await client
        .from('reservations')
        .select('id, customer_id, destination_id, tour_id')
        .eq('id', reservationId)
        .single();

      if (existingError || !existingReservation) {
        return jsonResponse(404, { error: 'Reservation not found' });
      }

      const customerId = await ensureCustomer(client, {
        customerId: body.customerId || existingReservation.customer_id,
        customerName: String(body.customerName ?? ''),
        email: String(body.email ?? ''),
        phone: String(body.phone ?? ''),
        whatsapp: String(body.whatsapp ?? body.phone ?? ''),
      });

      const place = String(body.place ?? '');
      const tourName = String(body.tourName ?? '');
      const destinationId = await ensureDestination(client, place);
      const tourId = await ensureTour(client, {
        destinationId,
        tourName,
        price: Number(body.price ?? 0),
      });

      const updatePayload = {
        customer_id: customerId,
        destination_id: destinationId,
        tour_id: tourId,
        reservation_date: body.reservationDate,
        start_time: body.startTime ?? null,
        end_time: body.endTime ?? null,
        adults: body.adults,
        children: body.children,
        total_guests: body.totalGuests,
        status: body.status,
        pickup_location: body.pickupLocation,
        customer_notes: body.notes,
        base_price: body.price,
        additional_costs: body.additionalCosts,
        discount: body.discount,
        total_price: body.totalPrice,
        currency: body.currency,
      };

      if (schema.place) {
        updatePayload.place = place;
      }

      if (schema.tourName) {
        updatePayload.tour_name = tourName;
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

      return jsonResponse(200, mapReservationRow(data));
    }

    if (method === 'DELETE' && pathname.startsWith('/reservations/')) {
      const reservationId = pathname.split('/').filter(Boolean).at(-1);
      const { error } = await client.from('reservations').delete().eq('id', reservationId);
      if (error) {
        throw error;
      }
      return jsonResponse(204, null);
    }

    return jsonResponse(404, { error: 'Not found' });
  } catch (error) {
    console.error('admin-api function error', error);
    return jsonResponse(500, {
      error: error?.message || 'Internal server error',
    });
  }
}
