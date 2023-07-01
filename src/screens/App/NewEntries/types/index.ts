import { TEntrieType } from "../../../../types/types";

export interface NewEntrieDTO {
  date: string;
  description: string;
  id?: number;
  modality: "Real" | "Projetado";
  schema: string;
  segment: string;
  type: TEntrieType;
  value: string;
}
