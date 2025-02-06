import dayjs from "dayjs";
import { IUser } from "../helpers/types";
import { formatName } from "../utils/formatName";

const UserDetails: React.FC<{ userInfo?: IUser | null; onCloseModal?: (isVisible: boolean) => void }> = ({
  userInfo,
  onCloseModal,
}) => {
  const handleModal = () => {
    // console.log(isVisible);
    if (onCloseModal) {
      onCloseModal(false);
    }
  };
  return (
    <div className="w-[1500px] h-200">
      <h2 className="mt-4  text-center font-[500] text-[30px]">
        Detalles del Usuario : {userInfo && formatName(userInfo?.name, userInfo?.lastName)}{" "}
      </h2>
      <div className="flex flex-row w-auto p-6 ">
        <div className="w-[380px] h-[300px] flex flex-col justify-center items-center">
          <div className="flex justify-center items-center  mt-1 bg-[#fff8f2] w-[252px] h-[252px] rounded-[50%] shadow-md ">
            <img src={userInfo?.image} className=" w-[252px] h-[252px] rounded-[50%]" />
          </div>
        </div>
        <div className="w-[1024px] h-full flex flex-col  ">
          <form action="" className="flex  flex-col justify-center items-center">
            <main className="w-[1024px] ">
              <section className="">
                <div className=" w-full">
                  <h3 className="text-start text-[20px]">Datos Personales</h3> <hr className="border-t border-gray-300 my-3" />
                </div>
                <div className="my-3 flex flex-row gap-4 ">
                  <div className=" relative  w-[500px]   flex flex-col justify-center items-start">
                    <label className="form-title-md"> Nombres</label>
                    <p className="px-2 h-[35px] w-[500px] text-start flex items-center ">
                      {userInfo?.name ? userInfo?.name : "-"}
                    </p>
                  </div>
                  <div className=" relative  w-[500px]  flex flex-col justify-start items-start">
                    <label className="form-title-md"> Apellidos</label>
                    <p className="px-2 h-[35px] w-[500px] text-start flex items-center ">
                      {userInfo?.lastName ? userInfo?.lastName : "-"}
                    </p>
                  </div>
                </div>
                <div className="my-3 flex flex-row  items-start justify-start gap-4 ">
                  <div className=" relative  w-[200px] min-w-[200px] flex flex-col justify-start items-start">
                    <label className="form-title-md"> Documento</label>
                    <p className="px-2 h-[35px] w-[200px] text-start flex items-center ">
                      {userInfo?.document ? userInfo?.document : "-"}
                    </p>
                  </div>
                  <div className=" relative   flex flex-col justify-start items-start">
                    <label className="form-title-md"> Correo Electronico</label>
                    <p className="px-2 h-[35px] w-[500px] text-start flex items-center ">
                      {userInfo?.email ? userInfo?.email : "-"}
                    </p>
                  </div>
                  <div className=" relative   flex flex-col justify-start items-start">
                    <label className="form-title-md"> Sexo</label>
                    <p className="px-2 h-[35px] w-[500px] text-start flex items-center ">
                      {userInfo?.sex ? (userInfo.sex === "F" ? "Femenino" : "Masculino") : "-"}
                    </p>
                  </div>
                </div>
                <div className="my-3 flex flex-row  items-start justify-start gap-4 ">
                  <div className=" relative  w-[200px] min-w-[200px] flex flex-col justify-start items-start">
                    <label className="form-title-md"> Celular</label>
                    <p className="px-2 h-[35px] w-[200px] text-start flex items-center ">
                      {userInfo?.cellphone ? userInfo?.cellphone : "-"}
                    </p>
                  </div>
                  <div className=" relative w-[200px]  flex flex-col justify-start items-start">
                    <label className="form-title-md"> Telefono fijo</label>
                    <p className="px-2 h-[35px] w-[200px] text-start flex items-center ">
                      {userInfo?.phone ? userInfo?.phone : "-"}
                    </p>
                  </div>
                  <div className=" relative w-[200px]  flex flex-col justify-start items-start">
                    <label className="form-title-md">Fecha de Nacimiento</label>
                    <p className="px-2 h-[35px] w-[200px] text-start flex items-center ">
                      {userInfo?.birthDate ? dayjs(userInfo?.birthDate).format("DD/MM/YYYY") : "-"}
                    </p>
                  </div>
                </div>
                <div className="my-3 flex flex-row  items-start justify-start gap-4 ">
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
                  <h3 className="text-start text-[20px]">Datos Laborales</h3> <hr className="border-t border-gray-300 my-3" />
                </div>
                <div className="my-3 flex flex-row gap-4 ">
                  <div className=" relative  w-[500px]   flex flex-col justify-start items-start">
                    <label className="form-title-md"> Ministerio</label>
                    <p className="px-2 h-[35px] w-[500px] text-start flex items-center ">
                      {userInfo?.ministry ? userInfo?.ministry : "-"}
                    </p>
                  </div>
                  <div className=" relative  w-[500px]  flex flex-col justify-start items-start">
                    <label className="form-title-md"> Secretaria</label>
                    <p className="px-2 h-[35px] w-[500px] text-start flex items-center ">
                      {userInfo?.secretariat ? userInfo?.secretariat : "-"}
                    </p>
                  </div>
                </div>
                <div className="my-3 flex flex-row gap-4 ">
                  <div className=" relative  w-[395px]   flex flex-col justify-start items-start">
                    <label className="form-title-md"> Funcion</label>
                    <p className="px-2 h-[35px] w-[395px] text-start flex items-center ">
                      {userInfo?.function ? userInfo?.function : "-"}
                    </p>
                  </div>
                  <div className=" relative  w-[395px]  flex flex-col justify-start items-start">
                    <label className="form-title-md"> Situacion</label>
                    <p className="px-2 h-[35px] w-[395px] text-start flex items-center ">
                      {userInfo?.situation ? userInfo?.situation : "-"}
                    </p>
                  </div>
                  <div className=" relative w-[200px]  flex flex-col justify-start items-start">
                    <label className="form-title-md">Fecha de Ingreso</label>
                    <p className="px-2 h-[35px] w-[200px] text-start flex items-center ">
                      {userInfo?.incomeDate ? dayjs(userInfo?.incomeDate).format("DD/MM/YYYY") : "-"}
                    </p>
                  </div>
                </div>
              </section>
            </main>
            <div className="flex justify-end items-end w-full mt-6">
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
                // onClick={(e) => handleOpenModal(null, e)}
              >
                Editar Empleado
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UserDetails;
