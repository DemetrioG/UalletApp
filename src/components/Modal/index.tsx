import { VStack } from "native-base";
import { ReturnUseDisclosure } from "../../types/types";
import NativeModal from "react-native-modal";
import { IThemeProvider } from "../../styles/baseTheme";
import { useTheme } from "styled-components";
import { PropsWithChildren } from "react";

export const Modal = ({
  isOpen,
  onClose,
  children,
}: ReturnUseDisclosure & PropsWithChildren) => {
  const { theme }: IThemeProvider = useTheme();
  return (
    <NativeModal
      isVisible={isOpen}
      onSwipeComplete={onClose}
      onBackdropPress={onClose}
      swipeDirection={"down"}
      style={{ width: "100%", left: -20 }}
      coverScreen
    >
      <VStack
        p={5}
        h="91%"
        w="100%"
        position="absolute"
        bottom={-20}
        background={theme?.tertiary}
        borderTopRadius="30px"
      >
        {children}
      </VStack>
    </NativeModal>
  );
};
