import { UseFormReturn } from "react-hook-form";
import { ReturnUseDisclosure } from "../../../../types/types";

export interface ModalFilterProps extends ReturnUseDisclosure {
  filterMethods: UseFormReturn;
  onSubmit?: () => void;
}
