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
      className={`relative w-full mb-4 h-48 overflow-hidden rounded-lg cursor-pointer ${
        animated && "scale-105"
      }`}
      aria-label={`Select ${property.name} in ${property.city}`}
      aria-pressed={selectedProperty}
    >
      <div
        className={`opacity-40 absolute inset-0 bg-cover bg-center col-span-1 ${
          selectedProperty && "opacity-100"
        }`}
        style={{ backgroundImage: `url(${property.imageUrl})` }}
      />

      <div className="absolute inset-0 bg-black/50" />

      <div className="relative z-10 p-4 text-white h-full flex flex-col justify-end">
        <h2 className="text-xl font-bold">{property.name}</h2>
        <p className="text-sm opacity-90">
          {property.city} {property.country}
        </p>
      </div>
    </motion.button>
  );
});

PropertyCard.displayName = "PropertyCard";
