import { DocumentData } from "firebase/firestore";
import { ListEntries } from "../../screens/App/Entries/types";

export type ItemListType = ListEntries & { checked?: boolean };

export interface ListProps {
  item: ItemListType;
}

export interface ConsolidateDTO {
  [key: string]: boolean;
}
