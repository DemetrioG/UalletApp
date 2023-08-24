import { PropsWithChildren } from "react";
import { ReturnUseDisclosure } from "../../types/types";
import { InterfaceVStackProps } from "native-base/lib/typescript/components/primitives/Stack/VStack";
import { ModalProps as NativeModalProps } from "react-native-modal";

export interface ModalProps extends ReturnUseDisclosure, PropsWithChildren {
  ContainerProps?: InterfaceVStackProps;
  ModalProps?: any;
}
