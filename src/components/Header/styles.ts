import { HStack } from "native-base";
import { View } from "react-native";
import styled from "styled-components";

import { metrics } from "../../styles";
import { Card } from "../../styles/general";

export const HeaderView = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  padding-horizontal: ${metrics.basePadding}px;
  padding-bottom: 10px;
  z-index: 5;
`;

export const HeaderIconView = styled(HStack)`
  justify-content: space-between;
  align-items: center;
  min-width: 135px;
`;

export const NetworkCard = styled(Card)`
  margin-top: ${metrics.baseMargin}px;
  padding: ${metrics.basePadding}px 20px;
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
`;
