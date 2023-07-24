import React from "react";
import { Button, Image, Pressable, Text, VStack } from "native-base";
import { BackgroundContainer, BackgroundEffect } from "../../../styles/general";
import { IThemeProvider } from "../../../styles/baseTheme";
import { useTheme } from "styled-components";
import { ChevronLeft } from "lucide-react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import notificationsDark from "../../../../assets/images/notificationsDark.png";
import notificationsLight from "../../../../assets/images/notificationsLight.png";

export const Complete = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();
  const { theme }: IThemeProvider = useTheme();
  return (
    <BackgroundContainer p="20px">
      <BackgroundEffect />
      <Image
        source={theme?.isOnDarkTheme ? notificationsDark : notificationsLight}
        position="absolute"
        bottom={2}
        right={0}
        w="70%"
        resizeMode="contain"
      />
      <VStack space={5}>
        <Pressable onPress={() => navigate("Home")}>
          <ChevronLeft color="white" />
        </Pressable>
        <VStack>
          <VStack
            paddingY={0.5}
            paddingX={2}
            borderRadius={15}
            backgroundColor={theme?.blue}
            alignSelf="flex-start"
          >
            <Text fontSize="36" fontWeight="700" color="white">
              Complete
            </Text>
          </VStack>
          <Text fontSize="36" fontWeight="700" color="white">
            seu cadastro
          </Text>
          <Text mt={2} color="white">
            Queremos te conhecer um {"\n"}pouco mais!
          </Text>
        </VStack>
      </VStack>
      <VStack flex={1} justifyContent="flex-end">
        <Button onPress={() => navigate("Home/Complete/Form")}>
          <Text fontWeight="bold" color="white">
            Próximo
          </Text>
        </Button>
      </VStack>
    </BackgroundContainer>
  );
};
