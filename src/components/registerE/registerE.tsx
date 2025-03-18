import { useEffect, useRef, useState } from "react";
import Webcam from "react-webcam";
import "./styles/iconError.css";
import "./styles/iconSuccess.css";
import axios from "axios";
import validateInputRegisterE from "./helpers/validateInputRegisterE";
import Buttonn from "../Buttonn";
const BACK_API_URL = import.meta.env.VITE_LOCAL_API_URL;
const RegisterE = () => {
  // const BACK_API_URL = import.meta.env.VITE_LOCAL_API_URL;
  const initialState = {
    document: "",
  };

  const initialIsMsg = {
    type: "loading",
    message: "Cargando...",
    status: "",
  };

  const webcamRef = useRef<Webcam>(null);
  //   const [cameraAvailable, setCameraAvailable] = useState(false);
  // const [imgSrc, setImgSrc] = useState<string | null>(null);
  const [isCameraReady, setIsCameraReady] = useState(false);

  const [userDataInputs, setUserDataInputs] = useState(initialState);
  const [errors, setErrors] = useState<{ [key: string]: string }>(initialState);

  const [isLoading, setIsLoading] = useState(false);
  const [isMsg, setIsMsg] = useState(initialIsMsg);

  const [cameraAvailable, setCameraAvailable] = useState<boolean | null>(null); // Estado para indicar si hay cámaras

  useEffect(() => {
    const checkCameras = async () => {
      try {
        // Comprobamos que mediaDevices esté disponible antes de intentar acceder a él
        if (navigator.mediaDevices && typeof navigator.mediaDevices.enumerateDevices === "function") {
          const devices = await navigator.mediaDevices.enumerateDevices();
          const videoDevices = devices.filter((device) => device.kind === "videoinput");
          setCameraAvailable(videoDevices.length > 0);
        } else {
          console.error("navigator.mediaDevices no está disponible");
          setCameraAvailable(false);
        }
      } catch (error) {
        console.error("Error al enumerar dispositivos:", error);
        setCameraAvailable(false);
      }
    };

    const handleDeviceChange = () => {
      console.log("Cambio detectado en dispositivos.");
      checkCameras(); // Volvemos a verificar las cámaras disponibles
    };

    // Verificamos si addEventListener está disponible
    if (navigator.mediaDevices && typeof navigator.mediaDevices.addEventListener === "function") {
      navigator.mediaDevices.addEventListener("devicechange", handleDeviceChange);
    }

    // Comprobamos las cámaras al cargar el componente
    checkCameras();

    // Limpiamos el listener cuando se desmonta el componente
    return () => {
      if (navigator.mediaDevices && typeof navigator.mediaDevices.removeEventListener === "function") {
        navigator.mediaDevices.removeEventListener("devicechange", handleDeviceChange);
      }
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setUserDataInputs({
      ...userDataInputs,
      [name]: value,
    });

    setErrors(validateInputRegisterE({ ...userDataInputs, [name]: value }));
  };

  // Convertir Data URL a File
  const convertDataURLToFile = (dataUrl: string, filename = "captured_image") => {
    const arr = dataUrl.split(",");
    const mime = arr[0].match(/:(.*?);/)?.[1] ?? ""; //Posible inconveniente: Si mime queda como "", el código usará la extensión .png por defecto.

    // Diccionario para asignar la extensión según el tipo MIME
    const mimeToExt: Record<string, string> = {
      "image/jpeg": ".jpg",
      "image/png": ".png",
      "image/jpg": ".jpg",
    };

    const extension = mimeToExt[mime] || ".png"; // Usa .png por defecto si no se reconoce el tipo
    filename = filename.includes(".") ? filename : filename + extension; // Asegurar la extensión

    const bstr = atob(arr[1]);
    let n = bstr.length;
    const u8arr = new Uint8Array(n);
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n);
    }

    return new File([u8arr], filename, { type: mime });
  };
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    // capture();
    console.log(userDataInputs);
    setIsLoading(true);
    setIsMsg({ type: "loading", message: "Cargando...", status: "" });
    console.log(isCameraReady);
    // if (webcamRef.current) {

    //   console.log("Captura:", imageSrc);
    //   setImgSrc(imageSrc);
    //   console.log("imagenxxx", imgSrc );
    // }
    const imageSrc = webcamRef.current ? webcamRef.current.getScreenshot() : null;

    // console.log("Captura:", imageSrc);
    if (cameraAvailable && isCameraReady && imageSrc !== null) {
      const newRegister = Number(userDataInputs.document);
      console.log("Captura: direta", imageSrc);
      const img = convertDataURLToFile(imageSrc, "file");
      console.log("img", img);
      const formData = new FormData();
      formData.append("document", newRegister.toString());
      formData.append("file", img);
      // const document = Numbeimg(userDataInputs.document);
      // const file = {
      //   file: formData.imget("file"),
      //   ducument: formData.get("document"),
      // };

      console.log(formData);

      axios
        .post(`${BACK_API_URL}/registrations/dniAndCature`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        })
        .then(({ data }) => {
          console.log("data", data);
          console.log(data);
          setIsMsg({ type: "success", message: data.message, status: data?.status });
          setUserDataInputs(initialState);
          setErrors(initialState);
          setTimeout(() => {
            setIsLoading(false);
          }, 3000);
        })
        .catch((error) => {
          setIsMsg({ type: "error", message: error.response?.data.message || "Hubo un Problema", status: "" }); //mejorar el diseño al recibir muchos errores
          setTimeout(() => {
            setIsLoading(false);
          }, 3000);
        });

      // setIsMsg({ type: "success", message: "Se ha registrado con exito" });

      // // setImgSrc(null);
    } else {
      // setImgSrc(null);
      setIsMsg({ type: "error", message: "Conecte el dispositivo y/o espere un momento", status: "" });
      setTimeout(() => {
        setIsLoading(false);
      }, 3000);
    }
    // console.log(isMsg);
  };

  // const capture = () => {
  //   if (webcamRef.current) {
  //     const imageSrc = webcamRef.current.getScreenshot();

  //     setImgSrc(imageSrc);
  //     // console.log("imagenxxx", imgSrc );
  //   }
  // };

  return (
    <>
      {isLoading ? (
        <>
          {isMsg.type === "loading" ? (
            <section className="w-[400px] h-[500px] text-center  m-0 flex flex-col items-center justify-start  shadow-xl p-24 rounded-md bg-white ">
              <div role="status">
                <svg
                  aria-hidden="true"
                  className="w-40 h-40 text-gray-200 animate-spin dark:text-gray-600 fill-blue-600"
                  viewBox="0 0 100 101"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M100 50.5908C100 78.2051 77.6142 100.591 50 100.591C22.3858 100.591 0 78.2051 0 50.5908C0 22.9766 22.3858 0.59082 50 0.59082C77.6142 0.59082 100 22.9766 100 50.5908ZM9.08144 50.5908C9.08144 73.1895 27.4013 91.5094 50 91.5094C72.5987 91.5094 90.9186 73.1895 90.9186 50.5908C90.9186 27.9921 72.5987 9.67226 50 9.67226C27.4013 9.67226 9.08144 27.9921 9.08144 50.5908Z"
                    fill="currentColor"
                  />
                  <path
                    d="M93.9676 39.0409C96.393 38.4038 97.8624 35.9116 97.0079 33.5539C95.2932 28.8227 92.871 24.3692 89.8167 20.348C85.8452 15.1192 80.8826 10.7238 75.2124 7.41289C69.5422 4.10194 63.2754 1.94025 56.7698 1.05124C51.7666 0.367541 46.6976 0.446843 41.7345 1.27873C39.2613 1.69328 37.813 4.19778 38.4501 6.62326C39.0873 9.04874 41.5694 10.4717 44.0505 10.1071C47.8511 9.54855 51.7191 9.52689 55.5402 10.0491C60.8642 10.7766 65.9928 12.5457 70.6331 15.2552C75.2735 17.9648 79.3347 21.5619 82.5849 25.841C84.9175 28.9121 86.7997 32.2913 88.1811 35.8758C89.083 38.2158 91.5421 39.6781 93.9676 39.0409Z"
                    fill="currentFill"
                  />
                </svg>
                <span className="sr-only">{isMsg.message}</span>
              </div>
            </section>
          ) : isMsg.type === "error" ? (
            <section className="w-[400px] h-[500px] text-center  m-0 flex flex-col items-center justify-start  shadow-xl p-24 rounded-md bg-[#f5ebec] ">
              <div className="w-[400px] h-[500px]  m-0 ">
                <div className="swal2-icon swal2-error swal2-animate-error-icon" style={{ display: "flex" }}>
                  <span className="swal2-x-mark ">
                    <span className="swal2-x-mark-line-left"></span>
                    <span className="swal2-x-mark-line-right"></span>
                  </span>
                </div>
              </div>
              <h1 className="text-2xl ">{isMsg.message}</h1>
            </section>
          ) : isMsg.type === "success" ? (
            isMsg.status === "TRABAJANDO" || isMsg.status === "PRESENTE" ? (
              <section className="w-[400px] h-[500px] text-center  m-0 flex flex-col items-center justify-start bg-[#ebf5ee] shadow-xl p-24 rounded-md">
                <div className="dummy-positioning d-flex">
                  <div className="success-icon">
                    <div className="success-icon__tip"></div>
                    <div className="success-icon__long"></div>
                  </div>
                </div>
                <h1 className="text-2xl ">{isMsg.message}</h1>
              </section>
            ) : (
              <section className="w-[400px] h-[500px] text-center  m-0 flex flex-col items-center justify-start bg-[#f5f5eb] shadow-xl p-24 rounded-md">
                <div className="screenAlert-icon screenAlert-warning scaleWarning">
                  <span className="screenAlert-body pulseWarningIns"></span>
                  <span className="screenAlert-dot pulseWarningIns"></span>
                </div>
                <h1 className="text-2xl ">{isMsg.message}</h1>
              </section>
            )
          ) : null}
        </>
      ) : (
        <section className="w-[400px] h-[500px] text-center  m-0 flex flex-col items-center justify-start bg-white shadow-xl p-24 rounded-md">
          <h1 className="text-2xl ">Ingrese su numero de documento</h1>
          <form onSubmit={handleSubmit} className="relative  group ">
            <input
              autoComplete="off"
              type="text"
              name="document"
              value={userDataInputs.document}
              onChange={handleChange}
              className={`mt-11 block px-2 h-[35px]  text-black py-2.5  w-[200px]
                text-sm  bg-transparent border-2  border-gray-300 appearance-none  dark:border-gray-600  focus:outline-none focus:ring-0 focus:border-[#4151cada] peer rounded-lg ${
                  errors.document ? "focus:border-red-600 dark:border-red-600" : "focus:border-[#4151cada]"
                }`}
            />
            {errors.document ? <span className="absolute  text-red-500 block w-full text-[12px]">{errors.document}</span> : null}

            {/* <button
              type="submit"
              // onClick={capture}
              disabled={userDataInputs.document.length === 0 || Object.keys(errors).some((e) => errors[e])}
              className={`text-center my-11  w-[200px] h-[40px] bg-[#d0ebdb]  hover:bg-[#c4ebd4] hover:shadow-xl text-black font-semibold hover:text-black    hover:border-transparent rounded-lg ${
                userDataInputs.document.length === 0 || Object.keys(errors).some((e) => errors[e])
                  ? "opacity-50 cursor-not-allowed disabled"
                  : ""
              }`}
            >
              Continuar
            </button> */}
            <Buttonn
              // onClick={capture}
              disabled={userDataInputs.document.length === 0 || Object.keys(errors).some((e) => errors[e])}
              text="Continuar"
            />
          </form>
          <Webcam
            onUserMedia={() => setIsCameraReady(true)} // Marca la cámara como lista
            screenshotFormat="image/png"
            ref={webcamRef}
            videoConstraints={{
              width: 1280,
              height: 720,
              facingMode: "user", // Cámara frontal
            }}
            style={{
              visibility: "hidden", // Oculta el componente pero mantiene el flujo activo
              position: "absolute", // Opcional: Retira del flujo visual
              width: "1280px", // Mantén un tamaño visible para que el flujo funcione
              height: "720px",
            }}
          />
          {/* {imgSrc && <img src={imgSrc} alt="Captura de pantalla" />} */}
        </section>
      )}
    </>
  );
};

export default RegisterE;
