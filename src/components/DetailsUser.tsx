import dayjs from "dayjs";
import { IUser } from "../helpers/types";
import { formatName, formatTime } from "../utils/format";
import { useState } from "react";
import CreateUser from "./CreateUser";
import { PhotoProvider, PhotoView } from "react-photo-view";
import EmployeeAbsence from "./EmployeeAbsence";
import { IoIosClose } from "react-icons/io";

const DetailsUser: React.FC<{ userInfo?: IUser | null; onCloseModal?: (isVisible: boolean) => void }> = ({
  userInfo,
  onCloseModal,
}) => {
  console.log("userInfo", userInfo);
  const [isEditing, setIsEditing] = useState(false);
  const [isEmployeeAbsences, setIsEmployeeAbsences] = useState(false); // [isEmployeeAbsences]

  const handleCloseEmployeeAbsences = () => setIsEmployeeAbsences(false);
  const handleModal = () => {
    // console.log(isVisible);
    if (onCloseModal) {
      onCloseModal(false);
    }
  };
  // console.log("userInfo", userInfo);
  return (
    <>
      {isEditing ? (
        <>
          <CreateUser setIsEditing={setIsEditing} userInfo={userInfo} onCloseModal={onCloseModal} />
        </>
      ) : (
        <div className="w-[400px] sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1300px] 2xl:w-[1500px] h-200">
          <h2 className="mt-4  text-center font-[500] text-[30px]">
            Detalles del Usuario : {userInfo && formatName(userInfo?.name, userInfo?.lastName)}{" "}
          </h2>
          <button
            onClick={handleModal}
            className="absolute top-[-1px] right-[-1px]  rounded-lg text-gray-400   hover:text-[#160852] cursor-pointer "
          >
            <IoIosClose className="w-10 h-10" />
          </button>
          <div className="flex flex-col overflow-auto h-[700px] md:h-auto md:overflow-hidden md:flex-row w-auto p-6 ">
            <div className="flex flex-col md:justify-between lg:justify-normal items-center">
              <div className="w-[380px] h-[300px] flex flex-col justify-center items-center">
                <div className="flex justify-center items-center  mt-1 bg-[#fff8f2] w-[252px] h-[252px] rounded-[50%] shadow-md ">
                  <PhotoProvider maskOpacity={0.5}>
                    <PhotoView src={`${userInfo?.image}`}>
                      <img src={userInfo?.image} className=" w-[252px] h-[252px] rounded-[50%] object-cover " />
                    </PhotoView>
                  </PhotoProvider>
                </div>
              </div>
              <div className="w-[380px] h-[300px] flex flex-col  items-center">
                <div>
                  <h3 className="text-start text-[20px]">Horario de Trabajo</h3>
                  <hr className="border-t border-gray-300 my-1" />
                </div>
                <div className="my-1 flex flex-row gap-4 ">
                  <div className=" relative  w-[150px]   flex flex-col justify-center items-center">
                    <label className="form-title-md"> Turno</label>
                    <p className="px-2 h-[35px] w-[150px] text-center flex justify-center  items-center ">
                      {userInfo?.shift
                        ? userInfo?.shift.name === "M"
                          ? "Mañana"
                          : userInfo?.shift.name === "T"
                          ? "Tarde"
                          : userInfo?.shift.name
                        : "-"}
                    </p>
                  </div>
                </div>
                <div className="my-1 flex flex-row gap-4 ">
                  <div className=" relative  w-[150px]   flex flex-col justify-center items-center">
                    <label className="form-title-md"> Hora de Entrada</label>
                    <p className="px-2 h-[35px] w-[150px] text-center flex justify-center items-center ">
                      {userInfo?.entryHour
                        ? formatTime(userInfo?.entryHour)
                        : userInfo?.shift && userInfo?.shift.entryHour
                        ? formatTime(userInfo?.shift.entryHour)
                        : "-"}
                    </p>
                  </div>
                  <div className=" relative  w-[150px]  flex flex-col justify-center items-center">
                    <label className="form-title-md"> Hora de Salida</label>
                    <p className="px-2 h-[35px] w-[150px] text-center flex justify-center items-center ">
                      {userInfo?.exitHour
                        ? formatTime(userInfo?.exitHour)
                        : userInfo?.shift && userInfo?.shift.exitHour
                        ? formatTime(userInfo?.shift.exitHour)
                        : "-"}
                    </p>
                  </div>
                </div>
              </div>
              <button
                className="hidden md:block lg:hidden rounded-md bg-blue-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-none active:bg-blue-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                id="employeeAbsences"
                onClick={() => setIsEmployeeAbsences(true)}
              >
                Fechas de Ausencias
              </button>
            </div>

            <div className="  ">
              {isEmployeeAbsences ? (
                <EmployeeAbsence userInfo={userInfo} onClose={handleCloseEmployeeAbsences} />
              ) : (
                <div className=" flex flex-col justify-center items-center">
                  <main className="w-[375px] sm:w-auto md:w-[390px] lg:w-[590px] xl:w-[890px] 2xl:w-[1024px] h-[607px] overflow-auto">
                    <section className="">
                      <div className=" w-full">
                        <h3 className="text-start text-[20px]">Datos Personales</h3>{" "}
                        <hr className="border-t border-gray-300 my-3" />
                      </div>
                      <div className="my-3 flex flex-col lg:flex-row  gap-4 ">
                        <div className=" relative w-[200px]  2xl:w-[500px]   flex flex-col justify-center items-start">
                          <label className="form-title-md"> Nombres</label>
                          <p className="px-2 h-[35px] w-[200px] 2xl:w-[500px] text-start flex items-center ">
                            {userInfo?.name ? userInfo?.name : "-"}
                          </p>
                        </div>
                        <div className=" relative  w-[200px] 2xl:w-[500px]  flex flex-col justify-start items-start">
                          <label className="form-title-md"> Apellidos</label>
                          <p className="px-2 h-[35px] w-[200px] 2xl:w-[500px] text-start flex items-center ">
                            {userInfo?.lastName ? userInfo?.lastName : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="my-3 flex flex-col xl:flex-row  items-start justify-start gap-4 ">
                        <div className="flex flex-col lg:flex-row  items-start justify-start gap-4 ">
                          <div className=" relative  w-[200px] min-w-[200px] flex flex-col justify-start items-start">
                            <label className="form-title-md"> Documento</label>
                            <p className="px-2 h-[35px] w-[200px] text-start flex items-center ">
                              {userInfo?.document ? userInfo?.document : "-"}
                            </p>
                          </div>
                          <div className=" relative   flex flex-col justify-start items-start">
                            <label className="form-title-md"> Correo Electronico</label>
                            <p className="px-2 h-[35px] w-[250px] 2xl:w-[287px] text-start flex items-center ">
                              {userInfo?.email ? userInfo?.email : "-"}
                            </p>
                          </div>
                        </div>
                        <div className=" relative   flex flex-col justify-start items-start">
                          <label className="form-title-md"> Sexo</label>
                          <p className="px-2 h-[35px] w-[100px] text-start flex items-center ">
                            {userInfo?.sex ? (userInfo.sex === "F" ? "Femenino" : "Masculino") : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="my-3 flex flex-col xl:flex-row  items-start justify-start gap-4 ">
                        <div className="flex flex-col lg:flex-row  items-start justify-start gap-4 ">
                          <div className=" relative  w-[200px] min-w-[200px] flex flex-col justify-start items-start">
                            <label className="form-title-md"> Celular</label>
                            <p className="px-2 h-[35px] w-[200px] text-start flex items-center ">
                              {userInfo?.cellphone ? userInfo?.cellphone : "-"}
                            </p>
                          </div>
                          <div className=" relative w-[250px] 2xl:w-[287px] flex flex-col justify-start items-start">
                            <label className="form-title-md"> Telefono fijo</label>
                            <p className="px-2 h-[35px] w-[250px] 2xl:w-[287px] text-start flex items-center ">
                              {userInfo?.phone ? userInfo?.phone : "-"}
                            </p>
                          </div>
                        </div>
                        <div className=" relative w-[200px]  flex flex-col justify-start items-start">
                          <label className="form-title-md">Fecha de Nacimiento</label>
                          <p className="px-2 h-[35px] w-[200px] text-start flex items-center ">
                            {userInfo?.birthDate ? dayjs(userInfo?.birthDate).format("DD/MM/YYYY") : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="my-3 flex flex-col lg:flex-row  items-start justify-start gap-4 ">
                        <div className=" relative w-[200px]  flex flex-col justify-start items-start">
                          <label className="form-title-md">Nivel de Estudio</label>
                          <p className="px-2 h-[35px] w-[200px] text-start flex items-center ">
                            {userInfo?.studyLevel ? userInfo?.studyLevel : "-"}
                          </p>
                        </div>
                        <div className=" relative  w-full flex flex-col justify-start items-start">
                          <label className="form-title-md"> Profesión</label>
                          <p className="px-2 h-[35px]  text-start flex items-center ">
                            {userInfo?.profession ? userInfo?.profession : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="my-3 flex flex-row  items-start justify-start gap-4 ">
                        <div className=" relative  w-full flex flex-col justify-start items-start">
                          <label className="form-title-md"> Domicilio</label>
                          <p className="px-2 h-[35px]  text-start flex items-center ">
                            {userInfo?.privateAddress ? userInfo?.privateAddress : "-"}
                          </p>
                        </div>
                      </div>
                    </section>
                    <section>
                      <div className=" w-full">
                        <h3 className="text-start text-[20px]">Datos Laborales</h3>{" "}
                        <hr className="border-t border-gray-300 my-3" />
                      </div>
                      <div className="my-3 flex flex-col 2xl:flex-row gap-4 ">
                        <div className=" relative  w-[500px]   flex flex-col justify-start items-start">
                          <label className="form-title-md"> Ministerio</label>
                          <p className="px-2 h-[35px] w-[500px] text-start flex items-center ">
                            {userInfo?.secretariat ? userInfo?.secretariat.ministry?.name : "-"}
                          </p>
                        </div>
                        <div className=" relative  w-[500px]  flex flex-col justify-start items-start">
                          <label className="form-title-md"> Secretaria</label>
                          <p className="px-2 h-[35px] w-[500px] text-start flex items-center ">
                            {userInfo?.secretariat ? userInfo?.secretariat.name : "-"}
                          </p>
                        </div>
                      </div>
                      <div className="my-3 flex flex-col xl:flex-row gap-4 ">
                        <div className="flex flex-col lg:flex-row  items-start justify-start gap-4 ">
                          <div className=" relative w-[200px]   2xl:w-[395px]   flex flex-col justify-start items-start">
                            <label className="form-title-md"> Funcion</label>
                            <p className="px-2 h-[35px] 2xl:w-[395px] text-start flex items-center ">
                              {userInfo?.function ? userInfo?.function : "-"}
                            </p>
                          </div>
                          <div className=" relative w-[250px]   2xl:w-[395px]  flex flex-col justify-start items-start">
                            <label className="form-title-md"> Situacion</label>
                            <p className="px-2 h-[35px] 2xl:w-[395px] text-start flex items-center ">
                              {userInfo?.situation ? userInfo?.situation : "-"}
                            </p>
                          </div>
                        </div>
                        <div className=" relative 2xl:w-[200px]  flex flex-col justify-start items-start">
                          <label className="form-title-md">Fecha de Ingreso</label>
                          <p className="px-2 h-[35px] 2xl:w-[200px] text-start flex items-center ">
                            {userInfo?.incomeDate ? dayjs(userInfo?.incomeDate).format("DD/MM/YYYY") : "-"}
                          </p>
                        </div>
                      </div>
                    </section>
                  </main>
                  <div className="flex flex-col justify-center items-center gap-3 md:flex-row md:justify-between md:items-end md:w-full mt-6">
                    <button
                      className="block md:hidden lg:block rounded-md bg-blue-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-none active:bg-blue-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                      id="employeeAbsences"
                      onClick={() => setIsEmployeeAbsences(true)}
                    >
                      Fechas de Ausencias
                    </button>
                    <div>
                      <button
                        className="rounded-md bg-red-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-700 focus:shadow-none active:bg-red-700 hover:bg-red-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                        type="button"
                        onClick={handleModal}
                      >
                        Cerrar
                      </button>
                      <button
                        className="rounded-md bg-blue-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-none active:bg-blue-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                        id="createEmployee"
                        onClick={() => setIsEditing(true)}
                      >
                        Editar Empleado
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default DetailsUser;
