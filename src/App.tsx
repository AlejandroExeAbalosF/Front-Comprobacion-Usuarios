// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import './App.css'
import { Route, Routes, useLocation } from 'react-router-dom';
import Home from './views/Home';
import LoginEmployee from './views/LoginEmployee';
import NotFount from './views/NotFount';

function App() {
  const location = useLocation();

  return (
    <>
     <Routes>
      <Route path='/' element={<Home/>}/>
      <Route path='/validacion_de_empleado' element={<LoginEmployee/>}/>
      <Route path='*' element={<NotFount/>}/>
     </Routes>
    </>
  )
}

export default App
