import { useState } from "react";
import Buttonn from "../Buttonn";
import { dataInputs } from "../loginU/helpers/dataInputs";
// import validateInputLoginU from "./helpers/validateInputLoginU";
import validateInputLoginU from "../loginU/helpers/validateInputLoginU";
import axios from "axios";
import { useAppDispatch } from "../../redux/hooks";
import { loginSuccess } from "../../redux/slices/authSlice";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
const BACK_API_URL = import.meta.env.VITE_LOCAL_API_URL;
const LoginU = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const initialState = {
    username: "",
    password: "",
  };
  const [userDataInputs, setUserDataInputs] = useState(initialState);
  const [errors, setErrors] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);

  // useEffect(() => {
  //   const input = document.getElementById("username");
  //   if (input) {
  //     const handleAutofill = () => {
  //       if (input.matches(":-webkit-autofill")) {
  //         console.log("autofill");
  //         input.classList.add("autofilled");
  //       } else {
  //         console.log("not autofill");
  //         input.classList.remove("autofilled");
  //       }
  //     };

  //     input.addEventListener("animationstart", handleAutofill, true);
  //     return () => {
  //       input.removeEventListener("animationstart", handleAutofill, true);
  //     };
  //   }
  // }, []);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setUserDataInputs({
      ...userDataInputs,
      [name]: value,
    });

    setErrors(validateInputLoginU({ ...userDataInputs, [name]: value }));
  };

  const handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    console.log("entrada", isLoading);
    console.log(userDataInputs);
    const data = {
      user: userDataInputs.username,
      password: userDataInputs.password,
    };

    axios
      .post(`${BACK_API_URL}/auth/signin`, data, { withCredentials: true })
      .then(({ data }) => {
        // console.log("data", data);
        setIsLoading(false);

        dispatch(loginSuccess({ user: data.user }));
        localStorage.setItem("validateUserArGobSal_user", JSON.stringify(data.user));

        navigate("/inicio");
      })
      .catch((error) => {
        console.error("Error al iniciar sesión:", error);

        if (axios.isAxiosError(error)) {
          if (error.code === "ERR_NETWORK") {
            toast.error("El servidor no está disponible. Intente más tarde.");
          } else if (error.response) {
            toast.error(error.response.data.message || "Error al iniciar sesión");
          } else {
            toast.error("Error de conexión");
          }
        } else {
          toast.error("Error inesperado");
        }
        setIsLoading(false);
      });
  };
  return (
    <form onSubmit={handleSubmit} className="mt-11 ">
      {isLoading && (
        <div className="absolute  inset-0 backdrop-blur-[1px] flex items-center justify-center rounded-md bg-[rgba(255,255,255,0.39)] z-50">
          <span className="loader_login"></span>
          {/* <p className="text-black">Cargando...</p> */}
        </div>
      )}
      {dataInputs.map(({ name, placeholder, type }) => {
        return (
          <div key={name} className="relative z-0  mb-6 group ">
            {/* <input
              id={name}
              type={type}
              name={name}
              value={userDataInputs[name as keyof typeof userDataInputs]}
              className={`mt-11 block px-2 h-[35px]  text-black py-2.5  w-[200px]
                text-sm  bg-transparent border-2  border-gray-300 appearance-none  dark:border-gray-600  focus:outline-none focus:ring-0 focus:border-[#4151cada] peer rounded-lg ${
                  errors[name as keyof typeof errors] ? "focus:border-red-600 dark:border-red-600" : "focus:border-[#4151cada]"
                }`}
              placeholder=" "
              onChange={handleChange}
            />
            <label
              htmlFor="floating_email"
              className="peer-focus:text-sm  absolute text-[13px]  duration-300 transform -translate-y-6 scale-75 top-[13px]  origin-[0] peer-focus:start-3 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#4151cada] peer-focus:dark:text-[#4151cada] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-[6px] peer-focus:scale-75 peer-focus:-translate-y-6 bg-white left-3 px-1 pointer-events-none"
            >
              {placeholder}
            </label> */}
            <div className="my-3 relative h-10 w-full min-w-[200px]">
              <input
                id={name}
                type={type}
                name={name}
                value={userDataInputs[name as keyof typeof userDataInputs]}
                className="peer h-full w-full rounded-[7px] border border-[#E2E8F0] border-t-transparent bg-transparent px-3 py-2.5 !pr-9 font-sans text-sm font-normal text-[#2B4B5B] outline outline-0 transition-all placeholder-shown:border placeholder-shown:border-[#E2E8F0] placeholder-shown:border-t-[#E2E8F0] focus:border-2 focus:border-gray-900 focus:border-t-transparent focus:outline-0 disabled:border-0 disabled:bg-[#F8FAFC]"
                placeholder=" "
                onChange={handleChange}
              />
              <label className="before:content[' '] after:content[' '] pointer-events-none absolute left-0 -top-1.5 flex h-full w-full select-none !overflow-visible truncate text-[11px] font-normal leading-tight text-gray-500 transition-all before:pointer-events-none before:mt-[6.5px] before:mr-1 before:box-border before:block before:h-1.5 before:w-2.5 before:rounded-tl-md before:border-t before:border-l before:border-[#E2E8F0] before:transition-all after:pointer-events-none after:mt-[6.5px] after:ml-1 after:box-border after:block after:h-1.5 after:w-2.5 after:flex-grow after:rounded-tr-md after:border-t after:border-r after:border-[#E2E8F0] after:transition-all peer-placeholder-shown:text-sm peer-placeholder-shown:leading-[3.75] peer-placeholder-shown:text-blue-gray-500 peer-placeholder-shown:before:border-transparent peer-placeholder-shown:after:border-transparent peer-focus:text-[11px] peer-focus:leading-tight peer-focus:text-gray-900 peer-focus:before:border-t-2 peer-focus:before:border-l-2 peer-focus:before:!border-gray-900 peer-focus:after:border-t-2 peer-focus:after:border-r-2 peer-focus:after:!border-gray-900 peer-disabled:text-transparent peer-disabled:before:border-transparent peer-disabled:after:border-transparent peer-disabled:peer-placeholder-shown:text-blue-gray-500">
                {placeholder}
              </label>
              {errors[name as keyof typeof errors] ? (
                <span className="absolute  text-red-500 block w-full text-[12px]">{errors[name as keyof typeof errors]}</span>
              ) : null}
            </div>
          </div>
        );
      })}
      <Buttonn
        disabled={userDataInputs.username.length === 0 || Object.keys(errors).some((e) => errors[e as keyof typeof errors])}
        text="Ingresar"
      />
      {/* <button
        // type="submit"
        className=" my-11  w-[200px] h-[40px]  hover:bg-[#d0ebdb] hover:shadow-xl text-black font-semibold hover:text-black py-2 px-4 border hover:border-transparent rounded-lg"
      >
        <Link to="/inicio">Continuar</Link>
      </button> */}
    </form>
  );
};

export default LoginU;
