import LoginU from "../components/loginU/LoginU";

export default function LoginUser() {
  return (
    <main className="inset-0 flex justify-center items-center  p-4 ">
      <section className="relative w-[400px] h-[500px] text-center  m-0 flex flex-col items-center justify-start bg-white shadow-xl p-24 rounded-md">
        <h1 className="text-3xl  ">Bienvenido</h1>
        <LoginU />
      </section>
    </main>
  );
}
