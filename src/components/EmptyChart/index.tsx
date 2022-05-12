import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";
import * as React from "react";
import { TouchableOpacity, View } from "react-native";
import { StyledIcon } from "../../styles/general";
import { ContainerCenter, EmphasisText, HelperText } from "./styles";

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
      <StyledIcon name={iconName} />
      <EmphasisText>{emphasisText}</EmphasisText>
      <TouchableOpacity onPress={() => navigate("LançamentosTab")}>
        <HelperText>{helperText}</HelperText>
      </TouchableOpacity>
    </ContainerCenter>
  );
}
