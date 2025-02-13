import { formatName } from "../utils/formatName";
import { IRegistration, IUser } from "../helpers/types";
import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "sonner";
import dayjs from "dayjs";
import { PhotoProvider, PhotoView } from "react-photo-view";

const BACK_API_URL = import.meta.env.VITE_LOCAL_API_URL;
const RegistersTable: React.FC<{ userInfo?: IUser | null }> = ({ userInfo }) => {
  const [registers, setRegisters] = useState<IRegistration[]>([]);
  const [registerFilter, setRegisterFilter] = useState<IRegistration[]>([]);
  const [searchTerm, setSearchTerm] = useState<string>();
  const [selectedMonth, setSelectedMonth] = useState<string>("");
  const [selectedYear, setSelectedYear] = useState<string>("");
  const [filterColumn, setFilterColumn] = useState({
    type: "Ingreso",
    order: false,
  });
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

  return (
    <div className="w-[1500px] h-[900px]">
      <div className="xs:w-4/5 m-auto my-2 relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
        {/* <h3 className="ml-6 text-start w-[400px]"></h3> */}
        <h2 className="mt-4  text-center font-[500] text-[30px]">
          Registros del Empleado : {userInfo && formatName(userInfo?.name, userInfo?.lastName)}{" "}
        </h2>
        <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border">
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
                  onChange={(e) => setSelectedMonth(e.target.value)}
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
            {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Agregar empleado</button> */}
            {/* <button
              className="rounded-md bg-blue-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-none active:bg-blue-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
              id="createEmployee"
              // onClick={(e) => handleOpenModal(null, e)}
            >
              Agregar empleado
            </button> */}
          </div>
        </div>
        <div className=" h-full  overflow-auto p-0 m-0 " style={{ scrollbarGutter: "stable" }}>
          <table className="w-full text-left table-auto min-w-max min-h-max ">
            <thead className="sticky top-0 bg-white shadow-md" style={{ top: "-0.5px" }}>
              <tr className="bg-[#F5F7F8]">
                <th
                  className="cursor-pointer w-[250px] sm:w-[350px] p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  // onClick={onClickName}
                >
                  <p className="block font-sans text-sm antialiased font-bold leading-none ">Foto de Empleado</p>
                </th>
                <th
                  className=" hidden lg:table-cell  cursor-pointer p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  // onClick={onClickName}
                >
                  <p className="  font-sans text-sm text-center  antialiased font-bold  leading-none">Captura de Ingreso</p>
                </th>
                <th className="hidden lg:table-cell p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50">
                  <p className=" font-sans text-sm text-center  antialiased font-bold  leading-none ">Captura de Salida</p>
                </th>
                <th
                  className="hidden lg:table-cell cursor-pointer p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  // onClick={onClickName}
                >
                  <p className=" block font-sans text-sm text-center antialiased font-bold  leading-none ">Ingreso</p>
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
            <tbody className="">
              {/*  */}
              {registerFilter.map((register) => (
                <tr key={register.id} className="hover:bg-slate-50 h-[100px]">
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
                        {userInfo?.image ? (
                          <PhotoView src={`${userInfo?.image}`}>
                            <img
                              src={userInfo?.image}
                              alt={userInfo?.name || "user img"}
                              className="w-[100px] h-[100px]  rounded-[50%] object-cover"
                            />
                          </PhotoView>
                        ) : (
                          "-"
                        )}
                      </td>
                      <td className="p-4 border-b border-[#cfd8dc] w-[150px]">
                        <div className="w-[150px] h-[100px] flex items-center justify-center">
                          {register?.entryCapture ? (
                            <PhotoView src={`${register?.entryCapture}`}>
                              <img
                                src={`${register?.entryCapture}`}
                                alt={userInfo?.name || "user img"}
                                className="max-w-full max-h-full object-contain  cursor-pointer"
                              />
                            </PhotoView>
                          ) : (
                            "-"
                          )}
                        </div>
                      </td>
                      <td className="p-4 border-b border-[#cfd8dc] w-[150px]">
                        <div className="w-[150px] h-[100px] flex items-center justify-center">
                          {register?.exitCapture ? (
                            <PhotoView src={`${register?.exitCapture}`}>
                              <img
                                src={`${register?.exitCapture}`}
                                alt={userInfo?.name || "user img"}
                                className="max-w-full max-h-full object-contain  cursor-pointer"
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
                    <p className="lg:w-auto block font-sans text-sm text-center antialiased font-normal leading-normal text-blue-gray-900">
                      {register?.entryDate ? dayjs(register.entryDate).format("HH:mm") : "-"}
                    </p>
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
                    {register?.validated ? (
                      register.validated === "working" ? (
                        <div className=" grid items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap bg-green-500/20">
                          <span className="">Trabajando</span>
                        </div>
                      ) : register.validated === "present" ? (
                        <div className=" grid items-center px-2 py-1 font-sans text-xs font-bold text-blue-900 uppercase rounded-md select-none whitespace-nowrap bg-blue-500/20">
                          <span className="">Presente</span>
                        </div>
                      ) : register.validated === "absent" ? (
                        <div className=" grid items-center px-2 py-1 font-sans text-xs font-bold text-amber-900 uppercase rounded-md select-none whitespace-nowrap bg-blue-gray-500/20 bg-amber-500/20">
                          <span className="">Ausente</span>
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
                      -
                    </p>
                  </td>
                  <td className="p-4 border-b border-[#cfd8dc] "></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RegistersTable;
