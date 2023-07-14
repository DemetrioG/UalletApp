import { TEntrieType } from "../../../types/types";
import { ITimestamp } from "../../../utils/date.helper";
import { ServerFilterFields } from "./ModalFilter/types";

export interface ListEntries {
  date: ITimestamp;
  description: string;
  id: number;
  modality: "Real" | "Projetado";
  classification?: string;
  segment: string | null;
  type: TEntrieType;
  value: number;
}

export interface ListEntriesProps {
  server?: {
    filters: ServerFilterFields;
  };
}

export interface NewEntrieDTO {
  date: string | null;
  description: string | null;
  id?: number;
  modality: "Real" | "Projetado" | null;
  segment?: string | null;
  type: TEntrieType | null;
  value: string | null;
}
