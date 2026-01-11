import { useEffect, useMemo, useState } from "react";
import "react-day-picker/style.css";
import { BookingCard } from "../../components/Booking/BookingCard";
import Loading from "../../components/Loading";
import { PropertyCard } from "../../components/PropertyCard";
import { useModal } from "../../context/ModalContext";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { fetchProperties } from "../../store/properties/slice";
import type { Property } from "../../types";

export default function BookingPage() {
  const dispatch = useAppDispatch();
  const { status, error, items } = useAppSelector((state) => state.properties);
  const { items: bookings, status: bookingStatus } = useAppSelector(
    (state) => state.bookings
  );
  const [selectedProperty, setSelectedProperty] = useState<string>("");

  const { openModal } = useModal();

  useEffect(() => {
    dispatch(fetchProperties());
  }, [dispatch]);

  const selectedPropertyData = useMemo(
    () => items.find((p) => p.id === selectedProperty),
    [items, selectedProperty]
  );

  if (status === "loading") {
    return <Loading />;
  }

  if (status === "failed") {
    return <div>Error: {error}</div>;
  }

  return (
    <div className="flex flex-col lg:flex-row gap-6 p-6 w-full">
      <div className="w-full lg:w-1/4">
        <div className="h-[52px] flex items-center mb-4 px-2 lg:px-0">
          <h2 className="section-title mb-0!">My Properties</h2>
        </div>
        <div className="-mx-6 px-6 lg:mx-0 lg:px-0">
          <div className="flex gap-4 overflow-x-auto pb-4 lg:flex-col lg:space-y-2 lg:overflow-x-visible lg:pb-0 snap-x snap-mandatory lg:snap-none scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {items.map((property) => (
              <div
                key={property.id}
                className={`shrink-0 w-[75vw] max-w-[280px] lg:w-full snap-center `}
              >
                <PropertyCard
                  animated
                  key={property.id}
                  property={property}
                  selectedProperty={selectedProperty === property.id}
                  setSelectedProperty={setSelectedProperty}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="w-full lg:w-3/4">
        <div className="h-[52px] flex flex-row items-center justify-between mb-4">
          <h2 className="section-title mb-0!">
            {selectedProperty
              ? `${selectedPropertyData?.name} Bookings`
              : "My Bookings"}
          </h2>
          <button
            onClick={() => {
              if (selectedProperty) {
                openModal({
                  type: "create-booking",
                  property: selectedPropertyData as Property,
                });
              }
            }}
            disabled={!selectedProperty}
            className="bg-primary px-4 py-2 rounded-lg text-white font-medium hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            New Booking
          </button>
        </div>

        <div className="space-y-3">
          {selectedProperty === "" ? (
            <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg p-12 text-center">
              <p className="text-gray-500 text-lg font-medium">
                Select a property to view bookings
              </p>
              <p className="text-gray-400 text-sm mt-2">
                Choose from your properties on the left
              </p>
            </div>
          ) : bookingStatus === "loading" ? (
            <Loading />
          ) : bookings.length === 0 ? (
            <div className="bg-white border border-gray-200 rounded-lg p-12 text-center">
              <p className="text-gray-500 text-lg font-medium mb-2">
                No bookings yet
              </p>
              <p className="text-gray-400 text-sm">
                Create your first booking for this property
              </p>
            </div>
          ) : (
            bookings.map((booking) => {
              return <BookingCard key={booking.id} booking={booking} />;
            })
          )}
        </div>
      </div>
    </div>
  );
}
