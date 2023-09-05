export interface AccountDTO {
  name: string | null;
  balance: number | null;
}

export interface ValidatedAccountDTO {
  name: string;
  balance: number;
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
