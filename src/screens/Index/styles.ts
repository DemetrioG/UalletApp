import { Image } from "react-native";
import styled from "styled-components";

export const ImageCarousel = styled(Image).attrs(() => ({
  resizeMode: "contain",
}))`
  margin-top: 25px;
  height: 75%;
  width: 100%;
`;
