import * as React from "react";
import {
  GestureResponderEvent,
  StyleProp,
  TextStyle,
  TouchableOpacity,
} from "react-native";
import { StyledIcon } from "./styles";

const Icon = ({
  name,
  size,
  color,
  colorVariant,
  onPress,
  style,
}: {
  name: string;
  size?: number;
  color?: string;
  colorVariant?: string;
  onPress?: ((event: GestureResponderEvent) => void) | undefined;
  style?: StyleProp<TextStyle>;
}) => {
  return (
    <>
      {onPress ? (
        <TouchableOpacity onPress={onPress}>
          <StyledIcon
            name={name}
            size={size}
            color={color}
            colorVariant={colorVariant}
            style={style}
          />
        </TouchableOpacity>
      ) : (
        <StyledIcon
          name={name}
          size={size}
          color={color}
          colorVariant={colorVariant}
          onPress={onPress}
          style={style}
        />
      )}
    </>
  );
};

export default Icon;
