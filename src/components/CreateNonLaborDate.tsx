import React, { useState } from "react";
import { INonLaborDate } from "../helpers/types";
import { cleanObject } from "../utils/format";
import axios from "axios";
import { toast } from "sonner";

const BACK_API_URL = import.meta.env.VITE_LOCAL_API_URL;

interface Props {
  onCloseModal?: () => void;
  nonLaborDate?: INonLaborDate | null;
  setIsEditing?: (isEditing: boolean) => void;

  onUpdate?: (nonLaborDate: INonLaborDate) => void;
}

const CreateNonLaborDate: React.FC<Props> = ({ onCloseModal, nonLaborDate, onUpdate }) => {
  console.log("nonLaborDate", nonLaborDate);
  const selectType = [
    { type: "FERIADO_FIJO", name: "Feriado Fijo" },
    { type: "FERIADO_MOVIL", name: "Feriado Movil" },
    { type: "VACACIONES_GENERAL", name: "Vacaciones Generales" },
    { type: "CIERRE_ANUAL", name: "Cierre Anual" },
  ];

  const initialState = {
    type: nonLaborDate?.type || selectType[0].type, // Valor predeterminado"",
    description: nonLaborDate?.description || "",
    startDate: nonLaborDate?.startDate || "",
    endDate: nonLaborDate?.endDate || "",
    isOptional: nonLaborDate?.is_optional || "",
    year: nonLaborDate?.year || "",
  };
  const [nonDateLaborDataInputs, setNonDateLaborDataInputs] = useState(initialState);

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, name } = e.target;

    setNonDateLaborDataInputs({
      ...nonDateLaborDataInputs,
      [name]: value,
    });

    // setErrors(validateInputLoginU({ ...userDataInputs, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("nonDateLaborDataInputs", nonDateLaborDataInputs);
    const data = cleanObject(nonDateLaborDataInputs as Record<string, unknown>);
    console.log("data", data);

    if (nonLaborDate) {
      axios
        .put(`${BACK_API_URL}/non-working-day/${nonLaborDate.id}`, data, { withCredentials: true })
        .then(({ data }) => {
          console.log("data", data);
          toast.success("Fecha actualizada exitosamente");
          if (data && data.data && onUpdate) {
            onUpdate(data.data);
          }
          onCloseModal?.();
        })
        .catch((error) => {
          console.error(error.response.data.message);
          toast.error(error.response.data.message);
        });
    } else {
      axios
        .post(`${BACK_API_URL}/non-working-day`, data, { withCredentials: true })
        .then(({ data }) => {
          console.log("data", data);
          toast.success("Fecha creada exitosamente");
          if (data && data.data && onUpdate) {
            onUpdate(data.data);
          }
          onCloseModal?.();
        })
        .catch((error) => {
          console.error(error.response.data.message);
          toast.error(error.response.data.message);
        });
    }
  };
  return (
    <div className="w-[900px] h-100">
      <h2 className="mt-4 text-center font-[500] text-[30px]">
        {nonLaborDate ? "Editar Fecha" : "Crear Nueva Fecha No Laboral"}
      </h2>
      <div className="flex flex-col justify-center items-center">
        <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
          <main className="w-[800px] h-[270px] ">
            <section>
              <div className="w-full">
                <hr className="border-t border-gray-300 my-3" />
              </div>
              <div className="my-3 h-[120px] flex flex-col xl:flex-row xl:h-auto gap-4">
                <div className="relative w-[250px] flex flex-col justify-start items-start">
                  <label className="form-title-md" htmlFor="type">
                    Tipo
                  </label>
                  <select
                    id="type"
                    name="type"
                    onChange={handleChange}
                    value={nonDateLaborDataInputs.type}
                    className="w-[200px] outline-none bg-gray-50 border-[#E2E8F0] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-[7.5px]"
                  >
                    {selectType.map((item) => (
                      <option value={item.type} key={item.type}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div className=" relative  w-[150px]  flex flex-col justify-start items-start">
                  <label className="form-title-md"> Fecha de inicio</label>
                  <input
                    // id={name}
                    type="date"
                    name="startDate"
                    value={nonDateLaborDataInputs.startDate}
                    className={` px-2 h-[35px]  text-black py-2.5  w-[150px]  input-form-create`}
                    placeholder=" "
                    onChange={handleChange}
                  />
                </div>
                <div className=" relative w-[170px]  flex flex-col justify-start items-start">
                  <label className="form-title-md "> Fecha de finalización</label>
                  <input
                    // id={name}
                    type="date"
                    name="endDate"
                    value={nonDateLaborDataInputs.endDate}
                    className={` px-2 h-[35px]  text-black py-2.5  w-[150px]  input-form-create`}
                    placeholder=" "
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="my-3 h-[120px] flex flex-col xl:flex-row xl:h-auto gap-4">
                <div className=" relative  w-[500px]   flex flex-col justify-start items-start">
                  <label className="form-title-md"> Descripción</label>

                  <textarea
                    name="description"
                    value={nonDateLaborDataInputs.description}
                    onChange={handleChange}
                    className="w-[500px] h-[100px] p-1 mt-1 input-form-create resize-none outline-none"
                    readOnly={false}
                  />
                </div>
              </div>
            </section>
          </main>
          <div className="flex justify-end items-end w-full mt-6">
            <button
              className="rounded-md bg-red-600 py-2 px-4 border text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-700 active:bg-red-700 ml-2"
              type="button"
              onClick={onCloseModal}
            >
              Cancelar
            </button>
            <button
              className="rounded-md bg-green-600 py-2 px-4 border text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 active:bg-green-700 ml-2"
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

export default CreateNonLaborDate;
