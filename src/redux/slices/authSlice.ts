import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../helpers/types";

interface AuthState {
  user: IUser | null;
  loading: boolean;
  error: string | null;
}

const initialState: AuthState = {
  user: null,
  loading: true, // Inicialmente en estado de carga
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: IUser }>) => {
      state.user = action.payload.user;
      state.loading = false; // Ya no está cargando
      state.error = null; // Limpiar errores
    },
    logout: (state) => {
      state.user = null;
      state.loading = false; // Ya no está cargando
      state.error = null; // Limpiar errores
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload; // Establecer estado de carga
    },
    setError: (state, action: PayloadAction<{ error: string }>) => {
      state.error = action.payload.error;
    },
    restoreUser: (state, action: PayloadAction<{ user: IUser }>) => {
      state.user = action.payload.user;
      state.loading = false; // Ya no está cargando
    },
  },
});

export const { loginSuccess, logout, setLoading, setError, restoreUser } = authSlice.actions;
export default authSlice.reducer;