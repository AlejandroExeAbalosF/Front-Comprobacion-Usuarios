import RegistrationTableR from "../components/registrationTable/RegistrationTableR";
import Menu from "../components/Menu";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { BrowserRouter as Router, Route, Routes, Link, useLocation, Outlet } from "react-router-dom";
import Profile from "../components/Profile";
import NonLaborDates from "../components/NonLaborDates";
import DetailsUser from "../components/DetailsUser";

export default function Configuration() {
  const navigate = useNavigate();
  const user = useAppSelector((state) => state.auth.user); // Obtén el usuario desde Redux
  const [activeTab, setActiveTab] = useState(location.pathname);

  useEffect(() => {
    if (user?.rol !== "admin") {
      navigate("/inicio"); // Redirige a la página principal si el usuario no es admin
    }
  }, [user, navigate]);

  const tabs = [
    { id: "perfil", label: "Perfil", path: "/configuracion/perfil" },
    { id: "fechas_no_laboral", label: "Fechas No Laboral", path: "/configuracion/fechas_no_laboral" },
  ];
  return (
    <>
      {/* <SideBar /> */}
      <Menu />
      <main className=" w-auto h-[830px] text-center   flex flex-col items-center justify-start bg-white shadow-xlrounded-md  m-4">
        <section className="">
          <h1 className="text-3xl   mt-5">Configuración</h1>
        </section>
        <div className="flex 2xl:w-[1550px] lg:w-[1200px] md:w-[900px]  h-[700px] mt-4 ">
          <div style={{ width: "200px" }}>
            {tabs.map((tab) => (
              <Link to={tab.path} key={tab.id} style={{ textDecoration: "none" }}>
                <motion.div
                  style={{
                    padding: "10px",
                    margin: "5px 0",
                    cursor: "pointer",
                    backgroundColor: activeTab === tab.path ? "#F9FAFB" : "#fff",
                    borderRadius: "5px",
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.path)}
                >
                  {tab.label}
                </motion.div>
              </Link>
            ))}
          </div>
          <div className="w-full bg-[#F9FAFB]">
            <Routes>
              <Route path="perfil" element={<Profile userInfo={user} />} />
              <Route path="fechas_no_laboral" element={<NonLaborDates />} />
              <Route path="/" element={<div>Selecciona una pestaña</div>} />
            </Routes>
          </div>
        </div>
      </main>
    </>
  );
}
