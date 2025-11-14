import React, { useEffect, useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Button, Modal, ModalFooter, Switch } from '@mo_sami/web-design-system';
import { useLanguage } from '../contexts/LanguageContext';
import { BookingsApi, type Booking } from '../services/bookingsApi';
import './ReceivedBookings.css';

const pageSize = 10;

type BookingActionType = 'accept' | 'reject';

const ReceivedBookings: React.FC = () => {
  const { t } = useTranslation();
  const { language, isRTL } = useLanguage();
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [bookingToCancel, setBookingToCancel] = useState<Booking | null>(null);
  const [submitting, setSubmitting] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);
  const [detailsData, setDetailsData] = useState<any | null>(null);
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [actionProcessing, setActionProcessing] = useState<{ id: Booking['id'] | null; type: BookingActionType | null }>({ id: null, type: null });
  const [bookingEnabled, setBookingEnabled] = useState<boolean | null>(null);
  const [bookingEnabledLoading, setBookingEnabledLoading] = useState(true);
  const [toggleSubmitting, setToggleSubmitting] = useState(false);
  const [toggleError, setToggleError] = useState<string | null>(null);

  const totalPages = useMemo(() => {
    if (total && total > 0) {
      return Math.max(1, Math.ceil(total / pageSize));
    }
    // Fallback when API does not provide total: infer potential next page
    return Math.max(1, page + (bookings.length === pageSize ? 1 : 0));
  }, [total, page, bookings.length]);
  const hasPrev = page > 1;
  const hasNextRef = React.useRef<boolean>(false);
  const hasNext = (total && total > 0) ? (page < Math.ceil(total / pageSize)) : hasNextRef.current;

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const resp = await BookingsApi.getIncoming({ page, size: pageSize, language: (language === 'ar' ? 'ar' : 'en') });
      setBookings(resp.bookings);
      setTotal(resp.total);
      hasNextRef.current = resp.hasNext;
    } catch (e) {
      setError(t('bookings.loadError'));
      setBookings([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, language]);

  const openDetails = async (booking: Booking) => {
    try {
      setDetailsOpen(true);
      setDetailsLoading(true);
      setDetailsData(null);
      setSelectedBooking(booking);
      const d = await BookingsApi.getDetails(booking.id, (language === 'ar' ? 'ar' : 'en'));
      setDetailsData(d);
    } catch (e) {
      setDetailsData(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const openCancelConfirm = (b: Booking) => {
    setBookingToCancel(b);
    setConfirmOpen(true);
  };

  const handleStatusAction = async (booking: Booking, action: BookingActionType) => {
    setActionProcessing({ id: booking.id, type: action });
    setError(null);
    try {
      if (action === 'accept') {
        await BookingsApi.accept(booking.id);
      } else {
        await BookingsApi.reject(booking.id);
      }
      await load();
    } catch (e) {
      const errorKey = action === 'accept' ? 'bookings.acceptError' : 'bookings.rejectError';
      const fallback = action === 'accept' ? 'Failed to accept booking.' : 'Failed to reject booking.';
      setError(t(errorKey, fallback));
    } finally {
      setActionProcessing({ id: null, type: null });
    }
  };

  const loadBookingEnabledStatus = React.useCallback(async () => {
    try {
      setBookingEnabledLoading(true);
      setToggleError(null);
      const enabled = await BookingsApi.getBookingEnabledStatus();
      setBookingEnabled(Boolean(enabled));
    } catch (e) {
      setToggleError(t('bookings.toggle.loadError'));
    } finally {
      setBookingEnabledLoading(false);
    }
  }, [t]);

  useEffect(() => {
    void loadBookingEnabledStatus();
  }, [loadBookingEnabledStatus]);

  const handleToggleChange = async (nextChecked: boolean) => {
    if (bookingEnabledLoading || toggleSubmitting) return;

    const previousValue = bookingEnabled;
    setBookingEnabled(nextChecked);
    setToggleError(null);
    setToggleSubmitting(true);
    try {
      const result = await BookingsApi.toggleBookingEnabled(nextChecked);
      if (typeof result === 'boolean') {
        setBookingEnabled(result);
      } else {
        setBookingEnabled(nextChecked);
      }
    } catch (e) {
      setToggleError(t('bookings.toggle.updateError'));
      setBookingEnabled(previousValue ?? false);
    } finally {
      setToggleSubmitting(false);
    }
  };

  const isToggleBusy = bookingEnabledLoading || toggleSubmitting;

  const handleCancel = async () => {
    if (!bookingToCancel) return;
    setSubmitting(true);
    try {
      await BookingsApi.cancel(bookingToCancel.id);
      setConfirmOpen(false);
      setBookingToCancel(null);
      await load();
    } catch (e) {
      // Show a simple inline error; can be enhanced to a toast later
      setError(t('bookings.cancelError'));
    } finally {
      setSubmitting(false);
    }
  };

  const formatDateTime = (value?: string) => {
    if (!value) return '-';
    const d = new Date(value);
    const datePart = d.toLocaleDateString(language);
    return `${datePart}`;
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className={`flex justify-between items-center ${isRTL ? 'flex-row-reverse' : ''}`}>
        <div className={`${isRTL ? 'text-right' : 'text-left'}`}>
          <h2 className="font-sakr font-bold text-2xl mb-2 text-gray-900">
            {t('bookings.title')}
          </h2>
          <p className="font-sakr font-normal text-lg text-gray-600">
            {t('bookings.subtitle')}
          </p>
        </div>
      </div>

      {/* Booking toggle */}
      <div className="bg-white rounded-lg border border-neutral-200 p-4">
        <div className={`flex items-center justify-between gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
          <div className={`font-sakr text-base text-gray-900 ${isRTL ? 'text-right' : 'text-left'}`}>
            <p>{t('bookings.toggle.enableNow')}</p>
            <div className="mt-1 text-sm">
              {toggleError ? (
                <span className="text-error-600">{toggleError}</span>
              ) : bookingEnabledLoading ? (
                <span className="text-text-secondary">{t('bookings.toggle.loading')}</span>
              ) : (
                <span className="text-text-secondary">
                  {bookingEnabled ? t('bookings.toggle.enabled') : t('bookings.toggle.disabled')}
                </span>
              )}
            </div>
          </div>
          <Switch
            id="booking-enabled"
            checked={Boolean(bookingEnabled)}
            onCheckedChange={handleToggleChange}
            disabled={isToggleBusy}
            aria-label={t('bookings.toggle.enableNow')}
            className={`${isRTL ? 'rtl-switch ' : ''}`}
          />
        </div>
      </div>

      {/* Content */}
      <div className="bg-white rounded-lg border border-neutral-200">
        {loading ? (
          <div className="p-8 text-center">
            <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
            <p className="mt-2 font-sakr font-normal text-text-secondary">{t('common.loading')}...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center text-error-700 font-sakr">{error}</div>
        ) : bookings.length === 0 ? (
          <div className="p-8 text-center font-sakr text-text-secondary">{t('bookings.empty')}</div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 border-b border-neutral-200">
                <tr>
                  <th className="px-4 py-3 text-left font-sakr font-medium text-sm text-text-primary" style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('bookings.car')}</th>
                  <th className="px-4 py-3 text-left font-sakr font-medium text-sm text-text-primary" style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('bookings.dateFrom')}</th>
                  <th className="px-4 py-3 text-left font-sakr font-medium text-sm text-text-primary" style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('bookings.dateTo')}</th>
                  <th className="px-4 py-3 text-left font-sakr font-medium text-sm text-text-primary" style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('bookings.totalPrice')}</th>
                  <th className="px-4 py-3 text-left font-sakr font-medium text-sm text-text-primary" style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('bookings.pickupAddress')}</th>
                  <th className="px-4 py-3 text-left font-sakr font-medium text-sm text-text-primary" style={{ textAlign: isRTL ? 'right' : 'left' }}>{t('bookings.actions')}</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200">
                {bookings.map((b) => {
                  const normalizedStatus = String(b.status || (b as any).state || '').toLowerCase();
                  const isProcessing = actionProcessing.id === b.id;
                  return (
                    <tr key={String(b.id)} className="hover:bg-neutral-25 transition-colors">
                    <td className="px-4 py-4 font-sakr text-sm text-text-primary">
                      {(b as any).listing_details?.title || b.car_title || '-'}
                    </td>
                    <td className="px-4 py-4 font-sakr text-sm text-text-secondary">{formatDateTime((b as any).schedule?.date_from)}</td>
                    <td className="px-4 py-4 font-sakr text-sm text-text-secondary">{formatDateTime((b as any).schedule?.date_to)}</td>
                    <td className="px-4 py-4 font-sakr text-sm text-text-secondary">{(b as any).total_price ?? '-'}</td>
                    <td className="px-4 py-4 font-sakr text-sm text-text-secondary">{(b as any).address ?? '-'}</td>
                    <td className="px-4 py-4">
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => openDetails(b)}>
                          {t('bookings.details')}
                        </Button>
                        {normalizedStatus === 'pending_your_approval' && (
                          <>
                            <Button
                              size="sm"
                              onClick={() => handleStatusAction(b, 'accept')}
                              disabled={isProcessing && actionProcessing.type === 'accept'}
                            >
                              {isProcessing && actionProcessing.type === 'accept' ? t('common.loading') : t('bookings.accept')}
                            </Button>
                            <Button
                              variant="destructive"
                              size="sm"
                              onClick={() => handleStatusAction(b, 'reject')}
                              disabled={isProcessing && actionProcessing.type === 'reject'}
                            >
                              {isProcessing && actionProcessing.type === 'reject' ? t('common.loading') : t('bookings.reject')}
                            </Button>
                          </>
                        )}
                        {normalizedStatus === 'accepted' && (
                          <Button variant="destructive"  size="sm" onClick={() => openCancelConfirm(b)}>
                            {t('bookings.cancel')}
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <Modal open={detailsOpen} onOpenChange={(open) => setDetailsOpen(open)} title={t('bookings.details', 'Details')} size="lg">
        <div className="p-6 space-y-6">
          {detailsLoading ? (
            <div className="text-center">
              <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
              <p className="mt-2 font-sakr text-text-secondary">{t('common.loading')}...</p>
            </div>
          ) : detailsData ? (
            <div className="space-y-6">
              {/* Car Details */}
              <div>
                <h4 className="font-sakr font-medium text-sm text-neutral-600 mb-2">{t('bookings.sections.car', 'Car Details')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-sakr text-xs text-neutral-500">{t('bookings.car')}</p>
                    <p className="font-sakr text-sm">{(selectedBooking as any)?.listing_details?.title || (selectedBooking as any)?.car_title || '-'}</p>
                  </div>
                  <div>
                    <p className="font-sakr text-xs text-neutral-500">{t('bookings.totalPrice')}</p>
                    <p className="font-sakr text-sm">{(selectedBooking as any)?.total_price ?? '-'}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="font-sakr text-xs text-neutral-500">{t('bookings.pickupAddress')}</p>
                    <p className="font-sakr text-sm">{(selectedBooking as any)?.address ?? '-'}</p>
                  </div>
                </div>
              </div>

              {/* Booking Details */}
              <div>
                <h4 className="font-sakr font-medium text-sm text-neutral-600 mb-2">{t('bookings.sections.booking', 'Booking Details')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-sakr text-xs text-neutral-500">{t('bookings.dateFrom')}</p>
                    <p className="font-sakr text-sm">{formatDateTime((selectedBooking as any)?.schedule?.date_from)}</p>
                  </div>
                  <div>
                    <p className="font-sakr text-xs text-neutral-500">{t('bookings.dateTo')}</p>
                    <p className="font-sakr text-sm">{formatDateTime((selectedBooking as any)?.schedule?.date_to)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <p className="font-sakr text-xs text-neutral-500">{t('bookings.details')}</p>
                    <p className="font-sakr text-sm whitespace-pre-wrap">{detailsData?.details || '-'}</p>
                  </div>
                </div>
              </div>

              {/* Contact Details */}
              <div>
                <h4 className="font-sakr font-medium text-sm text-neutral-600 mb-2">{t('bookings.sections.contact', 'Contact Details')}</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <p className="font-sakr text-xs text-neutral-500">{t('bookings.customer')}</p>
                    <p className="font-sakr text-sm">{detailsData?.user?.name || '-'}</p>
                  </div>
                  <div>
                    <p className="font-sakr text-xs text-neutral-500">{t('bookings.phone')}</p>
                    <p className="font-sakr text-sm">
                      {Array.isArray(detailsData?.contact_details?.contacts) && detailsData.contact_details.contacts.length > 0
                        ? detailsData.contact_details.contacts.map((c: any, idx: number) => (
                            <span key={`details-phone-${idx}`}>
                              <a href={`tel:${c}`} className="text-primary-700 hover:underline">{c}</a>
                              {idx < detailsData.contact_details.contacts.length - 1 ? ', ' : ''}
                            </span>
                          ))
                        : '-'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <p className="font-sakr text-sm text-error-700">{t('common.error')}</p>
          )}
        </div>
        <ModalFooter>
          <div className="flex gap-3 justify-end">
            <Button variant="text" onClick={() => setDetailsOpen(false)}>
              {t('common.close')}
            </Button>
          </div>
        </ModalFooter>
      </Modal>

      {/* Pagination */}
      {(bookings.length > 0 || hasPrev) && (
        <div className={`flex items-center justify-between ${isRTL ? 'flex-row-reverse' : ''}`}>
          <p className="font-sakr font-normal text-sm text-gray-600">
            {t('common.pageOfTotal', { current: page, total: totalPages })}
          </p>
          <div className={`flex gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
            <Button variant="outlined" size="small" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={!hasPrev}>
              {t('common.previous')}
            </Button>
            <Button variant="outlined" size="small" onClick={() => setPage((p) => p + 1)} disabled={!hasNext}>
              {t('common.next')}
            </Button>
          </div>
        </div>
      )}

      {/* Cancel confirmation */}
      <Modal open={confirmOpen} onOpenChange={(open) => setConfirmOpen(open)} title={t('bookings.cancel.confirmTitle')} size="md">
        <div className="p-6">
          <p className="font-sakr text-sm text-on-surface-variant">{t('bookings.cancel.confirm')}</p>
        </div>
        <ModalFooter>
          <div className="flex gap-3 justify-end">
            <Button variant="text" onClick={() => setConfirmOpen(false)}>
              {t('common.cancel')}
            </Button>
            <Button variant="destructive" onClick={handleCancel} disabled={submitting}>
              {submitting ? t('common.loading') : t('bookings.cancel')}
            </Button>
          </div>
        </ModalFooter>
      </Modal>
    </div>
  );
};

export default ReceivedBookings;


