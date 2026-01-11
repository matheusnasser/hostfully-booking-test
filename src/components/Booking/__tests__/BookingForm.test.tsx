import { configureStore } from "@reduxjs/toolkit";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Provider } from "react-redux";
import { describe, expect, it, vi } from "vitest";
import ModalProvider from "../../../context/ModalContext";
import bookingsReducer from "../../../store/bookings/slice";
import type { Booking, Property } from "../../../types";
import BookingForm from "../BookingForm";

import mockBookings from "../../../../public/mocks/bookings.json";
import mockProperties from "../../../../public/mocks/properties.json";

window.scrollTo = vi.fn();

const mockProperty = mockProperties[0] as unknown as Property;
const mockBookingsList = mockBookings as unknown as Booking[];

const createTestStore = (initialBookings: Booking[] = []) => {
  return configureStore({
    reducer: {
      bookings: bookingsReducer,
    },
    preloadedState: {
      bookings: {
        items: initialBookings,
        status: "idle" as const,
        error: null,
      },
    },
  });
};

const renderWithProviders = (
  component: React.ReactElement,
  store = createTestStore()
) => {
  return render(
    <Provider store={store}>
      <ModalProvider>{component}</ModalProvider>
    </Provider>
  );
};

describe("BookingForm", () => {
  it("should render property information in create mode", () => {
    renderWithProviders(<BookingForm mode="create" property={mockProperty} />);

    expect(screen.getByText("Scenic Villa")).toBeInTheDocument();
    expect(screen.getByText("Amsterdam")).toBeInTheDocument();
    expect(screen.getByText("$456/night")).toBeInTheDocument();
  });

  it("should disable submit button when dates are not selected", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookingForm mode="create" property={mockProperty} />);

    const submitBtn = screen.getByRole("button", { name: /create booking/i });
    expect(submitBtn).toBeDisabled();

    await user.type(
      screen.getByRole("textbox", { name: /guest name/i }),
      "John Doe"
    );

    expect(submitBtn).toBeDisabled();
  });

  it("should show character count for notes field", async () => {
    const user = userEvent.setup();
    renderWithProviders(<BookingForm mode="create" property={mockProperty} />);

    const notesInput = screen.getByRole("textbox", { name: /notes/i });

    expect(screen.getByText("0 / 500 characters")).toBeInTheDocument();

    await user.type(notesInput, "Special request");

    await waitFor(() => {
      expect(screen.getByText("15 / 500 characters")).toBeInTheDocument();
    });
  });

  it("should populate form fields in edit mode", () => {
    const existingBooking = mockBookingsList[0];

    renderWithProviders(
      <BookingForm mode="edit" booking={existingBooking} />,
      createTestStore(mockBookingsList)
    );

    const guestInput = screen.getByRole("textbox", {
      name: /guest name/i,
    }) as HTMLInputElement;

    expect(guestInput.value).toBe(existingBooking.guest.name);
    expect(
      screen.getByRole("button", { name: /update booking/i })
    ).toBeInTheDocument();
  });
});
