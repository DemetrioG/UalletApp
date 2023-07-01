export interface NewEntrieDTO {
  type: "Receita" | "Despesa";
  entrydate: string;
  description: string;
  schema: string;
  segment: string;
  value: string;
}
