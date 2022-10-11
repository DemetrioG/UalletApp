import * as React from "react";
import { Text } from "./styles";
import { TouchableOpacity } from "react-native";
import NativeTooltip from "react-native-walkthrough-tooltip";
import { colors, metrics } from "../../styles";
import { useTheme } from "styled-components";
import { IThemeProvider } from "../../styles/baseTheme";

const Tooltip = ({
  text,
  children,
}: {
  text: string;
  children: JSX.Element;
}) => {
  const [open, setOpen] = React.useState(false);

  const { theme }: IThemeProvider = useTheme();

  return (
    <NativeTooltip
      isVisible={open}
      content={<Text>{text}</Text>}
      onClose={() => setOpen(false)}
      backgroundColor="transparent"
      disableShadow
      placement="bottom"
      tooltipStyle={{
        marginLeft: 7,
      }}
      contentStyle={{
        backgroundColor: theme?.isOnDarkTheme
          ? colors.transpLight
          : colors.transpDark,
        borderRadius: metrics.smallRadius,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <TouchableOpacity onPress={() => setOpen(!open)}>
        {children}
      </TouchableOpacity>
    </NativeTooltip>
  );
};

export default Tooltip;
