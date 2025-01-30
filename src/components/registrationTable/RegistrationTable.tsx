import axios from "axios";
import { useEffect, useState } from "react";
import { IUser } from "../../helpers/types";
import { toast } from "sonner";
import { useNotifications } from "../UseNotifications";

const RegistrationTable = () => {
  const notifications = useNotifications();
  const BACK_API_URL = import.meta.env.VITE_LOCAL_API_URL;
  const [Users, setUsers] = useState<IUser[]>([]);
  const [usersFilter, setUsersFilter] = useState<IUser[]>(Users); // [usersFilter]
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filterColumn, setFilterColumn] = useState({
    type: "",
    order: true,
  });

  useEffect(() => {
    console.log("noti", notifications);
  }, [notifications]);
  useEffect(() => {
    const fetchUsers = async () => {
      const storedToken = await localStorage.getItem("token");
      // setToken(storedToken);

      const response = await axios.get(`${BACK_API_URL}/users/users_with_last_registration`, {
        headers: { Authorization: `Bearer ${storedToken}` },
      });

      // Ordenar el array de propiedades por el número de casa de forma ascendente
      //   const sortedUsers = response.data.sort(
      //     (a: IUser, b: IUser) => a.number - b.number,
      //   );
      // console.log(response.data);
      setUsers(response.data);

      setUsersFilter(response.data);
      console.log(response.data);
    };

    fetchUsers();
  }, [BACK_API_URL]);

  useEffect(() => {
    const checkToken = async () => {
      const filteredUsers = [...Users].filter((userData) => {
        const searchString = `${userData.name} ${userData.lastName} ${userData.document} ${userData.email}`;
        return searchString.toLowerCase().includes(searchTerm.toLowerCase());
      });
      if (filterColumn.type === "Propietario") {
        if (filterColumn.order) {
          filteredUsers.sort((a: IUser, b: IUser) => {
            if (a.name < b.name) {
              return 1;
            }
            if (a.name > b.name) {
              return -1;
            }
            // a debe ser igual b
            return 0;
          });
        } else {
          filteredUsers.sort((a: IUser, b: IUser) => {
            if (a.name < b.name) {
              return -1;
            }
            if (a.name > b.name) {
              return 1;
            }
            // a debe ser igual b
            return 0;
          });
        }
      }
      if (filterColumn.type === "Estado") {
        if (filterColumn.order) {
          filteredUsers.sort((a: IUser, b: IUser) => {
            if (String(a.state) < String(b.state)) {
              return 1;
            }
            if (String(a.state) > String(b.state)) {
              return -1;
            }
            // a debe ser igual b
            return 0;
          });
        } else {
          filteredUsers.sort((a: IUser, b: IUser) => {
            if (String(a.state) < String(b.state)) {
              return -1;
            }
            if (String(a.state) > String(b.state)) {
              return 1;
            }
            // a debe ser igual b
            return 0;
          });
        }
      }

      if (filterColumn.type === "Documento") {
        if (filterColumn.order) {
          filteredUsers.sort((a: IUser, b: IUser) => a.document - b.document);
        } else {
          filteredUsers.sort((a: IUser, b: IUser) => b.document - a.document);
        }
      }
      // if (filterColumn.type === "Ult. Login") {
      //   if (filterColumn.order) {
      //     filteredUsers.sort((a: IUser, b: IUser) => new Date(a.lastLogin).getTime() - new Date(b.lastLogin).getTime());
      //   } else {
      //     filteredUsers.sort((a: IUser, b: IUser) => new Date(b.lastLogin).getTime() - new Date(a.lastLogin).getTime());
      //   }
      // }
      if (filterColumn.type === "Rol") {
        if (filterColumn.order) {
          filteredUsers.sort((a: IUser, b: IUser) => {
            if (a.rol < b.rol) {
              return 1;
            }
            if (a.rol > b.rol) {
              return -1;
            }
            // a debe ser igual b
            return 0;
          });
        } else {
          filteredUsers.sort((a: IUser, b: IUser) => {
            if (a.rol < b.rol) {
              return -1;
            }
            if (a.rol > b.rol) {
              return 1;
            }
            // a debe ser igual b
            return 0;
          });
        }
      }
      setUsersFilter(filteredUsers);
    };
    checkToken();
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
                {user.name} {user.lastName}
              </p>
              <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 opacity-70  truncate">
                {user.email}
              </p>
              <dl className="sm:hidden">
                <dt className="sr-only">Estado</dt>
                <dd className="">
                  {user?.state === true ? (
                    <div className="ml-14 inline-block  text-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap bg-green-500/20">
                      <span className="">Activo</span>
                    </div>
                  ) : user?.state === false ? (
                    <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-red-900 uppercase rounded-md select-none whitespace-nowrap bg-red-500/20">
                      <span className="">Inactivo</span>
                    </div>
                  ) : (
                    <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap bg-blue-gray-500/20 text-blue-gray-900">
                      <span className="">No Estado</span>
                    </div>
                  )}
                </dd>
              </dl>
            </div>
          </div>
        </td>
        <td className="hidden lg:table-cell p-4 border-b border-[#cfd8dc]">
          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">{user.document}</p>
        </td>
        <td className="hidden lg:table-cell p-4 border-b border-[#cfd8dc]">
          <div className="flex flex-col">
            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">{user.cellphone}</p>
            <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900 opacity-70">
              {user.phone}
            </p>
          </div>
        </td>
        <td className="hidden lg:table-cell p-4 border-b border-[#cfd8dc]">
          <p className="block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900"></p>
        </td>
        <td className="hidden sm:table-cell p-4 border-b border-[#cfd8dc]">
          <div className="w-max">
            {user?.registrations.length > 0 ? (
              user.registrations[0].validated ? (
                <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-green-900 uppercase rounded-md select-none whitespace-nowrap bg-green-500/20">
                  <span className="">Presente</span>
                </div>
              ) : (
                <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold text-red-900 uppercase rounded-md select-none whitespace-nowrap bg-red-500/20">
                  <span className="">Inactivo</span>
                </div>
              )
            ) : (
              <div className="relative grid items-center px-2 py-1 font-sans text-xs font-bold uppercase rounded-md select-none whitespace-nowrap bg-blue-gray-500/20 text-blue-gray-900">
                <span className="">No Estado</span>
              </div>
            )}
          </div>
        </td>
        <td className=" sm:table-cell   p-4 border-b border-[#cfd8dc]">
          <p className="lg:w-auto w-[100px] block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
            {user?.registrations.length > 0 ? user.registrations[0].entryDate : "-"}
          </p>
        </td>
        <td className=" sm:table-cell   p-4 border-b border-[#cfd8dc]">
          <p className="lg:w-auto w-[100px] block font-sans text-sm antialiased font-normal leading-normal text-blue-gray-900">
            {user?.registrations.length > 0 ? user.registrations[0].exitDate : "-"}
          </p>
        </td>
        <td className="hidden lg:table-cell p-4 border-b border-[#cfd8dc]">
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
    <section className="2xl:w-[1500px]">
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
                    className="peer h-full w-full rounded-[7px] border border-blue-gray-200 border-t-transparent bg-transparent px-3 py-2.5 !pr-9 font-sans text-sm font-normal text-blue-gray-700 outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-blue-gray-200 placeholder-shown:border-t-blue-gray-200 focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-blue-gray-50"
                    placeholder=" "
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-blue-gray-200 before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-blue-gray-200 after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                    Buscar
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
        {/* Tabla */}
        <div className="p-6 px-0 overflow-scroll h-[600px]">
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
                  <p className=" font-sans text-sm antialiased font-bold  leading-none ">Documento</p>
                </th>
                <th className="hidden lg:table-cell p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50">
                  <p className=" font-sans text-sm antialiased font-bold  leading-none ">Contactos</p>
                </th>
                <th
                  className="hidden lg:table-cell cursor-pointer p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  onClick={onClickName}
                >
                  <p className=" block font-sans text-sm antialiased font-bold  leading-none ">Rol</p>
                </th>
                <th
                  className="hidden sm:table-cell cursor-pointer p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  onClick={onClickName}
                >
                  <p className="block font-sans text-sm antialiased font-bold  leading-none">Estado</p>
                </th>
                <th
                  className=" sm:table-cell cursor-pointer  p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  onClick={onClickName}
                >
                  <p className="block font-sans text-sm antialiased font-bold  leading-none">Ingreso</p>
                </th>
                <th
                  className=" sm:table-cell cursor-pointer  p-4 border-y border-[#cbd5e0] bg-blue-gray-50/50"
                  onClick={onClickName}
                >
                  <p className="block font-sans text-sm antialiased font-bold  leading-none">Salida</p>
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
    </section>
  );
};

export default RegistrationTable;
