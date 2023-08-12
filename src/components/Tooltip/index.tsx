import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Popover, Text, VStack, useDisclose } from "native-base";

const Tooltip = ({
  label,
  children,
}: {
  label: string;
  children: JSX.Element;
}) => {
  return (
    <Popover
      trigger={(props) => (
        <TouchableOpacity {...props}>{children}</TouchableOpacity>
      )}
    >
      <Popover.Content borderWidth={0} borderRadius={10}>
        <VStack maxW="330px" backgroundColor="rgba(0, 0, 0, 0.9)" p={2}>
          <Text fontSize="14px">{label}</Text>
        </VStack>
      </Popover.Content>
    </Popover>
  );
};

export default Tooltip;
