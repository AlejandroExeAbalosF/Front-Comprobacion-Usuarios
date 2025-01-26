import { Link } from "react-router-dom";

export default function Home() {
  return (
    <main className="inset-0 flex justify-center items-center  p-4  ">
      <section className="w-[400px] h-[500px] text-center  m-0 flex flex-col items-center justify-start bg-white shadow-xl p-24 rounded-md">
        <h1 className="text-3xl  underline">Bienvenido</h1>
        <h3 className="mt-4"> Que desea hacer?</h3>
        <div className="text-[#5786eb]  flex flex-col items-center mt-40">
          <Link to="/iniciar_sesion">
            <span>Iniciar Sesión</span>
          </Link>
          <Link to="/validacion_de_empleado">
            <span>Ir a Registro de Empleados</span>
          </Link>
        </div>
      </section>
    </main>
  );
}
