import { Center, ITextProps, Text, VStack } from "native-base";
import React from "react";
import { View } from "react-native";
import styled from "styled-components";
import { metrics } from "../../../styles";

export const Header = styled(View)`
    z-index: 10;
    width: 100%;
    position: absolute;
    border-radius: ${metrics.baseRadius}px;
    padding: ${metrics.basePadding}px;
    background-color: ${({theme: {theme}}) => theme.primary};
`

export const HeaderText = styled(Text).attrs(() => ({
    fontSize: 'md'
}))`
    color: ${({theme: {theme}}) => theme.text};
`;

export const Container = styled(View)`
    border-bottom-left-radius: ${metrics.baseRadius}px;
    border-bottom-right-radius: ${metrics.baseRadius}px;
    padding: ${metrics.basePadding}px;
    background-color: ${({theme: {theme}}) => theme.primary};
    height: 180px;
    margin-top: 45px;
`;

export const ItemContainer = styled(VStack)<{ticker?: boolean}>`
    padding: ${({ticker}) => ticker ? 9.5 : 8}px 10px;
    align-items: center;
`;

export const Label = styled(Text).attrs(() => ({
    fontWeight: 700,
}))`
    color: ${({theme: {theme}}) => theme.text};
`;

export const ItemContent: React.FC<ITextProps & {number?: boolean}> = styled(Text).attrs(({number}) => ({
    fontFamily: number ? 'mono' : 'body'
}))`
    color: ${({theme: {theme}}) => theme.text};
`;

export const Circle = styled(Center)`
    width: 25px;
    height: 25px;
    border-radius: 50px;
    background-color: ${({theme: {theme}}) => theme.red};
`