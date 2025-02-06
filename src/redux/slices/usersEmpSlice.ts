import { createSlice, PayloadAction } from "@reduxjs/toolkit";
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
      state.users = action.payload;
      state.usersFilter = action.payload;
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
    updateUserFromNotification(state, action: PayloadAction<any>) {
      const notification = action.payload;
      const updatedUsers = state.users.map((user) =>
        user.id === notification?.id
          ? {
              ...user,
              registrations: updateRegistrations(user.registrations, notification),
            }
          : user
      );
      // state.usersFilter = state.users;
       // Si el filtro actual es "Ingreso", mover el usuario al inicio
      if (state.filterColumn.type === "Ingreso" && notification?.validated === "present") {
        const updatedUserIndex = updatedUsers.findIndex(user => user.id === notification?.id );

        if (updatedUserIndex !== -1) {
          const [updatedUser] = updatedUsers.splice(updatedUserIndex, 1); // Extrae el usuario actualizado
          updatedUsers.unshift(updatedUser); // Lo coloca al inicio de la lista
        }
      }

      // Actualizar el estado con la nueva lista
      state.users = updatedUsers;
      state.usersFilter = updatedUsers;
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
              entryDate: reg.entryDate || (notification.validated === "present" ? notification.date : undefined),
              entryCapture: reg.entryCapture || (notification.validated === "present" ? notification.capture : undefined),
              exitDate: notification.validated === "idle" ? notification.date : reg.exitDate,
              exitCapture: notification.validated === "idle" ? notification.capture : reg.exitCapture,
            }
          : reg
      )
    : [
        {
          id: notification.idR,
          validated: notification.validated,
          entryDate: notification.validated === "present" ? notification.date : undefined,
          entryCapture: notification.validated === "present" ? notification.capture : undefined,
          exitDate: notification.validated === "idle" ? notification.date : undefined,
          exitCapture: notification.validated === "idle" ? notification.capture : undefined,
        },
      ];
};

const sortUsers = (filterColumn: IFilterColumn, users: IUser[]) => {
  const sortFunctions = {
    Empleados: (a: IUser, b: IUser) => (filterColumn.order ? b.name.localeCompare(a.name) : a.name.localeCompare(b.name)),
    Ingreso: (a: IUser, b: IUser) => {
      const dateA = a.registrations[0]?.entryDate ? new Date(a.registrations[0].entryDate).getTime() : 0;
      const dateB = b.registrations[0]?.entryDate ? new Date(b.registrations[0].entryDate).getTime() : 0;
      return filterColumn.order ? dateB - dateA : dateA - dateB;
    },
    Estado: (a: IUser, b: IUser) => {
      const priority = { present: 1, idle: 2, absent: 3 };
      const validatedA = a.registrations[0]?.validated || "absent";
      const validatedB = b.registrations[0]?.validated || "absent";
      return filterColumn.order ? priority[validatedA] - priority[validatedB] : priority[validatedB] - priority[validatedA];
    },
    Documento: (a: IUser, b: IUser) => (filterColumn.order ? a.document - b.document : b.document - a.document),
    Rol: (a: IUser, b: IUser) => (filterColumn.order ? b.rol.localeCompare(a.rol) : a.rol.localeCompare(b.rol)),
  };

  return users.sort(sortFunctions[filterColumn.type] || (() => 0));
};

export const { setUsers, setSearchTerm, setFilterColumn, updateUserFromNotification, addUser } = usersEmpSlice.actions;
export default usersEmpSlice.reducer;
