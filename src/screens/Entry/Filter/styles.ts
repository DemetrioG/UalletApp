import { Center, HStack, Text } from "native-base";
import { View } from "react-native";
import styled from "styled-components";
import { metrics } from "../../../styles";

export const SpaceContainer = styled(HStack)`
  justify-content: space-between;
`;

export const Title = styled(Text).attrs(({ theme: { theme } }) => ({
  fontWeight: 700,
  fontSize: "md",
  color: theme.text,
}))``;

export const ButtonContainer = styled(Center)`
  padding-top: ${metrics.topBottomPadding}px;
`;

export const HalfContainer = styled(View)`
  width: 48%;
`;
