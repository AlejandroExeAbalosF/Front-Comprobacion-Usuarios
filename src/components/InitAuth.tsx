import { useEffect } from "react";
import axios from "axios";
import { useAppDispatch } from "../redux/hooks";
import { loginSuccess, logout, setError, setLoading } from "../redux/slices/authSlice";

const BACK_API_URL = import.meta.env.VITE_LOCAL_API_URL;

const InitAuth = () => {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const storedUser = localStorage.getItem("validateUserArGobSal_user");

    if (storedUser) {
      dispatch(loginSuccess({ user: JSON.parse(storedUser) })); // Restaurar desde localStorage
    }
    const checkAuth = async () => {
      dispatch(setLoading());

      await axios
        .get(`${BACK_API_URL}/auth/validate-token`, {
          withCredentials: true,
        })
        .then(({ data }) => {
          dispatch(loginSuccess({ user: data.user }));
          localStorage.setItem("validateUserArGobSal_user", JSON.stringify(data.user));
        })
        .catch((error) => {
          dispatch(logout()); // Desloguea si el token no es válido
          dispatch(setError({ error: error.response.data.message }));
          localStorage.removeItem("validateUserArGobSal_user");
        });
      // try {
      //   const response = await axios.get(`${BACK_API_URL}/auth/validate-token`, {
      //     withCredentials: true,
      //   });
      //   dispatch(loginSuccess({ user: response.data.user }));
      //   localStorage.setItem("validateUserArGobSal_user", JSON.stringify(response.data.user));
      // } catch (error) {
      //   console.log(error.response.data.message);
      //   dispatch(logout()); // Desloguea si el token no es válido
      //   dispatch(setError({ error: error.response.data.message }));
      //   localStorage.removeItem("validateUserArGobSal_user");
      // }
    };

    checkAuth();
  }, [dispatch]);

  return null;
};

export default InitAuth;
