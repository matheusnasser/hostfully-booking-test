import { describe, expect, it } from "vitest";
import type { Booking } from "../../types";
import { checkBookingOverlap } from "../bookingValidation";

const createMockBooking = (
  id: string,
  checkInDate: string,
  checkOutDate: string,
  status: Booking["status"] = "upcoming"
): Booking => ({
  id,
  checkInDate,
  checkOutDate,
  nights: 1,
  totalPrice: 100,
  status,
  property: {
    id: "prop-1",
    name: "Test Property",
    city: "Test City",
    country: "Test Country",
    imageUrl: "test.jpg",
  },
  guest: {
    id: "guest-1",
    name: "Test Guest",
  },
});

describe("checkBookingOverlap", () => {
  it("should detect overlap when new booking starts during existing booking", () => {
    const existingBookings = [
      createMockBooking("1", "2024-03-10", "2024-03-15"),
    ];

    const newRange = { from: "2024-03-12", to: "2024-03-17" };
    const hasOverlap = checkBookingOverlap(newRange, existingBookings);

    expect(hasOverlap).toBe(true);
  });

  it("should detect overlap when new booking ends during existing booking", () => {
    const existingBookings = [
      createMockBooking("1", "2024-03-10", "2024-03-15"),
    ];

    const newRange = { from: "2024-03-08", to: "2024-03-12" };
    const hasOverlap = checkBookingOverlap(newRange, existingBookings);

    expect(hasOverlap).toBe(true);
  });

  it("should detect overlap when new booking completely contains existing booking", () => {
    const existingBookings = [
      createMockBooking("1", "2024-03-12", "2024-03-14"),
    ];

    const newRange = { from: "2024-03-10", to: "2024-03-16" };
    const hasOverlap = checkBookingOverlap(newRange, existingBookings);

    expect(hasOverlap).toBe(true);
  });

  it("should detect overlap when new booking is completely within existing booking", () => {
    const existingBookings = [
      createMockBooking("1", "2024-03-10", "2024-03-20"),
    ];

    const newRange = { from: "2024-03-12", to: "2024-03-15" };
    const hasOverlap = checkBookingOverlap(newRange, existingBookings);

    expect(hasOverlap).toBe(true);
  });

  it("should not detect overlap when bookings are consecutive (checkout = checkin)", () => {
    const existingBookings = [
      createMockBooking("1", "2024-03-10", "2024-03-15"),
    ];

    const newRange = { from: "2024-03-15", to: "2024-03-20" };
    const hasOverlap = checkBookingOverlap(newRange, existingBookings);

    expect(hasOverlap).toBe(false);
  });

  it("should not detect overlap when bookings are completely separate", () => {
    const existingBookings = [
      createMockBooking("1", "2024-03-10", "2024-03-15"),
    ];

    const newRange = { from: "2024-03-20", to: "2024-03-25" };
    const hasOverlap = checkBookingOverlap(newRange, existingBookings);

    expect(hasOverlap).toBe(false);
  });

  it("should ignore cancelled bookings when checking overlap", () => {
    const existingBookings = [
      createMockBooking("1", "2024-03-10", "2024-03-15", "cancelled"),
    ];

    const newRange = { from: "2024-03-12", to: "2024-03-17" };
    const hasOverlap = checkBookingOverlap(newRange, existingBookings);

    expect(hasOverlap).toBe(false);
  });

  it("should exclude specific booking when provided excludeBookingId", () => {
    const existingBookings = [
      createMockBooking("1", "2024-03-10", "2024-03-15"),
      createMockBooking("2", "2024-03-20", "2024-03-25"),
    ];

    const newRange = { from: "2024-03-10", to: "2024-03-15" };
    const hasOverlap = checkBookingOverlap(newRange, existingBookings, "1");

    expect(hasOverlap).toBe(false);
  });

  it("should handle multiple existing bookings", () => {
    const existingBookings = [
      createMockBooking("1", "2024-03-01", "2024-03-05"),
      createMockBooking("2", "2024-03-10", "2024-03-15"),
      createMockBooking("3", "2024-03-20", "2024-03-25"),
    ];

    const newRange = { from: "2024-03-13", to: "2024-03-17" };
    const hasOverlap = checkBookingOverlap(newRange, existingBookings);

    expect(hasOverlap).toBe(true);
  });

  it("should not detect overlap with empty bookings list", () => {
    const existingBookings: Booking[] = [];

    const newRange = { from: "2024-03-10", to: "2024-03-15" };
    const hasOverlap = checkBookingOverlap(newRange, existingBookings);

    expect(hasOverlap).toBe(false);
  });
});
