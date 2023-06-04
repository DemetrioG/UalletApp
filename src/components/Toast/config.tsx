import { BaseToast } from "react-native-toast-message";
import styled from "styled-components";
import { colors, fonts, metrics } from "../../styles";
import DefaultIcon from "../Icon";

const Icon = styled(DefaultIcon)`
  top: 0;
  bottom: 0;
  left: 10px;
  margin-top: auto;
  margin-bottom: auto;
`;

const StyledToastSuccess = styled(BaseToast).attrs(({ theme: { theme } }) => ({
  contentContainerStyle: {
    paddingHorizontal: metrics.basePadding,
  },
  text1Style: {
    fontSize: fonts.medium,
    fontFamily: fonts.montserratBold,
    color: theme.isOnDarkTheme ? colors.darkPrimary : colors.white,
    marginTop: 3,
  },
}))`
  top: -5px;
  border-left-color: #47bf2f;
  background-color: ${({ theme: { theme } }) =>
    theme.isOnDarkTheme ? colors.lightPrimary : colors.darkSecondary};
`;

const StyledToastError = styled(StyledToastSuccess)`
  border-left-color: ${colors.strongRed};
`;

export const toastConfig = {
  success: (props: any) => (
    <StyledToastSuccess
      {...props}
      renderLeadingIcon={() => <Icon name="check" color="#47bf2f" />}
    />
  ),

  error: (props: any) => (
    <StyledToastError
      {...props}
      renderLeadingIcon={() => <Icon name="x" color={colors.strongRed} />}
    />
  ),
};
