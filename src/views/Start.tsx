import SideBar from "../components/sideBar/sideBar";
export default function Start() {
    return (
        <>
        <SideBar/>
        <main className=" w-auto h-[94vh] text-center   flex flex-col items-center justify-start bg-white shadow-xlrounded-md  m-4">
            <section className="">
                <h1 className="text-3xl  underline">
                    Bienvenido
                </h1>
                
            </section>
        </main>
        </>
    )
}