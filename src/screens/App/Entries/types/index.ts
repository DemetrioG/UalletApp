import { TEntrieType } from "../../../../types/types";
import { ITimestamp } from "../../../../utils/date.helper";

export interface ListEntries {
  date: ITimestamp;
  description: string;
  id: number;
  modality: "Real" | "Projetado";
  classification: string | null;
  segment: string | null;
  type: TEntrieType;
  value: number;
}
