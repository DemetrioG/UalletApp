import { VStack } from "native-base";
import NativeModal from "react-native-modal";
import { IThemeProvider } from "../../styles/baseTheme";
import { useTheme } from "styled-components";
import { ModalProps } from "./types";

export const Modal = ({
  isOpen,
  onClose,
  children,
  ContainerProps,
}: ModalProps) => {
  const { theme }: IThemeProvider = useTheme();
  return (
    <NativeModal
      isVisible={isOpen}
      onSwipeComplete={onClose}
      onBackdropPress={onClose}
      swipeDirection={"down"}
      style={{ width: "100%", left: -20 }}
    >
      <VStack
        p={5}
        h="91%"
        w="100%"
        position="absolute"
        bottom={-20}
        background={theme?.tertiary}
        borderTopRadius="30px"
        {...ContainerProps}
      >
        {children}
      </VStack>
    </NativeModal>
  );
};
