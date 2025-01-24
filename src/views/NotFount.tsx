import { Link } from "react-router-dom";

export default function NotFount() {
    return (
        <main className="inset-0 flex justify-center items-center  p-4 ">
            <section className="w-[400px] h-[500px] text-center  m-0 flex flex-col items-center justify-start bg-white shadow-xl p-24 rounded-md">
                <h1>Pagina no encontrada</h1>
                <div className="text-[#5786eb] flex flex-col items-center mt-40">
                    <Link to="/"><span>Ir a Inicio</span></Link>                    
                </div>
            </section>
            </main>
    )
}