import { formatName } from "../utils/format";
import { IRegistration, IUser } from "../helpers/types";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import dayjs from "dayjs";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { FiEdit } from "react-icons/fi";
import ModalGeneric from "./ModalGeneric";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { updateUserFromNotification, updateUserRegister } from "../redux/slices/usersEmpSlice";

const BACK_API_URL = import.meta.env.VITE_LOCAL_API_URL;
const RegistersTable: React.FC<{ userInfo?: IUser | null }> = ({ userInfo }) => {
  const dispatch = useAppDispatch();
  const { usersFilter } = useAppSelector((state) => state.usersEmp);
  const [registers, setRegisters] = useState<IRegistration[]>([]);
  const [registerFilter, setRegisterFilter] = useState<IRegistration[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>();
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [filterColumn, setFilterColumn] = useState({
    type: "Ingreso",
    order: false,
  });

  const [details, setDetails] = useState<IRegistration | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTypeModal, setIsTypeModal] = useState("");

  const handleOpenModal = (register: IRegistration | null, event: React.SyntheticEvent) => {
    setIsTypeModal(event.currentTarget.id);
    setDetails(register);
    setIsModalOpen(true);
  };

  useEffect(() => {
    if (userInfo) {
      axios
        .get(`${BACK_API_URL}/registrations/user/${userInfo?.id}`, {
          withCredentials: true,
        })
        .then(({ data }) => {
          setRegisters(data);
          setRegisterFilter(data);
          // console.log(data);
        })
        .catch((error) => {
          toast.error(error.response.message ?? "Error al cargar registros.");
        });
    }
  }, [userInfo]);

  useEffect(() => {
    if (!searchTerm) {
      setRegisterFilter(registers); // Si no hay búsqueda, mostramos todos los registros
      return;
    }

    setRegisterFilter(
      registers.filter((item) => {
        const formattedDate1 = dayjs(item.entryDate).format("YYYY-MM-DD"); // 2024-02-12
        const formattedDate2 = dayjs(item.entryDate).format("DD/MM/YYYY"); // 12/02/2024

        return formattedDate1.startsWith(searchTerm) || formattedDate2.startsWith(searchTerm);
      })
    );
  }, [searchTerm, registers]);

  // Actualizar la tabla cuando cambia el mes o el año
  useEffect(() => {
    const filtered = registers.filter((item) => {
      const itemMonth = dayjs(item.entryDate).format("MM"); // Extrae el mes (ej: "02")
      const itemYear = dayjs(item.entryDate).format("YYYY"); // Extrae el año (ej: "2024")

      return (selectedMonth ? itemMonth === selectedMonth : true) && (selectedYear ? itemYear === selectedYear : true);
    });

    setRegisterFilter(filtered);
  }, [selectedMonth, selectedYear, registers]);

  // Extraer meses y años únicos de los registros
  const years = [...new Set(registers.map((item) => dayjs(item.entryDate).format("YYYY")))];
  // Obtener meses únicos según el año seleccionado
  const months = selectedYear
    ? [
        ...new Set(
          registers
            .filter((item) => dayjs(item.entryDate).format("YYYY") === selectedYear)
            .map((item) => dayjs(item.entryDate).format("MM"))
        ),
      ]
    : [...new Set(registers.map((item) => dayjs(item.entryDate).format("MM")))];

  // Resetear el mes si cambia el año y el mes seleccionado no está disponible
  useEffect(() => {
    if (selectedMonth && !months.includes(selectedMonth)) {
      setSelectedMonth("");
    }
  }, [selectedYear, months]);

  const handleUpdateRegistration = (updatedRecord) => {
    const userUpdated = usersFilter.find((user) => user.id === userInfo?.id);
    // const updatedRegistrations = {

    // }
    if (userUpdated && userUpdated.registrations[0].id === updatedRecord.id) {
      // Nuevo objeto con la propiedad renombrada y la nueva propiedad agregada
      const { id, ...updatedRecordWithoutId } = updatedRecord;
      const updatedObject = {
        idR: id, // Renombrar 'id' a 'idR'
        id: userInfo?.id, // Agregar nueva propiedad 'id' con otro valor
        ...updatedRecordWithoutId, // Mantener el resto de las propiedades sin cambios
      };
      dispatch(updateUserFromNotification([updatedObject]));
    }
    setRegisterFilter((prev) => prev.map((record) => (record.id === updatedRecord.id ? updatedRecord : record)));
  };

  const handleSelectedMonth = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    setSelectedMonth(e.target.value);
    console.log("selectedMonthx", selectedMonth);
  };

  const handleReport = (e: React.MouseEvent<HTMLButtonElement>) => {
    const idType = e.currentTarget.id; // Obtener el id del botón clickeado
    console.log("ID del botón:", idType);
    const urlReport =
      idType === "pdfPlanilla"
        ? `${BACK_API_URL}/reports/pdf/planilla-mes`
        : idType === "pdfPorcentaje"
        ? `${BACK_API_URL}/reports/pdf/porcentaje-mes`
        : idType === "excelPlanilla"
        ? `${BACK_API_URL}/reports/excel/planilla-mes`
        : "";
    if (selectedMonth && selectedYear && userInfo) {
      const data = {
        id: userInfo?.id,
        month: selectedMonth,
        year: selectedYear,
      };
      console.log("data", data);
      axios
        .get(`${urlReport}`, {
          params: { year: selectedYear, month: selectedMonth, id: userInfo?.id },
          // responseType: "blob", // Para recibir el PDF correctamente
          withCredentials: true,
          responseType: "arraybuffer",
        })
        .then(({ data }) => {
          if (idType === "pdfPlanilla" || idType === "pdfPorcentaje") {
            const blob = new Blob([data], { type: "application/pdf" });
            const link = document.createElement("a");
            link.href = window.URL.createObjectURL(blob);
            link.setAttribute("download", `planillaASDA-${selectedYear}-${selectedMonth}.pdf`);
            // link.download = `expense.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          } else {
            // Crear un Blob para descargar el archivo
            const url = window.URL.createObjectURL(new Blob([data]));
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", `planilla-${selectedYear}-${selectedMonth}.xlsx`);
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        })
        .catch((error) => {
          if (error.response.data.message === "Error al descargar el PDF") {
            toast.error(error.response.data.message);
          }
          console.error("asd", error);
        });
    } else {
      toast.info("Seleccione un año y un mes");
    }
  };

  return (
    <div className="w-[1500px] h-[900px]">
      <div className="xs:w-4/5 m-auto my-2 relative flex flex-col w-full h-[800px] text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
        {/* <h3 className="ml-6 text-start w-[400px]"></h3> */}
        <h2 className="mt-4   text-center font-[500] text-[30px]">
          Registros del Empleado : {userInfo && formatName(userInfo?.name, userInfo?.lastName)}{" "}
        </h2>
        <div className="relative h-[110px] mx-4 mt-4 overflow-hidden  text-gray-700 bg-white rounded-none bg-clip-border">
          <div className="flex flex-col justify-between gap-8 mb-4 md:flex-row md:items-center">
            <div className="flex w-full gap-2 shrink-0 md:w-max">
              <div className="w-full md:w-[360px] ">
                <div className="my-3 relative h-10  min-w-[200px]">
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
                    className="peer h-full w-full rounded-[7px] border border-[#E2E8F0] border-t-transparent bg-transparent px-3 py-2.5 !pr-9 font-sans text-sm font-normal text-[#2B4B5B] outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-[#E2E8F0] placeholder-shown:border-t-[#E2E8F0] focus:border-2 focus:border-gray-900  focus:outline-0 disabled:border-0 disabled:bg-[#F8FAFC]"
                    placeholder="Buscar por fecha (YYYY-MM-DD o DD/MM/YYYY)"
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                </div>
              </div>
              <div className=" flex items-center justify-center gap-4 ">
                <select
                  value={selectedYear}
                  onChange={(e) => {
                    setSelectedYear(e.target.value);
                    setSelectedMonth(""); // Resetear mes cuando cambia el año
                  }}
                  className=" bg-gray-50  border-[#d6dadf] border-1 text-gray-900 text-sm rounded-lg focus:border-1 focus:ring-blue-500 focus:border-blue-500 block p-[7.5px]   outline-none"
                >
                  <option value="">Todos los años</option>
                  {years.map((year) => (
                    <option key={year} value={year}>
                      {year}
                    </option>
                  ))}
                </select>

                {/* Select para Mes */}
                <select
                  value={selectedMonth}
                  onChange={handleSelectedMonth}
                  className="bg-gray-50  border-[#d6dadf] border-1 text-gray-900 text-sm rounded-lg focus:border-1 focus:ring-blue-500 focus:border-blue-500 block p-[7.5px]   outline-none"
                  disabled={!selectedYear} // Deshabilitar si no hay un año seleccionado
                >
                  <option value="">Todos los meses</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {dayjs(`2024-${month}-01`).format("MMMM")} {/* Convierte "02" en "Febrero" */}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="flex flex-row items-center justify-between  ">
              <div className="flex flex-col items-center justify-between  ">
                <h3 className="text-center font-[400] text-[16px] h-[35px] w-[190px] leading-4 mb-1">
                  Descargar reporte mensual planilla:
                </h3>

                <div className="flex gap-2 items-center justify-center">
                  <button
                    id="pdfPlanilla"
                    onClick={handleReport}
                    className="relative h-[35px] max-h-[35px] w-[35px] max-w-[35px]"
                  >
                    <img
                      src="/icons/pdf-document-svgrepo-com (1).svg"
                      alt="icono"
                      className={`shadow-md hover:shadow-lg focus:shadow-none ${
                        selectedMonth && selectedYear ? "cursor-pointer" : "opacity-50"
                      }`}
                    />
                  </button>
                  <button
                    id="excelPlanilla"
                    onClick={handleReport}
                    className="relative h-[35px] max-h-[35px] w-[35px] max-w-[35px]"
                  >
                    <img
                      src="/icons/excel-document-svgrepo-com.svg"
                      alt="icono"
                      className={`shadow-md hover:shadow-lg focus:shadow-none ${
                        selectedMonth && selectedYear ? "cursor-pointer" : "opacity-50"
                      }`}
                    />
                  </button>
                </div>
              </div>
              <div className="flex flex-col items-center justify-between  ">
                <h3 className="text-center font-[400] text-[16px] h-[35px] w-[190px] leading-4 mb-1">
                  Descargar reporte mensual porcentajes:
                </h3>

                <div className="flex gap-2 items-center justify-center">
                  <button
                    id="pdfPorcentaje"
                    onClick={handleReport}
                    className="relative h-[35px] max-h-[35px] w-[35px] max-w-[35px]"
                  >
                    <img
                      src="/icons/pdf-document-svgrepo-com (1).svg"
                      alt="icono"
                      className={`shadow-md hover:shadow-lg focus:shadow-none ${
                        selectedMonth && selectedYear ? "cursor-pointer" : "opacity-50"
                      }`}
                    />
                  </button>
                  <button className="relative h-[35px] max-h-[35px] w-[35px] max-w-[35px]">
                    <img
                      src="/icons/excel-document-svgrepo-com.svg"
                      alt="icono"
                      className={`shadow-md hover:shadow-lg focus:shadow-none ${
                        selectedMonth && selectedYear ? "cursor-pointer" : "opacity-50"
                      }`}
                    />
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div className=" h-full  overflow-auto p-0 m-0 " style={{ scrollbarGutter: "stable" }}>
          <table className="w-full text-left table-auto min-w-max min-h-max ">
            <thead className="sticky top-0 bg-white shadow-md" style={{ top: "-0.5px" }}>
              <tr className="bg-[#F5F7F8]">
                <th
                  className="cursor-pointer w-[250px] sm:w-[100px] p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  // onClick={onClickName}
                >
                  <p className="block font-sans text-sm text-center antialiased font-bold leading-none ">Foto de Empleado</p>
                </th>
                <th
                  className=" hidden lg:table-cell  cursor-pointer p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  // onClick={onClickName}
                >
                  <p className="  font-sans text-sm text-center  antialiased font-bold  leading-none">Captura de Salida</p>
                </th>
                <th className="hidden lg:table-cell p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50">
                  <p className=" font-sans text-sm text-center  antialiased font-bold  leading-none ">Captura de Ingreso</p>
                </th>
                <th
                  className="hidden lg:table-cell w-[100px] cursor-pointer p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  // onClick={onClickName}
                >
                  <p className=" block font-sans text-sm text-center antialiased font-bold  leading-none ">Ingreso</p>
                </th>
                <th
                  className="hidden sm:table-cell w-[100px] cursor-pointer p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  // onClick={onClickName}
                >
                  <p className="block font-sans text-sm text-center antialiased font-bold  leading-none">Salida</p>
                </th>
                <th
                  className=" sm:table-cell w-[150px] cursor-pointer  p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  // onClick={onClickName}
                >
                  <p className="block font-sans text-sm text-center antialiased font-bold  leading-none">Estado</p>
                </th>

                <th
                  className=" sm:table-cell w-[200px] cursor-pointer  p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  // onClick={onClickName}
                >
                  <p className="block font-sans text-sm text-center antialiased font-bold  leading-none">Justificación</p>
                </th>
                <th
                  className=" sm:table-cell  w-[400px]  cursor-pointer  p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  // onClick={onClickName}
                >
                  <p className="block font-sans text-sm text-center antialiased font-bold  leading-none">Descripción</p>
                </th>
                <th className="hidden lg:table-cell p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50">
                  <p className="block font-sans text-sm antialiased font-bold  leading-none"></p>
                </th>
              </tr>
            </thead>
            <tbody className="">
              {/*  */}
              {registerFilter.map((register) => (
                <tr key={register.id} className="hover:bg-slate-50 ">
                  <PhotoProvider
                    maskOpacity={0.5}
                    key={`${userInfo?.id}-${
                      userInfo?.registrations && userInfo?.registrations?.length > 0 && userInfo.registrations[0].entryCapture
                        ? userInfo.registrations[0].entryCapture
                        : 0
                    }-${
                      userInfo?.registrations && userInfo?.registrations.length > 0 && userInfo.registrations[0].exitCapture
                        ? userInfo.registrations[0].exitCapture
                        : 0
                    }`}
                  >
                    <>
                      <td className="p-4 border-b border-[#cfd8dc] ">
                        <div className="h-[50px] flex items-center justify-center">
                          {userInfo?.image ? (
                            <PhotoView src={`${userInfo?.image}`}>
                              <img
                                src={userInfo?.image}
                                alt={userInfo?.name || "user img"}
                                className="h-12 w-12  rounded-[50%] object-cover"
                              />
                            </PhotoView>
                          ) : (
                            "-"
                          )}
                        </div>
                      </td>
                      <td className="p-4 border-b border-[#cfd8dc] w-[150px] ">
                        <div className=" h-[50px] flex items-center justify-center">
                          {register?.exitCapture ? (
                            <PhotoView src={`${register?.exitCapture}`}>
                              <img
                                src={`${register?.exitCapture}`}
                                alt={userInfo?.name || "user img"}
                                className="max-w-full max-h-full object-contain cursor-pointer"
                              />
                            </PhotoView>
                          ) : (
                            "-"
                          )}
                        </div>
                      </td>
                      <td className="p-4 border-b border-[#cfd8dc] w-[150px]">
                        <div className=" h-[50px] flex items-center justify-center">
                          {register?.entryCapture ? (
                            <PhotoView src={`${register?.entryCapture}`}>
                              <img
                                src={`${register?.entryCapture}`}
                                alt={userInfo?.name || "user img"}
                                className="max-w-full max-h-full object-contain cursor-pointer"
                              />
                            </PhotoView>
                          ) : (
                            "-"
                          )}
                        </div>
                      </td>
                    </>
                  </PhotoProvider>
                  <td className="p-4 border-b border-[#cfd8dc] ">
                    <p className="lg:w-auto block font-sans text-sm text-center antialiased font-normal leading-normal text-blue-gray-900">
                      {register?.entryDate ? dayjs(register.entryDate).format("DD/MM/YYYY") : "-"}
                    </p>
                    {register?.status !== "AUSENTE" ? (
                      <p className="lg:w-auto block font-sans text-sm text-center antialiased font-normal leading-normal text-blue-gray-900">
                        {register?.entryDate ? dayjs(register.entryDate).format("HH:mm") : "-"}
                      </p>
                    ) : null}
                  </td>
                  <td className="p-4 border-b border-[#cfd8dc] ">
                    <p className="lg:w-auto block font-sans text-sm text-center antialiased font-normal leading-normal text-blue-gray-900">
                      {register?.exitDate ? dayjs(register.exitDate).format("DD/MM/YYYY") : "-"}
                    </p>
                    <p className="lg:w-auto block font-sans text-sm text-center antialiased font-normal leading-normal text-blue-gray-900">
                      {register?.exitDate ? dayjs(register.exitDate).format("HH:mm") : "-"}
                    </p>
                  </td>
                  <td className="hidden sm:table-cell w-[100px] text-center p-4 border-b border-[#cfd8dc]">
                    {register?.status ? (
                      register.status === "TRABAJANDO" ? (
                        <div
                          className={`  items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap ${
                            register.type === "LLEGADA_TARDE" ? "bg-red-500/20" : "bg-green-500/20"
                          }  `}
                          title={register.type === "LLEGADA_TARDE" ? "Llegada tarde" : ""}
                        >
                          <span className="">Trabajando</span>
                        </div>
                      ) : register.status === "PRESENTE" ? (
                        <div
                          className={`grid items-center px-2 py-1 font-sans text-xs font-bold text-blue-900 uppercase rounded-md select-none whitespace-nowrap ${
                            register?.type === "LLEGADA_TARDE" ||
                            register?.type === "LLEGADA_TARDE-SALIDA_TEMPRANA" ||
                            register?.type === "SALIDA_TEMPRANA"
                              ? "bg-red-500/20"
                              : "bg-blue-500/20"
                          }`}
                          title={
                            register?.type === "LLEGADA_TARDE"
                              ? "Llegada tarde"
                              : register?.type === "LLEGADA_TARDE-SALIDA_TEMPRANA"
                              ? "Llegada tarde - Salida temprana"
                              : register?.type === "SALIDA_TEMPRANA"
                              ? "Salida temprana"
                              : ""
                          }
                        >
                          <span className="">Presente</span>
                        </div>
                      ) : register.status === "AUSENTE" ? (
                        <div className=" grid items-center px-2 py-1 font-sans text-xs font-bold text-amber-900 uppercase rounded-md select-none whitespace-nowrap bg-blue-gray-500/20 bg-amber-500/20">
                          <span className="">Ausente</span>
                        </div>
                      ) : register.status === "NO_LABORABLE" ? (
                        <div className=" grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap bg-blue-gray-500/20 text-blue-gray-900">
                          <span className="">Día No Laboral</span>
                        </div>
                      ) : (
                        <div className=" grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap bg-blue-gray-500/20 text-blue-gray-900">
                          <span className="">No Estado</span>
                        </div>
                      )
                    ) : null}
                  </td>
                  <td className="p-4 border-b border-[#cfd8dc] ">
                    <p className="lg:w-auto block font-sans text-sm text-center antialiased font-normal leading-normal text-blue-gray-900">
                      {register?.type
                        ? register.type === "ARTICULO"
                          ? "Art. " + register?.articulo
                          : register.type === "FERIADO"
                          ? "Feriado"
                          : register.type === "LLEGADA_TARDE"
                          ? "Llegada tarde"
                          : register.type
                        : "-"}
                    </p>
                  </td>
                  <td className="p-4 border-b border-[#cfd8dc] ">
                    <div className="w-full h-[40px] overflow-hidden flex items-center">
                      <p
                        className="w-full text-sm text-center font-normal leading-normal text-blue-gray-900 break-words line-clamp-2"
                        title={register?.description || ""}
                      >
                        {register?.description || "-"}
                      </p>
                    </div>
                  </td>
                  <td className="p-4 border-b border-[#cfd8dc] ">
                    <FiEdit className="w-7 h-7 cursor-pointer" onClick={(e) => handleOpenModal(register, e)} id="editRegister" />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {/* Modal */}
        {isModalOpen && (
          <ModalGeneric
            isVisible={isModalOpen}
            onClose={setIsModalOpen}
            data={details}
            typeModal={isTypeModal}
            onUpdate={handleUpdateRegistration}
          />
        )}
      </div>
    </div>
  );
};

export default RegistersTable;
