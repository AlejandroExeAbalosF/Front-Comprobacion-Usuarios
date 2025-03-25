import { useEffect } from "react";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { loginSuccess, logout, setError, setLoading, restoreUser } from "../redux/slices/authSlice";
import { toast } from "sonner";

const BACK_API_URL = import.meta.env.VITE_LOCAL_API_URL;

const InitAuth = () => {
  const dispatch = useAppDispatch();
  const { user } = useAppSelector((state) => state.auth);

  useEffect(() => {
    const checkAuth = async () => {
      dispatch(setLoading(true)); // Activar estado de carga

      try {
        const storedUser = localStorage.getItem("validateUserArGobSal_user");

        if (storedUser) {
          const user = JSON.parse(storedUser);
          dispatch(restoreUser({ user })); // Restaurar desde localStorage
        }

        const response = await axios.get(`${BACK_API_URL}/auth/validate-token`, {
          withCredentials: true,
        });
        // console.log("response data in init auth", response.data);
        dispatch(loginSuccess({ user: user || response.data.user })); // Actualizar estado con datos del servidor
        localStorage.setItem("validateUserArGobSal_user", JSON.stringify(response.data.user));
      } catch (error) {
        dispatch(logout()); // Desloguea si el token no es válido
        if (error) dispatch(setError({ error: (error as string) || "Error de autenticación" }));
        localStorage.removeItem("validateUserArGobSal_user");
        toast.error("Error de autenticación");
      } finally {
        dispatch(setLoading(false)); // Desactivar estado de carga
      }
    };

    checkAuth();
  }, [dispatch]);

  return null; // Este componente no renderiza nada
};

export default InitAuth;
