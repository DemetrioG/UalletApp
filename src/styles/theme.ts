/**
 * Color pallete definition for themes
 */

export const LIGHT = {
  isOnDarkTheme: false,
  primary: "#F9F8F8",
  secondary: "#E3DEDE",
  tertiary: "#C3C5C7",
  text: "#252333",
  blue: "#266DD3",
  red: "#FF2F45",
  green: "#70AE6E",
  transparency: "rgba(227, 222, 222, 0.95)",
  statusBar: "dark-content",
  yellow: "#FFB100",
  colorPieChart: ["#252333", "#8F47AD", "#AA6EC4", "#FF2F45", "#FF4C5F"],
  randomPalette: ['#2C363F', '#E758AC', '#5E3023', '#30321C', '#4C4C9D', '#712F79', '#1D8A99', '#FAFF00', '#DE6E4B', '#820263'],
  randomColor: '#266DD3'
};

export const DARK = {
  isOnDarkTheme: true,
  primary: "#252333",
  secondary: "#312F42",
  tertiary: "#454351",
  text: "#FFFFFF",
  blue: "#6499E3",
  red: "#FF4C5F",
  green: "#98BC71",
  transparency: "rgba(49, 47, 66, 0.95)",
  statusBar: "light-content",
  yellow: "#FFFD82",
  colorPieChart: ["#252333", "#FF2F45", "#FF4C5F", "#6499E3", "#98BBEC"],
  randomPalette: ['#DB5461', '#8AA29E', '#F1EDEE', '#88D498', '#C6DABF', '#7D83FF', '#007FFF', '#F5CB5C', '#30BCED', '#9B9B93'],
  randomColor: '#266DD3'
};

LIGHT['randomColor'] =  LIGHT['randomPalette'][Math.floor(Math.random() * LIGHT.randomPalette.length)]

DARK['randomColor'] =  DARK['randomPalette'][Math.floor(Math.random() * DARK.randomPalette.length)]