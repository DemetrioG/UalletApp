import { Text as NativeText } from "native-base";
import styled from "styled-components";
import { colors } from "../../styles";

export const Text = styled(NativeText)`
  color: ${({ theme: { theme } }) =>
    theme.isOnDarkTheme ? colors.darkPrimary : colors.white};
`;
