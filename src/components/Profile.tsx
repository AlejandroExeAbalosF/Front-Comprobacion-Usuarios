import { useEffect, useState } from "react";
import { IEmployeeAbsence, INonLaborDate, IRegistration, IUser } from "../helpers/types";
import axios from "axios";
import DetailsUser from "./DetailsUser";
import { useAppDispatch } from "../redux/hooks";
import { restoreUser } from "../redux/slices/authSlice";

const BACK_API_URL = import.meta.env.VITE_LOCAL_API_URL;

const Profile: React.FC<{ userInfo?: IUser | null }> = ({ userInfo }) => {
  const dispatch = useAppDispatch();
  // console.log("userInfo asd", userInfo);
  const [user, setUser] = useState<IUser | null>(null);
  useEffect(() => {
    if (userInfo) {
      axios
        .get(`${BACK_API_URL}/users/${userInfo.id}`, { withCredentials: true })
        .then(({ data }) => {
          setUser(data);
          // console.log("user", data);
        })
        .catch((error) => console.error(error));
    }
  }, [userInfo]);

  const handleUpdate = (updatedRecord: INonLaborDate | IRegistration | IEmployeeAbsence | IUser) => {
    const updated = updatedRecord as IUser;
    const user = {
      id: updated.id,
      name: updated.name,
      lastName: updated.lastName,
      email: updated.email,
      rol: updated.rol,
      nameSecretariat: updated.secretariat?.name,
      nameMinistry: updated.secretariat?.ministry?.name,
      image: updated.image,
    };
    setUser(updated);
    dispatch(restoreUser({ user: user as IUser }));
  };
  return (
    <div className="2xl:w-[1500px] xl:w-[1300px] lg:w-[1000px] md:w-[820px]  h-auto overflow-hidden">
      <div className="  p-2">
        <DetailsUser userInfo={user} update={handleUpdate} />
      </div>
    </div>
  );
};

export default Profile;
