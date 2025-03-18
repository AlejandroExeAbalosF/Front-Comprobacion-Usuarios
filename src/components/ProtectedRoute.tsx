import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import InitAuth from "./InitAuth";

const ProtectedRoute = () => {
  const { user, loading } = useAppSelector((state) => state.auth);

  // if (loading) {
  //   return <div>Loading...</div>; // Mostrar un mensaje de carga mientras se valida el usuario
  // }

  // if (!user) {
  //   return <Navigate to="/iniciar_sesion" replace />; // Redirigir si no hay usuario
  // }

  // return <Outlet />; // Renderizar las rutas protegidas
  // Ejecuta InitAuth solo en rutas protegidas
  // const storedUser = localStorage.getItem("validateUserArGobSal_user");
  // console.log("storedUser", storedUser);
  // console.log("user", user);
  // console.log("loading", loading);
  return (
    <>
      <InitAuth />
      {loading ? (
        <div>Loading...</div> // Muestra un mensaje de carga mientras se valida el usuario
      ) : user ? (
        <Outlet /> // Renderiza las rutas protegidas si el usuario está autenticado
      ) : (
        <Navigate to="/iniciar_sesion" replace /> // Redirige si no hay usuario
      )}
    </>
  );
};

export default ProtectedRoute;
