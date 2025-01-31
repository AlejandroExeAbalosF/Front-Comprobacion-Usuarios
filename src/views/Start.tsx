import { toast } from "sonner";
import RegistrationTable from "../components/registrationTable/RegistrationTable";
import { useNotifications } from "../components/UseNotifications";

export default function Start() {
  // const notifications = useNotifications();
  // toast(notifications);
  return (
    <>
      {/* <SideBar /> */}
      <main className=" w-auto h-[94vh] text-center   flex flex-col items-center justify-start bg-white shadow-xlrounded-md  m-4">
        <section className="">
          <h1 className="text-3xl  underline mt-5">Bienvenido</h1>

          <div className="mt-14">
            <RegistrationTable />
          </div>
        </section>
      </main>
    </>
  );
}
