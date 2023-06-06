import { Progress } from "native-base";
import styled from "styled-components";

export const ProgressBar = styled(Progress).attrs<{ strength: number }>(
  ({ theme: { theme } }) => ({
    _filledTrack: {
      bg: theme.blue,
    },
    bg: theme.secondary,
  })
)<{ strength: number }>``;
