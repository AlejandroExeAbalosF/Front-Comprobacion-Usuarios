import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { INotificaciónData, IRegistration } from "../helpers/types";
import { toast } from "sonner";

const BACK_API_URL = import.meta.env.VITE_LOCAL_API_URL;
const socket = io(BACK_API_URL); // Asegúrate de que la URL es la correcta

export function useNotifications() {
  const [notifications, setNotifications] = useState<INotificaciónData>();

  useEffect(() => {
    socket.on("employeeValidated", (data) => {
      if (data.validated) {
        toast.success(`Empleado ${data.name} ${data.lastName} ha ingresado`);
      } else {
        toast.info(`Empleado ${data.name} ${data.lastName} ha salido`);
      }
      console.log("Empleado validado:", data);
      setNotifications(data);
    });
    return () => {
      socket.off("employeeValidated");
    };
  }, []);

  return notifications;
}
