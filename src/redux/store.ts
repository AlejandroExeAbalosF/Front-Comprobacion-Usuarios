import { configureStore } from "@reduxjs/toolkit";
import authSlice from "./slices/authSlice";
import userEmpSlice from "./slices/usersEmpSlice";
import modalSlice from "./slices/modalSlice"; // Importa el nuevo slice

// Creación del store
export const store = configureStore({
  reducer: {
    auth: authSlice,
    usersEmp: userEmpSlice,
    modal: modalSlice, // Agrega el slice del modal
  },
});

// Inferir los tipos de `RootState` y `AppDispatch` automáticamente
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
