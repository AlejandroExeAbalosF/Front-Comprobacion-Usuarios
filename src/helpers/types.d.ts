export interface IDni {
    document: string;
}

export interface IShift{
   id?: string;
   name?: string;
   entryHour?: string;
   exitHour?: string;
}
export interface IUser {
    id: string;

    entryHour?: string;

    exitHour?: string;
    name: string;
    lastName: string;
    document: number;
    email: string;
    sex: string;
    birthDate: string;
    cellphone?: number;
    phone?: number;
    privateAddress?: string;
    studyLevel?: string;
    profession: string;
    function?: string;
    asset?: string;
    situation?: string;
    incomeDate?: string;
    legalInstrument?: string;
    laborAddress?: string;
    ministry?: string;
    secretariat?: ISecretariat;
    secretariatId?: string;
    nameSecretariat?: string;
    nameMinistry?: string;
    rol:
      | "superadmin"
      | "admin"
      | "user";
    image?: string;
    state?: boolean;
    createdAt?: string;
    registrations: IRegistrations[];

    shift: IShift;
  }
export interface IRegistration {
    id: string;
    validated?: string;
    type?: string;
    state?: boolean;
    status: string;
    entryCapture?: string;
    exitCapture?: string;
    entryDate: string;
    exitDate: string;
    articulo?: string;
    description?: string;
    createdAt?: string;
    justification?: string;
    user?: IUser
}

export interface INotificaciónData extends IUser, IRegistration {
  idR: string;
  date: string;
  capture: string;
}

export interface ISecretariat {
  id: string;
  name: string;
  privateAddress?: string;
  function?: string;
  createdAt?: string;
  ministry?: IMinistry
}

export interface IMinistry {
  id: string;
  name: string;
  privateAddress?: string;
  function?: string;
  createdAt?: string;
  secretariats?: ISecretariat[]

}