export interface AccountDTO {
  name: string | null;
  balance: string | null;
}

export interface ValidatedAccountDTO {
  name: string;
  balance: string;
}

export interface ListAccount {
  id: string;
  name: string;
}

export interface AccountFormParams {
  route: {
    params: ListAccount;
  };
}
