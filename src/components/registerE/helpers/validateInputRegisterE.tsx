import { IDni } from "../../../helpers/types";

const validateInputRegisterE = ({ document }: IDni) => {
  const onlypositivenumbers = /^[0-9]+$/;
  const errors = {
    document: "",
  };

  if (!document) {
    errors.document = "Ingresa tu documento.";
  } else if (document.trim().length !== 8) {
    errors.document = "Documento invalido.";
  } else if (!onlypositivenumbers.test(document)) {
    errors.document = "Este campo solo admite números.";
  }

  return errors;
};

export default validateInputRegisterE;
