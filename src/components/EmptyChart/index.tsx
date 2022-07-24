import * as React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { DefaultText, HelperText } from "./styles";
import { ContainerCenter } from "../../styles/general";
import Icon from "../Icon";

interface IEmptyChart {
  emphasisText: string;
  iconName: string;
  helperText: string;
}

export default function EmpyChart({
  emphasisText,
  iconName,
  helperText,
}: IEmptyChart) {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <ContainerCenter>
      <Icon name={iconName} />
      <DefaultText>{emphasisText}</DefaultText>
      <TouchableOpacity onPress={() => navigate("LançamentosTab")}>
        <HelperText>{helperText}</HelperText>
      </TouchableOpacity>
    </ContainerCenter>
  );
}
