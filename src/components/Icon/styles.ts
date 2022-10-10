import styled from "styled-components";
import Feather from "react-native-vector-icons/Feather";
import { metrics } from "../../styles";

export const StyledIcon = styled(Feather).attrs<{
  color?: string;
  size?: number;
  colorVariant?: string;
}>(({ theme: { theme }, color, size, colorVariant }) => ({
  color: colorVariant ? theme[colorVariant] : color ? color : theme.text,
  size: size ? size : metrics.iconSize,
}))`
  text-align: center;
`;
