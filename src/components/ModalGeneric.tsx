import { useEffect } from "react";
import { IRegistration, IUser } from "../helpers/types";
import CreateUser from "./CreateUser";
import RegistersTable from "./RegistersTable";
import DetailsUser from "./DetailsUser";
import EditRegister from "./EditRegister";

interface ModalProps {
  isVisible?: boolean;
  onClose: () => void;
  data?: IUser | IRegistration;
  typeModal?: "userRegisters" | "userDetails" | "createEmployee" | "editRegister";

  closeOnBackdropClick?: boolean;
}

const useBodyScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    document.body.style.overflow = isLocked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLocked]);
};

interface ModalPropsMap {
  userRegisters: { userInfo: IUser | null };
  userDetails: { userInfo: IUser | null; onCloseModal?: (isVisible: boolean) => void };
  createEmployee: { onCloseModal?: (isVisible: boolean) => void };
  editRegister: { register: IRegistration | null; onCloseModal?: (isVisible: boolean) => void };
}

// Mapea los componentes a sus props correctas
const MODAL_COMPONENTS: {
  [K in keyof ModalPropsMap]: React.FC<ModalPropsMap[K]>;
} = {
  userRegisters: RegistersTable,
  userDetails: DetailsUser,
  createEmployee: CreateUser,
  editRegister: EditRegister,
};

const ModalGeneric: React.FC<ModalProps> = ({ isVisible = false, onClose, data, typeModal, closeOnBackdropClick = true }) => {
  useBodyScrollLock(isVisible);
  const ModalContent = typeModal ? MODAL_COMPONENTS[typeModal] : null;

  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      onClose();
    }
  };

  const modalProps =
    typeModal === "editRegister"
      ? { register: data as IRegistration | null }
      : typeModal === "userDetails" || typeModal === "userRegisters"
      ? { userInfo: data as IUser | null }
      : {};

  return (
    <div
      id="modal_main"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-10 flex justify-center items-center transition-colors 
        ${isVisible ? "visible bg-black/55 backdrop-blur-sm" : "invisible"}`}
    >
      <div
        id="modal_container"
        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre
        className={`bg-white rounded-md shadow transition-all 
          ${isVisible ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
      >
        {ModalContent ? (
          typeModal === "editRegister" ? (
            <EditRegister register={data as IRegistration | null} onCloseModal={onClose} />
          ) : typeModal === "userDetails" ? (
            <DetailsUser userInfo={data as IUser | null} onCloseModal={onClose} />
          ) : typeModal === "userRegisters" ? (
            <RegistersTable userInfo={data as IUser | null} />
          ) : typeModal === "createEmployee" ? (
            <CreateUser onCloseModal={onClose} />
          ) : null
        ) : (
          "No se encontró el Modal"
        )}
      </div>
    </div>
  );
};

export default ModalGeneric;
