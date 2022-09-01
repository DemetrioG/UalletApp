import { Text } from "native-base";
import styled from "styled-components";
import { colors } from "../../../styles";

export const ItemText = styled(Text).attrs(() => ({
  fontSize: "md",
}))<{ label?: boolean }>`
  color: ${({ label, theme: { theme } }) => (label ? theme.text : colors.gray)};
`;
