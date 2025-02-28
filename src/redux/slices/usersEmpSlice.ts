import { createSlice, current, PayloadAction } from "@reduxjs/toolkit";
import { IRegistration, IUser } from "../../helpers/types";

type FilterColumnType = "Empleados" | "Ingreso" | "Estado" | "Documento" | "Rol";

interface IFilterColumn {
  type: FilterColumnType;
  order: boolean;
}

interface UsersState {
  users: IUser[];
  usersFilter: IUser[];
  searchTerm: string;
  filterColumn: IFilterColumn;
  highlightedUserId: string;
}

const initialState: UsersState = {
  users: [],
  usersFilter: [],
  searchTerm: "",
  filterColumn: { type: "Empleados", order: false },
  highlightedUserId: "",
};

const usersEmpSlice = createSlice({
  name: "usersEmp",
  initialState,
  reducers: {
    setUsers(state, action: PayloadAction<IUser[]>) {
      state.users = action.payload || []; // Asegurar que sea un array
      state.usersFilter = [...state.users]; // Copia válida del array
    },
    addUser(state, action: PayloadAction<IUser>) {
      const newUser = action.payload;

      // Filtrar la lista para eliminar el usuario viejo si existe
      // Elimina la versión anterior del usuario (si existe) y agrega el nuevo al inicio
      state.users = [newUser, ...state.users.filter((user) => user.id !== newUser.id)];
      state.usersFilter = [newUser, ...state.usersFilter.filter((user) => user.id !== newUser.id)];

      // Guardamos el ID del usuario resaltado
      state.highlightedUserId = newUser.id;
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
      state.usersFilter = state.users.filter((user) =>
        `${user.name} ${user.lastName} ${user.document} ${user.email}`.toLowerCase().includes(action.payload.toLowerCase())
      );
    },
    setFilterColumn(state, action: PayloadAction<IFilterColumn>) {
      state.filterColumn = action.payload;
      state.usersFilter = sortUsers(action.payload, state.users);
    },
    updateUserFromNotification(state, action: PayloadAction<any[]>) {
      // const notifications = action.payload;

      // const updatedUsers = state.users.map((user) =>{
      //   // console.log("duser.registe", user);
      //   const ab = user.id === notification?.id
      //     ? {
      //         ...user,
      //         registrations: updateRegistrations(user.registrations, notification),
      //       }
      //     : user
      //     if(user.id === notification?.id){
      //       console.log("user.registe",current(user) );
      //       console.log("Aver",updateRegistrations(user.registrations, notification));
      //       const up = {
      //         ...user,
      //         registrations: updateRegistrations(user.registrations, notification),
      //       }
      //       console.log("up",up);
      //     }
      //     console.log("updateRegistrations", user.id === notification?.id ? user : "nada");
      //     return ab
      // }
      // );
      //     let updatedUsers = state.users.map((user) => {
      //       if (user.id === action.payload?.id) {
      //         const updatedRegistrations = updateRegistrations(user.registrations, action.payload);
      //         // console.log("🔹 Antes:", current(user.registrations));
      //         // console.log("🔹 Después:", updatedRegistrations);

      //         return {
      //           ...user,
      //           registrations: updatedRegistrations,
      //         };
      //       }
      //       return user;
      //     });
      //     // console.log("updatedUsers", updatedUsers);

      //      // Si el filtro actual es "Ingreso" y la notificación es "present"
      // if (state.filterColumn.type === "Ingreso" && notification?.type === "present") {
      //   const updatedUserIndex = updatedUsers.findIndex(user => user.id === notification?.id);
      //   if (updatedUserIndex !== -1) {
      //     const updatedUser = updatedUsers[updatedUserIndex]; // Obtener el usuario sin eliminarlo
      //     updatedUsers = updatedUsers.filter(user => user.id !== notification?.id); // Eliminarlo de la lista
      //     updatedUsers.unshift(updatedUser); // Moverlo al inicio
      //   }
      // }

      const notifications = action.payload;
      console.log("noti en redux", notifications);
      let updatedUsers = state.users.map((user) => {
        const notification = notifications.find((n) => n.id === user.id);
        if (notification) {
          return {
            ...user,
            registrations: updateRegistrations(user.registrations, notification),
          };
        }
        return user;
      });

      // Si el filtro actual es "Ingreso", mover los usuarios actualizados al inicio
      if (state.filterColumn.type === "Ingreso") {
        const updatedUserIds = new Set(notifications.map((n) => n.id));
        // Guardamos el ID del usuario resaltado
        state.highlightedUserId = notifications[0].id;
        updatedUsers = [
          ...updatedUsers.filter((user) => updatedUserIds.has(user.id)), // Usuarios actualizados primero
          ...updatedUsers.filter((user) => !updatedUserIds.has(user.id)), // Luego los demás
        ];
      }

      // Aplicar nuevamente el ordenamiento sin perder el filtro
      state.users = updatedUsers;
      state.usersFilter = sortUsers(state.filterColumn, updatedUsers);
    },
    updateUserRegister(state, action: PayloadAction<any>) {
      const register = action.payload;
      console.log("register", register);
      console.log("state.users", current(state.users));
      const user = state.users.find((user) => user.id === register.id);
      if (user) console.log("user",current(user));
    }
  },
});

