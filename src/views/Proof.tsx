import { motion } from "framer-motion";

export default function Proof() {
  return (
    <main className="inset-0 flex justify-center items-center  p-4 ">
      <section className="w-[1400px] h-[1500px] text-center  m-0 flex flex-col items-center justify-start bg-white shadow-xl p-24 rounded-md">
        <h1>Pagina de prueba</h1>
        <div>
          <div className="swal2-icon swal2-error swal2-animate-error-icon" style={{ display: "flex" }}>
            <span className="swal2-x-mark ">
              <span className="swal2-x-mark-line-left"></span>
              <span className="swal2-x-mark-line-right"></span>
            </span>
          </div>
          <div className="dummy-positioning d-flex">
            <div className="success-icon">
              <div className="success-icon__tip"></div>
              <div className="success-icon__long"></div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
