import axios from "axios";
import { useEffect, useState } from "react";
import { IRegistration, IUser } from "../../helpers/types";
import { toast } from "sonner";
import { useNotifications } from "../../hooks/useNotifications";
import dayjs from "dayjs";
import { formatName } from "../../utils/format";
import { BsFillPersonLinesFill } from "react-icons/bs";
import { BsReverseLayoutTextWindowReverse } from "react-icons/bs";
import ModalRegistration from "../modalRegistration/ModalRegistration";

const RegistrationTable = () => {
  const notifications = useNotifications();
  const BACK_API_URL = import.meta.env.VITE_LOCAL_API_URL;
  const [Users, setUsers] = useState<IUser[]>([]);
  const [usersFilter, setUsersFilter] = useState<IUser[]>([]); // [usersFilter]
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterColumn, setFilterColumn] = useState({
    type: "Empleados",
    order: false,
  });

  //----------
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [userDetails, setUserDetails] = useState<IRegistration[] | null>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Función para abrir el modal y cargar datos
  const handleOpenModalRegister = (userId: string) => {
    setSelectedUserId(userId);
    setIsModalOpen(true);
  };

  // Efecto para cargar datos del usuario cuando el modal se abre
  useEffect(() => {
    if (isModalOpen && selectedUserId !== null) {
      axios
        .get(`${BACK_API_URL}/registrations/user/${selectedUserId}`, {
          withCredentials: true,
        })
        .then(({ data }) => {
          setUserDetails(data);
          console.log(data);
        })
        .catch((error) => {
          toast.error(error.response.data.message);
        });
    }
  }, [isModalOpen, selectedUserId]);

  //-----------
  useEffect(() => {
    // console.log("notifications", notifications);
    if (notifications) {
      setUsers((prevUsers) =>
        prevUsers.map((user) => {
          if (user.id === notifications?.id) {
            // Verificamos si el usuario ya tiene registros
            const updatedRegistrations = user.registrations?.length
              ? user.registrations.map((registration) => {
                  if (registration.id === notifications.idR) {
                    return {
                      ...registration,
                      validated: notifications.validated,
                      entryDate:
                        registration.entryDate || (notifications.validated === "present" ? notifications.date : undefined),
                      entryCapture:
                        registration.entryCapture || (notifications.validated === "present" ? notifications.capture : undefined),
                      exitDate: notifications.validated === "idle" ? notifications.date : registration.exitDate,
                      exitCapture: notifications.validated === "idle" ? notifications.capture : registration.exitCapture,
                    };
                  }
                  return registration;
                })
              : [
                  {
                    id: notifications.idR,
                    validated: notifications.validated,
                    entryDate: notifications.validated === "present" ? notifications.date : undefined,
                    entryCapture: notifications.validated === "present" ? notifications.capture : undefined,
                    exitDate: notifications.validated === "idle" ? notifications.date : undefined,
                    exitCapture: notifications.validated === "idle" ? notifications.capture : undefined,
                  },
                ];

            return { ...user, registrations: updatedRegistrations };
          }
          return user;
        })
      );
    }
    // console.log("userN", userN);
  }, [notifications]);
  useEffect(() => {
    const fetchUsers = async () => {
      const storedToken = await localStorage.getItem("token");
      // setToken(storedToken);

      try {
        const response = await axios.get(`${BACK_API_URL}/users/users_with_last_registration`, {
          withCredentials: true, // Envia la cookie HTTPOnly automáticamente
        });
        // console.log(response.data);
        if (response.data) {
          setUsers(response.data);

          setUsersFilter(response.data);
        }
      } catch (error) {
        toast.error("Error al cargar Empleados.");
      }
      // Ordenar el array de propiedades por el número de casa de forma ascendente
      //   const sortedUsers = response.data.sort(
      //     (a: IUser, b: IUser) => a.number - b.number,
      //   );

      // console.log(response.data);
    };

    fetchUsers();
  }, [BACK_API_URL]);

  // useEffect(() => {
  //   const checkToken = async () => {
  //     const filteredUsers = [...Users].filter((userData) => {
  //       const searchString = `${userData.name} ${userData.lastName} ${userData.document} ${userData.email}`;
  //       return searchString.toLowerCase().includes(searchTerm.toLowerCase());
  //     });
  //     if (filterColumn.type === "Empleados") {
  //       if (filterColumn.order) {
  //         filteredUsers.sort((a: IUser, b: IUser) => {
  //           if (a.name < b.name) {
  //             return 1;
  //           }
  //           if (a.name > b.name) {
  //             return -1;
  //           }
  //           // a debe ser igual b
  //           return 0;
  //         });
  //       } else {
  //         filteredUsers.sort((a: IUser, b: IUser) => {
  //           if (a.name < b.name) {
  //             return -1;
  //           }
  //           if (a.name > b.name) {
  //             return 1;
  //           }
  //           // a debe ser igual b
  //           return 0;
  //         });
  //       }
  //     }
  //     if (filterColumn.type === "Ingreso") {
  //       if (filterColumn.order) {
  //         filteredUsers.sort((a: IUser, b: IUser) => {
  //           // Si ambos usuarios tienen registros, comparamos las fechas
  //           if (a.registrations.length > 0 && b.registrations.length > 0) {
  //             const dateA = new Date(a.registrations[0].entryDate);
  //             const dateB = new Date(b.registrations[0].entryDate);
  //             return dateB.getTime() - dateA.getTime(); // Orden descendente
  //           }

  //           // Si uno de los usuarios no tiene registros, lo coloca al final (o al principio si prefieres)
  //           if (a.registrations.length === 0 && b.registrations.length > 0) {
  //             return 1; // a va al final
  //           }
  //           if (b.registrations.length === 0 && a.registrations.length > 0) {
  //             return -1; // b va al final
  //           }

  //           // Si ambos no tienen registros, no importa el orden
  //           return 0;
  //         });
  //       } else {
  //         filteredUsers.sort((a: IUser, b: IUser) => {
  //           // Si ambos usuarios tienen registros, comparamos las fechas
  //           if (a.registrations.length > 0 && b.registrations.length > 0) {
  //             const dateA = new Date(a.registrations[0].entryDate);
  //             const dateB = new Date(b.registrations[0].entryDate);
  //             return dateA.getTime() - dateB.getTime(); // Orden descendente
  //           }

  //           // Si uno de los usuarios no tiene registros, lo coloca al final (o al principio si prefieres)
  //           if (a.registrations.length === 0 && b.registrations.length > 0) {
  //             return 1; // a va al final
  //           }
  //           if (b.registrations.length === 0 && a.registrations.length > 0) {
  //             return -1; // b va al final
  //           }

  //           // Si ambos no tienen registros, no importa el orden
  //           return 0;
  //         });
  //       }
  //     }
  //     // user?.registrations.length > 0 ? user.registrations[0].validated ?
  //     if (filterColumn.type === "Estado") {
  //       if (filterColumn.order) {
  //         const priority = { present: 1, idle: 2, absent: 3 };
  //         filteredUsers.sort((a: IUser, b: IUser) => {
  //           // Obtener el valor de validated de cada usuario
  //           const validatedA = a.registrations.length > 0 ? a.registrations[0].validated : "absent"; // Si no tiene registro, lo tratamos como "absent"
  //           const validatedB = b.registrations.length > 0 ? b.registrations[0].validated : "absent";

  //           // Comparar según el nivel de prioridad definido
  //           return priority[validatedA] - priority[validatedB];
  //         });
  //       } else {
  //         const priority = { present: 1, idle: 2, absent: 3 };
  //         filteredUsers.sort((a: IUser, b: IUser) => {
  //           // Obtener el valor de validated de cada usuario
  //           const validatedA = a.registrations.length > 0 ? a.registrations[0].validated : "absent"; // Si no tiene registro, lo tratamos como "absent"
  //           const validatedB = b.registrations.length > 0 ? b.registrations[0].validated : "absent";

  //           // Comparar según el nivel de prioridad definido
  //           return priority[validatedB] - priority[validatedA];
  //         });
  //       }
  //     }

  //     if (filterColumn.type === "Documento") {
  //       if (filterColumn.order) {
  //         filteredUsers.sort((a: IUser, b: IUser) => a.document - b.document);
  //       } else {
  //         filteredUsers.sort((a: IUser, b: IUser) => b.document - a.document);
  //       }
  //     }
  //     // if (filterColumn.type === "Ult. Login") {
  //     //   if (filterColumn.order) {
  //     //     filteredUsers.sort((a: IUser, b: IUser) => new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime());
  //     //   } else {
  //     //     filteredUsers.sort((a: IUser, b: IUser) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime());
  //     //   }
  //     // }
  //     if (filterColumn.type === "Rol") {
  //       if (filterColumn.order) {
  //         filteredUsers.sort((a: IUser, b: IUser) => {
  //           if (a.rol < b.rol) {
  //             return 1;
  //           }
  //           if (a.rol > b.rol) {
  //             return -1;
  //           }
  //           // a debe ser igual b
  //           return 0;
  //         });
  //       } else {
  //         filteredUsers.sort((a: IUser, b: IUser) => {
  //           if (a.rol < b.rol) {
  //             return -1;
  //           }
  //           if (a.rol > b.rol) {
  //             return 1;
  //           }
  //           // a debe ser igual b
  //           return 0;
  //         });
  //       }
  //     }
  //     setUsersFilter(filteredUsers);
  //   };
  //   checkToken();
  // }, [searchTerm, filterColumn, Users]);

  useEffect(() => {
    const filteredUsers = Users.filter((userData) =>
      `${userData.name} ${userData.lastName} ${userData.document} ${userData.email}`
        .toLowerCase()
        .includes(searchTerm.toLowerCase())
    );

    const sortFunctions = {
      Empleados: (a: IUser, b: IUser) => (filterColumn.order ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)),
      Ingreso: (a: IUser, b: IUser) => {
        const dateA = a.registrations[0]?.entryDate ? new Date(a.registrations[0].entryDate).getTime() : 0;
        const dateB = b.registrations[0]?.entryDate ? new Date(b.registrations[0].entryDate).getTime() : 0;
        return filterColumn.order ? dateB - dateA : dateA - dateB;
      },
      Estado: (a: IUser, b: IUser) => {
        const priority = { present: 1, idle: 2, absent: 3 };
        const validatedA = a.registrations[0]?.validated || "absent";
        const validatedB = b.registrations[0]?.validated || "absent";
        return filterColumn.order ? priority[validatedA] - priority[validatedB] : priority[validatedB] - priority[validatedA];
      },
      Documento: (a: IUser, b: IUser) => (filterColumn.order ? a.document - b.document : b.document - a.document),
      Rol: (a: IUser, b: IUser) => (filterColumn.order ? b.rol.localeCompare(a.rol) : a.rol.localeCompare(b.rol)),
    };

    filteredUsers.sort(sortFunctions[filterColumn.type] || (() => 0));

    setUsersFilter(filteredUsers);
  }, [searchTerm, filterColumn, Users]);

  const renderUserButton = (user: IUser) => {
    return (
      <tr key={user.id} className="hover:bg-slate-50">
        <td className="p-4 border-b border-[#cfd8dc] ">
          <div className="flex items-center gap-3 ">
            <img
              src={user.image}
              alt={user.name || "user img"}
              className="relative inline-block h-9 w-9 !rounded-full object-cover object-center"
            />
            <div className="flex flex-col w-[150px] sm:w-[250px]  lg:w-full">
              <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 overflow-hidden text-ellipsis">
                {formatName(user.name, user.lastName)}
              </p>
              <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 opacity-70  truncate">
                {user.email}
              </p>
              <dl className="sm:hidden">
                <dt className="sr-only">Estado</dt>
                <dd className="">
                  {user?.registrations.length > 0 ? (
                    user.registrations[0].validated === "working" ? (
                      <div className="ml-14 inline-block  text-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap bg-green-500/20">
                        <span className="">Trabajando</span>
                      </div>
                    ) : user.registrations[0].validated === "present" ? (
                      <div className="ml-14 inline-block  text-center px-2 py-1 font-sans text-xs font-bold text-blue-900 uppercase rounded-md select-none whitespace-nowrap bg-blue-500/20">
                        <span className="">Presente</span>
                      </div>
                    ) : user.registrations[0].validated === "absent" ? (
                      <div className=" grid items-center px-2 py-1 font-sans text-xs font-bold text-amber-900 uppercase rounded-md select-none whitespace-nowrap bg-blue-gray-500/20 bg-amber-500/20">
                        <span className="">Ausente</span>
                      </div>
                    ) : null
                  ) : (
                    <div className="ml-14 inline-block  text-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap bg-blue-gray-500/20 text-blue-gray-900">
                      <span className="">No Estado</span>
                    </div>
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </td>
        <td className="hidden lg:table-cell p-4 border-b border-[#cfd8dc]">
          <p className=" font-sans text-sm  flex flex-col items-center lg:items-start antialiased font-normal leading-normal text-blue-gray-900">
            {user.document}
          </p>
        </td>
        <td className="hidden lg:table-cell p-4 border-b border-[#cfd8dc]">
          <div className="flex flex-col">
            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">{user.cellphone}</p>
            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 opacity-70">
              {user?.registrations.length > 0 && user.registrations[0].exitCapture ? (
                <img className="w-[100px]" src={`${BACK_API_URL}/uploads/${user.registrations[0].exitCapture}`}></img>
              ) : (
                "No"
              )}
            </p>
          </div>
        </td>
        <td className="hidden lg:table-cell p-4 border-b border-[#cfd8dc]">
          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
            {user?.registrations.length > 0 && user.registrations[0].entryCapture ? (
              <img className="w-[100px]" src={`${BACK_API_URL}/uploads/${user.registrations[0].entryCapture}`}></img>
            ) : (
              "No"
            )}
          </p>
        </td>
        <td className="hidden sm:table-cell w-[100px] text-center p-4 border-b border-[#cfd8dc]">
          <div className="w-max">
            {user?.registrations.length > 0 ? (
              user.registrations[0].validated === "present" ? (
                <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap bg-green-500/20">
                  <span className="">Presente</span>
                </div>
              ) : user.registrations[0].validated === "idle" ? (
                <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-blue-900 uppercase rounded-md select-none whitespace-nowrap bg-blue-500/20">
                  <span className="">Inactivo</span>
                </div>
              ) : (
                <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap bg-blue-gray-500/20 text-blue-gray-900">
                  <span className="">No Estado</span>
                </div>
              )
            ) : null}
          </div>
        </td>
        <td className=" sm:table-cell w-[100px] text-center flex flex-col items-center p-4 border-b border-[#cfd8dc]">
          <p className="lg:w-auto block font-sans text-sm text-center antialiased font-normal leading-normal text-blue-gray-900">
            {user?.registrations.length > 0 && user.registrations[0].entryDate
              ? dayjs(user.registrations[0].entryDate).format("DD/MM/YYYY")
              : "-"}
          </p>
          <p className="lg:w-auto  block font-sans text-sm text-center antialiased font-normal leading-normal text-blue-gray-900">
            {user?.registrations.length > 0 && user.registrations[0].entryDate
              ? dayjs(user.registrations[0].entryDate).format("HH:mm")
              : null}
          </p>
        </td>
        <td className=" sm:table-cell w-[100px] text-center  p-4 border-b border-[#cfd8dc]">
          <p className="lg:w-auto  block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
            {user?.registrations.length > 0 && user.registrations[0].exitDate
              ? dayjs(user.registrations[0].exitDate).format("DD/MM/YYYY")
              : "-"}
          </p>
          <p className="lg:w-auto  block font-sans text-sm text-center antialiased font-normal leading-normal text-blue-gray-900">
            {user?.registrations.length > 0 && user.registrations[0].exitDate
              ? dayjs(user.registrations[0].exitDate).format("HH:mm")
              : null}
          </p>
        </td>
        <td className="hidden lg:table-cell lg:flex lg:flex-row items-center p-4 border-b border-[#cfd8dc]">
          <div className="flex flex-row items-center justify-around ">
            <BsFillPersonLinesFill className="w-7 h-7 cursor-pointer" />
            <BsReverseLayoutTextWindowReverse
              className="w-6 h-6 cursor-pointer "
              onClick={() => handleOpenModalRegister(user.id)}
            />
          </div>
          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"></p>
          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"></p>
        </td>
      </tr>
    );
  };

  const onClickName = (event: React.MouseEvent<HTMLElement>) => {
    const target = event.target as HTMLButtonElement;
    const innerText = target.innerText;

    if (filterColumn.order) {
      setFilterColumn({ type: innerText, order: false });
    } else {
      setFilterColumn({ type: innerText, order: true });
    }
  };
  //!-----------------------------------------------------------
  return (
    <section className="2xl:w-[1500px] lg:w-[1200px] md:w-[900px]">
      <h2 className="notificationsext-2xl font-bold flex  items-start">Listado de Empleados</h2>
      <div className="xs:w-4/5 m-auto my-2 relative flex flex-col w-full h-full text-gray-700 bg-white shadow-md rounded-xl bg-clip-border">
        <div className="relative mx-4 mt-4 overflow-hidden text-gray-700 bg-white rounded-none bg-clip-border">
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
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-[#E2E8F0] before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-[#E2E8F0] after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    Buscar
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Tabla */}
        <div className="p-6 px-0 overflow-scroll overflow-x-hidden h-[600px]">
          <table className="w-full mt-4 text-left table-auto min-w-max">
            <thead>
              <tr className="bg-[#F5F7F8]">
                <th
                  className="cursor-pointer w-[250px] sm:w-[350px] p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  onClick={onClickName}
                >
                  <p className="block font-sans text-sm antialiased font-bold leading-none ">Empleados</p>
                </th>
                <th
                  className=" hidden lg:table-cell  cursor-pointer p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  onClick={onClickName}
                >
                  <p className=" font-sans text-sm text-center lg:text-start  antialiased font-bold  leading-none ">Documento</p>
                </th>
                <th className="hidden lg:table-cell p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50">
                  <p className=" font-sans text-sm antialiased font-bold  leading-none ">Contactos</p>
                </th>
                <th
                  className="hidden lg:table-cell cursor-pointer p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  onClick={onClickName}
                >
                  <p className=" block font-sans text-sm antialiased font-bold  leading-none ">Funcion</p>
                </th>
                <th
                  className="hidden sm:table-cell cursor-pointer p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  onClick={onClickName}
                >
                  <p className="block font-sans text-sm text-center antialiased font-bold  leading-none">Estado</p>
                </th>
                <th
                  className=" sm:table-cell cursor-pointer  p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  onClick={onClickName}
                >
                  <p className="block font-sans text-sm text-center antialiased font-bold  leading-none">Ingreso</p>
                </th>
                <th
                  className=" sm:table-cell cursor-pointer  p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  onClick={onClickName}
                >
                  <p className="block font-sans text-sm text-center antialiased font-bold  leading-none">Salida</p>
                </th>
                <th className="hidden lg:table-cell p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50">
                  <p className="block font-sans text-sm antialiased font-bold  leading-none"></p>
                </th>
              </tr>
            </thead>
            <tbody>
              {/*  */}
              {usersFilter.map((userData) => renderUserButton(userData))}
            </tbody>
          </table>
        </div>
      </div>
      {/* Modal */}
      {isModalOpen && userDetails && <ModalRegistration isVisible={isModalOpen} onClose={setIsModalOpen} data={userDetails} />}
    </section>
  );
};

export default RegistrationTable;
