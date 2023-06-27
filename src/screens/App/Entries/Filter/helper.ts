export interface IActiveFilter {
    initialDate: string | null;
    finalDate: string | null;
    description: string | null;
    modality: string | null;
    typeEntry: string | null;
    segment: string | null;
    initialValue: number;
    finalValue: number;
    isFiltered: boolean;
  }

export const defaultFilter: IActiveFilter = {
    initialDate: null,
    finalDate: null,
    description: null,
    modality: null,
    typeEntry: null,
    segment: null,
    initialValue: 0,
    finalValue: 0,
    isFiltered: false,
  };