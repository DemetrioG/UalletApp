import * as React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Button, Text } from "native-base";

export const EmptyChart = ({
  actionText,
  route,
}: {
  actionText: string;
  route: string;
}) => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <Button onPress={() => navigate(route)} width="100%" mt={5}>
      <Text fontWeight={600} color="white">
        {actionText}
      </Text>
    </Button>
  );
};
