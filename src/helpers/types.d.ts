export interface IDni {
    document: string;
}
export interface IUser {
    id: string;
    name: string;
    lastName: string;
    document: number;
    email: string;
    cellphone?: number;
    phone?: number;
    rol:
      | "superadmin"
      | "admin"
      | "user";
    image?: string;
    state?: boolean;
    createdAt?: string;
    registrations: [IRegistrations];
  }
export interface IRegistration {
    id: string;
    validated: boolean;
    state: boolean;
    entryCapture?: string;
    exitCapture?: string;
    entryDate: string;
    exitDate: string;
    createdAt: string;
  
}

export interface INotificaciónData extends IUser, IRegistration {}