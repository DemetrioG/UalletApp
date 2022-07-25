import { ITextProps, Progress, Text as NativeBaseText } from "native-base";
import { IProgressProps } from "native-base/lib/typescript/components/composites";
import React from "react";
import styled from "styled-components";

const PasswordStrengthColor: {[key: number]: string} = {
    0: "",
    30: "red",
    70: "yellow",
    100: "green",
};

export const Text: React.FC<ITextProps> = styled(NativeBaseText).attrs(({fontSize}) => ({
    fontSize: fontSize || "xs",
}))(({theme: {theme}}) => ({
    color: theme.text,
}));


export const ProgressBar : React.FC<IProgressProps & {strength: number}>  = styled(Progress).attrs(({strength = 100, theme: {theme},...props}) => ({
    _filledTrack: {
        bg: theme[PasswordStrengthColor[strength]],
    },
    bg: theme.secondary
}))``;