import { motion } from "framer-motion";
import { memo } from "react";
import { useAppDispatch } from "../../hooks/redux";
import { fetchBookings } from "../../store/bookings/slice";
import type { Property } from "../../types";

type PropertyCardProps = {
  property: Property;
  setSelectedProperty?: (id: string) => void;
  selectedProperty: boolean;
  animated?: boolean;
};

export const PropertyCard = memo(function PropertyCard({
  property,
  setSelectedProperty,
  selectedProperty,
  animated,
}: PropertyCardProps) {
  const dispatch = useAppDispatch();

  const handleClick = () => {
    dispatch(fetchBookings(property.id));
    setSelectedProperty?.(property.id);
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={
        animated
          ? {
              scale: 1.01,
              transition: { duration: 0.3 },
            }
          : {}
      }
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      key={property.id}
      className={`relative w-full h-44 lg:h-48 overflow-hidden rounded-xl shadow-md hover:shadow-xl transition-all cursor-pointer ${
        selectedProperty ? "ring-4 ring-primary ring-offset-2" : ""
      }`}
      aria-label={`Select ${property.name} in ${property.city}`}
      aria-pressed={selectedProperty}
    >
      <div
        className={`absolute inset-0 bg-cover bg-center transition-all duration-300 ${
          selectedProperty ? "opacity-100 scale-105" : "opacity-70"
        }`}
        style={{ backgroundImage: `url(${property.imageUrl})` }}
      />

      <div
        className={`absolute inset-0 transition-opacity duration-300 ${
          selectedProperty
            ? "bg-linear-to-t from-black/70 via-black/30 to-transparent"
            : "bg-linear-to-t from-black/80 via-black/40 to-transparent"
        }`}
      />

      <div className="relative z-10 p-4 text-white h-full flex flex-col justify-end">
        <h2
          className={`text-xl lg:text-xl font-bold mb-1 transition-all ${
            selectedProperty ? "text-white drop-shadow-lg" : ""
          }`}
        >
          {property.name}
        </h2>
        <p className="text-sm lg:text-sm opacity-90 font-medium">
          {property.city} {property.country}
        </p>
      </div>
    </motion.button>
  );
});

PropertyCard.displayName = "PropertyCard";
