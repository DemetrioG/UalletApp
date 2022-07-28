import { Image } from "react-native";
import { Text } from "native-base";
import styled from "styled-components";

export const ImageCarousel = styled(Image).attrs(() => ({
  resizeMode: "contain",
}))`
  margin-top: 25px;
  height: 75%;
  width: 100%;
`;

export const TitleCarousel = styled(Text).attrs(() => ({
  fontWeight: 800,
}))`
  color: ${({ theme: { theme } }) => theme.text};
`;
