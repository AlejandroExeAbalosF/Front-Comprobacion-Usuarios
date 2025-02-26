import dayjs from "dayjs";
import { IRegistration } from "../helpers/types";
import { useState } from "react";

interface IEditRegister {
  register?: IRegistration | null;
  onCloseModal?: (isVisible: boolean) => void;
}

const EditRegister: React.FC<IEditRegister> = ({ register, onCloseModal }) => {
  const initialState = {
    type: register?.type,
    justification: register?.justification,
  };

  const [registerData, setRegisterData] = useState(initialState);
  const handleModal = () => {
    // console.log(isVisible);
    if (onCloseModal) onCloseModal(false);
  };

  const handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
  };
  return (
    <div className="w-[1000px] h-200 ">
      <h2 className="mt-4  text-center font-[500] text-[30px]">
        Editar Registro {register ? dayjs(register.entryDate).format("DD/MM/YYYY") : "a"}
      </h2>
      <div className="flex flex-col justify-center items-center">
        <form onSubmit={handleSubmit} className=" flex  flex-col justify-center items-center ">
          <main className="w-[900px]">
            <section className="w-full h-full">
              <div className=" w-full">
                <h3 className="text-start text-[20px]">Estado y Justificacion</h3>{" "}
                <hr className="border-t border-gray-300 my-3" />
              </div>
              <div className="my-3 h-[120px] flex flex-col xl:flex-row xl:h-auto gap-4 ">
                <div className=" relative  w-[500px]   flex flex-col justify-start items-start">
                  <label className="form-title-md" htmlFor="">
                    {" "}
                    Tipo de Estado
                  </label>
                  <select
                    id="countries"
                    name="studyLevel"
                    // onChange={handleChange}
                    // value={userDataInputs.studyLevel}
                    className="w-[200px] bg-gray-50  border-[#E2E8F0] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-[7.5px]  dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                    // className="w-[200px] p-[7.5px]  input-form-create"
                  >
                    <option value="Primario">Presente</option>
                    <option value="Secundario">Ausente</option>
                    <option value="Terciario">Llegada Tarde</option>
                    <option value="Universitario">Universitario</option>
                  </select>
                </div>
                <div className=" relative  w-[500px]  flex flex-col justify-start items-start">
                  <label className="form-title-md" htmlFor="">
                    {" "}
                    Apellidos
                  </label>
                  <input
                    // id={name}
                    type="text"
                    name="lastName"
                    // value={userDataInputs.lastName}
                    className={` block px-2 h-[35px]  text-black py-2.5  w-[500px] input-form-create`}
                    placeholder=" "
                    // onChange={handleChange}
                  />
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
              Cancelar
            </button>
            <button
              className="  rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
              type="submit"
            >
              Guardar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditRegister;
