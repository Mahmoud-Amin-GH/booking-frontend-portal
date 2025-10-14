import api, { FORSALE_SERVICES_API_BASE_URL } from './api';

export interface Booking {
  id: string | number;
  customer_name?: string;
  customer_phone?: string;
  car_title?: string;
  pickup_date?: string;
  dropoff_date?: string;
  status?: string;
  [key: string]: any;
}

export interface IncomingBookingsResponse {
  bookings: Booking[];
  total: number;
  page: number;
  size: number;
  hasNext: boolean;
}

const coerceBookingsPayload = (raw: any, pageArg: number, sizeArg: number): IncomingBookingsResponse => {
  const payload = raw?.data ?? raw;
  const items = payload?.items || payload?.bookings || payload?.results || payload?.data || [];
  const pagination = payload?.pagination || payload?.meta?.pagination || null;
  const total = pagination?.total ?? payload?.total ?? payload?.count ?? payload?.totalItems ?? payload?.total_elements ?? 0;
  const page = pagination?.page ?? payload?.page ?? payload?.current_page ?? payload?.pageNumber ?? pageArg;
  const size = pagination?.size ?? payload?.size ?? payload?.page_size ?? payload?.pageSize ?? payload?.limit ?? sizeArg;
  const hasNext = Boolean(pagination?.has_next ?? pagination?.hasNext ?? (total > 0 ? page * size < total : items.length === size));
  const normalized: Booking[] = items.map((b: any) => ({
    id: b.id ?? b.booking_id ?? b.uuid ?? b._id ?? Math.random().toString(36).slice(2),
    customer_name: b.customer_name ?? b.customer?.name ?? b.user?.name,
    customer_phone: b.customer_phone ?? b.customer?.phone ?? b.user?.phone,
    car_title: b.car_title ?? b.vehicle?.title ?? b.listing?.title,
    pickup_date: b.pickup_date ?? b.start_date ?? b.pickup_at ?? b.start,
    dropoff_date: b.dropoff_date ?? b.end_date ?? b.dropoff_at ?? b.end,
    status: b.status,
    ...b,
  }));
  return { bookings: normalized, total, page, size, hasNext };
};

export const BookingsApi = {
  getIncoming: async (params: { page: number; size: number; language: 'en' | 'ar' }): Promise<IncomingBookingsResponse> => {
    const { page, size, language } = params;
    const response = await api.get(
      `${FORSALE_SERVICES_API_BASE_URL}/v1/listing-service/bookings/incoming`,
      {
        params: { page, size },
        headers: {
          'Accept': 'application/json',
          'Accept-Language': language,
        },
      }
    );
    return coerceBookingsPayload(response.data, page, size);
  },
  getDetails: async (bookingId: string | number, language: 'en' | 'ar'): Promise<any> => {
    const response = await api.get(
      `${FORSALE_SERVICES_API_BASE_URL}/v1/listing-service/bookings/${bookingId}`,
      {
        headers: {
          'Accept-Language': language,
        },
      }
    );
    return response.data?.data ?? response.data;
  },

  accept: async (bookingId: string | number): Promise<void> => {
    await api.post(
      `${FORSALE_SERVICES_API_BASE_URL}/v1/listing-service/bookings/${bookingId}/action`,
      { action: 'accept' },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  },

  reject: async (bookingId: string | number): Promise<void> => {
    await api.post(
      `${FORSALE_SERVICES_API_BASE_URL}/v1/listing-service/bookings/${bookingId}/action`,
      { action: 'reject' },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  },

  cancel: async (bookingId: string | number): Promise<void> => {
    await api.post(
      `${FORSALE_SERVICES_API_BASE_URL}/v1/listing-service/bookings/${bookingId}/action`,
      { action: 'cancel' },
      {
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  },
} as const;

export default BookingsApi;


