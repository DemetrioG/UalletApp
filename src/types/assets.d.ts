export interface IFixedIncome {
  entrydate: string;
  title: string | null;
  cdbname: string | null;
  broker: string | null;
  rent: string;
  rentType: string | null;
  duedate: string | null;
  price: string;
  uid: string;
}

export interface IVariableIncome {
  id: number;
  asset: string;
  price: number;
  broker: string;
  amountBuyDate: object[];
  amount: number;
  segment: string;
  rentPercentual?: number;
  rent?: number;
  total: number;
  totalAtual?: number;
}

export interface ITreasure {
  name: string;
  selic: number;
}
