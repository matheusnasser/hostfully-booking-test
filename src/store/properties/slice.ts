import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import axios from "axios";
import type { Property } from "../../types";

type PropertyState = {
  items: Property[];
  status: "idle" | "loading" | "succeeded" | "failed";
  error: string | null;
};

const initialState: PropertyState = {
  items: [],
  status: "idle",
  error: null,
};

export const fetchProperties = createAsyncThunk(
  "properties/fetchProperties",
  async () => {
    // Simulate network latency for demonstration purposes
    await new Promise((resolve) => setTimeout(resolve, 600));
    const response = await axios.get("/mocks/properties.json");
    return response.data as Property[];
  }
);

const propertySlice = createSlice({
  name: "properties",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder.addCase(fetchProperties.pending, (state) => {
      state.status = "loading";
    });
    builder.addCase(fetchProperties.fulfilled, (state, action) => {
      state.status = "idle";
      state.items = action.payload;
    });
    builder.addCase(fetchProperties.rejected, (state, action) => {
      state.status = "failed";
      state.error = action.error.message || null;
    });
  },
});

export default propertySlice.reducer;
