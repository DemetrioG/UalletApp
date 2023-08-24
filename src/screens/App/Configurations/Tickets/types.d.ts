export interface TicketsDTO {
  type: string | null;
  comment: string | null;
}

export interface ValidatedTicketsDTO {
  type: string;
  comment: string;
}
