import {
  createAsyncThunk,
  createSlice,
  type PayloadAction,
} from "@reduxjs/toolkit";
import axios from "axios";
import type { Booking } from "../../types";
import { checkBookingOverlap } from "../../utils/bookingValidation";

type BookingState = {
  items: Booking[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

type CreateBookingPayload = {
  propertyId: string;
  property: Booking["property"];
  guestName: string;
  bookingRange: {
    from: string;
    to: string;
  };
  notes?: string;
  nights: number;
  totalPrice: number;
};

type UpdateBookingPayload = {
  id: string;
  guestName: string;
  bookingRange: {
    from: string;
    to: string;
  };
  notes?: string;
  nights: number;
  totalPrice: number;
};

const initialState: BookingState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchBookings = createAsyncThunk(
  "bookings/fetchBookings",
  async (propertyId: string) => {
    // Simulate network latency for demonstration purposes
    await new Promise((resolve) => setTimeout(resolve, 600));
    const response = await axios.get("/mocks/bookings.json");

    return response.data.filter(
      (booking: Booking) => booking.property.id === propertyId
    );
  }
);

const bookingSlice = createSlice({
  name: "bookings",
  initialState,
  reducers: {
    createBooking: (state, action: PayloadAction<CreateBookingPayload>) => {
      const hasOverlap = checkBookingOverlap(
        action.payload.bookingRange,
        state.items
      );

      if (hasOverlap) {
        state.error =
          "Cannot create booking: dates overlap with existing booking";
        return;
      }

      const newBooking: Booking = {
        ...action.payload,
        id: crypto.randomUUID(),
        status: "upcoming",
        guest: {
          id: crypto.randomUUID(),
          name: action.payload.guestName,
        },
        nights: action.payload.nights,
        totalPrice: action.payload.totalPrice,
        checkInDate: action.payload.bookingRange.from,
        checkOutDate: action.payload.bookingRange.to,
        property: action.payload.property,
        notes: action.payload.notes,
      };
      state.items.push(newBooking);
      state.error = null;
    },

    updateBooking: (state, action: PayloadAction<UpdateBookingPayload>) => {
      const hasOverlap = checkBookingOverlap(
        action.payload.bookingRange,
        state.items,
        action.payload.id
      );

      if (hasOverlap) {
        state.error =
          "Cannot update booking: dates overlap with existing booking";
        return;
      }

      const booking = state.items.find((b) => b.id === action.payload.id);
      if (booking) {
        booking.guest.name = action.payload.guestName;
        booking.checkInDate = action.payload.bookingRange.from;
        booking.checkOutDate = action.payload.bookingRange.to;
        booking.nights = action.payload.nights;
        booking.totalPrice = action.payload.totalPrice;
        booking.notes = action.payload.notes;
        state.error = null;
      }
    },

    deleteBooking: (state, action: PayloadAction<string>) => {
      state.items = state.items.filter(
        (booking) => booking.id !== action.payload
      );
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchBookings.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchBookings.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || "Failed to fetch bookings";
    });

    builder.addCase(fetchBookings.fulfilled, (state, action) => {
      state.status = "idle";
      state.items = action.payload;
    });
  },
});

export const { createBooking, updateBooking, deleteBooking } =
  bookingSlice.actions;
export default bookingSlice.reducer;
