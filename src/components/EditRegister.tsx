import dayjs from "dayjs";
import { IArticulo, IRegistration } from "../helpers/types";
import { useEffect, useState } from "react";
import axios from "axios";
import { cleanObject } from "../utils/format";
import { toast } from "sonner";

const BACK_API_URL = import.meta.env.VITE_LOCAL_API_URL;

interface IEditRegister {
  register?: IRegistration | null;
  onCloseModal?: (isVisible: boolean) => void;

  onUpdate?: (register: IRegistration) => void;
}

const EditRegister: React.FC<IEditRegister> = ({ register, onCloseModal, onUpdate }) => {
  const [art = "", inc = "", subInc = ""] = register?.articulo?.split("-") || ["", "", ""];
  const initialState = {
    status: register?.status || "",
    type: register?.type || "",
    // justification: register?.justification || "",
    entryHour:
      register?.status === "AUSENTE" || register?.status === "NO_LABORABLE" ? "" : dayjs(register?.entryDate).format("HH:mm"),
    exitHour: register?.exitDate ? dayjs(register?.exitDate).format("HH:mm") : "",
    description: register?.description || "",
    articulo: register?.status === "AUSENTE" && register?.type === "ARTICULO" ? art || "" : "",
    inciso: register?.status === "AUSENTE" && register?.type === "ARTICULO" ? inc || "" : "",
    subInciso: register?.status === "AUSENTE" && register?.type === "ARTICULO" ? subInc || "" : "",
  };

  const initialTypePresente = [
    { type: "", name: "N/A" },
    { type: "LLEGADA_TARDE", name: "Llegada Tarde" },
    { type: "SALIDA_TEMPRANA", name: "Salida Temprana" },
    { type: "LLEGADA_TARDE-SALIDA_TEMPRANA", name: "Llegada Tarde - Salida Temprana" },
  ];

  const initialTypeAusente = [
    { type: "ARTICULO", name: "Articulo" },
    { type: "OTRO", name: "Otro" },
  ];

  const initialTypeNoLaborable = [
    { type: "FERIADO", name: "Feriado" },
    { type: "VACACIONES", name: "Vacaciones" },
  ];

  const [registerData, setRegisterData] = useState(initialState);
  const [typeJustification, setTypeJustification] = useState(initialTypePresente);
  const [articulos, setArticulos] = useState<IArticulo[]>([]);
  const [incisos, setIncisos] = useState([]);
  const [subIncisos, setSubIncisos] = useState([]);

  const [selectedArticulo, setSelectedArticulo] = useState(null);
  const [selectedInciso, setSelectedInciso] = useState(null);

  useEffect(() => {
    const info = async () => {
      await axios
        .get(`${BACK_API_URL}/articulos`, { withCredentials: true })
        .then(({ data }) => {
          setArticulos(data);
        })
        .catch((error) => {
          console.error(error);
        });
    };
    info();
  }, []);

  useEffect(() => {
    if (registerData.status === "AUSENTE") {
      setTypeJustification(initialTypeAusente);
      setRegisterData((prev) => ({ ...prev, type: initialTypeAusente[0]?.type || "" }));
    } else if (registerData.status === "PRESENTE") {
      setTypeJustification(initialTypePresente);
      setRegisterData((prev) => ({ ...prev, type: initialTypePresente[0]?.type || "" }));
    } else if (registerData.status === "NO_LABORABLE") {
      setTypeJustification(initialTypeNoLaborable);
      setRegisterData((prev) => ({ ...prev, type: initialTypeNoLaborable[0]?.type || "" }));
    }
  }, [registerData.status]);

  useEffect(() => {
    if (register) {
      // Determinar qué lista de justificaciones usar según el estado de register
      const newTypeJustification =
        register.status === "AUSENTE"
          ? initialTypeAusente
          : register.status === "PRESENTE"
            ? initialTypePresente
            : initialTypeNoLaborable;
      setTypeJustification(newTypeJustification);

      // Establecer los valores iniciales en registerData
      setRegisterData({
        status: register.status,
        type:
          register.type && newTypeJustification.some((item) => item.type === register.type)
            ? register.type
            : newTypeJustification[0]?.type || "", // Si no es válido, toma el primer valor disponible
        // justification: register?.justification || "",
        entryHour: register.status === "AUSENTE" ? "" : dayjs(register.entryDate).format("HH:mm"),
        exitHour: register.exitDate ? dayjs(register.exitDate).format("HH:mm") : "",
        description: register.description || "",
        articulo: register.status === "AUSENTE" && register.type === "ARTICULO" ? art || "" : "",
        inciso: register.status === "AUSENTE" && register.type === "ARTICULO" ? inc || "" : "",
        subInciso: register.status === "AUSENTE" && register.type === "ARTICULO" ? subInc || "" : "",
      });

      if (register.status === "AUSENTE" && register.type === "ARTICULO") {
        setSelectedArticulo(art);
        setSelectedInciso(inc);
      }
      // const articulo = articulos.find((a) => a.id === register.articuloId);
      // if (articulo) {
      //   setSelectedArticulo(articulo);
      //   const inciso = articulo.incisos.find((i) => i.id === register.incisoId);
      //   if (inciso) {
      //     setSelectedInciso(inciso);
      //     const subInciso = inciso.subIncisos.find((s) => s.id === register.subIncisoId);
      //     if (subInciso) {
      //       setSelectedSubInciso(subInciso);
      //     }
      //   }
      // }
    }
  }, []); // Solo se ejecuta al montar el componente

  const handleArticuloChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    if (name === "articulo") {
      const selectArticulo = articulos.find((a) => a.name === value);
      if (selectArticulo?.incisos && selectArticulo?.incisos.length > 0) {
        // console.log("articulo", selectArticulo?.incisos);
        setSelectedArticulo(value);
      } else {
        setSelectedArticulo(null);
      }
      // setSelectedArticulo(value);
      setRegisterData((prev) => ({
        ...prev,
        articulo: selectArticulo?.name || "",
        description: selectArticulo?.description || "",
        inciso: "",
        subInciso: "",
      }));
      setSelectedInciso(null); // Reiniciar inciso cuando cambia el artículo
    } else {
      const articuloId = e.target.value;
      setSelectedArticulo(articuloId);
      setRegisterData({ ...registerData, [e.target.name]: e.target.value });
      setSelectedInciso(null); // Reiniciar inciso cuando cambia el artículo
    }
  };

  const handleIncisoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    if (name === "inciso") {
      // console.log("inciso", e.target.value);

      const selectInciso = articulos.find((a) => a.name === selectedArticulo)?.incisos.find((i) => i.name === value);
      console.log("inciso", selectInciso);
      if (selectInciso?.subIncisos && selectInciso?.subIncisos.length > 0) {
        console.log("inciso", selectInciso);
        setSelectedInciso(value);
      } else {
        setSelectedInciso(null);
      }
      // setSelectedInciso(value);
      setRegisterData((prev) => ({
        ...prev,
        inciso: selectInciso?.name || "",
        description: selectInciso?.description || "",
        subInciso: "",
      }));
    } else {
      setSelectedInciso(e.target.value);
      setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    }
  };

  const handleSubIncisoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const { value, name } = e.target;
    if (name === "subInciso") {
      // console.log("subInciso", e.target.value);
      const selectSubInciso = articulos
        .find((a) => a.name === selectedArticulo)
        ?.incisos.find((i) => i.name === selectedInciso)
        ?.subIncisos.find((s) => s.name === value);
      console.log("subInciso", selectSubInciso);
      // setSelectedSubInciso(value);
      setRegisterData((prev) => ({
        ...prev,
        subInciso: selectSubInciso?.name || "",
        description: selectSubInciso?.description || "",
      }));
    } else {
      // setSelectedSubInciso(e.target.value);
      setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement | HTMLTextAreaElement>) => {
    const { value, name } = e.target;
    if (name === "status") {
      console.log("status", e.target.value);
      setSelectedArticulo(art);
      setSelectedInciso(inc);
      setRegisterData((prev) => ({
        ...prev,
        status: value,
        entryHour:
          value === "AUSENTE" || value === "NO_LABORABLE"
            ? ""
            : register?.status === "AUSENTE" || register?.status === "NO_LABORABLE"
              ? ""
              : dayjs(register?.entryDate).format("HH:mm"),
        exitHour:
          value === "AUSENTE" || value === "NO_LABORABLE"
            ? ""
            : register?.exitDate
              ? dayjs(register?.exitDate).format("HH:mm")
              : "",
        description:
          value === "PRESENTE"
            ? ""
            : value === "NO_LABORABLE" && register?.status === "NO_LABORABLE"
              ? register?.description || ""
              : value === "AUSENTE" && register?.status === "AUSENTE"
                ? register?.description || ""
                : "",
        articulo:
          value === "PRESENTE" || value === "NO_LABORABLE"
            ? ""
            : register?.status === "AUSENTE" && register?.type === "ARTICULO"
              ? art || ""
              : "",
        inciso:
          value === "PRESENTE" || value === "NO_LABORABLE"
            ? ""
            : register?.status === "AUSENTE" && register?.type === "ARTICULO"
              ? inc || ""
              : "",
        subInciso:
          value === "PRESENTE" || value === "NO_LABORABLE"
            ? ""
            : register?.status === "AUSENTE" && register?.type === "ARTICULO"
              ? subInc || ""
              : "",
      }));
    } else {
      setRegisterData({ ...registerData, [e.target.name]: e.target.value });
    }
  };

  const handleModal = () => {
    if (onCloseModal) onCloseModal(false);
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // console.log(registerData);
    const data = cleanObject(registerData as Record<string, unknown>);
    // console.log("data", data);

    if (data.status === "AUSENTE") {
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
    // const dataToSend = cleanObject(data as Record<string, unknown>);
    console.log("data", data);
    axios
      .put(`${BACK_API_URL}/registrations/update/${register?.id}`, data, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      })
      .then(({ data }) => {
        console.log("data actualizada", data);
        toast.success("Registro actualizado exitosamente");
        if (data.register) onUpdate(data.register);
        if (onCloseModal) onCloseModal(false);
      })
      .catch((error) => {
        console.error("Error al actualizar el registro:", error.response.data.message);
      });
  };
  const p =articulos
  .find((art) => art.name === selectedArticulo)
  ?.incisos
  console.log("p", p);
  return (
    <div className="w-[1000px] h-200">
      <h2 className="mt-4 text-center font-[500] text-[30px]">
        Editar Registro {register ? dayjs(register.entryDate).format("DD/MM/YYYY") : "a"}
      </h2>
      <div className="flex flex-col justify-center items-center">
        <form onSubmit={handleSubmit} className="flex flex-col justify-center items-center">
          <main className="w-[900px] h-[650px] ">
            <section>
              <div className="w-full">
                <h3 className="text-start text-[20px]">Estado y Justificación</h3>
                <hr className="border-t border-gray-300 my-3" />
              </div>
              <div className="my-3 h-[120px] flex flex-col xl:flex-row xl:h-auto gap-4">
                <div className="relative w-[500px] flex flex-col justify-start items-start">
                  <label className="form-title-md" htmlFor="status">
                    Estado
                  </label>
                  <select
                    id="status"
                    name="status"
                    onChange={handleChange}
                    value={registerData.status}
                    className="w-[200px] outline-none bg-gray-50 border-[#E2E8F0] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-[7.5px]"
                  >
                    <option value="PRESENTE">Presente</option>
                    <option value="AUSENTE">Ausente</option>
                    <option value="NO_LABORABLE">Día no laborable</option>
                  </select>
                </div>
                <div className="relative w-[500px] flex flex-col justify-start items-start">
                  <label className="form-title-md" htmlFor="type">
                    Tipo de Justificación
                  </label>
                  <select
                    id="type"
                    name="type"
                    onChange={handleChange}
                    value={registerData.type}
                    className="w-[250px] outline-none bg-gray-50 border-[#E2E8F0] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-[7.5px]"
                  >
                    {typeJustification.map((item) => (
                      <option value={item.type} key={item.type}>
                        {item.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </section>
            <section>
              <div className="w-full">
                <h3 className="text-start text-[20px]">Detalles y Descripcion</h3>
                <hr className="border-t border-gray-300 my-3" />
              </div>
              {registerData.status === "PRESENTE" && (
                <div className="my-3 h-[120px] flex flex-col xl:flex-row xl:h-auto gap-4">
                  <div className=" relative  w-[150px]  flex flex-col justify-start items-start">
                    <label className="form-title-md"> Hora de Entrada</label>
                    <input
                      // id={name}
                      type="time"
                      name="entryHour"
                      value={registerData.entryHour}
                      className={` px-2 h-[35px]  text-black py-2.5  w-[150px]  input-form-create`}
                      placeholder=" "
                      onChange={handleChange}
                    />
                  </div>
                  <div className=" relative  w-[150px]  flex flex-col justify-start items-start">
                    <label className="form-title-md"> Hora de Salida</label>
                    <input
                      // id={name}
                      type="time"
                      name="exitHour"
                      value={registerData.exitHour}
                      className={` px-2 h-[35px]  text-black py-2.5  w-[150px]  input-form-create`}
                      placeholder=" "
                      onChange={handleChange}
                    />
                  </div>
                </div>
              )}
              {registerData.status === "NO_LABORABLE" && (
                <div className="my-3 h-[120px] flex flex-col xl:flex-row xl:h-auto gap-4">
                  <div className=" relative  w-[350px]   flex flex-col justify-start items-start">
                    <label className="form-title-md"> Descripción</label>
                    {/* <input
                      // id={name}
                      type=""
                      name="description"
                      value={registerData.description}
                      className={` px-2 h-[35px]  text-black py-2.5  w-[150px]  input-form-create`}
                      placeholder=" "
                      onChange={handleChange}
                    /> */}
                    <textarea
                      name="description"
                      value={registerData.description}
                      onChange={handleChange}
                      className="w-[800px] h-[100px] p-1 mt-1 input-form-create resize-none outline-none"
                      readOnly={false}
                    />
                  </div>
                </div>
              )}
              {registerData.status === "AUSENTE" && (
                <div>
                  <div className="my-3  grid grid-cols-3 grid-rows-1 gap-4">
                    {/* Select de Artículos */}
                    <div className="  flex flex-col justify-start items-start">
                      <label htmlFor="articulo" className="form-title-md">
                        Artículo
                      </label>
                      <select
                        id="articulo"
                        name="articulo"
                        value={registerData.articulo}
                        onChange={handleArticuloChange}
                        className="w-[200px] outline-none bg-gray-50 border-[#E2E8F0] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-[7.5px]"
                      >
                        <option value="">Seleccione un Artículo</option>
                        {articulos.map((articulo) => (
                          <option key={articulo.id} value={articulo.name}>
                            {articulo.name}
                          </option>
                        ))}
                      </select>
                    </div>

                    {/* Select de Incisos (Depende del Artículo seleccionado) */}
                    {selectedArticulo && (
                      <>
                        <div className="flex flex-col justify-start items-start">
                          <label htmlFor="inciso" className="form-title-md">
                            Inciso
                          </label>
                          <select
                            id="inciso"
                            name="inciso"
                            value={registerData.inciso}
                            onChange={handleIncisoChange}
                            className="w-[200px] outline-none bg-gray-50 border-[#E2E8F0] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-[7.5px]"
                          >
                            <option value="">Seleccione un Inciso</option>
                            {articulos
                              .find((art) => art.name === selectedArticulo)
                              ?.incisos.map((inciso) => (
                                <option key={inciso.id} value={inciso.name}>
                                  {inciso.name } 
                                </option>
                              ))}
                          </select>
                        </div>
                      </>
                    )}

                    {/* Select de SubIncisos (Depende del Inciso seleccionado) */}
                    {selectedInciso && (
                      <>
                        <div className=" flex flex-col justify-start items-start">
                          <label htmlFor="subinciso" className="form-title-md">
                            SubInciso
                          </label>
                          <select
                            id="subinciso"
                            name="subInciso"
                            value={registerData.subInciso}
                            onChange={handleSubIncisoChange}
                            className="w-[200px] outline-none bg-gray-50 border-[#E2E8F0] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-[7.5px]"
                          >
                            <option value="">Seleccione un SubInciso</option>
                            {articulos
                              .find((art) => art.name === selectedArticulo)?.incisos.find((inc) =>
                                selectedArticulo + inc.name === selectedArticulo + selectedInciso
                              )?.subIncisos.map((subinciso) => (
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
                        value={registerData.description}
                        onChange={handleChange}
                        className="w-[800px] h-[100px] p-1 mt-1 input-form-create resize-none outline-none"
                        readOnly={false}
                      />
                    </div>
                  </div>
                </div>
              )}
            </section>
          </main>
          <div className="flex justify-end items-end w-full mt-6">
            <button
              className="rounded-md bg-red-600 py-2 px-4 border text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-red-700 active:bg-red-700 ml-2"
              type="button"
              onClick={handleModal}
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

export default EditRegister;
