import { useState } from "react";

const RegisterE = () => {
    const initialState = {
        dni: '',
    }

    const [userDataInputs, setUserDataInputs] = useState(initialState);

    const handleChange = (e : React.ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target;
    
        setUserDataInputs({
          ...userDataInputs,
          [name]: value,
        });
      };

      const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        console.log(userDataInputs);
        
        
    };

    return (
        <form onSubmit={handleSubmit}>
            <input type="text" 
            name="dni"
            value={userDataInputs.dni}

            onChange={handleChange} 
            className="mt-11 block px-2 h-[35px]  text-black py-2.5  w-[200px]
            text-sm  bg-transparent border-2  border-gray-300 appearance-none  dark:border-gray-600  focus:outline-none focus:ring-0 focus:border-green-600 peer rounded-lg" />

            <button
            type="submit"
            className=" my-11  w-[200px] h-[40px]  hover:bg-[#d0ebdb] hover:shadow-xl text-black font-semibold hover:text-black py-2 px-4 border hover:border-transparent rounded-lg"
            >
                Continuar
            </button>
        </form>
    )
}

export default RegisterE