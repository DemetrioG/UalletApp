import { Progress } from "native-base";
import styled from "styled-components";

export const ProgressBar = styled(Progress).attrs<{ primary?: boolean }>(
  ({ primary, theme: { theme } }) => ({
    _filledTrack: {
      bg: theme.blue,
    },
    bg: primary ? theme.primary : theme.secondary,
  })
)<{ primary?: boolean }>``;
