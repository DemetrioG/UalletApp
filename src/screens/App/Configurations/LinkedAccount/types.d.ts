import { UserInfo } from "../DadosCadastrais/InformacoesPessoais/types";

export interface LinkedAccountDTO {
  email: string | null;
}

export interface ValidatedLinkedAccountDTO {
  email: string;
}

export interface ListLinkedAccount extends UserInfo {
  uid: string;
}

export interface LinkedAccountFormParams {
  route: {
    params: ListLinkedAccount & { youShared?: boolean };
  };
}

export interface SharedAccount {
  linked: boolean;
  uid: string;
}
