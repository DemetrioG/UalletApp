import { useContext, useRef, useEffect } from "react";

import { ConfirmContext } from "../../context/ConfirmDialog/confirmContext";
import { Button, Center, HStack, Text, VStack } from "native-base";
import { IThemeProvider } from "../../styles/baseTheme";
import { useTheme } from "styled-components";
import { Modal } from "../Modal";
import { AlertCircle } from "lucide-react-native";

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
      isOpen={!!confirm.visibility}
      onClose={handleCancel}
      onOpen={() => {}}
      onToggle={() => {}}
      ContainerProps={{ height: 400, ...confirm.ContainerProps }}
    >
      {!!confirm.header ? (
        <>{confirm.header}</>
      ) : (
        <HStack alignItems="center" justifyContent="space-between">
          <Text fontWeight={700} fontSize="18px">
            Atenção
          </Text>
          <AlertCircle color={theme?.red} />
        </HStack>
      )}
      <Center flex={1}>
        <Text textAlign="center" fontWeight={500}>
          {confirm.title}
        </Text>
      </Center>
      <VStack>
        <Button onPress={handleCancel}>
          <Text fontWeight="bold" color="white">
            Não
          </Text>
        </Button>
        <Button variant="outline" onPress={handleConfirm}>
          <Text fontWeight="bold" color={theme?.blue}>
            Sim
          </Text>
        </Button>
      </VStack>
    </Modal>
  );
};
