import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout, setError } from "../redux/slices/authSlice";
import { formatName } from "../utils/format";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useState } from "react";

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen((prev) => !prev);
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
    <nav className="relative bg-white w-full h-[70px] shadow-md  bg-clip-border flex flex-row justify-center items-center">
      <div className="flex flex-row justify-between items-center w-[1600px] h-full gap-4 mr-3">
        <div className="w-[200px] ml-3">
          <img src="https://www.salta.gob.ar/public/images/logo-gobierno-salta-2023.svg" alt="" className=" w-full h-full " />
        </div>
        <div
          className="flex flex-row justify-end items-center  h-full gap-4 mr-3"
          onClick={toggleMenu} // Para móviles
          onMouseEnter={() => setIsOpen(true)} // Para escritorio (hover)
          onMouseLeave={() => setIsOpen(false)}
        >
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
      {/* Menú flotante */}
      <motion.div
        className="  sm:right-5 right-1 3xl:right-40 absolute z-50 top-18   bg-white shadow-lg rounded-md w-48 p-2 "
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: isOpen ? 1 : 0, y: isOpen ? 0 : -10 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        onMouseEnter={() => setIsOpen(true)} // Mantiene abierto al pasar el mouse
        onMouseLeave={() => setIsOpen(false)}
      >
        <ul className="space-y-2">
          <li className="hover:bg-gray-100 p-2 rounded cursor-pointer font-display">Perfil</li>
          <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">Configuracion</li>
          <li className="hover:bg-gray-100 p-2 rounded cursor-pointer">Cerrar Sesión</li>
        </ul>
      </motion.div>
    </nav>
  );
};

export default Menu;
