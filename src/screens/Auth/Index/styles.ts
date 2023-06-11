import { Text } from "native-base";
import styled from "styled-components";

export const LoginText = styled(Text)`
  color: ${({ theme: { theme } }) => theme.blue};
`;
