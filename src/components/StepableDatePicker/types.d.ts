import { IOption, ReturnUseDisclosure } from "../../types/types";

export interface ActionSheetProps extends ReturnUseDisclosure {
  options: IOption[];
}

export interface ActionSheetItemProps {
  item: IOption;
  onPress: () => void;
}
