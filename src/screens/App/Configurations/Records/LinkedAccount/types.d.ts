import { UserInfo } from "../../DadosCadastrais/InformacoesPessoais/types";

export interface LinkedAccountDTO {
  email: string | null;
}

export interface ValidatedLinkedAccountDTO {
  email: string;
}

export interface ListLinkedAccount extends UserInfo {}

export interface LinkedAccountFormParams {
  route: {
    params: ListLinkedAccount;
  };
}
