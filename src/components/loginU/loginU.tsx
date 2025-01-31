import { useState } from "react";
import { dataInputs } from "./helpers/dataInputs";
import { Link } from "react-router-dom";
import Buttonn from "../Buttonn";

const LoginU = () => {
  const initialState = {
    username: "",
    password: "",
  };
  const [userDataInputs, setUserDataInputs] = useState(initialState);
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, name } = e.target;

    setUserDataInputs({
      ...userDataInputs,
      [name]: value,
    });
  };

  const handleSubmit = (e: React.MouseEvent<HTMLFormElement>) => {
    e.preventDefault();
    console.log(userDataInputs);
  };
  return (
    <form onSubmit={handleSubmit} className="mt-11">
      {dataInputs.map(({ name, placeholder, type }) => {
        return (
          <div key={name} className="relative z-0  mb-6 group ">
            <input
              id={name}
              type={type}
              name={name}
              value={userDataInputs[name as keyof typeof userDataInputs]}
              className="block px-2 h-[35px]  text-black py-2.5  w-[200px]
                      text-sm  bg-transparent border-2  border-gray-300 appearance-none  dark:border-gray-600  focus:outline-none focus:ring-0 focus:border-[#4151cada] peer rounded-lg"
              placeholder=" "
              onChange={handleChange}
            />
            <label
              htmlFor="floating_email"
              className="peer-focus:text-sm  absolute text-[13px]  duration-300 transform -translate-y-6 scale-75 top-[13px]  origin-[0] peer-focus:start-3 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-[#4151cada] peer-focus:dark:text-[#4151cada] peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-[6px] peer-focus:scale-75 peer-focus:-translate-y-6 bg-white left-3 px-1 pointer-events-none"
            >
              {placeholder}
            </label>
          </div>
        );
      })}
      <Buttonn>
        <Link to="/inicio">Continuar</Link>
      </Buttonn>
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
