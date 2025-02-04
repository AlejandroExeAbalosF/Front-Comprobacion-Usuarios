import { Navigate, Outlet } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";

const ProtectedRoute = () => {
  const user = useAppSelector((state) => state.auth.user);
  const loading = useAppSelector((state) => state.auth.loading);

  if (loading) {
    return <div>Loading...</div>; // Evita redirigir mientras está cargando
  }
  const storedUser = localStorage.getItem("validateUserArGobSal_user");
  return user || storedUser ? <Outlet /> : <Navigate to="/iniciar_sesion" replace />;
};

export default ProtectedRoute;
