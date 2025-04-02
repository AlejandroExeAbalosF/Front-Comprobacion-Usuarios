import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import { INotificaciónData } from "../helpers/types";
import { toast } from "sonner";
import dayjs from "dayjs";
import { BsFillRecordFill } from "react-icons/bs";
import { formatName } from "../utils/format";

const BACK_API_URL = import.meta.env.VITE_LOCAL_WEBSOCKET_URL_BACK;
const socket = io(BACK_API_URL, {
  transports: ["websocket"], // Usa solo WebSocket para evitar problemas con polling
  withCredentials: true, // Permite enviar cookies si el backend usa autenticación
}); // Asegúrate de que la URL es la correcta
socket.emit("message", "Hola desde el cliente!", (response) => {
  console.log(response); // "Mensaje recibido: Hola desde el cliente!"
});
export function useNotifications() {
  const [notifications, setNotifications] = useState<INotificaciónData[]>([]);

  useEffect(() => {
    socket.on("connect", () => {
      console.log("Conectado al WebSocket Server");
    });
    socket.on("employeeValidated", (data) => {
      if (data.status === "TRABAJANDO") {
        // toast.success(`Empleado ${data.name} ${data.lastName} ha ingresado`);
        toast(` ${formatName(data.name, data.lastName)} ha ingresado`, {
          className: ``,
          description: `${dayjs(data.entryDate).format("DD/MM/YYYY")} - ${dayjs(data.entryDate).format("HH:mm")}`,
          duration: 10000,
          icon: <BsFillRecordFill className="icon-notification w-6 h-6 text-green-500" />,
        });
      } else if (data.status === "PRESENTE") {
        toast(` ${formatName(data.name, data.lastName)} ha salido`, {
          className: ``,
          description: `${dayjs(data.exitDate).format("DD/MM/YYYY")} - ${dayjs(data.exitDate).format("HH:mm")}`,
          duration: 10000,
          icon: <BsFillRecordFill className="icon-notification w-6 h-6 text-red-500" />,
        });
      } else if (data.status === "AUSENTE") {
        toast(` ${formatName(data.name, data.lastName)} esta ausente`, {
          className: ``,
          description: `${dayjs(data.exitDate).format("DD/MM/YYYY")}`,
          duration: 10000,
          icon: <BsFillRecordFill className="icon-notification w-6 h-6 text-amber-500" />,
        });
      } else if (data.status === "NO_LABORABLE") {
        toast(` ${formatName(data.name, data.lastName)} registro día no laborable`, {
          className: ``,
          description: `${dayjs(data.exitDate).format("DD/MM/YYYY")}`,
          duration: 10000,
          icon: <BsFillRecordFill className="icon-notification w-6 h-6 text-gray-500" />,
        });
      }
      // console.log("Empleado validado:", data);
      setNotifications((prev) => [...prev, data]); // Acumular en el array
    });
    return () => {
      socket.off("employeeValidated");
    };
  }, []);
  // Función para limpiar las notificaciones
  const clearNotifications = () => setNotifications([]);

  return { notifications, clearNotifications };
}
