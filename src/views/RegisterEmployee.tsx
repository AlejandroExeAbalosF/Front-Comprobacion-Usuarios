import RegisterE from "../components/registerE/registerE";

export default function RegisterEmployee() {
    return (
        <main className="inset-0 flex justify-center items-center  p-4 ">
            <section className="w-[400px] h-[500px] text-center  m-0 flex flex-col items-center justify-start bg-white shadow-xl p-24 rounded-md">
                <h1 className="text-2xl ">
                Ingrese su numero de documento
                </h1>
                <RegisterE/>
            </section>
        </main>
    )
}