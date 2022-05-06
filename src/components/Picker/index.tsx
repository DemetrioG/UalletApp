import * as React from "react";
import {
  Modal,
  ScrollView,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";

import { colors } from "../../styles";
import { StyledIcon } from "../../styles/generalStyled";
import {
  ContentView,
  ItemPicker,
  ItemText,
  ModalContainer,
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

export default function Picker({
  options,
  selectedValue,
  value,
  type,
  visibility,
  setVisibility,
}: IPicker) {
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
        <StyledIcon name="chevron-right" size={20} />
      </ItemPicker>
    );
  });

  return (
    <StyledInput>
      <SpaceItems onPress={() => setVisibility(true)}>
        <PickerText value={value} type={type}>
          {value}
        </PickerText>
        <StyledIcon name="chevron-down" size={20} color={colors.lightGray} />
      </SpaceItems>
      <Modal
        transparent={true}
        animationType="fade"
        visible={visibility}
        onRequestClose={() => setVisibility(false)}
      >
        <TouchableWithoutFeedback onPress={() => setVisibility(false)}>
          <ModalContainer>
            <ContentView>
              <Title>{type}</Title>
              <ScrollView>{option}</ScrollView>
            </ContentView>
          </ModalContainer>
        </TouchableWithoutFeedback>
      </Modal>
    </StyledInput>
  );
}
