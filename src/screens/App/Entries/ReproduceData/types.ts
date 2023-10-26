import { ListEntries } from "../types";

export type ItemListType = ListEntries & { checked?: boolean };

export interface ListProps {
  item: ItemListType;
}

export interface ReproduceDataDTO {
  [key: string]: boolean;
}