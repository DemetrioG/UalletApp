import { Dimensions } from "react-native";

const { width, height } = Dimensions.get("window");

const metrics = {
  baseMargin: 15,
  smallMargin: 10,
  doubleBaseMargin: 30,
  screenWidth: width < height ? width : height,
  screenHeight: width < height ? height : width,
  largeRadius: 30,
  baseRadius: 10,
  mediumRadius: 8,
  smallRadius: 6,
  smallestRadius: 4,
  basePadding: 15,
  topBottomPadding: 20,
  iconSize: 23,
};

export default metrics;
