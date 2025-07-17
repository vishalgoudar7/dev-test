import { configureStore } from "@reduxjs/toolkit";
import templeReducer from "./templeSlice";
import authReducer from "./authSlice"; // 👈 Add this

const store = configureStore({
  reducer: {
    temple: templeReducer,
    auth: authReducer, // 👈 Register here
  },
});

export default store;


