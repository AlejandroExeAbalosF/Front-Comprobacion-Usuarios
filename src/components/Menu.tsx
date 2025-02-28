import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout, setError } from "../redux/slices/authSlice";
import { formatName } from "../utils/format";
import { useNavigate } from "react-router-dom";

const Menu = () => {
  const dispatch = useAppDispatch();
  const navegate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const handleClose = () => {
    dispatch(logout()); // Desloguea si el token no es válido
    localStorage.removeItem("validateUserArGobSal_user");
    toast.success("Sesión cerrada");
    navegate("/");
  };
  return (
    <nav className="bg-white w-full h-[70px] shadow-md  bg-clip-border flex flex-row justify-center items-center">
      <div className="flex flex-row justify-between items-center w-[1600px] h-full gap-4 mr-3">
        <div className="w-[200px] ml-3">
          <img src="https://www.salta.gob.ar/public/images/logo-gobierno-salta-2023.svg" alt="" className=" w-full h-full " />
        </div>
        <div className="flex flex-row justify-end items-center  h-full gap-4 mr-3">
          <img src={user?.image ? user.image : ""} className="  h-[45px] w-[45px] !rounded-full object-cover object-center" />
          <div>
            <h2 className="font-sans text-[18px] antialiased font-normal leading-normal text-blue-gray-900">
              {user?.name && user?.lastName ? formatName(user.name, user.lastName) : "Usuario"}
            </h2>
            <h2
              onClick={handleClose}
              className="font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 cursor-pointer"
            >
              Cerrar Sesión
            </h2>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Menu;
