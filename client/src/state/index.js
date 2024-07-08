import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  token: null,
  bookings: [],
  jobs: []
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setMode: (state) => {
      state.mode = state.mode === "light" ? "dark" : "light";
    },
    setLogin: (state, action) => {
      state.user = action.payload.user;
      state.token = action.payload.token;
    },
    setLogout: (state) => {
      state.user = null;
      state.token = null;
      state.bookings = null;
    },
    setJobs: (state, action) => {
      state.jobs = action.payload.jobs;
    },
    setBookings: (state, action) => {
      state.bookings = action.payload.bookings;
    },
    setBooking: (state, action) => {
      const updatedBookings = state.bookings.map((booking) => {
        if (booking.id === action.payload.booking.id) return action.payload.booking;
        return booking;
      });
      state.bookings = updatedBookings;
    },
  },
});

export const { setMode, setLogin, setLogout, setFriends, setBookings, setBooking, setJobs } =
  authSlice.actions;
export default authSlice.reducer;
