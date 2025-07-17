// src/redux/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const storedMobile = localStorage.getItem("mobileNumber");
const initialSignIn = storedMobile && storedMobile !== "null" && storedMobile !== "+919080706050";

const authSlice = createSlice({
  name: "auth",
  initialState: {
    signInMbl: initialSignIn,
  },
  reducers: {
    setsignInMbl: (state, action) => {
      state.signInMbl = action.payload;
    },
  },
});

export const { setsignInMbl } = authSlice.actions;
export default authSlice.reducer;
