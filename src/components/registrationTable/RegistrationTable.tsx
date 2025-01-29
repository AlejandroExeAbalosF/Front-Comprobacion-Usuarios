import axios from "axios";
import { useEffect, useState } from "react";

const RegistrationTable = () => {
  const BACK_API_URL = import.meta.env.VITE_LOCAL_API_URL;
  const [Users, setUsers] = useState<IUser[]>([]);
  const [usersFilter, setUsersFilter] = useState<IUser[]>(Users); // [usersFilter]
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
  }, []);
  return <div>RegistrationTable</div>;
};

export default RegistrationTable;
