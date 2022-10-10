import { Text } from "native-base";
import { TouchableOpacity } from "react-native";
import styled from "styled-components";
import { metrics } from "../../styles";

const GREEN_TITLES = ["COMPRA", "RECEITA"];
const RED_TITLES = ["VENDA", "DESPESA"];

export const HeaderText = styled(Text)`
  color: ${({ theme: { theme } }) => theme.text};
`;

export const Touchable = styled(TouchableOpacity)<{
  title?: string;
  active?: boolean;
}>`
  padding: ${metrics.basePadding}px 40px;
  border-bottom-width: ${({ active }) => (active ? "2px" : "0px")};
  border-bottom-color: ${({ title, theme: { theme } }) =>
    GREEN_TITLES.includes(title!)
      ? theme.green
      : RED_TITLES.includes(title!)
      ? theme.red
      : theme.blue};
`;
