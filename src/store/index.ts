import { configureStore } from "@reduxjs/toolkit";
import bookingReducer from "./bookings/slice";
import propertyReducer from "./properties/slice";

export const store = configureStore({
  reducer: {
    bookings: bookingReducer,
    properties: propertyReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
