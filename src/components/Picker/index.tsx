import * as React from "react";
import {
  FormControl,
  HStack,
  Text,
  View,
  WarningOutlineIcon,
} from "native-base";
import { FieldError } from "react-hook-form";
import { Modal, ScrollView, Keyboard } from "react-native";

import { colors, fonts, metrics } from "../../styles";
import { ModalContainer, ModalView } from "@styles/general";
import Icon from "../Icon";
import {
  ItemPicker,
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
  errors: FieldError | undefined;
  helperText?: string;
}

const Picker = ({
  options,
  selectedValue,
  value,
  type,
  visibility,
  setVisibility,
  errors,
  helperText,
}: IPicker) => {
  const [isInvalid, setIsInvalid] = React.useState(false);
  const OPTIONS = options;

  const onPressItem = (option: string) => {
    setVisibility(false);
    selectedValue(option);
    Keyboard.dismiss();
  };

  const option = OPTIONS.map((item, index) => {
    return (
      <ItemPicker key={index} onPress={() => onPressItem(item)}>
        <Text fontWeight={700} fontSize={fonts.regular}>
          {item}
        </Text>
        <Icon name="chevron-right" size={20} />
      </ItemPicker>
    );
  });

  React.useEffect(() => {
    if (errors && Object.keys(errors).length > 0) {
      setIsInvalid(true);
    } else {
      setIsInvalid(false);
    }
  }, [errors]);

  return (
    <View mb={metrics.baseMargin}>
      <StyledInput isInvalid={isInvalid}>
        <SpaceItems onPress={() => setVisibility(true)}>
          <PickerText value={value} type={type}>
            {value.length > 28 ? `${value.slice(0, 28)}...` : value}
          </PickerText>
          <Icon name="chevron-down" size={20} color={colors.gray} />
        </SpaceItems>
        <Modal
          transparent={true}
          animationType="fade"
          visible={visibility}
          onRequestClose={() => setVisibility(false)}
        >
          <ModalContainer>
            <ModalView>
              <HStack
                alignItems={"center"}
                justifyContent={"space-between"}
                margin={3}
              >
                <Title>{type}</Title>
                <Icon
                  name="x"
                  size={20}
                  colorVariant="red"
                  onPress={() => setVisibility(false)}
                />
              </HStack>
              <ScrollView>{option}</ScrollView>
            </ModalView>
          </ModalContainer>
        </Modal>
      </StyledInput>
      <FormControl isInvalid={isInvalid} mt={0}>
        {helperText && (
          <FormControl.ErrorMessage leftIcon={<WarningOutlineIcon size="xs" />}>
            {helperText}
          </FormControl.ErrorMessage>
        )}
      </FormControl>
    </View>
  );
};

export default Picker;
