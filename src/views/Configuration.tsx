import Menu from "../components/Menu";
import { useNavigate } from "react-router-dom";
import { useAppSelector } from "../redux/hooks";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Route, Routes, Link } from "react-router-dom";
import Profile from "../components/Profile";
import NonLaborDates from "../components/NonLaborDates";
import { BsCalendarWeek } from "react-icons/bs";
import { ImProfile } from "react-icons/im";
import { IoMdArrowRoundBack } from "react-icons/io";

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
    { id: "perfil", name: "Perfil", label: <ImProfile className="w-7 h-7" />, path: "/configuracion/perfil" },
    {
      id: "fechas_no_laboral",
      name: "Fechas no laborales",
      label: <BsCalendarWeek className="w-[26px] h-[26px]" />,
      path: "/configuracion/fechas_no_laboral",
    },
  ];
  return (
    <>
      {/* <SideBar /> */}
      <Menu />
      <main className=" w-auto h-[830px] text-center   flex flex-col items-center justify-start bg-white shadow-xlrounded-md  m-4">
        <div className="relative 2xl:w-[1550px] xl:w-[1380px] lg:w-[1080px] md:w-[900px] flex flex-col  mt-5 w-full">
          {/* Icono alineado a la izquierda */}
          <IoMdArrowRoundBack
            className="absolute  left-4 w-10 h-10 cursor-pointer"
            onClick={() => navigate("/inicio")}
            title="Volver"
          />

          {/* Título centrado */}

          <h1 className="text-3xl ml-[80px]">Configuración</h1>
        </div>
        <div
          className="flex 2xl:w-[1570px] 
       
        mt-4 "
        >
          <div>
            {tabs.map((tab) => (
              <Link to={tab.path} key={tab.id} style={{ textDecoration: "none" }}>
                <motion.div
                  style={{
                    padding: "10px",
                    cursor: "pointer",
                    backgroundColor: activeTab === tab.path ? "#f0f8ff" : "#fff",
                  }}
                  className="w-[80px] flex flex-col items-center justify-center"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveTab(tab.path)}
                  title={`${tab.name}`}
                >
                  <div className="flex flex-col justify-center items-center">
                    {tab.label}
                    <p className="text-sm leading-[13px] font-normal mt-1 ">{tab.name}</p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
          <div className="w-full bg-[#f0f8ff] overflow-hidden ">
            <Routes>
              <Route path="perfil" element={<Profile userInfo={user} />} />
              <Route path="fechas_no_laboral" element={<NonLaborDates />} />
              <Route
                path="/"
                element={
                  <div className="2xl:w-[1500px] xl:w-[1300px] lg:w-[1000px] md:w-[820px]  h-[710px]">
                    <div>Selecciona una pestaña</div>
                  </div>
                }
              />
            </Routes>
          </div>
        </div>
      </main>
    </>
  );
}
