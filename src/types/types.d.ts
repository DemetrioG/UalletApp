export type AssetSegment =
  | "Ações"
  | "FIIs"
  | "Fiagro"
  | "Criptomoedas"
  | "BDR's"
  | "ETF's";

export type TEntryType = "Receita" | "Despesa";

export interface ReturnUseDisclosure {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
  onToggle: () => void;
};
