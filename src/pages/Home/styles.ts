import React from "react";
import {
  Image,
  StyleSheet,
  Text,
  TextProps,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
} from "react-native";
import styled from "styled-components";
import { colors, fonts, metrics } from "../../styles";

export const PieChartLabel = styled(Text)`
  font-family: ${fonts.montserratMedium};
  font-size: ${fonts.medium};
  color: ${colors.white};
`;

export const CardHeaderView = styled(View)`
  flex-direction: row;
  align-items: center;
  justify-content: space-between;
  margin-bottom: ${metrics.baseMargin / 2}px;
`;

export const CardHeaderText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.medium}px;
  color: ${({ theme }) => theme.theme.text};
`;

export const CardTextView = styled(View)`
  flex-direction: row;
  align-items: center;
`;

export const IconContainer: React.FC<
  TouchableOpacityProps & { marginTop?: number }
> = styled(TouchableOpacity)`
  margin-left: ${metrics.baseMargin}px;
  margin-top: ${({ marginTop }) => (marginTop ? marginTop : 0)}px;
`;

export const LogoCard = styled(Image)`
  width: 20px;
  height: 25px;
`;

export const Balance = styled(Text)`
  font-family: ${fonts.montserratBold};
  font-size: ${fonts.larger}px;
  color: ${({ theme }) => theme.theme.blue};
`;

export const CardStatusView = styled(View)`
  margin-bottom: ${metrics.baseMargin}px;
`;

export const StatusText: React.FC<TextProps & { bold?: boolean }> = styled(
  Text
)`
  font-family: ${({ bold }) =>
    bold === true ? fonts.ralewayExtraBold : fonts.ralewayBold};
  font-size: ${fonts.medium}px;
  color: ${({ theme }) => theme.theme.text};
`;

const styles = (theme?) =>
  StyleSheet.create({
    headerView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: metrics.baseMargin,
      paddingLeft: metrics.basePadding,
    },
    headerText: {
      fontFamily: fonts.ralewayMedium,
      fontSize: fonts.medium,
      color: theme == "light" ? colors.darkPrimary : colors.white,
    },
    headerIconView: {
      flexDirection: "row",
    },
    spaceIcon: {
      marginLeft: metrics.baseMargin,
    },
    cardTextView: {
      flexDirection: "row",
      alignItems: "center",
    },
    cardHeaderText: {
      fontFamily: fonts.ralewayMedium,
      fontSize: fonts.large,
      color: theme == "light" ? colors.darkPrimary : colors.white,
    },
    cardHeaderView: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: metrics.baseMargin / 2,
    },
    logoCard: {
      width: 20,
      height: 25,
    },
    balance: {
      fontFamily: fonts.montserratBold,
      fontSize: fonts.larger,
      color: theme == "light" ? colors.strongBlue : colors.lightBlue,
    },
    cardStatusView: {
      marginBottom: metrics.baseMargin,
    },
    statusBoldText: {
      fontFamily: fonts.ralewayBold,
      fontSize: fonts.medium,
      color: theme == "light" ? colors.darkPrimary : colors.white,
    },
    statusText: {
      fontFamily: fonts.ralewayMedium,
      fontSize: fonts.medium,
      color: theme == "light" ? colors.darkPrimary : colors.white,
    },
    invest: {
      fontFamily: fonts.montserratBold,
      fontSize: fonts.larger,
      color: theme == "light" ? colors.strongPurple : colors.yellow,
      marginBottom: metrics.baseMargin,
    },
    cardFooterText: {
      fontFamily: fonts.ralewayMedium,
      fontSize: fonts.regular,
      color: theme == "light" ? colors.darkPrimary : colors.white,
      marginRight: metrics.baseMargin / 2,
    },
    incomeChartView: {
      padding: metrics.basePadding + 3,
      backgroundColor:
        theme == "light" ? colors.lightPrimary : colors.darkPrimary,
      borderRadius: metrics.baseRadius,
      width: "45%",
    },
    incomeChartLabelView: {
      marginTop: 5,
      flexDirection: "row",
      justifyContent: "space-between",
      backgroundColor:
        theme == "light" ? colors.lightPrimary : colors.darkPrimary,
    },
    incomeChartLabelText: {
      fontFamily: fonts.ralewayMedium,
      fontSize: fonts.regular,
      color: theme == "light" ? colors.darkPrimary : colors.white,
    },
    incomeView: {
      flex: 1,
      paddingVertical: metrics.basePadding * 1.5,
      marginLeft: metrics.baseMargin,
      flexDirection: "column",
      justifyContent: "space-between",
      alignItems: "flex-start",
    },
    incomeText: {
      fontFamily: fonts.ralewayMedium,
      fontSize: fonts.regular,
      color: theme == "light" ? colors.darkPrimary : colors.white,
      marginRight: metrics.baseMargin / 2,
    },
    segmentChartView: {
      width: "50%",
    },
    labelPieChart: {
      fontFamily: fonts.montserratMedium,
      fontSize: fonts.medium,
      color: colors.white,
    },
    segmentLabelView: {
      width: "50%",
      alignItems: "flex-start",
      justifyContent: "center",
    },
    dotView: {
      width: 10,
      height: 10,
      borderRadius: 100,
      marginTop: 2,
      marginRight: metrics.baseMargin / 2,
    },
    segmentLabelText: {
      fontFamily: fonts.ralewayMedium,
      fontSize: fonts.regular,
      color: theme == "light" ? colors.darkPrimary : colors.white,
    },
    contentLabel: {
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 3,
      marginLeft: metrics.baseMargin,
    },
  });

export default styles;
