import type { Booking, BookingStatus, Property } from "../../types";
import { shortenDate } from "../../utils/formatDate";
import { PropertyCard } from "../PropertyCard";

type BookingDetailsProps = {
  booking?: Booking;
};

const statusObj: Record<BookingStatus, { label: string; color: string }> = {
  upcoming: { label: "Upcoming", color: "bg-primary" },
  ongoing: { label: "Ongoing", color: "bg-secondary" },
  finished: { label: "Past", color: "bg-gray-500" },
  cancelled: { label: "Cancelled", color: "bg-red-500" },
};

export default function BookingDetails({ booking }: BookingDetailsProps) {
  if (!booking) {
    return (
      <div className="flex items-center justify-center p-8 text-gray-500">
        No booking selected
      </div>
    );
  }

  const isCancelled = booking.status === "cancelled";

  return (
    <div className="space-y-6">
      <div className="relative">
        <PropertyCard
          property={booking.property as Property}
          selectedProperty={true}
          animated={false}
        />
        <div className="absolute top-4 right-4 z-20">
          <span
            className={`${
              statusObj[booking.status].color
            } text-white text-sm font-medium px-4 py-2 rounded-full shadow-lg`}
          >
            {statusObj[booking.status].label}
          </span>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
          Stay Details
        </h3>
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Check-in
            </p>
            <p className="text-base font-semibold text-gray-900">
              {shortenDate(booking.checkInDate)}
            </p>
          </div>
          <div>
            <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
              Check-out
            </p>
            <p className="text-base font-semibold text-gray-900">
              {shortenDate(booking.checkOutDate)}
            </p>
          </div>
        </div>
        <div className="pt-2 border-t border-gray-200">
          <p className="text-sm text-gray-600">
            <span className="font-semibold text-primary">
              {booking.nights} {booking.nights === 1 ? "night" : "nights"}
            </span>
          </p>
        </div>
      </div>

      <div className="bg-gray-50 rounded-lg p-4">
        <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-3">
          Guest Information
        </h3>
        <div>
          <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">
            Name
          </p>
          <p className="text-base font-medium text-gray-900">
            {booking.guest.name}
          </p>
        </div>
      </div>
      {booking.notes && (
        <div className="bg-gray-50 rounded-lg p-4">
          <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide mb-3">
            Notes
          </h3>
          <p className="text-sm text-gray-700 leading-relaxed">
            {booking.notes}
          </p>
        </div>
      )}

      <div className="bg-gray-50 rounded-lg p-4 space-y-3">
        <h3 className="font-semibold text-gray-900 text-sm uppercase tracking-wide">
          Price Details
        </h3>
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span className="text-gray-600">
              $
              {booking.nights > 0
                ? Math.round(booking.totalPrice / booking.nights)
                : 0}{" "}
              x {booking.nights} {booking.nights === 1 ? "night" : "nights"}
            </span>
            <span
              className={`${
                isCancelled ? "line-through text-gray-400" : "text-gray-900"
              } font-medium`}
            >
              ${booking.totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
        <div className="pt-3 border-t border-gray-200">
          <div className="flex justify-between">
            <span className="font-semibold text-gray-900">Total</span>
            <span
              className={`${
                isCancelled ? "line-through text-gray-400" : "text-gray-900"
              } text-xl font-bold`}
            >
              ${booking.totalPrice.toLocaleString()}
            </span>
          </div>
        </div>
      </div>

      <div className="pt-4 border-t border-gray-200">
        <p className="text-xs text-gray-500">
          Booking ID: <span className="font-mono">{booking.id}</span>
        </p>
      </div>
    </div>
  );
}
