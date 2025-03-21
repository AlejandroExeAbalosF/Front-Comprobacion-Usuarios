import React, { useEffect, useState } from "react";
import { IArticulo, IEmployeeAbsence, INonLaborDate } from "../helpers/types";
import { cleanObject } from "../utils/format";
import axios from "axios";
import { toast } from "sonner";

const BACK_API_URL = import.meta.env.VITE_LOCAL_API_URL;

interface Props {
  onCloseModal?: () => void;
  employeeAbsence?: IEmployeeAbsence | null;
  userId?: string | null;
  setIsEditing?: (isEditing: boolean) => void;

  onUpdate?: (employeeAbsence: INonLaborDate) => void;
}

const CreateEmployeeAbsence: React.FC<Props> = ({ onCloseModal, employeeAbsence, userId, onUpdate }) => {
  // console.log("userId", userId);
  const [art = "", inc = "", subInc = ""] = employeeAbsence?.articulo?.split("-") || ["", "", ""];
  console.log("art", art, inc, subInc);
  const initialTypeAusente = [
    { type: "ARTICULO", name: "Articulo" },
    { type: "OTRO", name: "Otro" },
  ];

  const initialState = {
    type: employeeAbsence?.type || initialTypeAusente[0].type, // Valor predeterminado"",
    description: employeeAbsence?.description || "",
    startDate: employeeAbsence?.startDate || "",
    endDate: employeeAbsence?.endDate || "",
    isOptional: employeeAbsence?.is_optional || "",
    articulo: employeeAbsence?.type === "ARTICULO" ? art || "" : "",
    inciso: employeeAbsence?.type === "ARTICULO" ? inc || "" : "",
    subInciso: employeeAbsence?.type === "ARTICULO" ? subInc || "" : "",
  };
  const [employeeAbsenceDataInputs, setEmployeeAbsenceDataInputs] = useState(initialState);
  // const [articulos, setArticulos] = useState<IArticulo[]>([]);
  const [articulosType, setArticulosType] = useState<IArticulo[]>([]);
  const [selectedArticulo, setSelectedArticulo] = useState<string | null>(null);
  const [selectedInciso, setSelectedInciso] = useState<string | null>(null);

  useEffect(() => {
    const info = async () => {
      await axios
        .get(`${BACK_API_URL}/articulos`, { withCredentials: true })
        .then(({ data }) => {
          // setArticulos(data);
          setArticulosType(data.filter((art: IArticulo) => art.statusType === "AUSENTE"));
        })
        .catch((error) => {
          console.error(error);
        });
    };
    info();
  }, []);

  const handleArticuloChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    if (name === "articulo") {
      const selectArt = articulosType.find((a) => a.name === value);
      if (selectArt?.incisos && selectArt?.incisos.length > 0) {
        // console.log("articulo", selectArticulo?.incisos);
        setSelectedArticulo(value);
      } else {
        setSelectedArticulo(null);
      }
      // setSelectedArticulo(value);
      setEmployeeAbsenceDataInputs((prev) => ({
        ...prev,
        articulo: selectArt?.name || "",
        description: selectArt?.description || "",
        inciso: "",
        subInciso: "",
      }));
      setSelectedInciso(null); // Reiniciar inciso cuando cambia el artículo
    } else {
      const articuloId = e.target.value;
      setSelectedArticulo(articuloId);
      setEmployeeAbsenceDataInputs({ ...employeeAbsenceDataInputs, [e.target.name]: e.target.value });
      setSelectedInciso(null); // Reiniciar inciso cuando cambia el artículo
    }
  };

  const handleIncisoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    if (name === "inciso") {
      // console.log("inciso", e.target.value);

      const selectInciso = articulosType.find((a) => a.name === selectedArticulo)?.incisos?.find((i) => i.name === value);
      console.log("inciso", selectInciso);
      if (selectInciso?.subIncisos && selectInciso?.subIncisos.length > 0) {
        console.log("inciso", selectInciso);
        setSelectedInciso(value);
      } else {
        setSelectedInciso(null);
      }
      // setSelectedInciso(value);
      setEmployeeAbsenceDataInputs((prev) => ({
        ...prev,
        inciso: selectInciso?.name || "",
        description: selectInciso?.description || "",
        subInciso: "",
      }));
    } else {
      setSelectedInciso(e.target.value);
      setEmployeeAbsenceDataInputs({ ...employeeAbsenceDataInputs, [e.target.name]: e.target.value });
    }
  };

  const handleSubIncisoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    if (name === "subInciso") {
      // console.log("subInciso", e.target.value);
      const selectSubInciso = articulosType
        .find((a) => a.name === selectedArticulo)
        ?.incisos?.find((i) => i.name === selectedInciso)
        ?.subIncisos?.find((s) => s.name === value);
      // console.log("subInciso", selectSubInciso);
      // setSelectedSubInciso(value);
      setEmployeeAbsenceDataInputs((prev) => ({
        ...prev,
        subInciso: selectSubInciso?.name || "",
        description: selectSubInciso?.description || "",
      }));
    } else {
      // setSelectedSubInciso(e.target.value);
      setEmployeeAbsenceDataInputs({ ...employeeAbsenceDataInputs, [e.target.name]: e.target.value });
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, name } = e.target;

    setEmployeeAbsenceDataInputs({
      ...employeeAbsenceDataInputs,
      [name]: value,
    });

    // setErrors(validateInputLoginU({ ...userDataInputs, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log("nemployeeAbsenceDataInputs", employeeAbsenceDataInputs);
    const data = cleanObject(employeeAbsenceDataInputs as Record<string, unknown>);
    console.log("data", data);
    if (data.type === "ARTICULO") {
      const articulo = data.articulo ? data.articulo : "";
      const inciso = data.inciso ? "-" + data.inciso : "";
      const subInciso = data.subInciso ? "-" + data.subInciso : "";
      if (articulo) {
        data.articulo = articulo + inciso + subInciso;
      } else {
        delete data.articulo;
      }

      delete data.inciso;
      delete data.subInciso;
    }
    console.log("data", data);
    if (employeeAbsence) {
      // axios
      //   .put(`${BACK_API_URL}/non-working-day/${EmployeeAbsence.id}`, data, { withCredentials: true })
      //   .then(({ data }) => {
      //     console.log("data", data);
      //     toast.success("Fecha actualizada exitosamente");
      //     if (data.data) onUpdate(data.data);
      //     onCloseModal?.();
      //   })
      //   .catch((error) => {
      //     console.error(error.response.data.message);
      //     toast.error(error.response.data.message);
      //   });
    } else {
      axios
        .post(`${BACK_API_URL}/employee-absences/user/${userId}`, data, { withCredentials: true })
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
    <div className="w-[400px] sm:w-[500px] md:w-[600px]  2xl:w-[900px] h-[54vh] overflow-auto">
      <h2 className="mt-4 text-center font-[500] text-[30px]">
        {employeeAbsence ? "Editar Fecha" : "Crear Nueva Fecha No Laboral"}
      </h2>
      <div className="flex flex-col justify-center items-center">
        <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
          <main className="w-[300px] sm:w-[400px]  md:w-[500px] xl:w-[800px] h-[340px] ">
            <section>
              <div className="w-full">
                <hr className="border-t border-gray-300 my-3" />
              </div>
              <div className="my-3 h-[120px] flex flex-col xl:flex-row xl:h-auto gap-4">
                <div className="relative w-[200px] flex flex-col justify-start items-start">
                  <label className="form-title-md" htmlFor="type">
                    Tipo
                  </label>
                  <select
                    id="type"
                    name="type"
                    onChange={handleChange}
                    value={employeeAbsenceDataInputs.type}
                    className="w-[200px] outline-none bg-gray-50 border-[#E2E8F0] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-[7.5px]"
                  >
                    {initialTypeAusente.map((item) => (
                      <option value={item.type} key={item.type}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="flex flex-row justify-start items-start gap-4">
                  <div className=" relative  w-[150px]  flex flex-col justify-start items-start">
                    <label className="form-title-md"> Fecha de inicio</label>
                    <input
                      // id={name}
                      type="date"
                      name="startDate"
                      value={employeeAbsenceDataInputs.startDate}
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
                      value={employeeAbsenceDataInputs.endDate}
                      className={` px-2 h-[35px]  text-black py-2.5  w-[150px]  input-form-create`}
                      placeholder=" "
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </div>
              {employeeAbsenceDataInputs.type === "ARTICULO" && (
                <div className="">
                  <div className="my-2 w-[650px]  grid grid-cols-3 grid-rows-1 gap-1">
                    {/* Select de Artículos */}
                    <div className="w-[200px]  flex flex-col justify-start items-start">
                      <label htmlFor="articulo" className="form-title-md">
                        Artículo
                      </label>
                      <select
                        id="articulo"
                        name="articulo"
                        value={employeeAbsenceDataInputs.articulo}
                        onChange={handleArticuloChange}
                        className="w-[200px] outline-none bg-gray-50 border-[#E2E8F0] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-[7.5px]"
                      >
                        <option value="">Seleccione un Artículo</option>
                        {articulosType.map((articulo) => (
                          <option key={articulo.id} value={articulo.name}>
                            {articulo.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Select de Incisos (Depende del Artículo seleccionado) */}
                    {selectedArticulo && (
                      <>
                        {/* {`${console.log("cuerposelectedArticulo", selectedArticulo)}`} */}
                        <div className="w-[200px] flex flex-col justify-start items-start">
                          <label htmlFor="inciso" className="form-title-md">
                            Inciso
                          </label>
                          <select
                            id="inciso"
                            name="inciso"
                            value={employeeAbsenceDataInputs.inciso}
                            onChange={handleIncisoChange}
                            className="w-[200px] outline-none bg-gray-50 border-[#E2E8F0] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-[7.5px]"
                          >
                            <option value="">Seleccione un Inciso</option>
                            {articulosType
                              .find((art) => art.name === selectedArticulo)
                              ?.incisos?.map((inciso) => (
                                <option key={inciso.id} value={inciso.name}>
                                  {inciso.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </>
                    )}

                    {/* Select de SubIncisos (Depende del Inciso seleccionado) */}
                    {selectedInciso && (
                      <>
                        <div className="w-[200px] flex flex-col justify-start items-start">
                          <label htmlFor="subinciso" className="form-title-md">
                            SubInciso
                          </label>
                          <select
                            id="subinciso"
                            name="subInciso"
                            value={employeeAbsenceDataInputs.subInciso}
                            onChange={handleSubIncisoChange}
                            className="w-[200px] outline-none bg-gray-50 border-[#E2E8F0] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-[7.5px]"
                          >
                            <option value="">Seleccione un SubInciso</option>
                            {articulosType
                              .find((art) => art.name === selectedArticulo)
                              ?.incisos?.find((inc) => selectedArticulo + inc.name === selectedArticulo + selectedInciso)
                              ?.subIncisos?.map((subinciso) => (
                                <option key={subinciso.id} value={subinciso.name}>
                                  {subinciso.name}
                                </option>
                              ))}
                          </select>
                        </div>
                      </>
                    )}
                  </div>
                  <div className="my-3 h-[120px] flex flex-col xl:flex-row xl:h-auto gap-4">
                    <div className=" relative  w-[350px]   flex flex-col justify-start items-start">
                      <label className="form-title-md"> Descripción</label>

                      <textarea
                        name="description"
                        value={employeeAbsenceDataInputs.description}
                        onChange={handleChange}
                        className="w-[300px] sm:w-[400px]  md:w-[500px] xl:w-[800px] h-[100px] p-1 mt-1 input-form-create resize-none outline-none"
                        readOnly={false}
                      />
                    </div>
                  </div>
                </div>
              )}
              {/* <div className="my-3 h-[120px] flex flex-col xl:flex-row xl:h-auto gap-4">
                <div className=" relative  w-[500px]   flex flex-col justify-start items-start">
                  <label className="form-title-md"> Descripción</label>

                  <textarea
                    name="description"
                    value={employeeAbsenceDataInputs.description}
                    onChange={handleChange}
                    className="w-[500px] h-[100px] p-1 mt-1 input-form-create resize-none outline-none"
                    readOnly={false}
                  />
                </div>
              </div> */}
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

export default CreateEmployeeAbsence;
