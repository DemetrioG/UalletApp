import { Image } from "react-native";
import { Text } from "native-base";
import Carousel from "react-native-snap-carousel";
import styled from "styled-components";

export const ImageCarousel = styled(Image).attrs(() => ({
  resizeMode: "contain",
}))`
  height: 80%;
  width: 100%;
`;

export const StyledCarousel = styled(Carousel).attrs((props) => ({
  slideStyle: { marginTop: 80 },
}))``;

export const TitleCarousel = styled(Text).attrs(() => ({
  fontWeight: 800,
}))`
  color: ${({ theme: { theme } }) => theme.text};
`;
