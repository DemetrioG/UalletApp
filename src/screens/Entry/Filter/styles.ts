import { Center, HStack, Text } from "native-base";
import styled from "styled-components";
import { metrics } from "../../../styles";

export const SpaceContainer = styled(HStack)`
  justify-content: space-between;
`;

export const ButtonContainer = styled(Center)`
  padding-top: ${metrics.topBottomPadding}px;
`;
