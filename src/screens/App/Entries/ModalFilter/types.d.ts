import { UseFormReturn } from "react-hook-form";
import { ReturnUseDisclosure, TEntrieType } from "../../../../types/types";

export interface ModalFilterProps extends ReturnUseDisclosure {
  filterMethods: UseFormReturn;
  hasFilter: boolean;
  onSubmit?: () => Promise<void>;
}

export interface ServerFilterFields {
  initial_date?: string;
  final_date?: string;
  modality?: string;
  segment?: string;
  type?: TEntrieType;
  account?: string;
  period?: "period" | "all";
}

export interface ClientFilterFields {
  description?: string;
  initial_value?: number;
  final_value?: number;
}

export interface FilterFields {
  client: ClientFilterFields;
  server: ServerFilterFields;
}
