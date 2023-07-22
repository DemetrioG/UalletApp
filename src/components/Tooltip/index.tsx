import * as React from "react";
import { TouchableOpacity } from "react-native";
import { Tooltip as NativeTooltip, useDisclose } from "native-base";

const Tooltip = ({
  label,
  children,
}: {
  label: string;
  children: JSX.Element;
}) => {
  const { isOpen, onToggle } = useDisclose();

  return (
    <NativeTooltip label={label} isOpen={isOpen} maxW="85%">
      <TouchableOpacity onPress={onToggle}>{children}</TouchableOpacity>
    </NativeTooltip>
  );
};

export default Tooltip;
