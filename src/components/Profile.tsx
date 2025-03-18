import { useEffect, useState } from "react";
import { IUser } from "../helpers/types";
import axios from "axios";
import DetailsUser from "./DetailsUser";

const BACK_API_URL = import.meta.env.VITE_LOCAL_API_URL;

const Profile: React.FC<{ userInfo?: IUser | null }> = ({ userInfo }) => {
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
  return (
    <div className="2xl:w-[1500px] xl:w-[1300px] lg:w-[1000px] md:w-[820px]  h-[710px] overflow-hidden">
      <div className="  p-2">
        <DetailsUser userInfo={user} />
      </div>
    </div>
  );
};

export default Profile;
