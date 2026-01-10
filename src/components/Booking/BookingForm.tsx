import { zodResolver } from "@hookform/resolvers/zod";
import { differenceInDays, format, parseISO } from "date-fns";
import { House } from "phosphor-react";
import { useMemo } from "react";
import { DayPicker } from "react-day-picker";
import { Controller, useForm, useWatch } from "react-hook-form";
import { z } from "zod";
import { useModal } from "../../context/ModalContext";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { createBooking, updateBooking } from "../../store/bookings/slice";
import type { Booking, Property } from "../../types";
type BookingFormProps = {
  mode: "create" | "edit";
  booking?: Booking;
  property?: Property;
};

const BookingSchema = z.object({
  propertyId: z.string().uuid(),
  guestName: z.string().min(1, "Guest name is required"),
  bookingRange: z
    .object({
      from: z.date(),
      to: z.date(),
    })
    .optional()
    .refine((range) => range !== undefined, {
      message: "Please select check-in and check-out dates",
    })
    .refine(
      (range) => {
        if (!range) return false;
        return range.from && range.to;
      },
      {
        message: "Both check-in and check-out dates are required",
      }
    )
    .refine(
      (range) => {
        if (!range?.from || !range?.to) return true;
        return range.to > range.from;
      },
      {
        message: "Check-out date must be after check-in date",
      }
    ),
  notes: z.string().max(500, "Notes must be under 500 characters").optional(),
});

export type BookingFormInput = z.infer<typeof BookingSchema>;

export default function BookingForm({
  mode,
  booking,
  property,
}: BookingFormProps) {
  const dispatch = useAppDispatch();
  const { closeModal } = useModal();
  const form = useForm<BookingFormInput>({
    resolver: zodResolver(BookingSchema),
    defaultValues: {
      propertyId: property?.id ?? booking?.property.id ?? "",
      guestName: booking?.guest.name ?? "",
      notes: booking?.notes ?? "",
      bookingRange: booking
        ? {
            from: parseISO(booking.checkInDate),
            to: parseISO(booking.checkOutDate),
          }
        : undefined,
    },
  });
  const { items: bookings } = useAppSelector((state) => state.bookings);

  const onSubmit = (data: BookingFormInput) => {
    if (mode === "create") {
      dispatch(
        createBooking({
          propertyId: data.propertyId,
          property: property as Pick<
            Property,
            "id" | "name" | "city" | "country" | "imageUrl"
          >,
          guestName: data.guestName,
          bookingRange: {
            from: data.bookingRange?.from
              ? format(new Date(data.bookingRange.from), "yyyy-MM-dd")
              : "",
            to: data.bookingRange?.to
              ? format(new Date(data.bookingRange.to), "yyyy-MM-dd")
              : "",
          },
          nights: totalNights,
          totalPrice: totalPrice,
          notes: data.notes,
        })
      );
      closeModal();
    } else {
      dispatch(
        updateBooking({
          id: booking!.id,
          guestName: data.guestName,
          bookingRange: {
            from: data.bookingRange?.from
              ? format(new Date(data.bookingRange.from), "yyyy-MM-dd")
              : "",
            to: data.bookingRange?.to
              ? format(new Date(data.bookingRange.to), "yyyy-MM-dd")
              : "",
          },
          nights: totalNights,
          totalPrice: totalPrice,
          notes: data.notes,
        })
      );
      closeModal();
    }
  };

  const blockedDates = useMemo(() => {
    return [
      ...bookings
        .filter((b) => b.status !== "cancelled")
        .filter((b) => b.id !== booking?.id)
        .map((b) => {
          return {
            from: parseISO(b.checkInDate),
            to: parseISO(b.checkOutDate),
          };
        }),
      { before: new Date() },
    ];
  }, [bookings, booking?.id]);

  const bookingRange = useWatch({
    control: form.control,
    name: "bookingRange",
  });
  const notes = useWatch({ control: form.control, name: "notes" });
  const startDate = bookingRange?.from ? new Date(bookingRange.from) : null;

  const endDate = bookingRange?.to ? new Date(bookingRange.to) : null;

  const totalNights =
    startDate &&
    endDate &&
    !isNaN(startDate.getTime()) &&
    !isNaN(endDate.getTime())
      ? differenceInDays(endDate, startDate)
      : 0;

  const basePricePerNight =
    property?.basePrice ??
    (booking && booking.nights > 0 ? booking.totalPrice / booking.nights : 0);

  const totalPrice =
    basePricePerNight && totalNights > 0 ? basePricePerNight * totalNights : 0;

  return (
    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
      {property && (
        <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-lg border border-gray-200">
          <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
            <House className="w-6 h-6 text-blue-600" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-gray-900">{property.name}</h3>
            <p className="text-sm text-gray-600">{property.city}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Base Price</p>
            <p className="font-bold text-blue-600">
              ${property.basePrice}/night
            </p>
          </div>
        </div>
      )}
      <div>
        <label
          htmlFor="guestName"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Guest Name
        </label>
        <input
          id="guestName"
          type="text"
          {...form.register("guestName")}
          className="w-full border border-gray-300 rounded-md p-2"
        />
        {form.formState.errors.guestName && (
          <p className="text-red-500 text-sm mt-1">
            {form.formState.errors.guestName.message}
          </p>
        )}
      </div>
      <Controller
        name="bookingRange"
        control={form.control}
        render={({ field, fieldState }) => {
          return (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Booking Dates
              </label>
              <DayPicker
                {...field}
                selected={{
                  from: field.value?.from
                    ? new Date(field.value.from)
                    : undefined,
                  to: field.value?.to ? new Date(field.value.to) : undefined,
                }}
                disabled={blockedDates}
                excludeDisabled
                mode="range"
                onSelect={(e) => {
                  field.onChange(e);
                }}
              />

              <span className="text-red-400">{fieldState.error?.message}</span>
            </div>
          );
        }}
      />

      <div>
        <label
          htmlFor="notes"
          className="block text-sm font-medium text-gray-700 mb-1"
        >
          Notes
        </label>

        <textarea
          id="notes"
          {...form.register("notes")}
          placeholder="Add any special instructions or notes..."
          rows={4}
          className="w-full px-4 py-3 border border-gray-300 rounded-lg 
             focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent
             transition-all duration-200 resize-none"
        />
        <p className="text-xs text-gray-500 mt-2">
          {notes?.length || 0} / 500 characters
        </p>
      </div>
      {(property || booking) && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 flex justify-between items-center">
          <div>
            {totalNights > 0 ? (
              <>
                <p className="text-xs text-gray-600">
                  Total for {totalNights}{" "}
                  {totalNights === 1 ? "night" : "nights"}
                </p>
                <p className="text-xl font-bold text-blue-600">
                  ${totalPrice.toFixed(2)}
                </p>
              </>
            ) : (
              <p className="text-sm font-medium text-gray-500">Select dates</p>
            )}
          </div>
          <button
            type="submit"
            disabled={totalNights <= 0}
            className={`px-6 py-3 rounded-lg font-semibold text-white whitespace-nowrap transition-colors ${
              totalNights > 0
                ? "bg-blue-600 hover:bg-blue-700 cursor-pointer"
                : "bg-gray-300 cursor-not-allowed"
            }`}
          >
            {mode === "create" ? "Create Booking" : "Update Booking"}
          </button>
        </div>
      )}
    </form>
  );
}
