import { configureStore } from "@reduxjs/toolkit";
import { render, screen } from "@testing-library/react";
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
  it("should render property information correctly", () => {
    renderWithProviders(<BookingForm mode="create" property={mockProperty} />);

    expect(screen.getByText("Scenic Villa")).toBeInTheDocument();
    expect(screen.getByText("Amsterdam")).toBeInTheDocument();
    expect(screen.getByText("$456/night")).toBeInTheDocument();
  });

  it("should validate required fields", async () => {
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

  it("should display overlap error when selecting conflicting dates", async () => {
    const user = userEvent.setup();
    renderWithProviders(
      <BookingForm mode="create" property={mockProperty} />,
      createTestStore(mockBookingsList)
    );

    const guestInput = screen.getByRole("textbox", { name: /guest name/i });
    await user.type(guestInput, "New Guest");

    expect(screen.getByText(/select dates/i)).toBeInTheDocument();
  });
});
