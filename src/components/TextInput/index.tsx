import React from "react";
import { TextInput, TextInputProps, View } from "react-native";
import { Control, Controller, FieldValues } from "react-hook-form";
import { TextError } from "./styles";

const UTextInput = (
  props: TextInputProps & {
    helperText?: object;
    required?: boolean;
  }
) => {
  return (
    <>
      <TextInput {...props} />
      {props.helperText
        ? Object.keys(props.helperText).length > 0 && (
            <View>
              <TextError>Informe todos os campos</TextError>
            </View>
          )
        : null}
    </>
  );
};

export const DefaultTextInput = ({
  name,
  control,
  ...props
}: React.ComponentProps<typeof UTextInput> & {
  name: string;
  control: Control<FieldValues | any>;
}) => {
  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, onBlur, value } }) => (
        <UTextInput
          onChangeText={onChange}
          onBlur={onBlur}
          value={value}
          {...props}
        />
      )}
    />
  );
};
