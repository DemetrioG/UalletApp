import styled from "styled-components";
import { IconProps } from "react-native-vector-icons/Icon";
import Feather from "react-native-vector-icons/Feather";
import { metrics } from "../../styles";

export const StyledIcon: React.FC<
  IconProps & { color?: string; size?: number; colorVariant?: string }
> = styled(Feather).attrs(
  ({ theme: { theme }, color, size, colorVariant }) => ({
    color: colorVariant ? theme[colorVariant] : color ? color : theme.text,
    size: size ? size : metrics.iconSize,
  })
)`
  text-align: center;
`;