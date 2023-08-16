import { PropsWithChildren } from "react";
import { ReturnUseDisclosure } from "../../types/types";
import { InterfaceVStackProps } from "native-base/lib/typescript/components/primitives/Stack/VStack";

export interface ModalProps extends ReturnUseDisclosure, PropsWithChildren {
  ContainerProps?: InterfaceVStackProps;
}
