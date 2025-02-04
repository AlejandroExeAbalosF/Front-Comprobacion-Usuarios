import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { IUser } from "../../helpers/types";

interface AuthState {
  user: IUser | null;// Permitir `null` en lugar de un objeto vacío
  loading: boolean; 
  error: string | null;
}

const initialState: AuthState = {
  user: null, // Más seguro que `{} as IUser`
  loading: false, // Estado de carga
  error: null,
};

export const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    loginSuccess: (state, action: PayloadAction<{ user: IUser }>) => {
      state.user = action.payload.user;
      state.loading = false; // Ya no está cargando
    },
    logout: (state) => {
      state.user = null;
      state.loading = false; // Ya no está cargando
    },
    setLoading: (state) => {
      state.loading = true; // Establece que está cargando
    },
    setError: (state, action: PayloadAction<{ error: string }>) => {
      state.error = action.payload.error;
    },
  },
});

export const { loginSuccess, logout,setLoading ,setError} = authSlice.actions;
export default authSlice.reducer;
