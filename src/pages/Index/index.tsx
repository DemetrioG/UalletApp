import React from "react";
import { useNavigation } from "@react-navigation/native";

import { metrics } from "../../styles/index";
import {
  BackgroundContainerCenter,
  ButtonOutlineText,
  ButtonText,
  FlexContainer,
  StyledButton,
  StyledButtonOutline,
} from "../../styles/generalStyled";
import { ImageCarousel, TitleCarousel, StyledCarousel } from "./styles";

interface ISlidesMockup {
  key: number;
  title: string;
  image: NodeRequire;
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

export default function Index() {
  const { navigate } = useNavigation();

  function renderSlide({ item }: any) {
    return (
      <FlexContainer>
        <ImageCarousel source={item.image} />
        <TitleCarousel>{item.title}</TitleCarousel>
      </FlexContainer>
    );
  }

  return (
    <BackgroundContainerCenter>
      <StyledCarousel
        data={slides}
        renderItem={renderSlide}
        sliderWidth={metrics.screenWidth}
        itemWidth={metrics.screenWidth}
        loop={true}
        autoplay={true}
        enableMomentum={false}
        lockScrollWhileSnapping={true}
      />
      <StyledButton onPress={() => navigate("Register")}>
        <ButtonText>CRIAR CONTA</ButtonText>
      </StyledButton>
      <StyledButtonOutline
        additionalMargin={60}
        onPress={() => navigate("Login")}
      >
        <ButtonOutlineText>ENTRAR</ButtonOutlineText>
      </StyledButtonOutline>
    </BackgroundContainerCenter>
  );
}
