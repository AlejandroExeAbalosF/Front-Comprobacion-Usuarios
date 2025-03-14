import { useEffect, useState } from "react";
import { IEmployeeAbsence, IUser } from "../helpers/types";
import { useAppDispatch } from "../redux/hooks";
import { closeModal } from "../redux/slices/modalSlice";
import ModalGeneric from "./ModalGeneric";
import axios from "axios";
import { toast } from "sonner";
import { FiEdit } from "react-icons/fi";
import dayjs from "dayjs";

interface Props {
  onClose: () => void;
  userInfo?: IUser;
  typeModal?: "userRegisters" | "userDetails" | "createEmployee" | "editRegister" | "createNonLaborDate";

  closeOnBackdropClick?: boolean;

  onUpdate?: () => void;
}

const BACK_API_URL = import.meta.env.VITE_LOCAL_API_URL;

const EmployeeAbsence: React.FC<Props> = ({ userInfo, onClose }) => {
  //   console.log("userInfo", userInfo);
  const dispatch = useAppDispatch();
  const [employeeAbsenceDetails, setEmployeeAbsenceDetails] = useState<IEmployeeAbsence[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTypeModal, setIsTypeModal] = useState("");

  useEffect(() => {
    if (userInfo) {
      axios
        .get(`${BACK_API_URL}/employee-absences/user/${userInfo?.id}`, {
          withCredentials: true,
        })
        .then(({ data }) => {
          console.log(data);
          setEmployeeAbsenceDetails(data);
        })
        .catch((error) => {
          console.error(error.response.data.message);
          toast.error(error.response.data.message);
        });
    }
  }, [userInfo]);
  // Función para abrir el modal y cargar datos
  const handleOpenModal = (employeeAbsenceDate: IEmployeeAbsence | null, event: React.SyntheticEvent) => {
    console.log("id", event.currentTarget.id);
    setIsTypeModal(event.currentTarget.id);
    // setNonDateLaborDetails(nonLaborDate);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // Cierra el modal localmente
    dispatch(closeModal()); // Cierra el modal en Redux
  };
  //-----------

  const handleUpdateAndAdd = (updatedOrNewRecord: IEmployeeAbsence) => {
    setEmployeeAbsenceDetails((prev) => {
      // Busca si el registro ya existe en la lista
      const exists = prev.some((item) => item.id === updatedOrNewRecord.id);

      if (exists) {
        // Si existe, actualiza el registro
        return prev.map((item) => (item.id === updatedOrNewRecord.id ? updatedOrNewRecord : item));
      } else {
        // Si no existe, agrega el nuevo registro al principio de la lista
        return [updatedOrNewRecord, ...prev];
      }
    });
  };
  return (
    <section className="w-[375px] sm:w-auto md:w-[390px] lg:w-[590px] xl:w-[890px] 2xl:w-[1024px] h-[670px]  flex flex-col justify-center items-center">
      <div className="xs:w-4/5 m-auto my-2 relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
        <h2 className="notificationsext-2xl ml-5  text-2xl flex  items-start">Fechas de Ausencia</h2>
        <div className="relative h-[200px] lg:h-auto mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border">
          <div className="flex flex-col justify-between gap-8 mb-4 lg:flex-row lg:items-center">
            {/* <div>
          <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
            Recent Transactions
          </h5>
          <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
            These are details about the last transactions
          </p>
        </div> */}

            <div className="flex w-full gap-2 shrink-0 md:w-max">
              <div className="w-full md:w-72">
                <div className="my-3 relative h-10 w-full min-w-[200px]">
                  <div className="absolute grid w-5 h-5 top-2/4 right-3 -translate-y-2/4 place-items-center text-blue-gray-500">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                      aria-hidden="true"
                      className="w-5 h-5"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
                      ></path>
                    </svg>
                  </div>
                  <input
                    className="peer h-full w-full rounded-[7px] border border-[#E2E8F0] border-t-transparent bg-transparent px-3 py-2.5 !pr-9 font-sans text-sm font-normal text-[#2B4B5B] outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-[#E2E8F0] placeholder-shown:border-t-[#E2E8F0] focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-[#F8FAFC]"
                    placeholder=" "
                    // onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                  />
                  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-[#E2E8F0] before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-[#E2E8F0] after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    Buscar
                  </label>
                </div>
              </div>
            </div>
            {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Agregar empleado</button> */}

            <button
              className="rounded-md bg-blue-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-none active:bg-blue-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
              id="createEmployeeAbsence"
              onClick={(e) => handleOpenModal(null, e)}
            >
              Agregar Fecha
            </button>
          </div>
        </div>
        {/* Tabla */}
        <div className=" overflow-auto overflow-x-hidden  h-full p-0 m-0">
          <table className="w-full  text-left table-auto min-w-max min-h-max border-collapse">
            <thead className="sticky top-0 bg-white shadow-md" style={{ top: "-0.5px" }}>
              <tr className="bg-[#F5F7F8]">
                <th
                  className="cursor-pointer w-[100px] xl:w-[150px] p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  // onClick={onClickName}
                >
                  <p className="block font-sans text-sm text-center antialiased font-bold leading-none ">Tipo</p>
                </th>
                <th
                  className="hidden xl:table-cell cursor-pointer w-[100px] xl:w-[150px] p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  // onClick={onClickName}
                >
                  <p className="block font-sans text-sm text-center antialiased font-bold leading-none ">Articulo</p>
                </th>
                <th
                  className=" hidden 2xl:table-cell  cursor-pointer p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  // onClick={onClickName}
                >
                  <p className=" font-sans text-sm text-center lg:text-start  antialiased font-bold  leading-none ">
                    Descripcion
                  </p>
                </th>
                <th className="hidden lg:table-cell  w-[130px] p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50">
                  <p className=" font-sans text-sm text-center antialiased font-bold  leading-none ">Fecha de Inicio</p>
                </th>
                <th
                  className="hidden xl:table-cell  w-[130px] p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  // onClick={onClickName}
                >
                  <p className=" block font-sans text-sm text-center antialiased font-bold  leading-none ">Fecha de Fin</p>
                </th>

                <th className="w-[100px] lg:w-auto p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50">
                  <p className="block font-sans text-sm antialiased font-bold  leading-none"></p>
                </th>
              </tr>
            </thead>
            <tbody>
              {/*  */}
              {employeeAbsenceDetails.map((employeeAbsence) => (
                <tr key={employeeAbsence.id} className="hover:bg-slate-50 ">
                  <td className="p-4 border-b border-[#cfd8dc] ">
                    <p className="lg:w-auto block font-sans text-sm text-center antialiased font-normal leading-normal text-blue-gray-900">
                      {employeeAbsence.type}
                    </p>
                  </td>
                  <td className="hidden xl:table-cell p-4 border-b border-[#cfd8dc] ">
                    <p className="lg:w-auto block font-sans text-sm text-center antialiased font-normal leading-normal text-blue-gray-900">
                      {employeeAbsence.articulo}
                    </p>
                  </td>
                  <td className="hidden 2xl:table-cell  p-4 border-b border-[#cfd8dc]">
                    <div className="w-[350px] h-[40px] overflow-hidden flex items-center">
                      <p className="w-full text-sm text-start font-normal leading-normal text-blue-gray-900 break-words line-clamp-2">
                        {employeeAbsence.description}{" "}
                      </p>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell p-4 border-b border-[#cfd8dc]">
                    <p className="lg:w-auto block font-sans text-sm text-center antialiased font-normal leading-normal text-blue-gray-900">
                      {dayjs(employeeAbsence.startDate).format("DD/MM/YYYY")}
                    </p>
                  </td>
                  <td className="hidden xl:table-cell p-4 border-b border-[#cfd8dc]">
                    <p className="lg:w-auto block font-sans text-sm text-center antialiased font-normal leading-normal text-blue-gray-900">
                      {dayjs(employeeAbsence.endDate).format("DD/MM/YYYY")}
                    </p>
                  </td>
                  <td className="p-4 border-b border-[#cfd8dc] ">
                    <div className="flex items-center justify-center">
                      <FiEdit
                        className="w-7 h-7 cursor-pointer"
                        id="createNonLaborDate"
                        // onClick={(e) => handleOpenModal(null, e)}
                        // onClick={(e) => handleOpenModal(employeeAbsence, e)}

                        // id="editRegister"
                      />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <ModalGeneric
          isVisible={isModalOpen}
          onClose={handleCloseModal}
          // data={nonDateLaborDetails}
          userId={userInfo?.id}
          typeModal={isTypeModal}
          onUpdate={handleUpdateAndAdd}
        />
      )}
      <div className="flex justify-end items-end w-full mt-1">
        <button
          className="mr-2 rounded-md bg-red-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700 hover:bg-red-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
          type="button"
          onClick={onClose}
        >
          Atras
        </button>
      </div>
    </section>
  );
};

export default EmployeeAbsence;
