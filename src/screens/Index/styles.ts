import { Image, Text } from "react-native";
import Carousel from "react-native-snap-carousel";
import styled from "styled-components";
import { fonts, metrics } from "../../styles";

export const ImageCarousel = styled(Image).attrs(() => ({
  resizeMode: "contain",
}))`
  height: 80%;
  width: 100%;
`;

export const TitleCarousel = styled(Text)`
  font-size: ${fonts.larger}px;
  font-family: ${fonts.ralewayExtraBold};
  text-align: center;
  margin-top: ${metrics.doubleBaseMargin}px;
  color: ${({ theme: { theme } }) => theme.text};
  background-color: ${({ theme: { theme } }) => theme.primary};
`;

export const StyledCarousel = styled(Carousel).attrs((props) => ({
  slideStyle: { marginTop: 80 },
}))``;
