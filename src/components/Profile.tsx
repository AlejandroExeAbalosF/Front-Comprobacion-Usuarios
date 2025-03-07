import { useEffect, useState } from "react";
import { IUser } from "../helpers/types";
import axios from "axios";
import DetailsUser from "./DetailsUser";

const BACK_API_URL = import.meta.env.VITE_LOCAL_API_URL;

const Profile: React.FC<{ userInfo?: IUser | null }> = ({ userInfo }) => {
  console.log("userInfo", userInfo);
  const [user, setUser] = useState<IUser | null>(null);
  useEffect(() => {
    if (userInfo) {
      axios
        .get(`${BACK_API_URL}/users/${userInfo.id}`, { withCredentials: true })
        .then(({ data }) => {
          setUser(data);
          console.log("user", data);
        })
        .catch((error) => console.error(error));
    }
  }, [userInfo]);
  return (
    <div>
      <DetailsUser userInfo={user} />
    </div>
  );
};

export default Profile;
