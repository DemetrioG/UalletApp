import { Modal } from "react-native";
import { IThemeProvider } from "../../../../../styles/baseTheme";
import { useTheme } from "styled-components";

import LOADING from "../../../../../../assets/icons/circleLoading.json";
import { ReturnUseDisclosure } from "../../../../../types/types";
import { Text, VStack } from "native-base";
import LottieView from "lottie-react-native";

export const ChangingAccount = (props: ReturnUseDisclosure) => {
  const { theme }: IThemeProvider = useTheme();

  return (
    <Modal
      style={{
        width: "100%",
        height: "100%",
      }}
      animationType="fade"
      visible={props.isOpen}
    >
      <VStack flex={1} backgroundColor={theme?.primary}>
        <VStack
          backgroundColor="transparent"
          flex={1}
          space={5}
          alignItems="center"
          justifyContent="center"
        >
          <LottieView
            source={LOADING}
            autoPlay={true}
            loop={true}
            style={{ width: 250 }}
          />
          <Text fontSize="18px">Alternando conta</Text>
        </VStack>
      </VStack>
    </Modal>
  );
};