const updateRegistrations = (registrations: IRegistration[], notification: any) => {
  return registrations?.length
    ? registrations.map((reg) =>
        reg.id === notification.idR
          ? {
              ...reg,
              status: notification.status,
              entryDate:
                reg.entryDate ||
                (notification.status === "TRABAJANDO" || notification.status === "AUSENTE" ? notification.date : undefined),
              entryCapture: reg.entryCapture || (notification.status === "TRABAJANDO" ? notification.capture : undefined),
              exitDate: notification.status === "PRESENTE" ? notification.date : reg.exitDate,
              exitCapture: notification.status === "PRESENTE" ? notification.capture : reg.exitCapture,
              type: notification?.type,
            }
          : {
              ...reg, // Mantenemos los campos originales ?
              id: notification.idR,
              status: notification.status,
              entryDate:
                notification.status === "TRABAJANDO" || notification.status === "AUSENTE" ? notification.date : undefined,
              entryCapture: notification.status === "TRABAJANDO" ? notification.capture : undefined,
              exitDate: notification.status === "PRESENTE" ? notification.date : undefined,
              exitCapture: notification.status === "PRESENTE" ? notification.capture : undefined,
              type: notification?.type,
            }
      )
    : [
        {
          id: notification.idR,
          status: notification.status,
          entryDate: notification.status === "TRABAJANDO" || notification.status === "AUSENTE" ? notification.date : undefined,
          entryCapture: notification.status === "TRABAJANDO" ? notification.capture : undefined,
          exitDate: notification.status === "PRESENTE" ? notification.date : undefined,
          exitCapture: notification.status === "PRESENTE" ? notification.capture : undefined,
          type: notification?.type,
        },
      ];
};

const sortUsers = (filterColumn: IFilterColumn, users: IUser[]) => {
  const sortedUsers = users.slice().sort((a, b) => {
    switch (filterColumn.type) {
      case "Empleados":
        return filterColumn.order ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name);
      case "Ingreso":
        const dateA = a.registrations[0]?.entryDate ? new Date(a.registrations[0].entryDate).getTime() : 0;
        const dateB = b.registrations[0]?.entryDate ? new Date(b.registrations[0].entryDate).getTime() : 0;
        return filterColumn.order ? dateB - dateA : dateA - dateB;
      case "Estado":
        const priority = { TRABAJANDO: 1, PRESENTE: 2, AUSENTE: 3 };
        const typeA = a.registrations[0]?.status || "AUSENTE";
        const typeB = b.registrations[0]?.status || "AUSENTE";
        return filterColumn.order ? priority[typeA] - priority[typeB] : priority[typeB] - priority[typeA];
      case "Documento":
        return filterColumn.order ? a.document - b.document : b.document - a.document;
      case "Rol":
        return filterColumn.order ? b.rol.localeCompare(a.rol) : a.rol.localeCompare(b.rol);
      default:
        return 0;
    }
  });

  return sortedUsers; // Devolver nuevo array sin modificar el original
};

export const { setUsers, setSearchTerm, setFilterColumn, updateUserFromNotification, addUser , updateUserRegister} = usersEmpSlice.actions;
export default usersEmpSlice.reducer;
