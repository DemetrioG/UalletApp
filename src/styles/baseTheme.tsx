import * as React from "react";
import { ThemeProvider } from "styled-components";
import { NativeBaseProvider, extendTheme } from "native-base";
import { colors, metrics } from ".";
import { ThemeContext } from "../context/Theme/themeContext";
import { DARK, LIGHT } from "./theme";

export interface IThemeProvider {
  theme?: typeof LIGHT;
}

const BaseProvider = ({ children }: { children: React.ReactNode }) => {
  const { theme: themeContext } = React.useContext(ThemeContext);

  const theme = themeContext.mode === "dark" ? DARK : LIGHT;

  const baseTheme = extendTheme({
    fonts: {
      heading: "Raleway",
      body: "Raleway",
      mono: "Montserrat",
    },
    fontConfig: {
      Raleway: {
        500: {
          normal: "Raleway_500Medium",
        },
        700: {
          normal: "Raleway_700Bold",
        },
        800: {
          normal: "Raleway_800ExtraBold",
        },
      },
      Montserrat: {
        500: {
          normal: "Montserrat_500Medium",
        },
        700: {
          normal: "Montserrat_700Bold",
        },
        800: {
          normal: "Montserrat_800ExtraBold",
        },
      },
    },
    components: {
      Button: {
        baseStyle: {
          rounded: "md",
        },
        defaultProps: {
          minW: "56",
          minH: "10",
          shadow: "4",
          colorScheme: "blue",
          marginBottom: metrics.baseMargin,
        },
      },
      Text: {
        defaultProps: {
          fontFamily: "body",
          fontWeight: 500,
          color: theme.text,
        },
      },
      Input: {
        defaultProps: {
          _focus: {
            backgroundColor: "transparent",
            borderColor: colors.strongBlue,
          },
          selectionColor: colors.lightBlue,
          color: colors.white,
          borderColor: colors.gray,
          fontFamily: "body",
          fontWeight: 700,
          borderRadius: "md",
          minH: "10",
          width: "full",
        },
      },
      Skeleton: {
        defaultProps: {
          rounded: "md",
        },
      },
      Menu: {
        defaultProps: {
          backgroundColor: colors.infoBlack,
        },
      },
    },
  });
  return (
    <NativeBaseProvider theme={baseTheme}>
      <ThemeProvider theme={{ theme: theme }}>{children}</ThemeProvider>
    </NativeBaseProvider>
  );
};

export default BaseProvider;
