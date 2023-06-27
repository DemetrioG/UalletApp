import { useTheme } from "styled-components";
import { IThemeProvider } from "../../styles/baseTheme";
import { Path, Svg } from "react-native-svg";

export const CardDownIcon = () => {
  const { theme }: IThemeProvider = useTheme();
  return (
    <Svg width="32" height="24" viewBox="0 0 32 24" fill="none">
      <Path
        d="M20 5H4C2.89543 5 2 5.89543 2 7V17C2 18.1046 2.89543 19 4 19H20C21.1046 19 22 18.1046 22 17V7C22 5.89543 21.1046 5 20 5Z"
        stroke={theme?.text}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2 10H22"
        stroke={theme?.text}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M26 12.5V19.5"
        stroke={theme?.text}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M29.5 16L26 19.5L22.5 16"
        stroke={theme?.text}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};

export const CardUpIcon = () => {
  const { theme }: IThemeProvider = useTheme();
  return (
    <Svg width="32" height="24" viewBox="0 0 32 24" fill="none">
      <Path
        d="M20.0007 5H4.00073C2.89616 5 2.00073 5.89543 2.00073 7V17C2.00073 18.1046 2.89616 19 4.00073 19H20.0007C21.1053 19 22.0007 18.1046 22.0007 17V7C22.0007 5.89543 21.1053 5 20.0007 5Z"
        stroke={theme?.text}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M2.00073 10H22.0007"
        stroke={theme?.text}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M26.0007 19.5V12.5"
        stroke={theme?.text}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M29.5007 16L26.0007 12.5L22.5007 16"
        stroke={theme?.text}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
};
