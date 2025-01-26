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

function App() {
  const location = useLocation();

  return (
    <>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/inicio" element={<Start />} />
        <Route path="/iniciar_sesion" element={<LoginUser />} />
        <Route path="/validacion_de_empleado" element={<RegisterEmployee />} />
        <Route path="*" element={<NotFount />} />
        <Route path="/prueba" element={<Proof />} />
      </Routes>
    </>
  );
}

export default App;
