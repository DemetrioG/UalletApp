import { Text } from "native-base";
import { Image, View } from "react-native";
import styled from "styled-components";
import { colors, fonts, metrics } from "../../styles";
import {
  ValueContainer as DefaultValueContainer,
  DescriptionContainer as DefaultDescriptionContainer,
  BackgroundContainer as DefaultBackgroundContainer,
} from "../../styles/general";

export const BackgroundContainer = styled(DefaultBackgroundContainer)``;

export const CardHeaderView = styled(View)<{ balance?: boolean }>`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${({ balance }) => (balance ? metrics.baseMargin : 20)}px;
`;

export const CardTextView = styled(View)`
  flex-direction: row;
  align-items: center;
`;

export const LogoCard = styled(Image)`
  width: 20px;
  height: 25px;
`;

export const Invest = styled(Text).attrs(() => ({
  fontFamily: "mono",
  fontWeight: 700,
  fontSize: fonts.larger,
}))`
  color: ${({ theme: { theme } }) =>
    !theme.isOnDarkTheme ? colors.strongPurple : colors.lightYellow};
`;

export const CardStatusView = styled(View)`
  margin-bottom: ${metrics.baseMargin}px;
`;

export const StatusPercentText = styled(Text)`
  font-family: ${fonts.montserratExtraBold};
  color: ${({ theme: { theme } }) => theme.green};
`;

export const Section = styled(View)`
  flex-direction: row;
  align-items: center;
  padding: ${metrics.basePadding}px;
`;

export const SectionText = styled(Text).attrs(() => ({
  fontSize: "lg",
}))`
  color: ${({ theme: { theme } }) => theme.tertiary};
`;

export const ValueContainer = styled(DefaultValueContainer)`
  width: 40%;
`;

export const DescriptionContainer = styled(DefaultDescriptionContainer)`
  flex: 1;
  border-right-width: 0px;
  align-items: baseline;
`;

export const EmptyEntryText = styled(Text).attrs(() => ({
  fontWeight: 500,
  fontSize: "md",
}))`
  color: ${colors.gray};
  text-align: center;
`;
