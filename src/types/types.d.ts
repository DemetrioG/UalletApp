import { ITimestamp } from "../utils/date.helper";

export type AssetSegment =
  | "Ações"
  | "FIIs"
  | "Fiagro"
  | "Criptomoedas"
  | "BDR's"
  | "ETF's";

export type TEntrieType = "Receita" | "Despesa";

export interface ReturnUseDisclosure {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
}

export interface IOption {
  label: string;
  value: string;
}

export interface IEntries {
  id: number;
  classification: string | null;
  date: ITimestamp;
  description: string;
  modality: string;
  segment: string | null;
  type: TEntrieType;
  value: number;
}
