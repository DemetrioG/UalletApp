import * as React from "react";
import { ImageURISource } from "react-native";
import { Button, Center, Flex, Spacer } from "native-base";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import Swiper from "react-native-swiper";

import {
  BackgroundContainerCenter,
  ButtonOutlineText,
  ButtonText,
  ButtonOutline,
} from "../../styles/general";
import { ImageCarousel, TitleCarousel } from "./styles";

interface ISlidesMockup {
  key: number;
  title: string;
  image: ImageURISource;
}

const slides: ISlidesMockup[] = [
  {
    key: 1,
    title: "Suas finanças",
    image: require("../../../assets/images/iphoneHome.png"),
  },
  {
    key: 2,
    title: "Seus investimentos",
    image: require("../../../assets/images/iphoneInvest.png"),
  },
  {
    key: 3,
    title: "Integrações bancárias",
    image: require("../../../assets/images/iphoneIntegracoes.png"),
  },
  {
    key: 4,
    title: "Tudo em um só lugar",
    image: require("../../../assets/images/iphoneUallet.png"),
  },
];

const Index = () => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();

  function RenderSlide({ item }: { item: ISlidesMockup }) {
    return (
      <Flex>
        <ImageCarousel source={item.image} />
        <Spacer />
        <Center>
          <TitleCarousel fontSize={"2xl"}>{item.title}</TitleCarousel>
        </Center>
      </Flex>
    );
  }

  return (
    <BackgroundContainerCenter>
      <Swiper autoplay>
        {slides.map((e, i) => {
          return <RenderSlide key={i} item={slides[i]} />;
        })}
      </Swiper>
      <Button onPress={() => navigate("Register")}>
        <ButtonText>CRIAR CONTA</ButtonText>
      </Button>
      <ButtonOutline onPress={() => navigate("Login")}>
        <ButtonOutlineText>ENTRAR</ButtonOutlineText>
      </ButtonOutline>
    </BackgroundContainerCenter>
  );
};

export default Index;
