import { HStack, Text } from "native-base";
import { View } from "react-native";
import styled from "styled-components";

import { metrics } from "../../styles";
import { Card } from "../../styles/general";

export const HeaderView = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${metrics.baseMargin}px;
  padding-left: ${metrics.basePadding}px;
  z-index: 5;
`;

export const HeaderText = styled(Text)`
  color: ${({ theme: { theme } }) => theme.text};
`;

export const HeaderIconView = styled(HStack)`
  justify-content: space-between;
  align-items: center;
  min-width: 135px;
`;

export const NetworkCard = styled(Card)`
  padding: ${metrics.basePadding}px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
