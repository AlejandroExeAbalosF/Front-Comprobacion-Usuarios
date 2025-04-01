import axios from "axios";
import { useEffect, useRef, useState } from "react";
import { INotificaciónData, IUser } from "../../helpers/types";
import { toast } from "sonner";
import { useNotifications } from "../../hooks/useNotifications.tsx";
import dayjs from "dayjs";
import { formatName } from "../../utils/format";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { BsReverseLayoutTextWindowReverse } from "react-icons/bs";
import { useAppDispatch, useAppSelector } from "../../redux/hooks";
import { setFilterColumn, setSearchTerm, setUsers, updateUserFromNotification } from "../../redux/slices/usersEmpSlice";
import ModalGeneric from "../ModalGeneric";
import { PhotoProvider, PhotoView } from "react-photo-view";
import { motion } from "framer-motion";
import { closeModal } from "../../redux/slices/modalSlice";
import { LazyLoadImage } from "react-lazy-load-image-component";
import { MdOutlineImageNotSupported } from "react-icons/md";

const RegistrationTableR = () => {
  const BACK_API_URL = import.meta.env.VITE_LOCAL_API_URL;
  //   const [Users, setUsers] = useState<IUser[]>([]);
  //   const [usersFilter, setUsersFilter] = useState<IUser[]>([]); // [usersFilter]
  //   const [searchTerm, setSearchTerm] = useState<string>("");
  //   const [filterColumn, setFilterColumn] = useState({
  //     type: "Empleados",
  //     order: false,
  //   });

  const dispatch = useAppDispatch();
  const { usersFilter, filterColumn, highlightedUserId } = useAppSelector((state) => state.usersEmp);
  const { user } = useAppSelector((state) => state.auth);
  // console.log("user", user);
  //----------
  // const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<IUser | null>();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isTypeModal, setIsTypeModal] = useState("");

  // Función para abrir el modal y cargar datos
  const handleOpenModal = (user: IUser | null, event: React.SyntheticEvent) => {
    setIsTypeModal(event.currentTarget.id);
    setUserDetails(user);
    setIsModalOpen(true);
  };

  // Función para cerrar el modal
  const handleCloseModal = () => {
    setIsModalOpen(false); // Cierra el modal localmente
    dispatch(closeModal()); // Cierra el modal en Redux
  };
  //-----------
  const { notifications, clearNotifications } = useNotifications();
  const queueRef = useRef<INotificaciónData[]>([]); // Cola de notificaciones pendientes
  const isProcessing = useRef(false); // Evita bucles infinitos
  useEffect(() => {
    if (notifications.length > 0) {
      queueRef.current = [...queueRef.current, ...notifications]; // Agregar nuevas notificaciones a la cola
      clearNotifications(); // Limpiar el estado original para evitar bucles
    }

    if (!isProcessing.current && queueRef.current.length > 0) {
      isProcessing.current = true;

      const processQueue = async () => {
        while (queueRef.current.length > 0) {
          const batch = queueRef.current.splice(0, queueRef.current.length); // Tomar todas las notificaciones acumuladas
          dispatch(updateUserFromNotification(batch)); // Enviar al reducer
          await new Promise((resolve) => setTimeout(resolve, 50)); // Pequeño delay para evitar saturación
        }

        isProcessing.current = false;
      };

      processQueue();
    }
  }, [notifications, dispatch]);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await axios.get(`${BACK_API_URL}/users/users_with_last_registration`, {
          withCredentials: true, // Envia la cookie HTTPOnly automáticamente
        });
        if (response.data) {
          console.log("response.data", response.data);
          dispatch(setUsers(response.data));
          dispatch(setFilterColumn({ type: "Empleados", order: false }));
          //   setUsers(response.data);

          //   setUsersFilter(response.data);
        }
      } catch (error) {
        toast.error("Error al cargar Empleados.", error ? error : "");
      }
      // Ordenar el array de propiedades por el número de casa de forma ascendente
      //   const sortedUsers = response.data.sort(
      //     (a: IUser, b: IUser) => a.number - b.number,
      //   );

      // console.log(response.data);
    };

    fetchUsers();
  }, []);

  const handleButtonValidateAssistance = () => {
    const data = {
      secretariatName: user?.nameSecretariat,
    };
    axios
      .post(`${BACK_API_URL}/registrations/validationsRegistrationsToday`, data, { withCredentials: true })
      .then((response) => {
        console.log("response", response);
        toast.success(response.data.message);
      })
      .catch((error) => {
        console.log("error", error);
      });
  };

  const renderUserTable = (user: IUser) => {
    return (
      <motion.tr key={user.id} className={`hover:bg-slate-50 ${user.id === highlightedUserId ? "highlighted" : ""}`}>
        <PhotoProvider
          maskOpacity={0.5}
          key={`${user.id}-${
            user?.registrations.length > 0 && user.registrations[0].entryCapture ? user.registrations[0].entryCapture : 0
          }-${user?.registrations.length > 0 && user.registrations[0].exitCapture ? user.registrations[0].exitCapture : 0}`}
        >
          <td className="w-[235px] p-4 border-b border-[#cfd8dc] ">
            <div className="flex items-center gap-3 ">
              <div className="w-[58px] h-[48px]">
                <PhotoView src={`${user.image}`}>
                  <LazyLoadImage
                    className="inline-block h-12 w-12 !rounded-full object-cover  object-center  cursor-pointer"
                    src={user.image}
                    // threshold={40}
                    placeholder={
                      <div className="w-[50px] h-[50px] flex items-center justify-center">
                        {" "}
                        <span className="loader"></span>
                      </div>
                    }
                  />
                  {/* <img
                    src={user.image}
                    alt={user.name || "user"}
                    className=" inline-block h-12 w-12 !rounded-full object-cover  object-center  cursor-pointer"
                  /> */}
                </PhotoView>
              </div>
              <div className="flex flex-col w-[130px] sm:w-[200px]  lg:w-full">
                <div className="flex flex-col h-[40px] min-w-[150px] max-w-[230px] overflow-hidden">
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">
                    {formatName(user.name, user.lastName)}
                  </p>
                  <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 overflow-hidden text-ellipsis whitespace-nowrap">
                    {user.email}
                  </p>
                </div>
                <dl className="md:hidden">
                  <dt className="sr-only">Estado</dt>
                  <dd className="flex items-center justify-center">
                    {user?.registrations.length > 0 ? (
                      user.registrations[0].status === "TRABAJANDO" ? (
                        <div
                          className={`  items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap ${
                            user.registrations[0].type === "LLEGADA_TARDE" ? "bg-red-500/20" : "bg-green-500/20"
                          }  `}
                          title={user.registrations[0].type === "LLEGADA_TARDE" ? "Llegada tarde" : ""}
                        >
                          <span className="">Trabajando</span>
                        </div>
                      ) : user.registrations[0].status === "PRESENTE" ? (
                        <div
                          className={`grid items-center px-2 py-1 font-sans text-xs font-bold text-blue-900 uppercase rounded-md select-none whitespace-nowrap ${
                            user.registrations[0].type === "LLEGADA_TARDE" ||
                            user.registrations[0].type === "LLEGADA_TARDE-SALIDA_TEMPRANA" ||
                            user.registrations[0].type === "SALIDA_TEMPRANA"
                              ? "bg-red-500/20"
                              : "bg-blue-500/20"
                          }`}
                          title={
                            user.registrations[0].type === "LLEGADA_TARDE"
                              ? "Llegada tarde"
                              : user.registrations[0].type === "LLEGADA_TARDE-SALIDA_TEMPRANA"
                              ? "Llegada tarde - Salida temprana"
                              : user.registrations[0].type === "SALIDA_TEMPRANA"
                              ? "Salida temprana"
                              : ""
                          }
                        >
                          <span className="">Presente</span>
                        </div>
                      ) : user.registrations[0].status === "AUSENTE" ? (
                        <div className="  items-center px-2 py-1 font-sans text-xs font-bold text-amber-900 uppercase rounded-md select-none whitespace-nowrap bg-blue-gray-500/20 bg-amber-500/20">
                          <span className="">Ausente</span>
                        </div>
                      ) : user.registrations[0].status === "NO_LABORABLE" ? (
                        <div className=" grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap bg-blue-gray-500/20 text-blue-gray-900">
                          <span className="">Día No Laboral</span>
                        </div>
                      ) : null
                    ) : null}
                  </dd>
                </dl>
              </div>
            </div>
          </td>
          <td className="  table-cell sm:hidden w-[100px] gap-2 text-center  items-center p-1 border-b border-[#cfd8dc]">
            <div className="w-[110px] flex flex-col items-center justify-center">
              <div className="w-[110px] flex flex-col items-center justify-center">
                <p className="w-[100px] lg:w-auto block font-sans text-sm text-center antialiased font-normal leading-normal text-blue-gray-900">
                  {user?.registrations.length > 0 && user.registrations[0].entryDate
                    ? dayjs(user.registrations[0].entryDate).format("DD/MM/YYYY")
                    : "-"}
                </p>
                <p className="w-[100px] lg:w-auto  block font-sans text-sm text-center antialiased font-normal leading-normal text-blue-gray-900">
                  {user?.registrations.length > 0 && user.registrations[0].entryDate
                    ? user.registrations[0].status !== "AUSENTE" && user.registrations[0].status !== "NO_LABORABLE"
                      ? dayjs(user.registrations[0].entryDate).format("HH:mm")
                      : null
                    : null}
                </p>
              </div>
              <div className="w-[110px] flex flex-col items-center justify-center">
                <p className="w-[100px] lg:w-auto  block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
                  {user?.registrations.length > 0 && user.registrations[0].exitDate
                    ? dayjs(user.registrations[0].exitDate).format("DD/MM/YYYY")
                    : "-"}
                </p>
                <p className="w-[100px] lg:w-auto  block font-sans text-sm text-center antialiased font-normal leading-normal text-blue-gray-900">
                  {user?.registrations.length > 0 && user.registrations[0].exitDate
                    ? user.registrations[0].status !== "AUSENTE" && user.registrations[0].status !== "NO_LABORABLE"
                      ? dayjs(user.registrations[0].exitDate).format("HH:mm")
                      : null
                    : null}
                </p>
              </div>
            </div>
          </td>
          <td className="hidden 2xl:table-cell p-4 border-b border-[#cfd8dc]">
            <p className=" font-sans text-sm  flex flex-col items-center lg:items-start antialiased font-normal leading-normal text-blue-gray-900">
              {user.document}
            </p>
          </td>

          <td className="hidden xl:table-cell p-4 border-b border-[#cfd8dc]">
            {/* <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">{user.cellphone}</p> */}
            <div className="w-full  h-[50px] flex items-center justify-center">
              {user?.registrations.length > 0 && user.registrations[0].exitCapture ? (
                <PhotoView src={`${user.registrations[0].exitCapture}`}>
                  {/* <img
                    className="max-w-full max-h-full object-contain cursor-pointer"
                    src={`${user.registrations[0].exitCapture}`}
                  ></img> */}
                  <LazyLoadImage
                    className="max-w-full max-h-full object-contain cursor-pointer"
                    src={`${user.registrations[0].exitCapture}`}
                    // threshold={40}
                    placeholder={
                      <div className="w-[50px] h-[50px] flex items-center justify-center">
                        {" "}
                        <span className="loader"></span>
                      </div>
                    }
                  />
                </PhotoView>
              ) : (
                <MdOutlineImageNotSupported className="w-10 h-10" />
              )}
            </div>
          </td>
          <td className="hidden xl:table-cell p-4 border-b  border-[#cfd8dc]">
            <div className="w-full h-[50px] flex  items-center justify-center">
              {user?.registrations.length > 0 && user.registrations[0].entryCapture ? (
                <PhotoView src={`${user.registrations[0].entryCapture}`}>
                  {/* <img
                    className="max-w-full max-h-full object-contain cursor-pointer"
                    src={`${user.registrations[0].entryCapture}`}
                  ></img> */}
                  <LazyLoadImage
                    className="max-w-full max-h-full object-contain cursor-pointer"
                    src={`${user.registrations[0].entryCapture}`}
                    placeholder={
                      <div className="w-[50px] h-[50px] flex items-center justify-center">
                        {" "}
                        <span className="loader"></span>
                      </div>
                    }
                  />
                </PhotoView>
              ) : (
                <MdOutlineImageNotSupported className="w-10 h-10" />
              )}
            </div>
          </td>
        </PhotoProvider>
        <td className="hidden  md:table-cell w-[100px] text-center p-4 border-b border-[#cfd8dc]">
          {user?.registrations.length > 0 ? (
            user.registrations[0].status === "TRABAJANDO" ? (
              <div
                className={`  items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap ${
                  user.registrations[0].type === "LLEGADA_TARDE" ? "bg-red-500/20" : "bg-green-500/20"
                }  `}
                title={user.registrations[0].type === "LLEGADA_TARDE" ? "Llegada tarde" : ""}
              >
                <span className="">Trabajando</span>
              </div>
            ) : user.registrations[0].status === "PRESENTE" ? (
              <div
                className={`grid items-center px-2 py-1 font-sans text-xs font-bold text-blue-900 uppercase rounded-md select-none whitespace-nowrap ${
                  user.registrations[0].type === "LLEGADA_TARDE" ||
                  user.registrations[0].type === "LLEGADA_TARDE-SALIDA_TEMPRANA" ||
                  user.registrations[0].type === "SALIDA_TEMPRANA"
                    ? "bg-red-500/20"
                    : "bg-blue-500/20"
                }`}
                title={
                  user.registrations[0].type === "LLEGADA_TARDE"
                    ? "Llegada tarde"
                    : user.registrations[0].type === "LLEGADA_TARDE-SALIDA_TEMPRANA"
                    ? "Llegada tarde - Salida temprana"
                    : user.registrations[0].type === "SALIDA_TEMPRANA"
                    ? "Salida temprana"
                    : ""
                }
              >
                <span className="">Presente</span>
              </div>
            ) : user.registrations[0].status === "AUSENTE" ? (
              <div className="  items-center px-2 py-1 font-sans text-xs font-bold text-amber-900 uppercase rounded-md select-none whitespace-nowrap bg-blue-gray-500/20 bg-amber-500/20">
                <span className="">Ausente</span>
              </div>
            ) : user.registrations[0].status === "NO_LABORABLE" ? (
              <div className=" grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap bg-blue-gray-500/20 text-blue-gray-900">
                <span className="">Día No Laboral</span>
              </div>
            ) : null
          ) : null}
        </td>
        <td className="hidden sm:table-cell w-[100px] text-center  items-center p-4 border-b border-[#cfd8dc]">
          <p className="lg:w-auto block font-sans text-sm text-center antialiased font-normal leading-normal text-blue-gray-900">
            {user?.registrations.length > 0 && user.registrations[0].entryDate
              ? dayjs(user.registrations[0].entryDate).format("DD/MM/YYYY")
              : "-"}
          </p>
          <p className="lg:w-auto  block font-sans text-sm text-center antialiased font-normal leading-normal text-blue-gray-900">
            {user?.registrations.length > 0 && user.registrations[0].entryDate
              ? user.registrations[0].status !== "AUSENTE" && user.registrations[0].status !== "NO_LABORABLE"
                ? dayjs(user.registrations[0].entryDate).format("HH:mm")
                : null
              : null}
          </p>
        </td>
        <td className="hidden sm:table-cell w-[100px] text-center  p-4 border-b border-[#cfd8dc]">
          <p className="lg:w-auto  block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
            {user?.registrations.length > 0 && user.registrations[0].exitDate
              ? dayjs(user.registrations[0].exitDate).format("DD/MM/YYYY")
              : "-"}
          </p>
          <p className="lg:w-auto  block font-sans text-sm text-center antialiased font-normal leading-normal text-blue-gray-900">
            {user?.registrations.length > 0 && user.registrations[0].exitDate
              ? user.registrations[0].status !== "AUSENTE" && user.registrations[0].status !== "NO_LABORABLE"
                ? dayjs(user.registrations[0].exitDate).format("HH:mm")
                : null
              : null}
          </p>
        </td>
        <td className="w-[50px] sm:w-[110px]  lg:table-cell  lg:flex-row items-center pr-4 sm:p-4 border-b border-[#cfd8dc]">
          <div className=" flex flex-col sm:flex-row items-center justify-around gap-2">
            <BsFillPersonLinesFill
              className="w-7 h-7 cursor-pointer"
              onClick={(e) => handleOpenModal(user, e)}
              id="userDetails"
            />
            <BsReverseLayoutTextWindowReverse
              className="w-6 h-6 cursor-pointer "
              onClick={(e) => handleOpenModal(user, e)}
              id="userRegisters"
            />
          </div>
        </td>
      </motion.tr>
    );
  };

  const onClickName = (event: React.MouseEvent<HTMLElement>) => {
    type SortType = "Empleados" | "Ingreso" | "Estado" | "Documento" | "Rol";
    const target = event.target as HTMLButtonElement;
    const innerText = target.innerText as SortType;

    if (filterColumn.order) {
      dispatch(setFilterColumn({ ...filterColumn, type: innerText, order: false }));
    } else {
      dispatch(setFilterColumn({ ...filterColumn, type: innerText, order: true }));
    }
  };
  //!-----------------------------------------------------------
  return (
    <section className="2xl:w-[1500px] xl:w-[1300px] lg:w-[1000px] md:w-[800px] sm:w-[670px] w-[410px] h-[700px] max-h-[700px] ">
      <h2 className="notificationsext-2xl ml-5  text-2xl flex  items-start">Listado de Empleados</h2>
      <div className="xs:w-4/5 m-auto my-2 relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
        <div className="relative h-[200px] md:h-auto mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border">
          <div className="flex flex-col justify-between gap-8 mb-4 md:flex-row md:items-center">
            {/* <div>
              <h5 className="block font-sans text-xl antialiased font-semibold leading-snug tracking-normal text-blue-gray-900">
                Recent Transactions
              </h5>
              <p className="block mt-1 font-sans text-base antialiased font-normal leading-relaxed text-gray-700">
                These are details about the last transactions
              </p>
            </div> */}

            <div className="flex w-full gap-2 shrink-0 md:w-max">
              <div className="w-full md:w-72">
                <div className="my-3 relative h-10 w-full min-w-[200px]">
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
                    className="peer h-full w-full rounded-[7px] border border-[#E2E8F0] border-t-transparent bg-transparent px-3 py-2.5 !pr-9 font-sans text-sm font-normal text-[#2B4B5B] outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-[#E2E8F0] placeholder-shown:border-t-[#E2E8F0] focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-[#F8FAFC]"
                    placeholder=" "
                    onChange={(e) => dispatch(setSearchTerm(e.target.value))}
                  />
                  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-[#E2E8F0] before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-[#E2E8F0] after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    Buscar
                  </label>
                </div>
              </div>
              <div className=" flex items-center justify-center">
                <button
                  className="  rounded-md bg-green-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-green-700 focus:shadow-none active:bg-green-700 hover:bg-green-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
                  onClick={handleButtonValidateAssistance}
                >
                  Validar Asistencia
                </button>
              </div>
            </div>
            {/* <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Agregar empleado</button> */}
            <button
              className="rounded-md bg-blue-600 py-2 px-4 border border-transparent text-center text-sm text-white transition-all shadow-md hover:shadow-lg focus:bg-blue-700 focus:shadow-none active:bg-blue-700 hover:bg-blue-700 active:shadow-none disabled:pointer-events-none disabled:opacity-50 disabled:shadow-none ml-2"
              id="createEmployee"
              onClick={(e) => handleOpenModal(null, e)}
            >
              Agregar empleado
            </button>
          </div>
        </div>
        {/* Tabla */}
        <div className=" overflow-auto overflow-x-hidden  h-full p-0 m-0">
          <table className="w-full  text-left table-auto min-w-max min-h-max border-collapse">
            <thead className="sticky top-0 bg-white shadow-md" style={{ top: "-1.8px" }}>
              <tr className="bg-[#F5F7F8]">
                <th
                  className="cursor-pointer w-[190px] 2xl:w-[300px] sm:w-[150px] p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  onClick={onClickName}
                >
                  <p className="block font-sans text-sm antialiased font-bold leading-none ">Empleados</p>
                </th>
                <th
                  className="table-cell w-[100px] sm:hidden cursor-pointer   border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  onClick={onClickName}
                >
                  <p className="block  font-sans text-sm text-center antialiased font-bold  leading-none">Ingreso/Salida</p>
                </th>
                <th
                  className=" hidden 2xl:table-cell 2xl:w-[150px]  cursor-pointer p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  onClick={onClickName}
                >
                  <p className=" font-sans text-sm text-center lg:text-start  antialiased font-bold  leading-none ">Documento</p>
                </th>
                <th className="hidden xl:table-cell  w-[200px] p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50">
                  <p className=" font-sans text-center text-sm antialiased font-bold  leading-none ">Captura de Salida</p>
                </th>
                <th
                  className="hidden xl:table-cell  w-[200px] p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  onClick={onClickName}
                >
                  <p className=" block font-sans text-center text-sm antialiased font-bold  leading-none ">Captura de Ingreso</p>
                </th>
                <th
                  className="hidden md:table-cell  w-[150px] cursor-pointer p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  onClick={onClickName}
                >
                  <p className="block font-sans text-sm text-center antialiased font-bold  leading-none">Estado</p>
                </th>
                <th
                  className="hidden sm:table-cell cursor-pointer  p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  onClick={onClickName}
                >
                  <p className="block font-sans text-sm text-center antialiased font-bold  leading-none">Ingreso</p>
                </th>
                <th
                  className="hidden sm:table-cell w-[120px] cursor-pointer  p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  onClick={onClickName}
                >
                  <p className="block font-sans text-sm text-center antialiased font-bold  leading-none">Salida</p>
                </th>
                <th className="w-[50px] sm:w-auto lg:table-cell sm:p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50">
                  <p className="block font-sans text-sm antialiased font-bold  leading-none"></p>
                </th>
              </tr>
            </thead>
            <tbody>
              {/*  */}
              {usersFilter.map((userData) => renderUserTable(userData))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && (
        <ModalGeneric
          isVisible={isModalOpen}
          onClose={handleCloseModal}
          data={userDetails}
          typeModal={isTypeModal as "userDetails" | "userRegisters" | "createEmployee"}
        />
      )}
    </section>
  );
};

export default RegistrationTableR;
