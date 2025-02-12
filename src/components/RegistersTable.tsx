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
  useEffect(() => {
    if (userInfo) {
      axios
        .get(`${BACK_API_URL}/registrations/user/${userInfo?.id}`, {
          withCredentials: true,
        })
        .then(({ data }) => {
          setRegisters(data);
          // console.log(data);
        })
        .catch((error) => {
          toast.error(error.response.message ?? "Error al cargar registros.");
        });
    }
  }, [userInfo]);
  return (
    <div className="w-[1500px] h-200">
      <h2 className="mt-4  text-center font-[500] text-[30px]">
        Registros del Empleado : {userInfo && formatName(userInfo?.name, userInfo?.lastName)}{" "}
      </h2>
      {/* <h3 className="ml-6 text-start w-[400px]"></h3> */}
      <div className="p-6 px-0 overflow-scroll overflow-x-hidden h-[750px] ">
        <table className="w-full  mt-4 text-left table-auto min-w-max min-h-max">
          <thead>
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
                <p className=" font-sans text-sm text-center lg:text-start  antialiased font-bold  leading-none ">
                  Captura de Ingreso
                </p>
              </th>
              <th className="hidden lg:table-cell p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50">
                <p className=" font-sans text-sm antialiased font-bold  leading-none ">Captura de Salida</p>
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
          <tbody>
            {/*  */}
            {registers.map((register) => (
              <tr key={register.id} className="hover:bg-slate-50">
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
                          <img src={userInfo?.image} alt={userInfo?.name || "user img"} className="w-[100px]" />
                        </PhotoView>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-4 border-b border-[#cfd8dc] ">
                      {register?.entryCapture ? (
                        <PhotoView src={`${register?.entryCapture}`}>
                          <img src={`${register?.entryCapture}`} alt={userInfo?.name || "user img"} className="w-[100px]" />
                        </PhotoView>
                      ) : (
                        "-"
                      )}
                    </td>
                    <td className="p-4 border-b border-[#cfd8dc] ">
                      {register?.exitCapture ? (
                        <PhotoView src={`${register?.exitCapture}`}>
                          <img src={`${register?.exitCapture}`} alt={userInfo?.name || "user img"} className="w-[100px]" />
                        </PhotoView>
                      ) : (
                        "-"
                      )}
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
                  <div className="w-max">
                    {register?.validated ? (
                      register.validated === "present" ? (
                        <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap bg-green-500/20">
                          <span className="">Presente</span>
                        </div>
                      ) : register.validated === "idle" ? (
                        <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-blue-900 uppercase rounded-md select-none whitespace-nowrap bg-blue-500/20">
                          <span className="">Inactivo</span>
                        </div>
                      ) : register.validated === "absent" ? (
                        <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-amber-900 uppercase rounded-md select-none whitespace-nowrap bg-blue-gray-500/20 bg-amber-500/20">
                          <span className="">Ausente</span>
                        </div>
                      ) : (
                        <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap bg-blue-gray-500/20 text-blue-gray-900">
                          <span className="">No Estado</span>
                        </div>
                      )
                    ) : null}
                  </div>
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
  );
};

export default RegistersTable;
