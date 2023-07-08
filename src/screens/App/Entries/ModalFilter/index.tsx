import { Center, HStack, Pressable, Text } from "native-base";
import { Modal } from "../../../../components/Modal";
import { ReturnUseDisclosure } from "../../../../types/types";
import { ChevronLeft, Filter } from "lucide-react-native";
import { IThemeProvider } from "../../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { FormTextInputCalendar } from "../../../../components/Inputs/TextInputCalendar";

export const ModalFilter = (props: ReturnUseDisclosure) => {
  const { theme }: IThemeProvider = useTheme();
  return (
    <Modal {...props}>
      <HStack justifyContent="space-between">
        <HStack alignItems="center" space={3} mb={6}>
          <Pressable onPress={props.onClose}>
            <ChevronLeft color={theme?.text} />
          </Pressable>
          <Text fontWeight={700}>Filtros</Text>
        </HStack>
        <Filter color={theme?.text} />
      </HStack>
      <Center flex={1}>
        <FormTextInputCalendar />
      </Center>
    </Modal>
  );
};
