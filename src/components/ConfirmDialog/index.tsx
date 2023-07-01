import { useContext, useRef, useEffect } from "react";
import Modal from "react-native-modal";

import { ConfirmContext } from "../../context/ConfirmDialog/confirmContext";
import { ButtonText } from "../../styles/general";
import { Button, Center, HStack, Text, VStack } from "native-base";
import { IThemeProvider } from "../../styles/baseTheme";
import { useTheme } from "styled-components";

export const ConfirmDialog = () => {
  const { theme }: IThemeProvider = useTheme();
  const { confirm, setConfirm } = useContext(ConfirmContext);
  const notInitialRender = useRef(false);

  function handleCancel() {
    return setConfirm((confirmState) => ({
      ...confirmState,
      callback: false,
      visibility: false,
    }));
  }

  function handleConfirm() {
    return setConfirm((confirmState) => ({
      ...confirmState,
      callback: true,
      visibility: false,
    }));
  }

  useEffect(() => {
    if (notInitialRender.current) {
      if (confirm.callback) {
        confirm.callbackFunction?.();
        setConfirm((confirmState) => ({
          ...confirmState,
          callbackFunction: undefined,
        }));
      }
    } else {
      notInitialRender.current = true;
    }
  }, [confirm.callback]);

  return (
    <Modal
      isVisible={confirm.visibility}
      swipeDirection={"down"}
      onSwipeComplete={() => handleCancel()}
      onBackdropPress={() => handleCancel()}
    >
      <Center
        position="absolute"
        top={0}
        bottom={0}
        marginBottom="auto"
        marginTop="auto"
        w="100%"
      >
        <VStack
          backgroundColor={theme?.secondary}
          p={5}
          space={10}
          borderRadius="20px"
          borderLeftWidth={6}
          borderLeftColor={theme?.red}
        >
          <Text textAlign="center" fontWeight={500}>
            {confirm.title}
          </Text>
          <VStack>
            <Button variant="outline" onPress={handleConfirm}>
              <Text fontWeight="bold" color={theme?.blue}>
                Ok
              </Text>
            </Button>
            <Button onPress={handleCancel}>
              <Text fontWeight="bold" color="white">
                Cancelar
              </Text>
            </Button>
          </VStack>
        </VStack>
      </Center>
    </Modal>
  );
};
