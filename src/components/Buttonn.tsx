// Definimos una interfaz con propiedades opcionales usando el operador '?'
interface ButtonProps {
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void; // onClick sigue siendo obligatorio
  disabled?: boolean; // disabled es opcional
  userDataInputs?: { document: string }; // userDataInputs es opcional
  errors?: { [key: string]: string | boolean }; // errors es opcional
  text?: string; // text es opcional
  children?: React.ReactNode;
}

const Button: React.FC<ButtonProps> = ({
  onClick,
  disabled = true, // Establecemos un valor por defecto para disabled
  text = "Continuar", // Establecemos un valor por defecto para text
  children,
}) => {
  // Calculamos si el botón debe estar deshabilitado basado en las condiciones
  const isDisabled = disabled;

  return (
    <button
      type="submit"
      onClick={onClick}
      disabled={isDisabled}
      className={`text-center my-11 w-[200px] h-[40px] bg-[#d0ebdb] hover:bg-[#c4ebd4] hover:shadow-xl text-black font-semibold hover:text-black hover:border-transparent rounded-lg ${
        isDisabled ? "opacity-50 cursor-not-allowed disabled" : ""
      }`}
    >
      {children || text} {/* Renderizamos children si se pasa, de lo contrario, mostramos el texto por defecto */}
    </button>
  );
};

export default Button;
