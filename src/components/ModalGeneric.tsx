import { useEffect } from "react";
import { IUser } from "../helpers/types";
import { formatName } from "../utils/formatName";
import CreateUser from "./CreateUser";
import RegistersTable from "./RegistersTable";
import DetailsUser from "./DetailsUser";

interface ModalProps {
  isVisible?: boolean;
  onClose: (isVisible: boolean) => void;
  data?: IUser | null;
  typeModal?: string;
}

const ModalGeneric: React.FC<ModalProps> = ({ isVisible, onClose, data, typeModal }) => {
  useEffect(() => {
    if (isVisible) {
      document.body.style.overflow = "hidden"; // Bloquea el scroll del fondo
    } else {
      document.body.style.overflow = ""; // Restaura el scroll
    }

    return () => {
      document.body.style.overflow = ""; // Asegura que el scroll se restaure al desmontar
    };
  }, [isVisible]);

  const handleModal = () => {
    // console.log(isVisible);
    onClose(!isVisible);
  };
  return (
    <div
      id="modal_main"
      onClick={handleModal}
      className={`fixed z-10  inset-0 flex justify-center items-center transition-colors  ${
        isVisible ? "visible bg-black/55  inset-0  backdrop-blur-xs  " : "invisible"
      }  `}
    >
      <div
        id="modal_container"
        onClick={(e) => e.stopPropagation()}
        className={` bg-white rounded-md   shadow transition-all ${isVisible ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
      >
        {typeModal === "userRegisters" ? (
          <RegistersTable userInfo={data ?? null} />
        ) : typeModal === "userDetails" ? (
          <DetailsUser userInfo={data ?? null} onCloseModal={onClose} />
        ) : typeModal === "createEmployee" ? (
          <CreateUser onCloseModal={onClose} />
        ) : null}
      </div>
    </div>
  );
};

export default ModalGeneric;
