import * as React from "react";
import { NativeBaseProvider, extendTheme } from "native-base";
import metrics from "./metrics";

export default function BaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const theme = extendTheme({
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
        // Can simply pass default props to change default behaviour of components.
        baseStyle: {
          rounded: "md",
        },
        defaultProps: {
          minW: "56",
          height: "10",
          shadow: "4",
          colorScheme: "blue",
          marginBottom: metrics.baseMargin,
        },
      },
      Text: {
        defaultProps: {
          fontFamily: "body",
          fontWeight: 500,
        },
      },
    },
  });
  return <NativeBaseProvider theme={theme}>{children}</NativeBaseProvider>;
}
