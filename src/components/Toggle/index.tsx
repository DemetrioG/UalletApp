import { HStack, Text } from "native-base";
import { useTheme } from "styled-components";
import { IThemeProvider } from "../../styles/baseTheme";
import { useState } from "react";
import { ToggleProps } from "./types";
import { Pressable } from "react-native";
import { Animated } from "react-native";

export const Toggle = (props: ToggleProps) => {
  const { theme }: IThemeProvider = useTheme();
  const [active, setActive] = useState(1);
  const [animation] = useState(new Animated.Value(0));

  const handlePress = () => {
    const newValue = active === 1 ? 2 : 1;
    setActive(newValue);
    props.onToggle && props.onToggle(newValue);
    Animated.timing(animation, {
      toValue: newValue === 1 ? 0 : 1,
      duration: 300,
      useNativeDriver: true,
    }).start();
  };

  return (
    <Pressable onPress={handlePress} style={{ position: "relative" }}>
      <HStack
        borderRadius="10px"
        backgroundColor={theme?.primary}
        paddingX="6px"
        paddingY="7px"
        justifyContent="center"
        alignItems="center"
        position="relative"
        width="150px"
      >
        <HStack alignItems="center" space={5}>
          <Text fontSize="11px">{props.labels.firstLabel}</Text>
          <Text fontSize="11px">{props.labels.secondLabel}</Text>
        </HStack>
      </HStack>
      <Animated.View
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          borderRadius: 10,
          backgroundColor: theme?.blue,
          padding: 6,
          position: "absolute",
          top: 0,
          width: 75,
          transform: [
            {
              translateX: animation.interpolate({
                inputRange: [0, 1],
                outputRange: [0, 75],
              }),
            },
          ],
        }}
      >
        <Text fontSize="12px">
          {active === 1 ? props.labels.firstLabel : props.labels.secondLabel}
        </Text>
      </Animated.View>
    </Pressable>
  );
};
