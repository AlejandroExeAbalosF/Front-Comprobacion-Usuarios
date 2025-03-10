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
      <main className=" w-auto h-[830px] text-center   flex flex-col items-center justify-start bg-white shadow-xlrounded-md  m-4">
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
