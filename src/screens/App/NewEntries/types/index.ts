import { TEntrieType } from "../../../../types/types";

export interface NewEntrieDTO {
  date: string | null;
  description: string | null;
  id?: number;
  modality: "Real" | "Projetado" | null;
  segment: string | null;
  type: TEntrieType | null;
  value: string | null;
}
