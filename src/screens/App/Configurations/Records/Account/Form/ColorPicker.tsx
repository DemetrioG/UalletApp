import { Button, Center, HStack, Pressable, Text, VStack } from "native-base";
import { Modal } from "../../../../../../components/Modal";
import { ReturnUseDisclosure } from "../../../../../../types/types";
import NativeColorPicker from "react-native-wheel-color-picker";
import { useState } from "react";
import { Palette } from "lucide-react-native";
import { IThemeProvider } from "../../../../../../styles/baseTheme";
import { useTheme } from "styled-components";

export const ColorPicker = (
  props: ReturnUseDisclosure & { handleSetColor: (color: string) => void }
) => {
  const { handleSetColor } = props;
  const { theme }: IThemeProvider = useTheme();

  const [color, setColor] = useState("#266DD3");

  function handleSave() {
    handleSetColor(color);
    return props.onClose();
  }

  return (
    <Modal {...props} ContainerProps={{ height: "55%" }}>
      <VStack flex={1} space={10}>
        <HStack justifyContent="space-between">
          <HStack alignItems="center" space={3}>
            <Text>Cor de referência</Text>
            <VStack
              width="15px"
              height="15px"
              backgroundColor={color}
              borderRadius={10}
            />
          </HStack>
          <Pressable onPress={props.onToggle}>
            <Palette color={theme?.text} />
          </Pressable>
        </HStack>
        <VStack h={50}>
          <NativeColorPicker
            thumbSize={30}
            swatches={false}
            sliderHidden
            color={color}
            onColorChange={setColor}
            row={false}
          />
        </VStack>
      </VStack>
      <Button onPress={handleSave}>
        <Text fontWeight="bold" color="white">
          Salvar
        </Text>
      </Button>
    </Modal>
  );
};
