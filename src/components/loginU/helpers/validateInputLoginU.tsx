interface LoginInput {
  username: string;
  password: string;
}
const validateInputLoginU = ({ username, password }: LoginInput) => {
  const passwordRegExp = /^(?=.*[A-Z])(?=.*[a-z])(?=.*\d)(?=.*\W)(?!.*\s).{8,15}$/;
  // const onlypositivenumbers = /^[0-9]+$/;
  const errors = {
    username: "",
    password: "",
  };

  if (!username) {
    errors.username = "Ingresa tu usuario.";
  }

  if (!password) errors.password = " ";
  else if (!passwordRegExp.test(password))
    errors.password = "Almenos: una mayúscula, una minúscula, un carácter especial y un número.";

  return errors;
};

export default validateInputLoginU;
