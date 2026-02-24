import { configureStore } from "@reduxjs/toolkit";
import { AppSlice } from "./AppSlice";

export const store = configureStore({
  reducer: AppSlice.reducer,
});

store.subscribe(() => {
  try {
    localStorage.setItem("appState", JSON.stringify(store.getState()));
  } catch (error) {
    console.error("Failed to save state to localStorage:", error);
  }
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;