import { AlertDialog } from "radix-ui";
import { memo } from "react";
import { useModal } from "../../context/ModalContext";
import { useAppDispatch } from "../../hooks/redux";
import { deleteBooking } from "../../store/bookings/slice";
import type { Booking, BookingStatus } from "../../types";
import { shortenDate } from "../../utils/formatDate";

const statusObj: Record<BookingStatus, { label: string; color: string }> = {
  upcoming: { label: "Upcoming", color: "bg-primary" },
  ongoing: { label: "Ongoing", color: "bg-secondary" },
  finished: { label: "Past", color: "bg-gray-500" },
  cancelled: { label: "Cancelled", color: "bg-red-500" },
};

type BookingCardProps = {
  booking: Booking;
};

export const BookingCard = memo(function BookingCard({
  booking,
}: BookingCardProps) {
  const { openModal } = useModal();
  const dispatch = useAppDispatch();

  const isCancelled = booking.status === "cancelled";

  const handleClick = () => {
    openModal({ type: "view-booking", booking });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      className="bg-white border border-gray-200 rounded-lg p-5 cursor-pointer hover:shadow-lg hover:border-gray-300 transition-all duration-200"
      aria-label={`View booking for ${booking.property.name} from ${shortenDate(
        booking.checkInDate
      )} to ${shortenDate(booking.checkOutDate)}`}
    >
      <div className="flex items-start justify-between mb-3 gap-3">
        <h3 className="font-semibold text-lg text-gray-900 leading-tight">
          {booking.property.name}
          <span className="text-gray-500 font-normal">
            {" "}
            · {booking.property.city}
          </span>
        </h3>

        <span
          className={`${
            statusObj[booking.status].color
          } text-white text-xs font-medium px-3 py-1 rounded-full whitespace-nowrap`}
        >
          {statusObj[booking.status].label}
        </span>
      </div>

      <div className="flex items-center gap-2 text-sm text-gray-600 mb-3">
        <span className="font-semibold text-blue-600">
          {booking.nights} {booking.nights === 1 ? "night" : "nights"}
        </span>
        <span className="text-gray-400">•</span>
        <span>{shortenDate(booking.checkInDate)}</span>
        <span>{shortenDate(booking.checkOutDate)}</span>
      </div>

      <div className="flex items-end justify-between gap-4 pt-3 border-t border-gray-100">
        <div className="text-sm">
          <p className="text-gray-500">Guest</p>
          <p className="font-medium text-gray-900 mt-0.5">
            {booking.guest.name}
          </p>

          {booking.notes && (
            <p className="text-gray-500 mt-0.5">{booking.notes}</p>
          )}
        </div>

        <div className="text-right">
          <p
            className={`${
              isCancelled
                ? "line-through text-gray-400"
                : "font-bold text-gray-900"
            } text-xl`}
          >
            ${booking.totalPrice.toLocaleString()}
          </p>
          <p
            className={`${
              isCancelled ? "line-through" : ""
            } text-sm text-gray-500 mt-0.5`}
          >
            $
            {booking.nights > 0
              ? Math.round(booking.totalPrice / booking.nights)
              : 0}{" "}
            per night
          </p>
        </div>
      </div>

      {!isCancelled && (
        <div className="mt-4 pt-4 border-t border-gray-100 flex justify-end gap-2">
          <button
            onClick={(e) => {
              e.stopPropagation();
              openModal({ type: "edit-booking", booking });
            }}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-150"
          >
            Edit
          </button>

          <AlertDialog.Root>
            <AlertDialog.Trigger asChild>
              <button
                onClick={(e) => e.stopPropagation()}
                className="px-4 py-2 cursor-pointer text-sm font-medium text-red-600 bg-red-50 hover:bg-red-100 rounded-md transition-colors duration-150"
              >
                Delete
              </button>
            </AlertDialog.Trigger>
            <AlertDialog.Portal>
              <AlertDialog.Overlay className="fixed inset-0 bg-black/50 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
              <AlertDialog.Content className="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 max-w-md w-full bg-white rounded-lg shadow-lg p-6 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95">
                <AlertDialog.Title className="text-lg font-semibold text-gray-900 mb-2">
                  Delete Booking
                </AlertDialog.Title>
                <AlertDialog.Description className="text-sm text-gray-600 mb-6">
                  Are you sure you want to delete this booking for{" "}
                  <span className="font-medium">{booking.property.name}</span>?
                  This action cannot be undone.
                </AlertDialog.Description>
                <div className="flex justify-end gap-3">
                  <AlertDialog.Cancel asChild>
                    <button
                      onClick={(e) => e.stopPropagation()}
                      className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-md transition-colors duration-150"
                    >
                      Cancel
                    </button>
                  </AlertDialog.Cancel>
                  <AlertDialog.Action asChild>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        dispatch(deleteBooking(booking.id));
                      }}
                      className="px-4 py-2 text-sm font-medium text-white bg-red-600 hover:bg-red-700 rounded-md transition-colors duration-150"
                    >
                      Delete Booking
                    </button>
                  </AlertDialog.Action>
                </div>
              </AlertDialog.Content>
            </AlertDialog.Portal>
          </AlertDialog.Root>
        </div>
      )}
    </div>
  );
});

BookingCard.displayName = "BookingCard";
