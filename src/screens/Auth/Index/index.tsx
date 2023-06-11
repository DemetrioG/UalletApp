import * as React from "react";
import { Image, TouchableOpacity } from "react-native";
import { HStack, Text, VStack } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import Swipeable from "@components/Button/Swipeable";
import { BackgroundContainerCenter } from "@styles/general";
import { LoginText } from "./styles";

import Cards from "../../../../assets/images/cards.png";

export const Index = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <BackgroundContainerCenter>
      <Image
        source={Cards}
        style={{ width: "90%", height: "70%", right: -20 }}
      />
      <VStack width="90%" mt={5} mb={5}>
        <Swipeable
          title="Começar"
          onSwipeSuccess={() => navigate("Register")}
        />
      </VStack>
      <HStack space={3}>
        <Text>Já tem uma conta?</Text>
        <TouchableOpacity onPress={() => navigate("Login")}>
          <LoginText fontWeight={600}>Login</LoginText>
        </TouchableOpacity>
      </HStack>
    </BackgroundContainerCenter>
  );
};
