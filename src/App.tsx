// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
// import './App.css'
import { Route, Routes, useLocation } from "react-router-dom";
import Home from "./views/Home";
import LoginEmployee from "./views/RegisterEmployee";
import NotFount from "./views/NotFount";
import LoginUser from "./views/LoginUser";
import Start from "./views/Start";
import RegisterEmployee from "./views/RegisterEmployee";
import Proof from "./views/Proof";
import { Toaster } from "sonner";
import InitAuth from "./components/InitAuth";
import ProtectedRoute from "./components/ProtectedRoute";
import "react-photo-view/dist/react-photo-view.css";
import "dayjs/locale/es";
import dayjs from "dayjs";
import Configuration from "./views/Configuration";
dayjs.locale("es");

function App() {
  const location = useLocation();

  return (
    <>
      {/* Inicializa Redux con los datos del usuario al cargar la página */}
      {/* <InitAuth /> */}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/iniciar_sesion" element={<LoginUser />} />
        <Route path="/validacion_de_empleado" element={<RegisterEmployee />} />
        <Route path="*" element={<NotFount />} />
        <Route path="/prueba" element={<Proof />} />
        <Route element={<ProtectedRoute />}>
          <Route path="/inicio" element={<Start />} />
          <Route path="/configuracion/*" element={<Configuration />} />
        </Route>
      </Routes>
      <Toaster expand={true} visibleToasts={9} closeButton />
    </>
  );
}

export default App;
