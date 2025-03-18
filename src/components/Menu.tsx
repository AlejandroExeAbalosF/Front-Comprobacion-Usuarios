import { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { logout } from "../redux/slices/authSlice";
import { formatName } from "../utils/format";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const BACK_API_URL = import.meta.env.VITE_LOCAL_API_URL;

const useIsTouchDevice = () => {
  const [isTouchDevice, setIsTouchDevice] = useState(false);

  useEffect(() => {
    const checkTouchDevice = () => {
      setIsTouchDevice("ontouchstart" in window || navigator.maxTouchPoints > 0);
    };

    checkTouchDevice();
    window.addEventListener("pointerdown", checkTouchDevice);

    return () => {
      window.removeEventListener("pointerdown", checkTouchDevice);
    };
  }, []);

  return isTouchDevice;
};

const Menu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const isModalOpen = useAppSelector((state) => state.modal.isModalOpen);
  const isTouchDevice = useIsTouchDevice(); // Detecta si el dispositivo es táctil
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user);
  const menuRef = useRef<HTMLDivElement>(null); // Referencia al menú flotante
  const containerRef = useRef<HTMLDivElement>(null); // Referencia al contenedor principal

  // Reinicia el estado isOpen cuando el modal se cierra
  useEffect(() => {
    if (!isModalOpen) {
      setIsOpen(false);
    }
  }, [isModalOpen]);

  // Cerrar el menú al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        isTouchDevice && // Solo en dispositivos táctiles
        isOpen && // Solo si el menú está abierto
        menuRef.current && // Verifica que la referencia al menú exista
        containerRef.current && // Verifica que la referencia al contenedor exista
        !menuRef.current.contains(event.target as Node) && // Verifica si el clic fue fuera del menú
        !containerRef.current.contains(event.target as Node) // Verifica si el clic fue fuera del contenedor principal
      ) {
        setIsOpen(false); // Cierra el menú
      }
    };

    // Agrega el event listener
    document.addEventListener("mousedown", handleClickOutside);

    // Limpia el event listener al desmontar el componente
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, isTouchDevice]);

  const handleConfiguracionClick = () => {
    navigate("/configuracion"); // Navega a la vista de Configuración
  };

  const handleStartClick = () => {
    navigate("/inicio"); // Navega a la vista de Configuración
  };

  const handleClose = () => {
    dispatch(logout());
    localStorage.removeItem("validateUserArGobSal_user");
    toast.success("Sesión cerrada");
    //! hacer animacion de carga para desloguearse
    axios.post(`${BACK_API_URL}/auth/logout`, {}, { withCredentials: true });
    navigate("/");
  };

  const handleMouseLeave = () => {
    if (!isModalOpen && !isTouchDevice) {
      // Solo aplica timeout en dispositivos no táctiles
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false);
      }, 300);
    }
  };

  const handleMouseEnter = () => {
    if (!isModalOpen && !isTouchDevice) {
      // Solo aplica en dispositivos no táctiles
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      setIsOpen(true);
    }
  };

  const handleClick = () => {
    if (isTouchDevice) {
      setIsOpen((prev) => !prev); // Alternar entre abrir y cerrar en dispositivos táctiles
    }
  };

  return (
    <nav className="relative bg-white w-full h-[70px] shadow-md bg-clip-border flex flex-row justify-center items-center">
      <div className="flex flex-row justify-between items-center w-[1600px] h-full gap-4 mr-3">
        <div className="w-[200px] ml-3">
          <img
            onClick={handleStartClick}
            src="https://www.salta.gob.ar/public/images/logo-gobierno-salta-2023.svg"
            alt=""
            className="w-[200px]  sm:w-full sm:h-full cursor-pointer"
          />
        </div>
        <div
          ref={containerRef} // Asigna la referencia al contenedor principal
          className="flex flex-row justify-end items-center h-full gap-4 mr-3"
          onClick={handleClick} // Maneja el clic en dispositivos táctiles
          onMouseEnter={!isTouchDevice ? handleMouseEnter : undefined} // Solo aplica en dispositivos no táctiles
          onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined} // Solo aplica en dispositivos no táctiles
        >
          <img src={user?.image ? user.image : ""} className="h-[45px] w-[45px] !rounded-full object-cover object-center" />
          <div>
            <h2 className="font-sans text-[18px] antialiased font-normal leading-normal text-blue-gray-900">
              {user?.name && user?.lastName ? formatName(user.name, user.lastName) : "Usuario"}
            </h2>
            {/* <h2
             
              className="font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 cursor-pointer"
            >
              Cerrar Sesión
            </h2> */}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {isOpen && !isModalOpen && (
          <motion.div
            ref={menuRef} // Asigna la referencia al menú flotante
            className="right-1 sm:right-5 custom-3xl:right-40 absolute z-50 top-18 bg-white shadow-lg rounded-md w-48 p-2"
            initial={{ opacity: 0, y: -10, scale: 0.95, boxShadow: "0 0 0 rgba(0, 0, 0, 0)" }}
            animate={{ opacity: 1, y: 0, scale: 1, boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)" }}
            exit={{ opacity: 0, y: -10, scale: 0.95, boxShadow: "0 0 0 rgba(0, 0, 0, 0)" }}
            transition={{ duration: 0.2, type: "spring", stiffness: 300, damping: 20 }}
            onMouseEnter={!isTouchDevice ? handleMouseEnter : undefined} // Solo aplica en dispositivos no táctiles
            onMouseLeave={!isTouchDevice ? handleMouseLeave : undefined} // Solo aplica en dispositivos no táctiles
          >
            <ul className="space-y-2">
              {user?.rol === "admin" && ( // Solo muestra el enlace si el usuario es admin
                <li className="hover:bg-gray-100 p-2 rounded cursor-pointer" onClick={handleConfiguracionClick}>
                  Configuración
                </li>
              )}
              <li onClick={handleClose} className="hover:bg-gray-100 p-2 rounded cursor-pointer ">
                Cerrar Sesión
              </li>
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
};

export default Menu;
