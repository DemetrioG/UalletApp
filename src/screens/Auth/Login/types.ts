export type TLoginByEmailAndPassword = {
  email: string;
  password: string;
  expoPushToken: string;
};

export type TLoggedSucceed = { uid: string; date: Date };

export interface LoginDTO {
  email: string;
  password: string;
}

export interface LoginParams {
  route: {
    params: { email?: string };
  };
}
