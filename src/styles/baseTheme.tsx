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
      heading: "Montserrat",
      body: "Montserrat",
      mono: "Montserrat",
    },
    fontConfig: {
      Montserrat: {
        400: {
          normal: "Montserrat-Regular",
        },
        500: {
          normal: "Montserrat-Medium",
        },
        600: {
          normal: "Montserrat-SemiBold",
        },
        700: {
          normal: "Montserrat-Bold",
        },
        800: {
          normal: "Montserrat-ExtraBold",
        },
      },
    },
    components: {
      Button: {
        defaultProps: {
          minW: "56",
          minH: "12",
          borderRadius: "13",
          marginBottom: metrics.baseMargin,
          width: "full",
        },
        variants: {
          solid: {
            bgColor: theme.blue,
          },
          outline: {
            bgColor: "transparent",
            borderColor: theme.blue,
          },
        },
      },
      Text: {
        defaultProps: {
          fontFamily: "body",
          fontWeight: 400,
          fontSize: 16,
          color: theme.text,
        },
      },
      Input: {
        defaultProps: {
          _focus: {
            borderColor: colors.strongBlue,
          },
          placeholderTextColor: theme.text,
          selectionColor: colors.lightBlue,
          color: theme.text,
          borderColor: "transparent",
          fontFamily: "body",
          fontWeight: 400,
          fontSize: 14,
          borderRadius: "13",
          minH: "12",
          width: "full",
        },
        variants: {
          outline: {
            backgroundColor: theme.secondary,
          },
          filled: {
            backgroundColor: theme.primary,
          },
        },
      },
      Select: {
        baseStyle: {
          placeholderTextColor: theme.text,
          selectionColor: colors.lightBlue,
          color: theme.text,
          borderColor: "transparent",
          fontFamily: "body",
          fontWeight: 400,
          fontSize: 14,
          borderRadius: "13",
          minH: "12",
          width: "full",
        },
        defaultProps: {
          variants: {
            outline: {
              backgroundColor: theme.secondary,
            },
            filled: {
              backgroundColor: theme.primary,
            },
          },
        },
      },
      Switch: {
        baseStyle: {
          trackColor: {
            true: theme?.blue,
            false: theme?.blue,
          },
          offTrackColor: theme?.secondary,
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
