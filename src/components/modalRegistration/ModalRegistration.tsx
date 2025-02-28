import { IRegistration, IUser } from "../../helpers/types";
import { formatName } from "../../utils/format";

interface ModalProps {
  isVisible?: boolean;
  onClose: (isVisible: boolean) => void;
  data?: IUser;
}

const ModalRegistration: React.FC<ModalProps> = ({ isVisible, onClose, data }) => {
  const handleModal = () => {
    // console.log(isVisible);
    onClose(!isVisible);
  };
  return (
    <div
      id="modal_main"
      onClick={handleModal}
      className={`fixed z-10  inset-0 flex justify-center items-center transition-colors  ${
        isVisible ? "visible bg-black/55  inset-0  backdrop-blur-md  " : "invisible"
      }  `}
    >
      <div
        id="modal_container"
        onClick={(e) => e.stopPropagation()}
        className={` bg-white rounded-md   shadow transition-all ${isVisible ? "scale-100 opacity-100" : "scale-125 opacity-0"}`}
      >
        <div className="w-[1500px] h-200">
          <h2 className="mt-4 text-center font-bold">Registros del Empleado </h2>
          <h3 className="ml-6 text-start w-[400px]">{data && formatName(data.name, data.lastName)}</h3>
          <div className="p-6 px-0 overflow-scroll overflow-x-hidden h-[600px]">
            <table className="w-full mt-4 text-left table-auto min-w-max">
              <thead>
                <tr className="bg-[#F5F7F8]">
                  <th
                    className="cursor-pointer w-[250px] sm:w-[350px] p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                    // onClick={onClickName}
                  >
                    <p className="block font-sans text-sm antialiased font-bold leading-none ">Empleado Foto</p>
                  </th>
                  <th
                    className=" hidden lg:table-cell  cursor-pointer p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                    // onClick={onClickName}
                  >
                    <p className=" font-sans text-sm text-center lg:text-start  antialiased font-bold  leading-none ">
                      Captura Ingreso
                    </p>
                  </th>
                  <th className="hidden lg:table-cell p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50">
                    <p className=" font-sans text-sm antialiased font-bold  leading-none ">Captura de Salida</p>
                  </th>
                  <th
                    className="hidden lg:table-cell cursor-pointer p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                    // onClick={onClickName}
                  >
                    <p className=" block font-sans text-sm antialiased font-bold  leading-none ">Ingreso</p>
                  </th>
                  <th
                    className="hidden sm:table-cell cursor-pointer p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                    // onClick={onClickName}
                  >
                    <p className="block font-sans text-sm text-center antialiased font-bold  leading-none">Salida</p>
                  </th>
                  <th
                    className=" sm:table-cell cursor-pointer  p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                    // onClick={onClickName}
                  >
                    <p className="block font-sans text-sm text-center antialiased font-bold  leading-none">Estado</p>
                  </th>
                  <th
                    className=" sm:table-cell cursor-pointer  p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                    // onClick={onClickName}
                  >
                    <p className="block font-sans text-sm text-center antialiased font-bold  leading-none">Comentario?</p>
                  </th>
                  <th className="hidden lg:table-cell p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50">
                    <p className="block font-sans text-sm antialiased font-bold  leading-none"></p>
                  </th>
                </tr>
              </thead>
              <tbody>{/*  */}</tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ModalRegistration;
