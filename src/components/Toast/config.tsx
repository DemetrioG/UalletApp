import { BaseToast } from "react-native-toast-message";
import styled, { useTheme } from "styled-components";
import { colors } from "../../styles";
import DefaultIcon from "../Icon";
import { IThemeProvider } from "../../styles/baseTheme";

const Icon = styled(DefaultIcon)`
  top: 0;
  bottom: 0;
  left: 10px;
  margin-top: auto;
  margin-bottom: auto;
`;

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
        renderLeadingIcon={() => <Icon name="check" color={theme?.blue} />}
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
        renderLeadingIcon={() => <Icon name="x" color={colors.strongRed} />}
        {...props}
      />
    );
  },
};
