import type { Booking } from '../types';

const BOOKINGS_STORAGE_KEY = 'hostfully_bookings';

export const BookingService = {
  getBookings(propertyId: string): Promise<Booking[]> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const stored = localStorage.getItem(BOOKINGS_STORAGE_KEY);
        const allBookings: Booking[] = stored ? JSON.parse(stored) : [];
        const propertyBookings = allBookings.filter(
          (booking) => booking.property.id === propertyId
        );
        resolve(propertyBookings);
      }, 300);
    });
  },

  getAllBookings(): Booking[] {
    const stored = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    return stored ? JSON.parse(stored) : [];
  },

  saveBooking(booking: Booking): Promise<Booking> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allBookings = this.getAllBookings();
        allBookings.push(booking);
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(allBookings));
        resolve(booking);
      }, 200);
    });
  },

  updateBooking(updatedBooking: Booking): Promise<Booking> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allBookings = this.getAllBookings();
        const index = allBookings.findIndex((b) => b.id === updatedBooking.id);
        if (index !== -1) {
          allBookings[index] = updatedBooking;
          localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(allBookings));
        }
        resolve(updatedBooking);
      }, 200);
    });
  },

  deleteBooking(bookingId: string): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const allBookings = this.getAllBookings();
        const filtered = allBookings.filter((b) => b.id !== bookingId);
        localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(filtered));
        resolve();
      }, 200);
    });
  },

  initializeFromMockData(mockBookings: Booking[]): void {
    const existing = localStorage.getItem(BOOKINGS_STORAGE_KEY);
    if (!existing) {
      localStorage.setItem(BOOKINGS_STORAGE_KEY, JSON.stringify(mockBookings));
    }
  },
};
