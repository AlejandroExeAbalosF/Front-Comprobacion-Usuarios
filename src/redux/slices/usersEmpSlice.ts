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
}

const initialState: UsersState = {
  users: [],
  usersFilter: [],
  searchTerm: "",
  filterColumn: { type: "Empleados", order: false },
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
    
      // Agregar el nuevo usuario al inicio del array
      state.users = [newUser, ...state.users];
      state.usersFilter = [newUser, ...state.usersFilter];
    },
    setSearchTerm(state, action: PayloadAction<string>) {
      state.searchTerm = action.payload;
      state.usersFilter = state.users.filter((user) =>
        `${user.name} ${user.lastName} ${user.document} ${user.email}`
          .toLowerCase()
          .includes(action.payload.toLowerCase())
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
  // if (state.filterColumn.type === "Ingreso" && notification?.validated === "present") {
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
    const notification = notifications.find(n => n.id === user.id);
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
    const updatedUserIds = new Set(notifications.map(n => n.id));

    updatedUsers = [
      ...updatedUsers.filter(user => updatedUserIds.has(user.id)), // Usuarios actualizados primero
      ...updatedUsers.filter(user => !updatedUserIds.has(user.id)), // Luego los demás
    ];
  }

  // Aplicar nuevamente el ordenamiento sin perder el filtro
  state.users = updatedUsers;
  state.usersFilter = sortUsers(state.filterColumn, updatedUsers);
    },
  },
});

const updateRegistrations = (registrations: IRegistration[], notification: any) => {
  return registrations?.length
    ? registrations.map((reg) => 
        reg.id === notification.idR
          ? {
              ...reg,
              validated: notification.validated,
              entryDate: reg.entryDate || (notification.validated === "present" || notification.validated === "absent" ? notification.date : undefined),
              entryCapture: reg.entryCapture || (notification.validated === "present"  ? notification.capture : undefined),
              exitDate: notification.validated === "idle" ? notification.date : reg.exitDate,
              exitCapture: notification.validated === "idle" ? notification.capture : reg.exitCapture,
            }
          : {
            ...reg, // Mantenemos los campos originales ?
            id: notification.idR,
            validated: notification.validated,
            entryDate: notification.validated === "present" || notification.validated === "absent" ? notification.date : undefined,
            entryCapture: notification.validated === "present" ? notification.capture : undefined,
            exitDate: notification.validated === "idle" ? notification.date : undefined,
            exitCapture: notification.validated === "idle" ? notification.capture : undefined,
          }
      )
    : [
        {
          id: notification.idR,
          validated: notification.validated,
          entryDate: notification.validated === "present" || notification.validated === "absent" ? notification.date : undefined,
          entryCapture: notification.validated === "present" ? notification.capture : undefined,
          exitDate: notification.validated === "idle" ? notification.date : undefined,
          exitCapture: notification.validated === "idle" ? notification.capture : undefined,
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
        const priority = { present: 1, idle: 2, absent: 3 };
        const validatedA = a.registrations[0]?.validated || "absent";
        const validatedB = b.registrations[0]?.validated || "absent";
        return filterColumn.order ? priority[validatedA] - priority[validatedB] : priority[validatedB] - priority[validatedA];
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

export const { setUsers, setSearchTerm, setFilterColumn, updateUserFromNotification, addUser } = usersEmpSlice.actions;
export default usersEmpSlice.reducer;
