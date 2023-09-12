export interface AccountDTO {
  name: string | null;
  balance: string | null;
  color: string | null;
}

export interface ValidatedAccountDTO {
  name: string;
  balance: string;
  color: string;
}

export interface ListAccount {
  id: string;
  name: string;
  color: string;
  balance: string;
}

export interface AccountFormParams {
  route: {
    params: ListAccount;
  };
}
