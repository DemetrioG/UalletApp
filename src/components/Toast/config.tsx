import { BaseToast } from "react-native-toast-message";
import { useTheme } from "styled-components";
import { colors } from "../../styles";
import { IThemeProvider } from "../../styles/baseTheme";
import { CheckIcon, XIcon } from "lucide-react-native";

export const toastConfig = {
  success: (props: any) => {
    const { theme }: IThemeProvider = useTheme();
    return (
      <BaseToast
        text1Style={{
          color: theme?.isOnDarkTheme ? "black" : "white",
          fontSize: 14,
          marginTop: 3,
        }}
        style={{
          backgroundColor: theme?.isOnDarkTheme
            ? colors.lightPrimary
            : colors.darkPrimary,
          borderLeftColor: theme?.blue,
        }}
        renderLeadingIcon={() => (
          <CheckIcon
            name="check"
            color={theme?.blue}
            style={{
              top: 0,
              bottom: 0,
              marginTop: "auto",
              marginBottom: "auto",
              left: 10,
            }}
          />
        )}
        {...props}
      />
    );
  },

  error: (props: any) => {
    const { theme }: IThemeProvider = useTheme();
    return (
      <BaseToast
        text1Style={{
          color: theme?.isOnDarkTheme ? "black" : "white",
          fontSize: 14,
          marginTop: 3,
        }}
        style={{
          backgroundColor: theme?.isOnDarkTheme
            ? colors.lightPrimary
            : colors.darkPrimary,
          borderLeftColor: theme?.red,
        }}
        renderLeadingIcon={() => (
          <XIcon
            name="x"
            color={colors.strongRed}
            style={{
              top: 0,
              bottom: 0,
              marginTop: "auto",
              marginBottom: "auto",
              left: 10,
            }}
          />
        )}
        {...props}
      />
    );
  },
};
