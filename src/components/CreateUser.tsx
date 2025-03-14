import dayjs from "dayjs";
import { useEffect, useRef, useState } from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css"; // Importa los estilos predeterminados
import { ISecretariat, IShift, IUser } from "../helpers/types";
import axios from "axios";
import { useAppDispatch, useAppSelector } from "../redux/hooks";
import { addUser } from "../redux/slices/usersEmpSlice";
import { toast } from "sonner";
import { formatName, formatTime } from "../utils/format";
import { IoIosClose } from "react-icons/io";

const BACK_API_URL = import.meta.env.VITE_LOCAL_API_URL;

interface CreateUserProps {
  onCloseModal?: (isVisible: boolean) => void;
  userInfo?: IUser | null;
  setIsEditing?: (isEditing: boolean) => void;
}
const CreateUser: React.FC<CreateUserProps> = ({ onCloseModal, userInfo, setIsEditing }) => {
  const dispatch = useAppDispatch();
  // const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  // Calcular la fecha máxima permitida (hace 18 años desde hoy)
  const initialState = {
    name: userInfo?.name ? userInfo.name : "",
    lastName: userInfo?.lastName ? userInfo.lastName : "",
    document: userInfo?.document ? userInfo.document : "",
    email: userInfo?.email ? userInfo.email : "",
    sex: userInfo?.sex ? userInfo.sex : "",
    birthDate: userInfo?.birthDate ? userInfo.birthDate : "",
    phone: userInfo?.phone ? userInfo.phone : "",
    cellphone: userInfo?.cellphone ? userInfo.cellphone : "",
    privateAddress: userInfo?.privateAddress ? userInfo.privateAddress : "",
    studyLevel: userInfo?.studyLevel ? userInfo.studyLevel : "",
    profession: userInfo?.profession ? userInfo.profession : "",
    function: userInfo?.function ? userInfo.function : "",
    // asset: "",
    situation: userInfo?.situation ? userInfo.situation : "",
    ministry: userInfo?.secretariat ? userInfo?.secretariat.ministry?.name : "",
    incomeDate: userInfo?.incomeDate ? userInfo.incomeDate : "",
    secretariatId: userInfo?.secretariat ? userInfo.secretariat.name : "",
    shiftId: userInfo?.shift ? userInfo.shift.id : "",
    entryHour: userInfo?.entryHour ? userInfo?.entryHour : userInfo?.shift ? userInfo.shift.entryHour : "",
    exitHour: userInfo?.exitHour ? userInfo?.exitHour : userInfo?.shift ? userInfo.shift.exitHour : "",
  };

  const selectRef = useRef(null);

  const [userDataInputs, setUserDataInputs] = useState(initialState);
  const [errors, setErrors] = useState(initialState);
  const [birthDate, setBirthDate] = useState("");
  const [ImagePrevius, setImagePrevious] = useState<string | null>(userInfo?.image || null);
  const [userDataImage, setUserDataImage] = useState<File | null>(null);
  const [secretariatsInfo, setSecretariatsInfo] = useState<ISecretariat[]>([]);
  const [shiftsInfo, setShiftsInfo] = useState<IShift[]>([]);
  const { user } = useAppSelector((state) => state.auth);
  const today = dayjs();
  const minDate = today.subtract(18, "years").format("YYYY-MM-DD"); // Formato YYYY-MM-DD
  // const minDate = today.subtract(18, "years").toDate();

  useEffect(() => {
    const info = async () => {
      await axios
        .get(`${BACK_API_URL}/ministries/${user?.nameMinistry}`, { withCredentials: true })
        .then(({ data }) => {
          console.log("secretariats", data);
          setSecretariatsInfo(data.secretariats);
        })
        .catch((error) => {
          console.error("Error al obtener secretarias", error.response.data.message);
          toast.error(error.response.data.message);
        });
      await axios
        .get(`${BACK_API_URL}/users/shifts`, { withCredentials: true })
        .then(({ data }) => {
          console.log("shifts", data);
          setShiftsInfo(data);
          if (!userInfo && data.length > 0) {
            setUserDataInputs((prev) => ({
              ...prev,
              shiftId: data[0].id, // Primer turno de la lista
              entryHour: data[0].entryHour, // Hora de entrada del primer turno
              exitHour: data[0].exitHour, // Hora de salida del primer turno
            }));
          }
        })
        .catch((error) => {
          console.error("Error al obtener turnos", error.response.data.message);
          toast.error(error.response.data.message);
        });
    };

    info();
  }, []);
  const handleModal = () => {
    // console.log(isVisible);
    if (userInfo && setIsEditing && onCloseModal) {
      setIsEditing(false);
    } else if (onCloseModal) {
      onCloseModal(false);
    }
  };
  const handleChange = (e: React.ChangeEvent<HTMLSelectElement | HTMLInputElement>) => {
    const { value, name } = e.target;

    if (name === "shiftId") {
      const selectedShift = shiftsInfo.find((shift) => shift.id === value);

      setUserDataInputs((prev) => ({
        ...prev,
        shiftId: value,
        entryHour: selectedShift ? selectedShift.entryHour : "",
        exitHour: selectedShift ? selectedShift.exitHour : "",
      }));
    } else {
      setUserDataInputs({
        ...userDataInputs,
        [name]: value,
      });
    }

    // setErrors(validateInputLoginU({ ...userDataInputs, [name]: value }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    // setUserDataInputs({ ...userDataInputs, secretariat: user && user?.secretariat ? user?.secretariat.id : "a" });
    // const data = cleanObject(userDataInputs as Record<string, unknown>);
    // console.log("data", data);
    // console.log("data secretariatsInfo", !data.secretariat);
    // const dataWithSecretariat = { ...data, secretariat: secretariatsInfo && !data.secretariat ? secretariatsInfo[0].id : data.secretariat };
    // // console.log("Valor seleccionado:", user?.secretariat.id);
    // const datA = { ...data, secretariat: user && user?.secretariat ? user?.secretariat.id : "ad" };
    // console.log(user);
    if (userInfo) {
      const data = cleanObject(userDataInputs as Record<string, unknown>);
      const dataWithSecretariat = {
        ...data,
        secretariatId: secretariatsInfo && !data.secretariat ? secretariatsInfo[0].id : data.secretariatId,
      };

      const formData = new FormData();
      if (userDataImage) formData.append("file", userDataImage);
      Object.entries(dataWithSecretariat).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      console.log("formData udate", formData.get("name"));
      axios
        .put(`${BACK_API_URL}/users/update/${userInfo.id}`, formData, { withCredentials: true })
        .then(({ data }) => {
          console.log("data", data);
          toast.success("Empleado actualizado exitosamente");
          if (onCloseModal) onCloseModal(false);
          const user: IUser = {
            ...data.user,
            registrations: userInfo.registrations,
          };
          // console.log("userActuualizado", user);
          dispatch(addUser(user));
        })
        .catch((error) => {
          console.error("Error al iniciar sesión:", error.response.data.message);
          toast.error(error.response.data.message);
        });
    } else {
      const data = cleanObject(userDataInputs as Record<string, unknown>);
      const dataWithSecretariat = {
        ...data,
        secretariatId: secretariatsInfo && !data.secretariat ? secretariatsInfo[0].id : data.secretariatId,
      };
      // console.log("dataWithSecretariat", dataWithSecretariat);
      const formData = new FormData();
      if (userDataImage) formData.append("file", userDataImage);
      Object.entries(dataWithSecretariat).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value.toString());
        }
      });
      // formData.append("data", data);
      console.log("formData", formData);
      axios
        .post(`${BACK_API_URL}/users/createEmployee`, formData, { withCredentials: true })
        .then(({ data }) => {
          console.log("data", data);
          toast.success("Empleado creado exitosamente");
          handleModal();
          const user: IUser = {
            ...data.user,
            registrations: [],
          };
          dispatch(addUser(user));
        })
        .catch((error) => {
          console.error("Error al iniciar sesión:", error.response.data.message);
          toast.error(error.response.data.message);
        });
    }
  };

  const cleanObject = <T extends Record<string, unknown>>(obj: T): Partial<T> => {
    return Object.fromEntries(Object.entries(obj).filter(([, value]) => value !== "" && value !== null)) as Partial<T>;
  };
  const changeImage = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const reader = new FileReader();
      // console.log(e.target.files[0]);
      const img = e.target.files[0];
      // console.log(img);
      reader.readAsDataURL(img);
      reader.onload = (e) => {
        e?.preventDefault();
        if (typeof e?.target?.result === "string") {
          setImagePrevious(e?.target?.result);
        }
        // setImagePrevious(e?.target?.result);
      };
      setUserDataImage(img);
    }
  };
  return (
    <div className="w-[400px] sm:w-[600px] md:w-[800px] lg:w-[1000px] xl:w-[1300px] 2xl:w-[1500px] h-200">
      <h2 className="mt-4  text-center font-[500] text-[30px]">
        {userInfo ? `Editar Empleado: ${formatName(userInfo?.name, userInfo?.lastName)}` : "Crear Empleado"}
      </h2>
      <button
        onClick={handleModal}
        className="absolute top-[-1px] right-[-1px] rounded-lg text-gray-400   hover:text-[#160852] cursor-pointer "
      >
        <IoIosClose className="w-10 h-10" />
      </button>
      <div className="flex flex-col overflow-auto h-[700px] md:h-auto md:overflow-hidden md:flex-row w-auto p-6 ">
        <div className="flex flex-col items-center">
          <div className="w-[380px] h-[300px] flex flex-col justify-center items-center">
            <div className="flex relative justify-center items-center  mt-1 bg-gray-400 hover:bg-[#69696965] w-[252px] h-[252px] rounded-[50%] shadow-md ">
              <input
                type="file"
                name="userImage"
                id="uploadImage"
                className="rounded-[50%] hover:bg-[#69696965] edit_profile_input_hover outline-none absolute m-0 p-0 w-full h-full cursor-pointer opacity-0 z-20"
                accept="image/*"
                onChange={(e) => {
                  changeImage(e);
                }}
              />
              {ImagePrevius ? (
                <>
                  <img src={ImagePrevius} className=" w-[252px] h-[252px] rounded-[50%] object-cover " />
                  <div className="edit_profile_img_hover absolute inset-0 w-full h-full group hover:bg-[#69696965] rounded-[50%]"></div>
                </>
              ) : (
                <>
                  <img
                    src="https://cdn-icons-png.flaticon.com/512/149/149071.png"
                    className=" w-[252px] h-[252px] rounded-[50%] hover:bg-[#69696965]"
                  />
                  <div className="edit_profile_img_hover absolute inset-0 w-full h-full group hover:bg-[#69696965] rounded-[50%]"></div>
                </>
              )}
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
                <select
                  name="shiftId"
                  value={userDataInputs.shiftId}
                  className="bg-gray-50 w-[150px]  border-[#d6dadf] border-1 text-gray-900 text-sm rounded-lg focus:border-1 focus:ring-blue-500 focus:border-blue-500 block p-[7.5px]   outline-none"
                  onChange={handleChange}
                >
                  {shiftsInfo?.map((shift) => (
                    <option key={shift.id} value={shift.id}>
                      {shift.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>
            <div className="my-1 flex flex-row gap-4 ">
              <div className=" relative  w-[150px]   flex flex-col justify-center items-center">
                <label className="form-title-md"> Hora de Entrada</label>
                <input
                  // id={name}
                  type="time"
                  name="entryHour"
                  value={userDataInputs.entryHour}
                  className={` px-2 h-[35px]  text-black py-2.5  w-[150px]  input-form-create`}
                  placeholder=" "
                  onChange={handleChange}
                />
              </div>
              <div className=" relative  w-[150px]  flex flex-col justify-center items-center">
                <label className="form-title-md"> Hora de Salida</label>
                <input
                  // id={name}
                  type="time"
                  name="exitHour"
                  value={userDataInputs.exitHour}
                  className={` px-2 h-[35px]  text-black py-2.5  w-[150px]  input-form-create`}
                  placeholder=" "
                  onChange={handleChange}
                />
              </div>
            </div>
          </div>
        </div>
        <div className=" ">
          <form onSubmit={handleSubmit} className="flex  flex-col justify-center items-center ">
            <main className="w-[375px] sm:w-auto md:w-[390px] lg:w-[590px] xl:w-[890px] 2xl:w-[1090px] h-[607px] overflow-auto ">
              <section className="">
                <div className=" w-full">
                  <h3 className="text-start text-[20px]">Datos Personales</h3> <hr className="border-t border-gray-300 my-3" />
                </div>
                <div className="my-3 flex flex-col lg:flex-row  gap-4 ">
                  <div className=" relative  w-[200px]  2xl:w-[500px]   flex flex-col justify-start items-start">
                    <label className="form-title-md" htmlFor="">
                      {" "}
                      Nombres
                    </label>
                    <input
                      // id={name}
                      type="text"
                      name="name"
                      value={userDataInputs.name}
                      className={` px-2 h-[35px]  text-black py-2.5  w-[200px]  2xl:w-[500px]  input-form-create`}
                      placeholder=" "
                      onChange={handleChange}
                    />
                  </div>
                  <div className=" relative  w-[200px]  2xl:w-[500px]  flex flex-col justify-start items-start">
                    <label className="form-title-md" htmlFor="">
                      {" "}
                      Apellidos
                    </label>
                    <input
                      // id={name}
                      type="text"
                      name="lastName"
                      value={userDataInputs.lastName}
                      className={` block px-2 h-[35px]  text-black py-2.5  w-[200px]  2xl:w-[500px] input-form-create`}
                      placeholder=" "
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="my-3 flex flex-col xl:flex-row   items-start justify-start gap-4 ">
                  <div className="flex flex-col lg:flex-row  items-start justify-start gap-4 ">
                    <div className=" relative  w-[200px] min-w-[200px] flex flex-col justify-start items-start">
                      <label className="form-title-md required" htmlFor="">
                        {" "}
                        Documento
                      </label>
                      <input
                        // id={name}
                        type="text"
                        name="document"
                        value={userDataInputs.document}
                        className={` block px-2 h-[35px]  text-black py-2.5  w-[200px] input-form-create`}
                        placeholder=" "
                        onChange={handleChange}
                      />
                    </div>
                    <div className=" relative   flex flex-col justify-start items-start">
                      <label className="form-title-md required" htmlFor="">
                        {" "}
                        Correo Electronico
                      </label>
                      <input
                        // id={name}
                        type="text"
                        name="email"
                        value={userDataInputs.email}
                        className={` block px-2 h-[35px]  text-black py-2.5 w-[250px] 2xl:w-[287px]
                         input-form-create`}
                        placeholder=" "
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className=" relative   flex flex-col justify-start items-start">
                    <label className="form-title-md" htmlFor="">
                      {" "}
                      Sexo
                    </label>
                    <div className="flex gap-4 h-full">
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={userDataInputs.sex === "M"}
                          name="sex"
                          onChange={handleChange}
                          value="M"
                          className="w-4 h-4"
                        />
                        Masculino
                      </label>
                      <label className="flex items-center gap-2">
                        <input
                          type="radio"
                          checked={userDataInputs.sex === "F"}
                          name="sex"
                          onChange={handleChange}
                          value="F"
                          className="w-4 h-4"
                        />
                        Femenino
                      </label>
                    </div>
                  </div>
                </div>
                <div className="my-3 flex flex-col xl:flex-row  items-start justify-start gap-4 ">
                  <div className="flex flex-col lg:flex-row  items-start justify-start gap-4 ">
                    <div className=" relative  w-[200px] min-w-[200px] flex flex-col justify-start items-start">
                      <label className="form-title-md" htmlFor="">
                        {" "}
                        Celular
                      </label>
                      <input
                        // id={name}
                        type="text"
                        name="cellphone"
                        value={userDataInputs.cellphone}
                        className={` block px-2 h-[35px]  text-black py-2.5  w-[200px] input-form-create`}
                        placeholder=" "
                        onChange={handleChange}
                      />
                    </div>
                    <div className=" relative w-[200px]  flex flex-col justify-start items-start">
                      <label className="form-title-md" htmlFor="">
                        {" "}
                        Telefono fijo
                      </label>
                      <input
                        // id={name}
                        type="text"
                        name="phone"
                        value={userDataInputs.phone}
                        className={` block px-2 h-[35px]  text-black py-2.5  w-[200px] input-form-create`}
                        placeholder=" "
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className=" relative w-[200px]  flex flex-col justify-start items-start">
                    <label className="form-title-md" htmlFor="dob">
                      Fecha de Nacimiento
                    </label>
                    <input
                      id="dob"
                      type="date"
                      name="birthDate"
                      value={userDataInputs.birthDate}
                      onChange={handleChange}
                      // onChange={(e) => setBirthDate(e.target.value)}
                      max={minDate} // Restringe la fecha máxima a hace 18 años
                      className="block px-2 h-[35px] text-black py-2.5 w-[200px]
            text-sm bg-transparent border border-[#E2E8F0] appearance-none 
            dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-[#4151cada] peer rounded-lg"
                    />
                    {/* <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      maxDate={minDate} // Restringe la fecha máxima a hace 18 años
                      dateFormat="dd/MM/yyyy" // Cambia el formato de la fecha
                      showYearDropdown // Agrega un dropdown de años
                      scrollableYearDropdown // Permite hacer scroll en los años
                      className="border border-[#E2E8F0] px-2 h-[35px] w-full rounded-lg text-black"
                    /> */}
                  </div>
                </div>
                <div className="my-3 flex flex-col lg:flex-row   items-start justify-start gap-4 ">
                  <div className=" relative w-[200px]  flex flex-col justify-start items-start">
                    <label className="form-title-md" htmlFor="">
                      Nivel de Estudio
                    </label>
                    <select
                      id="countries"
                      name="studyLevel"
                      onChange={handleChange}
                      value={userDataInputs.studyLevel}
                      className="w-[200px] bg-gray-50  border-[#E2E8F0] text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-[7.5px]  dark:border-gray-600 dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      // className="w-[200px] p-[7.5px]  input-form-create"
                    >
                      <option value="">-</option>
                      <option value="Primario">Primario</option>
                      <option value="Secundario">Secundario</option>
                      <option value="Terciario">Terciario</option>
                      <option value="Universitario">Universitario</option>
                    </select>
                  </div>
                  <div className=" relative  w-full flex flex-col justify-start items-start">
                    <label className="form-title-md" htmlFor="">
                      {" "}
                      Profesión
                    </label>
                    <input
                      // id={name}
                      type="text"
                      name="profession"
                      value={userDataInputs.profession}
                      className={` block px-2 h-[35px]  text-black py-2.5   input-form-create`}
                      placeholder=" "
                      onChange={handleChange}
                    />
                  </div>
                </div>
                <div className="my-3 flex flex-row  items-start justify-start gap-4 ">
                  <div className=" relative  w-full flex flex-col justify-start items-start">
                    <label className="form-title-md" htmlFor="">
                      {" "}
                      Domicilio
                    </label>
                    <input
                      // id={name}
                      type="text"
                      name="privateAddress"
                      value={userDataInputs.privateAddress}
                      className={` block px-2 h-[35px]  text-black py-2.5  w-full input-form-create`}
                      placeholder=" "
                      onChange={handleChange}
                    />
                  </div>
                </div>
              </section>
              <section>
                <div className=" w-full">
                  <h3 className="text-start text-[20px]">Datos Laborales</h3> <hr className="border-t border-gray-300 my-3" />
                </div>
                <div className="my-3 flex flex-col 2xl:flex-row gap-4 ">
                  <div className=" relative  w-[500px]   flex flex-col justify-start items-start">
                    <label className="form-title-md" htmlFor="">
                      {" "}
                      Ministerio
                    </label>
                    <input
                      // id={name}
                      type="text"
                      name="ministry"
                      value={userDataInputs.ministry || user?.nameMinistry}
                      disabled={true}
                      className={` px-2 h-[35px]  text-black py-2.5  w-[500px]  input-form-create opacity-50 cursor-not-allowed`}
                      placeholder=" "
                      onChange={handleChange}
                    />
                  </div>
                  <div className=" relative  w-[500px]  flex flex-col justify-start items-start">
                    <label className="form-title-md" htmlFor="">
                      {" "}
                      Secretaria
                    </label>
                    <select
                      name="secretariat"
                      value={userDataInputs.secretariatId}
                      className="bg-gray-50 w-[500px]  border-[#d6dadf] border-1 text-gray-900 text-sm rounded-lg focus:border-1 focus:ring-blue-500 focus:border-blue-500 block p-[7.5px]   outline-none"
                      onChange={handleChange}
                      ref={selectRef}
                    >
                      <option value="" disabled hidden>
                        {`${user?.nameSecretariat || "Secretaria"}`}
                      </option>
                      {/* {`${console.log("ddd", secretariatsInfo)}`} */}
                      {userInfo ? (
                        <option value={userInfo?.secretariat?.id}>{userDataInputs.secretariatId}</option>
                      ) : (
                        secretariatsInfo?.map((secretariat) => (
                          <option key={secretariat.id} value={secretariat.id}>
                            {secretariat.name}
                          </option>
                        ))
                      )}
                    </select>
                    {/* <input
                      // id={name}
                      type="text"
                      name="secretariat"
                      value={userDataInputs.secretariat}
                      className={` block px-2 h-[35px]  text-black py-2.5  w-[500px] input-form-create`}
                      placeholder=" "
                      onChange={handleChange}
                    /> */}
                  </div>
                </div>
                <div className="my-3 flex flex-col xl:flex-row gap-4 ">
                  <div className="flex flex-col lg:flex-row  items-start justify-start gap-4 ">
                    <div className=" relative w-[200px]   2xl:w-[395px]   flex flex-col justify-start items-start">
                      <label className="form-title-md" htmlFor="">
                        {" "}
                        Funcion
                      </label>
                      <input
                        // id={name}
                        type="text"
                        name="function"
                        value={userDataInputs.function}
                        className={` px-2 h-[35px]  text-black py-2.5 w-[200px]   2xl:w-[395px]  input-form-create`}
                        placeholder=" "
                        onChange={handleChange}
                      />
                    </div>
                    <div className=" relative  w-[250px]   2xl:w-[395px]  flex flex-col justify-start items-start">
                      <label className="form-title-md" htmlFor="">
                        {" "}
                        Situacion
                      </label>
                      <input
                        // id={name}
                        type="text"
                        name="situation"
                        value={userDataInputs.situation}
                        className={` block px-2 h-[35px]  text-black py-2.5  w-[250px]   2xl:w-[395px] input-form-create`}
                        placeholder=" "
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  <div className=" relative  2xl:w-[200px]  flex flex-col justify-start items-start">
                    <label className="form-title-md" htmlFor="dob">
                      Fecha de Ingreso
                    </label>
                    <input
                      id="dob"
                      type="date"
                      value={userDataInputs.incomeDate}
                      name="incomeDate"
                      onChange={handleChange}
                      className="block px-2 h-[35px] text-black py-2.5  2xl:w-[200px] 
            text-sm bg-transparent border border-[#E2E8F0] appearance-none 
            dark:border-gray-600 focus:outline-none focus:ring-0 focus:border-[#4151cada] peer rounded-lg"
                    />
                    {/* <DatePicker
                      selected={selectedDate}
                      onChange={(date) => setSelectedDate(date)}
                      maxDate={minDate} // Restringe la fecha máxima a hace 18 años
                      dateFormat="dd/MM/yyyy" // Cambia el formato de la fecha
                      showYearDropdown // Agrega un dropdown de años
                      scrollableYearDropdown // Permite hacer scroll en los años
                      className="border border-[#E2E8F0] px-2 h-[35px] w-full rounded-lg text-black"
                    /> */}
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
      {/* <div className="grid grid-cols-5 grid-rows-5 gap-4 p-6">
                <div className="col-span-4 row-span-5 col-start-2 row-start-1 bg-amber-100">2</div>
                <div className="row-span-5 col-start-1 row-start-1 bg-green-200">3</div>
              </div> */}
    </div>
  );
};

export default CreateUser;
