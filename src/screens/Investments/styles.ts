import { Text } from "native-base";
import styled from "styled-components";

export const PatrimonyText = styled(Text).attrs(() => ({
    fontSize: 'lg',
    fontWeight: 700
}))`
    color: ${({theme: {theme}}) => theme.text};
`