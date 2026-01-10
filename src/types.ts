export type Property = {
  id: string;
  name: string;
  type: string;
  city: string;
  country: string;
  timezone: string;
  status: string;
  maxGuests: number;
  bedrooms: number;
  bathrooms: number;
  basePrice: number;
  imageUrl: string;
};

export type Booking = {
  id: string;
  checkInDate: string;
  checkOutDate: string;
  nights: number;
  totalPrice: number;
  status: BookingStatus;
  property: Pick<Property, "id" | "name" | "city" | "country" | "imageUrl">;
  guest: Guest;
  notes?: string;
};

export type Guest = {
  id: string;
  name: string;
};

export type BookingStatus = "upcoming" | "ongoing" | "finished" | "cancelled";
