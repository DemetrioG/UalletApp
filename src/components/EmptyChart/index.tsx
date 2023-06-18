import * as React from "react";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { Button, Text } from "native-base";

const EmpyChart = ({ actionText }: { actionText: string }) => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <>
      <Button onPress={() => navigate("Lancamentos")} width="100%" mt={5}>
        <Text fontWeight={600}>{actionText}</Text>
      </Button>
    </>
  );
};

export default EmpyChart;
