import { beforeEach, describe, expect, it } from "vitest";
import type { Booking } from "../../../types";
import bookingsReducer, {
  createBooking,
  deleteBooking,
  updateBooking,
} from "../slice";

const mockProperty = {
  id: "prop-1",
  name: "Test Property",
  city: "Test City",
  country: "US",
  imageUrl: "test.jpg",
};

const mockBooking: Booking = {
  id: "booking-1",
  checkInDate: "2024-03-10",
  checkOutDate: "2024-03-15",
  nights: 5,
  totalPrice: 500,
  status: "upcoming",
  property: mockProperty,
  guest: {
    id: "guest-1",
    name: "John Doe",
  },
};

describe("bookings slice", () => {
  let initialState: ReturnType<typeof bookingsReducer>;

  beforeEach(() => {
    initialState = {
      items: [],
      status: "idle",
      error: null,
    };
  });

  describe("createBooking", () => {
    it("adds a new booking with valid data", () => {
      const action = createBooking({
        propertyId: "prop-1",
        property: mockProperty,
        guestName: "John Doe",
        bookingRange: { from: "2024-03-10", to: "2024-03-15" },
        nights: 5,
        totalPrice: 500,
      });

      const state = bookingsReducer(initialState, action);

      expect(state.items).toHaveLength(1);
      expect(state.items[0].guest.name).toBe("John Doe");
      expect(state.items[0].nights).toBe(5);
      expect(state.error).toBeNull();
    });

    it("prevents overlapping bookings", () => {
      const stateWithBooking = {
        items: [mockBooking],
        status: "idle" as const,
        error: null,
      };

      const overlappingAction = createBooking({
        propertyId: "prop-1",
        property: mockProperty,
        guestName: "Jane Doe",
        bookingRange: { from: "2024-03-12", to: "2024-03-17" },
        nights: 5,
        totalPrice: 500,
      });

      const state = bookingsReducer(stateWithBooking, overlappingAction);

      expect(state.items).toHaveLength(1);
      expect(state.error).toBe(
        "Cannot create booking: dates overlap with existing booking"
      );
    });

    it("allows consecutive bookings", () => {
      const stateWithBooking = {
        items: [mockBooking],
        status: "idle" as const,
        error: null,
      };

      const consecutiveAction = createBooking({
        propertyId: "prop-1",
        property: mockProperty,
        guestName: "Jane Doe",
        bookingRange: { from: "2024-03-15", to: "2024-03-20" },
        nights: 5,
        totalPrice: 500,
      });

      const state = bookingsReducer(stateWithBooking, consecutiveAction);

      expect(state.items).toHaveLength(2);
      expect(state.error).toBeNull();
    });
  });

  describe("updateBooking", () => {
    it("updates an existing booking", () => {
      const stateWithBooking = {
        items: [mockBooking],
        status: "idle" as const,
        error: null,
      };

      const action = updateBooking({
        id: "booking-1",
        guestName: "Jane Smith",
        bookingRange: { from: "2024-03-10", to: "2024-03-16" },
        nights: 6,
        totalPrice: 600,
      });

      const state = bookingsReducer(stateWithBooking, action);

      expect(state.items[0].guest.name).toBe("Jane Smith");
      expect(state.items[0].nights).toBe(6);
      expect(state.error).toBeNull();
    });

    it("excludes current booking from overlap check", () => {
      const stateWithBooking = {
        items: [mockBooking],
        status: "idle" as const,
        error: null,
      };

      const action = updateBooking({
        id: "booking-1",
        guestName: "John Doe",
        bookingRange: { from: "2024-03-10", to: "2024-03-15" },
        nights: 5,
        totalPrice: 500,
      });

      const state = bookingsReducer(stateWithBooking, action);

      expect(state.items[0].checkInDate).toBe("2024-03-10");
      expect(state.error).toBeNull();
    });
  });

  describe("deleteBooking", () => {
    it("removes a booking by ID", () => {
      const stateWithBooking = {
        items: [mockBooking],
        status: "idle" as const,
        error: null,
      };

      const action = deleteBooking("booking-1");
      const state = bookingsReducer(stateWithBooking, action);

      expect(state.items).toHaveLength(0);
    });
  });
});
