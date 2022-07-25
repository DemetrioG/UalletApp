import * as React from "react";
import {
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { colors } from "../../styles";
import { ModalContainer, ModalView } from "../../styles/general";
import Icon from "../Icon";
import {
  ItemPicker,
  ItemText,
  PickerText,
  SpaceItems,
  StyledInput,
  Title,
} from "./styles";

interface IPicker {
  options: string[];
  selectedValue: Function;
  value: string;
  type: string;
  visibility: boolean | undefined;
  setVisibility: Function;
}

const Picker = ({
  options,
  selectedValue,
  value,
  type,
  visibility,
  setVisibility,
}: IPicker) => {
  const OPTIONS = options;

  const onPressItem = (option: string) => {
    setVisibility(false);
    selectedValue(option);
    Keyboard.dismiss();
  };

  const option = OPTIONS.map((item, index) => {
    return (
      <ItemPicker key={index} onPress={() => onPressItem(item)}>
        <ItemText>{item}</ItemText>
        <Icon name="chevron-right" size={20} />
      </ItemPicker>
    );
  });

  return (
    <StyledInput>
      <SpaceItems onPress={() => setVisibility(true)}>
        <PickerText value={value} type={type}>
          {value}
        </PickerText>
        <Icon name="chevron-down" size={20} color={colors.gray} />
      </SpaceItems>
      <Modal
        transparent={true}
        animationType="fade"
        visible={visibility}
        onRequestClose={() => setVisibility(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisibility(false)}>
          <ModalContainer>
            <ModalView>
              <Title>{type}</Title>
              <ScrollView>{option}</ScrollView>
            </ModalView>
          </ModalContainer>
        </TouchableWithoutFeedback>
      </Modal>
    </StyledInput>
  );
};

export default Picker;
