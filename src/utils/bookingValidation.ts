import { isAfter, isBefore, parseISO } from "date-fns";
import type { Booking } from "../types";

export interface DateRange {
  from: string;
  to: string;
}

export const checkBookingOverlap = (
  newRange: DateRange,
  existingBookings: Booking[],
  excludeBookingId?: string
): boolean => {
  const newStart = parseISO(newRange.from);
  const newEnd = parseISO(newRange.to);

  const activeBookings = existingBookings.filter(
    (booking) =>
      booking.status !== "cancelled" && booking.id !== excludeBookingId
  );

  return activeBookings.some((booking) => {
    const existingStart = parseISO(booking.checkInDate);
    const existingEnd = parseISO(booking.checkOutDate);

    const newStartOverlaps =
      isAfter(newStart, existingStart) && isBefore(newStart, existingEnd);

    const newEndOverlaps =
      isAfter(newEnd, existingStart) && isBefore(newEnd, existingEnd);

    const existingWithinNew =
      (isAfter(existingStart, newStart) ||
        existingStart.getTime() === newStart.getTime()) &&
      (isBefore(existingEnd, newEnd) ||
        existingEnd.getTime() === newEnd.getTime());

    return newStartOverlaps || newEndOverlaps || existingWithinNew;
  });
};
