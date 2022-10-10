import { Progress } from "native-base";
import styled from "styled-components";

const PasswordStrengthColor: { [key: number]: string } = {
  0: "",
  30: "red",
  70: "yellow",
  100: "green",
};

export const ProgressBar = styled(Progress).attrs<{ strength: number }>(
  ({ strength = 100, theme: { theme }, ...props }) => ({
    _filledTrack: {
      bg: theme[PasswordStrengthColor[strength]],
    },
    bg: theme.secondary,
  })
)<{ strength: number }>``;
