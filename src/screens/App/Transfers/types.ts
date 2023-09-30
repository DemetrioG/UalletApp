import { ITimestamp } from "../../../utils/date.helper";
import { ServerFilterFields } from "./ModalFilter/types";

export interface ListTransfers {
  id: number;
  date: ITimestamp;
  originAccount: string;
  originAccountName: string;
  destinationAccount: string;
  destinationAccountName: string;
  value: number;
}

export interface TransfersDTO {
  date: string | null;
  originAccount: string | null;
  destinationAccount: string | null;
  value: string | null;
}

export interface ValidatedTransfersDTO {
  date: string;
  originAccount: string;
  destinationAccount: string;
  value: string;
}

export interface TransfersFormParams {
  route: {
    params: ListTransfers;
  };
}

export interface ListTransfersProps {
  server?: {
    filters: ServerFilterFields;
  };
}
