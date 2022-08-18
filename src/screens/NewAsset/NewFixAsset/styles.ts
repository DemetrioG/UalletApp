import { Text } from "native-base";
import styled from "styled-components";

export const RentTypeText = styled(Text)`
    color: ${({theme: {theme}}) => theme.text};
`;