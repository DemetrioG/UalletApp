import { UseFormReturn } from "react-hook-form";
import { ReturnUseDisclosure } from "../../../../types/types";

export interface ModalFilterProps extends ReturnUseDisclosure {
  filterMethods: UseFormReturn;
  hasFilter: boolean;
  onSubmit?: () => Promise<void>;
}

export interface ServerFilterFields {
  initial_date?: string | null;
  final_date?: string | null;
  origin_account?: string | null;
  destination_account?: string | null;
}

export interface ClientFilterFields {
  initial_value?: number | null;
  final_value?: number | null;
}

export interface FilterFields {
  client: ClientFilterFields;
  server: ServerFilterFields;
}
