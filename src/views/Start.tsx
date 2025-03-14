import { toast } from "sonner";
import RegistrationTable from "../components/registrationTable/RegistrationTable";
import { useNotifications } from "../hooks/useNotifications";
import RegistrationTableR from "../components/registrationTable/RegistrationTableR";
import Menu from "../components/Menu";

export default function Start() {
  // const notifications = useNotifications();
  // toast(notifications);
  return (
    <>
      {/* <SideBar /> */}
      <Menu />
      {/* //! scroll global menos a 769 solucionado con overflow-hidden */}
      <main className=" w-auto h-[830px] text-center overflow-hidden  flex flex-col items-center justify-start bg-white shadow-xlrounded-md  sm:m-4 mt-4">
        <section className="">
          <h1 className="text-3xl   mt-5">Bienvenido</h1>

          <div className="mt-4 ">
            {/* <RegistrationTable /> */}
            <RegistrationTableR />
          </div>
        </section>
      </main>
    </>
  );
}
