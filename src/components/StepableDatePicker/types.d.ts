import { TouchableOpacityProps } from "react-native";
import { IOption, ReturnUseDisclosure } from "../../types/types";
import { InterfaceHStackProps } from "native-base/lib/typescript/components/primitives/Stack/HStack";

export interface ActionSheetProps extends ReturnUseDisclosure {
  options: IOption[];
}

export interface ActionSheetItemProps {
  item: IOption;
  onPress: () => void;
}

export interface StepableDatePickerProps {
  SideButtonProps?: TouchableOpacityProps;
  ContainerProps?: InterfaceHStackProps;
}
