import { useEffect } from "react";
import { IEmployeeAbsence, INonLaborDate, IRegistration, IUser } from "../helpers/types";
import CreateUser from "./CreateUser";
import RegistersTable from "./RegistersTable";
import DetailsUser from "./DetailsUser";
import EditRegister from "./EditRegister";
import { useAppDispatch } from "../redux/hooks";
import { openModal, closeModal } from "../redux/slices/modalSlice"; // Importa las acciones
import CreateNonLaborDate from "./CreateNonLaborDate";
import CreateEmployeeAbsence from "./CreateEmployeeAbsence";

interface ModalProps {
  isVisible?: boolean;
  onClose: () => void;
  data?: IUser | IRegistration | INonLaborDate | null;
  userId?: string | null;
  typeModal?:
    | "userRegisters"
    | "userDetails"
    | "createEmployee"
    | "editRegister"
    | "createNonLaborDate"
    | "createEmployeeAbsence";

  closeOnBackdropClick?: boolean;

  onUpdate?: (updatedRecord: INonLaborDate | IRegistration | IEmployeeAbsence) => void;
}

const useBodyScrollLock = (isLocked: boolean) => {
  useEffect(() => {
    document.body.style.overflow = isLocked ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isLocked]);
};

// interface ModalPropsMap {
//   userRegisters: { userInfo: IUser | null };
//   userDetails: { userInfo: IUser | null; onCloseModal?: (isVisible: boolean) => void };
//   createEmployee: { onCloseModal?: (isVisible: boolean) => void };
//   editRegister: { register: IRegistration | null; onCloseModal?: (isVisible: boolean) => void };
// }

// Mapea los componentes a sus props correctas
// const MODAL_COMPONENTS: {
//   [K in keyof ModalPropsMap]: React.FC<ModalPropsMap[K]>;
// } = {
//   userRegisters: RegistersTable,
//   userDetails: DetailsUser,
//   createEmployee: CreateUser,
//   editRegister: EditRegister,
// };

const ModalGeneric: React.FC<ModalProps> = ({
  isVisible = false,
  onClose,
  data,
  userId,
  typeModal,
  closeOnBackdropClick = true,
  onUpdate,
}) => {
  // const ModalContent = typeModal ? MODAL_COMPONENTS[typeModal] : null;
  // console.log("ModalContent", ModalContent);
  const dispatch = useAppDispatch();

  useBodyScrollLock(isVisible);

  useEffect(() => {
    if (isVisible) {
      dispatch(openModal()); // Abre el modal
    } else {
      dispatch(closeModal()); // Cierra el modal
    }
  }, [isVisible, dispatch]);

  const handleBackdropClick = () => {
    if (closeOnBackdropClick) {
      onClose(); // Llama a onClose
    }
  };

  // const modalProps =
  //   typeModal === "editRegister"
  //     ? { register: data as IRegistration | null }
  //     : typeModal === "userDetails" || typeModal === "userRegisters"
  //     ? { userInfo: data as IUser | null }
  //     : {};

  return (
    <div
      id="modal_main"
      role="dialog"
      aria-modal="true"
      onClick={handleBackdropClick}
      className={`fixed inset-0 z-10 flex justify-center items-center transition-colors 
        ${isVisible ? "visible bg-black/55 backdrop-blur-none" : "invisible"}`}
    >
      <div
        id="modal_container"
        onClick={(e) => e.stopPropagation()} // Evita que el clic dentro del modal lo cierre
        className={`bg-white rounded-md shadow transition-all 
          ${isVisible ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
      >
        {typeModal ? (
          typeModal === "editRegister" ? (
            <EditRegister register={data as IRegistration | null} onCloseModal={onClose} onUpdate={onUpdate} />
          ) : typeModal === "userDetails" ? (
            <DetailsUser userInfo={data as IUser | null} onCloseModal={onClose} />
          ) : typeModal === "userRegisters" ? (
            <RegistersTable userInfo={data as IUser | null} onCloseModal={onClose} />
          ) : typeModal === "createEmployee" ? (
            <CreateUser onCloseModal={onClose} />
          ) : typeModal === "createNonLaborDate" ? (
            <CreateNonLaborDate onCloseModal={onClose} onUpdate={onUpdate} nonLaborDate={data as INonLaborDate} />
          ) : typeModal === "createEmployeeAbsence" ? (
            <CreateEmployeeAbsence onCloseModal={onClose} onUpdate={onUpdate} userId={userId} />
          ) : null
        ) : (
          "No se encontró el Modal"
        )}
      </div>
    </div>
  );
};

export default ModalGeneric;
