import React from "react";
import { Animated, StyleSheet, Text, TextProps, View } from "react-native";
import styled from "styled-components";
import { colors, fonts, metrics } from "../../styles";

export const ItemView = styled(View)`
  flex-direction: row;
`;

export const DescriptionView = styled(View)`
  width: 50%;
  align-items: center;
  justify-content: center;
  border-right-width: 1px;
  border-right-color: ${colors.lightPrimary};
  padding: ${metrics.basePadding / 2}px;
`;

export const DescriptionText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: ${fonts.regular};
  color: ${colors.gray};
`;

export const ValueView = styled(View)`
  width: 40%;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  padding: 0px ${metrics.basePadding / 2}px;
`;

export const ValueText: React.FC<
  TextProps & { type: "Receita" | "Despesa" }
> = styled(Text)`
  font-family: ${fonts.montserratMedium};
  font-size: ${fonts.regular}px;
  color: ${({ theme, type }) =>
    type === "Receita" ? theme.theme.green : theme.theme.red};
`;

export const MoreView = styled(View)`
  flex: 1;
  align-items: center;
  justify-content: center;
`;

export const LoadingText = styled(Text)`
  font-family: ${fonts.ralewayExtraBold};
  color: ${({ theme }) => theme.theme.blue};
`;

export const IncomeView = styled(View)`
  flex-direction: row;
  padding-bottom: ${metrics.basePadding};
  border-bottom-width: 1px;
  border-bottom-color: ${colors.lightPrimary};
`;

export const IncomeText = styled(Text)`
  font-family: ${fonts.montserratBold};
  font-size: ${fonts.medium};
  color: ${({ theme }) => theme.theme.blue};
  margin-left: ${metrics.baseMargin / 2};
`;

export const AutoEntryView = styled(View)`
  flex-direction: row;
  align-items: center;
  position: relative;
  margin-bottom: ${metrics.baseMargin};
`;

export const InfoView = styled(Animated.View)`
  padding: 5px;
  position: absolute;
  right: 5px;
  top: 45px;
  width: 130px;
  height: 40px;
  background-color: ${colors.infoBlack};
  border-radius: ${metrics.smallRadius};
`;

export const TriangleOfToolTip = styled(View)`
  position: absolute;
  width: 15px;
  height: 15px;
  top: -10px;
  right: 20px;
  border-top-width: 0px;
  border-right-width: 7px;
  border-bottom-width: 13px;
  border-left-width: 7px;
  border-top-color: transparent;
  border-right-color: transparent;
  border-bottom-color: ${colors.infoBlack};
  border-left-color: transparent;
`;

export const InfoText = styled(Text)`
  font-family: ${fonts.ralewayMedium};
  font-size: 10px;
  color: ${colors.white};
  text-align: center;
`;

const styles = (theme, type) =>
  StyleSheet.create({
    buttonHeaderView: {
      marginBottom: metrics.baseMargin,
    },
    itemView: {
      flexDirection: "row",
    },
    descriptionView: {
      width: "50%",
      alignItems: "center",
      justifyContent: "center",
      borderRightWidth: 1,
      borderRightColor: colors.lightPrimary,
      padding: metrics.basePadding / 2,
    },
    descriptionText: {
      fontFamily: fonts.ralewayMedium,
      fontSize: fonts.regular,
      color: colors.gray,
    },
    valueView: {
      width: "40%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      paddingHorizontal: metrics.basePadding / 2,
    },
    valueText: {
      fontFamily: fonts.montserratMedium,
      fontSize: fonts.regular,
      color:
        theme == "light"
          ? type == "Receita"
            ? colors.strongGreen
            : colors.strongRed
          : type == "Receita"
          ? colors.lightGreen
          : colors.lightRed,
    },
    moreView: {
      flex: 1,
      alignItems: "center",
      justifyContent: "center",
    },
    loadingText: {
      fontFamily: fonts.ralewayExtraBold,
      color: theme == "light" ? colors.strongBlue : colors.lightBlue,
    },
    iconEmpty: {
      width: 230,
    },
    iconLoading: {
      width: 50,
    },
    incomeView: {
      flexDirection: "row",
      paddingBottom: metrics.basePadding,
      borderBottomWidth: 1,
      borderBottomColor: colors.lightPrimary,
    },
    incomeText: {
      fontFamily: fonts.montserratBold,
      fontSize: fonts.medium,
      color: theme == "light" ? colors.strongBlue : colors.lightBlue,
      marginLeft: metrics.baseMargin / 2,
    },
    autoEntryView: {
      flexDirection: "row",
      alignItems: "center",
      position: "relative",
      marginBottom: metrics.baseMargin,
    },
    infoIcon: {
      marginLeft: metrics.baseMargin,
    },
    infoView: {
      padding: 5,
      position: "absolute",
      right: 5,
      top: 45,
      width: 130,
      height: 40,
      backgroundColor: colors.infoBlack,
      borderRadius: metrics.smallRadius,
    },
    infoText: {
      fontFamily: fonts.ralewayMedium,
      fontSize: 10,
      color: colors.white,
      textAlign: "center",
    },
    triangle: {
      position: "absolute",
      width: 15,
      height: 15,
      top: -10,
      right: 20,
      borderTopWidth: 0,
      borderRightWidth: 7,
      borderBottomWidth: 13,
      borderLeftWidth: 7,
      borderTopColor: "transparent",
      borderRightColor: "transparent",
      borderBottomColor: colors.infoBlack,
      borderLeftColor: "transparent",
    },
  });

export default styles;
