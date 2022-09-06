import * as React from "react";
import { TouchableOpacity } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { NativeStackNavigationProp } from "@react-navigation/native-stack";

import { DefaultText, HelperText } from "./styles";
import { ContainerCenter } from "../../styles/general";
import Icon from "../Icon";
import { colors } from "../../styles";

interface IEmptyChart {
  emphasisText: string;
  iconName: string;
  helperText: string;
}

const EmpyChart = ({ emphasisText, iconName, helperText }: IEmptyChart) => {
  const { navigate } = useNavigation<NativeStackNavigationProp<any>>();

  return (
    <ContainerCenter>
      <Icon name={iconName} color={colors.gray} />
      <DefaultText>{emphasisText}</DefaultText>
      <TouchableOpacity onPress={() => navigate("Lancamentos")}>
        <HelperText>{helperText}</HelperText>
      </TouchableOpacity>
    </ContainerCenter>
  );
};

export default EmpyChart;
