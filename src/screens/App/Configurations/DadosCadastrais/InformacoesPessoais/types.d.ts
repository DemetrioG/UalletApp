export interface UserInfo {
  birthDate: string;
  dateRegister: {
    seconds: number;
    nanoseconds: number;
  };
  devices: {
    expirationDate: {
      seconds: number;
      nanoseconds: number;
    };
    logged: boolean;
    token: string;
  }[];
  expirationDate: {
    seconds: number;
    nanoseconds: number;
  };
  gender: string;
  email: string;
  income: string;
  name: string;
  profile: string;
  schema: "free";
  sharedAccounts: {
    linked: boolean;
    uid: string;
  }[];
  typeUser: "default";
}
