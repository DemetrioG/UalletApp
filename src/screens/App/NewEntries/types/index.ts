export interface NewEntrieDTO {
  type: "Receita" | "Despesa";
  entrydate: string;
  description: string;
  classification: string;
  segment: string;
  value: string;
}
